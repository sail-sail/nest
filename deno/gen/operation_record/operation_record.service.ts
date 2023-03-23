import {
  initN,
  ns,
} from "/src/i18n/i18n.ts";

import * as authDao from "/lib/auth/auth.dao.ts";

import * as tmpfileDao from "/lib/tmpfile/tmpfile.dao.ts";

import {
  getTemplate,
  getImportFileRows,
} from "/lib/util/excel_util.ts";

import {
  ServiceException,
} from "/lib/exceptions/service.exception.ts";

import {
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type Operation_RecordModel,
  type Operation_RecordSearch,
} from "./operation_record.model.ts";

import * as operation_recordDao from "./operation_record.dao.ts";

/**
 * 根据条件查找总数
 * @param {Operation_RecordSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: Operation_RecordSearch,
): Promise<number> {
  search = search || { };
  const data = await operation_recordDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
 * @param {Operation_RecordSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<Operation_RecordModel[]>} 
 */
export async function findAll(
  search?: Operation_RecordSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<Operation_RecordModel[]> {
  search = search || { };
  const data: Operation_RecordModel[] = await operation_recordDao.findAll(search, page, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 * @param {Operation_RecordSearch} search? 搜索条件
 */
export async function findOne(
  search?: Operation_RecordSearch,
) {
  search = search || { };
  const data = await operation_recordDao.findOne(search);
  return data;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
) {
  const data = await operation_recordDao.findById(id);
  return data;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {Operation_RecordSearch} search? 搜索条件
 */
export async function exist(
  search?: Operation_RecordSearch,
) {
  search = search || { };
  const data = await operation_recordDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
export async function existById(
  id?: string | null,
) {
  const data = await operation_recordDao.existById(id);
  return data;
}

/**
 * 创建数据
 * @param {Operation_RecordModel} model
 * @return {Promise<string>} id
 */
export async function create(
  model: Operation_RecordModel,
): Promise<string> {
  const data = await operation_recordDao.create(model);
  return data;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {Operation_RecordModel} model
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  model: Operation_RecordModel,
): Promise<string> {
  const data = await operation_recordDao.updateById(id, model);
  return data;
}

/**
 * 根据 ids 删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: string[],
): Promise<number> {
  const data = await operation_recordDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: string[],
): Promise<number> {
  const data = await operation_recordDao.revertByIds(ids);
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
  const data = await operation_recordDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 导入文件
 * @param {string} id
 */
export async function importFile(
  id: string,
) {
  const n = initN("/operation_record");
  const header: { [key: string]: string } = {
    [ await n("模块") ]: "mod",
    [ await n("模块名称") ]: "mod_lbl",
    [ await n("方法") ]: "method",
    [ await n("方法名称") ]: "method_lbl",
    [ await n("操作") ]: "lbl",
    [ await n("备注") ]: "rem",
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
      failErrMsgs.push(await ns("第 {0} 行: {1}", (i + 1).toString(), err.message || err.toString()));
    }
  }
  
  let data = "";
  if (succNum > 0) {
    data = await ns("导入成功 {0} 条", succNum.toString());
    data += "\n";
  }
  if (failNum > 0) {
    data += await ns("导入失败 {0} 条", failNum.toString());
    data += "\n";
  }
  if (failErrMsgs.length > 0) {
    data += failErrMsgs.join("\n");
  }
  
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments() {
  const data = await operation_recordDao.getFieldComments();
  return data;
}
