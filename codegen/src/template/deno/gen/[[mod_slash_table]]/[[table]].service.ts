<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasVersion = columns.some((column) => column.COLUMN_NAME === "version");
const Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("_");
#><#
const hasSummary = columns.some((column) => column.showSummary);
#>import {
  ns,
} from "/src/base/i18n/i18n.ts";

import * as authDao from "/lib/auth/auth.dao.ts";

import {
  type <#=Table_Up#>Input,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type <#=Table_Up#>Model,
  type <#=Table_Up#>Search,
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
 * @param {<#=Table_Up#>Search} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: <#=Table_Up#>Search,
): Promise<number> {
  search = search || { };<#
    if (opts.filterDataByCreateUsr) {
  #>
  
  const authModel = await authDao.getAuthModel();
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
 * @param {<#=Table_Up#>Search} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<<#=Table_Up#>Model[]>} 
 */
export async function findAll(
  search?: <#=Table_Up#>Search,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<<#=Table_Up#>Model[]> {
  search = search || { };<#
    if (opts.filterDataByCreateUsr) {
  #>
  
  const authModel = await authDao.getAuthModel();
  if (authModel?.id) {
    search.create_usr_id = [ authModel.id ];
  }<#
    }
  #>
  const data: <#=Table_Up#>Model[] = await <#=table#>Dao.findAll(search, page, sort);
  return data;
}<#
if (hasSummary) {
#>

/**
 * 根据条件和分页查找数据
 * @param {<#=Table_Up#>Search} search? 搜索条件
 * @return {Promise<<#=Table_Up#>Summary>} 
 */
export async function findSummary(
  search?: <#=Table_Up#>Search,
): Promise<<#=Table_Up#>Summary> {
  search = search || { };<#
    if (opts.filterDataByCreateUsr) {
  #>
  
  const authModel = await authDao.getAuthModel();
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
 * @param {<#=Table_Up#>Search} search? 搜索条件
 */
export async function findOne(
  search?: <#=Table_Up#>Search,
  sort?: SortInput|SortInput[],
) {
  search = search || { };<#
    if (opts.filterDataByCreateUsr) {
  #>
  
  const authModel = await authDao.getAuthModel();
  if (authModel?.id) {
    search.create_usr_id = [ authModel.id ];
  }<#
    }
  #>
  const data = await <#=table#>Dao.findOne(search, sort);
  return data;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
) {
  const data = await <#=table#>Dao.findById(id);
  return data;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {<#=Table_Up#>Search} search? 搜索条件
 */
export async function exist(
  search?: <#=Table_Up#>Search,
) {
  search = search || { };<#
    if (opts.filterDataByCreateUsr) {
  #>
  
  const authModel = await authDao.getAuthModel();
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
 * @param {string} id
 */
export async function existById(
  id?: string | null,
) {
  const data = await <#=table#>Dao.existById(id);
  return data;
}

/**
 * 创建数据
 * @param {<#=Table_Up#>Model} model
 * @return {Promise<string>} id
 */
export async function create(
  model: <#=Table_Up#>Model,
): Promise<string> {
  const data = await <#=table#>Dao.create(model);
  return data;
}<#
if (hasVersion) {
#>

/**
 * 根据 id 获取版本号
 */
export async function getVersionById(id: string) {
  const version = await <#=table#>Dao.getVersionById(id);
  return version;
}<#
}
#>

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {<#=Table_Up#>Model} model
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  model: <#=Table_Up#>Model,
): Promise<string> {<#
  if (hasLocked) {
  #>
  
  const is_locked = await <#=table#>Dao.getIs_lockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }<#
  }
  #>
  const data = await <#=table#>Dao.updateById(id, model);<#
  if (table === "i18n") {
  #>
  
  {
    const optionsSrcDao = await import("/src/options/options.dao.ts");
    await optionsSrcDao.updateI18n_version();
  }<#
  }
  #>
  return data;
}

/**
 * 根据 ids 删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: string[],
): Promise<number> {<#
  if (hasLocked) {
  #>
  
  const lockedIds: string[] = [ ];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const is_locked = await <#=table#>Dao.getIs_lockedById(id);
    if (is_locked) {
      lockedIds.push(id);
    }
  }
  if (lockedIds.length > 0 && lockedIds.length === ids.length) {
    throw await ns("不能删除已经锁定的数据");
  }<#
  }
  #>
  const data = await <#=table#>Dao.deleteByIds(ids);<#
  if (table === "i18n") {
  #>
  
  {
    const optionsSrcDao = await import("/src/options/options.dao.ts");
    await optionsSrcDao.updateI18n_version();
  }<#
  }
  #>
  return data;
}<#
  if (hasLocked) {
#>

/**
 * 根据 ids 锁定或解锁数据
 * @param {string[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: string[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await <#=table#>Dao.lockByIds(ids, is_locked);
  return data;
}<#
  }
#>

/**
 * 根据 ids 还原数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: string[],
): Promise<number> {
  const data = await <#=table#>Dao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: string[],
): Promise<number> {
  const data = await <#=table#>Dao.forceDeleteByIds(ids);
  return data;
}

/**
 * 批量导入
 * @param {<#=Table_Up#>Input[]} models
 */
export async function importModels(
  models: <#=Table_Up#>Input[],
) {
  let succNum = 0;
  let failNum = 0;
  const failErrMsgs: string[] = [ ];
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    try {
      await <#=table#>Dao.create(model, { uniqueType: "update" });
      succNum++;
    } catch (err) {
      failNum++;
      failErrMsgs.push(await ns("第 {0} 行: {1}", (i + 1).toString(), err.message || err.toString()));
    }
  }
  
  let data = "";
  if (succNum > 0) {
    data = await ns("导入成功 {0} 条", succNum.toString());
    data += "\\n";
  }
  if (failNum > 0) {
    data += await ns("导入失败 {0} 条", failNum.toString());
    data += "\\n";
  }
  if (failErrMsgs.length > 0) {
    data += failErrMsgs.join("\\n");
  }<#
  if (table === "i18n") {
  #>
  
  if (succNum > 0) {
    const optionsSrcDao = await import("/src/options/options.dao.ts");
    await optionsSrcDao.updateI18n_version();
  }<#
  }
  #>
  
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments() {
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
