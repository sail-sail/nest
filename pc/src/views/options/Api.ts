import {
  type Query,
  type Mutation,
  type PageInput,
  type OptionsModel,
  type OptionsSearch,
  type OptionsInput,
} from "#/types";

import {
  type UsrSearch,
} from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {OptionsSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: OptionsSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllOptions: Query["findAllOptions"];
  } = await query({
    query: /* GraphQL */ `
      query($search: OptionsSearch, $page: PageInput, $sort: [SortInput]) {
        findAllOptions(search: $search, page: $page, sort: $sort) {
          id
          lbl
          ky
          val
          order_by
          is_enabled
          _is_enabled
          rem
          is_locked
          _is_locked
          version
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
  const result = data.findAllOptions;
  for (let i = 0; i < result.length; i++) {
    const item = result[i];
  }
  return result;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
 * @param {OptionsSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: OptionsSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountOptions: Query["findCountOptions"];
  } = await query({
    query: /* GraphQL */ `
      query($search: OptionsSearch) {
        findCountOptions(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const result = data.findCountOptions;
  return result;
}

/**
 * 创建一条数据
 * @export create
 * @param {OptionsInput} model
 * @param {GqlOpt} opt?
 */
export async function create(
  model: OptionsInput,
  opt?: GqlOpt,
) {
  const data: {
    createOptions: Mutation["createOptions"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: OptionsInput!) {
        createOptions(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  const result = data.createOptions;
  return result;
}

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {string} id
 * @param {OptionsInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: string,
  model: OptionsInput,
  opt?: GqlOpt,
) {
  const data: {
    updateByIdOptions: Mutation["updateByIdOptions"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: ID!, $model: OptionsInput!) {
        updateByIdOptions(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const result = data.updateByIdOptions;
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
    findByIdOptions: Query["findByIdOptions"];
  } = await query({
    query: /* GraphQL */ `
      query($id: ID!) {
        findByIdOptions(id: $id) {
          id
          lbl
          ky
          val
          order_by
          is_enabled
          _is_enabled
          rem
          is_locked
          _is_locked
          version
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
  const result = data.findByIdOptions;
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
    deleteByIdsOptions: Mutation["deleteByIdsOptions"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        deleteByIdsOptions(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.deleteByIdsOptions;
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
    lockByIdsOptions: Mutation["lockByIdsOptions"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!, $is_locked: Int!) {
        lockByIdsOptions(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const result = data.lockByIdsOptions;
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
    revertByIdsOptions: Mutation["revertByIdsOptions"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        revertByIdsOptions(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.revertByIdsOptions;
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
    forceDeleteByIdsOptions: Mutation["forceDeleteByIdsOptions"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        forceDeleteByIdsOptions(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.forceDeleteByIdsOptions;
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
 */
export function useExportExcel() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2(
    search?: OptionsSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const queryStr = getQueryUrl({
      query: /* GraphQL */ `
        query($search: OptionsSearch, $sort: [SortInput]) {
          findAllOptions(search: $search, sort: $sort) {
            id
            lbl
            ky
            val
            order_by
            is_enabled
            _is_enabled
            rem
            is_locked
            _is_locked
            version
            create_usr_id
            _create_usr_id
            create_time
            update_usr_id
            _update_usr_id
            update_time
          }
          getFieldCommentsOptions {
            lbl
            ky
            val
            order_by
            is_enabled
            _is_enabled
            rem
            is_locked
            _is_locked
            version
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
    const buffer = await workerFn(
      `${ location.origin }/excel_template/options.xlsx`,
      `${ location.origin }${ queryStr }`,
    );
    saveAsExcel(buffer, "系统选项");
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
    importFileOptions: Mutation["importFileOptions"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: ID!) {
        importFileOptions(id: $id)
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result = data.importFileOptions;
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
    findLastOrderByOptions: Query["findLastOrderByOptions"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByOptions
      }
    `,
  }, opt);
  const result = data.findLastOrderByOptions;
  return result;
}
