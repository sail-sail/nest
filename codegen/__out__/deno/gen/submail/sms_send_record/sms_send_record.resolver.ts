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
    findCount,
  } = await import("./sms_send_record.service.ts");
  
  const num = await findCount(search);
  
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
    findAll,
  } = await import("./sms_send_record.service.ts");
  
  checkSortSmsSendRecord(sort);
  
  const models = await findAll(search, page, sort);
  
  return models;
}

/**
 * 获取短信发送记录字段注释
 */
export async function getFieldCommentsSmsSendRecord(): Promise<SmsSendRecordFieldComment> {
  
  const {
    getFieldComments,
  } = await import("./sms_send_record.service.ts");
  
  const field_comment = await getFieldComments();
  
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
    findOne,
  } = await import("./sms_send_record.service.ts");
  
  checkSortSmsSendRecord(sort);
  
  const model = await findOne(search, sort);
  
  return model;
}

/**
 * 根据 id 查找短信发送记录
 */
export async function findByIdSmsSendRecord(
  id: SmsSendRecordId,
): Promise<SmsSendRecordModel | undefined> {
  
  const {
    findById,
  } = await import("./sms_send_record.service.ts");
  
  const model = await findById(id);
  
  return model;
}

/**
 * 根据 ids 查找短信发送记录
 */
export async function findByIdsSmsSendRecord(
  ids: SmsSendRecordId[],
): Promise<SmsSendRecordModel[]> {
  
  const {
    findByIds,
  } = await import("./sms_send_record.service.ts");
  
  const models = await findByIds(ids);
  
  for (const model of models) {
  }
  
  return models;
}

/**
 * 根据 ids 删除短信发送记录
 */
export async function deleteByIdsSmsSendRecord(
  ids: SmsSendRecordId[],
): Promise<number> {
  
  const {
    deleteByIds,
  } = await import("./sms_send_record.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const num = await deleteByIds(ids);
  
  return num;
}

/**
 * 根据 ids 还原短信发送记录
 */
export async function revertByIdsSmsSendRecord(
  ids: SmsSendRecordId[],
): Promise<number> {
  
  const {
    revertByIds,
  } = await import("./sms_send_record.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "delete",
  );
  
  const res = await revertByIds(ids);
  
  return res;
}

/**
 * 根据 ids 彻底删除短信发送记录
 */
export async function forceDeleteByIdsSmsSendRecord(
  ids: SmsSendRecordId[],
): Promise<number> {
  
  const {
    forceDeleteByIds,
  } = await import("./sms_send_record.service.ts");
  
  set_is_tran(true);
  
  await usePermit(
    route_path,
    "force_delete",
  );
  
  const res = await forceDeleteByIds(ids);
  
  return res;
}
