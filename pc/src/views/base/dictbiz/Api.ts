
import {
  UniqueType,
} from "#/types.ts";

import {
  DictbizType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  dictbizQueryField,
} from "./Model.ts";

import {
  intoInputDictbizDetail,
  setLblByIdDictbizDetail,
} from "@/views/base/dictbiz_detail/Api.ts";

export async function setLblByIdDictbiz(
  model?: DictbizModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
  // 业务字典明细
  model.dictbiz_detail = model.dictbiz_detail ?? [ ];
  for (let i = 0; i < model.dictbiz_detail.length; i++) {
    const dictbiz_detail_model = model.dictbiz_detail[i] as DictbizDetailModel;
    await setLblByIdDictbizDetail(dictbiz_detail_model, isExcelExport);
  }
}

export function intoInputDictbiz(
  model?: DictbizInput,
) {
  const input: DictbizInput = {
    // ID
    id: model?.id,
    // 编码
    code: model?.code,
    // 名称
    lbl: model?.lbl,
    // 可新增
    is_add: model?.is_add,
    // 数据类型
    type: model?.type,
    type_lbl: model?.type_lbl,
    // 启用
    is_enabled: model?.is_enabled,
    is_enabled_lbl: model?.is_enabled_lbl,
    // 排序
    order_by: model?.order_by != null ? Number(model?.order_by || 0) : undefined,
    // 备注
    rem: model?.rem,
    // 业务字典明细
    dictbiz_detail: model?.dictbiz_detail?.map(intoInputDictbizDetail),
  };
  return input;
}

/**
 * 根据搜索条件查找 业务字典 列表
 */
