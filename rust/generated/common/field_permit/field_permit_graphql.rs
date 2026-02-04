use color_eyre::eyre::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use smol_str::SmolStr;

use super::field_permit_resolver;

#[derive(Default)]
pub struct FieldPermitQuery;

#[Object(rename_args = "snake_case")]
impl FieldPermitQuery {
  
  /// 字段权限
  async fn get_field_permit(
    &self,
    ctx: &Context<'_>,
    route_path: SmolStr,
  ) -> Result<Option<Vec<SmolStr>>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        field_permit_resolver::get_field_permit(
          route_path,
        )
      }).await
  }
  
}
