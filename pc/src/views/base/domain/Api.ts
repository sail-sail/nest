import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  domainQueryField,
} from "./Model";

async function setLblById(
  model?: DomainModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
  model?: Record<string, any>,
) {
  const input: DomainInput = {
    // ID
    id: model?.id,
    // 协议
    protocol: model?.protocol,
    // 名称
    lbl: model?.lbl,
    // 锁定
    is_locked: model?.is_locked,
    is_locked_lbl: model?.is_locked_lbl,
    // 默认
    is_default: model?.is_default,
    is_default_lbl: model?.is_default_lbl,
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
 * 根据搜索条件查找域名列表
 * @param {DomainSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: DomainSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDomain: DomainModel[];
  } = await query({
    query: `
      query($search: DomainSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDomain(search: $search, page: $page, sort: $sort) {
          ${ domainQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllDomain;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个域名
 * @param {DomainSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: DomainSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneDomain?: DomainModel;
  } = await query({
    query: `
      query($search: DomainSearch, $sort: [SortInput!]) {
        findOneDomain(search: $search, sort: $sort) {
          ${ domainQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneDomain;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找域名总数
 * @param {DomainSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: DomainSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountDomain: Query["findCountDomain"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DomainSearch) {
        findCountDomain(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountDomain;
  return count;
}

/**
 * 创建域名
 * @param {DomainInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: DomainInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DomainId> {
  input = intoInput(input);
  const data: {
    createDomain: Mutation["createDomain"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($input: DomainInput!, $unique_type: UniqueType) {
        createDomain(input: $input, unique_type: $unique_type)
      }
    `,
    variables: {
      input,
      unique_type,
    },
  }, opt);
  const id: DomainId = data.createDomain;
  return id;
}

/**
 * 根据 id 修改域名
 * @param {DomainId} id
 * @param {DomainInput} input
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: DomainId,
  input: DomainInput,
  opt?: GqlOpt,
): Promise<DomainId> {
  input = intoInput(input);
  const data: {
    updateByIdDomain: Mutation["updateByIdDomain"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: DomainId!, $input: DomainInput!) {
        updateByIdDomain(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: DomainId = data.updateByIdDomain;
  return id2;
}

/**
 * 根据 id 查找域名
 * @param {DomainId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: DomainId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdDomain?: DomainModel;
  } = await query({
    query: `
      query($id: DomainId!) {
        findByIdDomain(id: $id) {
          ${ domainQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdDomain;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除域名
 * @param {DomainId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: DomainId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsDomain: Mutation["deleteByIdsDomain"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DomainId!]!) {
        deleteByIdsDomain(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsDomain;
  return res;
}

/**
 * 根据 id 设置默认域名
 * @param {DomainId} id
 * @param {GqlOpt} opt?
 */
export async function defaultById(
  id: DomainId,
  opt?: GqlOpt,
) {
  const data: {
    defaultByIdDomain: Mutation["defaultByIdDomain"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: DomainId!) {
        defaultByIdDomain(id: $id)
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const res = data.defaultByIdDomain;
  return res;
}

/**
 * 根据 ids 启用或禁用域名
 * @param {DomainId[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
 */
export async function enableByIds(
  ids: DomainId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    enableByIdsDomain: Mutation["enableByIdsDomain"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DomainId!]!, $is_enabled: Int!) {
        enableByIdsDomain(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsDomain;
  return res;
}

/**
 * 根据 ids 锁定或解锁域名
 * @param {DomainId[]} ids
 * @param {0 | 1} is_locked
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: DomainId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    lockByIdsDomain: Mutation["lockByIdsDomain"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DomainId!]!, $is_locked: Int!) {
        lockByIdsDomain(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsDomain;
  return res;
}

/**
 * 根据 ids 还原域名
 * @param {DomainId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: DomainId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsDomain: Mutation["revertByIdsDomain"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DomainId!]!) {
        revertByIdsDomain(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsDomain;
  return res;
}

/**
 * 根据 ids 彻底删除域名
 * @param {DomainId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: DomainId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsDomain: Mutation["forceDeleteByIdsDomain"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DomainId!]!) {
        forceDeleteByIdsDomain(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsDomain;
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
          getFieldCommentsDomain {
            protocol
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
      const sheetName = await nsAsync("域名");
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/domain.xlsx`,
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
    search?: DomainSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: DomainSearch, $sort: [SortInput!]) {
            findAllDomain(search: $search, sort: $sort) {
              ${ domainQueryField }
            }
            getDict(codes: [
              "is_locked",
              "is_default",
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
      for (const model of data.findAllDomain) {
        await setLblById(model, true);
      }
      try {
        const sheetName = await nsAsync("域名");
        const buffer = await workerFn(
          `${ location.origin }/excel_template/base/domain.xlsx`,
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
 * @param {DomainInput[]} models
 */
export async function importModels(
  models: DomainInput[],
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
 * 查找 域名 order_by 字段的最大值
 * @param {GqlOpt} opt?
 */
export async function findLastOrderBy(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByDomain: Query["findLastOrderByDomain"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByDomain
      }
    `,
  }, opt);
  const res = data.findLastOrderByDomain;
  return res;
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: DomainInput = {
    protocol: "https",
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
