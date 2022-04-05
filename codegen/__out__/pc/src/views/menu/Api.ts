import { MenuModel, MenuSearch } from "./Model";
import { gql, GqlOpt, gqlQuery, baseURL } from "@/utils/graphql";
import { PageModel } from "@/utils/page.model";

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {MenuSearch} search
 * @param {PageModel} page
 * @param {GqlOpt} opt?
 * @return {Promise<MenuModel[]>}
 */
export async function findAll(
  search?: MenuSearch,
  page?: PageModel,
  opt?: GqlOpt,
): Promise<MenuModel[]> {
  const rvData = await gqlQuery({
    query: gql`
      query($search: MenuSearch, $page: PageInput) {
        findAllMenu(search: $search, page: $page) {
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
    },
  }, opt);
  const data = rvData?.findAllMenu || [ ];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item.route_query) {
      item.route_query = JSON.stringify(item.route_query);
    }
  }
  return data;
}

/**
 * 根据搜索条件和分页查找数据和总数
 * @export findAllAndCount
 * @param {MenuSearch} search
 * @param {PageModel} page
 * @param {GqlOpt} opt?
 * @return {Promise<{ data: MenuModel[], count: number }>} 
 */
export async function findAllAndCount(
  search?: MenuSearch,
  page?: PageModel,
  opt?: GqlOpt,
): Promise<{ data: MenuModel[], count: number }> {
  const rvData = await gqlQuery({
    query: gql`
      query($search: MenuSearch, $page: PageInput) {
        findAllMenu(search: $search, page: $page) {
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
        findCountMenu(search: $search)
      }
    `,
    variables: {
      search,
      page,
    },
  }, opt);
  const data = {
    data: rvData?.findAllMenu || [ ],
    count: rvData?.findCountMenu || 0,
  };
  for (let i = 0; i < data.data.length; i++) {
    const item = data.data[i];
    if (item.route_query) {
      item.route_query = JSON.stringify(item.route_query);
    }
  }
  return data;
}

/**
 * 创建一条数据
 * @export create
 * @param {MenuModel} model
 * @param {GqlOpt} opt?
 * @return {Promise<string>} id
 */
export async function create(
  model: MenuModel,
  opt?: GqlOpt,
): Promise<string> {
  const data = await gqlQuery({
    query: gql`
      mutation($model: MenuInput!) {
        createMenu(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  return data?.createMenu;
}

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {string} id
 * @param {GqlOpt} opt?
 * @return {Promise<boolean>}
 */
export async function updateById(
  id: string,
  model: MenuModel,
  opt?: GqlOpt,
): Promise<boolean> {
  const data = await gqlQuery({
    query: gql`
      mutation($id: ID!, $model: MenuInput!) {
        updateByIdMenu(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  return data?.updateByIdMenu;
}

/**
 * 通过ID查找一条数据
 * @export findById
 * @param {string} id
 * @param {GqlOpt} opt?
 * @return {Promise<MenuModel>}
 */
export async function findById(
  id: string,
  opt?: GqlOpt,
): Promise<MenuModel> {
  const rvData = await gqlQuery({
    query: gql`
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
  const data = rvData?.findByIdMenu;
  if (data?.route_query) {
    data.route_query = JSON.stringify(data.route_query);
  }
  return data;
}

/**
 * 根据ID列表删除数据
 * @export deleteByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: string[],
  opt?: GqlOpt,
): Promise<number> {
  const data = await gqlQuery({
    query: gql`
      mutation($ids: [ID]!) {
        deleteByIdsMenu(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  return data?.deleteByIdsMenu;
}

/**
 * 根据ID列表从回收站还原数据
 * @export revertByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: string[],
  opt?: GqlOpt,
): Promise<number> {
  const data = await gqlQuery({
    query: gql`
      mutation($ids: [ID]!) {
        revertByIdsMenu(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  return data?.revertByIdsMenu;
}

export async function findAllAndCountMenu(
  search?: MenuSearch,
  page?: PageModel,
  opt?: GqlOpt,
): Promise<{ data: MenuModel[], count: number }> {
  const data = await gqlQuery({
    query: gql`
      query($search: MenuSearch, $page: PageInput) {
        findAllMenu(search: $search, page: $page) {
          id
          lbl
        }
        findCountMenu(search: $search)
      }
    `,
    variables: {
      search,
      page,
    },
  }, opt);
  return {
    data: data?.findAllMenu || [ ],
    count: data?.findCountMenu || 0,
  };
}

export async function findAllMenu(
  search?: MenuSearch,
  page?: PageModel,
  opt?: GqlOpt,
): Promise<MenuModel[]> {
  const data = await gqlQuery({
    query: gql`
      query($search: MenuSearch, $page: PageInput) {
        findAllMenu(search: $search, page: $page) {
          id
          lbl
        }
      }
    `,
    variables: {
      search,
      page,
    },
  }, opt);
  return data?.findAllMenu || [ ];
}

/**
 * 导出Excel
 * @export exportExcel
 * @param {UsrSearch} search
 */
export async function exportExcel(
  search?: MenuSearch,
  opt?: GqlOpt,
): Promise<string> {
  const rvData = await gqlQuery({
    query: gql`
      query($search: MenuSearch) {
        exportExcelMenu(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  return rvData?.exportExcelMenu || "";
}

/**
 * 查找order_by字段的最大值
 * @export findLastOrderBy
 * @param {GqlOpt} opt?
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
  opt?: GqlOpt,
): Promise<number> {
  const data = await gqlQuery({
    query: gql`
      query {
        findLastOrderByMenu
      }
    `,
  }, opt);
  return data?.findLastOrderByMenu || 1;
}
