<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasPassword = columns.some((column) => column.isPassword);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasEnabled = columns.some((column) => column.COLUMN_NAME === "is_enabled");
const hasDefault = columns.some((column) => column.COLUMN_NAME === "is_default");
const hasOrgId = columns.some((column) => column.COLUMN_NAME === "org_id");
const hasVersion = columns.some((column) => column.COLUMN_NAME === "version");
const hasIsSys = columns.some((column) => column.COLUMN_NAME === "is_sys");
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
use std::collections::HashMap;

use anyhow::Result;

#[allow(unused_imports)]
use crate::common::context::{
  SrvErr,
  Options,
};

use crate::common::gql::model::{PageInput, SortInput};<#
if (table !== "i18n") {
#>

#[allow(unused_imports)]
use crate::src::base::i18n::i18n_dao;<#
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

use super::<#=table#>_model::*;
use super::<#=table#>_dao;

/// 根据搜索条件和分页查找<#=table_comment#>列表
pub async fn find_all(
  search: Option<<#=tableUP#>Search>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<<#=tableUP#>Model>> {
  
  let res = <#=table#>_dao::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找<#=table_comment#>总数
pub async fn find_count(
  search: Option<<#=tableUP#>Search>,
  options: Option<Options>,
) -> Result<i64> {
  
  let res = <#=table#>_dao::find_count(
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个<#=table_comment#>
pub async fn find_one(
  search: Option<<#=tableUP#>Search>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<<#=tableUP#>Model>> {
  
  let model = <#=table#>_dao::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找<#=table_comment#>
pub async fn find_by_id(
  id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<Option<<#=tableUP#>Model>> {
  
  let model = <#=table#>_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
pub async fn set_id_by_lbl(
  input: <#=tableUP#>Input,
) -> Result<<#=tableUP#>Input> {
  
  let input = <#=table#>_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建<#=table_comment#>
#[allow(dead_code)]
pub async fn create(
  input: <#=tableUP#>Input,
  options: Option<Options>,
) -> Result<<#=Table_Up#>Id> {
  
  let id = <#=table#>_dao::create(
    input,
    options,
  ).await?;
  
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
  
  let num = <#=table#>_dao::update_tenant_by_id(
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
  
  let num = <#=table#>_dao::update_org_by_id(
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
#[allow(unused_mut)]
pub async fn update_by_id(
  id: <#=Table_Up#>Id,
  mut input: <#=tableUP#>Input,
  options: Option<Options>,
) -> Result<<#=Table_Up#>Id> {<#
  if (hasLocked) {
  #>
  
  let is_locked = <#=table#>_dao::get_is_locked_by_id(
    id.clone(),
    None,
  ).await?;
  
  if is_locked {
    let table_comment = i18n_dao::ns(
      "<#=table_comment#>".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = i18n_dao::ns(
      "不能修改已经锁定的 {0}".to_owned(),
      map.into(),
    ).await?;
    return Err(SrvErr::msg(err_msg).into());
  }<#
  }
  #><#
  if (hasIsSys && opts.sys_fields && opts.sys_fields.length > 0) {
  #>
  
  // 不能修改系统记录的系统字段
  let model = <#=table#>_dao::find_by_id(
    id.clone(),
    None,
  ).await?;
  
  if let Some(model) = model {
    if model.is_sys == 1 {<#
      for (let i = 0; i < opts.sys_fields.length; i++) {
        const sys_field = opts.sys_fields[i];
        const column = columns.find(item => item.COLUMN_NAME === sys_field);
        if (!column) {
          throw new Error(`${ mod }_${ table }: sys_fields 字段 ${ sys_field } 不存在`);
        }
        let column_comment = column.COLUMN_COMMENT;
        let selectList = [ ];
        if (column_comment.endsWith("multiple")) {
          _data_type = "[String]";
        }
        let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
        if (selectStr) {
          selectList = eval(`(${ selectStr })`);
        }
        if (column_comment.includes("[")) {
          column_comment = column_comment.substring(0, column_comment.indexOf("["));
        }
        const foreignKey = column.foreignKey;
      #><#
        if (!foreignKey && selectList.length === 0 && !column.dict && !column.dictbiz
          && column.DATA_TYPE !== "date" && !column.DATA_TYPE === "datetime"
        ) {
      #>
      // <#=column_comment#>
      input.<#=rustKeyEscape(sys_field)#> = None;<#
        } else if (column.DATA_TYPE === "date" || column.DATA_TYPE === "datetime") {
      #>
      // <#=column_comment#>
      input.<#=rustKeyEscape(sys_field)#> = None;
      input.<#=sys_field#>_lbl = None;<#
        } else if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz) {
      #>
      // <#=column_comment#>
      input.<#=rustKeyEscape(sys_field)#> = None;
      input.<#=sys_field#>_lbl = None;<#
        } else {
      #>
      // <#=column_comment#>
      input.<#=rustKeyEscape(sys_field)#> = None;<#
        }
      #><#
      }
      #>
    }
  }<#
  }
  #>
  
  let res = <#=table#>_dao::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除<#=table_comment#>
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<u64> {<#
  if (hasLocked) {
  #>
  
  let len = ids.len();
  let ids0 = ids.clone();
  let mut ids: Vec<<#=Table_Up#>Id> = vec![];
  for id in ids0 {
    let is_locked = <#=table#>_dao::get_is_locked_by_id(
      id.clone(),
      None,
    ).await?;
    
    if is_locked {
      continue;
    }
    
    ids.push(id);
  }
  if ids.is_empty() && len > 0 {
    let table_comment = i18n_dao::ns(
      "<#=table_comment#>".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = i18n_dao::ns(
      "不能删除已经锁定的 {0}",
      map.into(),
    ).await?;
    return Err(SrvErr::msg(err_msg).into());
  }
  let ids = ids;<#
  }
  #><#
  if (hasIsSys) {
  #>
  
  let len = ids.len();
  let ids0 = ids.clone();
  let mut ids: Vec<<#=Table_Up#>Id> = vec![];
  for id in ids0 {
    let model = <#=table#>_dao::find_by_id(
      id.clone(),
      None,
    ).await?;
    if model.is_none() {
      continue;
    }
    let model = model.unwrap();
    if model.is_sys == 1 {
      continue;
    }
    ids.push(id);
  }
  if ids.is_empty() && len > 0 {
    let err_msg = i18n_dao::ns("不能删除系统记录".to_owned(), None).await?;
    return Err(SrvErr::msg(err_msg).into());
  }<#
  }
  #>
  
  let num = <#=table#>_dao::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}<#
if (hasDefault) {
#>

/// 根据 id 设置默认<#=table_comment#>
#[allow(dead_code)]
pub async fn default_by_id(
  id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = <#=table#>_dao::default_by_id(
    id,
    options,
  ).await?;
  
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
  
  let is_enabled = <#=table#>_dao::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用<#=table_comment#>
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<<#=Table_Up#>Id>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = <#=table#>_dao::enable_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
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
  
  let is_locked = <#=table#>_dao::get_is_locked_by_id(
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
) -> Result<u64> {
  
  let num = <#=table#>_dao::lock_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}<#
}
#>

/// 获取<#=table_comment#>字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<<#=tableUP#>FieldComment> {
  
  let comments = <#=table#>_dao::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原<#=table_comment#>
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = <#=table#>_dao::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除<#=table_comment#>
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = <#=table#>_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}<#
if (hasOrderBy) {
#>

/// 查找 <#=table_comment#> order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = <#=table#>_dao::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}<#
}
#>