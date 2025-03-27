
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  dictbizDetailQueryField,
} from "./Model.ts";

async function setLblById(
  model?: DictbizDetailModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputDictbizDetail(
  model?: DictbizDetailInput,
) {
  const input: DictbizDetailInput = {
    // ID
    id: model?.id,
    // 业务字典
    dictbiz_id: model?.dictbiz_id,
    dictbiz_id_lbl: model?.dictbiz_id_lbl,
    // 名称
    lbl: model?.lbl,
    // 值
    val: model?.val,
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
 * 根据搜索条件查找 业务字典明细 列表
 */
export async function findAllDictbizDetail(
  search?: DictbizDetailSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDictbizDetail: DictbizDetailModel[];
  } = await query({
    query: `
      query($search: DictbizDetailSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDictbizDetail(search: $search, page: $page, sort: $sort) {
          ${ dictbizDetailQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllDictbizDetail;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个业务字典明细
 */
export async function findOneDictbizDetail(
  search?: DictbizDetailSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneDictbizDetail?: DictbizDetailModel;
  } = await query({
    query: `
      query($search: DictbizDetailSearch, $sort: [SortInput!]) {
        findOneDictbizDetail(search: $search, sort: $sort) {
          ${ dictbizDetailQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneDictbizDetail;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找 业务字典明细 总数
 */
export async function findCountDictbizDetail(
  search?: DictbizDetailSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountDictbizDetail: Query["findCountDictbizDetail"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DictbizDetailSearch) {
        findCountDictbizDetail(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountDictbizDetail;
  return count;
}

/**
 * 创建 业务字典明细
 */
export async function createDictbizDetail(
  input: DictbizDetailInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DictbizDetailId> {
  const ids = await createsDictbizDetail(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 业务字典明细
 */
export async function createsDictbizDetail(
  inputs: DictbizDetailInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DictbizDetailId[]> {
  inputs = inputs.map(intoInputDictbizDetail);
  const data: {
    createsDictbizDetail: Mutation["createsDictbizDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [DictbizDetailInput!]!, $unique_type: UniqueType) {
        createsDictbizDetail(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsDictbizDetail;
  return ids;
}

/**
 * 根据 id 修改 业务字典明细
 */
export async function updateByIdDictbizDetail(
  id: DictbizDetailId,
  input: DictbizDetailInput,
  opt?: GqlOpt,
): Promise<DictbizDetailId> {
  input = intoInputDictbizDetail(input);
  const data: {
    updateByIdDictbizDetail: Mutation["updateByIdDictbizDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: DictbizDetailId!, $input: DictbizDetailInput!) {
        updateByIdDictbizDetail(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: DictbizDetailId = data.updateByIdDictbizDetail;
  return id2;
}

/**
 * 根据 id 查找 业务字典明细
 */
export async function findByIdDictbizDetail(
  id?: DictbizDetailId,
  opt?: GqlOpt,
): Promise<DictbizDetailModel | undefined> {
  if (!id) {
    return;
  }
  const data: {
    findByIdDictbizDetail?: DictbizDetailModel;
  } = await query({
    query: `
      query($id: DictbizDetailId!) {
        findByIdDictbizDetail(id: $id) {
          ${ dictbizDetailQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdDictbizDetail;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 查找 业务字典明细
 */
export async function findByIdsDictbizDetail(
  ids: DictbizDetailId[],
  opt?: GqlOpt,
): Promise<DictbizDetailModel[]> {
  if (ids.length === 0) {
    return [ ];
  }
  opt = opt || { };
  opt.showErrMsg = false;
  let models: DictbizDetailModel[] = [ ];
  try {
    const data: {
      findByIdsDictbizDetail: DictbizDetailModel[];
    } = await query({
      query: `
        query($ids: [DictbizDetailId!]!) {
          findByIdsDictbizDetail(ids: $ids) {
            ${ dictbizDetailQueryField }
          }
        }
      `,
      variables: {
        ids,
      },
    }, opt);
    models = data.findByIdsDictbizDetail;
  } catch (_err) { /* empty */ }
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据 ids 删除 业务字典明细
 */
export async function deleteByIdsDictbizDetail(
  ids: DictbizDetailId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsDictbizDetail: Mutation["deleteByIdsDictbizDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictbizDetailId!]!) {
        deleteByIdsDictbizDetail(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsDictbizDetail;
  return res;
}

/**
 * 根据 ids 启用或禁用 业务字典明细
 */
export async function enableByIdsDictbizDetail(
  ids: DictbizDetailId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    enableByIdsDictbizDetail: Mutation["enableByIdsDictbizDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictbizDetailId!]!, $is_enabled: Int!) {
        enableByIdsDictbizDetail(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsDictbizDetail;
  return res;
}

/**
 * 根据 ids 还原 业务字典明细
 */
export async function revertByIdsDictbizDetail(
  ids: DictbizDetailId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsDictbizDetail: Mutation["revertByIdsDictbizDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictbizDetailId!]!) {
        revertByIdsDictbizDetail(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsDictbizDetail;
  return res;
}

/**
 * 根据 ids 彻底删除 业务字典明细
 */
export async function forceDeleteByIdsDictbizDetail(
  ids: DictbizDetailId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsDictbizDetail: Mutation["forceDeleteByIdsDictbizDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictbizDetailId!]!) {
        forceDeleteByIdsDictbizDetail(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsDictbizDetail;
  return res;
}

export async function findAllDictbiz(
  search?: DictbizSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDictbiz: DictbizModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: DictbizSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDictbiz(search: $search, page: $page, sort: $sort) {
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
  const dictbiz_models = data.findAllDictbiz;
  return dictbiz_models;
}

export async function getListDictbiz() {
  const data = await findAllDictbiz(
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
 * 下载 业务字典明细 导入模板
 */
export function useDownloadImportTemplateDictbizDetail() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsDictbizDetail {
            dictbiz_id_lbl
            lbl
            val
            order_by
            rem
          }
          findAllDictbiz {
            id
            lbl
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "业务字典明细";
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/dictbiz_detail.xlsx`,
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
export function useExportExcelDictbizDetail() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: DictbizDetailSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: DictbizDetailSearch, $sort: [SortInput!]) {
            findAllDictbizDetail(search: $search, page: null, sort: $sort) {
              ${ dictbizDetailQueryField }
            }
            findAllDictbiz {
              lbl
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
          sort,
        },
      }, opt);
      for (const model of data.findAllDictbizDetail) {
        await setLblById(model, true);
      }
      try {
        const sheetName = "业务字典明细";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/base/dictbiz_detail.xlsx`,
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
 * 批量导入 业务字典明细
 */
export async function importModelsDictbizDetail(
  inputs: DictbizDetailInput[],
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
      await createsDictbizDetail(
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
 * 查找 业务字典明细 order_by 字段的最大值
 */
export async function findLastOrderByDictbizDetail(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByDictbizDetail: Query["findLastOrderByDictbizDetail"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByDictbizDetail
      }
    `,
  }, opt);
  const res = data.findLastOrderByDictbizDetail;
  return res;
}

export function getPagePathDictbizDetail() {
  return "/base/dictbiz_detail";
}

/** 新增时的默认值 */
export async function getDefaultInputDictbizDetail() {
  const defaultInput: DictbizDetailInput = {
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
