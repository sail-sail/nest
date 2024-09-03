import cfg from "@/utils/config";

import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  fieldPermitQueryField,
} from "./Model";

import {
  findTree as findMenuTree,
} from "@/views/base/menu/Api";

async function setLblById(
  model?: FieldPermitModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
  model?: Record<string, any>,
) {
  const input: FieldPermitInput = {
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
 * 根据搜索条件查找字段权限列表
 */
export async function findAll(
  search?: FieldPermitSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllFieldPermit: FieldPermitModel[];
  } = await query({
    query: `
      query($search: FieldPermitSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllFieldPermit(search: $search, page: $page, sort: $sort) {
          ${ fieldPermitQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllFieldPermit;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个字段权限
 */
export async function findOne(
  search?: FieldPermitSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneFieldPermit?: FieldPermitModel;
  } = await query({
    query: `
      query($search: FieldPermitSearch, $sort: [SortInput!]) {
        findOneFieldPermit(search: $search, sort: $sort) {
          ${ fieldPermitQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneFieldPermit;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找字段权限总数
 */
export async function findCount(
  search?: FieldPermitSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountFieldPermit: Query["findCountFieldPermit"];
  } = await query({
    query: /* GraphQL */ `
      query($search: FieldPermitSearch) {
        findCountFieldPermit(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountFieldPermit;
  return count;
}

/**
 * 创建字段权限
 * @param {FieldPermitInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: FieldPermitInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<FieldPermitId> {
  const ids = await creates(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建字段权限
 */
export async function creates(
  inputs: FieldPermitInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<FieldPermitId[]> {
  inputs = inputs.map(intoInput);
  const data: {
    createsFieldPermit: Mutation["createsFieldPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [FieldPermitInput!]!, $unique_type: UniqueType) {
        createsFieldPermit(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsFieldPermit;
  return ids;
}

/**
 * 根据 id 修改字段权限
 */
export async function updateById(
  id: FieldPermitId,
  input: FieldPermitInput,
  opt?: GqlOpt,
): Promise<FieldPermitId> {
  input = intoInput(input);
  const data: {
    updateByIdFieldPermit: Mutation["updateByIdFieldPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: FieldPermitId!, $input: FieldPermitInput!) {
        updateByIdFieldPermit(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: FieldPermitId = data.updateByIdFieldPermit;
  return id2;
}

/**
 * 根据 id 查找字段权限
 */
export async function findById(
  id: FieldPermitId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdFieldPermit?: FieldPermitModel;
  } = await query({
    query: `
      query($id: FieldPermitId!) {
        findByIdFieldPermit(id: $id) {
          ${ fieldPermitQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdFieldPermit;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除字段权限
 */
export async function deleteByIds(
  ids: FieldPermitId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsFieldPermit: Mutation["deleteByIdsFieldPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [FieldPermitId!]!) {
        deleteByIdsFieldPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsFieldPermit;
  return res;
}

/**
 * 根据 ids 还原字段权限
 */
export async function revertByIds(
  ids: FieldPermitId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsFieldPermit: Mutation["revertByIdsFieldPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [FieldPermitId!]!) {
        revertByIdsFieldPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsFieldPermit;
  return res;
}

/**
 * 根据 ids 彻底删除字段权限
 */
export async function forceDeleteByIds(
  ids: FieldPermitId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsFieldPermit: Mutation["forceDeleteByIdsFieldPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [FieldPermitId!]!) {
        forceDeleteByIdsFieldPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsFieldPermit;
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
 * 下载字段权限导入模板
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
          getFieldCommentsFieldPermit {
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
      const sheetName = await nsAsync("字段权限");
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/field_permit.xlsx`,
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
    search?: FieldPermitSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: FieldPermitSearch, $sort: [SortInput!]) {
            findAllFieldPermit(search: $search, page: null, sort: $sort) {
              ${ fieldPermitQueryField }
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
      for (const model of data.findAllFieldPermit) {
        await setLblById(model, true);
      }
      try {
        const sheetName = await nsAsync("字段权限");
        const buffer = await workerFn(
          `${ location.origin }/excel_template/base/field_permit.xlsx`,
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
 * 批量导入字段权限
 */
export async function importModels(
  inputs: FieldPermitInput[],
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

export function getPagePath() {
  return "/base/field_permit";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: FieldPermitInput = {
  };
  return defaultInput;
}
