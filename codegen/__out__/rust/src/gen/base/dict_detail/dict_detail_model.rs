use serde::{Serialize, Deserialize};
use sqlx::{FromRow, mysql::MySqlRow, Row};
use async_graphql::{SimpleObject, InputObject};

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct DictDetailModel {
  /// ID
  pub id: String,
  /// 系统字典
  pub dict_id: String,
  /// 系统字典
  pub dict_id_lbl: String,
  /// 名称
  pub lbl: String,
  /// 值
  pub val: String,
  /// 排序
  pub order_by: u32,
  /// 启用
  pub is_enabled: u8,
  /// 启用
  pub is_enabled_lbl: String,
  /// 备注
  pub rem: String,
  /// 锁定
  pub is_locked: u8,
  /// 锁定
  pub is_locked_lbl: String,
}

impl FromRow<'_, MySqlRow> for DictDetailModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // ID
    let id: String = row.try_get("id")?;
    // 系统字典
    let dict_id: String = row.try_get("dict_id")?;
    let dict_id_lbl: Option<String> = row.try_get("dict_id_lbl")?;
    let dict_id_lbl = dict_id_lbl.unwrap_or_default();
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 值
    let val: String = row.try_get("val")?;
    // 排序
    let order_by: u32 = row.try_get("order_by")?;
    // 启用
    let is_enabled: u8 = row.try_get("is_enabled")?;
    let is_enabled_lbl: String = is_enabled.to_string();
    // 备注
    let rem: String = row.try_get("rem")?;
    // 锁定
    let is_locked: u8 = row.try_get("is_locked")?;
    let is_locked_lbl: String = is_locked.to_string();
    
    let model = Self {
      id,
      dict_id,
      dict_id_lbl,
      lbl,
      val,
      order_by,
      is_enabled,
      is_enabled_lbl,
      rem,
      is_locked,
      is_locked_lbl,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct DictDetailFieldComment {
  /// 系统字典
  pub dict_id: String,
  /// 系统字典
  pub dict_id_lbl: String,
  /// 名称
  pub lbl: String,
  /// 值
  pub val: String,
  /// 排序
  pub order_by: String,
  /// 启用
  pub is_enabled: String,
  /// 启用
  pub is_enabled_lbl: String,
  /// 备注
  pub rem: String,
  /// 锁定
  pub is_locked: String,
  /// 锁定
  pub is_locked_lbl: String,
}

#[derive(InputObject, Debug, Default)]
#[graphql(rename_fields = "snake_case")]
pub struct DictDetailSearch {
  pub id: Option<String>,
  pub ids: Option<Vec<String>>,
  pub is_deleted: Option<u8>,
  /// 系统字典
  pub dict_id: Option<Vec<String>>,
  /// 系统字典
  pub dict_id_is_null: Option<bool>,
  /// 名称
  pub lbl: Option<String>,
  /// 名称
  pub lbl_like: Option<String>,
  /// 值
  pub val: Option<String>,
  /// 值
  pub val_like: Option<String>,
  /// 排序
  pub order_by: Option<Vec<u32>>,
  /// 启用
  pub is_enabled: Option<Vec<u8>>,
  /// 备注
  pub rem: Option<String>,
  /// 备注
  pub rem_like: Option<String>,
  /// 锁定
  pub is_locked: Option<Vec<u8>>,
}

#[derive(FromModel, InputObject, Debug, Default, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct DictDetailInput {
  pub id: Option<String>,
  /// 系统字典
  pub dict_id: Option<String>,
  /// 系统字典
  pub dict_id_lbl: Option<String>,
  /// 名称
  pub lbl: Option<String>,
  /// 值
  pub val: Option<String>,
  /// 排序
  pub order_by: Option<u32>,
  /// 启用
  pub is_enabled: Option<u8>,
  /// 启用
  pub is_enabled_lbl: Option<String>,
  /// 备注
  pub rem: Option<String>,
  /// 锁定
  pub is_locked: Option<u8>,
  /// 锁定
  pub is_locked_lbl: Option<String>,
}

impl From<DictDetailInput> for DictDetailSearch {
  fn from(input: DictDetailInput) -> Self {
    Self {
      id: input.id.map(|x| x.into()),
      ids: None,
      is_deleted: None,
      // 系统字典
      dict_id: input.dict_id.map(|x| vec![x.into()]),
      // 名称
      lbl: input.lbl,
      // 值
      val: input.val,
      // 排序
      order_by: input.order_by.map(|x| vec![x.clone().into(), x.clone().into()]),
      // 启用
      is_enabled: input.is_enabled.map(|x| vec![x.into()]),
      // 备注
      rem: input.rem,
      // 锁定
      is_locked: input.is_locked.map(|x| vec![x.into()]),
      ..Default::default()
    }
  }
}
