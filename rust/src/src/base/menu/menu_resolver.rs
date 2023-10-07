use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};

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
    
    let mut ctx = CtxImpl::new(ctx).auth()?;
    
    let res = menu_service::get_menus(
      &mut ctx,
      r#type,
    ).await?;
    
    Ok(res)
  }
  
}
