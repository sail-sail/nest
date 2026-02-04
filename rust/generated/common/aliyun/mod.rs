mod aliyun_model;

use core::str;
use std::collections::{BTreeMap, HashMap};
use std::time::{SystemTime, SystemTimeError};
use chrono::DateTime;
use hmac::{Hmac, Mac};
use percent_encoding::{NON_ALPHANUMERIC, utf8_percent_encode};
use rand::Rng;
use serde_json::{json, Value}; 
use std::borrow::Cow;  
use reqwest::{
  Client,
  header::{HeaderMap, HeaderValue}, Method, Response, StatusCode,
};
use sha2::{Digest, Sha256};
use base64::engine::general_purpose::STANDARD;
use base64::Engine;

use color_eyre::eyre::{Result, eyre};

// 生成 x-acs-date
pub fn current_timestamp() -> Result<u64, SystemTimeError> {
  Ok(SystemTime::now()
    .duration_since(SystemTime::UNIX_EPOCH)?
    .as_secs())
}
// URL编码处理
pub fn percent_code(encode_str: &str) -> Cow<'_, str> {
  let encoded = utf8_percent_encode(encode_str, NON_ALPHANUMERIC)
    .to_string()
    .replace("+", "20%")
    .replace("%5F", "_")
    .replace("%2D", "-")
    .replace("%2E", ".")
    .replace("%7E", "~");
    
  Cow::Owned(encoded) // 返回一个 Cow<str> 可以持有 String 或 &str
}

// /// 平铺参数
// fn flatten_target_ops(
//   targets: Vec<HashMap<&str, &str>>,
//   base_key: &str,
// ) -> Vec<(&'static str, &'static str)> {
//   let mut result = Vec::new();

//   for (idx, item) in targets.iter().enumerate() {
//     let prefix = format!("{}.{}", base_key, idx + 1);

//     for (&k, &v) in item {
//       let key = format!("{}.{}", prefix, k);
//       let key_static: &'static str = Box::leak(key.into_boxed_str());
//       let value_static: &'static str = Box::leak(v.to_string().into_boxed_str());

//       result.push((key_static, value_static));
//     }
//   }

//   result
// }

