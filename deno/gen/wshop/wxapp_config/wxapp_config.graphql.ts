import { defineGraphql } from "/lib/context.ts";

import type { } from "./wxapp_config.model.ts";
import * as resolver from "./wxapp_config.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar WxappConfigId

type WxappConfigModel {
  "ID"
  id: WxappConfigId!
  "图片"
  img: String!
  "名称"
  lbl: String!
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
  "系统字段"
  is_sys: Int!
}
type WxappConfigFieldComment {
  "ID"
  id: String!
  "图片"
  img: String!
  "名称"
  lbl: String!
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
input WxappConfigInput {
  "ID"
  id: WxappConfigId
  "图片"
  img: String
  "名称"
  lbl: String
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
  "备注"
  rem: String
}
input WxappConfigSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [WxappConfigId!]
  "ID"
  id: WxappConfigId
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
  "根据条件查找小程序配置总数"
  findCountWxappConfig(search: WxappConfigSearch): Int!
  "根据搜索条件和分页查找小程序配置列表"
  findAllWxappConfig(search: WxappConfigSearch, page: PageInput, sort: [SortInput!]): [WxappConfigModel!]!
  "获取小程序配置字段注释"
  getFieldCommentsWxappConfig: WxappConfigFieldComment!
  "根据条件查找第一个小程序配置"
  findOneWxappConfig(search: WxappConfigSearch, sort: [SortInput!]): WxappConfigModel
  "根据 id 查找小程序配置"
  findByIdWxappConfig(id: WxappConfigId!): WxappConfigModel
}
type Mutation {
  "批量创建小程序配置"
  createsWxappConfig(inputs: [WxappConfigInput!]!, unique_type: UniqueType): [WxappConfigId!]!
  "根据 id 修改小程序配置"
  updateByIdWxappConfig(id: WxappConfigId!, input: WxappConfigInput!): WxappConfigId!
  "根据 ids 删除小程序配置"
  deleteByIdsWxappConfig(ids: [WxappConfigId!]!): Int!
  "根据 ids 启用或者禁用小程序配置"
  enableByIdsWxappConfig(ids: [WxappConfigId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁小程序配置"
  lockByIdsWxappConfig(ids: [WxappConfigId!]!, is_locked: Int!): Int!
  "根据 ids 还原小程序配置"
  revertByIdsWxappConfig(ids: [WxappConfigId!]!): Int!
  "根据 ids 彻底删除小程序配置"
  forceDeleteByIdsWxappConfig(ids: [WxappConfigId!]!): Int!
}

`);
