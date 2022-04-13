import { Injectable } from "@nestjs/common";
import { Readable } from "stream";
import * as Minio from "minio";
import { FileModel } from "../file.model";
import { shortUuidV4 } from "../util/uuid";
import config from "../config";

// function bufferToStream(buffer: Buffer): Stream {
//   let stream = new Stream.Readable({
//     read: function(size: number) {
//       this.emit("data", buffer);
//       this.emit("end");
//       this.emit("close");
//     },
//   });
//   stream.emit("readable");
//   return stream;
// }

@Injectable()
export class TmpfileDao {
  
  private _minioClient: Minio.Client;
  
  private async getMinioClient(): Promise<typeof client> {
    const t = this;
    if (t._minioClient) return t._minioClient;
    const client = new Minio.Client({
      endPoint: config.tmpfile.endPoint,
      port: config.tmpfile.port || 9000,
      useSSL: false,
      accessKey: config.tmpfile.accessKey,
      secretKey: config.tmpfile.secretKey,
    });
    const _bucketExists = await client.bucketExists(config.tmpfile.bucket);
    if (!_bucketExists) {
      await client.makeBucket(config.tmpfile.bucket, config.tmpfile.region || "us-east-1");
    }
    t._minioClient = client;
    return client;
  }
  
  async statObject(objectName: string) {
    const t = this;
    const client = await t.getMinioClient();
    const stat = await client.statObject(config.tmpfile.bucket, objectName);
    return stat;
  }
  
  async getObject(objectName: string) {
    const t = this;
    const client = await t.getMinioClient();
    const stream = await client.getObject(config.tmpfile.bucket, objectName);
    return stream;
  }
  
  async deleteObject(objectName: string) {
    const t = this;
    const client = await t.getMinioClient();
    await client.removeObject(config.tmpfile.bucket, objectName);
  }
  
  async putObject(
    objectName: string,
    stream: Readable|Buffer|string,
    size?: number,
    metaData?: { [key: string]: any },
  ) {
    const t = this;
    const client = await t.getMinioClient();
    const uploadedObjectInfo = await client.putObject(config.tmpfile.bucket, objectName, stream, size, metaData);
    return uploadedObjectInfo;
  }
  
  /**
   * 上传文件
   * @param {FileModel} file
   * @memberof MinioDao
   */
  async upload(file: FileModel) {
    if (!file) return;
    if (file.limit) {
      throw "文件过大, 上传失败!";
    }
    const t = this;
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
    await t.putObject(id, file.data, file.size, mateData);
    return id;
  }
  
}
