use serde::{Serialize, Deserialize};
use async_graphql::{SimpleObject, InputObject};

use smol_str::SmolStr;

use crate::base::tenant::tenant_model::TenantId;

/// 租户
#[derive(SimpleObject, Clone, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct GetLoginTenants {
  /// ID
  pub id: TenantId,
  /// 名称
  pub lbl: SmolStr,
  /// 标题
  pub title: SmolStr,
  /// 简介
  pub info: SmolStr,
  /// 语言
  pub lang: SmolStr,
}

/// 设置租户管理员密码
#[derive(InputObject, Clone, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct SetTenantAdminPwdInput {
  /// 新密码
  pub pwd: SmolStr,
  /// 租户ID
  pub tenant_id: TenantId,
}
