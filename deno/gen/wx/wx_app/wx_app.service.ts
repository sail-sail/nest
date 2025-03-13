import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as wx_appDao from "./wx_app.dao.ts";

async function setSearchQuery(
  _search: WxAppSearch,
) {
  
}

/**
 * 根据条件查找小程序设置总数
 */
export async function findCount(
  search?: WxAppSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await wx_appDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找小程序设置列表
 */
export async function findAll(
  search?: WxAppSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxAppModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: WxAppModel[] = await wx_appDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: WxAppInput,
) {
  const data = await wx_appDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个小程序设置
 */
export async function findOne(
  search?: WxAppSearch,
  sort?: SortInput[],
): Promise<WxAppModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await wx_appDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找小程序设置
 */
export async function findById(
  id?: WxAppId | null,
): Promise<WxAppModel | undefined> {
  const model = await wx_appDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找小程序设置是否存在
 */
export async function exist(
  search?: WxAppSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await wx_appDao.exist(search);
  return data;
}

/**
 * 根据 id 查找小程序设置是否存在
 */
export async function existById(
  id?: WxAppId | null,
): Promise<boolean> {
  const data = await wx_appDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验小程序设置
 */
export async function validate(
  input: WxAppInput,
): Promise<void> {
  const data = await wx_appDao.validate(input);
  return data;
}

/**
 * 批量创建小程序设置
 */
export async function creates(
  inputs: WxAppInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxAppId[]> {
  const ids = await wx_appDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改小程序设置
 */
export async function updateById(
  id: WxAppId,
  input: WxAppInput,
): Promise<WxAppId> {
  
  const is_locked = await wx_appDao.getIsLockedById(id);
  if (is_locked) {
    throw "不能修改已经锁定的 小程序设置";
  }
  
  const id2 = await wx_appDao.updateById(id, input);
  return id2;
}

/** 校验小程序设置是否存在 */
export async function validateOption(
  model0?: WxAppModel,
): Promise<WxAppModel> {
  const model = await wx_appDao.validateOption(model0);
  return model;
}

/**
 * 根据 ids 删除小程序设置
 */
export async function deleteByIds(
  ids: WxAppId[],
): Promise<number> {
  
  {
    const models = await wx_appDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {
        throw "不能删除已经锁定的 小程序设置";
      }
    }
  }
  
  const data = await wx_appDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用小程序设置
 */
export async function enableByIds(
  ids: WxAppId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await wx_appDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁小程序设置
 */
export async function lockByIds(
  ids: WxAppId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await wx_appDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原小程序设置
 */
export async function revertByIds(
  ids: WxAppId[],
): Promise<number> {
  const data = await wx_appDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除小程序设置
 */
export async function forceDeleteByIds(
  ids: WxAppId[],
): Promise<number> {
  const data = await wx_appDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取小程序设置字段注释
 */
export async function getFieldComments(): Promise<WxAppFieldComment> {
  const data = await wx_appDao.getFieldComments();
  return data;
}

/**
 * 查找 小程序设置 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await wx_appDao.findLastOrderBy();
  return data;
}
