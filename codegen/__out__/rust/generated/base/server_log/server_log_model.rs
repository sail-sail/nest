#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]
#![allow(clippy::collapsible_if)]

#[allow(unused_imports)]
use std::fmt;
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::str::FromStr;
use std::sync::OnceLock;

use serde::{Serialize, Deserialize};
use color_eyre::eyre::{Result, eyre};

#[allow(unused_imports)]
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

#[allow(unused_imports)]
use crate::common::context::ArgType;
use crate::common::gql::model::SortInput;
use crate::common::id::{Id, impl_id};

static CAN_SORT_IN_API_SERVER_LOG: OnceLock<[&'static str; 1]> = OnceLock::new();

/// 系统日志 前端允许排序的字段
fn get_can_sort_in_api_server_log() -> &'static [&'static str; 1] {
  CAN_SORT_IN_API_SERVER_LOG.get_or_init(|| [
    "log_time",
  ])
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "ServerLogModel")]
#[allow(dead_code)]
pub struct ServerLogModel {
  /// ID
  pub id: ServerLogId,
  /// 日志日期
  #[graphql(name = "log_date")]
  pub log_date: chrono::NaiveDate,
  /// 日志日期
  #[graphql(name = "log_date_lbl")]
  pub log_date_lbl: SmolStr,
  /// 日志时间
  #[graphql(name = "log_time")]
  pub log_time: chrono::NaiveDateTime,
  /// 日志时间
  #[graphql(name = "log_time_lbl")]
  pub log_time_lbl: SmolStr,
  /// 日志级别
  #[graphql(name = "level")]
  pub level: ServerLogLevel,
  /// 日志级别
  #[graphql(name = "level_lbl")]
  pub level_lbl: SmolStr,
  /// 模块
  #[graphql(name = "module")]
  pub module: SmolStr,
  /// 请求ID
  #[graphql(name = "req_id")]
  pub req_id: SmolStr,
  /// 日志内容
  #[graphql(name = "content")]
  pub content: Option<SmolStr>,
}

impl FromRow<'_, MySqlRow> for ServerLogModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // ID
    let id: ServerLogId = row.try_get("id")?;
    // 日志日期
    let log_date: chrono::NaiveDate = row.try_get("log_date")?;
    let log_date_lbl = SmolStr::new(log_date.format("%Y-%m-%d").to_string());
    // 日志时间
    let log_time: chrono::NaiveDateTime = row.try_get("log_time")?;
    let log_time_lbl = SmolStr::new(log_time.format("%Y-%m-%d %H:%M:%S").to_string());
    // 日志级别
    let level_lbl: &str = row.try_get("level")?;
    let level: ServerLogLevel = level_lbl.try_into()?;
    let level_lbl = SmolStr::new(level_lbl);
    // 模块
    let module: &str = row.try_get("module")?;
    let module = SmolStr::new(module);
    // 请求ID
    let req_id: &str = row.try_get("req_id")?;
    let req_id = SmolStr::new(req_id);
    // 日志内容
    let content: Option<&str> = row.try_get("content")?;
    let content = content.map(SmolStr::new);
    
    let model = Self {
      id,
      log_date,
      log_date_lbl,
      log_time,
      log_time_lbl,
      level,
      level_lbl,
      module,
      req_id,
      content,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case", name = "ServerLogFieldComment")]
#[allow(dead_code)]
pub struct ServerLogFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: SmolStr,
  /// 日志日期
  #[graphql(name = "log_date")]
  pub log_date: SmolStr,
  /// 日志日期
  #[graphql(name = "log_date_lbl")]
  pub log_date_lbl: SmolStr,
  /// 日志时间
  #[graphql(name = "log_time")]
  pub log_time: SmolStr,
  /// 日志时间
  #[graphql(name = "log_time_lbl")]
  pub log_time_lbl: SmolStr,
  /// 日志级别
  #[graphql(name = "level")]
  pub level: SmolStr,
  /// 日志级别
  #[graphql(name = "level_lbl")]
  pub level_lbl: SmolStr,
  /// 模块
  #[graphql(name = "module")]
  pub module: SmolStr,
  /// 请求ID
  #[graphql(name = "req_id")]
  pub req_id: SmolStr,
  /// 日志内容
  #[graphql(name = "content")]
  pub content: SmolStr,
}

