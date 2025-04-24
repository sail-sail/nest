<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasPassword = columns.some((column) => column.isPassword);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasEnabled = columns.some((column) => column.COLUMN_NAME === "is_enabled");
const hasDefault = columns.some((column) => column.COLUMN_NAME === "is_default");
const hasIsDeleted = columns.some((column) => column.COLUMN_NAME === "is_deleted");
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

const tableFieldPermit = columns.some((item) => item.fieldPermit);

// 审核
const hasAudit = !!opts?.audit;
let auditColumn = "";
let auditMod = "";
let auditTable = "";
if (hasAudit) {
  auditColumn = opts.audit.column;
  auditMod = opts.audit.auditMod;
  auditTable = opts.audit.auditTable;
}
// 是否有复核
const hasReviewed = opts?.hasReviewed;
const auditTableUp = auditTable.substring(0, 1).toUpperCase()+auditTable.substring(1);
const auditTable_Up = auditTableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
const auditTableSchema = opts?.audit?.auditTableSchema;

#>#[allow(unused_imports)]
use std::time::Instant;

use color_eyre::eyre::Result;
use tracing::info;

use crate::common::context::{
  get_req_id,
  Options,
};

use crate::common::gql::model::{PageInput, SortInput};
#[allow(unused_imports)]
use crate::common::permit::permit_service::use_permit;

use super::<#=table#>_model::*;
use super::<#=table#>_service;<#
if (auditTable_Up) {
#>

use crate::<#=auditMod#>::<#=auditTable#>::<#=auditTable#>_model::<#=auditTable_Up#>Input;<#
}
#><#
if (tableFieldPermit) {
#>

use crate::common::field_permit::field_permit_service::get_field_permit;<#
}
#><#
if (log) {
#><#
if (isUseI18n) {
#>

use crate::common::i18n::i18n_service::ns;<#
}
#>
use crate::common::operation_record::operation_record_service::log;
use crate::base::operation_record::operation_record_model::OperationRecordInput;<#
}
#><#
if (hasTenant_id) {
#>

use crate::base::tenant::tenant_model::TenantId;<#
}
#>

/// 根据搜索条件和分页查找<#=table_comment#>列表
#[function_name::named]
pub async fn find_all_<#=table#>(
  search: Option<<#=tableUP#>Search>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<<#=tableUP#>Model>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );<#
  if (hasIsHidden) {
  #>
  
  let search = Some({
    let mut search = search.unwrap_or_default();
    search.is_hidden = Some(vec![0]);
    search
  });<#
  }
  #>
  
  check_sort_<#=table#>(sort.as_deref())?;
  
  let models = <#=table#>_service::find_all_<#=table#>(
    search,
    page,
    sort,
    options,
  ).await?;<#
  if (hasPassword) {
  #>
  
  let mut models = models;
  for model in &mut models {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      const column_name_rust = rustKeyEscape(column_name);
      if (column_name === "id") continue;
      const column_comment = column.COLUMN_COMMENT || "";
      const isPassword = column.isPassword;
    #><#
      if (isPassword) {
    #>
    // <#=column_comment#>
    model.<#=column_name_rust#> = String::new();<#
      }
    #><#
    }
    #>
  }
  let models = models;<#
  }
  #><#
  if (tableFieldPermit) {
  #>
  
  let mut models = models;
  {
    let fields = get_field_permit_<#=table#>(
      get_route_path_<#=table#>(),
    ).await?;
    for model in &mut models {
      field_permit_model_<#=table#>(
        model,
        fields.clone(),
      ).await?;
    }
  }
  let models = models;<#
  }
  #>
  
  Ok(models)
}

/// 根据条件查找<#=table_comment#>总数
#[function_name::named]
pub async fn find_count_<#=table#>(
  search: Option<<#=tableUP#>Search>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );<#
  if (hasIsHidden) {
  #>
  
  let search = Some({
    let mut search = search.unwrap_or_default();
    search.is_hidden = Some(vec![0]);
    search
  });<#
  }
  #>
  
  let num = <#=table#>_service::find_count_<#=table#>(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个<#=table_comment#>
