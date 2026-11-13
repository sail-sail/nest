import type {
  Redis,
  RedisConnectOptions,
} from "redis";

import {
  getEnv,
} from "/lib/env.ts";

import type {
  AuthModel,
} from "/lib/auth/auth.constants.ts";

export interface OAuthClientRegistrationInput {
  redirect_uris: string[];
  token_endpoint_auth_method?: string;
  grant_types?: string[];
  response_types?: string[];
  client_name?: string;
  scope?: string;
  client_uri?: string;
  logo_uri?: string;
  contacts?: string[];
  tos_uri?: string;
  policy_uri?: string;
  software_id?: string;
  software_version?: string;
}

export interface RegisteredOAuthClient extends OAuthClientRegistrationInput {
  client_id: string;
  client_id_issued_at: number;
}

export interface StoredAuthorizationCode {
  code: string;
  clientId: string;
  redirectUri: string;
  codeChallenge: string;
  scopes: string[];
  resource: string;
  authModel: AuthModel;
  expiresAt: number;
}

export interface StoredOAuthSession {
  id: string;
  clientId: string;
  scopes: string[];
  resource: string;
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: number;
  refreshExpiresAt: number;
  authModel: AuthModel;
  createdAt: string;
  updatedAt: string;
}

interface StoreConfig {
  mode: "memory" | "redis";
  accessTokenTtlSeconds: number;
  refreshTokenTtlSeconds: number;
  authorizationCodeTtlSeconds: number;
}

const ACCESS_TOKEN_PREFIX = "mcp_at_";
const REFRESH_TOKEN_PREFIX = "mcp_rt_";
const AUTHORIZATION_CODE_PREFIX = "mcp_code_";
const DEFAULT_MCP_ACCESS_TOKEN_TTL_SECONDS = 10 * 365 * 24 * 60 * 60;
const MEMORY_AUTHORIZATION_CODE_SWEEP_INTERVAL_MS = 60 * 1000;
const MEMORY_SESSION_SWEEP_INTERVAL_MS = 5 * 60 * 1000;

export class McpOAuthStore {
  private readonly clientsById = new Map<string, RegisteredOAuthClient>();
  private readonly authorizationCodes = new Map<string, StoredAuthorizationCode>();
  private readonly sessionsById = new Map<string, StoredOAuthSession>();
  private readonly sessionsByAccessToken = new Map<string, StoredOAuthSession>();
  private readonly sessionsByRefreshToken = new Map<string, StoredOAuthSession>();
  private nextAuthorizationCodeSweepAt = 0;
  private nextSessionSweepAt = 0;

  private configPromise?: Promise<StoreConfig>;
  private redisPromise?: Promise<Redis | undefined>;

  async registerClient(
    input: OAuthClientRegistrationInput,
  ) {
    const now = Math.floor(Date.now() / 1000);
    const client: RegisteredOAuthClient = {
      ...input,
      client_id: crypto.randomUUID(),
      client_id_issued_at: now,
      token_endpoint_auth_method: input.token_endpoint_auth_method || "none",
      grant_types: input.grant_types && input.grant_types.length > 0
        ? [ ...input.grant_types ]
        : [ "authorization_code", "refresh_token" ],
      response_types: input.response_types && input.response_types.length > 0
        ? [ ...input.response_types ]
        : [ "code" ],
    };

    const redis = await this.getRedisClient();
    if (redis) {
      await this.setJson(
        redis,
        this.clientKey(client.client_id),
        client,
      );
      return client;
    }

    this.clientsById.set(client.client_id, client);
    return client;
  }

  async getClient(
    clientId: string,
  ) {
    const redis = await this.getRedisClient();
    if (redis) {
      return await this.getJson<RegisteredOAuthClient>(
        redis,
        this.clientKey(clientId),
      );
    }
    return this.clientsById.get(clientId);
  }

