<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasPassword = columns.some((column) => column.isPassword);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasEnabled = columns.some((column) => column.COLUMN_NAME === "is_enabled");
const hasDefault = columns.some((column) => column.COLUMN_NAME === "is_default");
const hasIsDeleted = columns.some((column) => column.COLUMN_NAME === "is_deleted");
const hasVersion = columns.some((column) => column.COLUMN_NAME === "version");
const hasIsHidden = columns.some((column) => column.COLUMN_NAME === "is_hidden");
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

// 审核
const hasAudit = !!opts?.audit;
let hasReviewed = false;
let auditColumn = "";
let auditMod = "";
let auditTable = "";
let auditModelLabel = "";
let auditTableIdColumn = undefined;
let auditTableSchema = undefined;
if (hasAudit) {
  auditColumn = opts.audit.column;
  auditMod = opts.audit.auditMod;
  auditTable = opts.audit.auditTable;
  // 是否有复核
  hasReviewed = opts?.audit?.hasReviewed;
}
const auditColumnUp = auditColumn.substring(0,1).toUpperCase() + auditColumn.substring(1);
const auditTableUp = auditTable.substring(0, 1).toUpperCase()+auditTable.substring(1);
const auditTable_Up = auditTableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
if (hasAudit) {
  auditTableSchema = opts?.audit?.auditTableSchema;
  auditTableIdColumn = auditTableSchema.columns.find(item => item.COLUMN_NAME === `${ table }_id`);
  if (!auditTableIdColumn) {
    throw new Error(`${ auditMod }_${ auditTable }: ${ auditTable }_id 字段不存在`);
  }
  auditModelLabel = auditTableIdColumn.modelLabel;
}

const hasSummary = columns.some((column) => column.showSummary);

const is_with_auth_optional = opts?.is_with_auth_optional;


// bpm
const hasBpm = !!opts?.bpm && !!opts?.bpm?.biz_code;
const bpmBizCode = opts?.bpm?.biz_code;
const bpmStatusField = opts?.bpm?.bpm_status_field;
const bpmStatusFieldUp = bpmStatusField
  ? bpmStatusField.split("_").map((item) => item.substring(0, 1).toUpperCase() + item.substring(1)).join("")
  : "";
#>
#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]

#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use color_eyre::eyre::{Result, eyre};

#[allow(unused_imports)]
use crate::common::context::{
  Options,<#
  if (hasAudit) {
  #>
  get_now,<#
  }
  #>
  get_auth_id_ok,
  get_auth_org_id,
};

#[allow(unused_imports)]
use smol_str::SmolStr;

use crate::common::gql::model::{PageInput, SortInput};<#
if (table !== "i18n" && isUseI18n) {
#>

#[allow(unused_imports)]
use crate::common::i18n::i18n_dao::ns;<#
}
#><#
if (hasTenant_id) {
#>

use crate::base::tenant::tenant_model::TenantId;<#
}
#><#
if (hasOrgId) {
#>

use crate::base::org::org_model::OrgId;<#
}
#><#
if (hasBpm) {
#>

use crate::bpm::process_def::process_def_model::{
  ProcessDefBizCode,
  ProcessDefSearch,
};
use crate::bpm::process_def::process_def_service::find_one_ok_process_def;
use crate::bpm::process_inst::process_inst_model::{
  ProcessInstBizCode,
  ProcessInstId,
  ProcessInstSearch,
  ProcessInstStatus,
};
use crate::bpm::process_inst::process_inst_dao::{
  find_by_id_ok_process_inst,
  find_one_ok_process_inst,
};
use crate::bpm::process_inst::process_inst_service2::{
  complete_task,
  start_process,
};
use crate::bpm::task::task_model::TaskAction;
use crate::base::usr::usr_model::UsrId;<#
}
#><#
if (
  (opts.filterDataByCreateUsr || hasOrgId) ||
  hasAudit
) {
#>

use crate::base::usr::usr_dao::{
  find_by_id_ok_usr,
};<#
}
#><#
if (mod === "base" && table === "usr") {
#>

use super::usr_sync_dao::sync_usr_lbl_by_usr_id;<#
}
#><#
if (mod === "base" && table === "i18n") {
#>
use crate::common::options::options_dao::update_i18n_version;<#
}
#><#
if (
  (hasAudit && auditTable_Up) ||
  opts.filterDataByCreateUsr
) {
#>

use crate::common::usr::usr_dao::is_admin;<#
if (opts.audit.sendAuditMessage) {
#>
use crate::common::permit::permit_service::{
  get_audit_receiver_usr_ids,
};
use crate::base::message::message_model::MessageInput;<#
}
#><#
}
#>

