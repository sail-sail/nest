import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  permitQueryField,
} from "./Model";

import {
  findTree as findMenuTree,
} from "@/views/base/menu/Api";

async function setLblById(
  model?: PermitModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
  model?: Record<string, any>,
) {
  const input: PermitInput = {
    // ID
    id: model?.id,
    // 菜单
    menu_id: model?.menu_id,
    menu_id_lbl: model?.menu_id_lbl,
    // 编码
    code: model?.code,
    // 名称
    lbl: model?.lbl,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找按钮权限列表
 * @param {PermitSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: PermitSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllPermit: PermitModel[];
  } = await query({
    query: `
      query($search: PermitSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllPermit(search: $search, page: $page, sort: $sort) {
          ${ permitQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllPermit;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个按钮权限
 * @param {PermitSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: PermitSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOnePermit?: PermitModel;
  } = await query({
    query: `
      query($search: PermitSearch, $sort: [SortInput!]) {
        findOnePermit(search: $search, sort: $sort) {
          ${ permitQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOnePermit;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找按钮权限总数
 * @param {PermitSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: PermitSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountPermit: Query["findCountPermit"];
  } = await query({
    query: /* GraphQL */ `
      query($search: PermitSearch) {
        findCountPermit(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountPermit;
  return count;
}

/**
 * 创建按钮权限
 * @param {PermitInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: PermitInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<PermitId> {
  const ids = await creates(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建按钮权限
 * @param {PermitInput[]} inputs
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function creates(
  inputs: PermitInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<PermitId[]> {
  inputs = inputs.map(intoInput);
  const data: {
    createsPermit: Mutation["createsPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [PermitInput!]!, $unique_type: UniqueType) {
        createsPermit(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsPermit;
  return ids;
}

/**
 * 根据 id 修改按钮权限
 * @param {PermitId} id
 * @param {PermitInput} input
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: PermitId,
  input: PermitInput,
  opt?: GqlOpt,
): Promise<PermitId> {
  input = intoInput(input);
  const data: {
    updateByIdPermit: Mutation["updateByIdPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: PermitId!, $input: PermitInput!) {
        updateByIdPermit(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: PermitId = data.updateByIdPermit;
  return id2;
}

/**
 * 根据 id 查找按钮权限
 * @param {PermitId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: PermitId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdPermit?: PermitModel;
  } = await query({
    query: `
      query($id: PermitId!) {
        findByIdPermit(id: $id) {
          ${ permitQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdPermit;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除按钮权限
 * @param {PermitId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: PermitId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsPermit: Mutation["deleteByIdsPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [PermitId!]!) {
        deleteByIdsPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsPermit;
  return res;
}

/**
 * 根据 ids 还原按钮权限
 * @param {PermitId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: PermitId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsPermit: Mutation["revertByIdsPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [PermitId!]!) {
        revertByIdsPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsPermit;
  return res;
}

/**
 * 根据 ids 彻底删除按钮权限
 * @param {PermitId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: PermitId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsPermit: Mutation["forceDeleteByIdsPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [PermitId!]!) {
        forceDeleteByIdsPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsPermit;
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

export async function getMenuTree() {
  const data = await findMenuTree(
    {
      is_enabled: [ 1 ],
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

/**
 * 下载按钮权限导入模板
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
          getFieldCommentsPermit {
            menu_id_lbl
            code
            lbl
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
      const sheetName = await nsAsync("按钮权限");
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/permit.xlsx`,
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
    search?: PermitSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: PermitSearch, $sort: [SortInput!]) {
            findAllPermit(search: $search, page: null, sort: $sort) {
              ${ permitQueryField }
            }
            findAllMenu {
              lbl
            }
          }
        `,
        variables: {
          search,
          sort,
        },
      }, opt);
      for (const model of data.findAllPermit) {
        await setLblById(model, true);
      }
      try {
        const sheetName = await nsAsync("按钮权限");
        const buffer = await workerFn(
          `${ location.origin }/excel_template/base/permit.xlsx`,
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
 * 批量导入按钮权限
 * @param {PermitInput[]} inputs
 */
export async function importModels(
  inputs: PermitInput[],
  percentage: Ref<number>,
  isCancel: Ref<boolean>,
  opt?: GqlOpt,
) {
  const {
    nsAsync,
  } = useI18n();
  
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
      failErrMsgs.push(await nsAsync(`批量导入第 {0} 至 {1} 行时失败: {1}`, i + 1 - inputs.length, i + 1, err));
    }
    
    percentage.value = Math.floor((i + 1) / len * 100);
  }
  
  return showUploadMsg(succNum, failNum, failErrMsgs);
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: PermitInput = {
  };
  return defaultInput;
}
