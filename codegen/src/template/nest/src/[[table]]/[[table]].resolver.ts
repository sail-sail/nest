<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
#><#
const hasSummary = columns.some((column) => column.showSummary);
#>import { Resolver, Tran } from "../common/graphql";
import { SetMetadata, UseGuards, UseInterceptors } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { AuthGuard } from "../common/auth/auth.guard";
import { TENANT_ID } from "../common/auth/auth.constants";
import { PageModel } from "../common/page.model";

import { <#=tableUp#>Service } from "./<#=table#>.service";
import { <#=tableUp#>Model, <#=tableUp#>Search } from "./<#=table#>.model";

@Resolver()
@SetMetadata(TENANT_ID, true)
@UseGuards(AuthGuard)
export class <#=tableUp#>Resolver {
  
  constructor(
    private readonly <#=table#>Service: <#=tableUp#>Service,
  ) { }
  
  @Query(undefined, { name: "findCount<#=tableUp#>", description: "根据条件查找据数总数" })
  async findCount(
    @Args("search") search?: <#=tableUp#>Search,
  ) {
    const t = this;
    const data = await t.<#=table#>Service.findCount(search);
    return data;
  }
  
  @Query(undefined, { name: "findAll<#=tableUp#>", description: "根据搜索条件和分页查找数据" })
  async findAll(
    @Args("search") search?: <#=tableUp#>Search,
    @Args("page") pageModel?: PageModel,
  ) {
    const t = this;
    const data = await t.<#=table#>Service.findAll(search, pageModel);
    return data;
  }
  
  @Query(undefined, { name: "exportExcel<#=tableUp#>", description: "根据搜索条件导出" })
  async exportExcel(
    @Args("search") search?: <#=tableUp#>Search,
  ) {
    const t = this;
    const data = await t.<#=table#>Service.exportExcel(search);
    return data;
  }<#
  if (hasSummary) {
  #>
  
  @Query(undefined, { name: "findSummary<#=tableUp#>", description: "根据搜索条件查找合计" })
  async findSummary(
    @Args("search") search?: <#=tableUp#>Search,
  ) {
    const t = this;
    const data = await t.<#=table#>Service.findSummary(search);
    return data;
  }<#
  }
  #>
  
  @Query(undefined, { name: "findOne<#=tableUp#>", description: "根据条件查找第一条数据" })
  async findOne(
    @Args("search") search?: <#=tableUp#>Search,
  ) {
    const t = this;
    const data = await t.<#=table#>Service.findOne(search);
    return data;
  }
  
  @Query(undefined, { name: "findById<#=tableUp#>", description: "根据id查找一条数据" })
  async findById(
    @Args("id") id: string,
  ) {
    const t = this;
    const data = await t.<#=table#>Service.findById(id);
    return data;
  }
  
  @Mutation(undefined, { name: "create<#=tableUp#>", description: "创建一条数据" })
  @UseInterceptors(Tran)
  async create(
    @Args("model") model: <#=tableUp#>Model,
  ) {
    const t = this;
    const data = await t.<#=table#>Service.create(model);
    return data;
  }
  
  @Mutation(undefined, { name: "updateById<#=tableUp#>", description: "根据id修改一条数据" })
  @UseInterceptors(Tran)
  async updateById(
    @Args("id") id: string,
    @Args("model") model: <#=tableUp#>Model,
  ) {
    const t = this;
    const data = await t.<#=table#>Service.updateById(id, model);
    return data;
  }
  
  @Mutation(undefined, { name: "deleteByIds<#=tableUp#>", description: "根据ids删除数据" })
  @UseInterceptors(Tran)
  async deleteByIds(
    @Args("ids") ids: string[],
  ) {
    const t = this;
    const data = await t.<#=table#>Service.deleteByIds(ids);
    return data;
  }
  
  @Mutation(undefined, { name: "revertByIds<#=tableUp#>", description: "根据ids还原数据" })
  @UseInterceptors(Tran)
  async revertByIds(
    @Args("ids") ids: string[],
  ) {
    const t = this;
    const data = await t.<#=table#>Service.revertByIds(ids);
    return data;
  }<#
  if (hasOrderBy) {
  #>
  
  @Query(undefined, { name: "findLastOrderBy<#=tableUp#>", description: "查找order_by字段的最大值" })
  async findLastOrderBy() {
    const t = this;
    const data = await t.<#=table#>Service.findLastOrderBy();
    return data;
  }<#
  }
  #>
  
}
