use anyhow::Result;
use crate::common::context::Ctx;

use super::menu_dao;
use super::menu_model::GetMenus;

pub async fn get_menus<'a>(
  ctx: &mut impl Ctx<'a>,
  r#type: Option<String>,
) -> Result<Vec<GetMenus>> {
  let res = menu_dao::get_menus(ctx, r#type).await?;
  Ok(res)
}
