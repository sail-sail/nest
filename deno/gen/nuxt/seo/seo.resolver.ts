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
  checkSortSeo,
} from "./seo.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./seo.model.ts";

/**
 * 根据条件查找SEO优化总数
 */
export async function findCountSeo(
  search?: SeoSearch,
): Promise<number> {
  
  const {
    findCountSeo,
  } = await import("./seo.service.ts");
  
  const num = await findCountSeo(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找SEO优化列表
 */
export async function findAllSeo(
  search?: SeoSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<SeoModel[]> {
  
  const {
    findAllSeo,
  } = await import("./seo.service.ts");
  
  checkSortSeo(sort);
  
  const models = await findAllSeo(search, page, sort);
  
  return models;
}

/**
 * 获取SEO优化字段注释
 */
export async function getFieldCommentsSeo(): Promise<SeoFieldComment> {
  
  const {
    getFieldCommentsSeo,
  } = await import("./seo.service.ts");
  
  const field_comment = await getFieldCommentsSeo();
  
  return field_comment;
}

/**
 * 根据条件查找第一个SEO优化
 */
export async function findOneSeo(
  search?: SeoSearch,
  sort?: SortInput[],
): Promise<SeoModel | undefined> {
  
  const {
    findOneSeo,
  } = await import("./seo.service.ts");
  
  checkSortSeo(sort);
  
  const model = await findOneSeo(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个SEO优化, 如果不存在则抛错
 */
export async function findOneOkSeo(
  search?: SeoSearch,
  sort?: SortInput[],
): Promise<SeoModel> {
  
  const {
    findOneOkSeo,
  } = await import("./seo.service.ts");
  
  checkSortSeo(sort);
  
  const model = await findOneOkSeo(search, sort);
  
  return model;
}

/**
 * 根据 id 查找SEO优化
 */
export async function findByIdSeo(
  id: SeoId,
): Promise<SeoModel | undefined> {
  
  const {
    findByIdSeo,
  } = await import("./seo.service.ts");
  
  const model = await findByIdSeo(id);
  
  return model;
}

/**
 * 根据 id 查找SEO优化, 如果不存在则抛错
 */
export async function findByIdOkSeo(
  id: SeoId,
): Promise<SeoModel | undefined> {
  
  const {
    findByIdOkSeo,
  } = await import("./seo.service.ts");
  
  const model = await findByIdOkSeo(id);
  
  return model;
}

/**
 * 根据 ids 查找SEO优化
 */
export async function findByIdsSeo(
  ids: SeoId[],
): Promise<SeoModel[]> {
  
  const {
    findByIdsSeo,
  } = await import("./seo.service.ts");
  
  const models = await findByIdsSeo(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 根据 ids 查找SEO优化, 出现查询不到的 id 则报错
 */
export async function findByIdsOkSeo(
  ids: SeoId[],
): Promise<SeoModel[]> {
  
  const {
    findByIdsOkSeo,
  } = await import("./seo.service.ts");
  
  const models = await findByIdsOkSeo(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建SEO优化
 */
export async function createsSeo(
  inputs: SeoInput[],
  unique_type?: UniqueType,
): Promise<SeoId[]> {
  
  const {
    validateSeo,
    setIdByLblSeo,
    createsSeo,
  } = await import("./seo.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLblSeo(input);
    
    await validateSeo(input);
  }
  const uniqueType = unique_type;
  const ids = await createsSeo(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改SEO优化
 */
export async function updateByIdSeo(
  id: SeoId,
  input: SeoInput,
): Promise<SeoId> {
  
  input.id = undefined;
  
  const {
    setIdByLblSeo,
    updateByIdSeo,
  } = await import("./seo.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblSeo(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: SeoId = await updateByIdSeo(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除SEO优化
 */
export async function deleteByIdsSeo(
  ids: SeoId[],
): Promise<number> {
  
  const {
    deleteByIdsSeo,
  } = await import("./seo.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsSeo(ids);
  
  return num;
}

/**
 * 根据 id 设置默认SEO优化
 */
export async function defaultByIdSeo(
  id: SeoId,
): Promise<number> {
  
  const {
    defaultByIdSeo,
  } = await import("./seo.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const res = await defaultByIdSeo(id);
  return res;
}

/**
 * 根据 ids 锁定或者解锁SEO优化
 */
export async function lockByIdsSeo(
  ids: SeoId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIdsSeo,
  } = await import("./seo.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsSeo.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const res = await lockByIdsSeo(ids, is_locked);
  
  return res;
}

/**
 * 根据 ids 还原SEO优化
 */
export async function revertByIdsSeo(
  ids: SeoId[],
): Promise<number> {
  
  const {
    revertByIdsSeo,
  } = await import("./seo.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsSeo(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除SEO优化
 */
export async function forceDeleteByIdsSeo(
  ids: SeoId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsSeo,
  } = await import("./seo.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsSeo(ids);
  
  return res;
}

/**
 * 查找 SEO优化 order_by 字段的最大值
 */
export async function findLastOrderBySeo(): Promise<number> {
  
  const {
    findLastOrderBySeo,
  } = await import("./seo.service.ts");
  
  const res = findLastOrderBySeo();
  
  return res;
}