use super::<#=table#>_model::*;
use super::<#=table#>_dao;<#
if (hasAudit && auditTable_Up) {
#>

use crate::<#=auditMod#>::<#=auditTable#>::<#=auditTable#>_dao::{
  find_all_<#=auditTable#>,
  create_<#=auditTable#>,
  delete_by_ids_<#=auditTable#>,<#
  if (hasIsDeleted) {
  #>
  revert_by_ids_<#=auditTable#>,
  force_delete_by_ids_<#=auditTable#>,<#
  }
  #>
};
use crate::<#=auditMod#>::<#=auditTable#>::<#=auditTable#>_model::{
  <#=auditTable_Up#>Id,
  <#=auditTable_Up#>Audit,
  <#=auditTable_Up#>Search,
  <#=auditTable_Up#>Input,
};<#
}
#>

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut <#=tableUP#>Search,
  options: Option<Options>,
) -> Result<()> {<#
  if (hasIsHidden) {
  #>
  
  if search.is_hidden.is_none() {
    search.is_hidden = Some(vec![0]);
  }<#
  }
  #><#
  if (opts.filterDataByCreateUsr || hasOrgId || hasAudit) {
  #>
  
  let usr_id = if let Some(auth_usr_id) = search.auth_usr_id.clone() {
    auth_usr_id
  } else {
    get_auth_id_ok()?
  };
  
  let usr_model = find_by_id_ok_usr(
    usr_id,
    options,
  ).await?;<#
    if (hasOrgId) {
  #>
  
  let org_id = get_auth_org_id().unwrap_or_default();
  let mut org_ids: Vec<OrgId> = vec![];
  if search.auth_usr_id.unwrap_or_default().is_empty() && !org_id.is_empty() {
    org_ids.push(org_id);
  } else {
    org_ids.append(&mut usr_model.org_ids.clone());
    org_ids.push(OrgId::default());
  }<#
    }
  #><#
  }
  #><#
  if (opts.filterDataByCreateUsr) {
  #>
  
  if !is_admin(usr_id, options).await? {
    search.create_usr_id = Some(vec![usr_id]);
  }<#
  } else if (hasOrgId) {
  #>
  
  search.org_id = Some(org_ids);<#
  }
  #>
  
  Ok(())
}<#
if (hasAudit) {
#>

fn get_reverse_<#=auditColumn#>_status(
  audit: <#=Table_Up#><#=auditColumnUp#>,
) -> Result<(<#=Table_Up#><#=auditColumnUp#>, <#=auditTable_Up#>Audit)> {
  match audit {<#
    if (hasReviewed) {
    #>
    <#=Table_Up#><#=auditColumnUp#>::Reviewed => {
      Ok((<#=Table_Up#><#=auditColumnUp#>::Audited, <#=auditTable_Up#>Audit::Audited))
    },<#
    }
    #>
    <#=Table_Up#><#=auditColumnUp#>::Audited => {
      Ok((<#=Table_Up#><#=auditColumnUp#>::Unaudited, <#=auditTable_Up#>Audit::Unaudited))
    },
    <#=Table_Up#><#=auditColumnUp#>::Unaudited => {
      Ok((<#=Table_Up#><#=auditColumnUp#>::Unsubmited, <#=auditTable_Up#>Audit::Unsubmited))
    },
    <#=Table_Up#><#=auditColumnUp#>::Unsubmited |
    <#=Table_Up#><#=auditColumnUp#>::Rejected => {<#
      if (hasReviewed) {
      #>
      Err(eyre!("只有待审核、已审核、已复核的 <#=table_comment#> 才能 反审核"))<#
      } else {
      #>
      Err(eyre!("只有待审核、已审核的 <#=table_comment#> 才能 反审核"))<#
      }
      #>
    },
  }
}<#
}
#>

/// 根据搜索条件和分页查找<#=table_comment#>列表
pub async fn find_all_<#=table#>(
  search: Option<<#=tableUP#>Search>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<<#=tableUP#>Model>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
  let <#=table#>_models = <#=table#>_dao::find_all_<#=table#>(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(<#=table#>_models)
}

/// 根据条件查找<#=table_comment#>总数
pub async fn find_count_<#=table#>(
  search: Option<<#=tableUP#>Search>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
  let <#=table#>_num = <#=table#>_dao::find_count_<#=table#>(
    Some(search),
    options,
  ).await?;
  
  Ok(<#=table#>_num)
}

/// 根据条件查找第一个<#=table_comment#>
pub async fn find_one_<#=table#>(
  search: Option<<#=tableUP#>Search>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<<#=tableUP#>Model>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
  let <#=table#>_model = <#=table#>_dao::find_one_<#=table#>(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(<#=table#>_model)
}

/// 根据条件查找第一个<#=table_comment#>, 如果不存在则抛错
pub async fn find_one_ok_<#=table#>(
  search: Option<<#=tableUP#>Search>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<<#=tableUP#>Model> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
  let <#=table#>_model = <#=table#>_dao::find_one_ok_<#=table#>(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(<#=table#>_model)
}

/// 根据 id 查找<#=table_comment#>
pub async fn find_by_id_<#=table#>(
  <#=table#>_id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<Option<<#=tableUP#>Model>> {<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
  let <#=table#>_model = <#=table#>_dao::find_by_id_<#=table#>(
    <#=table#>_id,
    options,
  ).await?;
  
  Ok(<#=table#>_model)
}

/// 根据 id 查找<#=table_comment#>, 如果不存在则抛错
pub async fn find_by_id_ok_<#=table#>(
  <#=table#>_id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<<#=tableUP#>Model> {<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
  let <#=table#>_model = <#=table#>_dao::find_by_id_ok_<#=table#>(
    <#=table#>_id,
    options,
  ).await?;
  
  Ok(<#=table#>_model)
}

/// 根据 ids 查找<#=table_comment#>
pub async fn find_by_ids_<#=table#>(
  <#=table#>_ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<Vec<<#=tableUP#>Model>> {<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
  let <#=table#>_models = <#=table#>_dao::find_by_ids_<#=table#>(
    <#=table#>_ids,
    options,
  ).await?;
  
  Ok(<#=table#>_models)
}

/// 根据 ids 查找<#=table_comment#>, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_<#=table#>(
  <#=table#>_ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<Vec<<#=tableUP#>Model>> {<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
  let <#=table#>_models = <#=table#>_dao::find_by_ids_ok_<#=table#>(
    <#=table#>_ids,
    options,
  ).await?;
  
  Ok(<#=table#>_models)
}<#
if (hasBpm) {
#>

/// 发起 <#=table_comment#> 流程
pub async fn start_process_<#=table#>(
  <#=table#>_id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<ProcessInstId> {
  let <#=table#>_model = find_by_id_ok_<#=table#>(
    <#=table#>_id,
    options,
  ).await?;

  let <#=table#>_id = <#=table#>_model.id;
  let <#=table#>_lbl = <#=table#>_model.lbl;

  if <#=table#>_model.<#=bpmStatusField#> != <#=tableUP#><#=bpmStatusFieldUp#>::Draft {
    color_eyre::eyre::bail!(
      "仅未提交状态可提交",
    )
  }

  let biz_code = "<#=bpmBizCode#>".parse::<ProcessDefBizCode>()?;

  let process_def_model = find_one_ok_process_def(
    Some(ProcessDefSearch {
      biz_code: Some(vec![biz_code]),
      ..Default::default()
    }),
    None,
    options,
  ).await?;

  let process_def_id = process_def_model.id;
  let process_def_is_enabled = process_def_model.is_enabled;

  if process_def_is_enabled == 0 {
    color_eyre::eyre::bail!("流程未启用")
  }

  let process_inst_id = start_process(
    process_def_id,
    <#=table#>_id.into(),
    <#=table#>_lbl.into(),
    options,
  ).await?;

  let process_inst_model = find_by_id_ok_process_inst(
    process_inst_id,
    options,
  ).await?;

  let bpm_status = match process_inst_model.status {
    ProcessInstStatus::Running => <#=tableUP#><#=bpmStatusFieldUp#>::Running,
    ProcessInstStatus::Approved => <#=tableUP#><#=bpmStatusFieldUp#>::Approved,
    ProcessInstStatus::Rejected => <#=tableUP#><#=bpmStatusFieldUp#>::Rejected,
    ProcessInstStatus::Revoked => <#=tableUP#><#=bpmStatusFieldUp#>::Revoked,
    ProcessInstStatus::Draft => <#=tableUP#><#=bpmStatusFieldUp#>::Draft,
  };

  update_by_id_<#=table#>(
    <#=table#>_id,
    <#=tableUP#>Input {
      <#=bpmStatusField#>: Some(bpm_status),
      ..Default::default()
    },
    options,
  ).await?;

  Ok(process_inst_id)
}

