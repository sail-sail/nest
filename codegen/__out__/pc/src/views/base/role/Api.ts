import {
  UniqueType,
} from "#/types";

import type {
  RoleId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
  RoleSearch,
  RoleInput,
  RoleModel,
} from "#/types";

import type {
  MenuSearch,
} from "#/types";

import type {
  PermitSearch,
} from "#/types";

import type {
  DataPermitSearch,
} from "#/types";

import {
  findTree as findMenuTree,
} from "@/views/base/menu/Api";

async function setLblById(
  model?: RoleModel | null,
) {
  if (!model) {
    return;
  }
}

/**
 * 根据搜索条件查找角色列表
 * @param {RoleSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
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
          home_url
          menu_ids
          menu_ids_lbl
          permit_ids
          permit_ids_lbl
          data_permit_ids
          data_permit_ids_lbl
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
  const models = data.findAllRole;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个角色
 * @param {RoleSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: RoleSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneRole: Query["findOneRole"];
  } = await query({
    query: /* GraphQL */ `
      query($search: RoleSearch, $sort: [SortInput!]) {
        findOneRole(search: $search, sort: $sort) {
          id
          lbl
          home_url
          menu_ids
          menu_ids_lbl
          permit_ids
          permit_ids_lbl
          data_permit_ids
          data_permit_ids_lbl
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
  const model = data.findOneRole;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找角色总数
 * @param {RoleSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: RoleSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountRole: Query["findCountRole"];
  } = await query({
    query: /* GraphQL */ `
      query($search: RoleSearch) {
        findCountRole(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountRole;
  return count;
}

/**
 * 创建角色
 * @param {RoleInput} model
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: RoleInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<RoleId> {
  const data: {
    createRole: Mutation["createRole"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: RoleInput!, $unique_type: UniqueType) {
        createRole(model: $model, unique_type: $unique_type)
      }
    `,
    variables: {
      model,
      unique_type,
    },
  }, opt);
  const id: RoleId = data.createRole;
  return id;
}

/**
 * 根据 id 修改角色
 * @param {RoleId} id
 * @param {RoleInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: RoleId,
  model: RoleInput,
  opt?: GqlOpt,
): Promise<RoleId> {
  const data: {
    updateByIdRole: Mutation["updateByIdRole"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: RoleId!, $model: RoleInput!) {
        updateByIdRole(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const id2: RoleId = data.updateByIdRole;
  return id2;
}

/**
 * 根据 id 查找角色
 * @param {RoleId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: RoleId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdRole: Query["findByIdRole"];
  } = await query({
    query: /* GraphQL */ `
      query($id: RoleId!) {
        findByIdRole(id: $id) {
          id
          lbl
          home_url
          menu_ids
          menu_ids_lbl
          permit_ids
          permit_ids_lbl
          data_permit_ids
          data_permit_ids_lbl
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
  const model = data.findByIdRole;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除角色
 * @param {RoleId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: RoleId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsRole: Mutation["deleteByIdsRole"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [RoleId!]!) {
        deleteByIdsRole(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsRole;
  return res;
}

/**
 * 根据 ids 启用或禁用角色
 * @param {RoleId[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
 */
export async function enableByIds(
  ids: RoleId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    enableByIdsRole: Mutation["enableByIdsRole"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [RoleId!]!, $is_enabled: Int!) {
        enableByIdsRole(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsRole;
  return res;
}

/**
 * 根据 ids 锁定或解锁角色
 * @param {RoleId[]} ids
 * @param {0 | 1} is_locked
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: RoleId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    lockByIdsRole: Mutation["lockByIdsRole"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [RoleId!]!, $is_locked: Int!) {
        lockByIdsRole(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsRole;
  return res;
}

/**
 * 根据 ids 还原角色
 * @param {RoleId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: RoleId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsRole: Mutation["revertByIdsRole"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [RoleId!]!) {
        revertByIdsRole(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsRole;
  return res;
}

/**
 * 根据 ids 彻底删除角色
 * @param {RoleId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: RoleId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsRole: Mutation["forceDeleteByIdsRole"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [RoleId!]!) {
        forceDeleteByIdsRole(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsRole;
  return res;
}

export async function findAllMenu(
  search?: MenuSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllMenu: Query["findAllMenu"];
  } = await query({
    query: /* GraphQL */ `
      query($search: MenuSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllMenu(search: $search, page: $page, sort: $sort) {
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
  const res = data.findAllMenu;
  return res;
}

export async function getMenuList() {
  const data = await findAllMenu(
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

export async function findAllPermit(
  search?: PermitSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllPermit: Query["findAllPermit"];
  } = await query({
    query: /* GraphQL */ `
      query($search: PermitSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllPermit(search: $search, page: $page, sort: $sort) {
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
  const res = data.findAllPermit;
  return res;
}

export async function getPermitList() {
  const data = await findAllPermit(
    undefined,
    undefined,
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

export async function findAllDataPermit(
  search?: DataPermitSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDataPermit: Query["findAllDataPermit"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DataPermitSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDataPermit(search: $search, page: $page, sort: $sort) {
          id
          scope
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const res = data.findAllDataPermit;
  return res;
}

export async function getDataPermitList() {
  const data = await findAllDataPermit(
    undefined,
    undefined,
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

export async function getMenuTree() {
  const data = await findMenuTree(
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
          getFieldCommentsRole {
            lbl
            home_url
            menu_ids_lbl
            permit_ids_lbl
            data_permit_ids_lbl
            order_by
            rem
          }
          findAllMenu {
            id
            lbl
          }
          findAllPermit {
            id
            lbl
          }
          findAllDataPermit {
            id
            scope
          }
        }
      `,
      variables: {
      },
    });
    const buffer = await workerFn(
      `${ location.origin }/import_template/base/role.xlsx`,
      {
        data,
      },
    );
    saveAsExcel(buffer, `${ await nAsync("角色") }${ await nsAsync("导入") }`);
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
    search?: RoleSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const data = await query({
      query: /* GraphQL */ `
        query($search: RoleSearch, $sort: [SortInput!]) {
          findAllRole(search: $search, sort: $sort) {
            id
            lbl
            home_url
            menu_ids
            menu_ids_lbl
            permit_ids
            permit_ids_lbl
            data_permit_ids
            data_permit_ids_lbl
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
          getFieldCommentsRole {
            lbl
            home_url
            menu_ids_lbl
            permit_ids_lbl
            data_permit_ids_lbl
            is_locked_lbl
            is_enabled_lbl
            order_by
            rem
            create_usr_id_lbl
            create_time_lbl
            update_usr_id_lbl
            update_time_lbl
          }
          findAllMenu {
            lbl
          }
          findAllPermit {
            lbl
          }
          findAllDataPermit {
            scope
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
        `${ location.origin }/excel_template/base/role.xlsx`,
        {
          data,
        },
      );
      saveAsExcel(buffer, await nAsync("角色"));
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
 * @param {RoleInput[]} models
 */
export async function importModels(
  models: RoleInput[],
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
 * 查找 角色 order_by 字段的最大值
 * @param {GqlOpt} opt?
 */
export async function findLastOrderBy(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByRole: Query["findLastOrderByRole"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByRole
      }
    `,
  }, opt);
  const res = data.findLastOrderByRole;
  return res;
}
