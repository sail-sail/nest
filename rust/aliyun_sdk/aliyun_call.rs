use core::str;
use std::borrow::Cow;
use std::collections::{BTreeMap, HashMap};
use std::time::{SystemTime, SystemTimeError};

use base64::Engine;
use base64::engine::general_purpose::STANDARD;
use chrono::DateTime;
use color_eyre::eyre::{Result, eyre};
use hmac::{Hmac, KeyInit, Mac};
use percent_encoding::{NON_ALPHANUMERIC, utf8_percent_encode};
use rand::RngExt;
use reqwest::{
  Client,
  Method,
  Response,
  StatusCode,
  header::{HeaderMap, HeaderValue},
};
use serde_json::{Value, json};
use sha2::{Digest, Sha256};

// 生成 x-acs-date
#[allow(dead_code)]
pub fn current_timestamp() -> Result<u64, SystemTimeError> {
  Ok(SystemTime::now()
    .duration_since(SystemTime::UNIX_EPOCH)?
    .as_secs())
}

// URL编码处理
#[allow(dead_code)]
pub fn percent_code(encode_str: &str) -> Cow<'_, str> {
  let encoded = utf8_percent_encode(encode_str, NON_ALPHANUMERIC)
    .to_string()
    .replace("+", "20%")
    .replace("%5F", "_")
    .replace("%2D", "-")
    .replace("%2E", ".")
    .replace("%7E", "~");

  Cow::Owned(encoded)
}

/// 计算SHA256哈希
#[allow(dead_code)]
pub fn sha256_hex(message: &str) -> String {
  let mut hasher = Sha256::new();
  hasher.update(message);
  hex::encode(hasher.finalize())
}

// HMAC SHA256
#[allow(dead_code)]
pub fn hmac256(key: &[u8], message: &str) -> Result<Vec<u8>> {
  let mut mac = Hmac::<Sha256>::new_from_slice(key)?;
  mac.update(message.as_bytes());
  let signature = mac.finalize();
  Ok(signature.into_bytes().to_vec())
}

// 生成签名唯一随机数
#[allow(dead_code)]
pub fn generate_random_string(length: usize) -> String {
  const CHARSET: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  let mut rng = rand::rng();
  (0..length)
    .map(|_| CHARSET[rng.random_range(0..CHARSET.len())] as char)
    .collect()
}

#[allow(dead_code)]
pub fn generate_nonce() -> String {
  generate_random_string(32)
}

// 构建规范化查询参数（编码后）
#[allow(dead_code)]
pub fn build_sored_encoded_query_string(query_params: &[(&str, &str)]) -> String {
  let sorted_query_params: BTreeMap<_, _> = query_params.iter().copied().collect();
  let encoded_params: Vec<String> = sorted_query_params
    .into_iter()
    .map(|(k, v)| {
      let encoded_key = percent_code(k);
      let encoded_value = percent_code(v);
      format!("{}={}", encoded_key, encoded_value)
    })
    .collect();
  encoded_params.join("&")
}

// 读取响应
#[allow(dead_code)]
pub async fn read_response(result: Response) -> Result<(StatusCode, String)> {
  let status = result.status();
  let data = result.bytes().await?;
  let res = str::from_utf8(&data)?.to_string();
  Ok((status, res))
}

// 定义 FormData 类型数据的value类型
#[derive(Debug, Clone)]
#[allow(dead_code)]
pub enum FormValue {
  String(String),
  Vec(Vec<String>),
  HashMap(HashMap<String, String>),
}

// 定义一个body请求体枚举，用于统一处理请求体类型,包含Json/Binary/FormData类型
#[allow(dead_code)]
pub enum RequestBody {
  Json(HashMap<String, Value>),
  Binary(Vec<u8>),
  FormData(HashMap<String, FormValue>),
  None,
}

