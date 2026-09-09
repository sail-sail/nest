use color_eyre::eyre::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::field_permit_resolver;

#[derive(Default)]
pub struct FieldPermitQuery;

#[Object(rename_args = "snake_case")]
impl FieldPermitQuery {
  
  /// 字段权限
  async fn get_field_permit(
    &self,
    ctx: &Context<'_>,
    route_path: String,
  ) -> Result<Option<Vec<String>>> {
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
