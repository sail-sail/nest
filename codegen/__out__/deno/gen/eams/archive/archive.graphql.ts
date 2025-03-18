import { defineGraphql } from "/lib/context.ts";

import type { } from "./archive.model.ts";
import * as resolver from "./archive.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar ArchiveId

type ArchiveModel {
  "ID"
  id: ArchiveId!
  "编号"
  code: String!
  "名称"
  lbl: String!
  "关联单位"
  company_id: CompanyId!
  "关联单位"
  company_id_lbl: String!
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
type ArchiveFieldComment {
  "ID"
  id: String!
  "编号"
  code: String!
  "名称"
  lbl: String!
  "关联单位"
  company_id: String!
  "关联单位"
  company_id_lbl: String!
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
input ArchiveInput {
  "ID"
  id: ArchiveId
  "编号"
  code: String
  "名称"
  lbl: String
  "关联单位"
  company_id: CompanyId
  "关联单位"
  company_id_lbl: String
  "排序"
  order_by: Int
  "备注"
  rem: String
}
input ArchiveSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [ArchiveId!]
  "ID"
  id: ArchiveId
  "编号"
  code: String
  code_like: String
  "名称"
  lbl: String
  lbl_like: String
  "关联单位"
  company_id: [CompanyId!]
  "关联单位"
  company_id_is_null: Boolean
  "关联单位"
  company_id_lbl: [String!]
  "关联单位"
  company_id_lbl_like: String
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
  "根据条件查找全宗设置总数"
  findCountArchive(search: ArchiveSearch): Int!
  "根据搜索条件和分页查找全宗设置列表"
  findAllArchive(search: ArchiveSearch, page: PageInput, sort: [SortInput!]): [ArchiveModel!]!
  "获取全宗设置字段注释"
  getFieldCommentsArchive: ArchiveFieldComment!
  "根据条件查找第一个全宗设置"
  findOneArchive(search: ArchiveSearch, sort: [SortInput!]): ArchiveModel
  "根据 id 查找全宗设置"
  findByIdArchive(id: ArchiveId!): ArchiveModel
  "根据 ids 查找全宗设置"
  findByIdsArchive(ids: [ArchiveId!]!): [ArchiveModel]!
  "查找全宗设置 order_by 字段的最大值"
  findLastOrderByArchive: Int!
}
type Mutation {
  "批量创建全宗设置"
  createsArchive(inputs: [ArchiveInput!]!, unique_type: UniqueType): [ArchiveId!]!
  "根据 id 修改全宗设置"
  updateByIdArchive(id: ArchiveId!, input: ArchiveInput!): ArchiveId!
  "根据 ids 删除全宗设置"
  deleteByIdsArchive(ids: [ArchiveId!]!): Int!
  "根据 ids 还原全宗设置"
  revertByIdsArchive(ids: [ArchiveId!]!): Int!
  "根据 ids 彻底删除全宗设置"
  forceDeleteByIdsArchive(ids: [ArchiveId!]!): Int!
}

`);
