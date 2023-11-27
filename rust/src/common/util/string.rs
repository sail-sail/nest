use sha2::{Digest, Sha256};
use base64::{engine::general_purpose, Engine};

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
