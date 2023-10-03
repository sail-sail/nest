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

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct UsrModel {
  /// 租户ID
  pub tenant_id: String,
  /// ID
  pub id: String,
  /// 头像
  pub img: String,
  /// 名称
  pub lbl: String,
  /// 用户名
  pub username: String,
  /// 密码
  pub password: String,
  /// 默认组织
  pub default_org_id: String,
  /// 默认组织
  pub default_org_id_lbl: String,
  /// 锁定
  pub is_locked: u8,
  /// 锁定
  pub is_locked_lbl: String,
  /// 启用
  pub is_enabled: u8,
  /// 启用
  pub is_enabled_lbl: String,
  /// 所属组织
  pub org_ids: Vec<String>,
  /// 所属组织
  pub org_ids_lbl: Vec<String>,
  /// 所属部门
  pub dept_ids: Vec<String>,
  /// 所属部门
  pub dept_ids_lbl: Vec<String>,
  /// 拥有角色
  pub role_ids: Vec<String>,
  /// 拥有角色
  pub role_ids_lbl: Vec<String>,
  /// 备注
  pub rem: String,
  /// 是否已删除
  pub is_deleted: u8,
}

impl FromRow<'_, MySqlRow> for UsrModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: String = row.try_get("id")?;
    // 头像
    let img: String = row.try_get("img")?;
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 用户名
    let username: String = row.try_get("username")?;
    // 密码
    let password = "".to_owned();
    // 默认组织
    let default_org_id: String = row.try_get("default_org_id")?;
    let default_org_id_lbl: Option<String> = row.try_get("default_org_id_lbl")?;
    let default_org_id_lbl = default_org_id_lbl.unwrap_or_default();
    // 锁定
    let is_locked: u8 = row.try_get("is_locked")?;
    let is_locked_lbl: String = is_locked.to_string();
    // 启用
    let is_enabled: u8 = row.try_get("is_enabled")?;
    let is_enabled_lbl: String = is_enabled.to_string();
    // 所属组织
    let org_ids: Option<sqlx::types::Json<std::collections::HashMap<String, String>>> = row.try_get("org_ids")?;
    let org_ids = org_ids.unwrap_or_default().0;
    let org_ids = {
      let mut keys: Vec<u32> = org_ids.keys()
        .map(|x| 
          x.parse::<u32>().unwrap_or_default()
        )
        .collect();
      keys.sort();
      keys.into_iter()
        .map(|x| 
          org_ids.get(&x.to_string())
            .unwrap_or(&"".to_owned())
            .to_owned()
        )
        .collect::<Vec<String>>()
    };
    let org_ids_lbl: Option<sqlx::types::Json<std::collections::HashMap<String, String>>> = row.try_get("org_ids_lbl")?;
    let org_ids_lbl = org_ids_lbl.unwrap_or_default().0;
    let org_ids_lbl = {
      let mut keys: Vec<u32> = org_ids_lbl.keys()
        .map(|x| 
          x.parse::<u32>().unwrap_or_default()
        )
        .collect();
      keys.sort();
      keys.into_iter()
        .map(|x| 
          org_ids_lbl.get(&x.to_string())
            .unwrap_or(&"".to_owned())
            .to_owned()
        )
        .collect::<Vec<String>>()
    };
    // 所属部门
    let dept_ids: Option<sqlx::types::Json<std::collections::HashMap<String, String>>> = row.try_get("dept_ids")?;
    let dept_ids = dept_ids.unwrap_or_default().0;
    let dept_ids = {
      let mut keys: Vec<u32> = dept_ids.keys()
        .map(|x| 
          x.parse::<u32>().unwrap_or_default()
        )
        .collect();
      keys.sort();
      keys.into_iter()
        .map(|x| 
          dept_ids.get(&x.to_string())
            .unwrap_or(&"".to_owned())
            .to_owned()
        )
        .collect::<Vec<String>>()
    };
    let dept_ids_lbl: Option<sqlx::types::Json<std::collections::HashMap<String, String>>> = row.try_get("dept_ids_lbl")?;
    let dept_ids_lbl = dept_ids_lbl.unwrap_or_default().0;
    let dept_ids_lbl = {
      let mut keys: Vec<u32> = dept_ids_lbl.keys()
        .map(|x| 
          x.parse::<u32>().unwrap_or_default()
        )
        .collect();
      keys.sort();
      keys.into_iter()
        .map(|x| 
          dept_ids_lbl.get(&x.to_string())
            .unwrap_or(&"".to_owned())
            .to_owned()
        )
        .collect::<Vec<String>>()
    };
    // 拥有角色
    let role_ids: Option<sqlx::types::Json<std::collections::HashMap<String, String>>> = row.try_get("role_ids")?;
    let role_ids = role_ids.unwrap_or_default().0;
    let role_ids = {
      let mut keys: Vec<u32> = role_ids.keys()
        .map(|x| 
          x.parse::<u32>().unwrap_or_default()
        )
        .collect();
      keys.sort();
      keys.into_iter()
        .map(|x| 
          role_ids.get(&x.to_string())
            .unwrap_or(&"".to_owned())
            .to_owned()
        )
        .collect::<Vec<String>>()
    };
    let role_ids_lbl: Option<sqlx::types::Json<std::collections::HashMap<String, String>>> = row.try_get("role_ids_lbl")?;
    let role_ids_lbl = role_ids_lbl.unwrap_or_default().0;
    let role_ids_lbl = {
      let mut keys: Vec<u32> = role_ids_lbl.keys()
        .map(|x| 
          x.parse::<u32>().unwrap_or_default()
        )
        .collect();
      keys.sort();
      keys.into_iter()
        .map(|x| 
          role_ids_lbl.get(&x.to_string())
            .unwrap_or(&"".to_owned())
            .to_owned()
        )
        .collect::<Vec<String>>()
    };
    // 备注
    let rem: String = row.try_get("rem")?;
    // 是否已删除
    let is_deleted: u8 = row.try_get("is_deleted")?;
    
    let model = Self {
      tenant_id,
      id,
      img,
      lbl,
      username,
      password,
      default_org_id,
      default_org_id_lbl,
      is_locked,
      is_locked_lbl,
      is_enabled,
      is_enabled_lbl,
      org_ids,
      org_ids_lbl,
      dept_ids,
      dept_ids_lbl,
      role_ids,
      role_ids_lbl,
      rem,
      is_deleted,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct UsrFieldComment {
  /// ID
  pub id: String,
  /// 头像
  pub img: String,
  /// 名称
  pub lbl: String,
  /// 用户名
  pub username: String,
  /// 默认组织
  pub default_org_id: String,
  /// 默认组织
  pub default_org_id_lbl: String,
  /// 锁定
  pub is_locked: String,
  /// 锁定
  pub is_locked_lbl: String,
  /// 启用
  pub is_enabled: String,
  /// 启用
  pub is_enabled_lbl: String,
  /// 所属组织
  pub org_ids: String,
  /// 所属组织
  pub org_ids_lbl: String,
  /// 所属部门
  pub dept_ids: String,
  /// 所属部门
  pub dept_ids_lbl: String,
  /// 拥有角色
  pub role_ids: String,
  /// 拥有角色
  pub role_ids_lbl: String,
  /// 备注
  pub rem: String,
}

#[derive(InputObject, Debug, Default)]
#[graphql(rename_fields = "snake_case")]
pub struct UsrSearch {
  pub id: Option<String>,
  pub ids: Option<Vec<String>>,
  #[graphql(skip)]
  pub tenant_id: Option<String>,
  pub is_deleted: Option<u8>,
  /// 头像
  pub img: Option<String>,
  /// 头像
  pub img_like: Option<String>,
  /// 名称
  pub lbl: Option<String>,
  /// 名称
  pub lbl_like: Option<String>,
  /// 用户名
  pub username: Option<String>,
  /// 用户名
  pub username_like: Option<String>,
  /// 密码
  pub password: Option<String>,
  /// 密码
  pub password_like: Option<String>,
  /// 默认组织
  pub default_org_id: Option<Vec<String>>,
  /// 默认组织
  pub default_org_id_is_null: Option<bool>,
  /// 锁定
  pub is_locked: Option<Vec<u8>>,
  /// 启用
  pub is_enabled: Option<Vec<u8>>,
  /// 所属组织
  pub org_ids: Option<Vec<String>>,
  /// 所属组织
  pub org_ids_is_null: Option<bool>,
  /// 所属部门
  pub dept_ids: Option<Vec<String>>,
  /// 所属部门
  pub dept_ids_is_null: Option<bool>,
  /// 拥有角色
  pub role_ids: Option<Vec<String>>,
  /// 拥有角色
  pub role_ids_is_null: Option<bool>,
  /// 备注
  pub rem: Option<String>,
  /// 备注
  pub rem_like: Option<String>,
}

#[derive(FromModel, InputObject, Debug, Default, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct UsrInput {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<String>,
  /// ID
  pub id: Option<String>,
  /// 头像
  pub img: Option<String>,
  /// 名称
  pub lbl: Option<String>,
  /// 用户名
  pub username: Option<String>,
  /// 密码
  pub password: Option<String>,
  /// 默认组织
  pub default_org_id: Option<String>,
  /// 默认组织
  pub default_org_id_lbl: Option<String>,
  /// 锁定
  pub is_locked: Option<u8>,
  /// 锁定
  pub is_locked_lbl: Option<String>,
  /// 启用
  pub is_enabled: Option<u8>,
  /// 启用
  pub is_enabled_lbl: Option<String>,
  /// 所属组织
  pub org_ids: Option<Vec<String>>,
  /// 所属组织
  pub org_ids_lbl: Option<Vec<String>>,
  /// 所属部门
  pub dept_ids: Option<Vec<String>>,
  /// 所属部门
  pub dept_ids_lbl: Option<Vec<String>>,
  /// 拥有角色
  pub role_ids: Option<Vec<String>>,
  /// 拥有角色
  pub role_ids_lbl: Option<Vec<String>>,
  /// 备注
  pub rem: Option<String>,
}

impl From<UsrInput> for UsrSearch {
  fn from(input: UsrInput) -> Self {
    Self {
      id: input.id.map(|x| x.into()),
      ids: None,
      // 住户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 头像
      img: input.img,
      // 名称
      lbl: input.lbl,
      // 用户名
      username: input.username,
      // 密码
      password: input.password,
      // 默认组织
      default_org_id: input.default_org_id.map(|x| vec![x.into()]),
      // 锁定
      is_locked: input.is_locked.map(|x| vec![x.into()]),
      // 启用
      is_enabled: input.is_enabled.map(|x| vec![x.into()]),
      // 所属组织
      org_ids: input.org_ids,
      // 所属部门
      dept_ids: input.dept_ids,
      // 拥有角色
      role_ids: input.role_ids,
      // 备注
      rem: input.rem,
      ..Default::default()
    }
  }
}
