import {
  initN,
  ns,
} from "/src/i18n/i18n.ts";

import * as authDao from "/lib/auth/auth.dao.ts";

import {
  getImportFileRows,
} from "/lib/util/excel_util.ts";

import {
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type DictModel,
  type DictSearch,
} from "./dict.model.ts";

import * as dictDao from "./dict.dao.ts";

/**
 * 根据条件查找总数
 * @param {DictSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: DictSearch,
): Promise<number> {
  search = search || { };
  const data = await dictDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
 * @param {DictSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<DictModel[]>} 
 */
export async function findAll(
  search?: DictSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<DictModel[]> {
  search = search || { };
  const data: DictModel[] = await dictDao.findAll(search, page, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 * @param {DictSearch} search? 搜索条件
 */
export async function findOne(
  search?: DictSearch,
) {
  search = search || { };
  const data = await dictDao.findOne(search);
  return data;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
) {
  const data = await dictDao.findById(id);
  return data;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {DictSearch} search? 搜索条件
 */
export async function exist(
  search?: DictSearch,
) {
  search = search || { };
  const data = await dictDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
export async function existById(
  id?: string | null,
) {
  const data = await dictDao.existById(id);
  return data;
}

/**
 * 创建数据
 * @param {DictModel} model
 * @return {Promise<string>} id
 */
export async function create(
  model: DictModel,
): Promise<string> {
  const data = await dictDao.create(model);
  return data;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {DictModel} model
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  model: DictModel,
): Promise<string> {
  
  const is_locked = await dictDao.getIs_lockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  const data = await dictDao.updateById(id, model);
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
  
  const lockedIds: string[] = [ ];
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const is_locked = await dictDao.getIs_lockedById(id);
    if (is_locked) {
      lockedIds.push(id);
    }
  }
  if (lockedIds.length > 0 && lockedIds.length === ids.length) {
    throw await ns("不能删除已经锁定的数据");
  }
  const data = await dictDao.deleteByIds(ids);
  return data;
}

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
  const data = await dictDao.lockByIds(ids, is_locked);
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
  const data = await dictDao.revertByIds(ids);
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
  const data = await dictDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 导入文件
 * @param {string} id
 */
export async function importFile(
  id: string,
) {
  const n = initN("/dict");
  const header: { [key: string]: string } = {
    [ await n("编码") ]: "code",
    [ await n("名称") ]: "lbl",
    [ await n("数据类型") ]: "_type",
    [ await n("排序") ]: "order_by",
    [ await n("启用") ]: "_is_enabled",
    [ await n("备注") ]: "rem",
  };
  const models = await getImportFileRows(id, header);
  
  let succNum = 0;
  let failNum = 0;
  const failErrMsgs: string[] = [ ];
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    try {
      await dictDao.create(model, { uniqueType: "update" });
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
  const data = await dictDao.getFieldComments();
  return data;
}

/**
 * 查找 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await dictDao.findLastOrderBy();
  return data;
}
