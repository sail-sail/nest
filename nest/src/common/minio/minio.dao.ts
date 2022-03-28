import { Injectable } from "@nestjs/common";
import { FileModel } from "../file.model";
import { useContext } from "../interceptors/context.interceptor";
import { shortUuidV4 } from "../util/uuid";

@Injectable()
export class MinioDao {
  
  constructor(
  ) { }
  
  /**
   * 上传文件
   * @param {FileModel[]} files
   * @memberof MinioDao
   */
  async upload(files: FileModel[]) {
    if (!files) return;
    const file = files[0];
    if (!file) return;
    if (file.limit) {
      throw "文件过大, 上传失败!";
    }
    const context = useContext();
    let mateData = { };
    if (file.mimetype) {
      mateData["content-type"] = file.mimetype;
    }
    let filename = file.filename || "";
    if (filename.length > 255) {
      filename = filename.substring(0, 255);
    }
    mateData["X-Amz-Meta-Filename"] = encodeURIComponent(filename);
    const id = shortUuidV4();
    await context.minioPutObject(id, file.data, file.data.length, mateData);
    return id;
  }
  
}
