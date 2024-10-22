use anyhow::Result;

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

use crate::common::{context::get_short_uuid, tmpfile::tmpfile_dao};

use super::oss_service;

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
  oss_service::put_object(id.as_str(), &content, &content_type, &file_name).await?;
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
  if id.is_empty() {
    return Ok(Response::builder().status(StatusCode::from_u16(404)?).finish());
  }
  let if_none_match = req.header("if-none-match");
  let inline = inline.unwrap_or("1".to_owned());
  let attachment = match inline.as_str() {
    "1" => "inline",
    _ => "attachment",
  };
  let stat = oss_service::head_object(&id).await?;
  if stat.is_none() {
    return Ok(Response::builder().status(StatusCode::from_u16(404)?).finish());
  }
  let stat = stat.unwrap();
  let mut response = Response::builder();
  if let Some(content_length) = stat.content_length {
    if content_length <= 0 {
      return Ok(Response::builder().status(StatusCode::from_u16(404)?).finish());
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
        response = response.status(StatusCode::from_u16(304)?);
        return Ok(response.finish());
      }
    }
  }
  let content = oss_service::get_object(&id).await?;
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

#[derive(Deserialize, Serialize)]
pub struct ImgQuery {
  id: String,
  inline: Option<String>,
  f: Option<String>,
  w: Option<u32>,
  h: Option<u32>,
  q: Option<u8>,
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
  if id.is_empty() {
    return Ok(Response::builder().status(StatusCode::from_u16(404)?).finish());
  }
  let if_none_match = req.header("if-none-match");
  let mut filename = "".to_owned();
  let inline = inline.unwrap_or("1".to_owned());
  let attachment = match inline.as_str() {
    "1" => "inline",
    _ => "attachment",
  };
  let stat = oss_service::head_object(&id).await?;
  if stat.is_none() {
    return Ok(Response::builder().status(StatusCode::from_u16(404)?).finish());
  }
  let stat = stat.unwrap();
  let mut response = Response::builder();
  if let Some(content_length) = stat.content_length {
    if content_length <= 0 {
      return Ok(Response::builder().status(StatusCode::from_u16(404)?).finish());
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
  let f_is_none = f.is_none();
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
        response = response.status(StatusCode::from_u16(304)?);
        return Ok(response.finish());
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
  if f_is_none || !is_img {
    response = response.header("Content-Disposition", format!("{attachment}; filename=\"{filename}\""));
    let content = oss_service::get_object(&id).await?;
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
    let response = response.body(content);
    return Ok(response);
  }
  
  let stat = tmpfile_dao::head_object(&cache_id).await?;
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
          response = response.status(StatusCode::from_u16(304)?);
          return Ok(response.finish());
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
    let content = tmpfile_dao::get_object(&cache_id).await?;
    response = response.header("Content-Length", content.len().to_string());
    response = response.header("Content-Disposition", format!("{attachment}; filename=\"{filename}\""));
    response = response.content_type(content_type);
    let response = response.body(content);
    return Ok(response);
  }
  let content = oss_service::get_object(&id).await?;
  let len = content.len();
  let img = ImageReader::new(Cursor::new(&content)).with_guessed_format()?.decode()?;
  let (width, height) = img.dimensions();
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
  let img = img.resize(nwidth, nheight, FilterType::Lanczos3);
  // let img = img.into_rgba8();
  let mut content: Vec<u8> = Vec::with_capacity(len);
  img.write_to(&mut Cursor::new(&mut content), output_format)?;
  
  let len = content.len();
  
  // 缓存图片到tmpfile
  tmpfile_dao::put_object(
    &cache_id,
    &content,
    content_type,
    &filename,
  ).await?;
  
  let stat = tmpfile_dao::head_object(&cache_id).await?;
  
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
          response = response.status(StatusCode::from_u16(304)?);
          return Ok(response.finish());
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
  let response = response.body(content);
  Ok(response)
}
