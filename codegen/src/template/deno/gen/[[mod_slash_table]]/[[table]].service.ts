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
#><#
const hasSummary = columns.some((column) => column.showSummary);
#>import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";<#
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
if (opts.filterDataByCreateUsr || hasOrgId) {
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
  
  const data = await <#=table#>Dao.findCount(search<#
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
  return data;
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
  
  const models: <#=modelName#>[] = await <#=table#>Dao.findAll(search, page, sort<#
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
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: <#=inputName#>,
) {
  const data = await <#=table#>Dao.setIdByLbl(input);
  return data;
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
  
  const data = await <#=table#>Dao.findSummary(search<#
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
  return data;
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
  
  const model = await <#=table#>Dao.findOne(search, sort<#
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
  return model;
}

/**
 * 根据 id 查找<#=table_comment#>
 */
export async function findById(
  id?: <#=Table_Up#>Id | null,
): Promise<<#=modelName#> | undefined> {
  const model = await <#=table#>Dao.findById(id<#
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
  return model;
}

/**
 * 根据搜索条件查找<#=table_comment#>是否存在
 */
export async function exist(
  search?: <#=searchName#>,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await <#=table#>Dao.exist(search<#
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
  return data;
}

/**
 * 根据 id 查找<#=table_comment#>是否存在
 */
export async function existById(
  id?: <#=Table_Up#>Id | null,
): Promise<boolean> {
  const data = await <#=table#>Dao.existById(id<#
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
  return data;
}

/**
 * 增加和修改时校验<#=table_comment#>
 */
export async function validate(
  input: <#=inputName#>,
): Promise<void> {
  const data = await <#=table#>Dao.validate(input);
  return data;
}

/**
 * 批量创建<#=table_comment#>
 */
export async function creates(
  inputs: <#=inputName#>[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<<#=Table_Up#>Id[]> {
  const ids = await <#=table#>Dao.creates(inputs, options);<#
  if (mod === "base" && table === "i18n") {
  #>
  
  await update_i18n_version();<#
  }
  #>
  return ids;
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
  ids: <#=Table_Up#>Id[],
) {
  const data = await <#=table#>Dao.getEditableDataPermitsByIds(ids);
  return data;
}<#
}
#>

/**
 * 根据 id 修改<#=table_comment#>
 */
export async function updateById(
  id: <#=Table_Up#>Id,
  input: <#=inputName#>,
): Promise<<#=Table_Up#>Id> {<#
  if (hasLocked) {
  #>
  
  const is_locked = await <#=table#>Dao.getIsLockedById(id);
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
  const model = await <#=table#>Dao.findById(id<#
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
  if (model && model.is_sys === 1) {<#
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
  
  const id2 = await <#=table#>Dao.updateById(id, input<#
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
  return id2;
}

/**
 * 根据 ids 删除<#=table_comment#>
 */
export async function deleteByIds(
  ids: <#=Table_Up#>Id[],
): Promise<number> {<#
  if (hasLocked) {
  #>
  
  {
    const models = await <#=table#>Dao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {<#
        if (isUseI18n) {
        #>
        throw await ns("不能删除已经锁定的 {0}", await ns("<#=table_comment#>"));<#
        } else {
        #>
        throw "不能删除已经锁定的 <#=table_comment#>";<#
        }
        #>
      }
    }
  }<#
  }
  #><#
  if (hasIsSys) {
  #>
  
  {
    const models = await <#=table#>Dao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_sys === 1) {<#
        if (isUseI18n) {
        #>
        throw await ns("不能删除系统记录");<#
        } else {
        #>
        throw "不能删除系统记录";<#
        }
        #>
      }
    }
  }<#
  }
  #>
  
  const data = await <#=table#>Dao.deleteByIds(ids<#
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
  return data;
}<#
  if (hasDefault) {
#>

/**
 * 根据 id 设置默认<#=table_comment#>
 */
export async function defaultById(
  id: <#=Table_Up#>Id,
): Promise<number> {
  const data = await <#=table#>Dao.defaultById(id);
  return data;
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
  const data = await <#=table#>Dao.enableByIds(ids, is_enabled);
  return data;
}<#
  }
#><#
  if (hasLocked) {
#>

/**
 * 根据 ids 锁定或者解锁<#=table_comment#>
 */
export async function lockByIds(
  ids: <#=Table_Up#>Id[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await <#=table#>Dao.lockByIds(ids, is_locked);
  return data;
}<#
  }
#><#
if (hasIsDeleted) {
#>

/**
 * 根据 ids 还原<#=table_comment#>
 */
export async function revertByIds(
  ids: <#=Table_Up#>Id[],
): Promise<number> {
  const data = await <#=table#>Dao.revertByIds(ids);
  return data;
}<#
}
#><#
if (hasIsDeleted) {
#>

/**
 * 根据 ids 彻底删除<#=table_comment#>
 */
export async function forceDeleteByIds(
  ids: <#=Table_Up#>Id[],
): Promise<number> {
  const data = await <#=table#>Dao.forceDeleteByIds(ids);
  return data;
}<#
}
#>

/**
 * 获取<#=table_comment#>字段注释
 */
export async function getFieldComments(): Promise<<#=fieldCommentName#>> {
  const data = await <#=table#>Dao.getFieldComments();
  return data;
}<#
if (hasOrderBy) {
#>

/**
 * 查找 <#=table_comment#> order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await <#=table#>Dao.findLastOrderBy();
  return data;
}<#
}
#>
