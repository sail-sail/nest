import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  messageReceiverQueryField,
} from "./Model.ts";

export async function setLblByIdMessageReceiver(
  model?: MessageReceiverModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputMessageReceiver(
  model?: MessageReceiverInput | null,
) {
  const input: MessageReceiverInput = {
    // ID
    id: model?.id,
    // 消息
    message_id: model?.message_id,
    message_id_content: model?.message_id_content,
    // 接收人
    receiver_usr_id: model?.receiver_usr_id,
    receiver_usr_id_lbl: model?.receiver_usr_id_lbl,
    // 已读
    is_read: model?.is_read,
    is_read_lbl: model?.is_read_lbl,
    // 阅读时间
    read_time: model?.read_time,
    read_time_lbl: model?.read_time_lbl,
    read_time_save_null: model?.read_time_save_null,
    // 所属组织
    org_id: model?.org_id,
    org_id_lbl: model?.org_id_lbl,
  };
  return input;
}

/**
 * 根据搜索条件查找 消息接收人 列表
 */
export async function findAllMessageReceiver(
  search?: MessageReceiverSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllMessageReceiver: MessageReceiverModel[];
  } = await query({
    query: `
      query($search: MessageReceiverSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllMessageReceiver(search: $search, page: $page, sort: $sort) {
          ${ messageReceiverQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllMessageReceiver;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdMessageReceiver(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 消息接收人
 */
export async function findOneMessageReceiver(
  search?: MessageReceiverSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneMessageReceiver?: MessageReceiverModel;
  } = await query({
    query: `
      query($search: MessageReceiverSearch, $sort: [SortInput!]) {
        findOneMessageReceiver(search: $search, sort: $sort) {
          ${ messageReceiverQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneMessageReceiver;
  
  await setLblByIdMessageReceiver(model);
  
  return model;
}

/**
 * 根据条件查找第一个 消息接收人, 如果不存在则抛错
 */
export async function findOneOkMessageReceiver(
  search?: MessageReceiverSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkMessageReceiver?: MessageReceiverModel;
  } = await query({
    query: `
      query($search: MessageReceiverSearch, $sort: [SortInput!]) {
        findOneOkMessageReceiver(search: $search, sort: $sort) {
          ${ messageReceiverQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkMessageReceiver;
  
  await setLblByIdMessageReceiver(model);
  
  return model;
}

/**
 * 根据搜索条件查找 消息接收人 总数
 */
export async function findCountMessageReceiver(
  search?: MessageReceiverSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountMessageReceiver: Query["findCountMessageReceiver"];
  } = await query({
    query: /* GraphQL */ `
      query($search: MessageReceiverSearch) {
        findCountMessageReceiver(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountMessageReceiver;
  return count;
}

/**
 * 创建 消息接收人
 */
export async function createMessageReceiver(
  input: MessageReceiverInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<MessageReceiverId> {
  const ids = await createsMessageReceiver(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 消息接收人
 */
export async function createsMessageReceiver(
  inputs: MessageReceiverInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<MessageReceiverId[]> {
  inputs = inputs.map(intoInputMessageReceiver);
  const data: {
    createsMessageReceiver: Mutation["createsMessageReceiver"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [MessageReceiverInput!]!, $unique_type: UniqueType) {
        createsMessageReceiver(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsMessageReceiver;
  return ids;
}

/**
 * 根据 id 修改 消息接收人
 */
export async function updateByIdMessageReceiver(
  id: MessageReceiverId,
  input: MessageReceiverInput,
  opt?: GqlOpt,
): Promise<MessageReceiverId> {
  input = intoInputMessageReceiver(input);
  const data: {
    updateByIdMessageReceiver: Mutation["updateByIdMessageReceiver"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: MessageReceiverId!, $input: MessageReceiverInput!) {
        updateByIdMessageReceiver(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: MessageReceiverId = data.updateByIdMessageReceiver;
  return id2;
}

/**
 * 根据 id 查找 消息接收人
 */
export async function findByIdMessageReceiver(
  id: MessageReceiverId,
  opt?: GqlOpt,
): Promise<MessageReceiverModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdMessageReceiver?: MessageReceiverModel;
  } = await query({
    query: `
      query($id: MessageReceiverId!) {
        findByIdMessageReceiver(id: $id) {
          ${ messageReceiverQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdMessageReceiver;
  
  await setLblByIdMessageReceiver(model);
  
  return model;
}

/**
 * 根据 id 查找 消息接收人, 如果不存在则抛错
 */
export async function findByIdOkMessageReceiver(
  id: MessageReceiverId,
  opt?: GqlOpt,
): Promise<MessageReceiverModel> {
  
  const data: {
    findByIdOkMessageReceiver: MessageReceiverModel;
  } = await query({
    query: `
      query($id: MessageReceiverId!) {
        findByIdOkMessageReceiver(id: $id) {
          ${ messageReceiverQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkMessageReceiver;
  
  await setLblByIdMessageReceiver(model);
  
  return model;
}

/**
 * 根据 ids 查找 消息接收人
 */
export async function findByIdsMessageReceiver(
  ids: MessageReceiverId[],
  opt?: GqlOpt,
): Promise<MessageReceiverModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsMessageReceiver: MessageReceiverModel[];
  } = await query({
    query: `
      query($ids: [MessageReceiverId!]!) {
        findByIdsMessageReceiver(ids: $ids) {
          ${ messageReceiverQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsMessageReceiver;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdMessageReceiver(model);
  }
  
  return models;
}

/**
 * 根据搜索条件判断消息接收人是否存在
 */
export async function existsMessageReceiver(
  search?: MessageReceiverSearch,
  opt?: GqlOpt,
): Promise<boolean> {
  
  const data: {
    existsMessageReceiver: Query["existsMessageReceiver"];
  } = await query({
    query: /* GraphQL */ `
      query($search: MessageReceiverSearch) {
        existsMessageReceiver(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  
  const res = data.existsMessageReceiver;
  
  return res;
}

/**
 * 根据 ids 查找 消息接收人, 出现查询不到的 id 则报错
 */
export async function findByIdsOkMessageReceiver(
  ids: MessageReceiverId[],
  opt?: GqlOpt,
): Promise<MessageReceiverModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkMessageReceiver: MessageReceiverModel[];
  } = await query({
    query: `
      query($ids: [MessageReceiverId!]!) {
        findByIdsOkMessageReceiver(ids: $ids) {
          ${ messageReceiverQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkMessageReceiver;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdMessageReceiver(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 消息接收人
 */
export async function deleteByIdsMessageReceiver(
  ids: MessageReceiverId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsMessageReceiver: Mutation["deleteByIdsMessageReceiver"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [MessageReceiverId!]!) {
        deleteByIdsMessageReceiver(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsMessageReceiver;
  return res;
}

/**
 * 根据 ids 还原 消息接收人
 */
export async function revertByIdsMessageReceiver(
  ids: MessageReceiverId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsMessageReceiver: Mutation["revertByIdsMessageReceiver"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [MessageReceiverId!]!) {
        revertByIdsMessageReceiver(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsMessageReceiver;
  return res;
}

/**
 * 根据 ids 彻底删除 消息接收人
 */
export async function forceDeleteByIdsMessageReceiver(
  ids: MessageReceiverId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsMessageReceiver: Mutation["forceDeleteByIdsMessageReceiver"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [MessageReceiverId!]!) {
        forceDeleteByIdsMessageReceiver(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsMessageReceiver;
  return res;
}

export async function findAllMessage(
  search?: MessageSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllMessage: MessageModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: MessageSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllMessage(search: $search, page: $page, sort: $sort) {
          id
          content
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const message_models = data.findAllMessage;
  return message_models;
}

export async function getListMessage() {
  const data = await findAllMessage(
    undefined,
    undefined,
    [
      {
        prop: "create_time",
        order: "descending",
      },
    ],
    {
      notLoading: true,
    },
  );
  return data;
}

export async function findAllUsr(
  search?: UsrSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllUsr: UsrModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: UsrSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllUsr(search: $search, page: $page, sort: $sort) {
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
  const usr_models = data.findAllUsr;
  return usr_models;
}

export async function getListUsr() {
  const data = await findAllUsr(
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

export async function findAllOrg(
  search?: OrgSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllOrg: OrgModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: OrgSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllOrg(search: $search, page: $page, sort: $sort) {
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
  const org_models = data.findAllOrg;
  return org_models;
}

export async function getListOrg() {
  const data = await findAllOrg(
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
 * 下载 消息接收人 导入模板
 */
export function useDownloadImportTemplateMessageReceiver() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsMessageReceiver {
            message_id_lbl
            receiver_usr_id_lbl
            is_read_lbl
            read_time_lbl
            org_id_lbl
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "消息接收人";
      const buffer = await workerFn(
        `${ location.origin }${ location.pathname }/import_template/base/message_receiver.xlsx`,
        {
          sheetName,
          data,
        },
      );
      saveAsExcel(buffer, `${ sheetName}导入`);
    } catch (err) {
      ElMessage.error("下载失败");
      throw err;
    }
  }
  return {
    workerFn: workerFn2,
    workerStatus,
    workerTerminate,
  };
}

/**
 * 导出Excel
 */
export function useExportExcelMessageReceiver() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: MessageReceiverSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: MessageReceiverSearch, $page: PageInput, $sort: [SortInput!]) {
            findAllMessageReceiver(search: $search, page: $page, sort: $sort) {
              ${ messageReceiverQueryField }
            }
          }
        `,
        variables: {
          search,
          page: {
            isResultLimit: false,
          },
          sort,
        },
      }, opt);
      for (const model of data.findAllMessageReceiver) {
        await setLblByIdMessageReceiver(model, true);
      }
      try {
        const sheetName = "消息接收人";
        const buffer = await workerFn(
          `${ location.origin }${ location.pathname }/excel_template/base/message_receiver.xlsx`,
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

/**
 * 批量导入 消息接收人
 */
export async function importModelsMessageReceiver(
  inputs: MessageReceiverInput[],
  percentage: Ref<number>,
  isCancel: Ref<boolean>,
  opt?: GqlOpt,
) {
  opt = opt || { };
  opt.showErrMsg = false;
  opt.notLoading = true;
  
  let succNum = 0;
  let failNum = 0;
  const failErrMsgs: string[] = [ ];
  percentage.value = 0;
  
  const len = inputs.length;
  const inputsArr = splitCreateArr(inputs);
  
  let i = 0;
  for (const inputs of inputsArr) {
    if (isCancel.value) {
      break;
    }
    
    i += inputs.length;
    
    try {
      await createsMessageReceiver(
        inputs,
        UniqueType.Update,
        opt,
      );
      succNum += inputs.length;
    } catch (err) {
      failNum += inputs.length;
      failErrMsgs.push(`批量导入第 ${ i + 1 - inputs.length } 至 ${ i + 1 } 行时失败: ${ err }`);
    }
    
    percentage.value = Math.floor((i + 1) / len * 100);
  }
  
  return showUploadMsg(succNum, failNum, failErrMsgs);
}

/**
 * 获取 消息接收人 字段注释
 */
export async function getFieldCommentsMessageReceiver(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsMessageReceiver: Query["getFieldCommentsMessageReceiver"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsMessageReceiver {
          id,
          message_id,
          message_id_lbl,
          receiver_usr_id,
          receiver_usr_id_lbl,
          is_read,
          is_read_lbl,
          read_time,
          read_time_lbl,
          org_id,
          org_id_lbl,
          create_usr_id,
          create_usr_id_lbl,
          create_time,
          create_time_lbl,
          update_usr_id,
          update_usr_id_lbl,
          update_time,
          update_time_lbl,
        }
      }
    `,
    variables: {
    },
  }, opt);
  
  const field_comments = data.getFieldCommentsMessageReceiver as MessageReceiverFieldComment;
  
  return field_comments;
}

export function getPagePathMessageReceiver() {
  return "/base/message_receiver";
}

/** 新增时的默认值 */
export async function getDefaultInputMessageReceiver() {
  const usrStore = useUsrStore();
  const defaultInput: MessageReceiverInput = {
    is_read: 0,
    org_id: usrStore.loginInfo?.org_id,
  };
  return defaultInput;
}
