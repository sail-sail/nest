import { Injectable } from "@nestjs/common";
import { useContext } from "../interceptors/context.interceptor";

@Injectable()
export class AppDao {
  
  async generateId() {
    const context = useContext();
    return await context.shortUuidV4();
  }
  
  /**
   * 清空缓存
   * @return {*}  {Promise<boolean>}
   * @memberof AppDao
   */
  async clearCache(): Promise<boolean> {
    const context = useContext();
    await context.clearCache();
    return true;
  }
  
}
