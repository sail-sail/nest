<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasPassword = columns.some((column) => column.isPassword);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasEnabled = columns.some((column) => column.COLUMN_NAME === "is_enabled");
const hasDefault = columns.some((column) => column.COLUMN_NAME === "is_default");
const hasIsDeleted = columns.some((column) => column.COLUMN_NAME === "is_deleted");
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
#[allow(unused_imports)]
use color_eyre::eyre::{Result,eyre};

#[allow(unused_imports)]
use crate::common::context::{
  Options,
  get_auth_id_err,
  get_auth_org_id,
};

use crate::common::gql::model::{PageInput, SortInput};<#
if (table !== "i18n" && isUseI18n) {
#>

#[allow(unused_imports)]
use crate::src::base::i18n::i18n_dao::ns;<#
}
#><#
if (hasTenant_id) {
#>

use crate::r#gen::base::tenant::tenant_model::TenantId;<#
}
#><#
if (hasOrgId) {
#>

use crate::r#gen::base::org::org_model::OrgId;<#
}
#><#
if (opts.filterDataByCreateUsr || hasOrgId) {
#>

use crate::r#gen::base::usr::usr_dao::{
  find_by_id as find_by_id_usr,
  validate_option as validate_option_usr,
};<#
}
#><#
if (mod === "base" && table === "i18n") {
#>
use crate::src::base::options::options_dao::update_i18n_version;<#
}
#>

use super::<#=table#>_model::*;
use super::<#=table#>_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut <#=tableUP#>Search,
) -> Result<()> {<#
  if (opts.filterDataByCreateUsr || hasOrgId) {
  #>
  
  let usr_id = get_auth_id_err()?;
  let usr_model = validate_option_usr(
    find_by_id_usr(
      usr_id.clone(),
      None,
    ).await?,
  ).await?;<#
    if (hasOrgId) {
  #>
  
  let org_id = get_auth_org_id().unwrap_or_default();
  let mut org_ids: Vec<OrgId> = vec![];
  if !org_id.is_empty() {
    org_ids.push(org_id);
  } else {
    org_ids.append(&mut usr_model.org_ids.clone());
    org_ids.push(OrgId::default());
  }<#
    }
  #>
  let username = usr_model.username.clone();<#
  }
  #><#
  if (opts.filterDataByCreateUsr) {
  #>
  
  if username != "admin" {
    search.create_usr_id = Some(vec![usr_id]);
  }<#
  } else if (hasOrgId) {
  #>
  
  if username != "admin" {
    search.org_id = Some(org_ids);
  }<#
  }
  #>
  Ok(())
}

