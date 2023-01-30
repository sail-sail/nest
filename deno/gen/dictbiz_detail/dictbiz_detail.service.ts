import { renderExcel } from "ejsexcel";

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
  type Dictbiz_DetailModel,
  type Dictbiz_DetailSearch,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";
import {
  _internals as dictbiz_detailDao,
} from "./dictbiz_detail.dao.ts";

export const _internals = {
  findCount,
  findAll,
  findOne,
  findById,
  exist,
  existById,
  create,
  updateById,
  deleteByIds,
  lockByIds,
  revertByIds,
  forceDeleteByIds,
  importFile,
  exportExcel,
  findLastOrderBy,
};

/**
 * 根据条件查找总数
 * @param {Dictbiz_DetailSearch & { $extra?: SearchExtra[] }} search? 搜索条件
 * @return {Promise<number>}
 */
async function findCount(
  search?: Dictbiz_DetailSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  const result = await dictbiz_detailDao.findCount(search);
  return result;
}

/**
 * 根据条件和分页查找数据
 * @param {Dictbiz_DetailSearch & { $extra?: SearchExtra[] }} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<Dictbiz_DetailModel[]>} 
 */
async function findAll(
  search?: Dictbiz_DetailSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<Dictbiz_DetailModel[]> {
  const result: Dictbiz_DetailModel[] = await dictbiz_detailDao.findAll(search, page, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 * @param {Dictbiz_DetailSearch & { $extra?: SearchExtra[] }} search? 搜索条件
 */
async function findOne(
  search?: Dictbiz_DetailSearch & { $extra?: SearchExtra[] },
) {
  const result: Dictbiz_DetailModel | undefined = await dictbiz_detailDao.findOne(search);
  return result;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
async function findById(
  id?: string,
) {
  const result = await dictbiz_detailDao.findById(id);
  return result;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {Dictbiz_DetailSearch & { $extra?: SearchExtra[] }} search? 搜索条件
 */
async function exist(
  search?: Dictbiz_DetailSearch & { $extra?: SearchExtra[] },
) {
  const result = await dictbiz_detailDao.exist(search);
  return result;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
async function existById(
  id: string,
) {
  const result = await dictbiz_detailDao.existById(id);
  return result;
}

/**
 * 创建数据
 * @param {Dictbiz_DetailModel} model
 * @return {Promise<string | undefined>} 
 */
async function create(
  model: Dictbiz_DetailModel,
): Promise<string | undefined> {
  const result = await dictbiz_detailDao.create(model);
  return result;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {Dictbiz_DetailModel} model
 * @return {Promise<string | undefined>}
 */
async function updateById(
  id: string,
  model: Dictbiz_DetailModel,
): Promise<string | undefined> {
  await dictbiz_detailDao.updateById(id, model);
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
  const result = await dictbiz_detailDao.deleteByIds(ids);
  return result;
}

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
  const result = await dictbiz_detailDao.lockByIds(ids, is_locked);
  return result;
}

/**
 * 根据 ids 还原数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
async function revertByIds(
  ids: string[],
): Promise<number> {
  const result = await dictbiz_detailDao.revertByIds(ids);
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
  const result = await dictbiz_detailDao.forceDeleteByIds(ids);
  return result;
}

/**
 * 导入文件
 * @param {string} id
 */
async function importFile(
  id: string,
) {
  const header: { [key: string]: string } = {
    "业务字典": "_dictbiz_id",
    "名称": "lbl",
    "值": "val",
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
      await dictbiz_detailDao.create(model, { uniqueType: "update" });
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
 * @param {Dictbiz_DetailSearch & { $extra?: SearchExtra[] }} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<string>} 临时文件id
 */
async function exportExcel(
  search?: Dictbiz_DetailSearch & { $extra?: SearchExtra[] },
  sort?: SortInput|SortInput[],
): Promise<string> {
  const models = await findAll(search, undefined, sort);
  const buffer0 = await getTemplate(`dictbiz_detail.xlsx`);
  if (!buffer0) {
    throw new ServiceException(`模板文件 dictbiz_detail.xlsx 不存在!`);
  }
  const buffer = await renderExcel(buffer0, { models });
  const result = await tmpfileDao.upload(
    {
      content: buffer,
      name: "file",
      originalName: "业务字典明细.xlsx",
      contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  );
  return result;
}

/**
 * 查找 order_by 字段的最大值
 * @return {Promise<number>}
 */
async function findLastOrderBy(
): Promise<number> {
  const result = await dictbiz_detailDao.findLastOrderBy();
  return result;
}
