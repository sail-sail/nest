import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  companyQueryField,
} from "./Model";

async function setLblById(
  model?: CompanyModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
  model?: Record<string, any>,
) {
  const input: CompanyInput = {
    // ID
    id: model?.id,
    // 编号
    code: model?.code,
    // 名称
    lbl: model?.lbl,
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
 * 根据搜索条件查找单位列表
 * @param {CompanySearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: CompanySearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllCompany: CompanyModel[];
  } = await query({
    query: `
      query($search: CompanySearch, $page: PageInput, $sort: [SortInput!]) {
        findAllCompany(search: $search, page: $page, sort: $sort) {
          ${ companyQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllCompany;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个单位
 * @param {CompanySearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: CompanySearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneCompany?: CompanyModel;
  } = await query({
    query: `
      query($search: CompanySearch, $sort: [SortInput!]) {
        findOneCompany(search: $search, sort: $sort) {
          ${ companyQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneCompany;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找单位总数
 * @param {CompanySearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: CompanySearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountCompany: Query["findCountCompany"];
  } = await query({
    query: /* GraphQL */ `
      query($search: CompanySearch) {
        findCountCompany(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountCompany;
  return count;
}

/**
 * 创建单位
 * @param {CompanyInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: CompanyInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<CompanyId> {
  input = intoInput(input);
  const data: {
    createCompany: Mutation["createCompany"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($input: CompanyInput!, $unique_type: UniqueType) {
        createCompany(input: $input, unique_type: $unique_type)
      }
    `,
    variables: {
      input,
      unique_type,
    },
  }, opt);
  const id: CompanyId = data.createCompany;
  return id;
}

/**
 * 根据 id 修改单位
 * @param {CompanyId} id
 * @param {CompanyInput} input
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: CompanyId,
  input: CompanyInput,
  opt?: GqlOpt,
): Promise<CompanyId> {
  input = intoInput(input);
  const data: {
    updateByIdCompany: Mutation["updateByIdCompany"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: CompanyId!, $input: CompanyInput!) {
        updateByIdCompany(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: CompanyId = data.updateByIdCompany;
  return id2;
}

/**
 * 根据 id 查找单位
 * @param {CompanyId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: CompanyId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdCompany?: CompanyModel;
  } = await query({
    query: `
      query($id: CompanyId!) {
        findByIdCompany(id: $id) {
          ${ companyQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdCompany;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除单位
 * @param {CompanyId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: CompanyId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsCompany: Mutation["deleteByIdsCompany"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CompanyId!]!) {
        deleteByIdsCompany(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsCompany;
  return res;
}

/**
 * 根据 ids 启用或禁用单位
 * @param {CompanyId[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
 */
export async function enableByIds(
  ids: CompanyId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    enableByIdsCompany: Mutation["enableByIdsCompany"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CompanyId!]!, $is_enabled: Int!) {
        enableByIdsCompany(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsCompany;
  return res;
}

/**
 * 根据 ids 锁定或解锁单位
 * @param {CompanyId[]} ids
 * @param {0 | 1} is_locked
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: CompanyId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    lockByIdsCompany: Mutation["lockByIdsCompany"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CompanyId!]!, $is_locked: Int!) {
        lockByIdsCompany(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsCompany;
  return res;
}

/**
 * 根据 ids 还原单位
 * @param {CompanyId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: CompanyId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsCompany: Mutation["revertByIdsCompany"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CompanyId!]!) {
        revertByIdsCompany(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsCompany;
  return res;
}

/**
 * 根据 ids 彻底删除单位
 * @param {CompanyId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: CompanyId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsCompany: Mutation["forceDeleteByIdsCompany"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CompanyId!]!) {
        forceDeleteByIdsCompany(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsCompany;
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
          getFieldCommentsCompany {
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
      const sheetName = await nsAsync("单位");
      const buffer = await workerFn(
        `${ location.origin }/import_template/eams/company.xlsx`,
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
    search?: CompanySearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: CompanySearch, $sort: [SortInput!]) {
            findAllCompany(search: $search, sort: $sort) {
              ${ companyQueryField }
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
      for (const model of data.findAllCompany) {
        await setLblById(model, true);
      }
      try {
        const sheetName = await nsAsync("单位");
        const buffer = await workerFn(
          `${ location.origin }/excel_template/eams/company.xlsx`,
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
 * @param {CompanyInput[]} models
 */
export async function importModels(
  models: CompanyInput[],
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
 * 查找 单位 order_by 字段的最大值
 * @param {GqlOpt} opt?
 */
export async function findLastOrderBy(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByCompany: Query["findLastOrderByCompany"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByCompany
      }
    `,
  }, opt);
  const res = data.findLastOrderByCompany;
  return res;
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: CompanyInput = {
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
