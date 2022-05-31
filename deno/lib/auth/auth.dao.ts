import { ACCESS_TOKEN, SECRET_KEY } from "./auth.constants.ts";
import { ServiceException } from "../exceptions/service.exception.ts";
export { getPassword } from "./auth.constants.ts";

import { SignJWT, jwtVerify, JWTPayload, decodeJwt } from "jose/index.ts";
import { JWTExpired } from "jose/util/errors.ts";
import { Context } from "../context.ts";

export function getAccess_token(
  context: Context,
) {
  const request = context.oakCtx.request;
  const headers = request.headers;
  let access_token: string|null = headers.get(ACCESS_TOKEN);
  if (!access_token) {
    const searchParams = request.url.searchParams;
    access_token = searchParams.get(ACCESS_TOKEN);
  }
  return access_token;
}

export async function getAuthModel<T extends JWTPayload>(
  context: Context,
  notVerifyToken = false,
) {
  const response = context.oakCtx.response;
  const access_token = getAccess_token(context);
  if (!access_token) {
    if (notVerifyToken) {
      return undefined;
    } else {
      throw new ServiceException("令牌不能为空!", "token_empty");
    }
  }
  if (notVerifyToken) {
    const authModel = decodeToken<T>(access_token);
    return authModel;
  }
  let authModel: T|undefined;
  try {
    authModel = await verifyToken<T>(access_token);
  } catch (err: unknown) {
    if (err instanceof JWTExpired) {
      authModel = undefined;
    } else {
      throw err;
    }
  }
  if (!authModel) {
    const tokenInfo = await refreshToken(access_token);
    if (tokenInfo && tokenInfo.access_token) {
      response.headers.set(ACCESS_TOKEN, tokenInfo.access_token);
      authModel = await verifyToken<T>(tokenInfo.access_token);
    }
  } else {
    response.headers.set(ACCESS_TOKEN, "");
  }
  return authModel;
}

/**
 * 创建access_token
 * @param {T} obj 对象
 * @returns Promise<{ expires_in: number, access_token: string }> expires_in: 过期时间
 */
export async function createToken<T extends JWTPayload>(obj :T): Promise<{ expires_in: number, access_token: string }> {
  const token_timeout = Number(Deno.env.get("server_tokenTimeout"));
  if (!(token_timeout > 10)) {
    throw new Error("Env server_tokenTimeout must larger then 10!");
  }
  const token = await new SignJWT(obj)
    .setExpirationTime(token_timeout+'s')
    .setProtectedHeader({ alg: "HS256" })
    .sign(new TextEncoder().encode(SECRET_KEY));
  return {
    expires_in: token_timeout,
    access_token: token,
  };
}

/**
 * 验证access_token
 * @param {string} access_token
 * @returns Promise<T> 验证成功后的对象
 */
export async function verifyToken<T extends JWTPayload>(access_token :string): Promise<T> {
  const { payload } = await jwtVerify(access_token, new TextEncoder().encode(SECRET_KEY));
  return <T>payload;
}

/**
 * 验证access_token
 * @param {string} access_token
 * @returns T 验证成功后的对象
 */
export function decodeToken<T extends JWTPayload>(access_token :string): T {
  const obj = <T>decodeJwt(access_token);
  return obj;
}

/**
 * 通过旧token创建新token
 * @param  {string} access_token 旧token
 * @returns Promise<{ expires_in: number, access_token: string }> 新tokenInfo
 */
export async function refreshToken(access_token: string): Promise<{ expires_in: number, access_token: string }> {
  const obj = decodeJwt(access_token);
  if (!obj || !obj.exp) {
    throw new ServiceException("令牌超时!", "refresh_token_expired");
  }
  const token_timeout = Number(Deno.env.get("server_tokenTimeout"));
  const date = new Date();
  if (date.getTime() / 1000 - token_timeout > obj.exp) {
    throw new ServiceException("令牌超时!", "refresh_token_expired");
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
