import { FormDataFile } from "oak";
import * as tmpfileDao from "./tmpfile.dao.ts";

/**
 * 上传文件
 * @param {FormDataFile} file
 */
export async function upload(file: FormDataFile) {
  const result = await tmpfileDao.upload(file);
  return result;
}

export async function statObject(id: string) {
  return await tmpfileDao.statObject(id);
}

export async function getObject(id: string) {
  return await tmpfileDao.getObject(id);
}

export async function deleteObject(id: string) {
  return await tmpfileDao.deleteObject(id);
}
