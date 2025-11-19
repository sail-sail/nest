
import {
  UniqueType,
} from "#/types.ts";

import {
  DictType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  dictQueryField,
} from "./Model.ts";

import {
  intoInputDictDetail,
  setLblByIdDictDetail,
} from "@/views/base/dict_detail/Api.ts";

export async function setLblByIdDict(
  model?: DictModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
  // 系统字典明细
  model.dict_detail = model.dict_detail ?? [ ];
  for (let i = 0; i < model.dict_detail.length; i++) {
    const dict_detail_model = model.dict_detail[i] as DictDetailModel;
    await setLblByIdDictDetail(dict_detail_model, isExcelExport);
  }
}

export function intoInputDict(
  model?: DictInput,
) {
  const input: DictInput = {
    // ID
    id: model?.id,
    // 编码
    code: model?.code,
    // 名称
    lbl: model?.lbl,
    // 数据类型
    type: model?.type,
    type_lbl: model?.type_lbl,
    // 可新增
    is_add: model?.is_add,
    // 启用
    is_enabled: model?.is_enabled,
    is_enabled_lbl: model?.is_enabled_lbl,
    // 排序
    order_by: model?.order_by,
    // 备注
    rem: model?.rem,
    // 系统字典明细
    dict_detail: model?.dict_detail?.map(intoInputDictDetail),
  };
  return input;
}

/**
 * 根据搜索条件查找 系统字典 列表
 */
export async function findAllDict(
  search?: DictSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDict: DictModel[];
  } = await query({
    query: `
      query($search: DictSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDict(search: $search, page: $page, sort: $sort) {
          ${ dictQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllDict;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdDict(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 系统字典
 */
export async function findOneDict(
  search?: DictSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneDict?: DictModel;
  } = await query({
    query: `
      query($search: DictSearch, $sort: [SortInput!]) {
        findOneDict(search: $search, sort: $sort) {
          ${ dictQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneDict;
  
  await setLblByIdDict(model);
  
  return model;
}

/**
 * 根据条件查找第一个 系统字典, 如果不存在则抛错
 */
export async function findOneOkDict(
  search?: DictSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkDict?: DictModel;
  } = await query({
    query: `
      query($search: DictSearch, $sort: [SortInput!]) {
        findOneOkDict(search: $search, sort: $sort) {
          ${ dictQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkDict;
  
  await setLblByIdDict(model);
  
  return model;
}

/**
 * 根据搜索条件查找 系统字典 总数
 */
export async function findCountDict(
  search?: DictSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountDict: Query["findCountDict"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DictSearch) {
        findCountDict(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountDict;
  return count;
}

/**
 * 创建 系统字典
 */
export async function createDict(
  input: DictInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DictId> {
  const ids = await createsDict(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 系统字典
 */
export async function createsDict(
  inputs: DictInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DictId[]> {
  inputs = inputs.map(intoInputDict);
  const data: {
    createsDict: Mutation["createsDict"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [DictInput!]!, $unique_type: UniqueType) {
        createsDict(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsDict;
  return ids;
}

/**
 * 根据 id 修改 系统字典
 */
export async function updateByIdDict(
  id: DictId,
  input: DictInput,
  opt?: GqlOpt,
): Promise<DictId> {
  input = intoInputDict(input);
  const data: {
    updateByIdDict: Mutation["updateByIdDict"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: DictId!, $input: DictInput!) {
        updateByIdDict(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: DictId = data.updateByIdDict;
  return id2;
}

/**
 * 根据 id 查找 系统字典
 */
export async function findByIdDict(
  id: DictId,
  opt?: GqlOpt,
): Promise<DictModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdDict?: DictModel;
  } = await query({
    query: `
      query($id: DictId!) {
        findByIdDict(id: $id) {
          ${ dictQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdDict;
  
  await setLblByIdDict(model);
  
  return model;
}

/**
 * 根据 id 查找 系统字典, 如果不存在则抛错
 */
export async function findByIdOkDict(
  id: DictId,
  opt?: GqlOpt,
): Promise<DictModel> {
  
  const data: {
    findByIdOkDict: DictModel;
  } = await query({
    query: `
      query($id: DictId!) {
        findByIdOkDict(id: $id) {
          ${ dictQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkDict;
  
  await setLblByIdDict(model);
  
  return model;
}

/**
 * 根据 ids 查找 系统字典
 */
export async function findByIdsDict(
  ids: DictId[],
  opt?: GqlOpt,
): Promise<DictModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsDict: DictModel[];
  } = await query({
    query: `
      query($ids: [DictId!]!) {
        findByIdsDict(ids: $ids) {
          ${ dictQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsDict;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdDict(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 系统字典, 出现查询不到的 id 则报错
 */
export async function findByIdsOkDict(
  ids: DictId[],
  opt?: GqlOpt,
): Promise<DictModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkDict: DictModel[];
  } = await query({
    query: `
      query($ids: [DictId!]!) {
        findByIdsOkDict(ids: $ids) {
          ${ dictQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkDict;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdDict(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 系统字典
 */
export async function deleteByIdsDict(
  ids: DictId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsDict: Mutation["deleteByIdsDict"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictId!]!) {
        deleteByIdsDict(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsDict;
  return res;
}

/**
 * 根据 ids 启用或禁用 系统字典
 */
export async function enableByIdsDict(
  ids: DictId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    enableByIdsDict: Mutation["enableByIdsDict"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictId!]!, $is_enabled: Int!) {
        enableByIdsDict(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsDict;
  return res;
}

/**
 * 根据 ids 还原 系统字典
 */
export async function revertByIdsDict(
  ids: DictId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsDict: Mutation["revertByIdsDict"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictId!]!) {
        revertByIdsDict(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsDict;
  return res;
}

/**
 * 根据 ids 彻底删除 系统字典
 */
export async function forceDeleteByIdsDict(
  ids: DictId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsDict: Mutation["forceDeleteByIdsDict"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictId!]!) {
        forceDeleteByIdsDict(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsDict;
  return res;
}

/**
 * 下载 系统字典 导入模板
 */
export function useDownloadImportTemplateDict() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsDict {
            code
            lbl
            type_lbl
            is_add
            order_by
            rem
          }
          getDict(codes: [
            "dict_type",
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
      const sheetName = "系统字典";
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/dict.xlsx`,
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
export function useExportExcelDict() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: DictSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: DictSearch, $sort: [SortInput!]) {
            findAllDict(search: $search, page: null, sort: $sort) {
              ${ dictQueryField }
            }
            getDict(codes: [
              "dict_type",
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
      for (const model of data.findAllDict) {
        await setLblByIdDict(model, true);
      }
      try {
        const sheetName = "系统字典";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/base/dict.xlsx`,
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
 * 批量导入 系统字典
 */
export async function importModelsDict(
  inputs: DictInput[],
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
      await createsDict(
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
 * 查找 系统字典 order_by 字段的最大值
 */
export async function findLastOrderByDict(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByDict: Query["findLastOrderByDict"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByDict
      }
    `,
  }, opt);
  const res = data.findLastOrderByDict;
  return res;
}

/**
 * 获取 系统字典 字段注释
 */
export async function getFieldCommentsDict(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsDict: Query["getFieldCommentsDict"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsDict {
          id,
          code,
          lbl,
          type,
          type_lbl,
          is_add,
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
  
  const field_comments = data.getFieldCommentsDict as DictFieldComment;
  
  return field_comments;
}

export function getPagePathDict() {
  return "/base/dict";
}

/** 新增时的默认值 */
export async function getDefaultInputDict() {
  const defaultInput: DictInput = {
    type: DictType.String,
    is_add: 0,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
