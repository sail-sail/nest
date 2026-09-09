use std::fmt::Write;

use color_eyre::eyre::{Result, eyre};
use reqwest::header::{ACCEPT, AUTHORIZATION, CONTENT_TYPE};
use rust_decimal::Decimal;
use serde::de::DeserializeOwned;
use serde_json::{Map, Value};
use tracing::info;
use url::Url;

use crate::common::context::get_is_debug;
use crate::common::util::http::client;
use crate::tsdb::tsdb_app::tsdb_app_model::TsdbAppModel;
use crate::tsdb::tsdb_app::tsdb_app_model::TsdbAppSearch;
use crate::base::tenant::tenant_model::TenantId;

#[derive(Clone, Debug)]
struct TsdbConfig {
  api_base_url: String,
  database: String,
  token: String,
}

impl TsdbConfig {
  fn from_model(model: &TsdbAppModel) -> Result<Self> {
    let protocol = model.protocol.as_str();
    let hostname = model.hostname.as_str();
    let database = model.database.as_str();
    let token = model.token.as_str();

    if protocol.is_empty() {
      return Err(eyre!("tsdb protocol is empty"));
    }
    if hostname.is_empty() {
      return Err(eyre!("tsdb hostname is empty"));
    }
    if database.is_empty() {
      return Err(eyre!("tsdb database is empty"));
    }
    if token.is_empty() {
      return Err(eyre!("tsdb token is empty"));
    }

    let api_base_url = format!(
      "{protocol}://{hostname}:{}/api/v3",
      model.port,
    );
    let api_base_url = Url::parse(&api_base_url)
      .map_err(|err| eyre!("invalid tsdb api url: {err}"))?
      .to_string()
      .trim_end_matches('/')
      .to_owned();

    Ok(Self {
      api_base_url,
      database: database.to_owned(),
      token: token.to_owned(),
    })
  }
}

async fn tsdb_config_by_lbl(lbl: &str, tenant_id: TenantId) -> Result<TsdbConfig> {
  let lbl = lbl.trim();
  if lbl.is_empty() {
    return Err(eyre!("tsdb app lbl is empty"));
  }

  let model = crate::tsdb::tsdb_app::tsdb_app_service::find_one_ok_tsdb_app(
    Some(TsdbAppSearch {
      lbl: Some(String::from(lbl)),
      tenant_id: Some(tenant_id),
      ..Default::default()
    }),
    None,
    Some(
      crate::common::context::Options::new()
        .set_is_debug(Some(false))
    ),
  ).await?;

  TsdbConfig::from_model(&model)
}

#[derive(Clone, Debug)]
pub struct InfluxDb3Tag {
  pub key: String,
  pub value: String,
}

impl InfluxDb3Tag {
  #[must_use]
  pub fn new(
    key: impl Into<String>,
    value: impl Into<String>,
  ) -> Self {
    Self {
      key: key.into(),
      value: value.into(),
    }
  }
}

#[derive(Clone, Debug)]
pub struct InfluxDb3Field {
  pub key: String,
  pub value: InfluxDb3FieldValue,
}

impl InfluxDb3Field {
  #[must_use]
  pub fn new(
    key: impl Into<String>,
    value: impl Into<InfluxDb3FieldValue>,
  ) -> Self {
    Self {
      key: key.into(),
      value: value.into(),
    }
  }
}

#[derive(Clone, Debug)]
pub enum InfluxDb3FieldValue {
  String(String),
  I64(i64),
  U64(u64),
  F64(f64),
  Bool(bool),
  Decimal(Decimal),
}

#[derive(Clone, Debug)]
pub struct InfluxDb3Point {
  pub table: String,
  pub tags: Vec<InfluxDb3Tag>,
  pub fields: Vec<InfluxDb3Field>,
  pub timestamp: Option<i64>,
}

impl InfluxDb3Point {
  #[must_use]
  pub fn new(table: impl Into<String>) -> Self {
    Self {
      table: table.into(),
      tags: Vec::new(),
      fields: Vec::new(),
      timestamp: None,
    }
  }

