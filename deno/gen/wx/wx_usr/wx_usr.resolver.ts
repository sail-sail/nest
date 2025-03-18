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
  checkSortWxUsr,
} from "./wx_usr.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./wx_usr.model.ts";

/**
 * 根据条件查找小程序用户总数
 */
export async function findCountWxUsr(
  search?: WxUsrSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./wx_usr.service.ts");
  
  const num = await findCount(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找小程序用户列表
 */
export async function findAllWxUsr(
  search?: WxUsrSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxUsrModel[]> {
  
  const {
    findAll,
  } = await import("./wx_usr.service.ts");
  
  checkSortWxUsr(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取小程序用户字段注释
 */
export async function getFieldCommentsWxUsr(): Promise<WxUsrFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./wx_usr.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
}

/**
 * 根据条件查找第一个小程序用户
 */
export async function findOneWxUsr(
  search?: WxUsrSearch,
  sort?: SortInput[],
): Promise<WxUsrModel | undefined> {
  
  const {
    findOne,
  } = await import("./wx_usr.service.ts");
  
  checkSortWxUsr(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找小程序用户
 */
export async function findByIdWxUsr(
  id: WxUsrId,
): Promise<WxUsrModel | undefined> {
  
  const {
    findById,
  } = await import("./wx_usr.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找小程序用户
 */
export async function findByIdsWxUsr(
  ids: WxUsrId[],
): Promise<WxUsrModel[]> {
  
  const {
    findByIds,
  } = await import("./wx_usr.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建小程序用户
 */
export async function createsWxUsr(
  inputs: WxUsrInput[],
  unique_type?: UniqueType,
): Promise<WxUsrId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./wx_usr.service.ts");
  
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
 * 根据 id 修改小程序用户
 */
export async function updateByIdWxUsr(
  id: WxUsrId,
  input: WxUsrInput,
): Promise<WxUsrId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./wx_usr.service.ts");
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: WxUsrId = await updateById(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除小程序用户
 */
export async function deleteByIdsWxUsr(
  ids: WxUsrId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./wx_usr.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
}

/**
 * 根据 ids 还原小程序用户
 */
export async function revertByIdsWxUsr(
  ids: WxUsrId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./wx_usr.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除小程序用户
 */
export async function forceDeleteByIdsWxUsr(
  ids: WxUsrId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./wx_usr.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}
