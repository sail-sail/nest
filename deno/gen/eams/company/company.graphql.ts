import { defineGraphql } from "/lib/context.ts";

import type { } from "./company.model.ts";
import * as resolver from "./company.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar CompanyId

type CompanyModel {
  "ID"
  id: CompanyId!
  "编号"
  code: String!
  "名称"
  lbl: String!
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
type CompanyFieldComment {
  "ID"
  id: String!
  "编号"
  code: String!
  "名称"
  lbl: String!
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
input CompanyInput {
  "ID"
  id: CompanyId
  "编号"
  code: String
  "名称"
  lbl: String
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
}
input CompanySearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [CompanyId!]
  "ID"
  id: CompanyId
  "编号"
  code: String
  code_like: String
  "名称"
  lbl: String
  lbl_like: String
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
  "根据条件查找单位总数"
  findCountCompany(search: CompanySearch): Int!
  "根据搜索条件和分页查找单位列表"
  findAllCompany(search: CompanySearch, page: PageInput, sort: [SortInput!]): [CompanyModel!]!
  "获取单位字段注释"
  getFieldCommentsCompany: CompanyFieldComment!
  "根据条件查找第一个单位"
  findOneCompany(search: CompanySearch, sort: [SortInput!]): CompanyModel
  "根据 id 查找单位"
  findByIdCompany(id: CompanyId!): CompanyModel
  "根据 ids 查找单位"
  findByIdsCompany(ids: [CompanyId!]!): [CompanyModel]!
  "查找单位 order_by 字段的最大值"
  findLastOrderByCompany: Int!
}
type Mutation {
  "批量创建单位"
  createsCompany(inputs: [CompanyInput!]!, unique_type: UniqueType): [CompanyId!]!
  "根据 id 修改单位"
  updateByIdCompany(id: CompanyId!, input: CompanyInput!): CompanyId!
  "根据 ids 删除单位"
  deleteByIdsCompany(ids: [CompanyId!]!): Int!
  "根据 ids 启用或者禁用单位"
  enableByIdsCompany(ids: [CompanyId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁单位"
  lockByIdsCompany(ids: [CompanyId!]!, is_locked: Int!): Int!
  "根据 ids 还原单位"
  revertByIdsCompany(ids: [CompanyId!]!): Int!
  "根据 ids 彻底删除单位"
  forceDeleteByIdsCompany(ids: [CompanyId!]!): Int!
}

`);
