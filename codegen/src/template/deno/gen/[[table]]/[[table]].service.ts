<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("_");
#><#
const hasSummary = columns.some((column) => column.showSummary);
#>import { type Context } from "/lib/context.ts";
import { renderExcel } from "ejsexcel";
import * as authDao from "/lib/auth/auth.dao.ts";
import * as tmpfileDao from "/lib/tmpfile/tmpfile.dao.ts";

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
import * as <#=table#>Dao from "./<#=table#>.dao.ts";

/**
 * 根据条件查找总数
 * @param {<#=Table_Up#>Search & { $extra?: SearchExtra[] }} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  context: Context,
  search?: <#=Table_Up#>Search & { $extra?: SearchExtra[] },
): Promise<number> {
  const result = await <#=table#>Dao.findCount(context, search);
  return result;
}

/**
 * 根据条件和分页查找数据
 * @param {<#=Table_Up#>Search & { $extra?: SearchExtra[] }} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<<#=Table_Up#>Model[]>} 
 */
export async function findAll(
  context: Context,
  search?: <#=Table_Up#>Search & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<<#=Table_Up#>Model[]> {<#
    if (opts.filterDataByCreateUsr) {
  #>
  
  search = search || { };
  const authModel = await authDao.getAuthModel(context);
  if (authModel?.id) {
    search.create_usr_id = [ authModel.id ];
  }<#
    }
  #>
  const result: <#=Table_Up#>Model[] = await <#=table#>Dao.findAll(context, search, page, sort);
  return result;
}<#
if (hasSummary) {
#>

/**
 * 根据条件和分页查找数据
 * @param {<#=Table_Up#>Search & { $extra?: SearchExtra[] }} search? 搜索条件
 * @return {Promise<<#=Table_Up#>Summary>} 
 */
export async function findSummary(
  context: Context,
  search?: <#=Table_Up#>Search & { $extra?: SearchExtra[] },
): Promise<<#=Table_Up#>Summary> {
  const result = await <#=table#>Dao.findSummary(context, search);
  return result;
}<#
}
#>

/**
 * 根据条件查找第一条数据
 * @param {<#=Table_Up#>Search & { $extra?: SearchExtra[] }} search? 搜索条件
 * @return {Promise<<#=Table_Up#>Model>} 
 */
export async function findOne(
  context: Context,
  search?: <#=Table_Up#>Search & { $extra?: SearchExtra[] },
): Promise<<#=Table_Up#>Model> {
  const result = await <#=table#>Dao.findOne(context, search);
  return result;
}

/**
 * 根据id查找数据
 * @param {string} id
 * @return {Promise<<#=Table_Up#>Model>}
 */
export async function findById(
  context: Context,
  id?: string,
): Promise<<#=Table_Up#>Model | undefined> {
  const result = await <#=table#>Dao.findById(context, id);
  return result;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {<#=Table_Up#>Search & { $extra?: SearchExtra[] }} search? 搜索条件
 * @return {Promise<boolean>}
 */
export async function exist(
  context: Context,
  search?: <#=Table_Up#>Search & { $extra?: SearchExtra[] },
): Promise<boolean> {
  const result = await <#=table#>Dao.exist(context, search);
  return result;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 * @return {Promise<boolean>}
 */
export async function existById(
  context: Context,
  id: string,
): Promise<boolean> {
  const result = await <#=table#>Dao.existById(context, id);
  return result;
}

/**
 * 创建数据
 * @param {<#=Table_Up#>Model} model
 * @return {Promise<string | undefined>} 
 */
export async function create(
  context: Context,
  model: <#=Table_Up#>Model,
): Promise<string | undefined> {
  const result = await <#=table#>Dao.create(context, model);
  return result;
}

/**
 * 根据id修改数据
 * @param {string} id
 * @param {<#=Table_Up#>Model} model
 * @return {Promise<string | undefined>}
 */
export async function updateById(
  context: Context,
  id: string,
  model: <#=Table_Up#>Model,
): Promise<string | undefined> {
  await <#=table#>Dao.updateById(context, id, model);
  return id;
}

/**
 * 根据id列表删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  context: Context,
  ids: string[],
): Promise<number> {
  const result = await <#=table#>Dao.deleteByIds(context, ids);
  return result;
}

/**
 * 根据id列表还原数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  context: Context,
  ids: string[],
): Promise<number> {
  const result = await <#=table#>Dao.revertByIds(context, ids);
  return result;
}

/**
 * 导入文件
 * @param {string} id
 */
export async function importFile(
  context: Context,
  id: string,
) {
  const header: { [key: string]: string } = {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno) continue;
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
      if (!foreignKey && selectList.length === 0) {
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
      await <#=table#>Dao.create(context, model, { uniqueType: "update" });
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
export async function exportExcel(
  context: Context,
  search?: <#=Table_Up#>Search & { $extra?: SearchExtra[] },
  sort?: SortInput|SortInput[],
): Promise<string> {
  const models = await findAll(context, search, undefined, sort);
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
export async function findLastOrderBy(
  context: Context,
): Promise<number> {
  const result = await <#=table#>Dao.findLastOrderBy(context);
  return result;
}<#
}
#>
