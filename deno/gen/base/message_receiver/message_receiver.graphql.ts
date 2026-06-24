import { defineGraphql } from "/lib/context.ts";

import type { } from "./message_receiver.model.ts";
import * as resolver from "./message_receiver.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar MessageReceiverId

type MessageReceiverModel {
  "ID"
  id: MessageReceiverId!
  "消息"
  message_id: MessageId!
  "消息"
  message_id_lbl: String!
  "接收人"
  receiver_usr_id: UsrId!
  "接收人"
  receiver_usr_id_lbl: String!
  "已读"
  is_read: Int!
  "已读"
  is_read_lbl: String!
  "阅读时间"
  read_time: NaiveDateTime
  "阅读时间"
  read_time_lbl: String!
  "组织"
  org_id: OrgId!
  "组织"
  org_id_lbl: String!
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
type MessageReceiverFieldComment {
  "ID"
  id: String!
  "消息"
  message_id: String!
  "消息"
  message_id_lbl: String!
  "接收人"
  receiver_usr_id: String!
  "接收人"
  receiver_usr_id_lbl: String!
  "已读"
  is_read: String!
  "已读"
  is_read_lbl: String!
  "阅读时间"
  read_time: String!
  "阅读时间"
  read_time_lbl: String!
  "组织"
  org_id: String!
  "组织"
  org_id_lbl: String!
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
input MessageReceiverInput {
  "ID"
  id: MessageReceiverId
  "消息"
  message_id: MessageId
  "消息"
  message_id_content: String
  "接收人"
  receiver_usr_id: UsrId
  "接收人"
  receiver_usr_id_lbl: String
  "已读"
  is_read: Int
  "已读"
  is_read_lbl: String
  "阅读时间"
  read_time: NaiveDateTime
  "阅读时间"
  read_time_lbl: String
  "阅读时间"
  read_time_save_null: Boolean
  "组织"
  org_id: OrgId
  "组织"
  org_id_lbl: String
}
input MessageReceiverSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [MessageReceiverId!]
  "ID"
  id: MessageReceiverId
  "消息"
  message_id: [MessageId!]
  "消息"
  message_id_is_null: Boolean
  "消息"
  message_id_content: [String!]
  "消息"
  message_id_content_like: String
  "接收人"
  receiver_usr_id: [UsrId!]
  "接收人"
  receiver_usr_id_is_null: Boolean
  "接收人"
  receiver_usr_id_lbl: [String!]
  "接收人"
  receiver_usr_id_lbl_like: String
  "已读"
  is_read: [Int!]
  "阅读时间"
  read_time: [NaiveDateTime]
  "组织"
  org_id: [OrgId!]
  "组织"
  org_id_is_null: Boolean
  "组织"
  org_id_lbl: [String!]
  "组织"
  org_id_lbl_like: String
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
  "根据条件查找消息接收人总数"
  findCountMessageReceiver(search: MessageReceiverSearch): Int!
  "根据搜索条件和分页查找消息接收人列表"
  findAllMessageReceiver(search: MessageReceiverSearch, page: PageInput, sort: [SortInput!]): [MessageReceiverModel!]!
  "获取消息接收人字段注释"
  getFieldCommentsMessageReceiver: MessageReceiverFieldComment!
  "根据条件查找第一个消息接收人"
  findOneMessageReceiver(search: MessageReceiverSearch, sort: [SortInput!]): MessageReceiverModel
  "根据 id 查找消息接收人"
  findByIdMessageReceiver(id: MessageReceiverId!): MessageReceiverModel
  "根据 ids 查找消息接收人"
  findByIdsMessageReceiver(ids: [MessageReceiverId!]!): [MessageReceiverModel]!
}
type Mutation {
  "批量创建消息接收人"
  createsMessageReceiver(inputs: [MessageReceiverInput!]!, unique_type: UniqueType): [MessageReceiverId!]!
  "根据 id 修改消息接收人"
  updateByIdMessageReceiver(id: MessageReceiverId!, input: MessageReceiverInput!): MessageReceiverId!
  "根据 ids 删除消息接收人"
  deleteByIdsMessageReceiver(ids: [MessageReceiverId!]!): Int!
  "根据 ids 还原消息接收人"
  revertByIdsMessageReceiver(ids: [MessageReceiverId!]!): Int!
  "根据 ids 彻底删除消息接收人"
  forceDeleteByIdsMessageReceiver(ids: [MessageReceiverId!]!): Int!
}

`);
