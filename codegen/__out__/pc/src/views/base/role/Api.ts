import {
  type Query,
  type Mutation,
  type PageInput,
  type RoleSearch,
  type RoleInput,
} from "#/types";

import {
  type MenuSearch,
  type UsrSearch,
} from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {RoleSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: RoleSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllRole: Query["findAllRole"];
  } = await query({
    query: /* GraphQL */ `
      query($search: RoleSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllRole(search: $search, page: $page, sort: $sort) {
          id
          lbl
          menu_ids
          menu_ids_lbl
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
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
  const res = data.findAllRole;
  for (let i = 0; i < res.length; i++) {
    const item = res[i];
  }
  return res;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
 * @param {RoleSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: RoleSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountRole: Query["findCountRole"];
  } = await query({
    query: /* GraphQL */ `
      query($search: RoleSearch) {
        findCountRole(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const res = data.findCountRole;
  return res;
}

/**
 * 创建一条数据
 * @export create
 * @param {RoleInput} model
 * @param {GqlOpt} opt?
 */
export async function create(
  model: RoleInput,
  opt?: GqlOpt,
) {
  const data: {
    createRole: Mutation["createRole"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: RoleInput!) {
        createRole(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  const res = data.createRole;
  return res;
}

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {string} id
 * @param {RoleInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: string,
  model: RoleInput,
  opt?: GqlOpt,
) {
  const data: {
    updateByIdRole: Mutation["updateByIdRole"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: String!, $model: RoleInput!) {
        updateByIdRole(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const res = data.updateByIdRole;
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
    findByIdRole: Query["findByIdRole"];
  } = await query({
    query: /* GraphQL */ `
      query($id: String!) {
        findByIdRole(id: $id) {
          id
          lbl
          menu_ids
          menu_ids_lbl
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
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
  const res = data.findByIdRole;
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
    deleteByIdsRole: Mutation["deleteByIdsRole"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
        deleteByIdsRole(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsRole;
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
    enableByIdsRole: Mutation["enableByIdsRole"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!, $is_enabled: Int!) {
        enableByIdsRole(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsRole;
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
    lockByIdsRole: Mutation["lockByIdsRole"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!, $is_locked: Int!) {
        lockByIdsRole(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsRole;
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
    revertByIdsRole: Mutation["revertByIdsRole"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
        revertByIdsRole(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsRole;
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
    forceDeleteByIdsRole: Mutation["forceDeleteByIdsRole"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
        forceDeleteByIdsRole(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsRole;
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
    search?: RoleSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const queryStr = getQueryUrl({
      query: /* GraphQL */ `
        query($search: RoleSearch, $sort: [SortInput!]) {
          findAllRole(search: $search, sort: $sort) {
            id
            lbl
            menu_ids
            menu_ids_lbl
            is_locked
            is_locked_lbl
            is_enabled
            is_enabled_lbl
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
          getFieldCommentsRole {
            lbl
            menu_ids
            menu_ids_lbl
            is_locked
            is_locked_lbl
            is_enabled
            is_enabled_lbl
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
        search,
        sort,
      },
    }, opt);
    try {
      const buffer = await workerFn(
        `${ location.origin }/excel_template/base/role.xlsx`,
        `${ location.origin }${ queryStr }`,
      );
      saveAsExcel(buffer, await nAsync("角色"));
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
 * @param {RoleInput[]} models
 * @export importModels
 */
export async function importModels(
  models: RoleInput[],
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
      await create(item, opt);
      succNum++;
    } catch (err) {
      failNum++;
      failErrMsgs.push(await nsAsync(`第 {0} 行导入失败: {1}`, i + 1, err));
    }
    
    percentage.value = Math.floor((i + 1) / models.length * 100);
  }
  
  return showUploadMsg(succNum, failNum, failErrMsgs);
}
