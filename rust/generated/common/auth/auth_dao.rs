use color_eyre::eyre::{Result, eyre};
use std::sync::LazyLock;

use sha2::Digest;

use jsonwebtoken::{
  Algorithm,
  DecodingKey,
  EncodingKey,
  Header,
  Validation,
  decode,
  encode,
};

use super::auth_model::{AuthModel, SECRET_KEY};

use base64::{engine::general_purpose, Engine};

use smol_str::SmolStr;

static JWT_ENCODING_KEY: LazyLock<EncodingKey> =
  LazyLock::new(|| EncodingKey::from_secret(SECRET_KEY.as_bytes()));

static JWT_DECODING_KEY: LazyLock<DecodingKey> =
  LazyLock::new(|| DecodingKey::from_secret(SECRET_KEY.as_bytes()));

static JWT_VALIDATION: LazyLock<Validation> = LazyLock::new(|| {
  let mut validation = Validation::new(Algorithm::HS256);
  validation.validate_exp = false;
  validation
});

pub fn get_auth_model_by_token(
  token: impl AsRef<str>,
) -> Result<AuthModel> {
  let token = token.as_ref().replace("Bearer ", "");
  let mut token: &str = token.as_ref();
  if token.starts_with("Bearer ") {
    token = utf8_slice::from(token, 7);
  }
  let auth_model = decode::<AuthModel>(
    token,
    &JWT_DECODING_KEY,
    &JWT_VALIDATION,
  )?.claims;
  Ok(auth_model)
}

pub fn get_token_by_auth_model(
  auth_model: &AuthModel,
) -> Result<SmolStr> {
  if auth_model.exp <= 0 {
    return Err(eyre!("token过期时间不能为空"));
  }
  Ok(encode(
    &Header::default(),
    auth_model,
    &JWT_ENCODING_KEY,
  )?.into())
}

pub fn get_password(str: SmolStr) -> Result<SmolStr> {
  let str = {
    let mut hasher = sha2::Sha256::new();
    hasher.update(str.to_string() + SECRET_KEY);
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
  Ok(str.into())
}



#[cfg(test)]
mod test {
  
  use jsonwebtoken::{
    DecodingKey,
    EncodingKey,
    Header,
    Validation,
    decode,
    encode,
  };

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
    let encoding_key = EncodingKey::from_secret(b"38e52379-9e94-467c-8e63-17ad318fc845");
    let decoding_key = DecodingKey::from_secret(b"38e52379-9e94-467c-8e63-17ad318fc845");
    let mut validation = Validation::default();
    validation.validate_exp = false;
    
    // let token: &str = "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjlMbW5xaExJVHpLc2tGTy9sY1hScUEiLCJkZXB0X2lkIjoiUi9WSFcwa3pSeEs5dEc4bUlITWRiUSIsImxhbmciOiJ6aC1jbiIsImV4cCI6MTY4MDYyNTA5N30.BDbu_mJXsECJnnRiOmf10fEniE8RZ0E_77lZYXL5X8Q";
    let token2 = encode(
      &Header::default(),
      &Claims {
        id: "9LmnqhLITzKskFO/lcXRqA".to_owned(),
        wx_usr_id: None,
        exp: 1680625097,
      },
      &encoding_key,
    ).unwrap();
    
    let _claims = decode::<Claims>(
      &token2,
      &decoding_key,
      &validation,
    ).unwrap().claims;
    
    // Claims { id: "9LmnqhLITzKskFO/lcXRqA", wx_usr_id: None, exp: 1680625097 }
    // println!("{:?}", claims);
  }
  
  #[test]
  fn test_get_password() {
    let str = get_password("a".into()).unwrap();
    assert!(str == "RoZMvtNCRmGuZCdQ2FoRdhfYFQ0GBNu/JDaKdRx5o7A");
  }
  
  #[test]
  fn test_get_auth_model_by_token() {
    let test_authorization = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjlMbW5xaExJVHpLc2tGTy9sY1hScUEiLCJkZXB0X2lkIjoiUi9WSFcwa3pSeEs5dEc4bUlITWRiUSIsImxhbmciOiJ6aC1jbiIsImV4cCI6MTY4MTAwMDE5OX0.V3LQksf-D50OzvlFO5r-xZ-FwFxah-tSvJ0abN6Vl0E";
    let _auth_model = get_auth_model_by_token(test_authorization);
    // println!("{:?}", auth_model);
  }
  
}
