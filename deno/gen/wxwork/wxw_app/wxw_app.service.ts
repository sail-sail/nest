import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as wxw_appDao from "./wxw_app.dao.ts";

async function setSearchQuery(
  _search: WxwAppSearch,
) {
  
}

/**
 * 根据条件查找企微应用总数
 */
export async function findCount(
  search?: WxwAppSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await wxw_appDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找企微应用列表
 */
export async function findAll(
  search?: WxwAppSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxwAppModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: WxwAppModel[] = await wxw_appDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: WxwAppInput,
) {
  const data = await wxw_appDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个企微应用
 */
export async function findOne(
  search?: WxwAppSearch,
  sort?: SortInput[],
): Promise<WxwAppModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await wxw_appDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找企微应用
 */
export async function findById(
  id?: WxwAppId | null,
): Promise<WxwAppModel | undefined> {
  const model = await wxw_appDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找企微应用是否存在
 */
export async function exist(
  search?: WxwAppSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await wxw_appDao.exist(search);
  return data;
}

/**
 * 根据 id 查找企微应用是否存在
 */
export async function existById(
  id?: WxwAppId | null,
): Promise<boolean> {
  const data = await wxw_appDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验企微应用
 */
export async function validate(
  input: WxwAppInput,
): Promise<void> {
  const data = await wxw_appDao.validate(input);
  return data;
}

/**
 * 批量创建企微应用
 */
export async function creates(
  inputs: WxwAppInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxwAppId[]> {
  const ids = await wxw_appDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改企微应用
 */
export async function updateById(
  id: WxwAppId,
  input: WxwAppInput,
): Promise<WxwAppId> {
  
  const is_locked = await wxw_appDao.getIsLockedById(id);
  if (is_locked) {
    throw "不能修改已经锁定的 企微应用";
  }
  
  const id2 = await wxw_appDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除企微应用
 */
export async function deleteByIds(
  ids: WxwAppId[],
): Promise<number> {
  
  {
    const models = await wxw_appDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {
        throw "不能删除已经锁定的 企微应用";
      }
    }
  }
  
  const data = await wxw_appDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用企微应用
 */
export async function enableByIds(
  ids: WxwAppId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await wxw_appDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁企微应用
 */
export async function lockByIds(
  ids: WxwAppId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await wxw_appDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原企微应用
 */
export async function revertByIds(
  ids: WxwAppId[],
): Promise<number> {
  const data = await wxw_appDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除企微应用
 */
export async function forceDeleteByIds(
  ids: WxwAppId[],
): Promise<number> {
  const data = await wxw_appDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取企微应用字段注释
 */
export async function getFieldComments(): Promise<WxwAppFieldComment> {
  const data = await wxw_appDao.getFieldComments();
  return data;
}

/**
 * 查找 企微应用 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await wxw_appDao.findLastOrderBy();
  return data;
}
