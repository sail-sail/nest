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
export async function findCountWxUsr(
  search?: WxUsrSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_usr_num = await wx_usrDao.findCountWxUsr(search);
  
  return wx_usr_num;
}

/**
 * 根据搜索条件和分页查找小程序用户列表
 */
export async function findAllWxUsr(
  search?: WxUsrSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxUsrModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_usr_models = await wx_usrDao.findAllWxUsr(search, page, sort);
  
  return wx_usr_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblWxUsr(
  input: WxUsrInput,
): Promise<void> {
  await wx_usrDao.setIdByLblWxUsr(input);
}

/**
 * 根据条件查找第一个小程序用户
 */
export async function findOneWxUsr(
  search?: WxUsrSearch,
  sort?: SortInput[],
): Promise<WxUsrModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_usr_model = await wx_usrDao.findOneWxUsr(search, sort);
  
  return wx_usr_model;
}

/**
 * 根据条件查找第一个小程序用户, 如果不存在则抛错
 */
export async function findOneOkWxUsr(
  search?: WxUsrSearch,
  sort?: SortInput[],
): Promise<WxUsrModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_usr_model = await wx_usrDao.findOneOkWxUsr(search, sort);
  
  return wx_usr_model;
}

/**
 * 根据 id 查找小程序用户
 */
export async function findByIdWxUsr(
  wx_usr_id: WxUsrId,
): Promise<WxUsrModel | undefined> {
  
  const wx_usr_model = await wx_usrDao.findByIdWxUsr(wx_usr_id);
  
  return wx_usr_model;
}

/**
 * 根据 id 查找小程序用户, 如果不存在则抛错
 */
export async function findByIdOkWxUsr(
  wx_usr_id: WxUsrId,
): Promise<WxUsrModel> {
  
  const wx_usr_model = await wx_usrDao.findByIdOkWxUsr(wx_usr_id);
  
  return wx_usr_model;
}

/**
 * 根据 ids 查找小程序用户
 */
export async function findByIdsWxUsr(
  wx_usr_ids: WxUsrId[],
): Promise<WxUsrModel[]> {
  
  const wx_usr_models = await wx_usrDao.findByIdsWxUsr(wx_usr_ids);
  
  return wx_usr_models;
}

/**
 * 根据 ids 查找小程序用户, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxUsr(
  wx_usr_ids: WxUsrId[],
): Promise<WxUsrModel[]> {
  
  const wx_usr_models = await wx_usrDao.findByIdsOkWxUsr(wx_usr_ids);
  
  return wx_usr_models;
}

/**
 * 根据搜索条件查找小程序用户是否存在
 */
export async function existWxUsr(
  search?: WxUsrSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wx_usr_exist = await wx_usrDao.existWxUsr(search);
  
  return wx_usr_exist;
}

/**
 * 根据 id 查找小程序用户是否存在
 */
export async function existByIdWxUsr(
  wx_usr_id?: WxUsrId | null,
): Promise<boolean> {
  
  const wx_usr_exist = await wx_usrDao.existByIdWxUsr(wx_usr_id);
  
  return wx_usr_exist;
}

/**
 * 增加和修改时校验小程序用户
 */
export async function validateWxUsr(
  input: WxUsrInput,
): Promise<void> {
  await wx_usrDao.validateWxUsr(input);
}

/**
 * 批量创建小程序用户
 */
export async function createsWxUsr(
  inputs: WxUsrInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxUsrId[]> {
  const wx_usr_ids = await wx_usrDao.createsWxUsr(inputs, options);
  
  return wx_usr_ids;
}

/**
 * 根据 id 修改小程序用户
 */
export async function updateByIdWxUsr(
  wx_usr_id: WxUsrId,
  input: WxUsrInput,
): Promise<WxUsrId> {
  
  const wx_usr_id2 = await wx_usrDao.updateByIdWxUsr(wx_usr_id, input);
  
  return wx_usr_id2;
}

/** 校验小程序用户是否存在 */
export async function validateOptionWxUsr(
  model0?: WxUsrModel,
): Promise<WxUsrModel> {
  const wx_usr_model = await wx_usrDao.validateOptionWxUsr(model0);
  return wx_usr_model;
}

/**
 * 根据 ids 删除小程序用户
 */
export async function deleteByIdsWxUsr(
  wx_usr_ids: WxUsrId[],
): Promise<number> {
  
  const wx_usr_num = await wx_usrDao.deleteByIdsWxUsr(wx_usr_ids);
  return wx_usr_num;
}

/**
 * 根据 ids 还原小程序用户
 */
export async function revertByIdsWxUsr(
  wx_usr_ids: WxUsrId[],
): Promise<number> {
  
  const wx_usr_num = await wx_usrDao.revertByIdsWxUsr(wx_usr_ids);
  
  return wx_usr_num;
}

/**
 * 根据 ids 彻底删除小程序用户
 */
export async function forceDeleteByIdsWxUsr(
  wx_usr_ids: WxUsrId[],
): Promise<number> {
  
  const wx_usr_num = await wx_usrDao.forceDeleteByIdsWxUsr(wx_usr_ids);
  
  return wx_usr_num;
}

/**
 * 获取小程序用户字段注释
 */
export async function getFieldCommentsWxUsr(): Promise<WxUsrFieldComment> {
  const wx_usr_fields = await wx_usrDao.getFieldCommentsWxUsr();
  return wx_usr_fields;
}
