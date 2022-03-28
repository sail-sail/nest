import { Injectable } from "@nestjs/common";
import { ServiceException } from "../common/exceptions/service.exception";
import { TenantDao } from "../tenant/tenant.dao";
import { TenantSearch } from "../tenant/tenant.model";
import { Tenant2Dao } from "./tenant2.dao";

@Injectable()
export class Tenant2Service {
  
  constructor(
    private readonly tenantDao: TenantDao,
    private readonly tenant2Dao: Tenant2Dao,
  ) { }
  
  /**
   * 根据 当前网址的域名+端口 获取 租户列表
   * @param {string} host
   * @returns {Promise<{ id: string, lbl: string }[]>}
   * @memberof Tenant2Service
   */
  async getLoginTenants(
    host: string,
  ): Promise<{ id: string, lbl: string }[]> {
    const t = this;
    const search: TenantSearch = {
      orderBy: "order_by",
      orderDec: "asc",
    };
    if (process.env.NODE_ENV === "production") {
      search.host = host;
    }
    const models = await t.tenantDao.findAll(search);
    return models.map((model) => ({
      id: model.id,
      lbl: model.lbl,
    }));
  }
  
  /**
   * 获取当前租户的绑定域名
   * @return {Promise<{ host: string }>}
   * @memberof Tenant2Service
   */
  async getHostTenant(): Promise<{ host: string }> {
    const t = this;
    return await t.tenant2Dao.getHostTenant();
  }
  
}
