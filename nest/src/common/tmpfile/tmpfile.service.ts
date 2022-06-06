import { Injectable } from "@nestjs/common";
import { Stream } from "stream";
import { FileModel } from "../file.model";
import { TmpfileDao } from "./tmpfile.dao";

@Injectable()
export class TmpfileService {
  
  constructor(
    private readonly tmpfileDao: TmpfileDao,
  ) { }
  
  /**
   * 上传文件
   * @param {FileModel} file
   * @memberof TmpfileService
   */
  async upload(file: FileModel) {
    const t = this;
    const result = await t.tmpfileDao.upload(file);
    return result;
  }
  
  async statObject(id: string) {
    const t = this;
    return await t.tmpfileDao.statObject(id);
  }
  
  async getObject(id: string): Promise<Stream> {
    const t = this;
    return await t.tmpfileDao.getObject(id);
  }
  
  async deleteObject(id: string) {
    const t = this;
    return await t.tmpfileDao.deleteObject(id);
  }
  
}
