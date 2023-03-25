import {
  AUTHORIZATION,
  SECRET_KEY,
  type AuthModel,
} from "./auth.constants.ts";

import { ServiceException } from "/lib/exceptions/service.exception.ts";
export { getPassword } from "./auth.constants.ts";

import {
  type JWTPayload,
} from "jose/index.ts";

import {
  getAuthorization,
  useContext,
} from "/lib/context.ts";

import { getEnv } from "/lib/env.ts";

export async function getAuthModel<T extends AuthModel>(): Promise<T>;
export async function getAuthModel<T extends AuthModel>(notVerifyToken: false): Promise<T | undefined>;
export async function getAuthModel<T extends AuthModel>(notVerifyToken: true): Promise<T>;
export async function getAuthModel<T extends AuthModel>(notVerifyToken: boolean): Promise<T | undefined>;

export async function getAuthModel<T extends AuthModel>(
  notVerifyToken?: boolean,
): Promise<T | undefined> {
  const context = useContext();
  let authModel: T | undefined;
  if (context.cacheMap.has("authModel")) {
    authModel = context.cacheMap.get("authModel");
    return authModel;
  }
  const response = context.oakCtx?.response;
  if (notVerifyToken == null) {
    notVerifyToken = context.notVerifyToken;
  }
  const authorization = getAuthorization();
  if (!authorization) {
    authModel = undefined;
    context.cacheMap.set("authModel", authModel);
    if (notVerifyToken) {
      return;
    } else {
      throw new ServiceException("", "token_empty");
    }
  }
  if (notVerifyToken) {
    authModel = await decodeToken<T>(authorization);
    context.cacheMap.set("authModel", authModel);
    return authModel;
  }
  try {
    authModel = await verifyToken<T>(authorization);
    context.cacheMap.set("authModel", authModel);
  } catch (err: unknown) {
    const {
      JWSSignatureVerificationFailed,
      JWTExpired,
    } = await import("jose/util/errors.ts");
    if (err instanceof JWTExpired || err instanceof JWSSignatureVerificationFailed) {
      authModel = undefined;
      context.cacheMap.set("authModel", authModel);
    } else {
      context.cacheMap.delete("authModel");
      throw err;
    }
  }
  if (!authModel) {
    const tokenInfo = await refreshToken(authorization);
    if (tokenInfo && tokenInfo.authorization) {
      response?.headers.set(AUTHORIZATION, "Bearer " + tokenInfo.authorization);
      authModel = await verifyToken<T>(tokenInfo.authorization);
      context.cacheMap.set("authModel", authModel);
    }
  } else {
    response?.headers.set(AUTHORIZATION, "");
  }
  return authModel;
}

/**
 * 创建 authorization
 * @param {T} obj 对象
 * @returns Promise<{ expires_in: number, authorization: string }> expires_in: 过期时间
 */
export async function createToken<T extends JWTPayload>(obj :T): Promise<{ expires_in: number, authorization: string }> {
  const token_timeout = Number(await getEnv("server_tokentimeout"));
  if (!(token_timeout > 10)) {
    throw new Error("Env server_tokentimeout must larger then 10!");
  }
  const {
    SignJWT,
  } = await import("jose/index.ts");
  const token = await new SignJWT(obj)
    .setExpirationTime(token_timeout+'s')
    .setProtectedHeader({ alg: "HS256" })
    .sign(new TextEncoder().encode(SECRET_KEY));
  return {
    expires_in: token_timeout,
    authorization: token,
  };
}

/**
 * 验证 authorization
 * @param {string} authorization
 * @returns Promise<T> 验证成功后的对象
 */
export async function verifyToken<T extends JWTPayload>(authorization :string): Promise<T> {
  const {
    jwtVerify,
  } = await import("jose/index.ts");
  const { payload } = await jwtVerify(authorization, new TextEncoder().encode(SECRET_KEY));
  return <T>payload;
}

/**
 * 验证 authorization
 * @param {string} authorization
 * @returns T 验证成功后的对象
 */
export async function decodeToken<T extends JWTPayload>(authorization :string): Promise<T> {
  const {
    decodeJwt,
  } = await import("jose/index.ts");
  const obj = <T>decodeJwt(authorization);
  return obj;
}

/**
 * 通过旧token创建新token
 * @param  {string} authorization 旧token
 * @returns Promise<{ expires_in: number, authorization: string }> 新tokenInfo
 */
export async function refreshToken(authorization: string): Promise<{ expires_in: number, authorization: string }> {
  const {
    decodeJwt,
  } = await import("jose/index.ts");
  const obj = decodeJwt(authorization);
  if (!obj || !obj.exp) {
    throw new ServiceException("", "refresh_token_expired");
  }
  const token_timeout = Number(await getEnv("server_tokentimeout"));
  const date = new Date();
  if (date.getTime() / 1000 - token_timeout > obj.exp) {
    throw new ServiceException("", "refresh_token_expired");
  }
  // deno-lint-ignore no-explicit-any
  const obj2: any = {};
  Object.keys(obj)
    .filter((key) => key !== "iat" && key !== "exp")
    .forEach(function(key) {
      obj2[key] = obj[key];
    });
  const tokenInfo = await createToken(obj2);
  return tokenInfo;
}
