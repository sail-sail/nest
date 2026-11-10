use std::fmt;
use serde::Deserialize;
use sqlx::encode::IsNull;
use sqlx::error::BoxDynError;
use sqlx::MySql;
use sqlx::mysql::MySqlValueRef;
use async_graphql;

/// 空ID的字节数组常量
pub const EMPTY_ID_BYTES: [u8; 22] = [0u8; 22];

/// 兼容旧数据：如果尾部 '=' 被去掉后长度恰好为 22，则该 22 字节值是合法的短 ID。
pub fn normalize_short_id_bytes(bytes: &[u8]) -> Option<[u8; 22]> {
  let normalized = if bytes.len() == 22 {
    bytes
  } else if bytes.len() == 24 {
    match bytes.strip_suffix(b"==") {
      Some(s) => s,
      None => bytes.strip_suffix(b"=")?,
    }
  } else {
    return None;
  };

  if normalized.len() != 22 {
    return None;
  }

  let mut arr = EMPTY_ID_BYTES;
  arr.copy_from_slice(normalized);
  Some(arr)
}

/// 把字符串解析为 22 字节 ID，长度不合法时返回空 ID
pub fn bytes_from_str(s: &str) -> [u8; 22] {
  let bytes = s.as_bytes();
  if bytes.is_empty() {
    return EMPTY_ID_BYTES;
  }
  normalize_short_id_bytes(bytes).unwrap_or(EMPTY_ID_BYTES)
}

/// ID的类型标记 trait
/// 只保留 ID 自身必要的能力，不挂超 trait，避免每个实现都做一次超 trait 证明
pub trait Id {
  /// 类型名称，用于Debug输出和错误消息
  const TYPE_NAME: &'static str;

  /// 获取内部字节数组的引用
  fn as_bytes(&self) -> &[u8; 22];

  /// 从字节数组创建ID
  fn from_bytes(bytes: [u8; 22]) -> Self;
}

/// 为实现Id trait的类型提供默认的Serialize实现
pub fn serialize_id<S>(bytes: &[u8; 22], serializer: S) -> Result<S::Ok, S::Error>
where
  S: serde::Serializer,
{
  if *bytes == EMPTY_ID_BYTES {
    serializer.serialize_str("")
  } else {
    match std::str::from_utf8(bytes) {
      Ok(s) => serializer.serialize_str(s),
      Err(_) => serializer.serialize_str("")
    }
  }
}

/// 为实现Id trait的类型提供默认的Deserialize实现
pub fn deserialize_id<'de, D>(deserializer: D) -> Result<[u8; 22], D::Error>
where
  D: serde::Deserializer<'de>,
{
  let s = String::deserialize(deserializer)?;
  Ok(bytes_from_str(&s))
}

/// 为实现Id trait的类型提供默认的Debug实现
pub fn debug_id(bytes: &[u8; 22], type_name: &str, f: &mut fmt::Formatter<'_>) -> fmt::Result {
  if *bytes == EMPTY_ID_BYTES {
    write!(f, "{type_name}()")
  } else {
    match std::str::from_utf8(bytes) {
      Ok(s) => write!(f, "{type_name}({s})"),
      Err(_) => write!(f, "{type_name}()")
    }
  }
}

/// 为实现Id trait的类型提供默认的Display实现
pub fn display_id(bytes: &[u8; 22], f: &mut fmt::Formatter<'_>) -> fmt::Result {
  if *bytes == EMPTY_ID_BYTES {
    f.write_str("")
  } else {
    match std::str::from_utf8(bytes) {
      Ok(s) => f.write_str(s),
      Err(_) => f.write_str("")
    }
  }
}

/// 解析ID字符串，返回未包装的错误消息，由宏里包装成 GraphQL 错误
pub fn parse_id_str(s: &str, type_name: &'static str) -> Result<[u8; 22], String> {
  let bytes = s.as_bytes();
  if bytes.is_empty() {
    return Ok(EMPTY_ID_BYTES);
  }
  if !(bytes.len() == 22 || bytes.len() == 24) {
    return Err(format!("{type_name} must be 22 bytes string, 24 bytes padded short id, or empty"));
  }
  normalize_short_id_bytes(bytes).ok_or_else(|| {
    format!("{type_name} must be 22 bytes string or 24 bytes padded short id")
  })
}

/// 为实现Id trait的类型提供默认的GraphQL ScalarType::to_value实现
pub fn to_value_id(bytes: &[u8; 22]) -> async_graphql::Value {
  if *bytes == EMPTY_ID_BYTES {
    async_graphql::Value::String("".into())
  } else {
    let s = std::str::from_utf8(bytes).unwrap_or("");
    async_graphql::Value::String(s.into())
  }
}

/// 为实现Id trait的类型提供默认的SQLx Encode实现
pub fn encode_id(bytes: &[u8; 22], buf: &mut Vec<u8>) -> sqlx::Result<IsNull, BoxDynError> {
  buf.extend_from_slice(bytes);
  Ok(IsNull::No)
}

