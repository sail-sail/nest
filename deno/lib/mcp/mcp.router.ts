import {
  Router,
  type Context as OakContext,
} from "@oak/oak";

import type {
  AuthInfo,
} from "@modelcontextprotocol/sdk/server/auth/types";

import {
  WebStandardStreamableHTTPServerTransport,
// deno-lint-ignore ban-ts-comment
// @ts-ignore
} from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";

import {
  z,
} from "zod";

import {
  getAuthModelByAuthorization,
} from "/lib/auth/auth.service.ts";

import type {
  AuthModel,
} from "/lib/auth/auth.constants.ts";

import {
  getEnv,
} from "/lib/env.ts";

import {
  createExecutionAuthorization,
  createNestMcpServer,
  executeLoginMutation,
  type McpExecutionAuthContext,
} from "/src/base/mcp/mcp.service.ts";

import type {
  GetLoginTenants,
  MutationLoginArgs,
} from "/gen/types.ts";

import {
  getLoginTenants,
} from "/src/base/tenant/tenant.service.ts";

import {
  McpOAuthStore,
  type OAuthClientRegistrationInput,
  type RegisteredOAuthClient,
  type StoredAuthorizationCode,
  type StoredOAuthSession,
} from "./oauth_store.ts";

const router = new Router();

const oauthStore = new McpOAuthStore();
const mcpSessions = new Map<string, McpSessionRecord>();

const requiredScopes = [ "mcp:tools" ];
const defaultMcpTokenLifetimeSeconds = 10 * 365 * 24 * 60 * 60;

const loginBodySchema = z.object({
  username: z.string().trim().min(1, "username 不能为空"),
  password: z.string().min(1, "password 不能为空"),
  tenant_id: z.string().trim().min(1, "tenant_id 不能为空"),
  org_id: z.string().trim().optional(),
});

const authorizeClientSchema = z.object({
  client_id: z.string().trim().min(1, "client_id 不能为空"),
  redirect_uri: z.string().trim().optional(),
});

const authorizeRequestSchema = z.object({
  response_type: z.literal("code"),
  code_challenge: z.string().trim().min(1, "code_challenge 不能为空"),
  code_challenge_method: z.literal("S256"),
  scope: z.string().trim().optional(),
  state: z.string().trim().optional(),
  resource: z.string().trim().url().optional(),
});

const authorizeSubmitSchema = z.object({
  decision: z.enum([ "approve", "deny" ]),
  tenant_id: z.string().trim().min(1, "tenant_id 不能为空"),
  username: z.string().trim().min(1, "username 不能为空"),
  password: z.string().min(1, "password 不能为空"),
});

const registerClientSchema = z.object({
  redirect_uris: z.array(z.string().url()).min(1, "redirect_uris 不能为空"),
  token_endpoint_auth_method: z.string().optional(),
  grant_types: z.array(z.string()).optional(),
  response_types: z.array(z.string()).optional(),
  client_name: z.string().optional(),
  scope: z.string().optional(),
  client_uri: z.string().url().optional(),
  logo_uri: z.string().optional(),
  contacts: z.array(z.string()).optional(),
  tos_uri: z.string().optional(),
  policy_uri: z.string().optional(),
  software_id: z.string().optional(),
  software_version: z.string().optional(),
});

const tokenBaseSchema = z.object({
  grant_type: z.string().trim().min(1, "grant_type 不能为空"),
  client_id: z.string().trim().min(1, "client_id 不能为空"),
});

const tokenAuthorizationCodeSchema = z.object({
  code: z.string().trim().min(1, "code 不能为空"),
  code_verifier: z.string().trim().min(1, "code_verifier 不能为空"),
  redirect_uri: z.string().trim().optional(),
  resource: z.string().trim().url().optional(),
});

const tokenRefreshSchema = z.object({
  refresh_token: z.string().trim().min(1, "refresh_token 不能为空"),
  scope: z.string().trim().optional(),
  resource: z.string().trim().url().optional(),
});

const revokeSchema = z.object({
  client_id: z.string().trim().min(1, "client_id 不能为空"),
  token: z.string().trim().min(1, "token 不能为空"),
  token_type_hint: z.string().trim().optional(),
});

router.options("/mcp", async function(ctx) {
  if (await applyHostOriginPolicy(ctx)) {
    return;
  }
  ctx.response.status = 204;
  applyCorsHeaders(ctx.response.headers, ctx.request.headers.get("origin"));
});

router.get("/mcp", async function(ctx) {
  await handleMcpRequest(ctx);
});

router.post("/mcp", async function(ctx) {
  await handleMcpRequest(ctx);
});

router.delete("/mcp", async function(ctx) {
  await handleMcpRequest(ctx);
});

router.post("/mcp/login", async function(ctx) {
  if (await applyHostOriginPolicy(ctx)) {
    return;
  }
  const parsed = await parseOakRequest(ctx);
  if (!(parsed.parsedBody && typeof parsed.parsedBody === "object")) {
    respondOAuthError(ctx, 400, "invalid_request", "请求体必须是 JSON 对象");
    return;
  }
  const input = loginBodySchema.parse(parsed.parsedBody) as MutationLoginArgs["input"];
  try {
    const loginModel = await executeLoginMutation(ctx, input);
    ctx.response.status = 200;
    applyCorsHeaders(ctx.response.headers, ctx.request.headers.get("origin"));
    ctx.response.body = loginModel;
  } catch (err) {
    respondOAuthError(ctx, 401, "access_denied", asErrorMessage(err, "登录失败"));
  }
});

router.get("/.well-known/oauth-protected-resource", async function(ctx) {
  if (await applyHostOriginPolicy(ctx)) {
    return;
  }
  const urls = await buildUrlSet(ctx.request.url.href, ctx.request.headers);
  await respondJson(ctx, 200, await buildProtectedResourceMetadata(urls));
});