#[function_name::named]
pub async fn find_one_<#=table#>(
  search: Option<<#=tableUP#>Search>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<<#=tableUP#>Model>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );<#
  if (hasIsHidden) {
  #>
  
  let search = Some({
    let mut search = search.unwrap_or_default();
    search.is_hidden = Some(vec![0]);
    search
  });<#
  }
  #>
  
  check_sort_<#=table#>(sort.as_deref())?;
  
  let model = <#=table#>_service::find_one_<#=table#>(
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
      const column_comment = column.COLUMN_COMMENT || "";
      const isPassword = column.isPassword;
    #><#
      if (isPassword) {
    #>
    // <#=column_comment#>
    model.<#=column_name_rust#> = String::new();<#
      }
    #><#
    }
    #>
  }
  let model = model;<#
  }
  #><#
  if (tableFieldPermit) {
  #>
  
  let mut model = model;
  {
    let fields = get_field_permit_<#=table#>(
      get_route_path_<#=table#>(),
    ).await?;
    if let Some(model) = &mut model {
      field_permit_model_<#=table#>(
        model,
        fields.clone(),
      ).await?;
    }
  }
  let model = model;<#
  }
  #>
  
  Ok(model)
}

/// 根据 id 查找<#=table_comment#>
#[function_name::named]
pub async fn find_by_id_<#=table#>(
  id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<Option<<#=tableUP#>Model>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = <#=table#>_service::find_by_id_<#=table#>(
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
      const column_comment = column.COLUMN_COMMENT || "";
      const isPassword = column.isPassword;
    #><#
      if (isPassword) {
    #>
    // <#=column_comment#>
    model.<#=column_name_rust#> = String::new();<#
      }
    #><#
    }
    #>
  }
  let model = model;<#
  }
  #><#
  if (tableFieldPermit) {
  #>
  
  let mut model = model;
  {
    let fields = get_field_permit_<#=table#>(
      get_route_path_<#=table#>(),
    ).await?;
    if let Some(model) = &mut model {
      field_permit_model_<#=table#>(
        model,
        fields.clone(),
      ).await?;
    }
  }
  let model = model;<#
  }
  #>
  
  Ok(model)
}

