use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::options_resolver;
use crate::gen::base::options::options_model::OptionsModel;

#[derive(Default)]
pub struct OptionsQuery;

#[Object(rename_args = "snake_case")]
impl OptionsQuery {
  
  /// 获取系统选项
  async fn get_options_by_lbl<'a>(
    &self,
    ctx: &Context<'a>,
    lbl: String,
  ) -> Result<Vec<OptionsModel>> {
    
    let ctx = Ctx::builder(ctx)
      .with_auth()?
      .build();
    
    let res = options_resolver::get_options_by_lbl(
      &ctx,
      lbl,
    ).await;
    
    ctx.ok(res).await
  }
  
}
