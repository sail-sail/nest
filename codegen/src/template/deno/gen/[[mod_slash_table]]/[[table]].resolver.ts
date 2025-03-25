<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasEnabled = columns.some((column) => column.COLUMN_NAME === "is_enabled");
const hasDefault = columns.some((column) => column.COLUMN_NAME === "is_default");
const hasPassword = columns.some((column) => column.isPassword);
const hasIsHidden = columns.some((column) => column.COLUMN_NAME === "is_hidden");
const hasIsDeleted = columns.some((column) => column.COLUMN_NAME === "is_deleted");
let Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
let Table_Up2 = Table_Up;
let modelName = "";
let fieldCommentName = "";
let inputName = "";
let searchName = "";
if (/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 1))
  && !/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 2))
) {
  modelName = Table_Up2 + "Model";
  fieldCommentName = Table_Up2 + "FieldComment";
  inputName = Table_Up2 + "Input";
  searchName = Table_Up2 + "Search";
} else {
  modelName = Table_Up + "Model";
  fieldCommentName = Table_Up + "FieldComment";
  inputName = Table_Up + "Input";
  searchName = Table_Up + "Search";
}
const hasSummary = columns.some((column) => column.showSummary);

const tableFieldPermit = columns.some((item) => item.fieldPermit);

// 审核
const hasAudit = !!opts?.audit;
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
}
// 是否有复核
const hasReviewed = opts?.hasReviewed;
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

#>import {
  set_is_tran,<#
  if (opts.noAdd !== true) {
  #>
  set_is_creating,<#
  }
  #>
} from "/lib/context.ts";<#
let hasDecimal = false;
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
  if (column.noList) continue;
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") continue;
  if (column_name === "version") continue;
  const foreignKey = column.foreignKey;
  let data_type = column.DATA_TYPE;
  let column_type = column.COLUMN_TYPE;
  if (!column_type) {
    continue;
  }
  if (!column_type.startsWith("decimal")) {
    continue;
  }
  hasDecimal = true;
}
#><#
if (hasDecimal) {
#>

import Decimal from "decimal.js";<#
}
#>

import type {<#
  if (opts.noAdd !== true) {
  #>
  UniqueType,<#
  }
  #>
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSort<#=Table_Up#>,<#
  if (tableFieldPermit) {
  #><#
    if (opts.noAdd !== true || opts.noEdit !== true) {
  #>
  fieldPermitInput<#=Table_Up2#>,<#
    }
  #>
  fieldPermitModel<#=Table_Up2#>,<#
  }
  #>
} from "./<#=table#>.model.ts";<#
if (hasSummary) {
#>

import {
  <#=Table_Up2#>Summary,
} from "/gen/types.ts";<#
}
#>

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";<#
if (mod === "cron" && table === "cron_job") {
#>

import "./cron_job.service.ts";<#
}
#>

import {
  route_path,
} from "./<#=table#>.model.ts";

/**
 * 根据条件查找<#=table_comment#>总数
 */
export async function findCount<#=Table_Up2#>(
  search?: <#=searchName#>,
): Promise<number> {
  
  const {
    findCount<#=Table_Up2#>,
  } = await import("./<#=table#>.service.ts");<#
  if (hasIsHidden) {
  #>
  
  search = search || { };
  search.is_hidden = [ 0 ];<#
  }
  #>
  
  const num = await findCount<#=Table_Up2#>(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找<#=table_comment#>列表
 */
export async function findAll<#=Table_Up2#>(
  search?: <#=searchName#>,
  page?: PageInput,
  sort?: SortInput[],
): Promise<<#=modelName#>[]> {
  
  const {
    findAll<#=Table_Up2#>,
  } = await import("./<#=table#>.service.ts");<#
  if (hasIsHidden) {
  #>
  
  search = search || { };
  search.is_hidden = [ 0 ];<#
  }
  #>
  
  checkSort<#=Table_Up#>(sort);
  
  const models = await findAll<#=Table_Up2#>(search, page, sort);<#
  if (hasPassword) {
  #>
  
  for (const model of models) {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      const column_comment = column.COLUMN_COMMENT || "";
      const isPassword = column.isPassword;
    #><#
      if (isPassword) {
    #>
    // <#=column_comment#>
    model.<#=column_name#> = "";<#
      }
    #><#
    }
    #>
  }<#
  }
  #><#
  if (tableFieldPermit) {
  #>
  
  await fieldPermitModel<#=Table_Up2#>(models);<#
  }
  #>
  
  return models;
}