/// 完成 <#=table_comment#> 流程任务
pub async fn complete_task_<#=table#>(
  <#=table#>_id: <#=Table_Up#>Id,
  action: TaskAction,
  opinion: Option<SmolStr>,
  add_sign_usr_ids: Option<Vec<UsrId>>,
  options: Option<Options>,
) -> Result<bool> {
  let <#=table#>_model = find_by_id_ok_<#=table#>(
    <#=table#>_id,
    options,
  ).await?;

  if <#=table#>_model.<#=bpmStatusField#> != <#=tableUP#><#=bpmStatusFieldUp#>::Running {
    return Err(eyre!("仅审批中的单据可执行审批操作"));
  }

  let process_inst_model = find_one_ok_process_inst(
    Some(ProcessInstSearch {
      is_deleted: Some(0),
      status: Some(vec![ProcessInstStatus::Running]),
      biz_code: Some(vec!["<#=bpmBizCode#>".parse::<ProcessInstBizCode>()?]),
      biz_id: Some(<#=table#>_id.into()),
      ..Default::default()
    }),
    None,
    options,
  ).await?;

  let complete_res = complete_task(
    process_inst_model.id,
    action,
    opinion,
    add_sign_usr_ids,
    options,
  ).await?;

  let bpm_status = match complete_res.process_status {
    ProcessInstStatus::Running => <#=tableUP#><#=bpmStatusFieldUp#>::Running,
    ProcessInstStatus::Approved => <#=tableUP#><#=bpmStatusFieldUp#>::Approved,
    ProcessInstStatus::Rejected => <#=tableUP#><#=bpmStatusFieldUp#>::Rejected,
    ProcessInstStatus::Revoked => <#=tableUP#><#=bpmStatusFieldUp#>::Revoked,
    ProcessInstStatus::Draft => <#=tableUP#><#=bpmStatusFieldUp#>::Draft,
  };

  <#=table#>_dao::update_by_id_<#=table#>(
    <#=table#>_id,
    <#=tableUP#>Input {
      <#=bpmStatusField#>: Some(bpm_status),
      ..Default::default()
    },
    options,
  ).await?;

  Ok(true)
}<#
}
#><#
if (hasDataPermit() && hasCreateUsrId) {
#>

/// 根据 ids 获取<#=table_comment#>是否可编辑数据权限
pub async fn get_editable_data_permits_by_ids_<#=table#>(
  <#=table#>_ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<Vec<u8>> {
  
  let is_editable = <#=table#>_dao::get_editable_data_permits_by_ids_<#=table#>(
    <#=table#>_ids,
    options,
  ).await?;
  
  Ok(is_editable)
}<#
}
#>

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_<#=table#>(
  <#=table#>_input: <#=tableUP#>Input,
) -> Result<<#=tableUP#>Input> {
  
  let <#=table#>_input = <#=table#>_dao::set_id_by_lbl_<#=table#>(
    <#=table#>_input,
  ).await?;
  
  Ok(<#=table#>_input)
}

/// 创建<#=table_comment#>
#[allow(dead_code)]
pub async fn creates_<#=table#>(
  <#=table#>_inputs: Vec<<#=tableUP#>Input>,
  options: Option<Options>,
) -> Result<Vec<<#=Table_Up#>Id>> {<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #><#
  if (hasAudit) {
  #>
  
  let mut <#=table#>_inputs = <#=table#>_inputs;
  for <#=table#>_input in <#=table#>_inputs.iter_mut() {
    <#=table#>_input.<#=auditColumn#> = Some(<#=Table_Up#>Audit::Unsubmited);
  }
  let <#=table#>_inputs = <#=table#>_inputs;<#
  }
  #><#
  if (hasBpm) {
  #>
  
  let mut <#=table#>_inputs = <#=table#>_inputs;
  for <#=table#>_input in <#=table#>_inputs.iter_mut() {
    <#=table#>_input.<#=bpmStatusField#> = Some(<#=Table_Up#><#=bpmStatusFieldUp#>::Draft);
  }
  let <#=table#>_inputs = <#=table#>_inputs;<#
  }
  #>
  
  let <#=table#>_ids = <#=table#>_dao::creates_<#=table#>(
    <#=table#>_inputs,
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

/// <#=table_comment#>根据 <#=table#>_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_<#=table#>(
  <#=table#>_id: <#=Table_Up#>Id,
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
  
  let num = <#=table#>_dao::update_tenant_by_id_<#=table#>(
    <#=table#>_id,
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
#><#
if (mod === "base" && table === "usr") {
#>

fn should_sync_usr_lbl(
  old_lbl: &str,
  new_lbl: Option<&str>,
) -> bool {
  new_lbl.is_some_and(|lbl| lbl != old_lbl)
}<#
}
#>

/// 根据 <#=table#>_id 修改<#=table_comment#>
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_<#=table#>(
  <#=table#>_id: <#=Table_Up#>Id,
  mut <#=table#>_input: <#=tableUP#>Input,
  options: Option<Options>,
) -> Result<<#=Table_Up#>Id> {<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #><#
  if (
    hasAudit || hasBpm
  ) {
  #>
  
  let old_model = validate_option_<#=table#>(
    <#=table#>_dao::find_by_id_<#=table#>(
      <#=table#>_id,
      options,
    ).await?,
  ).await?;<#
  }
  #><#
  if (hasBpm) {
  #>
  
  if matches!(
    old_model.<#=bpmStatusField#>,
    <#=tableUP#><#=bpmStatusFieldUp#>::Running |
      <#=tableUP#><#=bpmStatusFieldUp#>::Approved
  ) {
    return Err(eyre!("审批中或已通过的单据不允许修改"));
  }<#
  }
  #><#
  if (hasAudit) {
  #>
  
  let usr_id = get_auth_id_ok()?;
  if !is_admin(usr_id, options).await? &&
    old_model.<#=auditColumn#> != <#=Table_Up#><#=auditColumnUp#>::Unsubmited &&
    old_model.<#=auditColumn#> != <#=Table_Up#><#=auditColumnUp#>::Rejected &&
    old_model.<#=auditColumn#> != <#=Table_Up#><#=auditColumnUp#>::Unaudited
  {<#
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
      "只有待提交或待审核的 {0} 才能编辑".to_owned(),
      map.into(),
    ).await?;<#
    } else {
    #>
    let err_msg = "只有待提交或待审核的 <#=table_comment#> 才能编辑";<#
    }
    #>
    return Err(eyre!(err_msg));
  }<#
  }
  #><#
  if (hasLocked) {
  #>
  
  let is_locked = <#=table#>_dao::get_is_locked_by_id_<#=table#>(
    <#=table#>_id,
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
  if (mod === "base" && table === "usr") {
  #>
  
  let old_model = <#=table#>_dao::find_by_id_ok_<#=table#>(
    <#=table#>_id,
    options,
  ).await?;
  
  let old_lbl = old_model.lbl;
  
  let is_sync_usr_lbl = should_sync_usr_lbl(
    &old_lbl,
    usr_input.lbl.as_deref(),
  );<#
  }
  #>
  
  let <#=table#>_id = <#=table#>_dao::update_by_id_<#=table#>(
    <#=table#>_id,
    <#=table#>_input,
    options,
  ).await?;<#
  if (mod === "base" && table === "usr") {
  #>
  
  if is_sync_usr_lbl {
    sync_usr_lbl_by_usr_id(
      <#=table#>_id.clone(),
      options,
    ).await?;
  }<#
  }
  #><#
  if (mod === "base" && table === "i18n") {
  #>
  
  update_i18n_version().await?;<#
  }
  #>
  
  Ok(<#=table#>_id)
}

