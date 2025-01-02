
import {
  UniqueType,
} from "#/types";

import {
  DataPermitScope,
  DataPermitType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  dataPermitQueryField,
} from "./Model";

import {
  findTree as findMenuTree,
} from "@/views/base/menu/Api";

async function setLblById(
  model?: DataPermitModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
  model?: DataPermitInput,
) {
  const input: DataPermitInput = {
    // ID
    id: model?.id,
    // 菜单
    menu_id: model?.menu_id,
    menu_id_lbl: model?.menu_id_lbl,
    // 范围
    scope: model?.scope,
    scope_lbl: model?.scope_lbl,
    // 类型
    type: model?.type,
    type_lbl: model?.type_lbl,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找数据权限列表
 */
export async function findAll(
  search?: DataPermitSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDataPermit: DataPermitModel[];
  } = await query({
    query: `
      query($search: DataPermitSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDataPermit(search: $search, page: $page, sort: $sort) {
          ${ dataPermitQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllDataPermit;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个数据权限
 */
export async function findOne(
  search?: DataPermitSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneDataPermit?: DataPermitModel;
  } = await query({
    query: `
      query($search: DataPermitSearch, $sort: [SortInput!]) {
        findOneDataPermit(search: $search, sort: $sort) {
          ${ dataPermitQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneDataPermit;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找数据权限总数
 */
export async function findCount(
  search?: DataPermitSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountDataPermit: Query["findCountDataPermit"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DataPermitSearch) {
        findCountDataPermit(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountDataPermit;
  return count;
}

/**
 * 创建数据权限
 * @param {DataPermitInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: DataPermitInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DataPermitId> {
  const ids = await creates(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建数据权限
 */
export async function creates(
  inputs: DataPermitInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DataPermitId[]> {
  inputs = inputs.map(intoInput);
  const data: {
    createsDataPermit: Mutation["createsDataPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [DataPermitInput!]!, $unique_type: UniqueType) {
        createsDataPermit(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsDataPermit;
  return ids;
}

/**
 * 根据 id 修改数据权限
 */
export async function updateById(
  id: DataPermitId,
  input: DataPermitInput,
  opt?: GqlOpt,
): Promise<DataPermitId> {
  input = intoInput(input);
  const data: {
    updateByIdDataPermit: Mutation["updateByIdDataPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: DataPermitId!, $input: DataPermitInput!) {
        updateByIdDataPermit(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: DataPermitId = data.updateByIdDataPermit;
  return id2;
}

/**
 * 根据 id 查找数据权限
 */
export async function findById(
  id: DataPermitId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdDataPermit?: DataPermitModel;
  } = await query({
    query: `
      query($id: DataPermitId!) {
        findByIdDataPermit(id: $id) {
          ${ dataPermitQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdDataPermit;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除数据权限
 */
export async function deleteByIds(
  ids: DataPermitId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsDataPermit: Mutation["deleteByIdsDataPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DataPermitId!]!) {
        deleteByIdsDataPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsDataPermit;
  return res;
}

/**
 * 根据 ids 还原数据权限
 */
export async function revertByIds(
  ids: DataPermitId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsDataPermit: Mutation["revertByIdsDataPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DataPermitId!]!) {
        revertByIdsDataPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsDataPermit;
  return res;
}

/**
 * 根据 ids 彻底删除数据权限
 */
export async function forceDeleteByIds(
  ids: DataPermitId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsDataPermit: Mutation["forceDeleteByIdsDataPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DataPermitId!]!) {
        forceDeleteByIdsDataPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsDataPermit;
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
 * 下载数据权限导入模板
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
          getFieldCommentsDataPermit {
            menu_id_lbl
            scope_lbl
            type_lbl
            rem
          }
          findAllMenu {
            id
            lbl
          }
          getDict(codes: [
            "data_permit_scope",
            "data_permit_type",
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
      const sheetName = await nsAsync("数据权限");
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/data_permit.xlsx`,
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
    search?: DataPermitSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: DataPermitSearch, $sort: [SortInput!]) {
            findAllDataPermit(search: $search, page: null, sort: $sort) {
              ${ dataPermitQueryField }
            }
            findAllMenu {
              lbl
            }
            getDict(codes: [
              "data_permit_scope",
              "data_permit_type",
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
      for (const model of data.findAllDataPermit) {
        await setLblById(model, true);
      }
      try {
        const sheetName = await nsAsync("数据权限");
        const buffer = await workerFn(
          `${ location.origin }/excel_template/base/data_permit.xlsx`,
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
 * 批量导入数据权限
 */
export async function importModels(
  inputs: DataPermitInput[],
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
  return "/base/data_permit";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: DataPermitInput = {
    scope: DataPermitScope.Tenant,
    type: DataPermitType.Editable,
  };
  return defaultInput;
}
