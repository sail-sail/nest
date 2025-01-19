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
export async function findCount(
  search?: PermitSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await permitDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找按钮权限列表
 */
export async function findAll(
  search?: PermitSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<PermitModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: PermitModel[] = await permitDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: PermitInput,
) {
  const data = await permitDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个按钮权限
 */
export async function findOne(
  search?: PermitSearch,
  sort?: SortInput[],
): Promise<PermitModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await permitDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找按钮权限
 */
export async function findById(
  id?: PermitId | null,
): Promise<PermitModel | undefined> {
  const model = await permitDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找按钮权限是否存在
 */
export async function exist(
  search?: PermitSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await permitDao.exist(search);
  return data;
}

/**
 * 根据 id 查找按钮权限是否存在
 */
export async function existById(
  id?: PermitId | null,
): Promise<boolean> {
  const data = await permitDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验按钮权限
 */
export async function validate(
  input: PermitInput,
): Promise<void> {
  const data = await permitDao.validate(input);
  return data;
}

/**
 * 批量创建按钮权限
 */
export async function creates(
  inputs: PermitInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<PermitId[]> {
  const ids = await permitDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改按钮权限
 */
export async function updateById(
  id: PermitId,
  input: PermitInput,
): Promise<PermitId> {
  
  // 不能修改系统记录的系统字段
  const model = await permitDao.findById(id);
  if (model && model.is_sys === 1) {
    // 菜单
    input.menu_id = undefined;
    input.menu_id_lbl = "";
    // 编码
    input.code = undefined;
  }
  
  const id2 = await permitDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除按钮权限
 */
export async function deleteByIds(
  ids: PermitId[],
): Promise<number> {
  
  {
    const models = await permitDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_sys === 1) {
        throw "不能删除系统记录";
      }
    }
  }
  
  const data = await permitDao.deleteByIds(ids);
  return data;
}

/**
 * 获取按钮权限字段注释
 */
export async function getFieldComments(): Promise<PermitFieldComment> {
  const data = await permitDao.getFieldComments();
  return data;
}

/**
 * 查找 按钮权限 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await permitDao.findLastOrderBy();
  return data;
}
