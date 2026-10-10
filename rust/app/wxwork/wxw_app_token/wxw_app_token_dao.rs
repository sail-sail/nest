use serde::{Serialize, Deserialize};
use tracing::{info, error};

use color_eyre::eyre::{Result, eyre};
use chrono::{Local, NaiveDate, NaiveDateTime, TimeZone};

use sha1::{Sha1, Digest};

use generated::common::context::{
  Options,
  get_req_id,
  get_now,
};

use generated::base::usr::usr_dao::find_by_id_ok_usr;
use generated::base::usr::usr_model::UsrId;
use generated::common::oss::oss_dao::{
  get_object as get_oss_object,
  head_object as head_oss_object,
};
use generated::wxwork::wxw_app::wxw_app_model::WxwAppId;
use generated::wxwork::wxw_app_token::wxw_app_token_dao::{
  find_one_wxw_app_token,
  create_wxw_app_token,
  update_by_id_wxw_app_token,
  validate_option_wxw_app_token,
};
use generated::wxwork::wxw_app_token::wxw_app_token_model::{
  WxwAppTokenInput,
  WxwAppTokenSearch,
};

use generated::wxwork::wxw_app::wxw_app_dao::{
  find_by_id_wxw_app,
  validate_option_wxw_app,
  validate_is_enabled_wxw_app,
};
use generated::wxwork::wxw_usr::wxw_usr_dao::find_one_ok_wxw_usr;
use generated::wxwork::wxw_usr::wxw_usr_model::WxwUsrSearch;

use super::wxw_app_token_model::{
  GetuserRes,
  GetuserDetailRes,
  GetJsapiTicketRes,
  GetuserinfoModel,
  TemplateControl,
  TemplateName,
  GetTemplateDetailRes,
  SubmitApprovalApplyContent,
  SubmitApprovalApplyData,
  SubmitApprovalApplyReq,
  SubmitApprovalApplyRes,
  SubmitApprovalApplySummary,
  SubmitApprovalSummaryInfo,
  WxwGetConfigSignature,
};

#[derive(Serialize, Deserialize)]
struct GetuserinfoRes {
  errcode: i32,
  #[serde(default)]
  errmsg: String,
  #[serde(default)]
  userid: String,
  #[serde(default)]
  user_ticket: String,
}

#[derive(Serialize, Deserialize, Default)]
struct GetuseridlistRes {
  errcode: i32,
  #[serde(default)]
  errmsg: String,
  #[serde(default)]
  dept_user: Vec<Userlist>,
}
#[derive(Serialize, Deserialize)]
struct Userlist {
  #[serde(default)]
  userid: String,
  // #[serde(default)]
  // department: i32,
}

#[allow(dead_code)]
#[derive(Debug, Clone, Deserialize, Default)]
struct UploadMediaRes {
  errcode: i32,
  #[serde(default)]
  errmsg: String,
  #[serde(default)]
  r#type: String,
  #[serde(default)]
  media_id: String,
  #[serde(default)]
  created_at: String,
}

#[derive(Debug, Clone, Deserialize, Default)]
struct TemplateDateConfigWrapper {
  #[serde(default)]
  date: TemplateDateConfig,
}

#[derive(Debug, Clone, Deserialize, Default)]
struct TemplateDateConfig {
  #[serde(default)]
  r#type: String,
}

#[derive(Debug, Clone, Deserialize, Default)]
struct TemplateSelectorConfigWrapper {
  #[serde(default)]
  selector: TemplateSelectorConfig,
}

#[derive(Debug, Clone, Deserialize, Default)]
struct TemplateSelectorConfig {
  #[serde(default)]
  r#type: String,
  #[serde(default)]
  options: Vec<TemplateSelectorOption>,
}

#[derive(Debug, Clone, Deserialize, Default)]
struct TemplateSelectorOption {
  #[serde(default)]
  key: String,
  #[serde(default)]
  value: Vec<TemplateName>,
}

#[derive(Debug, Clone, Deserialize, Default)]
struct TemplateTableConfigWrapper {
  #[serde(default)]
  table: TemplateTableConfig,
}

#[derive(Debug, Clone, Deserialize, Default)]
struct TemplateTableConfig {
  #[serde(default)]
  children: Vec<TemplateControl>,
}

#[cfg(test)]
mod tests {
  use super::{
    should_retry_submit_approval_apply,
    validate_submit_approval_apply_req,
  };
  use crate::wxwork::wxw_app_token::wxw_app_token_model::{
    SubmitApprovalApplyContent,
    SubmitApprovalApplyData,
    SubmitApprovalApplyReq,
    SubmitApprovalApplyRes,
    SubmitApprovalApplySummary,
    SubmitApprovalNode,
    SubmitApprovalProcess,
    SubmitApprovalSummaryInfo,
  };

  #[test]
  fn submit_approval_apply_payload_serializes_expected_fields() {
    let req = SubmitApprovalApplyReq {
      creator_userid: "WangXiaoMing".into(),
      template_id: "template-1".into(),
      use_template_approver: 0,
      choose_department: 2,
      apply_data: SubmitApprovalApplyData {
        contents: vec![SubmitApprovalApplyContent {
          control: "Text".into(),
          id: "Text-1".into(),
          value: serde_json::json!({ "text": "文本填写的内容" }),
        }],
      },
      summary_list: vec![SubmitApprovalApplySummary {
        summary_info: vec![SubmitApprovalSummaryInfo {
          text: "摘要第1行".into(),
          lang: "zh_CN".into(),
        }],
      }],
      process: Some(SubmitApprovalProcess {
        node_list: vec![SubmitApprovalNode {
          r#type: 1,
          apv_rel: Some(1),
          userid: vec!["abc".into()],
        }],
      }),
    };

    let json = serde_json::to_value(&req).unwrap();
    assert_eq!(json["creator_userid"], "WangXiaoMing");
    assert_eq!(json["template_id"], "template-1");
    assert_eq!(json["apply_data"]["contents"][0]["control"], "Text");

    let res = SubmitApprovalApplyRes {
      errcode: 0,
      errmsg: "ok".into(),
      sp_no: "202001010001".into(),
    };
    let json = serde_json::to_value(&res).unwrap();
    assert_eq!(json["sp_no"], "202001010001");
  }

  #[test]
  fn submit_approval_apply_retries_on_expired_access_token() {
    assert!(should_retry_submit_approval_apply(42001));
    assert!(!should_retry_submit_approval_apply(0));
  }

  #[test]
  fn submit_approval_apply_requires_process_when_not_using_template_approver() {
    let req = SubmitApprovalApplyReq {
      creator_userid: "WangXiaoMing".into(),
      template_id: "template-1".into(),
      use_template_approver: 0,
      choose_department: 2,
      apply_data: SubmitApprovalApplyData {
        contents: vec![SubmitApprovalApplyContent {
          control: "Text".into(),
          id: "Text-1".into(),
          value: serde_json::json!({ "text": "文本填写的内容" }),
        }],
      },
      summary_list: vec![SubmitApprovalApplySummary {
        summary_info: vec![SubmitApprovalSummaryInfo {
          text: "摘要第1行".into(),
          lang: "zh_CN".into(),
        }],
      }],
      process: None,
    };

    assert!(validate_submit_approval_apply_req(&req).is_err());
  }

