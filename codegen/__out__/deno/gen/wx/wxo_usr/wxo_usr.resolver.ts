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
    findCount,
  } = await import("./wxo_usr.service.ts");
  
  const num = await findCount(search);
  
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
    findAll,
  } = await import("./wxo_usr.service.ts");
  
  checkSortWxoUsr(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取公众号用户字段注释
 */
export async function getFieldCommentsWxoUsr(): Promise<WxoUsrFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./wxo_usr.service.ts");
  
  const field_comment = await getFieldComments();
  
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
    findOne,
  } = await import("./wxo_usr.service.ts");
  
  checkSortWxoUsr(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找公众号用户
 */
export async function findByIdWxoUsr(
  id: WxoUsrId,
): Promise<WxoUsrModel | undefined> {
  
  const {
    findById,
  } = await import("./wxo_usr.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找公众号用户
 */
export async function findByIdsWxoUsr(
  ids: WxoUsrId[],
): Promise<WxoUsrModel[]> {
  
  const {
    findByIds,
  } = await import("./wxo_usr.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
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
    validate,
    setIdByLbl,
    creates,
  } = await import("./wxo_usr.service.ts");
  
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
 * 根据 id 修改公众号用户
 */
export async function updateByIdWxoUsr(
  id: WxoUsrId,
  input: WxoUsrInput,
): Promise<WxoUsrId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./wxo_usr.service.ts");
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: WxoUsrId = await updateById(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除公众号用户
 */
export async function deleteByIdsWxoUsr(
  ids: WxoUsrId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./wxo_usr.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
}

/**
 * 根据 ids 还原公众号用户
 */
export async function revertByIdsWxoUsr(
  ids: WxoUsrId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./wxo_usr.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除公众号用户
 */
export async function forceDeleteByIdsWxoUsr(
  ids: WxoUsrId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./wxo_usr.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}
