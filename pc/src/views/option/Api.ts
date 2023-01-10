import {
  type Query,
  type Mutation,
  type PageInput,
  type OptionModel,
  type OptionSearch,
  type OptionInput,
} from "#/types";

import {
} from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {OptionSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: OptionSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllOption: Query["findAllOption"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($search: OptionSearch, $page: PageInput, $sort: [SortInput]) {
        findAllOption(search: $search, page: $page, sort: $sort) {
          id
          lbl
          ky
          val
          is_enabled
          _is_enabled
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
  const result = data.findAllOption;
  for (let i = 0; i < result.length; i++) {
    const item = result[i];
  }
  return result;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
 * @param {OptionSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: OptionSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountOption: Query["findCountOption"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($search: OptionSearch) {
        findCountOption(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const result = data.findCountOption;
  return result;
}

/**
 * 创建一条数据
 * @export create
 * @param {OptionInput} model
 * @param {GqlOpt} opt?
 */
export async function create(
  model: OptionInput,
  opt?: GqlOpt,
) {
  const data: {
    createOption: Mutation["createOption"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($model: OptionInput!) {
        createOption(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  const result = data.createOption;
  return result;
}

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {string} id
 * @param {OptionInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: string,
  model: OptionInput,
  opt?: GqlOpt,
) {
  const data: {
    updateByIdOption: Mutation["updateByIdOption"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($id: ID!, $model: OptionInput!) {
        updateByIdOption(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const result = data.updateByIdOption;
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
  const data: {
    findByIdOption: Query["findByIdOption"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($id: ID!) {
        findByIdOption(id: $id) {
          id
          lbl
          ky
          val
          is_enabled
          _is_enabled
          rem
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result = data.findByIdOption;
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
  const data: {
    deleteByIdsOption: Mutation["deleteByIdsOption"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        deleteByIdsOption(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.deleteByIdsOption;
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
  const data: {
    revertByIdsOption: Mutation["revertByIdsOption"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        revertByIdsOption(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.revertByIdsOption;
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
  const data: {
    forceDeleteByIdsOption: Mutation["forceDeleteByIdsOption"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        forceDeleteByIdsOption(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.forceDeleteByIdsOption;
  return result;
}

/**
 * 导出Excel
 * @export exportExcel
 * @param {OptionSearch} search?
 * @param {Sort[]} sort?
 */
export async function exportExcel(
  search?: OptionSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    exportExcelOption: Query["exportExcelOption"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($search: OptionSearch, $sort: [SortInput]) {
        exportExcelOption(search: $search, sort: $sort)
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const result = data.exportExcelOption;
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
  const data: {
    importFileOption: Mutation["importFileOption"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($id: ID!) {
        importFileOption(id: $id)
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result = data.importFileOption;
  return result;
}
