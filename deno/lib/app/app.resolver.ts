import {
  _internals as appService,
} from "./app.service.ts";

import {
  _internals as authService,
} from "/lib/auth/auth.service.ts";

export const _internals = {
  generateId,
  clearCache,
  checkLogin,
}

function generateId() {
  return appService.generateId();
}

/**
 * 清空缓存
 */
async function clearCache() {
  return await appService.clearCache();
}

async function checkLogin() {
  await authService.getAuthModel();
  return true;
}
