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
    findCount,
  } = await import("./wxw_app_token.service.ts");
  
  const num = await findCount(search);
  
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
    findAll,
  } = await import("./wxw_app_token.service.ts");
  
  checkSortWxwAppToken(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取企微应用接口凭据字段注释
 */
export async function getFieldCommentsWxwAppToken(): Promise<WxwAppTokenFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./wxw_app_token.service.ts");
  
  const field_comment = await getFieldComments();
  
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
    findOne,
  } = await import("./wxw_app_token.service.ts");
  
  checkSortWxwAppToken(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找企微应用接口凭据
 */
export async function findByIdWxwAppToken(
  id: WxwAppTokenId,
): Promise<WxwAppTokenModel | undefined> {
  
  const {
    findById,
  } = await import("./wxw_app_token.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找企微应用接口凭据
 */
export async function findByIdsWxwAppToken(
  ids: WxwAppTokenId[],
): Promise<WxwAppTokenModel[]> {
  
  const {
    findByIds,
  } = await import("./wxw_app_token.service.ts");
  
  const models = await findByIds(ids);
  
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
    validate,
    setIdByLbl,
    creates,
  } = await import("./wxw_app_token.service.ts");
  
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
 * 根据 id 修改企微应用接口凭据
 */
export async function updateByIdWxwAppToken(
  id: WxwAppTokenId,
  input: WxwAppTokenInput,
): Promise<WxwAppTokenId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./wxw_app_token.service.ts");
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: WxwAppTokenId = await updateById(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除企微应用接口凭据
 */
export async function deleteByIdsWxwAppToken(
  ids: WxwAppTokenId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./wxw_app_token.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
}

/**
 * 根据 ids 还原企微应用接口凭据
 */
export async function revertByIdsWxwAppToken(
  ids: WxwAppTokenId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./wxw_app_token.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除企微应用接口凭据
 */
export async function forceDeleteByIdsWxwAppToken(
  ids: WxwAppTokenId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./wxw_app_token.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}
