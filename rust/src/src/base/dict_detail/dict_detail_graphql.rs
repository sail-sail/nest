use color_eyre::eyre::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::dict_detail_model::GetDict;
use super::dict_detail_resolver;

#[derive(Default)]
pub struct DictDetailQuery;

#[Object(rename_args = "snake_case")]
impl DictDetailQuery {
  
  async fn get_dict(
    &self,
    ctx: &Context<'_>,
    codes: Vec<String>,
  ) -> Result<Vec<Vec<GetDict>>> {
    Ctx::builder(ctx)
      .build()
      .scope({
        dict_detail_resolver::get_dict(codes)
      }).await
  }
  
}
