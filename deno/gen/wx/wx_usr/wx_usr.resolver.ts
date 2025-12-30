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
  intoInputWxUsr,
} from "./wx_usr.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找小程序用户总数
 */
export async function findCountWxUsr(
  search?: WxUsrSearch,
): Promise<number> {
  
  const {
    findCountWxUsr,
  } = await import("./wx_usr.service.ts");
  
  const num = await findCountWxUsr(search);
  
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
    findAllWxUsr,
  } = await import("./wx_usr.service.ts");
  
  checkSortWxUsr(sort);
  
  const models = await findAllWxUsr(search, page, sort);
  
  return models;
}

/**
 * 获取小程序用户字段注释
 */
export async function getFieldCommentsWxUsr(): Promise<WxUsrFieldComment> {
  
  const {
    getFieldCommentsWxUsr,
  } = await import("./wx_usr.service.ts");
  
  const field_comment = await getFieldCommentsWxUsr();
  
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
    findOneWxUsr,
  } = await import("./wx_usr.service.ts");
  
  checkSortWxUsr(sort);
  
  const model = await findOneWxUsr(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个小程序用户, 如果不存在则抛错
 */
export async function findOneOkWxUsr(
  search?: WxUsrSearch,
  sort?: SortInput[],
): Promise<WxUsrModel> {
  
  const {
    findOneOkWxUsr,
  } = await import("./wx_usr.service.ts");
  
  checkSortWxUsr(sort);
  
  const model = await findOneOkWxUsr(search, sort);
  
  return model;
}

/**
 * 根据 id 查找小程序用户
 */
export async function findByIdWxUsr(
  id: WxUsrId,
): Promise<WxUsrModel | undefined> {
  
  const {
    findByIdWxUsr,
  } = await import("./wx_usr.service.ts");
  
  const model = await findByIdWxUsr(id);
  
  return model;
}

/**
 * 根据 id 查找小程序用户, 如果不存在则抛错
 */
export async function findByIdOkWxUsr(
  id: WxUsrId,
): Promise<WxUsrModel | undefined> {
  
  const {
    findByIdOkWxUsr,
  } = await import("./wx_usr.service.ts");
  
  const model = await findByIdOkWxUsr(id);
  
  return model;
}

/**
 * 根据 ids 查找小程序用户
 */
export async function findByIdsWxUsr(
  ids: WxUsrId[],
): Promise<WxUsrModel[]> {
  
  const {
    findByIdsWxUsr,
  } = await import("./wx_usr.service.ts");
  
  const models = await findByIdsWxUsr(ids);
  
  return models;
}

/**
 * 根据 ids 查找小程序用户, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxUsr(
  ids: WxUsrId[],
): Promise<WxUsrModel[]> {
  
  const {
    findByIdsOkWxUsr,
  } = await import("./wx_usr.service.ts");
  
  const models = await findByIdsOkWxUsr(ids);
  
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
    validateWxUsr,
    setIdByLblWxUsr,
    createsWxUsr,
  } = await import("./wx_usr.service.ts");
  
  const {
    getPagePathWxUsr,
  } = await import("./wx_usr.model.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    getPagePathWxUsr(),
    "add",
  );
  
  for (const input of inputs) {
    
    intoInputWxUsr(input);
    
    await setIdByLblWxUsr(input);
    
    await validateWxUsr(input);
    
  }
  const uniqueType = unique_type;
  const ids = await createsWxUsr(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改小程序用户
 */
export async function updateByIdWxUsr(
  id: WxUsrId,
  input: WxUsrInput,
): Promise<WxUsrId> {
  
  intoInputWxUsr(input);
  
  const {
    setIdByLblWxUsr,
    updateByIdWxUsr,
  } = await import("./wx_usr.service.ts");
  
  const {
    getPagePathWxUsr,
  } = await import("./wx_usr.model.ts");
  
  set_is_tran(true);
  
  await setIdByLblWxUsr(input);
  
  await usePermit(
    getPagePathWxUsr(),
    "edit",
  );
  
  const id2: WxUsrId = await updateByIdWxUsr(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除小程序用户
 */
export async function deleteByIdsWxUsr(
  ids: WxUsrId[],
): Promise<number> {
  
  const {
    deleteByIdsWxUsr,
  } = await import("./wx_usr.service.ts");
  
  const {
    getPagePathWxUsr,
  } = await import("./wx_usr.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathWxUsr(),
    "delete",
  );
  
  const num = await deleteByIdsWxUsr(ids);
  
  return num;
}

/**
 * 根据 ids 还原小程序用户
 */
export async function revertByIdsWxUsr(
  ids: WxUsrId[],
): Promise<number> {
  
  const {
    revertByIdsWxUsr,
  } = await import("./wx_usr.service.ts");
  
  const {
    getPagePathWxUsr,
  } = await import("./wx_usr.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathWxUsr(),
    "delete",
  );
  
  const res = await revertByIdsWxUsr(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除小程序用户
 */
export async function forceDeleteByIdsWxUsr(
  ids: WxUsrId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsWxUsr,
  } = await import("./wx_usr.service.ts");
  
  const {
    getPagePathWxUsr,
  } = await import("./wx_usr.model.ts");
  
  set_is_tran(true);
  
  await usePermit(
    getPagePathWxUsr(),
    "force_delete",
  );
  
  const res = await forceDeleteByIdsWxUsr(ids);
  
  return res;
}
