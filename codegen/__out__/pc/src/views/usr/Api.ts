import { UsrModel, UsrSearch } from "./Model";
import { gql, GqlOpt, gqlQuery, baseURL } from "@/utils/graphql";
import useUsrStore from "@/store/usr";
import { PageModel } from "@/utils/page.model";

import { RoleModel, RoleSearch } from "../role/Model";
/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {UsrSearch} search
 * @param {PageModel} page
 * @param {GqlOpt} opt?
 * @return {Promise<UsrModel[]>}
 */
export async function findAll(
  search?: UsrSearch,
  page?: PageModel,
  opt?: GqlOpt,
): Promise<UsrModel[]> {
  const rvData = await gqlQuery({
    query: gql`
      query($search: UsrSearch, $page: PageInput) {
        findAllUsr(search: $search, page: $page) {
          id
          lbl
          username
          password
          is_enabled
          _is_enabled
          role_ids
          _role_ids
          rem
        }
      }
    `,
    variables: {
      search,
      page,
    },
  }, opt);
  const data = rvData?.findAllUsr || [ ];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
  }
  return data;
}

/**
 * 根据搜索条件和分页查找数据和总数
 * @export findAllAndCount
 * @param {UsrSearch} search
 * @param {PageModel} page
 * @param {GqlOpt} opt?
 * @return {Promise<{ data: UsrModel[], count: number }>} 
 */
export async function findAllAndCount(
  search?: UsrSearch,
  page?: PageModel,
  opt?: GqlOpt,
): Promise<{ data: UsrModel[], count: number }> {
  const rvData = await gqlQuery({
    query: gql`
      query($search: UsrSearch, $page: PageInput) {
        findAllUsr(search: $search, page: $page) {
          id
          lbl
          username
          password
          is_enabled
          _is_enabled
          role_ids
          _role_ids
          rem
        }
        findCountUsr(search: $search)
      }
    `,
    variables: {
      search,
      page,
    },
  }, opt);
  const data = { data: rvData?.findAllUsr || [ ], count: rvData?.findCountUsr || 0 };
  for (let i = 0; i < data.data.length; i++) {
    const item = data.data[i];
  }
  return data;
}

/**
 * 创建一条数据
 * @export create
 * @param {UsrModel} model
 * @param {GqlOpt} opt?
 * @return {Promise<string>} id
 */
export async function create(
  model: UsrModel,
  opt?: GqlOpt,
): Promise<string> {
  const data = await gqlQuery({
    query: gql`
      mutation($model: UsrInput!) {
        createUsr(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  return data?.createUsr;
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
  model: UsrModel,
  opt?: GqlOpt,
): Promise<boolean> {
  const data = await gqlQuery({
    query: gql`
      mutation($id: ID!, $model: UsrInput!) {
        updateByIdUsr(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  return data?.updateByIdUsr;
}

/**
 * 通过ID查找一条数据
 * @export findById
 * @param {string} id
 * @param {GqlOpt} opt?
 * @return {Promise<UsrModel>}
 */
export async function findById(
  id: string,
  opt?: GqlOpt,
): Promise<UsrModel> {
  const rvData = await gqlQuery({
    query: gql`
      query($id: ID!) {
        findByIdUsr(id: $id) {
          id
          lbl
          username
          password
          is_enabled
          _is_enabled
          role_ids
          _role_ids
          rem
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const data = rvData?.findByIdUsr;
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
        deleteByIdsUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  return data?.deleteByIdsUsr;
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
        revertByIdsUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  return data?.revertByIdsUsr;
}

export async function findAllAndCountRole(
  search?: RoleSearch,
  page?: PageModel,
  opt?: GqlOpt,
): Promise<{ data: RoleModel[], count: number }> {
  const data = await gqlQuery({
    query: gql`
      query($search: RoleSearch, $page: PageInput) {
        findAllRole(search: $search, page: $page) {
          id
          lbl
        }
        findCountRole(search: $search)
      }
    `,
    variables: {
      search,
      page,
    },
  }, opt);
  return { data: data?.findAllRole || [ ], count: data?.findCountRole || 0 };
}

export async function findAllRole(
  search?: RoleSearch,
  page?: PageModel,
  opt?: GqlOpt,
): Promise<RoleModel[]> {
  const data = await gqlQuery({
    query: gql`
      query($search: RoleSearch, $page: PageInput) {
        findAllRole(search: $search, page: $page) {
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
  return data?.findAllRole || [ ];
}

/**
 * 导出Excel
 * @export exportExcel
 * @param {UsrSearch} search
 */
export async function exportExcel(
  search: UsrSearch,
) {
  let url = `${ baseURL }/api/exportExcelUsr`;
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
