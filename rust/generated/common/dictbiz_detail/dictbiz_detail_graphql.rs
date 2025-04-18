use color_eyre::eyre::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::dictbiz_detail_model::GetDictbiz;
use super::dictbiz_detail_resolver;

#[derive(Default)]
pub struct DictbizDetailQuery;

#[Object(rename_args = "snake_case")]
impl DictbizDetailQuery {
  
  async fn get_dictbiz(
    &self,
    ctx: &Context<'_>,
    codes: Vec<String>,
  ) -> Result<Vec<Vec<GetDictbiz>>> {
    Ctx::builder(ctx)
      .build()
      .scope({
        dictbiz_detail_resolver::get_dictbiz(codes)
      }).await
  }
  
}