router.get("/.well-known/oauth-protected-resource/mcp", async function(ctx) {
  if (await applyHostOriginPolicy(ctx)) {
    return;
  }
  const urls = await buildUrlSet(ctx.request.url.href, ctx.request.headers);
  await respondJson(ctx, 200, await buildProtectedResourceMetadata(urls));
});

router.get("/.well-known/oauth-authorization-server", async function(ctx) {
  if (await applyHostOriginPolicy(ctx)) {
    return;
  }
  const urls = await buildUrlSet(ctx.request.url.href, ctx.request.headers);
  await respondJson(ctx, 200, buildAuthorizationServerMetadata(urls));
});

router.get("/authorize", async function(ctx) {
  if (await applyHostOriginPolicy(ctx)) {
    return;
  }
  const urls = await buildUrlSet(ctx.request.url.href, ctx.request.headers);
  const validation = await validateAuthorizationRequest(Object.fromEntries(ctx.request.url.searchParams.entries()), urls);
  if (!validation.ok) {
    respondOAuthError(ctx, validation.statusCode, validation.error, validation.message);
    return;
  }
  const scopeText = validation.scopes.join(" ") || requiredScopes.join(" ");
  const tenants = await loadLoginTenants(ctx.request);
  const tenantId = defaultTenantId(tenants, getRequestTenantId(ctx.request));
  ctx.response.status = 200;
  ctx.response.headers.set("cache-control", "no-store");
  applyCorsHeaders(ctx.response.headers, ctx.request.headers.get("origin"));
  ctx.response.type = "text/html; charset=utf-8";
  ctx.response.body = renderAuthorizePage({
    urls,
    client: validation.client,
    params: validation.params,
    scopeText,
    tenants,
    tenantId,
  });
});

router.post("/authorize", async function(ctx) {
  if (await applyHostOriginPolicy(ctx)) {
    return;
  }
  const urls = await buildUrlSet(ctx.request.url.href, ctx.request.headers);
  const parsed = await parseOakRequest(ctx);
  const form = ensureFormBody(parsed.parsedBody);
  const validation = await validateAuthorizationRequest(form, urls);
  if (!validation.ok) {
    respondOAuthError(ctx, validation.statusCode, validation.error, validation.message);
    return;
  }

  const submit = authorizeSubmitSchema.parse(form);
  if (submit.decision === "deny") {
    ctx.response.redirect(createErrorRedirect(validation.params.redirectUri, "access_denied", "用户取消了授权", validation.params.state));
    return;
  }

  const tenants = await loadLoginTenants(ctx.request);
  const tenantId = defaultTenantId(tenants, submit.tenant_id || getRequestTenantId(ctx.request));
  const loginInput: MutationLoginArgs["input"] = {
    tenant_id: tenantId as TenantId,
    username: submit.username,
    password: submit.password,
    org_id: undefined,
  };

  try {
    const loginModel = await executeLoginMutation(ctx, loginInput);
    const authResolved = await getAuthModelByAuthorization<AuthModel>(loginModel.authorization);
    const code = await oauthStore.issueAuthorizationCode({
      clientId: validation.client.client_id,
      redirectUri: validation.params.redirectUri,
      codeChallenge: validation.params.codeChallenge,
      scopes: validation.scopes,
      resource: validation.resource,
      authModel: authResolved.authModel,
    });
    const redirectUrl = new URL(validation.params.redirectUri);
    redirectUrl.searchParams.set("code", code);
    if (validation.params.state) {
      redirectUrl.searchParams.set("state", validation.params.state);
    }
    ctx.response.redirect(redirectUrl.href);
  } catch (err) {
    ctx.response.status = 401;
    ctx.response.headers.set("cache-control", "no-store");
    applyCorsHeaders(ctx.response.headers, ctx.request.headers.get("origin"));
    ctx.response.type = "text/html; charset=utf-8";
    ctx.response.body = renderAuthorizePage({
      urls,
      client: validation.client,
      params: validation.params,
      scopeText: validation.scopes.join(" ") || requiredScopes.join(" "),
      errorMessage: asErrorMessage(err, "登录失败"),
      tenants,
      tenantId,
      username: submit.username,
    });
  }
});

router.post("/register", async function(ctx) {
  if (await applyHostOriginPolicy(ctx)) {
    return;
  }
  const parsed = await parseOakRequest(ctx);
  if (!(parsed.parsedBody && typeof parsed.parsedBody === "object")) {
    respondOAuthError(ctx, 400, "invalid_client_metadata", "请求体必须是 JSON 对象");
    return;
  }
  const input = registerClientSchema.parse(parsed.parsedBody) as OAuthClientRegistrationInput;
  if (input.token_endpoint_auth_method && input.token_endpoint_auth_method !== "none") {
    respondOAuthError(ctx, 400, "invalid_client_metadata", "仅支持 token_endpoint_auth_method=none");
    return;
  }
  if (input.grant_types && input.grant_types.some((item) => item !== "authorization_code" && item !== "refresh_token")) {
    respondOAuthError(ctx, 400, "invalid_client_metadata", "grant_types 仅支持 authorization_code 和 refresh_token");
    return;
  }
  if (input.response_types && input.response_types.some((item) => item !== "code")) {
    respondOAuthError(ctx, 400, "invalid_client_metadata", "response_types 仅支持 code");
    return;
  }
  const client = await oauthStore.registerClient({
    ...input,
    token_endpoint_auth_method: "none",
  });
  respondJson(ctx, 201, client);
});

