import { Resolver, Tran } from "../common/graphql";
import { SetMetadata, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { AuthGuard } from "../common/auth/auth.guard";
import { TENANT_ID } from "../common/auth/auth.constants";
import { PageModel } from "../common/page.model";

import { RoleService } from "./role.service";
import { RoleModel, RoleSearch } from "./role.model";

@Resolver()
@SetMetadata(TENANT_ID, true)
@UseGuards(AuthGuard)
export class RoleResolver {
  
  constructor(
    private readonly roleService: RoleService,
  ) { }
  
  @Query(undefined, { name: "findCountRole", description: "根据条件查找据数总数" })
  async findCount(
    @Args("search") search?: RoleSearch,
  ) {
    const t = this;
    const data = await t.roleService.findCount(search);
    return data;
  }
  
  @Query(undefined, { name: "findAllRole", description: "根据搜索条件和分页查找数据" })
  async findAll(
    @Args("search") search?: RoleSearch,
    @Args("page") pageModel?: PageModel,
  ) {
    const t = this;
    const data = await t.roleService.findAll(search, pageModel);
    return data;
  }
  
  @Query(undefined, { name: "exportExcelRole", description: "根据搜索条件导出" })
  async exportExcel(
    @Args("search") search?: RoleSearch,
  ) {
    const t = this;
    const data = await t.roleService.exportExcel(search);
    return data;
  }
  
  @Query(undefined, { name: "findOneRole", description: "根据条件查找第一条数据" })
  async findOne(
    @Args("search") search?: RoleSearch,
  ) {
    const t = this;
    const data = await t.roleService.findOne(search);
    return data;
  }
  
  @Query(undefined, { name: "findByIdRole", description: "根据id查找一条数据" })
  async findById(
    @Args("id") id: string,
  ) {
    const t = this;
    const data = await t.roleService.findById(id);
    return data;
  }
  
  @Mutation(undefined, { name: "createRole", description: "创建一条数据" })
  @UseInterceptors(Tran)
  async create(
    @Args("model") model: RoleModel,
  ) {
    const t = this;
    const data = await t.roleService.create(model);
    return data;
  }
  
  @Mutation(undefined, { name: "updateByIdRole", description: "根据id修改一条数据" })
  @UseInterceptors(Tran)
  async updateById(
    @Args("id") id: string,
    @Args("model") model: RoleModel,
  ) {
    const t = this;
    const data = await t.roleService.updateById(id, model);
    return data;
  }
  
  @Mutation(undefined, { name: "deleteByIdsRole", description: "根据ids删除数据" })
  @UseInterceptors(Tran)
  async deleteByIds(
    @Args("ids") ids: string[],
  ) {
    const t = this;
    const data = await t.roleService.deleteByIds(ids);
    return data;
  }
  
  @Mutation(undefined, { name: "revertByIdsRole", description: "根据ids还原数据" })
  @UseInterceptors(Tran)
  async revertByIds(
    @Args("ids") ids: string[],
  ) {
    const t = this;
    const data = await t.roleService.revertByIds(ids);
    return data;
  }
  
}