/// 计算SHA256哈希
pub fn sha256_hex(message: &str) -> String {
  let mut hasher = Sha256::new();
  hasher.update(message);
  format!("{:x}", hasher.finalize()).to_lowercase()
}
// HMAC SHA256
pub fn hmac256(key: &[u8], message: &str) -> Result<Vec<u8>> {
  let mut mac = Hmac::<Sha256>::new_from_slice(key)?;
  mac.update(message.as_bytes());
  let signature = mac.finalize();
  Ok(signature.into_bytes().to_vec())
}
// 生成签名唯一随机数
pub fn generate_random_string(length: usize) -> String {
  const CHARSET: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  let mut rng = rand::rng();
  (0..length)
    .map(|_| CHARSET[rng.random_range(0..CHARSET.len())] as char)
    .collect()
}
pub fn generate_nonce() -> String {
  generate_random_string(32)
}
// 构建规范化查询参数（编码后）
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
pub async fn read_response(result: Response) -> Result<(StatusCode, String)> {
  let status = result.status();
  let data = result.bytes().await?;
  let res = str::from_utf8(&data)?.to_string();
  Ok((status, res))
}
// 定义 FormData 类型数据的value类型
#[derive(Debug, Clone)]
pub enum FormValue {
  String(String),
  Vec(Vec<String>),
  HashMap(HashMap<String, String>),
}
// 定义一个body请求体枚举，用于统一处理请求体类型,包含Json/Binary/FormData类型 
pub enum RequestBody {
  Json(HashMap<String, Value>), // Json
  Binary(Vec<u8>), // Binary
  FormData(HashMap<String, FormValue>), //  FormData 
  None,
}
// 规范化请求
#[allow(clippy::too_many_arguments)]
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

  // 根据 body 类型处理请求体内容,将处理后的存储在 body_content 变量中。
  let body_content = match &body { 
    RequestBody::Json(body_map) => json!(body_map).to_string(),  
    RequestBody::Binary(binary_data) => {
      STANDARD.encode(binary_data)
    },
    RequestBody::FormData(form_data) => {
      let params: Vec<String> = form_data
      .iter()
      .flat_map(|(k, v)| {
        match v {
          FormValue::String(s) => {
            vec![format!("{}={}", percent_code(k), percent_code(s))]
          },
          FormValue::Vec(vec) => {
            vec.iter()
              .map(|s| format!("{}={}", percent_code(k), percent_code(s)))
              .collect::<Vec<_>>()
          },
          FormValue::HashMap(map) => {
            map.iter()
              .map(|(sk, sv)| format!("{}={}", percent_code(sk), percent_code(sv)))
              .collect::<Vec<_>>()
          },
        }
      })
      .collect();
      params.join("&") 
    },
    RequestBody::None => String::new(),
  };
  
  // 计算 请求体body的x-acs-content-sha256 ；准备x-acs-date； x-acs-signature-nonce；待签名请求头
  let hashed_request_payload = if body_content.is_empty() {
    sha256_hex("") 
  } else {
    sha256_hex(&body_content) 
  };
  // x-acs-date
  let now_time = current_timestamp()?;
  let datetime = DateTime::from_timestamp(now_time as i64, 0)
    .ok_or(eyre!("Failed to convert timestamp to DateTime"))?;
  let datetime_str = datetime.format("%Y-%m-%dT%H:%M:%SZ").to_string();
  // x-acs-signature-nonce
  let signature_nonce = generate_nonce();
  println!("Signature Nonce: {}", signature_nonce);
  // 待签名请求头
  let sign_header_arr = &[
    "host",
    "x-acs-action",
    "x-acs-content-sha256",
    "x-acs-date",
    "x-acs-signature-nonce",
    "x-acs-version",
  ];
  let sign_headers = sign_header_arr.join(";");
  // 1.构造规范化请求头
  let mut headers = HeaderMap::new();
  headers.insert("Host", HeaderValue::from_str(host)?);
  headers.insert("x-acs-action", HeaderValue::from_str(action)?);
  headers.insert("x-acs-version", HeaderValue::from_str(version)?);
  headers.insert("x-acs-date", HeaderValue::from_str(&datetime_str)?);
  headers.insert("x-acs-signature-nonce", HeaderValue::from_str(&signature_nonce)?);
  headers.insert("x-acs-content-sha256", HeaderValue::from_str(&hashed_request_payload)?);
  // 2.构造待签名请求头
  let canonical_query_string = build_sored_encoded_query_string(query_params); // 参数编码拼接处理
  // println!("CanonicalQueryString: {}", canonical_query_string);
  let canonical_request = format!(
    "{}\n{}\n{}\n{}\n\n{}\n{}",
    method.as_str(),
    canonical_uri,
    canonical_query_string,
    sign_header_arr.iter().map(|&header| format!("{}:{}", header, headers[header].to_str().unwrap())).collect::<Vec<_>>().join("\n"),
    sign_headers,
    hashed_request_payload
  );
  // println!("Canonical Request: {}", canonical_request);
  // 3.计算待签名请求头的 SHA-256 哈希;
  let result = sha256_hex(&canonical_request);
  // 4.构建待签名字符串
  let string_to_sign = format!("ACS3-HMAC-SHA256\n{}", result);
  // 5.计算签名
  let signature = hmac256(access_key_secret.as_bytes(), &string_to_sign)?;
  let data_sign = hex::encode(&signature);
  let auth_data = format!(
    "ACS3-HMAC-SHA256 Credential={},SignedHeaders={},Signature={}",
    access_key_id, sign_headers, data_sign
  );
  // 6.构建 Authorization
  headers.insert("Authorization", HeaderValue::from_str(&auth_data)?);
  // 构造 url 拼接请求参数
  let url: String = if !query_params.is_empty() {
    format!("https://{}{}?{}", host, canonical_uri,canonical_query_string)
  } else {
    format!("https://{}{}", host, canonical_uri)
  };
  // 调用发送请求
  let response = send_request(
    &client,
    method,
    &url,
    headers,
    &body,            
    &body_content,        
  ) 
  .await?;
  
  // 读取响应
  let (_, res) = read_response(response).await?;
  Ok(res)
}