/**
 * 获取<#=table_comment#>字段注释
 */
export async function getFieldComments<#=Table_Up2#>(): Promise<<#=fieldCommentName#>> {
  
  const {
    getFieldComments<#=Table_Up2#>,
  } = await import("./<#=table#>.service.ts");
  
  const field_comment = await getFieldComments<#=Table_Up2#>();
  
  return field_comment;
}<#
if (hasSummary) {
#>

/**
 * 根据搜索条件查找<#=table_comment#>合计
 */
export async function findSummary<#=Table_Up2#>(
  search?: <#=searchName#>,
): Promise<<#=Table_Up#>Summary> {
  
  const {
    findSummary<#=Table_Up2#>,
  } = await import("./<#=table#>.service.ts");
  
  const res = await findSummary<#=Table_Up2#>(search);
  
  return res;
}<#
}
#>

/**
 * 根据条件查找第一个<#=table_comment#>
 */
export async function findOne<#=Table_Up2#>(
  search?: <#=searchName#>,
  sort?: SortInput[],
): Promise<<#=modelName#> | undefined> {
  
  const {
    findOne<#=Table_Up2#>,
  } = await import("./<#=table#>.service.ts");<#
  if (hasIsHidden) {
  #>
  
  search = search || { };
  search.is_hidden = [ 0 ];<#
  }
  #>
  
  checkSort<#=Table_Up2#>(sort);
  
  const model = await findOne<#=Table_Up2#>(search, sort);<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    const column_comment = column.COLUMN_COMMENT || "";
    const isPassword = column.isPassword;
  #><#
    if (isPassword) {
  #>
  
  if (model) {
    // <#=column_comment#>
    model.<#=column_name#> = "";
  }<#
    }
  #><#
  }
  #><#
  if (tableFieldPermit) {
  #>
  
  await fieldPermitModel<#=Table_Up2#>([ model ]);<#
  }
  #>
  
  return model;
}

/**
 * 根据 id 查找<#=table_comment#>
 */
export async function findById<#=Table_Up2#>(
  id: <#=Table_Up#>Id,
): Promise<<#=modelName#> | undefined> {
  
  const {
    findById<#=Table_Up2#>,
  } = await import("./<#=table#>.service.ts");
  
  const model = await findById<#=Table_Up2#>(id);<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    const column_comment = column.COLUMN_COMMENT || "";
    const isPassword = column.isPassword;
  #><#
    if (isPassword) {
  #>
  
  if (model) {
    // <#=column_comment#>
    model.<#=column_name#> = "";
  }<#
    }
  #><#
  }
  #><#
  if (tableFieldPermit) {
  #>
  
  await fieldPermitModel<#=Table_Up2#>([ model ]);<#
  }
  #>
  
  return model;
}

/**
 * 根据 ids 查找<#=table_comment#>
 */
