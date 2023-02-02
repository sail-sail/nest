import {
  type Query,
  type Mutation,
  type PageInput,
  type UsrModel,
  type UsrSearch,
  type UsrInput,
} from "#/types";

import {
  type DeptSearch,
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
  const data: {
    findAllUsr: Query["findAllUsr"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($search: UsrSearch, $page: PageInput, $sort: [SortInput]) {
        findAllUsr(search: $search, page: $page, sort: $sort) {
          id
          lbl
          username
          password
          default_dept_id
          _default_dept_id
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
  const result = data.findAllUsr;
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
  const data: {
    findCountUsr: Query["findCountUsr"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($search: UsrSearch) {
        findCountUsr(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const result = data.findCountUsr;
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
  const data: {
    createUsr: Mutation["createUsr"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($model: UsrInput!) {
        createUsr(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  const result = data.createUsr;
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
  const data: {
    updateByIdUsr: Mutation["updateByIdUsr"];
  } = await gqlQuery({
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
  const result = data.updateByIdUsr;
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
    findByIdUsr: Query["findByIdUsr"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($id: ID!) {
        findByIdUsr(id: $id) {
          id
          lbl
          username
          password
          default_dept_id
          _default_dept_id
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
  const result = data.findByIdUsr;
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
    deleteByIdsUsr: Mutation["deleteByIdsUsr"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        deleteByIdsUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.deleteByIdsUsr;
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
    lockByIdsUsr: Mutation["lockByIdsUsr"];
  } = await gqlQuery({
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
  const result = data.lockByIdsUsr;
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
    revertByIdsUsr: Mutation["revertByIdsUsr"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        revertByIdsUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.revertByIdsUsr;
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
    forceDeleteByIdsUsr: Mutation["forceDeleteByIdsUsr"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        forceDeleteByIdsUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.forceDeleteByIdsUsr;
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
  } = await gqlQuery({
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

export async function findAllRole(
  search?: RoleSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllRole: Query["findAllRole"];
  } = await gqlQuery({
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
  const result = data.findAllRole;
  return result;
}

export async function getRoleList() {
  const data = await findAllRole(
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
 * @param {UsrSearch} search?
 * @param {Sort[]} sort?
 */
export async function exportExcel(
  search?: UsrSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    exportExcelUsr: Query["exportExcelUsr"];
  } = await gqlQuery({
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
  const result = data.exportExcelUsr;
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
    importFileUsr: Mutation["importFileUsr"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($id: ID!) {
        importFileUsr(id: $id)
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result = data.importFileUsr;
  return result;
}
