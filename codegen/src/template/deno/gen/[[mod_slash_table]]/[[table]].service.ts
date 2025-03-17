<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasEnabled = columns.some((column) => column.COLUMN_NAME === "is_enabled");
const hasDefault = columns.some((column) => column.COLUMN_NAME === "is_default");
const hasIsSys = columns.some((column) => column.COLUMN_NAME === "is_sys");
const hasIsDeleted = columns.some((column) => column.COLUMN_NAME === "is_deleted");
let Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
let modelName = "";
let fieldCommentName = "";
let inputName = "";
let searchName = "";
if (/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 1))
  && !/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 2))
) {
  modelName = Table_Up + "Model";
  fieldCommentName = Table_Up + "FieldComment";
  inputName = Table_Up + "Input";
  searchName = Table_Up + "Search";
} else {
  modelName = Table_Up + "Model";
  fieldCommentName = Table_Up + "FieldComment";
  inputName = Table_Up + "Input";
  searchName = Table_Up + "Search";
}

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
const auditColumnUp = auditColumn.substring(0,1).toUpperCase() + auditColumn.substring(1);
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

#><#
const hasSummary = columns.some((column) => column.showSummary);
#>import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";<#
if (hasAudit) {
#>

import {
  reqDate,
} from "/lib/context.ts";<#
}
#><#
if (hasLocked || hasIsSys) {
#><#
if (isUseI18n) {
#>

import {
  ns,
} from "/src/base/i18n/i18n.ts";<#
}
#><#
}
#><#
if (
  (opts.filterDataByCreateUsr || hasOrgId) ||
  hasAudit
) {
#>

import {
  get_usr_id,<#
  if (hasOrgId) {
  #>
  get_org_id,<#
  }
  #>
} from "/lib/auth/auth.dao.ts";

import {
  findById as findByIdUsr,
  validateOption as validateOptionUsr,
} from "/gen/base/usr/usr.dao.ts";<#
}
#><#
if (hasSummary) {
#>

import {
  <#=Table_Up#>Summary,
} from "/gen/types.ts";<#
}
#><#
if (mod === "base" && table === "i18n") {
#>
  
import {
  update_i18n_version,
} from "/src/base/options/options.dao.ts";<#
}
#><#
if (hasAudit && auditTable_Up) {
#>

import {
  findAll as findAll<#=auditTable_Up#>,
  create as create<#=auditTable_Up#>,
  deleteByIds as deleteByIds<#=auditTable_Up#>,<#
  if (hasIsDeleted) {
  #>
  revertByIds as revertByIds<#=auditTable_Up#>,
  forceDeleteByIds as forceDeleteByIds<#=auditTable_Up#>,<#
  }
  #>
} from "/gen/<#=auditMod#>/<#=auditTable#>/<#=auditTable#>.dao.ts";

import {
  <#=Table_Up#><#=auditColumnUp#>,
  <#=auditTable_Up#>Audit,
} from "/gen/types.ts"<#
}
#><#
if (hasAudit) {
#>

import dayjs from "dayjs";<#
}
#>

import * as <#=table#>Dao from "./<#=table#>.dao.ts";

async function setSearchQuery(<#
  if (opts.filterDataByCreateUsr || hasOrgId) {
  #>
  search: <#=searchName#>,<#
  } else {
  #>
  _search: <#=searchName#>,<#
  }
  #>
) {<#
  if (opts.filterDataByCreateUsr || hasOrgId) {
  #>
  
  const usr_id = await get_usr_id();<#
    if (hasOrgId) {
  #>
  const org_id = await get_org_id();<#
    }
  #>
  const usr_model = await findByIdUsr(usr_id);
  if (!usr_id || !usr_model) {
    throw new Error("usr_id can not be null");
  }<#
    if (hasOrgId) {
  #>
  const org_ids: OrgId[] = [ ];
  if (org_id) {
    org_ids.push(org_id);
  } else {
    org_ids.push(...usr_model.org_ids);
    org_ids.push("" as OrgId);
  }<#
    }
  #>
  const username = usr_model.username;<#
  }
  #><#
  if (opts.filterDataByCreateUsr) {
  #>
  
  if (username !== "admin") {
    search.create_usr_id = [ usr_id ];
  }<#
  } else if (hasOrgId) {
  #>
  
  if (username !== "admin") {
    search.org_id = org_ids;
  }<#
  }
  #>
  
}