  /**
   * 惰性登记: client_id 未注册时, 沿用客户端带来的 client_id 立即补登记。
   *
   * MCP 场景下 client 都是公共客户端(token_endpoint_auth_method=none),
   * 安全边界由 PKCE 提供, 而不是由"服务端预先认识这个 client_id"提供。
   * 因此允许客户端自选 client_id, 服务端无需预先有状态,
   * 这样即便注册记录被清理(内存重启 / redis 清库)也不会让连接永久死锁。
   */
  async ensureClient(
    clientId: string,
    input: OAuthClientRegistrationInput,
  ) {
    const existingClient = await this.getClient(clientId);
    if (existingClient) {
      return existingClient;
    }
    const now = Math.floor(Date.now() / 1000);
    const client: RegisteredOAuthClient = {
      ...input,
      client_id: clientId,
      client_id_issued_at: now,
      token_endpoint_auth_method: "none",
      grant_types: [ "authorization_code", "refresh_token" ],
      response_types: [ "code" ],
    };

    const redis = await this.getRedisClient();
    if (redis) {
      await this.setJson(
        redis,
        this.clientKey(client.client_id),
        client,
      );
      return client;
    }

    this.clientsById.set(client.client_id, client);
    return client;
  }

  async issueAuthorizationCode(
    input: Omit<StoredAuthorizationCode, "code" | "expiresAt">,
  ) {
    const config = await this.getConfig();
    const expiresAt = Date.now() + (config.authorizationCodeTtlSeconds * 1000);
    const record: StoredAuthorizationCode = {
      ...input,
      code: this.issueToken(AUTHORIZATION_CODE_PREFIX),
      authModel: sanitizeAuthModel(input.authModel),
      expiresAt,
    };

    const redis = await this.getRedisClient();
    if (redis) {
      await this.setJson(
        redis,
        this.authorizationCodeKey(record.code),
        record,
        config.authorizationCodeTtlSeconds,
      );
      return record.code;
    }

    this.sweepExpiredAuthorizationCodesIfDue();
    this.authorizationCodes.set(record.code, record);
    return record.code;
  }

  async consumeAuthorizationCode(
    code: string,
  ) {
    const redis = await this.getRedisClient();
    if (redis) {
      const record = await this.getJson<StoredAuthorizationCode>(
        redis,
        this.authorizationCodeKey(code),
      );
      if (!record) {
        return undefined;
      }
      await this.del(redis, this.authorizationCodeKey(code));
      if (record.expiresAt <= Date.now()) {
        return undefined;
      }
      return record;
    }

    const record = this.authorizationCodes.get(code);
    if (!record) {
      return undefined;
    }
    this.authorizationCodes.delete(code);
    if (record.expiresAt <= Date.now()) {
      return undefined;
    }
    return record;
  }

  async createSession(
    input: Pick<StoredOAuthSession, "clientId" | "scopes" | "resource" | "authModel">,
  ) {
    const config = await this.getConfig();
    const now = Date.now();
    const session: StoredOAuthSession = {
      id: crypto.randomUUID(),
      clientId: input.clientId,
      scopes: [ ...input.scopes ],
      resource: input.resource,
      accessToken: this.issueToken(ACCESS_TOKEN_PREFIX),
      refreshToken: this.issueToken(REFRESH_TOKEN_PREFIX),
      accessExpiresAt: now + (config.accessTokenTtlSeconds * 1000),
      refreshExpiresAt: now + (config.refreshTokenTtlSeconds * 1000),
      authModel: sanitizeAuthModel(input.authModel),
      createdAt: new Date(now).toISOString(),
      updatedAt: new Date(now).toISOString(),
    };
    await this.persistSession(session);
    return session;
  }

  async getSessionById(
    sessionId: string,
  ) {
    const redis = await this.getRedisClient();
    if (redis) {
      const session = await this.getJson<StoredOAuthSession>(
        redis,
        this.sessionKey(sessionId),
      );
      return await this.normalizeSession(redis, session);
    }
    const session = this.sessionsById.get(sessionId);
    return await this.normalizeSession(undefined, session);
  }