/// 校验<#=table_comment#>是否存在
#[allow(dead_code)]
pub async fn validate_option_<#=table#>(
  <#=table#>_model: Option<<#=tableUP#>Model>,
) -> Result<<#=tableUP#>Model> {
  
  let <#=table#>_model = <#=table#>_dao::validate_option_<#=table#>(<#=table#>_model).await?;
  
  Ok(<#=table#>_model)
}<#
if (hasAudit) {
#>

/// <#=table_comment#> 审核提交
pub async fn audit_submit_<#=table#>(
  <#=table#>_id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<bool> {
  
  let old_model = <#=table#>_dao::find_by_id_ok_<#=table#>(
    <#=table#>_id,
    options,
  ).await?;
  
  if old_model.<#=auditColumn#> != <#=Table_Up#><#=auditColumnUp#>::Unsubmited &&
    old_model.<#=auditColumn#> != <#=Table_Up#><#=auditColumnUp#>::Rejected {<#
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
      "只有待提交或者审核拒绝的 {0} 才能 审核提交".to_owned(),
      map.into(),
    ).await?;<#
    } else {
    #>
    let err_msg = "只有待提交或者审核拒绝的 <#=table_comment#> 才能 审核提交";<#
    }
    #>
    return Err(eyre!(err_msg));
  }<#
  if (auditTable_Up) {
  #><#
  if (opts?.lbl_field) {
  #>
  
  let <#=auditModelLabel#> = old_model.<#=opts?.lbl_field#>;<#
  } else {
  #>
  
  let <#=auditModelLabel#> = String::new();<#
  }
  #><#
  }
  #>
  
  let <#=table#>_input = <#=tableUP#>Input {
    <#=auditColumn#>: Some(<#=tableUP#>Audit::Unaudited),
    ..Default::default()
  };
  
  <#=table#>_dao::update_by_id_<#=table#>(
    <#=table#>_id,
    <#=table#>_input,
    options,
  ).await?;<#
  if (auditTable_Up) {
  #>
  
  let audit_usr_id = get_auth_id_ok()?;
  let audit_time = get_now();
  
  let audit_usr_model = find_by_id_ok_usr(
    audit_usr_id,
    options,
  ).await?;
  
  let audit_usr_id_lbl = audit_usr_model.lbl;
  
  let <#=table#>_input = <#=auditTable_Up#>Input {
    <#=table#>_id: Some(<#=table#>_id),<#
    if (auditModelLabel) {
    #>
    <#=auditModelLabel#>: Some(<#=auditModelLabel#>.clone()),<#
    }
    #>
    audit: Some(<#=auditTable_Up#>Audit::Unaudited),
    audit_usr_id: Some(audit_usr_id),
    audit_usr_id_lbl: Some(audit_usr_id_lbl),
    audit_time: Some(audit_time),
    ..Default::default()
  };
  
  create_<#=auditTable#>(
    <#=table#>_input,
    options,
  ).await?;<#
  if (opts.audit.sendAuditMessage) {
  #>
  
  let next_message = MessageInput {
    title: Some("<#=table_comment#>待审核".into()),
    content: Some(format!("<#=table_comment#> {<#=auditModelLabel#>} 已提交审核，请尽快处理。").into()),
    route_path: Some(get_page_path_<#=table#>().into()),
    route_query: Some(format!("id={<#=table#>_id}").into()),
    tenant_id: old_model.tenant_id.clone().into(),
    is_sys_msg: Some(1),
    ..Default::default()
  };
  
  let receiver_usr_ids = get_audit_receiver_usr_ids(
    SmolStr::new(get_page_path_<#=table#>()),
    SmolStr::new("audit_submit"),
    options,
  ).await?;
  
  let receiver_usr_ids = receiver_usr_ids.into_iter()
    .filter(|x| x != &audit_usr_id)
    .collect::<std::collections::HashSet<_>>().into_iter()
    .collect::<Vec<_>>();
  
  let mut receiver_usr_ids2 = Vec::with_capacity(receiver_usr_ids.len());
  
  for receiver_usr_id in receiver_usr_ids {
    
    if is_admin(receiver_usr_id, options).await? {
      continue;
    }
    
    let has_permit = find_one_<#=table#>(
      Some(<#=Table_Up#>Search {
        id: Some(<#=table#>_id),
        auth_usr_id: Some(receiver_usr_id),
        ..Default::default()
      }),
      None,
      options,
    ).await?.is_some();
    
    if has_permit {
      receiver_usr_ids2.push(receiver_usr_id);
    }
    
  }
  
  let receiver_usr_ids = receiver_usr_ids2;
  
  crate::base::message::message_dao2::send_message(
    next_message.clone(),
    receiver_usr_ids.clone(),
    options,
  ).await?;
  
  let mut next_message_wxwork = MessageInput {
    ..next_message
  };
  next_message_wxwork.route_path = None;
  next_message_wxwork.route_query = None;
  crate::wxwork::wxw_msg::wxw_msg_dao2::send_message_wxwork(
    next_message_wxwork,
    receiver_usr_ids,
    options,
  ).await?;<#
  } 
  #><#
  }
  #>
  
  Ok(true)
}

