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
  checkSortIcon,
  intoInputIcon,
} from "./icon.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找图标库总数
 */
export async function findCountIcon(
  search?: IconSearch,
): Promise<number> {
  
  const {
    findCountIcon,
  } = await import("./icon.service.ts");
  
  const num = await findCountIcon(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找图标库列表
 */
export async function findAllIcon(
  search?: IconSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<IconModel[]> {
  
  const {
    findAllIcon,
  } = await import("./icon.service.ts");
  
  checkSortIcon(sort);
  
  const models = await findAllIcon(search, page, sort);
  
  return models;
}

/**
 * 获取图标库字段注释
 */
export async function getFieldCommentsIcon(): Promise<IconFieldComment> {
  
  const {
    getFieldCommentsIcon,
  } = await import("./icon.service.ts");
  
  const field_comment = await getFieldCommentsIcon();
  
  return field_comment;
}

/**
 * 根据条件查找第一个图标库
 */
export async function findOneIcon(
  search?: IconSearch,
  sort?: SortInput[],
): Promise<IconModel | undefined> {
  
  const {
    findOneIcon,
  } = await import("./icon.service.ts");
  
  checkSortIcon(sort);
  
  const model = await findOneIcon(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个图标库, 如果不存在则抛错
 */
export async function findOneOkIcon(
  search?: IconSearch,
  sort?: SortInput[],
): Promise<IconModel> {
  
  const {
    findOneOkIcon,
  } = await import("./icon.service.ts");
  
  checkSortIcon(sort);
  
  const model = await findOneOkIcon(search, sort);
  
  return model;
}

/**
 * 根据 id 查找图标库
 */
export async function findByIdIcon(
  id: IconId,
): Promise<IconModel | undefined> {
  
  const {
    findByIdIcon,
  } = await import("./icon.service.ts");
  
  const model = await findByIdIcon(id);
  
  return model;
}

/**
 * 根据 id 查找图标库, 如果不存在则抛错
 */
export async function findByIdOkIcon(
  id: IconId,
): Promise<IconModel | undefined> {
  
  const {
    findByIdOkIcon,
  } = await import("./icon.service.ts");
  
  const model = await findByIdOkIcon(id);
  
  return model;
}

/**
 * 根据 ids 查找图标库
 */
export async function findByIdsIcon(
  ids: IconId[],
): Promise<IconModel[]> {
  
  const {
    findByIdsIcon,
  } = await import("./icon.service.ts");
  
  const models = await findByIdsIcon(ids);
  
  return models;
}

/**
 * 根据 ids 查找图标库, 出现查询不到的 id 则报错
 */
export async function findByIdsOkIcon(
  ids: IconId[],
): Promise<IconModel[]> {
  
  const {
    findByIdsOkIcon,
  } = await import("./icon.service.ts");
  
  const models = await findByIdsOkIcon(ids);
  
  return models;
}

/**
 * 批量创建图标库
 */
export async function createsIcon(
  inputs: IconInput[],
  unique_type?: UniqueType,
): Promise<IconId[]> {
  
  const {
    validateIcon,
    setIdByLblIcon,
    createsIcon,
  } = await import("./icon.service.ts");
  
  const {
    getPagePathIcon,
  } = await import("./icon.model.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    getPagePathIcon(),
    "add",
  );
  
  for (const input of inputs) {
    
    intoInputIcon(input);
    
    await setIdByLblIcon(input);
    
    await validateIcon(input);
    
  }
  const uniqueType = unique_type;
  const ids = await createsIcon(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改图标库
 */
export async function updateByIdIcon(
  id: IconId,
  input: IconInput,
): Promise<IconId> {
  
  intoInputIcon(input);
  
  const {
    setIdByLblIcon,
    updateByIdIcon,
  } = await import("./icon.service.ts");
  
  const {
    getPagePathIcon,
  } = await import("./icon.model.ts");
  
  set_is_tran(true);
  
  await setIdByLblIcon(input);
  
  await usePermit(
    getPagePathIcon(),
    "edit",
  );
  
  const id2: IconId = await updateByIdIcon(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除图标库
 */
export async function deleteByIdsIcon(
  ids: IconId[],
): Promise<number> {
  
  const {
    deleteByIdsIcon,
  } = await import("./icon.service.ts");
  
  const {
    getPagePathIcon,
  } = await import("./icon.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathIcon(),
    "delete",
  );
  
  const num = await deleteByIdsIcon(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用图标库
 */
export async function enableByIdsIcon(
  ids: IconId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIdsIcon,
  } = await import("./icon.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsIcon.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  const {
    getPagePathIcon,
  } = await import("./icon.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathIcon(),
    "edit",
  );
  const res = await enableByIdsIcon(ids, is_enabled);
  
  return res;
}

/**
 * 根据 ids 还原图标库
 */
export async function revertByIdsIcon(
  ids: IconId[],
): Promise<number> {
  
  const {
    revertByIdsIcon,
  } = await import("./icon.service.ts");
  
  const {
    getPagePathIcon,
  } = await import("./icon.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathIcon(),
    "delete",
  );
  
  const res = await revertByIdsIcon(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除图标库
 */
export async function forceDeleteByIdsIcon(
  ids: IconId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsIcon,
  } = await import("./icon.service.ts");
  
  const {
    getPagePathIcon,
  } = await import("./icon.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathIcon(),
    "force_delete",
  );
  
  const res = await forceDeleteByIdsIcon(ids);
  
  return res;
}

/**
 * 查找 图标库 order_by 字段的最大值
 */
export async function findLastOrderByIcon(
  search?: IconSearch,
): Promise<number> {
  
  const {
    findLastOrderByIcon,
  } = await import("./icon.service.ts");
  
  const order_by = findLastOrderByIcon(search);
  
  return order_by;
}
