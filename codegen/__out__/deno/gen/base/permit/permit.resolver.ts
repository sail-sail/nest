import {
  useContext,
} from "/lib/context.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

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
    findCount,
  } = await import("./permit.service.ts");
  
  const res = await findCount(search);
  return res;
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
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取按钮权限字段注释
 */
export async function getFieldCommentsPermit(): Promise<PermitFieldComment> {
  const { getFieldComments } = await import("./permit.service.ts");
  const res = await getFieldComments();
  return res;
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
  
  const res = await findOne(search, sort);
  return res;
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
  
  const res = await findById(id);
  
  return res;
}

/**
 * 批量创建按钮权限
 */
export async function createsPermit(
  inputs: PermitInput[],
  unique_type?: UniqueType,
): Promise<PermitId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./permit.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/permit",
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    input.create_usr_id = undefined;
    input.create_usr_id_lbl = undefined;
    
    input.create_time = undefined;
    input.create_time_lbl = undefined;
    input.create_time_save_null = false;
    
    input.update_usr_id = undefined;
    input.update_usr_id_lbl = undefined;
    
    input.update_time = undefined;
    input.update_time_lbl = undefined;
    input.update_time_save_null = undefined;
    
    await setIdByLbl(input);
    
    await validate(input);
  }
  const uniqueType = unique_type;
  const ids = await creates(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改按钮权限
 */
export async function updateByIdPermit(
  id: PermitId,
  input: PermitInput,
): Promise<PermitId> {
  
  input.id = undefined;
  
  input.create_usr_id = undefined;
  input.create_usr_id_lbl = undefined;
  
  input.create_time = undefined;
  input.create_time_lbl = undefined;
  input.create_time_save_null = false;
  
  input.update_usr_id = undefined;
  input.update_usr_id_lbl = undefined;
  
  input.update_time = undefined;
  input.update_time_lbl = undefined;
  input.update_time_save_null = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./permit.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/base/permit",
    "edit",
  );
  const id2: PermitId = await updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除按钮权限
 */
export async function deleteByIdsPermit(
  ids: PermitId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./permit.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/permit",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 还原按钮权限
 */
export async function revertByIdsPermit(
  ids: PermitId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./permit.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/permit",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除按钮权限
 */
export async function forceDeleteByIdsPermit(
  ids: PermitId[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/base/permit",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./permit.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}
