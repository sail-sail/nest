import * as ossDao from "./oss.dao.ts";

/**
 * 上传文件
 * @param {File} file
 */
export async function upload(file: File) {
  const result = await ossDao.upload(file);
  return result;
}

export async function statObject(id: string) {
  return await ossDao.statObject(id);
}

export async function getObject(id: string) {
  return await ossDao.getObject(id);
}

export async function deleteObject(id: string) {
  return await ossDao.deleteObject(id);
}
