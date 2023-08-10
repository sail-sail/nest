
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