export async function findByIds<#=Table_Up2#>(
  ids: <#=Table_Up#>Id[],
): Promise<<#=modelName#>[]> {
  
  const {
    findByIds<#=Table_Up2#>,
  } = await import("./<#=table#>.service.ts");
  
  const models = await findByIds<#=Table_Up2#>(ids);
  
  for (const model of models) {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      const column_comment = column.COLUMN_COMMENT || "";
      const isPassword = column.isPassword;
    #><#
      if (isPassword) {
    #>
    // <#=column_comment#>
    model.<#=column_name#> = "";<#
    }
    #><#
    }
    #>
  }<#
  if (tableFieldPermit) {
  #>
  
  await fieldPermitModel<#=Table_Up2#>(models);<#
  }
  #>
  
  return models;
}<#
if (opts.noAdd !== true) {
#>

/**
 * 批量创建<#=table_comment#>
 */
export async function creates<#=Table_Up2#>(
  inputs: <#=inputName#>[],
  unique_type?: UniqueType,
): Promise<<#=Table_Up#>Id[]> {
  
  const {
    validate<#=Table_Up2#>,
    setIdByLbl<#=Table_Up2#>,
    creates<#=Table_Up2#>,
  } = await import("./<#=table#>.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );<#
  if (tableFieldPermit) {
  #>
  
  await fieldPermitInput<#=Table_Up2#>(inputs);<#
  }
  #><#
  if (log) {
  #>
  
  const {
    log,
  } = await import("/src/base/operation_record/operation_record.service.ts");
  
  const begin_time = new Date();<#
  }
  #>
  
  for (const input of inputs) {
    input.id = undefined;<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno) continue;
      if (column.noList) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      if (column_name === "version") continue;
      const foreignKey = column.foreignKey;
      const data_type = column.DATA_TYPE;
      const column_type = column.COLUMN_TYPE;
      if (!column_type) {
        continue;
      }
      if (!column_type.startsWith("decimal")) {
        continue;
      }
      const column_comment = column.COLUMN_COMMENT || "";
    #>
    
    // <#=column_comment#>
    if (input.<#=column_name#> != null) {
      input.<#=column_name#> = new Decimal(input.<#=column_name#>);
    }<#
    }
    #>
    
    await setIdByLbl<#=Table_Up2#>(input);
    
    await validate<#=Table_Up2#>(input);
  }
  const uniqueType = unique_type;
  const ids = await creates<#=Table_Up2#>(inputs, { uniqueType });<#
  if (log) {
  #>
  
  const new_data = await findAll<#=Table_Up2#>({
    ids,
  });
  
  const end_time = new Date();
  await log({
    module: "<#=mod#>_<#=table#>",
    module_lbl: "<#=table_comment#>",
    method: "creates<#=Table_Up2#>",
    method_lbl: "新增",
    lbl: "新增",
    time: end_time.getTime() - begin_time.getTime(),
    new_data: JSON.stringify(new_data),
  });<#
  }
  #>
  return ids;
}<#
}
#><#
if (opts.noEdit !== true) {
#>

/**
 * 根据 id 修改<#=table_comment#>
 */
export async function updateById<#=Table_Up2#>(
  id: <#=Table_Up#>Id,
  input: <#=inputName#>,
): Promise<<#=Table_Up#>Id> {
  
  input.id = undefined;<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    if (column.noList) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    if (column_name === "version") continue;
    const foreignKey = column.foreignKey;
    const data_type = column.DATA_TYPE;
    const column_type = column.COLUMN_TYPE;
    if (!column_type) {
      continue;
    }
    if (!column_type.startsWith("decimal")) {
      continue;
    }
    const column_comment = column.COLUMN_COMMENT || "";
  #>
  
  // <#=column_comment#>
  if (input.<#=column_name#> != null) {
    input.<#=column_name#> = new Decimal(input.<#=column_name#>);
  }<#
  }
  #>
  
  const {
    setIdByLbl<#=Table_Up2#>,
    updateById<#=Table_Up2#>,
  } = await import("./<#=table#>.service.ts");
  
  set_is_tran(true);
  
  await setIdByLbl<#=Table_Up2#>(input);
  
  await usePermit(
    route_path,
    "edit",
  );<#
  if (tableFieldPermit) {
  #>
  
  await fieldPermitInput<#=Table_Up2#>([ input ]);<#
  }
  #><#
  if (log) {
  #>
  
  const {
    log,
  } = await import("/src/base/operation_record/operation_record.service.ts");
  
  const begin_time = new Date();
  const old_data = await findById<#=Table_Up2#>(id);<#
  }
  #>
  
  const id2: <#=Table_Up#>Id = await updateById<#=Table_Up2#>(id, input);<#
  if (log) {
  #>
  
  const new_data = await findById<#=Table_Up2#>(id2);
  
  const end_time = new Date();
  await log({
    module: "<#=mod#>_<#=table#>",
    module_lbl: "<#=table_comment#>",
    method: "updateById<#=Table_Up2#>",
    method_lbl: "编辑",
    lbl: "编辑",
    time: end_time.getTime() - begin_time.getTime(),
    old_data: JSON.stringify(old_data),
    new_data: JSON.stringify(new_data),
  });<#
  }
  #>
  
  return id2;
}<#
}
#><#
if (hasAudit) {
#>

/** <#=table_comment#> 审核提交 */
export async function auditSubmit<#=Table_Up2#>(
  id: <#=Table_Up#>Id,
) {
  
  const {
    auditSubmit<#=Table_Up2#>,
  } = await import("./<#=table#>.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "audit_submit",
  );<#
  if (log) {
  #>
  
  const {
    log,
  } = await import("/src/base/operation_record/operation_record.service.ts");
  
  const begin_time = new Date();
  const old_data = id;<#
  }
  #>
  
  const res = await auditSubmit<#=Table_Up2#>(id);<#
  if (log) {
  #>
  
  const end_time = new Date();
  await log({
    module: "<#=mod#>_<#=table#>",
    module_lbl: "<#=table_comment#>",
    method: "auditSubmit<#=Table_Up2#>",
    method_lbl: "审核提交",
    lbl: "审核提交",
    time: end_time.getTime() - begin_time.getTime(),
    old_data,
  });<#
  }
  #>
  
  return res;
}

