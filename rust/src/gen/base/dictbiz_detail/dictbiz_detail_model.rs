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

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct DictbizDetailModel {
  /// 租户ID
  pub tenant_id: String,
  /// ID
  pub id: String,
  /// 业务字典
  pub dictbiz_id: String,
  /// 业务字典
  pub dictbiz_id_lbl: String,
  /// 名称
  pub lbl: String,
  /// 值
  pub val: String,
  /// 锁定
  pub is_locked: u8,
  /// 锁定
  pub is_locked_lbl: String,
  /// 启用
  pub is_enabled: u8,
  /// 启用
  pub is_enabled_lbl: String,
  /// 排序
  pub order_by: u32,
  /// 备注
  pub rem: String,
  /// 系统字段
  pub is_sys: u8,
  /// 系统字段
  pub is_sys_lbl: String,
  /// 是否已删除
  pub is_deleted: u8,
}

impl FromRow<'_, MySqlRow> for DictbizDetailModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: String = row.try_get("id")?;
    // 业务字典
    let dictbiz_id: String = row.try_get("dictbiz_id")?;
    let dictbiz_id_lbl: Option<String> = row.try_get("dictbiz_id_lbl")?;
    let dictbiz_id_lbl = dictbiz_id_lbl.unwrap_or_default();
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 值
    let val: String = row.try_get("val")?;
    // 锁定
    let is_locked: u8 = row.try_get("is_locked")?;
    let is_locked_lbl: String = is_locked.to_string();
    // 启用
    let is_enabled: u8 = row.try_get("is_enabled")?;
    let is_enabled_lbl: String = is_enabled.to_string();
    // 排序
    let order_by: u32 = row.try_get("order_by")?;
    // 备注
    let rem: String = row.try_get("rem")?;
    // 系统字段
    let is_sys: u8 = row.try_get("is_sys")?;
    let is_sys_lbl: String = is_sys.to_string();
    // 是否已删除
    let is_deleted: u8 = row.try_get("is_deleted")?;
    
    let model = Self {
      tenant_id,
      id,
      dictbiz_id,
      dictbiz_id_lbl,
      lbl,
      val,
      is_locked,
      is_locked_lbl,
      is_enabled,
      is_enabled_lbl,
      order_by,
      rem,
      is_sys,
      is_sys_lbl,
      is_deleted,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct DictbizDetailFieldComment {
  /// ID
  pub id: String,
  /// 业务字典
  pub dictbiz_id: String,
  /// 业务字典
  pub dictbiz_id_lbl: String,
  /// 名称
  pub lbl: String,
  /// 值
  pub val: String,
  /// 锁定
  pub is_locked: String,
  /// 锁定
  pub is_locked_lbl: String,
  /// 启用
  pub is_enabled: String,
  /// 启用
  pub is_enabled_lbl: String,
  /// 排序
  pub order_by: String,
  /// 备注
  pub rem: String,
  /// 系统字段
  pub is_sys: String,
  /// 系统字段
  pub is_sys_lbl: String,
}

#[derive(InputObject, Debug, Default)]
#[graphql(rename_fields = "snake_case")]
pub struct DictbizDetailSearch {
  pub id: Option<String>,
  pub ids: Option<Vec<String>>,
  #[graphql(skip)]
  pub tenant_id: Option<String>,
  pub is_deleted: Option<u8>,
  /// 业务字典
  pub dictbiz_id: Option<Vec<String>>,
  /// 业务字典
  pub dictbiz_id_is_null: Option<bool>,
  /// 名称
  pub lbl: Option<String>,
  /// 名称
  pub lbl_like: Option<String>,
  /// 值
  pub val: Option<String>,
  /// 值
  pub val_like: Option<String>,
  /// 锁定
  pub is_locked: Option<Vec<u8>>,
  /// 启用
  pub is_enabled: Option<Vec<u8>>,
  /// 排序
  pub order_by: Option<Vec<u32>>,
  /// 备注
  pub rem: Option<String>,
  /// 备注
  pub rem_like: Option<String>,
  /// 系统字段
  pub is_sys: Option<Vec<u8>>,
}

#[derive(FromModel, InputObject, Debug, Default, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct DictbizDetailInput {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<String>,
  /// ID
  pub id: Option<String>,
  /// 业务字典
  pub dictbiz_id: Option<String>,
  /// 业务字典
  pub dictbiz_id_lbl: Option<String>,
  /// 名称
  pub lbl: Option<String>,
  /// 值
  pub val: Option<String>,
  /// 锁定
  pub is_locked: Option<u8>,
  /// 锁定
  pub is_locked_lbl: Option<String>,
  /// 启用
  pub is_enabled: Option<u8>,
  /// 启用
  pub is_enabled_lbl: Option<String>,
  /// 排序
  pub order_by: Option<u32>,
  /// 备注
  pub rem: Option<String>,
  /// 系统字段
  pub is_sys: Option<u8>,
  /// 系统字段
  pub is_sys_lbl: Option<String>,
}

impl From<DictbizDetailInput> for DictbizDetailSearch {
  fn from(input: DictbizDetailInput) -> Self {
    Self {
      id: input.id.map(|x| x.into()),
      ids: None,
      // 住户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 业务字典
      dictbiz_id: input.dictbiz_id.map(|x| vec![x.into()]),
      // 名称
      lbl: input.lbl,
      // 值
      val: input.val,
      // 锁定
      is_locked: input.is_locked.map(|x| vec![x.into()]),
      // 启用
      is_enabled: input.is_enabled.map(|x| vec![x.into()]),
      // 排序
      order_by: input.order_by.map(|x| vec![x.clone().into(), x.clone().into()]),
      // 备注
      rem: input.rem,
      // 系统字段
      is_sys: input.is_sys.map(|x| vec![x.into()]),
      ..Default::default()
    }
  }
}