  async findSessionByAccessToken(
    accessToken: string,
  ) {
    const redis = await this.getRedisClient();
    if (redis) {
      const sessionId = await this.getString(
        redis,
        this.accessTokenKey(accessToken),
      );
      if (!sessionId) {
        return undefined;
      }
      const session = await this.getJson<StoredOAuthSession>(
        redis,
        this.sessionKey(sessionId),
      );
      const nextSession = await this.normalizeSession(redis, session);
      if (!nextSession || nextSession.accessToken !== accessToken) {
        await this.del(redis, this.accessTokenKey(accessToken));
        return undefined;
      }
      if (nextSession.accessExpiresAt <= Date.now()) {
        await this.del(redis, this.accessTokenKey(accessToken));
        return undefined;
      }
      return nextSession;
    }

    const session = this.sessionsByAccessToken.get(accessToken);
    if (!session) {
      return undefined;
    }
    const nextSession = await this.normalizeSession(undefined, session);
    if (!nextSession) {
      this.sessionsByAccessToken.delete(accessToken);
      return undefined;
    }
    if (nextSession.accessExpiresAt <= Date.now()) {
      this.sessionsByAccessToken.delete(accessToken);
      return undefined;
    }
    return nextSession;
  }

  async findSessionByRefreshToken(
    refreshToken: string,
  ) {
    const redis = await this.getRedisClient();
    if (redis) {
      const sessionId = await this.getString(
        redis,
        this.refreshTokenKey(refreshToken),
      );
      if (!sessionId) {
        return undefined;
      }
      const session = await this.getJson<StoredOAuthSession>(
        redis,
        this.sessionKey(sessionId),
      );
      const nextSession = await this.normalizeSession(redis, session);
      if (!nextSession || nextSession.refreshToken !== refreshToken) {
        await this.del(redis, this.refreshTokenKey(refreshToken));
        return undefined;
      }
      return nextSession;
    }

    const session = this.sessionsByRefreshToken.get(refreshToken);
    if (!session) {
      return undefined;
    }
    const nextSession = await this.normalizeSession(undefined, session);
    if (!nextSession) {
      this.sessionsByRefreshToken.delete(refreshToken);
      return undefined;
    }
    return nextSession;
  }

  async rotateTokens(
    session: StoredOAuthSession,
  ) {
    const config = await this.getConfig();
    const now = Date.now();
    const previousAccessToken = session.accessToken;
    const previousRefreshToken = session.refreshToken;

    session.accessToken = this.issueToken(ACCESS_TOKEN_PREFIX);
    session.refreshToken = this.issueToken(REFRESH_TOKEN_PREFIX);
    session.accessExpiresAt = now + (config.accessTokenTtlSeconds * 1000);
    session.refreshExpiresAt = now + (config.refreshTokenTtlSeconds * 1000);
    session.updatedAt = new Date(now).toISOString();

    const redis = await this.getRedisClient();
    if (redis) {
      await this.del(redis, this.accessTokenKey(previousAccessToken));
      await this.del(redis, this.refreshTokenKey(previousRefreshToken));
    } else {
      this.sessionsByAccessToken.delete(previousAccessToken);
      this.sessionsByRefreshToken.delete(previousRefreshToken);
    }

    await this.persistSession(session);
    return session;
  }

  async revokeSession(
    sessionId: string,
  ) {
    const redis = await this.getRedisClient();
    if (redis) {
      const session = await this.getJson<StoredOAuthSession>(
        redis,
        this.sessionKey(sessionId),
      );
      if (!session) {
        return false;
      }
      await this.del(redis, this.sessionKey(session.id));
      await this.del(redis, this.accessTokenKey(session.accessToken));
      await this.del(redis, this.refreshTokenKey(session.refreshToken));
      return true;
    }

    const session = this.sessionsById.get(sessionId);
    if (!session) {
      return false;
    }
    this.sessionsById.delete(session.id);
    this.sessionsByAccessToken.delete(session.accessToken);
    this.sessionsByRefreshToken.delete(session.refreshToken);
    return true;
  }

