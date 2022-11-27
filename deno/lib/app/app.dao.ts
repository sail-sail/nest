import {
  clearCache as clearCacheCtx,
} from "/lib/context.ts";

import { shortUuidV4 } from "/lib/util/string_util.ts";

export const _internals = {
  generateId,
  clearCache,
};

function generateId() {
  return shortUuidV4();
}

/**
 * 清空缓存
 * @return {Promise<boolean>}
 */
async function clearCache(
): Promise<boolean> {
  await clearCacheCtx();
  return true;
}
