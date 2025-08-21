use std::fmt;
use std::hash::Hash;
use serde::{Serialize, Deserialize};
use sqlx::encode::IsNull;
use sqlx::error::BoxDynError;
use sqlx::MySql;
use sqlx::mysql::MySqlValueRef;
use smol_str::SmolStr;
use async_graphql;
use crate::common::context::ArgType;

/// 空ID的字节数组常量
pub const EMPTY_ID_BYTES: [u8; 22] = [0u8; 22];

/// 通用ID trait，为22字节的ID类型提供统一接口
pub trait Id: 
  Default + Clone + Copy + PartialEq + Eq + Hash + Send + Sync + 
  Serialize + for<'de> Deserialize<'de> +
  fmt::Debug + fmt::Display +
  async_graphql::ScalarType + async_graphql::InputType +
  From<String> + for<'a> From<&'a str> + From<SmolStr> + for<'a> From<&'a SmolStr> + From<[u8; 22]> + for<'a> From<&'a [u8; 22]> +
  Into<String> + Into<SmolStr> + Into<[u8; 22]> + Into<ArgType> +
  for<'q> sqlx::Encode<'q, MySql> + sqlx::Type<MySql> + for<'r> sqlx::Decode<'r, MySql> +
  PartialEq<str>
{
  /// 类型名称，用于Debug输出和错误消息
  const TYPE_NAME: &'static str;
  
  /// GraphQL scalar 名称
  const GRAPHQL_NAME: &'static str;
  
  /// 获取内部字节数组的引用
  fn as_bytes(&self) -> &[u8; 22];
  
  /// 从字节数组创建ID
  fn from_bytes(bytes: [u8; 22]) -> Self;
  
  /// 转换为字符串切片
  fn as_str(&self) -> &str {
    if self.is_empty() {
      ""
    } else {
      std::str::from_utf8(self.as_bytes()).unwrap_or("")
    }
  }
  
  /// 检查是否为空ID
  fn is_empty(&self) -> bool {
    *self.as_bytes() == crate::common::id::EMPTY_ID_BYTES
  }
}

/// 为实现Id trait的类型提供默认的Serialize实现
pub fn serialize_id<S, T>(id: &T, serializer: S) -> Result<S::Ok, S::Error>
where
  S: serde::Serializer,
  T: Id,
{
  if id.is_empty() {
    serializer.serialize_str("")
  } else {
    match std::str::from_utf8(id.as_bytes()) {
      Ok(s) => serializer.serialize_str(s),
      Err(_) => serializer.serialize_str("")
    }
  }
}

/// 为实现Id trait的类型提供默认的Deserialize实现
pub fn deserialize_id<'de, D, T>(deserializer: D) -> Result<T, D::Error>
where
  D: serde::Deserializer<'de>,
  T: Id,
{
  let s = String::deserialize(deserializer)?;
  Ok(T::from(s))
}

/// 为实现Id trait的类型提供默认的Debug实现
pub fn debug_id<T: Id>(id: &T, f: &mut fmt::Formatter<'_>) -> fmt::Result {
  match std::str::from_utf8(id.as_bytes()) {
    Ok(s) => write!(f, "{}({})", T::TYPE_NAME, s),
    Err(_) => write!(f, "{}()", T::TYPE_NAME)
  }
}

/// 为实现Id trait的类型提供默认的Display实现
pub fn display_id<T: Id>(id: &T, f: &mut fmt::Formatter<'_>) -> fmt::Result {
  if id.is_empty() {
    write!(f, "")
  } else {
    match std::str::from_utf8(id.as_bytes()) {
      Ok(s) => write!(f, "{}", s),
      Err(_) => write!(f, "")
    }
  }
}

/// 为实现Id trait的类型提供默认的GraphQL ScalarType::parse实现
pub fn parse_id<T: Id>(value: async_graphql::Value) -> async_graphql::InputValueResult<T> {
  match value {
    async_graphql::Value::String(s) => {
      let bytes = s.as_bytes();
      if bytes.is_empty() {
        return Ok(T::from_bytes(crate::common::id::EMPTY_ID_BYTES));
      }
      if bytes.len() != 22 {
        return Err(async_graphql::InputValueError::custom(
          format!("{} must be 22 bytes string or empty", T::TYPE_NAME)
        ));
      }
      let mut arr = crate::common::id::EMPTY_ID_BYTES;
      arr.copy_from_slice(bytes);
      Ok(T::from_bytes(arr))
    },
    _ => Err(async_graphql::InputValueError::expected_type(value)),
  }
}

