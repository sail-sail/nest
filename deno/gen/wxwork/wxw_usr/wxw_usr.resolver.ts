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
  checkSortWxwUsr,
} from "./wxw_usr.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./wxw_usr.model.ts";

/**
 * 根据条件查找企微用户总数
 */
export async function findCountWxwUsr(
  search?: WxwUsrSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./wxw_usr.service.ts");
  
  const num = await findCount(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找企微用户列表
 */
export async function findAllWxwUsr(
  search?: WxwUsrSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxwUsrModel[]> {
  
  const {
    findAll,
  } = await import("./wxw_usr.service.ts");
  
  checkSortWxwUsr(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取企微用户字段注释
 */
export async function getFieldCommentsWxwUsr(): Promise<WxwUsrFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./wxw_usr.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
}

/**
 * 根据条件查找第一个企微用户
 */
export async function findOneWxwUsr(
  search?: WxwUsrSearch,
  sort?: SortInput[],
): Promise<WxwUsrModel | undefined> {
  
  const {
    findOne,
  } = await import("./wxw_usr.service.ts");
  
  checkSortWxwUsr(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找企微用户
 */
export async function findByIdWxwUsr(
  id: WxwUsrId,
): Promise<WxwUsrModel | undefined> {
  
  const {
    findById,
  } = await import("./wxw_usr.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找企微用户
 */
export async function findByIdsWxwUsr(
  ids: WxwUsrId[],
): Promise<WxwUsrModel[]> {
  
  const {
    findByIds,
  } = await import("./wxw_usr.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建企微用户
 */
export async function createsWxwUsr(
  inputs: WxwUsrInput[],
  unique_type?: UniqueType,
): Promise<WxwUsrId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./wxw_usr.service.ts");
  
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
 * 根据 id 修改企微用户
 */
export async function updateByIdWxwUsr(
  id: WxwUsrId,
  input: WxwUsrInput,
): Promise<WxwUsrId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./wxw_usr.service.ts");
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: WxwUsrId = await updateById(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除企微用户
 */
export async function deleteByIdsWxwUsr(
  ids: WxwUsrId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./wxw_usr.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
}

/**
 * 根据 ids 还原企微用户
 */
export async function revertByIdsWxwUsr(
  ids: WxwUsrId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./wxw_usr.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除企微用户
 */
export async function forceDeleteByIdsWxwUsr(
  ids: WxwUsrId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./wxw_usr.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}
