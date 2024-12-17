import cfg from "@/utils/config";

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
  model?: CompanyInput,
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
  const ids = await creates(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建单位
 */
export async function creates(
  inputs: CompanyInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<CompanyId[]> {
  inputs = inputs.map(intoInput);
  const data: {
    createsCompany: Mutation["createsCompany"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [CompanyInput!]!, $unique_type: UniqueType) {
        createsCompany(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsCompany;
  return ids;
}

/**
 * 根据 id 修改单位
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
 * 下载单位导入模板
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
            findAllCompany(search: $search, page: null, sort: $sort) {
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
 * 批量导入单位
 */
export async function importModels(
  inputs: CompanyInput[],
  percentage: Ref<number>,
  isCancel: Ref<boolean>,
  opt?: GqlOpt,
) {
  const {
    nsAsync,
  } = useI18n();
  
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
      failErrMsgs.push(await nsAsync(`批量导入第 {0} 至 {1} 行时失败: {1}`, i + 1 - inputs.length, i + 1, err));
    }
    
    percentage.value = Math.floor((i + 1) / len * 100);
  }
  
  return showUploadMsg(succNum, failNum, failErrMsgs);
}

/**
 * 查找 单位 order_by 字段的最大值
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

export function getPagePath() {
  return "/eams/company";
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
