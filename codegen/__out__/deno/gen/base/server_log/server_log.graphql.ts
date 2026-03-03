import { defineGraphql } from "/lib/context.ts";

import type { } from "./server_log.model.ts";
import * as resolver from "./server_log.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar ServerLogId

"系统日志日志级别"
enum ServerLogLevel {
  "TRACE"
  TRACE
  "DEBUG"
  DEBUG
  "INFO"
  INFO
  "WARN"
  WARN
  "ERROR"
  ERROR
}

type ServerLogModel {
  "ID"
  id: ServerLogId!
  "日志日期"
  log_date: NaiveDate!
  "日志日期"
  log_date_lbl: String!
  "日志时间"
  log_time: NaiveDateTime!
  "日志时间"
  log_time_lbl: String!
  "日志级别"
  level: ServerLogLevel!
  "日志级别"
  level_lbl: String!
  "模块"
  module: String!
  "请求ID"
  req_id: String!
  "日志内容"
  content: String
}
type ServerLogFieldComment {
  "ID"
  id: String!
  "日志日期"
  log_date: String!
  "日志日期"
  log_date_lbl: String!
  "日志时间"
  log_time: String!
  "日志时间"
  log_time_lbl: String!
  "日志级别"
  level: String!
  "日志级别"
  level_lbl: String!
  "模块"
  module: String!
  "请求ID"
  req_id: String!
  "日志内容"
  content: String!
}
input ServerLogInput {
  "ID"
  id: ServerLogId
  "日志日期"
  log_date: NaiveDate
  "日志日期"
  log_date_lbl: String
  "日志时间"
  log_time: NaiveDateTime
  "日志时间"
  log_time_lbl: String
  "日志级别"
  level: ServerLogLevel
  "日志级别"
  level_lbl: String
  "模块"
  module: String
  "请求ID"
  req_id: String
  "日志内容"
  content: String
}
input ServerLogSearch {
  "ID列表"
  ids: [ServerLogId!]
  "ID"
  id: ServerLogId
  "日志日期"
  log_date: [NaiveDate]
  "日志级别"
  level: [ServerLogLevel!]
  "模块"
  module: String
  module_like: String
  "请求ID"
  req_id: String
  req_id_like: String
}
type Query {
  "根据条件查找系统日志总数"
  findCountServerLog(search: ServerLogSearch): Int!
  "根据搜索条件和分页查找系统日志列表"
  findAllServerLog(search: ServerLogSearch, page: PageInput, sort: [SortInput!]): [ServerLogModel!]!
  "获取系统日志字段注释"
  getFieldCommentsServerLog: ServerLogFieldComment!
  "根据条件查找第一个系统日志"
  findOneServerLog(search: ServerLogSearch, sort: [SortInput!]): ServerLogModel
  "根据 id 查找系统日志"
  findByIdServerLog(id: ServerLogId!): ServerLogModel
  "根据 ids 查找系统日志"
  findByIdsServerLog(ids: [ServerLogId!]!): [ServerLogModel]!
}

`);
