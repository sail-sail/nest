#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]
#![allow(clippy::collapsible_if)]

#[allow(unused_imports)]
use std::fmt;
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::str::FromStr;

use serde::{Serialize, Deserialize};
use color_eyre::eyre::{Result, eyre};

#[allow(unused_imports)]
use smol_str::SmolStr;

use sqlx::{
  FromRow,
  mysql::MySqlRow,
  Row,
};

#[allow(unused_imports)]
use async_graphql::{
  SimpleObject,
  InputObject,
  Enum,
};

#[allow(unused_imports)]
use crate::common::context::ArgType;
use crate::common::gql::model::SortInput;
use crate::common::id::{Id, impl_id};
use crate::common::exceptions::service_exception::ServiceException;

use crate::base::tenant::tenant_model::TenantId;
use crate::base::usr::usr_model::UsrId;

static CAN_SORT_IN_API_SEO: [&str; 3] = [
  "order_by",
  "create_time",
  "update_time",
];

/// SEO优化 前端允许排序的字段
fn get_can_sort_in_api_seo() -> &'static [&'static str; 3] {
  &CAN_SORT_IN_API_SEO
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "SeoModel")]
#[allow(dead_code)]
pub struct SeoModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: SeoId,
  /// 图标
  #[graphql(name = "ico")]
  pub ico: SmolStr,
  /// 标题
  #[graphql(name = "lbl")]
  pub lbl: SmolStr,
  /// 描述
  #[graphql(name = "description")]
  pub description: SmolStr,
  /// 关键词
  #[graphql(name = "keywords")]
  pub keywords: SmolStr,
  /// 分享图片
  #[graphql(name = "og_image")]
  pub og_image: SmolStr,
  /// 分享标题
  #[graphql(name = "og_title")]
  pub og_title: SmolStr,
  /// 分享描述
  #[graphql(name = "og_description")]
  pub og_description: SmolStr,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: u32,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: SmolStr,
  /// 是否已删除
  pub is_deleted: u8,
  /// 创建人
  pub create_usr_id: UsrId,
  /// 创建人
  pub create_usr_id_lbl: SmolStr,
  /// 创建时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  pub create_time_lbl: SmolStr,
  /// 更新人
  pub update_usr_id: UsrId,
  /// 更新人
  pub update_usr_id_lbl: SmolStr,
  /// 更新时间
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  pub update_time_lbl: SmolStr,
}

