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
  checkSortDynPage,
  intoInputDynPage,
} from "./dyn_page.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./dyn_page.model.ts";

/**
 * 根据条件查找动态页面总数
 */
export async function findCountDynPage(
  search?: DynPageSearch,
): Promise<number> {
  
  const {
    findCountDynPage,
  } = await import("./dyn_page.service.ts");
  
  const num = await findCountDynPage(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找动态页面列表
 */
export async function findAllDynPage(
  search?: DynPageSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DynPageModel[]> {
  
  const {
    findAllDynPage,
  } = await import("./dyn_page.service.ts");
  
  checkSortDynPage(sort);
  
  const models = await findAllDynPage(search, page, sort);
  
  return models;
}

/**
 * 获取动态页面字段注释
 */
export async function getFieldCommentsDynPage(): Promise<DynPageFieldComment> {
  
  const {
    getFieldCommentsDynPage,
  } = await import("./dyn_page.service.ts");
  
  const field_comment = await getFieldCommentsDynPage();
  
  return field_comment;
}

/**
 * 根据条件查找第一个动态页面
 */
export async function findOneDynPage(
  search?: DynPageSearch,
  sort?: SortInput[],
): Promise<DynPageModel | undefined> {
  
  const {
    findOneDynPage,
  } = await import("./dyn_page.service.ts");
  
  checkSortDynPage(sort);
  
  const model = await findOneDynPage(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个动态页面, 如果不存在则抛错
 */
export async function findOneOkDynPage(
  search?: DynPageSearch,
  sort?: SortInput[],
): Promise<DynPageModel> {
  
  const {
    findOneOkDynPage,
  } = await import("./dyn_page.service.ts");
  
  checkSortDynPage(sort);
  
  const model = await findOneOkDynPage(search, sort);
  
  return model;
}

/**
 * 根据 id 查找动态页面
 */
export async function findByIdDynPage(
  id: DynPageId,
): Promise<DynPageModel | undefined> {
  
  const {
    findByIdDynPage,
  } = await import("./dyn_page.service.ts");
  
  const model = await findByIdDynPage(id);
  
  return model;
}

/**
 * 根据 id 查找动态页面, 如果不存在则抛错
 */
export async function findByIdOkDynPage(
  id: DynPageId,
): Promise<DynPageModel | undefined> {
  
  const {
    findByIdOkDynPage,
  } = await import("./dyn_page.service.ts");
  
  const model = await findByIdOkDynPage(id);
  
  return model;
}

/**
 * 根据 ids 查找动态页面
 */
export async function findByIdsDynPage(
  ids: DynPageId[],
): Promise<DynPageModel[]> {
  
  const {
    findByIdsDynPage,
  } = await import("./dyn_page.service.ts");
  
  const models = await findByIdsDynPage(ids);
  
  return models;
}

/**
 * 根据 ids 查找动态页面, 出现查询不到的 id 则报错
 */
export async function findByIdsOkDynPage(
  ids: DynPageId[],
): Promise<DynPageModel[]> {
  
  const {
    findByIdsOkDynPage,
  } = await import("./dyn_page.service.ts");
  
  const models = await findByIdsOkDynPage(ids);
  
  return models;
}

/**
 * 批量创建动态页面
 */
export async function createsDynPage(
  inputs: DynPageInput[],
  unique_type?: UniqueType,
): Promise<DynPageId[]> {
  
  const {
    validateDynPage,
    setIdByLblDynPage,
    createsDynPage,
  } = await import("./dyn_page.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    
    intoInputDynPage(input);
    
    await setIdByLblDynPage(input);
    
    await validateDynPage(input);
    
  }
  const uniqueType = unique_type;
  const ids = await createsDynPage(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改动态页面
 */
export async function updateByIdDynPage(
  id: DynPageId,
  input: DynPageInput,
): Promise<DynPageId> {
  
  intoInputDynPage(input);
  
  const {
    setIdByLblDynPage,
    updateByIdDynPage,
  } = await import("./dyn_page.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblDynPage(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: DynPageId = await updateByIdDynPage(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除动态页面
 */
export async function deleteByIdsDynPage(
  ids: DynPageId[],
): Promise<number> {
  
  const {
    deleteByIdsDynPage,
  } = await import("./dyn_page.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsDynPage(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用动态页面
 */
export async function enableByIdsDynPage(
  ids: DynPageId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIdsDynPage,
  } = await import("./dyn_page.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsDynPage.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  const res = await enableByIdsDynPage(ids, is_enabled);
  
  return res;
}

/**
 * 根据 ids 还原动态页面
 */
export async function revertByIdsDynPage(
  ids: DynPageId[],
): Promise<number> {
  
  const {
    revertByIdsDynPage,
  } = await import("./dyn_page.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsDynPage(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除动态页面
 */
export async function forceDeleteByIdsDynPage(
  ids: DynPageId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsDynPage,
  } = await import("./dyn_page.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsDynPage(ids);
  
  return res;
}

/**
 * 查找 动态页面 order_by 字段的最大值
 */
export async function findLastOrderByDynPage(): Promise<number> {
  
  const {
    findLastOrderByDynPage,
  } = await import("./dyn_page.service.ts");
  
  const res = findLastOrderByDynPage();
  
  return res;
}
