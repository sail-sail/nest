import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as wxw_usrDao from "./wxw_usr.dao.ts";

async function setSearchQuery(
  _search: WxwUsrSearch,
) {
  
}

/**
 * 根据条件查找企微用户总数
 */
export async function findCountWxwUsr(
  search?: WxwUsrSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_usr_num = await wxw_usrDao.findCountWxwUsr(search);
  
  return wxw_usr_num;
}

/**
 * 根据搜索条件和分页查找企微用户列表
 */
export async function findAllWxwUsr(
  search?: WxwUsrSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxwUsrModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_usr_models = await wxw_usrDao.findAllWxwUsr(search, page, sort);
  
  return wxw_usr_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblWxwUsr(
  input: WxwUsrInput,
): Promise<void> {
  await wxw_usrDao.setIdByLblWxwUsr(input);
}

/**
 * 根据条件查找第一个企微用户
 */
export async function findOneWxwUsr(
  search?: WxwUsrSearch,
  sort?: SortInput[],
): Promise<WxwUsrModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_usr_model = await wxw_usrDao.findOneWxwUsr(search, sort);
  
  return wxw_usr_model;
}

/**
 * 根据条件查找第一个企微用户, 如果不存在则抛错
 */
export async function findOneOkWxwUsr(
  search?: WxwUsrSearch,
  sort?: SortInput[],
): Promise<WxwUsrModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_usr_model = await wxw_usrDao.findOneOkWxwUsr(search, sort);
  
  return wxw_usr_model;
}

/**
 * 根据 id 查找企微用户
 */
export async function findByIdWxwUsr(
  wxw_usr_id: WxwUsrId,
): Promise<WxwUsrModel | undefined> {
  
  const wxw_usr_model = await wxw_usrDao.findByIdWxwUsr(wxw_usr_id);
  
  return wxw_usr_model;
}

/**
 * 根据 id 查找企微用户, 如果不存在则抛错
 */
export async function findByIdOkWxwUsr(
  wxw_usr_id: WxwUsrId,
): Promise<WxwUsrModel> {
  
  const wxw_usr_model = await wxw_usrDao.findByIdOkWxwUsr(wxw_usr_id);
  
  return wxw_usr_model;
}

/**
 * 根据 ids 查找企微用户
 */
export async function findByIdsWxwUsr(
  wxw_usr_ids: WxwUsrId[],
): Promise<WxwUsrModel[]> {
  
  const wxw_usr_models = await wxw_usrDao.findByIdsWxwUsr(wxw_usr_ids);
  
  return wxw_usr_models;
}

/**
 * 根据 ids 查找企微用户, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxwUsr(
  wxw_usr_ids: WxwUsrId[],
): Promise<WxwUsrModel[]> {
  
  const wxw_usr_models = await wxw_usrDao.findByIdsOkWxwUsr(wxw_usr_ids);
  
  return wxw_usr_models;
}

/**
 * 根据搜索条件查找企微用户是否存在
 */
export async function existWxwUsr(
  search?: WxwUsrSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_usr_exist = await wxw_usrDao.existWxwUsr(search);
  
  return wxw_usr_exist;
}

/**
 * 根据 id 查找企微用户是否存在
 */
export async function existByIdWxwUsr(
  wxw_usr_id?: WxwUsrId | null,
): Promise<boolean> {
  
  const wxw_usr_exist = await wxw_usrDao.existByIdWxwUsr(wxw_usr_id);
  
  return wxw_usr_exist;
}

/**
 * 增加和修改时校验企微用户
 */
export async function validateWxwUsr(
  input: WxwUsrInput,
): Promise<void> {
  await wxw_usrDao.validateWxwUsr(input);
}

/**
 * 批量创建企微用户
 */
export async function createsWxwUsr(
  inputs: WxwUsrInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxwUsrId[]> {
  const wxw_usr_ids = await wxw_usrDao.createsWxwUsr(inputs, options);
  
  return wxw_usr_ids;
}

/**
 * 根据 id 修改企微用户
 */
export async function updateByIdWxwUsr(
  wxw_usr_id: WxwUsrId,
  input: WxwUsrInput,
): Promise<WxwUsrId> {
  
  const wxw_usr_id2 = await wxw_usrDao.updateByIdWxwUsr(wxw_usr_id, input);
  
  return wxw_usr_id2;
}

/** 校验企微用户是否存在 */
export async function validateOptionWxwUsr(
  model0?: WxwUsrModel,
): Promise<WxwUsrModel> {
  const wxw_usr_model = await wxw_usrDao.validateOptionWxwUsr(model0);
  return wxw_usr_model;
}

/**
 * 根据 ids 删除企微用户
 */
export async function deleteByIdsWxwUsr(
  wxw_usr_ids: WxwUsrId[],
): Promise<number> {
  
  const wxw_usr_num = await wxw_usrDao.deleteByIdsWxwUsr(wxw_usr_ids);
  return wxw_usr_num;
}

/**
 * 根据 ids 还原企微用户
 */
export async function revertByIdsWxwUsr(
  wxw_usr_ids: WxwUsrId[],
): Promise<number> {
  
  const wxw_usr_num = await wxw_usrDao.revertByIdsWxwUsr(wxw_usr_ids);
  
  return wxw_usr_num;
}

/**
 * 根据 ids 彻底删除企微用户
 */
export async function forceDeleteByIdsWxwUsr(
  wxw_usr_ids: WxwUsrId[],
): Promise<number> {
  
  const wxw_usr_num = await wxw_usrDao.forceDeleteByIdsWxwUsr(wxw_usr_ids);
  
  return wxw_usr_num;
}

/**
 * 获取企微用户字段注释
 */
export async function getFieldCommentsWxwUsr(): Promise<WxwUsrFieldComment> {
  const wxw_usr_fields = await wxw_usrDao.getFieldCommentsWxwUsr();
  return wxw_usr_fields;
}
