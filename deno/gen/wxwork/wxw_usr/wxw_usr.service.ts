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
export async function findCount(
  search?: WxwUsrSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_usr_num = await wxw_usrDao.findCount(search);
  
  return wxw_usr_num;
}

/**
 * 根据搜索条件和分页查找企微用户列表
 */
export async function findAll(
  search?: WxwUsrSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxwUsrModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_usr_models = await wxw_usrDao.findAll(search, page, sort);
  
  return wxw_usr_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: WxwUsrInput,
): Promise<void> {
  await wxw_usrDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个企微用户
 */
export async function findOne(
  search?: WxwUsrSearch,
  sort?: SortInput[],
): Promise<WxwUsrModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_usr_model = await wxw_usrDao.findOne(search, sort);
  
  return wxw_usr_model;
}

/**
 * 根据 id 查找企微用户
 */
export async function findById(
  wxw_usr_id?: WxwUsrId | null,
): Promise<WxwUsrModel | undefined> {
  
  const wxw_usr_model = await wxw_usrDao.findById(wxw_usr_id);
  
  return wxw_usr_model;
}

/**
 * 根据 ids 查找企微用户
 */
export async function findByIds(
  wxw_usr_ids: WxwUsrId[],
): Promise<WxwUsrModel[]> {
  
  const wxw_usr_models = await wxw_usrDao.findByIds(wxw_usr_ids);
  
  return wxw_usr_models;
}

/**
 * 根据搜索条件查找企微用户是否存在
 */
export async function exist(
  search?: WxwUsrSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_usr_exist = await wxw_usrDao.exist(search);
  
  return wxw_usr_exist;
}

/**
 * 根据 id 查找企微用户是否存在
 */
export async function existById(
  wxw_usr_id?: WxwUsrId | null,
): Promise<boolean> {
  
  const wxw_usr_exist = await wxw_usrDao.existById(wxw_usr_id);
  
  return wxw_usr_exist;
}

/**
 * 增加和修改时校验企微用户
 */
export async function validate(
  input: WxwUsrInput,
): Promise<void> {
  await wxw_usrDao.validate(input);
}

/**
 * 批量创建企微用户
 */
export async function creates(
  inputs: WxwUsrInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxwUsrId[]> {
  const wxw_usr_ids = await wxw_usrDao.creates(inputs, options);
  
  return wxw_usr_ids;
}

/**
 * 根据 id 修改企微用户
 */
export async function updateById(
  wxw_usr_id: WxwUsrId,
  input: WxwUsrInput,
): Promise<WxwUsrId> {
  
  const wxw_usr_id2 = await wxw_usrDao.updateById(wxw_usr_id, input);
  
  return wxw_usr_id2;
}

/** 校验企微用户是否存在 */
export async function validateOption(
  model0?: WxwUsrModel,
): Promise<WxwUsrModel> {
  const wxw_usr_model = await wxw_usrDao.validateOption(model0);
  return wxw_usr_model;
}

/**
 * 根据 ids 删除企微用户
 */
export async function deleteByIds(
  wxw_usr_ids: WxwUsrId[],
): Promise<number> {
  
  const wxw_usr_num = await wxw_usrDao.deleteByIds(wxw_usr_ids);
  return wxw_usr_num;
}

/**
 * 根据 ids 还原企微用户
 */
export async function revertByIds(
  wxw_usr_ids: WxwUsrId[],
): Promise<number> {
  
  const wxw_usr_num = await wxw_usrDao.revertByIds(wxw_usr_ids);
  
  return wxw_usr_num;
}

/**
 * 根据 ids 彻底删除企微用户
 */
export async function forceDeleteByIds(
  wxw_usr_ids: WxwUsrId[],
): Promise<number> {
  
  const wxw_usr_num = await wxw_usrDao.forceDeleteByIds(wxw_usr_ids);
  
  return wxw_usr_num;
}

/**
 * 获取企微用户字段注释
 */
export async function getFieldComments(): Promise<WxwUsrFieldComment> {
  const wxw_usr_fields = await wxw_usrDao.getFieldComments();
  return wxw_usr_fields;
}
