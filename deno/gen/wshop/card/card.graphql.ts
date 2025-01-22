import { defineGraphql } from "/lib/context.ts";

import type { } from "./card.model.ts";
import * as resolver from "./card.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar CardId

"会员卡会员等级"
enum CardGrade {
  "普通"
  normal
  "黄金"
  gold
  "铂金"
  platinum
  "钻石"
  diamond
}

type CardModel {
  "ID"
  id: CardId!
  "卡号"
  lbl: String!
  "绑定用户"
  usr_id: UsrId!
  "绑定用户"
  usr_id_lbl: String!
  "会员等级"
  grade: CardGrade!
  "会员等级"
  grade_lbl: String!
  "姓名"
  name: String!
  "电话"
  mobile: String!
  "充值余额"
  balance: Decimal!
  "赠送余额"
  give_balance: Decimal!
  "积分"
  integral: Int!
  "累计消费"
  growth_amt: Decimal!
  "默认"
  is_default_card: Int!
  "默认"
  is_default_card_lbl: String!
  "锁定"
  is_locked: Int!
  "锁定"
  is_locked_lbl: String!
  "启用"
  is_enabled: Int!
  "启用"
  is_enabled_lbl: String!
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
type CardFieldComment {
  "ID"
  id: String!
  "卡号"
  lbl: String!
  "绑定用户"
  usr_id: String!
  "绑定用户"
  usr_id_lbl: String!
  "会员等级"
  grade: String!
  "会员等级"
  grade_lbl: String!
  "姓名"
  name: String!
  "电话"
  mobile: String!
  "充值余额"
  balance: String!
  "赠送余额"
  give_balance: String!
  "积分"
  integral: String!
  "累计消费"
  growth_amt: String!
  "默认"
  is_default_card: String!
  "默认"
  is_default_card_lbl: String!
  "锁定"
  is_locked: String!
  "锁定"
  is_locked_lbl: String!
  "启用"
  is_enabled: String!
  "启用"
  is_enabled_lbl: String!
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
input CardInput {
  "ID"
  id: CardId
  "卡号"
  lbl: String
  "绑定用户"
  usr_id: UsrId
  "绑定用户"
  usr_id_lbl: String
  "会员等级"
  grade: CardGrade
  "会员等级"
  grade_lbl: String
  "姓名"
  name: String
  "电话"
  mobile: String
  "充值余额"
  balance: Decimal
  "赠送余额"
  give_balance: Decimal
  "积分"
  integral: Int
  "累计消费"
  growth_amt: Decimal
  "默认"
  is_default_card: Int
  "默认"
  is_default_card_lbl: String
  "锁定"
  is_locked: Int
  "锁定"
  is_locked_lbl: String
  "启用"
  is_enabled: Int
  "启用"
  is_enabled_lbl: String
  "备注"
  rem: String
}
input CardSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [CardId!]
  "ID"
  id: CardId
  "卡号"
  lbl: String
  lbl_like: String
  "绑定用户"
  usr_id: [UsrId!]
  "绑定用户"
  usr_id_is_null: Boolean
  "绑定用户"
  usr_id_lbl: [String!]
  "绑定用户"
  usr_id_lbl_like: String
  "姓名"
  name: String
  name_like: String
  "电话"
  mobile: String
  mobile_like: String
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
  "根据条件查找会员卡总数"
  findCountCard(search: CardSearch): Int!
  "根据搜索条件和分页查找会员卡列表"
  findAllCard(search: CardSearch, page: PageInput, sort: [SortInput!]): [CardModel!]!
  "获取会员卡字段注释"
  getFieldCommentsCard: CardFieldComment!
  "根据条件查找第一个会员卡"
  findOneCard(search: CardSearch, sort: [SortInput!]): CardModel
  "根据 id 查找会员卡"
  findByIdCard(id: CardId!): CardModel
}
type Mutation {
  "批量创建会员卡"
  createsCard(inputs: [CardInput!]!, unique_type: UniqueType): [CardId!]!
  "根据 id 修改会员卡"
  updateByIdCard(id: CardId!, input: CardInput!): CardId!
  "根据 ids 删除会员卡"
  deleteByIdsCard(ids: [CardId!]!): Int!
  "根据 ids 启用或者禁用会员卡"
  enableByIdsCard(ids: [CardId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁会员卡"
  lockByIdsCard(ids: [CardId!]!, is_locked: Int!): Int!
  "根据 ids 还原会员卡"
  revertByIdsCard(ids: [CardId!]!): Int!
  "根据 ids 彻底删除会员卡"
  forceDeleteByIdsCard(ids: [CardId!]!): Int!
}

`);
