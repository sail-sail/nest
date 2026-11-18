pub mod system;
pub mod types;

use std::collections::HashSet;

use color_eyre::eyre::{Result, eyre};
use serde_json::{Map, Value, json};
use tracing::warn;

/// 所有 openapi 接口的统一前缀
///
/// 该前缀与现有原生路由(`/api/oss`、`/api/health` 等)完全隔离,
/// 因此 `nest` 不会吞掉任何已有路由
pub const PREFIX: &str = "/api/oai";

/// 一个 openapi 模块的规格
///
/// 每个业务模块对外暴露一个 `OpenApiService`, 这里只保存它的 spec 文本,
/// 用于合并成 MCP 搜索和 `/openapi.json` 所需的完整文档
pub struct OaiModule {
  /// 模块名, 会拼在 `PREFIX` 后面作为挂载前缀
  pub name: &'static str,
  
  /// `OpenApiService::spec()` 返回的 JSON 文本
  pub spec: String,
}

impl OaiModule {
  pub fn new(
    name: &'static str,
    spec: String,
  ) -> Self {
    Self { name, spec }
  }
  
  /// 该模块的完整挂载前缀, 如 `/api/oai/system`
  pub fn prefix(&self) -> String {
    format!("{}/{}", PREFIX, self.name)
  }
}

/// 合并多个模块的 spec
///
/// `nest` 不会改写 spec 里的 paths, 所以这里手动补上模块前缀,
/// 保证 MCP 拿到的路径是可以直接调用的完整地址
pub fn merge_specs(modules: &[OaiModule]) -> Result<Value> {
  let mut paths = Map::new();
  let mut schemas = Map::new();
  let mut version = String::new();
  let mut tags = Vec::new();
  let mut tag_names = HashSet::new();
  let mut security = Vec::new();
  let mut security_keys = HashSet::new();
  let mut servers = Vec::new();
  let mut server_urls = HashSet::new();
  
  for module in modules {
    let spec: Value = serde_json::from_str(&module.spec)
      .map_err(|err| eyre!("模块 {} 的 openapi spec 解析失败: {err}", module.name))?;
    
    // 版本跟随模块生成结果, 手写版本和实际 schema 结构容易对不上
    if version.is_empty()
      && let Some(item) = spec.get("openapi").and_then(Value::as_str)
    {
      version = item.to_owned();
    }
    
    let prefix = module.prefix();
    
    if let Some(module_paths) = spec.get("paths").and_then(Value::as_object) {
      for (path, operation) in module_paths {
        let path = format!("{prefix}{path}");
        if paths.insert(path.clone(), operation.clone()).is_some() {
          warn!("openapi 路径重复, 已覆盖: {path} (模块 {})", module.name);
        }
      }
    }
    
    if let Some(module_schemas) = spec
      .pointer("/components/schemas")
      .and_then(Value::as_object)
    {
      for (name, schema) in module_schemas {
        // 同名 schema 只能保留一份, 后登记的模块胜出, 冲突要改名
        if schemas.insert(name.clone(), schema.clone()).is_some() {
          warn!("openapi schema 名冲突, 已覆盖: {name} (模块 {})", module.name);
        }
      }
    }
    
    // tags / security / servers 按内容去重, 保持模块登记顺序
    if let Some(items) = spec.get("tags").and_then(Value::as_array) {
      for tag in items {
        let name = tag
          .get("name")
          .and_then(Value::as_str)
          .unwrap_or_default()
          .to_owned();
        if tag_names.insert(name) {
          tags.push(tag.clone());
        }
      }
    }
    
    if let Some(items) = spec.get("security").and_then(Value::as_array) {
      for item in items {
        if security_keys.insert(item.to_string()) {
          security.push(item.clone());
        }
      }
    }
    
    if let Some(items) = spec.get("servers").and_then(Value::as_array) {
      for item in items {
        let url = item
          .get("url")
          .and_then(Value::as_str)
          .unwrap_or_default()
          .to_owned();
        if server_urls.insert(url) {
          servers.push(item.clone());
        }
      }
    }
  }
  
  let mut spec = Map::new();
  spec.insert(
    "openapi".to_owned(),
    Value::String(if version.is_empty() { "3.0.0".to_owned() } else { version }),
  );
  spec.insert(
    "info".to_owned(),
    json!({
      "title": "pms",
      "version": "1.0",
    }),
  );
  spec.insert("paths".to_owned(), Value::Object(paths));
  spec.insert(
    "components".to_owned(),
    json!({
      "schemas": Value::Object(schemas),
    }),
  );
  if !tags.is_empty() {
    spec.insert("tags".to_owned(), Value::Array(tags));
  }
  if !security.is_empty() {
    spec.insert("security".to_owned(), Value::Array(security));
  }
  if !servers.is_empty() {
    spec.insert("servers".to_owned(), Value::Array(servers));
  }
  
  Ok(Value::Object(spec))
}

#[cfg(test)]
mod tests {
  use super::*;
  use serde_json::json;
  
  fn module(
    name: &'static str,
    spec: Value,
  ) -> OaiModule {
    OaiModule::new(name, spec.to_string())
  }
  
  #[test]
  fn merge_prefixes_paths_and_dedupes_shared_parts() {
    let modules = vec![
      module("system", json!({
        "openapi": "3.0.0",
        "paths": { "/ping": { "get": { "summary": "连通性检查" } } },
        "tags": [{ "name": "system" }],
        "servers": [{ "url": "http://localhost:4001" }],
        "components": { "schemas": { "PingData": { "type": "object" } } },
      })),
      module("scrm", json!({
        "openapi": "3.0.0",
        "paths": { "/order/list": { "get": {} } },
        "tags": [{ "name": "system" }, { "name": "scrm" }],
        "servers": [{ "url": "http://localhost:4001" }],
        "components": {
          "schemas": {
            "PingData": { "type": "string" },
            "Order": { "type": "object" },
          },
        },
      })),
    ];
    
    let spec = merge_specs(&modules).unwrap();
    // 版本跟随模块生成结果, 不再硬编码
    assert_eq!(spec["openapi"], "3.0.0");
    assert!(spec["paths"].get("/api/oai/system/ping").is_some());
    assert!(spec["paths"].get("/api/oai/scrm/order/list").is_some());
    // tags / servers 按内容去重
    assert_eq!(spec["tags"].as_array().unwrap().len(), 2);
    assert_eq!(spec["servers"].as_array().unwrap().len(), 1);
    // 同名 schema 后登记的模块覆盖
    assert_eq!(spec["components"]["schemas"]["PingData"]["type"], "string");
    assert!(spec["components"]["schemas"].get("Order").is_some());
  }
}