router.post("/token", async function(ctx) {
  if (await applyHostOriginPolicy(ctx)) {
    return;
  }
  const urls = await buildUrlSet(ctx.request.url.href, ctx.request.headers);
  const parsed = await parseOakRequest(ctx);
  const form = ensureFormBody(parsed.parsedBody);
  const base = tokenBaseSchema.parse(form);
  const client = await oauthStore.getClient(base.client_id);
  if (!client) {
    respondOAuthError(ctx, 400, "invalid_client", "Invalid client_id");
    return;
  }

  if (base.grant_type === "authorization_code") {
    const input = tokenAuthorizationCodeSchema.parse(form);
    const record = await oauthStore.consumeAuthorizationCode(input.code);
    if (!record) {
      respondOAuthError(ctx, 400, "invalid_grant", "Invalid authorization code");
      return;
    }
    if (record.clientId !== client.client_id) {
      respondOAuthError(ctx, 400, "invalid_grant", "Authorization code was not issued to this client");
      return;
    }
    if (input.redirect_uri && input.redirect_uri !== record.redirectUri) {
      respondOAuthError(ctx, 400, "invalid_grant", "redirect_uri does not match original authorization request");
      return;
    }
    const requestedResource = input.resource || urls.mcpUrl.href;
    if (requestedResource !== record.resource) {
      respondOAuthError(ctx, 400, "invalid_target", "resource does not match original authorization request");
      return;
    }
    const isPkceValid = await verifyPkceChallenge(input.code_verifier, record.codeChallenge);
    if (!isPkceValid) {
      respondOAuthError(ctx, 400, "invalid_grant", "code_verifier does not match the challenge");
      return;
    }
    const session = await oauthStore.createSession({
      clientId: client.client_id,
      scopes: record.scopes,
      resource: record.resource,
      authModel: record.authModel,
    });
    respondJson(ctx, 200, oauthStore.toOAuthTokens(session));
    return;
  }

  if (base.grant_type === "refresh_token") {
    const input = tokenRefreshSchema.parse(form);
    const session = await oauthStore.findSessionByRefreshToken(input.refresh_token);
    if (!session) {
      respondOAuthError(ctx, 400, "invalid_grant", "Invalid refresh token");
      return;
    }
    if (session.clientId !== client.client_id) {
      respondOAuthError(ctx, 400, "invalid_grant", "Refresh token was not issued to this client");
      return;
    }
    const requestedScopes = parseScopeList(input.scope);
    if (requestedScopes.length > 0 && requestedScopes.some((scope) => !session.scopes.includes(scope))) {
      respondOAuthError(ctx, 400, "invalid_scope", "Requested scope exceeds the originally granted scope");
      return;
    }
    const requestedResource = input.resource || session.resource;
    if (requestedResource !== session.resource) {
      respondOAuthError(ctx, 400, "invalid_target", "resource does not match the originally granted resource");
      return;
    }
    session.scopes = requestedScopes.length > 0 ? requestedScopes : [ ...session.scopes ];
    session.resource = requestedResource;
    await oauthStore.rotateTokens(session);
    respondJson(ctx, 200, oauthStore.toOAuthTokens(session));
    return;
  }

  respondOAuthError(ctx, 400, "unsupported_grant_type", "The grant type is not supported by this authorization server.");
});

router.post("/revoke", async function(ctx) {
  if (await applyHostOriginPolicy(ctx)) {
    return;
  }
  const parsed = await parseOakRequest(ctx);
  const form = ensureFormBody(parsed.parsedBody);
  const input = revokeSchema.parse(form);
  const client = await oauthStore.getClient(input.client_id);
  if (!client) {
    respondOAuthError(ctx, 400, "invalid_client", "Invalid client_id");
    return;
  }

  const accessSession = await oauthStore.findSessionByAccessToken(input.token);
  if (accessSession && accessSession.clientId === client.client_id) {
    await oauthStore.revokeSession(accessSession.id);
    respondJson(ctx, 200, { });
    return;
  }

  const refreshSession = await oauthStore.findSessionByRefreshToken(input.token);
  if (refreshSession && refreshSession.clientId === client.client_id) {
    await oauthStore.revokeSession(refreshSession.id);
  }
  respondJson(ctx, 200, { });
});

setInterval(function reapExpiredSessions() {
  void (async function() {
    const timeoutMs = await getMcpSessionTimeoutMs();
    const deadline = Date.now() - timeoutMs;
    for (const [ sessionId, record ] of mcpSessions.entries()) {
      if (record.lastActiveAt >= deadline) {
        continue;
      }
      await closeMcpSession(sessionId, record);
    }
  })();
}, 60_000);

export default router;

interface McpSessionRecord {
  sessionId: string;
  authFingerprint: string;
  transport: WebStandardStreamableHTTPServerTransport;
  server: ReturnType<typeof createNestMcpServer>;
  lastActiveAt: number;
}

interface ResolvedMcpAuth extends McpExecutionAuthContext {
  authFingerprint: string;
  authInfo: AuthInfo;
  responseAuthorizationHeader?: string;
}

interface UrlSet {
  baseUrl: URL;
  mcpUrl: URL;
  authorizeUrl: URL;
  tokenUrl: URL;
  registerUrl: URL;
  revokeUrl: URL;
  protectedResourceUrl: URL;
  authorizationServerMetadataUrl: URL;
}

