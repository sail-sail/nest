import { SetMetadata, UseGuards, UseInterceptors } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { TENANT_ID } from "../common/auth/auth.constants";
import { AuthGuard } from "../common/auth/auth.guard";
import { Tran } from "../common/graphql";

import { Tenant2Service } from "./tenant2.service";

@Resolver("tenant")
export class Tenant2Resolver {
  
  constructor(
    private readonly tenant2Service: Tenant2Service,
  ) { }
  
  @Query(undefined, { name: "getLoginTenants", description: "根据 当前网址的域名+端口 获取 租户列表" })
  async getLoginTenants(
    @Args("host") host: string,
  ) {
    const t = this;
    const data = await t.tenant2Service.getLoginTenants(host);
    return data;
  }
  
  @Query(undefined, { name: "getHostTenant", description: "获取当前租户的绑定域名" })
  @SetMetadata(TENANT_ID, true)
  @UseGuards(AuthGuard)
  async getHostTenant(
  ) {
    const t = this;
    const data = await t.tenant2Service.getHostTenant();
    return data;
  }
  
}
