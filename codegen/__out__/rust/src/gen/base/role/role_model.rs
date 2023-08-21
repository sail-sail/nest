use serde::{
  Serialize,
  Deserialize,
};

use sqlx::{
  FromRow,
  mysql::MySqlRow,
  Row,
};

use async_graphql::{
  SimpleObject,
  InputObject,
};

use anyhow::Result;
use crate::common::context::Ctx;

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct RoleModel {
  /// ID
  pub id: String,
  /// 名称
  pub lbl: String,
  /// 菜单
  pub menu_ids: Vec<String>,
  /// 菜单
  pub menu_ids_lbl: Vec<String>,
  /// 锁定
  pub is_locked: u8,
  /// 锁定
  pub is_locked_lbl: String,
  /// 启用
  pub is_enabled: u8,
  /// 启用
  pub is_enabled_lbl: String,
  /// 备注
  pub rem: String,
  /// 创建人
  pub create_usr_id: String,
  /// 创建人
  pub create_usr_id_lbl: String,
  /// 创建时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  pub create_time_lbl: String,
  /// 更新人
  pub update_usr_id: String,
  /// 更新人
  pub update_usr_id_lbl: String,
  /// 更新时间
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  pub update_time_lbl: String,
  /// 是否已删除
  is_deleted: u8,
}

impl FromRow<'_, MySqlRow> for RoleModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // ID
    let id: String = row.try_get("id")?;
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 菜单
    let menu_ids: Option<sqlx::types::Json<Vec<String>>> = row.try_get("menu_ids")?;
    let menu_ids = menu_ids.unwrap_or_default().0;
    let menu_ids_lbl: Option<sqlx::types::Json<Vec<String>>> = row.try_get("menu_ids_lbl")?;
    let menu_ids_lbl = menu_ids_lbl.unwrap_or_default().0;
    // 锁定
    let is_locked: u8 = row.try_get("is_locked")?;
    let is_locked_lbl: String = is_locked.to_string();
    // 启用
    let is_enabled: u8 = row.try_get("is_enabled")?;
    let is_enabled_lbl: String = is_enabled.to_string();
    // 备注
    let rem: String = row.try_get("rem")?;
    // 创建人
    let create_usr_id: String = row.try_get("create_usr_id")?;
    let create_usr_id_lbl: Option<String> = row.try_get("create_usr_id_lbl")?;
    let create_usr_id_lbl = create_usr_id_lbl.unwrap_or_default();
    // 创建时间
    let create_time: Option<chrono::NaiveDateTime> = row.try_get("create_time")?;
    let create_time_lbl: String = match create_time {
      Some(create_time) => create_time.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => "".to_owned(),
    };
    // 更新人
    let update_usr_id: String = row.try_get("update_usr_id")?;
    let update_usr_id_lbl: Option<String> = row.try_get("update_usr_id_lbl")?;
    let update_usr_id_lbl = update_usr_id_lbl.unwrap_or_default();
    // 更新时间
    let update_time: Option<chrono::NaiveDateTime> = row.try_get("update_time")?;
    let update_time_lbl: String = match update_time {
      Some(update_time) => update_time.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => "".to_owned(),
    };
    // 是否已删除
    let is_deleted: u8 = row.try_get("is_deleted")?;
    
    let model = Self {
      id,
      lbl,
      menu_ids,
      menu_ids_lbl,
      is_locked,
      is_locked_lbl,
      is_enabled,
      is_enabled_lbl,
      rem,
      create_usr_id,
      create_usr_id_lbl,
      create_time,
      create_time_lbl,
      update_usr_id,
      update_usr_id_lbl,
      update_time,
      update_time_lbl,
      is_deleted,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct RoleFieldComment {
  /// ID
  pub id: String,
  /// 名称
  pub lbl: String,
  /// 菜单
  pub menu_ids: String,
  /// 菜单
  pub menu_ids_lbl: String,
  /// 锁定
  pub is_locked: String,
  /// 锁定
  pub is_locked_lbl: String,
  /// 启用
  pub is_enabled: String,
  /// 启用
  pub is_enabled_lbl: String,
  /// 备注
  pub rem: String,
  /// 创建人
  pub create_usr_id: String,
  /// 创建人
  pub create_usr_id_lbl: String,
  /// 创建时间
  pub create_time: String,
  /// 创建时间
  pub create_time_lbl: String,
  /// 更新人
  pub update_usr_id: String,
  /// 更新人
  pub update_usr_id_lbl: String,
  /// 更新时间
  pub update_time: String,
  /// 更新时间
  pub update_time_lbl: String,
}

#[derive(InputObject, Debug, Default)]
#[graphql(rename_fields = "snake_case")]
pub struct RoleSearch {
  pub id: Option<String>,
  pub ids: Option<Vec<String>>,
  #[graphql(skip)]
  pub tenant_id: Option<String>,
  pub is_deleted: Option<u8>,
  /// 名称
  pub lbl: Option<String>,
  /// 名称
  pub lbl_like: Option<String>,
  /// 菜单
  pub menu_ids: Option<Vec<String>>,
  /// 菜单
  pub menu_ids_is_null: Option<bool>,
  /// 锁定
  pub is_locked: Option<Vec<u8>>,
  /// 启用
  pub is_enabled: Option<Vec<u8>>,
  /// 备注
  pub rem: Option<String>,
  /// 备注
  pub rem_like: Option<String>,
  /// 创建人
  pub create_usr_id: Option<Vec<String>>,
  /// 创建人
  pub create_usr_id_is_null: Option<bool>,
  /// 创建时间
  pub create_time: Option<Vec<chrono::NaiveDateTime>>,
  /// 更新人
  pub update_usr_id: Option<Vec<String>>,
  /// 更新人
  pub update_usr_id_is_null: Option<bool>,
  /// 更新时间
  pub update_time: Option<Vec<chrono::NaiveDateTime>>,
}

#[derive(FromModel, InputObject, Debug, Default, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct RoleInput {
  /// ID
  pub id: Option<String>,
  /// 名称
  pub lbl: Option<String>,
  /// 菜单
  pub menu_ids: Option<Vec<String>>,
  /// 菜单
  pub menu_ids_lbl: Option<Vec<String>>,
  /// 锁定
  pub is_locked: Option<u8>,
  /// 锁定
  pub is_locked_lbl: Option<String>,
  /// 启用
  pub is_enabled: Option<u8>,
  /// 启用
  pub is_enabled_lbl: Option<String>,
  /// 备注
  pub rem: Option<String>,
  /// 创建人
  pub create_usr_id: Option<String>,
  /// 创建人
  pub create_usr_id_lbl: Option<String>,
  /// 创建时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  pub create_time_lbl: Option<String>,
  /// 更新人
  pub update_usr_id: Option<String>,
  /// 更新人
  pub update_usr_id_lbl: Option<String>,
  /// 更新时间
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  pub update_time_lbl: Option<String>,
}