/** <#=table_comment#> 审核通过 */
export async function auditPass<#=Table_Up2#>(
  id: <#=Table_Up#>Id,
) {
  
  const {
    auditPass<#=Table_Up2#>,
  } = await import("./<#=table#>.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "audit_pass",
  );<#
  if (log) {
  #>
  
  const {
    log,
  } = await import("/src/base/operation_record/operation_record.service.ts");
  
  const begin_time = new Date();
  const old_data = id;<#
  }
  #>
  
  const res = await auditPass<#=Table_Up2#>(id);<#
  if (log) {
  #>
  
  const end_time = new Date();
  await log({
    module: "<#=mod#>_<#=table#>",
    module_lbl: "<#=table_comment#>",
    method: "auditPass<#=Table_Up2#>",
    method_lbl: "审核通过",
    lbl: "审核通过",
    time: end_time.getTime() - begin_time.getTime(),
    old_data,
  });<#
  }
  #>
  
  return res;
}

/** <#=table_comment#> 审核拒绝 */
export async function auditReject<#=Table_Up2#>(
  id: <#=Table_Up#>Id,
  input: <#=auditTable_Up#>Input,
) {
  
  const {
    auditReject<#=Table_Up2#>,
  } = await import("./<#=table#>.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "audit_reject",
  );<#
  if (log) {
  #>
  
  const {
    log,
  } = await import("/src/base/operation_record/operation_record.service.ts");
  
  const begin_time = new Date();
  const old_data = id;<#
  }
  #>
  
  const res = await auditReject<#=Table_Up2#>(id, input);<#
  if (log) {
  #>
  
  const end_time = new Date();
  await log({
    module: "<#=mod#>_<#=table#>",
    module_lbl: "<#=table_comment#>",
    method: "auditReject<#=Table_Up2#>",
    method_lbl: "审核拒绝",
    lbl: "审核拒绝",
    time: end_time.getTime() - begin_time.getTime(),
    old_data,
  });<#
  }
  #>
  
  return res;
}<#
if (hasReviewed) {
#>

/** <#=table_comment#> 复核通过 */
export async function auditReview<#=Table_Up2#>(
  id: <#=Table_Up#>Id,
) {
  
  const {
    auditReview<#=Table_Up2#>,
  } = await import("./<#=table#>.service.ts");
  
  set_is_tran(true);
  
  await usePermit<#=Table_Up2#>(
    route_path,
    "audit_review",
  );<#
  if (log) {
  #>
  
  const {
    log,
  } = await import("/src/base/operation_record/operation_record.service.ts");
  
  const begin_time = new Date();
  const old_data = id;<#
  }
  #>
  
  const res = await auditReview(id);<#
  if (log) {
  #>
  
  const end_time = new Date();
  await log({
    module: "<#=mod#>_<#=table#>",
    module_lbl: "<#=table_comment#>",
    method: "auditReview<#=Table_Up2#>",
    method_lbl: "复核通过",
    lbl: "复核通过",
    time: end_time.getTime() - begin_time.getTime(),
    old_data,
  });<#
  }
  #>
  
  return res;
}<#
}
#><#
}
#><#
if (opts.noDelete !== true) {
#>

/**
 * 根据 ids 删除<#=table_comment#>
 */
export async function deleteByIds<#=Table_Up2#>(
  ids: <#=Table_Up#>Id[],
): Promise<number> {
  
  const {
    deleteByIds<#=Table_Up2#>,
  } = await import("./<#=table#>.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );<#
  if (log) {
  #>
  
  const {
    log,
  } = await import("/src/base/operation_record/operation_record.service.ts");
  
  const begin_time = new Date();
  
  const old_data = await findAll<#=Table_Up2#>({
    ids,
  });<#
  }
  #>
  
  const num = await deleteByIds<#=Table_Up2#>(ids);<#
  if (log) {
  #>
  
  const end_time = new Date();
  
  await log({
    module: "<#=mod#>_<#=table#>",
    module_lbl: "<#=table_comment#>",
    method: "deleteByIds<#=Table_Up2#>",
    method_lbl: "删除",
    lbl: "删除",
    time: end_time.getTime() - begin_time.getTime(),
    old_data: JSON.stringify(old_data),
  });<#
  }
  #>
  
  return num;
}<#
}
#><#
  if (hasDefault && opts.noEdit !== true) {
#>

/**
 * 根据 id 设置默认<#=table_comment#>
 */
export async function defaultById<#=Table_Up2#>(
  id: <#=Table_Up#>Id,
): Promise<number> {
  
  const {
    defaultById<#=Table_Up2#>,
  } = await import("./<#=table#>.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );<#
  if (log) {
  #>
  
  const {
    log,
  } = await import("/src/base/operation_record/operation_record.service.ts");
  
  const begin_time = new Date();<#
  }
  #>
  
  const res = await defaultById<#=Table_Up2#>(id);<#
  if (log) {
  #>
  
  const end_time = new Date();
  
  await log({
    module: "<#=mod#>_<#=table#>",
    module_lbl: "<#=table_comment#>",
    method: "defaultById<#=Table_Up2#>",
    method_lbl: "默认",
    lbl: "默认",
    time: end_time.getTime() - begin_time.getTime(),
    old_data: JSON.stringify(ids),
  });<#
  }
  #>
  return res;
}<#
  }
