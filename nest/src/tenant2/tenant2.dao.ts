import { Injectable } from "@nestjs/common";
import { useContext } from "../common/interceptors/context.interceptor";

@Injectable()
export class Tenant2Dao {
  
  constructor(
  ) { }
  
  /**
   * 获取当前租户的绑定域名
   * @return {Promise<{ host: string; }>}
   * @memberof Tenant2Dao
   */
  async getHostTenant(): Promise<{ host: string; }> {
    const t = this;
    const context = useContext();
    let sql = `
      select
        t.host
      from tenant t
      where
        t.is_deleted = 0
        and t.is_enabled = 1
        and t.id = ?
    `;
    const result = await context.queryOne(sql, [ context.authModel.tenant_id ]);
    return { host: result?.host };
  }
  
}
