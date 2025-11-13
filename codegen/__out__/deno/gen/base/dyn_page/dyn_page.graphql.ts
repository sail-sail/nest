import { defineGraphql } from "/lib/context.ts";

import type { } from "./dyn_page.model.ts";
import * as resolver from "./dyn_page.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar DynPageId

type DynPageModel {
  "ID"
  id: DynPageId!
  "路由"
  code: String!
  "名称"
  lbl: String!
  "排序"
  order_by: Int!
  "启用"
  is_enabled: Int!
  "启用"
  is_enabled_lbl: String!
  "备注"
  rem: String!
  "创建人"
  create_usr_id: UsrId!
  "创建人"
  create_usr_id_lbl: String!
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String!
  "更新人"
  update_usr_id: UsrId!
  "更新人"
  update_usr_id_lbl: String!
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String!
  "已删除"
  is_deleted: Int!
  "动态页面字段"
  dyn_page_field: [DynPageFieldModel!]!
}
type DynPageFieldComment {
  "ID"
  id: String!
  "路由"
  code: String!
  "名称"
  lbl: String!
  "排序"
  order_by: String!
  "启用"
  is_enabled: String!
  "启用"
  is_enabled_lbl: String!
  "备注"
  rem: String!
  "创建人"
  create_usr_id: String!
  "创建人"
  create_usr_id_lbl: String!
  "创建时间"
  create_time: String!
  "创建时间"
  create_time_lbl: String!
  "更新人"
  update_usr_id: String!
  "更新人"
  update_usr_id_lbl: String!
  "更新时间"
  update_time: String!
  "更新时间"
  update_time_lbl: String!
}
input DynPageInput {
  "ID"
  id: DynPageId
  "路由"
  code: String
  "名称"
  lbl: String
  "排序"
  order_by: Int
  "启用"
  is_enabled: Int
  "启用"
  is_enabled_lbl: String
  "备注"
  rem: String
  "动态页面字段"
  dyn_page_field: [DynPageFieldInput!]
}
input DynPageSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [DynPageId!]
  "ID"
  id: DynPageId
  "路由"
  code: String
  code_like: String
  "名称"
  lbl: String
  lbl_like: String
  "启用"
  is_enabled: [Int!]
  "创建人"
  create_usr_id: [UsrId!]
  "创建人"
  create_usr_id_is_null: Boolean
  "创建人"
  create_usr_id_lbl: [String!]
  "创建人"
  create_usr_id_lbl_like: String
  "更新人"
  update_usr_id: [UsrId!]
  "更新人"
  update_usr_id_is_null: Boolean
  "更新人"
  update_usr_id_lbl: [String!]
  "更新人"
  update_usr_id_lbl_like: String
}
type Query {
  "根据条件查找动态页面总数"
  findCountDynPage(search: DynPageSearch): Int!
  "根据搜索条件和分页查找动态页面列表"
  findAllDynPage(search: DynPageSearch, page: PageInput, sort: [SortInput!]): [DynPageModel!]!
  "获取动态页面字段注释"
  getFieldCommentsDynPage: DynPageFieldComment!
  "根据条件查找第一个动态页面"
  findOneDynPage(search: DynPageSearch, sort: [SortInput!]): DynPageModel
  "根据 id 查找动态页面"
  findByIdDynPage(id: DynPageId!): DynPageModel
  "根据 ids 查找动态页面"
  findByIdsDynPage(ids: [DynPageId!]!): [DynPageModel]!
  "查找动态页面 order_by 字段的最大值"
  findLastOrderByDynPage: Int!
}
type Mutation {
  "批量创建动态页面"
  createsDynPage(inputs: [DynPageInput!]!, unique_type: UniqueType): [DynPageId!]!
  "根据 id 修改动态页面"
  updateByIdDynPage(id: DynPageId!, input: DynPageInput!): DynPageId!
  "根据 ids 删除动态页面"
  deleteByIdsDynPage(ids: [DynPageId!]!): Int!
  "根据 ids 启用或者禁用动态页面"
  enableByIdsDynPage(ids: [DynPageId!]!, is_enabled: Int!): Int!
  "根据 ids 还原动态页面"
  revertByIdsDynPage(ids: [DynPageId!]!): Int!
  "根据 ids 彻底删除动态页面"
  forceDeleteByIdsDynPage(ids: [DynPageId!]!): Int!
}

`);
