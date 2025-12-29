
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  dictDetailQueryField,
} from "./Model.ts";

export async function setLblByIdDictDetail(
  model?: DictDetailModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputDictDetail(
  model?: DictDetailInput,
) {
  const input: DictDetailInput = {
    // ID
    id: model?.id,
    // 系统字典
    dict_id: model?.dict_id,
    dict_id_lbl: model?.dict_id_lbl,
    // 名称
    lbl: model?.lbl,
    // 值
    val: model?.val,
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
 * 根据搜索条件查找 系统字典明细 列表
 */
export async function findAllDictDetail(
  search?: DictDetailSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDictDetail: DictDetailModel[];
  } = await query({
    query: `
      query($search: DictDetailSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDictDetail(search: $search, page: $page, sort: $sort) {
          ${ dictDetailQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllDictDetail;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdDictDetail(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 系统字典明细
 */
export async function findOneDictDetail(
  search?: DictDetailSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneDictDetail?: DictDetailModel;
  } = await query({
    query: `
      query($search: DictDetailSearch, $sort: [SortInput!]) {
        findOneDictDetail(search: $search, sort: $sort) {
          ${ dictDetailQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneDictDetail;
  
  await setLblByIdDictDetail(model);
  
  return model;
}

/**
 * 根据条件查找第一个 系统字典明细, 如果不存在则抛错
 */
export async function findOneOkDictDetail(
  search?: DictDetailSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkDictDetail?: DictDetailModel;
  } = await query({
    query: `
      query($search: DictDetailSearch, $sort: [SortInput!]) {
        findOneOkDictDetail(search: $search, sort: $sort) {
          ${ dictDetailQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkDictDetail;
  
  await setLblByIdDictDetail(model);
  
  return model;
}

/**
 * 根据搜索条件查找 系统字典明细 总数
 */
export async function findCountDictDetail(
  search?: DictDetailSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountDictDetail: Query["findCountDictDetail"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DictDetailSearch) {
        findCountDictDetail(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountDictDetail;
  return count;
}

/**
 * 创建 系统字典明细
 */
export async function createDictDetail(
  input: DictDetailInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DictDetailId> {
  const ids = await createsDictDetail(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 系统字典明细
 */
export async function createsDictDetail(
  inputs: DictDetailInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DictDetailId[]> {
  inputs = inputs.map(intoInputDictDetail);
  const data: {
    createsDictDetail: Mutation["createsDictDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [DictDetailInput!]!, $unique_type: UniqueType) {
        createsDictDetail(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsDictDetail;
  return ids;
}

/**
 * 根据 id 修改 系统字典明细
 */
export async function updateByIdDictDetail(
  id: DictDetailId,
  input: DictDetailInput,
  opt?: GqlOpt,
): Promise<DictDetailId> {
  input = intoInputDictDetail(input);
  const data: {
    updateByIdDictDetail: Mutation["updateByIdDictDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: DictDetailId!, $input: DictDetailInput!) {
        updateByIdDictDetail(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: DictDetailId = data.updateByIdDictDetail;
  return id2;
}

/**
 * 根据 id 查找 系统字典明细
 */
export async function findByIdDictDetail(
  id: DictDetailId,
  opt?: GqlOpt,
): Promise<DictDetailModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdDictDetail?: DictDetailModel;
  } = await query({
    query: `
      query($id: DictDetailId!) {
        findByIdDictDetail(id: $id) {
          ${ dictDetailQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdDictDetail;
  
  await setLblByIdDictDetail(model);
  
  return model;
}

/**
 * 根据 id 查找 系统字典明细, 如果不存在则抛错
 */
export async function findByIdOkDictDetail(
  id: DictDetailId,
  opt?: GqlOpt,
): Promise<DictDetailModel> {
  
  const data: {
    findByIdOkDictDetail: DictDetailModel;
  } = await query({
    query: `
      query($id: DictDetailId!) {
        findByIdOkDictDetail(id: $id) {
          ${ dictDetailQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkDictDetail;
  
  await setLblByIdDictDetail(model);
  
  return model;
}

/**
 * 根据 ids 查找 系统字典明细
 */
export async function findByIdsDictDetail(
  ids: DictDetailId[],
  opt?: GqlOpt,
): Promise<DictDetailModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsDictDetail: DictDetailModel[];
  } = await query({
    query: `
      query($ids: [DictDetailId!]!) {
        findByIdsDictDetail(ids: $ids) {
          ${ dictDetailQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsDictDetail;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdDictDetail(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 系统字典明细, 出现查询不到的 id 则报错
 */
export async function findByIdsOkDictDetail(
  ids: DictDetailId[],
  opt?: GqlOpt,
): Promise<DictDetailModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkDictDetail: DictDetailModel[];
  } = await query({
    query: `
      query($ids: [DictDetailId!]!) {
        findByIdsOkDictDetail(ids: $ids) {
          ${ dictDetailQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkDictDetail;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdDictDetail(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 系统字典明细
 */
export async function deleteByIdsDictDetail(
  ids: DictDetailId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsDictDetail: Mutation["deleteByIdsDictDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictDetailId!]!) {
        deleteByIdsDictDetail(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsDictDetail;
  return res;
}

/**
 * 根据 ids 启用或禁用 系统字典明细
 */
export async function enableByIdsDictDetail(
  ids: DictDetailId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    enableByIdsDictDetail: Mutation["enableByIdsDictDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictDetailId!]!, $is_enabled: Int!) {
        enableByIdsDictDetail(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsDictDetail;
  return res;
}

/**
 * 根据 ids 还原 系统字典明细
 */
export async function revertByIdsDictDetail(
  ids: DictDetailId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsDictDetail: Mutation["revertByIdsDictDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictDetailId!]!) {
        revertByIdsDictDetail(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsDictDetail;
  return res;
}

/**
 * 根据 ids 彻底删除 系统字典明细
 */
export async function forceDeleteByIdsDictDetail(
  ids: DictDetailId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsDictDetail: Mutation["forceDeleteByIdsDictDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictDetailId!]!) {
        forceDeleteByIdsDictDetail(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsDictDetail;
  return res;
}

export async function findAllDict(
  search?: DictSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDict: DictModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: DictSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDict(search: $search, page: $page, sort: $sort) {
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
  const dict_models = data.findAllDict;
  return dict_models;
}

export async function getListDict() {
  const data = await findAllDict(
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
 * 下载 系统字典明细 导入模板
 */
export function useDownloadImportTemplateDictDetail() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsDictDetail {
            dict_id_lbl
            lbl
            val
            order_by
            rem
          }
          findAllDict {
            id
            lbl
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "系统字典明细";
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/dict_detail.xlsx`,
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
export function useExportExcelDictDetail() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: DictDetailSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: DictDetailSearch, $page: PageInput, , $sort: [SortInput!]) {
            findAllDictDetail(search: $search, page: $page, sort: $sort) {
              ${ dictDetailQueryField }
            }
            findAllDict {
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
          page: {
            isResultLimit: false,
          },
          sort,
        },
      }, opt);
      for (const model of data.findAllDictDetail) {
        await setLblByIdDictDetail(model, true);
      }
      try {
        const sheetName = "系统字典明细";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/base/dict_detail.xlsx`,
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
 * 批量导入 系统字典明细
 */
export async function importModelsDictDetail(
  inputs: DictDetailInput[],
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
      await createsDictDetail(
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
 * 查找 系统字典明细 order_by 字段的最大值
 */
export async function findLastOrderByDictDetail(
  search?: DictDetailSearch,
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByDictDetail: Query["findLastOrderByDictDetail"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DictDetailSearch) {
        findLastOrderByDictDetail(search: $search)
      }
    `,
  }, opt);
  
  const order_by = data.findLastOrderByDictDetail;
  
  return order_by;
}

/**
 * 获取 系统字典明细 字段注释
 */
export async function getFieldCommentsDictDetail(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsDictDetail: Query["getFieldCommentsDictDetail"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsDictDetail {
          id,
          dict_id,
          dict_id_lbl,
          lbl,
          val,
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
  
  const field_comments = data.getFieldCommentsDictDetail as DictDetailFieldComment;
  
  return field_comments;
}

export function getPagePathDictDetail() {
  return "/base/dict_detail";
}

/** 新增时的默认值 */
export async function getDefaultInputDictDetail() {
  const defaultInput: DictDetailInput = {
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
