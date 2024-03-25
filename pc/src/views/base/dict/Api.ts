import {
  UniqueType,
} from "#/types";

import type {
  DictId,
} from "@/typings/ids";

import {
  DictType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
  DictSearch,
  DictInput,
  DictModel,
} from "#/types";

import {
  intoInput as intoInputDictDetail,
} from "@/views/base/dict_detail/Api";

async function setLblById(
  model?: DictModel | null,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
  model?: Record<string, any>,
) {
  const input: DictInput = {
    id: model?.id,
    code: model?.code,
    lbl: model?.lbl,
    type: model?.type,
    type_lbl: model?.type_lbl,
    is_locked: model?.is_locked,
    is_locked_lbl: model?.is_locked_lbl,
    is_enabled: model?.is_enabled,
    is_enabled_lbl: model?.is_enabled_lbl,
    order_by: model?.order_by,
    rem: model?.rem,
    dict_detail: (model?.dict_detail ?? [ ]).map(intoInputDictDetail),
  };
  return input;
}

/**
 * 根据搜索条件查找系统字典列表
 * @param {DictSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: DictSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDict: Query["findAllDict"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DictSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDict(search: $search, page: $page, sort: $sort) {
          id
          code
          lbl
          type
          type_lbl
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
          is_deleted
          dict_detail {
            id
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
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个系统字典
 * @param {DictSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: DictSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneDict: Query["findOneDict"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DictSearch, $sort: [SortInput!]) {
        findOneDict(search: $search, sort: $sort) {
          id
          code
          lbl
          type
          type_lbl
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
          is_deleted
          dict_detail {
            id
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
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneDict;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找系统字典总数
 * @param {DictSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
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
 * 创建系统字典
 * @param {DictInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: DictInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DictId> {
  input = intoInput(input);
  const data: {
    createDict: Mutation["createDict"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($input: DictInput!, $unique_type: UniqueType) {
        createDict(input: $input, unique_type: $unique_type)
      }
    `,
    variables: {
      input,
      unique_type,
    },
  }, opt);
  const id: DictId = data.createDict;
  return id;
}

/**
 * 根据 id 修改系统字典
 * @param {DictId} id
 * @param {DictInput} input
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: DictId,
  input: DictInput,
  opt?: GqlOpt,
): Promise<DictId> {
  input = intoInput(input);
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
 * 根据 id 查找系统字典
 * @param {DictId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: DictId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdDict: Query["findByIdDict"];
  } = await query({
    query: /* GraphQL */ `
      query($id: DictId!) {
        findByIdDict(id: $id) {
          id
          code
          lbl
          type
          type_lbl
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
          is_deleted
          dict_detail {
            id
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
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdDict;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除系统字典
 * @param {DictId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: DictId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 启用或禁用系统字典
 * @param {DictId[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
 */
export async function enableByIds(
  ids: DictId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
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
 * 根据 ids 锁定或解锁系统字典
 * @param {DictId[]} ids
 * @param {0 | 1} is_locked
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: DictId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    lockByIdsDict: Mutation["lockByIdsDict"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DictId!]!, $is_locked: Int!) {
        lockByIdsDict(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsDict;
  return res;
}

/**
 * 根据 ids 还原系统字典
 * @param {DictId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: DictId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 彻底删除系统字典
 * @param {DictId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: DictId[],
  opt?: GqlOpt,
) {
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

export async function findAllDict(
  search?: DictSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDict: Query["findAllDict"];
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
          getFieldCommentsDict {
            code
            lbl
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
      const sheetName = await nsAsync("系统字典");
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/dict.xlsx`,
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
    search?: DictSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: /* GraphQL */ `
          query($search: DictSearch, $sort: [SortInput!]) {
            findAllDict(search: $search, sort: $sort) {
              id
              code
              lbl
              type
              type_lbl
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
            getDict(codes: [
              "dict_type",
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
      try {
        const sheetName = await nsAsync("系统字典");
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
 * @param {DictInput[]} models
 */
export async function importModels(
  models: DictInput[],
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
 * 查找 系统字典 order_by 字段的最大值
 * @param {GqlOpt} opt?
 */
export async function findLastOrderBy(
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

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: DictInput = {
    type: DictType.String,
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
