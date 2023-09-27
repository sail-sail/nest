import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
  WxwMsgSearch,
} from "#/types";

import type {
  WxwAppSearch,
} from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
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
  const res = data.findAllWxwMsg;
  for (let i = 0; i < res.length; i++) {
    const item = res[i];
  }
  return res;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
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
  const res = data.findCountWxwMsg;
  return res;
}

/**
 * 通过ID查找一条数据
 * @export findById
 * @param {string} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: string,
  opt?: GqlOpt,
) {
  const data: {
    findByIdWxwMsg: Query["findByIdWxwMsg"];
  } = await query({
    query: /* GraphQL */ `
      query($id: String!) {
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
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const res = data.findByIdWxwMsg;
  return res;
}

/**
 * 根据 ids 删除数据
 * @export deleteByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: string[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsWxwMsg: Mutation["deleteByIdsWxwMsg"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
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
 * 根据 ids 从回收站还原数据
 * @export revertByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: string[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsWxwMsg: Mutation["revertByIdsWxwMsg"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
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
 * 根据 ids 彻底删除数据
 * @export forceDeleteByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: string[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsWxwMsg: Mutation["forceDeleteByIdsWxwMsg"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
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
    undefined,
    {
    },
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
    nAsync,
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
            create_time_lbl
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
    const buffer = await workerFn(
      `${ location.origin }/import_template/wxwork/wxw_msg.xlsx`,
      {
        data,
      },
    );
    saveAsExcel(buffer, `${ await nAsync("企微消息") }${ await nsAsync("导入模板") }`);
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
    nAsync,
    nsAsync,
  } = useI18n(routePath);
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2(
    search?: WxwMsgSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
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
          getFieldCommentsWxwMsg {
            wxw_app_id_lbl
            errcode_lbl
            touser
            title
            description
            btntxt
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
      const buffer = await workerFn(
        `${ location.origin }/excel_template/wxwork/wxw_msg.xlsx`,
        {
          data,
        },
      );
      saveAsExcel(buffer, await nAsync("企微消息"));
    } catch (err) {
      ElMessage.error(await nsAsync("导出失败"));
      throw err;
    }
  }
  return {
    workerFn: workerFn2,
    workerStatus,
    workerTerminate,
  };
}
