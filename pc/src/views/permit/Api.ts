import {
  type Query,
  type Mutation,
  type PageInput,
  type PermitModel,
  type PermitSearch,
  type PermitInput,
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
  type MenuSearch,
} from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {PermitSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: PermitSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: /* GraphQL */ `
      query($search: PermitSearch, $page: PageInput, $sort: [SortInput]) {
        findAllPermit(search: $search, page: $page, sort: $sort) {
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
      sort,
    },
  }, opt);
  const result: Query["findAllPermit"] = data?.findAllPermit || [ ];
  for (let i = 0; i < result.length; i++) {
    const item = result[i];
  }
  return result;
}

/**
 * 根据搜索条件和分页查找数据和总数
 * @export findAllAndCount
 * @param {PermitSearch} search?
 * @param {PageInput} page?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAllAndCount(
  search?: PermitSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: /* GraphQL */ `
      query($search: PermitSearch, $page: PageInput, $sort: [SortInput]) {
        findAllPermit(search: $search, page: $page, sort: $sort) {
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
      sort,
    },
  }, opt);
  const result: {
    data: Query["findAllPermit"];
    count: Query["findCountPermit"];
  } = {
    data: data?.findAllPermit || [ ],
    count: data?.findCountPermit || 0,
  };
  for (let i = 0; i < result.data.length; i++) {
    const item = result.data[i];
  }
  return result;
}

/**
 * 创建一条数据
 * @export create
 * @param {PermitInput} model
 * @param {GqlOpt} opt?
 */
export async function create(
  model: PermitInput,
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: /* GraphQL */ `
      mutation($model: PermitInput!) {
        createPermit(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  const result: Mutation["createPermit"] = data?.createPermit;
  return result;
}

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {string} id
 * @param {PermitInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: string,
  model: PermitInput,
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: /* GraphQL */ `
      mutation($id: ID!, $model: PermitInput!) {
        updateByIdPermit(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const result: Mutation["updateByIdPermit"] = data?.updateByIdPermit;
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
  const result: Query["findByIdPermit"] = data?.findByIdPermit;
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
      mutation($ids: [ID]!) {
        deleteByIdsPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result: Mutation["deleteByIdsPermit"] = data?.deleteByIdsPermit;
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
      mutation($ids: [ID]!) {
        revertByIdsPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result: Mutation["revertByIdsPermit"] = data?.revertByIdsPermit;
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
      mutation($ids: [ID]!) {
        forceDeleteByIdsPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result: Mutation["forceDeleteByIdsPermit"] = data?.forceDeleteByIdsPermit;
  return result;
}

export async function findAllAndCountMenu(
  search?: MenuSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: /* GraphQL */ `
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
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
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
  const result: Query["findAllMenu"] = data?.findAllMenu || [ ];
  return result;
}

/**
 * 导出Excel
 * @export exportExcel
 * @param {PermitSearch} search?
 * @param {Sort[]} sort?
 */
export async function exportExcel(
  search?: PermitSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: /* GraphQL */ `
      query($search: PermitSearch, $sort: [SortInput]) {
        exportExcelPermit(search: $search, sort: $sort)
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const result: Query["exportExcelPermit"] = data?.exportExcelPermit || "";
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
        importFilePermit(id: $id)
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result: Mutation["importFilePermit"] = data?.importFilePermit;
  return result;
}
