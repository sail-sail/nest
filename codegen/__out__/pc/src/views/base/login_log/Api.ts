import type {
  LoginLogId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
  LoginLogSearch,
  LoginLogInput,
  LoginLogModel,
} from "#/types";

async function setLblById(
  model?: LoginLogModel | null,
) {
  if (!model) {
    return;
  }
}

/**
 * 根据搜索条件查找登录日志列表
 * @param {LoginLogSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: LoginLogSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllLoginLog: Query["findAllLoginLog"];
  } = await query({
    query: /* GraphQL */ `
      query($search: LoginLogSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllLoginLog(search: $search, page: $page, sort: $sort) {
          id
          username
          is_succ
          is_succ_lbl
          ip
          create_usr_id
          create_usr_id_lbl
          create_time
          create_time_lbl
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
  const models = data.findAllLoginLog;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个登录日志
 * @param {LoginLogSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: LoginLogSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneLoginLog: Query["findOneLoginLog"];
  } = await query({
    query: /* GraphQL */ `
      query($search: LoginLogSearch, $sort: [SortInput!]) {
        findOneLoginLog(search: $search, sort: $sort) {
          id
          username
          is_succ
          is_succ_lbl
          ip
          create_usr_id
          create_usr_id_lbl
          create_time
          create_time_lbl
          is_deleted
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneLoginLog;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找登录日志总数
 * @param {LoginLogSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: LoginLogSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountLoginLog: Query["findCountLoginLog"];
  } = await query({
    query: /* GraphQL */ `
      query($search: LoginLogSearch) {
        findCountLoginLog(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountLoginLog;
  return count;
}

/**
 * 根据 id 查找登录日志
 * @param {LoginLogId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: LoginLogId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdLoginLog: Query["findByIdLoginLog"];
  } = await query({
    query: /* GraphQL */ `
      query($id: LoginLogId!) {
        findByIdLoginLog(id: $id) {
          id
          username
          is_succ
          is_succ_lbl
          ip
          create_usr_id
          create_usr_id_lbl
          create_time
          create_time_lbl
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdLoginLog;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除登录日志
 * @param {LoginLogId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: LoginLogId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsLoginLog: Mutation["deleteByIdsLoginLog"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [LoginLogId!]!) {
        deleteByIdsLoginLog(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsLoginLog;
  return res;
}

/**
 * 根据 ids 还原登录日志
 * @param {LoginLogId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: LoginLogId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsLoginLog: Mutation["revertByIdsLoginLog"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [LoginLogId!]!) {
        revertByIdsLoginLog(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsLoginLog;
  return res;
}

/**
 * 根据 ids 彻底删除登录日志
 * @param {LoginLogId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: LoginLogId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsLoginLog: Mutation["forceDeleteByIdsLoginLog"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [LoginLogId!]!) {
        forceDeleteByIdsLoginLog(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsLoginLog;
  return res;
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
          getFieldCommentsLoginLog {
            username
            is_succ_lbl
            ip
          }
          getDict(codes: [
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
    const buffer = await workerFn(
      `${ location.origin }/import_template/base/login_log.xlsx`,
      {
        data,
      },
    );
    saveAsExcel(buffer, `${ await nAsync("登录日志") }${ await nsAsync("导入") }`);
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
    search?: LoginLogSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const data = await query({
      query: /* GraphQL */ `
        query($search: LoginLogSearch, $sort: [SortInput!]) {
          findAllLoginLog(search: $search, sort: $sort) {
            id
            username
            is_succ
            is_succ_lbl
            ip
            create_usr_id
            create_usr_id_lbl
            create_time
            create_time_lbl
          }
          getFieldCommentsLoginLog {
            username
            is_succ_lbl
            ip
            create_usr_id_lbl
            create_time_lbl
          }
          getDict(codes: [
            "yes_no",
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
        `${ location.origin }/excel_template/base/login_log.xlsx`,
        {
          data,
        },
      );
      saveAsExcel(buffer, await nAsync("登录日志"));
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

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: LoginLogInput = {
    is_succ: 0,
  };
  return defaultInput;
}
