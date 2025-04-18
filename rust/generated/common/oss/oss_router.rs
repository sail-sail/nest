use color_eyre::eyre::Result;

use poem::{
  handler, web::{Multipart, Path, Query}, Response,
};
use poem::http::StatusCode;
use serde::{Deserialize, Serialize};
use serde_json::json;

use std::io::Cursor;
use image::ImageReader;
use image::ImageFormat;
use image::imageops::FilterType;
use image::GenericImageView;

use crate::common::context::{
  Ctx,
  get_auth_model,
  get_short_uuid,
};

use crate::common::tmpfile::tmpfile_dao;

use super::oss_service;
use smol_str::SmolStr;

#[derive(Deserialize)]
struct UploadQuery {
  db: Option<String>,
  id: Option<String>,
}

async fn _upload(
  mut multipart: Multipart,
  db: Option<String>,
  id: Option<String>,
) -> Response {
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
      "msg": "upload failed",
      "data": null,
    }).to_string());
    return response;
  }
  let content = content.unwrap();
  let content_type = content_type.unwrap_or("application/octet-stream".to_owned());
  let id: SmolStr = if let Some(id) = id {
    id.into()
  } else {
    get_short_uuid()
  };
  let auth_model = get_auth_model();
  let tenant_id = auth_model.map(|x| x.tenant_id);
  let res = oss_service::put_object(
    id.as_str(), &content, &content_type, &file_name,
    Some("0"), tenant_id, db.as_deref(), Some(id.as_str()),
  ).await;
  if let Err(err) = res {
    let mut response = Response::builder();
    response = response.header("Content-Type", "application/json");
    let response = response.body(json!({
      "code": 1,
      "msg": err.to_string(),
      "data": null,
    }).to_string());
    return response;
  }
  let mut response = Response::builder();
  response = response.header("Content-Type", "application/json");
  response.body(json!({
    "code": 0,
    "data": id,
  }).to_string())
}

#[handler]
pub async fn upload(
  req: &poem::Request,
  mut multipart: Multipart,
  Query(UploadQuery { db, id }): Query<UploadQuery>,
) -> Result<Response> {
  Ctx::resful_builder(Some(req))
    .with_auth()?
    .build()
    .resful_scope({
      _upload(multipart, db, id)
    }).await
}

#[handler]
pub async fn upload_public(
  req: &poem::Request,
  mut multipart: Multipart,
  Query(UploadQuery { db, id }): Query<UploadQuery>,
) -> Result<Response> {
  Ctx::resful_builder(Some(req))
    .build()
    .resful_scope({
      _upload_public(multipart, db, id)
    }).await
}

