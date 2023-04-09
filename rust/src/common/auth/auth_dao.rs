use anyhow::{Ok, Result, anyhow};
use sha2::Digest;

use jwt::{VerifyWithKey, SignWithKey};

use crate::common::context::Ctx;

use super::auth_model::{ServerTokentimeout, AuthModel, AuthInfo, SECRET_KEY};
use hmac::Mac;

use chrono::prelude::Local;
use base64::{engine::general_purpose, Engine};

pub async fn get_auth_model(
  ctx: &mut Ctx<'_>,
) -> Result<Option<AuthModel>> {
  if ctx.cache_map.contains_key("auth_model") {
    let auth_model: AuthModel = serde_json::from_str(ctx.cache_map.get("auth_model").unwrap())?;
    return Ok(Some(auth_model));
  }
  // 获取请求头中的 authorization
  let gql_ctx = &ctx.gql_ctx;
  let mut token: Option<&str> = None;
  if let Some(auth_info) = gql_ctx.data_opt::<AuthInfo>() {
    if let Some(token0) = &auth_info.token {
      token = Some(token0);
    }
  }
  if token.is_none() {
    return Ok(None);
  }
  let token = token.unwrap();
  let mut auth_model: AuthModel = get_auth_model_by_token(token)?;
  if ctx.not_verify_token {
    return Ok(Some(auth_model));
  }
  let now = Local::now();
  let server_tokentimeout = gql_ctx.data::<ServerTokentimeout>().unwrap();
  let now_sec = now.timestamp_millis() / 1000;
  if now_sec - server_tokentimeout > auth_model.exp {
    if now_sec - server_tokentimeout * 2 > auth_model.exp {
      return Err(anyhow!("refresh_token_expired"));
    }
    auth_model.exp = now_sec + server_tokentimeout;
    ctx.cache_map.insert("auth_model".to_owned(), serde_json::to_string(&auth_model)?);
    let token = get_token_by_auth_model(auth_model)?;
    gql_ctx.insert_http_header("authorization", token);
  }
  Ok(None)
}

fn get_auth_model_by_token(
  token: impl AsRef<str>,
) -> Result<AuthModel> {
  let token = token.as_ref().replace("Bearer ", "");
  let mut token: &str = token.as_ref();
  if token.starts_with("Bearer ") {
    token = utf8_slice::from(token, 7);
  }
  let key: hmac::Hmac<sha2::Sha256> = hmac::Hmac::new_from_slice(SECRET_KEY.as_bytes())?;
  let auth_model: AuthModel = VerifyWithKey::verify_with_key(token, &key)?;
  Ok(auth_model)
}

fn get_token_by_auth_model(
  auth_model: AuthModel,
) -> Result<String> {
  let key: hmac::Hmac<sha2::Sha256> = hmac::Hmac::new_from_slice(SECRET_KEY.as_bytes())?;
  let token = String::from("Bearer ") + SignWithKey::sign_with_key(auth_model, &key)?.as_str();
  Ok(token)
}

pub fn get_password(str: impl AsRef<str>) -> Result<String> {
  let str = {
    let mut hasher = sha2::Sha256::new();
    hasher.update(str.as_ref().to_owned() + SECRET_KEY);
    let result = hasher.finalize();
    general_purpose::STANDARD.encode(result)
  };
  let str = {
    let mut hasher = sha2::Sha256::new();
    hasher.update(str);
    let result = hasher.finalize();
    general_purpose::STANDARD.encode(result)
  };
  let str = utf8_slice::slice(&str, 0, 43);
  Ok(str.to_owned())
}



#[cfg(test)]
mod test {
  
  use hmac::{Hmac, Mac};
  use jwt::{VerifyWithKey, SignWithKey};
  use sha2::Sha256;

  use crate::common::auth::{auth_dao::get_auth_model_by_token};

  use super::get_password;
  
  #[derive(serde::Deserialize, serde::Serialize, Debug)]
  struct Claims {
    id: String,
    wx_usr_id: Option<String>,
    exp: i64,
  }
  
  #[test]
  fn test_jwt() {
    let key: Hmac<Sha256> = Hmac::new_from_slice(b"38e52379-9e94-467c-8e63-17ad318fc845").unwrap();
    
    // let token: &str = "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjlMbW5xaExJVHpLc2tGTy9sY1hScUEiLCJkZXB0X2lkIjoiUi9WSFcwa3pSeEs5dEc4bUlITWRiUSIsImxhbmciOiJ6aC1jbiIsImV4cCI6MTY4MDYyNTA5N30.BDbu_mJXsECJnnRiOmf10fEniE8RZ0E_77lZYXL5X8Q";
    let token2 = SignWithKey::sign_with_key(Claims { id: "9LmnqhLITzKskFO/lcXRqA".to_owned(), wx_usr_id: None, exp: 1680625097 }, &key).unwrap();
    
    let claims: Claims = VerifyWithKey::verify_with_key(&*token2, &key).unwrap();
    
    // Claims { id: "9LmnqhLITzKskFO/lcXRqA", wx_usr_id: None, exp: 1680625097 }
    println!("{:?}", claims);
  }
  
  #[test]
  fn test_get_password() {
    let str = get_password("a").unwrap();
    assert!(str == "RoZMvtNCRmGuZCdQ2FoRdhfYFQ0GBNu/JDaKdRx5o7A");
  }
  
  #[test]
  fn test_get_auth_model_by_token() {
    let test_authorization = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjlMbW5xaExJVHpLc2tGTy9sY1hScUEiLCJkZXB0X2lkIjoiUi9WSFcwa3pSeEs5dEc4bUlITWRiUSIsImxhbmciOiJ6aC1jbiIsImV4cCI6MTY4MTAwMDE5OX0.V3LQksf-D50OzvlFO5r-xZ-FwFxah-tSvJ0abN6Vl0E";
    let auth_model = get_auth_model_by_token(test_authorization);
    println!("{:?}", auth_model);
  }
  
}