/**
 * 根据条件查找<#=table_comment#>总数
 */
export async function findCount(
  search?: <#=searchName#>,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const <#=table#>_num = await <#=table#>Dao.findCount(search<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>, {<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    hasDataPermit: true,<#
    }
    #>
  }<#
    }
  #>);
  
  return <#=table#>_num;
}

/**
 * 根据搜索条件和分页查找<#=table_comment#>列表
 */
export async function findAll(
  search?: <#=searchName#>,
  page?: PageInput,
  sort?: SortInput[],
): Promise<<#=modelName#>[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const <#=table#>_models = await <#=table#>Dao.findAll(search, page, sort<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>, {<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    hasDataPermit: true,<#
    }
    #>
  }<#
    }
  #>);
  
  return <#=table#>_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: <#=inputName#>,
): Promise<void> {
  await <#=table#>Dao.setIdByLbl(input);
}<#
if (hasSummary) {
#>

/**
 * 根据搜索条件查找<#=table_comment#>合计
 */
export async function findSummary(
  search?: <#=searchName#>,
): Promise<<#=Table_Up#>Summary> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const <#=table#>_summary = await <#=table#>Dao.findSummary(search<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>, {<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    hasDataPermit: true,<#
    }
    #>
  }<#
    }
  #>);
  
  return <#=table#>_summary;
}<#
}
#>

/**
 * 根据条件查找第一个<#=table_comment#>
 */
export async function findOne(
  search?: <#=searchName#>,
  sort?: SortInput[],
): Promise<<#=modelName#> | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const <#=table#>_model = await <#=table#>Dao.findOne(search, sort<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>, {<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    hasDataPermit: true,<#
    }
    #>
  }<#
    }
  #>);
  
  return <#=table#>_model;
}

/**
 * 根据 id 查找<#=table_comment#>
 */
export async function findById(
  <#=table#>_id?: <#=Table_Up#>Id | null,
): Promise<<#=modelName#> | undefined> {
  
  const <#=table#>_model = await <#=table#>Dao.findById(<#=table#>_id<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>, {<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    hasDataPermit: true,<#
    }
    #>
  }<#
    }
  #>);
  
  return <#=table#>_model;
}

/**
 * 根据 ids 查找<#=table_comment#>
 */
export async function findByIds(
  <#=table#>_ids: <#=Table_Up#>Id[],
): Promise<<#=modelName#>[]> {
  
  const <#=table#>_models = await <#=table#>Dao.findByIds(<#=table#>_ids<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>, {<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    hasDataPermit: true,<#
    }
    #>
  }<#
    }
  #>);
  
  return <#=table#>_models;
}

/**
 * 根据搜索条件查找<#=table_comment#>是否存在
 */
export async function exist(
  search?: <#=searchName#>,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const <#=table#>_exist = await <#=table#>Dao.exist(search<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>, {<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    hasDataPermit: true,<#
    }
    #>
  }<#
    }
  #>);
  
  return <#=table#>_exist;
}

/**
 * 根据 id 查找<#=table_comment#>是否存在
 */
export async function existById(
  <#=table#>_id?: <#=Table_Up#>Id | null,
): Promise<boolean> {
  
  const <#=table#>_exist = await <#=table#>Dao.existById(<#=table#>_id<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>, {<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    hasDataPermit: true,<#
    }
    #>
  }<#
    }
  #>);
  
  return <#=table#>_exist;
}

/**
 * 增加和修改时校验<#=table_comment#>
 */
