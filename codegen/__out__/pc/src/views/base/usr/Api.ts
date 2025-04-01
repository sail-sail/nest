
import {
  UniqueType,
} from "#/types.ts";

import {
  UsrType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  usrQueryField,
} from "./Model.ts";

import {
  findTreeDept,
} from "@/views/base/dept/Api.ts";

async function setLblById(
  model?: UsrModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
  
  // 头像
  if (model.img) {
    model.img_lbl = location.origin + getImgUrl({
      id: model.img,
      height: 100,
    });
  }
}

export function intoInputUsr(
  model?: UsrInput,
) {
  const input: UsrInput = {
    // ID
    id: model?.id,
    // 头像
    img: model?.img,
    // 名称
    lbl: model?.lbl,
    // 用户名
    username: model?.username,
    // 密码
    password: model?.password,
    // 所属角色
    role_ids: model?.role_ids,
    role_ids_lbl: model?.role_ids_lbl,
    // 所属部门
    dept_ids: model?.dept_ids,
    dept_ids_lbl: model?.dept_ids_lbl,
    // 所属组织
    org_ids: model?.org_ids,
    org_ids_lbl: model?.org_ids_lbl,
    // 默认组织
    default_org_id: model?.default_org_id,
    default_org_id_lbl: model?.default_org_id_lbl,
    // 类型
    type: model?.type,
    type_lbl: model?.type_lbl,
    // 锁定
    is_locked: model?.is_locked,
    is_locked_lbl: model?.is_locked_lbl,
    // 启用
    is_enabled: model?.is_enabled,
    is_enabled_lbl: model?.is_enabled_lbl,
    // 排序
    order_by: model?.order_by,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找 用户 列表
 */
export async function findAllUsr(
  search?: UsrSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllUsr: UsrModel[];
  } = await query({
    query: `
      query($search: UsrSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllUsr(search: $search, page: $page, sort: $sort) {
          ${ usrQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllUsr;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个用户
 */
export async function findOneUsr(
  search?: UsrSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneUsr?: UsrModel;
  } = await query({
    query: `
      query($search: UsrSearch, $sort: [SortInput!]) {
        findOneUsr(search: $search, sort: $sort) {
          ${ usrQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneUsr;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找 用户 总数
 */
export async function findCountUsr(
  search?: UsrSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountUsr: Query["findCountUsr"];
  } = await query({
    query: /* GraphQL */ `
      query($search: UsrSearch) {
        findCountUsr(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountUsr;
  return count;
}

/**
 * 创建 用户
 */
export async function createUsr(
  input: UsrInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<UsrId> {
  const ids = await createsUsr(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 用户
 */
export async function createsUsr(
  inputs: UsrInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<UsrId[]> {
  inputs = inputs.map(intoInputUsr);
  const data: {
    createsUsr: Mutation["createsUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [UsrInput!]!, $unique_type: UniqueType) {
        createsUsr(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsUsr;
  return ids;
}

/**
 * 根据 id 修改 用户
 */
export async function updateByIdUsr(
  id: UsrId,
  input: UsrInput,
  opt?: GqlOpt,
): Promise<UsrId> {
  input = intoInputUsr(input);
  const data: {
    updateByIdUsr: Mutation["updateByIdUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: UsrId!, $input: UsrInput!) {
        updateByIdUsr(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: UsrId = data.updateByIdUsr;
  return id2;
}

/**
 * 根据 id 查找 用户
 */
export async function findByIdUsr(
  id?: UsrId,
  opt?: GqlOpt,
): Promise<UsrModel | undefined> {
  if (!id) {
    return;
  }
  const data: {
    findByIdUsr?: UsrModel;
  } = await query({
    query: `
      query($id: UsrId!) {
        findByIdUsr(id: $id) {
          ${ usrQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdUsr;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 查找 用户
 */
export async function findByIdsUsr(
  ids: UsrId[],
  opt?: GqlOpt,
): Promise<UsrModel[]> {
  if (ids.length === 0) {
    return [ ];
  }
  opt = opt || { };
  opt.showErrMsg = false;
  let models: UsrModel[] = [ ];
  try {
    const data: {
      findByIdsUsr: UsrModel[];
    } = await query({
      query: `
        query($ids: [UsrId!]!) {
          findByIdsUsr(ids: $ids) {
            ${ usrQueryField }
          }
        }
      `,
      variables: {
        ids,
      },
    }, opt);
    models = data.findByIdsUsr;
  } catch (_err) { /* empty */ }
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据 ids 删除 用户
 */
export async function deleteByIdsUsr(
  ids: UsrId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsUsr: Mutation["deleteByIdsUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [UsrId!]!) {
        deleteByIdsUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsUsr;
  return res;
}

/**
 * 根据 ids 启用或禁用 用户
 */
export async function enableByIdsUsr(
  ids: UsrId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    enableByIdsUsr: Mutation["enableByIdsUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [UsrId!]!, $is_enabled: Int!) {
        enableByIdsUsr(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsUsr;
  return res;
}

/**
 * 根据 ids 锁定或解锁 用户
 */
export async function lockByIdsUsr(
  ids: UsrId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    lockByIdsUsr: Mutation["lockByIdsUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [UsrId!]!, $is_locked: Int!) {
        lockByIdsUsr(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsUsr;
  return res;
}

/**
 * 根据 ids 还原 用户
 */
export async function revertByIdsUsr(
  ids: UsrId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsUsr: Mutation["revertByIdsUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [UsrId!]!) {
        revertByIdsUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsUsr;
  return res;
}

/**
 * 根据 ids 彻底删除 用户
 */
export async function forceDeleteByIdsUsr(
  ids: UsrId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsUsr: Mutation["forceDeleteByIdsUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [UsrId!]!) {
        forceDeleteByIdsUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsUsr;
  return res;
}

export async function findAllRole(
  search?: RoleSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllRole: RoleModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: RoleSearch, $page: PageInput, $sort: [SortInput!]) {
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
  const role_models = data.findAllRole;
  return role_models;
}

export async function getListRole() {
  const data = await findAllRole(
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

export async function findAllDept(
  search?: DeptSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDept: DeptModel[];
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
  const dept_models = data.findAllDept;
  return dept_models;
}

export async function getListDept() {
  const data = await findAllDept(
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
 * 下载 用户 导入模板
 */
export function useDownloadImportTemplateUsr() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsUsr {
            img
            lbl
            username
            role_ids_lbl
            dept_ids_lbl
            org_ids_lbl
            default_org_id_lbl
            type_lbl
            order_by
            rem
          }
          findAllRole {
            id
            lbl
          }
          findAllDept {
            id
            lbl
          }
          findAllOrg {
            id
            lbl
          }
          getDict(codes: [
            "usr_type",
          ]) {
            code
            lbl
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "用户";
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/usr.xlsx`,
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
export function useExportExcelUsr() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: UsrSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: UsrSearch, $sort: [SortInput!]) {
            findAllUsr(search: $search, page: null, sort: $sort) {
              ${ usrQueryField }
            }
            findAllRole {
              lbl
            }
            findAllDept {
              lbl
            }
            findAllOrg {
              lbl
            }
            getDict(codes: [
              "usr_type",
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
      for (const model of data.findAllUsr) {
        await setLblById(model, true);
      }
      try {
        const sheetName = "用户";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/base/usr.xlsx`,
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
 * 批量导入 用户
 */
export async function importModelsUsr(
  inputs: UsrInput[],
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
      await createsUsr(
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
 * 查找 用户 order_by 字段的最大值
 */
export async function findLastOrderByUsr(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByUsr: Query["findLastOrderByUsr"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByUsr
      }
    `,
  }, opt);
  const res = data.findLastOrderByUsr;
  return res;
}

export function getPagePathUsr() {
  return "/base/usr";
}

/** 新增时的默认值 */
export async function getDefaultInputUsr() {
  const defaultInput: UsrInput = {
    type: UsrType.Login,
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
