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
  intoInputWxwUsr,
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
    findCountWxwUsr,
  } = await import("./wxw_usr.service.ts");
  
  const num = await findCountWxwUsr(search);
  
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
    findAllWxwUsr,
  } = await import("./wxw_usr.service.ts");
  
  checkSortWxwUsr(sort);
  
  const models = await findAllWxwUsr(search, page, sort);
  
  return models;
}

/**
 * 获取企微用户字段注释
 */
export async function getFieldCommentsWxwUsr(): Promise<WxwUsrFieldComment> {
  
  const {
    getFieldCommentsWxwUsr,
  } = await import("./wxw_usr.service.ts");
  
  const field_comment = await getFieldCommentsWxwUsr();
  
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
    findOneWxwUsr,
  } = await import("./wxw_usr.service.ts");
  
  checkSortWxwUsr(sort);
  
  const model = await findOneWxwUsr(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个企微用户, 如果不存在则抛错
 */
export async function findOneOkWxwUsr(
  search?: WxwUsrSearch,
  sort?: SortInput[],
): Promise<WxwUsrModel> {
  
  const {
    findOneOkWxwUsr,
  } = await import("./wxw_usr.service.ts");
  
  checkSortWxwUsr(sort);
  
  const model = await findOneOkWxwUsr(search, sort);
  
  return model;
}

/**
 * 根据 id 查找企微用户
 */
export async function findByIdWxwUsr(
  id: WxwUsrId,
): Promise<WxwUsrModel | undefined> {
  
  const {
    findByIdWxwUsr,
  } = await import("./wxw_usr.service.ts");
  
  const model = await findByIdWxwUsr(id);
  
  return model;
}

/**
 * 根据 id 查找企微用户, 如果不存在则抛错
 */
export async function findByIdOkWxwUsr(
  id: WxwUsrId,
): Promise<WxwUsrModel | undefined> {
  
  const {
    findByIdOkWxwUsr,
  } = await import("./wxw_usr.service.ts");
  
  const model = await findByIdOkWxwUsr(id);
  
  return model;
}

/**
 * 根据 ids 查找企微用户
 */
export async function findByIdsWxwUsr(
  ids: WxwUsrId[],
): Promise<WxwUsrModel[]> {
  
  const {
    findByIdsWxwUsr,
  } = await import("./wxw_usr.service.ts");
  
  const models = await findByIdsWxwUsr(ids);
  
  return models;
}

/**
 * 根据 ids 查找企微用户, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxwUsr(
  ids: WxwUsrId[],
): Promise<WxwUsrModel[]> {
  
  const {
    findByIdsOkWxwUsr,
  } = await import("./wxw_usr.service.ts");
  
  const models = await findByIdsOkWxwUsr(ids);
  
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
    validateWxwUsr,
    setIdByLblWxwUsr,
    createsWxwUsr,
  } = await import("./wxw_usr.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    
    intoInputWxwUsr(input);
    
    await setIdByLblWxwUsr(input);
    
    await validateWxwUsr(input);
    
  }
  const uniqueType = unique_type;
  const ids = await createsWxwUsr(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改企微用户
 */
export async function updateByIdWxwUsr(
  id: WxwUsrId,
  input: WxwUsrInput,
): Promise<WxwUsrId> {
  
  intoInputWxwUsr(input);
  
  const {
    setIdByLblWxwUsr,
    updateByIdWxwUsr,
  } = await import("./wxw_usr.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblWxwUsr(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: WxwUsrId = await updateByIdWxwUsr(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除企微用户
 */
export async function deleteByIdsWxwUsr(
  ids: WxwUsrId[],
): Promise<number> {
  
  const {
    deleteByIdsWxwUsr,
  } = await import("./wxw_usr.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsWxwUsr(ids);
  
  return num;
}

/**
 * 根据 ids 还原企微用户
 */
export async function revertByIdsWxwUsr(
  ids: WxwUsrId[],
): Promise<number> {
  
  const {
    revertByIdsWxwUsr,
  } = await import("./wxw_usr.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsWxwUsr(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除企微用户
 */
export async function forceDeleteByIdsWxwUsr(
  ids: WxwUsrId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsWxwUsr,
  } = await import("./wxw_usr.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsWxwUsr(ids);
  
  return res;
}