  #[test]
  fn submit_approval_apply_allows_template_process_to_be_omitted() {
    let req = SubmitApprovalApplyReq {
      creator_userid: "WangXiaoMing".into(),
      template_id: "template-1".into(),
      use_template_approver: 1,
      choose_department: 2,
      apply_data: SubmitApprovalApplyData {
        contents: vec![SubmitApprovalApplyContent {
          control: "Text".into(),
          id: "Text-1".into(),
          value: serde_json::json!({ "text": "文本填写的内容" }),
        }],
      },
      summary_list: vec![SubmitApprovalApplySummary {
        summary_info: vec![SubmitApprovalSummaryInfo {
          text: "摘要第1行".into(),
          lang: "zh_CN".into(),
        }],
      }],
      process: None,
    };

    assert!(validate_submit_approval_apply_req(&req).is_ok());
  }

  #[test]
  fn gettemplatedetail_deserializes_wecom_example_response() {
    let sample = r#"{
      "errcode": 0,
      "errmsg": "ok",
      "template_names": [{"text": "CRM费用报销单", "lang": "zh_CN"}],
      "template_content": {
        "controls": [{
          "property": {
            "control": "Text",
            "id": "Text-1787702887300",
            "title": [{"text": "客户名称", "lang": "zh_CN"}],
            "placeholder": [{"text": "", "lang": "zh_CN"}],
            "require": 0,
            "un_print": 0,
            "inner_id": "",
            "un_replace": 0,
            "display": 1
          }
        }]
      }
    }"#;

    let value: crate::wxwork::wxw_app_token::wxw_app_token_model::GetTemplateDetailRes =
      serde_json::from_str(sample).unwrap();
    assert_eq!(value.errcode, 0);
    assert_eq!(value.template_names[0].text, "CRM费用报销单");
    assert_eq!(value.template_content.controls[0].property.id, "Text-1787702887300");
  }

  #[test]
  fn upload_media_response_deserializes_expected_fields() {
    let sample = r#"{
      "errcode": 0,
      "errmsg": "",
      "type": "file",
      "media_id": "1G6nrLmr5EC3MMb_-zK1dDdzmd0p7cNliYu9V5w7o8K0",
      "created_at": "1380000000"
    }"#;

    let value: super::UploadMediaRes = serde_json::from_str(sample).unwrap();
    assert_eq!(value.errcode, 0);
    assert_eq!(value.r#type, "file");
    assert_eq!(value.media_id, "1G6nrLmr5EC3MMb_-zK1dDdzmd0p7cNliYu9V5w7o8K0");
  }
}

fn should_retry_submit_approval_apply(errcode: i32) -> bool {
  errcode == 42001
}

fn get_template_text(items: &[TemplateName]) -> String {
  items
    .iter()
    .find(|item| item.lang == "zh_CN" && !item.text.is_empty())
    .or_else(|| items.iter().find(|item| !item.text.is_empty()))
    .map(|item| item.text.clone())
    .unwrap_or_default()
}

fn get_control_title(control: &TemplateControl) -> String {
  get_template_text(&control.property.title)
}

fn is_empty_json_value(value: &serde_json::Value) -> bool {
  match value {
    serde_json::Value::Null => true,
    serde_json::Value::String(text) => text.trim().is_empty(),
    serde_json::Value::Array(items) => items.is_empty(),
    serde_json::Value::Object(items) => items.is_empty(),
    _ => false,
  }
}

fn json_scalar_to_string(value: &serde_json::Value, title: &str) -> Result<String> {
  match value {
    serde_json::Value::Null => Ok(String::new()),
    serde_json::Value::String(text) => Ok(text.clone()),
    serde_json::Value::Number(number) => Ok(number.to_string()),
    serde_json::Value::Bool(boolean) => Ok(boolean.to_string()),
    _ => Err(eyre!("{title} 不是可直接转换的标量值")),
  }
}

fn parse_local_timestamp(text: &str) -> Option<i64> {
  let text = text.trim();
  if text.is_empty() {
    return None;
  }
  if text.chars().all(|item| item.is_ascii_digit()) {
    return text.parse::<i64>().ok();
  }
  let naive_datetime = [
    "%Y-%m-%d %H:%M:%S",
    "%Y-%m-%d %H:%M",
    "%Y/%m/%d %H:%M:%S",
    "%Y/%m/%d %H:%M",
  ]
    .iter()
    .find_map(|format| NaiveDateTime::parse_from_str(text, format).ok())
    .or_else(|| {
      ["%Y-%m-%d", "%Y/%m/%d"]
        .iter()
        .find_map(|format| {
          NaiveDate::parse_from_str(text, format)
            .ok()
            .and_then(|item| item.and_hms_opt(0, 0, 0))
        })
    });
  let naive_datetime = naive_datetime?;
  Some(
    Local
      .from_local_datetime(&naive_datetime)
      .single()
      .or_else(|| Local.from_local_datetime(&naive_datetime).earliest())
      .unwrap_or_else(|| Local.from_utc_datetime(&naive_datetime))
      .timestamp(),
  )
}

fn get_date_type(control: &TemplateControl) -> Result<String> {
  let config = control.config.clone().unwrap_or_default();
  let config: TemplateDateConfigWrapper = serde_json::from_value(config)
    .map_err(|err| eyre!("{} 日期控件配置解析失败: {err}", get_control_title(control)))?;
  Ok(match config.date.r#type.as_str() {
    "" => String::from("day"),
    item => item.to_string(),
  })
}

fn build_date_value(control: &TemplateControl, value: &serde_json::Value, title: &str) -> Result<serde_json::Value> {
  if let Some(item) = value
    .as_object()
    .and_then(|item| item.get("date"))
    .and_then(|item| item.as_object())
  {
    let date_type = item
      .get("type")
      .and_then(|item| item.as_str())
      .filter(|item| !item.is_empty())
      .map(String::from)
      .unwrap_or(get_date_type(control)?);
    let s_timestamp = item
      .get("s_timestamp")
      .ok_or_else(|| eyre!("{title} 缺少 date.s_timestamp"))?;
    return Ok(serde_json::json!({
      "date": {
        "type": date_type,
        "s_timestamp": json_scalar_to_string(s_timestamp, title)?,
      }
    }));
  }
  let text = json_scalar_to_string(value, title)?;
  let timestamp = parse_local_timestamp(&text)
    .ok_or_else(|| eyre!("{title} 无法解析为日期时间: {text}"))?;
  Ok(serde_json::json!({
    "date": {
      "type": get_date_type(control)?,
      "s_timestamp": timestamp.to_string(),
    }
  }))
}

fn get_selector_config(control: &TemplateControl) -> Result<TemplateSelectorConfig> {
  let config = control.config.clone().unwrap_or_default();
  let config: TemplateSelectorConfigWrapper = serde_json::from_value(config)
    .map_err(|err| eyre!("{} 选择控件配置解析失败: {err}", get_control_title(control)))?;
  Ok(config.selector)
}

fn get_selector_values(value: &serde_json::Value, title: &str) -> Result<Vec<String>> {
  match value {
    serde_json::Value::String(text) => Ok(vec![text.clone()]),
    serde_json::Value::Number(number) => Ok(vec![number.to_string()]),
    serde_json::Value::Array(items) => items
      .iter()
      .map(|item| json_scalar_to_string(item, title))
      .collect::<Result<Vec<_>>>(),
    _ => Err(eyre!("{title} 选择控件值格式不正确")),
  }
}

