use anyhow::{Result, Ok};
use s3::request_trait::Request;
use s3::{Region, Bucket, BucketConfiguration, creds::Credentials, command::Command};
use s3::request::Reqwest;

pub type OssBucket = Bucket;

#[derive(Debug)]
pub struct StatObject {
  pub content_type: Option<String>,
  pub content_length: Option<i64>,
  pub filename: String,
  pub etag: Option<String>,
}

pub async fn init() -> Result<()> {
  create_bucket(&new_bucket()?).await?;
  Ok(())
}

async fn create_bucket(
  bucket: &Bucket,
) -> Result<()> {
  let mut config = BucketConfiguration::default();
  config.set_region("us-east-1".parse()?);
  let request = Reqwest::new(bucket, "", Command::CreateBucket { config });
  let _ = request.response_data(false).await?;
  Ok(())
}

fn new_bucket() -> Result<OssBucket> {
  let bucket_name = dotenv!("oss_bucket");
  let endpoint = dotenv!("oss_endpoint").to_owned();
  let accesskey = dotenv!("oss_accesskey");
  let secretkey = dotenv!("oss_secretkey");
  let credentials = Credentials::new(
    Some(accesskey),
    Some(secretkey),
    None,
    None,
    None,
  )?;
  let bucket =  Bucket::new(
    bucket_name,
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
) -> Result<StatObject> {
  let bucket = new_bucket()?;
  let (res, _) = bucket.head_object(path).await?;
  let filename: String = {
    if let Some(metadata) = res.metadata {
      if let Some(f) = metadata.get("x-amz-meta-filename") {
        f.to_owned()
      } else {
        "".to_owned()
      }
    } else {
      "".to_owned()
    }
  };
  let stat = StatObject {
    content_type: res.content_type,
    content_length: res.content_length,
    filename,
    etag: res.e_tag,
  };
  Ok(stat)
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
  let bucket = new_bucket()?;
  bucket.delete_object(path).await?;
  Ok(true)
}

#[cfg(test)]
mod test {
  use anyhow::{Ok, Result};

  use crate::common::oss::oss_dao::{new_bucket};
  
  #[tokio::test]
  async fn test_oss() -> Result<()> {
    
    let mut bucket = new_bucket()?;
    
    let s3_path = "test.file";
    let test = b"I'm going to S3!";
    
    // bucket.add_header("x-amz-meta-filename", urlencoding::encode("黄智勇.jpg").as_ref());

    // let response_data = bucket.put_object_with_content_type(s3_path, test, "text/plain").await?;
    // assert_eq!(response_data.status_code(), 200);

    // let response_data = bucket.get_object(s3_path).await?;
    // assert_eq!(response_data.status_code(), 200);
    // assert_eq!(test, response_data.bytes());

    let (head_object_result, code) = bucket.head_object(s3_path).await?;
    assert_eq!(code, 200);
    
    println!("head_object_result.content_type: {:?}", head_object_result);
    
    println!("head_object_result.metadata: {:?}", head_object_result.metadata);
    
    // let response_data = bucket.delete_object(s3_path).await?;
    // assert_eq!(response_data.status_code(), 204);
    Ok(())
  }
}
