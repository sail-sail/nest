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
  checkSortDynPageData,
  intoInputDynPageData,
} from "./dyn_page_data.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找动态页面数据总数
 */
export async function findCountDynPageData(
  search?: DynPageDataSearch,
): Promise<number> {
  
  const {
    findCountDynPageData,
  } = await import("./dyn_page_data.service.ts");
  
  const num = await findCountDynPageData(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找动态页面数据列表
 */
export async function findAllDynPageData(
  search?: DynPageDataSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DynPageDataModel[]> {
  
  const {
    findAllDynPageData,
  } = await import("./dyn_page_data.service.ts");
  
  checkSortDynPageData(sort);
  
  const models = await findAllDynPageData(search, page, sort);
  
  return models;
}

/**
 * 获取动态页面数据字段注释
 */
export async function getFieldCommentsDynPageData(
  ref_code?: string | null,
): Promise<DynPageDataFieldComment> {
  
  const {
    getFieldCommentsDynPageData,
  } = await import("./dyn_page_data.service.ts");
  
  const field_comment = await getFieldCommentsDynPageData(ref_code);
  
  return field_comment;
}

/**
 * 根据条件查找第一个动态页面数据
 */
export async function findOneDynPageData(
  search?: DynPageDataSearch,
  sort?: SortInput[],
): Promise<DynPageDataModel | undefined> {
  
  const {
    findOneDynPageData,
  } = await import("./dyn_page_data.service.ts");
  
  checkSortDynPageData(sort);
  
  const model = await findOneDynPageData(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个动态页面数据, 如果不存在则抛错
 */
export async function findOneOkDynPageData(
  search?: DynPageDataSearch,
  sort?: SortInput[],
): Promise<DynPageDataModel> {
  
  const {
    findOneOkDynPageData,
  } = await import("./dyn_page_data.service.ts");
  
  checkSortDynPageData(sort);
  
  const model = await findOneOkDynPageData(search, sort);
  
  return model;
}

/**
 * 根据 id 查找动态页面数据
 */
export async function findByIdDynPageData(
  id: DynPageDataId,
): Promise<DynPageDataModel | undefined> {
  
  const {
    findByIdDynPageData,
  } = await import("./dyn_page_data.service.ts");
  
  const model = await findByIdDynPageData(id);
  
  return model;
}

/**
 * 根据 id 查找动态页面数据, 如果不存在则抛错
 */
export async function findByIdOkDynPageData(
  id: DynPageDataId,
): Promise<DynPageDataModel | undefined> {
  
  const {
    findByIdOkDynPageData,
  } = await import("./dyn_page_data.service.ts");
  
  const model = await findByIdOkDynPageData(id);
  
  return model;
}

/**
 * 根据 ids 查找动态页面数据
 */
export async function findByIdsDynPageData(
  ids: DynPageDataId[],
): Promise<DynPageDataModel[]> {
  
  const {
    findByIdsDynPageData,
  } = await import("./dyn_page_data.service.ts");
  
  const models = await findByIdsDynPageData(ids);
  
  return models;
}

/**
 * 根据 ids 查找动态页面数据, 出现查询不到的 id 则报错
 */
export async function findByIdsOkDynPageData(
  ids: DynPageDataId[],
): Promise<DynPageDataModel[]> {
  
  const {
    findByIdsOkDynPageData,
  } = await import("./dyn_page_data.service.ts");
  
  const models = await findByIdsOkDynPageData(ids);
  
  return models;
}

/**
 * 批量创建动态页面数据
 */
export async function createsDynPageData(
  inputs: DynPageDataInput[],
  unique_type?: UniqueType,
): Promise<DynPageDataId[]> {
  
  const {
    validateDynPageData,
    setIdByLblDynPageData,
    createsDynPageData,
  } = await import("./dyn_page_data.service.ts");
  
  const {
    getPagePathDynPageData,
  } = await import("./dyn_page_data.model.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    getPagePathDynPageData(),
    "add",
  );
  
  for (const input of inputs) {
    
    intoInputDynPageData(input);
    
    await setIdByLblDynPageData(input);
    
    await validateDynPageData(input);
    
  }
  const uniqueType = unique_type;
  const ids = await createsDynPageData(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改动态页面数据
 */
export async function updateByIdDynPageData(
  id: DynPageDataId,
  input: DynPageDataInput,
): Promise<DynPageDataId> {
  
  intoInputDynPageData(input);
  
  const {
    setIdByLblDynPageData,
    updateByIdDynPageData,
  } = await import("./dyn_page_data.service.ts");
  
  const {
    getPagePathDynPageData,
  } = await import("./dyn_page_data.model.ts");
  
  set_is_tran(true);
  
  await setIdByLblDynPageData(input);
  
  await usePermit(
    getPagePathDynPageData(),
    "edit",
  );
  
  const id2: DynPageDataId = await updateByIdDynPageData(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除动态页面数据
 */
export async function deleteByIdsDynPageData(
  ids: DynPageDataId[],
): Promise<number> {
  
  const {
    deleteByIdsDynPageData,
  } = await import("./dyn_page_data.service.ts");
  
  const {
    getPagePathDynPageData,
  } = await import("./dyn_page_data.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathDynPageData(),
    "delete",
  );
  
  const num = await deleteByIdsDynPageData(ids);
  
  return num;
}

/**
 * 根据 ids 还原动态页面数据
 */
export async function revertByIdsDynPageData(
  ids: DynPageDataId[],
): Promise<number> {
  
  const {
    revertByIdsDynPageData,
  } = await import("./dyn_page_data.service.ts");
  
  const {
    getPagePathDynPageData,
  } = await import("./dyn_page_data.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathDynPageData(),
    "delete",
  );
  
  const res = await revertByIdsDynPageData(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除动态页面数据
 */
export async function forceDeleteByIdsDynPageData(
  ids: DynPageDataId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsDynPageData,
  } = await import("./dyn_page_data.service.ts");
  
  const {
    getPagePathDynPageData,
  } = await import("./dyn_page_data.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathDynPageData(),
    "force_delete",
  );
  
  const res = await forceDeleteByIdsDynPageData(ids);
  
  return res;
}
