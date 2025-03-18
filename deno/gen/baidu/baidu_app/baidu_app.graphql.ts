import { defineGraphql } from "/lib/context.ts";

import type { } from "./baidu_app.model.ts";
import * as resolver from "./baidu_app.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar BaiduAppId

type BaiduAppModel {
  "ID"
  id: BaiduAppId!
  "应用名称"
  lbl: String!
  "AppID"
  appid: String!
  "API Key"
  api_key: String!
  "Secret Key"
  secret_key: String!
  "AES Key"
  aes_key: String!
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
type BaiduAppFieldComment {
  "ID"
  id: String!
  "应用名称"
  lbl: String!
  "AppID"
  appid: String!
  "API Key"
  api_key: String!
  "Secret Key"
  secret_key: String!
  "AES Key"
  aes_key: String!
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
input BaiduAppInput {
  "ID"
  id: BaiduAppId
  "应用名称"
  lbl: String
  "AppID"
  appid: String
  "API Key"
  api_key: String
  "Secret Key"
  secret_key: String
  "AES Key"
  aes_key: String
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
input BaiduAppSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [BaiduAppId!]
  "ID"
  id: BaiduAppId
  "应用名称"
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
  "根据条件查找百度应用总数"
  findCountBaiduApp(search: BaiduAppSearch): Int!
  "根据搜索条件和分页查找百度应用列表"
  findAllBaiduApp(search: BaiduAppSearch, page: PageInput, sort: [SortInput!]): [BaiduAppModel!]!
  "获取百度应用字段注释"
  getFieldCommentsBaiduApp: BaiduAppFieldComment!
  "根据条件查找第一个百度应用"
  findOneBaiduApp(search: BaiduAppSearch, sort: [SortInput!]): BaiduAppModel
  "根据 id 查找百度应用"
  findByIdBaiduApp(id: BaiduAppId!): BaiduAppModel
  "根据 ids 查找百度应用"
  findByIdsBaiduApp(ids: [BaiduAppId!]!): [BaiduAppModel]!
  "查找百度应用 order_by 字段的最大值"
  findLastOrderByBaiduApp: Int!
}
type Mutation {
  "批量创建百度应用"
  createsBaiduApp(inputs: [BaiduAppInput!]!, unique_type: UniqueType): [BaiduAppId!]!
  "根据 id 修改百度应用"
  updateByIdBaiduApp(id: BaiduAppId!, input: BaiduAppInput!): BaiduAppId!
  "根据 ids 删除百度应用"
  deleteByIdsBaiduApp(ids: [BaiduAppId!]!): Int!
  "根据 ids 启用或者禁用百度应用"
  enableByIdsBaiduApp(ids: [BaiduAppId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁百度应用"
  lockByIdsBaiduApp(ids: [BaiduAppId!]!, is_locked: Int!): Int!
  "根据 ids 还原百度应用"
  revertByIdsBaiduApp(ids: [BaiduAppId!]!): Int!
  "根据 ids 彻底删除百度应用"
  forceDeleteByIdsBaiduApp(ids: [BaiduAppId!]!): Int!
}

`);
