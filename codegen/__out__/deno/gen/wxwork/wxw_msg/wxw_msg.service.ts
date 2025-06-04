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
export async function findCountWxwMsg(
  search?: WxwMsgSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_msg_num = await wxw_msgDao.findCountWxwMsg(search);
  
  return wxw_msg_num;
}

/**
 * 根据搜索条件和分页查找企微消息列表
 */
export async function findAllWxwMsg(
  search?: WxwMsgSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxwMsgModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_msg_models = await wxw_msgDao.findAllWxwMsg(search, page, sort);
  
  return wxw_msg_models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLblWxwMsg(
  input: WxwMsgInput,
): Promise<void> {
  await wxw_msgDao.setIdByLblWxwMsg(input);
}

/**
 * 根据条件查找第一个企微消息
 */
export async function findOneWxwMsg(
  search?: WxwMsgSearch,
  sort?: SortInput[],
): Promise<WxwMsgModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_msg_model = await wxw_msgDao.findOneWxwMsg(search, sort);
  
  return wxw_msg_model;
}

/**
 * 根据条件查找第一个企微消息, 如果不存在则抛错
 */
export async function findOneOkWxwMsg(
  search?: WxwMsgSearch,
  sort?: SortInput[],
): Promise<WxwMsgModel> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_msg_model = await wxw_msgDao.findOneOkWxwMsg(search, sort);
  
  return wxw_msg_model;
}

/**
 * 根据 id 查找企微消息
 */
export async function findByIdWxwMsg(
  wxw_msg_id: WxwMsgId,
): Promise<WxwMsgModel | undefined> {
  
  const wxw_msg_model = await wxw_msgDao.findByIdWxwMsg(wxw_msg_id);
  
  return wxw_msg_model;
}

/**
 * 根据 id 查找企微消息, 如果不存在则抛错
 */
export async function findByIdOkWxwMsg(
  wxw_msg_id: WxwMsgId,
): Promise<WxwMsgModel> {
  
  const wxw_msg_model = await wxw_msgDao.findByIdOkWxwMsg(wxw_msg_id);
  
  return wxw_msg_model;
}

/**
 * 根据 ids 查找企微消息
 */
export async function findByIdsWxwMsg(
  wxw_msg_ids: WxwMsgId[],
): Promise<WxwMsgModel[]> {
  
  const wxw_msg_models = await wxw_msgDao.findByIdsWxwMsg(wxw_msg_ids);
  
  return wxw_msg_models;
}

/**
 * 根据 ids 查找企微消息, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxwMsg(
  wxw_msg_ids: WxwMsgId[],
): Promise<WxwMsgModel[]> {
  
  const wxw_msg_models = await wxw_msgDao.findByIdsOkWxwMsg(wxw_msg_ids);
  
  return wxw_msg_models;
}

/**
 * 根据搜索条件查找企微消息是否存在
 */
export async function existWxwMsg(
  search?: WxwMsgSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const wxw_msg_exist = await wxw_msgDao.existWxwMsg(search);
  
  return wxw_msg_exist;
}

/**
 * 根据 id 查找企微消息是否存在
 */
export async function existByIdWxwMsg(
  wxw_msg_id?: WxwMsgId | null,
): Promise<boolean> {
  
  const wxw_msg_exist = await wxw_msgDao.existByIdWxwMsg(wxw_msg_id);
  
  return wxw_msg_exist;
}

/**
 * 增加和修改时校验企微消息
 */
export async function validateWxwMsg(
  input: WxwMsgInput,
): Promise<void> {
  await wxw_msgDao.validateWxwMsg(input);
}

/**
 * 批量创建企微消息
 */
export async function createsWxwMsg(
  inputs: WxwMsgInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxwMsgId[]> {
  const wxw_msg_ids = await wxw_msgDao.createsWxwMsg(inputs, options);
  
  return wxw_msg_ids;
}

/**
 * 根据 id 修改企微消息
 */
export async function updateByIdWxwMsg(
  wxw_msg_id: WxwMsgId,
  input: WxwMsgInput,
): Promise<WxwMsgId> {
  
  const wxw_msg_id2 = await wxw_msgDao.updateByIdWxwMsg(wxw_msg_id, input);
  
  return wxw_msg_id2;
}

/** 校验企微消息是否存在 */
export async function validateOptionWxwMsg(
  model0?: WxwMsgModel,
): Promise<WxwMsgModel> {
  const wxw_msg_model = await wxw_msgDao.validateOptionWxwMsg(model0);
  return wxw_msg_model;
}

/**
 * 根据 ids 删除企微消息
 */
export async function deleteByIdsWxwMsg(
  wxw_msg_ids: WxwMsgId[],
): Promise<number> {
  
  const wxw_msg_num = await wxw_msgDao.deleteByIdsWxwMsg(wxw_msg_ids);
  return wxw_msg_num;
}

/**
 * 根据 ids 还原企微消息
 */
export async function revertByIdsWxwMsg(
  wxw_msg_ids: WxwMsgId[],
): Promise<number> {
  
  const wxw_msg_num = await wxw_msgDao.revertByIdsWxwMsg(wxw_msg_ids);
  
  return wxw_msg_num;
}

/**
 * 根据 ids 彻底删除企微消息
 */
export async function forceDeleteByIdsWxwMsg(
  wxw_msg_ids: WxwMsgId[],
): Promise<number> {
  
  const wxw_msg_num = await wxw_msgDao.forceDeleteByIdsWxwMsg(wxw_msg_ids);
  
  return wxw_msg_num;
}

/**
 * 获取企微消息字段注释
 */
export async function getFieldCommentsWxwMsg(): Promise<WxwMsgFieldComment> {
  const wxw_msg_fields = await wxw_msgDao.getFieldCommentsWxwMsg();
  return wxw_msg_fields;
}
