import { JWTPayload } from "jose/index.ts";
import { Context } from "/lib/context.ts";
import * as authDao from "./auth.dao.ts";

export async function getAuthModel<T extends JWTPayload>(
  context: Context,
  notVerifyToken = false,
) {
  return await authDao.getAuthModel<T>(context, notVerifyToken);
}

/**
 * 创建access_token
 * @param {T} obj 对象
 * @returns Promise<{ expires_in: number, access_token: string }> expires_in: 过期时间
 */
export async function createToken<T extends JWTPayload>(obj :T): Promise<{ expires_in: number, access_token: string }> {
  return await authDao.createToken(obj);
}

/**
 * 验证access_token
 * @param {string} access_token
 * @returns Promise<T> 验证成功后的对象
 */
export async function verifyToken<T extends JWTPayload>(access_token :string): Promise<T> {
  return await authDao.verifyToken(access_token);
}

/**
 * 验证access_token
 * @param {string} access_token
 * @returns T 验证成功后的对象
 */
export function decodeToken<T extends JWTPayload>(access_token :string) :T {
  return authDao.decodeToken(access_token);
}

/**
 * 通过旧token创建新token
 * @param  {string} access_token 旧token
 * @returns Promise<{ expires_in: number, access_token: string }> 新tokenInfo
 */
export async function refreshToken(access_token: string) :Promise<{ expires_in: number, access_token: string }> {
  return await authDao.refreshToken(access_token);
}

/**
 * 给密码2次sha256加密
 * @param {string} str
 * @return {string}
 */
export async function getPassword(str: string): Promise<string> {
  return await authDao.getPassword(str);
}