async function handleMcpRequest(
  ctx: OakContext,
) {
  if (await applyHostOriginPolicy(ctx)) {
    return;
  }
  const parsed = await parseOakRequest(ctx);
  const urls = await buildUrlSet(parsed.webRequest.url, parsed.webRequest.headers);
  const authResolved = await resolveMcpAuth(parsed.webRequest, urls);
  if (!authResolved.ok) {
    await writeWebResponse(ctx, authResolved.response);
    return;
  }

  const sessionId = parsed.webRequest.headers.get("mcp-session-id") || undefined;
  let response: Response;

  if (sessionId) {
    const record = mcpSessions.get(sessionId);
    if (!record) {
      response = createJsonRpcErrorResponse(404, -32001, "Session not found");
      await writeWebResponse(ctx, decorateMcpResponse(response, ctx.request.headers.get("origin"), authResolved.auth.responseAuthorizationHeader));
      return;
    }
    if (record.authFingerprint !== authResolved.auth.authFingerprint) {
      response = createOAuthResponse(403, "insufficient_scope", "当前 Bearer token 与 MCP session 不匹配");
      await writeWebResponse(ctx, decorateMcpResponse(response, ctx.request.headers.get("origin"), authResolved.auth.responseAuthorizationHeader));
      return;
    }
    record.lastActiveAt = Date.now();
    response = await record.transport.handleRequest(parsed.webRequest, {
      parsedBody: parsed.parsedBody,
      authInfo: authResolved.auth.authInfo,
    });
    if (ctx.request.method === "DELETE") {
      await closeMcpSession(sessionId, record);
    }
  } else {
    if (ctx.request.method !== "POST") {
      response = createJsonRpcErrorResponse(400, -32000, "Bad Request: Session ID required");
      await writeWebResponse(ctx, decorateMcpResponse(response, ctx.request.headers.get("origin"), authResolved.auth.responseAuthorizationHeader));
      return;
    }
    if (!isInitializeRequest(parsed.parsedBody)) {
      response = createJsonRpcErrorResponse(400, -32000, "首次请求必须是 initialize");
      await writeWebResponse(ctx, decorateMcpResponse(response, ctx.request.headers.get("origin"), authResolved.auth.responseAuthorizationHeader));
      return;
    }

    let transport: WebStandardStreamableHTTPServerTransport | undefined;
    const server = createNestMcpServer({
      auth: authResolved.auth,
    });
    transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: () => crypto.randomUUID(),
      enableJsonResponse: true,
      onsessioninitialized(nextSessionId: string) {
        if (!transport) {
          return;
        }
        mcpSessions.set(nextSessionId, {
          sessionId: nextSessionId,
          authFingerprint: authResolved.auth.authFingerprint,
          transport,
          server,
          lastActiveAt: Date.now(),
        });
      },
      onsessionclosed(nextSessionId: string) {
        const record = mcpSessions.get(nextSessionId);
        if (!record) {
          return;
        }
        void closeMcpSession(nextSessionId, record);
      },
    });
    await server.connect(transport);
    response = await transport.handleRequest(parsed.webRequest, {
      parsedBody: parsed.parsedBody,
      authInfo: authResolved.auth.authInfo,
    });
  }

  await writeWebResponse(
    ctx,
    decorateMcpResponse(
      response,
      ctx.request.headers.get("origin"),
      authResolved.auth.responseAuthorizationHeader,
    ),
  );
}

async function resolveMcpAuth(
  request: Request,
  urls: UrlSet,
): Promise<{ ok: true; auth: ResolvedMcpAuth; } | { ok: false; response: Response; }> {
  const authorizationHeader = request.headers.get("authorization");
  if (!authorizationHeader) {
    return {
      ok: false,
      response: createUnauthorizedMcpResponse(urls, "Missing Authorization header"),
    };
  }

  const [ authType, token ] = authorizationHeader.split(" ");
  if (authType?.toLowerCase() !== "bearer" || !token) {
    return {
      ok: false,
      response: createUnauthorizedMcpResponse(urls, "Invalid Authorization header format, expected 'Bearer TOKEN'"),
    };
  }

  if (token.startsWith("mcp_at_")) {
    const session = await oauthStore.findSessionByAccessToken(token);
    if (!session) {
      return {
        ok: false,
        response: createUnauthorizedMcpResponse(urls, "Invalid or expired access token"),
      };
    }
    if (!requiredScopes.every((scope) => session.scopes.includes(scope))) {
      return {
        ok: false,
        response: createForbiddenMcpResponse(urls, "Insufficient scope"),
      };
    }
    const authorization = await createExecutionAuthorization(session.authModel);
    return {
      ok: true,
      auth: {
        authMode: "oauth",
        authModel: session.authModel,
        authorization,
        scopes: [ ...session.scopes ],
        resource: session.resource,
        publicBaseUrl: urls.baseUrl.href,
        authFingerprint: buildAuthFingerprint(session.authModel),
        authInfo: {
          token,
          clientId: session.clientId,
          scopes: [ ...session.scopes ],
          expiresAt: Math.floor(session.accessExpiresAt / 1000),
          resource: new URL(session.resource),
          extra: {
            authMode: "oauth",
            userId: session.authModel.id,
            tenantId: session.authModel.tenant_id,
          },
        },
      },
    };
  }

  try {
    const resolved = await getAuthModelByAuthorization<AuthModel>(token);
    return {
      ok: true,
      auth: {
        authMode: "direct",
        authModel: resolved.authModel,
        authorization: resolved.authorization,
        scopes: [ ...requiredScopes ],
        resource: urls.mcpUrl.href,
        publicBaseUrl: urls.baseUrl.href,
        authFingerprint: buildAuthFingerprint(resolved.authModel),
        authInfo: {
          token: resolved.authorization,
          clientId: "business-token",
          scopes: [ ...requiredScopes ],
          expiresAt: Number(resolved.authModel.exp || Math.floor(Date.now() / 1000) + defaultMcpTokenLifetimeSeconds),
          resource: urls.mcpUrl,
          extra: {
            authMode: "direct",
            userId: resolved.authModel.id,
            tenantId: resolved.authModel.tenant_id,
          },
        },
        responseAuthorizationHeader: resolved.authorization !== token
          ? `Bearer ${ resolved.authorization }`
          : undefined,
      },
    };
  } catch (err) {
    return {
      ok: false,
      response: createUnauthorizedMcpResponse(urls, asErrorMessage(err, "authorization token 无效或已过期")),
    };
  }
}

