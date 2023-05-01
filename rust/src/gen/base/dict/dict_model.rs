use serde::{Serialize, Deserialize};
use sqlx::{FromRow, mysql::MySqlRow, Row};
use async_graphql::{SimpleObject, InputObject, ID};

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct DictModel {
  /// ID
  pub id: ID,
  /// 编码
  pub code: String,
  /// 名称
  pub lbl: String,
  /// 数据类型
  pub r#type: String,
  pub r#type_lbl: String,
  /// 排序
  pub order_by: i64,
  /// 启用
  pub is_enabled: u8,
  pub is_enabled_lbl: String,
  /// 备注
  pub rem: String,
  /// 锁定
  pub is_locked: u8,
  pub is_locked_lbl: String,
  /// 创建人
  pub create_usr_id: String,
  pub create_usr_id_lbl: String,
  /// 创建时间
  pub create_time: String,
  /// 更新人
  pub update_usr_id: String,
  pub update_usr_id_lbl: String,
  /// 更新时间
  pub update_time: String,
}

impl FromRow<'_, MySqlRow> for DictModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // ID
    let id: String = row.try_get("id")?;
    let id: ID = id.into();
    // 编码
    let code: String = row.try_get("code")?;
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 数据类型
    let r#type: String = row.try_get("r#type")?;
    let r#type_lbl: String = r#type.to_string();
    // 排序
    let order_by: i64 = row.try_get("order_by")?;
    // 启用
    let is_enabled: u8 = row.try_get("is_enabled")?;
    let is_enabled_lbl: String = is_enabled.to_string();
    // 备注
    let rem: String = row.try_get("rem")?;
    // 锁定
    let is_locked: u8 = row.try_get("is_locked")?;
    let is_locked_lbl: String = is_locked.to_string();
    // 创建人
    let create_usr_id: String = row.try_get("create_usr_id")?;
    let create_usr_id_lbl: String = create_usr_id.to_string();
    // 创建时间
    let create_time: String = row.try_get("create_time")?;
    // 更新人
    let update_usr_id: String = row.try_get("update_usr_id")?;
    let update_usr_id_lbl: String = update_usr_id.to_string();
    // 更新时间
    let update_time: String = row.try_get("update_time")?;
    
    let model = Self {
      id,
      code,
      lbl,
      r#type,
      r#type_lbl,
      order_by,
      is_enabled,
      is_enabled_lbl,
      rem,
      is_locked,
      is_locked_lbl,
      create_usr_id,
      create_usr_id_lbl,
      create_time,
      update_usr_id,
      update_usr_id_lbl,
      update_time,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct DictFieldComment {
  /// 编码
  pub code: String,
  /// 名称
  pub lbl: String,
  /// 数据类型
  pub r#type: String,
  pub r#type_lbl: String,
  /// 排序
  pub order_by: String,
  /// 启用
  pub is_enabled: String,
  pub is_enabled_lbl: String,
  /// 备注
  pub rem: String,
  /// 锁定
  pub is_locked: String,
  pub is_locked_lbl: String,
  /// 创建人
  pub create_usr_id: String,
  pub create_usr_id_lbl: String,
  /// 创建时间
  pub create_time: String,
  /// 更新人
  pub update_usr_id: String,
  pub update_usr_id_lbl: String,
  /// 更新时间
  pub update_time: String,
}

#[derive(InputObject, Debug, Default)]
#[graphql(rename_fields = "snake_case")]
pub struct DictSearch {
  pub id: Option<String>,
  pub ids: Option<Vec<String>>,
  #[graphql(skip)]
  pub tenant_id: Option<String>,
  pub is_deleted: Option<u8>,
  /// 编码
  pub code: Option<String>,
  /// 名称
  pub lbl: Option<String>,
  /// 数据类型
  pub r#type: Option<Vec<String>>,
  /// 排序
  pub order_by: Option<Vec<i64>>,
  /// 启用
  pub is_enabled: Option<Vec<u8>>,
  /// 备注
  pub rem: Option<String>,
  /// 锁定
  pub is_locked: Option<Vec<u8>>,
  /// 创建人
  pub create_usr_id: Option<Vec<String>>,
  pub create_usr_id_is_null: Option<bool>,
  /// 创建时间
  pub create_time: Option<Vec<String>>,
  /// 更新人
  pub update_usr_id: Option<Vec<String>>,
  pub update_usr_id_is_null: Option<bool>,
  /// 更新时间
  pub update_time: Option<Vec<String>>,
}

#[derive(FromModel, InputObject, Debug, Default, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct DictInput {
  pub id: Option<ID>,
  /// 编码
  pub code: Option<String>,
  /// 名称
  pub lbl: Option<String>,
  /// 数据类型
  pub r#type: Option<String>,
  pub r#type_lbl: Option<String>,
  /// 排序
  pub order_by: Option<i64>,
  /// 启用
  pub is_enabled: Option<u8>,
  pub is_enabled_lbl: Option<String>,
  /// 备注
  pub rem: Option<String>,
  /// 锁定
  pub is_locked: Option<u8>,
  pub is_locked_lbl: Option<String>,
  /// 创建人
  pub create_usr_id: Option<String>,
  pub create_usr_id_lbl: Option<String>,
  /// 创建时间
  pub create_time: Option<String>,
  /// 更新人
  pub update_usr_id: Option<String>,
  pub update_usr_id_lbl: Option<String>,
  /// 更新时间
  pub update_time: Option<String>,
}

impl From<DictInput> for DictSearch {
  fn from(input: DictInput) -> Self {
    Self {
      id: input.id.map(|x| x.into()),
      ids: None,
      tenant_id: None,
      is_deleted: None,
      // 编码
      code: input.code,
      // 名称
      lbl: input.lbl,
      // 数据类型
      r#type: input.r#type.map(|x| vec![x.into()]),
      // 排序
      order_by: input.order_by.map(|x| vec![x.clone().into(), x.clone().into()]),
      // 启用
      is_enabled: input.is_enabled.map(|x| vec![x.into()]),
      // 备注
      rem: input.rem,
      // 锁定
      is_locked: input.is_locked.map(|x| vec![x.into()]),
      // 创建人
      create_usr_id: input.create_usr_id.map(|x| vec![x.into()]),
      // 创建时间
      create_time: input.create_time.map(|x| vec![x.clone().into(), x.clone().into()]),
      // 更新人
      update_usr_id: input.update_usr_id.map(|x| vec![x.into()]),
      // 更新时间
      update_time: input.update_time.map(|x| vec![x.clone().into(), x.clone().into()]),
      ..Default::default()
    }
  }
}
