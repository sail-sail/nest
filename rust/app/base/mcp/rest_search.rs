use std::collections::HashSet;

use color_eyre::eyre::{Result, eyre};
use serde::Serialize;
use serde_json::{Map, Value, json};

use super::mcp_model::McpSchemaSearchInput;

const SOURCE: &str = "rest";
const KIND: &str = "endpoint";
const DEFAULT_LIMIT: usize = 8;
const MAX_LIMIT: usize = 20;
const HTTP_METHODS: &[&str] = &["get", "post", "put", "delete", "patch", "head", "options"];

/// 一个 openapi 接口
struct RestEndpoint {
  method: String,
  path: String,
  name: String,
  description: Option<String>,
  signature: String,
  operation: Value,
  related_types: Vec<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct RestSearchResultItem {
  source: &'static str,
  kind: &'static str,
  name: String,
  method: String,
  path: String,
  #[serde(skip_serializing_if = "Option::is_none")]
  description: Option<String>,
  signature: String,
  related_types: Vec<String>,
  /// 路径里的参数名, 调用时把 `{name}` 换成真实值
  #[serde(skip_serializing_if = "Vec::is_empty")]
  path_parameters: Vec<String>,
  #[serde(skip_serializing_if = "Option::is_none")]
  operation: Option<Value>,
}

/// 解析后的 openapi 索引
///
/// 规范在进程内不会变化, 只在启动时解析一次, 之后复用;
/// 避免每次 schema_search / rest_call 都重新反序列化整份文档
pub struct RestIndex {
  spec: Value,
  endpoints: Vec<RestEndpoint>,
}

impl RestIndex {
  /// 空索引, 规范不可用时使用
  pub fn empty() -> Self {
    Self {
      spec: Value::Null,
      endpoints: Vec::new(),
    }
  }
  
  /// 解析 openapi 规范
  pub fn parse(spec: &str) -> Result<Self> {
    let spec: Value = serde_json::from_str(spec)
      .map_err(|err| eyre!("openapi 规范解析失败: {err}"))?;
    let endpoints = collect_endpoints(&spec);
    Ok(Self { spec, endpoints })
  }
  
  /// 是否没有任何接口
  pub fn is_empty(&self) -> bool {
    self.endpoints.is_empty()
  }
  
  /// 搜索 openapi 接口
  pub fn search(
    &self,
    input: McpSchemaSearchInput,
  ) -> Result<Value> {
    let keyword = input.keyword.trim().to_lowercase();
    if keyword.is_empty() {
      return Err(eyre!("keyword 不能为空"));
    }
    
    if !kind_matches(input.kind.as_deref()) || !scope_matches(input.scope.as_deref()) {
      return Ok(empty_result(&input.keyword));
    }
    
    let limit = input.limit.unwrap_or(DEFAULT_LIMIT).clamp(1, MAX_LIMIT);
    
    let mut ranked = self.endpoints
      .iter()
      .filter_map(|endpoint| {
        let score = score_endpoint(endpoint, &keyword);
        if score > 0 { Some((score, endpoint)) } else { None }
      })
      .collect::<Vec<_>>();
    
    ranked.sort_by(|a, b| {
      b.0.cmp(&a.0)
        .then_with(|| a.1.name.len().cmp(&b.1.name.len()))
        .then_with(|| a.1.name.cmp(&b.1.name))
    });
    
    let include_operation = input.include_sdl.unwrap_or(false);
    let items = ranked
      .into_iter()
      .take(limit)
      .map(|(_, endpoint)| RestSearchResultItem {
        source: SOURCE,
        kind: KIND,
        name: endpoint.name.clone(),
        method: endpoint.method.clone(),
        path: endpoint.path.clone(),
        description: endpoint.description.clone(),
        signature: endpoint.signature.clone(),
        related_types: endpoint.related_types.clone(),
        path_parameters: path_parameter_names(&endpoint.path),
        operation: include_operation.then(|| endpoint.operation.clone()),
      })
      .collect::<Vec<_>>();
    
    Ok(json!({
      "query": input.keyword,
      "source": SOURCE,
      "items": items,
    }))
  }
  
  /// 按名字或路径返回单个接口的完整定义
  pub fn get(
    &self,
    name: &str,
  ) -> Result<Value> {
    let target = name.trim().to_lowercase();
    if target.is_empty() {
      return Err(eyre!("name 不能为空"));
    }
    
    let endpoint = self.endpoints
      .iter()
      .find(|endpoint| {
        endpoint.name.to_lowercase() == target || path_matches(&endpoint.path, name.trim())
      })
      .ok_or_else(|| eyre!("未找到接口: {name}"))?;
    
    Ok(json!({
      "source": SOURCE,
      "kind": KIND,
      "name": endpoint.name,
      "method": endpoint.method,
      "path": endpoint.path,
      "description": endpoint.description,
      "operation": endpoint.operation,
      "components": {
        "schemas": related_schemas(&self.spec, &endpoint.related_types),
      },
    }))
  }
  
