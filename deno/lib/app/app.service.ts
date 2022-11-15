import * as appDao from "./app.dao.ts";

export function generateId() {
  return appDao.generateId();
}

/**
 * 清空缓存
 * @return {Promise<boolean>}
 */
 export async function clearCache(): Promise<boolean> {
  return await appDao.clearCache();
}
