
use std::fmt;
use std::ops::Deref;
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::str::FromStr;
use std::sync::OnceLock;

use serde::{Serialize, Deserialize};

use color_eyre::eyre::{Result,eyre};

use sqlx::encode::{Encode, IsNull};
use sqlx::error::BoxDynError;
use sqlx::MySql;
use sqlx::mysql::MySqlValueRef;
use smol_str::SmolStr;

use sqlx::{
  FromRow,
  mysql::MySqlRow,
  Row,
};

#[allow(unused_imports)]
use async_graphql::{
  SimpleObject,
  InputObject,
  Enum,
};

use crate::common::context::ArgType;
use crate::common::gql::model::SortInput;

use crate::r#gen::base::tenant::tenant_model::TenantId;
use crate::r#gen::cron::cron_job_log::cron_job_log_model::CronJobLogId;
use crate::r#gen::base::usr::usr_model::UsrId;

static CAN_SORT_IN_API_CRON_JOB_LOG_DETAIL: OnceLock<[&'static str; 2]> = OnceLock::new();

/// 定时任务日志明细 前端允许排序的字段
fn get_can_sort_in_api_cron_job_log_detail() -> &'static [&'static str; 2] {
  CAN_SORT_IN_API_CRON_JOB_LOG_DETAIL.get_or_init(|| [
    "create_time",
    "update_time",
  ])
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "CronJobLogDetailModel")]
#[allow(dead_code)]
pub struct CronJobLogDetailModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: CronJobLogDetailId,
  /// 定时任务日志
  #[graphql(name = "cron_job_log_id")]
  pub cron_job_log_id: CronJobLogId,
  /// 日志明细
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 是否已删除
  pub is_deleted: u8,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id: UsrId,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id_lbl: String,
  /// 创建时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  pub create_time_lbl: String,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id: UsrId,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_lbl: String,
  /// 更新时间
  #[graphql(skip)]
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time_lbl: String,
}

impl FromRow<'_, MySqlRow> for CronJobLogDetailModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: CronJobLogDetailId = row.try_get("id")?;
    // 定时任务日志
    let cron_job_log_id: CronJobLogId = row.try_get("cron_job_log_id")?;
    // 日志明细
    let lbl: String = row.try_get("lbl")?;
    // 创建人
    let create_usr_id: UsrId = row.try_get("create_usr_id")?;
    let create_usr_id_lbl: Option<String> = row.try_get("create_usr_id_lbl")?;
    let create_usr_id_lbl = create_usr_id_lbl.unwrap_or_default();
    // 创建时间
    let create_time: Option<chrono::NaiveDateTime> = row.try_get("create_time")?;
    let create_time_lbl: String = match create_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => String::new(),
    };
    // 更新人
    let update_usr_id: UsrId = row.try_get("update_usr_id")?;
    let update_usr_id_lbl: Option<String> = row.try_get("update_usr_id_lbl")?;
    let update_usr_id_lbl = update_usr_id_lbl.unwrap_or_default();
    // 更新时间
    let update_time: Option<chrono::NaiveDateTime> = row.try_get("update_time")?;
    let update_time_lbl: String = match update_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => String::new(),
    };
    // 是否已删除
    let is_deleted: u8 = row.try_get("is_deleted")?;
    
    let model = Self {
      tenant_id,
      is_deleted,
      id,
      cron_job_log_id,
      lbl,
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
#[allow(dead_code)]
pub struct CronJobLogDetailFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: String,
  /// 定时任务日志
  #[graphql(name = "cron_job_log_id")]
  pub cron_job_log_id: String,
  /// 定时任务日志
  #[graphql(name = "cron_job_log_id_lbl")]
  pub cron_job_log_id_lbl: String,
  /// 日志明细
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 创建时间
  #[graphql(name = "create_time")]
  pub create_time: String,
  /// 创建时间
  #[graphql(name = "create_time_lbl")]
  pub create_time_lbl: String,
}

