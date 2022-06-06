import { Context } from "/lib/context.ts";
import * as appDao from "./app.dao.ts";

export function generateId(
  context: Context,
) {
  return appDao.generateId(context);
}

/**
 * 清空缓存
 * @return {Promise<boolean>}
 */
 export async function clearCache(
  context: Context,
): Promise<boolean> {
  return await appDao.clearCache(context);
}
