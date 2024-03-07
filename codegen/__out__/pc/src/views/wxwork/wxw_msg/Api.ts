import type {
  WxwMsgId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
  WxwMsgSearch,
  WxwMsgInput,
  WxwMsgModel,
} from "#/types";

import type {
  WxwAppSearch,
} from "#/types";

async function setLblById(
  model?: WxwMsgModel | null,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
  model?: Record<string, any>,
) {
  const input: WxwMsgInput = {
    id: model?.id,
    wxw_app_id: model?.wxw_app_id,
    wxw_app_id_lbl: model?.wxw_app_id_lbl,
    errcode: model?.errcode,
    errcode_lbl: model?.errcode_lbl,
    touser: model?.touser,
    title: model?.title,
    description: model?.description,
    btntxt: model?.btntxt,
    create_time: model?.create_time,
    create_time_lbl: model?.create_time_lbl,
    errmsg: model?.errmsg,
  };
  return input;
}

/**
 * 根据搜索条件查找企微消息列表
 * @param {WxwMsgSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: WxwMsgSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllWxwMsg: Query["findAllWxwMsg"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxwMsgSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllWxwMsg(search: $search, page: $page, sort: $sort) {
          id
          wxw_app_id
          wxw_app_id_lbl
          errcode
          errcode_lbl
          touser
          title
          description
          btntxt
          create_time
          create_time_lbl
          errmsg
          is_deleted
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
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个企微消息
 * @param {WxwMsgSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: WxwMsgSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneWxwMsg: Query["findOneWxwMsg"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxwMsgSearch, $sort: [SortInput!]) {
        findOneWxwMsg(search: $search, sort: $sort) {
          id
          wxw_app_id
          wxw_app_id_lbl
          errcode
          errcode_lbl
          touser
          title
          description
          btntxt
          create_time
          create_time_lbl
          errmsg
          is_deleted
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneWxwMsg;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找企微消息总数
 * @param {WxwMsgSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
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
 * 根据 id 查找企微消息
 * @param {WxwMsgId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: WxwMsgId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdWxwMsg: Query["findByIdWxwMsg"];
  } = await query({
    query: /* GraphQL */ `
      query($id: WxwMsgId!) {
        findByIdWxwMsg(id: $id) {
          id
          wxw_app_id
          wxw_app_id_lbl
          errcode
          errcode_lbl
          touser
          title
          description
          btntxt
          create_time
          create_time_lbl
          errmsg
          is_deleted
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdWxwMsg;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除企微消息
 * @param {WxwMsgId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: WxwMsgId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 还原企微消息
 * @param {WxwMsgId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: WxwMsgId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 彻底删除企微消息
 * @param {WxwMsgId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: WxwMsgId[],
  opt?: GqlOpt,
) {
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
    findAllWxwApp: Query["findAllWxwApp"];
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
  const res = data.findAllWxwApp;
  return res;
}

export async function getWxwAppList() {
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
 * 下载导入模板
 */
export function useDownloadImportTemplate(routePath: string) {
  const {
    nsAsync,
  } = useI18n(routePath);
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsWxwMsg {
            wxw_app_id_lbl
            errcode_lbl
            touser
            title
            description
            btntxt
            errmsg
          }
          findAllWxwApp {
            id
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
      },
    });
    try {
      const sheetName = await nsAsync("企微消息");
      const buffer = await workerFn(
        `${ location.origin }/import_template/wxwork/wxw_msg.xlsx`,
        {
          sheetName,
          data,
        },
      );
      saveAsExcel(buffer, `${ sheetName }${ await nsAsync("导入") }`);
    } catch (err) {
      ElMessage.error(await nsAsync("下载失败"));
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
export function useExportExcel(routePath: string) {
  const {
    nsAsync,
  } = useI18n(routePath);
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
        query: /* GraphQL */ `
          query($search: WxwMsgSearch, $sort: [SortInput!]) {
            findAllWxwMsg(search: $search, sort: $sort) {
              id
              wxw_app_id
              wxw_app_id_lbl
              errcode
              errcode_lbl
              touser
              title
              description
              btntxt
              create_time
              create_time_lbl
              errmsg
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
      try {
        const sheetName = await nsAsync("企微消息");
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
        ElMessage.error(await nsAsync("导出失败"));
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

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: WxwMsgInput = {
  };
  return defaultInput;
}
