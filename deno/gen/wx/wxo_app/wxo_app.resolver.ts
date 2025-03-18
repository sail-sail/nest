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
  checkSortWxoApp,
} from "./wxo_app.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./wxo_app.model.ts";

/**
 * 根据条件查找公众号设置总数
 */
export async function findCountWxoApp(
  search?: WxoAppSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./wxo_app.service.ts");
  
  const num = await findCount(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找公众号设置列表
 */
export async function findAllWxoApp(
  search?: WxoAppSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxoAppModel[]> {
  
  const {
    findAll,
  } = await import("./wxo_app.service.ts");
  
  checkSortWxoApp(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取公众号设置字段注释
 */
export async function getFieldCommentsWxoApp(): Promise<WxoAppFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./wxo_app.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
}

/**
 * 根据条件查找第一个公众号设置
 */
export async function findOneWxoApp(
  search?: WxoAppSearch,
  sort?: SortInput[],
): Promise<WxoAppModel | undefined> {
  
  const {
    findOne,
  } = await import("./wxo_app.service.ts");
  
  checkSortWxoApp(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找公众号设置
 */
export async function findByIdWxoApp(
  id: WxoAppId,
): Promise<WxoAppModel | undefined> {
  
  const {
    findById,
  } = await import("./wxo_app.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找公众号设置
 */
export async function findByIdsWxoApp(
  ids: WxoAppId[],
): Promise<WxoAppModel[]> {
  
  const {
    findByIds,
  } = await import("./wxo_app.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建公众号设置
 */
export async function createsWxoApp(
  inputs: WxoAppInput[],
  unique_type?: UniqueType,
): Promise<WxoAppId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./wxo_app.service.ts");
  
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
 * 根据 id 修改公众号设置
 */
export async function updateByIdWxoApp(
  id: WxoAppId,
  input: WxoAppInput,
): Promise<WxoAppId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./wxo_app.service.ts");
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: WxoAppId = await updateById(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除公众号设置
 */
export async function deleteByIdsWxoApp(
  ids: WxoAppId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./wxo_app.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用公众号设置
 */
export async function enableByIdsWxoApp(
  ids: WxoAppId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./wxo_app.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsWxoApp.is_enabled expect 0 or 1 but got ${ is_enabled }`);
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
 * 根据 ids 锁定或者解锁公众号设置
 */
export async function lockByIdsWxoApp(
  ids: WxoAppId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./wxo_app.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsWxoApp.is_locked expect 0 or 1 but got ${ is_locked }`);
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
 * 根据 ids 还原公众号设置
 */
export async function revertByIdsWxoApp(
  ids: WxoAppId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./wxo_app.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除公众号设置
 */
export async function forceDeleteByIdsWxoApp(
  ids: WxoAppId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./wxo_app.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}

/**
 * 查找 公众号设置 order_by 字段的最大值
 */
export async function findLastOrderByWxoApp(): Promise<number> {
  
  const {
    findLastOrderBy,
  } = await import("./wxo_app.service.ts");
  
  const res = findLastOrderBy();
  
  return res;
}
