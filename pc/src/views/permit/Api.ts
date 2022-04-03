import { PermitModel, PermitSearch } from "./Model";
import { gql, GqlOpt, gqlQuery, baseURL } from "@/utils/graphql";
import useUsrStore from "@/store/usr";
import { PageModel } from "@/utils/page.model";

import { MenuModel, MenuSearch } from "../menu/Model";
/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {PermitSearch} search
 * @param {PageModel} page
 * @param {GqlOpt} opt?
 * @return {Promise<PermitModel[]>}
 */
export async function findAll(
  search?: PermitSearch,
  page?: PageModel,
  opt?: GqlOpt,
): Promise<PermitModel[]> {
  const rvData = await gqlQuery({
    query: gql`
      query($search: PermitSearch, $page: PageInput) {
        findAllPermit(search: $search, page: $page) {
          id
          menu_id
          _menu_id
          lbl
          rem
        }
      }
    `,
    variables: {
      search,
      page,
    },
  }, opt);
  const data = rvData?.findAllPermit || [ ];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
  }
  return data;
}

/**
 * 根据搜索条件和分页查找数据和总数
 * @export findAllAndCount
 * @param {PermitSearch} search
 * @param {PageModel} page
 * @param {GqlOpt} opt?
 * @return {Promise<{ data: PermitModel[], count: number }>} 
 */
export async function findAllAndCount(
  search?: PermitSearch,
  page?: PageModel,
  opt?: GqlOpt,
): Promise<{ data: PermitModel[], count: number }> {
  const rvData = await gqlQuery({
    query: gql`
      query($search: PermitSearch, $page: PageInput) {
        findAllPermit(search: $search, page: $page) {
          id
          menu_id
          _menu_id
          lbl
          rem
        }
        findCountPermit(search: $search)
      }
    `,
    variables: {
      search,
      page,
    },
  }, opt);
  const data = {
    data: rvData?.findAllPermit || [ ],
    count: rvData?.findCountPermit || 0,
  };
  for (let i = 0; i < data.data.length; i++) {
    const item = data.data[i];
  }
  return data;
}

/**
 * 创建一条数据
 * @export create
 * @param {PermitModel} model
 * @param {GqlOpt} opt?
 * @return {Promise<string>} id
 */
export async function create(
  model: PermitModel,
  opt?: GqlOpt,
): Promise<string> {
  const data = await gqlQuery({
    query: gql`
      mutation($model: PermitInput!) {
        createPermit(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  return data?.createPermit;
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
  model: PermitModel,
  opt?: GqlOpt,
): Promise<boolean> {
  const data = await gqlQuery({
    query: gql`
      mutation($id: ID!, $model: PermitInput!) {
        updateByIdPermit(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  return data?.updateByIdPermit;
}

/**
 * 通过ID查找一条数据
 * @export findById
 * @param {string} id
 * @param {GqlOpt} opt?
 * @return {Promise<PermitModel>}
 */
export async function findById(
  id: string,
  opt?: GqlOpt,
): Promise<PermitModel> {
  const rvData = await gqlQuery({
    query: gql`
      query($id: ID!) {
        findByIdPermit(id: $id) {
          id
          menu_id
          _menu_id
          lbl
          rem
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const data = rvData?.findByIdPermit;
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
        deleteByIdsPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  return data?.deleteByIdsPermit;
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
        revertByIdsPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  return data?.revertByIdsPermit;
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
 * @param {PermitSearch} search
 */
export async function exportExcel(
  search: PermitSearch,
) {
  let url = `${ baseURL }/api/exportExcelPermit`;
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
