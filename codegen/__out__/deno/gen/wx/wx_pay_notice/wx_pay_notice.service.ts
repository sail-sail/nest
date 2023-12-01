

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  WxPayNoticeInput,
  WxPayNoticeModel,
  WxPayNoticeSearch,
  WxPayNoticeFieldComment,
  WxPayNoticeId,
} from "./wx_pay_notice.model.ts";

import * as wx_pay_noticeDao from "./wx_pay_notice.dao.ts";

/**
 * 根据条件查找总数
 * @param {WxPayNoticeSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: WxPayNoticeSearch,
): Promise<number> {
  search = search || { };
  const data = await wx_pay_noticeDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
 * @param {WxPayNoticeSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<WxPayNoticeModel[]>} 
 */
export async function findAll(
  search?: WxPayNoticeSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<WxPayNoticeModel[]> {
  search = search || { };
  const models: WxPayNoticeModel[] = await wx_pay_noticeDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: WxPayNoticeInput,
) {
  const data = await wx_pay_noticeDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一条数据
 * @param {WxPayNoticeSearch} search? 搜索条件
 */
export async function findOne(
  search?: WxPayNoticeSearch,
  sort?: SortInput|SortInput[],
): Promise<WxPayNoticeModel | undefined> {
  search = search || { };
  const model = await wx_pay_noticeDao.findOne(search, sort);
  return model;
}

/**
 * 根据id查找数据
 * @param {WxPayNoticeId} id
 */
export async function findById(
  id?: WxPayNoticeId | null,
): Promise<WxPayNoticeModel | undefined> {
  const model = await wx_pay_noticeDao.findById(id);
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {WxPayNoticeSearch} search? 搜索条件
 */
export async function exist(
  search?: WxPayNoticeSearch,
): Promise<boolean> {
  search = search || { };
  const data = await wx_pay_noticeDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {WxPayNoticeId} id
 */
export async function existById(
  id?: WxPayNoticeId | null,
): Promise<boolean> {
  const data = await wx_pay_noticeDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: WxPayNoticeInput,
): Promise<void> {
  const data = await wx_pay_noticeDao.validate(input);
  return data;
}

/**
 * 创建数据
 * @param {WxPayNoticeInput} input
 * @return {Promise<WxPayNoticeId>} id
 */
export async function create(
  input: WxPayNoticeInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxPayNoticeId> {
  const id: WxPayNoticeId = await wx_pay_noticeDao.create(input, options);
  return id;
}

/**
 * 根据 id 修改数据
 * @param {WxPayNoticeId} id
 * @param {WxPayNoticeInput} input
 * @return {Promise<WxPayNoticeId>}
 */
export async function updateById(
  id: WxPayNoticeId,
  input: WxPayNoticeInput,
): Promise<WxPayNoticeId> {
  
  const id2: WxPayNoticeId = await wx_pay_noticeDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除数据
 * @param {WxPayNoticeId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: WxPayNoticeId[],
): Promise<number> {
  
  const data = await wx_pay_noticeDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原数据
 * @param {WxPayNoticeId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: WxPayNoticeId[],
): Promise<number> {
  const data = await wx_pay_noticeDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 * @param {WxPayNoticeId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: WxPayNoticeId[],
): Promise<number> {
  const data = await wx_pay_noticeDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments(): Promise<WxPayNoticeFieldComment> {
  const data = await wx_pay_noticeDao.getFieldComments();
  return data;
}