async function parseOakRequest(
  ctx: OakContext,
) {
  const method = ctx.request.method.toUpperCase();
  const headers = new Headers();
  for (const [ key, value ] of ctx.request.headers.entries()) {
    headers.set(key, value);
  }

  let bodyText: string | undefined;
  let parsedBody: unknown;

  if (ctx.request.hasBody && method !== "GET" && method !== "HEAD") {
    bodyText = await ctx.request.body.text();
    const contentType = headers.get("content-type")?.toLowerCase() || "";
    if (bodyText) {
      if (contentType.includes("application/json")) {
        parsedBody = JSON.parse(bodyText);
      } else if (contentType.includes("application/x-www-form-urlencoded")) {
        parsedBody = Object.fromEntries(new URLSearchParams(bodyText).entries());
      } else {
        parsedBody = bodyText;
      }
    }
  }

  const webRequest = new Request(ctx.request.url.href, {
    method,
    headers,
    body: bodyText,
  });

  return {
    webRequest,
    parsedBody,
  };
}

async function buildUrlSet(
  requestUrl: string,
  headers: Headers,
): Promise<UrlSet> {
  const baseUrl = await getPublicBaseUrl(requestUrl, headers);
  return {
    baseUrl,
    mcpUrl: new URL("/mcp", baseUrl),
    authorizeUrl: new URL("/authorize", baseUrl),
    tokenUrl: new URL("/token", baseUrl),
    registerUrl: new URL("/register", baseUrl),
    revokeUrl: new URL("/revoke", baseUrl),
    protectedResourceUrl: new URL("/.well-known/oauth-protected-resource/mcp", baseUrl),
    authorizationServerMetadataUrl: new URL("/.well-known/oauth-authorization-server", baseUrl),
  };
}

async function getPublicBaseUrl(
  requestUrl: string,
  headers: Headers,
) {
  const explicitBaseUrl = ((await getEnv("mcp_public_base_url")) || "").trim();
  if (explicitBaseUrl) {
    return new URL(normalizeBaseUrl(explicitBaseUrl));
  }
  const currentUrl = new URL(requestUrl);
  const forwardedHost = headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  if (!forwardedHost) {
    return new URL(currentUrl.origin);
  }
  const forwardedProto = headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || currentUrl.protocol.replace(/:$/, "");
  return new URL(`${ forwardedProto }://${ forwardedHost }`);
}

async function buildProtectedResourceMetadata(
  urls: UrlSet,
) {
  return {
    resource: urls.mcpUrl.href,
    authorization_servers: [ urls.baseUrl.href ],
    scopes_supported: [ ...requiredScopes ],
  };
}

function buildAuthorizationServerMetadata(
  urls: UrlSet,
) {
  return {
    issuer: urls.baseUrl.href,
    authorization_endpoint: urls.authorizeUrl.href,
    response_types_supported: [ "code" ],
    code_challenge_methods_supported: [ "S256" ],
    token_endpoint: urls.tokenUrl.href,
    token_endpoint_auth_methods_supported: [ "none" ],
    grant_types_supported: [ "authorization_code", "refresh_token" ],
    scopes_supported: [ ...requiredScopes ],
    revocation_endpoint: urls.revokeUrl.href,
    revocation_endpoint_auth_methods_supported: [ "none" ],
    registration_endpoint: urls.registerUrl.href,
  };
}

async function validateAuthorizationRequest(
  input: Record<string, string>,
  urls: UrlSet,
): Promise<
  | {
    ok: true;
    client: RegisteredOAuthClient;
    params: {
      redirectUri: string;
      state?: string;
      codeChallenge: string;
    };
    scopes: string[];
    resource: string;
  }
  | {
    ok: false;
    statusCode: number;
    error: string;
    message: string;
  }
> {
  try {
    const clientArgs = authorizeClientSchema.parse(input);
    const requestArgs = authorizeRequestSchema.parse(input);
    const requestedRedirectUri = clientArgs.redirect_uri;
    let client = await oauthStore.getClient(clientArgs.client_id);
    if (!client) {
      // 注册记录已失效(内存模式重启 / redis 清库)时, 用请求里带来的 client_id 与
      // redirect_uri 惰性补登记, 避免客户端缓存的 client_id 永久死锁。
      // 否则 /authorize 会退化成一个开放登记端点。
      if (
        !isAcceptableClientId(clientArgs.client_id)
        || !requestedRedirectUri
      ) {
        return {
          ok: false,
          statusCode: 401,
          error: "invalid_client",
          message: "Invalid client_id",
        };
      }
      client = await oauthStore.ensureClient(
        clientArgs.client_id,
        {
          redirect_uris: [ requestedRedirectUri ],
          client_name: "auto-recovered-client",
        },
      );
    }

    const redirectUri = resolveRedirectUri(client, requestedRedirectUri);
    const scopes = normalizeRequestedScopes(parseScopeList(requestArgs.scope));
    const resource = requestArgs.resource || urls.mcpUrl.href;
    if (resource !== urls.mcpUrl.href) {
      return {
        ok: false,
        statusCode: 400,
        error: "invalid_target",
        message: `Unsupported resource: ${ resource }`,
      };
    }

    return {
      ok: true,
      client,
      params: {
        redirectUri,
        state: requestArgs.state,
        codeChallenge: requestArgs.code_challenge,
      },
      scopes,
      resource,
    };
  } catch (err) {
    return {
      ok: false,
      statusCode: 400,
      error: "invalid_request",
      message: asErrorMessage(err, "授权请求不合法"),
    };
  }
}

const MCP_CLIENT_ID_MAX_LENGTH = 256;

function isAcceptableClientId(
  clientId: string,
) {
  if (clientId.length === 0 || clientId.length > MCP_CLIENT_ID_MAX_LENGTH) {
    return false;
  }
  // 只允许可打印 ASCII, 排除空白与控制字符, 避免脏数据进入存储
  return /^[\x21-\x7E]+$/.test(clientId);
}