#><#
  if (hasEnabled && opts.noEdit !== true) {
#>

/**
 * 根据 ids 启用或者禁用<#=table_comment#>
 */
export async function enableByIds<#=Table_Up2#>(
  ids: <#=Table_Up#>Id[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds<#=Table_Up2#>,
  } = await import("./<#=table#>.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIds<#=Table_Up#>.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );<#
  if (log) {
  #>
  
  const {
    log,
  } = await import("/src/base/operation_record/operation_record.service.ts");
  
  const begin_time = new Date();<#
  }
  #>
  const res = await enableByIds<#=Table_Up2#>(ids, is_enabled);<#
  if (log) {
  #>
  
  let method = "";
  if (is_enabled) {
    method = "enableByIds<#=Table_Up2#>";
  } else {
    method = "disableByIds<#=Table_Up2#>";
  }
  
  const end_time = new Date();
  
  await log({
    module: "<#=mod#>_<#=table#>",
    module_lbl: "<#=table_comment#>",
    method,
    method_lbl: "启用",
    lbl: "启用",
    time: end_time.getTime() - begin_time.getTime(),
    old_data: JSON.stringify(ids),
  });<#
  }
  #>
  
  return res;
}<#
  }
#><#
  if (hasLocked && opts.noEdit !== true) {
#>

/**
 * 根据 ids 锁定或者解锁<#=table_comment#>
 */
export async function lockByIds<#=Table_Up2#>(
  ids: <#=Table_Up#>Id[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds<#=Table_Up2#>,
  } = await import("./<#=table#>.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIds<#=Table_Up2#>.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );<#
  if (log) {
  #>
  
  const {
    log,
  } = await import("/src/base/operation_record/operation_record.service.ts");
  
  const begin_time = new Date();<#
  }
  #>
  
  const res = await lockByIds<#=Table_Up2#>(ids, is_locked);<#
  if (log) {
  #>
  
  const end_time = new Date();
  
  await log({
    module: "<#=mod#>_<#=table#>",
    module_lbl: "<#=table_comment#>",
    method: "lockByIds<#=Table_Up2#>",
    method_lbl: is_locked ? "锁定" : "解锁",
    lbl: is_locked ? "锁定" : "解锁",
    time: end_time.getTime() - begin_time.getTime(),
    new_data: JSON.stringify(ids),
  });<#
  }
  #>
  
  return res;
}<#
  }
