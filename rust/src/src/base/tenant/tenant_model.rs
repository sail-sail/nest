use serde::{Serialize, Deserialize};
use async_graphql::SimpleObject;

use crate::gen::base::tenant::tenant_model::TenantId;

/// 租户
#[derive(SimpleObject, Clone, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct GetLoginTenants {
  /// ID
  pub id: TenantId,
  /// 名称
  pub lbl: String,
}
