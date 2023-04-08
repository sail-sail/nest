use anyhow::{Ok, Result};
use s3::request_trait::Request;
use s3::{Region, Bucket, BucketConfiguration, creds::Credentials, command::Command};
use s3::request::Reqwest;

pub async fn create_bucket(
  bucket: &Bucket,
) -> Result<u16> {
  let mut config = BucketConfiguration::default();
  config.set_region("us-east-1".parse()?);
  let request = Reqwest::new(bucket, "", Command::CreateBucket { config });
  let response_data = request.response_data(false).await?;
  let response_text = std::str::from_utf8(response_data.bytes())?;
  println!("create_bucket_response.status_code: {:?}", response_data.status_code());
  println!("create_bucket_response.response_text: {:?}", response_text);
  Ok(response_data.status_code())
}

#[cfg(test)]
mod test {
  use anyhow::{Ok, Result};
  use s3::request_trait::Request;
  use s3::{Region, Bucket, BucketConfiguration, creds::Credentials, command::Command};
  use s3::request::Reqwest;
  use tracing::{info, error};

use crate::common::oss::oss_dao::create_bucket;
  
  #[tokio::test]
  async fn test_oss() -> Result<()> {
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
    let mut bucket =  Bucket::new(
      bucket_name,
      Region::Custom {
        region: "us-east-1".parse()?,
        endpoint: endpoint.clone(),
      },
      credentials.clone(),
    )?.with_path_style();
    let status_code = create_bucket(&bucket).await;
    if status_code.is_err() {
      error!("create_bucket error: {:?}", status_code);
    } else {
      info!("create_bucket status_code: {:?}", status_code);
    }
    
    let s3_path = "test.file";
    let test = b"I'm going to S3!";
    
    bucket.add_header("x-amz-meta-filename", urlencoding::encode("黄智勇.jpg").as_ref());

    let response_data = bucket.put_object_with_content_type(s3_path, test, "text/plain").await?;
    assert_eq!(response_data.status_code(), 200);

    let response_data = bucket.get_object(s3_path).await?;
    assert_eq!(response_data.status_code(), 200);
    assert_eq!(test, response_data.bytes());

    let (head_object_result, code) = bucket.head_object(s3_path).await?;
    assert_eq!(code, 200);
    
    println!("head_object_result.content_type: {:?}", head_object_result.content_type);
    
    println!("head_object_result.metadata: {:?}", head_object_result.metadata);
    
    // let response_data = bucket.delete_object(s3_path).await?;
    // assert_eq!(response_data.status_code(), 204);
    Ok(())
  }
}