  #[must_use]
  pub fn with_tag(
    mut self,
    key: impl Into<String>,
    value: impl Into<String>,
  ) -> Self {
    self.tags.push(InfluxDb3Tag::new(key, value));
    self
  }

  #[must_use]
  pub fn with_field(
    mut self,
    key: impl Into<String>,
    value: impl Into<InfluxDb3FieldValue>,
  ) -> Self {
    self.fields.push(InfluxDb3Field::new(key, value));
    self
  }

  #[must_use]
  pub fn with_timestamp(mut self, timestamp: i64) -> Self {
    self.timestamp = Some(timestamp);
    self
  }

  pub fn to_line_protocol(&self) -> Result<String> {
    if self.table.is_empty() {
      return Err(eyre!("table is empty"));
    }
    if self.fields.is_empty() {
      return Err(eyre!("fields is empty"));
    }

    let mut line = escape_measurement(&self.table)?;
    for tag in &self.tags {
      write!(
        &mut line,
        ",{}={}",
        escape_key(tag.key.as_str())?,
        escape_tag_value(tag.value.as_str())?,
      )?;
    }

    line.push(' ');
    for (index, field) in self.fields.iter().enumerate() {
      if index > 0 {
        line.push(',');
      }
      write!(
        &mut line,
        "{}={}",
        escape_key(field.key.as_str())?,
        format_field_value(&field.value)?,
      )?;
    }

    if let Some(timestamp) = self.timestamp {
      write!(&mut line, " {timestamp}")?;
    }

    Ok(line)
  }
}

#[derive(Clone, Copy, Debug, Default)]
pub struct InfluxDb3WriteOptions {
  pub precision: Option<InfluxDb3Precision>,
  pub accept_partial: Option<bool>,
  pub no_sync: Option<bool>,
  pub is_debug: Option<bool>,
  pub log_result: Option<bool>,
}

#[derive(Clone, Debug, Default)]
pub struct InfluxDb3QueryOptions {
  pub params: Option<Map<String, Value>>,
  pub is_debug: Option<bool>,
  pub log_result: Option<bool>,
}

impl InfluxDb3QueryOptions {
  #[must_use]
  pub fn new() -> Self {
    Self::default()
  }

  #[must_use]
  pub fn with_param(
    mut self,
    key: impl Into<String>,
    value: impl Into<Value>,
  ) -> Self {
    let params = self.params.get_or_insert_with(Map::new);
    params.insert(key.into(), value.into());
    self
  }
}

#[derive(Clone, Copy, Debug)]
pub enum InfluxDb3Precision {
  Auto,
  Second,
  Millisecond,
  Microsecond,
  Nanosecond,
}

impl InfluxDb3Precision {
  #[must_use]
  pub fn as_str(self) -> &'static str {
    match self {
      Self::Auto => "auto",
      Self::Second => "second",
      Self::Millisecond => "millisecond",
      Self::Microsecond => "microsecond",
      Self::Nanosecond => "nanosecond",
    }
  }
}

fn build_write_url(
  config: &TsdbConfig,
  options: InfluxDb3WriteOptions,
) -> Result<String> {
  let mut url = Url::parse(&format!("{}/write_lp", config.api_base_url))?;
  {
    let mut query = url.query_pairs_mut();
    query.append_pair("db", &config.database);
    if let Some(precision) = options.precision {
      query.append_pair("precision", precision.as_str());
    }
    if let Some(accept_partial) = options.accept_partial {
      query.append_pair(
        "accept_partial",
        if accept_partial { "true" } else { "false" },
      );
    }
    if let Some(no_sync) = options.no_sync {
      query.append_pair(
        "no_sync",
        if no_sync { "true" } else { "false" },
      );
    }
  }
  Ok(url.to_string())
}

fn build_query_sql_url(config: &TsdbConfig) -> Result<String> {
  Ok(Url::parse(&format!("{}/query_sql", config.api_base_url))?.to_string())
}

