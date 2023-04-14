use anyhow::Result;
use crate::common::context::Ctx;

use super::dict_detail_model::DictModel;
use super::dict_detail_dao;

pub async fn get_dict<'a>(
  ctx: &mut impl Ctx<'a>,
  codes: &Vec<impl AsRef<str>>,
) -> Result<Vec<DictModel>> {
  let data = dict_detail_dao::get_dict(ctx, codes).await?;
  Ok(data)
}
