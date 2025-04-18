use color_eyre::eyre::{Result,eyre};

#[allow(dead_code)]
pub fn chars_max_length(
  value: Option<String>,
  len: usize,
  label: &str,
) -> Result<()> {
  
  if value.is_none() {
    return Ok(());
  }
  let value = value.unwrap();
  
  let value_len = value.chars().count();
  
  if value_len <= len {
    return Ok(());
  }
  
  let err_msg = format!(
    "The {label} length cannot greater than {len}",
  );
  
  Err(eyre!(err_msg))
}
