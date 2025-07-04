import {
  set_is_tran,
} from "/lib/context.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  checkSortSmsSendRecord,
} from "./sms_send_record.model.ts";

import {
  usePermit,
} from "/src/base/permit/permit.service.ts";

import {
  route_path,
} from "./sms_send_record.model.ts";

/**
 * 根据条件查找短信发送记录总数
 */
export async function findCountSmsSendRecord(
  search?: SmsSendRecordSearch,
): Promise<number> {
  
  const {
    findCountSmsSendRecord,
  } = await import("./sms_send_record.service.ts");
  
  const num = await findCountSmsSendRecord(search);
  
  return num;
}

/**
 * 根据搜索条件和分页查找短信发送记录列表
 */
export async function findAllSmsSendRecord(
  search?: SmsSendRecordSearch,
  page?: PageInput,
  sort?: SortInput[],
): Promise<SmsSendRecordModel[]> {
  
  const {
    findAllSmsSendRecord,
  } = await import("./sms_send_record.service.ts");
  
  checkSortSmsSendRecord(sort);
  
  const models = await findAllSmsSendRecord(search, page, sort);
  
  return models;
}

/**
 * 获取短信发送记录字段注释
 */
export async function getFieldCommentsSmsSendRecord(): Promise<SmsSendRecordFieldComment> {
  
  const {
    getFieldCommentsSmsSendRecord,
  } = await import("./sms_send_record.service.ts");
  
  const field_comment = await getFieldCommentsSmsSendRecord();
  
  return field_comment;
}

/**
 * 根据条件查找第一个短信发送记录
 */
export async function findOneSmsSendRecord(
  search?: SmsSendRecordSearch,
  sort?: SortInput[],
): Promise<SmsSendRecordModel | undefined> {
  
  const {
    findOneSmsSendRecord,
  } = await import("./sms_send_record.service.ts");
  
  checkSortSmsSendRecord(sort);
  
  const model = await findOneSmsSendRecord(search, sort);
  
  return model;
}

/**
 * 根据条件查找第一个短信发送记录, 如果不存在则抛错
 */
export async function findOneOkSmsSendRecord(
  search?: SmsSendRecordSearch,
  sort?: SortInput[],
): Promise<SmsSendRecordModel> {
  
  const {
    findOneOkSmsSendRecord,
  } = await import("./sms_send_record.service.ts");
  
  checkSortSmsSendRecord(sort);
  
  const model = await findOneOkSmsSendRecord(search, sort);
  
  return model;
}

/**
 * 根据 id 查找短信发送记录
 */
export async function findByIdSmsSendRecord(
  id: SmsSendRecordId,
): Promise<SmsSendRecordModel | undefined> {
  
  const {
    findByIdSmsSendRecord,
  } = await import("./sms_send_record.service.ts");
  
  const model = await findByIdSmsSendRecord(id);
  
  return model;
}

/**
 * 根据 id 查找短信发送记录, 如果不存在则抛错
 */
export async function findByIdOkSmsSendRecord(
  id: SmsSendRecordId,
): Promise<SmsSendRecordModel | undefined> {
  
  const {
    findByIdOkSmsSendRecord,
  } = await import("./sms_send_record.service.ts");
  
  const model = await findByIdOkSmsSendRecord(id);
  
  return model;
}

/**
 * 根据 ids 查找短信发送记录
 */
export async function findByIdsSmsSendRecord(
  ids: SmsSendRecordId[],
): Promise<SmsSendRecordModel[]> {
  
  const {
    findByIdsSmsSendRecord,
  } = await import("./sms_send_record.service.ts");
  
  const models = await findByIdsSmsSendRecord(ids);
  
  return models;
}

/**
 * 根据 ids 查找短信发送记录, 出现查询不到的 id 则报错
 */
export async function findByIdsOkSmsSendRecord(
  ids: SmsSendRecordId[],
): Promise<SmsSendRecordModel[]> {
  
  const {
    findByIdsOkSmsSendRecord,
  } = await import("./sms_send_record.service.ts");
  
  const models = await findByIdsOkSmsSendRecord(ids);
  
  return models;
}

/**
 * 根据 ids 删除短信发送记录
 */
export async function deleteByIdsSmsSendRecord(
  ids: SmsSendRecordId[],
): Promise<number> {
  
  const {
    deleteByIdsSmsSendRecord,
  } = await import("./sms_send_record.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIdsSmsSendRecord(ids);
  
  return num;
}

/**
 * 根据 ids 还原短信发送记录
 */
export async function revertByIdsSmsSendRecord(
  ids: SmsSendRecordId[],
): Promise<number> {
  
  const {
    revertByIdsSmsSendRecord,
  } = await import("./sms_send_record.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIdsSmsSendRecord(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除短信发送记录
 */
export async function forceDeleteByIdsSmsSendRecord(
  ids: SmsSendRecordId[],
): Promise<number> {
  
  const {
    forceDeleteByIdsSmsSendRecord,
  } = await import("./sms_send_record.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIdsSmsSendRecord(ids);
  
  return res;
}
