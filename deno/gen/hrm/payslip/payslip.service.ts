import {
  ns,
} from "/src/base/i18n/i18n.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  PayslipInput,
  PayslipModel,
  PayslipSearch,
  PayslipFieldComment,
} from "./payslip.model.ts";

import * as payslipDao from "./payslip.dao.ts";

/**
 * 根据条件查找总数
 * @param {PayslipSearch} search? 搜索条件
 * @return {Promise<number>}
 */
export async function findCount(
  search?: PayslipSearch,
): Promise<number> {
  search = search || { };
  const data = await payslipDao.findCount(search);
  return data;
}

/**
 * 根据条件和分页查找数据
 * @param {PayslipSearch} search? 搜索条件
 * @param {PageInput} page? 分页条件
 * @param {SortInput|SortInput[]} sort? 排序
 * @return {Promise<PayslipModel[]>} 
 */
export async function findAll(
  search?: PayslipSearch,
  page?: PageInput,
  sort?: SortInput|SortInput[],
): Promise<PayslipModel[]> {
  search = search || { };
  const models: PayslipModel[] = await payslipDao.findAll(search, page, sort);
  for (const model of models) {
    // 应发工资
    model.gross_pay = "";
    // 代缴社保
    model.social_security = "";
    // 代缴个税
    model.individual_tax = "";
    // 个人自付
    model.self_pay = "";
    // 实发工资
    model.net_pay = "";
  }
  return models;
}

/**
 * 根据条件查找第一条数据
 * @param {PayslipSearch} search? 搜索条件
 */
export async function findOne(
  search?: PayslipSearch,
  sort?: SortInput|SortInput[],
): Promise<PayslipModel | undefined> {
  search = search || { };
  const model = await payslipDao.findOne(search, sort);
  if (model) {
    // 应发工资
    model.gross_pay = "";
    // 代缴社保
    model.social_security = "";
    // 代缴个税
    model.individual_tax = "";
    // 个人自付
    model.self_pay = "";
    // 实发工资
    model.net_pay = "";
  }
  return model;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
): Promise<PayslipModel | undefined> {
  const model = await payslipDao.findById(id);
  if (model) {
    // 应发工资
    model.gross_pay = "";
    // 代缴社保
    model.social_security = "";
    // 代缴个税
    model.individual_tax = "";
    // 个人自付
    model.self_pay = "";
    // 实发工资
    model.net_pay = "";
  }
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {PayslipSearch} search? 搜索条件
 */
export async function exist(
  search?: PayslipSearch,
): Promise<boolean> {
  search = search || { };
  const data = await payslipDao.exist(search);
  return data;
}

/**
 * 根据id查找数据是否存在
 * @param {string} id
 */
export async function existById(
  id?: string | null,
): Promise<boolean> {
  const data = await payslipDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: PayslipInput,
): Promise<void> {
  const data = await payslipDao.validate(input);
  return data;
}

/**
 * 创建数据
 * @param {PayslipInput} input
 * @return {Promise<string>} id
 */
export async function create(
  input: PayslipInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<string> {
  const data = await payslipDao.create(input, options);
  return data;
}

/**
 * 根据 id 修改数据
 * @param {string} id
 * @param {PayslipInput} input
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  input: PayslipInput,
): Promise<string> {
  
  const is_locked = await payslipDao.getIsLockedById(id);
  if (is_locked) {
    throw await ns("不能修改已经锁定的数据");
  }
  
  const data = await payslipDao.updateById(id, input);
  return data;
}

/**
 * 根据 ids 删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: string[],
): Promise<number> {
  
  {
    const ids2: string[] = [ ];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const is_locked = await payslipDao.getIsLockedById(id);
      if (!is_locked) {
        ids2.push(id);
      }
    }
    if (ids2.length === 0 && ids.length > 0) {
      throw await ns("不能删除已经锁定的数据");
    }
    ids = ids2;
  }
  
  const data = await payslipDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 锁定或解锁数据
 * @param {string[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: string[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await payslipDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: string[],
): Promise<number> {
  const data = await payslipDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: string[],
): Promise<number> {
  const data = await payslipDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments(): Promise<PayslipFieldComment> {
  const data = await payslipDao.getFieldComments();
  return data;
}
