import { Resolver, TranInterceptor } from "../common/graphql";
import { SetMetadata, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { AuthGuard } from "../common/auth/auth.guard";
import { TENANT_ID } from "../common/auth/auth.constants";
import { Page, Sort } from "../common/page.model";
import { BackgroundTaskInterceptor, BACKGROUND_TASK_RESULT } from "../common/interceptors/background_task.interceptor";

import { UsrService } from "./usr.service";
import { UsrModel, UsrSearch } from "./usr.model";

@Resolver()
@SetMetadata(TENANT_ID, true)
@UseGuards(AuthGuard)
export class UsrResolver {
  
  constructor(
    private readonly usrService: UsrService,
  ) { }
  
  @Query(undefined, { name: "findCountUsr", description: "根据条件查找据数总数" })
  async findCount(
    @Args("search") search?: UsrSearch,
  ) {
    const t = this;
    const data = await t.usrService.findCount(search);
    return data;
  }
  
  @Query(undefined, { name: "findAllUsr", description: "根据搜索条件和分页查找数据" })
  async findAll(
    @Args("search") search?: UsrSearch,
    @Args("page") page?: Page,
    @Args("sort") sort?: Sort[],
  ) {
    const t = this;
    const data = await t.usrService.findAll(search, page, sort);
    return data;
  }
  
  @SetMetadata(BACKGROUND_TASK_RESULT, { lbl: "导出用户", type: "download" })
  @UseInterceptors(BackgroundTaskInterceptor)
  @Query(undefined, { name: "exportExcelUsr", description: "根据搜索条件导出" })
  async exportExcel(
    @Args("search") search?: UsrSearch,
    @Args("sort") sort?: Sort[],
  ) {
    const t = this;
    const data = await t.usrService.exportExcel(search, sort);
    return data;
  }
  
  @Query(undefined, { name: "findOneUsr", description: "根据条件查找第一条数据" })
  async findOne(
    @Args("search") search?: UsrSearch,
  ) {
    const t = this;
    const data = await t.usrService.findOne(search);
    return data;
  }
  
  @Query(undefined, { name: "findByIdUsr", description: "根据id查找一条数据" })
  async findById(
    @Args("id") id: string,
  ) {
    const t = this;
    const data = await t.usrService.findById(id);
    return data;
  }
  
  @Mutation(undefined, { name: "createUsr", description: "创建一条数据" })
  @UseInterceptors(TranInterceptor)
  async create(
    @Args("model") model: UsrModel,
  ) {
    const t = this;
    const data = await t.usrService.create(model);
    return data;
  }
  
  @Mutation(undefined, { name: "updateByIdUsr", description: "根据id修改一条数据" })
  @UseInterceptors(TranInterceptor)
  async updateById(
    @Args("id") id: string,
    @Args("model") model: UsrModel,
  ) {
    const t = this;
    const data = await t.usrService.updateById(id, model);
    return data;
  }
  
  @Mutation(undefined, { name: "deleteByIdsUsr", description: "根据ids删除数据" })
  @UseInterceptors(TranInterceptor)
  async deleteByIds(
    @Args("ids") ids: string[],
  ) {
    const t = this;
    const data = await t.usrService.deleteByIds(ids);
    return data;
  }
  
  @SetMetadata(BACKGROUND_TASK_RESULT, { lbl: "导入用户", type: "text" })
  @UseInterceptors(BackgroundTaskInterceptor)
  @Mutation(undefined, { name: "importFileUsr", description: "导入用户" })
  async importFile(
    @Args("id") id: string,
  ) {
    const t = this;
    const data = await t.usrService.importFile(id);
    return data;
  }
  
  @Mutation(undefined, { name: "revertByIdsUsr", description: "根据ids还原数据" })
  @UseInterceptors(TranInterceptor)
  async revertByIds(
    @Args("ids") ids: string[],
  ) {
    const t = this;
    const data = await t.usrService.revertByIds(ids);
    return data;
  }
  
}
