use color_eyre::eyre::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::options_resolver;
use crate::r#gen::base::options::options_model::OptionsModel;

#[derive(Default)]
pub struct OptionsQuery;

#[Object(rename_args = "snake_case")]
impl OptionsQuery {
  
  /// 获取系统选项
  async fn get_options_by_lbl(
    &self,
    ctx: &Context<'_>,
    lbl: String,
  ) -> Result<Vec<OptionsModel>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        options_resolver::get_options_by_lbl(
          lbl,
        )
      }).await
  }
  
}
