import { defineGraphql } from "/lib/context.ts";

import type { } from "./icon.model.ts";
import * as resolver from "./icon.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar IconId

type IconModel {
  "ID"
  id: IconId!
  "图标"
  img: String!
  "编码"
  code: String!
  "名称"
  lbl: String!
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
type IconFieldComment {
  "ID"
  id: String!
  "图标"
  img: String!
  "编码"
  code: String!
  "名称"
  lbl: String!
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
input IconInput {
  "ID"
  id: IconId
  "图标"
  img: String
  "编码"
  code: String
  "名称"
  lbl: String
  "启用"
  is_enabled: Int
  "启用"
  is_enabled_lbl: String
  "排序"
  order_by: Int
  "备注"
  rem: String
}
input IconSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [IconId!]
  "ID"
  id: IconId
  "编码"
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
  "根据条件查找图标库总数"
  findCountIcon(search: IconSearch): Int!
  "根据搜索条件和分页查找图标库列表"
  findAllIcon(search: IconSearch, page: PageInput, sort: [SortInput!]): [IconModel!]!
  "获取图标库字段注释"
  getFieldCommentsIcon: IconFieldComment!
  "根据条件查找第一个图标库"
  findOneIcon(search: IconSearch, sort: [SortInput!]): IconModel
  "根据 id 查找图标库"
  findByIdIcon(id: IconId!): IconModel
  "根据 ids 查找图标库"
  findByIdsIcon(ids: [IconId!]!): [IconModel]!
  "查找图标库 order_by 字段的最大值"
  findLastOrderByIcon(search: IconSearch): Int!
}
type Mutation {
  "批量创建图标库"
  createsIcon(inputs: [IconInput!]!, unique_type: UniqueType): [IconId!]!
  "根据 id 修改图标库"
  updateByIdIcon(id: IconId!, input: IconInput!): IconId!
  "根据 ids 删除图标库"
  deleteByIdsIcon(ids: [IconId!]!): Int!
  "根据 ids 启用或者禁用图标库"
  enableByIdsIcon(ids: [IconId!]!, is_enabled: Int!): Int!
  "根据 ids 还原图标库"
  revertByIdsIcon(ids: [IconId!]!): Int!
  "根据 ids 彻底删除图标库"
  forceDeleteByIdsIcon(ids: [IconId!]!): Int!
}

`);
