use std::collections::HashMap;

use color_eyre::eyre::Result;

use smol_str::SmolStr;

use crate::common::i18n::i18n_dao::{
  n as dao_n,
  ns as dao_ns,
  n_lang as dao_n_lang,
};

#[allow(dead_code)]
pub async fn n(
  route_path: Option<SmolStr>,
  code: SmolStr,
  map: Option<HashMap<SmolStr, SmolStr>>,
) -> Result<SmolStr> {
  let res = dao_n(route_path, code, map).await?;
  Ok(res)
}

#[allow(dead_code)]
pub async fn ns(
  code: SmolStr,
  map: Option<HashMap<SmolStr, SmolStr>>,
) -> Result<SmolStr> {
  let res = dao_ns(code, map).await?;
  Ok(res)
}

pub async fn n_lang(
  lang_code: SmolStr,
  route_path: Option<SmolStr>,
  code: SmolStr,
  map: Option<HashMap<SmolStr, SmolStr>>,
) -> Result<SmolStr> {
  let res = dao_n_lang(lang_code, route_path, code, map).await?;
  Ok(res)
}
