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
  checkSortDept,
} from "./dept.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./dept.model.ts";

/**
 * 根据条件查找部门总数
 */
export async function findCountDept(
  search?: DeptSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./dept.service.ts");
  
  const num = await findCount(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找部门列表
 */
export async function findAllDept(
  search?: DeptSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<DeptModel[]> {
  
  const {
    findAll,
  } = await import("./dept.service.ts");
  
  checkSortDept(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取部门字段注释
 */
export async function getFieldCommentsDept(): Promise<DeptFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./dept.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
}

/**
 * 根据条件查找第一个部门
 */
export async function findOneDept(
  search?: DeptSearch,
  sort?: SortInput[],
): Promise<DeptModel | undefined> {
  
  const {
    findOne,
  } = await import("./dept.service.ts");
  
  checkSortDept(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找部门
 */
export async function findByIdDept(
  id: DeptId,
): Promise<DeptModel | undefined> {
  
  const {
    findById,
  } = await import("./dept.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找部门
 */
export async function findByIdsDept(
  ids: DeptId[],
): Promise<DeptModel[]> {
  
  const {
    findByIds,
  } = await import("./dept.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建部门
 */
export async function createsDept(
  inputs: DeptInput[],
  unique_type?: UniqueType,
): Promise<DeptId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./dept.service.ts");
  
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
 * 根据 id 修改部门
 */
export async function updateByIdDept(
  id: DeptId,
  input: DeptInput,
): Promise<DeptId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./dept.service.ts");
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: DeptId = await updateById(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除部门
 */
export async function deleteByIdsDept(
  ids: DeptId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./dept.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用部门
 */
export async function enableByIdsDept(
  ids: DeptId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./dept.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsDept.is_enabled expect 0 or 1 but got ${ is_enabled }`);
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
 * 根据 ids 锁定或者解锁部门
 */
export async function lockByIdsDept(
  ids: DeptId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./dept.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsDept.is_locked expect 0 or 1 but got ${ is_locked }`);
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
 * 根据 ids 还原部门
 */
export async function revertByIdsDept(
  ids: DeptId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./dept.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除部门
 */
export async function forceDeleteByIdsDept(
  ids: DeptId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./dept.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}

/**
 * 查找 部门 order_by 字段的最大值
 */
export async function findLastOrderByDept(): Promise<number> {
  
  const {
    findLastOrderBy,
  } = await import("./dept.service.ts");
  
  const res = findLastOrderBy();
  
  return res;
}
