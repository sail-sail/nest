import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as data_permitDao from "./data_permit.dao.ts";

async function setSearchQuery(
  _search: DataPermitSearch,
) {
  
}

/**
 * 根据条件查找数据权限总数
 */
export async function findCount(
  search?: DataPermitSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await data_permitDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找数据权限列表
 */
export async function findAll(
  search?: DataPermitSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DataPermitModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: DataPermitModel[] = await data_permitDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: DataPermitInput,
) {
  const data = await data_permitDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个数据权限
 */
export async function findOne(
  search?: DataPermitSearch,
  sort?: SortInput[],
): Promise<DataPermitModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await data_permitDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找数据权限
 */
export async function findById(
  id?: DataPermitId | null,
): Promise<DataPermitModel | undefined> {
  const model = await data_permitDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找数据权限是否存在
 */
export async function exist(
  search?: DataPermitSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await data_permitDao.exist(search);
  return data;
}

/**
 * 根据 id 查找数据权限是否存在
 */
export async function existById(
  id?: DataPermitId | null,
): Promise<boolean> {
  const data = await data_permitDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验数据权限
 */
export async function validate(
  input: DataPermitInput,
): Promise<void> {
  const data = await data_permitDao.validate(input);
  return data;
}

/**
 * 批量创建数据权限
 */
export async function creates(
  inputs: DataPermitInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<DataPermitId[]> {
  const ids = await data_permitDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改数据权限
 */
export async function updateById(
  id: DataPermitId,
  input: DataPermitInput,
): Promise<DataPermitId> {
  
  const old_model = await data_permitDao.validateOption(
    await data_permitDao.findById(id),
  );
  
  // 不能修改系统记录的系统字段
  if (old_model.is_sys === 1) {
    // 菜单
    input.menu_id = undefined;
    input.menu_id_lbl = "";
    // 范围
    input.scope = undefined;
    input.scope_lbl = "";
  }
  
  const id2 = await data_permitDao.updateById(id, input);
  return id2;
}

/** 校验数据权限是否存在 */
export async function validateOption(
  model0?: DataPermitModel,
): Promise<DataPermitModel> {
  const model = await data_permitDao.validateOption(model0);
  return model;
}

/**
 * 根据 ids 删除数据权限
 */
export async function deleteByIds(
  ids: DataPermitId[],
): Promise<number> {
  
  {
    const models = await data_permitDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_sys === 1) {
        throw "不能删除系统记录";
      }
    }
  }
  
  const data = await data_permitDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原数据权限
 */
export async function revertByIds(
  ids: DataPermitId[],
): Promise<number> {
  const data = await data_permitDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据权限
 */
export async function forceDeleteByIds(
  ids: DataPermitId[],
): Promise<number> {
  const data = await data_permitDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取数据权限字段注释
 */
export async function getFieldComments(): Promise<DataPermitFieldComment> {
  const data = await data_permitDao.getFieldComments();
  return data;
}