// 规范化请求
#[allow(clippy::too_many_arguments, dead_code)]
pub async fn call_api(
  client: Client,
  method: Method,
  host: &str,
  canonical_uri: &str,
  query_params: &[(&str, &str)],
  action: &str,
  version: &str,
  body: RequestBody,
  access_key_id: &str,
  access_key_secret: &str,
) -> Result<String> {
  let body_content = match &body {
    RequestBody::Json(body_map) => json!(body_map).to_string(),
    RequestBody::Binary(binary_data) => STANDARD.encode(binary_data),
    RequestBody::FormData(form_data) => {
      let params: Vec<String> = form_data
        .iter()
        .flat_map(|(k, v)| match v {
          FormValue::String(s) => {
            vec![format!("{}={}", percent_code(k), percent_code(s))]
          }
          FormValue::Vec(vec) => vec
            .iter()
            .map(|s| format!("{}={}", percent_code(k), percent_code(s)))
            .collect::<Vec<_>>(),
          FormValue::HashMap(map) => map
            .iter()
            .map(|(sk, sv)| format!("{}={}", percent_code(sk), percent_code(sv)))
            .collect::<Vec<_>>(),
        })
        .collect();
      params.join("&")
    }
    RequestBody::None => String::new(),
  };

  let hashed_request_payload = if body_content.is_empty() {
    sha256_hex("")
  } else {
    sha256_hex(&body_content)
  };

  let now_time = current_timestamp()?;
  let datetime = DateTime::from_timestamp(now_time as i64, 0)
    .ok_or(eyre!("Failed to convert timestamp to DateTime"))?;
  let datetime_str = datetime.format("%Y-%m-%dT%H:%M:%SZ").to_string();
  let signature_nonce = generate_nonce();
  let sign_header_arr = &[
    "host",
    "x-acs-action",
    "x-acs-content-sha256",
    "x-acs-date",
    "x-acs-signature-nonce",
    "x-acs-version",
  ];
  let sign_headers = sign_header_arr.join(";");

  let mut headers = HeaderMap::new();
  headers.insert("Host", HeaderValue::from_str(host)?);
  headers.insert("x-acs-action", HeaderValue::from_str(action)?);
  headers.insert("x-acs-version", HeaderValue::from_str(version)?);
  headers.insert("x-acs-date", HeaderValue::from_str(&datetime_str)?);
  headers.insert("x-acs-signature-nonce", HeaderValue::from_str(&signature_nonce)?);
  headers.insert("x-acs-content-sha256", HeaderValue::from_str(&hashed_request_payload)?);

  let canonical_query_string = build_sored_encoded_query_string(query_params);
  let canonical_request = format!(
    "{}\n{}\n{}\n{}\n\n{}\n{}",
    method.as_str(),
    canonical_uri,
    canonical_query_string,
    sign_header_arr
      .iter()
      .map(|&header| format!("{}:{}", header, headers[header].to_str().unwrap()))
      .collect::<Vec<_>>()
      .join("\n"),
    sign_headers,
    hashed_request_payload
  );
  let result = sha256_hex(&canonical_request);
  let string_to_sign = format!("ACS3-HMAC-SHA256\n{}", result);
  let signature = hmac256(access_key_secret.as_bytes(), &string_to_sign)?;
  let data_sign = hex::encode(&signature);
  let auth_data = format!(
    "ACS3-HMAC-SHA256 Credential={},SignedHeaders={},Signature={}",
    access_key_id,
    sign_headers,
    data_sign
  );
  headers.insert("Authorization", HeaderValue::from_str(&auth_data)?);

  let url: String = if !query_params.is_empty() {
    format!("https://{}{}?{}", host, canonical_uri, canonical_query_string)
  } else {
    format!("https://{}{}", host, canonical_uri)
  };

  let response = send_request(
    &client,
    method,
    &url,
    headers,
    &body,
    &body_content,
  ).await?;

  let (_, res) = read_response(response).await?;
  Ok(res)
}

/// 发送请求
#[allow(dead_code)]
async fn send_request(
  client: &Client,
  method: Method,
  url: &str,
  headers: HeaderMap,
  body: &RequestBody,
  body_content: &str,
) -> Result<Response> {
  let mut request_builder = client.request(method.clone(), url);

  for (k, v) in headers.iter() {
    request_builder = request_builder.header(k, v.clone());
  }

  match body {
    RequestBody::Binary(_) => {
      request_builder = request_builder.header("Content-Type", "application/octet-stream");
      request_builder = request_builder.body(body_content.to_string());
    }
    RequestBody::Json(_) => {
      if !body_content.is_empty() {
        request_builder = request_builder.body(body_content.to_string());
        request_builder = request_builder.header("Content-Type", "application/json; charset=utf-8");
      }
    }
    RequestBody::FormData(_) => {
      if !body_content.is_empty() {
        request_builder = request_builder.header("Content-Type", "application/x-www-form-urlencoded");
        request_builder = request_builder.body(body_content.to_string());
      }
    }
    RequestBody::None => {
      request_builder = request_builder.body(String::new());
    }
  }

  let request = request_builder.build()?;
  let response = client.execute(request).await?;
  Ok(response)
}

#[cfg(test)]
#[tokio::test]
#[ignore = "requires aliyun credentials"]
#[allow(unused_mut)]
async fn test_aliyun_sign() -> Result<()> {
  use crate::aliyun_model::SendSmsResponse;

  let access_key_id = match std::env::var("aliyun_access_key_id") {
    Ok(value) => value,
    Err(_) => return Ok(()),
  };
  let access_key_secret = match std::env::var("aliyun_access_key_secret") {
    Ok(value) => value,
    Err(_) => return Ok(()),
  };

  let client = crate::http::client().clone();
  let method = Method::POST;
  let host = "dysmsapi.aliyuncs.com";
  let canonical_uri = "/";
  let action = "SendSms";
  let version = "2017-05-25";

  let mut query: Vec<(String, String)> = Vec::new();
  query.push(("PhoneNumbers".to_string(), "18122120953".to_string()));
  query.push(("SignName".to_string(), "广东南洋长胜酒店有限公司".to_string()));
  query.push(("TemplateCode".to_string(), "SMS_501720244".to_string()));
  let template_param = json!({
    "code": "1234",
    "room_type_id_lbl": "测试房型",
    "check_in_date": "2022-12-01",
    "check_out_date": "2022-12-02"
  });
  query.push(("TemplateParam".to_string(), template_param.to_string()));

  let query_params: Vec<(&str, &str)> = query
    .iter()
    .map(|(k, v)| (k.as_str(), v.as_str()))
    .collect::<Vec<(&str, &str)>>();

  let res = call_api(
    client,
    method,
    host,
    canonical_uri,
    &query_params,
    action,
    version,
    RequestBody::None,
    &access_key_id,
    &access_key_secret,
  ).await?;

  let response: SendSmsResponse = serde_json::from_str(&res)?;
  println!("Parsed Response: {:?}", response);

  Ok(())
}