use std::env;
use color_eyre::eyre::Result;
use s3::{Region, Bucket, BucketConfiguration, creds::Credentials, command::Command};
use s3::request::tokio_backend::HyperRequest;
use s3::request::Request;

#[derive(Debug)]
pub struct StatObject {
  pub last_modified: Option<String>,
  pub content_type: Option<String>,
  pub content_length: Option<i64>,
  pub filename: String,
  pub etag: Option<String>,
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
  let request = HyperRequest::new(&bucket, "", Command::CreateBucket { config }).await?;
  let _ = request.response_data(false).await?;
  Ok(())
}

fn new_bucket() -> Result<Box<Bucket>> {
  let bucket_name = env::var("tmpfile_bucket")?;
  let endpoint = env::var("tmpfile_endpoint").unwrap_or("http://localhost:9000".to_owned());
  let accesskey = env::var("tmpfile_accesskey").unwrap_or_default();
  let secretkey = env::var("tmpfile_secretkey").unwrap_or_default();
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

pub async fn put_object<S: AsRef<str>>(
  path: S,
  content: &[u8],
  content_type: &str,
  filename: &str,
) -> Result<bool> {
  let mut bucket = new_bucket()?;
  bucket.add_header("x-amz-meta-filename", urlencoding::encode(filename).as_ref());
  bucket.put_object_with_content_type(path.as_ref(), content, content_type).await?;
  Ok(true)
}

pub async fn head_object(
  path: &str,
) -> Result<Option<StatObject>> {
  let bucket = new_bucket()?;
  let res = bucket.head_object(path).await;
  let res = match res {
    Ok((res, _)) => res,
    Err(e) => {
      if e.to_string().contains("404") {
        return Ok(None);
      } else {
        return Err(e.into());
      }
    }
  };
  let filename: String = {
    if let Some(metadata) = res.metadata {
      if let Some(f) = metadata.get("filename") {
        f.to_owned()
      } else {
        "".to_owned()
      }
    } else {
      "".to_owned()
    }
  };
  if res.content_length.is_none() || res.content_length.unwrap() <= 0 {
    return Ok(None);
  }
  let stat = StatObject {
    last_modified: res.last_modified,
    content_type: res.content_type,
    content_length: res.content_length,
    filename,
    etag: res.e_tag,
  };
  Ok(stat.into())
}

pub async fn get_object(
  path: &str,
) -> Result<Vec<u8>> {
  let bucket = new_bucket()?;
  let res = bucket.get_object(path).await?;
  Ok(res.into())
}

pub async fn delete_object(
  path: &str,
) -> Result<bool> {
  let head = head_object(path).await?;
  if head.is_none() {
    return Ok(false);
  }
  let bucket = new_bucket()?;
  bucket.delete_object(path).await?;
  Ok(true)
}
