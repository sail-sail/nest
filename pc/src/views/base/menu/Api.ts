
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  menuQueryField,
} from "./Model.ts";

async function setLblById(
  model?: MenuModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputMenu(
  model?: MenuInput,
) {
  const input: MenuInput = {
    // ID
    id: model?.id,
    // 父菜单
    parent_id: model?.parent_id,
    parent_id_lbl: model?.parent_id_lbl,
    // 名称
    lbl: model?.lbl,
    // 路由
    route_path: model?.route_path,
    // 参数
    route_query: model?.route_query,
    // 首页隐藏
    is_home_hide: model?.is_home_hide,
    is_home_hide_lbl: model?.is_home_hide_lbl,
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
 * 根据搜索条件查找 菜单 列表
 */
export async function findAllMenu(
  search?: MenuSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllMenu: MenuModel[];
  } = await query({
    query: `
      query($search: MenuSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllMenu(search: $search, page: $page, sort: $sort) {
          ${ menuQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllMenu;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 菜单
 */
export async function findOneMenu(
  search?: MenuSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneMenu?: MenuModel;
  } = await query({
    query: `
      query($search: MenuSearch, $sort: [SortInput!]) {
        findOneMenu(search: $search, sort: $sort) {
          ${ menuQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneMenu;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据条件查找第一个 菜单, 如果不存在则抛错
 */
export async function findOneOkMenu(
  search?: MenuSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkMenu?: MenuModel;
  } = await query({
    query: `
      query($search: MenuSearch, $sort: [SortInput!]) {
        findOneOkMenu(search: $search, sort: $sort) {
          ${ menuQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkMenu;
  
  await setLblById(model);
  
  return model;
}

export type MenuModelTree = MenuModel & {
  children?: MenuModelTree[];
}

/**
 * 查找 菜单 树形列表
 */
export async function findTreeMenu(
  search?: MenuSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const res = await findAllMenu(
    search,
    undefined,
    sort,
    opt,
  );
  const treeData = list2tree(res);
  return treeData;
}

/**
 * 根据搜索条件查找 菜单 总数
 */
export async function findCountMenu(
  search?: MenuSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountMenu: Query["findCountMenu"];
  } = await query({
    query: /* GraphQL */ `
      query($search: MenuSearch) {
        findCountMenu(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountMenu;
  return count;
}

/**
 * 创建 菜单
 */
export async function createMenu(
  input: MenuInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<MenuId> {
  const ids = await createsMenu(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 菜单
 */
export async function createsMenu(
  inputs: MenuInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<MenuId[]> {
  inputs = inputs.map(intoInputMenu);
  const data: {
    createsMenu: Mutation["createsMenu"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [MenuInput!]!, $unique_type: UniqueType) {
        createsMenu(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsMenu;
  return ids;
}

/**
 * 根据 id 修改 菜单
 */
export async function updateByIdMenu(
  id: MenuId,
  input: MenuInput,
  opt?: GqlOpt,
): Promise<MenuId> {
  input = intoInputMenu(input);
  const data: {
    updateByIdMenu: Mutation["updateByIdMenu"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: MenuId!, $input: MenuInput!) {
        updateByIdMenu(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: MenuId = data.updateByIdMenu;
  return id2;
}

/**
 * 根据 id 查找 菜单
 */
export async function findByIdMenu(
  id: MenuId,
  opt?: GqlOpt,
): Promise<MenuModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdMenu?: MenuModel;
  } = await query({
    query: `
      query($id: MenuId!) {
        findByIdMenu(id: $id) {
          ${ menuQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdMenu;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据 id 查找 菜单, 如果不存在则抛错
 */
export async function findByIdOkMenu(
  id: MenuId,
  opt?: GqlOpt,
): Promise<MenuModel> {
  
  const data: {
    findByIdOkMenu: MenuModel;
  } = await query({
    query: `
      query($id: MenuId!) {
        findByIdOkMenu(id: $id) {
          ${ menuQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkMenu;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据 ids 查找 菜单
 */
export async function findByIdsMenu(
  ids: MenuId[],
  opt?: GqlOpt,
): Promise<MenuModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsMenu: MenuModel[];
  } = await query({
    query: `
      query($ids: [MenuId!]!) {
        findByIdsMenu(ids: $ids) {
          ${ menuQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsMenu;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 菜单, 出现查询不到的 id 则报错
 */
export async function findByIdsOkMenu(
  ids: MenuId[],
  opt?: GqlOpt,
): Promise<MenuModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkMenu: MenuModel[];
  } = await query({
    query: `
      query($ids: [MenuId!]!) {
        findByIdsOkMenu(ids: $ids) {
          ${ menuQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkMenu;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 菜单
 */
export async function deleteByIdsMenu(
  ids: MenuId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsMenu: Mutation["deleteByIdsMenu"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [MenuId!]!) {
        deleteByIdsMenu(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsMenu;
  return res;
}

/**
 * 根据 ids 启用或禁用 菜单
 */
export async function enableByIdsMenu(
  ids: MenuId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    enableByIdsMenu: Mutation["enableByIdsMenu"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [MenuId!]!, $is_enabled: Int!) {
        enableByIdsMenu(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsMenu;
  return res;
}

/**
 * 根据 ids 锁定或解锁 菜单
 */
export async function lockByIdsMenu(
  ids: MenuId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    lockByIdsMenu: Mutation["lockByIdsMenu"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [MenuId!]!, $is_locked: Int!) {
        lockByIdsMenu(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsMenu;
  return res;
}

/**
 * 根据 ids 还原 菜单
 */
export async function revertByIdsMenu(
  ids: MenuId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsMenu: Mutation["revertByIdsMenu"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [MenuId!]!) {
        revertByIdsMenu(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsMenu;
  return res;
}

/**
 * 根据 ids 彻底删除 菜单
 */
export async function forceDeleteByIdsMenu(
  ids: MenuId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsMenu: Mutation["forceDeleteByIdsMenu"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [MenuId!]!) {
        forceDeleteByIdsMenu(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsMenu;
  return res;
}

export async function getListMenu() {
  const data = await findAllMenu(
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

export const menuDataPermit = {
} as const;

export function useMenuTreeFilter(_value: string, model: MenuModel): boolean {
  const route_path = model.route_path;
  if (!route_path) {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isPermit = (menuDataPermit as any)[route_path];
  return isPermit;
}

/**
 * 下载 菜单 导入模板
 */
export function useDownloadImportTemplateMenu() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsMenu {
            parent_id_lbl
            lbl
            route_path
            route_query
            is_home_hide_lbl
            order_by
            rem
          }
          findAllMenu {
            id
            lbl
          }
          getDict(codes: [
            "yes_no",
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
      const sheetName = "菜单";
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/menu.xlsx`,
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
export function useExportExcelMenu() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: MenuSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: MenuSearch, $sort: [SortInput!]) {
            findAllMenu(search: $search, page: null, sort: $sort) {
              ${ menuQueryField }
            }
            getDict(codes: [
              "yes_no",
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
      for (const model of data.findAllMenu) {
        await setLblById(model, true);
      }
      try {
        const sheetName = "菜单";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/base/menu.xlsx`,
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
 * 批量导入 菜单
 */
export async function importModelsMenu(
  inputs: MenuInput[],
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
      await createsMenu(
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
 * 查找 菜单 order_by 字段的最大值
 */
export async function findLastOrderByMenu(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByMenu: Query["findLastOrderByMenu"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByMenu
      }
    `,
  }, opt);
  const res = data.findLastOrderByMenu;
  return res;
}

export function getPagePathMenu() {
  return "/base/menu";
}

/** 新增时的默认值 */
export async function getDefaultInputMenu() {
  const defaultInput: MenuInput = {
    is_home_hide: 0,
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
