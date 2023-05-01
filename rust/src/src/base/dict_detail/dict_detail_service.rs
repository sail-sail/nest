use anyhow::Result;
use crate::common::context::Ctx;

use super::dict_detail_model::GetDict;
use super::dict_detail_dao;

pub async fn get_dict<'a>(
  ctx: &mut impl Ctx<'a>,
  codes: &Vec<impl AsRef<str>>,
) -> Result<Vec<Vec<GetDict>>> {
  let data = dict_detail_dao::get_dict(ctx, codes).await?;
  Ok(data)
}
