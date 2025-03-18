import { defineGraphql } from "/lib/context.ts";

import type { } from "./sms_send_record.model.ts";
import * as resolver from "./sms_send_record.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar SmsSendRecordId

"短信发送记录状态"
enum SmsSendRecordStatus {
  "成功"
  success
  "失败"
  failure
  "发送中"
  sending
  "暂停发送"
  paused
}

type SmsSendRecordModel {
  "ID"
  id: SmsSendRecordId!
  "短信应用"
  sms_app_id: SmsAppId!
  "短信应用"
  sms_app_id_lbl: String!
  "接收人"
  send_to: String!
  "内容"
  content: String!
  "状态"
  status: SmsSendRecordStatus!
  "状态"
  status_lbl: String!
  "发送时间"
  send_time: NaiveDateTime
  "发送时间"
  send_time_lbl: String!
  "标签"
  tag: String!
  "消息"
  msg: String!
  "创建人"
  create_usr_id: UsrId!
  "创建人"
  create_usr_id_lbl: String!
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String!
  "已删除"
  is_deleted: Int!
}
type SmsSendRecordFieldComment {
  "ID"
  id: String!
  "短信应用"
  sms_app_id: String!
  "短信应用"
  sms_app_id_lbl: String!
  "接收人"
  send_to: String!
  "内容"
  content: String!
  "状态"
  status: String!
  "状态"
  status_lbl: String!
  "发送时间"
  send_time: String!
  "发送时间"
  send_time_lbl: String!
  "标签"
  tag: String!
  "消息"
  msg: String!
  "创建人"
  create_usr_id: String!
  "创建人"
  create_usr_id_lbl: String!
  "创建时间"
  create_time: String!
  "创建时间"
  create_time_lbl: String!
}
input SmsSendRecordInput {
  "ID"
  id: SmsSendRecordId
  "短信应用"
  sms_app_id: SmsAppId
  "短信应用"
  sms_app_id_lbl: String
  "接收人"
  send_to: String
  "内容"
  content: String
  "状态"
  status: SmsSendRecordStatus
  "状态"
  status_lbl: String
  "发送时间"
  send_time: NaiveDateTime
  "发送时间"
  send_time_lbl: String
  "发送时间"
  send_time_save_null: Boolean
  "标签"
  tag: String
  "消息"
  msg: String
}
input SmsSendRecordSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [SmsSendRecordId!]
  "ID"
  id: SmsSendRecordId
  "短信应用"
  sms_app_id: [SmsAppId!]
  "短信应用"
  sms_app_id_is_null: Boolean
  "短信应用"
  sms_app_id_lbl: [String!]
  "短信应用"
  sms_app_id_lbl_like: String
  "接收人"
  send_to: String
  send_to_like: String
  "创建人"
  create_usr_id: [UsrId!]
  "创建人"
  create_usr_id_is_null: Boolean
  "创建人"
  create_usr_id_lbl: [String!]
  "创建人"
  create_usr_id_lbl_like: String
  "创建时间"
  create_time: [NaiveDateTime]
}
type Query {
  "根据条件查找短信发送记录总数"
  findCountSmsSendRecord(search: SmsSendRecordSearch): Int!
  "根据搜索条件和分页查找短信发送记录列表"
  findAllSmsSendRecord(search: SmsSendRecordSearch, page: PageInput, sort: [SortInput!]): [SmsSendRecordModel!]!
  "获取短信发送记录字段注释"
  getFieldCommentsSmsSendRecord: SmsSendRecordFieldComment!
  "根据条件查找第一个短信发送记录"
  findOneSmsSendRecord(search: SmsSendRecordSearch, sort: [SortInput!]): SmsSendRecordModel
  "根据 id 查找短信发送记录"
  findByIdSmsSendRecord(id: SmsSendRecordId!): SmsSendRecordModel
  "根据 ids 查找短信发送记录"
  findByIdsSmsSendRecord(ids: [SmsSendRecordId!]!): [SmsSendRecordModel]!
}
type Mutation {
  "根据 ids 删除短信发送记录"
  deleteByIdsSmsSendRecord(ids: [SmsSendRecordId!]!): Int!
  "根据 ids 还原短信发送记录"
  revertByIdsSmsSendRecord(ids: [SmsSendRecordId!]!): Int!
  "根据 ids 彻底删除短信发送记录"
  forceDeleteByIdsSmsSendRecord(ids: [SmsSendRecordId!]!): Int!
}

`);
