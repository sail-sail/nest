import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./payslip.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

type PayslipModel {
  "ID"
  id: String!
  "发放月份"
  pay_month: NaiveDate!
  "发放月份"
  pay_month_lbl: String!
  "姓名"
  lbl: String!
  "工号"
  job_num: String!
  "公司"
  company: String!
  "应发工资(元)"
  gross_pay: String!
  "代缴社保(元)"
  social_security: String!
  "代缴个税(元)"
  individual_tax: String!
  "个人自付(元)"
  self_pay: String!
  "实发工资(元)"
  net_pay: String!
  "已发送"
  is_send: Int!
  "已发送"
  is_send_lbl: String
  "已确认"
  is_confirm: Int!
  "已确认"
  is_confirm_lbl: String
  "锁定"
  is_locked: Int!
  "锁定"
  is_locked_lbl: String
  "备注"
  rem: String!
  "创建人"
  create_usr_id: String!
  "创建人"
  create_usr_id_lbl: String
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String!
  "更新人"
  update_usr_id: String!
  "更新人"
  update_usr_id_lbl: String
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String!
  "是否已删除"
  is_deleted: Int!
}
type PayslipFieldComment {
  "发放月份"
  pay_month: String!
  "发放月份"
  pay_month_lbl: String!
  "姓名"
  lbl: String!
  "工号"
  job_num: String!
  "公司"
  company: String!
  "应发工资(元)"
  gross_pay: String!
  "代缴社保(元)"
  social_security: String!
  "代缴个税(元)"
  individual_tax: String!
  "个人自付(元)"
  self_pay: String!
  "实发工资(元)"
  net_pay: String!
  "已发送"
  is_send: String!
  "已发送"
  is_send_lbl: String!
  "已确认"
  is_confirm: String!
  "已确认"
  is_confirm_lbl: String!
  "锁定"
  is_locked: String!
  "锁定"
  is_locked_lbl: String!
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
input PayslipInput {
  ""
  id: String
  "发放月份"
  pay_month: NaiveDate
  "发放月份"
  pay_month_lbl: String
  "姓名"
  lbl: String
  "工号"
  job_num: String
  "公司"
  company: String
  "应发工资(元)"
  gross_pay: String
  "代缴社保(元)"
  social_security: String
  "代缴个税(元)"
  individual_tax: String
  "个人自付(元)"
  self_pay: String
  "实发工资(元)"
  net_pay: String
  "已发送"
  is_send: Int
  "已发送"
  is_send_lbl: String
  "已确认"
  is_confirm: Int
  "已确认"
  is_confirm_lbl: String
  "锁定"
  is_locked: Int
  "锁定"
  is_locked_lbl: String
  "备注"
  rem: String
  "创建人"
  create_usr_id: String
  "创建人"
  create_usr_id_lbl: String
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String
  "更新人"
  update_usr_id: String
  "更新人"
  update_usr_id_lbl: String
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String
}
input PayslipSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "String"
  id: String
  "发放月份"
  pay_month: [NaiveDate!]
  "姓名"
  lbl: String
  lbl_like: String
  "工号"
  job_num: String
  job_num_like: String
  "公司"
  company: String
  company_like: String
  "已发送"
  is_send: [Int!]
  "已确认"
  is_confirm: [Int!]
  "锁定"
  is_locked: [Int!]
  "备注"
  rem: String
  rem_like: String
  "创建人"
  create_usr_id: [String!]
  create_usr_id_is_null: Boolean
  "创建时间"
  create_time: [NaiveDateTime!]
  "更新人"
  update_usr_id: [String!]
  update_usr_id_is_null: Boolean
  "更新时间"
  update_time: [NaiveDateTime!]
}
type Query {
  "根据条件查找据数总数"
  findCountPayslip(search: PayslipSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllPayslip(search: PayslipSearch, page: PageInput, sort: [SortInput!]): [PayslipModel!]!
  "获取字段对应的名称"
  getFieldCommentsPayslip: PayslipFieldComment!
  "根据条件查找第一条数据"
  findOnePayslip(search: PayslipSearch, sort: [SortInput!]): PayslipModel
  "根据id查找一条数据"
  findByIdPayslip(id: String!): PayslipModel
}
type Mutation {
  "创建一条数据"
  createPayslip(model: PayslipInput!, unique_type: UniqueType): String!
  "根据id修改一条数据"
  updateByIdPayslip(id: String!, model: PayslipInput!): String!
  "根据 ids 删除数据"
  deleteByIdsPayslip(ids: [String!]!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsPayslip(ids: [String!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsPayslip(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsPayslip(ids: [String!]!): Int!
}

`);
