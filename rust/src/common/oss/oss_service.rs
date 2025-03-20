use color_eyre::eyre::Result;

use super::oss_dao::{self, StatObject};
use s3::request::{ResponseData, ResponseDataStream};

use crate::r#gen::base::tenant::tenant_model::TenantId;

/**
 * 上传文件
 */
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
  let res = oss_dao::put_object(
    path, content, content_type, filename,
    is_public, tenant_id, db, id,
  ).await?;
  Ok(res)
}

pub async fn head_object(
  path: &str,
) -> Result<Option<StatObject>> {
  let res = oss_dao::head_object(path).await?;
  Ok(res)
}

pub async fn get_object(
  path: &str,
) -> Result<Option<ResponseData>> {
  let res: Option<ResponseData> = oss_dao::get_object(path).await?;
  Ok(res)
}

#[allow(dead_code)]
pub async fn get_object_stream(
  path: &str,
) -> Result<Option<ResponseDataStream>> {
  let res: Option<ResponseDataStream> = oss_dao::get_object_stream(path).await?;
  Ok(res)
}

pub async fn delete_object(
  path: &str,
) -> Result<bool> {
  let res = oss_dao::delete_object(path).await?;
  Ok(res)
}
