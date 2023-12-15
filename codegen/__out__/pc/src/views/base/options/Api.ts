import {
  UniqueType,
} from "#/types";

import type {
  OptionsId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
  OptionsSearch,
  OptionsInput,
} from "#/types";

/**
 * 根据搜索条件查找系统选项列表
 * @param {OptionsSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: OptionsSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllOptions: Query["findAllOptions"];
  } = await query({
    query: /* GraphQL */ `
      query($search: OptionsSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllOptions(search: $search, page: $page, sort: $sort) {
          id
          lbl
          ky
          val
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          order_by
          rem
          version
          create_usr_id
          create_usr_id_lbl
          create_time
          create_time_lbl
          update_usr_id
          update_usr_id_lbl
          update_time
          update_time_lbl
          is_deleted
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const res = data.findAllOptions;
  for (let i = 0; i < res.length; i++) {
    const item = res[i];
  }
  return res;
}

/**
 * 根据搜索条件查找第一个系统选项
 * @param {OptionsSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: OptionsSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneOptions: Query["findOneOptions"];
  } = await query({
    query: /* GraphQL */ `
      query($search: OptionsSearch, $sort: [SortInput!]) {
        findOneOptions(search: $search, sort: $sort) {
          id
          lbl
          ky
          val
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          order_by
          rem
          version
          create_usr_id
          create_usr_id_lbl
          create_time
          create_time_lbl
          update_usr_id
          update_usr_id_lbl
          update_time
          update_time_lbl
          is_deleted
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneOptions;
  if (model) {
  }
  return model;
}

/**
 * 根据搜索条件查找系统选项总数
 * @param {OptionsSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
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
  const res = data.findCountOptions;
  return res;
}

/**
 * 创建一条系统选项
 * @param {OptionsInput} model
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: OptionsInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<OptionsId> {
  const data: {
    createOptions: Mutation["createOptions"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: OptionsInput!, $unique_type: UniqueType) {
        createOptions(model: $model, unique_type: $unique_type)
      }
    `,
    variables: {
      model,
      unique_type,
    },
  }, opt);
  const id: OptionsId = data.createOptions;
  return id;
}

/**
 * 根据id修改一条系统选项
 * @param {OptionsId} id
 * @param {OptionsInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: OptionsId,
  model: OptionsInput,
  opt?: GqlOpt,
): Promise<OptionsId> {
  const data: {
    updateByIdOptions: Mutation["updateByIdOptions"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: OptionsId!, $model: OptionsInput!) {
        updateByIdOptions(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const id2: OptionsId = data.updateByIdOptions;
  return id2;
}

/**
 * 通过ID查找一条系统选项
 * @param {OptionsId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: OptionsId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdOptions: Query["findByIdOptions"];
  } = await query({
    query: /* GraphQL */ `
      query($id: OptionsId!) {
        findByIdOptions(id: $id) {
          id
          lbl
          ky
          val
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          order_by
          rem
          version
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
    `,
    variables: {
      id,
    },
  }, opt);
  const res = data.findByIdOptions;
  return res;
}

/**
 * 根据 ids 删除系统选项
 * @param {OptionsId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: OptionsId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 启用或禁用系统选项
 * @param {OptionsId[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
 */
export async function enableByIds(
  ids: OptionsId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
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
 * 根据 ids 锁定或解锁系统选项
 * @param {OptionsId[]} ids
 * @param {0 | 1} is_locked
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: OptionsId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
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
 * 根据 ids 从回收站还原系统选项
 * @param {OptionsId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: OptionsId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 彻底删除系统选项
 * @param {OptionsId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: OptionsId[],
  opt?: GqlOpt,
) {
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
 * 下载导入模板
 */
export function useDownloadImportTemplate(routePath: string) {
  const {
    nAsync,
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
          getFieldCommentsOptions {
            lbl
            ky
            val
            order_by
            rem
            version
          }
        }
      `,
      variables: {
      },
    });
    const buffer = await workerFn(
      `${ location.origin }/import_template/base/options.xlsx`,
      {
        data,
      },
    );
    saveAsExcel(buffer, `${ await nAsync("系统选项") }${ await nsAsync("导入") }`);
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
    nAsync,
    nsAsync,
  } = useI18n(routePath);
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2(
    search?: OptionsSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const data = await query({
      query: /* GraphQL */ `
        query($search: OptionsSearch, $sort: [SortInput!]) {
          findAllOptions(search: $search, sort: $sort) {
            id
            lbl
            ky
            val
            is_locked
            is_locked_lbl
            is_enabled
            is_enabled_lbl
            order_by
            rem
            version
            create_usr_id
            create_usr_id_lbl
            create_time
            create_time_lbl
            update_usr_id
            update_usr_id_lbl
            update_time
            update_time_lbl
          }
          getFieldCommentsOptions {
            lbl
            ky
            val
            is_locked_lbl
            is_enabled_lbl
            order_by
            rem
            version
            create_usr_id_lbl
            create_time_lbl
            update_usr_id_lbl
            update_time_lbl
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
    try {
      const buffer = await workerFn(
        `${ location.origin }/excel_template/base/options.xlsx`,
        {
          data,
        },
      );
      saveAsExcel(buffer, await nAsync("系统选项"));
    } catch (err) {
      ElMessage.error(await nsAsync("导出失败"));
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
 * 批量导入
 * @param {OptionsInput[]} models
 */
export async function importModels(
  models: OptionsInput[],
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
 * 查找order_by字段的最大值
 * @param {GqlOpt} opt?
 */
export async function findLastOrderBy(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByOptions: Query["findLastOrderByOptions"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByOptions
      }
    `,
  }, opt);
  const res = data.findLastOrderByOptions;
  return res;
}
