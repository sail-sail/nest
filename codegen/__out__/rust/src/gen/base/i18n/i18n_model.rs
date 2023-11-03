use serde::{
  Serialize,
  Deserialize,
};

use sqlx::{
  FromRow,
  mysql::MySqlRow,
  Row,
};

use async_graphql::{
  SimpleObject,
  InputObject,
};

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct I18nModel {
  /// ID
  pub id: String,
  /// 语言
  pub lang_id: String,
  /// 语言
  pub lang_id_lbl: String,
  /// 菜单
  pub menu_id: String,
  /// 菜单
  pub menu_id_lbl: String,
  /// 编码
  pub code: String,
  /// 名称
  pub lbl: String,
  /// 备注
  pub rem: String,
  /// 创建人
  pub create_usr_id: String,
  /// 创建人
  pub create_usr_id_lbl: String,
  /// 创建时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  pub create_time_lbl: String,
  /// 更新人
  pub update_usr_id: String,
  /// 更新人
  pub update_usr_id_lbl: String,
  /// 更新时间
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  pub update_time_lbl: String,
  /// 是否已删除
  pub is_deleted: u8,
}

impl FromRow<'_, MySqlRow> for I18nModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // ID
    let id: String = row.try_get("id")?;
    // 语言
    let lang_id: String = row.try_get("lang_id")?;
    let lang_id_lbl: Option<String> = row.try_get("lang_id_lbl")?;
    let lang_id_lbl = lang_id_lbl.unwrap_or_default();
    // 菜单
    let menu_id: String = row.try_get("menu_id")?;
    let menu_id_lbl: Option<String> = row.try_get("menu_id_lbl")?;
    let menu_id_lbl = menu_id_lbl.unwrap_or_default();
    // 编码
    let code: String = row.try_get("code")?;
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 备注
    let rem: String = row.try_get("rem")?;
    // 创建人
    let create_usr_id: String = row.try_get("create_usr_id")?;
    let create_usr_id_lbl: Option<String> = row.try_get("create_usr_id_lbl")?;
    let create_usr_id_lbl = create_usr_id_lbl.unwrap_or_default();
    // 创建时间
    let create_time: Option<chrono::NaiveDateTime> = row.try_get("create_time")?;
    let create_time_lbl: String = match create_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => "".to_owned(),
    };
    // 更新人
    let update_usr_id: String = row.try_get("update_usr_id")?;
    let update_usr_id_lbl: Option<String> = row.try_get("update_usr_id_lbl")?;
    let update_usr_id_lbl = update_usr_id_lbl.unwrap_or_default();
    // 更新时间
    let update_time: Option<chrono::NaiveDateTime> = row.try_get("update_time")?;
    let update_time_lbl: String = match update_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => "".to_owned(),
    };
    // 是否已删除
    let is_deleted: u8 = row.try_get("is_deleted")?;
    
    let model = Self {
      is_deleted,
      id,
      lang_id,
      lang_id_lbl,
      menu_id,
      menu_id_lbl,
      code,
      lbl,
      rem,
      create_usr_id,
      create_usr_id_lbl,
      create_time,
      create_time_lbl,
      update_usr_id,
      update_usr_id_lbl,
      update_time,
      update_time_lbl,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct I18nFieldComment {
  /// ID
  pub id: String,
  /// 语言
  pub lang_id: String,
  /// 语言
  pub lang_id_lbl: String,
  /// 菜单
  pub menu_id: String,
  /// 菜单
  pub menu_id_lbl: String,
  /// 编码
  pub code: String,
  /// 名称
  pub lbl: String,
  /// 备注
  pub rem: String,
  /// 创建人
  pub create_usr_id: String,
  /// 创建人
  pub create_usr_id_lbl: String,
  /// 创建时间
  pub create_time: String,
  /// 创建时间
  pub create_time_lbl: String,
  /// 更新人
  pub update_usr_id: String,
  /// 更新人
  pub update_usr_id_lbl: String,
  /// 更新时间
  pub update_time: String,
  /// 更新时间
  pub update_time_lbl: String,
}

#[derive(InputObject, Default, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct I18nSearch {
  pub id: Option<String>,
  pub ids: Option<Vec<String>>,
  pub is_deleted: Option<u8>,
  /// 语言
  pub lang_id: Option<Vec<String>>,
  /// 语言
  pub lang_id_is_null: Option<bool>,
  /// 菜单
  pub menu_id: Option<Vec<String>>,
  /// 菜单
  pub menu_id_is_null: Option<bool>,
  /// 编码
  pub code: Option<String>,
  /// 编码
  pub code_like: Option<String>,
  /// 名称
  pub lbl: Option<String>,
  /// 名称
  pub lbl_like: Option<String>,
  /// 备注
  pub rem: Option<String>,
  /// 备注
  pub rem_like: Option<String>,
  /// 创建人
  pub create_usr_id: Option<Vec<String>>,
  /// 创建人
  pub create_usr_id_is_null: Option<bool>,
  /// 创建时间
  pub create_time: Option<Vec<chrono::NaiveDateTime>>,
  /// 更新人
  pub update_usr_id: Option<Vec<String>>,
  /// 更新人
  pub update_usr_id_is_null: Option<bool>,
  /// 更新时间
  pub update_time: Option<Vec<chrono::NaiveDateTime>>,
}

