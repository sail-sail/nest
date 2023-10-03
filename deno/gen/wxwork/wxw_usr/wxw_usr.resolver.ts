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
  WxwUsrInput,
  WxwUsrModel,
  WxwUsrSearch,
  WxwUsrFieldComment,
} from "./wxw_usr.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountWxwUsr(
  search?: WxwUsrSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  const { findCount } = await import("./wxw_usr.service.ts");
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllWxwUsr(
  search?: WxwUsrSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxwUsrModel[]> {
  const { findAll } = await import("./wxw_usr.service.ts");
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsWxwUsr(): Promise<WxwUsrFieldComment> {
  const { getFieldComments } = await import("./wxw_usr.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneWxwUsr(
  search?: WxwUsrSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
): Promise<WxwUsrModel | undefined> {
  const { findOne } = await import("./wxw_usr.service.ts");
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdWxwUsr(
  id: string,
): Promise<WxwUsrModel | undefined> {
  const { findById } = await import("./wxw_usr.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建一条数据
 */
export async function createWxwUsr(
  input: WxwUsrInput,
  unique_type?: UniqueType,
): Promise<string> {
  
  const {
    validate,
    create,
  } = await import("./wxw_usr.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await validate(input);
  
  await usePermit(
    "/wxwork/wxw_usr",
    "add",
  );
  const uniqueType = unique_type;
  const res = await create(input, { uniqueType });
  return res;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdWxwUsr(
  id: string,
  input: WxwUsrInput,
): Promise<string> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wxwork/wxw_usr",
    "edit",
  );
  
  const {
    updateById,
  } = await import("./wxw_usr.service.ts");
  const res = await updateById(id, input);
  return res;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsWxwUsr(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wxwork/wxw_usr",
    "delete",
  );
  
  const {
    deleteByIds,
  } = await import("./wxw_usr.service.ts");
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsWxwUsr(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wxwork/wxw_usr",
    "delete",
  );
  
  const {
    revertByIds,
  } = await import("./wxw_usr.service.ts");
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsWxwUsr(
  ids: string[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wxwork/wxw_usr",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./wxw_usr.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}
