import {
  UniqueType,
} from "#/types";

import type {
  MenuId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
  MenuSearch,
  MenuInput,
  MenuModel,
} from "#/types";

import {
  findTree as findMenuTree,
} from "@/views/base/menu/Api";

/**
 * 根据搜索条件查找菜单列表
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
  }
  return res;
}

/**
 * 根据搜索条件查找第一个菜单
 * @export findOne
 * @param {MenuSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: MenuSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneMenu: Query["findOneMenu"];
  } = await query({
    query: /* GraphQL */ `
      query($search: MenuSearch, $sort: [SortInput!]) {
        findOneMenu(search: $search, sort: $sort) {
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
  const model = data.findOneMenu;
  if (model) {
  }
  return model;
}

export type MenuModelTree = MenuModel & {
  children?: MenuModelTree[];
}

/**
 * 查找菜单树形列表
 * @param sort 
 * @param opt 
 * @returns 
 */
export async function findTree(
  search?: MenuSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const res = await findAll(
    search,
    undefined,
    sort,
    opt,
  );
  const treeData = list2tree(res);
  return treeData;
}

/**
 * 根据搜索条件查找菜单总数
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
 * 创建一条菜单
 * @export create
 * @param {MenuInput} model
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: MenuInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<MenuId> {
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
  const id: MenuId = data.createMenu;
  return id;
}

/**
 * 根据id修改一条菜单
 * @export updateById
 * @param {MenuId} id
 * @param {MenuInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: MenuId,
  model: MenuInput,
  opt?: GqlOpt,
): Promise<MenuId> {
  const data: {
    updateByIdMenu: Mutation["updateByIdMenu"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: MenuId!, $model: MenuInput!) {
        updateByIdMenu(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const id2: MenuId = data.updateByIdMenu;
  return id2;
}

/**
 * 通过ID查找一条菜单
 * @export findById
 * @param {MenuId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: MenuId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdMenu: Query["findByIdMenu"];
  } = await query({
    query: /* GraphQL */ `
      query($id: MenuId!) {
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
  return res;
}

/**
 * 根据 ids 删除菜单
 * @export deleteByIds
 * @param {MenuId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: MenuId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsMenu: Mutation["deleteByIdsMenu"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [MenuId!]!) {
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
 * 根据 ids 启用或禁用菜单
 * @export enableByIds
 * @param {MenuId[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
 */
export async function enableByIds(
  ids: MenuId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    enableByIdsMenu: Mutation["enableByIdsMenu"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [MenuId!]!, $is_enabled: Int!) {
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
 * 根据 ids 锁定或解锁菜单
 * @export lockByIds
 * @param {MenuId[]} ids
 * @param {0 | 1} is_locked
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: MenuId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    lockByIdsMenu: Mutation["lockByIdsMenu"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [MenuId!]!, $is_locked: Int!) {
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
 * 根据 ids 从回收站还原菜单
 * @export revertByIds
 * @param {MenuId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: MenuId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsMenu: Mutation["revertByIdsMenu"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [MenuId!]!) {
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
 * 根据 ids 彻底删除菜单
 * @export forceDeleteByIds
 * @param {MenuId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: MenuId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsMenu: Mutation["forceDeleteByIdsMenu"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [MenuId!]!) {
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
          getFieldCommentsMenu {
            type_lbl
            parent_id_lbl
            lbl
            route_path
            route_query
            order_by
            rem
          }
          findAllMenu {
            id
            lbl
          }
          getDict(codes: [
            "menu_type",
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
      {
        data,
      },
    );
    saveAsExcel(buffer, `${ await nAsync("菜单") }${ await nsAsync("导入") }`);
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
    const data = await query({
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
            is_enabled_lbl
            order_by
            rem
            create_usr_id_lbl
            create_time_lbl
            update_usr_id_lbl
            update_time_lbl
          }
          findAllMenu {
            lbl
          }
          getDict(codes: [
            "menu_type",
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
        `${ location.origin }/excel_template/base/menu.xlsx`,
        {
          data,
        },
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
