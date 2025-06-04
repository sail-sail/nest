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
  checkSortWxwAppToken,
} from "./wxw_app_token.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./wxw_app_token.model.ts";

/**
 * 根据条件查找企微应用接口凭据总数
 */
export async function findCountWxwAppToken(
  search?: WxwAppTokenSearch,
): Promise<number> {
  
  const {
    findCountWxwAppToken,
  } = await import("./wxw_app_token.service.ts");
  
  const num = await findCountWxwAppToken(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找企微应用接口凭据列表
 */
export async function findAllWxwAppToken(
  search?: WxwAppTokenSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxwAppTokenModel[]> {
  
  const {
    findAllWxwAppToken,
  } = await import("./wxw_app_token.service.ts");
  
  checkSortWxwAppToken(sort);
  
  const models = await findAllWxwAppToken(search, page, sort);
  
  return models;
}

/**
 * 获取企微应用接口凭据字段注释
 */
export async function getFieldCommentsWxwAppToken(): Promise<WxwAppTokenFieldComment> {
  
  const {
    getFieldCommentsWxwAppToken,
  } = await import("./wxw_app_token.service.ts");
  
  const field_comment = await getFieldCommentsWxwAppToken();
  
  return field_comment;
}

/**
 * 根据条件查找第一个企微应用接口凭据
 */
export async function findOneWxwAppToken(
  search?: WxwAppTokenSearch,
  sort?: SortInput[],
): Promise<WxwAppTokenModel | undefined> {
  
  const {
    findOneWxwAppToken,
  } = await import("./wxw_app_token.service.ts");
  
  checkSortWxwAppToken(sort);
  
  const model = await findOneWxwAppToken(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个企微应用接口凭据, 如果不存在则抛错
 */
export async function findOneOkWxwAppToken(
  search?: WxwAppTokenSearch,
  sort?: SortInput[],
): Promise<WxwAppTokenModel> {
  
  const {
    findOneOkWxwAppToken,
  } = await import("./wxw_app_token.service.ts");
  
  checkSortWxwAppToken(sort);
  
  const model = await findOneOkWxwAppToken(search, sort);
  
  return model;
}

/**
 * 根据 id 查找企微应用接口凭据
 */
export async function findByIdWxwAppToken(
  id: WxwAppTokenId,
): Promise<WxwAppTokenModel | undefined> {
  
  const {
    findByIdWxwAppToken,
  } = await import("./wxw_app_token.service.ts");
  
  const model = await findByIdWxwAppToken(id);
  
  return model;
}

/**
 * 根据 id 查找企微应用接口凭据, 如果不存在则抛错
 */
export async function findByIdOkWxwAppToken(
  id: WxwAppTokenId,
): Promise<WxwAppTokenModel | undefined> {
  
  const {
    findByIdOkWxwAppToken,
  } = await import("./wxw_app_token.service.ts");
  
  const model = await findByIdOkWxwAppToken(id);
  
  return model;
}

/**
 * 根据 ids 查找企微应用接口凭据
 */
export async function findByIdsWxwAppToken(
  ids: WxwAppTokenId[],
): Promise<WxwAppTokenModel[]> {
  
  const {
    findByIdsWxwAppToken,
  } = await import("./wxw_app_token.service.ts");
  
  const models = await findByIdsWxwAppToken(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 根据 ids 查找企微应用接口凭据, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxwAppToken(
  ids: WxwAppTokenId[],
): Promise<WxwAppTokenModel[]> {
  
  const {
    findByIdsOkWxwAppToken,
  } = await import("./wxw_app_token.service.ts");
  
  const models = await findByIdsOkWxwAppToken(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建企微应用接口凭据
 */
export async function createsWxwAppToken(
  inputs: WxwAppTokenInput[],
  unique_type?: UniqueType,
): Promise<WxwAppTokenId[]> {
  
  const {
    validateWxwAppToken,
    setIdByLblWxwAppToken,
    createsWxwAppToken,
  } = await import("./wxw_app_token.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLblWxwAppToken(input);
    
    await validateWxwAppToken(input);
  }
  const uniqueType = unique_type;
  const ids = await createsWxwAppToken(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改企微应用接口凭据
 */
export async function updateByIdWxwAppToken(
  id: WxwAppTokenId,
  input: WxwAppTokenInput,
): Promise<WxwAppTokenId> {
  
  input.id = undefined;
  
  const {
    setIdByLblWxwAppToken,
    updateByIdWxwAppToken,
  } = await import("./wxw_app_token.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblWxwAppToken(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: WxwAppTokenId = await updateByIdWxwAppToken(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除企微应用接口凭据
 */
export async function deleteByIdsWxwAppToken(
  ids: WxwAppTokenId[],
): Promise<number> {
  
  const {
    deleteByIdsWxwAppToken,
  } = await import("./wxw_app_token.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsWxwAppToken(ids);
  
  return num;
}

/**
 * 根据 ids 还原企微应用接口凭据
 */
export async function revertByIdsWxwAppToken(
  ids: WxwAppTokenId[],
): Promise<number> {
  
  const {
    revertByIdsWxwAppToken,
  } = await import("./wxw_app_token.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsWxwAppToken(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除企微应用接口凭据
 */
export async function forceDeleteByIdsWxwAppToken(
  ids: WxwAppTokenId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsWxwAppToken,
  } = await import("./wxw_app_token.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsWxwAppToken(ids);
  
  return res;
}
