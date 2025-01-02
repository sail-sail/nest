use std::sync::OnceLock;

static CLIENT: OnceLock<reqwest::Client> = OnceLock::new();

#[allow(dead_code)]
pub fn client() -> &'static reqwest::Client {
  CLIENT.get_or_init(reqwest::Client::new)
}
