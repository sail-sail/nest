import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  CardConsumeInput,
  CardConsumeModel,
  CardConsumeSearch,
  CardConsumeFieldComment,
  CardConsumeId,
} from "./card_consume.model.ts";

import * as card_consumeDao from "./card_consume.dao.ts";

/**
 * 根据条件查找会员卡消费记录总数
 * @param {CardConsumeSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: CardConsumeSearch,
): Promise<number> {
  search = search || { };
  const data = await card_consumeDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找会员卡消费记录列表
 * @param {CardConsumeSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<CardConsumeModel[]>} 
 */
export async function findAll(
  search?: CardConsumeSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<CardConsumeModel[]> {
  search = search || { };
  const models: CardConsumeModel[] = await card_consumeDao.findAll(search, page, sort);
  return models;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: CardConsumeInput,
) {
  const data = await card_consumeDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个会员卡消费记录
 * @param {CardConsumeSearch} search? 搜索条件
 */
export async function findOne(
  search?: CardConsumeSearch,
  sort?: SortInput|SortInput[],
): Promise<CardConsumeModel | undefined> {
  search = search || { };
  const model = await card_consumeDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找会员卡消费记录
 * @param {CardConsumeId} id
 */
export async function findById(
  id?: CardConsumeId | null,
): Promise<CardConsumeModel | undefined> {
  const model = await card_consumeDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找会员卡消费记录是否存在
 * @param {CardConsumeSearch} search? 搜索条件
 */
export async function exist(
  search?: CardConsumeSearch,
): Promise<boolean> {
  search = search || { };
  const data = await card_consumeDao.exist(search);
  return data;
}

/**
 * 根据 id 查找会员卡消费记录是否存在
 * @param {CardConsumeId} id
 */
export async function existById(
  id?: CardConsumeId | null,
): Promise<boolean> {
  const data = await card_consumeDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验会员卡消费记录
 * @param input 
 */
export async function validate(
  input: CardConsumeInput,
): Promise<void> {
  const data = await card_consumeDao.validate(input);
  return data;
}

/**
 * 创建数据
 * @param {CardConsumeInput} input
 * @return {Promise<CardConsumeId>} id
 */
export async function create(
  input: CardConsumeInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<CardConsumeId> {
  const id: CardConsumeId = await card_consumeDao.create(input, options);
  return id;
}

/**
 * 根据 id 修改会员卡消费记录
 * @param {CardConsumeId} id
 * @param {CardConsumeInput} input
 * @return {Promise<CardConsumeId>}
 */
export async function updateById(
  id: CardConsumeId,
  input: CardConsumeInput,
): Promise<CardConsumeId> {
  
  const id2: CardConsumeId = await card_consumeDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除会员卡消费记录
 * @param {CardConsumeId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: CardConsumeId[],
): Promise<number> {
  
  const data = await card_consumeDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 还原会员卡消费记录
 * @param {CardConsumeId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: CardConsumeId[],
): Promise<number> {
  const data = await card_consumeDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除会员卡消费记录
 * @param {CardConsumeId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: CardConsumeId[],
): Promise<number> {
  const data = await card_consumeDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取会员卡消费记录字段注释
 */
export async function getFieldComments(): Promise<CardConsumeFieldComment> {
  const data = await card_consumeDao.getFieldComments();
  return data;
}
