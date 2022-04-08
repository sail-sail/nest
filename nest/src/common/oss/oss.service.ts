import { Injectable } from "@nestjs/common";
import { FileModel } from "../file.model";
import { MinioDao } from "./minio.dao";
import config from "../config";

@Injectable()
export class OssService {
  
  private ossDao: MinioDao = undefined;
  
  constructor(
    private readonly minioDao: MinioDao,
  ) {
    const t = this;
    if (config.oss.type === "minio") {
      t.ossDao = minioDao;
    } else {
      throw `config.oss.type 未知的oss类型 ${ config.oss.type }`;
    }
  }
  
  /**
   * 上传文件
   * @param {FileModel} file
   * @memberof OssService
   */
  async upload(file: FileModel) {
    const t = this;
    const result = await t.ossDao.upload(file);
    return result;
  }
  
  async getObject(objectName: string) {
    const t = this;
    return await t.ossDao.getObject(objectName);
  }
  
  async deleteObject(objectName: string) {
    const t = this;
    return await t.ossDao.deleteObject(objectName);
  }
  
  async statObject(objectName: string) {
    const t = this;
    return await t.ossDao.statObject(objectName);
  }
  
}
