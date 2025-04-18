
use std::fmt;
use std::ops::Deref;
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::str::FromStr;
use std::sync::OnceLock;

use serde::{Serialize, Deserialize};

use color_eyre::eyre::{Result,eyre};

use sqlx::encode::{Encode, IsNull};
use sqlx::error::BoxDynError;
use sqlx::MySql;
use sqlx::mysql::MySqlValueRef;
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

use crate::common::context::ArgType;
use crate::common::gql::model::SortInput;

use crate::base::tenant::tenant_model::TenantId;
use crate::base::usr::usr_model::UsrId;
use crate::base::org::org_model::OrgId;

static CAN_SORT_IN_API_DEPT: OnceLock<[&'static str; 3]> = OnceLock::new();

/// 部门 前端允许排序的字段
fn get_can_sort_in_api_dept() -> &'static [&'static str; 3] {
  CAN_SORT_IN_API_DEPT.get_or_init(|| [
    "order_by",
    "create_time",
    "update_time",
  ])
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "DeptModel")]
#[allow(dead_code)]
pub struct DeptModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: DeptId,
  /// 父部门
  #[graphql(name = "parent_id")]
  pub parent_id: DeptId,
  /// 父部门
  #[graphql(name = "parent_id_lbl")]
  pub parent_id_lbl: String,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 部门负责人
  #[graphql(name = "usr_ids")]
  pub usr_ids: Vec<UsrId>,
  /// 部门负责人
  #[graphql(name = "usr_ids_lbl")]
  pub usr_ids_lbl: Vec<String>,
  /// 锁定
  #[graphql(name = "is_locked")]
  pub is_locked: u8,
  /// 锁定
  #[graphql(name = "is_locked_lbl")]
  pub is_locked_lbl: String,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: u8,
  /// 启用
  #[graphql(name = "is_enabled_lbl")]
  pub is_enabled_lbl: String,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: u32,
  /// 组织
  #[graphql(name = "org_id")]
  pub org_id: OrgId,
  /// 组织
  #[graphql(name = "org_id_lbl")]
  pub org_id_lbl: String,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: String,
  /// 是否已删除
  pub is_deleted: u8,
  /// 创建人
  pub create_usr_id: UsrId,
  /// 创建人
  pub create_usr_id_lbl: String,
  /// 创建时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  pub create_time_lbl: String,
  /// 更新人
  pub update_usr_id: UsrId,
  /// 更新人
  pub update_usr_id_lbl: String,
  /// 更新时间
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  pub update_time_lbl: String,
}

