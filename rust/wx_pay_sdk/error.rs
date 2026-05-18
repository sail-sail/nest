use std::fmt::{Display, Formatter};

pub type Result<T> = std::result::Result<T, WxPayError>;

#[derive(Debug)]
pub enum WxPayError {
  Api {
    code: String,
    message: String,
  },
  InvalidLength {
    field: &'static str,
    expected: usize,
    actual: usize,
  },
  InvalidResponse(String),
  Reqwest(reqwest::Error),
  SerdeJson(serde_json::Error),
  Base64(base64::DecodeError),
  Utf8(std::str::Utf8Error),
  Header(reqwest::header::InvalidHeaderValue),
  Pkcs8(rsa::pkcs8::Error),
  Rsa(rsa::errors::Error),
  AesGcm(aes_gcm::Error),
}

impl Display for WxPayError {
  fn fmt(
    &self,
    f: &mut Formatter<'_>,
  ) -> std::fmt::Result {
    match self {
      Self::Api { code, message } => {
        write!(f, "WeChat API error {code}: {message}")
      }
      Self::InvalidLength {
        field,
        expected,
        actual,
      } => {
        write!(
          f,
          "Invalid byte length for {field}: expected {expected}, got {actual}"
        )
      }
      Self::InvalidResponse(message) => f.write_str(message),
      Self::Reqwest(err) => err.fmt(f),
      Self::SerdeJson(err) => err.fmt(f),
      Self::Base64(err) => err.fmt(f),
      Self::Utf8(err) => err.fmt(f),
      Self::Header(err) => err.fmt(f),
      Self::Pkcs8(err) => err.fmt(f),
      Self::Rsa(err) => err.fmt(f),
      Self::AesGcm(_) => f.write_str("AES-GCM decrypt failed"),
    }
  }
}

impl std::error::Error for WxPayError {
  fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
    match self {
      Self::Reqwest(err) => Some(err),
      Self::SerdeJson(err) => Some(err),
      Self::Base64(err) => Some(err),
      Self::Utf8(err) => Some(err),
      Self::Header(err) => Some(err),
      Self::Pkcs8(err) => Some(err),
      Self::Rsa(err) => Some(err),
      Self::Api { .. } |
      Self::InvalidLength { .. } |
      Self::InvalidResponse(_) |
      Self::AesGcm(_) => None,
    }
  }
}

impl From<reqwest::Error> for WxPayError {
  fn from(value: reqwest::Error) -> Self {
    Self::Reqwest(value)
  }
}

impl From<serde_json::Error> for WxPayError {
  fn from(value: serde_json::Error) -> Self {
    Self::SerdeJson(value)
  }
}

impl From<base64::DecodeError> for WxPayError {
  fn from(value: base64::DecodeError) -> Self {
    Self::Base64(value)
  }
}

impl From<std::str::Utf8Error> for WxPayError {
  fn from(value: std::str::Utf8Error) -> Self {
    Self::Utf8(value)
  }
}

impl From<reqwest::header::InvalidHeaderValue> for WxPayError {
  fn from(value: reqwest::header::InvalidHeaderValue) -> Self {
    Self::Header(value)
  }
}

impl From<rsa::pkcs8::Error> for WxPayError {
  fn from(value: rsa::pkcs8::Error) -> Self {
    Self::Pkcs8(value)
  }
}

impl From<rsa::errors::Error> for WxPayError {
  fn from(value: rsa::errors::Error) -> Self {
    Self::Rsa(value)
  }
}

impl From<aes_gcm::Error> for WxPayError {
  fn from(value: aes_gcm::Error) -> Self {
    Self::AesGcm(value)
  }
}