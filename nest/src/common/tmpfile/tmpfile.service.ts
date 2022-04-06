import { Injectable } from "@nestjs/common";
import { Stream } from "stream";
import { TmpfileDao } from "./tmpfile.dao";

@Injectable()
export class TmpfileService {
  
  constructor(
    private readonly tmpfileDao: TmpfileDao,
  ) { }
  
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
