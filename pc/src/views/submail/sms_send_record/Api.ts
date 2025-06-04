

import {
  SmsSendRecordStatus,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  smsSendRecordQueryField,
} from "./Model.ts";

async function setLblById(
  model?: SmsSendRecordModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputSmsSendRecord(
  model?: SmsSendRecordInput,
) {
  const input: SmsSendRecordInput = {
    // ID
    id: model?.id,
    // 短信应用
    sms_app_id: model?.sms_app_id,
    sms_app_id_lbl: model?.sms_app_id_lbl,
    // 接收人
    send_to: model?.send_to,
    // 内容
    content: model?.content,
    // 状态
    status: model?.status,
    status_lbl: model?.status_lbl,
    // 发送时间
    send_time: model?.send_time,
    send_time_lbl: model?.send_time_lbl,
    send_time_save_null: model?.send_time_save_null,
    // 标签
    tag: model?.tag,
    // 消息
    msg: model?.msg,
  };
  return input;
}

/**
 * 根据搜索条件查找 短信发送记录 列表
 */
export async function findAllSmsSendRecord(
  search?: SmsSendRecordSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllSmsSendRecord: SmsSendRecordModel[];
  } = await query({
    query: `
      query($search: SmsSendRecordSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllSmsSendRecord(search: $search, page: $page, sort: $sort) {
          ${ smsSendRecordQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllSmsSendRecord;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 短信发送记录
 */
export async function findOneSmsSendRecord(
  search?: SmsSendRecordSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneSmsSendRecord?: SmsSendRecordModel;
  } = await query({
    query: `
      query($search: SmsSendRecordSearch, $sort: [SortInput!]) {
        findOneSmsSendRecord(search: $search, sort: $sort) {
          ${ smsSendRecordQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneSmsSendRecord;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据条件查找第一个 短信发送记录, 如果不存在则抛错
 */
export async function findOneOkSmsSendRecord(
  search?: SmsSendRecordSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkSmsSendRecord?: SmsSendRecordModel;
  } = await query({
    query: `
      query($search: SmsSendRecordSearch, $sort: [SortInput!]) {
        findOneOkSmsSendRecord(search: $search, sort: $sort) {
          ${ smsSendRecordQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkSmsSendRecord;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据搜索条件查找 短信发送记录 总数
 */
export async function findCountSmsSendRecord(
  search?: SmsSendRecordSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountSmsSendRecord: Query["findCountSmsSendRecord"];
  } = await query({
    query: /* GraphQL */ `
      query($search: SmsSendRecordSearch) {
        findCountSmsSendRecord(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountSmsSendRecord;
  return count;
}

/**
 * 根据 id 查找 短信发送记录
 */
export async function findByIdSmsSendRecord(
  id: SmsSendRecordId,
  opt?: GqlOpt,
): Promise<SmsSendRecordModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdSmsSendRecord?: SmsSendRecordModel;
  } = await query({
    query: `
      query($id: SmsSendRecordId!) {
        findByIdSmsSendRecord(id: $id) {
          ${ smsSendRecordQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdSmsSendRecord;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据 id 查找 短信发送记录, 如果不存在则抛错
 */
export async function findByIdOkSmsSendRecord(
  id: SmsSendRecordId,
  opt?: GqlOpt,
): Promise<SmsSendRecordModel> {
  
  const data: {
    findByIdOkSmsSendRecord: SmsSendRecordModel;
  } = await query({
    query: `
      query($id: SmsSendRecordId!) {
        findByIdOkSmsSendRecord(id: $id) {
          ${ smsSendRecordQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkSmsSendRecord;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据 ids 查找 短信发送记录
 */
export async function findByIdsSmsSendRecord(
  ids: SmsSendRecordId[],
  opt?: GqlOpt,
): Promise<SmsSendRecordModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsSmsSendRecord: SmsSendRecordModel[];
  } = await query({
    query: `
      query($ids: [SmsSendRecordId!]!) {
        findByIdsSmsSendRecord(ids: $ids) {
          ${ smsSendRecordQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsSmsSendRecord;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 短信发送记录, 出现查询不到的 id 则报错
 */
export async function findByIdsOkSmsSendRecord(
  ids: SmsSendRecordId[],
  opt?: GqlOpt,
): Promise<SmsSendRecordModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkSmsSendRecord: SmsSendRecordModel[];
  } = await query({
    query: `
      query($ids: [SmsSendRecordId!]!) {
        findByIdsOkSmsSendRecord(ids: $ids) {
          ${ smsSendRecordQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkSmsSendRecord;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 短信发送记录
 */
export async function deleteByIdsSmsSendRecord(
  ids: SmsSendRecordId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsSmsSendRecord: Mutation["deleteByIdsSmsSendRecord"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [SmsSendRecordId!]!) {
        deleteByIdsSmsSendRecord(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsSmsSendRecord;
  return res;
}

/**
 * 根据 ids 还原 短信发送记录
 */
export async function revertByIdsSmsSendRecord(
  ids: SmsSendRecordId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsSmsSendRecord: Mutation["revertByIdsSmsSendRecord"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [SmsSendRecordId!]!) {
        revertByIdsSmsSendRecord(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsSmsSendRecord;
  return res;
}

/**
 * 根据 ids 彻底删除 短信发送记录
 */
export async function forceDeleteByIdsSmsSendRecord(
  ids: SmsSendRecordId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsSmsSendRecord: Mutation["forceDeleteByIdsSmsSendRecord"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [SmsSendRecordId!]!) {
        forceDeleteByIdsSmsSendRecord(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsSmsSendRecord;
  return res;
}

export async function findAllSmsApp(
  search?: SmsAppSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllSmsApp: SmsAppModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: SmsAppSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllSmsApp(search: $search, page: $page, sort: $sort) {
          id
          lbl
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const sms_app_models = data.findAllSmsApp;
  return sms_app_models;
}

export async function getListSmsApp() {
  const data = await findAllSmsApp(
    {
      is_enabled: [ 1 ],
    },
    undefined,
    [
      {
        prop: "order_by",
        order: "ascending",
      },
    ],
    {
      notLoading: true,
    },
  );
  return data;
}

/**
 * 导出Excel
 */
export function useExportExcelSmsSendRecord() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: SmsSendRecordSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: SmsSendRecordSearch, $sort: [SortInput!]) {
            findAllSmsSendRecord(search: $search, page: null, sort: $sort) {
              ${ smsSendRecordQueryField }
            }
            findAllSmsApp {
              lbl
            }
            getDict(codes: [
              "submail_sms_send_record_status",
            ]) {
              code
              lbl
            }
          }
        `,
        variables: {
          search,
          sort,
        },
      }, opt);
      for (const model of data.findAllSmsSendRecord) {
        await setLblById(model, true);
      }
      try {
        const sheetName = "短信发送记录";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/submail/sms_send_record.xlsx`,
          {
            sheetName,
            columns,
            data,
          },
        );
        saveAsExcel(buffer, sheetName);
      } catch (err) {
        ElMessage.error("导出失败");
        throw err;
      }
    } finally {
      loading.value = false;
    }
  }
  return {
    loading,
    workerFn: workerFn2,
    workerStatus,
    workerTerminate,
  };
}

export function getPagePathSmsSendRecord() {
  return "/submail/sms_send_record";
}

/** 新增时的默认值 */
export async function getDefaultInputSmsSendRecord() {
  const defaultInput: SmsSendRecordInput = {
    status: SmsSendRecordStatus.Success,
  };
  return defaultInput;
}
