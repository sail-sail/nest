import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as permitDao from "./permit.dao.ts";

async function setSearchQuery(
  _search: PermitSearch,
) {
  
}

/**
 * 根据条件查找按钮权限总数
 */
export async function findCountPermit(
  search?: PermitSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const permit_num = await permitDao.findCountPermit(search);
  
  return permit_num;
}

/**
 * 根据搜索条件和分页查找按钮权限列表
 */
export async function findAllPermit(
  search?: PermitSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<PermitModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const permit_models = await permitDao.findAllPermit(search, page, sort);
  
  return permit_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblPermit(
  input: PermitInput,
): Promise<void> {
  await permitDao.setIdByLblPermit(input);
}

/**
 * 根据条件查找第一个按钮权限
 */
export async function findOnePermit(
  search?: PermitSearch,
  sort?: SortInput[],
): Promise<PermitModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const permit_model = await permitDao.findOnePermit(search, sort);
  
  return permit_model;
}

/**
 * 根据条件查找第一个按钮权限, 如果不存在则抛错
 */
export async function findOneOkPermit(
  search?: PermitSearch,
  sort?: SortInput[],
): Promise<PermitModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const permit_model = await permitDao.findOneOkPermit(search, sort);
  
  return permit_model;
}

/**
 * 根据 id 查找按钮权限
 */
export async function findByIdPermit(
  permit_id: PermitId,
): Promise<PermitModel | undefined> {
  
  const permit_model = await permitDao.findByIdPermit(permit_id);
  
  return permit_model;
}

/**
 * 根据 id 查找按钮权限, 如果不存在则抛错
 */
export async function findByIdOkPermit(
  permit_id: PermitId,
): Promise<PermitModel> {
  
  const permit_model = await permitDao.findByIdOkPermit(permit_id);
  
  return permit_model;
}

/**
 * 根据 ids 查找按钮权限
 */
export async function findByIdsPermit(
  permit_ids: PermitId[],
): Promise<PermitModel[]> {
  
  const permit_models = await permitDao.findByIdsPermit(permit_ids);
  
  return permit_models;
}

/**
 * 根据 ids 查找按钮权限, 出现查询不到的 id 则报错
 */
export async function findByIdsOkPermit(
  permit_ids: PermitId[],
): Promise<PermitModel[]> {
  
  const permit_models = await permitDao.findByIdsOkPermit(permit_ids);
  
  return permit_models;
}

/**
 * 根据搜索条件查找按钮权限是否存在
 */
export async function existPermit(
  search?: PermitSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const permit_exist = await permitDao.existPermit(search);
  
  return permit_exist;
}

/**
 * 根据 id 查找按钮权限是否存在
 */
export async function existByIdPermit(
  permit_id?: PermitId | null,
): Promise<boolean> {
  
  const permit_exist = await permitDao.existByIdPermit(permit_id);
  
  return permit_exist;
}

/**
 * 增加和修改时校验按钮权限
 */
export async function validatePermit(
  input: PermitInput,
): Promise<void> {
  await permitDao.validatePermit(input);
}

/**
 * 批量创建按钮权限
 */
export async function createsPermit(
  inputs: PermitInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<PermitId[]> {
  const permit_ids = await permitDao.createsPermit(inputs, options);
  
  return permit_ids;
}

/**
 * 根据 id 修改按钮权限
 */
export async function updateByIdPermit(
  permit_id: PermitId,
  input: PermitInput,
): Promise<PermitId> {
  
  const old_model = await permitDao.validateOptionPermit(
    await permitDao.findByIdPermit(permit_id),
  );
  
  // 不能修改系统记录的系统字段
  if (old_model.is_sys === 1) {
    // 菜单
    input.menu_id = undefined;
    input.menu_id_lbl = "";
    // 编码
    input.code = undefined;
  }
  
  const permit_id2 = await permitDao.updateByIdPermit(permit_id, input);
  
  return permit_id2;
}

/** 校验按钮权限是否存在 */
export async function validateOptionPermit(
  model0?: PermitModel,
): Promise<PermitModel> {
  const permit_model = await permitDao.validateOptionPermit(model0);
  return permit_model;
}

/**
 * 根据 ids 删除按钮权限
 */
export async function deleteByIdsPermit(
  permit_ids: PermitId[],
): Promise<number> {
  
  const old_models = await permitDao.findByIdsPermit(permit_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_sys === 1) {
      throw "不能删除系统记录";
    }
  }
  
  const permit_num = await permitDao.deleteByIdsPermit(permit_ids);
  return permit_num;
}

/**
 * 获取按钮权限字段注释
 */
export async function getFieldCommentsPermit(): Promise<PermitFieldComment> {
  const permit_fields = await permitDao.getFieldCommentsPermit();
  return permit_fields;
}

/**
 * 查找 按钮权限 order_by 字段的最大值
 */
export async function findLastOrderByPermit(
): Promise<number> {
  const permit_sort = await permitDao.findLastOrderByPermit();
  return permit_sort;
}