pub async fn _upload_public(
  mut multipart: Multipart,
  db: Option<String>,
  id: Option<String>,
) -> Response {
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
      "msg": "upload failed",
      "data": null,
    }).to_string());
    return response;
  }
  let content = content.unwrap();
  let content_type = content_type.unwrap_or("application/octet-stream".to_owned());
  let id: SmolStr = if let Some(id) = id {
    id.into()
  } else {
    get_short_uuid()
  };
  let res = oss_service::put_object(
    id.as_str(), &content, &content_type, &file_name,
    Some("1"), None, db.as_deref(), Some(id.as_str()),
  ).await;
  if let Err(err) = res {
    let mut response = Response::builder();
    response = response.header("Content-Type", "application/json");
    let response = response.body(json!({
      "code": 1,
      "msg": err.to_string(),
      "data": null,
    }).to_string());
    return response;
  }
  let mut response = Response::builder();
  response = response.header("Content-Type", "application/json");
  response.body(json!({
    "code": 0,
    "data": id,
  }).to_string())
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
) -> Response {
  if id.is_empty() {
    return Response::builder().status(StatusCode::NOT_FOUND).finish();
  }
  let if_none_match = req.header("if-none-match");
  let inline = inline.unwrap_or("1".to_owned());
  let attachment = match inline.as_str() {
    "1" => "inline",
    _ => "attachment",
  };
  let stat = oss_service::head_object(&id).await
    .ok()
    .flatten();
  if stat.is_none() {
    return Response::builder().status(StatusCode::NOT_FOUND).finish();
  }
  let stat = stat.unwrap();
  if stat.is_public == "0" {
    let auth_model = get_auth_model();
    if auth_model.is_none() || stat.tenant_id.is_none() {
      return Response::builder().status(StatusCode::NOT_FOUND).finish();
    }
    let auth_model = auth_model.unwrap();
    if stat.tenant_id.unwrap() != auth_model.tenant_id.as_str() {
      return Response::builder().status(StatusCode::NOT_FOUND).finish();
    }
  }
  let mut response = Response::builder();
  if let Some(content_length) = stat.content_length {
    if content_length <= 0 {
      return Response::builder().status(StatusCode::NOT_FOUND).finish();
    } else {
      response = response.header("Content-Length", content_length.to_string());
    }
  }
  if let Some(content_type) = &stat.content_type {
    if !content_type.is_empty() {
      response = response.content_type(content_type);
    }
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
  if let Some(last_modified) = &stat.last_modified {
    if !last_modified.is_empty() {
      response = response.header("Last-Modified", last_modified);
    }
  }
  if let Some(etag) = &stat.etag {
    if !etag.is_empty() {
      response = response.header("ETag", etag);
    }
  }
  if let Some(if_none_match) = if_none_match {
    if let Some(etag) = stat.etag {
      if if_none_match == etag {
        response = response.status(StatusCode::NOT_MODIFIED);
        return response.finish();
      }
    }
  }
  // let content = oss_service::get_object(&id).await;
  // if let Err(err) = content {
  //   return Response::builder()
  //     .status(StatusCode::INTERNAL_SERVER_ERROR)
  //     .body(err.to_string());
  // }
  // let content = content.unwrap();
  // if content.is_none() {
  //   return Response::builder().status(StatusCode::NOT_FOUND).finish();
  // }
  // let content = content.unwrap();
  // let content: Vec<u8> = content.into();
  // response = response.header("Content-Length", content.len().to_string());
  // response.body(content)
  let content = oss_service::get_object_stream(&id).await;
  if let Err(err) = content {
    return Response::builder()
      .status(StatusCode::INTERNAL_SERVER_ERROR)
      .body(err.to_string());
  }
  let content = content.unwrap();
  if content.is_none() {
    return Response::builder().status(StatusCode::NOT_FOUND).finish();
  }
  let content = content.unwrap();
  use futures::StreamExt;
  let byte_stream = content.bytes.map(|result| {
    result.map_err(|e| std::io::Error::new(std::io::ErrorKind::Other, e.to_string()))
  });
  response.body(poem::Body::from_bytes_stream(byte_stream))
}

#[handler]
pub async fn download_filename(
  Path(mut filename): Path<String>,
  Query(DownloadQuery { id, inline }): Query<DownloadQuery>,
  req: &poem::Request,
) -> Result<Response> {
  Ctx::resful_builder(Some(req))
    .with_auth_optional()?
    .build()
    .resful_scope({
      _download(filename, id, inline, req)
    }).await
}

#[handler]
pub async fn download(
  Query(DownloadQuery { id, inline }): Query<DownloadQuery>,
  req: &poem::Request,
) -> Result<Response> {
  let filename = "".to_owned();
  Ctx::resful_builder(Some(req))
    .with_auth_optional()?
    .build()
    .resful_scope({
      _download(filename, id, inline, req)
    }).await
}

#[derive(Deserialize, Serialize)]
pub struct ImgQuery {
  id: String,
  inline: Option<String>,
  f: Option<String>,
  w: Option<u32>,
  h: Option<u32>,
  q: Option<u8>,
}

async fn _img(
  ImgQuery {
    id,
    inline,
    f,
    w,
    h,
    q,
  }: ImgQuery,
  req: &poem::Request,
) -> Response {
  
  if id.is_empty() {
    return Response::builder().status(StatusCode::NOT_FOUND).finish();
  }
  
  let if_none_match = req.header("if-none-match");
  let mut filename = "".to_owned();
  let inline = inline.unwrap_or("1".to_owned());
  let attachment = match inline.as_str() {
    "1" => "inline",
    _ => "attachment",
  };
  let stat = oss_service::head_object(&id).await;
  if let Err(err) = stat {
    return Response::builder()
      .status(StatusCode::INTERNAL_SERVER_ERROR)
      .body(err.to_string());
  }
  let stat = stat.unwrap();
  if stat.is_none() {
    return Response::builder().status(StatusCode::NOT_FOUND).finish();
  }
  let stat = stat.unwrap();
  if stat.is_public == "0" {
    let auth_model = get_auth_model();
    if auth_model.is_none() || stat.tenant_id.is_none() {
      return Response::builder().status(StatusCode::NOT_FOUND).finish();
    }
    let auth_model = auth_model.unwrap();
    if stat.tenant_id.unwrap() != auth_model.tenant_id.as_str() {
      return Response::builder().status(StatusCode::NOT_FOUND).finish();
    }
  }
  let mut response = Response::builder();
  if let Some(content_length) = stat.content_length {
    if content_length <= 0 {
      return Response::builder().status(StatusCode::NOT_FOUND).finish();
    }
  }
  if let Some(content_type) = &stat.content_type {
    if !content_type.is_empty() {
      response = response.content_type(content_type);
    }
  }
  filename = filename.trim().to_string();
  let file_name_empty = filename.is_empty();
  if file_name_empty {
    filename = stat.filename;
    if filename.is_empty() {
      filename = urlencoding::encode(id.as_str()).to_string();
    }
  } else {
    filename = urlencoding::encode(filename.as_str()).to_string();
  }
  let cache_id = {
    let mut id = id.clone();
    if let Some(f) = &f {
      id.push_str("-f");
      id.push_str(f);
    }
    if let Some(w) = w {
      id.push_str("-w");
      id.push_str(w.to_string().as_str());
    }
    if let Some(h) = h {
      id.push_str("-h");
      id.push_str(h.to_string().as_str());
    }
    if let Some(q) = q {
      id.push_str("-q");
      id.push_str(q.to_string().as_str());
    }
    id
  };
  let format = f.unwrap_or("webp".to_owned());
  let output_format = match format.as_str() {
    "webp" => ImageFormat::WebP,
    "jpg" => ImageFormat::Jpeg,
    "png" => ImageFormat::Png,
    "ico" => ImageFormat::Ico,
    _ => ImageFormat::WebP,
  };
  let content_type = match format.as_str() {
    "webp" => "image/webp",
    "jpg" => "image/jpeg",
    "png" => "image/png",
    "ico" => "image/x-icon",
    _ => "image/webp",
  };
  // 修改filename后缀名
  let mut filename_vec: Vec<&str> = filename.split('.').collect();
  if filename_vec.len() > 1 {
    filename_vec.pop();
    filename = filename_vec.join(".");
    filename.push('.');
    filename.push_str(format.as_str());
    if filename.contains('"') {
      filename = filename.replace('"', "");
    }
  }
  if let Some(if_none_match) = if_none_match {
    if let Some(etag) = &stat.etag {
      if if_none_match == etag {
        if let Some(last_modified) = &stat.last_modified {
          if !last_modified.is_empty() {
            response = response.header("Last-Modified", last_modified);
          }
        }
        if !etag.is_empty() {
          response = response.header("ETag", etag);
        }
        response = response.header("Content-Disposition", format!("{attachment}; filename=\"{filename}\""));
        response = response.status(StatusCode::NOT_MODIFIED);
        return response.finish();
      } else if !etag.is_empty() {
        response = response.header("ETag", etag);
      }
    }
  }
  let is_img = match &stat.content_type {
    Some(content_type) => {
      content_type.starts_with("image/") && !content_type.starts_with("image/svg")
    },
    None => false,
  };
  if !is_img {
    response = response.header("Content-Disposition", format!("{attachment}; filename=\"{filename}\""));
    let content = oss_service::get_object(&id).await;
    if let Err(err) = content {
      return Response::builder()
        .status(StatusCode::INTERNAL_SERVER_ERROR)
        .body(err.to_string());
    }
    let content = content.unwrap();
    if content.is_none() {
      return Response::builder().status(StatusCode::NOT_FOUND).finish();
    }
    let content = content.unwrap();
    let content: Vec<u8> = content.into();
    let len = content.len();
    response = response.header("Content-Length", len.to_string());
    if let Some(last_modified) = &stat.last_modified {
      if !last_modified.is_empty() {
        response = response.header("Last-Modified", last_modified);
      }
    }
    if let Some(etag) = &stat.etag {
      if !etag.is_empty() {
        response = response.header("ETag", etag);
      }
    }
    return response.body(content);
  }
  
  let stat = tmpfile_dao::head_object(&cache_id).await
    .ok()
    .flatten();
  if let Some(stat) = stat {
    if let Some(content_type) = &stat.content_type {
      if !content_type.is_empty() {
        response = response.content_type(content_type);
      }
    }
    if file_name_empty {
      filename = stat.filename;
      if filename.is_empty() {
        filename = urlencoding::encode(cache_id.as_str()).to_string();
      }
    } else {
      filename = urlencoding::encode(filename.as_str()).to_string();
    }
    if let Some(if_none_match) = if_none_match {
      if let Some(etag) = &stat.etag {
        if if_none_match == etag {
          if let Some(last_modified) = &stat.last_modified {
            if !last_modified.is_empty() {
              response = response.header("Last-Modified", last_modified);
            }
          }
          if !etag.is_empty() {
            response = response.header("ETag", etag);
          }
          response = response.header("Content-Disposition", format!("{attachment}; filename=\"{filename}\""));
          response = response.status(StatusCode::NOT_MODIFIED);
          return response.finish();
        } else if !etag.is_empty() {
          response = response.header("ETag", etag);
        }
      }
    }
    if let Some(etag) = &stat.etag {
      if !etag.is_empty() {
        response = response.header("ETag", etag);
      }
    }
    let content = tmpfile_dao::get_object(&cache_id).await;
    if let Err(err) = content {
      return Response::builder()
        .status(StatusCode::INTERNAL_SERVER_ERROR)
        .body(err.to_string());
    }
    let content = content.unwrap();
    response = response.header("Content-Length", content.len().to_string());
    response = response.header("Content-Disposition", format!("{attachment}; filename=\"{filename}\""));
    response = response.content_type(content_type);
    return response.body(content);
  }
  let content = oss_service::get_object(&id).await;
  if let Err(err) = content {
    return Response::builder()
      .status(StatusCode::INTERNAL_SERVER_ERROR)
      .body(err.to_string());
  }
  let content = content.unwrap();
  if content.is_none() {
    return Response::builder().status(StatusCode::NOT_FOUND).finish();
  }
  let content = content.unwrap();
  let content: Vec<u8> = content.into();
  let len = content.len();
  let small_img = ImageReader::new(Cursor::new(&content)).with_guessed_format();
  if let Err(err) = small_img {
    return Response::builder()
      .status(StatusCode::INTERNAL_SERVER_ERROR)
      .body(err.to_string());
  }
  let small_img = small_img.unwrap();
  let small_img = small_img.decode();
  if let Err(err) = small_img {
    return Response::builder()
      .status(StatusCode::INTERNAL_SERVER_ERROR)
      .body(err.to_string());
  }
  let small_img = small_img.unwrap();
  let (width, height) = small_img.dimensions();
  let mut nwidth = w.unwrap_or(width);
  let mut nheight = h.unwrap_or(height);
  if nwidth > width {
    nwidth = width;
  }
  if nheight > height {
    nheight = height;
  }
  // if nwidth > width || nheight > height {
  //   response = response.header("Content-Length", len.to_string());
  //   let response = response.body(content);
  //   return Ok(response);
  // }
  drop(content);
  let small_img = small_img.resize(nwidth, nheight, FilterType::Lanczos3);
  // let small_img = small_img.into_rgba8();
  let mut content: Vec<u8> = Vec::with_capacity(len);
  let res = small_img.write_to(&mut Cursor::new(&mut content), output_format);
  if let Err(err) = res {
    return Response::builder()
      .status(StatusCode::INTERNAL_SERVER_ERROR)
      .body(err.to_string());
  }
  
  let len = content.len();
  
  // 缓存图片到tmpfile
  let res = tmpfile_dao::put_object(
    &cache_id,
    &content,
    content_type,
    &filename,
  ).await;
  
  if let Err(err) = res {
    return Response::builder()
      .status(StatusCode::INTERNAL_SERVER_ERROR)
      .body(err.to_string());
  }
  
  let stat = tmpfile_dao::head_object(&cache_id).await
    .ok()
    .flatten();
  
  if let Some(stat) = &stat {
    if let Some(if_none_match) = if_none_match {
      if let Some(etag) = &stat.etag {
        if if_none_match == etag {
          if let Some(last_modified) = &stat.last_modified {
            if !last_modified.is_empty() {
              response = response.header("Last-Modified", last_modified);
            }
          }
          if !etag.is_empty() {
            response = response.header("ETag", etag);
          }
          response = response.header("Content-Length", len.to_string());
          response = response.content_type(content_type);
          response = response.header("Content-Disposition", format!("{attachment}; filename=\"{filename}\""));
          response = response.status(StatusCode::NOT_MODIFIED);
          return response.finish();
        } else if !etag.is_empty() {
          response = response.header("ETag", etag);
        }
      }
    }
  }
  if let Some(stat) = stat {
    if let Some(etag) = &stat.etag {
      if !etag.is_empty() {
        response = response.header("ETag", etag);
      }
    }
  }
  response = response.header("Content-Length", len.to_string());
  response = response.content_type(content_type);
  response = response.header("Content-Disposition", format!("{attachment}; filename=\"{filename}\""));
  response.body(content)
}

#[handler]
pub async fn img(
  Query(ImgQuery {
    id,
    inline,
    f,
    w,
    h,
    q,
  }): Query<ImgQuery>,
  req: &poem::Request,
) -> Result<Response> {
  Ctx::resful_builder(Some(req))
    .with_auth_optional()?
    .build()
    .resful_scope({
      _img(ImgQuery {
        id,
        inline,
        f,
        w,
        h,
        q,
      }, req)
    }).await
}
