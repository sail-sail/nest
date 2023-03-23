import {
  type Query,
  type Mutation,
  type PageInput,
  type DictbizModel,
  type DictbizSearch,
  type DictbizInput,
} from "#/types";

import saveAs from "file-saver";

import {
  type UsrSearch,
} from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {DictbizSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: DictbizSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDictbiz: Query["findAllDictbiz"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DictbizSearch, $page: PageInput, $sort: [SortInput]) {
        findAllDictbiz(search: $search, page: $page, sort: $sort) {
          id
          code
          lbl
          type
          _type
          order_by
          is_enabled
          _is_enabled
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
  const result = data.findAllDictbiz;
  for (let i = 0; i < result.length; i++) {
    const item = result[i];
  }
  return result;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
 * @param {DictbizSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: DictbizSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountDictbiz: Query["findCountDictbiz"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DictbizSearch) {
        findCountDictbiz(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const result = data.findCountDictbiz;
  return result;
}

/**
 * 创建一条数据
 * @export create
 * @param {DictbizInput} model
 * @param {GqlOpt} opt?
 */
export async function create(
  model: DictbizInput,
  opt?: GqlOpt,
) {
  const data: {
    createDictbiz: Mutation["createDictbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: DictbizInput!) {
        createDictbiz(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  const result = data.createDictbiz;
  return result;
}

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {string} id
 * @param {DictbizInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: string,
  model: DictbizInput,
  opt?: GqlOpt,
) {
  const data: {
    updateByIdDictbiz: Mutation["updateByIdDictbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: ID!, $model: DictbizInput!) {
        updateByIdDictbiz(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const result = data.updateByIdDictbiz;
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
    findByIdDictbiz: Query["findByIdDictbiz"];
  } = await query({
    query: /* GraphQL */ `
      query($id: ID!) {
        findByIdDictbiz(id: $id) {
          id
          code
          lbl
          type
          _type
          order_by
          is_enabled
          _is_enabled
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
  const result = data.findByIdDictbiz;
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
    deleteByIdsDictbiz: Mutation["deleteByIdsDictbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        deleteByIdsDictbiz(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.deleteByIdsDictbiz;
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
  const data: {
    lockByIdsDictbiz: Mutation["lockByIdsDictbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!, $is_locked: Int!) {
        lockByIdsDictbiz(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const result = data.lockByIdsDictbiz;
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
    revertByIdsDictbiz: Mutation["revertByIdsDictbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        revertByIdsDictbiz(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.revertByIdsDictbiz;
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
    forceDeleteByIdsDictbiz: Mutation["forceDeleteByIdsDictbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        forceDeleteByIdsDictbiz(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.forceDeleteByIdsDictbiz;
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
  } = await query({
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
 * @export useExportExcel
 * @param {DictbizSearch} search?
 * @param {Sort[]} sort?
 */
export function useExportExcel(
  search?: DictbizSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const queryStr = getQueryUrl({
    query: /* GraphQL */ `
      query($search: DictbizSearch, $sort: [SortInput]) {
        findAllDictbiz(search: $search, sort: $sort) {
          id
          code
          lbl
          type
          _type
          order_by
          is_enabled
          _is_enabled
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
        getFieldCommentsDictbiz {
          code
          lbl
          type
          _type
          order_by
          is_enabled
          _is_enabled
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
      sort,
    },
  }, opt);
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const buffer = await workerFn(
      `${ location.origin }/excel_template/dictbiz.xlsx`,
      `${ location.origin }${ queryStr }`,
    );
    const blob = new Blob([ buffer ], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "业务字典");
  }
  return {
    workerFn: workerFn2,
    workerStatus,
    workerTerminate,
  };
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
    importFileDictbiz: Mutation["importFileDictbiz"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: ID!) {
        importFileDictbiz(id: $id)
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result = data.importFileDictbiz;
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
    findLastOrderByDictbiz: Query["findLastOrderByDictbiz"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByDictbiz
      }
    `,
  }, opt);
  const result = data.findLastOrderByDictbiz;
  return result;
}
