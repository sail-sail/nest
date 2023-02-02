import {
  type Query,
  type Mutation,
  type PageInput,
  type Operation_RecordModel,
  type Operation_RecordSearch,
  type Operation_RecordInput,
} from "#/types";

import {
  type UsrSearch,
} from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {Operation_RecordSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: Operation_RecordSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllOperation_record: Query["findAllOperation_record"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($search: Operation_RecordSearch, $page: PageInput, $sort: [SortInput]) {
        findAllOperation_record(search: $search, page: $page, sort: $sort) {
          id
          mod
          mod_lbl
          method
          method_lbl
          lbl
          rem
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
  const result = data.findAllOperation_record;
  for (let i = 0; i < result.length; i++) {
    const item = result[i];
  }
  return result;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
 * @param {Operation_RecordSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: Operation_RecordSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountOperation_record: Query["findCountOperation_record"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($search: Operation_RecordSearch) {
        findCountOperation_record(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const result = data.findCountOperation_record;
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
    findByIdOperation_record: Query["findByIdOperation_record"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($id: ID!) {
        findByIdOperation_record(id: $id) {
          id
          mod
          mod_lbl
          method
          method_lbl
          lbl
          rem
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
  const result = data.findByIdOperation_record;
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
    deleteByIdsOperation_record: Mutation["deleteByIdsOperation_record"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        deleteByIdsOperation_record(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.deleteByIdsOperation_record;
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
    revertByIdsOperation_record: Mutation["revertByIdsOperation_record"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        revertByIdsOperation_record(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.revertByIdsOperation_record;
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
    forceDeleteByIdsOperation_record: Mutation["forceDeleteByIdsOperation_record"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        forceDeleteByIdsOperation_record(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.forceDeleteByIdsOperation_record;
  return result;
}

export async function findAllUsr(
  search?: UsrSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllUsr: Query["findAllUsr"];
  } = await gqlQuery({
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
  const result = data.findAllUsr;
  return result;
}

export async function getUsrList() {
  const data = await findAllUsr(
    undefined,
    {
    },
    [
      {
        prop: "",
        order: "ascending",
      },
    ],
    {
      notLoading: true,
    },
  );
  return data;
}

/**
 * 导出Excel
 * @export exportExcel
 * @param {Operation_RecordSearch} search?
 * @param {Sort[]} sort?
 */
export async function exportExcel(
  search?: Operation_RecordSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    exportExcelOperation_record: Query["exportExcelOperation_record"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($search: Operation_RecordSearch, $sort: [SortInput]) {
        exportExcelOperation_record(search: $search, sort: $sort)
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const result = data.exportExcelOperation_record;
  return result;
}
