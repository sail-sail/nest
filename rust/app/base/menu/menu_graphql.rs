use color_eyre::eyre::Result;
use async_graphql::{Context, Object};

use generated::common::context::Ctx;
use generated::base::menu::menu_model::MenuSearch;

use super::menu_resolver;
use super::menu_model::{GetMenus, FindMenuAndRoles};

#[derive(Default)]
pub struct MenuQuery;

#[Object(rename_args = "snake_case")]
impl MenuQuery {
  
  /// 首页获取菜单列表
  #[graphql(name = "getMenus")]
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
  
  /// 查询菜单及其角色信息
  #[graphql(name = "findMenuAndRoles")]
  async fn find_menu_and_roles(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "search")]
    search: MenuSearch,
  ) -> Result<FindMenuAndRoles> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        menu_resolver::find_menu_and_roles(
          search,
          None,
        )
      }).await
  }
  
}
