<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasPassword = columns.some((column) => column.isPassword);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasEnabled = columns.some((column) => column.COLUMN_NAME === "is_enabled");
const hasDefault = columns.some((column) => column.COLUMN_NAME === "is_default");
const hasOrgId = columns.some((column) => column.COLUMN_NAME === "org_id");
const hasVersion = columns.some((column) => column.COLUMN_NAME === "version");
const hasIsHidden = columns.some((column) => column.COLUMN_NAME === "is_hidden");
const hasIsMonth = columns.some((column) => column.isMonth);
const hasNoAdd = columns.some((column) => {
  const column_name = column.COLUMN_NAME;
  if (
    [
      "id",
      "create_usr_id",
      "create_time",
      "update_usr_id",
      "update_time",
    ].includes(column_name)
  ) return false;
  return column.noAdd;
});
const hasNoEdit = columns.some((column) => {
  const column_name = column.COLUMN_NAME;
  if (
    [
      "id",
      "create_usr_id",
      "create_time",
      "update_usr_id",
      "update_time",
    ].includes(column_name)
  ) return false;
  return column.noEdit;
});
const Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
const tableUP = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
const hasDict = columns.some((column) => {
  if (column.ignoreCodegen) {
    return false;
  }
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") {
    return false;
  }
  return column.dict;
});
const hasDictbiz = columns.some((column) => {
  if (column.ignoreCodegen) {
    return false;
  }
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") {
    return false;
  }
  return column.dictbiz;
});
#>#[allow(unused_imports)]
use std::time::Instant;

use anyhow::Result;

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::<#=table#>_model::*;
use super::<#=table#>_service;<#
if (log) {
#>

use crate::src::base::i18n::i18n_service::ns;
use crate::src::base::operation_record::operation_record_service::log;
use crate::gen::base::operation_record::operation_record_model::OperationRecordInput;<#
}
#><#
if (hasTenant_id) {
#>

use crate::gen::base::tenant::tenant_model::TenantId;<#
}
#><#
if (hasOrgId) {
#>

use crate::gen::base::org::org_model::OrgId;<#
}
#>

/// 根据搜索条件和分页查找<#=table_comment#>列表
pub async fn find_all(
  search: Option<<#=tableUP#>Search>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<<#=tableUP#>Model>> {<#
  if (hasIsHidden) {
  #>
  
  let search = Some({
    let mut search = search.unwrap_or_default();
    search.is_hidden = Some(vec![0]);
    search
  });<#
  }
  #>
  
  let res = <#=table#>_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;<#
  if (hasPassword) {
  #>
  
  let mut res = res;
  for model in &mut res {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      const column_name_rust = rustKeyEscape(column_name);
      if (column_name === "id") continue;
      let column_comment = column.COLUMN_COMMENT || "";
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      const isPassword = column.isPassword;
    #><#
      if (isPassword) {
    #>
    // <#=column_comment#>
    model.<#=column_name_rust#> = "".to_owned();<#
      }
    #><#
    }
    #>
  }
  let res = res;<#
  }
  #>
  
  Ok(res)
}

/// 根据条件查找<#=table_comment#>总数
pub async fn find_count(
  search: Option<<#=tableUP#>Search>,
  options: Option<Options>,
) -> Result<i64> {<#
  if (hasIsHidden) {
  #>
  
  let search = Some({
    let mut search = search.unwrap_or_default();
    search.is_hidden = Some(vec![0]);
    search
  });<#
  }
  #>
  
  let num = <#=table#>_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个<#=table_comment#>
pub async fn find_one(
  search: Option<<#=tableUP#>Search>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<<#=tableUP#>Model>> {<#
  if (hasIsHidden) {
  #>
  
  let search = Some({
    let mut search = search.unwrap_or_default();
    search.is_hidden = Some(vec![0]);
    search
  });<#
  }
  #>
  
  let model = <#=table#>_service::find_one(
    search,
    sort,
    options,
  ).await?;<#
  if (hasPassword) {
  #>
  
  let mut model = model;
  if let Some(model) = &mut model {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      const column_name_rust = rustKeyEscape(column_name);
      if (column_name === "id") continue;
      let column_comment = column.COLUMN_COMMENT || "";
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      const isPassword = column.isPassword;
    #><#
      if (isPassword) {
    #>
    // <#=column_comment#>
    model.<#=column_name_rust#> = "".to_owned();<#
      }
    #><#
    }
    #>
  }
  
  let model = model;<#
  }
  #>
  
  Ok(model)
}

