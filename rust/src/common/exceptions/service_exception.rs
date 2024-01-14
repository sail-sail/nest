use std::fmt;
use std::error::Error;

use derive_builder::Builder;

#[derive(Builder, Debug, Clone, Default)]
#[builder(setter(into))]
pub struct ServiceException {
  pub code: String,
  pub message: String,
  #[builder(default = "true")]
  pub rollback: bool,
}

impl fmt::Display for ServiceException {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{message}", message = self.message)
  }
}

impl Error for ServiceException { }
