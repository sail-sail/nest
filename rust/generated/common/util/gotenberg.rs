use color_eyre::eyre::{Result, eyre};

pub fn get_gotenberg_domain() -> Result<String> {
  let gotenberg_protocol = std::env::var("gotenberg_protocol")
    .map_err(|_| eyre!("gotenberg_protocol not found in .env"))?;

  let gotenberg_host = std::env::var("gotenberg_host")
    .map_err(|_| eyre!("gotenberg_host not found in .env"))?;

  let gotenberg_port = std::env::var("gotenberg_port")
    .map_err(|_| eyre!("gotenberg_port not found in .env"))?;
  
  let gotenberg_basic_auth_username = std::env::var("gotenberg_basic_auth_username")
    .unwrap_or_default();
  
  let gotenberg_basic_auth_password = std::env::var("gotenberg_basic_auth_password")
    .unwrap_or_default();
  
  let gotenberg_basic_auth = if !gotenberg_basic_auth_username.is_empty() {
    format!("{gotenberg_basic_auth_username}:{gotenberg_basic_auth_password}@")
  } else {
    String::new()
  };
  
  Ok(format!(
    "{gotenberg_protocol}://{gotenberg_basic_auth}{gotenberg_host}:{gotenberg_port}",
  ))
}