export async function validate(
  input: <#=inputName#>,
): Promise<void> {
  await <#=table#>Dao.validate(input);
}

/**
 * 批量创建<#=table_comment#>
 */
export async function creates(
  inputs: <#=inputName#>[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<<#=Table_Up#>Id[]> {<#
  if (hasAudit) {
  #>
  
  for(const input of inputs) {
    input.<#=auditColumn#> = <#=Table_Up#>Audit.Unsubmited;
  }<#
  }
  #>
  const <#=table#>_ids = await <#=table#>Dao.creates(inputs, options);<#
  if (mod === "base" && table === "i18n") {
  #>
  
  await update_i18n_version();<#
  }
  #>
  
  return <#=table#>_ids;
}<#
if (hasVersion) {
#>

/**
 * 根据 id 获取<#=table_comment#>版本号
 */
export async function getVersionById(id: <#=Table_Up#>Id) {
  const version = await <#=table#>Dao.getVersionById(id);
  return version;
}<#
}
#><#
if (hasDataPermit() && hasCreateUsrId) {
#>

/**
 * 根据 ids 获取<#=table_comment#>是否可编辑数据权限
 */
export async function getEditableDataPermitsByIds(
  <#=table#>_ids: <#=Table_Up#>Id[],
) {
  const data = await <#=table#>Dao.getEditableDataPermitsByIds(<#=table#>_ids);
  return data;
}<#
}
#>

/**
 * 根据 id 修改<#=table_comment#>
 */
export async function updateById(
  <#=table#>_id: <#=Table_Up#>Id,
  input: <#=inputName#>,
): Promise<<#=Table_Up#>Id> {<#
  if (
    (hasIsSys && opts.sys_fields && opts.sys_fields.length > 0) ||
    hasAudit
  ) {
  #>
  
  const old_model = await <#=table#>Dao.validateOption(
    await <#=table#>Dao.findById(<#=table#>_id<#
      if (hasDataPermit() && hasCreateUsrId) {
      #>, {<#
      if (hasDataPermit() && hasCreateUsrId) {
      #>
      hasDataPermit: true,<#
      }
      #>
    }<#
      }
    #>),
  );<#
  }
  #><#
  if (hasAudit) {
  #>
  
  if (old_model.<#=auditColumn#> !== <#=Table_Up#><#=auditColumnUp#>.Unsubmited &&
    old_model.<#=auditColumn#> !== <#=Table_Up#><#=auditColumnUp#>.Rejected
  ) {<#
    if (isUseI18n) {
    #>
    throw await ns("只有未提交的 {0} 才能编辑", await ns("<#=table_comment#>"));<#
    } else {
    #>
    throw "只有未提交的 <#=table_comment#> 才能编辑";<#
    }
    #>
  }<#
  }
  #><#
  if (hasLocked) {
  #>
  
  const is_locked = await <#=table#>Dao.getIsLockedById(<#=table#>_id);
  if (is_locked) {<#
    if (isUseI18n) {
    #>
    throw await ns("不能修改已经锁定的 {0}", await ns("<#=table_comment#>"));<#
    } else {
    #>
    throw "不能修改已经锁定的 <#=table_comment#>";<#
    }
    #>
  }<#
  }
  #><#
  if (hasIsSys && opts.sys_fields && opts.sys_fields.length > 0) {
  #>
  
  // 不能修改系统记录的系统字段
  if (old_model.is_sys === 1) {<#
  opts.sys_fields = opts.sys_fields || [ ];
  for (let i = 0; i < opts.sys_fields.length; i++) {
    const sys_field = opts.sys_fields[i];
    const column = columns.find(item => item.COLUMN_NAME === sys_field);
    if (!column) {
      throw new Error(`${ mod }_${ table }: sys_fields 字段 ${ sys_field } 不存在`);
    }
    const column_comment = column.COLUMN_COMMENT;
    const foreignKey = column.foreignKey;
  #><#
    if (!foreignKey && !column.dict && !column.dictbiz
      && column.DATA_TYPE !== "date" && !column.DATA_TYPE === "datetime"
    ) {
  #>
    // <#=column_comment#>
    input.<#=sys_field#> = undefined;<#
    } else if (column.DATA_TYPE === "date" || column.DATA_TYPE === "datetime") {
  #>
    // <#=column_comment#>
    input.<#=sys_field#> = undefined;
    input.<#=sys_field#>_lbl = "";<#
    } else if (foreignKey || column.dict || column.dictbiz) {
  #>
    // <#=column_comment#>
    input.<#=sys_field#> = undefined;
    input.<#=sys_field#>_lbl = "";<#
    } else {
  #>
    // <#=column_comment#>
    input.<#=sys_field#> = undefined;<#
    }
  #><#
  }
  #>
  }<#
  }
  #>
  
  const <#=table#>_id2 = await <#=table#>Dao.updateById(<#=table#>_id, input<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>, {<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    hasDataPermit: true,<#
    }
    #>
  }<#
    }
  #>);<#
  if (mod === "base" && table === "i18n") {
  #>
  
  await update_i18n_version();<#
  }
  #>
  
  return <#=table#>_id2;
}

