use anyhow::Result;
use crate::common::context::Ctx;

use super::dictbiz_detail_model::DictModel;
use super::dictbiz_detail_dao;

pub async fn get_dict<'a>(
  ctx: &mut impl Ctx<'a>,
  codes: &Vec<impl AsRef<str>>,
) -> Result<Vec<Vec<DictModel>>> {
  let data = dictbiz_detail_dao::get_dictbiz(ctx, codes).await?;
  Ok(data)
}
