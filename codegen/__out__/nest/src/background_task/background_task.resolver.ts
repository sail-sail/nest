import { Resolver, TranInterceptor } from "../common/graphql";
import { SetMetadata, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { AuthGuard } from "../common/auth/auth.guard";
import { TENANT_ID } from "../common/auth/auth.constants";
import { Page, Sort } from "../common/page.model";
import { BackgroundTaskInterceptor, BACKGROUND_TASK_RESULT } from "../common/interceptors/background_task.interceptor";

import { Background_taskService } from "./background_task.service";
import { Background_taskModel, Background_taskSearch } from "./background_task.model";

@Resolver()
@SetMetadata(TENANT_ID, true)
@UseGuards(AuthGuard)
export class Background_taskResolver {
  
  constructor(
    private readonly background_taskService: Background_taskService,
  ) { }
  
  @Query(undefined, { name: "findCountBackground_task", description: "根据条件查找据数总数" })
  async findCount(
    @Args("search") search?: Background_taskSearch,
  ) {
    const t = this;
    const data = await t.background_taskService.findCount(search);
    return data;
  }
  
  @Query(undefined, { name: "findAllBackground_task", description: "根据搜索条件和分页查找数据" })
  async findAll(
    @Args("search") search?: Background_taskSearch,
    @Args("page") page?: Page,
    @Args("sort") sort?: Sort[],
  ) {
    const t = this;
    const data = await t.background_taskService.findAll(search, page, sort);
    return data;
  }
  
  @SetMetadata(BACKGROUND_TASK_RESULT, { lbl: "导出后台任务", type: "download" })
  @UseInterceptors(BackgroundTaskInterceptor)
  @Query(undefined, { name: "exportExcelBackground_task", description: "根据搜索条件导出" })
  async exportExcel(
    @Args("search") search?: Background_taskSearch,
  ) {
    const t = this;
    const data = await t.background_taskService.exportExcel(search);
    return data;
  }
  
  @Query(undefined, { name: "findOneBackground_task", description: "根据条件查找第一条数据" })
  async findOne(
    @Args("search") search?: Background_taskSearch,
  ) {
    const t = this;
    const data = await t.background_taskService.findOne(search);
    return data;
  }
  
  @Query(undefined, { name: "findByIdBackground_task", description: "根据id查找一条数据" })
  async findById(
    @Args("id") id: string,
  ) {
    const t = this;
    const data = await t.background_taskService.findById(id);
    return data;
  }
  
  @Mutation(undefined, { name: "createBackground_task", description: "创建一条数据" })
  @UseInterceptors(TranInterceptor)
  async create(
    @Args("model") model: Background_taskModel,
  ) {
    const t = this;
    const data = await t.background_taskService.create(model);
    return data;
  }
  
  @Mutation(undefined, { name: "updateByIdBackground_task", description: "根据id修改一条数据" })
  @UseInterceptors(TranInterceptor)
  async updateById(
    @Args("id") id: string,
    @Args("model") model: Background_taskModel,
  ) {
    const t = this;
    const data = await t.background_taskService.updateById(id, model);
    return data;
  }
  
  @Mutation(undefined, { name: "deleteByIdsBackground_task", description: "根据ids删除数据" })
  @UseInterceptors(TranInterceptor)
  async deleteByIds(
    @Args("ids") ids: string[],
  ) {
    const t = this;
    const data = await t.background_taskService.deleteByIds(ids);
    return data;
  }
  
  @SetMetadata(BACKGROUND_TASK_RESULT, { lbl: "导入后台任务", type: "text" })
  @UseInterceptors(BackgroundTaskInterceptor)
  @Mutation(undefined, { name: "importFileBackground_task", description: "导入后台任务" })
  async importFile(
    @Args("id") id: string,
  ) {
    const t = this;
    const data = await t.background_taskService.importFile(id);
    return data;
  }
  
  @Mutation(undefined, { name: "revertByIdsBackground_task", description: "根据ids还原数据" })
  @UseInterceptors(TranInterceptor)
  async revertByIds(
    @Args("ids") ids: string[],
  ) {
    const t = this;
    const data = await t.background_taskService.revertByIds(ids);
    return data;
  }
  
}
