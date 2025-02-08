import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as field_permitDao from "./field_permit.dao.ts";

async function setSearchQuery(
  _search: FieldPermitSearch,
) {
  
}

/**
 * 根据条件查找字段权限总数
 */
export async function findCount(
  search?: FieldPermitSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await field_permitDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找字段权限列表
 */
export async function findAll(
  search?: FieldPermitSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<FieldPermitModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: FieldPermitModel[] = await field_permitDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: FieldPermitInput,
) {
  const data = await field_permitDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个字段权限
 */
export async function findOne(
  search?: FieldPermitSearch,
  sort?: SortInput[],
): Promise<FieldPermitModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await field_permitDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找字段权限
 */
export async function findById(
  id?: FieldPermitId | null,
): Promise<FieldPermitModel | undefined> {
  const model = await field_permitDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找字段权限是否存在
 */
export async function exist(
  search?: FieldPermitSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await field_permitDao.exist(search);
  return data;
}

/**
 * 根据 id 查找字段权限是否存在
 */
export async function existById(
  id?: FieldPermitId | null,
): Promise<boolean> {
  const data = await field_permitDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验字段权限
 */
export async function validate(
  input: FieldPermitInput,
): Promise<void> {
  const data = await field_permitDao.validate(input);
  return data;
}

/**
 * 批量创建字段权限
 */
export async function creates(
  inputs: FieldPermitInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<FieldPermitId[]> {
  const ids = await field_permitDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改字段权限
 */
export async function updateById(
  id: FieldPermitId,
  input: FieldPermitInput,
): Promise<FieldPermitId> {
  
  const old_model = await field_permitDao.validateOption(
    await field_permitDao.findById(id),
  );
  
  // 不能修改系统记录的系统字段
  if (old_model.is_sys === 1) {
    // 菜单
    input.menu_id = undefined;
    input.menu_id_lbl = "";
    // 编码
    input.code = undefined;
  }
  
  const id2 = await field_permitDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除字段权限
 */
export async function deleteByIds(
  ids: FieldPermitId[],
): Promise<number> {
  
  {
    const models = await field_permitDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_sys === 1) {
        throw "不能删除系统记录";
      }
    }
  }
  
  const data = await field_permitDao.deleteByIds(ids);
  return data;
}

/**
 * 获取字段权限字段注释
 */
export async function getFieldComments(): Promise<FieldPermitFieldComment> {
  const data = await field_permitDao.getFieldComments();
  return data;
}

/**
 * 查找 字段权限 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await field_permitDao.findLastOrderBy();
  return data;
}
