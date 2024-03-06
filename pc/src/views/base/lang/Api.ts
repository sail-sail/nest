import {
  UniqueType,
} from "#/types";

import type {
  LangId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
  LangSearch,
  LangInput,
  LangModel,
} from "#/types";

async function setLblById(
  model?: LangModel | null,
) {
  if (!model) {
    return;
  }
}

/**
 * 根据搜索条件查找语言列表
 * @param {LangSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: LangSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllLang: Query["findAllLang"];
  } = await query({
    query: /* GraphQL */ `
      query($search: LangSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllLang(search: $search, page: $page, sort: $sort) {
          id
          code
          lbl
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
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllLang;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个语言
 * @param {LangSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: LangSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneLang: Query["findOneLang"];
  } = await query({
    query: /* GraphQL */ `
      query($search: LangSearch, $sort: [SortInput!]) {
        findOneLang(search: $search, sort: $sort) {
          id
          code
          lbl
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
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneLang;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找语言总数
 * @param {LangSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: LangSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountLang: Query["findCountLang"];
  } = await query({
    query: /* GraphQL */ `
      query($search: LangSearch) {
        findCountLang(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountLang;
  return count;
}

/**
 * 创建语言
 * @param {LangInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: LangInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<LangId> {
  const data: {
    createLang: Mutation["createLang"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($input: LangInput!, $unique_type: UniqueType) {
        createLang(input: $input, unique_type: $unique_type)
      }
    `,
    variables: {
      input,
      unique_type,
    },
  }, opt);
  const id: LangId = data.createLang;
  return id;
}

/**
 * 根据 id 修改语言
 * @param {LangId} id
 * @param {LangInput} input
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: LangId,
  input: LangInput,
  opt?: GqlOpt,
): Promise<LangId> {
  const data: {
    updateByIdLang: Mutation["updateByIdLang"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: LangId!, $input: LangInput!) {
        updateByIdLang(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: LangId = data.updateByIdLang;
  return id2;
}

/**
 * 根据 id 查找语言
 * @param {LangId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: LangId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdLang: Query["findByIdLang"];
  } = await query({
    query: /* GraphQL */ `
      query($id: LangId!) {
        findByIdLang(id: $id) {
          id
          code
          lbl
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
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdLang;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除语言
 * @param {LangId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: LangId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsLang: Mutation["deleteByIdsLang"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [LangId!]!) {
        deleteByIdsLang(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsLang;
  return res;
}

/**
 * 根据 ids 启用或禁用语言
 * @param {LangId[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
 */
export async function enableByIds(
  ids: LangId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    enableByIdsLang: Mutation["enableByIdsLang"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [LangId!]!, $is_enabled: Int!) {
        enableByIdsLang(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsLang;
  return res;
}

/**
 * 根据 ids 还原语言
 * @param {LangId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: LangId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsLang: Mutation["revertByIdsLang"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [LangId!]!) {
        revertByIdsLang(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsLang;
  return res;
}

/**
 * 根据 ids 彻底删除语言
 * @param {LangId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: LangId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsLang: Mutation["forceDeleteByIdsLang"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [LangId!]!) {
        forceDeleteByIdsLang(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsLang;
  return res;
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
          getFieldCommentsLang {
            code
            lbl
            order_by
            rem
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = await nsAsync("语言");
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/lang.xlsx`,
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
    search?: LangSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: /* GraphQL */ `
          query($search: LangSearch, $sort: [SortInput!]) {
            findAllLang(search: $search, sort: $sort) {
              id
              code
              lbl
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
        const sheetName = await nsAsync("语言");
        const buffer = await workerFn(
          `${ location.origin }/excel_template/base/lang.xlsx`,
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
 * @param {LangInput[]} models
 */
export async function importModels(
  models: LangInput[],
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
 * 查找 语言 order_by 字段的最大值
 * @param {GqlOpt} opt?
 */
export async function findLastOrderBy(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByLang: Query["findLastOrderByLang"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByLang
      }
    `,
  }, opt);
  const res = data.findLastOrderByLang;
  return res;
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: LangInput = {
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
