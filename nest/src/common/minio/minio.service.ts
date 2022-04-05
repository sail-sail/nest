import { Injectable } from "@nestjs/common";
import { FileModel } from "../file.model";
import { MinioDao } from "./minio.dao";

@Injectable()
export class MinioService {
  
  constructor(
    private readonly minioDao: MinioDao,
  ) { }
  
  /**
   * 上传文件
   * @param {FileModel} file
   * @memberof MinioService
   */
  async upload(file: FileModel) {
    const t = this;
    const result = await t.minioDao.upload(file);
    return result;
  }
  
}
