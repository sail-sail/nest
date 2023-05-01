use std::collections::HashMap;

use anyhow::Result;
use crate::common::context::Ctx;

use super::i18n_dao;

pub struct NRoute {
  route_path: Option<String>,
}

impl NRoute {
  
  pub fn init_n(
    route_path: Option<String>,
  ) -> Self {
    Self {
      route_path,
    }
  }
  
  pub async fn n<'a>(
    &self,
    ctx: &mut impl Ctx<'a>,
    code: String,
    map: &HashMap<&'a str, &'a str>,
  ) -> Result<String> {
    let res = i18n_dao::n(ctx, self.route_path.clone(), code, map).await?;
    Ok(res)
  }
  
}

pub async fn n<'a>(
  ctx: &mut impl Ctx<'a>,
  route_path: Option<String>,
  code: String,
  map: &HashMap<&'a str, &'a str>,
) -> Result<String> {
  let res = i18n_dao::n(ctx, route_path, code, map).await?;
  Ok(res)
}

pub async fn ns<'a>(
  ctx: &mut impl Ctx<'a>,
  code: String,
  map: &HashMap<&'a str, &'a str>,
) -> Result<String> {
  let res = i18n_dao::ns(ctx, code, map).await?;
  Ok(res)
}

pub async fn n_lang<'a>(
  ctx: &mut impl Ctx<'a>,
  lang_code: String,
  route_path: Option<String>,
  code: String,
  map: Option<&HashMap<&'a str, &'a str>>,
) -> Result<String> {
  let res = i18n_dao::n_lang(ctx, lang_code, route_path, code, map).await?;
  Ok(res)
}