  toOAuthTokens(
    session: StoredOAuthSession,
  ) {
    return {
      access_token: session.accessToken,
      refresh_token: session.refreshToken,
      token_type: "bearer",
      expires_in: Math.max(0, Math.floor((session.accessExpiresAt - Date.now()) / 1000)),
      scope: session.scopes.join(" "),
    };
  }

  private async persistSession(
    session: StoredOAuthSession,
  ) {
    const redis = await this.getRedisClient();
    const sessionTtlSeconds = Math.max(1, Math.ceil((session.refreshExpiresAt - Date.now()) / 1000));
    const accessTtlSeconds = Math.max(1, Math.ceil((session.accessExpiresAt - Date.now()) / 1000));
    const refreshTtlSeconds = Math.max(1, Math.ceil((session.refreshExpiresAt - Date.now()) / 1000));

    if (redis) {
      await this.setJson(
        redis,
        this.sessionKey(session.id),
        session,
        sessionTtlSeconds,
      );
      await this.setString(
        redis,
        this.accessTokenKey(session.accessToken),
        session.id,
        accessTtlSeconds,
      );
      await this.setString(
        redis,
        this.refreshTokenKey(session.refreshToken),
        session.id,
        refreshTtlSeconds,
      );
      return;
    }

    this.sweepExpiredSessionsIfDue();
    this.sessionsById.set(session.id, session);
    this.sessionsByAccessToken.set(session.accessToken, session);
    this.sessionsByRefreshToken.set(session.refreshToken, session);
  }

  private sweepExpiredAuthorizationCodesIfDue() {
    const now = Date.now();
    if (this.nextAuthorizationCodeSweepAt > now) {
      return;
    }
    this.nextAuthorizationCodeSweepAt = now + MEMORY_AUTHORIZATION_CODE_SWEEP_INTERVAL_MS;
    for (const [code, record] of this.authorizationCodes.entries()) {
      if (record.expiresAt <= now) {
        this.authorizationCodes.delete(code);
      }
    }
  }

  private sweepExpiredSessionsIfDue() {
    const now = Date.now();
    if (this.nextSessionSweepAt > now) {
      return;
    }
    this.nextSessionSweepAt = now + MEMORY_SESSION_SWEEP_INTERVAL_MS;
    for (const [sessionId, session] of this.sessionsById.entries()) {
      if (session.refreshExpiresAt <= now) {
        this.sessionsById.delete(sessionId);
        this.sessionsByAccessToken.delete(session.accessToken);
        this.sessionsByRefreshToken.delete(session.refreshToken);
      }
    }
  }

  private async normalizeSession(
    redis: Redis | undefined,
    session: StoredOAuthSession | undefined,
  ) {
    if (!session) {
      return undefined;
    }
    if (session.refreshExpiresAt <= Date.now()) {
      await this.revokeSession(session.id);
      return undefined;
    }
    if (!redis && !this.sessionsById.has(session.id)) {
      return undefined;
    }
    return session;
  }

  private async getConfig() {
    if (!this.configPromise) {
      this.configPromise = (async () => {
        const tokenType = ((await getEnv("mcp_token_type")) || "memory").trim().toLowerCase();
        const accessTokenTtlSeconds = toPositiveInt(
          await getEnv("mcp_oauth_access_token_timeout"),
          DEFAULT_MCP_ACCESS_TOKEN_TTL_SECONDS,
        );
        const refreshTokenTtlSeconds = toPositiveInt(
          await getEnv("mcp_oauth_refresh_token_timeout"),
          30 * 24 * 60 * 60,
        );
        const authorizationCodeTtlSeconds = toPositiveInt(
          await getEnv("mcp_oauth_authorization_code_timeout"),
          5 * 60,
        );
        return {
          mode: tokenType === "redis" ? "redis" : "memory",
          accessTokenTtlSeconds,
          refreshTokenTtlSeconds,
          authorizationCodeTtlSeconds,
        } satisfies StoreConfig;
      })();
    }
    return await this.configPromise;
  }

