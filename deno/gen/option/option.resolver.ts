import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  _internals as optionService
} from "./option.service.ts";

import {
  type OptionModel,
  type OptionSearch,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

export const _internals = {
  findCountOption,
  findAllOption,
  exportExcelOption,
  findOneOption,
  findByIdOption,
  createOption,
  updateByIdOption,
  deleteByIdsOption,
  importFileOption,
  revertByIdsOption,
  forceDeleteByIdsOption,
};

/**
 * 根据条件查找据数总数
 */
async function findCountOption(
  search?: OptionSearch & { $extra?: SearchExtra[] },
) {
  const result = await optionService.findCount(search);
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 */
async function findAllOption(
  search?: OptionSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const result = await optionService.findAll(search, page, sort);
  return result;
}

/**
 * 根据搜索条件导出
 */
async function exportExcelOption(
  search?: OptionSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const result = await optionService.exportExcel(search, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 */
async function findOneOption(
  search?: OptionSearch & { $extra?: SearchExtra[] },
) {
  const result = await optionService.findOne(search);
  return result;
}

/**
 * 根据 id 查找一条数据
 */
async function findByIdOption(
  id: string,
) {
  const result = await optionService.findById(id);
  return result;
}

/**
 * 创建一条数据
 */
async function createOption(
  model: OptionModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await optionService.create(model);
  return result;
}

/**
 * 根据id修改一条数据
 */
async function updateByIdOption(
  id: string,
  model: OptionModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await optionService.updateById(id, model);
  return result;
}

/**
 * 根据 ids 删除数据
 */
async function deleteByIdsOption(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await optionService.deleteByIds(ids);
  return result;
}

/**
 * 导入选项
 */
async function importFileOption(
  id: string,
) {
  const result = await optionService.importFile(id);
  return result;
}

/**
 * 根据 ids 还原数据
 */
async function revertByIdsOption(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await optionService.revertByIds(ids);
  return result;
}

/**
 * 根据 ids 彻底删除数据
 */
async function forceDeleteByIdsOption(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await optionService.forceDeleteByIds(ids);
  return result;
}