impl FromRow<'_, MySqlRow> for SeoModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: SeoId = row.try_get("id")?;
    // 图标
    let ico: &str = row.try_get("ico")?;
    let ico = SmolStr::new(ico);
    // 标题
    let lbl: &str = row.try_get("lbl")?;
    let lbl = SmolStr::new(lbl);
    // 描述
    let description: &str = row.try_get("description")?;
    let description = SmolStr::new(description);
    // 关键词
    let keywords: &str = row.try_get("keywords")?;
    let keywords = SmolStr::new(keywords);
    // 分享图片
    let og_image: &str = row.try_get("og_image")?;
    let og_image = SmolStr::new(og_image);
    // 分享标题
    let og_title: &str = row.try_get("og_title")?;
    let og_title = SmolStr::new(og_title);
    // 分享描述
    let og_description: &str = row.try_get("og_description")?;
    let og_description = SmolStr::new(og_description);
    // 排序
    let order_by: u32 = row.try_get("order_by")?;
    // 备注
    let rem: &str = row.try_get("rem")?;
    let rem = SmolStr::new(rem);
    // 创建人
    let create_usr_id: UsrId = row.try_get("create_usr_id")?;
    let create_usr_id_lbl: Option<&str> = row.try_get("create_usr_id_lbl")?;
    let create_usr_id_lbl = SmolStr::new(create_usr_id_lbl.unwrap_or_default());
    // 创建时间
    let create_time: Option<chrono::NaiveDateTime> = row.try_get("create_time")?;
    let create_time_lbl: SmolStr = match create_time {
      Some(item) => SmolStr::new(item.format("%Y-%m-%d %H:%M:%S").to_string()),
      None => SmolStr::new(""),
    };
    // 更新人
    let update_usr_id: UsrId = row.try_get("update_usr_id")?;
    let update_usr_id_lbl: Option<&str> = row.try_get("update_usr_id_lbl")?;
    let update_usr_id_lbl = SmolStr::new(update_usr_id_lbl.unwrap_or_default());
    // 更新时间
    let update_time: Option<chrono::NaiveDateTime> = row.try_get("update_time")?;
    let update_time_lbl: SmolStr = match update_time {
      Some(item) => SmolStr::new(item.format("%Y-%m-%d %H:%M:%S").to_string()),
      None => SmolStr::new(""),
    };
    // 是否已删除
    let is_deleted: u8 = row.try_get("is_deleted")?;
    
    let model = Self {
      tenant_id,
      is_deleted,
      id,
      ico,
      lbl,
      description,
      keywords,
      og_image,
      og_title,
      og_description,
      order_by,
      rem,
      create_usr_id,
      create_usr_id_lbl,
      create_time,
      create_time_lbl,
      update_usr_id,
      update_usr_id_lbl,
      update_time,
      update_time_lbl,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case", name = "SeoFieldComment")]
#[allow(dead_code)]
pub struct SeoFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: SmolStr,
  /// 图标
  #[graphql(name = "ico")]
  pub ico: SmolStr,
  /// 标题
  #[graphql(name = "lbl")]
  pub lbl: SmolStr,
  /// 描述
  #[graphql(name = "description")]
  pub description: SmolStr,
  /// 关键词
  #[graphql(name = "keywords")]
  pub keywords: SmolStr,
  /// 分享图片
  #[graphql(name = "og_image")]
  pub og_image: SmolStr,
  /// 分享标题
  #[graphql(name = "og_title")]
  pub og_title: SmolStr,
  /// 分享描述
  #[graphql(name = "og_description")]
  pub og_description: SmolStr,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: SmolStr,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: SmolStr,
  /// 创建人
  #[graphql(name = "create_usr_id")]
  pub create_usr_id: SmolStr,
  /// 创建人
  #[graphql(name = "create_usr_id_lbl")]
  pub create_usr_id_lbl: SmolStr,
  /// 创建时间
  #[graphql(name = "create_time")]
  pub create_time: SmolStr,
  /// 创建时间
  #[graphql(name = "create_time_lbl")]
  pub create_time_lbl: SmolStr,
  /// 更新人
  #[graphql(name = "update_usr_id")]
  pub update_usr_id: SmolStr,
  /// 更新人
  #[graphql(name = "update_usr_id_lbl")]
  pub update_usr_id_lbl: SmolStr,
  /// 更新时间
  #[graphql(name = "update_time")]
  pub update_time: SmolStr,
  /// 更新时间
  #[graphql(name = "update_time_lbl")]
  pub update_time_lbl: SmolStr,
}

