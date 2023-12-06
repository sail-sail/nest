import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./pt.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar PtId


type PtModel {
  "ID"
  id: PtId!
  "图标"
  img: String!
  "名称"
  lbl: String!
  "产品类别"
  pt_type_ids: [PtTypeId!]
  "产品类别"
  pt_type_ids_lbl: [String!]
  "价格"
  price: Decimal!
  "原价"
  original_price: Decimal!
  "新品"
  is_new: Int!
  "新品"
  is_new_lbl: String!
  "简介"
  introduct: String!
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
  "详情"
  detail: String!
  "详情顶部图片"
  detail_top_img: String!
  "详情底部图片"
  detail_bottom_img: String!
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
type PtFieldComment {
  "ID"
  id: String!
  "图标"
  img: String!
  "名称"
  lbl: String!
  "产品类别"
  pt_type_ids: String!
  "产品类别"
  pt_type_ids_lbl: String!
  "价格"
  price: String!
  "原价"
  original_price: String!
  "新品"
  is_new: String!
  "新品"
  is_new_lbl: String!
  "简介"
  introduct: String!
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
  "详情"
  detail: String!
  "详情顶部图片"
  detail_top_img: String!
  "详情底部图片"
  detail_bottom_img: String!
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
input PtInput {
  ""
  id: PtId
  "图标"
  img: String
  "名称"
  lbl: String
  "产品类别"
  pt_type_ids: [PtTypeId!]
  "产品类别"
  pt_type_ids_lbl: [String!]
  "价格"
  price: Decimal
  "原价"
  original_price: Decimal
  "新品"
  is_new: Int
  "新品"
  is_new_lbl: String
  "简介"
  introduct: String
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
  "详情"
  detail: String
  "详情顶部图片"
  detail_top_img: String
  "详情底部图片"
  detail_bottom_img: String
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
input PtSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [PtId!]
  "ID"
  id: PtId
  "图标"
  img: String
  img_like: String
  "名称"
  lbl: String
  lbl_like: String
  "产品类别"
  pt_type_ids: [PtTypeId!]
  pt_type_ids_is_null: Boolean
  "价格"
  price: [Decimal!]
  "原价"
  original_price: [Decimal!]
  "新品"
  is_new: [Int!]
  "简介"
  introduct: String
  introduct_like: String
  "锁定"
  is_locked: [Int!]
  "启用"
  is_enabled: [Int!]
  "排序"
  order_by: [Int!]
  "详情"
  detail: String
  detail_like: String
  "详情顶部图片"
  detail_top_img: String
  detail_top_img_like: String
  "详情底部图片"
  detail_bottom_img: String
  detail_bottom_img_like: String
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
  findCountPt(search: PtSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllPt(search: PtSearch, page: PageInput, sort: [SortInput!]): [PtModel!]!
  "获取字段对应的名称"
  getFieldCommentsPt: PtFieldComment!
  "根据条件查找第一条数据"
  findOnePt(search: PtSearch, sort: [SortInput!]): PtModel
  "根据id查找一条数据"
  findByIdPt(id: PtId!): PtModel
  "查找order_by字段的最大值"
  findLastOrderByPt: Int!
}
type Mutation {
  "创建一条数据"
  createPt(model: PtInput!, unique_type: UniqueType): PtId!
  "根据id修改一条数据"
  updateByIdPt(id: PtId!, model: PtInput!): PtId!
  "根据 ids 删除数据"
  deleteByIdsPt(ids: [PtId!]!): Int!
  "根据 ids 启用或者禁用数据"
  enableByIdsPt(ids: [PtId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsPt(ids: [PtId!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsPt(ids: [PtId!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsPt(ids: [PtId!]!): Int!
}

`);
