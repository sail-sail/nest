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
  
  const usr_num = await usrDao.findCount(search);
  
  return usr_num;
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
  
  const usr_models = await usrDao.findAll(search, page, sort);
  
  return usr_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: UsrInput,
): Promise<void> {
  await usrDao.setIdByLbl(input);
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
  
  const usr_model = await usrDao.findOne(search, sort);
  
  return usr_model;
}

/**
 * 根据 id 查找用户
 */
export async function findById(
  usr_id?: UsrId | null,
): Promise<UsrModel | undefined> {
  
  const usr_model = await usrDao.findById(usr_id);
  
  return usr_model;
}

/**
 * 根据 ids 查找用户
 */
export async function findByIds(
  usr_ids: UsrId[],
): Promise<UsrModel[]> {
  
  const usr_models = await usrDao.findByIds(usr_ids);
  
  return usr_models;
}

/**
 * 根据搜索条件查找用户是否存在
 */
export async function exist(
  search?: UsrSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const usr_exist = await usrDao.exist(search);
  
  return usr_exist;
}

/**
 * 根据 id 查找用户是否存在
 */
export async function existById(
  usr_id?: UsrId | null,
): Promise<boolean> {
  
  const usr_exist = await usrDao.existById(usr_id);
  
  return usr_exist;
}

/**
 * 增加和修改时校验用户
 */
export async function validate(
  input: UsrInput,
): Promise<void> {
  await usrDao.validate(input);
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
  const usr_ids = await usrDao.creates(inputs, options);
  
  return usr_ids;
}

/**
 * 根据 id 修改用户
 */
export async function updateById(
  usr_id: UsrId,
  input: UsrInput,
): Promise<UsrId> {
  
  const is_locked = await usrDao.getIsLockedById(usr_id);
  if (is_locked) {
    throw "不能修改已经锁定的 用户";
  }
  
  const usr_id2 = await usrDao.updateById(usr_id, input);
  
  return usr_id2;
}

/** 校验用户是否存在 */
export async function validateOption(
  model0?: UsrModel,
): Promise<UsrModel> {
  const usr_model = await usrDao.validateOption(model0);
  return usr_model;
}

/**
 * 根据 ids 删除用户
 */
export async function deleteByIds(
  usr_ids: UsrId[],
): Promise<number> {
  
  const old_models = await usrDao.findByIds(usr_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 用户";
    }
  }
  
  const usr_num = await usrDao.deleteByIds(usr_ids);
  return usr_num;
}

/**
 * 根据 ids 启用或者禁用用户
 */
export async function enableByIds(
  ids: UsrId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const usr_num = await usrDao.enableByIds(ids, is_enabled);
  return usr_num;
}

/**
 * 根据 ids 锁定或者解锁用户
 */
export async function lockByIds(
  usr_ids: UsrId[],
  is_locked: 0 | 1,
): Promise<number> {
  const usr_num = await usrDao.lockByIds(usr_ids, is_locked);
  return usr_num;
}

/**
 * 根据 ids 还原用户
 */
export async function revertByIds(
  usr_ids: UsrId[],
): Promise<number> {
  
  const usr_num = await usrDao.revertByIds(usr_ids);
  
  return usr_num;
}

/**
 * 根据 ids 彻底删除用户
 */
export async function forceDeleteByIds(
  usr_ids: UsrId[],
): Promise<number> {
  
  const usr_num = await usrDao.forceDeleteByIds(usr_ids);
  
  return usr_num;
}

/**
 * 获取用户字段注释
 */
export async function getFieldComments(): Promise<UsrFieldComment> {
  const usr_fields = await usrDao.getFieldComments();
  return usr_fields;
}

/**
 * 查找 用户 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const usr_sort = await usrDao.findLastOrderBy();
  return usr_sort;
}
