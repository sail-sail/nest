import {
  set_is_tran,
} from "/lib/context.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortPermit,
  intoInputPermit,
} from "./permit.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找按钮权限总数
 */
export async function findCountPermit(
  search?: PermitSearch,
): Promise<number> {
  
  const {
    findCountPermit,
  } = await import("./permit.service.ts");
  
  const num = await findCountPermit(search);
  
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
    findAllPermit,
  } = await import("./permit.service.ts");
  
  checkSortPermit(sort);
  
  const models = await findAllPermit(search, page, sort);
  
  return models;
}

/**
 * 获取按钮权限字段注释
 */
export async function getFieldCommentsPermit(): Promise<PermitFieldComment> {
  
  const {
    getFieldCommentsPermit,
  } = await import("./permit.service.ts");
  
  const field_comment = await getFieldCommentsPermit();
  
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
    findOnePermit,
  } = await import("./permit.service.ts");
  
  checkSortPermit(sort);
  
  const model = await findOnePermit(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个按钮权限, 如果不存在则抛错
 */
export async function findOneOkPermit(
  search?: PermitSearch,
  sort?: SortInput[],
): Promise<PermitModel> {
  
  const {
    findOneOkPermit,
  } = await import("./permit.service.ts");
  
  checkSortPermit(sort);
  
  const model = await findOneOkPermit(search, sort);
  
  return model;
}

/**
 * 根据 id 查找按钮权限
 */
export async function findByIdPermit(
  id: PermitId,
): Promise<PermitModel | undefined> {
  
  const {
    findByIdPermit,
  } = await import("./permit.service.ts");
  
  const model = await findByIdPermit(id);
  
  return model;
}

/**
 * 根据 id 查找按钮权限, 如果不存在则抛错
 */
export async function findByIdOkPermit(
  id: PermitId,
): Promise<PermitModel | undefined> {
  
  const {
    findByIdOkPermit,
  } = await import("./permit.service.ts");
  
  const model = await findByIdOkPermit(id);
  
  return model;
}

/**
 * 根据 ids 查找按钮权限
 */
export async function findByIdsPermit(
  ids: PermitId[],
): Promise<PermitModel[]> {
  
  const {
    findByIdsPermit,
  } = await import("./permit.service.ts");
  
  const models = await findByIdsPermit(ids);
  
  return models;
}

/**
 * 根据 ids 查找按钮权限, 出现查询不到的 id 则报错
 */
export async function findByIdsOkPermit(
  ids: PermitId[],
): Promise<PermitModel[]> {
  
  const {
    findByIdsOkPermit,
  } = await import("./permit.service.ts");
  
  const models = await findByIdsOkPermit(ids);
  
  return models;
}

/**
 * 根据 id 修改按钮权限
 */
export async function updateByIdPermit(
  id: PermitId,
  input: PermitInput,
): Promise<PermitId> {
  
  intoInputPermit(input);
  
  const {
    setIdByLblPermit,
    updateByIdPermit,
  } = await import("./permit.service.ts");
  
  const {
    getPagePathPermit,
  } = await import("./permit.model.ts");
  
  set_is_tran(true);
  
  await setIdByLblPermit(input);
  
  await usePermit(
    getPagePathPermit(),
    "edit",
  );
  
  const id2: PermitId = await updateByIdPermit(id, input);
  
  return id2;
}

/**
 * 查找 按钮权限 order_by 字段的最大值
 */
export async function findLastOrderByPermit(): Promise<number> {
  
  const {
    findLastOrderByPermit,
  } = await import("./permit.service.ts");
  
  const res = findLastOrderByPermit();
  
  return res;
}
