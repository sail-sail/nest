use std::fmt::Display;
use std::ops::Deref;

use serde::{Serialize, Deserialize};
use sqlx::encode::{Encode, IsNull};
use sqlx::MySql;
use smol_str::SmolStr;

#[derive(Default, Serialize, Deserialize, Clone, Debug, PartialEq, Eq, Hash, PartialOrd, Ord)]
pub struct ID(SmolStr);

impl Display for ID {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    self.0.fmt(f)
  }
}

#[async_graphql::Scalar]
impl async_graphql::ScalarType for ID {
  
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

impl From<SmolStr> for ID {
  fn from(s: SmolStr) -> Self {
    Self(s)
  }
}

impl From<String> for ID {
  fn from(s: String) -> Self {
    Self(s.into())
  }
}

impl From<&str> for ID {
  fn from(s: &str) -> Self {
    Self(s.into())
  }
}

impl Deref for ID {
  
  type Target = SmolStr;
  
  fn deref(&self) -> &SmolStr {
    &self.0
  }
  
}

impl Encode<'_, MySql> for ID {
  
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> IsNull {
    <&str as Encode<MySql>>::encode(self.as_str(), buf)
  }
  
  fn size_hint(&self) -> usize {
    self.len()
  }
  
}

impl sqlx::Type<MySql> for ID {
  
  fn type_info() -> <MySql as sqlx::Database>::TypeInfo {
    <&str as sqlx::Type<MySql>>::type_info()
  }
  
  fn compatible(ty: &<MySql as sqlx::Database>::TypeInfo) -> bool {
    <&str as sqlx::Type<MySql>>::compatible(ty)
  }
}

impl<'r> sqlx::Decode<'r, MySql> for ID {
  
  fn decode(
    value: <MySql as sqlx::database::HasValueRef>::ValueRef,
  ) -> Result<Self, sqlx::error::BoxDynError> {
    <&str as sqlx::Decode<MySql>>::decode(value).map(Self::from)
  }
  
}
