use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::menu_service;
use super::menu_model::GetMenus;

#[derive(Default)]
pub struct MenuQuery;

#[Object(rename_args = "snake_case")]
impl MenuQuery {
  
  /// 首页获取菜单列表
  async fn get_menus<'a>(
    &self,
    ctx: &Context<'a>,
    r#type: Option<String>,
  ) -> Result<Vec<GetMenus>> {
    
    let ctx = Ctx::builder(ctx)
      .with_auth()?
      .build();
    
    let res = menu_service::get_menus(
      &ctx,
      r#type,
    ).await;
    
    ctx.ok(res).await
  }
  
}
