use color_eyre::eyre::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::lang_resolver;
use crate::base::lang::lang_model::LangModel;

#[derive(Default)]
pub struct LangQuery;

#[Object(rename_args = "snake_case")]
impl LangQuery {
  
  async fn get_login_langs(
    &self,
    ctx: &Context<'_>,
  ) -> Result<Vec<LangModel>> {
    Ctx::builder(ctx)
      .build()
      .scope({
        lang_resolver::get_login_langs()
      }).await
  }
  
}
