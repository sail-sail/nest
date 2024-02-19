import {
  UniqueType,
} from "#/types";

import type {
  TenantId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
  TenantSearch,
  TenantInput,
  TenantModel,
} from "#/types";

import type {
  DomainSearch,
} from "#/types";

import type {
  MenuSearch,
} from "#/types";

import {
  findTree as findMenuTree,
} from "@/views/base/menu/Api";

async function setLblById(
  model?: TenantModel | null,
) {
  if (!model) {
    return;
  }
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
    findAllTenant: Query["findAllTenant"];
  } = await query({
    query: /* GraphQL */ `
      query($search: TenantSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllTenant(search: $search, page: $page, sort: $sort) {
          id
          lbl
          domain_ids
          domain_ids_lbl
          menu_ids
          menu_ids_lbl
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
    findOneTenant: Query["findOneTenant"];
  } = await query({
    query: /* GraphQL */ `
      query($search: TenantSearch, $sort: [SortInput!]) {
        findOneTenant(search: $search, sort: $sort) {
          id
          lbl
          domain_ids
          domain_ids_lbl
          menu_ids
          menu_ids_lbl
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
 * @param {TenantInput} model
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: TenantInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<TenantId> {
  const data: {
    createTenant: Mutation["createTenant"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: TenantInput!, $unique_type: UniqueType) {
        createTenant(model: $model, unique_type: $unique_type)
      }
    `,
    variables: {
      model,
      unique_type,
    },
  }, opt);
  const id: TenantId = data.createTenant;
  return id;
}

/**
 * 根据 id 修改租户
 * @param {TenantId} id
 * @param {TenantInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: TenantId,
  model: TenantInput,
  opt?: GqlOpt,
): Promise<TenantId> {
  const data: {
    updateByIdTenant: Mutation["updateByIdTenant"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: TenantId!, $model: TenantInput!) {
        updateByIdTenant(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
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
    findByIdTenant: Query["findByIdTenant"];
  } = await query({
    query: /* GraphQL */ `
      query($id: TenantId!) {
        findByIdTenant(id: $id) {
          id
          lbl
          domain_ids
          domain_ids_lbl
          menu_ids
          menu_ids_lbl
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
    findAllDomain: Query["findAllDomain"];
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
    findAllMenu: Query["findAllMenu"];
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
        query: /* GraphQL */ `
          query($search: TenantSearch, $sort: [SortInput!]) {
            findAllTenant(search: $search, sort: $sort) {
              id
              lbl
              domain_ids
              domain_ids_lbl
              menu_ids
              menu_ids_lbl
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
 * 批量导入
 * @param {TenantInput[]} models
 */
export async function importModels(
  models: TenantInput[],
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
