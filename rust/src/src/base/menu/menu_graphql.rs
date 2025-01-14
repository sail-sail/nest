use color_eyre::eyre::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::menu_resolver;
use super::menu_model::GetMenus;

#[derive(Default)]
pub struct MenuQuery;

#[Object(rename_args = "snake_case")]
impl MenuQuery {
  
  /// 首页获取菜单列表
  async fn get_menus(
    &self,
    ctx: &Context<'_>,
  ) -> Result<Vec<GetMenus>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        menu_resolver::get_menus()
      }).await
  }
  
}
