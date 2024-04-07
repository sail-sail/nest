import {
  UniqueType,
} from "#/types";

import type {
  DictDetailId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import type {
  DictDetailSearch,
  DictDetailInput,
  DictDetailModel,
} from "./Model";

import {
  dictDetailFields,
} from "./Model";

// 系统字典
import type {
  DictSearch,
  DictModel,
} from "@/views/base/dict/Model";

async function setLblById(
  model?: DictDetailModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
  model?: Record<string, any>,
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
 * 根据搜索条件查找系统字典明细列表
 * @param {DictDetailSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: DictDetailSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDictDetail: DictDetailModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: DictDetailSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDictDetail(search: $search, page: $page, sort: $sort) {
          ${ dictDetailFields.join(" ") }
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
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个系统字典明细
 * @param {DictDetailSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: DictDetailSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneDictDetail?: DictDetailModel;
  } = await query({
    query: /* GraphQL */ `
      query($search: DictDetailSearch, $sort: [SortInput!]) {
        findOneDictDetail(search: $search, sort: $sort) {
          ${ dictDetailFields.join(" ") }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneDictDetail;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找系统字典明细总数
 * @param {DictDetailSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
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
 * 创建系统字典明细
 * @param {DictDetailInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: DictDetailInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DictDetailId> {
  input = intoInput(input);
  const data: {
    createDictDetail: Mutation["createDictDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($input: DictDetailInput!, $unique_type: UniqueType) {
        createDictDetail(input: $input, unique_type: $unique_type)
      }
    `,
    variables: {
      input,
      unique_type,
    },
  }, opt);
  const id: DictDetailId = data.createDictDetail;
  return id;
}

/**
 * 根据 id 修改系统字典明细
 * @param {DictDetailId} id
 * @param {DictDetailInput} input
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: DictDetailId,
  input: DictDetailInput,
  opt?: GqlOpt,
): Promise<DictDetailId> {
  input = intoInput(input);
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
 * 根据 id 查找系统字典明细
 * @param {DictDetailId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: DictDetailId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdDictDetail?: DictDetailModel;
  } = await query({
    query: /* GraphQL */ `
      query($id: DictDetailId!) {
        findByIdDictDetail(id: $id) {
          ${ dictDetailFields.join(" ") }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdDictDetail;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除系统字典明细
 * @param {DictDetailId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: DictDetailId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 启用或禁用系统字典明细
 * @param {DictDetailId[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
 */
export async function enableByIds(
  ids: DictDetailId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
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
 * 根据 ids 锁定或解锁系统字典明细
 * @param {DictDetailId[]} ids
 * @param {0 | 1} is_locked
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: DictDetailId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    lockByIdsDictDetail: Mutation["lockByIdsDictDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictDetailId!]!, $is_locked: Int!) {
        lockByIdsDictDetail(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsDictDetail;
  return res;
}

/**
 * 根据 ids 还原系统字典明细
 * @param {DictDetailId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: DictDetailId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 彻底删除系统字典明细
 * @param {DictDetailId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: DictDetailId[],
  opt?: GqlOpt,
) {
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
  const res = data.findAllDict;
  return res;
}

export async function getDictList() {
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
 * 下载导入模板
 */
export function useDownloadImportTemplate(routePath: string) {
  const {
    nsAsync,
  } = useI18n(routePath);
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
      const sheetName = await nsAsync("系统字典明细");
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/dict_detail.xlsx`,
        {
          sheetName,
          data,
        },
      );
      saveAsExcel(buffer, `${ sheetName }${ await nsAsync("导入") }`);
    } catch (err) {
      ElMessage.error(await nsAsync("下载失败"));
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
    nsAsync,
  } = useI18n(routePath);
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
        query: /* GraphQL */ `
          query($search: DictDetailSearch, $sort: [SortInput!]) {
            findAllDictDetail(search: $search, sort: $sort) {
              id
              dict_id
              dict_id_lbl
              lbl
              val
              is_locked
              is_locked_lbl
              is_enabled
              is_enabled_lbl
              order_by
              rem
              create_usr_id
              create_usr_id_lbl
              create_time
              create_time_lbl
              update_usr_id
              update_usr_id_lbl
              update_time
              update_time_lbl
            }
            findAllDict {
              lbl
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
      for (const model of data.findAllDictDetail) {
        await setLblById(model, true);
      }
      try {
        const sheetName = await nsAsync("系统字典明细");
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
        ElMessage.error(await nsAsync("导出失败"));
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
 * 批量导入
 * @param {DictDetailInput[]} models
 */
export async function importModels(
  models: DictDetailInput[],
  percentage: Ref<number>,
  isCancel: Ref<boolean>,
  opt?: GqlOpt,
) {
  const {
    nsAsync,
  } = useI18n();
  
  let succNum = 0;
  let failNum = 0;
  const failErrMsgs: string[] = [ ];
  percentage.value = 0;
  
  for (let i = 0; i < models.length; i++) {
    if (isCancel.value) {
      break;
    }
    
    percentage.value = Math.floor((i + 1) / models.length * 100);
    
    const item = models[i];
    
    opt = opt || { };
    opt.showErrMsg = false;
    opt.notLoading = true;
    
    try {
      await create(
        item,
        UniqueType.Update,
        opt,
      );
      succNum++;
    } catch (err) {
      failNum++;
      failErrMsgs.push(await nsAsync(`第 {0} 行导入失败: {1}`, i + 1, err));
    }
    
  }
  
  return showUploadMsg(succNum, failNum, failErrMsgs);
}

/**
 * 查找 系统字典明细 order_by 字段的最大值
 * @param {GqlOpt} opt?
 */
export async function findLastOrderBy(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByDictDetail: Query["findLastOrderByDictDetail"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByDictDetail
      }
    `,
  }, opt);
  const res = data.findLastOrderByDictDetail;
  return res;
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: DictDetailInput = {
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