#[derive(InputObject, Default)]
#[graphql(rename_fields = "snake_case")]
#[allow(dead_code)]
pub struct CronJobLogDetailSearch {
  /// ID
  pub id: Option<CronJobLogDetailId>,
  /// ID列表
  pub ids: Option<Vec<CronJobLogDetailId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 定时任务日志
  #[graphql(name = "cron_job_log_id")]
  pub cron_job_log_id: Option<Vec<CronJobLogId>>,
  /// 定时任务日志
  #[graphql(name = "cron_job_log_id_save_null")]
  pub cron_job_log_id_is_null: Option<bool>,
  /// 日志明细
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 日志明细
  #[graphql(name = "lbl_like")]
  pub lbl_like: Option<String>,
  /// 创建时间
  #[graphql(name = "create_time")]
  pub create_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id: Option<Vec<UsrId>>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id_is_null: Option<bool>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id_lbl: Option<Vec<String>>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id_lbl_like: Option<String>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id: Option<Vec<UsrId>>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_is_null: Option<bool>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_lbl: Option<Vec<String>>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_lbl_like: Option<String>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
}

impl std::fmt::Debug for CronJobLogDetailSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("CronJobLogDetailSearch");
    if let Some(ref id) = self.id {
      item = item.field("id", id);
    }
    if let Some(ref ids) = self.ids {
      item = item.field("ids", ids);
    }
    if let Some(ref tenant_id) = self.tenant_id {
      item = item.field("tenant_id", tenant_id);
    }
    if let Some(ref is_deleted) = self.is_deleted {
      if *is_deleted == 1 {
        item = item.field("is_deleted", is_deleted);
      }
    }
    // 定时任务日志
    if let Some(ref cron_job_log_id) = self.cron_job_log_id {
      item = item.field("cron_job_log_id", cron_job_log_id);
    }
    if let Some(ref cron_job_log_id_is_null) = self.cron_job_log_id_is_null {
      item = item.field("cron_job_log_id_is_null", cron_job_log_id_is_null);
    }
    // 日志明细
    if let Some(ref lbl) = self.lbl {
      item = item.field("lbl", lbl);
    }
    if let Some(ref lbl_like) = self.lbl_like {
      item = item.field("lbl_like", lbl_like);
    }
    // 创建时间
    if let Some(ref create_time) = self.create_time {
      item = item.field("create_time", create_time);
    }
    // 创建人
    if let Some(ref create_usr_id) = self.create_usr_id {
      item = item.field("create_usr_id", create_usr_id);
    }
    if let Some(ref create_usr_id_is_null) = self.create_usr_id_is_null {
      item = item.field("create_usr_id_is_null", create_usr_id_is_null);
    }
    // 更新人
    if let Some(ref update_usr_id) = self.update_usr_id {
      item = item.field("update_usr_id", update_usr_id);
    }
    if let Some(ref update_usr_id_is_null) = self.update_usr_id_is_null {
      item = item.field("update_usr_id_is_null", update_usr_id_is_null);
    }
    // 更新时间
    if let Some(ref update_time) = self.update_time {
      item = item.field("update_time", update_time);
    }
    item.finish()
  }
}

#[derive(InputObject, Default, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "CronJobLogDetailInput")]
#[allow(dead_code)]
pub struct CronJobLogDetailInput {
  /// ID
  pub id: Option<CronJobLogDetailId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 定时任务日志
  #[graphql(name = "cron_job_log_id")]
  pub cron_job_log_id: Option<CronJobLogId>,
  /// 日志明细
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id: Option<UsrId>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id_lbl: Option<String>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time_lbl: Option<String>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time_save_null: Option<bool>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id: Option<UsrId>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_lbl: Option<String>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time_lbl: Option<String>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time_save_null: Option<bool>,
}

impl From<CronJobLogDetailModel> for CronJobLogDetailInput {
  fn from(model: CronJobLogDetailModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 定时任务日志
      cron_job_log_id: model.cron_job_log_id.into(),
      // 日志明细
      lbl: model.lbl.into(),
      // 创建人
      create_usr_id: model.create_usr_id.into(),
      create_usr_id_lbl: model.create_usr_id_lbl.into(),
      // 创建时间
      create_time: model.create_time,
      create_time_lbl: model.create_time_lbl.into(),
      create_time_save_null: Some(true),
      // 更新人
      update_usr_id: model.update_usr_id.into(),
      update_usr_id_lbl: model.update_usr_id_lbl.into(),
      // 更新时间
      update_time: model.update_time,
      update_time_lbl: model.update_time_lbl.into(),
      update_time_save_null: Some(true),
    }
  }
}

