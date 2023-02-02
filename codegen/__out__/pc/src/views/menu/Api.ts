import {
  type Query,
  type Mutation,
  type PageInput,
  type MenuModel,
  type MenuSearch,
  type MenuInput,
} from "#/types";

import {
} from "#/types";

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
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($search: MenuSearch, $page: PageInput, $sort: [SortInput]) {
        findAllMenu(search: $search, page: $page, sort: $sort) {
          id
          type
          _type
          menu_id
          _menu_id
          lbl
          route_path
          route_query
          is_enabled
          _is_enabled
          order_by
          rem
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
  for (let i = 0; i < result.length; i++) {
    const item = result[i];
    item.route_query = item.route_query && JSON.stringify(item.route_query) || "";
  }
  return result;
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
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($search: MenuSearch) {
        findCountMenu(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const result = data.findCountMenu;
  return result;
}

/**
 * 创建一条数据
 * @export create
 * @param {MenuInput} model
 * @param {GqlOpt} opt?
 */
export async function create(
  model: MenuInput,
  opt?: GqlOpt,
) {
  const data: {
    createMenu: Mutation["createMenu"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($model: MenuInput!) {
        createMenu(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  const result = data.createMenu;
  return result;
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
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($id: ID!, $model: MenuInput!) {
        updateByIdMenu(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const result = data.updateByIdMenu;
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
    findByIdMenu: Query["findByIdMenu"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($id: ID!) {
        findByIdMenu(id: $id) {
          id
          type
          _type
          menu_id
          _menu_id
          lbl
          route_path
          route_query
          is_enabled
          _is_enabled
          order_by
          rem
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result = data.findByIdMenu;
  if (result?.route_query) {
    result.route_query = JSON.stringify(result.route_query);
  }
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
    deleteByIdsMenu: Mutation["deleteByIdsMenu"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        deleteByIdsMenu(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.deleteByIdsMenu;
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
    revertByIdsMenu: Mutation["revertByIdsMenu"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        revertByIdsMenu(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.revertByIdsMenu;
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
    forceDeleteByIdsMenu: Mutation["forceDeleteByIdsMenu"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        forceDeleteByIdsMenu(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.forceDeleteByIdsMenu;
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
  } = await gqlQuery({
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
 * @export exportExcel
 * @param {MenuSearch} search?
 * @param {Sort[]} sort?
 */
export async function exportExcel(
  search?: MenuSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    exportExcelMenu: Query["exportExcelMenu"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($search: MenuSearch, $sort: [SortInput]) {
        exportExcelMenu(search: $search, sort: $sort)
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const result = data.exportExcelMenu;
  return result;
}

/**
 * 导入文件
 * @param {File} file
 * @export importFile
 */
export async function importFile(
  file: File,
  opt?: GqlOpt,
) {
  if (!file) return;
  const id = await uploadFile(file, undefined, { type: "tmpfile" });
  if (!id) return;
  const data: {
    importFileMenu: Mutation["importFileMenu"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($id: ID!) {
        importFileMenu(id: $id)
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result = data.importFileMenu;
  return result;
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
  } = await gqlQuery({
    query: /* GraphQL */ `
      query {
        findLastOrderByMenu
      }
    `,
  }, opt);
  const result = data.findLastOrderByMenu;
  return result;
}
