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
pub struct OperationRecordModel {
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
  is_deleted: u8,
}

impl FromRow<'_, MySqlRow> for OperationRecordModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // ID
    let id: String = row.try_get("id")?;
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
    let create_usr_id: String = row.try_get("create_usr_id")?;
    let create_usr_id_lbl: Option<String> = row.try_get("create_usr_id_lbl")?;
    let create_usr_id_lbl = create_usr_id_lbl.unwrap_or_default();
    // 创建时间
    let create_time: Option<chrono::NaiveDateTime> = row.try_get("create_time")?;
    let create_time_lbl: String = match create_time {
      Some(create_time) => create_time.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => "".to_owned(),
    };
    // 更新人
    let update_usr_id: String = row.try_get("update_usr_id")?;
    let update_usr_id_lbl: Option<String> = row.try_get("update_usr_id_lbl")?;
    let update_usr_id_lbl = update_usr_id_lbl.unwrap_or_default();
    // 更新时间
    let update_time: Option<chrono::NaiveDateTime> = row.try_get("update_time")?;
    let update_time_lbl: String = match update_time {
      Some(update_time) => update_time.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => "".to_owned(),
    };
    // 是否已删除
    let is_deleted: u8 = row.try_get("is_deleted")?;
    
    let model = Self {
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
      is_deleted,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct OperationRecordFieldComment {
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

#[derive(InputObject, Debug, Default)]
#[graphql(rename_fields = "snake_case")]
pub struct OperationRecordSearch {
  pub id: Option<String>,
  pub ids: Option<Vec<String>>,
  #[graphql(skip)]
  pub tenant_id: Option<String>,
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

#[derive(FromModel, InputObject, Debug, Default, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct OperationRecordInput {
  pub id: Option<String>,
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

impl From<OperationRecordInput> for OperationRecordSearch {
  fn from(input: OperationRecordInput) -> Self {
    Self {
      id: input.id.map(|x| x.into()),
      ids: None,
      tenant_id: None,
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