impl FromRow<'_, MySqlRow> for DeptModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: DeptId = row.try_get("id")?;
    // 父部门
    let parent_id: DeptId = row.try_get("parent_id")?;
    let parent_id_lbl: Option<String> = row.try_get("parent_id_lbl")?;
    let parent_id_lbl = parent_id_lbl.unwrap_or_default();
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 部门负责人
    let usr_ids: Option<sqlx::types::Json<HashMap<String, UsrId>>> = row.try_get("usr_ids")?;
    let usr_ids = usr_ids.unwrap_or_default().0;
    let usr_ids = {
      let mut keys: Vec<u32> = usr_ids.keys()
        .map(|x| 
          x.parse::<u32>().unwrap_or_default()
        )
        .collect();
      keys.sort();
      keys.into_iter()
        .map(|x| 
          usr_ids.get(&x.to_string())
            .unwrap_or(&UsrId::default())
            .to_owned()
        )
        .collect::<Vec<UsrId>>()
    };
    let usr_ids_lbl: Option<sqlx::types::Json<HashMap<String, String>>> = row.try_get("usr_ids_lbl")?;
    let usr_ids_lbl = usr_ids_lbl.unwrap_or_default().0;
    let usr_ids_lbl = {
      let mut keys: Vec<u32> = usr_ids_lbl.keys()
        .map(|x| 
          x.parse::<u32>()
            .map_err(|_| sqlx::Error::Decode(
              Box::new(sqlx::error::Error::Protocol(
                "usr_ids_lbl order_by Invalid u32".to_string()
              ))
            ))
        )
        .collect::<Result<_, _>>()?;
      keys.sort();
      keys
        .into_iter()
        .map(|x| 
          usr_ids_lbl.get(&x.to_string())
            .map(|x| x.to_owned())
            .unwrap_or_default()
        )
        .collect::<Vec<String>>()
    };
    // 锁定
    let is_locked: u8 = row.try_get("is_locked")?;
    let is_locked_lbl: String = is_locked.to_string();
    // 启用
    let is_enabled: u8 = row.try_get("is_enabled")?;
    let is_enabled_lbl: String = is_enabled.to_string();
    // 排序
    let order_by: u32 = row.try_get("order_by")?;
    // 组织
    let org_id: OrgId = row.try_get("org_id")?;
    let org_id_lbl: Option<String> = row.try_get("org_id_lbl")?;
    let org_id_lbl = org_id_lbl.unwrap_or_default();
    // 备注
    let rem: String = row.try_get("rem")?;
    // 创建人
    let create_usr_id: UsrId = row.try_get("create_usr_id")?;
    let create_usr_id_lbl: Option<String> = row.try_get("create_usr_id_lbl")?;
    let create_usr_id_lbl = create_usr_id_lbl.unwrap_or_default();
    // 创建时间
    let create_time: Option<chrono::NaiveDateTime> = row.try_get("create_time")?;
    let create_time_lbl: String = match create_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => String::new(),
    };
    // 更新人
    let update_usr_id: UsrId = row.try_get("update_usr_id")?;
    let update_usr_id_lbl: Option<String> = row.try_get("update_usr_id_lbl")?;
    let update_usr_id_lbl = update_usr_id_lbl.unwrap_or_default();
    // 更新时间
    let update_time: Option<chrono::NaiveDateTime> = row.try_get("update_time")?;
    let update_time_lbl: String = match update_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => String::new(),
    };
    // 是否已删除
    let is_deleted: u8 = row.try_get("is_deleted")?;
    
    let model = Self {
      tenant_id,
      is_deleted,
      id,
      parent_id,
      parent_id_lbl,
      lbl,
      usr_ids,
      usr_ids_lbl,
      is_locked,
      is_locked_lbl,
      is_enabled,
      is_enabled_lbl,
      order_by,
      org_id,
      org_id_lbl,
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
#[graphql(rename_fields = "snake_case")]
#[allow(dead_code)]
pub struct DeptFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: String,
  /// 父部门
  #[graphql(name = "parent_id")]
  pub parent_id: String,
  /// 父部门
  #[graphql(name = "parent_id_lbl")]
  pub parent_id_lbl: String,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 部门负责人
  #[graphql(name = "usr_ids")]
  pub usr_ids: String,
  /// 部门负责人
  #[graphql(name = "usr_ids_lbl")]
  pub usr_ids_lbl: String,
  /// 锁定
  #[graphql(name = "is_locked")]
  pub is_locked: String,
  /// 锁定
  #[graphql(name = "is_locked_lbl")]
  pub is_locked_lbl: String,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: String,
  /// 启用
  #[graphql(name = "is_enabled_lbl")]
  pub is_enabled_lbl: String,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: String,
  /// 组织
  #[graphql(name = "org_id")]
  pub org_id: String,
  /// 组织
  #[graphql(name = "org_id_lbl")]
  pub org_id_lbl: String,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: String,
  /// 创建人
  #[graphql(name = "create_usr_id")]
  pub create_usr_id: String,
  /// 创建人
  #[graphql(name = "create_usr_id_lbl")]
  pub create_usr_id_lbl: String,
  /// 创建时间
  #[graphql(name = "create_time")]
  pub create_time: String,
  /// 创建时间
  #[graphql(name = "create_time_lbl")]
  pub create_time_lbl: String,
  /// 更新人
  #[graphql(name = "update_usr_id")]
  pub update_usr_id: String,
  /// 更新人
  #[graphql(name = "update_usr_id_lbl")]
  pub update_usr_id_lbl: String,
  /// 更新时间
  #[graphql(name = "update_time")]
  pub update_time: String,
  /// 更新时间
  #[graphql(name = "update_time_lbl")]
  pub update_time_lbl: String,
}

