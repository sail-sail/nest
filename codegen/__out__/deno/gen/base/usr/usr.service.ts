import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as usrDao from "./usr.dao.ts";

async function setSearchQuery(
  _search: UsrSearch,
) {
  
}

/**
 * 根据条件查找用户总数
 */
export async function findCount(
  search?: UsrSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await usrDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找用户列表
 */
export async function findAll(
  search?: UsrSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<UsrModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: UsrModel[] = await usrDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: UsrInput,
) {
  const data = await usrDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个用户
 */
export async function findOne(
  search?: UsrSearch,
  sort?: SortInput[],
): Promise<UsrModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await usrDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找用户
 */
export async function findById(
  id?: UsrId | null,
): Promise<UsrModel | undefined> {
  const model = await usrDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找用户是否存在
 */
export async function exist(
  search?: UsrSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await usrDao.exist(search);
  return data;
}

/**
 * 根据 id 查找用户是否存在
 */
export async function existById(
  id?: UsrId | null,
): Promise<boolean> {
  const data = await usrDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验用户
 */
export async function validate(
  input: UsrInput,
): Promise<void> {
  const data = await usrDao.validate(input);
  return data;
}

/**
 * 批量创建用户
 */
export async function creates(
  inputs: UsrInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<UsrId[]> {
  const ids = await usrDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改用户
 */
export async function updateById(
  id: UsrId,
  input: UsrInput,
): Promise<UsrId> {
  
  const is_locked = await usrDao.getIsLockedById(id);
  if (is_locked) {
    throw "不能修改已经锁定的 用户";
  }
  
  const id2 = await usrDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除用户
 */
export async function deleteByIds(
  ids: UsrId[],
): Promise<number> {
  
  {
    const models = await usrDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {
        throw "不能删除已经锁定的 用户";
      }
    }
  }
  
  const data = await usrDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用用户
 */
export async function enableByIds(
  ids: UsrId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await usrDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁用户
 */
export async function lockByIds(
  ids: UsrId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await usrDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原用户
 */
export async function revertByIds(
  ids: UsrId[],
): Promise<number> {
  const data = await usrDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除用户
 */
export async function forceDeleteByIds(
  ids: UsrId[],
): Promise<number> {
  const data = await usrDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取用户字段注释
 */
export async function getFieldComments(): Promise<UsrFieldComment> {
  const data = await usrDao.getFieldComments();
  return data;
}

/**
 * 查找 用户 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await usrDao.findLastOrderBy();
  return data;
}
