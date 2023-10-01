use anyhow::Result;
use crate::common::context::Ctx;

use super::dictbiz_detail_model::GetDictbiz;
use super::dictbiz_detail_service;

pub async fn get_dictbiz<'a>(
  ctx: &mut impl Ctx<'a>,
  codes: &Vec<impl AsRef<str>>,
) -> Result<Vec<Vec<GetDictbiz>>> {
  
  let data = dictbiz_detail_service::get_dictbiz(
    ctx,
    codes,
  ).await?;
  
  Ok(data)
}
