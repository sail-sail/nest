import { Injectable } from "@nestjs/common";
import { Readable, Stream, Duplex } from "stream";
import { FileModel } from "../file.model";
import { shortUuidV4 } from "../util/uuid";
import config from "../config";
import { commandOptions, createClient, RedisClientType } from "redis";

function bufferToStream(buffer: Buffer): Stream {
  let stream = new Stream.Readable({
    read: function(size: number) {
      this.emit("data", buffer);
      this.emit("end");
      this.emit("close");
    },
  });
  stream.emit("readable");
  return stream;
}

@Injectable()
export class TmpfileDao {
  
  private _redisClient: RedisClientType;
  
  private async getRedisClient(): Promise<RedisClientType> {
    const t = this;
    if (config.cache && config.tmpfile.type === "redis" && !t._redisClient) {
      const client = createClient(config.tmpfile);
      client.on("error", (err: Error) => {
        console.log(err.message);
      });
      await client.connect();
      t._redisClient = <RedisClientType>client;
      return t._redisClient;
    } else {
      return t._redisClient;
    }
  }
  
  async statObject(id: string) {
    const t = this;
    const client = await t.getRedisClient();
    const str = await client.hGet(id, "metaData");
    return JSON.parse(str);
  }
  
  async getObject(id: string): Promise<Stream> {
    const t = this;
    const client = await t.getRedisClient();
    const buf = await client.hGet(commandOptions({ returnBuffers: true }), id, "data");
    return bufferToStream(buf);
  }
  
  async deleteObject(id: string) {
    const t = this;
    const client = await t.getRedisClient();
    return await client.del(id);
  }
  
  async putObject(
    id: string,
    stream: Readable|Buffer|string,
    _size?: number,
    metaData?: { [key: string]: any },
  ) {
    const t = this;
    let buf: Buffer;
    if (Buffer.isBuffer(stream)) {
      buf = stream;
    } else if (stream instanceof Readable) {
      buf = await new Promise<Buffer>((resolve, reject) => {
        const buffers: Buffer[] = [];
        stream.on("data", (chunk: Buffer) => {
          buffers.push(chunk);
        });
        stream.on("end", () => {
          resolve(Buffer.concat(buffers));
        });
        stream.on("error", (err) => {
          reject(err);
        });
      });
    } else {
      buf = Buffer.from(stream);
    }
    const len = buf.length;
    const client = await t.getRedisClient();
    metaData = metaData || { };
    const metaData2 = {
      metaData,
      etag: id,
      size: len,
    };
    const multiClient = client.multi();
    multiClient.hSet(id, "data", buf);
    multiClient.hSet(id, "metaData", Buffer.from(JSON.stringify(metaData2)));
    if (config.tmpfile.expire > 0) {
      multiClient.expire(id, config.tmpfile.expire);
    }
    await multiClient.exec();
    return len;
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
    mateData["filename"] = encodeURIComponent(filename);
    const id = shortUuidV4();
    await t.putObject(id, file.data, file.size, mateData);
    return id;
  }
  
}