/** 校验<#=table_comment#>是否存在 */
export async function validateOption(
  model0?: <#=modelName#>,
): Promise<<#=modelName#>> {
  const <#=table#>_model = await <#=table#>Dao.validateOption(model0);
  return <#=table#>_model;
}<#
if (hasAudit) {
#>

/** <#=table_comment#> 审核提交 */
export async function auditSubmit(
  <#=table#>_id: <#=Table_Up#>Id,
) {
  
  const old_model = await <#=table#>Dao.validateOption(
    await <#=table#>Dao.findById(<#=table#>_id),
  );
  
  if (
    old_model.<#=auditColumn#> !== <#=Table_Up#><#=auditColumnUp#>.Unsubmited &&
    old_model.<#=auditColumn#> !== <#=Table_Up#><#=auditColumnUp#>.Rejected
  ) {<#
    if (isUseI18n) {
    #>
    const table_comment = await ns("<#=table_comment#>");
    throw await ns("只有未提交或者审核拒绝的 {0} 才能 审核提交", table_comment);<#
    } else {
    #>
    throw "只有未提交或者审核拒绝的 <#=table_comment#> 才能 审核提交";<#
    }
    #>
  }<#
  if (auditTable_Up) {
  #><#
  if (opts?.lbl_field) {
  #>
  
  const <#=auditModelLabel#> = old_model.<#=opts?.lbl_field#> ?? "";<#
  } else {
  #>
  
  const <#=auditModelLabel#> = "";<#
  }
  #><#
  }
  #>
  
  await <#=table#>Dao.updateById(
    id,
    {
      <#=auditColumn#>: <#=Table_Up#><#=auditColumnUp#>.Unaudited,
    },
  );<#
  if (auditTable_Up) {
  #>
  
  const audit_usr_id = await get_usr_id();
  const audit_time = dayjs(reqDate()).format("YYYY-MM-DD HH:mm:ss");
  
  const audit_usr_model = await validateOptionUsr(
    await findByIdUsr(audit_usr_id),
  );
  
  const audit_usr_id_lbl = audit_usr_model.lbl;
  
  await create<#=auditTable_Up#>({
    <#=table#>_id,<#
    if (auditModelLabel) {
    #>
    <#=auditModelLabel#>,<#
    }
    #>
    audit: <#=auditTable_Up#>Audit.Unaudited,
    audit_usr_id,
    audit_usr_id_lbl,
    audit_time,
  });<#
  }
  #>
  
  return true;
}

