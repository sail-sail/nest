
import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  optbizQueryField,
} from "./Model";

async function setLblById(
  model?: OptbizModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
  model?: OptbizInput,
) {
  const input: OptbizInput = {
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
    order_by: model?.order_by,
    // 备注
    rem: model?.rem,
    version: model?.version,
  };
  return input;
}

/**
 * 根据搜索条件查找业务选项列表
 */
export async function findAll(
  search?: OptbizSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllOptbiz: OptbizModel[];
  } = await query({
    query: `
      query($search: OptbizSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllOptbiz(search: $search, page: $page, sort: $sort) {
          ${ optbizQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllOptbiz;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个业务选项
 */
export async function findOne(
  search?: OptbizSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneOptbiz?: OptbizModel;
  } = await query({
    query: `
      query($search: OptbizSearch, $sort: [SortInput!]) {
        findOneOptbiz(search: $search, sort: $sort) {
          ${ optbizQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneOptbiz;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找业务选项总数
 */
export async function findCount(
  search?: OptbizSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountOptbiz: Query["findCountOptbiz"];
  } = await query({
    query: /* GraphQL */ `
      query($search: OptbizSearch) {
        findCountOptbiz(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountOptbiz;
  return count;
}

/**
 * 创建业务选项
 * @param {OptbizInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: OptbizInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<OptbizId> {
  const ids = await creates(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建业务选项
 */
export async function creates(
  inputs: OptbizInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<OptbizId[]> {
  inputs = inputs.map(intoInput);
  const data: {
    createsOptbiz: Mutation["createsOptbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [OptbizInput!]!, $unique_type: UniqueType) {
        createsOptbiz(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsOptbiz;
  return ids;
}

/**
 * 根据 id 修改业务选项
 */
export async function updateById(
  id: OptbizId,
  input: OptbizInput,
  opt?: GqlOpt,
): Promise<OptbizId> {
  input = intoInput(input);
  const data: {
    updateByIdOptbiz: Mutation["updateByIdOptbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: OptbizId!, $input: OptbizInput!) {
        updateByIdOptbiz(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: OptbizId = data.updateByIdOptbiz;
  return id2;
}

/**
 * 根据 id 查找业务选项
 */
export async function findById(
  id: OptbizId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdOptbiz?: OptbizModel;
  } = await query({
    query: `
      query($id: OptbizId!) {
        findByIdOptbiz(id: $id) {
          ${ optbizQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdOptbiz;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除业务选项
 */
export async function deleteByIds(
  ids: OptbizId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsOptbiz: Mutation["deleteByIdsOptbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [OptbizId!]!) {
        deleteByIdsOptbiz(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsOptbiz;
  return res;
}

/**
 * 根据 ids 启用或禁用业务选项
 */
export async function enableByIds(
  ids: OptbizId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    enableByIdsOptbiz: Mutation["enableByIdsOptbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [OptbizId!]!, $is_enabled: Int!) {
        enableByIdsOptbiz(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsOptbiz;
  return res;
}

/**
 * 根据 ids 锁定或解锁业务选项
 */
export async function lockByIds(
  ids: OptbizId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    lockByIdsOptbiz: Mutation["lockByIdsOptbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [OptbizId!]!, $is_locked: Int!) {
        lockByIdsOptbiz(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsOptbiz;
  return res;
}

/**
 * 根据 ids 还原业务选项
 */
export async function revertByIds(
  ids: OptbizId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsOptbiz: Mutation["revertByIdsOptbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [OptbizId!]!) {
        revertByIdsOptbiz(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsOptbiz;
  return res;
}

/**
 * 根据 ids 彻底删除业务选项
 */
export async function forceDeleteByIds(
  ids: OptbizId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsOptbiz: Mutation["forceDeleteByIdsOptbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [OptbizId!]!) {
        forceDeleteByIdsOptbiz(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsOptbiz;
  return res;
}

/**
 * 下载业务选项导入模板
 */
export function useDownloadImportTemplate(routePath: string) {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsOptbiz {
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
      const sheetName = "业务选项";
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/optbiz.xlsx`,
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
export function useExportExcel(routePath: string) {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: OptbizSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: OptbizSearch, $sort: [SortInput!]) {
            findAllOptbiz(search: $search, page: null, sort: $sort) {
              ${ optbizQueryField }
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
      for (const model of data.findAllOptbiz) {
        await setLblById(model, true);
      }
      try {
        const sheetName = "业务选项";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/base/optbiz.xlsx`,
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
 * 批量导入业务选项
 */
export async function importModels(
  inputs: OptbizInput[],
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
 * 查找 业务选项 order_by 字段的最大值
 */
export async function findLastOrderBy(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByOptbiz: Query["findLastOrderByOptbiz"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByOptbiz
      }
    `,
  }, opt);
  const res = data.findLastOrderByOptbiz;
  return res;
}

export function getPagePath() {
  return "/base/optbiz";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: OptbizInput = {
    version: 1,
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
