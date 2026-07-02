import { defineGraphql } from "/lib/context.ts";

import type { } from "./message.model.ts";
import * as resolver from "./message.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar MessageId

type MessageModel {
  "ID"
  id: MessageId!
  "分类"
  category: String!
  "分类"
  category_lbl: String!
  "发送通道"
  channel: String!
  "发送通道"
  channel_lbl: String!
  "标题"
  title: String!
  "内容"
  content: String!
  "跳转路由"
  route_path: String!
  "跳转参数"
  route_query: String!
  "发送人"
  sender_usr_id: UsrId!
  "发送人"
  sender_usr_id_lbl: String!
  "系统消息"
  is_sys_msg: Int!
  "系统消息"
  is_sys_msg_lbl: String!
  "置顶"
  is_pinned: Int!
  "置顶"
  is_pinned_lbl: String!
  "所属组织"
  org_id: OrgId!
  "所属组织"
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
type MessageFieldComment {
  "ID"
  id: String!
  "分类"
  category: String!
  "分类"
  category_lbl: String!
  "发送通道"
  channel: String!
  "发送通道"
  channel_lbl: String!
  "标题"
  title: String!
  "内容"
  content: String!
  "跳转路由"
  route_path: String!
  "跳转参数"
  route_query: String!
  "发送人"
  sender_usr_id: String!
  "发送人"
  sender_usr_id_lbl: String!
  "系统消息"
  is_sys_msg: String!
  "系统消息"
  is_sys_msg_lbl: String!
  "置顶"
  is_pinned: String!
  "置顶"
  is_pinned_lbl: String!
  "所属组织"
  org_id: String!
  "所属组织"
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
input MessageInput {
  "ID"
  id: MessageId
  "分类"
  category: String
  "分类"
  category_lbl: String
  "发送通道"
  channel: String
  "发送通道"
  channel_lbl: String
  "标题"
  title: String
  "内容"
  content: String
  "跳转路由"
  route_path: String
  "跳转参数"
  route_query: String
  "发送人"
  sender_usr_id: UsrId
  "发送人"
  sender_usr_id_lbl: String
  "系统消息"
  is_sys_msg: Int
  "系统消息"
  is_sys_msg_lbl: String
  "置顶"
  is_pinned: Int
  "置顶"
  is_pinned_lbl: String
  "所属组织"
  org_id: OrgId
  "所属组织"
  org_id_lbl: String
}
input MessageSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [MessageId!]
  "ID"
  id: MessageId
  "分类"
  category: [String!]
  "标题"
  title: String
  title_like: String
  "跳转路由"
  route_path: String
  route_path_like: String
  "发送人"
  sender_usr_id: [UsrId!]
  "发送人"
  sender_usr_id_is_null: Boolean
  "发送人"
  sender_usr_id_lbl: [String!]
  "发送人"
  sender_usr_id_lbl_like: String
  "所属组织"
  org_id: [OrgId!]
  "所属组织"
  org_id_is_null: Boolean
  "所属组织"
  org_id_lbl: [String!]
  "所属组织"
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
  "根据条件查找消息总数"
  findCountMessage(search: MessageSearch): Int!
  "根据搜索条件和分页查找消息列表"
  findAllMessage(search: MessageSearch, page: PageInput, sort: [SortInput!]): [MessageModel!]!
  "获取消息字段注释"
  getFieldCommentsMessage: MessageFieldComment!
  "根据条件查找第一个消息"
  findOneMessage(search: MessageSearch, sort: [SortInput!]): MessageModel
  "根据 id 查找消息"
  findByIdMessage(id: MessageId!): MessageModel
  "根据 ids 查找消息"
  findByIdsMessage(ids: [MessageId!]!): [MessageModel]!
}
type Mutation {
  "批量创建消息"
  createsMessage(inputs: [MessageInput!]!, unique_type: UniqueType): [MessageId!]!
  "根据 id 修改消息"
  updateByIdMessage(id: MessageId!, input: MessageInput!): MessageId!
  "根据 ids 删除消息"
  deleteByIdsMessage(ids: [MessageId!]!): Int!
  "根据 ids 还原消息"
  revertByIdsMessage(ids: [MessageId!]!): Int!
  "根据 ids 彻底删除消息"
  forceDeleteByIdsMessage(ids: [MessageId!]!): Int!
}

`);
