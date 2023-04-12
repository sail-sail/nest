
pub fn is_empty(s: &Option<String>) -> bool {
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

pub fn is_not_empty(s: &Option<String>) -> bool {
  !is_empty(s)
}
