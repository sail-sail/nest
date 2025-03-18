import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as wx_usrDao from "./wx_usr.dao.ts";

async function setSearchQuery(
  _search: WxUsrSearch,
) {
  
}

/**
 * 根据条件查找小程序用户总数
 */
export async function findCount(
  search?: WxUsrSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_usr_num = await wx_usrDao.findCount(search);
  
  return wx_usr_num;
}

/**
 * 根据搜索条件和分页查找小程序用户列表
 */
export async function findAll(
  search?: WxUsrSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxUsrModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_usr_models = await wx_usrDao.findAll(search, page, sort);
  
  return wx_usr_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: WxUsrInput,
): Promise<void> {
  await wx_usrDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个小程序用户
 */
export async function findOne(
  search?: WxUsrSearch,
  sort?: SortInput[],
): Promise<WxUsrModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_usr_model = await wx_usrDao.findOne(search, sort);
  
  return wx_usr_model;
}

/**
 * 根据 id 查找小程序用户
 */
export async function findById(
  wx_usr_id?: WxUsrId | null,
): Promise<WxUsrModel | undefined> {
  
  const wx_usr_model = await wx_usrDao.findById(wx_usr_id);
  
  return wx_usr_model;
}

/**
 * 根据 ids 查找小程序用户
 */
export async function findByIds(
  wx_usr_ids: WxUsrId[],
): Promise<WxUsrModel[]> {
  
  const wx_usr_models = await wx_usrDao.findByIds(wx_usr_ids);
  
  return wx_usr_models;
}

/**
 * 根据搜索条件查找小程序用户是否存在
 */
export async function exist(
  search?: WxUsrSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_usr_exist = await wx_usrDao.exist(search);
  
  return wx_usr_exist;
}

/**
 * 根据 id 查找小程序用户是否存在
 */
export async function existById(
  wx_usr_id?: WxUsrId | null,
): Promise<boolean> {
  
  const wx_usr_exist = await wx_usrDao.existById(wx_usr_id);
  
  return wx_usr_exist;
}

/**
 * 增加和修改时校验小程序用户
 */
export async function validate(
  input: WxUsrInput,
): Promise<void> {
  await wx_usrDao.validate(input);
}

/**
 * 批量创建小程序用户
 */
export async function creates(
  inputs: WxUsrInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxUsrId[]> {
  const wx_usr_ids = await wx_usrDao.creates(inputs, options);
  
  return wx_usr_ids;
}

/**
 * 根据 id 修改小程序用户
 */
export async function updateById(
  wx_usr_id: WxUsrId,
  input: WxUsrInput,
): Promise<WxUsrId> {
  
  const wx_usr_id2 = await wx_usrDao.updateById(wx_usr_id, input);
  
  return wx_usr_id2;
}

/** 校验小程序用户是否存在 */
export async function validateOption(
  model0?: WxUsrModel,
): Promise<WxUsrModel> {
  const wx_usr_model = await wx_usrDao.validateOption(model0);
  return wx_usr_model;
}

/**
 * 根据 ids 删除小程序用户
 */
export async function deleteByIds(
  wx_usr_ids: WxUsrId[],
): Promise<number> {
  
  const wx_usr_num = await wx_usrDao.deleteByIds(wx_usr_ids);
  return wx_usr_num;
}

/**
 * 根据 ids 还原小程序用户
 */
export async function revertByIds(
  wx_usr_ids: WxUsrId[],
): Promise<number> {
  
  const wx_usr_num = await wx_usrDao.revertByIds(wx_usr_ids);
  
  return wx_usr_num;
}

/**
 * 根据 ids 彻底删除小程序用户
 */
export async function forceDeleteByIds(
  wx_usr_ids: WxUsrId[],
): Promise<number> {
  
  const wx_usr_num = await wx_usrDao.forceDeleteByIds(wx_usr_ids);
  
  return wx_usr_num;
}

/**
 * 获取小程序用户字段注释
 */
export async function getFieldComments(): Promise<WxUsrFieldComment> {
  const wx_usr_fields = await wx_usrDao.getFieldComments();
  return wx_usr_fields;
}
