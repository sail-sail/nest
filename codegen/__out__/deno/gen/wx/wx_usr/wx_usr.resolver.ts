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
  WxUsrInput,
  WxUsrModel,
  WxUsrSearch,
  WxUsrFieldComment,
  WxUsrId,
} from "./wx_usr.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找据数总数
 */
export async function findCountWxUsr(
  search?: WxUsrSearch & { $extra?: SearchExtra[] },
): Promise<number> {
  
  const {
    findCount,
  } = await import("./wx_usr.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找数据
 */
export async function findAllWxUsr(
  search?: WxUsrSearch & { $extra?: SearchExtra[] },
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxUsrModel[]> {
  
  const {
    findAll,
  } = await import("./wx_usr.service.ts");
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldCommentsWxUsr(): Promise<WxUsrFieldComment> {
  const { getFieldComments } = await import("./wx_usr.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一条数据
 */
export async function findOneWxUsr(
  search?: WxUsrSearch & { $extra?: SearchExtra[] },
  sort?: SortInput[],
): Promise<WxUsrModel | undefined> {
  
  const {
    findOne,
  } = await import("./wx_usr.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找一条数据
 */
export async function findByIdWxUsr(
  id: WxUsrId,
): Promise<WxUsrModel | undefined> {
  const { findById } = await import("./wx_usr.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建一条数据
 */
export async function createWxUsr(
  input: WxUsrInput,
  unique_type?: UniqueType,
): Promise<WxUsrId> {
  
  const {
    validate,
    setIdByLbl,
    create,
  } = await import("./wx_usr.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await validate(input);
  
  await usePermit(
    "/wx/wx_usr",
    "add",
  );
  const uniqueType = unique_type;
  const id: WxUsrId = await create(input, { uniqueType });
  return id;
}

/**
 * 根据id修改一条数据
 */
export async function updateByIdWxUsr(
  id: WxUsrId,
  input: WxUsrInput,
): Promise<WxUsrId> {
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./wx_usr.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/wx/wx_usr",
    "edit",
  );
  const id2: WxUsrId = await updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除数据
 */
export async function deleteByIdsWxUsr(
  ids: WxUsrId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./wx_usr.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wx/wx_usr",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 启用或者禁用数据
 */
export async function enableByIdsWxUsr(
  ids: WxUsrId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIds,
  } = await import("./wx_usr.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsWxUsr.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  await usePermit(
    "/wx/wx_usr",
    "enable",
  );
  const res = await enableByIds(ids, is_enabled);
  return res;
}

/**
 * 根据 ids 锁定或者解锁数据
 */
export async function lockByIdsWxUsr(
  ids: WxUsrId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIds,
  } = await import("./wx_usr.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsWxUsr.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  await usePermit(
    "/wx/wx_usr",
    "lock",
  );
  const res = await lockByIds(ids, is_locked);
  return res;
}

/**
 * 根据 ids 还原数据
 */
export async function revertByIdsWxUsr(
  ids: WxUsrId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./wx_usr.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wx/wx_usr",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除数据
 */
export async function forceDeleteByIdsWxUsr(
  ids: WxUsrId[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wx/wx_usr",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./wx_usr.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}