#[derive(InputObject, Serialize, Deserialize, Default, Clone)]
#[graphql(rename_fields = "snake_case", name = "SeoSearch")]
#[allow(dead_code)]
pub struct SeoSearch {
  /// ID
  pub id: Option<SeoId>,
  /// ID列表
  pub ids: Option<Vec<SeoId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 图标
  #[graphql(skip)]
  pub ico: Option<SmolStr>,
  /// 图标
  #[graphql(skip)]
  pub ico_like: Option<SmolStr>,
  /// 标题
  #[graphql(name = "lbl")]
  pub lbl: Option<SmolStr>,
  /// 标题
  #[graphql(name = "lbl_like")]
  pub lbl_like: Option<SmolStr>,
  /// 描述
  #[graphql(skip)]
  pub description: Option<SmolStr>,
  /// 描述
  #[graphql(skip)]
  pub description_like: Option<SmolStr>,
  /// 关键词
  #[graphql(skip)]
  pub keywords: Option<SmolStr>,
  /// 关键词
  #[graphql(skip)]
  pub keywords_like: Option<SmolStr>,
  /// 分享图片
  #[graphql(skip)]
  pub og_image: Option<SmolStr>,
  /// 分享图片
  #[graphql(skip)]
  pub og_image_like: Option<SmolStr>,
  /// 分享标题
  #[graphql(skip)]
  pub og_title: Option<SmolStr>,
  /// 分享标题
  #[graphql(skip)]
  pub og_title_like: Option<SmolStr>,
  /// 分享描述
  #[graphql(skip)]
  pub og_description: Option<SmolStr>,
  /// 分享描述
  #[graphql(skip)]
  pub og_description_like: Option<SmolStr>,
  /// 排序
  #[graphql(skip)]
  pub order_by: Option<[Option<u32>; 2]>,
  /// 备注
  #[graphql(skip)]
  pub rem: Option<SmolStr>,
  /// 备注
  #[graphql(skip)]
  pub rem_like: Option<SmolStr>,
  /// 创建人
  #[graphql(name = "create_usr_id")]
  pub create_usr_id: Option<Vec<UsrId>>,
  /// 创建人
  #[graphql(name = "create_usr_id_save_null")]
  pub create_usr_id_is_null: Option<bool>,
  /// 创建人
  #[graphql(name = "create_usr_id_lbl")]
  pub create_usr_id_lbl: Option<Vec<SmolStr>>,
  /// 创建人
  #[graphql(name = "create_usr_id_lbl_like")]
  pub create_usr_id_lbl_like: Option<SmolStr>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
  /// 更新人
  #[graphql(name = "update_usr_id")]
  pub update_usr_id: Option<Vec<UsrId>>,
  /// 更新人
  #[graphql(name = "update_usr_id_save_null")]
  pub update_usr_id_is_null: Option<bool>,
  /// 更新人
  #[graphql(name = "update_usr_id_lbl")]
  pub update_usr_id_lbl: Option<Vec<SmolStr>>,
  /// 更新人
  #[graphql(name = "update_usr_id_lbl_like")]
  pub update_usr_id_lbl_like: Option<SmolStr>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
}

impl std::fmt::Debug for SeoSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("SeoSearch");
    if let Some(ref id) = self.id {
      item = item.field("id", id);
    }
    if let Some(ref ids) = self.ids {
      item = item.field("ids", ids);
    }
    if let Some(ref tenant_id) = self.tenant_id {
      item = item.field("tenant_id", tenant_id);
    }
    if let Some(ref is_deleted) = self.is_deleted {
      if *is_deleted == 1 {
        item = item.field("is_deleted", is_deleted);
      }
    }
    // 图标
    if let Some(ref ico) = self.ico {
      item = item.field("ico", ico);
    }
    if let Some(ref ico_like) = self.ico_like {
      item = item.field("ico_like", ico_like);
    }
    // 标题
    if let Some(ref lbl) = self.lbl {
      item = item.field("lbl", lbl);
    }
    if let Some(ref lbl_like) = self.lbl_like {
      item = item.field("lbl_like", lbl_like);
    }
    // 描述
    if let Some(ref description) = self.description {
      item = item.field("description", description);
    }
    if let Some(ref description_like) = self.description_like {
      item = item.field("description_like", description_like);
    }
    // 关键词
    if let Some(ref keywords) = self.keywords {
      item = item.field("keywords", keywords);
    }
    if let Some(ref keywords_like) = self.keywords_like {
      item = item.field("keywords_like", keywords_like);
    }
    // 分享图片
    if let Some(ref og_image) = self.og_image {
      item = item.field("og_image", og_image);
    }
    if let Some(ref og_image_like) = self.og_image_like {
      item = item.field("og_image_like", og_image_like);
    }
    // 分享标题
    if let Some(ref og_title) = self.og_title {
      item = item.field("og_title", og_title);
    }
    if let Some(ref og_title_like) = self.og_title_like {
      item = item.field("og_title_like", og_title_like);
    }
    // 分享描述
    if let Some(ref og_description) = self.og_description {
      item = item.field("og_description", og_description);
    }
    if let Some(ref og_description_like) = self.og_description_like {
      item = item.field("og_description_like", og_description_like);
    }
    // 排序
    if let Some(ref order_by) = self.order_by {
      item = item.field("order_by", order_by);
    }
    // 备注
    if let Some(ref rem) = self.rem {
      item = item.field("rem", rem);
    }
    if let Some(ref rem_like) = self.rem_like {
      item = item.field("rem_like", rem_like);
    }
    // 创建人
    if let Some(ref create_usr_id) = self.create_usr_id {
      item = item.field("create_usr_id", create_usr_id);
    }
    if let Some(ref create_usr_id_lbl) = self.create_usr_id_lbl {
      item = item.field("create_usr_id_lbl", create_usr_id_lbl);
    }
    if let Some(ref create_usr_id_lbl_like) = self.create_usr_id_lbl_like {
      item = item.field("create_usr_id_lbl_like", create_usr_id_lbl_like);
    }
    if let Some(ref create_usr_id_is_null) = self.create_usr_id_is_null {
      item = item.field("create_usr_id_is_null", create_usr_id_is_null);
    }
    // 创建时间
    if let Some(ref create_time) = self.create_time {
      item = item.field("create_time", create_time);
    }
    // 更新人
    if let Some(ref update_usr_id) = self.update_usr_id {
      item = item.field("update_usr_id", update_usr_id);
    }
    if let Some(ref update_usr_id_lbl) = self.update_usr_id_lbl {
      item = item.field("update_usr_id_lbl", update_usr_id_lbl);
    }
    if let Some(ref update_usr_id_lbl_like) = self.update_usr_id_lbl_like {
      item = item.field("update_usr_id_lbl_like", update_usr_id_lbl_like);
    }
    if let Some(ref update_usr_id_is_null) = self.update_usr_id_is_null {
      item = item.field("update_usr_id_is_null", update_usr_id_is_null);
    }
    // 更新时间
    if let Some(ref update_time) = self.update_time {
      item = item.field("update_time", update_time);
    }
    item.finish()
  }
}

