
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  roleQueryField,
} from "./Model.ts";

import {
  findTreeMenu,
} from "@/views/base/menu/Api.ts";

async function setLblById(
  model?: RoleModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputRole(
  model?: RoleInput,
) {
  const input: RoleInput = {
    // ID
    id: model?.id,
    // 编码
    code: model?.code,
    // 名称
    lbl: model?.lbl,
    // 首页
    home_url: model?.home_url,
    // 菜单权限
    menu_ids: model?.menu_ids,
    menu_ids_lbl: model?.menu_ids_lbl,
    // 按钮权限
    permit_ids: model?.permit_ids,
    permit_ids_lbl: model?.permit_ids_lbl,
    // 数据权限
    data_permit_ids: model?.data_permit_ids,
    // 字段权限
    field_permit_ids: model?.field_permit_ids,
    field_permit_ids_lbl: model?.field_permit_ids_lbl,
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
 * 根据搜索条件查找 角色 列表
 */
export async function findAllRole(
  search?: RoleSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllRole: RoleModel[];
  } = await query({
    query: `
      query($search: RoleSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllRole(search: $search, page: $page, sort: $sort) {
          ${ roleQueryField }
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
 */
export async function findOneRole(
  search?: RoleSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneRole?: RoleModel;
  } = await query({
    query: `
      query($search: RoleSearch, $sort: [SortInput!]) {
        findOneRole(search: $search, sort: $sort) {
          ${ roleQueryField }
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
 * 根据搜索条件查找 角色 总数
 */
export async function findCountRole(
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
 * 创建 角色
 */
export async function createRole(
  input: RoleInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<RoleId> {
  const ids = await createsRole(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 角色
 */
export async function createsRole(
  inputs: RoleInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<RoleId[]> {
  inputs = inputs.map(intoInputRole);
  const data: {
    createsRole: Mutation["createsRole"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [RoleInput!]!, $unique_type: UniqueType) {
        createsRole(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsRole;
  return ids;
}

/**
 * 根据 id 修改 角色
 */
export async function updateByIdRole(
  id: RoleId,
  input: RoleInput,
  opt?: GqlOpt,
): Promise<RoleId> {
  input = intoInputRole(input);
  const data: {
    updateByIdRole: Mutation["updateByIdRole"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: RoleId!, $input: RoleInput!) {
        updateByIdRole(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: RoleId = data.updateByIdRole;
  return id2;
}

/**
 * 根据 id 查找 角色
 */
export async function findByIdRole(
  id?: RoleId,
  opt?: GqlOpt,
): Promise<RoleModel | undefined> {
  if (!id) {
    return;
  }
  const data: {
    findByIdRole?: RoleModel;
  } = await query({
    query: `
      query($id: RoleId!) {
        findByIdRole(id: $id) {
          ${ roleQueryField }
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
 * 根据 ids 查找 角色
 */
export async function findByIdsRole(
  ids: RoleId[],
  opt?: GqlOpt,
): Promise<RoleModel[]> {
  if (ids.length === 0) {
    return [ ];
  }
  opt = opt || { };
  opt.showErrMsg = false;
  let models: RoleModel[] = [ ];
  try {
    const data: {
      findByIdsRole: RoleModel[];
    } = await query({
      query: `
        query($ids: [RoleId!]!) {
          findByIdsRole(ids: $ids) {
            ${ roleQueryField }
          }
        }
      `,
      variables: {
        ids,
      },
    }, opt);
    models = data.findByIdsRole;
  } catch (_err) { /* empty */ }
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据 ids 删除 角色
 */
export async function deleteByIdsRole(
  ids: RoleId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
 * 根据 ids 启用或禁用 角色
 */
export async function enableByIdsRole(
  ids: RoleId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
 * 根据 ids 锁定或解锁 角色
 */
export async function lockByIdsRole(
  ids: RoleId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
 * 根据 ids 还原 角色
 */
export async function revertByIdsRole(
  ids: RoleId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
 * 根据 ids 彻底删除 角色
 */
export async function forceDeleteByIdsRole(
  ids: RoleId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
    findAllMenu: MenuModel[];
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
  const menu_models = data.findAllMenu;
  return menu_models;
}

export async function getListMenu() {
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
    findAllPermit: PermitModel[];
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
  const permit_models = data.findAllPermit;
  return permit_models;
}

export async function getListPermit() {
  const data = await findAllPermit(
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

export async function findAllDataPermit(
  search?: DataPermitSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDataPermit: DataPermitModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: DataPermitSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDataPermit(search: $search, page: $page, sort: $sort) {
          id
          
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const data_permit_models = data.findAllDataPermit;
  return data_permit_models;
}

export async function getListDataPermit() {
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

export async function findAllFieldPermit(
  search?: FieldPermitSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllFieldPermit: FieldPermitModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: FieldPermitSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllFieldPermit(search: $search, page: $page, sort: $sort) {
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
  const field_permit_models = data.findAllFieldPermit;
  return field_permit_models;
}

export async function getListFieldPermit() {
  const data = await findAllFieldPermit(
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

export async function getTreeMenu() {
  const data = await findTreeMenu(
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
 * 下载 角色 导入模板
 */
export function useDownloadImportTemplateRole() {
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
            field_permit_ids_lbl
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
            
          }
          findAllFieldPermit {
            id
            lbl
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "角色";
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/role.xlsx`,
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
export function useExportExcelRole() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: RoleSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: RoleSearch, $sort: [SortInput!]) {
            findAllRole(search: $search, page: null, sort: $sort) {
              ${ roleQueryField }
            }
            findAllMenu {
              lbl
            }
            findAllPermit {
              lbl
            }
            findAllFieldPermit {
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
      for (const model of data.findAllRole) {
        await setLblById(model, true);
      }
      try {
        const sheetName = "角色";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/base/role.xlsx`,
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
 * 批量导入 角色
 */
export async function importModelsRole(
  inputs: RoleInput[],
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
      await createsRole(
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
 * 查找 角色 order_by 字段的最大值
 */
export async function findLastOrderByRole(
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

export function getPagePathRole() {
  return "/base/role";
}

/** 新增时的默认值 */
export async function getDefaultInputRole() {
  const defaultInput: RoleInput = {
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
