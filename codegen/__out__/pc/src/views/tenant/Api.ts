import { TenantModel, TenantSearch } from "./Model";
import { gql, GqlOpt, gqlQuery, baseURL } from "@/utils/graphql";
import useUsrStore from "@/store/usr";
import { PageModel } from "@/utils/page.model";

import { MenuModel, MenuSearch } from "../menu/Model";
/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {TenantSearch} search
 * @param {PageModel} page
 * @param {GqlOpt} [opt]
 * @return {Promise<TenantModel[]>}
 */
export async function findAll(
  search?: TenantSearch,
  page?: PageModel,
  opt?: GqlOpt,
): Promise<TenantModel[]> {
  const rvData = await gqlQuery({
    query: gql`
      query($search: TenantSearch, $page: PageInput) {
        findAllTenant(search: $search, page: $page) {
          id
          lbl
          host
          expiration
          max_usr_num
          is_enabled
          _is_enabled
          menu_ids
          _menu_ids
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
  const data = rvData?.findAllTenant || [ ];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
  }
  return data;
}

/**
 * 根据搜索条件和分页查找数据和总数
 * @export findAllAndCount
 * @param {TenantSearch} search
 * @param {PageModel} page
 * @param {GqlOpt} [opt]
 * @return {Promise<{ data: TenantModel[], count: number }>} 
 */
export async function findAllAndCount(
  search?: TenantSearch,
  page?: PageModel,
  opt?: GqlOpt,
): Promise<{ data: TenantModel[], count: number }> {
  const rvData = await gqlQuery({
    query: gql`
      query($search: TenantSearch, $page: PageInput) {
        findAllTenant(search: $search, page: $page) {
          id
          lbl
          host
          expiration
          max_usr_num
          is_enabled
          _is_enabled
          menu_ids
          _menu_ids
          order_by
          rem
        }
        findCountTenant(search: $search)
      }
    `,
    variables: {
      search,
      page,
    },
  }, opt);
  const data = { data: rvData?.findAllTenant || [ ], count: rvData?.findCountTenant || 0 };
  for (let i = 0; i < data.data.length; i++) {
    const item = data.data[i];
  }
  return data;
}

/**
 * 创建一条数据
 * @export create
 * @param {TenantModel} model
 * @param {GqlOpt} [opt]
 * @return {Promise<string>} id
 */
export async function create(
  model: TenantModel,
  opt?: GqlOpt,
): Promise<string> {
  const data = await gqlQuery({
    query: gql`
      mutation($model: TenantInput!) {
        createTenant(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  return data?.createTenant;
}

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {string} id
 * @param {GqlOpt} [opt]
 * @return {Promise<boolean>}
 */
export async function updateById(
  id: string,
  model: TenantModel,
  opt?: GqlOpt,
): Promise<boolean> {
  const data = await gqlQuery({
    query: gql`
      mutation($id: ID!, $model: TenantInput!) {
        updateByIdTenant(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  return data?.updateByIdTenant;
}

/**
 * 通过ID查找一条数据
 * @export findById
 * @param {string} id
 * @param {GqlOpt} [opt]
 * @return {Promise<TenantModel>}
 */
export async function findById(
  id: string,
  opt?: GqlOpt,
): Promise<TenantModel> {
  const rvData = await gqlQuery({
    query: gql`
      query($id: ID!) {
        findByIdTenant(id: $id) {
          id
          lbl
          host
          expiration
          max_usr_num
          is_enabled
          _is_enabled
          menu_ids
          _menu_ids
          order_by
          rem
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const data = rvData?.findByIdTenant;
  return data;
}

/**
 * 根据ID列表删除数据
 * @export deleteByIds
 * @param {string[]} ids
 * @param {GqlOpt} [opt]
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: string[],
  opt?: GqlOpt,
): Promise<number> {
  const data = await gqlQuery({
    query: gql`
      mutation($ids: [ID]!) {
        deleteByIdsTenant(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  return data?.deleteByIdsTenant;
}

/**
 * 根据ID列表从回收站还原数据
 * @export revertByIds
 * @param {string[]} ids
 * @param {GqlOpt} [opt]
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: string[],
  opt?: GqlOpt,
): Promise<number> {
  const data = await gqlQuery({
    query: gql`
      mutation($ids: [ID]!) {
        revertByIdsTenant(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  return data?.revertByIdsTenant;
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
  return { data: data?.findAllMenu || [ ], count: data?.findCountMenu || 0 };
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
 * @param {TenantSearch} search
 */
export async function exportExcel(
  search: TenantSearch,
) {
  let url = `${ baseURL }/api/exportExcelTenant`;
  const usrStore = useUsrStore();
  const access_token: string = usrStore.access_token;
  const params = new URLSearchParams();
  if (access_token) {
    params.set("access_token", access_token);
  }
  if (search) {
    const keys = Object.keys(search);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = search[key];
      if (value == null) continue;
      params.set(key, value);
    }
  }
  url += "?" + params.toString();
  window.location.href = url;
}

/**
 * 查找order_by字段的最大值
 * @export findLastOrderBy
 * @param {GqlOpt} [opt]
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
  opt?: GqlOpt,
): Promise<number> {
  const data = await gqlQuery({
    query: gql`
      query {
        findLastOrderByTenant
      }
    `,
  }, opt);
  return data?.findLastOrderByTenant || 1;
}