/** <#=table_comment#> 审核通过 */
export async function auditPass(
  <#=table#>_id: <#=Table_Up#>Id,
) {
  
  const old_model = await <#=table#>Dao.validateOption(
    await <#=table#>Dao.findById(<#=table#>_id),
  );
  
  if (old_model.<#=auditColumn#> !== <#=Table_Up#><#=auditColumnUp#>.Unaudited) {<#
    if (isUseI18n) {
    #>
    const table_comment = await ns("<#=table_comment#>");
    throw await ns("只有未审核的 {0} 才能 审核通过", table_comment);<#
    } else {
    #>
    throw "只有未审核的 <#=table_comment#> 才能 审核通过";<#
    }
    #>
  }<#
  if (auditTable_Up) {
  #><#
  if (opts?.lbl_field) {
  #>
  
  const <#=auditModelLabel#> = old_model.<#=opts?.lbl_field#> ?? "";<#
  } else {
  #>
  
  const <#=auditModelLabel#> = "";<#
  }
  #><#
  }
  #>
  
  await <#=table#>Dao.updateById(
    id,
    {
      <#=auditColumn#>: <#=Table_Up#><#=auditColumnUp#>.Audited,
    },
  );<#
  if (auditTable_Up) {
  #>
  
  const audit_usr_id = await get_usr_id();
  const audit_time = dayjs(reqDate()).format("YYYY-MM-DD HH:mm:ss");
  
  const audit_usr_model = await validateOptionUsr(
    await findByIdUsr(audit_usr_id),
  );
  
  const audit_usr_id_lbl = audit_usr_model.lbl;
  
  await create<#=auditTable_Up#>({
    <#=table#>_id,<#
    if (auditModelLabel) {
    #>
    <#=auditModelLabel#>,<#
    }
    #>
    audit: <#=auditTable_Up#>Audit.Audited,
    audit_usr_id,
    audit_usr_id_lbl,
    audit_time,
  });<#
  }
  #>
  
  return true;
}

/** <#=table_comment#> 审核拒绝 */
export async function auditReject(
  <#=table#>_id: <#=Table_Up#>Id,
  audit_input: <#=auditTable_Up#>Input,
) {
  
  const old_model = await <#=table#>Dao.validateOption(
    await <#=table#>Dao.findById(<#=table#>_id),
  );
  
  if (
    old_model.<#=auditColumn#> !== <#=Table_Up#><#=auditColumnUp#>.Unaudited<#
    if (hasReviewed) {
    #> &&
    old_model.<#=auditColumn#> !== <#=Table_Up#><#=auditColumnUp#>.Audited<#
    }
    #>
  ) {<#
    if (isUseI18n) {
    #>
    const table_comment = await ns("<#=table_comment#>");
    throw await ns("只有未审核的 {0} 才能 审核拒绝");<#
    } else {
    #>
    throw "只有未审核的 <#=table_comment#> 才能 审核拒绝";<#
    }
    #>
  }<#
  if (auditTable_Up) {
  #><#
  if (opts?.lbl_field) {
  #>
  
  const <#=auditModelLabel#> = old_model.<#=opts?.lbl_field#> ?? "";<#
  } else {
  #>
  
  const <#=auditModelLabel#> = "";<#
  }
  #><#
  }
  #>
  
  await <#=table#>Dao.updateById(
    id,
    {
      <#=auditColumn#>: <#=Table_Up#><#=auditColumnUp#>.Rejected,
    },
  );<#
  if (auditTable_Up) {
  #>
  
  const audit_usr_id = await get_usr_id();
  const audit_time = dayjs(reqDate()).format("YYYY-MM-DD HH:mm:ss");
  
  const audit_usr_model = await validateOptionUsr(
    await findByIdUsr(audit_usr_id),
  );
  
  const audit_usr_id_lbl = audit_usr_model.lbl;
  
  await create<#=auditTable_Up#>({
    <#=table#>_id,<#
    if (auditModelLabel) {
    #>
    <#=auditModelLabel#>,<#
    }
    #>
    audit: <#=auditTable_Up#>Audit.Rejected,
    audit_usr_id,
    audit_usr_id_lbl,
    audit_time,
    rem: audit_input.rem,
  });<#
  }
  #>
  
  return true;
}<#
if (hasReviewed) {
#>

/** <#=table_comment#> 复核通过 */
export async function auditReview(
  <#=table#>_id: <#=Table_Up#>Id,
) {
  
  const old_model = await <#=table#>Dao.validateOption(
    await <#=table#>Dao.findById(<#=table#>_id),
  );
  
  if (old_model.<#=auditColumn#> !== <#=Table_Up#><#=auditColumnUp#>.Audited) {<#
    if (isUseI18n) {
    #>
    const table_comment = await ns("<#=table_comment#>");
    throw await ns("只有已审核的 {0} 才能 复核通过");<#
    } else {
    #>
    throw "只有已审核的 <#=table_comment#> 才能 复核通过";<#
    }
    #>
  }<#
  if (auditTable_Up) {
  #><#
  if (opts?.lbl_field) {
  #>
  
  const <#=auditModelLabel#> = old_model.<#=opts?.lbl_field#> ?? "";<#
  } else {
  #>
  
  const <#=auditModelLabel#> = "";<#
  }
  #><#
  }
  #>
  
  await <#=table#>Dao.updateById(
    id,
    {
      <#=auditColumn#>: <#=Table_Up#><#=auditColumnUp#>.Reviewed,
    },
  );<#
  if (auditTable_Up) {
  #>
  
  const audit_usr_id = await get_usr_id();
  const audit_time = dayjs(reqDate()).format("YYYY-MM-DD HH:mm:ss");
  
  const audit_usr_model = await validateOptionUsr(
    await findByIdUsr(audit_usr_id),
  );
  
  const audit_usr_id_lbl = audit_usr_model.lbl;
  
  await create<#=auditTable_Up#>({
    <#=table#>_id,<#
    if (auditModelLabel) {
    #>
    <#=auditModelLabel#>,<#
    }
    #>
    audit: <#=auditTable_Up#>Audit.Reviewed,
    audit_usr_id,
    audit_usr_id_lbl,
    audit_time,
  });<#
  }
  #>
  
  return true;
}<#
}
#><#
}
#>

