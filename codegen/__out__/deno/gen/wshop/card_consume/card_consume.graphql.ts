import { defineGraphql } from "/lib/context.ts";

import type { } from "./card_consume.model.ts";
import * as resolver from "./card_consume.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar CardConsumeId

type CardConsumeModel {
  "ID"
  id: CardConsumeId!
  "卡号"
  card_id: CardId!
  "卡号"
  card_id_lbl: String!
  "用户"
  usr_id: UsrId!
  "用户"
  usr_id_lbl: String!
  "消费充值金额"
  amt: Decimal!
  "消费赠送金额"
  give_amt: Decimal!
  "获得积分"
  integral: Int!
  "消费后余额"
  balance: Decimal!
  "消费后赠送余额"
  give_balance: Decimal!
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
  "消费充值金额"
  amt: String!
  "消费赠送金额"
  give_amt: String!
  "获得积分"
  integral: String!
  "消费后余额"
  balance: String!
  "消费后赠送余额"
  give_balance: String!
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
  "ID"
  id: CardConsumeId
  "卡号"
  card_id: CardId
  "卡号"
  card_id_lbl: String
  "用户"
  usr_id: UsrId
  "用户"
  usr_id_lbl: String
  "消费充值金额"
  amt: Decimal
  "消费赠送金额"
  give_amt: Decimal
  "获得积分"
  integral: Int
  "消费后余额"
  balance: Decimal
  "消费后赠送余额"
  give_balance: Decimal
  "备注"
  rem: String
}
input CardConsumeSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [CardConsumeId!]
  "ID"
  id: CardConsumeId
  "卡号"
  card_id: [CardId!]
  "卡号"
  card_id_is_null: Boolean
  "卡号"
  card_id_lbl: [String!]
  "卡号"
  card_id_lbl_like: String
  "用户"
  usr_id: [UsrId!]
  "用户"
  usr_id_is_null: Boolean
  "用户"
  usr_id_lbl: [String!]
  "用户"
  usr_id_lbl_like: String
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
  "根据条件查找会员卡消费记录总数"
  findCountCardConsume(search: CardConsumeSearch): Int!
  "根据搜索条件和分页查找会员卡消费记录列表"
  findAllCardConsume(search: CardConsumeSearch, page: PageInput, sort: [SortInput!]): [CardConsumeModel!]!
  "获取会员卡消费记录字段注释"
  getFieldCommentsCardConsume: CardConsumeFieldComment!
  "根据条件查找第一个会员卡消费记录"
  findOneCardConsume(search: CardConsumeSearch, sort: [SortInput!]): CardConsumeModel
  "根据 id 查找会员卡消费记录"
  findByIdCardConsume(id: CardConsumeId!): CardConsumeModel
}
type Mutation {
  "根据 ids 删除会员卡消费记录"
  deleteByIdsCardConsume(ids: [CardConsumeId!]!): Int!
  "根据 ids 还原会员卡消费记录"
  revertByIdsCardConsume(ids: [CardConsumeId!]!): Int!
  "根据 ids 彻底删除会员卡消费记录"
  forceDeleteByIdsCardConsume(ids: [CardConsumeId!]!): Int!
}

`);