fn should_debug(options: InfluxDb3WriteOptions) -> bool {
  options.is_debug.unwrap_or_else(|| get_is_debug(None))
}

fn should_query_debug(options: &InfluxDb3QueryOptions) -> bool {
  options.is_debug.unwrap_or_else(|| get_is_debug(None))
}

fn validate_line_value(
  field_name: &'static str,
  value: &str,
) -> Result<()> {
  if value.is_empty() {
    return Err(eyre!("{field_name} is empty"));
  }
  if value.contains('\n') || value.contains('\r') {
    return Err(eyre!("{field_name} contains newline"));
  }
  Ok(())
}

fn escape_identifier(
  value: &str,
  escape_equal: bool,
) -> Result<String> {
  validate_line_value("identifier", value)?;

  let mut escaped = String::with_capacity(value.len());
  for ch in value.chars() {
    match ch {
      '\\' => escaped.push_str("\\\\"),
      ',' => escaped.push_str("\\,"),
      ' ' => escaped.push_str("\\ "),
      '=' if escape_equal => escaped.push_str("\\="),
      _ => escaped.push(ch),
    }
  }
  Ok(escaped)
}

fn escape_measurement(value: &str) -> Result<String> {
  validate_line_value("table", value)?;
  escape_identifier(value, false)
}

fn escape_key(value: &str) -> Result<String> {
  validate_line_value("key", value)?;
  escape_identifier(value, true)
}

fn escape_tag_value(value: &str) -> Result<String> {
  if value.contains('\n') || value.contains('\r') {
    return Err(eyre!("tag value contains newline"));
  }
  escape_identifier(value, true)
}

fn escape_string_field_value(value: &str) -> Result<String> {
  if value.contains('\n') || value.contains('\r') {
    return Err(eyre!("string field value contains newline"));
  }

  let mut escaped = String::with_capacity(value.len() + 2);
  for ch in value.chars() {
    match ch {
      '\\' => escaped.push_str("\\\\"),
      '"' => escaped.push_str("\\\""),
      _ => escaped.push(ch),
    }
  }
  Ok(escaped)
}

fn format_field_value(value: &InfluxDb3FieldValue) -> Result<String> {
  match value {
    InfluxDb3FieldValue::String(value) => {
      Ok(format!("\"{}\"", escape_string_field_value(value)?))
    }
    InfluxDb3FieldValue::I64(value) => Ok(format!("{value}i")),
    InfluxDb3FieldValue::U64(value) => Ok(format!("{value}u")),
    InfluxDb3FieldValue::F64(value) => {
      if !value.is_finite() {
        return Err(eyre!("float field value is not finite"));
      }
      Ok(value.to_string())
    }
    InfluxDb3FieldValue::Bool(value) => Ok(value.to_string()),
    InfluxDb3FieldValue::Decimal(value) => Ok(value.to_string()),
  }
}

fn build_query_sql_body(
  config: &TsdbConfig,
  sql: &str,
  options: &InfluxDb3QueryOptions,
) -> Value {
  let mut body = Map::new();
  body.insert("db".to_owned(), Value::String(config.database.clone()));
  body.insert("q".to_owned(), Value::String(sql.to_owned()));
  if let Some(params) = &options.params {
    body.insert("params".to_owned(), Value::Object(params.clone()));
  }
  Value::Object(body)
}

impl From<String> for InfluxDb3FieldValue {
  fn from(value: String) -> Self {
    Self::String(value)
  }
}

impl From<&str> for InfluxDb3FieldValue {
  fn from(value: &str) -> Self {
    Self::String(value.to_owned())
  }
}

impl From<bool> for InfluxDb3FieldValue {
  fn from(value: bool) -> Self {
    Self::Bool(value)
  }
}

impl From<i8> for InfluxDb3FieldValue {
  fn from(value: i8) -> Self {
    Self::I64(value.into())
  }
}

