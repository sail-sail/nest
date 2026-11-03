import {
  UniqueType,
} from "#/types.ts";

import {
  importModelsByChunk,
} from "@/utils/excel_util.ts";

import {
  TsdbAppType,
  TsdbAppProtocol,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  tsdbAppQueryField,
} from "./Model.ts";

export async function setLblByIdTsdbApp(
  model?: TsdbAppModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputTsdbApp(
  model?: TsdbAppInput | null,
) {
  const input: TsdbAppInput = {
    // ID
    id: model?.id,
    // 名称
    lbl: model?.lbl,
    // 类型
    type: model?.type,
    type_lbl: model?.type_lbl,
    // 协议
    protocol: model?.protocol,
    protocol_lbl: model?.protocol_lbl,
    // 主机名
    hostname: model?.hostname,
    // 端口
    port: model?.port != null ? Number(model?.port || 0) : undefined,
    // 数据库
    database: model?.database,
    // 令牌
    token: model?.token,
    // 启用
    is_enabled: model?.is_enabled,
    is_enabled_lbl: model?.is_enabled_lbl,
    // 排序
    order_by: model?.order_by != null ? Number(model?.order_by || 0) : undefined,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找 时序数据库 列表
 */
export async function findAllTsdbApp(
  search?: TsdbAppSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllTsdbApp: TsdbAppModel[];
  } = await query({
    query: `
      query($search: TsdbAppSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllTsdbApp(search: $search, page: $page, sort: $sort) {
          ${ tsdbAppQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllTsdbApp;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdTsdbApp(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 时序数据库
 */
export async function findOneTsdbApp(
  search?: TsdbAppSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneTsdbApp?: TsdbAppModel;
  } = await query({
    query: `
      query($search: TsdbAppSearch, $sort: [SortInput!]) {
        findOneTsdbApp(search: $search, sort: $sort) {
          ${ tsdbAppQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneTsdbApp;
  
  await setLblByIdTsdbApp(model);
  
  return model;
}

/**
 * 根据条件查找第一个 时序数据库, 如果不存在则抛错
 */
export async function findOneOkTsdbApp(
  search?: TsdbAppSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkTsdbApp?: TsdbAppModel;
  } = await query({
    query: `
      query($search: TsdbAppSearch, $sort: [SortInput!]) {
        findOneOkTsdbApp(search: $search, sort: $sort) {
          ${ tsdbAppQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkTsdbApp;
  
  await setLblByIdTsdbApp(model);
  
  return model;
}

/**
 * 根据搜索条件查找 时序数据库 总数
 */
export async function findCountTsdbApp(
  search?: TsdbAppSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountTsdbApp: Query["findCountTsdbApp"];
  } = await query({
    query: /* GraphQL */ `
      query($search: TsdbAppSearch) {
        findCountTsdbApp(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountTsdbApp;
  return count;
}

/**
 * 创建 时序数据库
 */
export async function createTsdbApp(
  input: TsdbAppInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<TsdbAppId> {
  const ids = await createsTsdbApp(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 时序数据库
 */
export async function createsTsdbApp(
  inputs: TsdbAppInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<TsdbAppId[]> {
  inputs = inputs.map(intoInputTsdbApp);
  const data: {
    createsTsdbApp: Mutation["createsTsdbApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [TsdbAppInput!]!, $unique_type: UniqueType) {
        createsTsdbApp(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsTsdbApp;
  return ids;
}

/**
 * 根据 id 修改 时序数据库
 */
export async function updateByIdTsdbApp(
  id: TsdbAppId,
  input: TsdbAppInput,
  opt?: GqlOpt,
): Promise<TsdbAppId> {
  input = intoInputTsdbApp(input);
  const data: {
    updateByIdTsdbApp: Mutation["updateByIdTsdbApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: TsdbAppId!, $input: TsdbAppInput!) {
        updateByIdTsdbApp(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: TsdbAppId = data.updateByIdTsdbApp;
  return id2;
}

/**
 * 根据 id 查找 时序数据库
 */
export async function findByIdTsdbApp(
  id: TsdbAppId,
  opt?: GqlOpt,
): Promise<TsdbAppModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdTsdbApp?: TsdbAppModel;
  } = await query({
    query: `
      query($id: TsdbAppId!) {
        findByIdTsdbApp(id: $id) {
          ${ tsdbAppQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdTsdbApp;
  
  await setLblByIdTsdbApp(model);
  
  return model;
}

/**
 * 根据 id 查找 时序数据库, 如果不存在则抛错
 */
export async function findByIdOkTsdbApp(
  id: TsdbAppId,
  opt?: GqlOpt,
): Promise<TsdbAppModel> {
  
  const data: {
    findByIdOkTsdbApp: TsdbAppModel;
  } = await query({
    query: `
      query($id: TsdbAppId!) {
        findByIdOkTsdbApp(id: $id) {
          ${ tsdbAppQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkTsdbApp;
  
  await setLblByIdTsdbApp(model);
  
  return model;
}

/**
 * 根据 ids 查找 时序数据库
 */
export async function findByIdsTsdbApp(
  ids: TsdbAppId[],
  opt?: GqlOpt,
): Promise<TsdbAppModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsTsdbApp: TsdbAppModel[];
  } = await query({
    query: `
      query($ids: [TsdbAppId!]!) {
        findByIdsTsdbApp(ids: $ids) {
          ${ tsdbAppQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsTsdbApp;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdTsdbApp(model);
  }
  
  return models;
}

/**
 * 根据搜索条件判断时序数据库是否存在
 */
export async function existsTsdbApp(
  search?: TsdbAppSearch,
  opt?: GqlOpt,
): Promise<boolean> {
  
  const data: {
    existsTsdbApp: Query["existsTsdbApp"];
  } = await query({
    query: /* GraphQL */ `
      query($search: TsdbAppSearch) {
        existsTsdbApp(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  
  const res = data.existsTsdbApp;
  
  return res;
}

/**
 * 根据 ids 查找 时序数据库, 出现查询不到的 id 则报错
 */
export async function findByIdsOkTsdbApp(
  ids: TsdbAppId[],
  opt?: GqlOpt,
): Promise<TsdbAppModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkTsdbApp: TsdbAppModel[];
  } = await query({
    query: `
      query($ids: [TsdbAppId!]!) {
        findByIdsOkTsdbApp(ids: $ids) {
          ${ tsdbAppQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkTsdbApp;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdTsdbApp(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 时序数据库
 */
export async function deleteByIdsTsdbApp(
  ids: TsdbAppId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsTsdbApp: Mutation["deleteByIdsTsdbApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [TsdbAppId!]!) {
        deleteByIdsTsdbApp(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsTsdbApp;
  return res;
}

/**
 * 根据 ids 启用或禁用 时序数据库
 */
export async function enableByIdsTsdbApp(
  ids: TsdbAppId[],
  is_enabled: number,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    enableByIdsTsdbApp: Mutation["enableByIdsTsdbApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [TsdbAppId!]!, $is_enabled: Int!) {
        enableByIdsTsdbApp(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsTsdbApp;
  return res;
}

/**
 * 根据 ids 还原 时序数据库
 */
export async function revertByIdsTsdbApp(
  ids: TsdbAppId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsTsdbApp: Mutation["revertByIdsTsdbApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [TsdbAppId!]!) {
        revertByIdsTsdbApp(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsTsdbApp;
  return res;
}

/**
 * 根据 ids 彻底删除 时序数据库
 */
export async function forceDeleteByIdsTsdbApp(
  ids: TsdbAppId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsTsdbApp: Mutation["forceDeleteByIdsTsdbApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [TsdbAppId!]!) {
        forceDeleteByIdsTsdbApp(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsTsdbApp;
  return res;
}

/**
 * 下载 时序数据库 导入模板
 */
export function useDownloadImportTemplateTsdbApp() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsTsdbApp {
            lbl
            type_lbl
            protocol_lbl
            hostname
            port
            database
            token
            order_by
            rem
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "时序数据库";
      const buffer = await workerFn(
        `${ location.origin }${ location.pathname }/import_template/tsdb/tsdb_app.xlsx`,
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
export function useExportExcelTsdbApp() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: TsdbAppSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: TsdbAppSearch, $page: PageInput, $sort: [SortInput!]) {
            findAllTsdbApp(search: $search, page: $page, sort: $sort) {
              ${ tsdbAppQueryField }
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
      for (const model of data.findAllTsdbApp) {
        await setLblByIdTsdbApp(model, true);
      }
      try {
        const sheetName = "时序数据库";
        const buffer = await workerFn(
          `${ location.origin }${ location.pathname }/excel_template/tsdb/tsdb_app.xlsx`,
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
 * 批量导入 时序数据库
 */
export async function importModelsTsdbApp(
  inputs: TsdbAppInput[],
  percentage: Ref<number>,
  isCancel: Ref<boolean>,
  opt?: GqlOpt,
) {
  opt = opt || { };
  opt.showErrMsg = false;
  opt.notLoading = true;
  
  // 后端 creates 为单事务: 一批中任意一条失败则整批回滚, 无法直接得知出错的行;
  // importModelsByChunk 在失败时二分拆分重试, 以定位到具体行并给出准确的成败条数
  return importModelsByChunk(
    inputs,
    (items) => createsTsdbApp(
      items,
      UniqueType.Update,
      opt,
    ),
    percentage,
    isCancel,
    (rowStart, rowEnd, err) => rowStart === rowEnd
      ? `第 ${ rowStart } 行导入失败: ${ err }`
      : `第 ${ rowStart } 至 ${ rowEnd } 行导入失败(整批回滚): ${ err }`,
  );
}

/**
 * 查找 时序数据库 order_by 字段的最大值
 */
export async function findLastOrderByTsdbApp(
  search?: TsdbAppSearch,
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByTsdbApp: Query["findLastOrderByTsdbApp"];
  } = await query({
    query: /* GraphQL */ `
      query($search: TsdbAppSearch) {
        findLastOrderByTsdbApp(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  
  const order_by = data.findLastOrderByTsdbApp;
  
  return order_by;
}

/**
 * 获取 时序数据库 字段注释
 */
export async function getFieldCommentsTsdbApp(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsTsdbApp: Query["getFieldCommentsTsdbApp"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsTsdbApp {
          id,
          lbl,
          type,
          type_lbl,
          protocol,
          protocol_lbl,
          hostname,
          port,
          database,
          token,
          is_enabled,
          is_enabled_lbl,
          order_by,
          rem,
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
  
  const field_comments = data.getFieldCommentsTsdbApp as TsdbAppFieldComment;
  
  return field_comments;
}

export function getPagePathTsdbApp() {
  return "/tsdb/tsdb_app";
}

/** 新增时的默认值 */
export async function getDefaultInputTsdbApp() {
  const defaultInput: TsdbAppInput = {
    type: TsdbAppType.Influxdb3,
    protocol: TsdbAppProtocol.Https,
    port: 8182,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
