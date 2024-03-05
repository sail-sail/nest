import {
  useContext,
} from "/lib/context.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  WxoAppTokenInput,
  WxoAppTokenModel,
  WxoAppTokenSearch,
  WxoAppTokenFieldComment,
  WxoAppTokenId,
} from "./wxo_app_token.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找小程序接口凭据总数
 */
export async function findCountWxoAppToken(
  search?: WxoAppTokenSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./wxo_app_token.service.ts");
  
  const res = await findCount(search);
  return res;
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
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取小程序接口凭据字段注释
 */
export async function getFieldCommentsWxoAppToken(): Promise<WxoAppTokenFieldComment> {
  const { getFieldComments } = await import("./wxo_app_token.service.ts");
  const res = await getFieldComments();
  return res;
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
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找小程序接口凭据
 */
export async function findByIdWxoAppToken(
  id: WxoAppTokenId,
): Promise<WxoAppTokenModel | undefined> {
  const { findById } = await import("./wxo_app_token.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建小程序接口凭据
 */
export async function createWxoAppToken(
  input: WxoAppTokenInput,
  unique_type?: UniqueType,
): Promise<WxoAppTokenId> {
  
  const {
    validate,
    setIdByLbl,
    create,
  } = await import("./wxo_app_token.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await validate(input);
  
  await usePermit(
    "/wx/wxo_app_token",
    "add",
  );
  const uniqueType = unique_type;
  const id: WxoAppTokenId = await create(input, { uniqueType });
  return id;
}

/**
 * 根据 id 修改小程序接口凭据
 */
export async function updateByIdWxoAppToken(
  id: WxoAppTokenId,
  input: WxoAppTokenInput,
): Promise<WxoAppTokenId> {
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./wxo_app_token.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/wx/wxo_app_token",
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
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wx/wxo_app_token",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
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
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wx/wxo_app_token",
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
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wx/wxo_app_token",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./wxo_app_token.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}
