use std::collections::HashMap;

use anyhow::Result;
use crate::common::context::Ctx;

use super::i18n_dao;

#[allow(dead_code)]
pub async fn n<'a>(
  ctx: &mut impl Ctx<'a>,
  route_path: Option<String>,
  code: String,
  map: Option<&HashMap<&'a str, &'a str>>,
) -> Result<String> {
  let res = i18n_dao::n(ctx, route_path, code, map).await?;
  Ok(res)
}

#[allow(dead_code)]
pub async fn ns<'a>(
  ctx: &mut impl Ctx<'a>,
  code: String,
  map: Option<&HashMap<&'a str, &'a str>>,
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
