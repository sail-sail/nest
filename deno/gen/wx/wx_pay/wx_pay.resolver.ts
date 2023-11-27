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
  WxPayInput,
  WxPayModel,
  WxPaySearch,
  WxPayFieldComment,
} from "./wx_pay.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountWxPay(
  search?: WxPaySearch & { $extra?: SearchExtra[] },
): Promise<number> {
  
  const {
    findCount,
  } = await import("./wx_pay.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllWxPay(
  search?: WxPaySearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxPayModel[]> {
  
  const {
    findAll,
  } = await import("./wx_pay.service.ts");
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsWxPay(): Promise<WxPayFieldComment> {
  const { getFieldComments } = await import("./wx_pay.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneWxPay(
  search?: WxPaySearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
): Promise<WxPayModel | undefined> {
  
  const {
    findOne,
  } = await import("./wx_pay.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdWxPay(
  id: string,
): Promise<WxPayModel | undefined> {
  const { findById } = await import("./wx_pay.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建一条数据
 */
export async function createWxPay(
  input: WxPayInput,
  unique_type?: UniqueType,
): Promise<string> {
  
  const {
    validate,
    setIdByLbl,
    create,
  } = await import("./wx_pay.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await validate(input);
  
  await usePermit(
    "/wx/wx_pay",
    "add",
  );
  const uniqueType = unique_type;
  const res = await create(input, { uniqueType });
  return res;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdWxPay(
  id: string,
  input: WxPayInput,
): Promise<string> {
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./wx_pay.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/wx/wx_pay",
    "edit",
  );
  const res = await updateById(id, input);
  return res;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsWxPay(
  ids: string[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./wx_pay.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wx/wx_pay",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 启用或者禁用数据
 */
export async function enableByIdsWxPay(
  ids: string[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./wx_pay.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsWxPay.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  await usePermit(
    "/wx/wx_pay",
    "enable",
  );
  const res = await enableByIds(ids, is_enabled);
  return res;
}

/**
 * 根据 ids 锁定或者解锁数据
 */
export async function lockByIdsWxPay(
  ids: string[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./wx_pay.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsWxPay.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  await usePermit(
    "/wx/wx_pay",
    "lock",
  );
  const res = await lockByIds(ids, is_locked);
  return res;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsWxPay(
  ids: string[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./wx_pay.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wx/wx_pay",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsWxPay(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wx/wx_pay",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./wx_pay.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}

/**
 * 查找 order_by 字段的最大值
 */
export async function findLastOrderByWxPay(): Promise<number> {
  const { findLastOrderBy } = await import("./wx_pay.service.ts");
  const res = findLastOrderBy();
  return res;
}
