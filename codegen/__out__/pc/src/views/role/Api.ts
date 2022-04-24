import { RoleModel, RoleSearch } from "./Model";
import { uploadFile } from "@/utils/axios";
import { gql, GqlOpt, gqlQuery, baseURL } from "@/utils/graphql";
import { Page, Sort } from "@/utils/page.model";

import { MenuModel, MenuSearch } from "../menu/Model";
/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {RoleSearch} search?
 * @param {Page} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 * @return {Promise<RoleModel[]>}
 */
export async function findAll(
  search?: RoleSearch,
  page?: Page,
  sort?: Sort[],
  opt?: GqlOpt,
): Promise<RoleModel[]> {
  const rvData = await gqlQuery({
    query: gql`
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
  const data = rvData?.findAllRole || [ ];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
  }
  return data;
}

/**
 * 根据搜索条件和分页查找数据和总数
 * @export findAllAndCount
 * @param {RoleSearch} search?
 * @param {Page} page?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 * @return {Promise<{ data: RoleModel[], count: number }>} 
 */
export async function findAllAndCount(
  search?: RoleSearch,
  page?: Page,
  sort?: Sort[],
  opt?: GqlOpt,
): Promise<{ data: RoleModel[], count: number }> {
  const rvData = await gqlQuery({
    query: gql`
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
        findCountRole(search: $search)
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const data = {
    data: rvData?.findAllRole || [ ],
    count: rvData?.findCountRole || 0,
  };
  for (let i = 0; i < data.data.length; i++) {
    const item = data.data[i];
  }
  return data;
}

/**
 * 创建一条数据
 * @export create
 * @param {RoleModel} model
 * @param {GqlOpt} opt?
 * @return {Promise<string>} id
 */
export async function create(
  model: RoleModel,
  opt?: GqlOpt,
): Promise<string> {
  const data = await gqlQuery({
    query: gql`
      mutation($model: RoleInput!) {
        createRole(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  return data?.createRole;
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
  model: RoleModel,
  opt?: GqlOpt,
): Promise<boolean> {
  const data = await gqlQuery({
    query: gql`
      mutation($id: ID!, $model: RoleInput!) {
        updateByIdRole(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  return data?.updateByIdRole;
}

/**
 * 通过ID查找一条数据
 * @export findById
 * @param {string} id
 * @param {GqlOpt} opt?
 * @return {Promise<RoleModel>}
 */
export async function findById(
  id: string,
  opt?: GqlOpt,
): Promise<RoleModel> {
  const rvData = await gqlQuery({
    query: gql`
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
  const data = rvData?.findByIdRole;
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
        deleteByIdsRole(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  return data?.deleteByIdsRole;
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
        revertByIdsRole(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  return data?.revertByIdsRole;
}

export async function findAllAndCountMenu(
  search?: MenuSearch,
  page?: Page,
  sort?: Sort[],
  opt?: GqlOpt,
): Promise<{ data: MenuModel[], count: number }> {
  const data = await gqlQuery({
    query: gql`
      query($search: MenuSearch, $page: PageInput, $sort: [SortInput]) {
        findAllMenu(search: $search, page: $page, sort: $sort) {
          id
          lbl
        }
        findCountMenu(search: $search)
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  return {
    data: data?.findAllMenu || [ ],
    count: data?.findCountMenu || 0,
  };
}

export async function findAllMenu(
  search?: MenuSearch,
  page?: Page,
  sort?: Sort[],
  opt?: GqlOpt,
): Promise<MenuModel[]> {
  const data = await gqlQuery({
    query: gql`
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
  return data?.findAllMenu || [ ];
}

/**
 * 导出Excel
 * @export exportExcel
 * @param {RoleSearch} search
 */
export async function exportExcel(
  search?: RoleSearch,
  opt?: GqlOpt,
): Promise<string> {
  const rvData = await gqlQuery({
    query: gql`
      query($search: RoleSearch) {
        exportExcelRole(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  return rvData?.exportExcelRole || "";
}

/**
 * 导入文件
 * @param {File} file
 * @export importFile
 */
export async function importFile(
  file: File,
  opt?: GqlOpt,
): Promise<string> {
  if (!file) return;
  const id = await uploadFile(file, undefined, { type: "tmpfile" });
  if (!id) return;
  const rvData = await gqlQuery({
    query: gql`
      mutation($id: ID!) {
        importFileRole(id: $id)
      }
    `,
    variables: {
      id,
    },
  }, opt);
  return rvData?.importFileRole || "";
}
