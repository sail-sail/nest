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
export async function findCount(
  search?: WxoUsrSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxo_usr_num = await wxo_usrDao.findCount(search);
  
  return wxo_usr_num;
}

/**
 * 根据搜索条件和分页查找公众号用户列表
 */
export async function findAll(
  search?: WxoUsrSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxoUsrModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxo_usr_models = await wxo_usrDao.findAll(search, page, sort);
  
  return wxo_usr_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: WxoUsrInput,
): Promise<void> {
  await wxo_usrDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个公众号用户
 */
export async function findOne(
  search?: WxoUsrSearch,
  sort?: SortInput[],
): Promise<WxoUsrModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxo_usr_model = await wxo_usrDao.findOne(search, sort);
  
  return wxo_usr_model;
}

/**
 * 根据 id 查找公众号用户
 */
export async function findById(
  wxo_usr_id?: WxoUsrId | null,
): Promise<WxoUsrModel | undefined> {
  
  const wxo_usr_model = await wxo_usrDao.findById(wxo_usr_id);
  
  return wxo_usr_model;
}

/**
 * 根据 ids 查找公众号用户
 */
export async function findByIds(
  wxo_usr_ids: WxoUsrId[],
): Promise<WxoUsrModel[]> {
  
  const wxo_usr_models = await wxo_usrDao.findByIds(wxo_usr_ids);
  
  return wxo_usr_models;
}

/**
 * 根据搜索条件查找公众号用户是否存在
 */
export async function exist(
  search?: WxoUsrSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxo_usr_exist = await wxo_usrDao.exist(search);
  
  return wxo_usr_exist;
}

/**
 * 根据 id 查找公众号用户是否存在
 */
export async function existById(
  wxo_usr_id?: WxoUsrId | null,
): Promise<boolean> {
  
  const wxo_usr_exist = await wxo_usrDao.existById(wxo_usr_id);
  
  return wxo_usr_exist;
}

/**
 * 增加和修改时校验公众号用户
 */
export async function validate(
  input: WxoUsrInput,
): Promise<void> {
  await wxo_usrDao.validate(input);
}

/**
 * 批量创建公众号用户
 */
export async function creates(
  inputs: WxoUsrInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxoUsrId[]> {
  const wxo_usr_ids = await wxo_usrDao.creates(inputs, options);
  
  return wxo_usr_ids;
}

/**
 * 根据 id 修改公众号用户
 */
export async function updateById(
  wxo_usr_id: WxoUsrId,
  input: WxoUsrInput,
): Promise<WxoUsrId> {
  
  const wxo_usr_id2 = await wxo_usrDao.updateById(wxo_usr_id, input);
  
  return wxo_usr_id2;
}

/** 校验公众号用户是否存在 */
export async function validateOption(
  model0?: WxoUsrModel,
): Promise<WxoUsrModel> {
  const wxo_usr_model = await wxo_usrDao.validateOption(model0);
  return wxo_usr_model;
}

/**
 * 根据 ids 删除公众号用户
 */
export async function deleteByIds(
  wxo_usr_ids: WxoUsrId[],
): Promise<number> {
  
  const wxo_usr_num = await wxo_usrDao.deleteByIds(wxo_usr_ids);
  return wxo_usr_num;
}

/**
 * 根据 ids 还原公众号用户
 */
export async function revertByIds(
  wxo_usr_ids: WxoUsrId[],
): Promise<number> {
  
  const wxo_usr_num = await wxo_usrDao.revertByIds(wxo_usr_ids);
  
  return wxo_usr_num;
}

/**
 * 根据 ids 彻底删除公众号用户
 */
export async function forceDeleteByIds(
  wxo_usr_ids: WxoUsrId[],
): Promise<number> {
  
  const wxo_usr_num = await wxo_usrDao.forceDeleteByIds(wxo_usr_ids);
  
  return wxo_usr_num;
}

/**
 * 获取公众号用户字段注释
 */
export async function getFieldComments(): Promise<WxoUsrFieldComment> {
  const wxo_usr_fields = await wxo_usrDao.getFieldComments();
  return wxo_usr_fields;
}
