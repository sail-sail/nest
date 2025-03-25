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
  checkSortWxAppToken,
} from "./wx_app_token.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./wx_app_token.model.ts";

/**
 * 根据条件查找小程序接口凭据总数
 */
export async function findCountWxAppToken(
  search?: WxAppTokenSearch,
): Promise<number> {
  
  const {
    findCountWxAppToken,
  } = await import("./wx_app_token.service.ts");
  
  const num = await findCountWxAppToken(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找小程序接口凭据列表
 */
export async function findAllWxAppToken(
  search?: WxAppTokenSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxAppTokenModel[]> {
  
  const {
    findAllWxAppToken,
  } = await import("./wx_app_token.service.ts");
  
  checkSortWxAppToken(sort);
  
  const models = await findAllWxAppToken(search, page, sort);
  
  return models;
}

/**
 * 获取小程序接口凭据字段注释
 */
export async function getFieldCommentsWxAppToken(): Promise<WxAppTokenFieldComment> {
  
  const {
    getFieldCommentsWxAppToken,
  } = await import("./wx_app_token.service.ts");
  
  const field_comment = await getFieldCommentsWxAppToken();
  
  return field_comment;
}

/**
 * 根据条件查找第一个小程序接口凭据
 */
export async function findOneWxAppToken(
  search?: WxAppTokenSearch,
  sort?: SortInput[],
): Promise<WxAppTokenModel | undefined> {
  
  const {
    findOneWxAppToken,
  } = await import("./wx_app_token.service.ts");
  
  checkSortWxAppToken(sort);
  
  const model = await findOneWxAppToken(search, sort);
  
  return model;
}

/**
 * 根据 id 查找小程序接口凭据
 */
export async function findByIdWxAppToken(
  id: WxAppTokenId,
): Promise<WxAppTokenModel | undefined> {
  
  const {
    findByIdWxAppToken,
  } = await import("./wx_app_token.service.ts");
  
  const model = await findByIdWxAppToken(id);
  
  return model;
}

/**
 * 根据 ids 查找小程序接口凭据
 */
export async function findByIdsWxAppToken(
  ids: WxAppTokenId[],
): Promise<WxAppTokenModel[]> {
  
  const {
    findByIdsWxAppToken,
  } = await import("./wx_app_token.service.ts");
  
  const models = await findByIdsWxAppToken(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建小程序接口凭据
 */
export async function createsWxAppToken(
  inputs: WxAppTokenInput[],
  unique_type?: UniqueType,
): Promise<WxAppTokenId[]> {
  
  const {
    validateWxAppToken,
    setIdByLblWxAppToken,
    createsWxAppToken,
  } = await import("./wx_app_token.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLblWxAppToken(input);
    
    await validateWxAppToken(input);
  }
  const uniqueType = unique_type;
  const ids = await createsWxAppToken(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改小程序接口凭据
 */
export async function updateByIdWxAppToken(
  id: WxAppTokenId,
  input: WxAppTokenInput,
): Promise<WxAppTokenId> {
  
  input.id = undefined;
  
  const {
    setIdByLblWxAppToken,
    updateByIdWxAppToken,
  } = await import("./wx_app_token.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblWxAppToken(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: WxAppTokenId = await updateByIdWxAppToken(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除小程序接口凭据
 */
export async function deleteByIdsWxAppToken(
  ids: WxAppTokenId[],
): Promise<number> {
  
  const {
    deleteByIdsWxAppToken,
  } = await import("./wx_app_token.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsWxAppToken(ids);
  
  return num;
}

/**
 * 根据 ids 还原小程序接口凭据
 */
export async function revertByIdsWxAppToken(
  ids: WxAppTokenId[],
): Promise<number> {
  
  const {
    revertByIdsWxAppToken,
  } = await import("./wx_app_token.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsWxAppToken(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除小程序接口凭据
 */
export async function forceDeleteByIdsWxAppToken(
  ids: WxAppTokenId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsWxAppToken,
  } = await import("./wx_app_token.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsWxAppToken(ids);
  
  return res;
}
