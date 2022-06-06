import { SetMetadata, UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { TENANT_ID } from "../common/auth/auth.constants";
import { AuthGuard } from "../common/auth/auth.guard";

import { Menu2Service } from "./menu2.service";

@Resolver()
@SetMetadata(TENANT_ID, true)
@UseGuards(AuthGuard)
export class Menu2Resolver {
  
  constructor(
    private readonly menu2Service: Menu2Service,
  ) { }
  
  @Query(undefined, { name: "getMenus", description: "获取主页菜单" })
  async getMenus(
    @Args("type") type: string,
  ) {
    const t = this;
    const data = await t.menu2Service.getMenus(type);
    return data;
  }
  
}
