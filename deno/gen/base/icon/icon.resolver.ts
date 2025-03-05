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
} from "./icon.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./icon.model.ts";

/**
 * 根据条件查找图标库总数
 */
export async function findCountIcon(
  search?: IconSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./icon.service.ts");
  
  const num = await findCount(search);
  
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
    findAll,
  } = await import("./icon.service.ts");
  
  checkSortIcon(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取图标库字段注释
 */
export async function getFieldCommentsIcon(): Promise<IconFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./icon.service.ts");
  
  const field_comment = await getFieldComments();
  
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
    findOne,
  } = await import("./icon.service.ts");
  
  checkSortIcon(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找图标库
 */
export async function findByIdIcon(
  id: IconId,
): Promise<IconModel | undefined> {
  
  const {
    findById,
  } = await import("./icon.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 批量创建图标库
 */
export async function createsIcon(
  inputs: IconInput[],
  unique_type?: UniqueType,
): Promise<IconId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./icon.service.ts");
  
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
 * 根据 id 修改图标库
 */
export async function updateByIdIcon(
  id: IconId,
  input: IconInput,
): Promise<IconId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./icon.service.ts");
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: IconId = await updateById(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除图标库
 */
export async function deleteByIdsIcon(
  ids: IconId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./icon.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
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
    enableByIds,
  } = await import("./icon.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsIcon.is_enabled expect 0 or 1 but got ${ is_enabled }`);
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
 * 根据 ids 还原图标库
 */
export async function revertByIdsIcon(
  ids: IconId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./icon.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除图标库
 */
export async function forceDeleteByIdsIcon(
  ids: IconId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./icon.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}

/**
 * 查找 图标库 order_by 字段的最大值
 */
export async function findLastOrderByIcon(): Promise<number> {
  
  const {
    findLastOrderBy,
  } = await import("./icon.service.ts");
  
  const res = findLastOrderBy();
  
  return res;
}
