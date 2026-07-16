use async_graphql::{
  InputValueError,
  InputValueResult,
  Scalar,
  ScalarType,
  Value,
};
use serde::{Deserialize, Serialize};
use serde_json::Map;

#[derive(Clone, Debug, Default, Serialize, Deserialize)]
pub struct JSONObject(pub Map<String, serde_json::Value>);

#[Scalar]
impl ScalarType for JSONObject {
  fn parse(value: Value) -> InputValueResult<Self> {
    match value {
      Value::Object(map) => {
        let mut json_map = Map::new();
        for (key, val) in map {
          json_map.insert(key.to_string(), gql_value_to_json(val));
        }
        Ok(JSONObject(json_map))
      }
      _ => Err(InputValueError::expected_type(value)),
    }
  }

  fn to_value(&self) -> Value {
    json_to_gql_value(&serde_json::Value::Object(self.0.clone()))
  }
}

/// 将 async_graphql::Value 转换为 serde_json::Value
fn gql_value_to_json(value: Value) -> serde_json::Value {
  match value {
    Value::Null => serde_json::Value::Null,
    Value::Boolean(b) => serde_json::Value::Bool(b),
    Value::Number(n) => {
      if let Some(i) = n.as_i64() {
        serde_json::Value::Number(i.into())
      } else if let Some(u) = n.as_u64() {
        serde_json::Value::Number(u.into())
      } else if let Some(f) = n.as_f64() {
        serde_json::Number::from_f64(f)
          .map(serde_json::Value::Number)
          .unwrap_or(serde_json::Value::Null)
      } else {
        serde_json::Value::Null
      }
    }
    Value::String(s) => serde_json::Value::String(s),
    Value::List(list) => {
      serde_json::Value::Array(list.into_iter().map(gql_value_to_json).collect())
    }
    Value::Object(map) => {
      let mut json_map = Map::new();
      for (key, val) in map {
        json_map.insert(key.to_string(), gql_value_to_json(val));
      }
      serde_json::Value::Object(json_map)
    }
    Value::Enum(e) => serde_json::Value::String(e.to_string()),
    Value::Binary(b) => serde_json::Value::Array(
      b.into_iter().map(|byte| serde_json::Value::Number(byte.into())).collect(),
    ),
  }
}

/// 将 serde_json::Value 转换为 async_graphql::Value
fn json_to_gql_value(value: &serde_json::Value) -> Value {
  match value {
    serde_json::Value::Null => Value::Null,
    serde_json::Value::Bool(b) => Value::Boolean(*b),
    serde_json::Value::Number(n) => {
      if let Some(i) = n.as_i64() {
        Value::Number(i.into())
      } else if let Some(u) = n.as_u64() {
        Value::Number(u.into())
      } else if let Some(f) = n.as_f64() {
        Value::Number(async_graphql::Number::from_f64(f).unwrap_or(async_graphql::Number::from(0)))
      } else {
        Value::Null
      }
    }
    serde_json::Value::String(s) => Value::String(s.clone()),
    serde_json::Value::Array(arr) => Value::List(arr.iter().map(json_to_gql_value).collect()),
    serde_json::Value::Object(map) => {
      let gql_map: async_graphql::indexmap::IndexMap<async_graphql::Name, Value> = map
        .iter()
        .map(|(k, v)| (async_graphql::Name::new(k), json_to_gql_value(v)))
        .collect();
      Value::Object(gql_map)
    }
  }
}