impl From<CronJobLogDetailInput> for CronJobLogDetailSearch {
  fn from(input: CronJobLogDetailInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 定时任务日志
      cron_job_log_id: input.cron_job_log_id.map(|x| vec![x]),
      // 日志明细
      lbl: input.lbl,
      // 创建时间
      create_time: input.create_time.map(|x| [Some(x), Some(x)]),
      // 创建人
      create_usr_id: input.create_usr_id.map(|x| vec![x]),
      // 创建人
      create_usr_id_lbl: input.create_usr_id_lbl.map(|x| vec![x]),
      // 更新人
      update_usr_id: input.update_usr_id.map(|x| vec![x]),
      // 更新人
      update_usr_id_lbl: input.update_usr_id_lbl.map(|x| vec![x]),
      // 更新时间
      update_time: input.update_time.map(|x| [Some(x), Some(x)]),
      ..Default::default()
    }
  }
}

#[derive(Default, Serialize, Deserialize, Clone, Debug, PartialEq, Eq, Hash)]
pub struct CronJobLogDetailId(SmolStr);

impl fmt::Display for CronJobLogDetailId {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}", self.0)
  }
}

#[async_graphql::Scalar(name = "CronJobLogDetailId")]
impl async_graphql::ScalarType for CronJobLogDetailId {
  fn parse(value: async_graphql::Value) -> async_graphql::InputValueResult<Self> {
    match value {
      async_graphql::Value::String(s) => Ok(Self(s.into())),
      _ => Err(async_graphql::InputValueError::expected_type(value)),
    }
  }
  
  fn to_value(&self) -> async_graphql::Value {
    async_graphql::Value::String(self.0.clone().into())
  }
}

impl From<CronJobLogDetailId> for ArgType {
  fn from(value: CronJobLogDetailId) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl From<&CronJobLogDetailId> for ArgType {
  fn from(value: &CronJobLogDetailId) -> Self {
    ArgType::SmolStr(value.clone().into())
  }
}

impl From<CronJobLogDetailId> for SmolStr {
  fn from(id: CronJobLogDetailId) -> Self {
    id.0
  }
}

impl From<SmolStr> for CronJobLogDetailId {
  fn from(s: SmolStr) -> Self {
    Self(s)
  }
}

impl From<&SmolStr> for CronJobLogDetailId {
  fn from(s: &SmolStr) -> Self {
    Self(s.clone())
  }
}

impl From<String> for CronJobLogDetailId {
  fn from(s: String) -> Self {
    Self(s.into())
  }
}

impl From<&str> for CronJobLogDetailId {
  fn from(s: &str) -> Self {
    Self(s.into())
  }
}

impl Deref for CronJobLogDetailId {
  type Target = SmolStr;
  
  fn deref(&self) -> &SmolStr {
    &self.0
  }
}

impl Encode<'_, MySql> for CronJobLogDetailId {
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> sqlx::Result<IsNull, BoxDynError> {
    <&str as Encode<MySql>>::encode(self.as_str(), buf)
  }
  
  fn size_hint(&self) -> usize {
    self.len()
  }
}

impl sqlx::Type<MySql> for CronJobLogDetailId {
  fn type_info() -> <MySql as sqlx::Database>::TypeInfo {
    <&str as sqlx::Type<MySql>>::type_info()
  }
  
  fn compatible(ty: &<MySql as sqlx::Database>::TypeInfo) -> bool {
    <&str as sqlx::Type<MySql>>::compatible(ty)
  }
}

impl<'r> sqlx::Decode<'r, MySql> for CronJobLogDetailId {
  fn decode(
    value: MySqlValueRef<'r>,
  ) -> Result<Self, BoxDynError> {
    <&str as sqlx::Decode<MySql>>::decode(value).map(Self::from)
  }
}

impl PartialEq<str> for CronJobLogDetailId {
  fn eq(&self, other: &str) -> bool {
    self.0 == other
  }
}

/// 定时任务日志明细 检测字段是否允许前端排序
pub fn check_sort_cron_job_log_detail(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  let sort = sort.unwrap();
  
  let get_can_sort_in_api_cron_job_log_detail = get_can_sort_in_api_cron_job_log_detail();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_cron_job_log_detail.contains(&prop) {
      return Err(eyre!("check_sort_cron_job_log_detail: {}", serde_json::to_string(item)?));
    }
  }
  
  Ok(())
}

/// 获取路由地址
pub fn get_route_path_cron_job_log_detail() -> String {
  "/cron/cron_job_log_detail".to_owned()
}
