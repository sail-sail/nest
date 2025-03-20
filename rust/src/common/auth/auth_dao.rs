use color_eyre::eyre::{Result, eyre};
use sha2::Digest;

use jwt::{VerifyWithKey, SignWithKey};

use super::auth_model::{AuthModel, SECRET_KEY};
use hmac::Mac;

use base64::{engine::general_purpose, Engine};

pub fn get_auth_model_by_token(
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

pub fn get_token_by_auth_model(
  auth_model: &AuthModel,
) -> Result<String> {
  if auth_model.exp <= 0 {
    return Err(eyre!("token过期时间不能为空"));
  }
  let key: hmac::Hmac<sha2::Sha256> = hmac::Hmac::new_from_slice(SECRET_KEY.as_bytes())?;
  Ok(SignWithKey::sign_with_key(auth_model, &key)?.to_string())
}

pub fn get_password(str: String) -> Result<String> {
  let str = {
    let mut hasher = sha2::Sha256::new();
    hasher.update(str + SECRET_KEY);
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

  use crate::common::auth::auth_dao::get_auth_model_by_token;

  use super::get_password;
  
  #[derive(serde::Deserialize, serde::Serialize)]
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
    
    let _claims: Claims = VerifyWithKey::verify_with_key(&*token2, &key).unwrap();
    
    // Claims { id: "9LmnqhLITzKskFO/lcXRqA", wx_usr_id: None, exp: 1680625097 }
    // println!("{:?}", claims);
  }
  
  #[test]
  fn test_get_password() {
    let str = get_password("a".to_owned()).unwrap();
    assert!(str == "RoZMvtNCRmGuZCdQ2FoRdhfYFQ0GBNu/JDaKdRx5o7A");
  }
  
  #[test]
  fn test_get_auth_model_by_token() {
    let test_authorization = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjlMbW5xaExJVHpLc2tGTy9sY1hScUEiLCJkZXB0X2lkIjoiUi9WSFcwa3pSeEs5dEc4bUlITWRiUSIsImxhbmciOiJ6aC1jbiIsImV4cCI6MTY4MTAwMDE5OX0.V3LQksf-D50OzvlFO5r-xZ-FwFxah-tSvJ0abN6Vl0E";
    let _auth_model = get_auth_model_by_token(test_authorization);
    // println!("{:?}", auth_model);
  }
  
}