#[derive(InputObject, Serialize, Deserialize, Default, Clone)]
#[graphql(rename_fields = "snake_case", name = "ServerLogSearch")]
#[allow(dead_code)]
pub struct ServerLogSearch {
  /// ID
  pub id: Option<ServerLogId>,
  /// ID列表
  pub ids: Option<Vec<ServerLogId>>,
  /// 日志日期
  #[graphql(name = "log_date")]
  pub log_date: Option<[Option<chrono::NaiveDate>; 2]>,
  /// 日志时间
  #[graphql(skip)]
  pub log_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
  /// 日志级别
  #[graphql(name = "level")]
  pub level: Option<Vec<ServerLogLevel>>,
  /// 模块
  #[graphql(name = "module")]
  pub module: Option<SmolStr>,
  /// 模块
  #[graphql(name = "module_like")]
  pub module_like: Option<SmolStr>,
  /// 请求ID
  #[graphql(name = "req_id")]
  pub req_id: Option<SmolStr>,
  /// 请求ID
  #[graphql(name = "req_id_like")]
  pub req_id_like: Option<SmolStr>,
  /// 日志内容
  #[graphql(skip)]
  pub content: Option<SmolStr>,
  /// 日志内容
  #[graphql(skip)]
  pub content_like: Option<SmolStr>,
}

impl std::fmt::Debug for ServerLogSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("ServerLogSearch");
    if let Some(ref id) = self.id {
      item = item.field("id", id);
    }
    if let Some(ref ids) = self.ids {
      item = item.field("ids", ids);
    }
    // 日志日期
    if let Some(ref log_date) = self.log_date {
      item = item.field("log_date", log_date);
    }
    // 日志时间
    if let Some(ref log_time) = self.log_time {
      item = item.field("log_time", log_time);
    }
    // 日志级别
    if let Some(ref level) = self.level {
      item = item.field("level", level);
    }
    // 模块
    if let Some(ref module) = self.module {
      item = item.field("module", module);
    }
    if let Some(ref module_like) = self.module_like {
      item = item.field("module_like", module_like);
    }
    // 请求ID
    if let Some(ref req_id) = self.req_id {
      item = item.field("req_id", req_id);
    }
    if let Some(ref req_id_like) = self.req_id_like {
      item = item.field("req_id_like", req_id_like);
    }
    // 日志内容
    if let Some(ref content) = self.content {
      item = item.field("content", content);
    }
    if let Some(ref content_like) = self.content_like {
      item = item.field("content_like", content_like);
    }
    item.finish()
  }
}

#[derive(InputObject, Serialize, Deserialize, Default, Clone)]
#[graphql(rename_fields = "snake_case", name = "ServerLogInput")]
#[allow(dead_code)]
pub struct ServerLogInput {
  /// ID
  pub id: Option<ServerLogId>,
  /// 日志日期
  #[graphql(name = "log_date")]
  pub log_date: Option<chrono::NaiveDate>,
  /// 日志日期
  #[graphql(name = "log_date_lbl")]
  pub log_date_lbl: Option<SmolStr>,
  /// 日志时间
  #[graphql(name = "log_time")]
  pub log_time: Option<chrono::NaiveDateTime>,
  /// 日志时间
  #[graphql(name = "log_time_lbl")]
  pub log_time_lbl: Option<SmolStr>,
  /// 日志级别
  #[graphql(name = "level")]
  pub level: Option<ServerLogLevel>,
  /// 日志级别
  #[graphql(name = "level_lbl")]
  pub level_lbl: Option<SmolStr>,
  /// 模块
  #[graphql(name = "module")]
  pub module: Option<SmolStr>,
  /// 请求ID
  #[graphql(name = "req_id")]
  pub req_id: Option<SmolStr>,
  /// 日志内容
  #[graphql(name = "content")]
  pub content: Option<SmolStr>,
}

impl std::fmt::Debug for ServerLogInput {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("ServerLogInput");
    if let Some(ref id) = self.id {
      item = item.field("id", id);
    }
    if let Some(ref log_date) = self.log_date {
      item = item.field("log_date", log_date);
    }
    if let Some(ref log_time) = self.log_time {
      item = item.field("log_time", log_time);
    }
    if let Some(ref level) = self.level {
      item = item.field("level", level);
    }
    if let Some(ref module) = self.module {
      item = item.field("module", module);
    }
    if let Some(ref req_id) = self.req_id {
      item = item.field("req_id", req_id);
    }
    if let Some(ref content) = self.content {
      item = item.field("content", content);
    }
    item.finish()
  }
}

impl From<ServerLogModel> for ServerLogInput {
  fn from(model: ServerLogModel) -> Self {
    Self {
      id: model.id.into(),
      // 日志日期
      log_date: model.log_date.into(),
      log_date_lbl: model.log_date_lbl.into(),
      // 日志时间
      log_time: model.log_time.into(),
      log_time_lbl: model.log_time_lbl.into(),
      // 日志级别
      level: model.level.into(),
      level_lbl: model.level_lbl.into(),
      // 模块
      module: model.module.into(),
      // 请求ID
      req_id: model.req_id.into(),
      // 日志内容
      content: model.content,
    }
  }
}

