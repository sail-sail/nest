import {
  useContext,
} from "/lib/context.ts";

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
 * 根据条件查找小程序用户总数
 */
export async function findCountWxUsr(
  search?: WxUsrSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./wx_usr.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找小程序用户列表
 */
export async function findAllWxUsr(
  search?: WxUsrSearch,
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
 * 获取小程序用户字段注释
 */
export async function getFieldCommentsWxUsr(): Promise<WxUsrFieldComment> {
  const { getFieldComments } = await import("./wx_usr.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一个小程序用户
 */
export async function findOneWxUsr(
  search?: WxUsrSearch,
  sort?: SortInput[],
): Promise<WxUsrModel | undefined> {
  
  const {
    findOne,
  } = await import("./wx_usr.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找小程序用户
 */
export async function findByIdWxUsr(
  id: WxUsrId,
): Promise<WxUsrModel | undefined> {
  const { findById } = await import("./wx_usr.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建小程序用户
 */
export async function createWxUsr(
  input: WxUsrInput,
  unique_type?: UniqueType,
): Promise<WxUsrId> {
  
  input.id = undefined;
  
  input.create_usr_id = undefined;
  input.create_usr_id_lbl = undefined;
  
  input.create_time = undefined;
  input.create_time_lbl = undefined;
  
  input.update_usr_id = undefined;
  input.update_usr_id_lbl = undefined;
  
  input.update_time = undefined;
  input.update_time_lbl = undefined;
  
  input.is_deleted = undefined;
  
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
 * 根据 id 修改小程序用户
 */
export async function updateByIdWxUsr(
  id: WxUsrId,
  input: WxUsrInput,
): Promise<WxUsrId> {
  
  input.id = undefined;
  
  input.create_usr_id = undefined;
  input.create_usr_id_lbl = undefined;
  
  input.create_time = undefined;
  input.create_time_lbl = undefined;
  
  input.update_usr_id = undefined;
  input.update_usr_id_lbl = undefined;
  
  input.update_time = undefined;
  input.update_time_lbl = undefined;
  
  input.is_deleted = undefined;
  
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
 * 根据 ids 删除小程序用户
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
 * 根据 ids 还原小程序用户
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
 * 根据 ids 彻底删除小程序用户
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
