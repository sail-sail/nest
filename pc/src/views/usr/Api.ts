import { UsrModel, UsrSearch } from "./Model";
import { uploadFile } from "@/utils/axios";
import { gql, GqlOpt, gqlQuery, baseURL } from "@/utils/graphql";
import { Page, Sort } from "@/utils/page.model";

import { RoleModel, RoleSearch } from "../role/Model";
/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {UsrSearch} search?
 * @param {Page} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 * @return {Promise<UsrModel[]>}
 */
export async function findAll(
  search?: UsrSearch,
  page?: Page,
  sort?: Sort[],
  opt?: GqlOpt,
): Promise<UsrModel[]> {
  const rvData = await gqlQuery({
    query: gql`
      query($search: UsrSearch, $page: PageInput, $sort: [SortInput]) {
        findAllUsr(search: $search, page: $page, sort: $sort) {
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
      sort,
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
 * @param {UsrSearch} search?
 * @param {Page} page?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 * @return {Promise<{ data: UsrModel[], count: number }>} 
 */
export async function findAllAndCount(
  search?: UsrSearch,
  page?: Page,
  sort?: Sort[],
  opt?: GqlOpt,
): Promise<{ data: UsrModel[], count: number }> {
  const rvData = await gqlQuery({
    query: gql`
      query($search: UsrSearch, $page: PageInput, $sort: [SortInput]) {
        findAllUsr(search: $search, page: $page, sort: $sort) {
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
      sort,
    },
  }, opt);
  const data = {
    data: rvData?.findAllUsr || [ ],
    count: rvData?.findCountUsr || 0,
  };
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
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  model: UsrModel,
  opt?: GqlOpt,
): Promise<string> {
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
  page?: Page,
  sort?: Sort[],
  opt?: GqlOpt,
): Promise<{ data: RoleModel[], count: number }> {
  const data = await gqlQuery({
    query: gql`
      query($search: RoleSearch, $page: PageInput, $sort: [SortInput]) {
        findAllRole(search: $search, page: $page, sort: $sort) {
          id
          lbl
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
  return {
    data: data?.findAllRole || [ ],
    count: data?.findCountRole || 0,
  };
}

export async function findAllRole(
  search?: RoleSearch,
  page?: Page,
  sort?: Sort[],
  opt?: GqlOpt,
): Promise<RoleModel[]> {
  const data = await gqlQuery({
    query: gql`
      query($search: RoleSearch, $page: PageInput, $sort: [SortInput]) {
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
  return data?.findAllRole || [ ];
}

/**
 * 导出Excel
 * @export exportExcel
 * @param {UsrSearch} search?
 * @param {Sort[]} sort?
 */
export async function exportExcel(
  search?: UsrSearch,
  sort?: Sort[],
  opt?: GqlOpt,
): Promise<string> {
  const rvData = await gqlQuery({
    query: gql`
      query($search: UsrSearch, $sort: [SortInput]) {
        exportExcelUsr(search: $search, sort: $sort)
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  return rvData?.exportExcelUsr || "";
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
        importFileUsr(id: $id)
      }
    `,
    variables: {
      id,
    },
  }, opt);
  return rvData?.importFileUsr || "";
}
