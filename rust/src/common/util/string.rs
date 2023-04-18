
pub fn is_empty_opt(s: &Option<String>) -> bool {
  if let Some(s) = s {
    let chars = s.chars();
    for c in chars {
      if !c.is_whitespace() {
        return false;
      }
    }
    true
  } else {
    true
  }
}

pub fn is_not_empty_opt(s: &Option<String>) -> bool {
  !is_empty_opt(s)
}

pub fn trim_opt(s: &Option<String>) -> Option<String> {
  if let Some(s) = s {
    let s = s.trim();
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