/// 发送请求
async fn send_request(
  client: &Client,
  method: Method,
  url: &str,
  headers: HeaderMap,
  body: &RequestBody,        // 用此判断 body 数据类型
  body_content: &str,        // body 不为空时 接收 body 请求参数 FormData/Json/Binary
) -> Result<Response> {
  let mut request_builder = client.request(method.clone(), url);
  // 添加请求头 headers
  for (k, v) in headers.iter() {
    request_builder = request_builder.header(k, v.clone());
  }
   // 添加请求体 body
   match body {
    RequestBody::Binary(_) => {
      request_builder = request_builder.header("Content-Type", "application/octet-stream");
      request_builder = request_builder.body(body_content.to_string()); // 移动这里的值
    }
    RequestBody::Json(_) => {
      // 如果body为map，且不为空，转化为Json后存储在 body_content 变量中，设置  application/json; charset=utf-8
      if !body_content.is_empty() { 
        request_builder = request_builder.body(body_content.to_string());
        request_builder = request_builder.header("Content-Type", "application/json; charset=utf-8");
      }
    }
    RequestBody::FormData(_) => {
      // 处理 form-data 类型，设置 content-type
      if !body_content.is_empty() { 
      request_builder = request_builder.header("Content-Type", "application/x-www-form-urlencoded");
      request_builder = request_builder.body(body_content.to_string());
      }
    }
    RequestBody::None => {
      request_builder = request_builder.body(String::new());
    }
  }
  // 构建请求
  let request = request_builder
    .build()?;
  // 发起请求
  let response = client
    .execute(request).await?;
  // 返回结果
  Ok(response)
}


 /**
 * 
 * 签名示例，您需要根据实际情况替换main方法中的示例参数。
 * <p>
 * 通过API元数据获取请求方法（methods）、请求参数名称（name）、请求参数类型（type）、请求参数位置（in）。
 * 1. 请求参数在元数据中显示"in":"query"，通过query_params传参。注：RPC接口该类型参数也支持通过body传参，content-type为application/x-www-form-urlencoded，参见示例三。
 * 2. 请求参数在元数据中显示"in": "body"，通过body传参，MIME类型为application/octet-stream、application/json。RPC接口不建议使用application/json，可使用示例三替代。
 * 2. 请求参数在元数据中显示"in": "formData"，通过body传参，，MIME类型为application/x-www-form-urlencoded。
 * 
 * https://api.aliyun.com/document/Dysmsapi/2018-05-01/SendMessageWithTemplate?spm=5176.25163407.overview-index-9c3d4_4cfbe_0.17.6b0a2ec8NWIVc6
 */
#[tokio::test]
#[allow(unused_mut)]
async fn test_aliyun_sign() -> Result<()> {
  // dotenv::from_path("D:/hugjs/nest/rust/.env").ok();
  // 创建 HTTP 客户端
  let client = crate::common::util::http::client().clone();
  // env::var()表示通过环境变量获取Access Key ID和Access Key Secret
  // let access_key_id = std::env::var("ALIBABA_CLOUD_ACCESS_KEY_ID").expect("ALIBABA_CLOUD_ACCESS_KEY_ID not set");
  // let access_key_secret = std::env::var("ALIBABA_CLOUD_ACCESS_KEY_SECRET").expect("ALIBABA_CLOUD_ACCESS_KEY_SECRET not set");
  
  let access_key_id = "".to_string();
  let access_key_secret = "".to_string();
  
  let access_key_id: &str = &access_key_id;
  let access_key_secret: &str = &access_key_secret;
  
  // RPC接口请求示例一：请求参数"in":"query"   POST
  let method = Method::POST; // 请求方法
  let host = "dysmsapi.aliyuncs.com"; // endpoint
  let canonical_uri = "/"; // RPC接口无资源路径，故使用正斜杠（/）作为CanonicalURI
  let action = "SendSms"; // API名称
  let version = "2017-05-25"; // API版本号
  
  let mut query: Vec<(String, String)> = Vec::new();
  
  /*
  {
    "PhoneNumbers":"18122120953"
    "SignName":"广东南洋长胜酒店有限公司"
    "TemplateCode":"SMS_501720244"
    "TemplateParam":{
      "code":"1234"
      "room_type_id_lbl":"1234"
      "check_in_date":"1234"
      "check_out_date":"1234"
    }
  }
  */
  query.push( ("PhoneNumbers".to_string(), "18122120953".to_string()) );
  query.push( ("SignName".to_string(), "广东南洋长胜酒店有限公司".to_string()) );
  query.push( ("TemplateCode".to_string(), "SMS_501720244".to_string()) );
  let template_param = json!({
    "code":"1234",
    "room_type_id_lbl":"测试房型",
    "check_in_date":"2022-12-01",
    "check_out_date":"2022-12-02"
  });
  query.push( ("TemplateParam".to_string(), template_param.to_string()) );
  
  // query 参数
  let query_params: Vec<(&str, &str)> = query
    .iter()
    .map(|(k, v)| (k.as_str(), v.as_str()))
    .collect::<Vec<(&str, &str)>>();
  
  // 请求体 body 为空时
  let body = RequestBody::None;
  
  // 发起请求
  let res = call_api(
    client,
    method,                          // API请求方式 POST/GET/DELETE                
    host,                          // API服务地址
    canonical_uri,                       // API资源路径
    &query_params,                      // "in":"query" 查询参数
    action,                          // API名称
    version,                         // API版本号
    body,                          // "in":"body" 请求体参数 支持Json/FormData/Binary类型
    access_key_id,                       
    access_key_secret,
  ).await?;
  
  println!("Response: {}", res);
  
  let response: aliyun_model::SendSmsResponse = serde_json::from_str(&res)?;
  println!("Parsed Response: {:?}", response);
  
  Ok(())
}