impl From<ServerLogInput> for ServerLogSearch {
  fn from(input: ServerLogInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 日志日期
      log_date: input.log_date.map(|x| [Some(x), Some(x)]),
      // 日志时间
      log_time: input.log_time.map(|x| [Some(x), Some(x)]),
      // 日志级别
      level: input.level.map(|x| vec![x]),
      // 模块
      module: input.module,
      // 请求ID
      req_id: input.req_id,
      // 日志内容
      content: input.content,
      ..Default::default()
    }
  }
}

impl_id!(ServerLogId);

/// 系统日志日志级别
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum ServerLogLevel {
  /// TRACE
  #[default]
  #[graphql(name="TRACE")]
  #[serde(rename = "TRACE")]
  Trace,
  /// DEBUG
  #[graphql(name="DEBUG")]
  #[serde(rename = "DEBUG")]
  Debug,
  /// INFO
  #[graphql(name="INFO")]
  #[serde(rename = "INFO")]
  Info,
  /// WARN
  #[graphql(name="WARN")]
  #[serde(rename = "WARN")]
  Warn,
  /// ERROR
  #[graphql(name="ERROR")]
  #[serde(rename = "ERROR")]
  Error,
}

impl fmt::Display for ServerLogLevel {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::Trace => write!(f, "TRACE"),
      Self::Debug => write!(f, "DEBUG"),
      Self::Info => write!(f, "INFO"),
      Self::Warn => write!(f, "WARN"),
      Self::Error => write!(f, "ERROR"),
    }
  }
}

impl From<ServerLogLevel> for SmolStr {
  fn from(value: ServerLogLevel) -> Self {
    match value {
      ServerLogLevel::Trace => "TRACE".into(),
      ServerLogLevel::Debug => "DEBUG".into(),
      ServerLogLevel::Info => "INFO".into(),
      ServerLogLevel::Warn => "WARN".into(),
      ServerLogLevel::Error => "ERROR".into(),
    }
  }
}

impl From<ServerLogLevel> for String {
  fn from(value: ServerLogLevel) -> Self {
    match value {
      ServerLogLevel::Trace => "TRACE".into(),
      ServerLogLevel::Debug => "DEBUG".into(),
      ServerLogLevel::Info => "INFO".into(),
      ServerLogLevel::Warn => "WARN".into(),
      ServerLogLevel::Error => "ERROR".into(),
    }
  }
}

impl From<ServerLogLevel> for ArgType {
  fn from(value: ServerLogLevel) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl FromStr for ServerLogLevel {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "TRACE" => Ok(Self::Trace),
      "DEBUG" => Ok(Self::Debug),
      "INFO" => Ok(Self::Info),
      "WARN" => Ok(Self::Warn),
      "ERROR" => Ok(Self::Error),
      _ => Err(eyre!("{s} 无法转换到 日志级别")),
    }
  }
}

impl TryFrom<&str> for ServerLogLevel {
  type Error = sqlx::Error;
  
  fn try_from(s: &str) -> Result<Self, sqlx::Error> {
    match s {
      "TRACE" => Ok(Self::Trace),
      "DEBUG" => Ok(Self::Debug),
      "INFO" => Ok(Self::Info),
      "WARN" => Ok(Self::Warn),
      "ERROR" => Ok(Self::Error),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "level".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 日志级别".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl TryFrom<SmolStr> for ServerLogLevel {
  type Error = sqlx::Error;
  
  fn try_from(s: SmolStr) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "TRACE" => Ok(Self::Trace),
      "DEBUG" => Ok(Self::Debug),
      "INFO" => Ok(Self::Info),
      "WARN" => Ok(Self::Warn),
      "ERROR" => Ok(Self::Error),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "level".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 日志级别".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl ServerLogLevel {
  pub fn as_str(&self) -> &str {
    match self {
      Self::Trace => "TRACE",
      Self::Debug => "DEBUG",
      Self::Info => "INFO",
      Self::Warn => "WARN",
      Self::Error => "ERROR",
    }
  }
}

impl TryFrom<String> for ServerLogLevel {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "TRACE" => Ok(Self::Trace),
      "DEBUG" => Ok(Self::Debug),
      "INFO" => Ok(Self::Info),
      "WARN" => Ok(Self::Warn),
      "ERROR" => Ok(Self::Error),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "level".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 日志级别".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 系统日志 检测字段是否允许前端排序
pub fn check_sort_server_log(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  let sort = sort.unwrap();
  
  let get_can_sort_in_api_server_log = get_can_sort_in_api_server_log();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_server_log.contains(&prop) {
      return Err(eyre!("check_sort_server_log: {}", serde_json::to_string(item)?));
    }
  }
  
  Ok(())
}

// MARK: get_page_path_server_log
pub fn get_page_path_server_log() -> &'static str {
  "/base/server_log"
}

// MARK: get_table_name_server_log
pub fn get_table_name_server_log() -> &'static str {
  "base_server_log"
}
