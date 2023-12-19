import {
  UniqueType,
} from "#/types";

import type {
  DeptId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
  DeptSearch,
  DeptInput,
  DeptModel,
} from "#/types";

import type {
  UsrSearch,
} from "#/types";

import {
  findTree as findDeptTree,
} from "@/views/base/dept/Api";

/**
 * 根据搜索条件查找部门列表
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
          usr_ids
          usr_ids_lbl
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          order_by
          rem
          create_usr_id
          create_usr_id_lbl
          create_time
          create_time_lbl
          update_usr_id
          update_usr_id_lbl
          update_time
          update_time_lbl
          is_deleted
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const res = data.findAllDept;
  for (let i = 0; i < res.length; i++) {
    const item = res[i];
  }
  return res;
}

/**
 * 根据条件查找第一个部门
 * @param {DeptSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: DeptSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneDept: Query["findOneDept"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DeptSearch, $sort: [SortInput!]) {
        findOneDept(search: $search, sort: $sort) {
          id
          parent_id
          parent_id_lbl
          lbl
          usr_ids
          usr_ids_lbl
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          order_by
          rem
          create_usr_id
          create_usr_id_lbl
          create_time
          create_time_lbl
          update_usr_id
          update_usr_id_lbl
          update_time
          update_time_lbl
          is_deleted
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneDept;
  if (model) {
  }
  return model;
}

export type DeptModelTree = DeptModel & {
  children?: DeptModelTree[];
}

/**
 * 查找部门树形列表
 * @param sort 
 * @param opt 
 * @returns 
 */
export async function findTree(
  search?: DeptSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const res = await findAll(
    search,
    undefined,
    sort,
    opt,
  );
  const treeData = list2tree(res);
  return treeData;
}

/**
 * 根据搜索条件查找部门总数
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
  const res = data.findCountDept;
  return res;
}

/**
 * 创建部门
 * @param {DeptInput} model
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: DeptInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DeptId> {
  const data: {
    createDept: Mutation["createDept"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: DeptInput!, $unique_type: UniqueType) {
        createDept(model: $model, unique_type: $unique_type)
      }
    `,
    variables: {
      model,
      unique_type,
    },
  }, opt);
  const id: DeptId = data.createDept;
  return id;
}

/**
 * 根据 id 修改部门
 * @param {DeptId} id
 * @param {DeptInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: DeptId,
  model: DeptInput,
  opt?: GqlOpt,
): Promise<DeptId> {
  const data: {
    updateByIdDept: Mutation["updateByIdDept"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: DeptId!, $model: DeptInput!) {
        updateByIdDept(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const id2: DeptId = data.updateByIdDept;
  return id2;
}

/**
 * 根据 id 查找部门
 * @param {DeptId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: DeptId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdDept: Query["findByIdDept"];
  } = await query({
    query: /* GraphQL */ `
      query($id: DeptId!) {
        findByIdDept(id: $id) {
          id
          parent_id
          parent_id_lbl
          lbl
          usr_ids
          usr_ids_lbl
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          order_by
          rem
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
  const res = data.findByIdDept;
  return res;
}

/**
 * 根据 ids 删除部门
 * @param {DeptId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: DeptId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsDept: Mutation["deleteByIdsDept"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DeptId!]!) {
        deleteByIdsDept(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsDept;
  return res;
}

/**
 * 根据 ids 启用或禁用部门
 * @param {DeptId[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
 */
export async function enableByIds(
  ids: DeptId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    enableByIdsDept: Mutation["enableByIdsDept"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DeptId!]!, $is_enabled: Int!) {
        enableByIdsDept(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsDept;
  return res;
}

/**
 * 根据 ids 锁定或解锁部门
 * @param {DeptId[]} ids
 * @param {0 | 1} is_locked
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: DeptId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    lockByIdsDept: Mutation["lockByIdsDept"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DeptId!]!, $is_locked: Int!) {
        lockByIdsDept(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsDept;
  return res;
}

/**
 * 根据 ids 还原部门
 * @param {DeptId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: DeptId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsDept: Mutation["revertByIdsDept"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DeptId!]!) {
        revertByIdsDept(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsDept;
  return res;
}

/**
 * 根据 ids 彻底删除部门
 * @param {DeptId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: DeptId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsDept: Mutation["forceDeleteByIdsDept"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DeptId!]!) {
        forceDeleteByIdsDept(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsDept;
  return res;
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
  const res = data.findAllDept;
  return res;
}

export async function getDeptList() {
  const data = await findAllDept(
    undefined,
    undefined,
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
  const res = data.findAllUsr;
  return res;
}

export async function getUsrList() {
  const data = await findAllUsr(
    {
      is_enabled: [ 1 ],
    },
    undefined,
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

export async function getDeptTree() {
  const data = await findDeptTree(
    undefined,
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

/**
 * 下载导入模板
 */
export function useDownloadImportTemplate(routePath: string) {
  const {
    nAsync,
    nsAsync,
  } = useI18n(routePath);
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsDept {
            parent_id_lbl
            lbl
            usr_ids_lbl
            order_by
            rem
          }
          findAllDept {
            id
            lbl
          }
          findAllUsr {
            id
            lbl
          }
        }
      `,
      variables: {
      },
    });
    const buffer = await workerFn(
      `${ location.origin }/import_template/base/dept.xlsx`,
      {
        data,
      },
    );
    saveAsExcel(buffer, `${ await nAsync("部门") }${ await nsAsync("导入") }`);
  }
  return {
    workerFn: workerFn2,
    workerStatus,
    workerTerminate,
  };
}

