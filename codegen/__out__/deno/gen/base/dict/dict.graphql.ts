import { defineGraphql } from "/lib/context.ts";

import type { } from "./dict.model.ts";
import * as resolver from "./dict.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar DictId

"系统字典数据类型"
enum DictType {
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

type DictModel {
  "ID"
  id: DictId!
  "编码"
  code: String!
  "名称"
  lbl: String!
  "数据类型"
  type: DictType!
  "数据类型"
  type_lbl: String!
  "可新增"
  is_add: Int!
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
  "系统字段"
  is_sys: Int!
  "系统字典明细"
  dict_detail: [DictDetailModel!]!
}
type DictFieldComment {
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
  "可新增"
  is_add: String!
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
input DictInput {
  "ID"
  id: DictId
  "编码"
  code: String
  "名称"
  lbl: String
  "数据类型"
  type: DictType
  "数据类型"
  type_lbl: String
  "可新增"
  is_add: Int
  "启用"
  is_enabled: Int
  "启用"
  is_enabled_lbl: String
  "排序"
  order_by: Int
  "备注"
  rem: String
  "系统字典明细"
  dict_detail: [DictDetailInput!]
}
input DictSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [DictId!]
  "ID"
  id: DictId
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
  "根据条件查找系统字典总数"
  findCountDict(search: DictSearch): Int!
  "根据搜索条件和分页查找系统字典列表"
  findAllDict(search: DictSearch, page: PageInput, sort: [SortInput!]): [DictModel!]!
  "获取系统字典字段注释"
  getFieldCommentsDict: DictFieldComment!
  "根据条件查找第一个系统字典"
  findOneDict(search: DictSearch, sort: [SortInput!]): DictModel
  "根据 id 查找系统字典"
  findByIdDict(id: DictId!): DictModel
  "查找系统字典 order_by 字段的最大值"
  findLastOrderByDict: Int!
}
type Mutation {
  "批量创建系统字典"
  createsDict(inputs: [DictInput!]!, unique_type: UniqueType): [DictId!]!
  "根据 id 修改系统字典"
  updateByIdDict(id: DictId!, input: DictInput!): DictId!
  "根据 ids 删除系统字典"
  deleteByIdsDict(ids: [DictId!]!): Int!
  "根据 ids 启用或者禁用系统字典"
  enableByIdsDict(ids: [DictId!]!, is_enabled: Int!): Int!
  "根据 ids 还原系统字典"
  revertByIdsDict(ids: [DictId!]!): Int!
  "根据 ids 彻底删除系统字典"
  forceDeleteByIdsDict(ids: [DictId!]!): Int!
}

`);