fn build_selector_value(control: &TemplateControl, value: &serde_json::Value, title: &str) -> Result<serde_json::Value> {
  if let Some(item) = value
    .as_object()
    .and_then(|item| item.get("selector"))
  {
    return Ok(serde_json::json!({ "selector": item.clone() }));
  }
  let config = get_selector_config(control)?;
  let selector_type = match config.r#type.as_str() {
    "" => "single",
    item => item,
  };
  let selected_values = get_selector_values(value, title)?;
  let options = selected_values
    .into_iter()
    .map(|selected| {
      config
        .options
        .iter()
        .find(|item| {
          item.key == selected || item.value.iter().any(|value| value.text == selected)
        })
        .map(|item| serde_json::json!({ "key": item.key.clone() }))
        .ok_or_else(|| eyre!("{title} 找不到选项: {selected}"))
    })
    .collect::<Result<Vec<_>>>()?;
  if selector_type == "single" && options.len() > 1 {
    return Err(eyre!("{title} 为单选控件，但传入了多个值"));
  }
  Ok(serde_json::json!({
    "selector": {
      "type": selector_type,
      "options": options,
    }
  }))
}

fn get_table_children(control: &TemplateControl) -> Result<Vec<TemplateControl>> {
  let config = control.config.clone().unwrap_or_default();
  let config: TemplateTableConfigWrapper = serde_json::from_value(config)
    .map_err(|err| eyre!("{} 明细控件配置解析失败: {err}", get_control_title(control)))?;
  Ok(config.table.children)
}

fn get_prepared_file_items(
  value: &serde_json::Value,
  title: &str,
) -> Result<Option<Vec<serde_json::Value>>> {
  if is_empty_json_value(value) {
    return Ok(Some(vec![]));
  }
  if let Some(files) = value
    .as_object()
    .and_then(|item| item.get("files"))
    .and_then(|item| item.as_array())
  {
    let files = files
      .iter()
      .map(|item| {
        let file_id = item
          .as_object()
          .and_then(|item| item.get("file_id"))
          .and_then(|item| item.as_str())
          .unwrap_or_default();
        if file_id.is_empty() {
          return Err(eyre!("{title} 附件项缺少 file_id"));
        }
        Ok(item.clone())
      })
      .collect::<Result<Vec<_>>>()?;
    return Ok(Some(files));
  }
  if let Some(files) = value.as_array() {
    let mut prepared = Vec::with_capacity(files.len());
    for item in files {
      let Some(file_id) = item
        .as_object()
        .and_then(|item| item.get("file_id"))
        .and_then(|item| item.as_str())
      else {
        return Ok(None);
      };
      if file_id.is_empty() {
        return Err(eyre!("{title} 附件项缺少 file_id"));
      }
      prepared.push(item.clone());
    }
    return Ok(Some(prepared));
  }
  Ok(None)
}

fn parse_oss_file_ids(value: &serde_json::Value, title: &str) -> Result<Vec<String>> {
  let ids = match value {
    serde_json::Value::String(text) => text
      .split(',')
      .map(|item| item.trim())
      .filter(|item| !item.is_empty())
      .map(String::from)
      .collect::<Vec<_>>(),
    serde_json::Value::Array(items) => items
      .iter()
      .map(|item| json_scalar_to_string(item, title))
      .collect::<Result<Vec<_>>>()?
      .into_iter()
      .flat_map(|item| {
        item
          .split(',')
          .map(|part| part.trim().to_string())
          .collect::<Vec<_>>()
      })
      .filter(|item| !item.is_empty())
      .collect::<Vec<_>>(),
    _ => {
      return Err(eyre!(
        "{title} 附件控件仅支持逗号分隔的附件id字符串、附件id数组或预处理 files 结构"
      ));
    }
  };
  if ids.is_empty() {
    return Err(eyre!("{title} 未提供有效附件id"));
  }
  Ok(ids)
}

async fn upload_media_request(
  wxw_app_id: WxwAppId,
  media_type: &str,
  filename: &str,
  content_type: &str,
  content: Vec<u8>,
  force: bool,
) -> Result<UploadMediaRes> {
  let access_token = get_access_token(wxw_app_id, force.into()).await?;
  let url = format!(
    "https://qyapi.weixin.qq.com/cgi-bin/media/upload?access_token={access_token}&type={media_type}",
    access_token = urlencoding::encode(&access_token),
    media_type = urlencoding::encode(media_type),
  );
  let filename = if filename.is_empty() {
    String::from("file")
  } else {
    filename.to_string()
  };
  let part = reqwest::multipart::Part::bytes(content.clone())
    .file_name(filename.clone())
    .mime_str(content_type)
    .or_else(|_| {
      reqwest::multipart::Part::bytes(content)
        .file_name(filename)
        .mime_str("application/octet-stream")
    })?;
  let form = reqwest::multipart::Form::new()
    .part("media", part);
  let client = reqwest::Client::new();
  let res = client
    .post(url)
    .multipart(form)
    .send()
    .await?;
  let res = res.error_for_status()?;
  let data_str = res.text().await?;
  let data: UploadMediaRes = serde_json::from_str(&data_str)?;
  Ok(data)
}

/// 上传 OSS 附件到企业微信临时素材，返回 media_id
pub async fn upload_media(
  wxw_app_id: WxwAppId,
  file_id: &str,
  media_type: Option<&str>,
) -> Result<String> {
  let file_id = file_id.trim();
  if file_id.is_empty() {
    return Err(eyre!("file_id 不能为空"));
  }
  let stat = head_oss_object(file_id)
    .await?
    .ok_or_else(|| eyre!("OSS附件不存在: {file_id}"))?;
  let filename = urlencoding::decode(&stat.filename)
    .map(|item| item.to_string())
    .unwrap_or(stat.filename);
  let content_type = stat.content_type
    .filter(|item| !item.is_empty())
    .unwrap_or_else(|| String::from("application/octet-stream"));
  let content = get_oss_object(file_id)
    .await?
    .ok_or_else(|| eyre!("OSS附件不存在: {file_id}"))?
    .to_vec();
  let media_type = media_type.unwrap_or("file");
  let mut data = upload_media_request(
    wxw_app_id,
    media_type,
    &filename,
    &content_type,
    content.clone(),
    false,
  ).await?;
  if should_retry_submit_approval_apply(data.errcode) {
    data = upload_media_request(
      wxw_app_id,
      media_type,
      &filename,
      &content_type,
      content,
      true,
    ).await?;
  }
  if data.errcode != 0 {
    return Err(eyre!("上传企业微信临时素材失败: {} {}", data.errcode, data.errmsg));
  }
  if data.media_id.is_empty() {
    return Err(eyre!("上传企业微信临时素材失败: media_id 为空"));
  }
  Ok(data.media_id)
}

async fn build_file_value(
  wxw_app_id: WxwAppId,
  value: &serde_json::Value,
  title: &str,
) -> Result<serde_json::Value> {
  if let Some(files) = get_prepared_file_items(value, title)? {
    return Ok(serde_json::json!({ "files": files }));
  }
  let file_ids = parse_oss_file_ids(value, title)?;
  let mut files = Vec::with_capacity(file_ids.len());
  for file_id in file_ids {
    let media_id = upload_media(
      wxw_app_id,
      &file_id,
      Some("file"),
    ).await?;
    files.push(serde_json::json!({ "file_id": media_id }));
  }
  Ok(serde_json::json!({ "files": files }))
}

fn build_empty_control_value(control: &TemplateControl, title: &str) -> Result<serde_json::Value> {
  match control.property.control.as_str() {
    "Text" | "Textarea" => Ok(serde_json::json!({ "text": "" })),
    "Number" => Ok(serde_json::json!({ "new_number": "" })),
    "Money" => Ok(serde_json::json!({ "new_money": "" })),
    "Date" => Ok(serde_json::json!({
      "date": {
        "type": get_date_type(control)?,
        "s_timestamp": "",
      }
    })),
    "Selector" => Ok(serde_json::json!({
      "selector": {
        "type": match get_selector_config(control)?.r#type.as_str() {
          "" => "single",
          item => item,
        },
        "options": [],
      }
    })),
    "File" => Ok(serde_json::json!({ "files": [] })),
    _ => Err(eyre!("{title} 的控件类型 {} 暂不支持自动填充", control.property.control)),
  }
}

