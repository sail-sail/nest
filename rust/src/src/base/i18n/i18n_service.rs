use std::collections::HashMap;

use color_eyre::eyre::Result;

use crate::common::i18n::i18n_dao::{
  n as dao_n,
  ns as dao_ns,
  n_lang as dao_n_lang,
};

#[allow(dead_code)]
pub async fn n(
  route_path: Option<String>,
  code: String,
  map: Option<HashMap<String, String>>,
) -> Result<String> {
  let res = dao_n(route_path, code, map).await?;
  Ok(res)
}

#[allow(dead_code)]
pub async fn ns(
  code: String,
  map: Option<HashMap<String, String>>,
) -> Result<String> {
  let res = dao_ns(code, map).await?;
  Ok(res)
}

pub async fn n_lang(
  lang_code: String,
  route_path: Option<String>,
  code: String,
  map: Option<HashMap<String, String>>,
) -> Result<String> {
  let res = dao_n_lang(lang_code, route_path, code, map).await?;
  Ok(res)
}
