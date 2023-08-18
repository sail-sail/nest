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
pub struct PermitModel {
  /// ID
  pub id: String,
  /// 角色
  pub role_id: String,
  /// 角色
  pub role_id_lbl: String,
  /// 菜单
  pub menu_id: String,
  /// 菜单
  pub menu_id_lbl: String,
  /// 编码
  pub code: String,
  /// 名称
  pub lbl: String,
  /// 可见
  pub is_visible: u8,
  /// 可见
  pub is_visible_lbl: String,
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

impl FromRow<'_, MySqlRow> for PermitModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // ID
    let id: String = row.try_get("id")?;
    // 角色
    let role_id: String = row.try_get("role_id")?;
    let role_id_lbl: Option<String> = row.try_get("role_id_lbl")?;
    let role_id_lbl = role_id_lbl.unwrap_or_default();
    // 菜单
    let menu_id: String = row.try_get("menu_id")?;
    let menu_id_lbl: Option<String> = row.try_get("menu_id_lbl")?;
    let menu_id_lbl = menu_id_lbl.unwrap_or_default();
    // 编码
    let code: String = row.try_get("code")?;
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 可见
    let is_visible: u8 = row.try_get("is_visible")?;
    let is_visible_lbl: String = is_visible.to_string();
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
      role_id,
      role_id_lbl,
      menu_id,
      menu_id_lbl,
      code,
      lbl,
      is_visible,
      is_visible_lbl,
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
pub struct PermitFieldComment {
  /// ID
  pub id: String,
  /// 角色
  pub role_id: String,
  /// 角色
  pub role_id_lbl: String,
  /// 菜单
  pub menu_id: String,
  /// 菜单
  pub menu_id_lbl: String,
  /// 编码
  pub code: String,
  /// 名称
  pub lbl: String,
  /// 可见
  pub is_visible: String,
  /// 可见
  pub is_visible_lbl: String,
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
pub struct PermitSearch {
  pub id: Option<String>,
  pub ids: Option<Vec<String>>,
  #[graphql(skip)]
  pub tenant_id: Option<String>,
  pub is_deleted: Option<u8>,
  /// 角色
  pub role_id: Option<Vec<String>>,
  /// 角色
  pub role_id_is_null: Option<bool>,
  /// 菜单
  pub menu_id: Option<Vec<String>>,
  /// 菜单
  pub menu_id_is_null: Option<bool>,
  /// 编码
  pub code: Option<String>,
  /// 编码
  pub code_like: Option<String>,
  /// 名称
  pub lbl: Option<String>,
  /// 名称
  pub lbl_like: Option<String>,
  /// 可见
  pub is_visible: Option<Vec<u8>>,
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
pub struct PermitInput {
  /// ID
  pub id: Option<String>,
  /// 角色
  pub role_id: Option<String>,
  /// 角色
  pub role_id_lbl: Option<String>,
  /// 菜单
  pub menu_id: Option<String>,
  /// 菜单
  pub menu_id_lbl: Option<String>,
  /// 编码
  pub code: Option<String>,
  /// 名称
  pub lbl: Option<String>,
  /// 可见
  pub is_visible: Option<u8>,
  /// 可见
  pub is_visible_lbl: Option<String>,
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

impl PermitInput {
  
  /// 校验, 校验失败时抛出SrvErr异常
  pub async fn validate(
    &self,
    ctx: &mut impl Ctx<'_>,
  ) -> Result<()> {
    
    let field_comments = super::permit_dao::get_field_comments(
      ctx,
      None,
    ).await?;
    
    // 角色
    crate::common::validators::chars_max_length::chars_max_length(
      ctx,
      self.role_id.as_ref(),
      22,
      &field_comments.role_id,
    ).await?;
    
    // 菜单
    crate::common::validators::chars_max_length::chars_max_length(
      ctx,
      self.menu_id.as_ref(),
      22,
      &field_comments.menu_id,
    ).await?;
    
    // 创建人
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
    
    Ok(())
  }
  
}

impl From<PermitInput> for PermitSearch {
  fn from(input: PermitInput) -> Self {
    Self {
      id: input.id.map(|x| x.into()),
      ids: None,
      tenant_id: None,
      is_deleted: None,
      // 角色
      role_id: input.role_id.map(|x| vec![x.into()]),
      // 菜单
      menu_id: input.menu_id.map(|x| vec![x.into()]),
      // 编码
      code: input.code,
      // 名称
      lbl: input.lbl,
      // 可见
      is_visible: input.is_visible.map(|x| vec![x.into()]),
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