  /// 判断该接口是否在 openapi 规范里
  pub fn has_endpoint(
    &self,
    method: &str,
    path: &str,
  ) -> bool {
    let method = method.to_lowercase();
    self.endpoints
      .iter()
      .any(|endpoint| {
        endpoint.method.to_lowercase() == method && path_matches(&endpoint.path, path)
      })
  }
}

/// 比较请求路径和规范里的路径模板
///
/// 规范里路径参数写作 `{name}`, 实际调用时是具体值, 因此按路径段逐段比较
fn path_matches(
  template: &str,
  actual: &str,
) -> bool {
  if template == actual {
    return true;
  }

  let template_segments = template.split('/').collect::<Vec<_>>();
  let actual_segments = actual.split('/').collect::<Vec<_>>();
  if template_segments.len() != actual_segments.len() {
    return false;
  }

  template_segments.iter()
    .zip(actual_segments.iter())
    .all(|(t, a)| {
      (t.len() > 2 && t.starts_with('{') && t.ends_with('}')) || t == a
    })
}

/// 取出路径模板里的参数名
fn path_parameter_names(path: &str) -> Vec<String> {
  path.split('/')
    .filter(|segment| segment.len() > 2 && segment.starts_with('{') && segment.ends_with('}'))
    .map(|segment| segment[1..segment.len() - 1].to_owned())
    .collect()
}

fn kind_matches(kind: Option<&str>) -> bool {
  match kind.map(|kind| kind.trim().to_lowercase()).as_deref() {
    None | Some("") | Some("all") => true,
    Some(kind) => kind == KIND || kind == "rest",
  }
}

fn scope_matches(scope: Option<&str>) -> bool {
  matches!(
    scope.map(|scope| scope.trim().to_lowercase()).as_deref(),
    None | Some("") | Some("all") | Some("definition"),
  )
}

fn empty_result(keyword: &str) -> Value {
  json!({
    "query": keyword,
    "source": SOURCE,
    "items": [],
  })
}

fn collect_endpoints(spec: &Value) -> Vec<RestEndpoint> {
  let paths = match spec.get("paths").and_then(Value::as_object) {
    Some(paths) => paths,
    None => return Vec::new(),
  };
  
  let mut endpoints = Vec::new();
  for (path, path_item) in paths {
    let operations = match path_item.as_object() {
      Some(operations) => operations,
      None => continue,
    };
    for method in HTTP_METHODS {
      let operation = match operations.get(*method) {
        Some(operation) => operation,
        None => continue,
      };
      let method = method.to_ascii_uppercase();
      let name = format!("{method} {path}");
      
      let summary = operation.get("summary").and_then(Value::as_str).unwrap_or("").trim();
      let description = operation.get("description").and_then(Value::as_str).unwrap_or("").trim();
      let description = match (summary.is_empty(), description.is_empty()) {
        (false, false) => Some(format!("{summary}\n{description}")),
        (false, true) => Some(summary.to_owned()),
        (true, false) => Some(description.to_owned()),
        (true, true) => None,
      };
      
      let mut related_types = Vec::new();
      collect_refs(operation, &mut related_types);
      related_types.sort();
      related_types.dedup();
      
      endpoints.push(RestEndpoint {
        method,
        path: path.clone(),
        signature: name.clone(),
        name,
        description,
        operation: operation.clone(),
        related_types,
      });
    }
  }
  endpoints
}

fn score_endpoint(
  endpoint: &RestEndpoint,
  keyword: &str,
) -> i64 {
  let name = endpoint.name.to_lowercase();
  let path = endpoint.path.to_lowercase();
  let signature = endpoint.signature.to_lowercase();
  let description = endpoint.description.as_deref().unwrap_or("").to_lowercase();
  
  if name == keyword {
    return 10000;
  }
  
  let mut score = 0;
  if name.starts_with(keyword) {
    score += 2600;
  }
  if name.contains(keyword) {
    score += 1800;
  }
  if path.contains(keyword) {
    score += 1600;
  }
  if description.contains(keyword) {
    score += 1400;
  }
  if signature.contains(keyword) {
    score += 1000;
  }
  
  for token in keyword.split_whitespace() {
    if name.contains(token) {
      score += 600;
    }
    if path.contains(token) {
      score += 500;
    }
    if description.contains(token) {
      score += 400;
    }
  }
  
  score
}

fn collect_refs(
  value: &Value,
  out: &mut Vec<String>,
) {
  match value {
    Value::Object(map) => {
      if let Some(reference) = map.get("$ref").and_then(Value::as_str)
        && let Some(name) = reference.rsplit('/').next()
        && !name.is_empty()
      {
        out.push(name.to_owned());
      }
      for child in map.values() {
        collect_refs(child, out);
      }
    },
    Value::Array(items) => {
      for child in items {
        collect_refs(child, out);
      }
    },
    _ => {},
  }
}

fn related_schemas(
  spec: &Value,
  roots: &[String],
) -> Value {
  let all_schemas = spec
    .pointer("/components/schemas")
    .and_then(Value::as_object);
  
  let mut schemas = Map::new();
  let mut queue = roots.to_vec();
  let mut seen = HashSet::new();
  
  while let Some(name) = queue.pop() {
    if !seen.insert(name.clone()) {
      continue;
    }
    let Some(schema) = all_schemas.and_then(|all| all.get(&name)) else {
      continue;
    };
    let mut refs = Vec::new();
    collect_refs(schema, &mut refs);
    queue.extend(refs);
    schemas.insert(name, schema.clone());
  }
  
  Value::Object(schemas)
}

#[cfg(test)]
mod tests {
  use super::*;
  use serde_json::json;

