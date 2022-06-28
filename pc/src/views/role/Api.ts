import {
  Query,
  Mutation,
  RoleModel,
  RoleSearch,
  RoleInput,
} from "#/types";
import dayjs from "dayjs";
import { uploadFile } from "@/utils/axios";
import { gql, GqlOpt, gqlQuery, baseURL } from "@/utils/graphql";
import { Page, Sort } from "@/utils/page.model";

import { MenuModel, MenuSearch } from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {RoleSearch} search?
 * @param {Page} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: RoleSearch,
  page?: Page,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
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
  const result: Query["findAllRole"] = data?.findAllRole || [ ];
  for (let i = 0; i < result.length; i++) {
    const item = result[i];
  }
  return result;
}

/**
 * 根据搜索条件和分页查找数据和总数
 * @export findAllAndCount
 * @param {RoleSearch} search?
 * @param {Page} page?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAllAndCount(
  search?: RoleSearch,
  page?: Page,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
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
  const result: {
    data: Query["findAllRole"];
    count: Query["findCountRole"];
  } = {
    data: data?.findAllRole || [ ],
    count: data?.findCountRole || 0,
  };
  for (let i = 0; i < result.data.length; i++) {
    const item = result.data[i];
  }
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
  const result: Mutation["createRole"] = data?.createRole;
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
  const result: Mutation["updateByIdRole"] = data?.updateByIdRole;
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
  const data = await gqlQuery({
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
  const result: Query["findByIdRole"] = data?.findByIdRole;
  return result;
}

/**
 * 根据ID列表删除数据
 * @export deleteByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: string[],
  opt?: GqlOpt,
) {
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
  const result: Mutation["deleteByIdsRole"] = data?.deleteByIdsRole;
  return result;
}

/**
 * 根据ID列表从回收站还原数据
 * @export revertByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: string[],
  opt?: GqlOpt,
) {
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
  const result: Mutation["revertByIdsRole"] = data?.revertByIdsRole;
  return result;
}

export async function findAllAndCountMenu(
  search?: MenuSearch,
  page?: Page,
  sort?: Sort[],
  opt?: GqlOpt,
) {
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
  const result: {
    data: Query["findAllMenu"];
    count: Query["findCountMenu"];
  } = {
    data: data?.findAllMenu || [ ],
    count: data?.findCountMenu || 0,
  };
  return result;
}

export async function findAllMenu(
  search?: MenuSearch,
  page?: Page,
  sort?: Sort[],
  opt?: GqlOpt,
) {
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
  const result: Query["findAllMenu"] = data?.findAllMenu || [ ];
  return result;
}

/**
 * 导出Excel
 * @export exportExcel
 * @param {RoleSearch} search?
 * @param {Sort[]} sort?
 */
export async function exportExcel(
  search?: RoleSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: gql`
      query($search: RoleSearch, $sort: [SortInput]) {
        exportExcelRole(search: $search, sort: $sort)
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const result: Query["exportExcelRole"] = data?.exportExcelRole || "";
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
  const data = await gqlQuery({
    query: gql`
      mutation($id: ID!) {
        importFileRole(id: $id)
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result: Mutation["importFileRole"] = data?.importFileRole;
  return result;
}