/**
 * 导出Excel
 */
export function useExportExcel(routePath: string) {
  const {
    nAsync,
    nsAsync,
  } = useI18n(routePath);
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
    const data = await query({
      query: /* GraphQL */ `
        query($search: DeptSearch, $sort: [SortInput!]) {
          findAllDept(search: $search, sort: $sort) {
            id
            parent_id
            parent_id_lbl
            lbl
            usr_ids
            usr_ids_lbl
            is_locked
            is_locked_lbl
            is_enabled
            is_enabled_lbl
            order_by
            rem
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
            parent_id_lbl
            lbl
            usr_ids_lbl
            is_locked_lbl
            is_enabled_lbl
            order_by
            rem
            create_usr_id_lbl
            create_time_lbl
            update_usr_id_lbl
            update_time_lbl
          }
          findAllDept {
            lbl
          }
          findAllUsr {
            lbl
          }
          getDict(codes: [
            "is_locked",
            "is_enabled",
          ]) {
            code
            lbl
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
        {
          data,
        },
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
 */
export async function importModels(
  models: DeptInput[],
  percentage: Ref<number>,
  isCancel: Ref<boolean>,
  opt?: GqlOpt,
) {
  const {
    nsAsync,
  } = useI18n();
  
  let succNum = 0;
  let failNum = 0;
  const failErrMsgs: string[] = [ ];
  percentage.value = 0;
  
  for (let i = 0; i < models.length; i++) {
    if (isCancel.value) {
      break;
    }
    
    percentage.value = Math.floor((i + 1) / models.length * 100);
    
    const item = models[i];
    
    opt = opt || { };
    opt.showErrMsg = false;
    opt.notLoading = true;
    
    try {
      await create(
        item,
        UniqueType.Update,
        opt,
      );
      succNum++;
    } catch (err) {
      failNum++;
      failErrMsgs.push(await nsAsync(`第 {0} 行导入失败: {1}`, i + 1, err));
    }
    
  }
  
  return showUploadMsg(succNum, failNum, failErrMsgs);
}

/**
 * 查找 部门 order_by 字段的最大值
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
  const res = data.findLastOrderByDept;
  return res;
}