/// <#=table_comment#> 审核通过
pub async fn audit_pass_<#=table#>(
  <#=table#>_id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<bool> {
  
  let old_model = <#=table#>_dao::find_by_id_ok_<#=table#>(
    <#=table#>_id,
    options,
  ).await?;
  
  if old_model.<#=auditColumn#> != <#=Table_Up#><#=auditColumnUp#>::Unaudited {<#
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
      "只有未审核的 {0} 才能 审核通过".to_owned(),
      map.into(),
    ).await?;<#
    } else {
    #>
    let err_msg = "只有未审核的 <#=table_comment#> 才能 审核通过";<#
    }
    #>
    return Err(eyre!(err_msg));
  }<#
  if (auditTable_Up) {
  #><#
  if (opts?.lbl_field) {
  #>
  
  let <#=auditModelLabel#> = old_model.<#=opts?.lbl_field#>;<#
  } else {
  #>
  
  let <#=auditModelLabel#> = String::new();<#
  }
  #><#
  }
  #>
  
  let <#=table#>_input = <#=tableUP#>Input {
    <#=auditColumn#>: Some(<#=tableUP#>Audit::Audited),
    ..Default::default()
  };
  
  <#=table#>_dao::update_by_id_<#=table#>(
    <#=table#>_id, 
    <#=table#>_input,
    options,
  ).await?;<#
  if (auditTable_Up) {
  #>
  
  let audit_usr_id = get_auth_id_ok()?;
  let audit_time = get_now();
  
  let audit_usr_model = find_by_id_ok_usr(
    audit_usr_id,
    options,
  ).await?;
  
  let audit_usr_id_lbl = audit_usr_model.lbl;
  
  let <#=table#>_input = <#=auditTable_Up#>Input {
    <#=table#>_id: Some(<#=table#>_id),<#
    if (auditModelLabel) {
    #>
    <#=auditModelLabel#>: Some(<#=auditModelLabel#>.clone()),<#
    }
    #>
    audit: Some(<#=auditTable_Up#>Audit::Audited),
    audit_usr_id: Some(audit_usr_id),
    audit_usr_id_lbl: Some(audit_usr_id_lbl),
    audit_time: Some(audit_time),
    ..Default::default()
  };
  
  create_<#=auditTable#>(
    <#=table#>_input,
    options,
  ).await?;<#
  if (opts.audit.sendAuditMessage && hasReviewed) {
  #>
  
  let next_message = MessageInput {
    title: Some("<#=table_comment#>待复核".into()),
    content: Some(format!("<#=table_comment#> {<#=auditModelLabel#>} 已审核通过，请继续复核。").into()),
    route_path: Some(get_page_path_<#=table#>().into()),
    route_query: Some(format!("id={<#=table#>_id}").into()),
    tenant_id: old_model.tenant_id.into(),
    is_sys_msg: Some(1),
    ..Default::default()
  };
  
  let receiver_usr_ids = get_audit_receiver_usr_ids(
    SmolStr::new(get_page_path_<#=table#>()),
    SmolStr::new("audit_review"),
    options,
  ).await?;
  
  let receiver_usr_ids = receiver_usr_ids.into_iter()
    .filter(|x| x != &audit_usr_id)
    .collect::<std::collections::HashSet<_>>()
    .into_iter()
    .collect::<Vec<_>>();
  
  let mut receiver_usr_ids2 = Vec::with_capacity(receiver_usr_ids.len());
  
  for receiver_usr_id in receiver_usr_ids {
    
    if is_admin(receiver_usr_id, options).await? {
      continue;
    }
    
    let has_permit = find_one_<#=table#>(
      Some(<#=tableUP#>Search {
        id: Some(<#=table#>_id),
        auth_usr_id: Some(receiver_usr_id),
        ..Default::default()
      }),
      None,
      options,
    ).await?.is_some();
    
    if has_permit {
      receiver_usr_ids2.push(receiver_usr_id);
    }
    
  }
  
  let receiver_usr_ids = receiver_usr_ids2;
  
  crate::base::message::message_dao2::send_message(
    next_message.clone(),
    receiver_usr_ids.clone(),
    options,
  ).await?;
  
  let mut next_message_wxwork = MessageInput {
    ..next_message
  };
  next_message_wxwork.route_path = None;
  next_message_wxwork.route_query = None;
  
  crate::wxwork::wxw_msg::wxw_msg_dao2::send_message_wxwork(
    next_message_wxwork,
    receiver_usr_ids,
    options,
  ).await?;<#
  } else if (opts.audit.sendAuditMessage && !hasReviewed) {
  #>
  
  let receiver_usr_ids = vec![old_model.create_usr_id];
  let next_message = MessageInput {
    title: Some("<#=table_comment#>已审核通过".into()),
    content: Some(format!("<#=table_comment#> {<#=auditModelLabel#>} 已审核通过。").into()),
    route_path: Some(get_page_path_<#=table#>().into()),
    route_query: Some(format!("id={<#=table#>_id}").into()),
    tenant_id: old_model.tenant_id.into(),
    is_sys_msg: Some(1),
    ..Default::default()
  };
  
  if !old_model.create_usr_id.is_empty() {
    
    crate::base::message::message_dao2::send_message(
      next_message.clone(),
      receiver_usr_ids.clone(),
      options,
    ).await?;
    
    let mut next_message_wxwork = MessageInput {
      ..next_message
    };
    next_message_wxwork.route_path = None;
    next_message_wxwork.route_query = None;
    
    crate::wxwork::wxw_msg::wxw_msg_dao2::send_message_wxwork(
      next_message_wxwork,
      receiver_usr_ids.clone(),
      options,
    ).await?;
    
  }<#
  }
  #><#
  }
  #>
  
  Ok(true)
}

