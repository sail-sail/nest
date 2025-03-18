import {
  set_is_tran,
  set_is_creating,
} from "/lib/context.ts";

import type {
  UniqueType,
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortBaiduAppToken,
} from "./baidu_app_token.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./baidu_app_token.model.ts";

/**
 * 根据条件查找百度接口凭据总数
 */
export async function findCountBaiduAppToken(
  search?: BaiduAppTokenSearch,
): Promise<number> {
  
  const {
    findCount,
  } = await import("./baidu_app_token.service.ts");
  
  const num = await findCount(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找百度接口凭据列表
 */
export async function findAllBaiduAppToken(
  search?: BaiduAppTokenSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<BaiduAppTokenModel[]> {
  
  const {
    findAll,
  } = await import("./baidu_app_token.service.ts");
  
  checkSortBaiduAppToken(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取百度接口凭据字段注释
 */
export async function getFieldCommentsBaiduAppToken(): Promise<BaiduAppTokenFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./baidu_app_token.service.ts");
  
  const field_comment = await getFieldComments();
  
  return field_comment;
}

/**
 * 根据条件查找第一个百度接口凭据
 */
export async function findOneBaiduAppToken(
  search?: BaiduAppTokenSearch,
  sort?: SortInput[],
): Promise<BaiduAppTokenModel | undefined> {
  
  const {
    findOne,
  } = await import("./baidu_app_token.service.ts");
  
  checkSortBaiduAppToken(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找百度接口凭据
 */
export async function findByIdBaiduAppToken(
  id: BaiduAppTokenId,
): Promise<BaiduAppTokenModel | undefined> {
  
  const {
    findById,
  } = await import("./baidu_app_token.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找百度接口凭据
 */
export async function findByIdsBaiduAppToken(
  ids: BaiduAppTokenId[],
): Promise<BaiduAppTokenModel[]> {
  
  const {
    findByIds,
  } = await import("./baidu_app_token.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建百度接口凭据
 */
export async function createsBaiduAppToken(
  inputs: BaiduAppTokenInput[],
  unique_type?: UniqueType,
): Promise<BaiduAppTokenId[]> {
  
  const {
    validate,
    setIdByLbl,
    creates,
  } = await import("./baidu_app_token.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
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
 * 根据 id 修改百度接口凭据
 */
export async function updateByIdBaiduAppToken(
  id: BaiduAppTokenId,
  input: BaiduAppTokenInput,
): Promise<BaiduAppTokenId> {
  
  input.id = undefined;
  
  const {
    setIdByLbl,
    updateById,
  } = await import("./baidu_app_token.service.ts");
  
  set_is_tran(true);
  
  await setIdByLbl(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: BaiduAppTokenId = await updateById(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除百度接口凭据
 */
export async function deleteByIdsBaiduAppToken(
  ids: BaiduAppTokenId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./baidu_app_token.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
}

/**
 * 根据 ids 还原百度接口凭据
 */
export async function revertByIdsBaiduAppToken(
  ids: BaiduAppTokenId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./baidu_app_token.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除百度接口凭据
 */
export async function forceDeleteByIdsBaiduAppToken(
  ids: BaiduAppTokenId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./baidu_app_token.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}
