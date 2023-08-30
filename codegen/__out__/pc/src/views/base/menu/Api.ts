import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
  MenuSearch,
  MenuInput,
  MenuModel,
} from "#/types";

import type {
  TenantSearch,
  UsrSearch,
} from "#/types";

import {
  findTree as findMenuTree,
} from "@/views/base/menu/Api";

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {MenuSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
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
          type
          type_lbl
          parent_id
          parent_id_lbl
          lbl
          route_path
          route_query
          is_locked
          is_locked_lbl
          tenant_ids
          tenant_ids_lbl
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
  const res = data.findAllMenu;
  for (let i = 0; i < res.length; i++) {
    const item = res[i];
    item.route_query = item.route_query && JSON.stringify(item.route_query) || "";
  }
  return res;
}

export type MenuModelTree = MenuModel & {
  children?: MenuModelTree[];
}

/**
 * 查找树形数据
 * @param sort 
 * @param opt 
 * @returns 
 */
export async function findTree(
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const res = await findAll(
    undefined,
    undefined,
    sort,
    opt,
  );
  const treeData = list2tree(res);
  return treeData;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
 * @param {MenuSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: MenuSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountMenu: Query["findCountMenu"];
  } = await query({
    query: /* GraphQL */ `
      query($search: MenuSearch) {
        findCountMenu(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const res = data.findCountMenu;
  return res;
}

/**
 * 创建一条数据
 * @export create
 * @param {MenuInput} model
 * @param {UniqueType} uniqueType?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: MenuInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
) {
  const data: {
    createMenu: Mutation["createMenu"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: MenuInput!, $unique_type: UniqueType) {
        createMenu(model: $model, unique_type: $unique_type)
      }
    `,
    variables: {
      model,
      unique_type,
    },
  }, opt);
  const res = data.createMenu;
  return res;
}

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {string} id
 * @param {MenuInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: string,
  model: MenuInput,
  opt?: GqlOpt,
) {
  const data: {
    updateByIdMenu: Mutation["updateByIdMenu"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: String!, $model: MenuInput!) {
        updateByIdMenu(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const res = data.updateByIdMenu;
  return res;
}

/**
 * 通过ID查找一条数据
 * @export findById
 * @param {string} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: string,
  opt?: GqlOpt,
) {
  const data: {
    findByIdMenu: Query["findByIdMenu"];
  } = await query({
    query: /* GraphQL */ `
      query($id: String!) {
        findByIdMenu(id: $id) {
          id
          type
          type_lbl
          parent_id
          parent_id_lbl
          lbl
          route_path
          route_query
          is_locked
          is_locked_lbl
          tenant_ids
          tenant_ids_lbl
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
    `,
    variables: {
      id,
    },
  }, opt);
  const res = data.findByIdMenu;
  if (res?.route_query) {
    res.route_query = JSON.stringify(res.route_query);
  }
  return res;
}

/**
 * 根据 ids 删除数据
 * @export deleteByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: string[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsMenu: Mutation["deleteByIdsMenu"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
        deleteByIdsMenu(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsMenu;
  return res;
}

/**
 * 根据 ids 启用或禁用数据
 * @export enableByIds
 * @param {string[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
 */
