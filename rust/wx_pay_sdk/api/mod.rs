mod data;
mod pay_api;

pub use data::*;

#[derive(Debug)]
pub(crate) enum ReqMethod {
  Get,
  Post,
}

impl ReqMethod {
  pub(crate) fn as_str(&self) -> &str {
    match self {
      Self::Get => "GET",
      Self::Post => "POST",
    }
  }
}

pub(crate) use pay_api::*;