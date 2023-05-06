import {
  type Query,
  type Mutation,
  type PageInput,
  type DeptModel,
  type DeptSearch,
  type DeptInput,
} from "#/types";

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
  const data: {
    findAllDept: Query["findAllDept"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DeptSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDept(search: $search, page: $page, sort: $sort) {
          id
          parent_id
          parent_id_lbl
          lbl
          order_by
          is_enabled
          is_enabled_lbl
          rem
          is_locked
          is_locked_lbl
          create_usr_id
          create_usr_id_lbl
          create_time
          create_time_lbl
          update_usr_id
          update_usr_id_lbl
          update_time
          update_time_lbl
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const result = data.findAllDept;
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
  const data: {
    findCountDept: Query["findCountDept"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DeptSearch) {
        findCountDept(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const result = data.findCountDept;
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
  const data: {
    createDept: Mutation["createDept"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: DeptInput!) {
        createDept(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  const result = data.createDept;
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
  const data: {
    updateByIdDept: Mutation["updateByIdDept"];
  } = await mutation({
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
  const result = data.updateByIdDept;
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
    findByIdDept: Query["findByIdDept"];
  } = await query({
    query: /* GraphQL */ `
      query($id: ID!) {
        findByIdDept(id: $id) {
          id
          parent_id
          parent_id_lbl
          lbl
          order_by
          is_enabled
          is_enabled_lbl
          rem
          is_locked
          is_locked_lbl
          create_usr_id
          create_usr_id_lbl
          create_time
          create_time_lbl
          update_usr_id
          update_usr_id_lbl
          update_time
          update_time_lbl
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result = data.findByIdDept;
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
    deleteByIdsDept: Mutation["deleteByIdsDept"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        deleteByIdsDept(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.deleteByIdsDept;
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
    lockByIdsDept: Mutation["lockByIdsDept"];
  } = await mutation({
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
  const result = data.lockByIdsDept;
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
    revertByIdsDept: Mutation["revertByIdsDept"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        revertByIdsDept(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.revertByIdsDept;
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
    forceDeleteByIdsDept: Mutation["forceDeleteByIdsDept"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        forceDeleteByIdsDept(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.forceDeleteByIdsDept;
  return result;
}

export async function findAllDept(
  search?: DeptSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDept: Query["findAllDept"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DeptSearch, $page: PageInput, $sort: [SortInput!]) {
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
  const result = data.findAllDept;
  return result;
}

export async function getDeptList() {
  const data = await findAllDept(
    undefined,
    {
    },
    [
      {
        prop: "order_by",
        order: "ascending",
      },
    ],
    {
      notLoading: true,
    },
  );
  return data;
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
      query($search: UsrSearch, $page: PageInput, $sort: [SortInput!]) {
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
  const route = useRoute();
  const {
    nAsync,
    nsAsync,
  } = useI18n(route.path);
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2(
    search?: DeptSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const queryStr = getQueryUrl({
      query: /* GraphQL */ `
        query($search: DeptSearch, $sort: [SortInput!]) {
          findAllDept(search: $search, sort: $sort) {
            id
            parent_id
            parent_id_lbl
            lbl
            order_by
            is_enabled
            is_enabled_lbl
            rem
            is_locked
            is_locked_lbl
            create_usr_id
            create_usr_id_lbl
            create_time
            create_time_lbl
            update_usr_id
            update_usr_id_lbl
            update_time
            update_time_lbl
          }
          getFieldCommentsDept {
            parent_id
            parent_id_lbl
            lbl
            order_by
            is_enabled
            is_enabled_lbl
            rem
            is_locked
            is_locked_lbl
            create_usr_id
            create_usr_id_lbl
            create_time
            create_time_lbl
            update_usr_id
            update_usr_id_lbl
            update_time
            update_time_lbl
          }
        }
      `,
      variables: {
        search,
        sort,
      },
    }, opt);
    try {
      const buffer = await workerFn(
        `${ location.origin }/excel_template/base/dept.xlsx`,
        `${ location.origin }${ queryStr }`,
      );
      saveAsExcel(buffer, await nAsync("部门"));
    } catch (err) {
      ElMessage.error(await nsAsync("导出失败"));
      throw err;
    }
  }
  return {
    workerFn: workerFn2,
    workerStatus,
    workerTerminate,
  };
}

/**
 * 批量导入
 * @param {DeptInput[]} models
 * @export importModels
 */
export async function importModels(
  models: DeptInput[],
  opt?: GqlOpt,
) {
  const data: {
    importModelsDept: Mutation["importModelsDept"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($models: [DeptInput!]!) {
        importModelsDept(models: $models)
      }
    `,
    variables: {
      models,
    },
  }, opt);
  const res = data.importModelsDept;
  return res;
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
    findLastOrderByDept: Query["findLastOrderByDept"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByDept
      }
    `,
  }, opt);
  const result = data.findLastOrderByDept;
  return result;
}
