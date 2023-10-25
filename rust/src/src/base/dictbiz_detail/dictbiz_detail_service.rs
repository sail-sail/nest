use anyhow::Result;

use super::dictbiz_detail_model::GetDictbiz;
use super::dictbiz_detail_dao;

pub async fn get_dictbiz(
  codes: &Vec<impl AsRef<str>>,
) -> Result<Vec<Vec<GetDictbiz>>> {
  
  let data = dictbiz_detail_dao::get_dictbiz(
    codes,
  ).await?;
  
  Ok(data)
}
