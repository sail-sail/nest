import {
  type Query,
  type Mutation,
  type PageInput,
  type DeptModel,
  type DeptSearch,
  type DeptInput,
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
  type UsrSearch,
} from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {DeptSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
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
          order_by
          rem
          is_locked
          _is_locked
          create_usr_id
          _create_usr_id
          create_time
          update_usr_id
          _update_usr_id
          update_time
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
  for (let i = 0; i < result.length; i++) {
    const item = result[i];
  }
  return result;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
 * @param {DeptSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: DeptSearch,
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: /* GraphQL */ `
      query($search: DeptSearch) {
        findCountDept(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const result: Query["findCountDept"] = data?.findCountDept || 0;
  return result;
}

/**
 * 创建一条数据
 * @export create
 * @param {DeptInput} model
 * @param {GqlOpt} opt?
 */
export async function create(
  model: DeptInput,
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: /* GraphQL */ `
      mutation($model: DeptInput!) {
        createDept(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  const result: Mutation["createDept"] = data?.createDept;
  return result;
}

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {string} id
 * @param {DeptInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: string,
  model: DeptInput,
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: /* GraphQL */ `
      mutation($id: ID!, $model: DeptInput!) {
        updateByIdDept(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const result: Mutation["updateByIdDept"] = data?.updateByIdDept;
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
        findByIdDept(id: $id) {
          id
          lbl
          order_by
          rem
          is_locked
          _is_locked
          create_usr_id
          _create_usr_id
          create_time
          update_usr_id
          _update_usr_id
          update_time
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result: Query["findByIdDept"] = data?.findByIdDept;
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
        deleteByIdsDept(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result: Mutation["deleteByIdsDept"] = data?.deleteByIdsDept;
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
        lockByIdsDept(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const result: Mutation["lockByIdsDept"] = data?.lockByIdsDept;
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
        revertByIdsDept(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result: Mutation["revertByIdsDept"] = data?.revertByIdsDept;
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
        forceDeleteByIdsDept(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result: Mutation["forceDeleteByIdsDept"] = data?.forceDeleteByIdsDept;
  return result;
}

export async function findAllUsr(
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
  return result;
}

/**
 * 导出Excel
 * @export exportExcel
 * @param {DeptSearch} search?
 * @param {Sort[]} sort?
 */
export async function exportExcel(
  search?: DeptSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: /* GraphQL */ `
      query($search: DeptSearch, $sort: [SortInput]) {
        exportExcelDept(search: $search, sort: $sort)
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const result: Query["exportExcelDept"] = data?.exportExcelDept || "";
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
        importFileDept(id: $id)
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result: Mutation["importFileDept"] = data?.importFileDept;
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
  const data = await gqlQuery({
    query: /* GraphQL */ `
      query {
        findLastOrderByDept
      }
    `,
  }, opt);
  const result: Query["findLastOrderByDept"] = data?.findLastOrderByDept || 0;
  return result;
}
