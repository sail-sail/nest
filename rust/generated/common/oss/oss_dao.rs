use std::env;
use color_eyre::eyre::{Result, eyre};
use s3::{Region, Bucket, BucketConfiguration, creds::Credentials, command::Command};
use s3::request::tokio_backend::ReqwestRequest;
use s3::request::{Request, ResponseData, ResponseDataStream};

use crate::base::tenant::tenant_model::TenantId;

#[derive(Debug)]
pub struct StatObject {
  pub last_modified: Option<String>,
  pub content_type: Option<String>,
  pub content_length: Option<i64>,
  pub filename: String,
  pub etag: Option<String>,
  pub is_public: String,
  pub tenant_id: Option<String>,
}

#[allow(dead_code)]
pub async fn init() -> Result<()> {
  create_bucket(new_bucket()?).await?;
  Ok(())
}

#[allow(dead_code)]
async fn create_bucket(
  bucket: Box<Bucket>,
) -> Result<()> {
  let mut config = BucketConfiguration::default();
  config.set_region("us-east-1".parse()?);
  let request = ReqwestRequest::new(&bucket, "", Command::CreateBucket { config }).await?;
  let _ = request.response_data(false).await?;
  Ok(())
}

fn new_bucket() -> Result<Box<Bucket>> {
  let bucket_name = env::var("oss_bucket")?;
  let endpoint = env::var("oss_endpoint").unwrap_or("http://localhost:9000".to_owned());
  let accesskey = env::var("oss_accesskey").unwrap_or_default();
  let secretkey = env::var("oss_secretkey").unwrap_or_default();
  let credentials = Credentials::new(
    Some(&accesskey),
    Some(&secretkey),
    None,
    None,
    None,
  )?;
  let bucket =  Bucket::new(
    &bucket_name,
    Region::Custom {
      region: "us-east-1".parse()?,
      endpoint: endpoint.clone(),
    },
    credentials.clone(),
  )?.with_path_style();
  Ok(bucket)
}

/// 上传对象到 OSS
/// path: 存储路径, 通常是数据库存储的附件 id 号
/// content: 文件内容字节数组
/// content_type: 文件类型, 如 "image/png"
/// filename: 文件名, 如 "picture.png"
/// is_public: 是否不登录也可以访问, 默认为 false 私有
/// tenant_id: 租户ID
/// db: 数据库名
/// id: 数据库行ID
#[allow(clippy::too_many_arguments)]
pub async fn put_object<S: AsRef<str>>(
  path: S,
  content: &[u8],
  content_type: &str,
  filename: &str,
  is_public: Option<&str>,
  tenant_id: Option<TenantId>,
  db: Option<&str>,
  id: Option<&str>,
) -> Result<ResponseData> {
  let mut bucket = new_bucket()?;
  bucket.add_header("x-amz-meta-filename", urlencoding::encode(filename).as_ref());
  if let Some(is_public) = is_public {
    bucket.add_header("x-amz-meta-is_public", is_public);
  }
  if let Some(tenant_id) = tenant_id {
    bucket.add_header("x-amz-meta-tenant_id", urlencoding::encode(tenant_id.as_str()).as_ref());
  }
  if let Some(db) = db {
    bucket.add_header("x-amz-meta-db", urlencoding::encode(db).as_ref());
  }
  if let Some(id) = id {
    bucket.add_header("x-amz-meta-id", urlencoding::encode(id).as_ref());
  }
  let res: ResponseData = bucket.put_object_with_content_type(path.as_ref(), content, content_type).await?;
  if res.status_code() == 404 {
    return Err(eyre!("oss bucket not found, please check .env oss_bucket"))
  }
  Ok(res)
}

/// 获取对象元信息
/// path: 存储路径, 通常是数据库存储的附件 id 号
pub async fn head_object(
  path: &str,
) -> Result<Option<StatObject>> {
  let bucket = new_bucket()?;
  let res = bucket.head_object(path).await;
  let res = match res {
    Ok((res, code)) => {
      if code == 404 {
        return Ok(None);
      }
      res
    },
    Err(e) => {
      if e.to_string().contains("404") {
        return Ok(None);
      } else {
        return Err(e.into());
      }
    }
  };
  let filename: String = {
    if let Some(metadata) = res.metadata.as_ref() {
      if let Some(f) = metadata.get("filename") {
        f.to_owned()
      } else {
        "1".to_owned()
      }
    } else {
      "1".to_owned()
    }
  };
  let is_public = {
    if let Some(metadata) = res.metadata.as_ref() {
      if let Some(f) = metadata.get("is_public") {
        f.to_owned()
      } else {
        "1".to_owned()
      }
    } else {
      "1".to_owned()
    }
  };
  let tenant_id = {
    if let Some(metadata) = res.metadata.as_ref() {
      metadata.get("tenant_id").map(|f| f.to_owned())
    } else {
      None
    }
  };
  let stat = StatObject {
    last_modified: res.last_modified,
    content_type: res.content_type,
    content_length: res.content_length,
    filename,
    etag: res.e_tag,
    is_public,
    tenant_id,
  };
  Ok(stat.into())
}

/// 获取对象内容
/// path: 存储路径, 通常是数据库存储的附件 id 号
pub async fn get_object(
  path: &str,
) -> Result<Option<ResponseData>> {
  let bucket = new_bucket()?;
  let res: ResponseData = bucket.get_object(path).await?;
  if res.status_code() == 404 {
    return Ok(None);
  }
  Ok(Some(res))
}

/// 获取对象内容流
/// path: 存储路径, 通常是数据库存储的附件 id 号
#[allow(dead_code)]
pub async fn get_object_stream(
  path: &str,
) -> Result<Option<ResponseDataStream>> {
  let bucket = new_bucket()?;
  let res: ResponseDataStream = bucket.get_object_stream(path).await?;
  if res.status_code == 404 {
    return Ok(None);
  }
  Ok(Some(res))
}

/// 删除对象
/// path: 存储路径, 通常是数据库存储的附件 id 号
pub async fn delete_object(
  path: &str,
) -> Result<bool> {
  tracing::info!(
    "{req_id} oss_dao.delete_object: {path}",
    req_id = crate::common::context::get_req_id(),
  );
  if path.is_empty() {
    return Ok(false);
  }
  let head = head_object(path).await?;
  if head.is_none() {
    return Ok(false);
  }
  let bucket = new_bucket()?;
  bucket.delete_object(path).await?;
  Ok(true)
}