/// 根据搜索条件和分页查找<#=table_comment#>列表
pub async fn find_all(
  search: Option<<#=tableUP#>Search>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<<#=tableUP#>Model>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
  let res = <#=table#>_dao::find_all(
    Some(search),
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
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
  let res = <#=table#>_dao::find_count(
    Some(search),
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
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
  let model = <#=table#>_dao::find_one(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找<#=table_comment#>
pub async fn find_by_id(
  id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<Option<<#=tableUP#>Model>> {<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
  let model = <#=table#>_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}<#
if (hasDataPermit() && hasCreateUsrId) {
#>

/// 根据 ids 获取<#=table_comment#>是否可编辑数据权限
pub async fn get_editable_data_permits_by_ids(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<Vec<u8>> {
  
  let res = <#=table#>_dao::get_editable_data_permits_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(res)
}<#
}
#>

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
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
pub async fn creates(
  inputs: Vec<<#=tableUP#>Input>,
  options: Option<Options>,
) -> Result<Vec<<#=Table_Up#>Id>> {<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
  let <#=table#>_ids = <#=table#>_dao::creates(
    inputs,
    options,
  ).await?;<#
  if (mod === "base" && table === "i18n") {
  #>
  
  update_i18n_version().await?;<#
  }
  #>
  
  Ok(<#=table#>_ids)
}<#
if (hasTenant_id) {
#>

/// <#=table_comment#>根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: <#=Table_Up#>Id,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
  let num = <#=table#>_dao::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;<#
  if (mod === "base" && table === "i18n") {
  #>
  
  update_i18n_version().await?;<#
  }
  #>
  
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
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #><#
  if (hasLocked) {
  #>
  
  let is_locked = <#=table#>_dao::get_is_locked_by_id(
    id.clone(),
    None,
  ).await?;
  
  if is_locked {<#
    if (isUseI18n) {
    #>
    let table_comment = ns(
      "<#=table_comment#>".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = ns(
      "不能修改已经锁定的 {0}".to_owned(),
      map.into(),
    ).await?;<#
    } else {
    #>
    let err_msg = "不能修改已经锁定的 <#=table_comment#>";<#
    }
    #>
    return Err(eyre!(err_msg));
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
        const column_comment = column.COLUMN_COMMENT;
        if (column_comment.endsWith("multiple")) {
          _data_type = "[String]";
        }
        const foreignKey = column.foreignKey;
      #><#
        if (!foreignKey && !column.dict && !column.dictbiz
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
        } else if (foreignKey || column.dict || column.dictbiz) {
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
  
  let <#=table#>_id = <#=table#>_dao::update_by_id(
    id,
    input,
    options,
  ).await?;<#
  if (mod === "base" && table === "i18n") {
  #>
  
  update_i18n_version().await?;<#
  }
  #>
  
  Ok(<#=table#>_id)
}

/// 根据 ids 删除<#=table_comment#>
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<u64> {<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #><#
  if (hasLocked) {
  #>
  
  let models = <#=table#>_dao::find_all(
    Some(<#=Table_Up#>Search {
      ids: Some(ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  for model in models {
    if model.is_locked == 1 {<#
      if (isUseI18n) {
      #>
      let table_comment = ns(
        "<#=table_comment#>".to_owned(),
        None,
      ).await?;
      let map = HashMap::from([
        ("0".to_owned(), table_comment),
      ]);
      let err_msg = ns(
        "不能删除已经锁定的 {0}",
        map.into(),
      ).await?;<#
      } else {
      #>
      let err_msg = "不能删除已经锁定的 <#=table_comment#>";<#
      }
      #>
      return Err(eyre!(err_msg));
    }
  }<#
  }
  #><#
  if (hasIsSys) {
  #>
  
  let models = <#=table#>_dao::find_all(
    Some(<#=Table_Up#>Search {
      ids: Some(ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  for model in models {
    if model.is_sys == 1 {<#
      if (isUseI18n) {
      #>
      let err_msg = ns("不能删除系统记录".to_owned(), None).await?;<#
      } else {
      #>
      let err_msg = "不能删除系统记录";<#
      }
      #>
      return Err(eyre!(err_msg));
    }
  }<#
  }
  #>
  
  let num = <#=table#>_dao::delete_by_ids(
    ids,
    options,
  ).await?;<#
  if (mod === "base" && table === "i18n") {
  #>
  
  update_i18n_version().await?;<#
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
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
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
) -> Result<bool> {<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
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
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
  let num = <#=table#>_dao::enable_by_ids(
    ids,
    is_enabled,
    options,
  ).await?;<#
  if (mod === "base" && table === "i18n") {
  #>
  
  update_i18n_version().await?;<#
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
) -> Result<bool> {<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
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
) -> Result<u64> {<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
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
) -> Result<<#=tableUP#>FieldComment> {<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
  let comments = <#=table#>_dao::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}<#
if (hasIsDeleted) {
#>

/// 根据 ids 还原<#=table_comment#>
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<u64> {<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
  let num = <#=table#>_dao::revert_by_ids(
    ids,
    options,
  ).await?;<#
  if (mod === "base" && table === "i18n") {
  #>
  
  update_i18n_version().await?;<#
  }
  #>
  
  Ok(num)
}<#
}
#><#
if (hasIsDeleted) {
#>

/// 根据 ids 彻底删除<#=table_comment#>
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<u64> {<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
  let num = <#=table#>_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}<#
}
#><#
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
