import {
  type Query,
  type Mutation,
  type PageInput,
  type RoleModel,
  type RoleSearch,
  type RoleInput,
} from "#/types";

import {
  type MenuSearch,
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
      query($search: RoleSearch, $page: PageInput, $sort: [SortInput]) {
        findAllRole(search: $search, page: $page, sort: $sort) {
          id
          lbl
          rem
          is_enabled
          _is_enabled
          menu_ids
          _menu_ids
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
  for (let i = 0; i < result.length; i++) {
    const item = result[i];
  }
  return result;
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
  const result = data.findCountRole;
  return result;
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
  const result = data.createRole;
  return result;
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
      mutation($id: ID!, $model: RoleInput!) {
        updateByIdRole(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const result = data.updateByIdRole;
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
    findByIdRole: Query["findByIdRole"];
  } = await query({
    query: /* GraphQL */ `
      query($id: ID!) {
        findByIdRole(id: $id) {
          id
          lbl
          rem
          is_enabled
          _is_enabled
          menu_ids
          _menu_ids
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result = data.findByIdRole;
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
    deleteByIdsRole: Mutation["deleteByIdsRole"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        deleteByIdsRole(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.deleteByIdsRole;
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
    revertByIdsRole: Mutation["revertByIdsRole"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        revertByIdsRole(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.revertByIdsRole;
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
    forceDeleteByIdsRole: Mutation["forceDeleteByIdsRole"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        forceDeleteByIdsRole(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.forceDeleteByIdsRole;
  return result;
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
      query($search: MenuSearch, $page: PageInput, $sort: [SortInput]) {
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

/**
 * 导出Excel
 */
export function useExportExcel() {
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
        query($search: RoleSearch, $sort: [SortInput]) {
          findAllRole(search: $search, sort: $sort) {
            id
            lbl
            rem
            is_enabled
            _is_enabled
            menu_ids
            _menu_ids
          }
          getFieldCommentsRole {
            lbl
            rem
            is_enabled
            _is_enabled
            menu_ids
            _menu_ids
          }
        }
      `,
      variables: {
        search,
        sort,
      },
    }, opt);
    const buffer = await workerFn(
      `${ location.origin }/excel_template/role.xlsx`,
      `${ location.origin }${ queryStr }`,
    );
    saveAsExcel(buffer, "角色");
  }
  return {
    workerFn: workerFn2,
    workerStatus,
    workerTerminate,
  };
}

/**
 * 批量导入
 * @param {File} file
 * @export importFile
 */
export async function importFile(
  file: File,
  header: { [key: string]: string },
  opt?: GqlOpt,
) {
  const models = await getExcelData(file, header);
  const data: {
    importModelsRole: Mutation["importModelsRole"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($models: [RoleInput!]!) {
        importModelsRole(models: $models)
      }
    `,
    variables: {
      models,
    },
  }, opt);
  const res = data.importModelsRole;
  return res;
}
