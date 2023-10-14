use std::collections::HashMap;

use anyhow::Result;
use crate::common::context::Ctx;

use super::i18n_dao::{
  n as dao_n,
  ns as dao_ns,
  n_lang as dao_n_lang,
};

#[allow(dead_code)]
pub async fn n<'a>(
  ctx: &Ctx<'a>,
  route_path: Option<String>,
  code: String,
  map: Option<HashMap<String, String>>,
) -> Result<String> {
  let res = dao_n(ctx, route_path, code, map).await?;
  Ok(res)
}

#[allow(dead_code)]
pub async fn ns<'a>(
  ctx: &Ctx<'a>,
  code: String,
  map: Option<HashMap<String, String>>,
) -> Result<String> {
  let res = dao_ns(ctx, code, map).await?;
  Ok(res)
}

pub async fn n_lang<'a>(
  ctx: &Ctx<'a>,
  lang_code: String,
  route_path: Option<String>,
  code: String,
  map: Option<HashMap<String, String>>,
) -> Result<String> {
  let res = dao_n_lang(ctx, lang_code, route_path, code, map).await?;
  Ok(res)
}
