import { Resolver, TranInterceptor } from "../common/graphql";
import { SetMetadata, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { AuthGuard } from "../common/auth/auth.guard";
import { TENANT_ID } from "../common/auth/auth.constants";
import { PageModel } from "../common/page.model";
import { BackgroundTaskInterceptor, BACKGROUND_TASK_RESULT } from "../common/interceptors/background_task.interceptor";

import { MenuService } from "./menu.service";
import { MenuModel, MenuSearch } from "./menu.model";

@Resolver()
@SetMetadata(TENANT_ID, true)
@UseGuards(AuthGuard)
export class MenuResolver {
  
  constructor(
    private readonly menuService: MenuService,
  ) { }
  
  @Query(undefined, { name: "findCountMenu", description: "根据条件查找据数总数" })
  async findCount(
    @Args("search") search?: MenuSearch,
  ) {
    const t = this;
    const data = await t.menuService.findCount(search);
    return data;
  }
  
  @Query(undefined, { name: "findAllMenu", description: "根据搜索条件和分页查找数据" })
  async findAll(
    @Args("search") search?: MenuSearch,
    @Args("page") pageModel?: PageModel,
  ) {
    const t = this;
    const data = await t.menuService.findAll(search, pageModel);
    return data;
  }
  
  @SetMetadata(BACKGROUND_TASK_RESULT, { lbl: "导出菜单", type: "download" })
  @UseInterceptors(BackgroundTaskInterceptor)
  @Query(undefined, { name: "exportExcelMenu", description: "根据搜索条件导出" })
  async exportExcel(
    @Args("search") search?: MenuSearch,
  ) {
    const t = this;
    const data = await t.menuService.exportExcel(search);
    return data;
  }
  
  @Query(undefined, { name: "findOneMenu", description: "根据条件查找第一条数据" })
  async findOne(
    @Args("search") search?: MenuSearch,
  ) {
    const t = this;
    const data = await t.menuService.findOne(search);
    return data;
  }
  
  @Query(undefined, { name: "findByIdMenu", description: "根据id查找一条数据" })
  async findById(
    @Args("id") id: string,
  ) {
    const t = this;
    const data = await t.menuService.findById(id);
    return data;
  }
  
  @Mutation(undefined, { name: "createMenu", description: "创建一条数据" })
  @UseInterceptors(TranInterceptor)
  async create(
    @Args("model") model: MenuModel,
  ) {
    const t = this;
    const data = await t.menuService.create(model);
    return data;
  }
  
  @Mutation(undefined, { name: "updateByIdMenu", description: "根据id修改一条数据" })
  @UseInterceptors(TranInterceptor)
  async updateById(
    @Args("id") id: string,
    @Args("model") model: MenuModel,
  ) {
    const t = this;
    const data = await t.menuService.updateById(id, model);
    return data;
  }
  
  @Mutation(undefined, { name: "deleteByIdsMenu", description: "根据ids删除数据" })
  @UseInterceptors(TranInterceptor)
  async deleteByIds(
    @Args("ids") ids: string[],
  ) {
    const t = this;
    const data = await t.menuService.deleteByIds(ids);
    return data;
  }
  
  @SetMetadata(BACKGROUND_TASK_RESULT, { lbl: "导入菜单", type: "download" })
  @UseInterceptors(BackgroundTaskInterceptor)
  @Mutation(undefined, { name: "importFileMenu", description: "导入菜单" })
  async importFile(
    @Args("id") id: string,
  ) {
    const t = this;
    const data = await t.menuService.importFile(id);
    return data;
  }
  
  @Mutation(undefined, { name: "revertByIdsMenu", description: "根据ids还原数据" })
  @UseInterceptors(TranInterceptor)
  async revertByIds(
    @Args("ids") ids: string[],
  ) {
    const t = this;
    const data = await t.menuService.revertByIds(ids);
    return data;
  }
  
  @Query(undefined, { name: "findLastOrderByMenu", description: "查找order_by字段的最大值" })
  async findLastOrderBy() {
    const t = this;
    const data = await t.menuService.findLastOrderBy();
    return data;
  }
  
}
