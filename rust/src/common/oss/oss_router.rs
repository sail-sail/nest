use anyhow::Result;

use poem::{
  handler, web::{Multipart, Path, Query}, Response,
};
use reqwest::StatusCode;
use serde::Deserialize;
use serde_json::json;

use crate::common::context::get_short_uuid;

use super::oss_service;

#[handler]
pub async fn upload(
  mut multipart: Multipart,
) -> Result<String> {
  let mut file_name = String::new();
  let mut content_type: Option<String> = None;
  let mut content: Option<Vec<u8>> = None;
  while let Ok(Some(field)) = multipart.next_field().await {
    let name = field.name();
    if name != Some("file") {
      continue;
    }
    file_name = field.file_name().map(ToString::to_string).unwrap_or("".to_owned());
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
  let content_type = content_type.unwrap_or("application/octet-stream".to_owned());
  let id = get_short_uuid();
  oss_service::put_object(&id, &content, &content_type, &file_name).await?;
  Ok(id)
}

#[handler]
pub async fn delete(
  Query(DownloadQuery { id, inline: _inline }): Query<DownloadQuery>,
) -> Result<String> {
  let res = oss_service::delete_object(&id).await?;
  let res = json!({
    "code": 0,
    "data": res,
  }).to_string();
  Ok(res)
}

#[derive(Deserialize)]
pub struct DownloadQuery {
  id: String,
  inline: Option<String>,
}

async fn _download(
  mut filename: String,
  id: String,
  inline: Option<String>,
  req: &poem::Request,
) -> Result<Response> {
  let inline = inline.unwrap_or("1".to_owned());
  let attachment = match inline.as_str() {
    "1" => "inline",
    _ => "attachment",
  };
  let if_none_match = req.header("if-none-match");
  let stat = oss_service::head_object(&id).await?;
  if stat.is_none() {
    return Ok(Response::builder().status(StatusCode::from_u16(404)?).finish());
  }
  let stat = stat.unwrap();
  let mut response = Response::builder();
  match stat.content_type {
    Some(content_type) => {
      response = response.content_type(content_type);
    },
    None => {},
  };
  filename = filename.trim().to_string();
  if filename.is_empty() {
    filename = stat.filename;
    if filename.is_empty() {
      filename = urlencoding::encode(id.as_str()).to_string();
    }
  } else {
    filename = urlencoding::encode(filename.as_str()).to_string();
  }
  response = response.header("Content-Disposition", format!("{attachment}; filename={filename}"));
  if let Some(last_modified) = &stat.last_modified {
    response = response.header("Last-Modified", last_modified);
  }
  if let Some(etag) = &stat.etag {
    response = response.header("ETag", etag);
  }
  if let Some(content_length) = stat.content_length {
    response = response.header("Content-Length", content_length.to_string());
  }
  if let Some(if_none_match) = if_none_match {
    if let Some(etag) = stat.etag {
      if if_none_match == etag {
        response = response.status(StatusCode::from_u16(304)?);
        return Ok(response.finish());
      }
    }
  }
  let content = oss_service::get_object(&id).await?;
  let response = response.body(content);
  Ok(response)
}

#[handler]
pub async fn download_filename(
  Path(mut filename): Path<String>,
  Query(DownloadQuery { id, inline }): Query<DownloadQuery>,
  req: &poem::Request,
) -> Result<Response> {
  _download(filename, id, inline, req).await
}

#[handler]
pub async fn download(
  Query(DownloadQuery { id, inline }): Query<DownloadQuery>,
  req: &poem::Request,
) -> Result<Response> {
  let filename = "".to_owned();
  _download(filename, id, inline, req).await
}
