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
  intoInputBaiduAppToken,
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
    findCountBaiduAppToken,
  } = await import("./baidu_app_token.service.ts");
  
  const num = await findCountBaiduAppToken(search);
  
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
    findAllBaiduAppToken,
  } = await import("./baidu_app_token.service.ts");
  
  checkSortBaiduAppToken(sort);
  
  const models = await findAllBaiduAppToken(search, page, sort);
  
  return models;
}

/**
 * 获取百度接口凭据字段注释
 */
export async function getFieldCommentsBaiduAppToken(): Promise<BaiduAppTokenFieldComment> {
  
  const {
    getFieldCommentsBaiduAppToken,
  } = await import("./baidu_app_token.service.ts");
  
  const field_comment = await getFieldCommentsBaiduAppToken();
  
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
    findOneBaiduAppToken,
  } = await import("./baidu_app_token.service.ts");
  
  checkSortBaiduAppToken(sort);
  
  const model = await findOneBaiduAppToken(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个百度接口凭据, 如果不存在则抛错
 */
export async function findOneOkBaiduAppToken(
  search?: BaiduAppTokenSearch,
  sort?: SortInput[],
): Promise<BaiduAppTokenModel> {
  
  const {
    findOneOkBaiduAppToken,
  } = await import("./baidu_app_token.service.ts");
  
  checkSortBaiduAppToken(sort);
  
  const model = await findOneOkBaiduAppToken(search, sort);
  
  return model;
}

/**
 * 根据 id 查找百度接口凭据
 */
export async function findByIdBaiduAppToken(
  id: BaiduAppTokenId,
): Promise<BaiduAppTokenModel | undefined> {
  
  const {
    findByIdBaiduAppToken,
  } = await import("./baidu_app_token.service.ts");
  
  const model = await findByIdBaiduAppToken(id);
  
  return model;
}

/**
 * 根据 id 查找百度接口凭据, 如果不存在则抛错
 */
export async function findByIdOkBaiduAppToken(
  id: BaiduAppTokenId,
): Promise<BaiduAppTokenModel | undefined> {
  
  const {
    findByIdOkBaiduAppToken,
  } = await import("./baidu_app_token.service.ts");
  
  const model = await findByIdOkBaiduAppToken(id);
  
  return model;
}

/**
 * 根据 ids 查找百度接口凭据
 */
export async function findByIdsBaiduAppToken(
  ids: BaiduAppTokenId[],
): Promise<BaiduAppTokenModel[]> {
  
  const {
    findByIdsBaiduAppToken,
  } = await import("./baidu_app_token.service.ts");
  
  const models = await findByIdsBaiduAppToken(ids);
  
  return models;
}

/**
 * 根据 ids 查找百度接口凭据, 出现查询不到的 id 则报错
 */
export async function findByIdsOkBaiduAppToken(
  ids: BaiduAppTokenId[],
): Promise<BaiduAppTokenModel[]> {
  
  const {
    findByIdsOkBaiduAppToken,
  } = await import("./baidu_app_token.service.ts");
  
  const models = await findByIdsOkBaiduAppToken(ids);
  
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
    validateBaiduAppToken,
    setIdByLblBaiduAppToken,
    createsBaiduAppToken,
  } = await import("./baidu_app_token.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    
    intoInputBaiduAppToken(input);
    
    await setIdByLblBaiduAppToken(input);
    
    await validateBaiduAppToken(input);
    
  }
  const uniqueType = unique_type;
  const ids = await createsBaiduAppToken(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改百度接口凭据
 */
export async function updateByIdBaiduAppToken(
  id: BaiduAppTokenId,
  input: BaiduAppTokenInput,
): Promise<BaiduAppTokenId> {
  
  intoInputBaiduAppToken(input);
  
  const {
    setIdByLblBaiduAppToken,
    updateByIdBaiduAppToken,
  } = await import("./baidu_app_token.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblBaiduAppToken(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: BaiduAppTokenId = await updateByIdBaiduAppToken(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除百度接口凭据
 */
export async function deleteByIdsBaiduAppToken(
  ids: BaiduAppTokenId[],
): Promise<number> {
  
  const {
    deleteByIdsBaiduAppToken,
  } = await import("./baidu_app_token.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsBaiduAppToken(ids);
  
  return num;
}

/**
 * 根据 ids 还原百度接口凭据
 */
export async function revertByIdsBaiduAppToken(
  ids: BaiduAppTokenId[],
): Promise<number> {
  
  const {
    revertByIdsBaiduAppToken,
  } = await import("./baidu_app_token.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsBaiduAppToken(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除百度接口凭据
 */
export async function forceDeleteByIdsBaiduAppToken(
  ids: BaiduAppTokenId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsBaiduAppToken,
  } = await import("./baidu_app_token.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsBaiduAppToken(ids);
  
  return res;
}