/// 为实现Id trait的类型提供默认的SQLx Decode实现
pub fn decode_id(value: MySqlValueRef<'_>, type_name: &'static str) -> Result<[u8; 22], BoxDynError> {
  let bytes: &[u8] = <&[u8] as sqlx::Decode<MySql>>::decode(value)?;
  if bytes.is_empty() {
    return Ok(EMPTY_ID_BYTES);
  }
  if bytes.len() == 22 {
    let mut arr = EMPTY_ID_BYTES;
    arr.copy_from_slice(bytes);
    Ok(arr)
  } else if bytes.len() == 24 {
    normalize_short_id_bytes(bytes).ok_or_else(|| {
      format!("{type_name} must be 22 bytes or legacy 24-byte padded short id").into()
    })
  } else {
    Err(format!("{type_name} must be 22 bytes or legacy 24-byte padded short id").into())
  }
}

/// 宏：为ID类型生成所有必需的实现
#[macro_export]
macro_rules! impl_id {
  
  ($id_type:ident) => {
    #[derive(Default, Clone, Copy, PartialEq, Eq, Hash)]
    pub struct $id_type([u8; 22]);

    impl $crate::common::id::Id for $id_type {
      const TYPE_NAME: &'static str = stringify!($id_type);
      
      fn as_bytes(&self) -> &[u8; 22] {
        &self.0
      }
      
      fn from_bytes(bytes: [u8; 22]) -> Self {
        Self(bytes)
      }
    }

    impl $id_type {
      /// 转换为字符串切片
      pub fn as_str(&self) -> &str {
        if self.is_empty() {
          ""
        } else {
          std::str::from_utf8(&self.0).unwrap_or("")
        }
      }
      
      /// 检查是否为空ID
      pub fn is_empty(&self) -> bool {
        self.0 == $crate::common::id::EMPTY_ID_BYTES
      }
    }

    impl serde::Serialize for $id_type {
      fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
      where
        S: serde::Serializer,
      {
        $crate::common::id::serialize_id(&self.0, serializer)
      }
    }

    impl<'de> serde::Deserialize<'de> for $id_type {
      fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
      where
        D: serde::Deserializer<'de>,
      {
        Ok(Self($crate::common::id::deserialize_id(deserializer)?))
      }
    }

    impl std::fmt::Debug for $id_type {
      fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        $crate::common::id::debug_id(&self.0, <Self as $crate::common::id::Id>::TYPE_NAME, f)
      }
    }

    impl std::fmt::Display for $id_type {
      fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        $crate::common::id::display_id(&self.0, f)
      }
    }

    #[async_graphql::Scalar]
    impl async_graphql::ScalarType for $id_type {
      fn parse(value: async_graphql::Value) -> async_graphql::InputValueResult<Self> {
        match value {
          async_graphql::Value::String(s) => {
            $crate::common::id::parse_id_str(&s, <Self as $crate::common::id::Id>::TYPE_NAME)
              .map(|arr| Self(arr))
              .map_err(|message| async_graphql::InputValueError::custom(message))
          },
          other => Err(async_graphql::InputValueError::expected_type(other)),
        }
      }
      
      fn to_value(&self) -> async_graphql::Value {
        $crate::common::id::to_value_id(&self.0)
      }
    }

    impl From<$id_type> for $crate::common::context::ArgType {
      fn from(value: $id_type) -> Self {
        value.to_string().into()
      }
    }

    impl From<&$id_type> for $crate::common::context::ArgType {
      fn from(value: &$id_type) -> Self {
        value.to_string().into()
      }
    }

    impl From<String> for $id_type {
      fn from(s: String) -> Self {
        Self($crate::common::id::bytes_from_str(s.as_str()))
      }
    }

    impl From<[u8; 22]> for $id_type {
      fn from(arr: [u8; 22]) -> Self {
        Self(arr)
      }
    }

    impl From<&[u8; 22]> for $id_type {
      fn from(arr: &[u8; 22]) -> Self {
        Self(*arr)
      }
    }

    impl From<$id_type> for [u8; 22] {
      fn from(id: $id_type) -> Self {
        id.0
      }
    }

    impl From<$id_type> for String {
      fn from(id: $id_type) -> Self {
        id.as_str().to_string()
      }
    }

    impl From<&str> for $id_type {
      fn from(s: &str) -> Self {
        Self($crate::common::id::bytes_from_str(s))
      }
    }

    impl<'q> sqlx::encode::Encode<'q, sqlx::MySql> for $id_type {
      fn encode_by_ref(&self, buf: &mut Vec<u8>) -> sqlx::Result<sqlx::encode::IsNull, sqlx::error::BoxDynError> {
        $crate::common::id::encode_id(&self.0, buf)
      }
      
      fn size_hint(&self) -> usize {
        22
      }
    }

    impl sqlx::Type<sqlx::MySql> for $id_type {
      fn type_info() -> <sqlx::MySql as sqlx::Database>::TypeInfo {
        <&[u8] as sqlx::Type<sqlx::MySql>>::type_info()
      }
      
      fn compatible(ty: &<sqlx::MySql as sqlx::Database>::TypeInfo) -> bool {
        <&[u8] as sqlx::Type<sqlx::MySql>>::compatible(ty)
      }
    }

    impl<'r> sqlx::Decode<'r, sqlx::MySql> for $id_type {
      fn decode(value: sqlx::mysql::MySqlValueRef<'r>) -> Result<Self, sqlx::error::BoxDynError> {
        Ok(Self($crate::common::id::decode_id(value, <Self as $crate::common::id::Id>::TYPE_NAME)?))
      }
    }

    impl PartialEq<str> for $id_type {
      fn eq(&self, other: &str) -> bool {
        self.0.as_slice() == other.as_bytes()
      }
    }
  };
}

pub use impl_id;