/// <#=table_comment#> 审核拒绝
#[allow(dead_code)]
pub async fn audit_reject_<#=table#>(
  <#=table#>_id: <#=Table_Up#>Id,
  audit_input: <#=auditTable_Up#>Input,
  options: Option<Options>,
) -> Result<bool> {
  
  let old_model = <#=table#>_dao::find_by_id_ok_<#=table#>(
    <#=table#>_id,
    options,
  ).await?;
  
  if old_model.<#=auditColumn#> != <#=Table_Up#><#=auditColumnUp#>::Unaudited<#
    if (hasReviewed) {
    #> &&
    old_model.<#=auditColumn#> != <#=Table_Up#><#=auditColumnUp#>::Audited<#
    }
    #> {<#
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
      "只有未审核的 {0} 才能 审核拒绝".to_owned(),
      map.into(),
    ).await?;<#
    } else {
    #>
    let err_msg = "只有未审核的 <#=table_comment#> 才能 审核拒绝";<#
    }
    #>
    return Err(eyre!(err_msg));
  }<#
  if (auditTable_Up) {
  #><#
  if (opts?.lbl_field) {
  #>
  
  let <#=auditModelLabel#> = old_model.<#=opts?.lbl_field#>;<#
  } else {
  #>
  
  let <#=auditModelLabel#> = String::new();<#
  }
  #><#
  }
  #>
  
  let <#=table#>_input = <#=tableUP#>Input {
    <#=auditColumn#>: Some(<#=tableUP#>Audit::Rejected),
    ..Default::default()
  };
  
  <#=table#>_dao::update_by_id_<#=table#>(
    <#=table#>_id,
    <#=table#>_input,
    options,
  ).await?;<#
  if (auditTable_Up) {
  #>
  
  let audit_usr_id = get_auth_id_ok()?;
  let audit_time = get_now();
  
  let audit_usr_model = find_by_id_ok_usr(
    audit_usr_id,
    options,
  ).await?;
  
  let audit_usr_id_lbl = audit_usr_model.lbl;
  
  let <#=table#>_input = <#=auditTable_Up#>Input {
    <#=table#>_id: Some(<#=table#>_id),<#
    if (auditModelLabel) {
    #>
    <#=auditModelLabel#>: Some(<#=auditModelLabel#>.clone()),<#
    }
    #>
    audit: Some(<#=auditTable_Up#>Audit::Rejected),
    audit_usr_id: Some(audit_usr_id),
    audit_usr_id_lbl: Some(audit_usr_id_lbl),
    audit_time: Some(audit_time),
    rem: audit_input.rem,
    ..Default::default()
  };
  
  create_<#=auditTable#>(
    <#=table#>_input,
    options,
  ).await?;<#
  if (opts.audit.sendAuditMessage) {
  #>
  
  let receiver_usr_ids = vec![old_model.create_usr_id];
  
  let next_message = MessageInput {
    title: Some(format!("<#=table_comment#>已被拒绝").into()),
    content: Some(format!("<#=table_comment#> {<#=auditModelLabel#>} 已被拒绝，请重新提交审核。").into()),
    route_path: Some(get_page_path_<#=table#>().into()),
    route_query: Some(format!("id={<#=table#>_id}").into()),
    tenant_id: old_model.tenant_id.clone().into(),
    is_sys_msg: Some(1),
    ..Default::default()
  };
  
  if !old_model.create_usr_id.is_empty() {
    
    crate::base::message::message_dao2::send_message(
      next_message.clone(),
      receiver_usr_ids.clone(),
      options,
    ).await?;
    
    let mut next_message_wxwork = MessageInput {
      ..next_message
    };
    next_message_wxwork.route_path = None;
    next_message_wxwork.route_query = None;
    
    crate::wxwork::wxw_msg::wxw_msg_dao2::send_message_wxwork(
      next_message_wxwork,
      receiver_usr_ids.clone(),
      options,
    ).await?;
    
  }<#
  }
  #><#
  }
  #>
  
  Ok(true)
}