  fn sample_spec() -> String {
    json!({
      "openapi": "3.1.0",
      "paths": {
        "/api/oai/system/ping": {
          "get": {
            "summary": "连通性检查",
            "responses": {
              "200": {
                "content": {
                  "application/json; charset=utf-8": {
                    "schema": { "$ref": "#/components/schemas/R_PingData" }
                  }
                }
              }
            }
          }
        },
        "/api/oai/scrm/delivery/import_erp": {
          "post": {
            "summary": "从 ERP 导入发货单",
            "requestBody": {
              "content": {
                "application/json": {
                  "schema": { "$ref": "#/components/schemas/ImportErpInput" }
                }
              }
            },
            "responses": { "200": { "description": "" } }
          }
        }
      },
      "components": {
        "schemas": {
          "R_PingData": { "type": "object", "properties": { "code": { "type": "integer" } } },
          "ImportErpInput": {
            "type": "object",
            "properties": { "file": { "$ref": "#/components/schemas/FileRef" } }
          },
          "FileRef": { "type": "object" }
        }
      }
    }).to_string()
  }

  fn search_input(keyword: &str) -> McpSchemaSearchInput {
    McpSchemaSearchInput {
      keyword: keyword.to_owned(),
      ..Default::default()
    }
  }

  fn sample_index() -> RestIndex {
    RestIndex::parse(&sample_spec()).unwrap()
  }

  #[test]
  fn search_hits_path_keyword() {
    let result = sample_index().search(search_input("ping")).unwrap();
    let items = result["items"].as_array().unwrap();
    assert_eq!(items.len(), 1);
    assert_eq!(items[0]["name"], "GET /api/oai/system/ping");
    assert_eq!(items[0]["method"], "GET");
    assert_eq!(items[0]["source"], "rest");
  }

  #[test]
  fn search_hits_chinese_summary() {
    let result = sample_index().search(search_input("导入")).unwrap();
    let items = result["items"].as_array().unwrap();
    assert_eq!(items.len(), 1);
    assert_eq!(items[0]["method"], "POST");
  }

  #[test]
  fn search_respects_limit_and_kind() {
    let mut input = search_input("api");
    input.limit = Some(1);
    assert_eq!(sample_index().search(input).unwrap()["items"].as_array().unwrap().len(), 1);

    let mut input = search_input("ping");
    input.kind = Some("type".to_owned());
    assert_eq!(sample_index().search(input).unwrap()["items"].as_array().unwrap().len(), 0);
  }

  #[test]
  fn get_returns_related_schemas() {
    let result = sample_index().get("GET /api/oai/system/ping").unwrap();
    assert_eq!(result["method"], "GET");
    let schemas = result["components"]["schemas"].as_object().unwrap();
    assert!(schemas.contains_key("R_PingData"));

    let result = sample_index().get("/api/oai/scrm/delivery/import_erp").unwrap();
    let schemas = result["components"]["schemas"].as_object().unwrap();
    assert!(schemas.contains_key("ImportErpInput"));
    assert!(schemas.contains_key("FileRef"));
  }

  #[test]
  fn has_endpoint_matches_method_and_path() {
    let index = sample_index();
    assert!(index.has_endpoint("GET", "/api/oai/system/ping"));
    assert!(index.has_endpoint("get", "/api/oai/system/ping"));
    assert!(!index.has_endpoint("POST", "/api/oai/system/ping"));
    assert!(!index.has_endpoint("GET", "/api/oai/unknown"));
  }

  #[test]
  fn path_template_matches_concrete_value() {
    assert!(path_matches("/a/{id}", "/a/123"));
    assert!(path_matches("/a/{id}/b", "/a/x/b"));
    assert!(!path_matches("/a/{id}", "/a"));
    assert!(!path_matches("/a/{id}", "/b/123"));
    assert!(!path_matches("/a/b", "/a/c"));
    assert!(!path_matches("/a/{id}", "/a/1/2"));

    let spec = json!({
      "openapi": "3.1.0",
      "paths": { "/api/oai/item/{id}": { "get": { "summary": "按 id 查询" } } }
    }).to_string();
    let index = RestIndex::parse(&spec).unwrap();
    assert!(index.has_endpoint("GET", "/api/oai/item/abc"));
    assert!(index.has_endpoint("get", "/api/oai/item/{id}"));
    assert!(!index.has_endpoint("POST", "/api/oai/item/abc"));
  }
}