/// 根据 ids 查找<#=table_comment#>
#[function_name::named]
pub async fn find_by_ids_<#=table#>(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<Vec<<#=tableUP#>Model>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = <#=table#>_service::find_by_ids_<#=table#>(
    ids,
    options,
  ).await?;<#
  if (hasPassword) {
  #>
  
  let mut models = models;
  for model in models.iter_mut() {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      const column_name_rust = rustKeyEscape(column_name);
      if (column_name === "id") continue;
      const column_comment = column.COLUMN_COMMENT || "";
      const isPassword = column.isPassword;
    #><#
      if (isPassword) {
    #>
    // <#=column_comment#>
    model.<#=column_name_rust#> = String::new();<#
      }
    #><#
    }
    #>
  }
  let models = models;<#
  }
  #><#
  if (tableFieldPermit) {
  #>
  
  let mut models = models;
  {
    let fields = get_field_permit_<#=table#>(
      get_route_path_<#=table#>(),
    ).await?;
    for model in models.iter_mut() {
      field_permit_model_<#=table#>(
        model,
        fields.clone(),
      ).await?;
    }
  }
  let models = models;<#
  }
  #>
  
  Ok(models)
}<#
if (hasDataPermit() && hasCreateUsrId) {
#>

/// 根据 ids 获取<#=table_comment#>是否可编辑数据权限
#[function_name::named]
pub async fn get_editable_data_permits_by_ids_<#=table#>(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<Vec<u8>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = <#=table#>_service::get_editable_data_permits_by_ids_<#=table#>(
    ids,
    options,
  ).await?;
  
  Ok(res)
}<#
}
#><#
if (opts.noAdd !== true) {
#>

/// 创建<#=table_comment#>
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_<#=table#>(
  inputs: Vec<<#=tableUP#>Input>,
  options: Option<Options>,
) -> Result<Vec<<#=Table_Up#>Id>> {
  
  info!(
    "{req_id} {function_name}: inputs: {inputs:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );<#
  if (log) {
  #>
  
  let begin_time = Instant::now();<#
  }
  #>
  
  let mut inputs = inputs;
  for input in &mut inputs {
    input.id = None;
  }
  let inputs = inputs;
  
  let mut inputs2 = Vec::with_capacity(inputs.len());
  for input in inputs {
    let input = <#=table#>_service::set_id_by_lbl_<#=table#>(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_<#=table#>(),
    "add".to_owned(),
  ).await?;<#
  if (tableFieldPermit) {
  #>
  
  let mut inputs = inputs;
  {
    let fields = get_field_permit_<#=table#>(
      get_route_path_<#=table#>(),
    ).await?;
    for input in &mut inputs {
      field_permit_input_<#=table#>(
        input,
        fields.clone(),
      ).await?;
    }
  }
  let inputs = inputs;<#
  }
  #>
  
  let ids = <#=table#>_service::creates_<#=table#>(
    inputs,
    options,
  ).await?;<#
  if (log) {
  #>
  
  let new_data = find_all_<#=table#>(
    <#=Table_Up#>Search {
      ids: Some(ids.clone()),
      ..Default::default()
    }.into(),
    None,
    None,
    None,
  ).await?;<#
  if (isUseI18n) {
  #>
  
  let method_lbl = ns("新增".to_owned(), None).await?;
  let table_comment = ns("<#=table_comment#>".to_owned(), None).await?;<#
  } else {
  #>
  
  let method_lbl = "新增".to_owned();
  let table_comment = "<#=table_comment#>".to_owned();<#
  }
  #>
  
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
      method: "creates".to_owned().into(),
      method_lbl: method_lbl.clone().into(),
      lbl: method_lbl.into(),
      time: time.into(),
      new_data: serde_json::to_string(&new_data)?.into(),
      ..Default::default()
    },
  ).await?;<#
  }
  #>
  
  Ok(ids)
}<#
}
#><#
if (hasTenant_id) {
#>

/// <#=table_comment#>根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_<#=table#>(
  id: <#=Table_Up#>Id,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = <#=table#>_service::update_tenant_by_id_<#=table#>(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}<#
}
#><#
if (opts.noEdit !== true) {
#>

/// 根据 id 修改<#=table_comment#>
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_<#=table#>(
  id: <#=Table_Up#>Id,
  input: <#=tableUP#>Input,
  options: Option<Options>,
) -> Result<<#=Table_Up#>Id> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );<#
  if (log) {
  #>
  
  let begin_time = Instant::now();<#
  }
  #>
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = <#=table#>_service::set_id_by_lbl_<#=table#>(
    input,
  ).await?;
  
  use_permit(
    get_route_path_<#=table#>(),
    "edit".to_owned(),
  ).await?;<#
  if (tableFieldPermit) {
  #>
  
  let mut input = input;
  {
    let fields = get_field_permit_<#=table#>(
      get_route_path_<#=table#>(),
    ).await?;
    field_permit_input_<#=table#>(
      &mut input,
      fields,
    ).await?;
  }
  let input = input;<#
  }
  #><#
  if (log) {
  #>
  
  let old_data = find_by_id_<#=table#>(
    id.clone(),
    None,
  ).await?;<#
  }
  #>
  
  let res = <#=table#>_service::update_by_id_<#=table#>(
    id,
    input,
    options,
  ).await?;<#
  if (log) {
  #>
  
  let new_data = find_by_id_<#=table#>(
    res.clone(),
    None,
  ).await?;<#
  if (isUseI18n) {
  #>
  
  let method_lbl = ns("修改".to_owned(), None).await?;
  let table_comment = ns("<#=table_comment#>".to_owned(), None).await?;<#
  } else {
  #>
  
  let method_lbl = "修改".to_owned();
  let table_comment = "<#=table_comment#>".to_owned();<#
  }
  #>
  
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
}<#
}
#><#
if (hasAudit) {
#>

/// <#=table_comment#> 审核提交
#[function_name::named]
pub async fn audit_submit_<#=table#>(
  id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );<#
  if (log) {
  #>
  
  let begin_time = Instant::now();<#
  }
  #>
  
  use_permit(
    get_route_path_<#=table#>(),
    "audit_submit".to_owned(),
  ).await?;<#
  if (log) {
  #>
  
  let old_data = id.clone();<#
  }
  #>
  
  let res = <#=table#>_service::audit_submit_<#=table#>(
    id,
    options,
  ).await?;<#
  if (log) {
  #><#
  if (isUseI18n) {
  #>
  
  let method_lbl = ns("审核提交".to_owned(), None).await?;
  let table_comment = ns("<#=table_comment#>".to_owned(), None).await?;<#
  } else {
  #>
  
  let method_lbl = "审核提交".to_owned();
  let table_comment = "<#=table_comment#>".to_owned();<#
  }
  #>
  
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
      method: "auditSubmit".to_owned().into(),
      method_lbl: method_lbl.clone().into(),
      lbl: method_lbl.into(),
      time: time.into(),
      old_data: old_data.into(),
      ..Default::default()
    },
  ).await?;<#
  }
  #>
  
  Ok(res)
}

