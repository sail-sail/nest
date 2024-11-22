import * as tmpfileDao from "./tmpfile.dao.ts";

/**
 * 上传文件
 */
export async function upload(
  file: File,
  opt?: {
    once?: number,
    is_public?: boolean,
    tenant_id?: string,
    db?: string,
  },
) {
  const result = await tmpfileDao.upload(file, opt);
  return result;
}

export async function putObject(
  id: string,
  content: Uint8Array,
  contentType?: string,
) {
  return await tmpfileDao.putObject(id, content, contentType);
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