/**
 * 根据 ids 删除<#=table_comment#>
 */
export async function deleteByIds(
  <#=table#>_ids: <#=Table_Up#>Id[],
): Promise<number> {<#
  if (hasLocked || hasIsSys || hasAudit) {
  #>
  
  const old_models = await <#=table#>Dao.findByIds(<#=table#>_ids);<#
  }
  #><#
  if (hasLocked) {
  #>
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {<#
      if (isUseI18n) {
      #>
      throw await ns("不能删除已经锁定的 {0}", await ns("<#=table_comment#>"));<#
      } else {
      #>
      throw "不能删除已经锁定的 <#=table_comment#>";<#
      }
      #>
    }
  }<#
  }
  #><#
  if (hasIsSys) {
  #>
  
  for (const old_model of old_models) {
    if (old_model.is_sys === 1) {<#
      if (isUseI18n) {
      #>
      throw await ns("不能删除系统记录");<#
      } else {
      #>
      throw "不能删除系统记录";<#
      }
      #>
    }
  }<#
  }
  #><#
  if (hasAudit) {
  #>
  
  for (const old_model of old_models) {
    if (old_model.<#=auditColumn#> !== <#=Table_Up#><#=auditColumnUp#>.Unsubmited &&
      old_model.<#=auditColumn#> !== <#=Table_Up#><#=auditColumnUp#>.Rejected
    ) {<#
      if (isUseI18n) {
      #>
      throw await ns("只有未提交的 {0} 才能删除", await ns("<#=table_comment#>"));<#
      } else {
      #>
      throw "只有未提交的 <#=table_comment#> 才能删除";<#
      }
      #>
    }
  }<#
  }
  #>
  
  const <#=table#>_num = await <#=table#>Dao.deleteByIds(<#=table#>_ids<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>, {<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    hasDataPermit: true,<#
    }
    #>
  }<#
    }
  #>);<#
  if (mod === "base" && table === "i18n") {
  #>
  
  await update_i18n_version();<#
  }
  #><#
  if (hasAudit && auditTable_Up) {
  #>
  
  // 级联删除审核记录
  const <#=auditTable#>_models = await findAll<#=auditTable_Up#>({
    <#=table#>_id: <#=table#>_ids,
  });
  
  const <#=auditTable#>_ids = <#=auditTable#>_models.map(item => item.id);
  
  await deleteByIds<#=auditTable_Up#>(<#=auditTable#>_ids);<#
  }
  #>
  return <#=table#>_num;
}<#
  if (hasDefault) {
#>

/**
 * 根据 id 设置默认<#=table_comment#>
 */
export async function defaultById(
  id: <#=Table_Up#>Id,
): Promise<number> {
  const <#=table#>_num = await <#=table#>Dao.defaultById(id);
  return <#=table#>_num;
}<#
  }