/// 为实现Id trait的类型提供默认的GraphQL ScalarType::to_value实现
pub fn to_value_id<T: Id>(id: &T) -> async_graphql::Value {
  if id.is_empty() {
    async_graphql::Value::String("".into())
  } else {
    let s = std::str::from_utf8(id.as_bytes()).unwrap_or("");
    async_graphql::Value::String(s.into())
  }
}

/// 为实现Id trait的类型提供默认的SQLx Encode实现
pub fn encode_id<T: Id>(id: &T, buf: &mut Vec<u8>) -> sqlx::Result<IsNull, BoxDynError> {
  buf.extend_from_slice(id.as_bytes());
  Ok(IsNull::No)
}

/// 为实现Id trait的类型提供默认的SQLx Decode实现
pub fn decode_id<T: Id>(value: MySqlValueRef<'_>) -> Result<T, BoxDynError> {
  let bytes: &[u8] = <&[u8] as sqlx::Decode<MySql>>::decode(value)?;
  let mut arr = EMPTY_ID_BYTES;
  if bytes.len() == 22 {
    arr.copy_from_slice(bytes);
  } else if bytes.len() > 22 {
    return Err(format!("{} must be 22 bytes", T::TYPE_NAME).into());
  }
  Ok(T::from_bytes(arr))
}

/// 宏：为ID类型生成所有必需的实现
#[macro_export]
macro_rules! impl_id {
  
  ($id_type:ident) => {
    #[derive(Default, Clone, Copy, PartialEq, Eq, Hash)]
    pub struct $id_type([u8; 22]);

    impl $crate::common::id::Id for $id_type {
      const TYPE_NAME: &'static str = stringify!($id_type);
      const GRAPHQL_NAME: &'static str = stringify!($id_type);
      
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
        $crate::common::id::serialize_id(self, serializer)
      }
    }

    impl<'de> serde::Deserialize<'de> for $id_type {
      fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
      where
        D: serde::Deserializer<'de>,
      {
        $crate::common::id::deserialize_id(deserializer)
      }
    }

    impl std::fmt::Debug for $id_type {
      fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        $crate::common::id::debug_id(self, f)
      }
    }

    impl std::fmt::Display for $id_type {
      fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        $crate::common::id::display_id(self, f)
      }
    }

    #[async_graphql::Scalar]
    impl async_graphql::ScalarType for $id_type {
      fn parse(value: async_graphql::Value) -> async_graphql::InputValueResult<Self> {
        $crate::common::id::parse_id(value)
      }
      
      fn to_value(&self) -> async_graphql::Value {
        $crate::common::id::to_value_id(self)
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

    impl From<$id_type> for smol_str::SmolStr {
      fn from(id: $id_type) -> Self {
        id.as_str().into()
      }
    }

    impl From<smol_str::SmolStr> for $id_type {
      fn from(s: smol_str::SmolStr) -> Self {
        s.as_str().into()
      }
    }

    impl From<&smol_str::SmolStr> for $id_type {
      fn from(s: &smol_str::SmolStr) -> Self {
        s.as_str().into()
      }
    }

    impl From<String> for $id_type {
      fn from(s: String) -> Self {
        s.as_str().into()
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
        let bytes = s.as_bytes();
        let mut arr = $crate::common::id::EMPTY_ID_BYTES;
        if bytes.len() == 22 {
          arr.copy_from_slice(bytes);
        }
        Self(arr)
      }
    }

    impl<'q> sqlx::encode::Encode<'q, sqlx::MySql> for $id_type {
      fn encode_by_ref(&self, buf: &mut Vec<u8>) -> sqlx::Result<sqlx::encode::IsNull, sqlx::error::BoxDynError> {
        $crate::common::id::encode_id(self, buf)
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
        $crate::common::id::decode_id(value)
      }
    }

    impl PartialEq<str> for $id_type {
      fn eq(&self, other: &str) -> bool {
        let bytes = other.as_bytes();
        *self.as_bytes() == bytes
      }
    }
  };
}

pub use impl_id;
