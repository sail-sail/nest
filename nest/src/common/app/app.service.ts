import { Injectable } from "@nestjs/common";
import { AppDao } from "./app.dao";

@Injectable()
export class AppService {
  
  constructor(
    private readonly appDao: AppDao,
  ) { }
  
  async generateId() {
    const t = this;
    const id = await t.appDao.generateId();
    return id;
  }
  
  /**
   * 清空缓存
   * @memberof AppService
   */
  async clearCache(): Promise<boolean> {
    const t = this;
    const data = await t.appDao.clearCache();
    return data;
  }
  
}
