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
pub struct MenuModel {
  /// ID
  pub id: String,
  /// 类型
  pub r#type: String,
  /// 类型
  pub r#type_lbl: String,
  /// 父菜单
  pub parent_id: String,
  /// 父菜单
  pub parent_id_lbl: String,
  /// 名称
  pub lbl: String,
  /// 路由
  pub route_path: String,
  /// 参数
  pub route_query: Option<String>,
  /// 锁定
  pub is_locked: u8,
  /// 锁定
  pub is_locked_lbl: String,
  /// 所在租户
  pub tenant_ids: Vec<String>,
  /// 所在租户
  pub tenant_ids_lbl: Vec<String>,
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
  /// 是否已删除
  is_deleted: u8,
}

impl FromRow<'_, MySqlRow> for MenuModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // ID
    let id: String = row.try_get("id")?;
    // 类型
    let r#type: String = row.try_get("type")?;
    let type_lbl: String = r#type.to_string();
    // 父菜单
    let parent_id: String = row.try_get("parent_id")?;
    let parent_id_lbl: Option<String> = row.try_get("parent_id_lbl")?;
    let parent_id_lbl = parent_id_lbl.unwrap_or_default();
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 路由
    let route_path: String = row.try_get("route_path")?;
    // 参数
    let route_query: Option<String> = row.try_get("route_query")?;
    // 锁定
    let is_locked: u8 = row.try_get("is_locked")?;
    let is_locked_lbl: String = is_locked.to_string();
    // 所在租户
    let tenant_ids: Option<sqlx::types::Json<std::collections::HashMap<String, String>>> = row.try_get("tenant_ids")?;
    let tenant_ids = tenant_ids.unwrap_or_default().0;
    let tenant_ids = {
      let mut keys: Vec<u32> = tenant_ids.keys()
        .map(|x| 
          x.parse::<u32>().unwrap_or_default()
        )
        .collect();
      keys.sort();
      keys.into_iter()
        .map(|x| 
          tenant_ids.get(&x.to_string())
            .unwrap_or(&"".to_owned())
            .to_owned()
        )
        .collect::<Vec<String>>()
    };
    let tenant_ids_lbl: Option<sqlx::types::Json<std::collections::HashMap<String, String>>> = row.try_get("tenant_ids_lbl")?;
    let tenant_ids_lbl = tenant_ids_lbl.unwrap_or_default().0;
    let tenant_ids_lbl = {
      let mut keys: Vec<u32> = tenant_ids_lbl.keys()
        .map(|x| 
          x.parse::<u32>().unwrap_or_default()
        )
        .collect();
      keys.sort();
      keys.into_iter()
        .map(|x| 
          tenant_ids_lbl.get(&x.to_string())
            .unwrap_or(&"".to_owned())
            .to_owned()
        )
        .collect::<Vec<String>>()
    };
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
    // 是否已删除
    let is_deleted: u8 = row.try_get("is_deleted")?;
    
    let model = Self {
      id,
      r#type,
      type_lbl,
      parent_id,
      parent_id_lbl,
      lbl,
      route_path,
      route_query,
      is_locked,
      is_locked_lbl,
      tenant_ids,
      tenant_ids_lbl,
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
      is_deleted,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct MenuFieldComment {
  /// ID
  pub id: String,
  /// 类型
  pub r#type: String,
  /// 类型
  pub r#type_lbl: String,
  /// 父菜单
  pub parent_id: String,
  /// 父菜单
  pub parent_id_lbl: String,
  /// 名称
  pub lbl: String,
  /// 路由
  pub route_path: String,
  /// 参数
  pub route_query: String,
  /// 锁定
  pub is_locked: String,
  /// 锁定
  pub is_locked_lbl: String,
  /// 所在租户
  pub tenant_ids: String,
  /// 所在租户
  pub tenant_ids_lbl: String,
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
pub struct MenuSearch {
  pub id: Option<String>,
  pub ids: Option<Vec<String>>,
  pub is_deleted: Option<u8>,
  /// 类型
  pub r#type: Option<Vec<String>>,
  /// 父菜单
  pub parent_id: Option<Vec<String>>,
  /// 父菜单
  pub parent_id_is_null: Option<bool>,
  /// 名称
  pub lbl: Option<String>,
  /// 名称
  pub lbl_like: Option<String>,
  /// 路由
  pub route_path: Option<String>,
  /// 路由
  pub route_path_like: Option<String>,
  /// 参数
  pub route_query: Option<String>,
  /// 锁定
  pub is_locked: Option<Vec<u8>>,
  /// 所在租户
  pub tenant_ids: Option<Vec<String>>,
  /// 所在租户
  pub tenant_ids_is_null: Option<bool>,
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
pub struct MenuInput {
  /// ID
  pub id: Option<String>,
  /// 类型
  pub r#type: Option<String>,
  /// 类型
  pub type_lbl: Option<String>,
  /// 父菜单
  pub parent_id: Option<String>,
  /// 父菜单
  pub parent_id_lbl: Option<String>,
  /// 名称
  pub lbl: Option<String>,
  /// 路由
  pub route_path: Option<String>,
  /// 参数
  pub route_query: Option<String>,
  /// 锁定
  pub is_locked: Option<u8>,
  /// 锁定
  pub is_locked_lbl: Option<String>,
  /// 所在租户
  pub tenant_ids: Option<Vec<String>>,
  /// 所在租户
  pub tenant_ids_lbl: Option<Vec<String>>,
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

impl From<MenuInput> for MenuSearch {
  fn from(input: MenuInput) -> Self {
    Self {
      id: input.id.map(|x| x.into()),
      ids: None,
      is_deleted: None,
      // 类型
      r#type: input.r#type.map(|x| vec![x.into()]),
      // 父菜单
      parent_id: input.parent_id.map(|x| vec![x.into()]),
      // 名称
      lbl: input.lbl,
      // 路由
      route_path: input.route_path,
      // 参数
      route_query: input.route_query,
      // 锁定
      is_locked: input.is_locked.map(|x| vec![x.into()]),
      // 所在租户
      tenant_ids: input.tenant_ids,
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
