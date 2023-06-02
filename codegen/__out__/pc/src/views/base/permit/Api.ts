import {
  type Query,
  type Mutation,
  type PageInput,
  type PermitModel,
  type PermitSearch,
  type PermitInput,
} from "#/types";

import {
  type RoleSearch,
  type MenuSearch,
  type UsrSearch,
} from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {PermitSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: PermitSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllPermit: Query["findAllPermit"];
  } = await query({
    query: /* GraphQL */ `
      query($search: PermitSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllPermit(search: $search, page: $page, sort: $sort) {
          id
          role_id
          role_id_lbl
          menu_id
          menu_id_lbl
          code
          lbl
          is_visible
          is_visible_lbl
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
      page,
      sort,
    },
  }, opt);
  const result = data.findAllPermit;
  for (let i = 0; i < result.length; i++) {
    const item = result[i];
  }
  return result;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
 * @param {PermitSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: PermitSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountPermit: Query["findCountPermit"];
  } = await query({
    query: /* GraphQL */ `
      query($search: PermitSearch) {
        findCountPermit(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const result = data.findCountPermit;
  return result;
}

/**
 * 创建一条数据
 * @export create
 * @param {PermitInput} model
 * @param {GqlOpt} opt?
 */
export async function create(
  model: PermitInput,
  opt?: GqlOpt,
) {
  const data: {
    createPermit: Mutation["createPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: PermitInput!) {
        createPermit(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  const result = data.createPermit;
  return result;
}

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {string} id
 * @param {PermitInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: string,
  model: PermitInput,
  opt?: GqlOpt,
) {
  const data: {
    updateByIdPermit: Mutation["updateByIdPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: String!, $model: PermitInput!) {
        updateByIdPermit(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const result = data.updateByIdPermit;
  return result;
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
    findByIdPermit: Query["findByIdPermit"];
  } = await query({
    query: /* GraphQL */ `
      query($id: String!) {
        findByIdPermit(id: $id) {
          id
          role_id
          role_id_lbl
          menu_id
          menu_id_lbl
          code
          lbl
          is_visible
          is_visible_lbl
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
  const result = data.findByIdPermit;
  return result;
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
    deleteByIdsPermit: Mutation["deleteByIdsPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
        deleteByIdsPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.deleteByIdsPermit;
  return result;
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
    revertByIdsPermit: Mutation["revertByIdsPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
        revertByIdsPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.revertByIdsPermit;
  return result;
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
    forceDeleteByIdsPermit: Mutation["forceDeleteByIdsPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
        forceDeleteByIdsPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.forceDeleteByIdsPermit;
  return result;
}

export async function findAllRole(
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
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const result = data.findAllRole;
  return result;
}

export async function getRoleList() {
  const data = await findAllRole(
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
  const result = data.findAllMenu;
  return result;
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
  const result = data.findAllUsr;
  return result;
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
export function useExportExcel() {
  const route = useRoute();
  const {
    nAsync,
    nsAsync,
  } = useI18n(route.path);
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2(
    search?: PermitSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const queryStr = getQueryUrl({
      query: /* GraphQL */ `
        query($search: PermitSearch, $sort: [SortInput!]) {
          findAllPermit(search: $search, sort: $sort) {
            id
            role_id
            role_id_lbl
            menu_id
            menu_id_lbl
            code
            lbl
            is_visible
            is_visible_lbl
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
          getFieldCommentsPermit {
            role_id
            role_id_lbl
            menu_id
            menu_id_lbl
            code
            lbl
            is_visible
            is_visible_lbl
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
        `${ location.origin }/excel_template/base/permit.xlsx`,
        `${ location.origin }${ queryStr }`,
      );
      saveAsExcel(buffer, await nAsync("权限"));
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
 * @param {PermitInput[]} models
 * @export importModels
 */
export async function importModels(
  models: PermitInput[],
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
