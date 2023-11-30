<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasEnabled = columns.some((column) => column.COLUMN_NAME === "is_enabled");
const hasDefault = columns.some((column) => column.COLUMN_NAME === "is_default");
const hasVersion = columns.some((column) => column.COLUMN_NAME === "version");
const hasIsSys = columns.some((column) => column.COLUMN_NAME === "is_sys");
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
  Table_Up = Table_Up.substring(0, Table_Up.length - 1) + Table_Up.substring(Table_Up.length - 1).toUpperCase();
  modelName = Table_Up + "model";
  fieldCommentName = Table_Up + "fieldComment";
  inputName = Table_Up + "input";
  searchName = Table_Up + "search";
} else {
  modelName = Table_Up + "Model";
  fieldCommentName = Table_Up + "FieldComment";
  inputName = Table_Up + "Input";
  searchName = Table_Up + "Search";
}
#><#
const hasSummary = columns.some((column) => column.showSummary);
#><#
if (hasLocked || hasIsSys) {
#>import {
  ns,
} from "/src/base/i18n/i18n.ts";<#
}
#><#
if (opts.filterDataByCreateUsr) {
#>import {
  getAuthModel,
} from "/lib/auth/auth.dao.ts";<#
}
#>

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  <#=inputName#>,
  <#=modelName#>,
  <#=searchName#>,
  <#=fieldCommentName#>,
  <#=Table_Up#>Id,
} from "./<#=table#>.model.ts";<#
if (hasSummary) {
#>

import {
  <#=Table_Up#>Summary,
} from "/gen/types.ts";<#
}
#>

import * as <#=table#>Dao from "./<#=table#>.dao.ts";

/**
 * 根据条件查找总数
 * @param {<#=searchName#>} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: <#=searchName#>,
): Promise<number> {
  search = search || { };<#
    if (opts.filterDataByCreateUsr) {
  #>
  
  const authModel = await getAuthModel();
  if (authModel?.id) {
    search.create_usr_id = [ authModel.id ];
  }<#
    }
  #>
  const data = await <#=table#>Dao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
 * @param {<#=searchName#>} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<<#=modelName#>[]>} 
 */
export async function findAll(
  search?: <#=searchName#>,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<<#=modelName#>[]> {
  search = search || { };<#
    if (opts.filterDataByCreateUsr) {
  #>
  
  const authModel = await getAuthModel();
  if (authModel?.id) {
    search.create_usr_id = [ authModel.id ];
  }<#
    }
  #>
  const models: <#=modelName#>[] = await <#=table#>Dao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: <#=inputName#>,
) {
  const data = await <#=table#>Dao.setIdByLbl(input);
  return data;
}<#
if (hasSummary) {
#>

/**
 * 根据条件和分页查找数据
 * @param {<#=searchName#>} search? 搜索条件
 * @return {Promise<<#=Table_Up#>Summary>} 
 */
export async function findSummary(
  search?: <#=searchName#>,
): Promise<<#=Table_Up#>Summary> {
  search = search || { };<#
    if (opts.filterDataByCreateUsr) {
  #>
  
  const authModel = await getAuthModel();
  if (authModel?.id) {
    search.create_usr_id = [ authModel.id ];
  }<#
    }
  #>
  const data = await <#=table#>Dao.findSummary(search);
  return data;
}<#
}
#>

/**
 * 根据条件查找第一条数据
 * @param {<#=searchName#>} search? 搜索条件
 */
export async function findOne(
  search?: <#=searchName#>,
  sort?: SortInput|SortInput[],
): Promise<<#=modelName#> | undefined> {
  search = search || { };<#
    if (opts.filterDataByCreateUsr) {
  #>
  
  const authModel = await getAuthModel();
  if (authModel?.id) {
    search.create_usr_id = [ authModel.id ];
  }<#
    }
  #>
  const model = await <#=table#>Dao.findOne(search, sort);
  return model;
}

/**
 * 根据id查找数据
 * @param {<#=Table_Up#>Id} id
 */
