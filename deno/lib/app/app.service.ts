import {
  _internals as appDao,
} from "./app.dao.ts";

export const _internals = {
  generateId,
  clearCache,
};

function generateId() {
  return appDao.generateId();
}

/**
 * 清空缓存
 * @return {Promise<boolean>}
 */
 async function clearCache(): Promise<boolean> {
  return await appDao.clearCache();
}