/// <#=table_comment#> 反审核
pub async fn audit_reverse_<#=table#>(
  <#=table#>_id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<bool> {

  let old_model = <#=table#>_dao::find_by_id_ok_<#=table#>(
    <#=table#>_id,
    options,
  ).await?;<#
  if (auditTable_Up) {
  #><#
  if (opts?.lbl_field) {
  #>

  let <#=auditModelLabel#> = old_model.<#=opts?.lbl_field#>;<#
  } else {
  #>

  let <#=auditModelLabel#> = String::new();<#
  }
  #><#
  }
  #>

  let (audit, audit_log) = get_reverse_<#=auditColumn#>_status(old_model.<#=auditColumn#>.clone())?;

  let <#=table#>_input = <#=tableUP#>Input {
    <#=auditColumn#>: Some(audit),
    ..Default::default()
  };

  <#=table#>_dao::update_by_id_<#=table#>(
    <#=table#>_id,
    <#=table#>_input,
    options,
  ).await?;<#
  if (auditTable_Up) {
  #>

  let audit_usr_id = get_auth_id_ok()?;
  let audit_time = get_now();

  let audit_usr_model = find_by_id_ok_usr(
    audit_usr_id,
    options,
  ).await?;

  let audit_usr_id_lbl = audit_usr_model.lbl;

  let <#=table#>_input = <#=auditTable_Up#>Input {
    <#=table#>_id: Some(<#=table#>_id),<#
    if (auditModelLabel) {
    #>
    <#=auditModelLabel#>: Some(<#=auditModelLabel#>.clone()),<#
    }
    #>
    audit: Some(audit_log.clone()),
    audit_usr_id: Some(audit_usr_id),
    audit_usr_id_lbl: Some(audit_usr_id_lbl),
    audit_time: Some(audit_time),
    rem: Some("反审核".into()),
    ..Default::default()
  };

  create_<#=auditTable#>(
    <#=table#>_input,
    options,
  ).await?;<#
  if (opts.audit.sendAuditMessage) {
  #>
  
  let next_message = MessageInput {
    title: Some(format!("<#=table_comment#>待{audit_log}").into()),
    content: Some(format!("<#=table_comment#> {<#=auditModelLabel#>} 已被反审核，请重新{audit_log}。").into()),
    route_path: Some(get_page_path_<#=table#>().into()),
    route_query: Some(format!("id={<#=table#>_id}").into()),
    tenant_id: old_model.tenant_id.into(),
    is_sys_msg: Some(1),
    ..Default::default()
  };
  
  let receiver_usr_ids = get_audit_receiver_usr_ids(
    SmolStr::new(get_page_path_<#=table#>()),
    SmolStr::new(audit.to_string()),
    options,
  ).await?;
  
  let receiver_usr_ids = receiver_usr_ids.into_iter()
    .filter(|x| x != &audit_usr_id)
    .collect::<std::collections::HashSet<_>>()
    .into_iter()
    .collect::<Vec<_>>();
  
  let mut receiver_usr_ids2 = Vec::with_capacity(receiver_usr_ids.len());
  
  for receiver_usr_id in receiver_usr_ids {
    
    if is_admin(receiver_usr_id, options).await? {
      continue;
    }
    
    let has_permit = find_one_<#=table#>(
      Some(<#=tableUP#>Search {
        id: Some(<#=table#>_id),
        auth_usr_id: Some(receiver_usr_id),
        ..Default::default()
      }),
      None,
      options,
    ).await?.is_some();
    
    if has_permit {
      receiver_usr_ids2.push(receiver_usr_id);
    }
    
  }
  
  let receiver_usr_ids = receiver_usr_ids2;
  
  crate::base::message::message_dao2::send_message(
    next_message.clone(),
    receiver_usr_ids.clone(),
    options,
  ).await?;
  
  let mut next_message_wxwork = MessageInput {
    ..next_message
  };
  next_message_wxwork.route_path = None;
  next_message_wxwork.route_query = None;
  
  crate::wxwork::wxw_msg::wxw_msg_dao2::send_message_wxwork(
    next_message_wxwork,
    receiver_usr_ids,
    options,
  ).await?;<#
  }
  #><#
  }
  #>

  Ok(true)
}<#
if (hasReviewed) {
#>

/// <#=table_comment#> 复核通过
pub async fn audit_review_<#=table#>(
  <#=table#>_id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<bool> {
  
  let old_model = <#=table#>_dao::find_by_id_ok_<#=table#>(
    <#=table#>_id,
    options,
  ).await?;
  
  if old_model.<#=auditColumn#> != <#=Table_Up#><#=auditColumnUp#>::Audited {<#
    if (isUseI18n) {
    #>
    let table_comment = ns(
      "<#=table_comment#>".to_owned(),
      options,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = ns(
      "只有已审核的 {0} 才能 复核通过".to_owned(),
      map.into(),
    ).await?;<#
    } else {
    #>
    let err_msg = "只有已审核的 <#=table_comment#> 才能 复核通过";<#
    }
    #>
    return Err(eyre!(err_msg));
  }<#
  if (auditTable_Up) {
  #><#
  if (opts?.lbl_field) {
  #>
  
  let <#=auditModelLabel#> = old_model.<#=opts?.lbl_field#>;<#
  } else {
  #>
  
  let <#=auditModelLabel#> = String::new();<#
  }
  #><#
  }
  #>
  
  let <#=table#>_input = <#=tableUP#>Input {
    <#=auditColumn#>: Some(<#=tableUP#>Audit::Reviewed),
    ..Default::default()
  };
  
  <#=table#>_dao::update_by_id_<#=table#>(
    <#=table#>_id, 
    <#=table#>_input,
    options,
  ).await?;<#
  if (auditTable_Up) {
  #>
  
  let audit_usr_id = get_auth_id_ok()?;
  let audit_time = get_now();
  
  let audit_usr_model = find_by_id_ok_usr(
    audit_usr_id,
    options,
  ).await?;
  
  let audit_usr_id_lbl = audit_usr_model.lbl;
  
  let <#=table#>_input = <#=auditTable_Up#>Input {
    <#=table#>_id: Some(<#=table#>_id),<#
    if (auditModelLabel) {
    #>
    <#=auditModelLabel#>: Some(<#=auditModelLabel#>.clone()),<#
    }
    #>
    audit: Some(<#=auditTable_Up#>Audit::Reviewed),
    audit_usr_id: Some(audit_usr_id),
    audit_usr_id_lbl: Some(audit_usr_id_lbl),
    audit_time: Some(audit_time),
    ..Default::default()
  };
  
  create_<#=auditTable#>(
    <#=table#>_input,
    options,
  ).await?;
  
  let receiver_usr_ids = vec![old_model.create_usr_id];
  let next_message = MessageInput {
    title: Some("<#=table_comment#>已复核通过".into()),
    content: Some(format!("<#=table_comment#> {<#=auditModelLabel#>} 已复核通过。").into()),
    route_path: Some(get_page_path_<#=table#>().into()),
    route_query: Some(format!("id={<#=table#>_id}").into()),
    tenant_id: old_model.tenant_id.into(),
    is_sys_msg: Some(1),
    ..Default::default()
  };
  
  if !old_model.create_usr_id.is_empty() {
    
    crate::base::message::message_dao2::send_message(
      next_message.clone(),
      receiver_usr_ids.clone(),
      options,
    ).await?;
    
    let mut next_message_wxwork = MessageInput {
      ..next_message
    };
    next_message_wxwork.route_path = None;
    next_message_wxwork.route_query = None;
    
    crate::wxwork::wxw_msg::wxw_msg_dao2::send_message_wxwork(
      next_message_wxwork,
      receiver_usr_ids.clone(),
      options,
    ).await?;
    
  }<#
  }
  #>
  
  Ok(true)
}<#
}
#><#
}
#>