#[derive(InputObject, Serialize, Deserialize, Default, Clone)]
#[graphql(rename_fields = "snake_case", name = "SeoInput")]
#[allow(dead_code)]
pub struct SeoInput {
  /// ID
  pub id: Option<SeoId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 图标
  #[graphql(name = "ico")]
  pub ico: Option<SmolStr>,
  /// 标题
  #[graphql(name = "lbl")]
  pub lbl: Option<SmolStr>,
  /// 描述
  #[graphql(name = "description")]
  pub description: Option<SmolStr>,
  /// 关键词
  #[graphql(name = "keywords")]
  pub keywords: Option<SmolStr>,
  /// 分享图片
  #[graphql(name = "og_image")]
  pub og_image: Option<SmolStr>,
  /// 分享标题
  #[graphql(name = "og_title")]
  pub og_title: Option<SmolStr>,
  /// 分享描述
  #[graphql(name = "og_description")]
  pub og_description: Option<SmolStr>,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: Option<u32>,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: Option<SmolStr>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id: Option<UsrId>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id_lbl: Option<SmolStr>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time_lbl: Option<SmolStr>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time_save_null: Option<bool>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id: Option<UsrId>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_lbl: Option<SmolStr>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time_lbl: Option<SmolStr>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time_save_null: Option<bool>,
}

impl std::fmt::Debug for SeoInput {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("SeoInput");
    if let Some(ref id) = self.id {
      item = item.field("id", id);
    }
    if let Some(ref is_deleted) = self.is_deleted {
      if *is_deleted == 1 {
        item = item.field("is_deleted", is_deleted);
      }
    }
    if let Some(ref tenant_id) = self.tenant_id {
      item = item.field("tenant_id", tenant_id);
    }
    if let Some(ref ico) = self.ico {
      item = item.field("ico", ico);
    }
    if let Some(ref lbl) = self.lbl {
      item = item.field("lbl", lbl);
    }
    if let Some(ref description) = self.description {
      item = item.field("description", description);
    }
    if let Some(ref keywords) = self.keywords {
      item = item.field("keywords", keywords);
    }
    if let Some(ref og_image) = self.og_image {
      item = item.field("og_image", og_image);
    }
    if let Some(ref og_title) = self.og_title {
      item = item.field("og_title", og_title);
    }
    if let Some(ref og_description) = self.og_description {
      item = item.field("og_description", og_description);
    }
    if let Some(ref order_by) = self.order_by {
      item = item.field("order_by", order_by);
    }
    if let Some(ref rem) = self.rem {
      item = item.field("rem", rem);
    }
    if let Some(ref create_usr_id) = self.create_usr_id {
      item = item.field("create_usr_id", create_usr_id);
    }
    if let Some(ref create_usr_id_lbl) = self.create_usr_id_lbl {
      item = item.field("create_usr_id_lbl", create_usr_id_lbl);
    }
    if let Some(ref create_time) = self.create_time {
      item = item.field("create_time", create_time);
    }
    if let Some(ref update_usr_id) = self.update_usr_id {
      item = item.field("update_usr_id", update_usr_id);
    }
    if let Some(ref update_usr_id_lbl) = self.update_usr_id_lbl {
      item = item.field("update_usr_id_lbl", update_usr_id_lbl);
    }
    if let Some(ref update_time) = self.update_time {
      item = item.field("update_time", update_time);
    }
    item.finish()
  }
}

