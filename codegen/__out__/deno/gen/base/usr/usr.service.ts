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
export async function findCountUsr(
  search?: UsrSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const usr_num = await usrDao.findCountUsr(search);
  
  return usr_num;
}

/**
 * 根据搜索条件和分页查找用户列表
 */
export async function findAllUsr(
  search?: UsrSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<UsrModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const usr_models = await usrDao.findAllUsr(search, page, sort);
  
  return usr_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblUsr(
  input: UsrInput,
): Promise<void> {
  await usrDao.setIdByLblUsr(input);
}

/**
 * 根据条件查找第一个用户
 */
export async function findOneUsr(
  search?: UsrSearch,
  sort?: SortInput[],
): Promise<UsrModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const usr_model = await usrDao.findOneUsr(search, sort);
  
  return usr_model;
}

/**
 * 根据条件查找第一个用户, 如果不存在则抛错
 */
export async function findOneOkUsr(
  search?: UsrSearch,
  sort?: SortInput[],
): Promise<UsrModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const usr_model = await usrDao.findOneOkUsr(search, sort);
  
  return usr_model;
}

/**
 * 根据 id 查找用户
 */
export async function findByIdUsr(
  usr_id: UsrId,
): Promise<UsrModel | undefined> {
  
  const usr_model = await usrDao.findByIdUsr(usr_id);
  
  return usr_model;
}

/**
 * 根据 id 查找用户, 如果不存在则抛错
 */
export async function findByIdOkUsr(
  usr_id: UsrId,
): Promise<UsrModel> {
  
  const usr_model = await usrDao.findByIdOkUsr(usr_id);
  
  return usr_model;
}

/**
 * 根据 ids 查找用户
 */
export async function findByIdsUsr(
  usr_ids: UsrId[],
): Promise<UsrModel[]> {
  
  const usr_models = await usrDao.findByIdsUsr(usr_ids);
  
  return usr_models;
}

/**
 * 根据 ids 查找用户, 出现查询不到的 id 则报错
 */
export async function findByIdsOkUsr(
  usr_ids: UsrId[],
): Promise<UsrModel[]> {
  
  const usr_models = await usrDao.findByIdsOkUsr(usr_ids);
  
  return usr_models;
}

/**
 * 根据搜索条件查找用户是否存在
 */
export async function existUsr(
  search?: UsrSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const usr_exist = await usrDao.existUsr(search);
  
  return usr_exist;
}

/**
 * 根据 id 查找用户是否存在
 */
export async function existByIdUsr(
  usr_id?: UsrId | null,
): Promise<boolean> {
  
  const usr_exist = await usrDao.existByIdUsr(usr_id);
  
  return usr_exist;
}

/**
 * 增加和修改时校验用户
 */
export async function validateUsr(
  input: UsrInput,
): Promise<void> {
  await usrDao.validateUsr(input);
}

/**
 * 批量创建用户
 */
export async function createsUsr(
  inputs: UsrInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<UsrId[]> {
  const usr_ids = await usrDao.createsUsr(inputs, options);
  
  return usr_ids;
}

/**
 * 根据 id 修改用户
 */
export async function updateByIdUsr(
  usr_id: UsrId,
  input: UsrInput,
): Promise<UsrId> {
  
  const is_locked = await usrDao.getIsLockedByIdUsr(usr_id);
  if (is_locked) {
    throw "不能修改已经锁定的 用户";
  }
  
  const usr_id2 = await usrDao.updateByIdUsr(usr_id, input);
  
  return usr_id2;
}

/** 校验用户是否存在 */
export async function validateOptionUsr(
  model0?: UsrModel,
): Promise<UsrModel> {
  const usr_model = await usrDao.validateOptionUsr(model0);
  return usr_model;
}

/**
 * 根据 ids 删除用户
 */
export async function deleteByIdsUsr(
  usr_ids: UsrId[],
): Promise<number> {
  
  const old_models = await usrDao.findByIdsUsr(usr_ids);
  
  for (const old_model of old_models) {
    if (old_model.is_locked === 1) {
      throw "不能删除已经锁定的 用户";
    }
  }
  
  const usr_num = await usrDao.deleteByIdsUsr(usr_ids);
  return usr_num;
}

/**
 * 根据 ids 启用或者禁用用户
 */
export async function enableByIdsUsr(
  ids: UsrId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const usr_num = await usrDao.enableByIdsUsr(ids, is_enabled);
  return usr_num;
}

/**
 * 根据 ids 锁定或者解锁用户
 */
export async function lockByIdsUsr(
  usr_ids: UsrId[],
  is_locked: 0 | 1,
): Promise<number> {
  const usr_num = await usrDao.lockByIdsUsr(usr_ids, is_locked);
  return usr_num;
}

/**
 * 根据 ids 还原用户
 */
export async function revertByIdsUsr(
  usr_ids: UsrId[],
): Promise<number> {
  
  const usr_num = await usrDao.revertByIdsUsr(usr_ids);
  
  return usr_num;
}

/**
 * 根据 ids 彻底删除用户
 */
export async function forceDeleteByIdsUsr(
  usr_ids: UsrId[],
): Promise<number> {
  
  const usr_num = await usrDao.forceDeleteByIdsUsr(usr_ids);
  
  return usr_num;
}

/**
 * 获取用户字段注释
 */
export async function getFieldCommentsUsr(): Promise<UsrFieldComment> {
  const usr_fields = await usrDao.getFieldCommentsUsr();
  return usr_fields;
}

/**
 * 查找 用户 order_by 字段的最大值
 */
export async function findLastOrderByUsr(
  search?: UsrSearch,
): Promise<number> {
  
  const order_by = await usrDao.findLastOrderByUsr(search);
  
  return order_by;
}
