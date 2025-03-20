import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as wxw_msgDao from "./wxw_msg.dao.ts";

async function setSearchQuery(
  _search: WxwMsgSearch,
) {
  
}

/**
 * 根据条件查找企微消息总数
 */
export async function findCount(
  search?: WxwMsgSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_msg_num = await wxw_msgDao.findCount(search);
  
  return wxw_msg_num;
}

/**
 * 根据搜索条件和分页查找企微消息列表
 */
export async function findAll(
  search?: WxwMsgSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxwMsgModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_msg_models = await wxw_msgDao.findAll(search, page, sort);
  
  return wxw_msg_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: WxwMsgInput,
): Promise<void> {
  await wxw_msgDao.setIdByLbl(input);
}

/**
 * 根据条件查找第一个企微消息
 */
export async function findOne(
  search?: WxwMsgSearch,
  sort?: SortInput[],
): Promise<WxwMsgModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_msg_model = await wxw_msgDao.findOne(search, sort);
  
  return wxw_msg_model;
}

/**
 * 根据 id 查找企微消息
 */
export async function findById(
  wxw_msg_id?: WxwMsgId | null,
): Promise<WxwMsgModel | undefined> {
  
  const wxw_msg_model = await wxw_msgDao.findById(wxw_msg_id);
  
  return wxw_msg_model;
}

/**
 * 根据 ids 查找企微消息
 */
export async function findByIds(
  wxw_msg_ids: WxwMsgId[],
): Promise<WxwMsgModel[]> {
  
  const wxw_msg_models = await wxw_msgDao.findByIds(wxw_msg_ids);
  
  return wxw_msg_models;
}

/**
 * 根据搜索条件查找企微消息是否存在
 */
export async function exist(
  search?: WxwMsgSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_msg_exist = await wxw_msgDao.exist(search);
  
  return wxw_msg_exist;
}

/**
 * 根据 id 查找企微消息是否存在
 */
export async function existById(
  wxw_msg_id?: WxwMsgId | null,
): Promise<boolean> {
  
  const wxw_msg_exist = await wxw_msgDao.existById(wxw_msg_id);
  
  return wxw_msg_exist;
}

/**
 * 增加和修改时校验企微消息
 */
export async function validate(
  input: WxwMsgInput,
): Promise<void> {
  await wxw_msgDao.validate(input);
}

/**
 * 批量创建企微消息
 */
export async function creates(
  inputs: WxwMsgInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxwMsgId[]> {
  const wxw_msg_ids = await wxw_msgDao.creates(inputs, options);
  
  return wxw_msg_ids;
}

/**
 * 根据 id 修改企微消息
 */
export async function updateById(
  wxw_msg_id: WxwMsgId,
  input: WxwMsgInput,
): Promise<WxwMsgId> {
  
  const wxw_msg_id2 = await wxw_msgDao.updateById(wxw_msg_id, input);
  
  return wxw_msg_id2;
}

/** 校验企微消息是否存在 */
export async function validateOption(
  model0?: WxwMsgModel,
): Promise<WxwMsgModel> {
  const wxw_msg_model = await wxw_msgDao.validateOption(model0);
  return wxw_msg_model;
}

/**
 * 根据 ids 删除企微消息
 */
export async function deleteByIds(
  wxw_msg_ids: WxwMsgId[],
): Promise<number> {
  
  const wxw_msg_num = await wxw_msgDao.deleteByIds(wxw_msg_ids);
  return wxw_msg_num;
}

/**
 * 根据 ids 还原企微消息
 */
export async function revertByIds(
  wxw_msg_ids: WxwMsgId[],
): Promise<number> {
  
  const wxw_msg_num = await wxw_msgDao.revertByIds(wxw_msg_ids);
  
  return wxw_msg_num;
}

/**
 * 根据 ids 彻底删除企微消息
 */
export async function forceDeleteByIds(
  wxw_msg_ids: WxwMsgId[],
): Promise<number> {
  
  const wxw_msg_num = await wxw_msgDao.forceDeleteByIds(wxw_msg_ids);
  
  return wxw_msg_num;
}

/**
 * 获取企微消息字段注释
 */
export async function getFieldComments(): Promise<WxwMsgFieldComment> {
  const wxw_msg_fields = await wxw_msgDao.getFieldComments();
  return wxw_msg_fields;
}
