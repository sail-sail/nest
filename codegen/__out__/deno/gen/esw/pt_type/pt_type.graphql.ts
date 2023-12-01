import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./pt_type.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar PtTypeId


type PtTypeModel {
  "ID"
  id: PtTypeId!
  "名称"
  lbl: String!
  "首页显示"
  is_home: Int!
  "首页显示"
  is_home_lbl: String!
  "推荐"
  is_recommend: Int!
  "推荐"
  is_recommend_lbl: String!
  "锁定"
  is_locked: Int!
  "锁定"
  is_locked_lbl: String!
  "启用"
  is_enabled: Int!
  "启用"
  is_enabled_lbl: String!
  "排序"
  order_by: Int!
  "备注"
  rem: String!
  "创建人"
  create_usr_id: UsrId!
  "创建人"
  create_usr_id_lbl: String
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String!
  "更新人"
  update_usr_id: UsrId!
  "更新人"
  update_usr_id_lbl: String
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String!
  "是否已删除"
  is_deleted: Int!
}
type PtTypeFieldComment {
  "ID"
  id: String!
  "名称"
  lbl: String!
  "首页显示"
  is_home: String!
  "首页显示"
  is_home_lbl: String!
  "推荐"
  is_recommend: String!
  "推荐"
  is_recommend_lbl: String!
  "锁定"
  is_locked: String!
  "锁定"
  is_locked_lbl: String!
  "启用"
  is_enabled: String!
  "启用"
  is_enabled_lbl: String!
  "排序"
  order_by: String!
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
input PtTypeInput {
  ""
  id: PtTypeId
  "名称"
  lbl: String
  "首页显示"
  is_home: Int
  "首页显示"
  is_home_lbl: String
  "推荐"
  is_recommend: Int
  "推荐"
  is_recommend_lbl: String
  "锁定"
  is_locked: Int
  "锁定"
  is_locked_lbl: String
  "启用"
  is_enabled: Int
  "启用"
  is_enabled_lbl: String
  "排序"
  order_by: Int
  "备注"
  rem: String
  "创建人"
  create_usr_id: UsrId
  "创建人"
  create_usr_id_lbl: String
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String
  "更新人"
  update_usr_id: UsrId
  "更新人"
  update_usr_id_lbl: String
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String
}
input PtTypeSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [PtTypeId!]
  "ID"
  id: PtTypeId
  "名称"
  lbl: String
  lbl_like: String
  "首页显示"
  is_home: [Int!]
  "推荐"
  is_recommend: [Int!]
  "锁定"
  is_locked: [Int!]
  "启用"
  is_enabled: [Int!]
  "排序"
  order_by: [Int!]
  "备注"
  rem: String
  rem_like: String
  "创建人"
  create_usr_id: [UsrId!]
  create_usr_id_is_null: Boolean
  "创建时间"
  create_time: [NaiveDateTime!]
  "更新人"
  update_usr_id: [UsrId!]
  update_usr_id_is_null: Boolean
  "更新时间"
  update_time: [NaiveDateTime!]
}
type Query {
  "根据条件查找据数总数"
  findCountPtType(search: PtTypeSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllPtType(search: PtTypeSearch, page: PageInput, sort: [SortInput!]): [PtTypeModel!]!
  "获取字段对应的名称"
  getFieldCommentsPtType: PtTypeFieldComment!
  "根据条件查找第一条数据"
  findOnePtType(search: PtTypeSearch, sort: [SortInput!]): PtTypeModel
  "根据id查找一条数据"
  findByIdPtType(id: PtTypeId!): PtTypeModel
  "查找order_by字段的最大值"
  findLastOrderByPtType: Int!
}
type Mutation {
  "创建一条数据"
  createPtType(model: PtTypeInput!, unique_type: UniqueType): PtTypeId!
  "根据id修改一条数据"
  updateByIdPtType(id: PtTypeId!, model: PtTypeInput!): PtTypeId!
  "根据 ids 删除数据"
  deleteByIdsPtType(ids: [PtTypeId!]!): Int!
  "根据 ids 启用或者禁用数据"
  enableByIdsPtType(ids: [PtTypeId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsPtType(ids: [PtTypeId!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsPtType(ids: [PtTypeId!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsPtType(ids: [PtTypeId!]!): Int!
}

`);