async fn build_child_control_value(
  wxw_app_id: WxwAppId,
  control: &TemplateControl,
  value: &serde_json::Value,
  title: &str,
) -> Result<serde_json::Value> {
  match control.property.control.as_str() {
    "Text" | "Textarea" => Ok(serde_json::json!({
      "text": json_scalar_to_string(value, title)?,
    })),
    "Number" => Ok(serde_json::json!({
      "new_number": json_scalar_to_string(value, title)?,
    })),
    "Money" => Ok(serde_json::json!({
      "new_money": json_scalar_to_string(value, title)?,
    })),
    "Date" => build_date_value(control, value, title),
    "Selector" => build_selector_value(control, value, title),
    "File" => build_file_value(wxw_app_id, value, title).await,
    "Table" => Err(eyre!("{title} 暂不支持嵌套明细控件")),
    "Tips" | "Formula" => Ok(serde_json::Value::Null),
    _ => Err(eyre!("{title} 的控件类型 {} 暂不支持自动填充", control.property.control)),
  }
}

async fn build_table_row_item(
  wxw_app_id: WxwAppId,
  control: &TemplateControl,
  row: &serde_json::Map<String, serde_json::Value>,
) -> Result<serde_json::Value> {
  let title = get_control_title(control);
  if matches!(control.property.control.as_str(), "Tips" | "Formula") {
    return Ok(serde_json::Value::Null);
  }
  let value = match row.get(&title) {
    Some(value) if !is_empty_json_value(value) => build_child_control_value(wxw_app_id, control, value, &title).await?,
    _ => {
      if control.property.require == 1 {
        return Err(eyre!("明细字段 {title} 为必填，但未提供值"));
      }
      build_empty_control_value(control, &title)?
    }
  };
  Ok(serde_json::json!({
    "control": control.property.control.clone(),
    "id": control.property.id.clone(),
    "title": control.property.title.clone(),
    "value": value,
  }))
}

async fn build_table_value(
  wxw_app_id: WxwAppId,
  control: &TemplateControl,
  value: &serde_json::Value,
  title: &str,
) -> Result<serde_json::Value> {
  let rows = value
    .as_array()
    .ok_or_else(|| eyre!("{title} 明细控件需要数组值"))?;
  let children = get_table_children(control)?;
  let mut child_rows = Vec::with_capacity(rows.len());
  for row in rows {
    let row = row
      .as_object()
      .ok_or_else(|| eyre!("{title} 明细项必须是对象"))?;
    let mut list = Vec::new();
    for child in &children {
      let item = build_table_row_item(
        wxw_app_id,
        child,
        row,
      ).await?;
      if item.is_null() {
        continue;
      }
      list.push(item);
    }
    child_rows.push(serde_json::json!({ "list": list }));
  }
  Ok(serde_json::json!({ "children": child_rows }))
}

fn build_summary_line(control: &TemplateControl, value: &serde_json::Value) -> Option<String> {
  let title = get_control_title(control);
  if title.is_empty() {
    return None;
  }
  let raw = match control.property.control.as_str() {
    "Table" => value.as_array().map(|items| format!("{title}：{}行", items.len())),
    "Selector" => match value {
      serde_json::Value::Array(items) => Some(
        items
          .iter()
          .filter_map(|item| json_scalar_to_string(item, &title).ok())
          .collect::<Vec<_>>()
          .join("/"),
      ),
      _ => json_scalar_to_string(value, &title).ok(),
    }
      .filter(|item| !item.is_empty())
      .map(|item| format!("{title}：{item}")),
    "Text" | "Textarea" | "Number" | "Money" | "Date" => json_scalar_to_string(value, &title)
      .ok()
      .filter(|item| !item.is_empty())
      .map(|item| format!("{title}：{item}")),
    _ => None,
  }?;
  Some(raw.chars().take(20).collect())
}

async fn build_control_content(
  wxw_app_id: WxwAppId,
  control: &TemplateControl,
  form: &serde_json::Map<String, serde_json::Value>,
) -> Result<Option<(SubmitApprovalApplyContent, Option<String>)>> {
  let title = get_control_title(control);
  if matches!(control.property.control.as_str(), "Tips" | "Formula") {
    return Ok(None);
  }
  let Some(value) = form.get(&title) else {
    if control.property.require == 1 {
      return Err(eyre!("字段 {title} 为必填，但未提供值"));
    }
    return Ok(None);
  };
  if is_empty_json_value(value) {
    if control.property.require == 1 {
      return Err(eyre!("字段 {title} 为必填，但值为空"));
    }
    return Ok(None);
  }
  let control_value = match control.property.control.as_str() {
    "Table" => build_table_value(wxw_app_id, control, value, &title).await?,
    _ => build_child_control_value(wxw_app_id, control, value, &title).await?,
  };
  let content = SubmitApprovalApplyContent {
    control: control.property.control.clone(),
    id: control.property.id.clone(),
    value: control_value,
  };
  Ok(Some((content, build_summary_line(control, value))))
}

fn build_summary_list(
  template_detail: &GetTemplateDetailRes,
  summary_candidates: Vec<String>,
) -> Vec<SubmitApprovalApplySummary> {
  let template_name = get_template_text(&template_detail.template_names);
  let mut summary_texts = summary_candidates
    .into_iter()
    .filter(|item| !item.is_empty())
    .take(3)
    .collect::<Vec<_>>();
  if summary_texts.is_empty() {
    let fallback = if template_name.is_empty() {
      String::from("企业微信审批")
    } else {
      template_name.chars().take(20).collect()
    };
    summary_texts.push(fallback);
  }
  summary_texts
    .into_iter()
    .map(|text| SubmitApprovalApplySummary {
      summary_info: vec![SubmitApprovalSummaryInfo {
        text,
        lang: "zh_CN".into(),
      }],
    })
    .collect::<Vec<_>>()
}

/// 根据系统用户解析企业微信 userid
pub async fn resolve_creator_userid(
  usr_id: UsrId,
  wxw_app_id: WxwAppId,
  options: Option<Options>,
) -> Result<String> {
  let usr_model = find_by_id_ok_usr(
    usr_id,
    options,
  ).await?;
  let wxw_usr_model = find_one_ok_wxw_usr(
    Some(WxwUsrSearch {
      lbl: Some(usr_model.lbl.clone()),
      wxw_app_id: Some(vec![wxw_app_id]),
      ..Default::default()
    }),
    None,
    options,
  ).await?;
  Ok(wxw_usr_model.userid)
}

/// 按企业微信模板详情构造审批提交 payload
pub async fn build_submit_approval_apply_payload(
  wxw_app_id: WxwAppId,
  creator_userid: &str,
  template_id: &str,
  form_json: &serde_json::Value,
) -> Result<SubmitApprovalApplyReq> {
  let template_detail = gettemplatedetail(
    wxw_app_id,
    template_id.to_string(),
  ).await?;
  let form = form_json
    .as_object()
    .ok_or_else(|| eyre!("审批表单数据必须是对象"))?;
  let mut summary_candidates = Vec::new();
  let mut contents = Vec::new();
  for control in &template_detail.template_content.controls {
    if let Some((content, summary)) = build_control_content(
      wxw_app_id,
      control,
      form,
    ).await? {
      if let Some(summary) = summary {
        summary_candidates.push(summary);
      }
      contents.push(content);
    }
  }
  Ok(SubmitApprovalApplyReq {
    creator_userid: creator_userid.to_string(),
    template_id: template_id.to_string(),
    use_template_approver: 1,
    choose_department: 0,
    apply_data: SubmitApprovalApplyData {
      contents,
    },
    summary_list: build_summary_list(&template_detail, summary_candidates),
    process: None,
  })
}