impl From<SeoModel> for SeoInput {
  fn from(model: SeoModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 图标
      ico: model.ico.into(),
      // 标题
      lbl: model.lbl.into(),
      // 描述
      description: model.description.into(),
      // 关键词
      keywords: model.keywords.into(),
      // 分享图片
      og_image: model.og_image.into(),
      // 分享标题
      og_title: model.og_title.into(),
      // 分享描述
      og_description: model.og_description.into(),
      // 排序
      order_by: model.order_by.into(),
      // 备注
      rem: model.rem.into(),
      // 创建人
      create_usr_id: model.create_usr_id.into(),
      create_usr_id_lbl: model.create_usr_id_lbl.into(),
      // 创建时间
      create_time: model.create_time,
      create_time_lbl: model.create_time_lbl.into(),
      create_time_save_null: Some(true),
      // 更新人
      update_usr_id: model.update_usr_id.into(),
      update_usr_id_lbl: model.update_usr_id_lbl.into(),
      // 更新时间
      update_time: model.update_time,
      update_time_lbl: model.update_time_lbl.into(),
      update_time_save_null: Some(true),
    }
  }
}

impl From<SeoInput> for SeoSearch {
  fn from(input: SeoInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 图标
      ico: input.ico,
      // 标题
      lbl: input.lbl,
      // 描述
      description: input.description,
      // 关键词
      keywords: input.keywords,
      // 分享图片
      og_image: input.og_image,
      // 分享标题
      og_title: input.og_title,
      // 分享描述
      og_description: input.og_description,
      // 排序
      order_by: input.order_by.map(|x| [Some(x), Some(x)]),
      // 备注
      rem: input.rem,
      // 创建人
      create_usr_id: input.create_usr_id.map(|x| vec![x]),
      // 创建人
      create_usr_id_lbl: input.create_usr_id_lbl.map(|x| vec![x]),
      // 创建时间
      create_time: input.create_time.map(|x| [Some(x), Some(x)]),
      // 更新人
      update_usr_id: input.update_usr_id.map(|x| vec![x]),
      // 更新人
      update_usr_id_lbl: input.update_usr_id_lbl.map(|x| vec![x]),
      // 更新时间
      update_time: input.update_time.map(|x| [Some(x), Some(x)]),
      ..Default::default()
    }
  }
}

impl_id!(SeoId);

/// SEO优化 检测字段是否允许前端排序
pub fn check_sort_seo(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  
  let sort = sort.unwrap_or_default();
  
  if sort.is_empty() {
    return Ok(());
  }
  
  let get_can_sort_in_api_seo = get_can_sort_in_api_seo();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_seo.contains(&prop) {
      return Err(eyre!(ServiceException {
        message: format!("check_sort_seo: {}", serde_json::to_string(item)?).into(),
        trace: true,
        ..Default::default()
      }));
    }
  }
  
  Ok(())
}

// MARK: get_page_path_seo
pub fn get_page_path_seo() -> &'static str {
  "/nuxt/seo"
}

// MARK: get_table_name_seo
pub fn get_table_name_seo() -> &'static str {
  "nuxt_seo"
}