/// 根据 id 查找<#=table_comment#>
pub async fn find_by_id(
  id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<Option<<#=tableUP#>Model>> {
  
  let model = <#=table#>_service::find_by_id(
    id,
    options,
  ).await?;<#
  if (hasPassword) {
  #>
  
  let mut model = model;
  if let Some(model) = &mut model {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      const column_name_rust = rustKeyEscape(column_name);
      if (column_name === "id") continue;
      let column_comment = column.COLUMN_COMMENT || "";
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      const isPassword = column.isPassword;
    #><#
      if (isPassword) {
    #>
    // <#=column_comment#>
    model.<#=column_name_rust#> = "".to_owned();<#
      }
    #><#
    }
    #>
  }
  
  let model = model;<#
  }
  #>
  
  Ok(model)
}<#
if (hasDataPermit() && hasCreateUsrId) {
#>

/// 根据 ids 获取<#=table_comment#>是否可编辑数据权限
pub async fn get_editable_data_permits_by_ids(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<Vec<u8>> {
  
  let res = <#=table#>_service::get_editable_data_permits_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(res)
}<#
}
#>

/// 创建<#=table_comment#>
#[allow(dead_code)]
pub async fn create(
  input: <#=tableUP#>Input,
  options: Option<Options>,
) -> Result<<#=Table_Up#>Id> {<#
  if (log) {
  #>
  
  let begin_time = Instant::now();<#
  }
  #>
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = <#=table#>_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    "/<#=mod#>/<#=table#>".to_owned(),
    "add".to_owned(),
  ).await?;
  
  let id = <#=table#>_service::create(
    input,
    options,
  ).await?;<#
  if (log) {
  #>
  
  let new_data = find_by_id(
    id.clone(),
    None,
  ).await?;
  
  let method_lbl = ns("新增".to_owned(), None).await?;
  let table_comment = ns("<#=table_comment#>".to_owned(), None).await?;
  
  let end_time = Instant::now();
  
  let time = {
    let time = (end_time - begin_time).as_millis();
    if time > u32::MAX as u128 {
      u32::MAX
    } else {
      time as u32
    }
  };
  
  log(
    OperationRecordInput {
      module: "<#=mod#>_<#=table#>".to_owned().into(),
      module_lbl: table_comment.clone().into(),
      method: "create".to_owned().into(),
      method_lbl: method_lbl.clone().into(),
      lbl: method_lbl.into(),
      time: time.into(),
      new_data: serde_json::to_string(&new_data)?.into(),
      ..Default::default()
    },
  ).await?;<#
  }
  #>
  
  Ok(id)
}<#
if (hasTenant_id) {
#>

/// <#=table_comment#>根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: <#=Table_Up#>Id,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = <#=table#>_service::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}<#
}
#><#
if (hasOrgId) {
#>

/// <#=table_comment#>根据id修改组织id
#[allow(dead_code)]
pub async fn update_org_by_id(
  id: <#=Table_Up#>Id,
  org_id: OrgId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = <#=table#>_service::update_org_by_id(
    id,
    org_id,
    options,
  ).await?;
  
  Ok(num)
}<#
}
#>

/// 根据 id 修改<#=table_comment#>
#[allow(dead_code)]
pub async fn update_by_id(
  id: <#=Table_Up#>Id,
  input: <#=tableUP#>Input,
  options: Option<Options>,
) -> Result<<#=Table_Up#>Id> {<#
  if (log) {
  #>
  
  let begin_time = Instant::now();<#
  }
  #>
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = <#=table#>_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    "/<#=mod#>/<#=table#>".to_owned(),
    "edit".to_owned(),
  ).await?;<#
  if (log) {
  #>
  
  let old_data = find_by_id(
    id.clone(),
    None,
  ).await?;<#
  }
  #>
  
  let res = <#=table#>_service::update_by_id(
    id,
    input,
    options,
  ).await?;<#
  if (log) {
  #>
  
  let new_data = find_by_id(
    res.clone(),
    None,
  ).await?;
  
  let method_lbl = ns("修改".to_owned(), None).await?;
  let table_comment = ns("<#=table_comment#>".to_owned(), None).await?;
  
  let end_time = Instant::now();
  
  let time = {
    let time = (end_time - begin_time).as_millis();
    if time > u32::MAX as u128 {
      u32::MAX
    } else {
      time as u32
    }
  };
  
  log(
    OperationRecordInput {
      module: "<#=mod#>_<#=table#>".to_owned().into(),
      module_lbl: table_comment.clone().into(),
      method: "updateById".to_owned().into(),
      method_lbl: method_lbl.clone().into(),
      lbl: method_lbl.into(),
      time: time.into(),
      old_data: serde_json::to_string(&old_data)?.into(),
      new_data: serde_json::to_string(&new_data)?.into(),
      ..Default::default()
    },
  ).await?;<#
  }
  #>
  
  Ok(res)
}

