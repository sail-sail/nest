use color_eyre::eyre::Result;

use super::dictbiz_detail_model::GetDictbiz;
use super::dictbiz_detail_dao;

pub async fn get_dictbiz(
  codes: Vec<String>,
) -> Result<Vec<Vec<GetDictbiz>>> {
  
  let data = dictbiz_detail_dao::get_dictbiz(
    codes.as_slice(),
  ).await?;
  
  Ok(data)
}
