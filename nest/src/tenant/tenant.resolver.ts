import { Resolver, Tran } from "../common/graphql";
import { SetMetadata, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { AuthGuard } from "../common/auth/auth.guard";
import { TENANT_ID } from "../common/auth/auth.constants";
import { PageModel } from "../common/page.model";

import { TenantService } from "./tenant.service";
import { TenantModel, TenantSearch } from "./tenant.model";

@Resolver()
@SetMetadata(TENANT_ID, true)
@UseGuards(AuthGuard)
export class TenantResolver {
  
  constructor(
    private readonly tenantService: TenantService,
  ) { }
  
  @Query(undefined, { name: "findCountTenant", description: "根据条件查找据数总数" })
  async findCount(
    @Args("search") search?: TenantSearch,
  ) {
    const t = this;
    const data = await t.tenantService.findCount(search);
    return data;
  }
  
  @Query(undefined, { name: "findAllTenant", description: "根据搜索条件和分页查找数据" })
  async findAll(
    @Args("search") search?: TenantSearch,
    @Args("page") pageModel?: PageModel,
  ) {
    const t = this;
    const data = await t.tenantService.findAll(search, pageModel);
    return data;
  }
  
  @Query(undefined, { name: "exportExcelTenant", description: "根据搜索条件导出" })
  async exportExcel(
    @Args("search") search?: TenantSearch,
  ) {
    const t = this;
    const data = await t.tenantService.exportExcel(search);
    return data;
  }
  
  @Query(undefined, { name: "findOneTenant", description: "根据条件查找第一条数据" })
  async findOne(
    @Args("search") search?: TenantSearch,
  ) {
    const t = this;
    const data = await t.tenantService.findOne(search);
    return data;
  }
  
  @Query(undefined, { name: "findByIdTenant", description: "根据id查找一条数据" })
  async findById(
    @Args("id") id: string,
  ) {
    const t = this;
    const data = await t.tenantService.findById(id);
    return data;
  }
  
  @Mutation(undefined, { name: "createTenant", description: "创建一条数据" })
  @UseInterceptors(Tran)
  async create(
    @Args("model") model: TenantModel,
  ) {
    const t = this;
    const data = await t.tenantService.create(model);
    return data;
  }
  
  @Mutation(undefined, { name: "updateByIdTenant", description: "根据id修改一条数据" })
  @UseInterceptors(Tran)
  async updateById(
    @Args("id") id: string,
    @Args("model") model: TenantModel,
  ) {
    const t = this;
    const data = await t.tenantService.updateById(id, model);
    return data;
  }
  
  @Mutation(undefined, { name: "deleteByIdsTenant", description: "根据ids删除数据" })
  @UseInterceptors(Tran)
  async deleteByIds(
    @Args("ids") ids: string[],
  ) {
    const t = this;
    const data = await t.tenantService.deleteByIds(ids);
    return data;
  }
  
  @Mutation(undefined, { name: "revertByIdsTenant", description: "根据ids还原数据" })
  @UseInterceptors(Tran)
  async revertByIds(
    @Args("ids") ids: string[],
  ) {
    const t = this;
    const data = await t.tenantService.revertByIds(ids);
    return data;
  }
  
  @Query(undefined, { name: "findLastOrderByTenant", description: "查找order_by字段的最大值" })
  async findLastOrderBy() {
    const t = this;
    const data = await t.tenantService.findLastOrderBy();
    return data;
  }
  
}
