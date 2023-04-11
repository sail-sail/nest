
pub fn is_empty(s: &Option<String>) -> bool {
  if let Some(s) = s {
    s.is_empty()
  } else {
    true
  }
}

pub fn is_not_empty(s: &Option<String>) -> bool {
  !is_empty(s)
}