#><#
  if (hasEnabled) {
#>

/**
 * 根据 ids 启用或者禁用<#=table_comment#>
 */
export async function enableByIds(
  ids: <#=Table_Up#>Id[],
  is_enabled: 0 | 1,
): Promise<number> {
  const <#=table#>_num = await <#=table#>Dao.enableByIds(ids, is_enabled);
  return <#=table#>_num;
}<#
  }
#><#
  if (hasLocked) {
#>

/**
 * 根据 ids 锁定或者解锁<#=table_comment#>
 */
export async function lockByIds(
  <#=table#>_ids: <#=Table_Up#>Id[],
  is_locked: 0 | 1,
): Promise<number> {
  const <#=table#>_num = await <#=table#>Dao.lockByIds(<#=table#>_ids, is_locked);
  return <#=table#>_num;
}<#
  }
#><#
if (hasIsDeleted) {
#>

/**
 * 根据 ids 还原<#=table_comment#>
 */
export async function revertByIds(
  <#=table#>_ids: <#=Table_Up#>Id[],
): Promise<number> {<#
  if (hasAudit && auditTable_Up) {
  #>
  
   // 级联还原审核记录
  const <#=auditTable#>_models = await findAll<#=auditTable_Up#>({
    <#=table#>_id: <#=table#>_ids,
    is_deleted: 1,
  });
  
  const <#=auditTable#>_ids = <#=auditTable#>_models.map(item => item.id);
  
  await revertByIds<#=auditTable_Up#>(<#=auditTable#>_ids);<#
  }
  #>
  
  const <#=table#>_num = await <#=table#>Dao.revertByIds(<#=table#>_ids);
  
  return <#=table#>_num;
}<#
}
#><#
if (hasIsDeleted) {
#>

/**
 * 根据 ids 彻底删除<#=table_comment#>
 */
export async function forceDeleteByIds(
  <#=table#>_ids: <#=Table_Up#>Id[],
): Promise<number> {<#
  if (hasAudit && auditTable_Up) {
  #>
  
  // 级联彻底删除审核记录
  const <#=auditTable#>_models = await findAll<#=auditTable_Up#>({
    <#=table#>_id: <#=table#>_ids,
    is_deleted: 1,
  });
  
  const <#=auditTable#>_ids = <#=auditTable#>_models.map(item => item.id);
  
  await forceDeleteByIds<#=auditTable_Up#>(<#=auditTable#>_ids);<#
  }
  #>
  
  const <#=table#>_num = await <#=table#>Dao.forceDeleteByIds(<#=table#>_ids);
  
  return <#=table#>_num;
}<#
}
#>

/**
 * 获取<#=table_comment#>字段注释
 */
export async function getFieldComments(): Promise<<#=fieldCommentName#>> {
  const <#=table#>_fields = await <#=table#>Dao.getFieldComments();
  return <#=table#>_fields;
}<#
if (hasOrderBy) {
#>

/**
 * 查找 <#=table_comment#> order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const <#=table#>_sort = await <#=table#>Dao.findLastOrderBy();
  return <#=table#>_sort;
}<#
}
#>
