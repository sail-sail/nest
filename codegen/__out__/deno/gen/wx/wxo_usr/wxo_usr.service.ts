import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as wxo_usrDao from "./wxo_usr.dao.ts";

async function setSearchQuery(
  _search: WxoUsrSearch,
) {
  
}

/**
 * 根据条件查找公众号用户总数
 */
export async function findCountWxoUsr(
  search?: WxoUsrSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxo_usr_num = await wxo_usrDao.findCountWxoUsr(search);
  
  return wxo_usr_num;
}

/**
 * 根据搜索条件和分页查找公众号用户列表
 */
export async function findAllWxoUsr(
  search?: WxoUsrSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxoUsrModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxo_usr_models = await wxo_usrDao.findAllWxoUsr(search, page, sort);
  
  return wxo_usr_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblWxoUsr(
  input: WxoUsrInput,
): Promise<void> {
  await wxo_usrDao.setIdByLblWxoUsr(input);
}

/**
 * 根据条件查找第一个公众号用户
 */
export async function findOneWxoUsr(
  search?: WxoUsrSearch,
  sort?: SortInput[],
): Promise<WxoUsrModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxo_usr_model = await wxo_usrDao.findOneWxoUsr(search, sort);
  
  return wxo_usr_model;
}

/**
 * 根据 id 查找公众号用户
 */
export async function findByIdWxoUsr(
  wxo_usr_id?: WxoUsrId | null,
): Promise<WxoUsrModel | undefined> {
  
  const wxo_usr_model = await wxo_usrDao.findByIdWxoUsr(wxo_usr_id);
  
  return wxo_usr_model;
}

/**
 * 根据 ids 查找公众号用户
 */
export async function findByIdsWxoUsr(
  wxo_usr_ids: WxoUsrId[],
): Promise<WxoUsrModel[]> {
  
  const wxo_usr_models = await wxo_usrDao.findByIdsWxoUsr(wxo_usr_ids);
  
  return wxo_usr_models;
}

/**
 * 根据搜索条件查找公众号用户是否存在
 */
export async function existWxoUsr(
  search?: WxoUsrSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxo_usr_exist = await wxo_usrDao.existWxoUsr(search);
  
  return wxo_usr_exist;
}

/**
 * 根据 id 查找公众号用户是否存在
 */
export async function existByIdWxoUsr(
  wxo_usr_id?: WxoUsrId | null,
): Promise<boolean> {
  
  const wxo_usr_exist = await wxo_usrDao.existByIdWxoUsr(wxo_usr_id);
  
  return wxo_usr_exist;
}

/**
 * 增加和修改时校验公众号用户
 */
export async function validateWxoUsr(
  input: WxoUsrInput,
): Promise<void> {
  await wxo_usrDao.validateWxoUsr(input);
}

/**
 * 批量创建公众号用户
 */
export async function createsWxoUsr(
  inputs: WxoUsrInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxoUsrId[]> {
  const wxo_usr_ids = await wxo_usrDao.createsWxoUsr(inputs, options);
  
  return wxo_usr_ids;
}

/**
 * 根据 id 修改公众号用户
 */
export async function updateByIdWxoUsr(
  wxo_usr_id: WxoUsrId,
  input: WxoUsrInput,
): Promise<WxoUsrId> {
  
  const wxo_usr_id2 = await wxo_usrDao.updateByIdWxoUsr(wxo_usr_id, input);
  
  return wxo_usr_id2;
}

/** 校验公众号用户是否存在 */
export async function validateOptionWxoUsr(
  model0?: WxoUsrModel,
): Promise<WxoUsrModel> {
  const wxo_usr_model = await wxo_usrDao.validateOptionWxoUsr(model0);
  return wxo_usr_model;
}

/**
 * 根据 ids 删除公众号用户
 */
export async function deleteByIdsWxoUsr(
  wxo_usr_ids: WxoUsrId[],
): Promise<number> {
  
  const wxo_usr_num = await wxo_usrDao.deleteByIdsWxoUsr(wxo_usr_ids);
  return wxo_usr_num;
}

/**
 * 根据 ids 还原公众号用户
 */
export async function revertByIdsWxoUsr(
  wxo_usr_ids: WxoUsrId[],
): Promise<number> {
  
  const wxo_usr_num = await wxo_usrDao.revertByIdsWxoUsr(wxo_usr_ids);
  
  return wxo_usr_num;
}

/**
 * 根据 ids 彻底删除公众号用户
 */
export async function forceDeleteByIdsWxoUsr(
  wxo_usr_ids: WxoUsrId[],
): Promise<number> {
  
  const wxo_usr_num = await wxo_usrDao.forceDeleteByIdsWxoUsr(wxo_usr_ids);
  
  return wxo_usr_num;
}

/**
 * 获取公众号用户字段注释
 */
export async function getFieldCommentsWxoUsr(): Promise<WxoUsrFieldComment> {
  const wxo_usr_fields = await wxo_usrDao.getFieldCommentsWxoUsr();
  return wxo_usr_fields;
}
