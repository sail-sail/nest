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
    findCountBaiduApp,
  } = await import("./baidu_app.service.ts");
  
  const num = await findCountBaiduApp(search);
  
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
    findAllBaiduApp,
  } = await import("./baidu_app.service.ts");
  
  checkSortBaiduApp(sort);
  
  const models = await findAllBaiduApp(search, page, sort);
  
  return models;
}

/**
 * 获取百度应用字段注释
 */
export async function getFieldCommentsBaiduApp(): Promise<BaiduAppFieldComment> {
  
  const {
    getFieldCommentsBaiduApp,
  } = await import("./baidu_app.service.ts");
  
  const field_comment = await getFieldCommentsBaiduApp();
  
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
    findOneBaiduApp,
  } = await import("./baidu_app.service.ts");
  
  checkSortBaiduApp(sort);
  
  const model = await findOneBaiduApp(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个百度应用, 如果不存在则抛错
 */
export async function findOneOkBaiduApp(
  search?: BaiduAppSearch,
  sort?: SortInput[],
): Promise<BaiduAppModel> {
  
  const {
    findOneOkBaiduApp,
  } = await import("./baidu_app.service.ts");
  
  checkSortBaiduApp(sort);
  
  const model = await findOneOkBaiduApp(search, sort);
  
  return model;
}

/**
 * 根据 id 查找百度应用
 */
export async function findByIdBaiduApp(
  id: BaiduAppId,
): Promise<BaiduAppModel | undefined> {
  
  const {
    findByIdBaiduApp,
  } = await import("./baidu_app.service.ts");
  
  const model = await findByIdBaiduApp(id);
  
  return model;
}

/**
 * 根据 id 查找百度应用, 如果不存在则抛错
 */
export async function findByIdOkBaiduApp(
  id: BaiduAppId,
): Promise<BaiduAppModel | undefined> {
  
  const {
    findByIdOkBaiduApp,
  } = await import("./baidu_app.service.ts");
  
  const model = await findByIdOkBaiduApp(id);
  
  return model;
}

/**
 * 根据 ids 查找百度应用
 */
export async function findByIdsBaiduApp(
  ids: BaiduAppId[],
): Promise<BaiduAppModel[]> {
  
  const {
    findByIdsBaiduApp,
  } = await import("./baidu_app.service.ts");
  
  const models = await findByIdsBaiduApp(ids);
  
  return models;
}

/**
 * 根据 ids 查找百度应用, 出现查询不到的 id 则报错
 */
export async function findByIdsOkBaiduApp(
  ids: BaiduAppId[],
): Promise<BaiduAppModel[]> {
  
  const {
    findByIdsOkBaiduApp,
  } = await import("./baidu_app.service.ts");
  
  const models = await findByIdsOkBaiduApp(ids);
  
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
    validateBaiduApp,
    setIdByLblBaiduApp,
    createsBaiduApp,
  } = await import("./baidu_app.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLblBaiduApp(input);
    
    await validateBaiduApp(input);
  }
  const uniqueType = unique_type;
  const ids = await createsBaiduApp(inputs, { uniqueType });
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
    setIdByLblBaiduApp,
    updateByIdBaiduApp,
  } = await import("./baidu_app.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblBaiduApp(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: BaiduAppId = await updateByIdBaiduApp(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除百度应用
 */
export async function deleteByIdsBaiduApp(
  ids: BaiduAppId[],
): Promise<number> {
  
  const {
    deleteByIdsBaiduApp,
  } = await import("./baidu_app.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsBaiduApp(ids);
  
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
    enableByIdsBaiduApp,
  } = await import("./baidu_app.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsBaiduApp.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  const res = await enableByIdsBaiduApp(ids, is_enabled);
  
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
    lockByIdsBaiduApp,
  } = await import("./baidu_app.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsBaiduApp.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const res = await lockByIdsBaiduApp(ids, is_locked);
  
  return res;
}

/**
 * 根据 ids 还原百度应用
 */
export async function revertByIdsBaiduApp(
  ids: BaiduAppId[],
): Promise<number> {
  
  const {
    revertByIdsBaiduApp,
  } = await import("./baidu_app.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsBaiduApp(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除百度应用
 */
export async function forceDeleteByIdsBaiduApp(
  ids: BaiduAppId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsBaiduApp,
  } = await import("./baidu_app.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsBaiduApp(ids);
  
  return res;
}

/**
 * 查找 百度应用 order_by 字段的最大值
 */
export async function findLastOrderByBaiduApp(): Promise<number> {
  
  const {
    findLastOrderByBaiduApp,
  } = await import("./baidu_app.service.ts");
  
  const res = findLastOrderByBaiduApp();
  
  return res;
}
