use async_graphql::*;
use chrono::{NaiveDateTime as ChronoNaiveDateTime, format::ParseError};
use serde::{Deserialize, Serialize};
use sqlx::MySql;
use sqlx::encode::IsNull;
use sqlx::error::BoxDynError;
use sqlx::mysql::MySqlValueRef;

const PATTERNS: [&str; 5] = [
  "%Y-%m-%d %H:%M:%S",
  "%Y-%m-%dT%H:%M:%S",
  "%Y/%m/%d %H:%M:%S",
  "%Y/%m/%dT%H:%M:%S",
  "%Y-%m-%d",
];

#[derive(Copy, Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(transparent)]
pub struct NaiveDateTime(ChronoNaiveDateTime);

fn parse_naive_datetime(input: &str, fmt: Option<&str>) -> Result<ChronoNaiveDateTime, ParseError> {
  if let Some(fmt) = fmt
    && let Ok(dt) = ChronoNaiveDateTime::parse_from_str(input, fmt)
  {
    return Ok(dt);
  }

  for pattern in PATTERNS {
    if let Ok(dt) = ChronoNaiveDateTime::parse_from_str(input, pattern) {
      return Ok(dt);
    }
  }

  let fallback = ChronoNaiveDateTime::parse_from_str("1970-01-01 00:00:00", "%Y-%m-%d %H:%M:%S")
    .unwrap_err();
  Err(fallback)
}

impl NaiveDateTime {
  pub fn parse_from_str(input: &str, fmt: &str) -> Result<Self, ParseError> {
    parse_naive_datetime(input, Some(fmt)).map(Self)
  }
}

impl std::str::FromStr for NaiveDateTime {
  type Err = ParseError;

  fn from_str(s: &str) -> Result<Self, Self::Err> {
    parse_naive_datetime(s, None).map(Self)
  }
}

impl std::fmt::Display for NaiveDateTime {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    self.0.fmt(f)
  }
}

#[Scalar]
impl ScalarType for NaiveDateTime {
  fn parse(value: Value) -> InputValueResult<Self> {
    match value {
      Value::String(s) => {
        let dt = parse_naive_datetime(&s, None)
          .map_err(|e| InputValueError::custom(e.to_string()))?;
        Ok(NaiveDateTime(dt))
      }
      other => Err(InputValueError::expected_type(other)),
    }
  }

  fn to_value(&self) -> Value {
    Value::String(self.0.format("%Y-%m-%d %H:%M:%S").to_string())
  }
}

impl std::ops::Deref for NaiveDateTime {
  type Target = ChronoNaiveDateTime;

  fn deref(&self) -> &Self::Target {
    &self.0
  }
}

impl std::ops::DerefMut for NaiveDateTime {
  fn deref_mut(&mut self) -> &mut Self::Target {
    &mut self.0
  }
}

impl From<ChronoNaiveDateTime> for NaiveDateTime {
  fn from(value: ChronoNaiveDateTime) -> Self {
    Self(value)
  }
}

impl From<NaiveDateTime> for ChronoNaiveDateTime {
  fn from(value: NaiveDateTime) -> Self {
    value.0
  }
}

impl<'q> sqlx::encode::Encode<'q, MySql> for NaiveDateTime {
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> sqlx::Result<IsNull, BoxDynError> {
    self.0.encode_by_ref(buf)
  }

  fn size_hint(&self) -> usize {
    std::mem::size_of::<ChronoNaiveDateTime>()
  }
}

impl sqlx::Type<MySql> for NaiveDateTime {
  fn type_info() -> <MySql as sqlx::Database>::TypeInfo {
    <ChronoNaiveDateTime as sqlx::Type<MySql>>::type_info()
  }

  fn compatible(ty: &<MySql as sqlx::Database>::TypeInfo) -> bool {
    <ChronoNaiveDateTime as sqlx::Type<MySql>>::compatible(ty)
  }
}

impl<'r> sqlx::Decode<'r, MySql> for NaiveDateTime {
  fn decode(value: MySqlValueRef<'r>) -> Result<Self, BoxDynError> {
    let dt = <ChronoNaiveDateTime as sqlx::Decode<'r, MySql>>::decode(value)?;
    Ok(Self(dt))
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use chrono::{Datelike, Timelike};

  #[test]
  fn parses_supported_formats() {
    let parsed = <NaiveDateTime as ScalarType>::parse(Value::String("2024/01/02 03:04:05".into()))
      .expect("space-separated format should parse");
    assert_eq!(parsed.year(), 2024);
    assert_eq!(parsed.month(), 1);
    assert_eq!(parsed.day(), 2);

    let parsed_t = <NaiveDateTime as ScalarType>::parse(Value::String("2024/01/02T03:04:05".into()))
      .expect("T-separated format should parse");
    assert_eq!(parsed_t.hour(), 3);
    assert_eq!(parsed_t.minute(), 4);
    assert_eq!(parsed_t.second(), 5);
  }
}
