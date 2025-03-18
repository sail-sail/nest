import { defineGraphql } from "/lib/context.ts";

import type { } from "./pt_type.model.ts";
import * as resolver from "./pt_type.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar PtTypeId

type PtTypeModel {
  "ID"
  id: PtTypeId!
  "图标"
  img: String!
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
type PtTypeFieldComment {
  "ID"
  id: String!
  "图标"
  img: String!
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
  "ID"
  id: PtTypeId
  "图标"
  img: String
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
}
input PtTypeSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [PtTypeId!]
  "ID"
  id: PtTypeId
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
  "根据条件查找产品类别总数"
  findCountPtType(search: PtTypeSearch): Int!
  "根据搜索条件和分页查找产品类别列表"
  findAllPtType(search: PtTypeSearch, page: PageInput, sort: [SortInput!]): [PtTypeModel!]!
  "获取产品类别字段注释"
  getFieldCommentsPtType: PtTypeFieldComment!
  "根据条件查找第一个产品类别"
  findOnePtType(search: PtTypeSearch, sort: [SortInput!]): PtTypeModel
  "根据 id 查找产品类别"
  findByIdPtType(id: PtTypeId!): PtTypeModel
  "根据 ids 查找产品类别"
  findByIdsPtType(ids: [PtTypeId!]!): [PtTypeModel]!
  "查找产品类别 order_by 字段的最大值"
  findLastOrderByPtType: Int!
}
type Mutation {
  "批量创建产品类别"
  createsPtType(inputs: [PtTypeInput!]!, unique_type: UniqueType): [PtTypeId!]!
  "根据 id 修改产品类别"
  updateByIdPtType(id: PtTypeId!, input: PtTypeInput!): PtTypeId!
  "根据 ids 删除产品类别"
  deleteByIdsPtType(ids: [PtTypeId!]!): Int!
  "根据 ids 启用或者禁用产品类别"
  enableByIdsPtType(ids: [PtTypeId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁产品类别"
  lockByIdsPtType(ids: [PtTypeId!]!, is_locked: Int!): Int!
  "根据 ids 还原产品类别"
  revertByIdsPtType(ids: [PtTypeId!]!): Int!
  "根据 ids 彻底删除产品类别"
  forceDeleteByIdsPtType(ids: [PtTypeId!]!): Int!
}

`);