impl From<i16> for InfluxDb3FieldValue {
  fn from(value: i16) -> Self {
    Self::I64(value.into())
  }
}

impl From<i32> for InfluxDb3FieldValue {
  fn from(value: i32) -> Self {
    Self::I64(value.into())
  }
}

impl From<i64> for InfluxDb3FieldValue {
  fn from(value: i64) -> Self {
    Self::I64(value)
  }
}

impl From<u8> for InfluxDb3FieldValue {
  fn from(value: u8) -> Self {
    Self::U64(value.into())
  }
}

impl From<u16> for InfluxDb3FieldValue {
  fn from(value: u16) -> Self {
    Self::U64(value.into())
  }
}

impl From<u32> for InfluxDb3FieldValue {
  fn from(value: u32) -> Self {
    Self::U64(value.into())
  }
}

impl From<u64> for InfluxDb3FieldValue {
  fn from(value: u64) -> Self {
    Self::U64(value)
  }
}

impl From<f32> for InfluxDb3FieldValue {
  fn from(value: f32) -> Self {
    Self::F64(value.into())
  }
}

impl From<f64> for InfluxDb3FieldValue {
  fn from(value: f64) -> Self {
    Self::F64(value)
  }
}

impl From<Decimal> for InfluxDb3FieldValue {
  fn from(value: Decimal) -> Self {
    Self::Decimal(value)
  }
}

pub async fn write_lp(
  tsdb_app_lbl: impl AsRef<str>,
  tenant_id: TenantId,
  line_protocol: impl AsRef<str>,
  options: Option<InfluxDb3WriteOptions>,
) -> Result<()> {
  let options = options.unwrap_or_default();
  let line_protocol = line_protocol.as_ref().trim();
  if line_protocol.is_empty() {
    return Err(eyre!("line protocol is empty"));
  }

  let config = tsdb_config_by_lbl(tsdb_app_lbl.as_ref(), tenant_id).await?;
  let url = build_write_url(&config, options)?;

  if should_debug(options) {
    info!("tsdb write_lp: {url}");
    info!("tsdb line protocol: {line_protocol}");
  }

  let res = client()
    .post(url)
    .header(ACCEPT, "application/json")
    .header(CONTENT_TYPE, "text/plain; charset=utf-8")
    .header(AUTHORIZATION, format!("Bearer {}", config.token))
    .body(line_protocol.to_owned())
    .send()
    .await?;

  let status = res.status();
  let text = res.text().await?;
  if options.log_result.unwrap_or_default() {
    info!(
      "tsdb write_lp response: {}",
      if text.is_empty() { "<empty>" } else { text.as_str() },
    );
  }

  if !status.is_success() {
    return Err(eyre!(
      "InfluxDB3 write_lp failed: {status} - {text}",
    ));
  }

  Ok(())
}

pub async fn write_point(
  tsdb_app_lbl: impl AsRef<str>,
  tenant_id: TenantId,
  point: &InfluxDb3Point,
  options: Option<InfluxDb3WriteOptions>,
) -> Result<()> {
  let line_protocol = point.to_line_protocol()?;
  write_lp(tsdb_app_lbl, tenant_id, line_protocol, options).await
}

pub async fn write_points(
  tsdb_app_lbl: impl AsRef<str>,
  tenant_id: TenantId,
  points: &[InfluxDb3Point],
  options: Option<InfluxDb3WriteOptions>,
) -> Result<()> {
  if points.is_empty() {
    return Err(eyre!("points is empty"));
  }

  let mut lines = Vec::with_capacity(points.len());
  for point in points {
    lines.push(point.to_line_protocol()?);
  }
  write_lp_lines(tsdb_app_lbl, tenant_id, &lines, options).await
}

pub async fn write_lp_lines<S>(
  tsdb_app_lbl: impl AsRef<str>,
  tenant_id: TenantId,
  lines: &[S],
  options: Option<InfluxDb3WriteOptions>,
) -> Result<()>
where
  S: AsRef<str>,
{
  let line_protocol = lines.iter()
    .map(AsRef::as_ref)
    .collect::<Vec<&str>>()
    .join("\n");
  write_lp(tsdb_app_lbl, tenant_id, line_protocol, options).await
}

