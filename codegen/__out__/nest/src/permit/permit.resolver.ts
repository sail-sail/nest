import { Resolver, Tran } from "../common/graphql";
import { SetMetadata, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { AuthGuard } from "../common/auth/auth.guard";
import { TENANT_ID } from "../common/auth/auth.constants";
import { PageModel } from "../common/page.model";

import { PermitService } from "./permit.service";
import { PermitModel, PermitSearch } from "./permit.model";

@Resolver()
@SetMetadata(TENANT_ID, true)
@UseGuards(AuthGuard)
export class PermitResolver {
  
  constructor(
    private readonly permitService: PermitService,
  ) { }
  
  @Query(undefined, { name: "findCountPermit", description: "根据条件查找据数总数" })
  async findCount(
    @Args("search") search?: PermitSearch,
  ) {
    const t = this;
    const data = await t.permitService.findCount(search);
    return data;
  }
  
  @Query(undefined, { name: "findAllPermit", description: "根据搜索条件和分页查找数据" })
  async findAll(
    @Args("search") search?: PermitSearch,
    @Args("page") pageModel?: PageModel,
  ) {
    const t = this;
    const data = await t.permitService.findAll(search, pageModel);
    return data;
  }
  
  @Query(undefined, { name: "findOnePermit", description: "根据条件查找第一条数据" })
  async findOne(
    @Args("search") search?: PermitSearch,
  ) {
    const t = this;
    const data = await t.permitService.findOne(search);
    return data;
  }
  
  @Query(undefined, { name: "findByIdPermit", description: "根据id查找一条数据" })
  async findById(
    @Args("id") id: string,
  ) {
    const t = this;
    const data = await t.permitService.findById(id);
    return data;
  }
  
  @Mutation(undefined, { name: "createPermit", description: "创建一条数据" })
  @UseInterceptors(Tran)
  async create(
    @Args("model") model: PermitModel,
  ) {
    const t = this;
    const data = await t.permitService.create(model);
    return data;
  }
  
  @Mutation(undefined, { name: "updateByIdPermit", description: "根据id修改一条数据" })
  @UseInterceptors(Tran)
  async updateById(
    @Args("id") id: string,
    @Args("model") model: PermitModel,
  ) {
    const t = this;
    const data = await t.permitService.updateById(id, model);
    return data;
  }
  
  @Mutation(undefined, { name: "deleteByIdsPermit", description: "根据ids删除数据" })
  @UseInterceptors(Tran)
  async deleteByIds(
    @Args("ids") ids: string[],
  ) {
    const t = this;
    const data = await t.permitService.deleteByIds(ids);
    return data;
  }
  
  @Mutation(undefined, { name: "revertByIdsPermit", description: "根据ids还原数据" })
  @UseInterceptors(Tran)
  async revertByIds(
    @Args("ids") ids: string[],
  ) {
    const t = this;
    const data = await t.permitService.revertByIds(ids);
    return data;
  }
  
}
