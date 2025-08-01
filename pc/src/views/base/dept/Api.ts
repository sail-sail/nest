import cfg from "@/utils/config.ts";

import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  deptQueryField,
} from "./Model.ts";

async function setLblById(
  model?: DeptModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputDept(
  model?: DeptInput,
) {
  const input: DeptInput = {
    // ID
    id: model?.id,
    // 父部门
    parent_id: model?.parent_id,
    parent_id_lbl: model?.parent_id_lbl,
    // 名称
    lbl: model?.lbl,
    // 部门负责人
    usr_ids: model?.usr_ids,
    usr_ids_lbl: model?.usr_ids_lbl,
    // 锁定
    is_locked: model?.is_locked,
    is_locked_lbl: model?.is_locked_lbl,
    // 启用
    is_enabled: model?.is_enabled,
    is_enabled_lbl: model?.is_enabled_lbl,
    // 排序
    order_by: model?.order_by,
    // 组织
    org_id: model?.org_id,
    org_id_lbl: model?.org_id_lbl,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找 部门 列表
 */
export async function findAllDept(
  search?: DeptSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDept: DeptModel[];
  } = await query({
    query: `
      query($search: DeptSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDept(search: $search, page: $page, sort: $sort) {
          ${ deptQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllDept;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 部门
 */
export async function findOneDept(
  search?: DeptSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneDept?: DeptModel;
  } = await query({
    query: `
      query($search: DeptSearch, $sort: [SortInput!]) {
        findOneDept(search: $search, sort: $sort) {
          ${ deptQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneDept;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据条件查找第一个 部门, 如果不存在则抛错
 */
export async function findOneOkDept(
  search?: DeptSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkDept?: DeptModel;
  } = await query({
    query: `
      query($search: DeptSearch, $sort: [SortInput!]) {
        findOneOkDept(search: $search, sort: $sort) {
          ${ deptQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkDept;
  
  await setLblById(model);
  
  return model;
}

export type DeptModelTree = DeptModel & {
  children?: DeptModelTree[];
}

/**
 * 查找 部门 树形列表
 */
export async function findTreeDept(
  search?: DeptSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const res = await findAllDept(
    search,
    undefined,
    sort,
    opt,
  );
  const treeData = list2tree(res);
  return treeData;
}

/**
 * 根据搜索条件查找 部门 总数
 */
export async function findCountDept(
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
  const count = data.findCountDept;
  return count;
}

/**
 * 创建 部门
 */
export async function createDept(
  input: DeptInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DeptId> {
  const ids = await createsDept(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 部门
 */
export async function createsDept(
  inputs: DeptInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DeptId[]> {
  inputs = inputs.map(intoInputDept);
  const data: {
    createsDept: Mutation["createsDept"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [DeptInput!]!, $unique_type: UniqueType) {
        createsDept(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsDept;
  return ids;
}

/**
 * 根据 id 修改 部门
 */
export async function updateByIdDept(
  id: DeptId,
  input: DeptInput,
  opt?: GqlOpt,
): Promise<DeptId> {
  input = intoInputDept(input);
  const data: {
    updateByIdDept: Mutation["updateByIdDept"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: DeptId!, $input: DeptInput!) {
        updateByIdDept(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: DeptId = data.updateByIdDept;
  return id2;
}

/**
 * 根据 id 查找 部门
 */
export async function findByIdDept(
  id: DeptId,
  opt?: GqlOpt,
): Promise<DeptModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdDept?: DeptModel;
  } = await query({
    query: `
      query($id: DeptId!) {
        findByIdDept(id: $id) {
          ${ deptQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdDept;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据 id 查找 部门, 如果不存在则抛错
 */
export async function findByIdOkDept(
  id: DeptId,
  opt?: GqlOpt,
): Promise<DeptModel> {
  
  const data: {
    findByIdOkDept: DeptModel;
  } = await query({
    query: `
      query($id: DeptId!) {
        findByIdOkDept(id: $id) {
          ${ deptQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkDept;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据 ids 查找 部门
 */
export async function findByIdsDept(
  ids: DeptId[],
  opt?: GqlOpt,
): Promise<DeptModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsDept: DeptModel[];
  } = await query({
    query: `
      query($ids: [DeptId!]!) {
        findByIdsDept(ids: $ids) {
          ${ deptQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsDept;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 部门, 出现查询不到的 id 则报错
 */
export async function findByIdsOkDept(
  ids: DeptId[],
  opt?: GqlOpt,
): Promise<DeptModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkDept: DeptModel[];
  } = await query({
    query: `
      query($ids: [DeptId!]!) {
        findByIdsOkDept(ids: $ids) {
          ${ deptQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkDept;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 部门
 */
export async function deleteByIdsDept(
  ids: DeptId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
 * 根据 ids 启用或禁用 部门
 */
export async function enableByIdsDept(
  ids: DeptId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
 * 根据 ids 锁定或解锁 部门
 */
export async function lockByIdsDept(
  ids: DeptId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
 * 根据 ids 还原 部门
 */
export async function revertByIdsDept(
  ids: DeptId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
 * 根据 ids 彻底删除 部门
 */
export async function forceDeleteByIdsDept(
  ids: DeptId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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

export async function getListDept() {
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
    findAllUsr: UsrModel[];
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
  const usr_models = data.findAllUsr;
  return usr_models;
}

export async function getListUsr() {
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

export async function findAllOrg(
  search?: OrgSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllOrg: OrgModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: OrgSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllOrg(search: $search, page: $page, sort: $sort) {
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
  const org_models = data.findAllOrg;
  return org_models;
}

export async function getListOrg() {
  const data = await findAllOrg(
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

export async function getTreeDept() {
  const data = await findTreeDept(
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
 * 下载 部门 导入模板
 */
export function useDownloadImportTemplateDept() {
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
            org_id_lbl
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
          findAllOrg {
            id
            lbl
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "部门";
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/dept.xlsx`,
        {
          sheetName,
          data,
        },
      );
      saveAsExcel(buffer, `${ sheetName}导入`);
    } catch (err) {
      ElMessage.error("下载失败");
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
 * 导出Excel
 */
export function useExportExcelDept() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: DeptSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: DeptSearch, $sort: [SortInput!]) {
            findAllDept(search: $search, page: null, sort: $sort) {
              ${ deptQueryField }
            }
            findAllUsr {
              lbl
            }
            findAllOrg {
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
      for (const model of data.findAllDept) {
        await setLblById(model, true);
      }
      try {
        const sheetName = "部门";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/base/dept.xlsx`,
          {
            sheetName,
            columns,
            data,
          },
        );
        saveAsExcel(buffer, sheetName);
      } catch (err) {
        ElMessage.error("导出失败");
        throw err;
      }
    } finally {
      loading.value = false;
    }
  }
  return {
    loading,
    workerFn: workerFn2,
    workerStatus,
    workerTerminate,
  };
}

/**
 * 批量导入 部门
 */
export async function importModelsDept(
  inputs: DeptInput[],
  percentage: Ref<number>,
  isCancel: Ref<boolean>,
  opt?: GqlOpt,
) {
  opt = opt || { };
  opt.showErrMsg = false;
  opt.notLoading = true;
  
  let succNum = 0;
  let failNum = 0;
  const failErrMsgs: string[] = [ ];
  percentage.value = 0;
  
  const len = inputs.length;
  const inputsArr = splitCreateArr(inputs);
  
  let i = 0;
  for (const inputs of inputsArr) {
    if (isCancel.value) {
      break;
    }
    
    i += inputs.length;
    
    try {
      await createsDept(
        inputs,
        UniqueType.Update,
        opt,
      );
      succNum += inputs.length;
    } catch (err) {
      failNum += inputs.length;
      failErrMsgs.push(`批量导入第 ${ i + 1 - inputs.length } 至 ${ i + 1 } 行时失败: ${ err }`);
    }
    
    percentage.value = Math.floor((i + 1) / len * 100);
  }
  
  return showUploadMsg(succNum, failNum, failErrMsgs);
}

/**
 * 查找 部门 order_by 字段的最大值
 */
export async function findLastOrderByDept(
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

export function getPagePathDept() {
  return "/base/dept";
}

/** 新增时的默认值 */
export async function getDefaultInputDept() {
  const usrStore = useUsrStore();
  const defaultInput: DeptInput = {
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
    org_id: usrStore.loginInfo?.org_id,
  };
  return defaultInput;
}