pub async fn query_sql<T>(
  tsdb_app_lbl: impl AsRef<str>,
  tenant_id: TenantId,
  sql: impl AsRef<str>,
  options: Option<InfluxDb3QueryOptions>,
) -> Result<Vec<T>>
where
  T: DeserializeOwned,
{
  let options = options.unwrap_or_default();
  let sql = sql.as_ref().trim();
  if sql.is_empty() {
    return Err(eyre!("sql is empty"));
  }

  let config = tsdb_config_by_lbl(tsdb_app_lbl.as_ref(), tenant_id).await?;
  let url = build_query_sql_url(&config)?;
  let body = build_query_sql_body(&config, sql, &options);

  if should_query_debug(&options) {
    info!("tsdb query_sql: {sql}");
    if let Some(params) = &options.params {
      info!(
        "tsdb query params: {}",
        serde_json::to_string(params).unwrap_or_default(),
      );
    }
  }

  let res = client()
    .post(url)
    .header(ACCEPT, "application/json")
    .header(CONTENT_TYPE, "application/json")
    .header(AUTHORIZATION, format!("Bearer {}", config.token))
    .json(&body)
    .send()
    .await?;

  let status = res.status();
  let text = res.text().await?;
  if options.log_result.unwrap_or_default() {
    info!(
      "tsdb query_sql response: {}",
      if text.is_empty() { "<empty>" } else { text.as_str() },
    );
  }

  if !status.is_success() {
    return Err(eyre!(
      "InfluxDB3 query_sql failed: {status} - {text}",
    ));
  }

  if text.is_empty() {
    return Ok(Vec::new());
  }

  Ok(serde_json::from_str(&text)?)
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn build_write_url_contains_expected_query_params() {
    let config = TsdbConfig {
      api_base_url: "http://localhost:8181/api/v3".to_owned(),
      database: "demo".to_owned(),
      token: "token".to_owned(),
    };
    let url = build_write_url(
      &config,
      InfluxDb3WriteOptions {
        precision: Some(InfluxDb3Precision::Auto),
        accept_partial: Some(false),
        no_sync: Some(true),
        is_debug: None,
        log_result: None,
      },
    ).unwrap();

    assert_eq!(
      url,
      "http://localhost:8181/api/v3/write_lp?db=demo&precision=auto&accept_partial=false&no_sync=true",
    );
  }

  #[test]
  fn point_to_line_protocol_formats_and_escapes_values() {
    let point = InfluxDb3Point::new("cpu load")
      .with_tag("host name", "api,1")
      .with_field("usage idle", 90.5_f64)
      .with_field("status", "\"ok\"")
      .with_field("count", 3_i64)
      .with_field("ready", true)
      .with_timestamp(1234567890);

    let line = point.to_line_protocol().unwrap();
    assert_eq!(
      line,
      "cpu\\ load,host\\ name=api\\,1 usage\\ idle=90.5,status=\"\\\"ok\\\"\",count=3i,ready=true 1234567890",
    );
  }

  #[test]
  fn build_query_sql_body_contains_db_sql_and_params() {
    let config = TsdbConfig {
      api_base_url: "http://localhost:8181/api/v3".to_owned(),
      database: "demo".to_owned(),
      token: "token".to_owned(),
    };
    let options = InfluxDb3QueryOptions::new()
      .with_param("room", "Kitchen")
      .with_param("min_temp", 22.5_f64);

    let body = build_query_sql_body(
      &config,
      "select * from home where room = $room and temp >= $min_temp",
      &options,
    );

    assert_eq!(
      body,
      serde_json::json!({
        "db": "demo",
        "q": "select * from home where room = $room and temp >= $min_temp",
        "params": {
          "room": "Kitchen",
          "min_temp": 22.5,
        },
      }),
    );
  }
}