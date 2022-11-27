import {
  useContext,
} from "/lib/context.ts";

import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  _internals as permitService
} from "./permit.service.ts";

import {
  type PermitModel,
  type PermitSearch,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

export const _internals = {
  findCountPermit,
  findAllPermit,
  exportExcelPermit,
  findOnePermit,
  findByIdPermit,
  createPermit,
  updateByIdPermit,
  deleteByIdsPermit,
  importFilePermit,
  revertByIdsPermit,
  forceDeleteByIdsPermit,
};

/**
 * 根据条件查找据数总数
 */
async function findCountPermit(
  search?: PermitSearch & { $extra?: SearchExtra[] },
) {
  const result = await permitService.findCount(search);
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 */
async function findAllPermit(
  search?: PermitSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const result = await permitService.findAll(search, page, sort);
  return result;
}

/**
 * 根据搜索条件导出
 */
async function exportExcelPermit(
  search?: PermitSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const result = await permitService.exportExcel(search, sort);
  return result;
}

/**
 * 根据条件查找第一条数据
 */
async function findOnePermit(
  search?: PermitSearch & { $extra?: SearchExtra[] },
) {
  const result = await permitService.findOne(search);
  return result;
}

/**
 * 根据 id 查找一条数据
 */
async function findByIdPermit(
  id: string,
) {
  const result = await permitService.findById(id);
  return result;
}

/**
 * 创建一条数据
 */
async function createPermit(
  model: PermitModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await permitService.create(model);
  return result;
}

/**
 * 根据id修改一条数据
 */
async function updateByIdPermit(
  id: string,
  model: PermitModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await permitService.updateById(id, model);
  return result;
}

/**
 * 根据 ids 删除数据
 */
async function deleteByIdsPermit(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await permitService.deleteByIds(ids);
  return result;
}

/**
 * 导入权限
 */
async function importFilePermit(
  id: string,
) {
  const result = await permitService.importFile(id);
  return result;
}

/**
 * 根据 ids 还原数据
 */
async function revertByIdsPermit(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await permitService.revertByIds(ids);
  return result;
}

/**
 * 根据 ids 彻底删除数据
 */
async function forceDeleteByIdsPermit(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const result = await permitService.forceDeleteByIds(ids);
  return result;
}