function resolveRedirectUri(
  client: RegisteredOAuthClient,
  requestedRedirectUri?: string,
) {
  if (requestedRedirectUri) {
    if (!client.redirect_uris.some((registered) => redirectUriMatches(requestedRedirectUri, registered))) {
      throw new Error("Unregistered redirect_uri");
    }
    return requestedRedirectUri;
  }
  if (client.redirect_uris.length === 1) {
    return client.redirect_uris[0];
  }
  throw new Error("redirect_uri must be specified when client has multiple registered URIs");
}

function redirectUriMatches(
  requested: string,
  registered: string,
) {
  if (requested === registered) {
    return true;
  }
  let requestedUrl: URL;
  let registeredUrl: URL;
  try {
    requestedUrl = new URL(requested);
    registeredUrl = new URL(registered);
  } catch {
    return false;
  }

  const loopbackHosts = new Set([ "localhost", "127.0.0.1", "[::1]" ]);
  if (!loopbackHosts.has(requestedUrl.hostname) || !loopbackHosts.has(registeredUrl.hostname)) {
    return false;
  }

  return requestedUrl.protocol === registeredUrl.protocol
    && requestedUrl.hostname === registeredUrl.hostname
    && requestedUrl.pathname === registeredUrl.pathname
    && requestedUrl.search === registeredUrl.search;
}

async function verifyPkceChallenge(
  verifier: string,
  codeChallenge: string,
) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );
  const binary = Array.from(new Uint8Array(digest), (item) => String.fromCharCode(item)).join("");
  const generatedChallenge = btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll(/=+$/g, "");
  return generatedChallenge === codeChallenge;
}

async function closeMcpSession(
  sessionId: string,
  record: McpSessionRecord,
) {
  if (!mcpSessions.has(sessionId)) {
    return;
  }
  mcpSessions.delete(sessionId);
  if (typeof record.transport.close === "function") {
    try {
      await record.transport.close();
    } catch {
      // ignore close errors during cleanup
    }
  }
  try {
    await record.server.close();
  } catch {
    // ignore close errors during cleanup
  }
}

