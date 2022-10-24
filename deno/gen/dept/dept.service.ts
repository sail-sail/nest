import { type Context } from "/lib/context.ts";
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
  type DeptModel,
  type DeptSearch,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";
import * as deptDao from "./dept.dao.ts";

/**
 * 根据条件查找总数
 * @param {DeptSearch & { $extra?: SearchExtra[] }} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  context: Context,
  search?: DeptSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  const result = await deptDao.findCount(context, search);
  return result;
}

/**
 * 根据条件和分页查找数据
 * @param {DeptSearch & { $extra?: SearchExtra[] }} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<DeptModel[]>} 
 */
export async function findAll(
  context: Context,
  search?: DeptSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<DeptModel[]> {
  const result: DeptModel[] = await deptDao.findAll(context, search, page, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 * @param {DeptSearch & { $extra?: SearchExtra[] }} search? 搜索条件
 */
export async function findOne(
  context: Context,
  search?: DeptSearch & { $extra?: SearchExtra[] },
) {
  const result: DeptModel | undefined = await deptDao.findOne(context, search);
  return result;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  context: Context,
  id?: string,
) {
  const result = await deptDao.findById(context, id);
  return result;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {DeptSearch & { $extra?: SearchExtra[] }} search? 搜索条件
 */
export async function exist(
  context: Context,
  search?: DeptSearch & { $extra?: SearchExtra[] },
) {
  const result = await deptDao.exist(context, search);
  return result;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
export async function existById(
  context: Context,
  id: string,
) {
  const result = await deptDao.existById(context, id);
  return result;
}

/**
 * 创建数据
 * @param {DeptModel} model
 * @return {Promise<string | undefined>} 
 */
export async function create(
  context: Context,
  model: DeptModel,
): Promise<string | undefined> {
  const result = await deptDao.create(context, model);
  return result;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {DeptModel} model
 * @return {Promise<string | undefined>}
 */
export async function updateById(
  context: Context,
  id: string,
  model: DeptModel,
): Promise<string | undefined> {
  await deptDao.updateById(context, id, model);
  return id;
}

/**
 * 根据 ids 删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  context: Context,
  ids: string[],
): Promise<number> {
  const result = await deptDao.deleteByIds(context, ids);
  return result;
}

/**
 * 根据 ids 锁定或解锁数据
 * @param {string[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  context: Context,
  ids: string[],
  is_locked: 0 | 1,
): Promise<number> {
  const result = await deptDao.lockByIds(context, ids, is_locked);
  return result;
}

/**
 * 根据 ids 还原数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  context: Context,
  ids: string[],
): Promise<number> {
  const result = await deptDao.revertByIds(context, ids);
  return result;
}

/**
 * 根据 ids 彻底删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  context: Context,
  ids: string[],
): Promise<number> {
  const result = await deptDao.forceDeleteByIds(context, ids);
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
  const header: { [key: string]: string } = {
    "父部门": "_parent_id",
    "名称": "lbl",
    "排序": "order_by",
    "启用": "_is_enabled",
    "备注": "rem",
  };
  const models = await getImportFileRows(id, header);
  
  let succNum = 0;
  let failNum = 0;
  const failErrMsgs: string[] = [ ];
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    try {
      await deptDao.create(context, model, { uniqueType: "update" });
      succNum++;
    } catch (err) {
      failNum++;
      failErrMsgs.push(`第 ${ i + 1 } 行: ${ err.message || err.toString() }`);
    }
  }
  
  let result = "";
  if (succNum > 0) {
    result = `导入成功 ${ succNum } 条\n`;
  }
  if (failNum > 0) {
    result += `导入失败 ${ failNum } 条\n`;
  }
  if (failErrMsgs.length > 0) {
    result += failErrMsgs.join("\n");
  }
  
  return result;
}

/**
 * 导出Excel
 * @param {DeptSearch & { $extra?: SearchExtra[] }} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<string>} 临时文件id
 */
export async function exportExcel(
  context: Context,
  search?: DeptSearch & { $extra?: SearchExtra[] },
  sort?: SortInput|SortInput[],
): Promise<string> {
  const models = await findAll(context, search, undefined, sort);
  const buffer0 = await getTemplate(`dept.xlsx`);
  if (!buffer0) {
    throw new ServiceException(`模板文件 dept.xlsx 不存在!`);
  }
  const buffer = await renderExcel(buffer0, { models });
  const result = await tmpfileDao.upload(
    {
      content: buffer,
      name: "file",
      originalName: "部门.xlsx",
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  );
  return result;
}

/**
 * 查找 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
  context: Context,
): Promise<number> {
  const result = await deptDao.findLastOrderBy(context);
  return result;
}
