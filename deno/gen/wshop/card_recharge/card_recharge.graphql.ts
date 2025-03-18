import { defineGraphql } from "/lib/context.ts";

import type { } from "./card_recharge.model.ts";
import * as resolver from "./card_recharge.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar CardRechargeId

type CardRechargeModel {
  "ID"
  id: CardRechargeId!
  "会员卡"
  card_id: CardId!
  "会员卡"
  card_id_lbl: String!
  "用户"
  usr_id: UsrId!
  "用户"
  usr_id_lbl: String!
  "充值金额"
  amt: Decimal!
  "赠送金额"
  give_amt: Decimal!
  "充值后充值余额"
  balance: Decimal!
  "充值后赠送余额"
  give_balance: Decimal!
  "充值后积分"
  integral: Int!
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
type CardRechargeFieldComment {
  "ID"
  id: String!
  "会员卡"
  card_id: String!
  "会员卡"
  card_id_lbl: String!
  "用户"
  usr_id: String!
  "用户"
  usr_id_lbl: String!
  "充值金额"
  amt: String!
  "赠送金额"
  give_amt: String!
  "充值后充值余额"
  balance: String!
  "充值后赠送余额"
  give_balance: String!
  "充值后积分"
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
input CardRechargeInput {
  "ID"
  id: CardRechargeId
  "会员卡"
  card_id: CardId
  "会员卡"
  card_id_lbl: String
  "用户"
  usr_id: UsrId
  "用户"
  usr_id_lbl: String
  "充值金额"
  amt: Decimal
  "赠送金额"
  give_amt: Decimal
  "充值后充值余额"
  balance: Decimal
  "充值后赠送余额"
  give_balance: Decimal
  "充值后积分"
  integral: Int
  "备注"
  rem: String
}
input CardRechargeSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [CardRechargeId!]
  "ID"
  id: CardRechargeId
  "会员卡"
  card_id: [CardId!]
  "会员卡"
  card_id_is_null: Boolean
  "会员卡"
  card_id_lbl: [String!]
  "会员卡"
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
  "根据条件查找会员卡充值记录总数"
  findCountCardRecharge(search: CardRechargeSearch): Int!
  "根据搜索条件和分页查找会员卡充值记录列表"
  findAllCardRecharge(search: CardRechargeSearch, page: PageInput, sort: [SortInput!]): [CardRechargeModel!]!
  "获取会员卡充值记录字段注释"
  getFieldCommentsCardRecharge: CardRechargeFieldComment!
  "根据条件查找第一个会员卡充值记录"
  findOneCardRecharge(search: CardRechargeSearch, sort: [SortInput!]): CardRechargeModel
  "根据 id 查找会员卡充值记录"
  findByIdCardRecharge(id: CardRechargeId!): CardRechargeModel
  "根据 ids 查找会员卡充值记录"
  findByIdsCardRecharge(ids: [CardRechargeId!]!): [CardRechargeModel]!
}
type Mutation {
  "根据 ids 删除会员卡充值记录"
  deleteByIdsCardRecharge(ids: [CardRechargeId!]!): Int!
  "根据 ids 还原会员卡充值记录"
  revertByIdsCardRecharge(ids: [CardRechargeId!]!): Int!
  "根据 ids 彻底删除会员卡充值记录"
  forceDeleteByIdsCardRecharge(ids: [CardRechargeId!]!): Int!
}

`);
