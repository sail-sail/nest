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
    findCountWxoAppToken,
  } = await import("./wxo_app_token.service.ts");
  
  const num = await findCountWxoAppToken(search);
  
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
    findAllWxoAppToken,
  } = await import("./wxo_app_token.service.ts");
  
  checkSortWxoAppToken(sort);
  
  const models = await findAllWxoAppToken(search, page, sort);
  
  return models;
}

/**
 * 获取小程序接口凭据字段注释
 */
export async function getFieldCommentsWxoAppToken(): Promise<WxoAppTokenFieldComment> {
  
  const {
    getFieldCommentsWxoAppToken,
  } = await import("./wxo_app_token.service.ts");
  
  const field_comment = await getFieldCommentsWxoAppToken();
  
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
    findOneWxoAppToken,
  } = await import("./wxo_app_token.service.ts");
  
  checkSortWxoAppToken(sort);
  
  const model = await findOneWxoAppToken(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个小程序接口凭据, 如果不存在则抛错
 */
export async function findOneOkWxoAppToken(
  search?: WxoAppTokenSearch,
  sort?: SortInput[],
): Promise<WxoAppTokenModel> {
  
  const {
    findOneOkWxoAppToken,
  } = await import("./wxo_app_token.service.ts");
  
  checkSortWxoAppToken(sort);
  
  const model = await findOneOkWxoAppToken(search, sort);
  
  return model;
}

/**
 * 根据 id 查找小程序接口凭据
 */
export async function findByIdWxoAppToken(
  id: WxoAppTokenId,
): Promise<WxoAppTokenModel | undefined> {
  
  const {
    findByIdWxoAppToken,
  } = await import("./wxo_app_token.service.ts");
  
  const model = await findByIdWxoAppToken(id);
  
  return model;
}

/**
 * 根据 id 查找小程序接口凭据, 如果不存在则抛错
 */
export async function findByIdOkWxoAppToken(
  id: WxoAppTokenId,
): Promise<WxoAppTokenModel | undefined> {
  
  const {
    findByIdOkWxoAppToken,
  } = await import("./wxo_app_token.service.ts");
  
  const model = await findByIdOkWxoAppToken(id);
  
  return model;
}

/**
 * 根据 ids 查找小程序接口凭据
 */
export async function findByIdsWxoAppToken(
  ids: WxoAppTokenId[],
): Promise<WxoAppTokenModel[]> {
  
  const {
    findByIdsWxoAppToken,
  } = await import("./wxo_app_token.service.ts");
  
  const models = await findByIdsWxoAppToken(ids);
  
  return models;
}

/**
 * 根据 ids 查找小程序接口凭据, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxoAppToken(
  ids: WxoAppTokenId[],
): Promise<WxoAppTokenModel[]> {
  
  const {
    findByIdsOkWxoAppToken,
  } = await import("./wxo_app_token.service.ts");
  
  const models = await findByIdsOkWxoAppToken(ids);
  
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
    validateWxoAppToken,
    setIdByLblWxoAppToken,
    createsWxoAppToken,
  } = await import("./wxo_app_token.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLblWxoAppToken(input);
    
    await validateWxoAppToken(input);
  }
  const uniqueType = unique_type;
  const ids = await createsWxoAppToken(inputs, { uniqueType });
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
    setIdByLblWxoAppToken,
    updateByIdWxoAppToken,
  } = await import("./wxo_app_token.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblWxoAppToken(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: WxoAppTokenId = await updateByIdWxoAppToken(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除小程序接口凭据
 */
export async function deleteByIdsWxoAppToken(
  ids: WxoAppTokenId[],
): Promise<number> {
  
  const {
    deleteByIdsWxoAppToken,
  } = await import("./wxo_app_token.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsWxoAppToken(ids);
  
  return num;
}

/**
 * 根据 ids 还原小程序接口凭据
 */
export async function revertByIdsWxoAppToken(
  ids: WxoAppTokenId[],
): Promise<number> {
  
  const {
    revertByIdsWxoAppToken,
  } = await import("./wxo_app_token.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsWxoAppToken(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除小程序接口凭据
 */
export async function forceDeleteByIdsWxoAppToken(
  ids: WxoAppTokenId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsWxoAppToken,
  } = await import("./wxo_app_token.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsWxoAppToken(ids);
  
  return res;
}
