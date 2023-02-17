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
  const data = await permitService.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找数据
 */
async function findAllPermit(
  search?: PermitSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
) {
  const data = await permitService.findAll(search, page, sort);
  return data;
}

/**
 * 根据搜索条件导出
 */
async function exportExcelPermit(
  search?: PermitSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
) {
  const data = await permitService.exportExcel(search, sort);
  return data;
}

/**
 * 根据条件查找第一条数据
 */
async function findOnePermit(
  search?: PermitSearch & { $extra?: SearchExtra[] },
) {
  const data = await permitService.findOne(search);
  return data;
}

/**
 * 根据 id 查找一条数据
 */
async function findByIdPermit(
  id: string,
) {
  const data = await permitService.findById(id);
  return data;
}

/**
 * 创建一条数据
 */
async function createPermit(
  model: PermitModel,
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await permitService.create(model);
  return data;
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
  const data = await permitService.updateById(id, model);
  return data;
}

/**
 * 根据 ids 删除数据
 */
async function deleteByIdsPermit(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await permitService.deleteByIds(ids);
  return data;
}

/**
 * 导入权限
 */
async function importFilePermit(
  id: string,
) {
  const data = await permitService.importFile(id);
  return data;
}

/**
 * 根据 ids 还原数据
 */
async function revertByIdsPermit(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await permitService.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 */
async function forceDeleteByIdsPermit(
  ids: string[],
) {
  const context = useContext();
  
  context.is_tran = true;
  const data = await permitService.forceDeleteByIds(ids);
  return data;
}