#[derive(InputObject, Default)]
#[graphql(rename_fields = "snake_case")]
#[allow(dead_code)]
pub struct DeptSearch {
  /// ID
  pub id: Option<DeptId>,
  /// ID列表
  pub ids: Option<Vec<DeptId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 父部门
  #[graphql(name = "parent_id")]
  pub parent_id: Option<Vec<DeptId>>,
  /// 父部门
  #[graphql(name = "parent_id_save_null")]
  pub parent_id_is_null: Option<bool>,
  /// 父部门
  #[graphql(name = "parent_id_lbl")]
  pub parent_id_lbl: Option<Vec<String>>,
  /// 父部门
  #[graphql(name = "parent_id_lbl_like")]
  pub parent_id_lbl_like: Option<String>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 名称
  #[graphql(name = "lbl_like")]
  pub lbl_like: Option<String>,
  /// 部门负责人
  #[graphql(name = "usr_ids")]
  pub usr_ids: Option<Vec<UsrId>>,
  /// 部门负责人
  #[graphql(name = "usr_ids_save_null")]
  pub usr_ids_is_null: Option<bool>,
  /// 锁定
  #[graphql(skip)]
  pub is_locked: Option<Vec<u8>>,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: Option<Vec<u8>>,
  /// 排序
  #[graphql(skip)]
  pub order_by: Option<[Option<u32>; 2]>,
  /// 组织
  #[graphql(name = "org_id")]
  pub org_id: Option<Vec<OrgId>>,
  /// 组织
  #[graphql(name = "org_id_save_null")]
  pub org_id_is_null: Option<bool>,
  /// 组织
  #[graphql(name = "org_id_lbl")]
  pub org_id_lbl: Option<Vec<String>>,
  /// 组织
  #[graphql(name = "org_id_lbl_like")]
  pub org_id_lbl_like: Option<String>,
  /// 备注
  #[graphql(skip)]
  pub rem: Option<String>,
  /// 备注
  #[graphql(skip)]
  pub rem_like: Option<String>,
  /// 创建人
  #[graphql(name = "create_usr_id")]
  pub create_usr_id: Option<Vec<UsrId>>,
  /// 创建人
  #[graphql(name = "create_usr_id_save_null")]
  pub create_usr_id_is_null: Option<bool>,
  /// 创建人
  #[graphql(name = "create_usr_id_lbl")]
  pub create_usr_id_lbl: Option<Vec<String>>,
  /// 创建人
  #[graphql(name = "create_usr_id_lbl_like")]
  pub create_usr_id_lbl_like: Option<String>,
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
  pub update_usr_id_lbl: Option<Vec<String>>,
  /// 更新人
  #[graphql(name = "update_usr_id_lbl_like")]
  pub update_usr_id_lbl_like: Option<String>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
}

