use color_eyre::eyre::Result;

use poem::{
  handler, web::{Multipart, Path, Query}, Response,
};
use poem::http::StatusCode;
use serde::Deserialize;
use serde_json::json;

use crate::common::context::get_short_uuid;

use super::tmpfile_service;

#[handler]
pub async fn upload(
  mut multipart: Multipart,
) -> Result<Response> {
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
    let mut response = Response::builder();
    response = response.header("Content-Type", "application/json");
    let response = response.body(json!({
      "code": 1,
      "msg": "上传失败",
      "data": null,
    }).to_string());
    return Ok(response);
  }
  let content = content.unwrap();
  let content_type = content_type.unwrap_or("application/octet-stream".to_owned());
  let id = get_short_uuid();
  tmpfile_service::put_object(id.as_str(), &content, &content_type, &file_name).await?;
  let mut response = Response::builder();
  response = response.header("Content-Type", "application/json");
  let response = response.body(json!({
    "code": 0,
    "data": id,
  }).to_string());
  Ok(response)
}

#[handler]
pub async fn delete(
  Query(DownloadQuery { id, inline: _inline }): Query<DownloadQuery>,
) -> Result<String> {
  let res = tmpfile_service::delete_object(&id).await?;
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
  if id.is_empty() {
    return Ok(Response::builder().status(StatusCode::from_u16(404)?).finish());
  }
  let if_none_match = req.header("if-none-match");
  let inline = inline.unwrap_or("1".to_owned());
  let attachment = match inline.as_str() {
    "1" => "inline",
    _ => "attachment",
  };
  let stat = tmpfile_service::head_object(&id).await?;
  if stat.is_none() {
    return Ok(Response::builder().status(StatusCode::from_u16(404)?).finish());
  }
  let stat = stat.unwrap();
  let mut response = Response::builder();
  if let Some(content_length) = stat.content_length
    && content_length <= 0 {
      return Ok(Response::builder().status(StatusCode::from_u16(404)?).finish());
    }
  if let Some(content_type) = stat.content_type
    && !content_type.is_empty() {
      response = response.content_type(content_type);
    }
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
  if let Some(last_modified) = &stat.last_modified
    && !last_modified.is_empty() {
      response = response.header("Last-Modified", last_modified);
    }
  if let Some(etag) = &stat.etag
    && !etag.is_empty() {
      response = response.header("ETag", etag);
    }
  if let Some(if_none_match) = if_none_match
    && let Some(etag) = stat.etag
      && if_none_match == etag {
        response = response.status(StatusCode::from_u16(304)?);
        return Ok(response.finish());
      }
  let content = tmpfile_service::get_object(&id).await?;
  response = response.header("Content-Length", content.len().to_string());
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