function decorateMcpResponse(
  response: Response,
  origin: string | null,
  authorizationHeader?: string,
) {
  const headers = new Headers(response.headers);
  applyCorsHeaders(headers, origin);
  if (authorizationHeader) {
    headers.set("authorization", authorizationHeader);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function writeWebResponse(
  ctx: OakContext,
  response: Response,
) {
  ctx.response.status = response.status;
  for (const [ key, value ] of response.headers.entries()) {
    ctx.response.headers.set(key, value);
  }
  if (response.body) {
    ctx.response.body = response.body;
  }
}

async function respondJson(
  ctx: OakContext,
  status: number,
  payload: unknown,
) {
  ctx.response.status = status;
  ctx.response.headers.set("cache-control", "no-store");
  applyCorsHeaders(ctx.response.headers, ctx.request.headers.get("origin"));
  if (payload instanceof Promise) {
    payload = await payload;
  }
  ctx.response.body = payload as Record<string, unknown>;
}

function respondOAuthError(
  ctx: OakContext,
  status: number,
  error: string,
  message: string,
) {
  ctx.response.status = status;
  ctx.response.headers.set("cache-control", "no-store");
  applyCorsHeaders(ctx.response.headers, ctx.request.headers.get("origin"));
  ctx.response.body = {
    error,
    error_description: message,
  };
}

function createOAuthResponse(
  status: number,
  error: string,
  message: string,
  headers?: Headers,
) {
  const nextHeaders = new Headers(headers);
  nextHeaders.set("cache-control", "no-store");
  return new Response(JSON.stringify({
    error,
    error_description: message,
  }), {
    status,
    headers: nextHeaders,
  });
}

function createUnauthorizedMcpResponse(
  urls: UrlSet,
  message: string,
) {
  const headers = new Headers();
  headers.set(
    "WWW-Authenticate",
    buildWwwAuthenticateHeader("invalid_token", message, urls.protectedResourceUrl.href),
  );
  return createOAuthResponse(401, "invalid_token", message, headers);
}

function createForbiddenMcpResponse(
  urls: UrlSet,
  message: string,
) {
  const headers = new Headers();
  headers.set(
    "WWW-Authenticate",
    buildWwwAuthenticateHeader("insufficient_scope", message, urls.protectedResourceUrl.href),
  );
  return createOAuthResponse(403, "insufficient_scope", message, headers);
}

function buildWwwAuthenticateHeader(
  errorCode: string,
  message: string,
  resourceMetadataUrl: string,
) {
  return `Bearer error="${ errorCode }", error_description="${ escapeHeaderValue(message) }", scope="${ requiredScopes.join(" ") }", resource_metadata="${ resourceMetadataUrl }"`;
}

function createJsonRpcErrorResponse(
  status: number,
  code: number,
  message: string,
) {
  return new Response(JSON.stringify({
    jsonrpc: "2.0",
    error: {
      code,
      message,
    },
    id: null,
  }), {
    status,
    headers: new Headers({
      "content-type": "application/json",
      "cache-control": "no-store",
    }),
  });
}

function applyCorsHeaders(
  headers: Headers,
  origin: string | null,
) {
  headers.set("access-control-allow-origin", origin || "*");
  headers.set("access-control-allow-methods", "GET, POST, DELETE, OPTIONS");
  headers.set("access-control-allow-headers", "Content-Type, Authorization, Mcp-Session-Id, Last-Event-ID, Mcp-Protocol-Version");
  headers.set("access-control-expose-headers", "Mcp-Session-Id, Mcp-Protocol-Version, WWW-Authenticate, Authorization");
}

async function applyHostOriginPolicy(
  ctx: OakContext,
) {
  const allowedHosts = await getAllowedHosts();
  const allowedOrigins = await getAllowedOrigins();
  const requestHost = ctx.request.headers.get("host")?.trim();
  const origin = ctx.request.headers.get("origin")?.trim();

  if (allowedHosts.length > 0 && requestHost && !allowedHosts.includes(requestHost)) {
    ctx.response.status = 403;
    ctx.response.body = {
      message: "host not allowed",
    };
    return true;
  }

  if (allowedOrigins.length > 0 && origin && !allowedOrigins.includes(origin)) {
    ctx.response.status = 403;
    ctx.response.body = {
      message: "origin not allowed",
    };
    return true;
  }

  return false;
}

function ensureFormBody(
  parsedBody: unknown,
) {
  if (parsedBody && typeof parsedBody === "object" && !Array.isArray(parsedBody)) {
    return parsedBody as Record<string, string>;
  }
  throw new Error("请求体必须是 form-urlencoded");
}

function parseScopeList(
  scope?: string,
) {
  if (!scope) {
    return [ ];
  }
  return scope
    .split(" ")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeRequestedScopes(
  scopes: string[],
) {
  const nextScopes = scopes.length > 0 ? scopes : [ ...requiredScopes ];
  const invalidScope = nextScopes.find((scope) => !requiredScopes.includes(scope));
  if (invalidScope) {
    throw new Error(`Unsupported scope: ${ invalidScope }`);
  }
  return Array.from(new Set(nextScopes));
}

function buildAuthFingerprint(
  authModel: AuthModel,
) {
  return JSON.stringify({
    id: authModel.id,
    tenant_id: authModel.tenant_id,
    org_id: authModel.org_id || null,
    lang: authModel.lang || "",
  });
}

async function getAllowedHosts() {
  return splitEnvList(await getEnv("mcp_allowed_hosts"));
}

async function getAllowedOrigins() {
  return splitEnvList(await getEnv("mcp_allowed_origins"));
}

async function getMcpSessionTimeoutMs() {
  const raw = await getEnv("mcp_rmcp_session_timeout");
  const timeoutSeconds = Number(raw);
  if (!Number.isFinite(timeoutSeconds) || timeoutSeconds <= 0) {
    return 30 * 60 * 1000;
  }
  return Math.trunc(timeoutSeconds * 1000);
}

function splitEnvList(
  value?: string,
) {
  if (!value) {
    return [ ];
  }
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeBaseUrl(
  value: string,
) {
  return value.endsWith("/") ? value : `${ value }/`;
}

function isInitializeRequest(
  body: unknown,
) {
  return Boolean(
    body
    && typeof body === "object"
    && "method" in body
    && (body as { method?: unknown }).method === "initialize",
  );
}

function escapeHeaderValue(
  value: string,
) {
  return value.replaceAll("\"", "\\\"");
}

function createErrorRedirect(
  redirectUri: string,
  error: string,
  message: string,
  state?: string,
) {
  const url = new URL(redirectUri);
  url.searchParams.set("error", error);
  url.searchParams.set("error_description", message);
  if (state) {
    url.searchParams.set("state", state);
  }
  return url.href;
}

export async function loadLoginTenants(
  request: {
    headers: Headers;
    url: URL | string;
  },
): Promise<GetLoginTenants[]> {
  const requestUrl = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host") || request.headers.get("host") || requestUrl.host;
  const host = forwardedHost.split(",")[0]?.trim() || requestUrl.host;
  try {
    return await getLoginTenants(host);
  } catch {
    return [];
  }
}

export function getRequestTenantId(
  request: {
    headers: Headers;
    url: URL | string;
  },
): string | undefined {
  const requestUrl = new URL(request.url);
  const headerTenantId = request.headers.get("TenantId") || request.headers.get("tenant_id");
  if (headerTenantId && headerTenantId.trim()) {
    return headerTenantId.trim();
  }
  const queryTenantIds = [
    requestUrl.searchParams.get("TenantId"),
    requestUrl.searchParams.get("tenant_id"),
    requestUrl.searchParams.get("client_tenant_id"),
  ];
  const tenantId = queryTenantIds.find((value) => Boolean(value && value.trim()));
  return tenantId ? tenantId.trim() : undefined;
}

export function defaultTenantId(
  tenants: GetLoginTenants[],
  tenantId?: string | null,
) {
  const normalizedTenantId = (tenantId || "").trim();
  if (normalizedTenantId) {
    return normalizedTenantId;
  }
  const firstTenant = tenants.find((item) => item?.id != null && String(item.id).trim());
  return firstTenant ? String(firstTenant.id) : "";
}

export function renderAuthorizePage(
  options: {
    urls: UrlSet;
    client: RegisteredOAuthClient;
    params: {
      redirectUri: string;
      state?: string;
      codeChallenge: string;
    };
    scopeText: string;
    errorMessage?: string;
    tenantId?: string;
    username?: string;
    tenants?: GetLoginTenants[];
  },
) {
  const currentTenantId = (options.tenantId || "").trim();
  const tenantItems = options.tenants || [];
  const tenantOptions = tenantItems.map((item, index) => {
    const value = String(item.id);
    const defaultSelected = !currentTenantId && index === 0 ? " selected" : "";
    const selected = currentTenantId && value === currentTenantId ? " selected" : defaultSelected;
    const label = `${ item.lbl } (${ item.title || item.info || "租户" })`;
    return `<option value="${ escapeHtml(value) }"${ selected }>${ escapeHtml(label) }</option>`;
  }).join("");

  const tenantControl = tenantItems.length > 0
    ? `<label class="field"><span>租户</span><select name="tenant_id" style="width:100%;padding:12px 14px;border-radius:14px;border:1px solid var(--line);font:inherit;background:#fff;">${ tenantOptions }</select></label>`
    : `<label class="field"><span>租户 ID</span><input name="tenant_id" value="${ escapeHtml(currentTenantId) }" autocomplete="organization" required /></label>`;

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>授权登录</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f5eee5;
        --panel: rgba(255,255,255,0.96);
        --line: #dcc9b3;
        --text: #1f1c18;
        --muted: #6f6458;
        --brand: #8d5e2d;
        --brand-strong: #6e451f;
        --danger: #b54836;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        background:
          radial-gradient(circle at 15% 20%, rgba(141,94,45,0.18), transparent 26%),
          linear-gradient(140deg, #f7efe7 0%, #eadcca 100%);
        font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
        color: var(--text);
      }
      .shell {
        width: min(980px, 100%);
        display: grid;
        grid-template-columns: minmax(280px, 360px) minmax(320px, 460px);
        background: var(--panel);
        border: 1px solid rgba(255,255,255,0.75);
        border-radius: 28px;
        overflow: hidden;
        box-shadow: 0 24px 80px rgba(60, 41, 18, 0.12);
      }
      .aside {
        padding: 32px 28px;
        background: linear-gradient(180deg, rgba(141,94,45,0.08), rgba(141,94,45,0.02));
        border-right: 1px solid var(--line);
      }
      .panel {
        padding: 32px 28px;
      }
      .eyebrow {
        display: inline-flex;
        padding: 6px 10px;
        border-radius: 999px;
        background: rgba(141,94,45,0.12);
        color: var(--brand-strong);
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.08em;
      }
      h1 {
        margin: 18px 0 12px;
        font-size: 34px;
        line-height: 1.1;
      }
      p, li, label {
        color: var(--muted);
        line-height: 1.7;
      }
      .meta {
        display: grid;
        gap: 12px;
        margin-top: 20px;
      }
      .meta-row {
        padding-top: 12px;
        border-top: 1px solid rgba(220,201,179,0.72);
      }
      .meta-row strong {
        display: block;
        margin-bottom: 6px;
        color: var(--text);
      }
      form {
        display: grid;
        gap: 14px;
      }
      .error {
        padding: 12px 14px;
        border-radius: 14px;
        border: 1px solid rgba(181,72,54,0.22);
        background: rgba(181,72,54,0.08);
        color: var(--danger);
        font-size: 14px;
      }
      .field {
        display: grid;
        gap: 8px;
      }
      input, select {
        width: 100%;
        padding: 12px 14px;
        border-radius: 14px;
        border: 1px solid var(--line);
        font: inherit;
      }
      .actions {
        display: flex;
        gap: 12px;
        margin-top: 8px;
        justify-content: center;
      }
      button {
        appearance: none;
        border: 0;
        border-radius: 999px;
        padding: 12px 18px;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
      }
      .approve {
        background: linear-gradient(135deg, var(--brand) 0%, var(--brand-strong) 100%);
        color: #fff;
      }
      .deny {
        background: rgba(111,100,88,0.12);
        color: var(--text);
      }
      @media (max-width: 860px) {
        .shell {
          grid-template-columns: 1fr;
        }
        .aside {
          border-right: 0;
          border-bottom: 1px solid var(--line);
        }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <section class="aside">
        <span class="eyebrow">MCP AUTHORIZATION</span>
        <h1>授权当前客户端访问 MCP</h1>
        <p>客户端 <strong>${ escapeHtml(options.client.client_name || options.client.client_id) }</strong> 正在申请访问当前业务系统的 MCP 能力。授权成功后，它将获得调用 GraphQL 和附件工具的受控访问令牌。</p>
        <div class="meta">
          <div class="meta-row">
            <strong>申请 scope</strong>
            ${ escapeHtml(options.scopeText) }
          </div>
          <div class="meta-row">
            <strong>MCP Endpoint</strong>
            ${ escapeHtml(options.urls.mcpUrl.href) }
          </div>
          <div class="meta-row">
            <strong>授权服务器</strong>
            ${ escapeHtml(options.urls.baseUrl.href) }
          </div>
        </div>
      </section>
      <section class="panel">
        ${ options.errorMessage ? `<div class="error">${ escapeHtml(options.errorMessage) }</div>` : "" }
        <form method="post" action="${ escapeHtml(options.urls.authorizeUrl.href) }">
          <input type="hidden" name="client_id" value="${ escapeHtml(options.client.client_id) }" />
          <input type="hidden" name="redirect_uri" value="${ escapeHtml(options.params.redirectUri) }" />
          <input type="hidden" name="response_type" value="code" />
          <input type="hidden" name="code_challenge" value="${ escapeHtml(options.params.codeChallenge) }" />
          <input type="hidden" name="code_challenge_method" value="S256" />
          <input type="hidden" name="scope" value="${ escapeHtml(options.scopeText) }" />
          <input type="hidden" name="resource" value="${ escapeHtml(options.urls.mcpUrl.href) }" />
          ${ options.params.state ? `<input type="hidden" name="state" value="${ escapeHtml(options.params.state) }" />` : "" }

          ${ tenantControl }
          <label class="field">
            <span>用户名</span>
            <input name="username" value="${ escapeHtml(options.username || "") }" autocomplete="username" required />
          </label>
          <label class="field">
            <span>密码</span>
            <input type="password" name="password" autocomplete="current-password" required />
          </label>

          <div class="actions">
            <button class="approve" type="submit" name="decision" value="approve">授权并登录</button>
            <button class="deny" type="submit" name="decision" value="deny">拒绝</button>
          </div>
        </form>
      </section>
    </main>
  </body>
</html>`;
}

function escapeHtml(
  value: string,
) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function asErrorMessage(
  err: unknown,
  fallback: string,
) {
  if (err instanceof Error) {
    return err.message || fallback;
  }
  if (typeof err === "string") {
    return err || fallback;
  }
  return fallback;
}