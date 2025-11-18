import { defineGraphql } from "/lib/context.ts";

import type { } from "./dyn_page_data.model.ts";
import * as resolver from "./dyn_page_data.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar DynPageDataId

type DynPageDataModel {
  "ID"
  id: DynPageDataId!
  "关联页面路由"
  ref_code: String!
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
  "动态页面数据"
  dyn_page_data: JSONObject!
}
type DynPageDataFieldComment {
  "ID"
  id: String!
  "关联页面路由"
  ref_code: String!
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
input DynPageDataInput {
  "ID"
  id: DynPageDataId
  "关联页面路由"
  ref_code: String
  "动态页面数据"
  dyn_page_data: JSONObject
}
input DynPageDataSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [DynPageDataId!]
  "ID"
  id: DynPageDataId
  "关联页面路由"
  ref_code: String
  ref_code_like: String
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
  "动态页面数据"
  dyn_page_data: JSONObject
}
type Query {
  "根据条件查找动态页面数据总数"
  findCountDynPageData(search: DynPageDataSearch): Int!
  "根据搜索条件和分页查找动态页面数据列表"
  findAllDynPageData(search: DynPageDataSearch, page: PageInput, sort: [SortInput!]): [DynPageDataModel!]!
  "获取动态页面数据字段注释"
  getFieldCommentsDynPageData: DynPageDataFieldComment!
  "根据条件查找第一个动态页面数据"
  findOneDynPageData(search: DynPageDataSearch, sort: [SortInput!]): DynPageDataModel
  "根据 id 查找动态页面数据"
  findByIdDynPageData(id: DynPageDataId!): DynPageDataModel
  "根据 ids 查找动态页面数据"
  findByIdsDynPageData(ids: [DynPageDataId!]!): [DynPageDataModel]!
}
type Mutation {
  "批量创建动态页面数据"
  createsDynPageData(inputs: [DynPageDataInput!]!, unique_type: UniqueType): [DynPageDataId!]!
  "根据 id 修改动态页面数据"
  updateByIdDynPageData(id: DynPageDataId!, input: DynPageDataInput!): DynPageDataId!
  "根据 ids 删除动态页面数据"
  deleteByIdsDynPageData(ids: [DynPageDataId!]!): Int!
  "根据 ids 还原动态页面数据"
  revertByIdsDynPageData(ids: [DynPageDataId!]!): Int!
  "根据 ids 彻底删除动态页面数据"
  forceDeleteByIdsDynPageData(ids: [DynPageDataId!]!): Int!
}

`);
