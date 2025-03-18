import {
  set_is_tran,
  set_is_creating,
} from "/lib/context.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortBaiduApp,
} from "./baidu_app.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./baidu_app.model.ts";

/**
 * 根据条件查找百度应用总数
 */
export async function findCountBaiduApp(
  search?: BaiduAppSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./baidu_app.service.ts");
  
  const num = await findCount(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找百度应用列表
 */
export async function findAllBaiduApp(
  search?: BaiduAppSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<BaiduAppModel[]> {
  
  const {
    findAll,
  } = await import("./baidu_app.service.ts");
  
  checkSortBaiduApp(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取百度应用字段注释
 */
export async function getFieldCommentsBaiduApp(): Promise<BaiduAppFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./baidu_app.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
}

/**
 * 根据条件查找第一个百度应用
 */
export async function findOneBaiduApp(
  search?: BaiduAppSearch,
  sort?: SortInput[],
): Promise<BaiduAppModel | undefined> {
  
  const {
    findOne,
  } = await import("./baidu_app.service.ts");
  
  checkSortBaiduApp(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找百度应用
 */
export async function findByIdBaiduApp(
  id: BaiduAppId,
): Promise<BaiduAppModel | undefined> {
  
  const {
    findById,
  } = await import("./baidu_app.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找百度应用
 */
export async function findByIdsBaiduApp(
  ids: BaiduAppId[],
): Promise<BaiduAppModel[]> {
  
  const {
    findByIds,
  } = await import("./baidu_app.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建百度应用
 */
export async function createsBaiduApp(
  inputs: BaiduAppInput[],
  unique_type?: UniqueType,
): Promise<BaiduAppId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./baidu_app.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLbl(input);
    
    await validate(input);
  }
  const uniqueType = unique_type;
  const ids = await creates(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改百度应用
 */
export async function updateByIdBaiduApp(
  id: BaiduAppId,
  input: BaiduAppInput,
): Promise<BaiduAppId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./baidu_app.service.ts");
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: BaiduAppId = await updateById(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除百度应用
 */
export async function deleteByIdsBaiduApp(
  ids: BaiduAppId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./baidu_app.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用百度应用
 */
export async function enableByIdsBaiduApp(
  ids: BaiduAppId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./baidu_app.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsBaiduApp.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  const res = await enableByIds(ids, is_enabled);
  
  return res;
}

/**
 * 根据 ids 锁定或者解锁百度应用
 */
export async function lockByIdsBaiduApp(
  ids: BaiduAppId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./baidu_app.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsBaiduApp.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const res = await lockByIds(ids, is_locked);
  
  return res;
}

/**
 * 根据 ids 还原百度应用
 */
export async function revertByIdsBaiduApp(
  ids: BaiduAppId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./baidu_app.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除百度应用
 */
export async function forceDeleteByIdsBaiduApp(
  ids: BaiduAppId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./baidu_app.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}

/**
 * 查找 百度应用 order_by 字段的最大值
 */
export async function findLastOrderByBaiduApp(): Promise<number> {
  
  const {
    findLastOrderBy,
  } = await import("./baidu_app.service.ts");
  
  const res = findLastOrderBy();
  
  return res;
}
