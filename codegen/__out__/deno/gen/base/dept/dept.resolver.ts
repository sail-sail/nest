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
  intoInputDept,
} from "./dept.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找部门总数
 */
export async function findCountDept(
  search?: DeptSearch,
): Promise<number> {
  
  const {
    findCountDept,
  } = await import("./dept.service.ts");
  
  const num = await findCountDept(search);
  
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
    findAllDept,
  } = await import("./dept.service.ts");
  
  checkSortDept(sort);
  
  const models = await findAllDept(search, page, sort);
  
  return models;
}

/**
 * 获取部门字段注释
 */
export async function getFieldCommentsDept(): Promise<DeptFieldComment> {
  
  const {
    getFieldCommentsDept,
  } = await import("./dept.service.ts");
  
  const field_comment = await getFieldCommentsDept();
  
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
    findOneDept,
  } = await import("./dept.service.ts");
  
  checkSortDept(sort);
  
  const model = await findOneDept(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个部门, 如果不存在则抛错
 */
export async function findOneOkDept(
  search?: DeptSearch,
  sort?: SortInput[],
): Promise<DeptModel> {
  
  const {
    findOneOkDept,
  } = await import("./dept.service.ts");
  
  checkSortDept(sort);
  
  const model = await findOneOkDept(search, sort);
  
  return model;
}

/**
 * 根据 id 查找部门
 */
export async function findByIdDept(
  id: DeptId,
): Promise<DeptModel | undefined> {
  
  const {
    findByIdDept,
  } = await import("./dept.service.ts");
  
  const model = await findByIdDept(id);
  
  return model;
}

/**
 * 根据 id 查找部门, 如果不存在则抛错
 */
export async function findByIdOkDept(
  id: DeptId,
): Promise<DeptModel | undefined> {
  
  const {
    findByIdOkDept,
  } = await import("./dept.service.ts");
  
  const model = await findByIdOkDept(id);
  
  return model;
}

/**
 * 根据 ids 查找部门
 */
export async function findByIdsDept(
  ids: DeptId[],
): Promise<DeptModel[]> {
  
  const {
    findByIdsDept,
  } = await import("./dept.service.ts");
  
  const models = await findByIdsDept(ids);
  
  return models;
}

/**
 * 根据 ids 查找部门, 出现查询不到的 id 则报错
 */
export async function findByIdsOkDept(
  ids: DeptId[],
): Promise<DeptModel[]> {
  
  const {
    findByIdsOkDept,
  } = await import("./dept.service.ts");
  
  const models = await findByIdsOkDept(ids);
  
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
    validateDept,
    setIdByLblDept,
    createsDept,
  } = await import("./dept.service.ts");
  
  const {
    getPagePathDept,
  } = await import("./dept.model.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    getPagePathDept(),
    "add",
  );
  
  for (const input of inputs) {
    
    intoInputDept(input);
    
    await setIdByLblDept(input);
    
    await validateDept(input);
    
  }
  const uniqueType = unique_type;
  const ids = await createsDept(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改部门
 */
export async function updateByIdDept(
  id: DeptId,
  input: DeptInput,
): Promise<DeptId> {
  
  intoInputDept(input);
  
  const {
    setIdByLblDept,
    updateByIdDept,
  } = await import("./dept.service.ts");
  
  const {
    getPagePathDept,
  } = await import("./dept.model.ts");
  
  set_is_tran(true);
  
  await setIdByLblDept(input);
  
  await usePermit(
    getPagePathDept(),
    "edit",
  );
  
  const id2: DeptId = await updateByIdDept(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除部门
 */
export async function deleteByIdsDept(
  ids: DeptId[],
): Promise<number> {
  
  const {
    deleteByIdsDept,
  } = await import("./dept.service.ts");
  
  const {
    getPagePathDept,
  } = await import("./dept.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathDept(),
    "delete",
  );
  
  const num = await deleteByIdsDept(ids);
  
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
    enableByIdsDept,
  } = await import("./dept.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsDept.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  const {
    getPagePathDept,
  } = await import("./dept.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathDept(),
    "edit",
  );
  const res = await enableByIdsDept(ids, is_enabled);
  
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
    lockByIdsDept,
  } = await import("./dept.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsDept.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  const {
    getPagePathDept,
  } = await import("./dept.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathDept(),
    "edit",
  );
  
  const res = await lockByIdsDept(ids, is_locked);
  
  return res;
}

/**
 * 根据 ids 还原部门
 */
export async function revertByIdsDept(
  ids: DeptId[],
): Promise<number> {
  
  const {
    revertByIdsDept,
  } = await import("./dept.service.ts");
  
  const {
    getPagePathDept,
  } = await import("./dept.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathDept(),
    "delete",
  );
  
  const res = await revertByIdsDept(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除部门
 */
export async function forceDeleteByIdsDept(
  ids: DeptId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsDept,
  } = await import("./dept.service.ts");
  
  const {
    getPagePathDept,
  } = await import("./dept.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathDept(),
    "force_delete",
  );
  
  const res = await forceDeleteByIdsDept(ids);
  
  return res;
}

/**
 * 查找 部门 order_by 字段的最大值
 */
export async function findLastOrderByDept(
  search?: DeptSearch,
): Promise<number> {
  
  const {
    findLastOrderByDept,
  } = await import("./dept.service.ts");
  
  const order_by = findLastOrderByDept(search);
  
  return order_by;
}