  private async getRedisClient() {
    const config = await this.getConfig();
    if (config.mode !== "redis") {
      return undefined;
    }
    if (!this.redisPromise) {
      this.redisPromise = (async () => {
        const option: RedisConnectOptions = {
          hostname: (await getEnv("mcp_token_redis_hostname")) || "127.0.0.1",
          port: toPositiveInt(await getEnv("mcp_token_redis_port"), 6379),
          db: toPositiveInt(await getEnv("mcp_token_redis_db"), 0),
        };
        const username = (await getEnv("mcp_token_redis_username")) || "";
        const password = (await getEnv("mcp_token_redis_password")) || "";
        if (username) {
          option.username = username;
          option.password = password;
        }
        const {
          connect,
        } = await import("redis");
        return await connect(option);
      })();
    }
    return await this.redisPromise;
  }

  private async getJson<T>(
    redis: Redis,
    key: string,
  ) {
    const val = await redis.sendCommand("GET", [ key ]);
    if (!val) {
      return undefined;
    }
    return JSON.parse(String(val)) as T;
  }

  private async getString(
    redis: Redis,
    key: string,
  ) {
    const val = await redis.sendCommand("GET", [ key ]);
    if (!val) {
      return undefined;
    }
    return String(val);
  }

  private async setJson(
    redis: Redis,
    key: string,
    value: unknown,
    ttlSeconds?: number,
  ) {
    await this.setString(
      redis,
      key,
      JSON.stringify(value),
      ttlSeconds,
    );
  }

  private async setString(
    redis: Redis,
    key: string,
    value: string,
    ttlSeconds?: number,
  ) {
    if (ttlSeconds && ttlSeconds > 0) {
      await redis.sendCommand("SET", [ key, value, "EX", ttlSeconds.toString() ]);
      return;
    }
    await redis.sendCommand("SET", [ key, value ]);
  }

  private async del(
    redis: Redis,
    key: string,
  ) {
    await redis.sendCommand("DEL", [ key ]);
  }

  private clientKey(
    clientId: string,
  ) {
    return `mcp:oauth:client:${ clientId }`;
  }

  private authorizationCodeKey(
    code: string,
  ) {
    return `mcp:oauth:code:${ code }`;
  }

  private sessionKey(
    sessionId: string,
  ) {
    return `mcp:oauth:session:${ sessionId }`;
  }

  private accessTokenKey(
    accessToken: string,
  ) {
    return `mcp:oauth:access:${ accessToken }`;
  }

  private refreshTokenKey(
    refreshToken: string,
  ) {
    return `mcp:oauth:refresh:${ refreshToken }`;
  }

  private issueToken(
    prefix: string,
  ) {
    return `${ prefix }${ crypto.randomUUID().replaceAll("-", "") }${ crypto.randomUUID().replaceAll("-", "") }`;
  }
}

function sanitizeAuthModel(
  authModel: AuthModel,
) {
  const nextAuthModel = {
    ...authModel,
  };
  delete nextAuthModel.exp;
  delete nextAuthModel.iat;
  delete nextAuthModel.nbf;
  delete nextAuthModel.jti;
  delete nextAuthModel.iss;
  delete nextAuthModel.aud;
  delete nextAuthModel.sub;
  return nextAuthModel;
}

function toPositiveInt(
  value: string | undefined,
  fallback: number,
) {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 0) {
    return fallback;
  }
  return Math.trunc(num);
}