export async function findById(
  id?: <#=Table_Up#>Id | null,
): Promise<<#=modelName#> | undefined> {
  const model = await <#=table#>Dao.findById(id);
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {<#=searchName#>} search? 搜索条件
 */
export async function exist(
  search?: <#=searchName#>,
): Promise<boolean> {
  search = search || { };<#
    if (opts.filterDataByCreateUsr) {
  #>
  
  const authModel = await getAuthModel();
  if (authModel?.id) {
    search.create_usr_id = [ authModel.id ];
  }<#
    }
  #>
  const data = await <#=table#>Dao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {<#=Table_Up#>Id} id
 */
export async function existById(
  id?: <#=Table_Up#>Id | null,
): Promise<boolean> {
  const data = await <#=table#>Dao.existById(id);
  return data;
}

/**
 * 增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: <#=inputName#>,
): Promise<void> {
  const data = await <#=table#>Dao.validate(input);
  return data;
}

/**
 * 创建数据
 * @param {<#=inputName#>} input
 * @return {Promise<<#=Table_Up#>Id>} id
 */
export async function create(
  input: <#=inputName#>,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<<#=Table_Up#>Id> {
  const id: <#=Table_Up#>Id = await <#=table#>Dao.create(input, options);
  return id;
}<#
if (hasVersion) {
#>

/**
 * 根据 id 获取版本号
 */
export async function getVersionById(id: <#=Table_Up#>Id) {
  const version = await <#=table#>Dao.getVersionById(id);
  return version;
}<#
}
#>

/**
 * 根据 id 修改数据
 * @param {<#=Table_Up#>Id} id
 * @param {<#=inputName#>} input
 * @return {Promise<<#=Table_Up#>Id>}
 */
export async function updateById(
  id: <#=Table_Up#>Id,
  input: <#=inputName#>,
): Promise<<#=Table_Up#>Id> {<#
  if (hasLocked) {
  #>
  
  const is_locked = await <#=table#>Dao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }<#
  }
  #><#
  if (hasIsSys) {
  #>
  
  // 不能修改系统记录的系统字段
  const model = await <#=table#>Dao.findById(id);
  if (model && model.is_sys === 1) {<#
  opts.sys_fields = opts.sys_fields || [ ];
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
    input.<#=sys_field#> = undefined;<#
    } else if (column.DATA_TYPE === "date" || column.DATA_TYPE === "datetime") {
  #>
    // <#=column_comment#>
    input.<#=sys_field#> = undefined;
    input.<#=sys_field#>_lbl = "";<#
    } else if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz) {
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
  
  const id2: <#=Table_Up#>Id = await <#=table#>Dao.updateById(id, input);<#
  if (table === "i18n") {
  #>
  
  {
    const optionsDaoSrc = await import("/src/base/options/options.dao.ts");
    await optionsDaoSrc.updateI18n_version();
  }<#
  }
  #>
  return id2;
}

/**
 * 根据 ids 删除数据
 * @param {<#=Table_Up#>Id[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: <#=Table_Up#>Id[],
): Promise<number> {<#
  if (hasLocked) {
  #>
  
  {
    const ids2: <#=Table_Up#>Id[] = [ ];
    for (let i = 0; i < ids.length; i++) {
      const id: <#=Table_Up#>Id = ids[i];
      const is_locked = await <#=table#>Dao.getIsLockedById(id);
      if (!is_locked) {
        ids2.push(id);
      }
    }
    if (ids2.length === 0 && ids.length > 0) {
      throw await ns("不能删除已经锁定的数据");
    }
    ids = ids2;
  }<#
  }
  #><#
  if (hasIsSys) {
  #>
  
  {
    const ids2: <#=Table_Up#>Id[] = [ ];
    for (let i = 0; i < ids.length; i++) {
      const id: <#=Table_Up#>Id = ids[i];
      const model = await <#=table#>Dao.findById(id);
      if (model && model.is_sys === 1) {
        continue;
      }
      ids2.push(id);
    }
    if (ids2.length === 0 && ids.length > 0) {
      throw await ns("不能删除系统记录");
    }
    ids = ids2;
  }<#
  }
  #>
  
  const data = await <#=table#>Dao.deleteByIds(ids);<#
  if (table === "i18n") {
  #>
  
  {
    const optionsDaoSrc = await import("/src/base/options/options.dao.ts");
    await optionsDaoSrc.updateI18n_version();
  }<#
  }
  #>
  return data;
}<#
  if (hasDefault) {
#>

/**
 * 根据 ids 启用或禁用数据
 * @param {<#=Table_Up#>Id} id
 * @return {Promise<number>}
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
 * 根据 ids 启用或禁用数据
 * @param {<#=Table_Up#>Id[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
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
 * 根据 ids 锁定或解锁数据
 * @param {<#=Table_Up#>Id[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: <#=Table_Up#>Id[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await <#=table#>Dao.lockByIds(ids, is_locked);
  return data;
}<#
  }
#>

/**
 * 根据 ids 还原数据
 * @param {<#=Table_Up#>Id[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: <#=Table_Up#>Id[],
): Promise<number> {
  const data = await <#=table#>Dao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 * @param {<#=Table_Up#>Id[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: <#=Table_Up#>Id[],
): Promise<number> {
  const data = await <#=table#>Dao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments(): Promise<<#=fieldCommentName#>> {
  const data = await <#=table#>Dao.getFieldComments();
  return data;
}<#
if (hasOrderBy) {
#>

/**
 * 查找 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await <#=table#>Dao.findLastOrderBy();
  return data;
}<#
}
#>