/// 根据中文字段 JSON 提交企业微信审批，成功后仅返回 sp_no
pub async fn submit_approval_apply_payload(
  wxw_app_id: WxwAppId,
  creator_usr_id: UsrId,
  template_id: String,
  form_json: serde_json::Value,
  options: Option<Options>,
) -> Result<String> {
  let creator_userid = resolve_creator_userid(
    creator_usr_id,
    wxw_app_id,
    options,
  ).await?;
  let payload = build_submit_approval_apply_payload(
    wxw_app_id,
    &creator_userid,
    &template_id,
    &form_json,
  ).await?;
  let res = submit_approval_apply(
    wxw_app_id,
    payload,
  ).await?;
  Ok(res.sp_no)
}

fn validate_submit_approval_apply_req(payload: &SubmitApprovalApplyReq) -> Result<()> {
  if payload.use_template_approver == 0 {
    let process = payload.process.as_ref();
    let has_node = process
      .map(|process| !process.node_list.is_empty())
      .unwrap_or(false);
    if !has_node {
      return Err(eyre!(
        "提交企业微信审批申请失败: use_template_approver=0 时 process.node_list 必填"
      ));
    }
  }

  Ok(())
}

async fn submit_approval_apply_request(
  wxw_app_id: WxwAppId,
  payload: &SubmitApprovalApplyReq,
  force: bool,
) -> Result<SubmitApprovalApplyRes> {
  let access_token = get_access_token(wxw_app_id, force.into()).await?;
  let url = format!(
    "https://qyapi.weixin.qq.com/cgi-bin/oa/applyevent?access_token={access_token}",
    access_token = urlencoding::encode(&access_token),
  );

  let client = reqwest::Client::new();
  let res = client
    .post(&url)
    .json(payload)
    .send()
    .await?;
  let res = res.error_for_status()?;
  let data_str = res.text().await?;
  let data: SubmitApprovalApplyRes = serde_json::from_str(&data_str)?;
  Ok(data)
}

/// 提交企业微信审批申请
/// https://developer.work.weixin.qq.com/document/path/91853
pub async fn submit_approval_apply(
  wxw_app_id: WxwAppId,
  payload: SubmitApprovalApplyReq,
) -> Result<SubmitApprovalApplyRes> {
  validate_submit_approval_apply_req(&payload)?;
  let mut data = submit_approval_apply_request(wxw_app_id, &payload, false).await?;
  if should_retry_submit_approval_apply(data.errcode) {
    data = submit_approval_apply_request(wxw_app_id, &payload, true).await?;
  }

  if data.errcode != 0 {
    let msg = format!(
      "提交审批申请失败: {} {}",
      data.errcode,
      data.errmsg,
    );
    return Err(eyre!(msg));
  }

  Ok(data)
}

/// 从企业微信获取 access_token
async fn fetch_access_token(
  corpid: &str,
  corpsecret: &str,
) -> Result<(String, u32)> {
  let url = format!(
    "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid={corpid}&corpsecret={corpsecret}",
    corpid = urlencoding::encode(corpid),
    corpsecret = urlencoding::encode(corpsecret),
  );
  let res = reqwest::get(&url).await?;
  #[derive(Serialize, Deserialize)]
  struct GettokenRes {
    errcode: i32,
    #[serde(default)]
    errmsg: String,
    access_token: String,
    #[serde(default)]
    expires_in: u32,
  }
  let data: GettokenRes = res.json().await?;
  let data_str = serde_json::to_string(&data)?;
  let (
    access_token,
    expires_in,
    errcode,
    errmsg,
  ) = (
    data.access_token,
    data.expires_in,
    data.errcode,
    data.errmsg,
  );
  if access_token.is_empty() || expires_in == 0 || errcode != 0 {
    let req_id = get_req_id();
    let msg =  serde_json::to_string(&data_str)?;
    error!("{req_id} 企业微信应用 获取 access_token 失败: {url}: {msg}");
    let msg = format!("企业微信应用 获取 access_token 失败: {errmsg}");
    return Err(eyre!(msg));
  }
  Ok((access_token, expires_in))
}

