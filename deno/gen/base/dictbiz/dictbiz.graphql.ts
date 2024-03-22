import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./dictbiz.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar DictbizId

"业务字典数据类型"
enum DictbizType {
  "字符串"
  string
  "数值"
  number
  "日期"
  date
  "日期时间"
  datetime
  "时间"
  time
  "布尔"
  boolean
}

type DictbizModel {
  "ID"
  id: DictbizId!
  "编码"
  code: String!
  "名称"
  lbl: String!
  "数据类型"
  type: DictbizType
  "数据类型"
  type_lbl: String!
  "锁定"
  is_locked: Int!
  "锁定"
  is_locked_lbl: String!
  "启用"
  is_enabled: Int!
  "启用"
  is_enabled_lbl: String!
  "排序"
  order_by: Int!
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
  "业务字典明细"
  dictbiz_detail_models: [DictbizDetailModel!]
}
type DictbizFieldComment {
  "ID"
  id: String!
  "编码"
  code: String!
  "名称"
  lbl: String!
  "数据类型"
  type: String!
  "数据类型"
  type_lbl: String!
  "锁定"
  is_locked: String!
  "锁定"
  is_locked_lbl: String!
  "启用"
  is_enabled: String!
  "启用"
  is_enabled_lbl: String!
  "排序"
  order_by: String!
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
input DictbizInput {
  "ID"
  id: DictbizId
  "编码"
  code: String
  "名称"
  lbl: String
  "数据类型"
  type: DictbizType
  "数据类型"
  type_lbl: String
  "锁定"
  is_locked: Int
  "锁定"
  is_locked_lbl: String
  "启用"
  is_enabled: Int
  "启用"
  is_enabled_lbl: String
  "排序"
  order_by: Int
  "备注"
  rem: String
  "业务字典明细"
  dictbiz_detail_models: [DictbizDetailInput!]
}
input DictbizSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [DictbizId!]
  "ID"
  id: DictbizId
  "编码"
  code: String
  code_like: String
  "名称"
  lbl: String
  lbl_like: String
  "数据类型"
  type: [String!]
  "锁定"
  is_locked: [Int!]
  "启用"
  is_enabled: [Int!]
  "排序"
  order_by: [Int]
  "备注"
  rem: String
  rem_like: String
  "创建人"
  create_usr_id: [UsrId!]
  create_usr_id_is_null: Boolean
  "创建时间"
  create_time: [NaiveDateTime]
  "更新人"
  update_usr_id: [UsrId!]
  update_usr_id_is_null: Boolean
  "更新时间"
  update_time: [NaiveDateTime]
}
type Query {
  "根据条件查找业务字典总数"
  findCountDictbiz(search: DictbizSearch): Int!
  "根据搜索条件和分页查找业务字典列表"
  findAllDictbiz(search: DictbizSearch, page: PageInput, sort: [SortInput!]): [DictbizModel!]!
  "获取业务字典字段注释"
  getFieldCommentsDictbiz: DictbizFieldComment!
  "根据条件查找第一个业务字典"
  findOneDictbiz(search: DictbizSearch, sort: [SortInput!]): DictbizModel
  "根据 id 查找业务字典"
  findByIdDictbiz(id: DictbizId!): DictbizModel
  "查找 业务字典 order_by 字段的最大值"
  findLastOrderByDictbiz: Int!
}
type Mutation {
  "创建业务字典"
  createDictbiz(input: DictbizInput!, unique_type: UniqueType): DictbizId!
  "根据 id 修改业务字典"
  updateByIdDictbiz(id: DictbizId!, input: DictbizInput!): DictbizId!
  "根据 ids 删除业务字典"
  deleteByIdsDictbiz(ids: [DictbizId!]!): Int!
  "根据 ids 启用或者禁用业务字典"
  enableByIdsDictbiz(ids: [DictbizId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁业务字典"
  lockByIdsDictbiz(ids: [DictbizId!]!, is_locked: Int!): Int!
  "根据 ids 还原业务字典"
  revertByIdsDictbiz(ids: [DictbizId!]!): Int!
  "根据 ids 彻底删除业务字典"
  forceDeleteByIdsDictbiz(ids: [DictbizId!]!): Int!
}

`);
