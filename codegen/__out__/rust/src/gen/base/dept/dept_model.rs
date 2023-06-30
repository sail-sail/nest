use serde::{Serialize, Deserialize};
use sqlx::{FromRow, mysql::MySqlRow, Row};
use async_graphql::{SimpleObject, InputObject};

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct DeptModel {
  /// ID
  pub id: String,
  /// 父部门
  pub parent_id: String,
  /// 父部门
  pub parent_id_lbl: String,
  /// 名称
  pub lbl: String,
  /// 锁定
  pub is_locked: u8,
  /// 锁定
  pub is_locked_lbl: String,
  /// 启用
  pub is_enabled: u8,
  /// 启用
  pub is_enabled_lbl: String,
  /// 排序
  pub order_by: u32,
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
}

impl FromRow<'_, MySqlRow> for DeptModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // ID
    let id: String = row.try_get("id")?;
    // 父部门
    let parent_id: String = row.try_get("parent_id")?;
    let parent_id_lbl: Option<String> = row.try_get("parent_id_lbl")?;
    let parent_id_lbl = parent_id_lbl.unwrap_or_default();
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 锁定
    let is_locked: u8 = row.try_get("is_locked")?;
    let is_locked_lbl: String = is_locked.to_string();
    // 启用
    let is_enabled: u8 = row.try_get("is_enabled")?;
    let is_enabled_lbl: String = is_enabled.to_string();
    // 排序
    let order_by: u32 = row.try_get("order_by")?;
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
    
    let model = Self {
      id,
      parent_id,
      parent_id_lbl,
      lbl,
      is_locked,
      is_locked_lbl,
      is_enabled,
      is_enabled_lbl,
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

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct DeptFieldComment {
  /// 父部门
  pub parent_id: String,
  /// 父部门
  pub parent_id_lbl: String,
  /// 名称
  pub lbl: String,
  /// 锁定
  pub is_locked: String,
  /// 锁定
  pub is_locked_lbl: String,
  /// 启用
  pub is_enabled: String,
  /// 启用
  pub is_enabled_lbl: String,
  /// 排序
  pub order_by: String,
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
pub struct DeptSearch {
  pub id: Option<String>,
  pub ids: Option<Vec<String>>,
  #[graphql(skip)]
  pub tenant_id: Option<String>,
  pub is_deleted: Option<u8>,
  /// 父部门
  pub parent_id: Option<Vec<String>>,
  /// 父部门
  pub parent_id_is_null: Option<bool>,
  /// 名称
  pub lbl: Option<String>,
  /// 名称
  pub lbl_like: Option<String>,
  /// 锁定
  pub is_locked: Option<Vec<u8>>,
  /// 启用
  pub is_enabled: Option<Vec<u8>>,
  /// 排序
  pub order_by: Option<Vec<u32>>,
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
pub struct DeptInput {
  pub id: Option<String>,
  /// 父部门
  pub parent_id: Option<String>,
  /// 父部门
  pub parent_id_lbl: Option<String>,
  /// 名称
  pub lbl: Option<String>,
  /// 锁定
  pub is_locked: Option<u8>,
  /// 锁定
  pub is_locked_lbl: Option<String>,
  /// 启用
  pub is_enabled: Option<u8>,
  /// 启用
  pub is_enabled_lbl: Option<String>,
  /// 排序
  pub order_by: Option<u32>,
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

impl From<DeptInput> for DeptSearch {
  fn from(input: DeptInput) -> Self {
    Self {
      id: input.id.map(|x| x.into()),
      ids: None,
      tenant_id: None,
      is_deleted: None,
      // 父部门
      parent_id: input.parent_id.map(|x| vec![x.into()]),
      // 名称
      lbl: input.lbl,
      // 锁定
      is_locked: input.is_locked.map(|x| vec![x.into()]),
      // 启用
      is_enabled: input.is_enabled.map(|x| vec![x.into()]),
      // 排序
      order_by: input.order_by.map(|x| vec![x.clone().into(), x.clone().into()]),
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
