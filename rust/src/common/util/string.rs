use sha2::{Digest, Sha256};
use base64::{engine::general_purpose, Engine};

pub fn trim_opt(s: Option<impl AsRef<str>>) -> Option<String> {
  if let Some(s) = s {
    let s = s.as_ref().trim();
    if s.is_empty() {
      None
    } else {
      s.to_owned().into()
    }
  } else {
    None
  }
}

pub fn sql_like(s: &str) -> String {
  s.replace("%", "\\%")
    .replace("_", "\\_")
}

pub fn hash(s: &[u8]) -> String {
  let mut hasher = Sha256::new();
  hasher.update(s);
  let hash = hasher.finalize();
  general_purpose::STANDARD.encode(hash)
}
