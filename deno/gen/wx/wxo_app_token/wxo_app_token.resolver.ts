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
  checkSortWxoAppToken,
} from "./wxo_app_token.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./wxo_app_token.model.ts";

/**
 * 根据条件查找小程序接口凭据总数
 */
export async function findCountWxoAppToken(
  search?: WxoAppTokenSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./wxo_app_token.service.ts");
  
  const num = await findCount(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找小程序接口凭据列表
 */
export async function findAllWxoAppToken(
  search?: WxoAppTokenSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxoAppTokenModel[]> {
  
  const {
    findAll,
  } = await import("./wxo_app_token.service.ts");
  
  checkSortWxoAppToken(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取小程序接口凭据字段注释
 */
export async function getFieldCommentsWxoAppToken(): Promise<WxoAppTokenFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./wxo_app_token.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
}

/**
 * 根据条件查找第一个小程序接口凭据
 */
export async function findOneWxoAppToken(
  search?: WxoAppTokenSearch,
  sort?: SortInput[],
): Promise<WxoAppTokenModel | undefined> {
  
  const {
    findOne,
  } = await import("./wxo_app_token.service.ts");
  
  checkSortWxoAppToken(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找小程序接口凭据
 */
export async function findByIdWxoAppToken(
  id: WxoAppTokenId,
): Promise<WxoAppTokenModel | undefined> {
  
  const {
    findById,
  } = await import("./wxo_app_token.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找小程序接口凭据
 */
export async function findByIdsWxoAppToken(
  ids: WxoAppTokenId[],
): Promise<WxoAppTokenModel[]> {
  
  const {
    findByIds,
  } = await import("./wxo_app_token.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建小程序接口凭据
 */
export async function createsWxoAppToken(
  inputs: WxoAppTokenInput[],
  unique_type?: UniqueType,
): Promise<WxoAppTokenId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./wxo_app_token.service.ts");
  
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
 * 根据 id 修改小程序接口凭据
 */
export async function updateByIdWxoAppToken(
  id: WxoAppTokenId,
  input: WxoAppTokenInput,
): Promise<WxoAppTokenId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./wxo_app_token.service.ts");
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: WxoAppTokenId = await updateById(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除小程序接口凭据
 */
export async function deleteByIdsWxoAppToken(
  ids: WxoAppTokenId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./wxo_app_token.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
}

/**
 * 根据 ids 还原小程序接口凭据
 */
export async function revertByIdsWxoAppToken(
  ids: WxoAppTokenId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./wxo_app_token.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除小程序接口凭据
 */
export async function forceDeleteByIdsWxoAppToken(
  ids: WxoAppTokenId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./wxo_app_token.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}
