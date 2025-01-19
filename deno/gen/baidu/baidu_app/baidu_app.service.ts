import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import * as baidu_appDao from "./baidu_app.dao.ts";

async function setSearchQuery(
  _search: BaiduAppSearch,
) {
  
}

/**
 * 根据条件查找百度应用总数
 */
export async function findCount(
  search?: BaiduAppSearch,
): Promise<number> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await baidu_appDao.findCount(search);
  return data;
}

/**
 * 根据搜索条件和分页查找百度应用列表
 */
export async function findAll(
  search?: BaiduAppSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<BaiduAppModel[]> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const models: BaiduAppModel[] = await baidu_appDao.findAll(search, page, sort);
  return models;
}

/**
 * 根据 lbl 翻译业务字典, 外键关联 id, 日期
 */
export async function setIdByLbl(
  input: BaiduAppInput,
) {
  const data = await baidu_appDao.setIdByLbl(input);
  return data;
}

/**
 * 根据条件查找第一个百度应用
 */
export async function findOne(
  search?: BaiduAppSearch,
  sort?: SortInput[],
): Promise<BaiduAppModel | undefined> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const model = await baidu_appDao.findOne(search, sort);
  return model;
}

/**
 * 根据 id 查找百度应用
 */
export async function findById(
  id?: BaiduAppId | null,
): Promise<BaiduAppModel | undefined> {
  const model = await baidu_appDao.findById(id);
  return model;
}

/**
 * 根据搜索条件查找百度应用是否存在
 */
export async function exist(
  search?: BaiduAppSearch,
): Promise<boolean> {
  
  search = search || { };
  
  await setSearchQuery(search);
  
  const data = await baidu_appDao.exist(search);
  return data;
}

/**
 * 根据 id 查找百度应用是否存在
 */
export async function existById(
  id?: BaiduAppId | null,
): Promise<boolean> {
  const data = await baidu_appDao.existById(id);
  return data;
}

/**
 * 增加和修改时校验百度应用
 */
export async function validate(
  input: BaiduAppInput,
): Promise<void> {
  const data = await baidu_appDao.validate(input);
  return data;
}

/**
 * 批量创建百度应用
 */
export async function creates(
  inputs: BaiduAppInput[],
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<BaiduAppId[]> {
  const ids = await baidu_appDao.creates(inputs, options);
  return ids;
}

/**
 * 根据 id 修改百度应用
 */
export async function updateById(
  id: BaiduAppId,
  input: BaiduAppInput,
): Promise<BaiduAppId> {
  
  const is_locked = await baidu_appDao.getIsLockedById(id);
  if (is_locked) {
    throw "不能修改已经锁定的 百度应用";
  }
  
  const id2 = await baidu_appDao.updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除百度应用
 */
export async function deleteByIds(
  ids: BaiduAppId[],
): Promise<number> {
  
  {
    const models = await baidu_appDao.findAll({
      ids,
    });
    for (const model of models) {
      if (model.is_locked === 1) {
        throw "不能删除已经锁定的 百度应用";
      }
    }
  }
  
  const data = await baidu_appDao.deleteByIds(ids);
  return data;
}

/**
 * 根据 ids 启用或者禁用百度应用
 */
export async function enableByIds(
  ids: BaiduAppId[],
  is_enabled: 0 | 1,
): Promise<number> {
  const data = await baidu_appDao.enableByIds(ids, is_enabled);
  return data;
}

/**
 * 根据 ids 锁定或者解锁百度应用
 */
export async function lockByIds(
  ids: BaiduAppId[],
  is_locked: 0 | 1,
): Promise<number> {
  const data = await baidu_appDao.lockByIds(ids, is_locked);
  return data;
}

/**
 * 根据 ids 还原百度应用
 */
export async function revertByIds(
  ids: BaiduAppId[],
): Promise<number> {
  const data = await baidu_appDao.revertByIds(ids);
  return data;
}

/**
 * 根据 ids 彻底删除百度应用
 */
export async function forceDeleteByIds(
  ids: BaiduAppId[],
): Promise<number> {
  const data = await baidu_appDao.forceDeleteByIds(ids);
  return data;
}

/**
 * 获取百度应用字段注释
 */
export async function getFieldComments(): Promise<BaiduAppFieldComment> {
  const data = await baidu_appDao.getFieldComments();
  return data;
}

/**
 * 查找 百度应用 order_by 字段的最大值
 */
export async function findLastOrderBy(
): Promise<number> {
  const data = await baidu_appDao.findLastOrderBy();
  return data;
}
