use std::fmt;
use std::error::Error;

use derive_builder::Builder;

use smol_str::SmolStr;

#[derive(Builder, Debug, Clone)]
#[builder(setter(into))]
#[allow(dead_code)]
pub struct ServiceException {
  pub code: SmolStr,
  pub message: SmolStr,
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
      code: "500".into(),
      message: "Internal Server Error".into(),
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
