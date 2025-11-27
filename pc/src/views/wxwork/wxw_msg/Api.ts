

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  wxwMsgQueryField,
} from "./Model.ts";

export async function setLblByIdWxwMsg(
  model?: WxwMsgModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputWxwMsg(
  model?: WxwMsgInput,
) {
  const input: WxwMsgInput = {
    // ID
    id: model?.id,
    // 企微应用
    wxw_app_id: model?.wxw_app_id,
    wxw_app_id_lbl: model?.wxw_app_id_lbl,
    // 发送状态
    errcode: model?.errcode,
    errcode_lbl: model?.errcode_lbl,
    // 成员ID
    touser: model?.touser,
    // 标题
    title: model?.title,
    // 描述
    description: model?.description,
    // 按钮文字
    btntxt: model?.btntxt,
    // 错误信息
    errmsg: model?.errmsg,
  };
  return input;
}

/**
 * 根据搜索条件查找 企微消息 列表
 */
export async function findAllWxwMsg(
  search?: WxwMsgSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllWxwMsg: WxwMsgModel[];
  } = await query({
    query: `
      query($search: WxwMsgSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllWxwMsg(search: $search, page: $page, sort: $sort) {
          ${ wxwMsgQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllWxwMsg;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxwMsg(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 企微消息
 */
export async function findOneWxwMsg(
  search?: WxwMsgSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneWxwMsg?: WxwMsgModel;
  } = await query({
    query: `
      query($search: WxwMsgSearch, $sort: [SortInput!]) {
        findOneWxwMsg(search: $search, sort: $sort) {
          ${ wxwMsgQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneWxwMsg;
  
  await setLblByIdWxwMsg(model);
  
  return model;
}

/**
 * 根据条件查找第一个 企微消息, 如果不存在则抛错
 */
export async function findOneOkWxwMsg(
  search?: WxwMsgSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkWxwMsg?: WxwMsgModel;
  } = await query({
    query: `
      query($search: WxwMsgSearch, $sort: [SortInput!]) {
        findOneOkWxwMsg(search: $search, sort: $sort) {
          ${ wxwMsgQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkWxwMsg;
  
  await setLblByIdWxwMsg(model);
  
  return model;
}

/**
 * 根据搜索条件查找 企微消息 总数
 */
export async function findCountWxwMsg(
  search?: WxwMsgSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountWxwMsg: Query["findCountWxwMsg"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxwMsgSearch) {
        findCountWxwMsg(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountWxwMsg;
  return count;
}

/**
 * 根据 id 查找 企微消息
 */
export async function findByIdWxwMsg(
  id: WxwMsgId,
  opt?: GqlOpt,
): Promise<WxwMsgModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdWxwMsg?: WxwMsgModel;
  } = await query({
    query: `
      query($id: WxwMsgId!) {
        findByIdWxwMsg(id: $id) {
          ${ wxwMsgQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdWxwMsg;
  
  await setLblByIdWxwMsg(model);
  
  return model;
}

/**
 * 根据 id 查找 企微消息, 如果不存在则抛错
 */
export async function findByIdOkWxwMsg(
  id: WxwMsgId,
  opt?: GqlOpt,
): Promise<WxwMsgModel> {
  
  const data: {
    findByIdOkWxwMsg: WxwMsgModel;
  } = await query({
    query: `
      query($id: WxwMsgId!) {
        findByIdOkWxwMsg(id: $id) {
          ${ wxwMsgQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkWxwMsg;
  
  await setLblByIdWxwMsg(model);
  
  return model;
}

/**
 * 根据 ids 查找 企微消息
 */
export async function findByIdsWxwMsg(
  ids: WxwMsgId[],
  opt?: GqlOpt,
): Promise<WxwMsgModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsWxwMsg: WxwMsgModel[];
  } = await query({
    query: `
      query($ids: [WxwMsgId!]!) {
        findByIdsWxwMsg(ids: $ids) {
          ${ wxwMsgQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsWxwMsg;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxwMsg(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 企微消息, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxwMsg(
  ids: WxwMsgId[],
  opt?: GqlOpt,
): Promise<WxwMsgModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkWxwMsg: WxwMsgModel[];
  } = await query({
    query: `
      query($ids: [WxwMsgId!]!) {
        findByIdsOkWxwMsg(ids: $ids) {
          ${ wxwMsgQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkWxwMsg;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxwMsg(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 企微消息
 */
export async function deleteByIdsWxwMsg(
  ids: WxwMsgId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsWxwMsg: Mutation["deleteByIdsWxwMsg"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxwMsgId!]!) {
        deleteByIdsWxwMsg(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsWxwMsg;
  return res;
}

/**
 * 根据 ids 还原 企微消息
 */
export async function revertByIdsWxwMsg(
  ids: WxwMsgId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsWxwMsg: Mutation["revertByIdsWxwMsg"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxwMsgId!]!) {
        revertByIdsWxwMsg(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsWxwMsg;
  return res;
}

/**
 * 根据 ids 彻底删除 企微消息
 */
export async function forceDeleteByIdsWxwMsg(
  ids: WxwMsgId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsWxwMsg: Mutation["forceDeleteByIdsWxwMsg"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxwMsgId!]!) {
        forceDeleteByIdsWxwMsg(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsWxwMsg;
  return res;
}

export async function findAllWxwApp(
  search?: WxwAppSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllWxwApp: WxwAppModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxwAppSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllWxwApp(search: $search, page: $page, sort: $sort) {
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
  const wxw_app_models = data.findAllWxwApp;
  return wxw_app_models;
}

export async function getListWxwApp() {
  const data = await findAllWxwApp(
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
export function useExportExcelWxwMsg() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: WxwMsgSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: WxwMsgSearch, $sort: [SortInput!]) {
            findAllWxwMsg(search: $search, page: null, sort: $sort) {
              ${ wxwMsgQueryField }
            }
            findAllWxwApp {
              lbl
            }
            getDict(codes: [
              "wxw_msg_errcode",
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
      for (const model of data.findAllWxwMsg) {
        await setLblByIdWxwMsg(model, true);
      }
      try {
        const sheetName = "企微消息";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/wxwork/wxw_msg.xlsx`,
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
 * 获取 企微消息 字段注释
 */
export async function getFieldCommentsWxwMsg(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsWxwMsg: Query["getFieldCommentsWxwMsg"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsWxwMsg {
          id,
          wxw_app_id,
          wxw_app_id_lbl,
          errcode,
          errcode_lbl,
          touser,
          title,
          description,
          btntxt,
          create_time,
          create_time_lbl,
          errmsg,
        }
      }
    `,
    variables: {
    },
  }, opt);
  
  const field_comments = data.getFieldCommentsWxwMsg as WxwMsgFieldComment;
  
  return field_comments;
}

export function getPagePathWxwMsg() {
  return "/wxwork/wxw_msg";
}

/** 新增时的默认值 */
export async function getDefaultInputWxwMsg() {
  const defaultInput: WxwMsgInput = {
  };
  return defaultInput;
}
