import {
  type FormDataFile,
} from "oak";

import {
  _internals as ossDao,
} from "./oss.dao.ts";

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
  const result = await ossDao.upload(file);
  return result;
}

async function statObject(id: string) {
  return await ossDao.statObject(id);
}

async function getObject(id: string) {
  return await ossDao.getObject(id);
}

async function deleteObject(id: string) {
  return await ossDao.deleteObject(id);
}
