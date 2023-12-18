import {
  useContext,
} from "/lib/context.ts";

import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  WxAppTokenInput,
  WxAppTokenModel,
  WxAppTokenSearch,
  WxAppTokenFieldComment,
  WxAppTokenId,
} from "./wx_app_token.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找小程序接口凭据总数
 */
export async function findCountWxAppToken(
  search?: WxAppTokenSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  
  const {
    findCount,
  } = await import("./wx_app_token.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找小程序接口凭据列表
 */
export async function findAllWxAppToken(
  search?: WxAppTokenSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxAppTokenModel[]> {
  
  const {
    findAll,
  } = await import("./wx_app_token.service.ts");
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取小程序接口凭据字段注释
 */
export async function getFieldCommentsWxAppToken(): Promise<WxAppTokenFieldComment> {
  const { getFieldComments } = await import("./wx_app_token.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一个小程序接口凭据
 */
export async function findOneWxAppToken(
  search?: WxAppTokenSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
): Promise<WxAppTokenModel | undefined> {
  
  const {
    findOne,
  } = await import("./wx_app_token.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找小程序接口凭据
 */
export async function findByIdWxAppToken(
  id: WxAppTokenId,
): Promise<WxAppTokenModel | undefined> {
  const { findById } = await import("./wx_app_token.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建小程序接口凭据
 */
export async function createWxAppToken(
  input: WxAppTokenInput,
  unique_type?: UniqueType,
): Promise<WxAppTokenId> {
  
  const {
    validate,
    setIdByLbl,
    create,
  } = await import("./wx_app_token.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await validate(input);
  
  await usePermit(
    "/wx/wx_app_token",
    "add",
  );
  const uniqueType = unique_type;
  const id: WxAppTokenId = await create(input, { uniqueType });
  return id;
}

/**
 * 根据 id 修改小程序接口凭据
 */
export async function updateByIdWxAppToken(
  id: WxAppTokenId,
  input: WxAppTokenInput,
): Promise<WxAppTokenId> {
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./wx_app_token.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/wx/wx_app_token",
    "edit",
  );
  const id2: WxAppTokenId = await updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除小程序接口凭据
 */
export async function deleteByIdsWxAppToken(
  ids: WxAppTokenId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./wx_app_token.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wx/wx_app_token",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 还原小程序接口凭据
 */
export async function revertByIdsWxAppToken(
  ids: WxAppTokenId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./wx_app_token.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wx/wx_app_token",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除小程序接口凭据
 */
export async function forceDeleteByIdsWxAppToken(
  ids: WxAppTokenId[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wx/wx_app_token",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./wx_app_token.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}
