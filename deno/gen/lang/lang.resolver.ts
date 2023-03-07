import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  _internals as langService
} from "./lang.service.ts";

import {
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type LangModel,
  type LangSearch,
} from "./lang.model.ts";

export const _internals = {
  findCountLang,
  findAllLang,
  exportExcelLang,
  findOneLang,
  findByIdLang,
  createLang,
  updateByIdLang,
  deleteByIdsLang,
  importFileLang,
  revertByIdsLang,
  forceDeleteByIdsLang,
  findLastOrderByLang,
};

/**
 * 根据条件查找据数总数
 */
async function findCountLang(
  search?: LangSearch & { $extra?: SearchExtra[] },
) {
  const data = await langService.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找数据
 */
async function findAllLang(
  search?: LangSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const data = await langService.findAll(search, page, sort);
  return data;
}

/**
 * 根据搜索条件导出
 */
async function exportExcelLang(
  search?: LangSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const data = await langService.exportExcel(search, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 */
async function findOneLang(
  search?: LangSearch & { $extra?: SearchExtra[] },
) {
  const data = await langService.findOne(search);
  return data;
}

/**
 * 根据 id 查找一条数据
 */
async function findByIdLang(
  id: string,
) {
  const data = await langService.findById(id);
  return data;
}

/**
 * 创建一条数据
 */
async function createLang(
  model: LangModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await langService.create(model);
  return data;
}

/**
 * 根据id修改一条数据
 */
async function updateByIdLang(
  id: string,
  model: LangModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await langService.updateById(id, model);
  return data;
}

/**
 * 根据 ids 删除数据
 */
async function deleteByIdsLang(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await langService.deleteByIds(ids);
  return data;
}

/**
 * 导入语言
 */
async function importFileLang(
  id: string,
) {
  const data = await langService.importFile(id);
  return data;
}

/**
 * 根据 ids 还原数据
 */
async function revertByIdsLang(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await langService.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 */
async function forceDeleteByIdsLang(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await langService.forceDeleteByIds(ids);
  return data;
}

/**
 * 查找 order_by 字段的最大值
 */
async function findLastOrderByLang() {
  const data = await langService.findLastOrderBy();
  return data;
}
