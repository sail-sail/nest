import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./order.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar OrderId

"订单订单状态"
enum OrderStatus {
  "待支付"
  to_be_paid
  "待审核"
  to_be_reviewed
  "办理中"
  in_progress
  "已完成"
  completed
}
"订单订单类别"
enum OrderType {
  "消费"
  pay
  "充值"
  recharge
  "赠送"
  give
  "活动"
  activity
}

type OrderModel {
  "ID"
  id: OrderId!
  "订单号"
  lbl: String!
  "订单状态"
  status: OrderStatus
  "订单状态"
  status_lbl: String!
  "用户"
  usr_id: UsrId!
  "用户"
  usr_id_lbl: String
  "会员卡"
  card_id: CardId!
  "会员卡"
  card_id_lbl: String
  "订单金额"
  price: Decimal!
  "订单类别"
  type: OrderType
  "订单类别"
  type_lbl: String!
  "消费充值金额"
  amt: Decimal!
  "消费赠送金额"
  give_amt: Decimal!
  "消费后充值余额"
  balance: Decimal!
  "消费后赠送余额"
  give_balance: Decimal!
  "获得积分"
  integral: Int!
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
type OrderFieldComment {
  "ID"
  id: String!
  "订单号"
  lbl: String!
  "订单状态"
  status: String!
  "订单状态"
  status_lbl: String!
  "用户"
  usr_id: String!
  "用户"
  usr_id_lbl: String!
  "会员卡"
  card_id: String!
  "会员卡"
  card_id_lbl: String!
  "订单金额"
  price: String!
  "订单类别"
  type: String!
  "订单类别"
  type_lbl: String!
  "消费充值金额"
  amt: String!
  "消费赠送金额"
  give_amt: String!
  "消费后充值余额"
  balance: String!
  "消费后赠送余额"
  give_balance: String!
  "获得积分"
  integral: String!
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
input OrderInput {
  ""
  id: OrderId
  "订单号"
  lbl: String
  "订单状态"
  status: OrderStatus
  "订单状态"
  status_lbl: String
  "用户"
  usr_id: UsrId
  "用户"
  usr_id_lbl: String
  "会员卡"
  card_id: CardId
  "会员卡"
  card_id_lbl: String
  "订单金额"
  price: Decimal
  "订单类别"
  type: OrderType
  "订单类别"
  type_lbl: String
  "消费充值金额"
  amt: Decimal
  "消费赠送金额"
  give_amt: Decimal
  "消费后充值余额"
  balance: Decimal
  "消费后赠送余额"
  give_balance: Decimal
  "获得积分"
  integral: Int
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
input OrderSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [OrderId!]
  "ID"
  id: OrderId
  "订单号"
  lbl: String
  lbl_like: String
  "订单状态"
  status: [String!]
  "用户"
  usr_id: [UsrId!]
  usr_id_is_null: Boolean
  "会员卡"
  card_id: [CardId!]
  card_id_is_null: Boolean
  "订单金额"
  price: [Decimal!]
  "订单类别"
  type: [String!]
  "消费充值金额"
  amt: [Decimal!]
  "消费赠送金额"
  give_amt: [Decimal!]
  "消费后充值余额"
  balance: [Decimal!]
  "消费后赠送余额"
  give_balance: [Decimal!]
  "获得积分"
  integral: [Int!]
  "锁定"
  is_locked: [Int!]
  "启用"
  is_enabled: [Int!]
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
  findCountOrder(search: OrderSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllOrder(search: OrderSearch, page: PageInput, sort: [SortInput!]): [OrderModel!]!
  "获取字段对应的名称"
  getFieldCommentsOrder: OrderFieldComment!
  "根据条件查找第一条数据"
  findOneOrder(search: OrderSearch, sort: [SortInput!]): OrderModel
  "根据id查找一条数据"
  findByIdOrder(id: OrderId!): OrderModel
}
type Mutation {
  "创建一条数据"
  createOrder(model: OrderInput!, unique_type: UniqueType): OrderId!
  "根据id修改一条数据"
  updateByIdOrder(id: OrderId!, model: OrderInput!): OrderId!
  "根据 ids 删除数据"
  deleteByIdsOrder(ids: [OrderId!]!): Int!
  "根据 ids 启用或者禁用数据"
  enableByIdsOrder(ids: [OrderId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsOrder(ids: [OrderId!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsOrder(ids: [OrderId!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsOrder(ids: [OrderId!]!): Int!
}

`);
