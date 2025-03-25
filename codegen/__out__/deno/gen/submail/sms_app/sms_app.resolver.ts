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
  checkSortSmsApp,
} from "./sms_app.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./sms_app.model.ts";

/**
 * 根据条件查找短信应用总数
 */
export async function findCountSmsApp(
  search?: SmsAppSearch,
): Promise<number> {
  
  const {
    findCountSmsApp,
  } = await import("./sms_app.service.ts");
  
  const num = await findCountSmsApp(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找短信应用列表
 */
export async function findAllSmsApp(
  search?: SmsAppSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<SmsAppModel[]> {
  
  const {
    findAllSmsApp,
  } = await import("./sms_app.service.ts");
  
  checkSortSmsApp(sort);
  
  const models = await findAllSmsApp(search, page, sort);
  
  return models;
}

/**
 * 获取短信应用字段注释
 */
export async function getFieldCommentsSmsApp(): Promise<SmsAppFieldComment> {
  
  const {
    getFieldCommentsSmsApp,
  } = await import("./sms_app.service.ts");
  
  const field_comment = await getFieldCommentsSmsApp();
  
  return field_comment;
}

/**
 * 根据条件查找第一个短信应用
 */
export async function findOneSmsApp(
  search?: SmsAppSearch,
  sort?: SortInput[],
): Promise<SmsAppModel | undefined> {
  
  const {
    findOneSmsApp,
  } = await import("./sms_app.service.ts");
  
  checkSortSmsApp(sort);
  
  const model = await findOneSmsApp(search, sort);
  
  return model;
}

/**
 * 根据 id 查找短信应用
 */
export async function findByIdSmsApp(
  id: SmsAppId,
): Promise<SmsAppModel | undefined> {
  
  const {
    findByIdSmsApp,
  } = await import("./sms_app.service.ts");
  
  const model = await findByIdSmsApp(id);
  
  return model;
}

/**
 * 根据 ids 查找短信应用
 */
export async function findByIdsSmsApp(
  ids: SmsAppId[],
): Promise<SmsAppModel[]> {
  
  const {
    findByIdsSmsApp,
  } = await import("./sms_app.service.ts");
  
  const models = await findByIdsSmsApp(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 批量创建短信应用
 */
export async function createsSmsApp(
  inputs: SmsAppInput[],
  unique_type?: UniqueType,
): Promise<SmsAppId[]> {
  
  const {
    validateSmsApp,
    setIdByLblSmsApp,
    createsSmsApp,
  } = await import("./sms_app.service.ts");
  
  set_is_tran(true);
  set_is_creating(true);
  
  await usePermit(
    route_path,
    "add",
  );
  
  for (const input of inputs) {
    input.id = undefined;
    
    await setIdByLblSmsApp(input);
    
    await validateSmsApp(input);
  }
  const uniqueType = unique_type;
  const ids = await createsSmsApp(inputs, { uniqueType });
  return ids;
}

/**
 * 根据 id 修改短信应用
 */
export async function updateByIdSmsApp(
  id: SmsAppId,
  input: SmsAppInput,
): Promise<SmsAppId> {
  
  input.id = undefined;
  
  const {
    setIdByLblSmsApp,
    updateByIdSmsApp,
  } = await import("./sms_app.service.ts");
  
  set_is_tran(true);
  
  await setIdByLblSmsApp(input);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const id2: SmsAppId = await updateByIdSmsApp(id, input);
  
  return id2;
}

/**
 * 根据 ids 删除短信应用
 */
export async function deleteByIdsSmsApp(
  ids: SmsAppId[],
): Promise<number> {
  
  const {
    deleteByIdsSmsApp,
  } = await import("./sms_app.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsSmsApp(ids);
  
  return num;
}

/**
 * 根据 ids 启用或者禁用短信应用
 */
export async function enableByIdsSmsApp(
  ids: SmsAppId[],
  is_enabled: 0 | 1,
): Promise<number> {
  
  const {
    enableByIdsSmsApp,
  } = await import("./sms_app.service.ts");
  
  if (is_enabled !== 0 && is_enabled !== 1) {
    throw new Error(`enableByIdsSmsApp.is_enabled expect 0 or 1 but got ${ is_enabled }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  const res = await enableByIdsSmsApp(ids, is_enabled);
  
  return res;
}

/**
 * 根据 ids 锁定或者解锁短信应用
 */
export async function lockByIdsSmsApp(
  ids: SmsAppId[],
  is_locked: 0 | 1,
): Promise<number> {
  
  const {
    lockByIdsSmsApp,
  } = await import("./sms_app.service.ts");
  
  if (is_locked !== 0 && is_locked !== 1) {
    throw new Error(`lockByIdsSmsApp.is_locked expect 0 or 1 but got ${ is_locked }`);
  }
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "edit",
  );
  
  const res = await lockByIdsSmsApp(ids, is_locked);
  
  return res;
}

/**
 * 根据 ids 还原短信应用
 */
export async function revertByIdsSmsApp(
  ids: SmsAppId[],
): Promise<number> {
  
  const {
    revertByIdsSmsApp,
  } = await import("./sms_app.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsSmsApp(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除短信应用
 */
export async function forceDeleteByIdsSmsApp(
  ids: SmsAppId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsSmsApp,
  } = await import("./sms_app.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsSmsApp(ids);
  
  return res;
}

/**
 * 查找 短信应用 order_by 字段的最大值
 */
export async function findLastOrderBySmsApp(): Promise<number> {
  
  const {
    findLastOrderBySmsApp,
  } = await import("./sms_app.service.ts");
  
  const res = findLastOrderBySmsApp();
  
  return res;
}
