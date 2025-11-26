
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  dynPageDataQueryField,
} from "./Model.ts";

export async function setLblByIdDynPageData(
  model?: DynPageDataModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputDynPageData(
  model?: DynPageDataInput,
) {
  const input: DynPageDataInput = {
    // ID
    id: model?.id,
    // 关联页面路由
    ref_code: model?.ref_code,
    // 动态页面数据
    dyn_page_data: model?.dyn_page_data,
  };
  return input;
}

/**
 * 根据搜索条件查找 动态页面数据 列表
 */
export async function findAllDynPageData(
  search?: DynPageDataSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDynPageData: DynPageDataModel[];
  } = await query({
    query: `
      query($search: DynPageDataSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDynPageData(search: $search, page: $page, sort: $sort) {
          ${ dynPageDataQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllDynPageData;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdDynPageData(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 动态页面数据
 */
export async function findOneDynPageData(
  search?: DynPageDataSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneDynPageData?: DynPageDataModel;
  } = await query({
    query: `
      query($search: DynPageDataSearch, $sort: [SortInput!]) {
        findOneDynPageData(search: $search, sort: $sort) {
          ${ dynPageDataQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneDynPageData;
  
  await setLblByIdDynPageData(model);
  
  return model;
}

/**
 * 根据条件查找第一个 动态页面数据, 如果不存在则抛错
 */
export async function findOneOkDynPageData(
  search?: DynPageDataSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkDynPageData?: DynPageDataModel;
  } = await query({
    query: `
      query($search: DynPageDataSearch, $sort: [SortInput!]) {
        findOneOkDynPageData(search: $search, sort: $sort) {
          ${ dynPageDataQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkDynPageData;
  
  await setLblByIdDynPageData(model);
  
  return model;
}

/**
 * 根据搜索条件查找 动态页面数据 总数
 */
export async function findCountDynPageData(
  search?: DynPageDataSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountDynPageData: Query["findCountDynPageData"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DynPageDataSearch) {
        findCountDynPageData(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountDynPageData;
  return count;
}

/**
 * 创建 动态页面数据
 */
export async function createDynPageData(
  input: DynPageDataInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DynPageDataId> {
  const ids = await createsDynPageData(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 动态页面数据
 */
export async function createsDynPageData(
  inputs: DynPageDataInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DynPageDataId[]> {
  inputs = inputs.map(intoInputDynPageData);
  const data: {
    createsDynPageData: Mutation["createsDynPageData"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [DynPageDataInput!]!, $unique_type: UniqueType) {
        createsDynPageData(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsDynPageData;
  return ids;
}

/**
 * 根据 id 修改 动态页面数据
 */
export async function updateByIdDynPageData(
  id: DynPageDataId,
  input: DynPageDataInput,
  opt?: GqlOpt,
): Promise<DynPageDataId> {
  input = intoInputDynPageData(input);
  const data: {
    updateByIdDynPageData: Mutation["updateByIdDynPageData"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: DynPageDataId!, $input: DynPageDataInput!) {
        updateByIdDynPageData(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: DynPageDataId = data.updateByIdDynPageData;
  return id2;
}

/**
 * 根据 id 查找 动态页面数据
 */
export async function findByIdDynPageData(
  id: DynPageDataId,
  opt?: GqlOpt,
): Promise<DynPageDataModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdDynPageData?: DynPageDataModel;
  } = await query({
    query: `
      query($id: DynPageDataId!) {
        findByIdDynPageData(id: $id) {
          ${ dynPageDataQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdDynPageData;
  
  await setLblByIdDynPageData(model);
  
  return model;
}

/**
 * 根据 id 查找 动态页面数据, 如果不存在则抛错
 */
export async function findByIdOkDynPageData(
  id: DynPageDataId,
  opt?: GqlOpt,
): Promise<DynPageDataModel> {
  
  const data: {
    findByIdOkDynPageData: DynPageDataModel;
  } = await query({
    query: `
      query($id: DynPageDataId!) {
        findByIdOkDynPageData(id: $id) {
          ${ dynPageDataQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkDynPageData;
  
  await setLblByIdDynPageData(model);
  
  return model;
}

/**
 * 根据 ids 查找 动态页面数据
 */
export async function findByIdsDynPageData(
  ids: DynPageDataId[],
  opt?: GqlOpt,
): Promise<DynPageDataModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsDynPageData: DynPageDataModel[];
  } = await query({
    query: `
      query($ids: [DynPageDataId!]!) {
        findByIdsDynPageData(ids: $ids) {
          ${ dynPageDataQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsDynPageData;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdDynPageData(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 动态页面数据, 出现查询不到的 id 则报错
 */
export async function findByIdsOkDynPageData(
  ids: DynPageDataId[],
  opt?: GqlOpt,
): Promise<DynPageDataModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkDynPageData: DynPageDataModel[];
  } = await query({
    query: `
      query($ids: [DynPageDataId!]!) {
        findByIdsOkDynPageData(ids: $ids) {
          ${ dynPageDataQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkDynPageData;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdDynPageData(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 动态页面数据
 */
export async function deleteByIdsDynPageData(
  ids: DynPageDataId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsDynPageData: Mutation["deleteByIdsDynPageData"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DynPageDataId!]!) {
        deleteByIdsDynPageData(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsDynPageData;
  return res;
}

/**
 * 根据 ids 还原 动态页面数据
 */
export async function revertByIdsDynPageData(
  ids: DynPageDataId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsDynPageData: Mutation["revertByIdsDynPageData"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DynPageDataId!]!) {
        revertByIdsDynPageData(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsDynPageData;
  return res;
}

/**
 * 根据 ids 彻底删除 动态页面数据
 */
export async function forceDeleteByIdsDynPageData(
  ids: DynPageDataId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsDynPageData: Mutation["forceDeleteByIdsDynPageData"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DynPageDataId!]!) {
        forceDeleteByIdsDynPageData(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsDynPageData;
  return res;
}

/**
 * 下载 动态页面数据 导入模板
 */
export function useDownloadImportTemplateDynPageData() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsDynPageData {
            ref_code
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "动态页面数据";
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/dyn_page_data.xlsx`,
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
export function useExportExcelDynPageData() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: DynPageDataSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: DynPageDataSearch, $sort: [SortInput!]) {
            findAllDynPageData(search: $search, page: null, sort: $sort) {
              ${ dynPageDataQueryField }
            }
          }
        `,
        variables: {
          search,
          sort,
        },
      }, opt);
      for (const model of data.findAllDynPageData) {
        await setLblByIdDynPageData(model, true);
      }
      try {
        const sheetName = "动态页面数据";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/base/dyn_page_data.xlsx`,
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
 * 批量导入 动态页面数据
 */
export async function importModelsDynPageData(
  inputs: DynPageDataInput[],
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
      await createsDynPageData(
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
 * 获取 动态页面数据 字段注释
 */
export async function getFieldCommentsDynPageData(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsDynPageData: Query["getFieldCommentsDynPageData"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsDynPageData {
          id,
          ref_code,
          create_usr_id,
          create_usr_id_lbl,
          create_time,
          create_time_lbl,
          update_usr_id,
          update_usr_id_lbl,
          update_time,
          update_time_lbl,
          dyn_page_data
        }
      }
    `,
    variables: {
    },
  }, opt);
  
  const field_comments = data.getFieldCommentsDynPageData as DynPageDataFieldComment;
  
  return field_comments;
}

export function getPagePathDynPageData() {
  return "/base/dyn_page_data";
}

/** 新增时的默认值 */
export async function getDefaultInputDynPageData() {
  const defaultInput: DynPageDataInput = {
  };
  return defaultInput;
}
