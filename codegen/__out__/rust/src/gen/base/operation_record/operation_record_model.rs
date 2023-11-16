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

use crate::common::id::ID;

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct OperationRecordModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: ID,
  /// ID
  pub id: ID,
  /// 模块
  pub module: String,
  /// 模块名称
  pub module_lbl: String,
  /// 方法
  pub method: String,
  /// 方法名称
  pub method_lbl: String,
  /// 操作
  pub lbl: String,
  /// 操作前数据
  pub old_data: String,
  /// 操作后数据
  pub new_data: String,
  /// 备注
  pub rem: String,
  /// 创建人
  pub create_usr_id: ID,
  /// 创建人
  pub create_usr_id_lbl: String,
  /// 创建时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  pub create_time_lbl: String,
  /// 更新人
  pub update_usr_id: ID,
  /// 更新人
  pub update_usr_id_lbl: String,
  /// 更新时间
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  pub update_time_lbl: String,
  /// 是否已删除
  pub is_deleted: u8,
}

impl FromRow<'_, MySqlRow> for OperationRecordModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: ID = row.try_get("id")?;
    // 模块
    let module: String = row.try_get("module")?;
    // 模块名称
    let module_lbl: String = row.try_get("module_lbl")?;
    // 方法
    let method: String = row.try_get("method")?;
    // 方法名称
    let method_lbl: String = row.try_get("method_lbl")?;
    // 操作
    let lbl: String = row.try_get("lbl")?;
    // 操作前数据
    let old_data: String = row.try_get("old_data")?;
    // 操作后数据
    let new_data: String = row.try_get("new_data")?;
    // 备注
    let rem: String = row.try_get("rem")?;
    // 创建人
    let create_usr_id: ID = row.try_get("create_usr_id")?;
    let create_usr_id_lbl: Option<String> = row.try_get("create_usr_id_lbl")?;
    let create_usr_id_lbl = create_usr_id_lbl.unwrap_or_default();
    // 创建时间
    let create_time: Option<chrono::NaiveDateTime> = row.try_get("create_time")?;
    let create_time_lbl: String = match create_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => "".to_owned(),
    };
    // 更新人
    let update_usr_id: ID = row.try_get("update_usr_id")?;
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
      tenant_id,
      is_deleted,
      id,
      module,
      module_lbl,
      method,
      method_lbl,
      lbl,
      old_data,
      new_data,
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
pub struct OperationRecordFieldComment {
  /// ID
  pub id: String,
  /// 模块
  pub module: String,
  /// 模块名称
  pub module_lbl: String,
  /// 方法
  pub method: String,
  /// 方法名称
  pub method_lbl: String,
  /// 操作
  pub lbl: String,
  /// 操作前数据
  pub old_data: String,
  /// 操作后数据
  pub new_data: String,
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
pub struct OperationRecordSearch {
  pub id: Option<ID>,
  pub ids: Option<Vec<ID>>,
  #[graphql(skip)]
  pub tenant_id: Option<ID>,
  pub is_deleted: Option<u8>,
  /// 模块
  pub module: Option<String>,
  /// 模块
  pub module_like: Option<String>,
  /// 模块名称
  pub module_lbl: Option<String>,
  /// 模块名称
  pub module_lbl_like: Option<String>,
  /// 方法
  pub method: Option<String>,
  /// 方法
  pub method_like: Option<String>,
  /// 方法名称
  pub method_lbl: Option<String>,
  /// 方法名称
  pub method_lbl_like: Option<String>,
  /// 操作
  pub lbl: Option<String>,
  /// 操作
  pub lbl_like: Option<String>,
  /// 操作前数据
  pub old_data: Option<String>,
  /// 操作前数据
  pub old_data_like: Option<String>,
  /// 操作后数据
  pub new_data: Option<String>,
  /// 操作后数据
  pub new_data_like: Option<String>,
  /// 备注
  pub rem: Option<String>,
  /// 备注
  pub rem_like: Option<String>,
  /// 创建人
  pub create_usr_id: Option<Vec<ID>>,
  /// 创建人
  pub create_usr_id_is_null: Option<bool>,
  /// 创建时间
  pub create_time: Option<Vec<chrono::NaiveDateTime>>,
  /// 更新人
  pub update_usr_id: Option<Vec<ID>>,
  /// 更新人
  pub update_usr_id_is_null: Option<bool>,
  /// 更新时间
  pub update_time: Option<Vec<chrono::NaiveDateTime>>,
}

#[derive(InputObject, Default, Clone, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct OperationRecordInput {
  /// ID
  pub id: Option<ID>,
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<ID>,
  /// 模块
  pub module: Option<String>,
  /// 模块名称
  pub module_lbl: Option<String>,
  /// 方法
  pub method: Option<String>,
  /// 方法名称
  pub method_lbl: Option<String>,
  /// 操作
  pub lbl: Option<String>,
  /// 操作前数据
  pub old_data: Option<String>,
  /// 操作后数据
  pub new_data: Option<String>,
  /// 备注
  pub rem: Option<String>,
  /// 创建人
  pub create_usr_id: Option<ID>,
  /// 创建人
  pub create_usr_id_lbl: Option<String>,
  /// 创建时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  pub create_time_lbl: Option<String>,
  /// 更新人
  pub update_usr_id: Option<ID>,
  /// 更新人
  pub update_usr_id_lbl: Option<String>,
  /// 更新时间
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  pub update_time_lbl: Option<String>,
}

impl From<OperationRecordModel> for OperationRecordInput {
  fn from(model: OperationRecordModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 模块
      module: model.module.into(),
      // 模块名称
      module_lbl: model.module_lbl.into(),
      // 方法
      method: model.method.into(),
      // 方法名称
      method_lbl: model.method_lbl.into(),
      // 操作
      lbl: model.lbl.into(),
      // 操作前数据
      old_data: model.old_data.into(),
      // 操作后数据
      new_data: model.new_data.into(),
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

impl From<OperationRecordInput> for OperationRecordSearch {
  fn from(input: OperationRecordInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 模块
      module: input.module,
      // 模块名称
      module_lbl: input.module_lbl,
      // 方法
      method: input.method,
      // 方法名称
      method_lbl: input.method_lbl,
      // 操作
      lbl: input.lbl,
      // 操作前数据
      old_data: input.old_data,
      // 操作后数据
      new_data: input.new_data,
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
