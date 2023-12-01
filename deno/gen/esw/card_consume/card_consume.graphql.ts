import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./card_consume.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar CardConsumeId


type CardConsumeModel {
  "ID"
  id: CardConsumeId!
  "卡号"
  card_id: CardId!
  "卡号"
  card_id_lbl: String
  "用户"
  usr_id: UsrId!
  "用户"
  usr_id_lbl: String
  "消费金额"
  amt: Decimal!
  "消费赠送金额"
  give_amt: Decimal!
  "消费后余额"
  balance: Decimal!
  "消费后赠送余额"
  give_balance: Decimal!
  "消费后积分"
  integral: Int!
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
type CardConsumeFieldComment {
  "ID"
  id: String!
  "卡号"
  card_id: String!
  "卡号"
  card_id_lbl: String!
  "用户"
  usr_id: String!
  "用户"
  usr_id_lbl: String!
  "消费金额"
  amt: String!
  "消费赠送金额"
  give_amt: String!
  "消费后余额"
  balance: String!
  "消费后赠送余额"
  give_balance: String!
  "消费后积分"
  integral: String!
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
input CardConsumeInput {
  ""
  id: CardConsumeId
  "卡号"
  card_id: CardId
  "卡号"
  card_id_lbl: String
  "用户"
  usr_id: UsrId
  "用户"
  usr_id_lbl: String
  "消费金额"
  amt: Decimal
  "消费赠送金额"
  give_amt: Decimal
  "消费后余额"
  balance: Decimal
  "消费后赠送余额"
  give_balance: Decimal
  "消费后积分"
  integral: Int
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
input CardConsumeSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [CardConsumeId!]
  "ID"
  id: CardConsumeId
  "卡号"
  card_id: [CardId!]
  card_id_is_null: Boolean
  "用户"
  usr_id: [UsrId!]
  usr_id_is_null: Boolean
  "消费金额"
  amt: [Decimal!]
  "消费赠送金额"
  give_amt: [Decimal!]
  "消费后余额"
  balance: [Decimal!]
  "消费后赠送余额"
  give_balance: [Decimal!]
  "消费后积分"
  integral: [Int!]
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
  findCountCardConsume(search: CardConsumeSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllCardConsume(search: CardConsumeSearch, page: PageInput, sort: [SortInput!]): [CardConsumeModel!]!
  "获取字段对应的名称"
  getFieldCommentsCardConsume: CardConsumeFieldComment!
  "根据条件查找第一条数据"
  findOneCardConsume(search: CardConsumeSearch, sort: [SortInput!]): CardConsumeModel
  "根据id查找一条数据"
  findByIdCardConsume(id: CardConsumeId!): CardConsumeModel
}
type Mutation {
  "根据 ids 删除数据"
  deleteByIdsCardConsume(ids: [CardConsumeId!]!): Int!
  "根据 ids 还原数据"
  revertByIdsCardConsume(ids: [CardConsumeId!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsCardConsume(ids: [CardConsumeId!]!): Int!
}

`);
