import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  messageQueryField,
} from "./Model.ts";

export async function setLblByIdMessage(
  model?: MessageModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputMessage(
  model?: MessageInput | null,
) {
  const input: MessageInput = {
    // ID
    id: model?.id,
    // 分类
    category: model?.category,
    category_lbl: model?.category_lbl,
    // 发送通道
    channel: model?.channel,
    channel_lbl: model?.channel_lbl,
    // 标题
    title: model?.title,
    // 内容
    content: model?.content,
    // 跳转路由
    route_path: model?.route_path,
    // 跳转参数
    route_query: model?.route_query,
    // 发送人
    sender_usr_id: model?.sender_usr_id,
    sender_usr_id_lbl: model?.sender_usr_id_lbl,
    // 系统消息
    is_sys_msg: model?.is_sys_msg,
    is_sys_msg_lbl: model?.is_sys_msg_lbl,
    // 置顶
    is_pinned: model?.is_pinned,
    is_pinned_lbl: model?.is_pinned_lbl,
    // 所属组织
    org_id: model?.org_id,
    org_id_lbl: model?.org_id_lbl,
  };
  return input;
}

/**
 * 根据搜索条件查找 消息 列表
 */
export async function findAllMessage(
  search?: MessageSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllMessage: MessageModel[];
  } = await query({
    query: `
      query($search: MessageSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllMessage(search: $search, page: $page, sort: $sort) {
          ${ messageQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllMessage;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdMessage(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 消息
 */
export async function findOneMessage(
  search?: MessageSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneMessage?: MessageModel;
  } = await query({
    query: `
      query($search: MessageSearch, $sort: [SortInput!]) {
        findOneMessage(search: $search, sort: $sort) {
          ${ messageQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneMessage;
  
  await setLblByIdMessage(model);
  
  return model;
}

/**
 * 根据条件查找第一个 消息, 如果不存在则抛错
 */
export async function findOneOkMessage(
  search?: MessageSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkMessage?: MessageModel;
  } = await query({
    query: `
      query($search: MessageSearch, $sort: [SortInput!]) {
        findOneOkMessage(search: $search, sort: $sort) {
          ${ messageQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkMessage;
  
  await setLblByIdMessage(model);
  
  return model;
}

/**
 * 根据搜索条件查找 消息 总数
 */
export async function findCountMessage(
  search?: MessageSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountMessage: Query["findCountMessage"];
  } = await query({
    query: /* GraphQL */ `
      query($search: MessageSearch) {
        findCountMessage(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountMessage;
  return count;
}

/**
 * 创建 消息
 */
export async function createMessage(
  input: MessageInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<MessageId> {
  const ids = await createsMessage(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 消息
 */
export async function createsMessage(
  inputs: MessageInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<MessageId[]> {
  inputs = inputs.map(intoInputMessage);
  const data: {
    createsMessage: Mutation["createsMessage"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [MessageInput!]!, $unique_type: UniqueType) {
        createsMessage(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsMessage;
  return ids;
}

/**
 * 根据 id 修改 消息
 */
export async function updateByIdMessage(
  id: MessageId,
  input: MessageInput,
  opt?: GqlOpt,
): Promise<MessageId> {
  input = intoInputMessage(input);
  const data: {
    updateByIdMessage: Mutation["updateByIdMessage"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: MessageId!, $input: MessageInput!) {
        updateByIdMessage(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: MessageId = data.updateByIdMessage;
  return id2;
}

/**
 * 根据 id 查找 消息
 */
export async function findByIdMessage(
  id: MessageId,
  opt?: GqlOpt,
): Promise<MessageModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdMessage?: MessageModel;
  } = await query({
    query: `
      query($id: MessageId!) {
        findByIdMessage(id: $id) {
          ${ messageQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdMessage;
  
  await setLblByIdMessage(model);
  
  return model;
}

/**
 * 根据 id 查找 消息, 如果不存在则抛错
 */
export async function findByIdOkMessage(
  id: MessageId,
  opt?: GqlOpt,
): Promise<MessageModel> {
  
  const data: {
    findByIdOkMessage: MessageModel;
  } = await query({
    query: `
      query($id: MessageId!) {
        findByIdOkMessage(id: $id) {
          ${ messageQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkMessage;
  
  await setLblByIdMessage(model);
  
  return model;
}

/**
 * 根据 ids 查找 消息
 */
export async function findByIdsMessage(
  ids: MessageId[],
  opt?: GqlOpt,
): Promise<MessageModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsMessage: MessageModel[];
  } = await query({
    query: `
      query($ids: [MessageId!]!) {
        findByIdsMessage(ids: $ids) {
          ${ messageQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsMessage;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdMessage(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 消息, 出现查询不到的 id 则报错
 */
export async function findByIdsOkMessage(
  ids: MessageId[],
  opt?: GqlOpt,
): Promise<MessageModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkMessage: MessageModel[];
  } = await query({
    query: `
      query($ids: [MessageId!]!) {
        findByIdsOkMessage(ids: $ids) {
          ${ messageQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkMessage;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdMessage(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 消息
 */
export async function deleteByIdsMessage(
  ids: MessageId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsMessage: Mutation["deleteByIdsMessage"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [MessageId!]!) {
        deleteByIdsMessage(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsMessage;
  return res;
}

/**
 * 根据 ids 还原 消息
 */
export async function revertByIdsMessage(
  ids: MessageId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsMessage: Mutation["revertByIdsMessage"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [MessageId!]!) {
        revertByIdsMessage(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsMessage;
  return res;
}

/**
 * 根据 ids 彻底删除 消息
 */
export async function forceDeleteByIdsMessage(
  ids: MessageId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsMessage: Mutation["forceDeleteByIdsMessage"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [MessageId!]!) {
        forceDeleteByIdsMessage(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsMessage;
  return res;
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
 * 下载 消息 导入模板
 */
export function useDownloadImportTemplateMessage() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsMessage {
            category_lbl
            channel_lbl
            title
            content
            route_path
            route_query
            sender_usr_id_lbl
            is_sys_msg_lbl
            is_pinned_lbl
            org_id_lbl
          }
          findAllUsr {
            id
            lbl
          }
          findAllOrg {
            id
            lbl
          }
          getDict(codes: [
            "message_category",
            "message_channel",
            "yes_no",
            "yes_no",
          ]) {
            code
            lbl
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "消息";
      const buffer = await workerFn(
        `${ location.origin }${ location.pathname }/import_template/base/message.xlsx`,
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
export function useExportExcelMessage() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: MessageSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: MessageSearch, $page: PageInput, $sort: [SortInput!]) {
            findAllMessage(search: $search, page: $page, sort: $sort) {
              ${ messageQueryField }
            }
            findAllUsr {
              lbl
            }
            findAllOrg {
              lbl
            }
            getDict(codes: [
              "message_category",
              "message_channel",
              "yes_no",
              "yes_no",
            ]) {
              code
              lbl
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
      for (const model of data.findAllMessage) {
        await setLblByIdMessage(model, true);
      }
      try {
        const sheetName = "消息";
        const buffer = await workerFn(
          `${ location.origin }${ location.pathname }/excel_template/base/message.xlsx`,
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
 * 批量导入 消息
 */
export async function importModelsMessage(
  inputs: MessageInput[],
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
      await createsMessage(
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
 * 获取 消息 字段注释
 */
export async function getFieldCommentsMessage(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsMessage: Query["getFieldCommentsMessage"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsMessage {
          id,
          category,
          category_lbl,
          channel,
          channel_lbl,
          title,
          content,
          route_path,
          route_query,
          sender_usr_id,
          sender_usr_id_lbl,
          is_sys_msg,
          is_sys_msg_lbl,
          is_pinned,
          is_pinned_lbl,
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
  
  const field_comments = data.getFieldCommentsMessage as MessageFieldComment;
  
  return field_comments;
}

export function getPagePathMessage() {
  return "/base/message";
}

/** 新增时的默认值 */
export async function getDefaultInputMessage() {
  const usrStore = useUsrStore();
  const defaultInput: MessageInput = {
    channel: "sys",
    is_sys_msg: 0,
    is_pinned: 0,
    org_id: usrStore.loginInfo?.org_id,
  };
  return defaultInput;
}
