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
  checkSortWxoUsr,
  intoInputWxoUsr,
} from "./wxo_usr.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./wxo_usr.model.ts";

/**
 * 根据条件查找公众号用户总数
 */
export async function findCountWxoUsr(
  search?: WxoUsrSearch,
): Promise<number> {
  
  const {
    findCountWxoUsr,
  } = await import("./wxo_usr.service.ts");
  
  const num = await findCountWxoUsr(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找公众号用户列表
 */
export async function findAllWxoUsr(
  search?: WxoUsrSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxoUsrModel[]> {
  
  const {
    findAllWxoUsr,
  } = await import("./wxo_usr.service.ts");
  
  checkSortWxoUsr(sort);
  
  const models = await findAllWxoUsr(search, page, sort);
  
  return models;
}

/**
 * 获取公众号用户字段注释
 */
export async function getFieldCommentsWxoUsr(): Promise<WxoUsrFieldComment> {
  
  const {
    getFieldCommentsWxoUsr,
  } = await import("./wxo_usr.service.ts");
  
  const field_comment = await getFieldCommentsWxoUsr();
  
  return field_comment;
}

/**
 * 根据条件查找第一个公众号用户
 */
export async function findOneWxoUsr(
  search?: WxoUsrSearch,
  sort?: SortInput[],
): Promise<WxoUsrModel | undefined> {
  
  const {
    findOneWxoUsr,
  } = await import("./wxo_usr.service.ts");
  
  checkSortWxoUsr(sort);
  
  const model = await findOneWxoUsr(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个公众号用户, 如果不存在则抛错
 */
export async function findOneOkWxoUsr(
  search?: WxoUsrSearch,
  sort?: SortInput[],
): Promise<WxoUsrModel> {
  
  const {
    findOneOkWxoUsr,
  } = await import("./wxo_usr.service.ts");
  
  checkSortWxoUsr(sort);
  
  const model = await findOneOkWxoUsr(search, sort);
  
  return model;
}

/**
 * 根据 id 查找公众号用户
 */
export async function findByIdWxoUsr(
  id: WxoUsrId,
): Promise<WxoUsrModel | undefined> {
  
  const {
    findByIdWxoUsr,
  } = await import("./wxo_usr.service.ts");
  
  const model = await findByIdWxoUsr(id);
  
  return model;
}

/**
 * 根据 id 查找公众号用户, 如果不存在则抛错
 */
export async function findByIdOkWxoUsr(
  id: WxoUsrId,
): Promise<WxoUsrModel | undefined> {
  
  const {
    findByIdOkWxoUsr,
  } = await import("./wxo_usr.service.ts");
  
  const model = await findByIdOkWxoUsr(id);
  
  return model;
}

/**
 * 根据 ids 查找公众号用户
 */
export async function findByIdsWxoUsr(
  ids: WxoUsrId[],
): Promise<WxoUsrModel[]> {
  
  const {
    findByIdsWxoUsr,
  } = await import("./wxo_usr.service.ts");
  
  const models = await findByIdsWxoUsr(ids);
  
  return models;
}

/**
 * 根据 ids 查找公众号用户, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxoUsr(
  ids: WxoUsrId[],
): Promise<WxoUsrModel[]> {
  
  const {
    findByIdsOkWxoUsr,
  } = await import("./wxo_usr.service.ts");
  
  const models = await findByIdsOkWxoUsr(ids);
  
  return models;
}

/**
 * 批量创建公众号用户
 */
export async function createsWxoUsr(
  inputs: WxoUsrInput[],
  unique_type?: UniqueType,
): Promise<WxoUsrId[]> {
  
  const {
    validateWxoUsr,
    setIdByLblWxoUsr,
    createsWxoUsr,
  } = await import("./wxo_usr.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    
    intoInputWxoUsr(input);
    
    await setIdByLblWxoUsr(input);
    
    await validateWxoUsr(input);
    
  }
  const uniqueType = unique_type;
  const ids = await createsWxoUsr(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改公众号用户
 */
export async function updateByIdWxoUsr(
  id: WxoUsrId,
  input: WxoUsrInput,
): Promise<WxoUsrId> {
  
  intoInputWxoUsr(input);
  
  const {
    setIdByLblWxoUsr,
    updateByIdWxoUsr,
  } = await import("./wxo_usr.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblWxoUsr(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: WxoUsrId = await updateByIdWxoUsr(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除公众号用户
 */
export async function deleteByIdsWxoUsr(
  ids: WxoUsrId[],
): Promise<number> {
  
  const {
    deleteByIdsWxoUsr,
  } = await import("./wxo_usr.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsWxoUsr(ids);
  
  return num;
}

/**
 * 根据 ids 还原公众号用户
 */
export async function revertByIdsWxoUsr(
  ids: WxoUsrId[],
): Promise<number> {
  
  const {
    revertByIdsWxoUsr,
  } = await import("./wxo_usr.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsWxoUsr(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除公众号用户
 */
export async function forceDeleteByIdsWxoUsr(
  ids: WxoUsrId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsWxoUsr,
  } = await import("./wxo_usr.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsWxoUsr(ids);
  
  return res;
}
