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
  type Operation_RecordModel,
  type Operation_RecordSearch,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";
import * as operation_recordDao from "./operation_record.dao.ts";

/**
 * 根据条件查找总数
 * @param {Operation_RecordSearch & { $extra?: SearchExtra[] }} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: Operation_RecordSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  const result = await operation_recordDao.findCount(search);
  return result;
}

/**
 * 根据条件和分页查找数据
 * @param {Operation_RecordSearch & { $extra?: SearchExtra[] }} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<Operation_RecordModel[]>} 
 */
export async function findAll(
  search?: Operation_RecordSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<Operation_RecordModel[]> {
  const result: Operation_RecordModel[] = await operation_recordDao.findAll(search, page, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 * @param {Operation_RecordSearch & { $extra?: SearchExtra[] }} search? 搜索条件
 */
export async function findOne(
  search?: Operation_RecordSearch & { $extra?: SearchExtra[] },
) {
  const result: Operation_RecordModel | undefined = await operation_recordDao.findOne(search);
  return result;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string,
) {
  const result = await operation_recordDao.findById(id);
  return result;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {Operation_RecordSearch & { $extra?: SearchExtra[] }} search? 搜索条件
 */
export async function exist(
  search?: Operation_RecordSearch & { $extra?: SearchExtra[] },
) {
  const result = await operation_recordDao.exist(search);
  return result;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
export async function existById(
  id: string,
) {
  const result = await operation_recordDao.existById(id);
  return result;
}

/**
 * 创建数据
 * @param {Operation_RecordModel} model
 * @return {Promise<string | undefined>} 
 */
export async function create(
  model: Operation_RecordModel,
): Promise<string | undefined> {
  const result = await operation_recordDao.create(model);
  return result;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {Operation_RecordModel} model
 * @return {Promise<string | undefined>}
 */
export async function updateById(
  id: string,
  model: Operation_RecordModel,
): Promise<string | undefined> {
  await operation_recordDao.updateById(id, model);
  return id;
}

/**
 * 根据 ids 删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: string[],
): Promise<number> {
  const result = await operation_recordDao.deleteByIds(ids);
  return result;
}

/**
 * 根据 ids 还原数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: string[],
): Promise<number> {
  const result = await operation_recordDao.revertByIds(ids);
  return result;
}

/**
 * 根据 ids 彻底删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: string[],
): Promise<number> {
  const result = await operation_recordDao.forceDeleteByIds(ids);
  return result;
}

/**
 * 导入文件
 * @param {string} id
 */
export async function importFile(
  id: string,
) {
  const header: { [key: string]: string } = {
    "模块": "mod",
    "模块名称": "mod_lbl",
    "方法": "method",
    "方法名称": "method_lbl",
    "操作": "lbl",
    "备注": "rem",
  };
  const models = await getImportFileRows(id, header);
  
  let succNum = 0;
  let failNum = 0;
  const failErrMsgs: string[] = [ ];
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    try {
      await operation_recordDao.create(model, { uniqueType: "update" });
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
 * @param {Operation_RecordSearch & { $extra?: SearchExtra[] }} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<string>} 临时文件id
 */
export async function exportExcel(
  search?: Operation_RecordSearch & { $extra?: SearchExtra[] },
  sort?: SortInput|SortInput[],
): Promise<string> {
  const models = await findAll(search, undefined, sort);
  const buffer0 = await getTemplate(`operation_record.xlsx`);
  if (!buffer0) {
    throw new ServiceException(`模板文件 operation_record.xlsx 不存在!`);
  }
  const buffer = await renderExcel(buffer0, { models });
  const result = await tmpfileDao.upload(
    {
      content: buffer,
      name: "file",
      originalName: "操作记录.xlsx",
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  );
  return result;
}
