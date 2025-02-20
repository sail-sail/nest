import {
  setNotVerifyToken,
} from "/lib/context.ts";

import * as appService from "./app.service.ts";

import * as authService from "/lib/auth/auth.service.ts";

export function generateId() {
  return appService.generateId<string>();
}

/**
 * 清空缓存
 */
export async function clearCache() {
  setNotVerifyToken(true);
  return await appService.clearCache();
}

export async function checkLogin() {
  await authService.getAuthModel();
  return true;
}
