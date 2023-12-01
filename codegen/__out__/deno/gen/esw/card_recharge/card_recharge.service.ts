

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  CardRechargeInput,
  CardRechargeModel,
  CardRechargeSearch,
  CardRechargeFieldComment,
  CardRechargeId,
} from "./card_recharge.model.ts";

import * as card_rechargeDao from "./card_recharge.dao.ts";

/**
 * 根据条件查找总数
 * @param {CardRechargeSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: CardRechargeSearch,
): Promise<number> {
  search = search || { };
  const data = await card_rechargeDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
 * @param {CardRechargeSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<CardRechargeModel[]>} 
 */
export async function findAll(
  search?: CardRechargeSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<CardRechargeModel[]> {
  search = search || { };
  const models: CardRechargeModel[] = await card_rechargeDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: CardRechargeInput,
) {
  const data = await card_rechargeDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一条数据
 * @param {CardRechargeSearch} search? 搜索条件
 */
export async function findOne(
  search?: CardRechargeSearch,
  sort?: SortInput|SortInput[],
): Promise<CardRechargeModel | undefined> {
  search = search || { };
  const model = await card_rechargeDao.findOne(search, sort);
  return model;
}

/**
 * 根据id查找数据
 * @param {CardRechargeId} id
 */
export async function findById(
  id?: CardRechargeId | null,
): Promise<CardRechargeModel | undefined> {
  const model = await card_rechargeDao.findById(id);
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {CardRechargeSearch} search? 搜索条件
 */
export async function exist(
  search?: CardRechargeSearch,
): Promise<boolean> {
  search = search || { };
  const data = await card_rechargeDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {CardRechargeId} id
 */
export async function existById(
  id?: CardRechargeId | null,
): Promise<boolean> {
  const data = await card_rechargeDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: CardRechargeInput,
): Promise<void> {
  const data = await card_rechargeDao.validate(input);
  return data;
}

/**
 * 创建数据
 * @param {CardRechargeInput} input
 * @return {Promise<CardRechargeId>} id
 */
export async function create(
  input: CardRechargeInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<CardRechargeId> {
  const id: CardRechargeId = await card_rechargeDao.create(input, options);
  return id;
}

/**
 * 根据 id 修改数据
 * @param {CardRechargeId} id
 * @param {CardRechargeInput} input
 * @return {Promise<CardRechargeId>}
 */
export async function updateById(
  id: CardRechargeId,
  input: CardRechargeInput,
): Promise<CardRechargeId> {
  
  const id2: CardRechargeId = await card_rechargeDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除数据
 * @param {CardRechargeId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: CardRechargeId[],
): Promise<number> {
  
  const data = await card_rechargeDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原数据
 * @param {CardRechargeId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: CardRechargeId[],
): Promise<number> {
  const data = await card_rechargeDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 * @param {CardRechargeId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: CardRechargeId[],
): Promise<number> {
  const data = await card_rechargeDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments(): Promise<CardRechargeFieldComment> {
  const data = await card_rechargeDao.getFieldComments();
  return data;
}
