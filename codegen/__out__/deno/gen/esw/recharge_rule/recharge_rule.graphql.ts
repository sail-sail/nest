import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./recharge_rule.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar RechargeRuleId


type RechargeRuleModel {
  "ID"
  id: RechargeRuleId!
  "名称"
  lbl: String!
  "充值金额"
  amt: Decimal!
  "赠送金额"
  give_amt: Decimal!
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
type RechargeRuleFieldComment {
  "ID"
  id: String!
  "名称"
  lbl: String!
  "充值金额"
  amt: String!
  "赠送金额"
  give_amt: String!
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
input RechargeRuleInput {
  ""
  id: RechargeRuleId
  "名称"
  lbl: String
  "充值金额"
  amt: Decimal
  "赠送金额"
  give_amt: Decimal
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
input RechargeRuleSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [RechargeRuleId!]
  "ID"
  id: RechargeRuleId
  "名称"
  lbl: String
  lbl_like: String
  "充值金额"
  amt: [Decimal!]
  "赠送金额"
  give_amt: [Decimal!]
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
  findCountRechargeRule(search: RechargeRuleSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllRechargeRule(search: RechargeRuleSearch, page: PageInput, sort: [SortInput!]): [RechargeRuleModel!]!
  "获取字段对应的名称"
  getFieldCommentsRechargeRule: RechargeRuleFieldComment!
  "根据条件查找第一条数据"
  findOneRechargeRule(search: RechargeRuleSearch, sort: [SortInput!]): RechargeRuleModel
  "根据id查找一条数据"
  findByIdRechargeRule(id: RechargeRuleId!): RechargeRuleModel
}
type Mutation {
  "创建一条数据"
  createRechargeRule(model: RechargeRuleInput!, unique_type: UniqueType): RechargeRuleId!
  "根据id修改一条数据"
  updateByIdRechargeRule(id: RechargeRuleId!, model: RechargeRuleInput!): RechargeRuleId!
  "根据 ids 删除数据"
  deleteByIdsRechargeRule(ids: [RechargeRuleId!]!): Int!
  "根据 ids 启用或者禁用数据"
  enableByIdsRechargeRule(ids: [RechargeRuleId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsRechargeRule(ids: [RechargeRuleId!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsRechargeRule(ids: [RechargeRuleId!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsRechargeRule(ids: [RechargeRuleId!]!): Int!
}

`);
