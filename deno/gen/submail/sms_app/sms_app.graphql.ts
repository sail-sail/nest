import { defineGraphql } from "/lib/context.ts";

import type { } from "./sms_app.model.ts";
import * as resolver from "./sms_app.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar SmsAppId

type SmsAppModel {
  "ID"
  id: SmsAppId!
  "名称"
  lbl: String!
  "appid"
  appid: String!
  "appkey"
  appkey: String!
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
type SmsAppFieldComment {
  "ID"
  id: String!
  "名称"
  lbl: String!
  "appid"
  appid: String!
  "appkey"
  appkey: String!
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
input SmsAppInput {
  "ID"
  id: SmsAppId
  "名称"
  lbl: String
  "appid"
  appid: String
  "appkey"
  appkey: String
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
input SmsAppSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [SmsAppId!]
  "ID"
  id: SmsAppId
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
  "根据条件查找短信应用总数"
  findCountSmsApp(search: SmsAppSearch): Int!
  "根据搜索条件和分页查找短信应用列表"
  findAllSmsApp(search: SmsAppSearch, page: PageInput, sort: [SortInput!]): [SmsAppModel!]!
  "获取短信应用字段注释"
  getFieldCommentsSmsApp: SmsAppFieldComment!
  "根据条件查找第一个短信应用"
  findOneSmsApp(search: SmsAppSearch, sort: [SortInput!]): SmsAppModel
  "根据 id 查找短信应用"
  findByIdSmsApp(id: SmsAppId!): SmsAppModel
  "查找短信应用 order_by 字段的最大值"
  findLastOrderBySmsApp: Int!
}
type Mutation {
  "批量创建短信应用"
  createsSmsApp(inputs: [SmsAppInput!]!, unique_type: UniqueType): [SmsAppId!]!
  "根据 id 修改短信应用"
  updateByIdSmsApp(id: SmsAppId!, input: SmsAppInput!): SmsAppId!
  "根据 ids 删除短信应用"
  deleteByIdsSmsApp(ids: [SmsAppId!]!): Int!
  "根据 ids 启用或者禁用短信应用"
  enableByIdsSmsApp(ids: [SmsAppId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁短信应用"
  lockByIdsSmsApp(ids: [SmsAppId!]!, is_locked: Int!): Int!
  "根据 ids 还原短信应用"
  revertByIdsSmsApp(ids: [SmsAppId!]!): Int!
  "根据 ids 彻底删除短信应用"
  forceDeleteByIdsSmsApp(ids: [SmsAppId!]!): Int!
}

`);
