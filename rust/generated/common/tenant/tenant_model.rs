use serde::{Serialize, Deserialize};
use async_graphql::{SimpleObject, InputObject};

use crate::base::tenant::tenant_model::TenantId;

/// 租户
#[derive(SimpleObject, Clone, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct GetLoginTenants {
  /// ID
  pub id: TenantId,
  /// 名称
  pub lbl: String,
  /// 标题
  pub title: String,
  /// 简介
  pub info: String,
  /// 语言
  pub lang: String,
}

/// 设置租户管理员密码
#[derive(InputObject, Clone, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct SetTenantAdminPwdInput {
  /// 新密码
  pub pwd: String,
  /// 租户ID
  pub tenant_id: TenantId,
}
