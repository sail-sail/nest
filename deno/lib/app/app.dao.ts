import { shortUuidV4 } from "/lib/string_util.ts";
import { Context } from "/lib/context.ts";

export function generateId(
  _context: Context,
) {
  return shortUuidV4();
}

/**
 * 清空缓存
 * @return {Promise<boolean>}
 */
export async function clearCache(
  context: Context,
): Promise<boolean> {
  await context.clearCache();
  return true;
}
