import { defineGraphql } from "/lib/context.ts";

import type { } from "./options.model.ts";
import * as resolver from "./options.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar OptionsId

type OptionsModel {
  "ID"
  id: OptionsId!
  "名称"
  lbl: String!
  "键"
  ky: String!
  "值"
  val: String!
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
  "版本号"
  version: Int!
  "已删除"
  is_deleted: Int!
  "系统字段"
  is_sys: Int!
}
type OptionsFieldComment {
  "ID"
  id: String!
  "名称"
  lbl: String!
  "键"
  ky: String!
  "值"
  val: String!
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
input OptionsInput {
  "ID"
  id: OptionsId
  "名称"
  lbl: String
  "键"
  ky: String
  "值"
  val: String
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
  "版本号"
  version: Int
}
input OptionsSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [OptionsId!]
  "关键字"
  keyword: String
  "ID"
  id: OptionsId
  "名称"
  lbl: String
  lbl_like: String
  "键"
  ky: String
  ky_like: String
  "值"
  val: String
  val_like: String
  "启用"
  is_enabled: [Int!]
  "备注"
  rem: String
  rem_like: String
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
  "根据条件查找系统选项总数"
  findCountOptions(search: OptionsSearch): Int!
  "根据搜索条件和分页查找系统选项列表"
  findAllOptions(search: OptionsSearch, page: PageInput, sort: [SortInput!]): [OptionsModel!]!
  "获取系统选项字段注释"
  getFieldCommentsOptions: OptionsFieldComment!
  "根据条件查找第一个系统选项"
  findOneOptions(search: OptionsSearch, sort: [SortInput!]): OptionsModel
  "根据 id 查找系统选项"
  findByIdOptions(id: OptionsId!): OptionsModel
  "根据 ids 查找系统选项"
  findByIdsOptions(ids: [OptionsId!]!): [OptionsModel]!
  "查找系统选项 order_by 字段的最大值"
  findLastOrderByOptions: Int!
}
type Mutation {
  "批量创建系统选项"
  createsOptions(inputs: [OptionsInput!]!, unique_type: UniqueType): [OptionsId!]!
  "根据 id 修改系统选项"
  updateByIdOptions(id: OptionsId!, input: OptionsInput!): OptionsId!
  "根据 ids 删除系统选项"
  deleteByIdsOptions(ids: [OptionsId!]!): Int!
  "根据 ids 启用或者禁用系统选项"
  enableByIdsOptions(ids: [OptionsId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁系统选项"
  lockByIdsOptions(ids: [OptionsId!]!, is_locked: Int!): Int!
  "根据 ids 还原系统选项"
  revertByIdsOptions(ids: [OptionsId!]!): Int!
  "根据 ids 彻底删除系统选项"
  forceDeleteByIdsOptions(ids: [OptionsId!]!): Int!
}

`);
