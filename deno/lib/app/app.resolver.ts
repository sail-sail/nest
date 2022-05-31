import { Context } from "/lib/context.ts";
import * as appService from "./app.service.ts";
import * as authService from "/lib/auth/auth.service.ts";

export function generateId(
  context: Context,
) {
  return appService.generateId(context);
}

/**
 * 清空缓存
 * @param {Context} context
 */
export async function clearCache(
  context: Context,
) {
  return await appService.clearCache(context);
}

export async function checkLogin(
  context: Context,
) {
  await authService.getAuthModel(context);
  return true;
}
