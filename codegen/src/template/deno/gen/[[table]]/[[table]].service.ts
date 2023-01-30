<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("_");
#><#
const hasSummary = columns.some((column) => column.showSummary);
#>import { renderExcel } from "ejsexcel";

import {
  _internals as authDao
} from "/lib/auth/auth.dao.ts";

import {
  _internals as tmpfileDao
} from "/lib/tmpfile/tmpfile.dao.ts";

import {
  getTemplate,
  getImportFileRows,
} from "/lib/util/excel_util.ts";

import { ServiceException } from "/lib/exceptions/service.exception.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type <#=Table_Up#>Model,
  type <#=Table_Up#>Search,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";<#
if (hasSummary) {
#>

import { <#=Table_Up#>Summary } from "/gen/types.ts";<#
}
#>
import {
  _internals as <#=table#>Dao,
} from "./<#=table#>.dao.ts";

export const _internals = {
  findCount,
  findAll,<#
  if (hasSummary) {
  #>
  findSummary,<#
  }
  #>
  findOne,
  findById,
  exist,
  existById,
  create,
  updateById,
  deleteByIds,<#
    if (hasLocked) {
  #>
  lockByIds,<#
  }
  #>
  revertByIds,
  forceDeleteByIds,
  importFile,
  exportExcel,<#
  if (hasOrderBy) {
  #>
  findLastOrderBy,<#
  }
  #>
};

/**
 * 根据条件查找总数
 * @param {<#=Table_Up#>Search & { $extra?: SearchExtra[] }} search? 搜索条件
 * @return {Promise<number>}
 */
async function findCount(
  search?: <#=Table_Up#>Search & { $extra?: SearchExtra[] },
): Promise<number> {
  const result = await <#=table#>Dao.findCount(search);
  return result;
}

/**
 * 根据条件和分页查找数据
 * @param {<#=Table_Up#>Search & { $extra?: SearchExtra[] }} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<<#=Table_Up#>Model[]>} 
 */
async function findAll(
  search?: <#=Table_Up#>Search & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<<#=Table_Up#>Model[]> {<#
    if (opts.filterDataByCreateUsr) {
  #>
  
  search = search || { };
  const authModel = await authDao.getAuthModel();
  if (authModel?.id) {
    search.create_usr_id = [ authModel.id ];
  }<#
    }
  #>
  const result: <#=Table_Up#>Model[] = await <#=table#>Dao.findAll(search, page, sort);
  return result;
}<#
if (hasSummary) {
#>

/**
 * 根据条件和分页查找数据
 * @param {<#=Table_Up#>Search & { $extra?: SearchExtra[] }} search? 搜索条件
 * @return {Promise<<#=Table_Up#>Summary>} 
 */
async function findSummary(
  search?: <#=Table_Up#>Search & { $extra?: SearchExtra[] },
): Promise<<#=Table_Up#>Summary> {
  const result = await <#=table#>Dao.findSummary(search);
  return result;
}<#
}
#>

/**
 * 根据条件查找第一条数据
 * @param {<#=Table_Up#>Search & { $extra?: SearchExtra[] }} search? 搜索条件
 */
async function findOne(
  search?: <#=Table_Up#>Search & { $extra?: SearchExtra[] },
) {
  const result: <#=Table_Up#>Model | undefined = await <#=table#>Dao.findOne(search);
  return result;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
async function findById(
  id?: string,
) {
  const result = await <#=table#>Dao.findById(id);
  return result;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {<#=Table_Up#>Search & { $extra?: SearchExtra[] }} search? 搜索条件
 */
async function exist(
  search?: <#=Table_Up#>Search & { $extra?: SearchExtra[] },
) {
  const result = await <#=table#>Dao.exist(search);
  return result;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
async function existById(
  id: string,
) {
  const result = await <#=table#>Dao.existById(id);
  return result;
}

/**
 * 创建数据
 * @param {<#=Table_Up#>Model} model
 * @return {Promise<string | undefined>} 
 */
async function create(
  model: <#=Table_Up#>Model,
): Promise<string | undefined> {
  const result = await <#=table#>Dao.create(model);
  return result;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {<#=Table_Up#>Model} model
 * @return {Promise<string | undefined>}
 */
async function updateById(
  id: string,
  model: <#=Table_Up#>Model,
): Promise<string | undefined> {
  await <#=table#>Dao.updateById(id, model);
  return id;
}

/**
 * 根据 ids 删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
async function deleteByIds(
  ids: string[],
): Promise<number> {
  const result = await <#=table#>Dao.deleteByIds(ids);
  return result;
}<#
  if (hasLocked) {
#>

/**
 * 根据 ids 锁定或解锁数据
 * @param {string[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
async function lockByIds(
  ids: string[],
  is_locked: 0 | 1,
): Promise<number> {
  const result = await <#=table#>Dao.lockByIds(ids, is_locked);
  return result;
}<#
  }
#>

/**
 * 根据 ids 还原数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
async function revertByIds(
  ids: string[],
): Promise<number> {
  const result = await <#=table#>Dao.revertByIds(ids);
  return result;
}

/**
 * 根据 ids 彻底删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
async function forceDeleteByIds(
  ids: string[],
): Promise<number> {
  const result = await <#=table#>Dao.forceDeleteByIds(ids);
  return result;
}

/**
 * 导入文件
 * @param {string} id
 */
async function importFile(
  id: string,
) {
  const header: { [key: string]: string } = {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno) continue;
      if (column.noAdd || column.noEdit) continue;
      const column_name = column.COLUMN_NAME;
      let data_type = column.DATA_TYPE;
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      let column_comment = column.COLUMN_COMMENT;
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.includes("[")) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      if (column_comment.includes("[")) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      if (column_name === "id") {
        continue;
      }
    #><#
      if (!foreignKey && selectList.length === 0 && !column.dict && !column.dictbiz) {
    #>
    "<#=column_comment#>": "<#=column_name#>",<#
      } else {
    #>
    "<#=column_comment#>": "_<#=column_name#>",<#
      }
    #><#
    }
    #>
  };
  const models = await getImportFileRows(id, header);
  
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
      failErrMsgs.push(`第 ${ i + 1 } 行: ${ err.message || err.toString() }`);
    }
  }
  
  let result = "";
  if (succNum > 0) {
    result = `导入成功 ${ succNum } 条\\n`;
  }
  if (failNum > 0) {
    result += `导入失败 ${ failNum } 条\\n`;
  }
  if (failErrMsgs.length > 0) {
    result += failErrMsgs.join("\\n");
  }
  
  return result;
}

/**
 * 导出Excel
 * @param {<#=Table_Up#>Search & { $extra?: SearchExtra[] }} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<string>} 临时文件id
 */
async function exportExcel(
  search?: <#=Table_Up#>Search & { $extra?: SearchExtra[] },
  sort?: SortInput|SortInput[],
): Promise<string> {
  const models = await findAll(search, undefined, sort);
  const buffer0 = await getTemplate(`<#=table#>.xlsx`);
  if (!buffer0) {
    throw new ServiceException(`模板文件 <#=table#>.xlsx 不存在!`);
  }
  const buffer = await renderExcel(buffer0, { models });
  const result = await tmpfileDao.upload(
    {
      content: buffer,
      name: "file",
      originalName: "<#=table_comment#>.xlsx",
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  );
  return result;
}<#
if (hasOrderBy) {
#>

/**
 * 查找 order_by 字段的最大值
 * @return {Promise<number>}
 */
async function findLastOrderBy(
): Promise<number> {
  const result = await <#=table#>Dao.findLastOrderBy();
  return result;
}<#
}
#>
