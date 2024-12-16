import cfg from "@/utils/config";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  wxwMsgQueryField,
} from "./Model";

async function setLblById(
  model?: WxwMsgModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
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
 * 根据搜索条件查找企微消息列表
 */
export async function findAll(
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
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个企微消息
 */
export async function findOne(
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
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找企微消息总数
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
 */
export async function findById(
  id: WxwMsgId,
  opt?: GqlOpt,
) {
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
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除企微消息
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
 * 下载企微消息导入模板
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
        await setLblById(model, true);
      }
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

export function getPagePath() {
  return "/wxwork/wxw_msg";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: WxwMsgInput = {
  };
  return defaultInput;
}