/// <#=table_comment#> 审核通过
#[function_name::named]
pub async fn audit_pass_<#=table#>(
  id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );<#
  if (log) {
  #>
  
  let begin_time = Instant::now();<#
  }
  #>
  
  use_permit(
    get_route_path_<#=table#>(),
    "audit_pass".to_owned(),
  ).await?;<#
  if (log) {
  #>
  
  let old_data = id.clone();<#
  }
  #>
  
  let res = <#=table#>_service::audit_pass_<#=table#>(
    id,
    options,
  ).await?;<#
  if (log) {
  #><#
  if (isUseI18n) {
  #>
  
  let method_lbl = ns("审核通过".to_owned(), None).await?;
  let table_comment = ns("<#=table_comment#>".to_owned(), None).await?;<#
  } else {
  #>
  
  let method_lbl = "审核通过".to_owned();
  let table_comment = "<#=table_comment#>".to_owned();<#
  }
  #>
  
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
      method: "auditPass".to_owned().into(),
      method_lbl: method_lbl.clone().into(),
      lbl: method_lbl.into(),
      time: time.into(),
      old_data: old_data.into(),
      ..Default::default()
    },
  ).await?;<#
  }
  #>
  
  Ok(res)
}

/// <#=table_comment#> 审核拒绝
#[function_name::named]
pub async fn audit_reject_<#=table#>(
  id: <#=Table_Up#>Id,
  input: <#=auditTable_Up#>Input,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );<#
  if (log) {
  #>
  
  let begin_time = Instant::now();<#
  }
  #>
  
  use_permit(
    get_route_path_<#=table#>(),
    "audit_reject".to_owned(),
  ).await?;<#
  if (log) {
  #>
  
  let old_data = id.clone();<#
  }
  #>
  
  let res = <#=table#>_service::audit_reject_<#=table#>(
    id,
    input,
    options,
  ).await?;<#
  if (log) {
  #><#
  if (isUseI18n) {
  #>
  
  let method_lbl = ns("审核拒绝".to_owned(), options.clone()).await?;
  let table_comment = ns("<#=table_comment#>".to_owned(), options.clone()).await?;<#
  } else {
  #>
  
  let method_lbl = "审核拒绝".to_owned();
  let table_comment = "<#=table_comment#>".to_owned();<#
  }
  #>
  
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
      method: "auditReject".to_owned().into(),
      method_lbl: method_lbl.clone().into(),
      lbl: method_lbl.into(),
      time: time.into(),
      old_data: old_data.into(),
      ..Default::default()
    },
  ).await?;<#
  }
  #>
  
  Ok(res)
}<#
if (hasReviewed) {
#>

/// <#=table_comment#> 复核通过
#[function_name::named]
pub async fn audit_review_<#=table#>(
  id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );<#
  if (log) {
  #>
  
  let begin_time = Instant::now();<#
  }
  #>
  
  use_permit(
    get_route_path_<#=table#>(),
    "audit_review".to_owned(),
  ).await?;<#
  if (log) {
  #>
  
  let old_data = id.clone();<#
  }
  #>
  
  let res = <#=table#>_service::audit_review_<#=table#>(
    id,
    options,
  ).await?;<#
  if (log) {
  #><#
  if (isUseI18n) {
  #>
  
  let method_lbl = ns("复核通过".to_owned(), options.clone()).await?;
  let table_comment = ns("<#=table_comment#>".to_owned(), options.clone()).await?;<#
  } else {
  #>
  
  let method_lbl = "复核通过".to_owned();
  let table_comment = "<#=table_comment#>".to_owned();<#
  }
  #>
  
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
      method: "auditReview".to_owned().into(),
      method_lbl: method_lbl.clone().into(),
      lbl: method_lbl.into(),
      time: time.into(),
      old_data: old_data.into(),
      ..Default::default()
    },
  ).await?;<#
  }
  #>
  
  Ok(res)
}<#
}
#><#
}
#><#
if (opts.noDelete !== true) {
#>

/// 根据 ids 删除<#=table_comment#>
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_<#=table#>(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );<#
  if (log) {
  #>
  
  let begin_time = Instant::now();<#
  }
  #>
  
  use_permit(
    get_route_path_<#=table#>(),
    "delete".to_owned(),
  ).await?;<#
  if (log) {
  #>
  
  let old_data = find_all_<#=table#>(
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
  
  let num = <#=table#>_service::delete_by_ids_<#=table#>(
    ids,
    options,
  ).await?;<#
  if (log) {
  #><#
  if (isUseI18n) {
  #>
  
  let method_lbl = ns("删除".to_owned(), None).await?;
  let table_comment = ns("<#=table_comment#>".to_owned(), None).await?;<#
  } else {
  #>
  
  let method_lbl = "删除".to_owned();
  let table_comment = "<#=table_comment#>".to_owned();<#
  }
  #>
  
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
}
#><#
if (hasDefault && opts.noEdit !== true) {
#>

/// 根据 id 设置默认<#=table_comment#>
#[allow(dead_code)]
#[function_name::named]
pub async fn default_by_id_<#=table#>(
  id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );<#
  if (log) {
  #>
  
  let begin_time = Instant::now();<#
  }
  #>
  
  use_permit(
    get_route_path_<#=table#>(),
    "edit".to_owned(),
  ).await?;<#
  if (log) {
  #>
  
  let old_data = serde_json::to_string(&ids)?;<#
  }
  #>
  
  let num = <#=table#>_service::default_by_id_<#=table#>(
    id,
    options,
  ).await?;<#
  if (log) {
  #><#
  if (isUseI18n) {
  #>
  
  let method_lbl = ns("默认".to_owned(), options.clone()).await?;
  let table_comment = ns("<#=table_comment#>".to_owned(), options.clone()).await?;<#
  } else {
  #>
  
  let method_lbl = "默认".to_owned();
  let table_comment = "<#=table_comment#>".to_owned();<#
  }
  #>
  
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
#[function_name::named]
pub async fn get_is_enabled_by_id_<#=table#>(
  id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_enabled = <#=table#>_service::get_is_enabled_by_id_<#=table#>(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用<#=table_comment#>
#[allow(dead_code)]
#[function_name::named]
pub async fn enable_by_ids_<#=table#>(
  ids: Vec<<#=Table_Up#>Id>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_enabled: {is_enabled:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );<#
  if (log) {
  #>
  
  let begin_time = Instant::now();<#
  }
  #>
  
  use_permit(
    get_route_path_<#=table#>(),
    "edit".to_owned(),
  ).await?;<#
  if (log) {
  #>
  
  let old_data = serde_json::to_string(&ids)?;<#
  }
  #>
  
  let num = <#=table#>_service::enable_by_ids_<#=table#>(
    ids,
    is_enabled,
    options,
  ).await?;<#
  if (log) {
  #><#
  if (isUseI18n) {
  #>
  
  let method_lbl = {
    if is_enabled == 0 {
      ns("禁用".to_owned(), None).await?
    } else {
      ns("启用".to_owned(), None).await?
    }
  };<#
  } else {
  #>
  
  let method_lbl = {
    if is_enabled == 0 {
      "禁用".to_owned()
    } else {
      "启用".to_owned()
    }
  };<#
  }
  #>
  let method = {
    if is_enabled == 0 {
      "disableByIds".to_owned()
    } else {
      "enableByIds".to_owned()
    }
  };<#
  if (isUseI18n) {
  #>
  let table_comment = ns("<#=table_comment#>".to_owned(), None).await?;<#
  } else {
  #>
  let table_comment = "<#=table_comment#>".to_owned();<#
  }
  #>
  
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
#[function_name::named]
pub async fn get_is_locked_by_id_<#=table#>(
  id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_locked = <#=table#>_service::get_is_locked_by_id_<#=table#>(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁<#=table_comment#>
#[allow(dead_code)]
#[function_name::named]
pub async fn lock_by_ids_<#=table#>(
  ids: Vec<<#=Table_Up#>Id>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_locked: {is_locked:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );<#
  if (log) {
  #>
  
  let begin_time = Instant::now();<#
  }
  #>
  
  use_permit(
    get_route_path_<#=table#>(),
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
  
  let num = <#=table#>_service::lock_by_ids_<#=table#>(
    ids,
    is_locked,
    options,
  ).await?;<#
  if (log) {
  #><#
  if (isUseI18n) {
  #>
  
  let method_lbl: String = if is_locked == 0 {
    ns("解锁".to_owned(), None).await?
  } else {
    ns("锁定".to_owned(), None).await?
  };
  let table_comment = ns("<#=table_comment#>".to_owned(), None).await?;<#
  } else {
  #>
  
  let method_lbl: String = if is_locked == 0 {
    "解锁".to_owned()
  } else {
    "锁定".to_owned()
  };
  let table_comment = "<#=table_comment#>".to_owned();<#
  }
  #>
  
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
#[function_name::named]
pub async fn get_field_comments_<#=table#>(
  options: Option<Options>,
) -> Result<<#=tableUP#>FieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = <#=table#>_service::get_field_comments_<#=table#>(
    options,
  ).await?;
  
  Ok(comments)
}<#
if (hasIsDeleted) {
#>

/// 根据 ids 还原<#=table_comment#>
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_<#=table#>(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );<#
  if (log) {
  #>
  
  let begin_time = Instant::now();<#
  }
  #>
  
  use_permit(
    get_route_path_<#=table#>(),
    "delete".to_owned(),
  ).await?;<#
  if (log) {
  #>
  
  let new_data = serde_json::to_string(&ids)?;<#
  }
  #>
  
  let num = <#=table#>_service::revert_by_ids_<#=table#>(
    ids,
    options,
  ).await?;<#
  if (log) {
  #><#
  if (isUseI18n) {
  #>
  
  let method_lbl = ns("还原".to_owned(), options.clone()).await?;
  let table_comment = ns("<#=table_comment#>".to_owned(), options.clone()).await?;<#
  } else {
  #>
  
  let method_lbl = "还原".to_owned();
  let table_comment = "<#=table_comment#>".to_owned();<#
  }
  #>
  
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
}<#
}
#><#
if (hasIsDeleted) {
#>

/// 根据 ids 彻底删除<#=table_comment#>
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_<#=table#>(
  ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );<#
  if (log) {
  #>
  
  let begin_time = Instant::now();<#
  }
  #>
  
  use_permit(
    get_route_path_<#=table#>(),
    "force_delete".to_owned(),
  ).await?;<#
  if (log) {
  #>
  
  let old_data = serde_json::to_string(&ids)?;<#
  }
  #>
  
  let num = <#=table#>_service::force_delete_by_ids_<#=table#>(
    ids,
    options,
  ).await?;<#
  if (log) {
  #><#
  if (isUseI18n) {
  #>
  
  let method_lbl = ns("彻底删除".to_owned(), options.clone()).await?;
  let table_comment = ns("<#=table_comment#>".to_owned(), options.clone()).await?;<#
  } else {
  #>
  
  let method_lbl = "彻底删除".to_owned();
  let table_comment = "<#=table_comment#>".to_owned();<#
  }
  #>
  
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
}
#><#
if (hasOrderBy) {
#>

/// 查找 <#=table_comment#> order_by 字段的最大值
#[function_name::named]
pub async fn find_last_order_by_<#=table#>(
  options: Option<Options>,
) -> Result<u32> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = <#=table#>_service::find_last_order_by_<#=table#>(
    options,
  ).await?;
  
  Ok(res)
}<#
}
#>