/// 根据 <#=table#>_ids 删除<#=table_comment#>
#[allow(dead_code)]
pub async fn delete_by_ids_<#=table#>(
  <#=table#>_ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<u64> {<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #><#
  if (hasLocked || hasAudit || hasBpm) {
  #>
  
  let old_models = <#=table#>_dao::find_all_<#=table#>(
    Some(<#=Table_Up#>Search {
      ids: Some(<#=table#>_ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options,
  ).await?;<#
  }
  #><#
  if (hasLocked) {
  #>
  
  for old_model in &old_models {
    if old_model.is_locked == 1 {<#
      if (isUseI18n) {
      #>
      let table_comment = ns(
        "<#=table_comment#>".to_owned(),
        options,
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
  if (hasBpm) {
  #>
  
  for old_model in &old_models {
    if old_model.<#=bpmStatusField#> == <#=tableUP#><#=bpmStatusFieldUp#>::Running {
      return Err(eyre!("审批中的单据不允许删除"));
    }
  }<#
  }
  #><#
  if (hasAudit) {
  #>
  
  let usr_id = get_auth_id_ok()?;
  if !is_admin(usr_id, options).await? {
    for old_model in &old_models {
      if old_model.<#=auditColumn#> != <#=Table_Up#><#=auditColumnUp#>::Unsubmited &&
        old_model.<#=auditColumn#> != <#=Table_Up#><#=auditColumnUp#>::Rejected &&
        old_model.<#=auditColumn#> != <#=Table_Up#><#=auditColumnUp#>::Unaudited
      {<#
        if (isUseI18n) {
        #>
        let table_comment = ns(
          "<#=table_comment#>".to_owned(),
          options,
        ).await?;
        let map = HashMap::from([
          ("0".to_owned(), table_comment),
        ]);
        let err_msg = ns(
          "只有待提交或待审核的 {0} 才能删除".to_owned(),
          map.into(),
        ).await?;<#
        } else {
        #>
        let err_msg = "只有待提交或待审核的 <#=table_comment#> 才能删除";<#
        }
        #>
        return Err(eyre!(err_msg));
      }
    }
  }<#
  }
  #>
  
  let num = <#=table#>_dao::delete_by_ids_<#=table#>(
    <#=table#>_ids<#
    if (hasAudit) {
    #>.clone()<#
    }
    #>,
    options,
  ).await?;<#
  if (mod === "base" && table === "i18n") {
  #>
  
  update_i18n_version().await?;<#
  }
  #><#
  if (hasAudit && auditTable_Up) {
  #>
  
  // 级联删除审核记录
  let <#=auditTable#>_models = find_all_<#=auditTable#>(
    Some(<#=auditTable_Up#>Search {
      <#=table#>_id: Some(<#=table#>_ids),
      ..Default::default()
    }),
    None,
    None,
    options,
  ).await?;
  
  let <#=auditTable#>_ids = <#=auditTable#>_models
    .into_iter()
    .map(|model| model.id)
    .collect::<Vec<<#=auditTable_Up#>Id>>();
  
  delete_by_ids_<#=auditTable#>(
    <#=auditTable#>_ids,
    options,
  ).await?;<#
  }
  #>
  
  Ok(num)
}<#
if (hasDefault) {
#>

/// 根据 <#=table#>_id 设置默认<#=table_comment#>
#[allow(dead_code)]
pub async fn default_by_id_<#=table#>(
  <#=table#>_id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<u64> {<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
  let num = <#=table#>_dao::default_by_id_<#=table#>(
    <#=table#>_id,
    options,
  ).await?;
  
  Ok(num)
}<#
}
#><#
if (hasEnabled) {
#>

/// 根据 <#=table#>_id 查找<#=table_comment#>是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id_<#=table#>(
  <#=table#>_id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<bool> {<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
  let is_enabled = <#=table#>_dao::get_is_enabled_by_id_<#=table#>(
    <#=table#>_id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 <#=table#>_ids 启用或者禁用<#=table_comment#>
#[allow(dead_code)]
pub async fn enable_by_ids_<#=table#>(
  <#=table#>_ids: Vec<<#=Table_Up#>Id>,
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
  
  let num = <#=table#>_dao::enable_by_ids_<#=table#>(
    <#=table#>_ids,
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

/// 根据 <#=table#>_id 查找<#=table_comment#>是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id_<#=table#>(
  <#=table#>_id: <#=Table_Up#>Id,
  options: Option<Options>,
) -> Result<bool> {<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
  let is_locked = <#=table#>_dao::get_is_locked_by_id_<#=table#>(
    <#=table#>_id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 <#=table#>_ids 锁定或者解锁<#=table_comment#>
#[allow(dead_code)]
pub async fn lock_by_ids_<#=table#>(
  <#=table#>_ids: Vec<<#=Table_Up#>Id>,
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
  
  let num = <#=table#>_dao::lock_by_ids_<#=table#>(
    <#=table#>_ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}<#
}
#>

/// 获取<#=table_comment#>字段注释
pub async fn get_field_comments_<#=table#>(
  options: Option<Options>,
) -> Result<<#=tableUP#>FieldComment> {<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
  let comments = <#=table#>_dao::get_field_comments_<#=table#>(
    options,
  ).await?;
  
  Ok(comments)
}<#
if (hasIsDeleted) {
#>

/// 根据 <#=table#>_ids 还原<#=table_comment#>
#[allow(dead_code)]
pub async fn revert_by_ids_<#=table#>(
  <#=table#>_ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<u64> {<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
  let num = <#=table#>_dao::revert_by_ids_<#=table#>(
    <#=table#>_ids<#
    if (hasAudit) {
    #>.clone()<#
    }
    #>,
    options,
  ).await?;<#
  if (mod === "base" && table === "i18n") {
  #>
  
  update_i18n_version().await?;<#
  }
  #><#
  if (hasAudit && auditTable_Up) {
  #>
  
  // 级联还原审核记录
  let <#=auditTable#>_models = find_all_<#=auditTable#>(
    Some(<#=auditTable_Up#>Search {
      <#=table#>_id: Some(<#=table#>_ids),
      is_deleted: Some(1),
      ..Default::default()
    }),
    None,
    None,
    options,
  ).await?;
  
  let <#=auditTable#>_ids = <#=auditTable#>_models
    .into_iter()
    .map(|model| model.id)
    .collect::<Vec<<#=auditTable_Up#>Id>>();
  
  revert_by_ids_<#=auditTable#>(
    <#=auditTable#>_ids,
    options,
  ).await?;<#
  }
  #>
  
  Ok(num)
}<#
}
#><#
if (hasIsDeleted) {
#>

/// 根据 <#=table#>_ids 彻底删除<#=table_comment#>
#[allow(dead_code)]
pub async fn force_delete_by_ids_<#=table#>(
  <#=table#>_ids: Vec<<#=Table_Up#>Id>,
  options: Option<Options>,
) -> Result<u64> {<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  let options = Options::from(options)
    .set_has_data_permit(true);
  let options = Some(options);<#
  }
  #>
  
  let num = <#=table#>_dao::force_delete_by_ids_<#=table#>(
    <#=table#>_ids<#
    if (hasAudit) {
    #>.clone()<#
    }
    #>,
    options,
  ).await?;<#
  if (hasAudit && auditTable_Up) {
  #>
  
  // 级联彻底删除审核记录
  let <#=auditTable#>_models = find_all_<#=auditTable#>(
    Some(<#=auditTable_Up#>Search {
      <#=table#>_id: Some(<#=table#>_ids),
      is_deleted: Some(1),
      ..Default::default()
    }),
    None,
    None,
    options,
  ).await?;
  
  let <#=auditTable#>_ids = <#=auditTable#>_models
    .into_iter()
    .map(|model| model.id)
    .collect::<Vec<<#=auditTable_Up#>Id>>();
  
  force_delete_by_ids_<#=auditTable#>(
    <#=auditTable#>_ids,
    options,
  ).await?;<#
  }
  #>
  
  Ok(num)
}<#
}
#><#
if (hasSummary) {
#>

/// 根据搜索条件查找<#=table_comment#>合计
pub async fn find_summary_<#=table#>(
  search: Option<<#=Table_Up#>Search>,
  options: Option<Options>,
) -> Result<<#=tableUP#>Summary> {
  
  let summary = <#=table#>_dao::find_summary_<#=table#>(
    search,
    options,
  ).await?;
  
  Ok(summary)
}<#
}
#><#
if (hasOrderBy) {
#>

/// 查找 <#=table_comment#> order_by 字段的最大值
pub async fn find_last_order_by_<#=table#>(
  search: Option<<#=tableUP#>Search>,
  options: Option<Options>,
) -> Result<u32> {
  
  let order_by = <#=table#>_dao::find_last_order_by_<#=table#>(
    search,
    options,
  ).await?;
  
  Ok(order_by)
}<#
}
#>
