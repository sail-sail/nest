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
  type MenuModel,
  type MenuSearch,
} from "./menu.model.ts";

import * as menuDao from "./menu.dao.ts";

/**
 * 根据条件查找总数
 * @param {MenuSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: MenuSearch,
): Promise<number> {
  search = search || { };
  const data = await menuDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
 * @param {MenuSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<MenuModel[]>} 
 */
export async function findAll(
  search?: MenuSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<MenuModel[]> {
  search = search || { };
  const data: MenuModel[] = await menuDao.findAll(search, page, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 * @param {MenuSearch} search? 搜索条件
 */
export async function findOne(
  search?: MenuSearch,
  sort?: SortInput|SortInput[],
) {
  search = search || { };
  const data = await menuDao.findOne(search, sort);
  return data;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
) {
  const data = await menuDao.findById(id);
  return data;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {MenuSearch} search? 搜索条件
 */
export async function exist(
  search?: MenuSearch,
) {
  search = search || { };
  const data = await menuDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
export async function existById(
  id?: string | null,
) {
  const data = await menuDao.existById(id);
  return data;
}

/**
 * 创建数据
 * @param {MenuModel} model
 * @return {Promise<string>} id
 */
export async function create(
  model: MenuModel,
): Promise<string> {
  const data = await menuDao.create(model);
  return data;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {MenuModel} model
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  model: MenuModel,
): Promise<string> {
  const data = await menuDao.updateById(id, model);
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
  const data = await menuDao.deleteByIds(ids);
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
  const data = await menuDao.revertByIds(ids);
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
  const data = await menuDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 导入文件
 * @param {string} id
 */
export async function importFile(
  id: string,
) {
  const n = initN("/menu");
  const header: { [key: string]: string } = {
    [ await n("类型") ]: "_type",
    [ await n("父菜单") ]: "_menu_id",
    [ await n("名称") ]: "lbl",
    [ await n("路由") ]: "route_path",
    [ await n("参数") ]: "route_query",
    [ await n("启用") ]: "_is_enabled",
    [ await n("排序") ]: "order_by",
    [ await n("备注") ]: "rem",
  };
  const models = await getImportFileRows(id, header);
  
  let succNum = 0;
  let failNum = 0;
  const failErrMsgs: string[] = [ ];
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    try {
      await menuDao.create(model, { uniqueType: "update" });
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
  const data = await menuDao.getFieldComments();
  return data;
}

/**
 * 查找 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await menuDao.findLastOrderBy();
  return data;
}
