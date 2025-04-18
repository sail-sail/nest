use color_eyre::eyre::Result;

use crate::base::options::options_dao;
use crate::base::options::options_model::{
  OptionsModel,
  OptionsSearch,
  OptionsInput,
};

pub async fn get_options_by_lbl(
  lbl: String,
) -> Result<Vec<OptionsModel>> {
  
  let res = options_dao::find_all_options(
    OptionsSearch {
      lbl: lbl.into(),
      ..Default::default()
    }.into(),
    None,
    None,
    None,
  ).await?;
  
  Ok(res)
}

/// 更新国际化版本号
pub async fn update_i18n_version() -> Result<String> {
  
  let lbl = "国际化版本号".to_owned();
  let models = get_options_by_lbl(lbl).await?;
  let options_model = models.into_iter().find(|item| item.ky == "i18n_version");
  if options_model.is_none() {
    let i18n_version = "1".to_owned();
    let input = OptionsInput {
      ky: "i18n_version".to_owned().into(),
      lbl: "国际化版本号".to_owned().into(),
      val: i18n_version.clone().into(),
      order_by: 1.into(),
      is_enabled: 1.into(),
      is_locked: 1.into(),
      ..Default::default()
    };
    options_dao::create_options(
      input,
      None,
    ).await?;
    return Ok(i18n_version);
  }
  let options_model = options_model.unwrap();
  let i18n_version = options_model.val;
  let i18n_version = i18n_version.parse().unwrap_or(0) + 1;
  let i18n_version = i18n_version.to_string();
  
  options_dao::update_by_id_options(
    options_model.id,
    OptionsInput {
      val: i18n_version.clone().into(),
      ..Default::default()
    },
    None,
  ).await?;
  
  Ok(i18n_version)
}
