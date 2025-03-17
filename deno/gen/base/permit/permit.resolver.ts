import {
  set_is_tran,
} from "/lib/context.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortPermit,
} from "./permit.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./permit.model.ts";

/**
 * 根据条件查找按钮权限总数
 */
export async function findCountPermit(
  search?: PermitSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./permit.service.ts");
  
  const num = await findCount(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找按钮权限列表
 */
export async function findAllPermit(
  search?: PermitSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<PermitModel[]> {
  
  const {
    findAll,
  } = await import("./permit.service.ts");
  
  checkSortPermit(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取按钮权限字段注释
 */
export async function getFieldCommentsPermit(): Promise<PermitFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./permit.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
}

/**
 * 根据条件查找第一个按钮权限
 */
export async function findOnePermit(
  search?: PermitSearch,
  sort?: SortInput[],
): Promise<PermitModel | undefined> {
  
  const {
    findOne,
  } = await import("./permit.service.ts");
  
  checkSortPermit(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找按钮权限
 */
export async function findByIdPermit(
  id: PermitId,
): Promise<PermitModel | undefined> {
  
  const {
    findById,
  } = await import("./permit.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找按钮权限
 */
export async function findByIdsPermit(
  ids: PermitId[],
): Promise<PermitModel[]> {
  
  const {
    findByIds,
  } = await import("./permit.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 根据 id 修改按钮权限
 */
export async function updateByIdPermit(
  id: PermitId,
  input: PermitInput,
): Promise<PermitId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./permit.service.ts");
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: PermitId = await updateById(id, input);
  
  return id2;
}

/**
 * 查找 按钮权限 order_by 字段的最大值
 */
export async function findLastOrderByPermit(): Promise<number> {
  
  const {
    findLastOrderBy,
  } = await import("./permit.service.ts");
  
  const res = findLastOrderBy();
  
  return res;
}