#><#
if (opts.noRevert !== true && hasIsDeleted) {
#>

/**
 * 根据 ids 还原<#=table_comment#>
 */
export async function revertByIds<#=Table_Up2#>(
  ids: <#=Table_Up#>Id[],
): Promise<number> {
  
  const {
    revertByIds<#=Table_Up2#>,
  } = await import("./<#=table#>.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );<#
  if (log) {
  #>
  
  const {
    log,
  } = await import("/src/base/operation_record/operation_record.service.ts");
  
  const begin_time = new Date();<#
  }
  #>
  
  const res = await revertByIds<#=Table_Up2#>(ids);<#
  if (log) {
  #>
  
  const end_time = new Date();
  
  await log({
    module: "<#=mod#>_<#=table#>",
    module_lbl: "<#=table_comment#>",
    method: "revertByIds<#=Table_Up2#>",
    method_lbl: "还原",
    lbl: "还原",
    time: end_time.getTime() - begin_time.getTime(),
    new_data: JSON.stringify(ids),
  });<#
  }
  #>
  
  return res;
}<#
}
#><#
if (opts.noDelete !== true && hasIsDeleted) {
#>

/**
 * 根据 ids 彻底删除<#=table_comment#>
 */
export async function forceDeleteByIds<#=Table_Up2#>(
  ids: <#=Table_Up#>Id[],
): Promise<number> {
  
  const {
    forceDeleteByIds<#=Table_Up2#>,
  } = await import("./<#=table#>.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );<#
  if (log) {
  #>
  
  const {
    log,
  } = await import("/src/base/operation_record/operation_record.service.ts");
  
  const begin_time = new Date();
  
  const old_data = await findAll<#=Table_Up2#>({
    ids,
    is_deleted: 1,
  });<#
  }
  #>
  
  const res = await forceDeleteByIds<#=Table_Up2#>(ids);<#
  if (log) {
  #>
  
  const end_time = new Date();
  
  await log({
    module: "<#=mod#>_<#=table#>",
    module_lbl: "<#=table_comment#>",
    method: "forceDeleteByIds<#=Table_Up2#>",
    method_lbl: "彻底删除",
    lbl: "彻底删除",
    time: end_time.getTime() - begin_time.getTime(),
    old_data: JSON.stringify(old_data),
  });<#
  }
  #>
  
  return res;
}<#
}
#><#
if (hasDataPermit() && hasCreateUsrId) {
#>

/**
 * 根据 ids 获取<#=table_comment#>是否可编辑数据权限
 */
export async function getEditableDataPermitsByIds<#=Table_Up2#>(
  ids: <#=Table_Up#>Id[],
) {
  
  const {
    getEditableDataPermitsByIds<#=Table_Up2#>,
  } = await import("./<#=table#>.service.ts");
  
  const data = await getEditableDataPermitsByIds<#=Table_Up2#>(ids);
  
  return data;
}<#
}
#><#
if (hasOrderBy) {
#>

/**
 * 查找 <#=table_comment#> order_by 字段的最大值
 */
export async function findLastOrderBy<#=Table_Up2#>(): Promise<number> {
  
  const {
    findLastOrderBy<#=Table_Up2#>,
  } = await import("./<#=table#>.service.ts");
  
  const res = findLastOrderBy<#=Table_Up2#>();
  
  return res;
}<#
}
#>