/// 获取企业微信应用的 access_token
pub async fn get_access_token(
  wxw_app_id: WxwAppId,
  force: Option<bool>,
) -> Result<String> {
  let force = force.unwrap_or(false);
  let wxw_app_model = find_by_id_wxw_app(
    wxw_app_id,
    None,
  ).await?;
  let wxw_app_model = validate_option_wxw_app(
    wxw_app_model,
  ).await?;
  validate_is_enabled_wxw_app(
    &wxw_app_model,
  ).await?;
  let corpid = wxw_app_model.corpid;
  let wxw_app_id = wxw_app_model.id;
  let corpsecret = wxw_app_model.corpsecret;
  let tenant_id = wxw_app_model.tenant_id;
  if corpsecret.is_empty() {
    let msg = format!("未设置企微应用 应用密钥, corpid: {corpid}");
    return Err(eyre!(msg));
  }
  let wxw_app_token_model = find_one_wxw_app_token(
    WxwAppTokenSearch {
      wxw_app_id: vec![wxw_app_id].into(),
      r#type: String::from("corp").into(),
      tenant_id: tenant_id.into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  let now = get_now();
  let now_sec = now.and_utc().timestamp_millis() / 1000;
  if wxw_app_token_model.is_none() {
    let (
      access_token,
      expires_in,
    ) = fetch_access_token(
      &corpid,
      &corpsecret,
    ).await?;
    create_wxw_app_token(
      WxwAppTokenInput {
        wxw_app_id: wxw_app_id.into(),
        r#type: String::from("corp").into(),
        access_token: access_token.clone().into(),
        expires_in: expires_in.into(),
        token_time: now.into(),
        tenant_id: tenant_id.into(),
        ..Default::default()
      },
      None,
    ).await?;
    return Ok(access_token);
  }
  let wxw_app_token_model = wxw_app_token_model.unwrap();
  let access_token = wxw_app_token_model.access_token;
  let expires_in = wxw_app_token_model.expires_in as i64;
  let token_time = wxw_app_token_model.token_time;
  let token_time_sec = token_time
    .map(|x| x.and_utc().timestamp_millis() / 1000)
    .unwrap_or(0);
  if force
    || expires_in == 0
    || access_token.is_empty()
    || token_time_sec == 0
    || now_sec > token_time_sec + expires_in + 120
  {
    let req_id = get_req_id();
    info!("{req_id} 企微应用 access_token 过期, 重新获取: expires_in: {expires_in}");
    let (
      access_token,
      expires_in,
    ) = fetch_access_token(
      &corpid,
      &corpsecret,
    ).await?;
    let id = wxw_app_token_model.id;
    update_by_id_wxw_app_token(
      id,
      WxwAppTokenInput {
        access_token: access_token.clone().into(),
        expires_in: expires_in.into(),
        token_time: now.into(),
        tenant_id: tenant_id.into(),
        ..Default::default()
      },
      None,
    ).await?;
    return Ok(access_token);
  }
  Ok(access_token)
}

/// 获取企微通讯录token
pub async fn get_contact_access_token(
  wxw_app_id: WxwAppId,
  force: Option<bool>,
) -> Result<String> {
  let force = force.unwrap_or(false);
  let wxw_app_model = find_by_id_wxw_app(
    wxw_app_id,
    None,
  ).await?;
  if wxw_app_model.is_none() {
    let msg = format!("企微应用不存在, id: {wxw_app_id}");
    return Err(eyre!(msg));
  }
  let wxw_app_model = wxw_app_model.unwrap();
  if wxw_app_model.is_enabled == 0 {
    let msg = format!(
      "企微应用已禁用 {lbl}",
      lbl = wxw_app_model.lbl,
    );
    return Err(eyre!(msg));
  }
  let corpid = wxw_app_model.corpid;
  let wxw_app_id = wxw_app_model.id;
  let contactsecret = wxw_app_model.contactsecret;
  let tenant_id = wxw_app_model.tenant_id;
  if contactsecret.is_empty() {
    let msg = format!("未设置企业微信应用 通讯录密钥, 企业ID: {corpid}");
    return Err(eyre!(msg));
  }
  let wxw_app_token_model = find_one_wxw_app_token(
    WxwAppTokenSearch {
      wxw_app_id: vec![wxw_app_id].into(),
      r#type: String::from("contact").into(),
      tenant_id: tenant_id.into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  let now = get_now();
  let now_sec = now.and_utc().timestamp_millis() / 1000;
  if wxw_app_token_model.is_none() {
    let (
      access_token,
      expires_in,
    ) = fetch_access_token(
      &corpid,
      &contactsecret,
    ).await?;
    create_wxw_app_token(
      WxwAppTokenInput {
        wxw_app_id: wxw_app_id.into(),
        r#type: String::from("contact").into(),
        access_token: access_token.clone().into(),
        expires_in: expires_in.into(),
        token_time: now.into(),
        tenant_id: tenant_id.into(),
        ..Default::default()
      },
      None,
    ).await?;
    return Ok(access_token);
  }
  let wxw_app_token_model = wxw_app_token_model.unwrap();
  let access_token = wxw_app_token_model.access_token;
  let expires_in = wxw_app_token_model.expires_in as i64;
  let token_time = wxw_app_token_model.token_time;
  let token_time_sec = token_time
    .map(|x| x.and_utc().timestamp_millis() / 1000)
    .unwrap_or(0);
  if force
    || expires_in == 0
    || access_token.is_empty()
    || token_time_sec == 0
    || now_sec > token_time_sec + expires_in + 120
  {
    let req_id = get_req_id();
    info!("{req_id} 企业微信应用 通讯录密钥 access_token 过期, 重新获取: expires_in: {expires_in}");
    let (
      access_token,
      expires_in,
    ) = fetch_access_token(
      &corpid,
      &contactsecret,
    ).await?;
    let id = wxw_app_token_model.id;
    update_by_id_wxw_app_token(
      id,
      WxwAppTokenInput {
        access_token: access_token.clone().into(),
        expires_in: expires_in.into(),
        token_time: now.into(),
        tenant_id: tenant_id.into(),
        ..Default::default()
      },
      None,
    ).await?;
    return Ok(access_token);
  }
  Ok(access_token)
}

async fn find_or_init_wxw_app_token_model(
  wxw_app_id: WxwAppId,
) -> Result<generated::wxwork::wxw_app_token::wxw_app_token_model::WxwAppTokenModel> {
  let wxw_app_token_model = find_one_wxw_app_token(
    WxwAppTokenSearch {
      wxw_app_id: vec![wxw_app_id].into(),
      r#type: String::from("corp").into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  match wxw_app_token_model {
    Some(model) => Ok(model),
    None => {
      let _ = get_access_token(
        wxw_app_id,
        Some(true),
      ).await?;
      let wxw_app_token_model = find_one_wxw_app_token(
        WxwAppTokenSearch {
          wxw_app_id: vec![wxw_app_id].into(),
          r#type: String::from("corp").into(),
          ..Default::default()
        }.into(),
        None,
        None,
      ).await?;
      validate_option_wxw_app_token(wxw_app_token_model).await
    }
  }
}

/// 获取企业的jsapi_ticket
async fn get_jsapi_ticket(
  wxw_app_id: WxwAppId,
  force: Option<bool>,
) -> Result<String> {
  
  let force = force.unwrap_or(false);
  
  let wxw_app_model = validate_option_wxw_app(
    find_by_id_wxw_app(
      wxw_app_id,
      None,
    ).await?,
  ).await?;
  
  validate_is_enabled_wxw_app(
    &wxw_app_model,
  ).await?;
  
  let wxw_app_token_model = find_or_init_wxw_app_token_model(wxw_app_id).await?;
  
  let now = get_now();
  let now_sec = now.and_utc().timestamp_millis() / 1000;
  
  let jsapi_ticket = wxw_app_token_model.jsapi_ticket;
  let jsapi_ticket_expires_in = wxw_app_token_model.jsapi_ticket_expires_in as i64;
  let jsapi_ticket_time = wxw_app_token_model.jsapi_ticket_time;
  let jsapi_ticket_time_sec = jsapi_ticket_time
    .map(|x| x.and_utc().timestamp_millis() / 1000)
    .unwrap_or(0);
  
  if force
    || jsapi_ticket_expires_in == 0
    || jsapi_ticket.is_empty()
    || jsapi_ticket_time_sec == 0
    || now_sec > jsapi_ticket_time_sec + jsapi_ticket_expires_in + 120
  {
    let access_token = get_access_token(
      wxw_app_id,
      force.into(),
    ).await?;
    
    let url = format!(
      "https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket?access_token={access_token}",
      access_token = urlencoding::encode(&access_token),
    );
    let res = reqwest::get(&url).await?;
    
    let data_str = res.text().await?;
    let data: GetJsapiTicketRes = serde_json::from_str(&data_str)?;
    
    let (
      ticket,
      expires_in,
      errcode,
      errmsg,
    ) = (
      data.ticket,
      data.expires_in,
      data.errcode,
      data.errmsg,
    );
    
    if ticket.is_empty() || expires_in == 0 || errcode != 0 {
      let req_id = get_req_id();
      let msg =  serde_json::to_string(&data_str)?;
      error!("{req_id} 企业微信应用 获取 jsapi_ticket 失败: {url}: {msg}");
      let msg = format!("企业微信应用 获取 jsapi_ticket 失败: {errmsg}");
      return Err(eyre!(msg));
    }
    
    update_by_id_wxw_app_token(
      wxw_app_token_model.id,
      WxwAppTokenInput {
        jsapi_ticket: ticket.clone().into(),
        jsapi_ticket_expires_in: expires_in.into(),
        jsapi_ticket_time: now.into(),
        ..Default::default()
      },
      None,
    ).await?;
    
    return Ok(ticket);
  }
  
  Ok(jsapi_ticket)
}

/// 获取企业的jsapi_ticket, 跟签名
/// https://developer.work.weixin.qq.com/document/path/90506
pub async fn get_jsapi_ticket_signature(
  wxw_app_id: WxwAppId,
  url: String,
  force: Option<bool>,
) -> Result<WxwGetConfigSignature> {
  
  let jsapi_ticket = get_jsapi_ticket(
    wxw_app_id,
    force,
  ).await?;
  
  let nonce_str = uuid::Uuid::new_v4().to_string().replace('-', "");
  let timestamp = (get_now().and_utc().timestamp_millis() / 1000).to_string();
  
  let signature = format!(
    "jsapi_ticket={jsapi_ticket}&noncestr={nonce_str}&timestamp={timestamp}&url={url}",
  );
  
  let mut hasher = Sha1::new();
  hasher.update(signature.as_bytes());
  let signature = hasher.finalize();
  let signature = hex::encode(signature);
  
  Ok(WxwGetConfigSignature {
    timestamp,
    nonce_str,
    signature,
  })
}

/// 获取应用 jsapi_ticket
pub async fn get_jsapi_ticket_agent_config(
  wxw_app_id: WxwAppId,
  force: Option<bool>,
) -> Result<String> {
  
  let force = force.unwrap_or(false);
  
  let wxw_app_model = validate_option_wxw_app(
    find_by_id_wxw_app(
      wxw_app_id,
      None,
    ).await?,
  ).await?;
  
  validate_is_enabled_wxw_app(
    &wxw_app_model,
  ).await?;
  
  let wxw_app_token_model = find_or_init_wxw_app_token_model(wxw_app_id).await?;
  
  let now = get_now();
  let now_sec = now.and_utc().timestamp_millis() / 1000;
  
  let corpid = wxw_app_model.corpid;
  let corpsecret = wxw_app_model.corpsecret;
  if corpid.is_empty() || corpsecret.is_empty() {
    return Err(eyre!("未设置企微应用 应用密钥"));
  }
  
  let jsapi_ticket_agent_config = wxw_app_token_model.jsapi_ticket_agent_config;
  let jsapi_ticket_agent_config_expires_in = wxw_app_token_model.jsapi_ticket_agent_config_expires_in as i64;
  let jsapi_ticket_agent_config_time = wxw_app_token_model.jsapi_ticket_agent_config_time;
  let jsapi_ticket_agent_config_time_sec = jsapi_ticket_agent_config_time
    .map(|x| x.and_utc().timestamp_millis() / 1000)
    .unwrap_or(0);
  
  if force
    || jsapi_ticket_agent_config_expires_in == 0
    || jsapi_ticket_agent_config.is_empty()
    || jsapi_ticket_agent_config_time_sec == 0
    || now_sec > jsapi_ticket_agent_config_time_sec + jsapi_ticket_agent_config_expires_in + 120
    || corpid != wxw_app_token_model.corpid
    || corpsecret != wxw_app_token_model.corpsecret
  {
    let access_token = get_access_token(
      wxw_app_id,
      force.into(),
    ).await?;
    
    let url = format!(
      "https://qyapi.weixin.qq.com/cgi-bin/ticket/get?access_token={access_token}&type=agent_config",
      access_token = urlencoding::encode(&access_token),
    );
    let res = reqwest::get(&url).await?;
    
    let data_str = res.text().await?;
    let data: GetJsapiTicketRes = serde_json::from_str(&data_str)?;
    
    let (
      ticket,
      expires_in,
      errcode,
      errmsg,
    ) = (
      data.ticket,
      data.expires_in,
      data.errcode,
      data.errmsg,
    );
    
    if ticket.is_empty() || expires_in == 0 || errcode != 0 {
      let req_id = get_req_id();
      let msg =  serde_json::to_string(&data_str)?;
      error!("{req_id} 企业微信应用 获取 应用jsapi_ticket 失败: {url}: {msg}");
      let msg = format!("企业微信应用 获取 应用jsapi_ticket 失败: {errmsg}");
      return Err(eyre!(msg));
    }
    
    update_by_id_wxw_app_token(
      wxw_app_token_model.id,
      WxwAppTokenInput {
        jsapi_ticket_agent_config: ticket.clone().into(),
        jsapi_ticket_agent_config_expires_in: expires_in.into(),
        jsapi_ticket_agent_config_time: now.into(),
        ..Default::default()
      },
      None,
    ).await?;
    
    return Ok(ticket);
  }
  
  Ok(jsapi_ticket_agent_config)
}

/// 获取应用的jsapi_ticket, 跟签名
/// https://developer.work.weixin.qq.com/document/path/90506
pub async fn get_jsapi_ticket_agent_config_signature(
  wxw_app_id: WxwAppId,
  url: String,
  force: Option<bool>,
) -> Result<WxwGetConfigSignature> {
  
  let jsapi_ticket = get_jsapi_ticket_agent_config(
    wxw_app_id,
    force,
  ).await?;
  
  let nonce_str = uuid::Uuid::new_v4().to_string().replace('-', "");
  let timestamp = (get_now().and_utc().timestamp_millis() / 1000).to_string();
  
  let signature = format!(
    "jsapi_ticket={jsapi_ticket}&noncestr={nonce_str}&timestamp={timestamp}&url={url}",
  );
  
  let mut hasher = Sha1::new();
  hasher.update(signature.as_bytes());
  let signature = hasher.finalize();
  let signature = hex::encode(signature);
  
  Ok(WxwGetConfigSignature {
    timestamp,
    nonce_str,
    signature,
  })
}

/// 获取访问用户身份
/// https://developer.work.weixin.qq.com/document/path/91023
async fn fetch_getuserinfo_by_code(
  wxw_app_id: WxwAppId,
  code: String,
  force: bool,
) -> Result<GetuserinfoRes> {
  let access_token = get_access_token(
    wxw_app_id,
    force.into(),
  ).await?;
  let url = format!(
    "https://qyapi.weixin.qq.com/cgi-bin/auth/getuserinfo?access_token={access_token}&code={code}",
    access_token = urlencoding::encode(&access_token),
    code = urlencoding::encode(&code),
  );
  info!(
    "{req_id} fetch_getuserinfo_by_code.url: {url}",
    req_id = get_req_id(),
  );
  let res = reqwest::get(&url).await?;
  let data = res.text().await?;
  info!(
    "{req_id} fetch_getuserinfo_by_code.data: {data}",
    req_id = get_req_id(),
  );
  let data: GetuserinfoRes = serde_json::from_str(&data)?;
  Ok(data)
}

/// 获取访问用户身份
/// https://developer.work.weixin.qq.com/document/path/91023
/// #### 参数
/// 
/// - `corpid` - 企业ID
/// - `code` - 临时授权码
/// - `force` - 是否强制刷新 access_token, 默认为 false
/// 
/// #### 返回值
/// 
/// 返回用户身份信息 `userid`, `user_ticket`
pub async fn getuserinfo_by_code(
  wxw_app_id: WxwAppId,
  code: String,
) -> Result<GetuserinfoModel> {
  let mut data: GetuserinfoRes = fetch_getuserinfo_by_code(
    wxw_app_id,
    code.clone(),
    false,
  ).await?;
  if data.errcode == 42001 {
    data = fetch_getuserinfo_by_code(
      wxw_app_id,
      code.clone(),
      true,
    ).await?;
  }
  let (
    errcode,
    errmsg,
    userid,
    user_ticket,
  ) = (
    data.errcode,
    data.errmsg.clone(),
    data.userid.clone(),
    data.user_ticket.clone(),
  );
  if errcode != 0 {
    error!(
      "{req_id} 获取访问用户身份失败: {errmsg}",
      req_id = get_req_id(),
      errmsg = serde_json::to_string(&data)?,
    );
    return Err(eyre!("获取访问用户身份失败: {errmsg}"));
  }
  Ok(GetuserinfoModel {
    userid,
    user_ticket,
  })
}

async fn fetch_getuserdetail(
  wxw_app_id: WxwAppId,
  user_ticket: String,
  force: bool,
) -> Result<GetuserDetailRes> {
  let access_token = get_access_token(
    wxw_app_id,
    force.into(),
  ).await?;
  let url = format!(
    "https://qyapi.weixin.qq.com/cgi-bin/auth/getuserdetail?access_token={access_token}",
    access_token = urlencoding::encode(&access_token),
  );
  info!(
    "{req_id} fetch_getuserdetail.url: {url}",
    req_id = get_req_id(),
  );
  let client = reqwest::Client::new();
  let res = client.post(&url)
    .json(&serde_json::json!({
      "user_ticket": user_ticket,
    }))
    .send()
    .await?;
  let data = res.text().await?;
  info!(
    "{req_id} fetch_getuserdetail.data: {data}",
    req_id = get_req_id(),
  );
  let data: GetuserDetailRes = serde_json::from_str(&data)?;
  Ok(data)
}

/// 获取访问用户敏感信息
/// https://developer.work.weixin.qq.com/document/path/95833
/// #### 参数
/// 
/// - `user_ticket` - 成员票据
pub async fn getuserdetail(
  wxw_app_id: WxwAppId,
  user_ticket: String,
) -> Result<GetuserDetailRes> {
  let mut data: GetuserDetailRes = fetch_getuserdetail(
    wxw_app_id,
    user_ticket.clone(),
    false,
  ).await?;
  if data.errcode == 42001 {
    data = fetch_getuserdetail(
      wxw_app_id,
      user_ticket.clone(),
      true,
    ).await?;
  }
  let errcode = data.errcode;
  let errmsg = data.errmsg.clone();
  if errcode != 0 {
    error!(
      "{req_id} 获取访问用户敏感信息失败: {errmsg}",
      req_id = get_req_id(),
      errmsg = serde_json::to_string(&data)?,
    );
    return Err(eyre!("获取访问用户敏感信息失败: {errmsg}"));
  }
  Ok(data)
}

async fn fetch_gettemplatedetail(
  wxw_app_id: WxwAppId,
  template_id: String,
  force: bool,
) -> Result<GetTemplateDetailRes> {
  let req_id = get_req_id();
  let access_token = get_access_token(
    wxw_app_id,
    force.into(),
  ).await?;
  let url = format!(
    "https://qyapi.weixin.qq.com/cgi-bin/oa/gettemplatedetail?access_token={access_token}",
    access_token = urlencoding::encode(&access_token),
  );
  info!(
    "{req_id} fetch_gettemplatedetail.url: {url}",
  );
  let client = reqwest::Client::new();
  let res = client.post(&url)
    .json(&serde_json::json!({
      "template_id": template_id,
    }))
    .send()
    .await?;
  let data = res.text().await?;
  info!(
    "{req_id} fetch_gettemplatedetail.data: {data}",
  );
  let data: GetTemplateDetailRes = serde_json::from_str(&data)?;
  Ok(data)
}

/// 获取审批模板详情
/// https://developer.work.weixin.qq.com/document/path/91982
pub async fn gettemplatedetail(
  wxw_app_id: WxwAppId,
  template_id: String,
) -> Result<GetTemplateDetailRes> {
  let req_id = get_req_id();
  let mut data: GetTemplateDetailRes = fetch_gettemplatedetail(
    wxw_app_id,
    template_id.clone(),
    false,
  ).await?;
  if data.errcode == 42001 {
    data = fetch_gettemplatedetail(
      wxw_app_id,
      template_id.clone(),
      true,
    ).await?;
  }
  let errcode = data.errcode;
  let errmsg = data.errmsg.clone();
  if errcode != 0 {
    error!(
      "{req_id} 获取审批模板详情失败: {errmsg}",
      errmsg = serde_json::to_string(&data)?,
    );
    return Err(eyre!("获取审批模板详情失败: {errmsg}"));
  }
  Ok(data)
}

async fn fetch_getuseridlist(
  wxw_app_id: WxwAppId,
  force: bool,
) -> Result<GetuseridlistRes> {
  let req_id = get_req_id();
  let access_token = get_contact_access_token(
    wxw_app_id,
    force.into(),
  ).await?;
  let url = format!(
    "https://qyapi.weixin.qq.com/cgi-bin/user/list_id?access_token={access_token}",
    access_token = urlencoding::encode(&access_token),
  );
  info!(
    "{req_id} fetch_getuseridlist.url: {url}",
  );
  let res = reqwest::get(&url).await?;
  let data: GetuseridlistRes = res.json().await?;
  info!(
    "{req_id} fetch_getuseridlist.data: {data}",
    data = serde_json::to_string(&data)?,
  );
  Ok(data)
}

/// 获取成员ID列表
pub async fn getuseridlist(
  wxw_app_id: WxwAppId,
) -> Result<Vec<String>> {
  let req_id = get_req_id();
  let mut data: GetuseridlistRes = fetch_getuseridlist(
    wxw_app_id,
    false,
  ).await?;
  if data.errcode == 42001 {
    data = fetch_getuseridlist(
      wxw_app_id,
      true,
    ).await?;
  }
  let data_str = serde_json::to_string(&data)?;
  let errcode = data.errcode;
  let errmsg = data.errmsg;
  let userlist = data.dept_user;
  if errcode != 0 {
    error!(
      "{req_id} 获取成员ID列表失败: {errmsg}",
      errmsg = &data_str,
    );
    return Err(eyre!("获取成员ID列表失败: {errmsg}"));
  }
  let mut userids: Vec<String> = Vec::with_capacity(userlist.len());
  for user in userlist {
    if userids.contains(&user.userid) {
      continue;
    }
    userids.push(user.userid);
  }
  Ok(userids)
}

async fn fetch_getuser(
  wxw_app_id: WxwAppId,
  userid: String,
  force: Option<bool>,
) -> Result<GetuserRes> {
  let req_id = get_req_id();
  let access_token = get_access_token(
    wxw_app_id,
    force,
  ).await?;
  let url = format!(
    "https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token={access_token}&userid={userid}",
    access_token = urlencoding::encode(&access_token),
    userid = urlencoding::encode(&userid),
  );
  info!(
    "{req_id} fetch_getuser.url: {url}",
  );
  let res = reqwest::get(&url).await?;
  let data: GetuserRes = res.json().await?;
  info!(
    "{req_id} fetch_getuser.data: {data}",
    data = serde_json::to_string(&data)?,
  );
  Ok(data)
}

/// 从企业微信获取指定用户的信息
///
/// # 参数
///
/// - `corpid`：企业 ID
/// - `userid`：用户 ID
/// - `force`：是否强制刷新 access_token, 默认为 false
///
/// #### 返回值
///
/// 返回 `Result<GetuserRes>`，其中 `GetuserRes` 是获取到的用户信息结构体
///
/// #### 异常
///
/// 如果获取用户信息失败，则返回 `Err`，其中包含错误信息
pub async fn getuser(
  wxw_app_id: WxwAppId,
  userid: String,
) -> Result<Option<GetuserRes>> {
  let req_id = get_req_id();
  let data: GetuserRes = fetch_getuser(
    wxw_app_id,
    userid.clone(),
    false.into(),
  ).await?;
  let data_str = serde_json::to_string(&data)?;
  let errcode = data.errcode;
  let errmsg = data.errmsg.clone();
  // 指定的成员/部门/标签参数无权限, 指定的成员或部门或标签不在应用的可见范围之内
  if errcode == 60011 {
    return Ok(None);
  }
  if errcode == 42001 {
    let data: GetuserRes = fetch_getuser(
      wxw_app_id,
      userid.clone(),
      true.into(),
    ).await?;
    let data_str = serde_json::to_string(&data)?;
    let errcode = data.errcode;
    let errmsg = data.errmsg.clone();
    if errcode != 0 {
      error!(
        "{req_id} 读取成员失败: {errmsg}",
        errmsg = &data_str,
      );
      return Err(eyre!("读取成员失败: {errmsg}"));
    }
    return Ok(Some(data));
  }
  if errcode != 0 {
    error!(
      "{req_id} 读取成员失败: {errmsg}",
      errmsg = &data_str,
    );
    return Err(eyre!("读取成员失败: {errmsg}"));
  }
  Ok(Some(data))
}
