import * as appDao from "./app.dao.ts";

import {
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import {
  findById as findByIdUsr,
  validateOption as validateOptionUsr,
} from "/gen/base/usr/usr.dao.ts";

export function generateId<T>() {
  return appDao.generateId<T>();
}

/**
 * 清空缓存
 * @return {Promise<boolean>}
 */
export async function clearCache(): Promise<boolean> {
  const authModel = await getAuthModel();
  const usr_id = authModel?.id;
  const usr_model = await validateOptionUsr(
    await findByIdUsr(usr_id),
  );
  const username = usr_model.username;
  if (username !== "admin") {
    throw new Error("只有超级管理员 admin 才能清空缓存");
  }
  return await appDao.clearCache();
}
