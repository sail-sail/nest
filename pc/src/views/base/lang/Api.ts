
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  langQueryField,
} from "./Model.ts";

export async function setLblByIdLang(
  model?: LangModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputLang(
  model?: LangInput,
) {
  const input: LangInput = {
    // ID
    id: model?.id,
    // 编码
    code: model?.code,
    // 名称
    lbl: model?.lbl,
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
 * 根据搜索条件查找 语言 列表
 */
export async function findAllLang(
  search?: LangSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllLang: LangModel[];
  } = await query({
    query: `
      query($search: LangSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllLang(search: $search, page: $page, sort: $sort) {
          ${ langQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllLang;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdLang(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 语言
 */
export async function findOneLang(
  search?: LangSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneLang?: LangModel;
  } = await query({
    query: `
      query($search: LangSearch, $sort: [SortInput!]) {
        findOneLang(search: $search, sort: $sort) {
          ${ langQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneLang;
  
  await setLblByIdLang(model);
  
  return model;
}

/**
 * 根据条件查找第一个 语言, 如果不存在则抛错
 */
export async function findOneOkLang(
  search?: LangSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkLang?: LangModel;
  } = await query({
    query: `
      query($search: LangSearch, $sort: [SortInput!]) {
        findOneOkLang(search: $search, sort: $sort) {
          ${ langQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkLang;
  
  await setLblByIdLang(model);
  
  return model;
}

/**
 * 根据搜索条件查找 语言 总数
 */
export async function findCountLang(
  search?: LangSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountLang: Query["findCountLang"];
  } = await query({
    query: /* GraphQL */ `
      query($search: LangSearch) {
        findCountLang(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountLang;
  return count;
}

/**
 * 创建 语言
 */
export async function createLang(
  input: LangInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<LangId> {
  const ids = await createsLang(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 语言
 */
export async function createsLang(
  inputs: LangInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<LangId[]> {
  inputs = inputs.map(intoInputLang);
  const data: {
    createsLang: Mutation["createsLang"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [LangInput!]!, $unique_type: UniqueType) {
        createsLang(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsLang;
  return ids;
}

/**
 * 根据 id 修改 语言
 */
export async function updateByIdLang(
  id: LangId,
  input: LangInput,
  opt?: GqlOpt,
): Promise<LangId> {
  input = intoInputLang(input);
  const data: {
    updateByIdLang: Mutation["updateByIdLang"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: LangId!, $input: LangInput!) {
        updateByIdLang(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: LangId = data.updateByIdLang;
  return id2;
}

/**
 * 根据 id 查找 语言
 */
export async function findByIdLang(
  id: LangId,
  opt?: GqlOpt,
): Promise<LangModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdLang?: LangModel;
  } = await query({
    query: `
      query($id: LangId!) {
        findByIdLang(id: $id) {
          ${ langQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdLang;
  
  await setLblByIdLang(model);
  
  return model;
}

/**
 * 根据 id 查找 语言, 如果不存在则抛错
 */
export async function findByIdOkLang(
  id: LangId,
  opt?: GqlOpt,
): Promise<LangModel> {
  
  const data: {
    findByIdOkLang: LangModel;
  } = await query({
    query: `
      query($id: LangId!) {
        findByIdOkLang(id: $id) {
          ${ langQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkLang;
  
  await setLblByIdLang(model);
  
  return model;
}

/**
 * 根据 ids 查找 语言
 */
export async function findByIdsLang(
  ids: LangId[],
  opt?: GqlOpt,
): Promise<LangModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsLang: LangModel[];
  } = await query({
    query: `
      query($ids: [LangId!]!) {
        findByIdsLang(ids: $ids) {
          ${ langQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsLang;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdLang(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 语言, 出现查询不到的 id 则报错
 */
export async function findByIdsOkLang(
  ids: LangId[],
  opt?: GqlOpt,
): Promise<LangModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkLang: LangModel[];
  } = await query({
    query: `
      query($ids: [LangId!]!) {
        findByIdsOkLang(ids: $ids) {
          ${ langQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkLang;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdLang(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 语言
 */
export async function deleteByIdsLang(
  ids: LangId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsLang: Mutation["deleteByIdsLang"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [LangId!]!) {
        deleteByIdsLang(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsLang;
  return res;
}

/**
 * 根据 ids 启用或禁用 语言
 */
export async function enableByIdsLang(
  ids: LangId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    enableByIdsLang: Mutation["enableByIdsLang"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [LangId!]!, $is_enabled: Int!) {
        enableByIdsLang(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsLang;
  return res;
}

/**
 * 根据 ids 还原 语言
 */
export async function revertByIdsLang(
  ids: LangId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsLang: Mutation["revertByIdsLang"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [LangId!]!) {
        revertByIdsLang(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsLang;
  return res;
}

/**
 * 根据 ids 彻底删除 语言
 */
export async function forceDeleteByIdsLang(
  ids: LangId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsLang: Mutation["forceDeleteByIdsLang"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [LangId!]!) {
        forceDeleteByIdsLang(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsLang;
  return res;
}

/**
 * 下载 语言 导入模板
 */
export function useDownloadImportTemplateLang() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsLang {
            code
            lbl
            order_by
            rem
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "语言";
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/lang.xlsx`,
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
export function useExportExcelLang() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: LangSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: LangSearch, $page: PageInput, , $sort: [SortInput!]) {
            findAllLang(search: $search, page: $page, sort: $sort) {
              ${ langQueryField }
            }
            getDict(codes: [
              "is_enabled",
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
      for (const model of data.findAllLang) {
        await setLblByIdLang(model, true);
      }
      try {
        const sheetName = "语言";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/base/lang.xlsx`,
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
 * 批量导入 语言
 */
export async function importModelsLang(
  inputs: LangInput[],
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
      await createsLang(
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
 * 查找 语言 order_by 字段的最大值
 */
export async function findLastOrderByLang(
  search?: LangSearch,
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByLang: Query["findLastOrderByLang"];
  } = await query({
    query: /* GraphQL */ `
      query($search: LangSearch) {
        findLastOrderByLang(search: $search)
      }
    `,
  }, opt);
  
  const order_by = data.findLastOrderByLang;
  
  return order_by;
}

/**
 * 获取 语言 字段注释
 */
export async function getFieldCommentsLang(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsLang: Query["getFieldCommentsLang"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsLang {
          id,
          code,
          lbl,
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
  
  const field_comments = data.getFieldCommentsLang as LangFieldComment;
  
  return field_comments;
}

export function getPagePathLang() {
  return "/base/lang";
}

/** 新增时的默认值 */
export async function getDefaultInputLang() {
  const defaultInput: LangInput = {
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
