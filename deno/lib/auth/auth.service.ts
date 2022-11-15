import { AuthModel } from "./auth.constants.ts";
import * as authDao from "./auth.dao.ts";

export async function getAuthModel<T extends AuthModel>(
  notVerifyToken = false,
) {
  return await authDao.getAuthModel<T>(notVerifyToken);
}

/**
 * 创建 authorization
 * @param {T} obj 对象
 * @returns Promise<{ expires_in: number, authorization: string }> expires_in: 过期时间
 */
export async function createToken<T extends AuthModel>(obj :T): Promise<{ expires_in: number, authorization: string }> {
  return await authDao.createToken(obj);
}

/**
 * 验证 authorization
 * @param {string} authorization
 * @returns Promise<T> 验证成功后的对象
 */
export async function verifyToken<T extends AuthModel>(authorization :string): Promise<T> {
  return await authDao.verifyToken(authorization);
}

/**
 * 验证 authorization
 * @param {string} authorization
 * @returns T 验证成功后的对象
 */
export function decodeToken<T extends AuthModel>(authorization :string) :T {
  return authDao.decodeToken(authorization);
}

/**
 * 通过旧token创建新token
 * @param  {string} authorization 旧token
 * @returns Promise<{ expires_in: number, authorization: string }> 新tokenInfo
 */
export async function refreshToken(authorization: string) :Promise<{ expires_in: number, authorization: string }> {
  return await authDao.refreshToken(authorization);
}

/**
 * 给密码2次sha256加密
 * @param {string} str
 * @return {string}
 */
export async function getPassword(str: string): Promise<string> {
  return await authDao.getPassword(str);
}
