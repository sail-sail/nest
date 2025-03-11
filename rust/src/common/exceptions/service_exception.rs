use std::fmt;
use std::error::Error;

use derive_builder::Builder;

#[derive(Builder, Debug, Clone, Default)]
#[builder(setter(into))]
#[allow(dead_code)]
pub struct ServiceException {
  pub code: String,
  pub message: String,
  #[builder(default = "true")]
  pub rollback: bool,
  // 是否打印堆栈信息
  #[builder(default = "false")]
  pub trace: bool,
}

impl fmt::Display for ServiceException {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{message}", message = self.message)
  }
}

impl Error for ServiceException { }
