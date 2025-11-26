import { defineGraphql } from "/lib/context.ts";

import type { } from "./dyn_page_val.model.ts";
import * as resolver from "./dyn_page_val.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar DynPageValId

type DynPageValModel {
  "ID"
  id: DynPageValId!
  "关联页面路由"
  ref_code: String!
  "关联数据ID"
  ref_id: String!
  "字段编码"
  code: String!
  "值"
  lbl: String!
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
}
type DynPageValFieldComment {
  "ID"
  id: String!
  "关联页面路由"
  ref_code: String!
  "关联数据ID"
  ref_id: String!
  "字段编码"
  code: String!
  "值"
  lbl: String!
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
input DynPageValInput {
  "ID"
  id: DynPageValId
  "关联页面路由"
  ref_code: String
  "关联数据ID"
  ref_id: String
  "字段编码"
  code: String
  "值"
  lbl: String
}
input DynPageValSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [DynPageValId!]
  "ID"
  id: DynPageValId
  "关联数据ID"
  ref_id: String
  ref_ids: [String!]
  ref_id_like: String
  "字段编码"
  code: String
  code_like: String
  "值"
  lbl: String
  lbl_like: String
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
  "根据条件查找动态页面值总数"
  findCountDynPageVal(search: DynPageValSearch): Int!
  "根据搜索条件和分页查找动态页面值列表"
  findAllDynPageVal(search: DynPageValSearch, page: PageInput, sort: [SortInput!]): [DynPageValModel!]!
  "获取动态页面值字段注释"
  getFieldCommentsDynPageVal: DynPageValFieldComment!
  "根据条件查找第一个动态页面值"
  findOneDynPageVal(search: DynPageValSearch, sort: [SortInput!]): DynPageValModel
  "根据 id 查找动态页面值"
  findByIdDynPageVal(id: DynPageValId!): DynPageValModel
  "根据 ids 查找动态页面值"
  findByIdsDynPageVal(ids: [DynPageValId!]!): [DynPageValModel]!
}
type Mutation {
  "批量创建动态页面值"
  createsDynPageVal(inputs: [DynPageValInput!]!, unique_type: UniqueType): [DynPageValId!]!
  "根据 id 修改动态页面值"
  updateByIdDynPageVal(id: DynPageValId!, input: DynPageValInput!): DynPageValId!
  "根据 ids 删除动态页面值"
  deleteByIdsDynPageVal(ids: [DynPageValId!]!): Int!
  "根据 ids 还原动态页面值"
  revertByIdsDynPageVal(ids: [DynPageValId!]!): Int!
  "根据 ids 彻底删除动态页面值"
  forceDeleteByIdsDynPageVal(ids: [DynPageValId!]!): Int!
}

`);