/// 根据 ids 删除<#=table_comment#>
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<u64> {<#
  if (log) {
  #>
  
  let begin_time = Instant::now();<#
  }
  #>
  
  use_permit(
    "/<#=mod#>/<#=table#>".to_owned(),
    "delete".to_owned(),
  ).await?;<#
  if (log) {
  #>
  
  let old_data = find_all(
    <#=Table_Up#>Search {
      ids: Some(ids.clone()),
      ..Default::default()
    }.into(),
    None,
    None,
    None,
  ).await?;<#
  }
  #>
  
  let num = <#=table#>_service::delete_by_ids(
    ids,
    options,
  ).await?;<#
  if (log) {
  #>
  
  let method_lbl = ns("删除".to_owned(), None).await?;
  let table_comment = ns("<#=table_comment#>".to_owned(), None).await?;
  
  let end_time = Instant::now();
  
  let time = {
    let time = (end_time - begin_time).as_millis();
    if time > u32::MAX as u128 {
      u32::MAX
    } else {
      time as u32
    }
  };
  
  log(
    OperationRecordInput {
      module: "<#=mod#>_<#=table#>".to_owned().into(),
      module_lbl: table_comment.clone().into(),
      method: "deleteByIds".to_owned().into(),
      method_lbl: method_lbl.clone().into(),
      lbl: method_lbl.into(),
      time: time.into(),
      old_data: serde_json::to_string(&old_data)?.into(),
      ..Default::default()
    },
  ).await?;<#
  }
  #>
  
  Ok(num)
}<#
if (hasDefault) {
#>

/// 根据 id 设置默认<#=table_comment#>
#[allow(dead_code)]
pub async fn default_by_id(
  id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<u64> {<#
  if (log) {
  #>
  
  let begin_time = Instant::now();<#
  }
  #>
  
  use_permit(
    "/<#=mod#>/<#=table#>".to_owned(),
    "edit".to_owned(),
  ).await?;<#
  if (log) {
  #>
  
  let old_data = serde_json::to_string(&ids)?;<#
  }
  #>
  
  let num = <#=table#>_service::default_by_id(
    id,
    options,
  ).await?;<#
  if (log) {
  #>
  
  let method_lbl = ns("默认".to_owned(), None).await?;
  let table_comment = ns("<#=table_comment#>".to_owned(), None).await?;
  
  let end_time = Instant::now();
  
  let time = {
    let time = (end_time - begin_time).as_millis();
    if time > u32::MAX as u128 {
      u32::MAX
    } else {
      time as u32
    }
  };
  
  log(
    OperationRecordInput {
      module: "<#=mod#>_<#=table#>".to_owned().into(),
      module_lbl: table_comment.clone().into(),
      method: "defaultById".to_owned().into(),
      method_lbl: method_lbl.clone().into(),
      lbl: method_lbl.into(),
      time: time.into(),
      old_data: old_data.into(),
      ..Default::default()
    },
  ).await?;<#
  }
  #>
  
  Ok(num)
}<#
}
#><#
if (hasEnabled) {
#>

/// 根据 id 查找<#=table_comment#>是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = <#=table#>_service::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用<#=table_comment#>
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<<#=Table_Up#>Id>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {<#
  if (log) {
  #>
  
  let begin_time = Instant::now();<#
  }
  #>
  
  use_permit(
    "/<#=mod#>/<#=table#>".to_owned(),
    "edit".to_owned(),
  ).await?;<#
  if (log) {
  #>
  
  let old_data = serde_json::to_string(&ids)?;<#
  }
  #>
  
  let num = <#=table#>_service::enable_by_ids(
    ids,
    is_enabled,
    options,
  ).await?;<#
  if (log) {
  #>
  
  let method_lbl = {
    if is_enabled == 0 {
      ns("禁用".to_owned(), None).await?
    } else {
      ns("启用".to_owned(), None).await?
    }
  };
  let method = {
    if is_enabled == 0 {
      "disableByIds".to_owned()
    } else {
      "enableByIds".to_owned()
    }
  };
  let table_comment = ns("<#=table_comment#>".to_owned(), None).await?;
  
  let end_time = Instant::now();
  
  let time = {
    let time = (end_time - begin_time).as_millis();
    if time > u32::MAX as u128 {
      u32::MAX
    } else {
      time as u32
    }
  };
  
  log(
    OperationRecordInput {
      module: "<#=mod#>_<#=table#>".to_owned().into(),
      module_lbl: table_comment.clone().into(),
      method: method.into(),
      method_lbl: method_lbl.clone().into(),
      lbl: method_lbl.into(),
      old_data: old_data.into(),
      time: time.into(),
      ..Default::default()
    },
  ).await?;<#
  }
  #>
  
  Ok(num)
}<#
}
#><#
if (hasLocked) {
#>

/// 根据 id 查找<#=table_comment#>是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id(
  id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = <#=table#>_service::get_is_locked_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁<#=table_comment#>
#[allow(dead_code)]
pub async fn lock_by_ids(
  ids: Vec<<#=Table_Up#>Id>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {<#
  if (log) {
  #>
  
  let begin_time = Instant::now();<#
  }
  #>
  
  use_permit(
    "/<#=mod#>/<#=table#>".to_owned(),
    "edit".to_owned(),
  ).await?;<#
  if (log) {
  #>
  
  let new_data = serde_json::json!({
    "ids": ids,
    "is_locked": is_locked,
  }).to_string();<#
  }
  #>
  
  let num = <#=table#>_service::lock_by_ids(
    ids,
    is_locked,
    options,
  ).await?;<#
  if (log) {
  #>
  
  let method_lbl: String = if is_locked == 0 {
    ns("解锁".to_owned(), None).await?
  } else {
    ns("锁定".to_owned(), None).await?
  };
  let table_comment = ns("<#=table_comment#>".to_owned(), None).await?;
  
  let end_time = Instant::now();
  
  let time = {
    let time = (end_time - begin_time).as_millis();
    if time > u32::MAX as u128 {
      u32::MAX
    } else {
      time as u32
    }
  };
  
  log(
    OperationRecordInput {
      module: "<#=mod#>_<#=table#>".to_owned().into(),
      module_lbl: table_comment.into(),
      method: "lockByIds".to_owned().into(),
      method_lbl: method_lbl.clone().into(),
      lbl: method_lbl.into(),
      time: time.into(),
      new_data: new_data.into(),
      ..Default::default()
    },
  ).await?;<#
  }
  #>
  
  Ok(num)
}<#
}
#>

