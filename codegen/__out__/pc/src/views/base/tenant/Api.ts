import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  tenantQueryField,
} from "./Model";

import {
  findTree as findMenuTree,
} from "@/views/base/menu/Api";

async function setLblById(
  model?: TenantModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
  model?: Record<string, any>,
) {
  const input: TenantInput = {
    // ID
    id: model?.id,
    // 名称
    lbl: model?.lbl,
    // 所属域名
    domain_ids: model?.domain_ids,
    domain_ids_lbl: model?.domain_ids_lbl,
    // 菜单权限
    menu_ids: model?.menu_ids,
    menu_ids_lbl: model?.menu_ids_lbl,
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
 * 根据搜索条件查找租户列表
 * @param {TenantSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: TenantSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllTenant: TenantModel[];
  } = await query({
    query: `
      query($search: TenantSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllTenant(search: $search, page: $page, sort: $sort) {
          ${ tenantQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllTenant;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个租户
 * @param {TenantSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: TenantSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneTenant?: TenantModel;
  } = await query({
    query: `
      query($search: TenantSearch, $sort: [SortInput!]) {
        findOneTenant(search: $search, sort: $sort) {
          ${ tenantQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneTenant;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找租户总数
 * @param {TenantSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: TenantSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountTenant: Query["findCountTenant"];
  } = await query({
    query: /* GraphQL */ `
      query($search: TenantSearch) {
        findCountTenant(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountTenant;
  return count;
}

/**
 * 创建租户
 * @param {TenantInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: TenantInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<TenantId> {
  const ids = await creates(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建租户
 * @param {TenantInput[]} inputs
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function creates(
  inputs: TenantInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<TenantId[]> {
  inputs = inputs.map(intoInput);
  const data: {
    createsTenant: Mutation["createsTenant"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [TenantInput!]!, $unique_type: UniqueType) {
        createsTenant(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsTenant;
  return ids;
}

/**
 * 根据 id 修改租户
 * @param {TenantId} id
 * @param {TenantInput} input
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: TenantId,
  input: TenantInput,
  opt?: GqlOpt,
): Promise<TenantId> {
  input = intoInput(input);
  const data: {
    updateByIdTenant: Mutation["updateByIdTenant"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: TenantId!, $input: TenantInput!) {
        updateByIdTenant(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: TenantId = data.updateByIdTenant;
  return id2;
}

/**
 * 根据 id 查找租户
 * @param {TenantId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: TenantId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdTenant?: TenantModel;
  } = await query({
    query: `
      query($id: TenantId!) {
        findByIdTenant(id: $id) {
          ${ tenantQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdTenant;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除租户
 * @param {TenantId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: TenantId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsTenant: Mutation["deleteByIdsTenant"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [TenantId!]!) {
        deleteByIdsTenant(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsTenant;
  return res;
}

/**
 * 根据 ids 启用或禁用租户
 * @param {TenantId[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
 */
export async function enableByIds(
  ids: TenantId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    enableByIdsTenant: Mutation["enableByIdsTenant"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [TenantId!]!, $is_enabled: Int!) {
        enableByIdsTenant(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsTenant;
  return res;
}

/**
 * 根据 ids 锁定或解锁租户
 * @param {TenantId[]} ids
 * @param {0 | 1} is_locked
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: TenantId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    lockByIdsTenant: Mutation["lockByIdsTenant"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [TenantId!]!, $is_locked: Int!) {
        lockByIdsTenant(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsTenant;
  return res;
}

/**
 * 根据 ids 还原租户
 * @param {TenantId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: TenantId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsTenant: Mutation["revertByIdsTenant"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [TenantId!]!) {
        revertByIdsTenant(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsTenant;
  return res;
}

/**
 * 根据 ids 彻底删除租户
 * @param {TenantId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: TenantId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsTenant: Mutation["forceDeleteByIdsTenant"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [TenantId!]!) {
        forceDeleteByIdsTenant(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsTenant;
  return res;
}

export async function findAllDomain(
  search?: DomainSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDomain: DomainModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: DomainSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDomain(search: $search, page: $page, sort: $sort) {
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
  const res = data.findAllDomain;
  return res;
}

export async function getDomainList() {
  const data = await findAllDomain(
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

export async function findAllMenu(
  search?: MenuSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllMenu: MenuModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: MenuSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllMenu(search: $search, page: $page, sort: $sort) {
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
  const res = data.findAllMenu;
  return res;
}

export async function getMenuList() {
  const data = await findAllMenu(
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

export async function getMenuTree() {
  const data = await findMenuTree(
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
 * 下载租户导入模板
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
          getFieldCommentsTenant {
            lbl
            domain_ids_lbl
            menu_ids_lbl
            order_by
            rem
          }
          findAllDomain {
            id
            lbl
          }
          findAllMenu {
            id
            lbl
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = await nsAsync("租户");
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/tenant.xlsx`,
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
    search?: TenantSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: TenantSearch, $sort: [SortInput!]) {
            findAllTenant(search: $search, sort: $sort) {
              ${ tenantQueryField }
            }
            findAllDomain {
              lbl
            }
            findAllMenu {
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
      for (const model of data.findAllTenant) {
        await setLblById(model, true);
      }
      try {
        const sheetName = await nsAsync("租户");
        const buffer = await workerFn(
          `${ location.origin }/excel_template/base/tenant.xlsx`,
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
 * 批量导入租户
 * @param {TenantInput[]} inputs
 */
export async function importModels(
  inputs: TenantInput[],
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
 * 查找 租户 order_by 字段的最大值
 * @param {GqlOpt} opt?
 */
export async function findLastOrderBy(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByTenant: Query["findLastOrderByTenant"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByTenant
      }
    `,
  }, opt);
  const res = data.findLastOrderByTenant;
  return res;
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: TenantInput = {
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
