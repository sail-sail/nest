import { defineGraphql } from "/lib/context.ts";

import type { } from "./domain.model.ts";
import * as resolver from "./domain.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar DomainId

type DomainModel {
  "ID"
  id: DomainId!
  "协议"
  protocol: String!
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
type DomainFieldComment {
  "ID"
  id: String!
  "协议"
  protocol: String!
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
input DomainInput {
  "ID"
  id: DomainId
  "协议"
  protocol: String
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
input DomainSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [DomainId!]
  "ID"
  id: DomainId
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
  "根据条件查找域名总数"
  findCountDomain(search: DomainSearch): Int!
  "根据搜索条件和分页查找域名列表"
  findAllDomain(search: DomainSearch, page: PageInput, sort: [SortInput!]): [DomainModel!]!
  "获取域名字段注释"
  getFieldCommentsDomain: DomainFieldComment!
  "根据条件查找第一个域名"
  findOneDomain(search: DomainSearch, sort: [SortInput!]): DomainModel
  "根据 id 查找域名"
  findByIdDomain(id: DomainId!): DomainModel
  "根据 ids 查找域名"
  findByIdsDomain(ids: [DomainId!]!): [DomainModel]!
  "查找域名 order_by 字段的最大值"
  findLastOrderByDomain: Int!
}
type Mutation {
  "批量创建域名"
  createsDomain(inputs: [DomainInput!]!, unique_type: UniqueType): [DomainId!]!
  "根据 id 修改域名"
  updateByIdDomain(id: DomainId!, input: DomainInput!): DomainId!
  "根据 ids 删除域名"
  deleteByIdsDomain(ids: [DomainId!]!): Int!
  "根据 ids 启用或者禁用域名"
  enableByIdsDomain(ids: [DomainId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁域名"
  lockByIdsDomain(ids: [DomainId!]!, is_locked: Int!): Int!
  "根据 ids 还原域名"
  revertByIdsDomain(ids: [DomainId!]!): Int!
  "根据 ids 彻底删除域名"
  forceDeleteByIdsDomain(ids: [DomainId!]!): Int!
}

`);
