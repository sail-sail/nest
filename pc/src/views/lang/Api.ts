import {
  type Query,
  type Mutation,
  type PageInput,
  type LangModel,
  type LangSearch,
  type LangInput,
} from "#/types";

import {
} from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {LangSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: LangSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllLang: Query["findAllLang"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($search: LangSearch, $page: PageInput, $sort: [SortInput]) {
        findAllLang(search: $search, page: $page, sort: $sort) {
          id
          code
          lbl
          rem
          is_enabled
          _is_enabled
          order_by
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const result = data.findAllLang;
  for (let i = 0; i < result.length; i++) {
    const item = result[i];
  }
  return result;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
 * @param {LangSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: LangSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountLang: Query["findCountLang"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($search: LangSearch) {
        findCountLang(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const result = data.findCountLang;
  return result;
}

/**
 * 创建一条数据
 * @export create
 * @param {LangInput} model
 * @param {GqlOpt} opt?
 */
export async function create(
  model: LangInput,
  opt?: GqlOpt,
) {
  const data: {
    createLang: Mutation["createLang"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($model: LangInput!) {
        createLang(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  const result = data.createLang;
  return result;
}

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {string} id
 * @param {LangInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: string,
  model: LangInput,
  opt?: GqlOpt,
) {
  const data: {
    updateByIdLang: Mutation["updateByIdLang"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($id: ID!, $model: LangInput!) {
        updateByIdLang(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const result = data.updateByIdLang;
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
    findByIdLang: Query["findByIdLang"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($id: ID!) {
        findByIdLang(id: $id) {
          id
          code
          lbl
          rem
          is_enabled
          _is_enabled
          order_by
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result = data.findByIdLang;
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
    deleteByIdsLang: Mutation["deleteByIdsLang"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        deleteByIdsLang(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.deleteByIdsLang;
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
    revertByIdsLang: Mutation["revertByIdsLang"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        revertByIdsLang(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.revertByIdsLang;
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
    forceDeleteByIdsLang: Mutation["forceDeleteByIdsLang"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        forceDeleteByIdsLang(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.forceDeleteByIdsLang;
  return result;
}

/**
 * 导出Excel
 * @export exportExcel
 * @param {LangSearch} search?
 * @param {Sort[]} sort?
 */
export async function exportExcel(
  search?: LangSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    exportExcelLang: Query["exportExcelLang"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($search: LangSearch, $sort: [SortInput]) {
        exportExcelLang(search: $search, sort: $sort)
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const result = data.exportExcelLang;
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
    importFileLang: Mutation["importFileLang"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($id: ID!) {
        importFileLang(id: $id)
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result = data.importFileLang;
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
  const data: {
    findLastOrderByLang: Query["findLastOrderByLang"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query {
        findLastOrderByLang
      }
    `,
  }, opt);
  const result = data.findLastOrderByLang;
  return result;
}
