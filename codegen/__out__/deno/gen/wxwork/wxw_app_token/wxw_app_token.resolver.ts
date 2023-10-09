import {
  useContext,
} from "/lib/context.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import dayjs from "dayjs";

import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  WxwAppTokenInput,
  WxwAppTokenModel,
  WxwAppTokenSearch,
  WxwAppTokenFieldComment,
} from "./wxw_app_token.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountWxwAppToken(
  search?: WxwAppTokenSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  const { findCount } = await import("./wxw_app_token.service.ts");
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllWxwAppToken(
  search?: WxwAppTokenSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxwAppTokenModel[]> {
  const { findAll } = await import("./wxw_app_token.service.ts");
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsWxwAppToken(): Promise<WxwAppTokenFieldComment> {
  const { getFieldComments } = await import("./wxw_app_token.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneWxwAppToken(
  search?: WxwAppTokenSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
): Promise<WxwAppTokenModel | undefined> {
  const { findOne } = await import("./wxw_app_token.service.ts");
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdWxwAppToken(
  id: string,
): Promise<WxwAppTokenModel | undefined> {
  const { findById } = await import("./wxw_app_token.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建一条数据
 */
export async function createWxwAppToken(
  input: WxwAppTokenInput,
  unique_type?: UniqueType,
): Promise<string> {
  // 令牌创建时间
  if (!input.token_time && input.token_time_lbl) {
    const token_time_lbl = dayjs(input.token_time_lbl);
    if (token_time_lbl.isValid()) {
      input.token_time = token_time_lbl.format("YYYY-MM-DD HH:mm:ss");
    } else {
      throw `${ await ns("企微应用接口凭据") } ${ await ns("日期格式错误") }`;
    }
  }
  if (input.token_time) {
    const token_time = dayjs(input.token_time);
    if (!token_time.isValid()) {
      throw `${ await ns("企微应用接口凭据") } ${ await ns("日期格式错误") }`;
    }
    input.token_time = dayjs(input.token_time).format("YYYY-MM-DD HH:mm:ss");
  }
  
  const {
    validate,
    create,
  } = await import("./wxw_app_token.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await validate(input);
  
  await usePermit(
    "/wxwork/wxw_app_token",
    "add",
  );
  const uniqueType = unique_type;
  const res = await create(input, { uniqueType });
  return res;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdWxwAppToken(
  id: string,
  input: WxwAppTokenInput,
): Promise<string> {
  // 令牌创建时间
  if (!input.token_time && input.token_time_lbl) {
    const token_time_lbl = dayjs(input.token_time_lbl);
    if (token_time_lbl.isValid()) {
      input.token_time = token_time_lbl.format("YYYY-MM-DD HH:mm:ss");
    } else {
      throw `${ await ns("企微应用接口凭据") } ${ await ns("日期格式错误") }`;
    }
  }
  if (input.token_time) {
    const token_time = dayjs(input.token_time);
    if (!token_time.isValid()) {
      throw `${ await ns("企微应用接口凭据") } ${ await ns("日期格式错误") }`;
    }
    input.token_time = dayjs(input.token_time).format("YYYY-MM-DD HH:mm:ss");
  }
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wxwork/wxw_app_token",
    "edit",
  );
  
  const {
    updateById,
  } = await import("./wxw_app_token.service.ts");
  const res = await updateById(id, input);
  return res;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsWxwAppToken(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wxwork/wxw_app_token",
    "delete",
  );
  
  const {
    deleteByIds,
  } = await import("./wxw_app_token.service.ts");
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsWxwAppToken(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wxwork/wxw_app_token",
    "delete",
  );
  
  const {
    revertByIds,
  } = await import("./wxw_app_token.service.ts");
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsWxwAppToken(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wxwork/wxw_app_token",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./wxw_app_token.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}
