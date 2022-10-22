import {
  type Query,
  type Mutation,
  type PageInput,
  type UsrModel,
  type UsrSearch,
  type UsrInput,
} from "#/types";

import dayjs from "dayjs";
import { uploadFile } from "@/utils/axios";

import {
  gqlQuery,
  type GqlOpt,
} from "@/utils/graphql";

import {
  type Sort,
} from "element-plus/lib/components/table/src/table/defaults";

import {
  type DeptSearch,
} from "#/types";

import {
  type RoleSearch,
} from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {UsrSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: UsrSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: /* GraphQL */ `
      query($search: UsrSearch, $page: PageInput, $sort: [SortInput]) {
        findAllUsr(search: $search, page: $page, sort: $sort) {
          id
          lbl
          username
          password
          is_enabled
          _is_enabled
          rem
          dept_ids
          _dept_ids
          is_locked
          _is_locked
          role_ids
          _role_ids
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const result: Query["findAllUsr"] = data?.findAllUsr || [ ];
  for (let i = 0; i < result.length; i++) {
    const item = result[i];
  }
  return result;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
 * @param {UsrSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: UsrSearch,
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: /* GraphQL */ `
      query($search: UsrSearch) {
        findCountUsr(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const result: Query["findCountUsr"] = data?.findCountUsr || 0;
  return result;
}

/**
 * 创建一条数据
 * @export create
 * @param {UsrInput} model
 * @param {GqlOpt} opt?
 */
export async function create(
  model: UsrInput,
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: /* GraphQL */ `
      mutation($model: UsrInput!) {
        createUsr(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  const result: Mutation["createUsr"] = data?.createUsr;
  return result;
}

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {string} id
 * @param {UsrInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: string,
  model: UsrInput,
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: /* GraphQL */ `
      mutation($id: ID!, $model: UsrInput!) {
        updateByIdUsr(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const result: Mutation["updateByIdUsr"] = data?.updateByIdUsr;
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
    query: /* GraphQL */ `
      query($id: ID!) {
        findByIdUsr(id: $id) {
          id
          lbl
          username
          password
          is_enabled
          _is_enabled
          rem
          dept_ids
          _dept_ids
          is_locked
          _is_locked
          role_ids
          _role_ids
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result: Query["findByIdUsr"] = data?.findByIdUsr;
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
  const data = await gqlQuery({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        deleteByIdsUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result: Mutation["deleteByIdsUsr"] = data?.deleteByIdsUsr;
  return result;
}

/**
 * 根据 ids 删除数据
 * @export lockByIds
 * @param {string[]} ids
 * @param {0 | 1} lockByIds
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: string[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!, $is_locked: Int!) {
        lockByIdsUsr(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const result: Mutation["lockByIdsUsr"] = data?.lockByIdsUsr;
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
  const data = await gqlQuery({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        revertByIdsUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result: Mutation["revertByIdsUsr"] = data?.revertByIdsUsr;
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
  const data = await gqlQuery({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        forceDeleteByIdsUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result: Mutation["forceDeleteByIdsUsr"] = data?.forceDeleteByIdsUsr;
  return result;
}

export async function findAllDept(
  search?: DeptSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: /* GraphQL */ `
      query($search: DeptSearch, $page: PageInput, $sort: [SortInput]) {
        findAllDept(search: $search, page: $page, sort: $sort) {
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
  const result: Query["findAllDept"] = data?.findAllDept || [ ];
  return result;
}

export async function findAllRole(
  search?: RoleSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: /* GraphQL */ `
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
  const result: Query["findAllRole"] = data?.findAllRole || [ ];
  return result;
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
) {
  const data = await gqlQuery({
    query: /* GraphQL */ `
      query($search: UsrSearch, $sort: [SortInput]) {
        exportExcelUsr(search: $search, sort: $sort)
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const result: Query["exportExcelUsr"] = data?.exportExcelUsr || "";
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
    query: /* GraphQL */ `
      mutation($id: ID!) {
        importFileUsr(id: $id)
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result: Mutation["importFileUsr"] = data?.importFileUsr;
  return result;
}
