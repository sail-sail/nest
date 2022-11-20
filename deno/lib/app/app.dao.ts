import {
  clearCache as clearCacheCtx,
} from "/lib/context.ts";

import { shortUuidV4 } from "/lib/util/string_util.ts";

export function generateId() {
  return shortUuidV4();
}

/**
 * 清空缓存
 * @return {Promise<boolean>}
 */
export async function clearCache(
): Promise<boolean> {
  await clearCacheCtx();
  return true;
}
