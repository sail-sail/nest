import { Injectable } from "@nestjs/common";
import { FileModel } from "../file.model";
import { shortUuidV4 } from "../util/uuid";
import * as Minio from "minio";
import { Readable } from "stream";
import config from "../config";

@Injectable()
export class MinioDao {
  
  constructor(
  ) { }
    
  private _minioClient: Minio.Client = undefined;
  
  private async getMinioClient(): Promise<typeof client> {
    const t = this;
    if (t._minioClient) return t._minioClient;
    const client = new Minio.Client({
      endPoint: config.oss.endPoint,
      port: config.oss.port || 9000,
      useSSL: false,
      accessKey: config.oss.accessKey,
      secretKey: config.oss.secretKey,
    });
    const _bucketExists = await client.bucketExists(config.oss.bucket);
    if (!_bucketExists) {
      await client.makeBucket(config.oss.bucket, config.oss.region || "us-east-1");
    }
    t._minioClient = client;
    return client;
  }
  
  async putObject(objectName: string, stream: Readable|Buffer|string, size?: number, metaData?: { [key: string]: any }) {
    const t = this;
    const client = await t.getMinioClient();
    const uploadedObjectInfo = await client.putObject(config.oss.bucket, objectName, stream, size, metaData);
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
  
  async getObject(objectName: string) {
    const t = this;
    const client = await t.getMinioClient();
    const stream = await client.getObject(config.oss.bucket, objectName);
    return stream;
  }
  
  async deleteObject(objectName: string) {
    const t = this;
    const client = await t.getMinioClient();
    await client.removeObject(config.oss.bucket, objectName);
  }
  
  async statObject(objectName: string) {
    const t = this;
    const client = await t.getMinioClient();
    const stat = await client.statObject(config.oss.bucket, objectName);
    return stat;
  }
  
}
