use anyhow::Result;

use super::oss_dao::{self, StatObject};

use crate::gen::base::tenant::tenant_model::TenantId;

/**
 * 上传文件
 */
pub async fn put_object<S: AsRef<str>>(
  path: S,
  content: &[u8],
  content_type: &str,
  filename: &str,
  is_public: Option<&str>,
  tenant_id: Option<TenantId>,
  db: Option<&str>,
) -> Result<bool> {
  let res = oss_dao::put_object(
    path, content, content_type, filename,
    is_public, tenant_id, db,
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
) -> Result<Vec<u8>> {
  let res = oss_dao::get_object(path).await?;
  Ok(res)
}

pub async fn delete_object(
  path: &str,
) -> Result<bool> {
  let res = oss_dao::delete_object(path).await?;
  Ok(res)
}
