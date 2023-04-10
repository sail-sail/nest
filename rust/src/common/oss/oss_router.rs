use anyhow::Result;

use poem::{
  handler, web::Multipart,
};

use crate::common::context::get_short_uuid;

use super::oss_service;

#[handler]
pub async fn upload(
  mut multipart: Multipart,
) -> Result<String> {
  let mut file_name = "".to_string();
  let mut content_type: Option<String> = None;
  let mut content: Option<Vec<u8>> = None;
  while let Ok(Some(field)) = multipart.next_field().await {
    let name = field.name();
    if name != Some("file") {
      continue;
    }
    file_name = field.file_name().map(ToString::to_string).unwrap_or("".to_string());
    content_type = field.content_type().map(ToString::to_string);
    if let Ok(bytes) = field.bytes().await {
      content = Some(bytes.to_vec());
      break;
    }
  }
  if content.is_none() {
    return Ok("".to_string());
  }
  let content = content.unwrap();
  let content_type = content_type.unwrap_or("application/octet-stream".to_string());
  let id = get_short_uuid();
  oss_service::put_object(&id, &content, &content_type, &file_name).await?;
  Ok(id)
}

#[handler]
pub async fn download() {
  
}
