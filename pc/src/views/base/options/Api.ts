
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  optionsQueryField,
} from "./Model.ts";

export async function setLblByIdOptions(
  model?: OptionsModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputOptions(
  model?: OptionsInput,
) {
  const input: OptionsInput = {
    // ID
    id: model?.id,
    // 名称
    lbl: model?.lbl,
    // 键
    ky: model?.ky,
    // 值
    val: model?.val,
    // 锁定
    is_locked: model?.is_locked,
    is_locked_lbl: model?.is_locked_lbl,
    // 启用
    is_enabled: model?.is_enabled,
    is_enabled_lbl: model?.is_enabled_lbl,
    // 排序
    order_by: model?.order_by != null ? Number(model?.order_by || 0) : undefined,
    // 备注
    rem: model?.rem,
    version: model?.version,
  };
  return input;
}

/**
 * 根据搜索条件查找 系统选项 列表
 */
export async function findAllOptions(
  search?: OptionsSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllOptions: OptionsModel[];
  } = await query({
    query: `
      query($search: OptionsSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllOptions(search: $search, page: $page, sort: $sort) {
          ${ optionsQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllOptions;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdOptions(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 系统选项
 */
export async function findOneOptions(
  search?: OptionsSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOptions?: OptionsModel;
  } = await query({
    query: `
      query($search: OptionsSearch, $sort: [SortInput!]) {
        findOneOptions(search: $search, sort: $sort) {
          ${ optionsQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOptions;
  
  await setLblByIdOptions(model);
  
  return model;
}

/**
 * 根据条件查找第一个 系统选项, 如果不存在则抛错
 */
export async function findOneOkOptions(
  search?: OptionsSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkOptions?: OptionsModel;
  } = await query({
    query: `
      query($search: OptionsSearch, $sort: [SortInput!]) {
        findOneOkOptions(search: $search, sort: $sort) {
          ${ optionsQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkOptions;
  
  await setLblByIdOptions(model);
  
  return model;
}

/**
 * 根据搜索条件查找 系统选项 总数
 */
export async function findCountOptions(
  search?: OptionsSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountOptions: Query["findCountOptions"];
  } = await query({
    query: /* GraphQL */ `
      query($search: OptionsSearch) {
        findCountOptions(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountOptions;
  return count;
}

/**
 * 创建 系统选项
 */
export async function createOptions(
  input: OptionsInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<OptionsId> {
  const ids = await createsOptions(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 系统选项
 */
export async function createsOptions(
  inputs: OptionsInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<OptionsId[]> {
  inputs = inputs.map(intoInputOptions);
  const data: {
    createsOptions: Mutation["createsOptions"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [OptionsInput!]!, $unique_type: UniqueType) {
        createsOptions(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsOptions;
  return ids;
}

/**
 * 根据 id 修改 系统选项
 */
export async function updateByIdOptions(
  id: OptionsId,
  input: OptionsInput,
  opt?: GqlOpt,
): Promise<OptionsId> {
  input = intoInputOptions(input);
  const data: {
    updateByIdOptions: Mutation["updateByIdOptions"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: OptionsId!, $input: OptionsInput!) {
        updateByIdOptions(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: OptionsId = data.updateByIdOptions;
  return id2;
}

/**
 * 根据 id 查找 系统选项
 */
export async function findByIdOptions(
  id: OptionsId,
  opt?: GqlOpt,
): Promise<OptionsModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdOptions?: OptionsModel;
  } = await query({
    query: `
      query($id: OptionsId!) {
        findByIdOptions(id: $id) {
          ${ optionsQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOptions;
  
  await setLblByIdOptions(model);
  
  return model;
}

/**
 * 根据 id 查找 系统选项, 如果不存在则抛错
 */
export async function findByIdOkOptions(
  id: OptionsId,
  opt?: GqlOpt,
): Promise<OptionsModel> {
  
  const data: {
    findByIdOkOptions: OptionsModel;
  } = await query({
    query: `
      query($id: OptionsId!) {
        findByIdOkOptions(id: $id) {
          ${ optionsQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkOptions;
  
  await setLblByIdOptions(model);
  
  return model;
}

/**
 * 根据 ids 查找 系统选项
 */
export async function findByIdsOptions(
  ids: OptionsId[],
  opt?: GqlOpt,
): Promise<OptionsModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOptions: OptionsModel[];
  } = await query({
    query: `
      query($ids: [OptionsId!]!) {
        findByIdsOptions(ids: $ids) {
          ${ optionsQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOptions;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdOptions(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 系统选项, 出现查询不到的 id 则报错
 */
export async function findByIdsOkOptions(
  ids: OptionsId[],
  opt?: GqlOpt,
): Promise<OptionsModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkOptions: OptionsModel[];
  } = await query({
    query: `
      query($ids: [OptionsId!]!) {
        findByIdsOkOptions(ids: $ids) {
          ${ optionsQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkOptions;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdOptions(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 系统选项
 */
export async function deleteByIdsOptions(
  ids: OptionsId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsOptions: Mutation["deleteByIdsOptions"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [OptionsId!]!) {
        deleteByIdsOptions(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsOptions;
  return res;
}

/**
 * 根据 ids 启用或禁用 系统选项
 */
export async function enableByIdsOptions(
  ids: OptionsId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    enableByIdsOptions: Mutation["enableByIdsOptions"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [OptionsId!]!, $is_enabled: Int!) {
        enableByIdsOptions(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsOptions;
  return res;
}

/**
 * 根据 ids 锁定或解锁 系统选项
 */
export async function lockByIdsOptions(
  ids: OptionsId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    lockByIdsOptions: Mutation["lockByIdsOptions"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [OptionsId!]!, $is_locked: Int!) {
        lockByIdsOptions(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsOptions;
  return res;
}

/**
 * 根据 ids 还原 系统选项
 */
export async function revertByIdsOptions(
  ids: OptionsId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsOptions: Mutation["revertByIdsOptions"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [OptionsId!]!) {
        revertByIdsOptions(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsOptions;
  return res;
}

/**
 * 根据 ids 彻底删除 系统选项
 */
export async function forceDeleteByIdsOptions(
  ids: OptionsId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsOptions: Mutation["forceDeleteByIdsOptions"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [OptionsId!]!) {
        forceDeleteByIdsOptions(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsOptions;
  return res;
}

/**
 * 下载 系统选项 导入模板
 */
export function useDownloadImportTemplateOptions() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsOptions {
            lbl
            ky
            val
            order_by
            rem
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "系统选项";
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/options.xlsx`,
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
export function useExportExcelOptions() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: OptionsSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: OptionsSearch, $sort: [SortInput!]) {
            findAllOptions(search: $search, page: null, sort: $sort) {
              ${ optionsQueryField }
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
      for (const model of data.findAllOptions) {
        await setLblByIdOptions(model, true);
      }
      try {
        const sheetName = "系统选项";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/base/options.xlsx`,
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
 * 批量导入 系统选项
 */
export async function importModelsOptions(
  inputs: OptionsInput[],
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
      await createsOptions(
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
 * 查找 系统选项 order_by 字段的最大值
 */
export async function findLastOrderByOptions(
  search?: OptionsSearch,
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByOptions: Query["findLastOrderByOptions"];
  } = await query({
    query: /* GraphQL */ `
      query($search: OptionsSearch) {
        findLastOrderByOptions(search: $search)
      }
    `,
  }, opt);
  
  const order_by = data.findLastOrderByOptions;
  
  return order_by;
}

/**
 * 获取 系统选项 字段注释
 */
export async function getFieldCommentsOptions(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsOptions: Query["getFieldCommentsOptions"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsOptions {
          id,
          lbl,
          ky,
          val,
          is_locked,
          is_locked_lbl,
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
  
  const field_comments = data.getFieldCommentsOptions as OptionsFieldComment;
  
  return field_comments;
}

export function getPagePathOptions() {
  return "/base/options";
}

/** 新增时的默认值 */
export async function getDefaultInputOptions() {
  const defaultInput: OptionsInput = {
    version: 1,
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
