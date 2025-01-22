
import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  menuQueryField,
} from "./Model";

import {
  findTree as findMenuTree,
} from "@/views/base/menu/Api";

async function setLblById(
  model?: MenuModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
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
 * 根据搜索条件查找菜单列表
 */
export async function findAll(
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
 * 根据条件查找第一个菜单
 */
export async function findOne(
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

export type MenuModelTree = MenuModel & {
  children?: MenuModelTree[];
}

/**
 * 查找菜单树形列表
 */
export async function findTree(
  search?: MenuSearch,
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
 * 根据搜索条件查找菜单总数
 */
export async function findCount(
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
 * 创建菜单
 * @param {MenuInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: MenuInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<MenuId> {
  const ids = await creates(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建菜单
 */
export async function creates(
  inputs: MenuInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<MenuId[]> {
  inputs = inputs.map(intoInput);
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
 * 根据 id 修改菜单
 */
export async function updateById(
  id: MenuId,
  input: MenuInput,
  opt?: GqlOpt,
): Promise<MenuId> {
  input = intoInput(input);
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
 * 根据 id 查找菜单
 */
export async function findById(
  id: MenuId,
  opt?: GqlOpt,
) {
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
 * 根据 ids 删除菜单
 */
export async function deleteByIds(
  ids: MenuId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 启用或禁用菜单
 */
export async function enableByIds(
  ids: MenuId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
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
 * 根据 ids 锁定或解锁菜单
 */
export async function lockByIds(
  ids: MenuId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
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
 * 根据 ids 还原菜单
 */
export async function revertByIds(
  ids: MenuId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 彻底删除菜单
 */
export async function forceDeleteByIds(
  ids: MenuId[],
  opt?: GqlOpt,
) {
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
  const res = data.findAllMenu;
  return res;
}

export async function getMenuList() {
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
 * 下载菜单导入模板
 */
export function useDownloadImportTemplate() {
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
            order_by
            rem
          }
          findAllMenu {
            id
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
export function useExportExcel() {
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
 * 批量导入菜单
 */
export async function importModels(
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
      await creates(
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
export async function findLastOrderBy(
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

export function getPagePath() {
  return "/base/menu";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: MenuInput = {
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
