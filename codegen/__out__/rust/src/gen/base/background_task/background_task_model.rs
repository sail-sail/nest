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

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct BackgroundTaskModel {
  /// 租户ID
  pub tenant_id: String,
  /// ID
  pub id: String,
  /// 名称
  pub lbl: String,
  /// 状态
  pub state: String,
  /// 状态
  pub state_lbl: String,
  /// 类型
  pub r#type: String,
  /// 类型
  pub r#type_lbl: String,
  /// 执行结果
  pub result: String,
  /// 错误信息
  pub err_msg: String,
  /// 开始时间
  pub begin_time: Option<chrono::NaiveDateTime>,
  /// 开始时间
  pub begin_time_lbl: String,
  /// 结束时间
  pub end_time: Option<chrono::NaiveDateTime>,
  /// 结束时间
  pub end_time_lbl: String,
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

impl FromRow<'_, MySqlRow> for BackgroundTaskModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: String = row.try_get("id")?;
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 状态
    let state: String = row.try_get("state")?;
    let state_lbl: String = state.to_string();
    // 类型
    let r#type: String = row.try_get("type")?;
    let type_lbl: String = r#type.to_string();
    // 执行结果
    let result: String = row.try_get("result")?;
    // 错误信息
    let err_msg: String = row.try_get("err_msg")?;
    // 开始时间
    let begin_time: Option<chrono::NaiveDateTime> = row.try_get("begin_time")?;
    let begin_time_lbl: String = match begin_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => "".to_owned(),
    };
    // 结束时间
    let end_time: Option<chrono::NaiveDateTime> = row.try_get("end_time")?;
    let end_time_lbl: String = match end_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => "".to_owned(),
    };
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
      tenant_id,
      id,
      lbl,
      state,
      state_lbl,
      r#type,
      type_lbl,
      result,
      err_msg,
      begin_time,
      begin_time_lbl,
      end_time,
      end_time_lbl,
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

#[derive(SimpleObject, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct BackgroundTaskFieldComment {
  /// ID
  pub id: String,
  /// 名称
  pub lbl: String,
  /// 状态
  pub state: String,
  /// 状态
  pub state_lbl: String,
  /// 类型
  pub r#type: String,
  /// 类型
  pub r#type_lbl: String,
  /// 执行结果
  pub result: String,
  /// 错误信息
  pub err_msg: String,
  /// 开始时间
  pub begin_time: String,
  /// 开始时间
  pub begin_time_lbl: String,
  /// 结束时间
  pub end_time: String,
  /// 结束时间
  pub end_time_lbl: String,
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

#[derive(InputObject, Default)]
#[graphql(rename_fields = "snake_case")]
pub struct BackgroundTaskSearch {
  pub id: Option<String>,
  pub ids: Option<Vec<String>>,
  #[graphql(skip)]
  pub tenant_id: Option<String>,
  pub is_deleted: Option<u8>,
  /// 名称
  pub lbl: Option<String>,
  /// 名称
  pub lbl_like: Option<String>,
  /// 状态
  pub state: Option<Vec<String>>,
  /// 类型
  pub r#type: Option<Vec<String>>,
  /// 执行结果
  pub result: Option<String>,
  /// 执行结果
  pub result_like: Option<String>,
  /// 错误信息
  pub err_msg: Option<String>,
  /// 错误信息
  pub err_msg_like: Option<String>,
  /// 开始时间
  pub begin_time: Option<Vec<chrono::NaiveDateTime>>,
  /// 结束时间
  pub end_time: Option<Vec<chrono::NaiveDateTime>>,
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

#[derive(FromModel, InputObject, Default, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct BackgroundTaskInput {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<String>,
  /// ID
  pub id: Option<String>,
  /// 名称
  pub lbl: Option<String>,
  /// 状态
  pub state: Option<String>,
  /// 状态
  pub state_lbl: Option<String>,
  /// 类型
  pub r#type: Option<String>,
  /// 类型
  pub type_lbl: Option<String>,
  /// 执行结果
  pub result: Option<String>,
  /// 错误信息
  pub err_msg: Option<String>,
  /// 开始时间
  pub begin_time: Option<chrono::NaiveDateTime>,
  /// 开始时间
  pub begin_time_lbl: Option<String>,
  /// 结束时间
  pub end_time: Option<chrono::NaiveDateTime>,
  /// 结束时间
  pub end_time_lbl: Option<String>,
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

impl From<BackgroundTaskInput> for BackgroundTaskSearch {
  fn from(input: BackgroundTaskInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 住户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 名称
      lbl: input.lbl,
      // 状态
      state: input.state.map(|x| vec![x]),
      // 类型
      r#type: input.r#type.map(|x| vec![x]),
      // 执行结果
      result: input.result,
      // 错误信息
      err_msg: input.err_msg,
      // 开始时间
      begin_time: input.begin_time.map(|x| vec![x, x]),
      // 结束时间
      end_time: input.end_time.map(|x| vec![x, x]),
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