export async function findAllDictbiz(
  search?: DictbizSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDictbiz: DictbizModel[];
  } = await query({
    query: `
      query($search: DictbizSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDictbiz(search: $search, page: $page, sort: $sort) {
          ${ dictbizQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllDictbiz;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdDictbiz(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 业务字典
 */
export async function findOneDictbiz(
  search?: DictbizSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneDictbiz?: DictbizModel;
  } = await query({
    query: `
      query($search: DictbizSearch, $sort: [SortInput!]) {
        findOneDictbiz(search: $search, sort: $sort) {
          ${ dictbizQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneDictbiz;
  
  await setLblByIdDictbiz(model);
  
  return model;
}

/**
 * 根据条件查找第一个 业务字典, 如果不存在则抛错
 */
export async function findOneOkDictbiz(
  search?: DictbizSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkDictbiz?: DictbizModel;
  } = await query({
    query: `
      query($search: DictbizSearch, $sort: [SortInput!]) {
        findOneOkDictbiz(search: $search, sort: $sort) {
          ${ dictbizQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkDictbiz;
  
  await setLblByIdDictbiz(model);
  
  return model;
}

/**
 * 根据搜索条件查找 业务字典 总数
 */
export async function findCountDictbiz(
  search?: DictbizSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountDictbiz: Query["findCountDictbiz"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DictbizSearch) {
        findCountDictbiz(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountDictbiz;
  return count;
}

/**
 * 创建 业务字典
 */
export async function createDictbiz(
  input: DictbizInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DictbizId> {
  const ids = await createsDictbiz(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 业务字典
 */
export async function createsDictbiz(
  inputs: DictbizInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DictbizId[]> {
  inputs = inputs.map(intoInputDictbiz);
  const data: {
    createsDictbiz: Mutation["createsDictbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [DictbizInput!]!, $unique_type: UniqueType) {
        createsDictbiz(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsDictbiz;
  return ids;
}

/**
 * 根据 id 修改 业务字典
 */
export async function updateByIdDictbiz(
  id: DictbizId,
  input: DictbizInput,
  opt?: GqlOpt,
): Promise<DictbizId> {
  input = intoInputDictbiz(input);
  const data: {
    updateByIdDictbiz: Mutation["updateByIdDictbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: DictbizId!, $input: DictbizInput!) {
        updateByIdDictbiz(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: DictbizId = data.updateByIdDictbiz;
  return id2;
}

/**
 * 根据 id 查找 业务字典
 */
export async function findByIdDictbiz(
  id: DictbizId,
  opt?: GqlOpt,
): Promise<DictbizModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdDictbiz?: DictbizModel;
  } = await query({
    query: `
      query($id: DictbizId!) {
        findByIdDictbiz(id: $id) {
          ${ dictbizQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdDictbiz;
  
  await setLblByIdDictbiz(model);
  
  return model;
}

/**
 * 根据 id 查找 业务字典, 如果不存在则抛错
 */
export async function findByIdOkDictbiz(
  id: DictbizId,
  opt?: GqlOpt,
): Promise<DictbizModel> {
  
  const data: {
    findByIdOkDictbiz: DictbizModel;
  } = await query({
    query: `
      query($id: DictbizId!) {
        findByIdOkDictbiz(id: $id) {
          ${ dictbizQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkDictbiz;
  
  await setLblByIdDictbiz(model);
  
  return model;
}

/**
 * 根据 ids 查找 业务字典
 */
export async function findByIdsDictbiz(
  ids: DictbizId[],
  opt?: GqlOpt,
): Promise<DictbizModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsDictbiz: DictbizModel[];
  } = await query({
    query: `
      query($ids: [DictbizId!]!) {
        findByIdsDictbiz(ids: $ids) {
          ${ dictbizQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsDictbiz;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdDictbiz(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 业务字典, 出现查询不到的 id 则报错
 */
export async function findByIdsOkDictbiz(
  ids: DictbizId[],
  opt?: GqlOpt,
): Promise<DictbizModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkDictbiz: DictbizModel[];
  } = await query({
    query: `
      query($ids: [DictbizId!]!) {
        findByIdsOkDictbiz(ids: $ids) {
          ${ dictbizQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkDictbiz;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdDictbiz(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 业务字典
 */
export async function deleteByIdsDictbiz(
  ids: DictbizId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsDictbiz: Mutation["deleteByIdsDictbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictbizId!]!) {
        deleteByIdsDictbiz(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsDictbiz;
  return res;
}

/**
 * 根据 ids 启用或禁用 业务字典
 */
export async function enableByIdsDictbiz(
  ids: DictbizId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    enableByIdsDictbiz: Mutation["enableByIdsDictbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictbizId!]!, $is_enabled: Int!) {
        enableByIdsDictbiz(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsDictbiz;
  return res;
}

/**
 * 根据 ids 还原 业务字典
 */
export async function revertByIdsDictbiz(
  ids: DictbizId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsDictbiz: Mutation["revertByIdsDictbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictbizId!]!) {
        revertByIdsDictbiz(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsDictbiz;
  return res;
}

/**
 * 根据 ids 彻底删除 业务字典
 */
export async function forceDeleteByIdsDictbiz(
  ids: DictbizId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsDictbiz: Mutation["forceDeleteByIdsDictbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictbizId!]!) {
        forceDeleteByIdsDictbiz(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsDictbiz;
  return res;
}

/**
 * 下载 业务字典 导入模板
 */
export function useDownloadImportTemplateDictbiz() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsDictbiz {
            code
            lbl
            is_add
            type_lbl
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
      const sheetName = "业务字典";
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/dictbiz.xlsx`,
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
export function useExportExcelDictbiz() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: DictbizSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: DictbizSearch, $page: PageInput, , $sort: [SortInput!]) {
            findAllDictbiz(search: $search, page: $page, sort: $sort) {
              ${ dictbizQueryField }
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
          page: {
            isResultLimit: false,
          },
          sort,
        },
      }, opt);
      for (const model of data.findAllDictbiz) {
        await setLblByIdDictbiz(model, true);
      }
      try {
        const sheetName = "业务字典";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/base/dictbiz.xlsx`,
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
 * 批量导入 业务字典
 */
export async function importModelsDictbiz(
  inputs: DictbizInput[],
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
      await createsDictbiz(
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
 * 查找 业务字典 order_by 字段的最大值
 */
export async function findLastOrderByDictbiz(
  search?: DictbizSearch,
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByDictbiz: Query["findLastOrderByDictbiz"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DictbizSearch) {
        findLastOrderByDictbiz(search: $search)
      }
    `,
  }, opt);
  
  const order_by = data.findLastOrderByDictbiz;
  
  return order_by;
}

/**
 * 获取 业务字典 字段注释
 */
export async function getFieldCommentsDictbiz(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsDictbiz: Query["getFieldCommentsDictbiz"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsDictbiz {
          id,
          code,
          lbl,
          is_add,
          type,
          type_lbl,
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
  
  const field_comments = data.getFieldCommentsDictbiz as DictbizFieldComment;
  
  return field_comments;
}

export function getPagePathDictbiz() {
  return "/base/dictbiz";
}

/** 新增时的默认值 */
export async function getDefaultInputDictbiz() {
  const defaultInput: DictbizInput = {
    is_add: 0,
    type: DictbizType.String,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