/// 获取<#=table_comment#>字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<<#=tableUP#>FieldComment> {
  
  let comments = <#=table#>_service::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原<#=table_comment#>
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<u64> {<#
  if (log) {
  #>
  
  let begin_time = Instant::now();<#
  }
  #>
  
  use_permit(
    "/<#=mod#>/<#=table#>".to_owned(),
    "delete".to_owned(),
  ).await?;<#
  if (log) {
  #>
  
  let new_data = serde_json::to_string(&ids)?;<#
  }
  #>
  
  let num = <#=table#>_service::revert_by_ids(
    ids,
    options,
  ).await?;<#
  if (log) {
  #>
  
  let method_lbl = ns("还原".to_owned(), None).await?;
  let table_comment = ns("<#=table_comment#>".to_owned(), None).await?;
  
  let end_time = Instant::now();
  
  let time = {
    let time = (end_time - begin_time).as_millis();
    if time > u32::MAX as u128 {
      u32::MAX
    } else {
      time as u32
    }
  };
  
  log(
    OperationRecordInput {
      module: "<#=mod#>_<#=table#>".to_owned().into(),
      module_lbl: table_comment.clone().into(),
      method: "revertByIds".to_owned().into(),
      method_lbl: method_lbl.clone().into(),
      lbl: method_lbl.into(),
      time: time.into(),
      new_data: new_data.into(),
      ..Default::default()
    },
  ).await?;<#
  }
  #>
  
  Ok(num)
}

/// 根据 ids 彻底删除<#=table_comment#>
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<u64> {<#
  if (log) {
  #>
  
  let begin_time = Instant::now();<#
  }
  #>
  
  use_permit(
    "/<#=mod#>/<#=table#>".to_owned(),
    "force_delete".to_owned(),
  ).await?;<#
  if (log) {
  #>
  
  let old_data = serde_json::to_string(&ids)?;<#
  }
  #>
  
  let num = <#=table#>_service::force_delete_by_ids(
    ids,
    options,
  ).await?;<#
  if (log) {
  #>
  
  let method_lbl = ns("彻底删除".to_owned(), None).await?;
  let table_comment = ns("<#=table_comment#>".to_owned(), None).await?;
  
  let end_time = Instant::now();
  
  let time = {
    let time = (end_time - begin_time).as_millis();
    if time > u32::MAX as u128 {
      u32::MAX
    } else {
      time as u32
    }
  };
  
  log(
    OperationRecordInput {
      module: "<#=mod#>_<#=table#>".to_owned().into(),
      module_lbl: table_comment.clone().into(),
      method: "force_delete".to_owned().into(),
      method_lbl: method_lbl.clone().into(),
      lbl: method_lbl.into(),
      time: time.into(),
      old_data: old_data.into(),
      ..Default::default()
    },
  ).await?;<#
  }
  #>
  
  Ok(num)
}<#
if (hasOrderBy) {
#>

/// 查找 <#=table_comment#> order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = <#=table#>_service::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}<#
}
#>
