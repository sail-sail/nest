import {
  UniqueType,
} from "#/types";

import type {
  UsrId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
  UsrSearch,
  UsrInput,
  UsrModel,
} from "#/types";

import type {
  OrgSearch,
} from "#/types";

import type {
  DeptSearch,
} from "#/types";

import type {
  RoleSearch,
} from "#/types";

import {
  findTree as findDeptTree,
} from "@/views/base/dept/Api";

async function setLblById(
  model?: UsrModel | null,
) {
  if (!model) {
    return;
  }
  
  // 头像
  if (model.img) {
    (model as any).img_lbl = location.origin + getImgUrl({
      id: model.img,
    });
  }
}

export function intoInput(
  model?: Record<string, any>,
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
    // 所属组织
    org_ids: model?.org_ids,
    org_ids_lbl: model?.org_ids_lbl,
    // 默认组织
    default_org_id: model?.default_org_id,
    default_org_id_lbl: model?.default_org_id_lbl,
    // 锁定
    is_locked: model?.is_locked,
    is_locked_lbl: model?.is_locked_lbl,
    // 启用
    is_enabled: model?.is_enabled,
    is_enabled_lbl: model?.is_enabled_lbl,
    // 排序
    order_by: model?.order_by,
    // 所属部门
    dept_ids: model?.dept_ids,
    dept_ids_lbl: model?.dept_ids_lbl,
    // 拥有角色
    role_ids: model?.role_ids,
    role_ids_lbl: model?.role_ids_lbl,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找用户列表
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
  } = await query({
    query: /* GraphQL */ `
      query($search: UsrSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllUsr(search: $search, page: $page, sort: $sort) {
          id
          img
          lbl
          username
          org_ids
          org_ids_lbl
          default_org_id
          default_org_id_lbl
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          order_by
          dept_ids
          dept_ids_lbl
          role_ids
          role_ids_lbl
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
  const models = data.findAllUsr;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个用户
 * @param {UsrSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: UsrSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneUsr: Query["findOneUsr"];
  } = await query({
    query: /* GraphQL */ `
      query($search: UsrSearch, $sort: [SortInput!]) {
        findOneUsr(search: $search, sort: $sort) {
          id
          img
          lbl
          username
          org_ids
          org_ids_lbl
          default_org_id
          default_org_id_lbl
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          order_by
          dept_ids
          dept_ids_lbl
          role_ids
          role_ids_lbl
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
  const model = data.findOneUsr;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找用户总数
 * @param {UsrSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
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
 * 创建用户
 * @param {UsrInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: UsrInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<UsrId> {
  input = intoInput(input);
  const data: {
    createUsr: Mutation["createUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($input: UsrInput!, $unique_type: UniqueType) {
        createUsr(input: $input, unique_type: $unique_type)
      }
    `,
    variables: {
      input,
      unique_type,
    },
  }, opt);
  const id: UsrId = data.createUsr;
  return id;
}

/**
 * 根据 id 修改用户
 * @param {UsrId} id
 * @param {UsrInput} input
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: UsrId,
  input: UsrInput,
  opt?: GqlOpt,
): Promise<UsrId> {
  input = intoInput(input);
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
 * 根据 id 查找用户
 * @param {UsrId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: UsrId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdUsr: Query["findByIdUsr"];
  } = await query({
    query: /* GraphQL */ `
      query($id: UsrId!) {
        findByIdUsr(id: $id) {
          id
          img
          lbl
          username
          org_ids
          org_ids_lbl
          default_org_id
          default_org_id_lbl
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          order_by
          dept_ids
          dept_ids_lbl
          role_ids
          role_ids_lbl
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
      id,
    },
  }, opt);
  const model = data.findByIdUsr;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除用户
 * @param {UsrId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: UsrId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 启用或禁用用户
 * @param {UsrId[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
 */
export async function enableByIds(
  ids: UsrId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
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
 * 根据 ids 锁定或解锁用户
 * @param {UsrId[]} ids
 * @param {0 | 1} is_locked
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: UsrId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
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
 * 根据 ids 还原用户
 * @param {UsrId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: UsrId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 彻底删除用户
 * @param {UsrId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: UsrId[],
  opt?: GqlOpt,
) {
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

export async function findAllOrg(
  search?: OrgSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllOrg: Query["findAllOrg"];
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
  const res = data.findAllOrg;
  return res;
}

export async function getOrgList() {
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

export async function findAllRole(
  search?: RoleSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllRole: Query["findAllRole"];
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
  const res = data.findAllRole;
  return res;
}

export async function getRoleList() {
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
          getFieldCommentsUsr {
            img
            lbl
            username
            org_ids_lbl
            default_org_id_lbl
            order_by
            dept_ids_lbl
            role_ids_lbl
            rem
          }
          findAllOrg {
            id
            lbl
          }
          findAllDept {
            id
            lbl
          }
          findAllRole {
            id
            lbl
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = await nsAsync("用户");
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/usr.xlsx`,
        {
          sheetName,
          data,
        },
      );
      saveAsExcel(buffer, `${ sheetName }${ await nsAsync("导入") }`);
    } catch (err) {
      ElMessage.error(await nsAsync("下载失败"));
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
export function useExportExcel(routePath: string) {
  const {
    nsAsync,
  } = useI18n(routePath);
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
        query: /* GraphQL */ `
          query($search: UsrSearch, $sort: [SortInput!]) {
            findAllUsr(search: $search, sort: $sort) {
              id
              img
              lbl
              username
              org_ids
              org_ids_lbl
              default_org_id
              default_org_id_lbl
              is_locked
              is_locked_lbl
              is_enabled
              is_enabled_lbl
              order_by
              dept_ids
              dept_ids_lbl
              role_ids
              role_ids_lbl
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
            findAllOrg {
              lbl
            }
            findAllDept {
              lbl
            }
            findAllRole {
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
      for (const model of data.findAllUsr) {
        await setLblById(model);
      }
      try {
        const sheetName = await nsAsync("用户");
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
        ElMessage.error(await nsAsync("导出失败"));
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
 * 批量导入
 * @param {UsrInput[]} models
 */
export async function importModels(
  models: UsrInput[],
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
 * 查找 用户 order_by 字段的最大值
 * @param {GqlOpt} opt?
 */
export async function findLastOrderBy(
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

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: UsrInput = {
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