#[derive(InputObject, Default, Clone, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct I18nInput {
  /// ID
  pub id: Option<String>,
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 语言
  pub lang_id: Option<String>,
  /// 语言
  pub lang_id_lbl: Option<String>,
  /// 菜单
  pub menu_id: Option<String>,
  /// 菜单
  pub menu_id_lbl: Option<String>,
  /// 编码
  pub code: Option<String>,
  /// 名称
  pub lbl: Option<String>,
  /// 备注
  pub rem: Option<String>,
  /// 创建人
  pub create_usr_id: Option<String>,
  /// 创建人
  pub create_usr_id_lbl: Option<String>,
  /// 创建时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  pub create_time_lbl: Option<String>,
  /// 更新人
  pub update_usr_id: Option<String>,
  /// 更新人
  pub update_usr_id_lbl: Option<String>,
  /// 更新时间
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  pub update_time_lbl: Option<String>,
}

impl From<I18nModel> for I18nInput {
  fn from(model: I18nModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      // 语言
      lang_id: model.lang_id.into(),
      lang_id_lbl: model.lang_id_lbl.into(),
      // 菜单
      menu_id: model.menu_id.into(),
      menu_id_lbl: model.menu_id_lbl.into(),
      // 编码
      code: model.code.into(),
      // 名称
      lbl: model.lbl.into(),
      // 备注
      rem: model.rem.into(),
      // 创建人
      create_usr_id: model.create_usr_id.into(),
      create_usr_id_lbl: model.create_usr_id_lbl.into(),
      // 创建时间
      create_time: model.create_time,
      create_time_lbl: model.create_time_lbl.into(),
      // 更新人
      update_usr_id: model.update_usr_id.into(),
      update_usr_id_lbl: model.update_usr_id_lbl.into(),
      // 更新时间
      update_time: model.update_time,
      update_time_lbl: model.update_time_lbl.into(),
    }
  }
}

impl From<I18nInput> for I18nSearch {
  fn from(input: I18nInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      is_deleted: None,
      // 语言
      lang_id: input.lang_id.map(|x| vec![x]),
      // 菜单
      menu_id: input.menu_id.map(|x| vec![x]),
      // 编码
      code: input.code,
      // 名称
      lbl: input.lbl,
      // 备注
      rem: input.rem,
      // 创建人
      create_usr_id: input.create_usr_id.map(|x| vec![x]),
      // 创建时间
      create_time: input.create_time.map(|x| vec![x, x]),
      // 更新人
      update_usr_id: input.update_usr_id.map(|x| vec![x]),
      // 更新时间
      update_time: input.update_time.map(|x| vec![x, x]),
      ..Default::default()
    }
  }
}