export async function enableByIds(
  ids: string[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    enableByIdsMenu: Mutation["enableByIdsMenu"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!, $is_enabled: Int!) {
        enableByIdsMenu(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsMenu;
  return res;
}

/**
 * 根据 ids 锁定或解锁数据
 * @export lockByIds
 * @param {string[]} ids
 * @param {0 | 1} is_locked
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: string[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    lockByIdsMenu: Mutation["lockByIdsMenu"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!, $is_locked: Int!) {
        lockByIdsMenu(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsMenu;
  return res;
}

/**
 * 根据 ids 从回收站还原数据
 * @export revertByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: string[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsMenu: Mutation["revertByIdsMenu"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
        revertByIdsMenu(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsMenu;
  return res;
}

/**
 * 根据 ids 彻底删除数据
 * @export forceDeleteByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: string[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsMenu: Mutation["forceDeleteByIdsMenu"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
        forceDeleteByIdsMenu(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsMenu;
  return res;
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
    undefined,
    {
    },
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

export async function findAllTenant(
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
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const res = data.findAllTenant;
  return res;
}

export async function getTenantList() {
  const data = await findAllTenant(
    undefined,
    {
    },
    [
      {
        prop: "",
        order: "ascending",
      },
    ],
    {
      notLoading: true,
    },
  );
  return data;
}

export async function findAllUsr(
  search?: UsrSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllUsr: Query["findAllUsr"];
  } = await query({
    query: /* GraphQL */ `
      query($search: UsrSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllUsr(search: $search, page: $page, sort: $sort) {
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
  const res = data.findAllUsr;
  return res;
}

export async function getUsrList() {
  const data = await findAllUsr(
    undefined,
    {
    },
    [
      {
        prop: "",
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
    nAsync,
    nsAsync,
  } = useI18n(routePath);
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const queryStr = getQueryUrl({
      query: /* GraphQL */ `
        query {
          getFieldCommentsMenu {
            type_lbl
            parent_id_lbl
            lbl
            route_path
            route_query
            is_locked_lbl
            tenant_ids_lbl
            is_enabled_lbl
            order_by
            rem
            create_usr_id_lbl
            create_time_lbl
            update_usr_id_lbl
            update_time_lbl
          }
          findAllMenu {
            id
            lbl
          }
          findAllTenant {
            id
            lbl
          }
          findAllUsr {
            id
            lbl
          }
          getDict(codes: [
            "type",
            "is_locked",
            "is_enabled",
          ]) {
            code
            lbl
          }
          getDictbiz(codes: [
          ]) {
            code
            lbl
          }
        }
      `,
      variables: {
      },
    });
    const buffer = await workerFn(
      `${ location.origin }/import_template/base/menu.xlsx`,
      `${ location.origin }${ queryStr }`,
    );
    saveAsExcel(buffer, `${ await nAsync("菜单") }${ await nsAsync("导入模板") }`);
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
    search?: MenuSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const queryStr = getQueryUrl({
      query: /* GraphQL */ `
        query($search: MenuSearch, $sort: [SortInput!]) {
          findAllMenu(search: $search, sort: $sort) {
            id
            type
            type_lbl
            parent_id
            parent_id_lbl
            lbl
            route_path
            route_query
            is_locked
            is_locked_lbl
            tenant_ids
            tenant_ids_lbl
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
          getFieldCommentsMenu {
            type_lbl
            parent_id_lbl
            lbl
            route_path
            route_query
            is_locked_lbl
            tenant_ids_lbl
            is_enabled_lbl
            order_by
            rem
            create_usr_id_lbl
            create_time_lbl
            update_usr_id_lbl
            update_time_lbl
          }
          findAllMenu {
            id
            lbl
          }
          findAllTenant {
            id
            lbl
          }
          findAllUsr {
            id
            lbl
          }
          getDict(codes: [
            "type",
            "is_locked",
            "is_enabled",
          ]) {
            code
            lbl
          }
          getDictbiz(codes: [
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
        `${ location.origin }/excel_template/base/menu.xlsx`,
        `${ location.origin }${ queryStr }`,
      );
      saveAsExcel(buffer, await nAsync("菜单"));
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
 * @param {MenuInput[]} models
 * @export importModels
 */
export async function importModels(
  models: MenuInput[],
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
    
    percentage.value = Math.floor((i + 1) / models.length * 100);
  }
  
  return showUploadMsg(succNum, failNum, failErrMsgs);
}

/**
 * 查找order_by字段的最大值
 * @export findLastOrderBy
 * @param {GqlOpt} opt?
 */
export async function findLastOrderBy(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByMenu: Query["findLastOrderByMenu"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByMenu
      }
    `,
  }, opt);
  const res = data.findLastOrderByMenu;
  return res;
}