impl std::fmt::Debug for DeptSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("DeptSearch");
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
    // 父部门
    if let Some(ref parent_id) = self.parent_id {
      item = item.field("parent_id", parent_id);
    }
    if let Some(ref parent_id_is_null) = self.parent_id_is_null {
      item = item.field("parent_id_is_null", parent_id_is_null);
    }
    // 名称
    if let Some(ref lbl) = self.lbl {
      item = item.field("lbl", lbl);
    }
    if let Some(ref lbl_like) = self.lbl_like {
      item = item.field("lbl_like", lbl_like);
    }
    // 部门负责人
    if let Some(ref usr_ids) = self.usr_ids {
      item = item.field("usr_ids", usr_ids);
    }
    // 锁定
    if let Some(ref is_locked) = self.is_locked {
      item = item.field("is_locked", is_locked);
    }
    // 启用
    if let Some(ref is_enabled) = self.is_enabled {
      item = item.field("is_enabled", is_enabled);
    }
    // 排序
    if let Some(ref order_by) = self.order_by {
      item = item.field("order_by", order_by);
    }
    // 组织
    if let Some(ref org_id) = self.org_id {
      item = item.field("org_id", org_id);
    }
    if let Some(ref org_id_is_null) = self.org_id_is_null {
      item = item.field("org_id_is_null", org_id_is_null);
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

#[derive(InputObject, Default, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "DeptInput")]
#[allow(dead_code)]
pub struct DeptInput {
  /// ID
  pub id: Option<DeptId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 父部门
  #[graphql(name = "parent_id")]
  pub parent_id: Option<DeptId>,
  /// 父部门
  #[graphql(name = "parent_id_lbl")]
  pub parent_id_lbl: Option<String>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 部门负责人
  #[graphql(name = "usr_ids")]
  pub usr_ids: Option<Vec<UsrId>>,
  /// 部门负责人
  #[graphql(name = "usr_ids_lbl")]
  pub usr_ids_lbl: Option<Vec<String>>,
  /// 锁定
  #[graphql(name = "is_locked")]
  pub is_locked: Option<u8>,
  /// 锁定
  #[graphql(name = "is_locked_lbl")]
  pub is_locked_lbl: Option<String>,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: Option<u8>,
  /// 启用
  #[graphql(name = "is_enabled_lbl")]
  pub is_enabled_lbl: Option<String>,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: Option<u32>,
  /// 组织
  #[graphql(name = "org_id")]
  pub org_id: Option<OrgId>,
  /// 组织
  #[graphql(name = "org_id_lbl")]
  pub org_id_lbl: Option<String>,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: Option<String>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id: Option<UsrId>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id_lbl: Option<String>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time_lbl: Option<String>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time_save_null: Option<bool>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id: Option<UsrId>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_lbl: Option<String>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time_lbl: Option<String>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time_save_null: Option<bool>,
}

impl From<DeptModel> for DeptInput {
  fn from(model: DeptModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 父部门
      parent_id: model.parent_id.into(),
      parent_id_lbl: model.parent_id_lbl.into(),
      // 名称
      lbl: model.lbl.into(),
      // 部门负责人
      usr_ids: model.usr_ids.into(),
      usr_ids_lbl: model.usr_ids_lbl.into(),
      // 锁定
      is_locked: model.is_locked.into(),
      is_locked_lbl: model.is_locked_lbl.into(),
      // 启用
      is_enabled: model.is_enabled.into(),
      is_enabled_lbl: model.is_enabled_lbl.into(),
      // 排序
      order_by: model.order_by.into(),
      // 组织
      org_id: model.org_id.into(),
      org_id_lbl: model.org_id_lbl.into(),
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

impl From<DeptInput> for DeptSearch {
  fn from(input: DeptInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 父部门
      parent_id: input.parent_id.map(|x| vec![x]),
      // 名称
      lbl: input.lbl,
      // 部门负责人
      usr_ids: input.usr_ids,
      // 锁定
      is_locked: input.is_locked.map(|x| vec![x]),
      // 启用
      is_enabled: input.is_enabled.map(|x| vec![x]),
      // 排序
      order_by: input.order_by.map(|x| [Some(x), Some(x)]),
      // 组织
      org_id: input.org_id.map(|x| vec![x]),
      // 组织
      org_id_lbl: input.org_id_lbl.map(|x| vec![x]),
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

#[derive(Default, Serialize, Deserialize, Clone, Debug, PartialEq, Eq, Hash)]
pub struct DeptId(SmolStr);

impl fmt::Display for DeptId {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}", self.0)
  }
}

#[async_graphql::Scalar(name = "DeptId")]
impl async_graphql::ScalarType for DeptId {
  fn parse(value: async_graphql::Value) -> async_graphql::InputValueResult<Self> {
    match value {
      async_graphql::Value::String(s) => Ok(Self(s.into())),
      _ => Err(async_graphql::InputValueError::expected_type(value)),
    }
  }
  
  fn to_value(&self) -> async_graphql::Value {
    async_graphql::Value::String(self.0.clone().into())
  }
}

impl From<DeptId> for ArgType {
  fn from(value: DeptId) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl From<&DeptId> for ArgType {
  fn from(value: &DeptId) -> Self {
    ArgType::SmolStr(value.clone().into())
  }
}

impl From<DeptId> for SmolStr {
  fn from(id: DeptId) -> Self {
    id.0
  }
}

impl From<SmolStr> for DeptId {
  fn from(s: SmolStr) -> Self {
    Self(s)
  }
}

impl From<&SmolStr> for DeptId {
  fn from(s: &SmolStr) -> Self {
    Self(s.clone())
  }
}

impl From<String> for DeptId {
  fn from(s: String) -> Self {
    Self(s.into())
  }
}

impl From<&str> for DeptId {
  fn from(s: &str) -> Self {
    Self(s.into())
  }
}

impl Deref for DeptId {
  type Target = SmolStr;
  
  fn deref(&self) -> &SmolStr {
    &self.0
  }
}

impl Encode<'_, MySql> for DeptId {
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> sqlx::Result<IsNull, BoxDynError> {
    <&str as Encode<MySql>>::encode(self.as_str(), buf)
  }
  
  fn size_hint(&self) -> usize {
    self.len()
  }
}

impl sqlx::Type<MySql> for DeptId {
  fn type_info() -> <MySql as sqlx::Database>::TypeInfo {
    <&str as sqlx::Type<MySql>>::type_info()
  }
  
  fn compatible(ty: &<MySql as sqlx::Database>::TypeInfo) -> bool {
    <&str as sqlx::Type<MySql>>::compatible(ty)
  }
}

impl<'r> sqlx::Decode<'r, MySql> for DeptId {
  fn decode(
    value: MySqlValueRef<'r>,
  ) -> Result<Self, BoxDynError> {
    <&str as sqlx::Decode<MySql>>::decode(value).map(Self::from)
  }
}

impl PartialEq<str> for DeptId {
  fn eq(&self, other: &str) -> bool {
    self.0 == other
  }
}

/// 部门 检测字段是否允许前端排序
pub fn check_sort_dept(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  let sort = sort.unwrap();
  
  let get_can_sort_in_api_dept = get_can_sort_in_api_dept();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_dept.contains(&prop) {
      return Err(eyre!("check_sort_dept: {}", serde_json::to_string(item)?));
    }
  }
  
  Ok(())
}

/// 获取路由地址
#[allow(dead_code)]
pub fn get_route_path_dept() -> String {
  "/base/dept".to_owned()
}
