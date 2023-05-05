use serde::{Serialize, Deserialize};
use sqlx::{FromRow, mysql::MySqlRow, Row};
use async_graphql::{SimpleObject, InputObject, ID};

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct OperationRecordModel {
  /// ID
  pub id: ID,
  /// 模块
  pub r#mod: String,
  /// 模块名称
  pub mod_lbl: String,
  /// 方法
  pub method: String,
  /// 方法名称
  pub method_lbl: String,
  /// 操作
  pub lbl: String,
  /// 备注
  pub rem: String,
  /// 创建人
  pub create_usr_id: String,
  pub create_usr_id_lbl: String,
  /// 创建时间
  pub create_time: Option<String>,
  /// 更新人
  pub update_usr_id: String,
  pub update_usr_id_lbl: String,
  /// 更新时间
  pub update_time: Option<String>,
}

impl FromRow<'_, MySqlRow> for OperationRecordModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // ID
    let id: String = row.try_get("id")?;
    let id: ID = id.into();
    // 模块
    let r#mod: String = row.try_get("mod")?;
    // 模块名称
    let mod_lbl: String = row.try_get("mod_lbl")?;
    // 方法
    let method: String = row.try_get("method")?;
    // 方法名称
    let method_lbl: String = row.try_get("method_lbl")?;
    // 操作
    let lbl: String = row.try_get("lbl")?;
    // 备注
    let rem: String = row.try_get("rem")?;
    // 创建人
    let create_usr_id: String = row.try_get("create_usr_id")?;
    let create_usr_id_lbl: String = create_usr_id.to_string();
    // 创建时间
    let create_time: Option<String> = row.try_get("create_time")?;
    // 更新人
    let update_usr_id: String = row.try_get("update_usr_id")?;
    let update_usr_id_lbl: String = update_usr_id.to_string();
    // 更新时间
    let update_time: Option<String> = row.try_get("update_time")?;
    
    let model = Self {
      id,
      r#mod,
      mod_lbl,
      method,
      method_lbl,
      lbl,
      rem,
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
pub struct OperationRecordFieldComment {
  /// 模块
  pub r#mod: String,
  /// 模块名称
  pub mod_lbl: String,
  /// 方法
  pub method: String,
  /// 方法名称
  pub method_lbl: String,
  /// 操作
  pub lbl: String,
  /// 备注
  pub rem: String,
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
pub struct OperationRecordSearch {
  pub id: Option<String>,
  pub ids: Option<Vec<String>>,
  #[graphql(skip)]
  pub tenant_id: Option<String>,
  pub is_deleted: Option<u8>,
  /// 模块
  pub r#mod: Option<String>,
  pub mod_like: Option<String>,
  /// 模块名称
  pub mod_lbl: Option<String>,
  pub mod_lbl_like: Option<String>,
  /// 方法
  pub method: Option<String>,
  pub method_like: Option<String>,
  /// 方法名称
  pub method_lbl: Option<String>,
  pub method_lbl_like: Option<String>,
  /// 操作
  pub lbl: Option<String>,
  pub lbl_like: Option<String>,
  /// 备注
  pub rem: Option<String>,
  pub rem_like: Option<String>,
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
pub struct OperationRecordInput {
  pub id: Option<ID>,
  /// 模块
  pub r#mod: Option<String>,
  /// 模块名称
  pub mod_lbl: Option<String>,
  /// 方法
  pub method: Option<String>,
  /// 方法名称
  pub method_lbl: Option<String>,
  /// 操作
  pub lbl: Option<String>,
  /// 备注
  pub rem: Option<String>,
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

impl From<OperationRecordInput> for OperationRecordSearch {
  fn from(input: OperationRecordInput) -> Self {
    Self {
      id: input.id.map(|x| x.into()),
      ids: None,
      tenant_id: None,
      is_deleted: None,
      // 模块
      r#mod: input.r#mod,
      // 模块名称
      mod_lbl: input.mod_lbl,
      // 方法
      method: input.method,
      // 方法名称
      method_lbl: input.method_lbl,
      // 操作
      lbl: input.lbl,
      // 备注
      rem: input.rem,
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
