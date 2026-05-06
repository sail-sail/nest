use color_eyre::eyre::{Result, eyre};
use reqwest::Method;
use tracing::{error, info};

use super::aliyun_call::{
  RequestBody,
  call_api,
};
use super::aliyun_model::SendSmsResponse;

/// 发送短信
///
/// # 参数
/// - `phone_numbers`: 手机号码
/// - `sign_name`: 短信签名
/// - `template_code`: 短信模板编码
/// - `template_param`: 短信模板参数 (JSON 对象)
///
/// # 返回
/// - `SendSmsResponse`: 阿里云短信发送响应
#[allow(dead_code)]
pub async fn send_sms(
  phone_numbers: &str,
  sign_name: &str,
  template_code: &str,
  template_param: serde_json::Value,
) -> Result<SendSmsResponse> {
  let access_key_id = std::env::var("aliyun_access_key_id")
    .map_err(|_| eyre!("aliyun_access_key_id not set"))?;

  let access_key_secret = std::env::var("aliyun_access_key_secret")
    .map_err(|_| eyre!("aliyun_access_key_secret not set"))?;

  let client = crate::http::client().clone();

  let host = "dysmsapi.aliyuncs.com";
  let canonical_uri = "/";
  let action = "SendSms";
  let version = "2017-05-25";

  let template_param = template_param.to_string();

  let query: Vec<(&str, &str)> = vec![
    ("PhoneNumbers", phone_numbers),
    ("SignName", sign_name),
    ("TemplateCode", template_code),
    ("TemplateParam", template_param.as_str()),
  ];

  let res = call_api(
    client,
    Method::POST,
    host,
    canonical_uri,
    &query,
    action,
    version,
    RequestBody::None,
    &access_key_id,
    &access_key_secret,
  ).await?;

  info!("{res}");

  let response: SendSmsResponse = serde_json::from_str(&res)?;
  let code = response.code.as_deref().unwrap_or_default();

  if code != "OK" {
    error!("Failed to send SMS: {response:?}");
    return Err(eyre!(
      "发送短信失败: {}",
      response.message.as_deref().unwrap_or_default()
    ));
  }

  Ok(response)
}