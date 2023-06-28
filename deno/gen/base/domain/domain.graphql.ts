import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./domain.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

type DomainModel {
  "ID"
  id: String!
  "名称"
  lbl: String!
  "排序"
  order_by: Int!
  "默认"
  is_default: Int!
  "默认"
  is_default_lbl: String
  "启用"
  is_enabled: Int!
  "启用"
  is_enabled_lbl: String
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
type DomainFieldComment {
  "名称"
  lbl: String!
  "排序"
  order_by: String!
  "默认"
  is_default: String!
  "默认"
  is_default_lbl: String!
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
input DomainInput {
  ""
  id: String
  "名称"
  lbl: String
  "排序"
  order_by: Int
  "默认"
  is_default: Int
  "默认"
  is_default_lbl: String
  "启用"
  is_enabled: Int
  "启用"
  is_enabled_lbl: String
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
input DomainSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "String"
  id: String
  "名称"
  lbl: String
  lbl_like: String
  "排序"
  order_by: [Int!]
  "默认"
  is_default: [Int!]
  "启用"
  is_enabled: [Int!]
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
  findCountDomain(search: DomainSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllDomain(search: DomainSearch, page: PageInput, sort: [SortInput!]): [DomainModel!]!
  "获取字段对应的名称"
  getFieldCommentsDomain: DomainFieldComment!
  "根据条件查找第一条数据"
  findOneDomain(search: DomainSearch, sort: [SortInput!]): DomainModel
  "根据id查找一条数据"
  findByIdDomain(id: String!): DomainModel
  "查找order_by字段的最大值"
  findLastOrderByDomain: Int!
}
type Mutation {
  "创建一条数据"
  createDomain(model: DomainInput!): String!
  "根据id修改一条数据"
  updateByIdDomain(id: String!, model: DomainInput!): String!
  "根据 ids 删除数据"
  deleteByIdsDomain(ids: [String!]!): Int!
  "根据 id 设置默认记录"
  defaultByIdDomain(id: String!): Int!
  "根据 ids 启用或者禁用数据"
  enableByIdsDomain(ids: [String!]!, is_enabled: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsDomain(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsDomain(ids: [String!]!): Int!
}

`);
