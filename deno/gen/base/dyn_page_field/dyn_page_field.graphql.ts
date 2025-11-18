import { defineGraphql } from "/lib/context.ts";

import type { } from "./dyn_page_field.model.ts";
import * as resolver from "./dyn_page_field.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar DynPageFieldId

"动态页面字段对齐方式"
enum DynPageFieldAlign {
  "靠左"
  left
  "居中"
  center
  "靠右"
  right
}

type DynPageFieldModel {
  "ID"
  id: DynPageFieldId!
  "编码"
  code: String!
  "动态页面"
  dyn_page_id: DynPageId!
  "动态页面"
  dyn_page_id_lbl: String!
  "名称"
  lbl: String!
  "类型"
  type: String!
  "属性"
  attrs: String
  "计算公式"
  formula: String!
  "必填"
  is_required: Int!
  "必填"
  is_required_lbl: String!
  "查询条件"
  is_search: Int!
  "查询条件"
  is_search_lbl: String!
  "宽度"
  width: Int!
  "对齐方式"
  align: DynPageFieldAlign!
  "对齐方式"
  align_lbl: String!
  "启用"
  is_enabled: Int!
  "启用"
  is_enabled_lbl: String!
  "排序"
  order_by: Int!
  "已删除"
  is_deleted: Int!
}
type DynPageFieldFieldComment {
  "ID"
  id: String!
  "编码"
  code: String!
  "动态页面"
  dyn_page_id: String!
  "动态页面"
  dyn_page_id_lbl: String!
  "名称"
  lbl: String!
  "类型"
  type: String!
  "属性"
  attrs: String!
  "计算公式"
  formula: String!
  "必填"
  is_required: String!
  "必填"
  is_required_lbl: String!
  "查询条件"
  is_search: String!
  "查询条件"
  is_search_lbl: String!
  "宽度"
  width: String!
  "对齐方式"
  align: String!
  "对齐方式"
  align_lbl: String!
  "启用"
  is_enabled: String!
  "启用"
  is_enabled_lbl: String!
  "排序"
  order_by: String!
}
input DynPageFieldInput {
  "ID"
  id: DynPageFieldId
  "编码"
  code: String
  "动态页面"
  dyn_page_id: DynPageId
  "动态页面"
  dyn_page_id_lbl: String
  "名称"
  lbl: String
  "类型"
  type: String
  "属性"
  attrs: String
  "计算公式"
  formula: String
  "必填"
  is_required: Int
  "必填"
  is_required_lbl: String
  "查询条件"
  is_search: Int
  "查询条件"
  is_search_lbl: String
  "宽度"
  width: Int
  "对齐方式"
  align: DynPageFieldAlign
  "对齐方式"
  align_lbl: String
  "启用"
  is_enabled: Int
  "启用"
  is_enabled_lbl: String
  "排序"
  order_by: Int
}
input DynPageFieldSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [DynPageFieldId!]
  "ID"
  id: DynPageFieldId
  "编码"
  code: String
  code_like: String
  "动态页面"
  dyn_page_id: [DynPageId!]
  "动态页面"
  dyn_page_id_is_null: Boolean
  "动态页面"
  dyn_page_id_lbl: [String!]
  "动态页面"
  dyn_page_id_lbl_like: String
  "名称"
  lbl: String
  lbl_like: String
  "启用"
  is_enabled: [Int!]
}
type Query {
  "根据条件查找动态页面字段总数"
  findCountDynPageField(search: DynPageFieldSearch): Int!
  "根据搜索条件和分页查找动态页面字段列表"
  findAllDynPageField(search: DynPageFieldSearch, page: PageInput, sort: [SortInput!]): [DynPageFieldModel!]!
  "获取动态页面字段字段注释"
  getFieldCommentsDynPageField: DynPageFieldFieldComment!
  "根据条件查找第一个动态页面字段"
  findOneDynPageField(search: DynPageFieldSearch, sort: [SortInput!]): DynPageFieldModel
  "根据 id 查找动态页面字段"
  findByIdDynPageField(id: DynPageFieldId!): DynPageFieldModel
  "根据 ids 查找动态页面字段"
  findByIdsDynPageField(ids: [DynPageFieldId!]!): [DynPageFieldModel]!
  "查找动态页面字段 order_by 字段的最大值"
  findLastOrderByDynPageField: Int!
}
type Mutation {
  "批量创建动态页面字段"
  createsDynPageField(inputs: [DynPageFieldInput!]!, unique_type: UniqueType): [DynPageFieldId!]!
  "根据 id 修改动态页面字段"
  updateByIdDynPageField(id: DynPageFieldId!, input: DynPageFieldInput!): DynPageFieldId!
  "根据 ids 删除动态页面字段"
  deleteByIdsDynPageField(ids: [DynPageFieldId!]!): Int!
  "根据 ids 启用或者禁用动态页面字段"
  enableByIdsDynPageField(ids: [DynPageFieldId!]!, is_enabled: Int!): Int!
  "根据 ids 还原动态页面字段"
  revertByIdsDynPageField(ids: [DynPageFieldId!]!): Int!
  "根据 ids 彻底删除动态页面字段"
  forceDeleteByIdsDynPageField(ids: [DynPageFieldId!]!): Int!
}

`);
