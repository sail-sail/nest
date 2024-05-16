import {
  useContext,
} from "/lib/context.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

/**
 * 根据条件查找公众号用户总数
 */
export async function findCountWxoUsr(
  search?: WxoUsrSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./wxo_usr.service.ts");
  
  const res = await findCount(search);
  return res;
}

/**
 * 根据搜索条件和分页查找公众号用户列表
 */
export async function findAllWxoUsr(
  search?: WxoUsrSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<WxoUsrModel[]> {
  
  const {
    findAll,
  } = await import("./wxo_usr.service.ts");
  
  const res = await findAll(search, page, sort);
  return res;
}

/**
 * 获取公众号用户字段注释
 */
export async function getFieldCommentsWxoUsr(): Promise<WxoUsrFieldComment> {
  const { getFieldComments } = await import("./wxo_usr.service.ts");
  const res = await getFieldComments();
  return res;
}

/**
 * 根据条件查找第一个公众号用户
 */
export async function findOneWxoUsr(
  search?: WxoUsrSearch,
  sort?: SortInput[],
): Promise<WxoUsrModel | undefined> {
  
  const {
    findOne,
  } = await import("./wxo_usr.service.ts");
  
  const res = await findOne(search, sort);
  return res;
}

/**
 * 根据 id 查找公众号用户
 */
export async function findByIdWxoUsr(
  id: WxoUsrId,
): Promise<WxoUsrModel | undefined> {
  
  const {
    findById,
  } = await import("./wxo_usr.service.ts");
  
  const res = await findById(id);
  
  return res;
}

/**
 * 批量创建公众号用户
 */
export async function createsWxoUsr(
  inputs: WxoUsrInput[],
  unique_type?: UniqueType,
): Promise<WxoUsrId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./wxo_usr.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wx/wxo_usr",
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
 * 根据 id 修改公众号用户
 */
export async function updateByIdWxoUsr(
  id: WxoUsrId,
  input: WxoUsrInput,
): Promise<WxoUsrId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./wxo_usr.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await setIdByLbl(input);
  
  await usePermit(
    "/wx/wxo_usr",
    "edit",
  );
  const id2: WxoUsrId = await updateById(id, input);
  return id2;
}

/**
 * 根据 ids 删除公众号用户
 */
export async function deleteByIdsWxoUsr(
  ids: WxoUsrId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./wxo_usr.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wx/wxo_usr",
    "delete",
  );
  const res = await deleteByIds(ids);
  return res;
}

/**
 * 根据 ids 还原公众号用户
 */
export async function revertByIdsWxoUsr(
  ids: WxoUsrId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./wxo_usr.service.ts");
  
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wx/wxo_usr",
    "delete",
  );
  const res = await revertByIds(ids);
  return res;
}

/**
 * 根据 ids 彻底删除公众号用户
 */
export async function forceDeleteByIdsWxoUsr(
  ids: WxoUsrId[],
): Promise<number> {
  const context = useContext();
  
  context.is_tran = true;
  
  await usePermit(
    "/wx/wxo_usr",
    "force_delete",
  );
  
  const {
    forceDeleteByIds,
  } = await import("./wxo_usr.service.ts");
  const res = await forceDeleteByIds(ids);
  return res;
}
