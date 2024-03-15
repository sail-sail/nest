import {
  useContext,
} from "/lib/context.ts";

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
  WxwUsrId,
} from "./wxw_usr.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找企微用户总数
 */
export async function findCountWxwUsr(
  search?: WxwUsrSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./wxw_usr.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找企微用户列表
 */
export async function findAllWxwUsr(
  search?: WxwUsrSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxwUsrModel[]> {
  
  const {
    findAll,
  } = await import("./wxw_usr.service.ts");
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取企微用户字段注释
 */
export async function getFieldCommentsWxwUsr(): Promise<WxwUsrFieldComment> {
  const { getFieldComments } = await import("./wxw_usr.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一个企微用户
 */
export async function findOneWxwUsr(
  search?: WxwUsrSearch,
  sort?: SortInput[],
): Promise<WxwUsrModel | undefined> {
  
  const {
    findOne,
  } = await import("./wxw_usr.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找企微用户
 */
export async function findByIdWxwUsr(
  id: WxwUsrId,
): Promise<WxwUsrModel | undefined> {
  const { findById } = await import("./wxw_usr.service.ts");
  const res = await findById(id);
  return res;
}

/**
 * 创建企微用户
 */
export async function createWxwUsr(
  input: WxwUsrInput,
  unique_type?: UniqueType,
): Promise<WxwUsrId> {
  
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
  } = await import("./wxw_usr.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await validate(input);
  
  await usePermit(
    "/wxwork/wxw_usr",
    "add",
  );
  const uniqueType = unique_type;
  const id: WxwUsrId = await create(input, { uniqueType });
  return id;
}

/**
 * 根据 id 修改企微用户
 */
export async function updateByIdWxwUsr(
  id: WxwUsrId,
  input: WxwUsrInput,
): Promise<WxwUsrId> {
  
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
  } = await import("./wxw_usr.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/wxwork/wxw_usr",
    "edit",
  );
  const id2: WxwUsrId = await updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除企微用户
 */
export async function deleteByIdsWxwUsr(
  ids: WxwUsrId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./wxw_usr.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wxwork/wxw_usr",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 还原企微用户
 */
export async function revertByIdsWxwUsr(
  ids: WxwUsrId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./wxw_usr.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wxwork/wxw_usr",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除企微用户
 */
export async function forceDeleteByIdsWxwUsr(
  ids: WxwUsrId[],
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
