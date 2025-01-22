import { defineGraphql } from "/lib/context.ts";

import type { } from "./login_log.model.ts";
import * as resolver from "./login_log.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar LoginLogId

"登录日志类型"
enum LoginLogType {
  "账号"
  account
}

type LoginLogModel {
  "ID"
  id: LoginLogId!
  "类型"
  type: LoginLogType!
  "类型"
  type_lbl: String!
  "用户名"
  username: String!
  "登录成功"
  is_succ: Int!
  "登录成功"
  is_succ_lbl: String!
  "IP"
  ip: String!
  "登录时间"
  create_time: NaiveDateTime
  "登录时间"
  create_time_lbl: String!
  "已删除"
  is_deleted: Int!
}
type LoginLogFieldComment {
  "ID"
  id: String!
  "类型"
  type: String!
  "类型"
  type_lbl: String!
  "用户名"
  username: String!
  "登录成功"
  is_succ: String!
  "登录成功"
  is_succ_lbl: String!
  "IP"
  ip: String!
  "登录时间"
  create_time: String!
  "登录时间"
  create_time_lbl: String!
}
input LoginLogInput {
  "ID"
  id: LoginLogId
  "类型"
  type: LoginLogType
  "类型"
  type_lbl: String
  "用户名"
  username: String
  "登录成功"
  is_succ: Int
  "登录成功"
  is_succ_lbl: String
  "IP"
  ip: String
}
input LoginLogSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [LoginLogId!]
  "ID"
  id: LoginLogId
  "类型"
  type: [LoginLogType!]
  "用户名"
  username: String
  username_like: String
  "登录成功"
  is_succ: [Int!]
  "IP"
  ip: String
  ip_like: String
  "登录时间"
  create_time: [NaiveDateTime]
}
type Query {
  "根据条件查找登录日志总数"
  findCountLoginLog(search: LoginLogSearch): Int!
  "根据搜索条件和分页查找登录日志列表"
  findAllLoginLog(search: LoginLogSearch, page: PageInput, sort: [SortInput!]): [LoginLogModel!]!
  "获取登录日志字段注释"
  getFieldCommentsLoginLog: LoginLogFieldComment!
  "根据条件查找第一个登录日志"
  findOneLoginLog(search: LoginLogSearch, sort: [SortInput!]): LoginLogModel
  "根据 id 查找登录日志"
  findByIdLoginLog(id: LoginLogId!): LoginLogModel
}
type Mutation {
  "根据 ids 删除登录日志"
  deleteByIdsLoginLog(ids: [LoginLogId!]!): Int!
  "根据 ids 还原登录日志"
  revertByIdsLoginLog(ids: [LoginLogId!]!): Int!
  "根据 ids 彻底删除登录日志"
  forceDeleteByIdsLoginLog(ids: [LoginLogId!]!): Int!
}

`);
