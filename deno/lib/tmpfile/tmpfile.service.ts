import {
  type FormDataFile,
} from "oak";

import {
  _internals as tmpfileDao,
} from "./tmpfile.dao.ts";

export const _internals = {
  upload,
  statObject,
  getObject,
  deleteObject,
};

/**
 * 上传文件
 * @param {FormDataFile} file
 */
async function upload(file: FormDataFile) {
  const result = await tmpfileDao.upload(file);
  return result;
}

async function statObject(id: string) {
  return await tmpfileDao.statObject(id);
}

async function getObject(id: string) {
  return await tmpfileDao.getObject(id);
}

async function deleteObject(id: string) {
  return await tmpfileDao.deleteObject(id);
}