impl RoleInput {
  
  /// 校验, 校验失败时抛出SrvErr异常
  pub async fn validate(
    &self,
    ctx: &mut impl Ctx<'_>,
  ) -> Result<()> {
    
    let field_comments = super::role_dao::get_field_comments(
      ctx,
      None,
    ).await?;
    
    // ID
    crate::common::validators::chars_max_length::chars_max_length(
      ctx,
      self.id.as_ref(),
      22,
      &field_comments.id,
    ).await?;
    crate::common::validators::chars_max_length::chars_max_length(
      ctx,
      self.id.as_ref(),
      22,
      &field_comments.id,
    ).await?;
    
    // 名称
    crate::common::validators::chars_max_length::chars_max_length(
      ctx,
      self.lbl.as_ref(),
      45,
      &field_comments.lbl,
    ).await?;
    crate::common::validators::chars_max_length::chars_max_length(
      ctx,
      self.lbl.as_ref(),
      45,
      &field_comments.lbl,
    ).await?;
    
    // 备注
    crate::common::validators::chars_max_length::chars_max_length(
      ctx,
      self.rem.as_ref(),
      100,
      &field_comments.rem,
    ).await?;
    crate::common::validators::chars_max_length::chars_max_length(
      ctx,
      self.rem.as_ref(),
      100,
      &field_comments.rem,
    ).await?;
    
    // 创建人
    crate::common::validators::chars_max_length::chars_max_length(
      ctx,
      self.create_usr_id.as_ref(),
      22,
      &field_comments.create_usr_id,
    ).await?;
    crate::common::validators::chars_max_length::chars_max_length(
      ctx,
      self.create_usr_id.as_ref(),
      22,
      &field_comments.create_usr_id,
    ).await?;
    
    // 更新人
    crate::common::validators::chars_max_length::chars_max_length(
      ctx,
      self.update_usr_id.as_ref(),
      22,
      &field_comments.update_usr_id,
    ).await?;
    crate::common::validators::chars_max_length::chars_max_length(
      ctx,
      self.update_usr_id.as_ref(),
      22,
      &field_comments.update_usr_id,
    ).await?;
    
    Ok(())
  }
  
}

impl From<RoleInput> for RoleSearch {
  fn from(input: RoleInput) -> Self {
    Self {
      id: input.id.map(|x| x.into()),
      ids: None,
      tenant_id: None,
      is_deleted: None,
      // 名称
      lbl: input.lbl,
      // 菜单
      menu_ids: input.menu_ids,
      // 锁定
      is_locked: input.is_locked.map(|x| vec![x.into()]),
      // 启用
      is_enabled: input.is_enabled.map(|x| vec![x.into()]),
      // 备注
      rem: input.rem,
      // 创建人
      create_usr_id: input.create_usr_id.map(|x| vec![x.into()]),
      // 创建时间
      create_time: input.create_time.map(|x| vec![x.clone().into(), x.clone().into()]),
      // 更新人
      update_usr_id: input.update_usr_id.map(|x| vec![x.into()]),
      // 更新时间
      update_time: input.update_time.map(|x| vec![x.clone().into(), x.clone().into()]),
      ..Default::default()
    }
  }
}
