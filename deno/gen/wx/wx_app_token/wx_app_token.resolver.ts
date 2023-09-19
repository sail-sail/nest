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
} from "./wx_app_token.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountWxAppToken(
  search?: WxAppTokenSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  const { findCount } = await import("./wx_app_token.service.ts");
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllWxAppToken(
  search?: WxAppTokenSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxAppTokenModel[]> {
  const { findAll } = await import("./wx_app_token.service.ts");
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsWxAppToken(): Promise<WxAppTokenFieldComment> {
  const { getFieldComments } = await import("./wx_app_token.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneWxAppToken(
  search?: WxAppTokenSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
): Promise<WxAppTokenModel | undefined> {
  const { findOne } = await import("./wx_app_token.service.ts");
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdWxAppToken(
  id: string,
): Promise<WxAppTokenModel | undefined> {
  const { findById } = await import("./wx_app_token.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建一条数据
 */
export async function createWxAppToken(
  input: WxAppTokenInput,
  unique_type?: UniqueType,
): Promise<string> {
  
  const {
    validate,
    create,
  } = await import("./wx_app_token.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await validate(input);
  
  await usePermit(
    "/wx/wx_app_token",
    "add",
  );
  const uniqueType = unique_type;
  const res = await create(input, { uniqueType });
  return res;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdWxAppToken(
  id: string,
  input: WxAppTokenInput,
): Promise<string> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wx/wx_app_token",
    "edit",
  );
  
  const {
    updateById,
  } = await import("./wx_app_token.service.ts");
  const res = await updateById(id, input);
  return res;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsWxAppToken(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wx/wx_app_token",
    "delete",
  );
  
  const {
    deleteByIds,
  } = await import("./wx_app_token.service.ts");
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsWxAppToken(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wx/wx_app_token",
    "delete",
  );
  
  const {
    revertByIds,
  } = await import("./wx_app_token.service.ts");
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsWxAppToken(
  ids: string[],
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
