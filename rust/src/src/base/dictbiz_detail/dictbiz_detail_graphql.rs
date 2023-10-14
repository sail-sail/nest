use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::dictbiz_detail_model::GetDictbiz;
use super::dictbiz_detail_resolver;

#[derive(Default)]
pub struct DictbizDetailQuery;

#[Object(rename_args = "snake_case")]
impl DictbizDetailQuery {
  
  async fn get_dictbiz<'a>(
    &self,
    ctx: &Context<'a>,
    codes: Vec<String>,
  ) -> Result<Vec<Vec<GetDictbiz>>> {
    
    let mut ctx = Ctx::builder(ctx)
      .build();
    
    let res = dictbiz_detail_resolver::get_dictbiz(
      &mut ctx,
      &codes,
    ).await;
    
    ctx.ok(res).await
  }
  
}
