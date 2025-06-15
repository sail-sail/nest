use std::fmt;
use std::error::Error;

use derive_builder::Builder;

#[derive(Builder, Debug, Clone)]
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

// 手动实现 Default，设置 rollback = true
impl Default for ServiceException {
  fn default() -> Self {
    ServiceException {
      code: "500".to_string(),
      message: "Internal Server Error".to_string(),
      rollback: true,
      trace: false,
    }
  }
}

impl fmt::Display for ServiceException {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{message}", message = self.message)
  }
}

impl Error for ServiceException { }
