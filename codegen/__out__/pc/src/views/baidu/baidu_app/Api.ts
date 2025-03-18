
import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  baiduAppQueryField,
} from "./Model";

async function setLblById(
  model?: BaiduAppModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
  model?: BaiduAppInput,
) {
  const input: BaiduAppInput = {
    // ID
    id: model?.id,
    // 应用名称
    lbl: model?.lbl,
    // AppID
    appid: model?.appid,
    // API Key
    api_key: model?.api_key,
    // Secret Key
    secret_key: model?.secret_key,
    // AES Key
    aes_key: model?.aes_key,
    // 锁定
    is_locked: model?.is_locked,
    is_locked_lbl: model?.is_locked_lbl,
    // 启用
    is_enabled: model?.is_enabled,
    is_enabled_lbl: model?.is_enabled_lbl,
    // 排序
    order_by: model?.order_by,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找百度应用列表
 */
export async function findAll(
  search?: BaiduAppSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllBaiduApp: BaiduAppModel[];
  } = await query({
    query: `
      query($search: BaiduAppSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllBaiduApp(search: $search, page: $page, sort: $sort) {
          ${ baiduAppQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllBaiduApp;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个百度应用
 */
export async function findOne(
  search?: BaiduAppSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneBaiduApp?: BaiduAppModel;
  } = await query({
    query: `
      query($search: BaiduAppSearch, $sort: [SortInput!]) {
        findOneBaiduApp(search: $search, sort: $sort) {
          ${ baiduAppQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneBaiduApp;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找百度应用总数
 */
export async function findCount(
  search?: BaiduAppSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountBaiduApp: Query["findCountBaiduApp"];
  } = await query({
    query: /* GraphQL */ `
      query($search: BaiduAppSearch) {
        findCountBaiduApp(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountBaiduApp;
  return count;
}

/**
 * 创建百度应用
 * @param {BaiduAppInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: BaiduAppInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<BaiduAppId> {
  const ids = await creates(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建百度应用
 */
export async function creates(
  inputs: BaiduAppInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<BaiduAppId[]> {
  inputs = inputs.map(intoInput);
  const data: {
    createsBaiduApp: Mutation["createsBaiduApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [BaiduAppInput!]!, $unique_type: UniqueType) {
        createsBaiduApp(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsBaiduApp;
  return ids;
}

/**
 * 根据 id 修改百度应用
 */
export async function updateById(
  id: BaiduAppId,
  input: BaiduAppInput,
  opt?: GqlOpt,
): Promise<BaiduAppId> {
  input = intoInput(input);
  const data: {
    updateByIdBaiduApp: Mutation["updateByIdBaiduApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: BaiduAppId!, $input: BaiduAppInput!) {
        updateByIdBaiduApp(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: BaiduAppId = data.updateByIdBaiduApp;
  return id2;
}

/**
 * 根据 id 查找百度应用
 */
export async function findById(
  id?: BaiduAppId,
  opt?: GqlOpt,
): Promise<BaiduAppModel | undefined> {
  if (!id) {
    return;
  }
  const data: {
    findByIdBaiduApp?: BaiduAppModel;
  } = await query({
    query: `
      query($id: BaiduAppId!) {
        findByIdBaiduApp(id: $id) {
          ${ baiduAppQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdBaiduApp;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 查找百度应用
 */
export async function findByIds(
  ids: BaiduAppId[],
  opt?: GqlOpt,
): Promise<BaiduAppModel[]> {
  if (ids.length === 0) {
    return [ ];
  }
  opt = opt || { };
  opt.showErrMsg = false;
  let models: BaiduAppModel[] = [ ];
  try {
    const data: {
      findByIdsBaiduApp: BaiduAppModel[];
    } = await query({
      query: `
        query($ids: [BaiduAppId!]!) {
          findByIdsBaiduApp(ids: $ids) {
            ${ baiduAppQueryField }
          }
        }
      `,
      variables: {
        ids,
      },
    }, opt);
    models = data.findByIdsBaiduApp;
  } catch (_err) { /* empty */ }
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据 ids 删除百度应用
 */
export async function deleteByIds(
  ids: BaiduAppId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsBaiduApp: Mutation["deleteByIdsBaiduApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [BaiduAppId!]!) {
        deleteByIdsBaiduApp(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsBaiduApp;
  return res;
}

/**
 * 根据 ids 启用或禁用百度应用
 */
export async function enableByIds(
  ids: BaiduAppId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    enableByIdsBaiduApp: Mutation["enableByIdsBaiduApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [BaiduAppId!]!, $is_enabled: Int!) {
        enableByIdsBaiduApp(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsBaiduApp;
  return res;
}

/**
 * 根据 ids 锁定或解锁百度应用
 */
export async function lockByIds(
  ids: BaiduAppId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    lockByIdsBaiduApp: Mutation["lockByIdsBaiduApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [BaiduAppId!]!, $is_locked: Int!) {
        lockByIdsBaiduApp(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsBaiduApp;
  return res;
}

/**
 * 根据 ids 还原百度应用
 */
export async function revertByIds(
  ids: BaiduAppId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsBaiduApp: Mutation["revertByIdsBaiduApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [BaiduAppId!]!) {
        revertByIdsBaiduApp(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsBaiduApp;
  return res;
}

/**
 * 根据 ids 彻底删除百度应用
 */
export async function forceDeleteByIds(
  ids: BaiduAppId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsBaiduApp: Mutation["forceDeleteByIdsBaiduApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [BaiduAppId!]!) {
        forceDeleteByIdsBaiduApp(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsBaiduApp;
  return res;
}

/**
 * 下载百度应用导入模板
 */
export function useDownloadImportTemplate() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsBaiduApp {
            lbl
            appid
            api_key
            secret_key
            aes_key
            order_by
            rem
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "百度应用";
      const buffer = await workerFn(
        `${ location.origin }/import_template/baidu/baidu_app.xlsx`,
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
export function useExportExcel() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: BaiduAppSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: BaiduAppSearch, $sort: [SortInput!]) {
            findAllBaiduApp(search: $search, page: null, sort: $sort) {
              ${ baiduAppQueryField }
            }
            getDict(codes: [
              "is_locked",
              "is_enabled",
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
      for (const model of data.findAllBaiduApp) {
        await setLblById(model, true);
      }
      try {
        const sheetName = "百度应用";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/baidu/baidu_app.xlsx`,
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
 * 批量导入百度应用
 */
export async function importModels(
  inputs: BaiduAppInput[],
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
      await creates(
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
 * 查找 百度应用 order_by 字段的最大值
 */
export async function findLastOrderBy(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByBaiduApp: Query["findLastOrderByBaiduApp"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByBaiduApp
      }
    `,
  }, opt);
  const res = data.findLastOrderByBaiduApp;
  return res;
}

export function getPagePath() {
  return "/baidu/baidu_app";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: BaiduAppInput = {
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
