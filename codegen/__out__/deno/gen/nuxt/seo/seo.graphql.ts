import { defineGraphql } from "/lib/context.ts";

import type { } from "./seo.model.ts";
import * as resolver from "./seo.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar SeoId

type SeoModel {
  "ID"
  id: SeoId!
  "标题"
  title: String!
  "描述"
  description: String!
  "关键词"
  keywords: String!
  "分享图片"
  og_image: String!
  "分享标题"
  og_title: String!
  "分享描述"
  og_description: String!
  "锁定"
  is_locked: Int!
  "锁定"
  is_locked_lbl: String!
  "默认"
  is_default: Int!
  "默认"
  is_default_lbl: String!
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
type SeoFieldComment {
  "ID"
  id: String!
  "标题"
  title: String!
  "描述"
  description: String!
  "关键词"
  keywords: String!
  "分享图片"
  og_image: String!
  "分享标题"
  og_title: String!
  "分享描述"
  og_description: String!
  "锁定"
  is_locked: String!
  "锁定"
  is_locked_lbl: String!
  "默认"
  is_default: String!
  "默认"
  is_default_lbl: String!
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
input SeoInput {
  "ID"
  id: SeoId
  "标题"
  title: String
  "描述"
  description: String
  "关键词"
  keywords: String
  "分享图片"
  og_image: String
  "分享标题"
  og_title: String
  "分享描述"
  og_description: String
  "锁定"
  is_locked: Int
  "锁定"
  is_locked_lbl: String
  "默认"
  is_default: Int
  "默认"
  is_default_lbl: String
  "排序"
  order_by: Int
  "备注"
  rem: String
}
input SeoSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [SeoId!]
  "ID"
  id: SeoId
  "默认"
  is_default: [Int!]
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
  "根据条件查找SEO优化总数"
  findCountSeo(search: SeoSearch): Int!
  "根据搜索条件和分页查找SEO优化列表"
  findAllSeo(search: SeoSearch, page: PageInput, sort: [SortInput!]): [SeoModel!]!
  "获取SEO优化字段注释"
  getFieldCommentsSeo: SeoFieldComment!
  "根据条件查找第一个SEO优化"
  findOneSeo(search: SeoSearch, sort: [SortInput!]): SeoModel
  "根据 id 查找SEO优化"
  findByIdSeo(id: SeoId!): SeoModel
  "根据 ids 查找SEO优化"
  findByIdsSeo(ids: [SeoId!]!): [SeoModel]!
  "查找SEO优化 order_by 字段的最大值"
  findLastOrderBySeo: Int!
}
type Mutation {
  "批量创建SEO优化"
  createsSeo(inputs: [SeoInput!]!, unique_type: UniqueType): [SeoId!]!
  "根据 id 修改SEO优化"
  updateByIdSeo(id: SeoId!, input: SeoInput!): SeoId!
  "根据 ids 删除SEO优化"
  deleteByIdsSeo(ids: [SeoId!]!): Int!
  "根据 id 设置默认SEO优化"
  defaultByIdSeo(id: SeoId!): Int!
  "根据 ids 锁定或者解锁SEO优化"
  lockByIdsSeo(ids: [SeoId!]!, is_locked: Int!): Int!
  "根据 ids 还原SEO优化"
  revertByIdsSeo(ids: [SeoId!]!): Int!
  "根据 ids 彻底删除SEO优化"
  forceDeleteByIdsSeo(ids: [SeoId!]!): Int!
}

`);
