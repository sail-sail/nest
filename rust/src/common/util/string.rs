use sha2::{Digest, Sha256};
use base64::{engine::general_purpose, Engine};

use crate::common::id::ID;

pub fn trim_opt(s: Option<impl AsRef<ID>>) -> Option<ID> {
  if let Some(s) = s {
    let s = s.as_ref().trim();
    if s.is_empty() {
      None
    } else {
      ID::from(s).into()
    }
  } else {
    None
  }
}

#[must_use]
pub fn sql_like(s: &str) -> String {
  s.replace('%', "\\%")
    .replace('_', "\\_")
}

#[must_use]
pub fn hash(s: &[u8]) -> String {
  let mut hasher = Sha256::new();
  hasher.update(s);
  let hash = hasher.finalize();
  general_purpose::STANDARD.encode(hash)
}
