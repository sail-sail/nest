use color_eyre::eyre::Result;

use super::dict_detail_model::GetDict;
use super::dict_detail_dao;

pub async fn get_dict(
  codes: Vec<String>,
) -> Result<Vec<Vec<GetDict>>> {
  
  let data = dict_detail_dao::get_dict(
    codes.as_slice(),
  ).await?;
  
  Ok(data)
}
