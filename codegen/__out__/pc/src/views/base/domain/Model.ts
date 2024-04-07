import type {
  DomainInput as DomainInputType,
  DomainModel as DomainModelType,
  DomainSearch as DomainSearchType,
  DomainFieldComment as DomainFieldCommentType,
} from "#/types";

export interface DomainModel extends DomainModelType {
}

export interface DomainInput extends DomainInputType {
}

export interface DomainSearch extends DomainSearchType {
}

export interface DomainFieldComment extends DomainFieldCommentType {
}

export const domainFields = [
  // ID
  "id",
  // 协议
  "protocol",
  // 名称
  "lbl",
  // 锁定
  "is_locked",
  "is_locked_lbl",
  // 默认
  "is_default",
  "is_default_lbl",
  // 启用
  "is_enabled",
  "is_enabled_lbl",
  // 排序
  "order_by",
  // 备注
  "rem",
  // 创建人
  "create_usr_id",
  "create_usr_id_lbl",
  // 创建时间
  "create_time",
  "create_time_lbl",
  // 更新人
  "update_usr_id",
  "update_usr_id_lbl",
  // 更新时间
  "update_time",
  "update_time_lbl",
  "is_deleted",
];
