
import {
  UniqueType,
} from "#/types.ts";

import {
  DataPermitScope,
  DataPermitType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  dataPermitQueryField,
} from "./Model.ts";

import {
  findTreeMenu,
} from "@/views/base/menu/Api.ts";

export async function setLblByIdDataPermit(
  model?: DataPermitModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputDataPermit(
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
 * 根据搜索条件查找 数据权限 列表
 */
export async function findAllDataPermit(
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
    await setLblByIdDataPermit(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 数据权限
 */
export async function findOneDataPermit(
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
  
  await setLblByIdDataPermit(model);
  
  return model;
}

/**
 * 根据条件查找第一个 数据权限, 如果不存在则抛错
 */
export async function findOneOkDataPermit(
  search?: DataPermitSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkDataPermit?: DataPermitModel;
  } = await query({
    query: `
      query($search: DataPermitSearch, $sort: [SortInput!]) {
        findOneOkDataPermit(search: $search, sort: $sort) {
          ${ dataPermitQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkDataPermit;
  
  await setLblByIdDataPermit(model);
  
  return model;
}

/**
 * 根据搜索条件查找 数据权限 总数
 */
export async function findCountDataPermit(
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
 * 创建 数据权限
 */
export async function createDataPermit(
  input: DataPermitInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DataPermitId> {
  const ids = await createsDataPermit(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 数据权限
 */
export async function createsDataPermit(
  inputs: DataPermitInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DataPermitId[]> {
  inputs = inputs.map(intoInputDataPermit);
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
 * 根据 id 修改 数据权限
 */
export async function updateByIdDataPermit(
  id: DataPermitId,
  input: DataPermitInput,
  opt?: GqlOpt,
): Promise<DataPermitId> {
  input = intoInputDataPermit(input);
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
 * 根据 id 查找 数据权限
 */
export async function findByIdDataPermit(
  id: DataPermitId,
  opt?: GqlOpt,
): Promise<DataPermitModel | undefined> {
  
  if (!id) {
    return;
  }
  
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
  
  await setLblByIdDataPermit(model);
  
  return model;
}

/**
 * 根据 id 查找 数据权限, 如果不存在则抛错
 */
export async function findByIdOkDataPermit(
  id: DataPermitId,
  opt?: GqlOpt,
): Promise<DataPermitModel> {
  
  const data: {
    findByIdOkDataPermit: DataPermitModel;
  } = await query({
    query: `
      query($id: DataPermitId!) {
        findByIdOkDataPermit(id: $id) {
          ${ dataPermitQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkDataPermit;
  
  await setLblByIdDataPermit(model);
  
  return model;
}

/**
 * 根据 ids 查找 数据权限
 */
export async function findByIdsDataPermit(
  ids: DataPermitId[],
  opt?: GqlOpt,
): Promise<DataPermitModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsDataPermit: DataPermitModel[];
  } = await query({
    query: `
      query($ids: [DataPermitId!]!) {
        findByIdsDataPermit(ids: $ids) {
          ${ dataPermitQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsDataPermit;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdDataPermit(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 数据权限, 出现查询不到的 id 则报错
 */
export async function findByIdsOkDataPermit(
  ids: DataPermitId[],
  opt?: GqlOpt,
): Promise<DataPermitModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkDataPermit: DataPermitModel[];
  } = await query({
    query: `
      query($ids: [DataPermitId!]!) {
        findByIdsOkDataPermit(ids: $ids) {
          ${ dataPermitQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkDataPermit;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdDataPermit(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 数据权限
 */
export async function deleteByIdsDataPermit(
  ids: DataPermitId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
 * 根据 ids 还原 数据权限
 */
export async function revertByIdsDataPermit(
  ids: DataPermitId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
 * 根据 ids 彻底删除 数据权限
 */
export async function forceDeleteByIdsDataPermit(
  ids: DataPermitId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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

export async function getTreeMenu() {
  const data = await findTreeMenu(
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
 * 下载 数据权限 导入模板
 */
export function useDownloadImportTemplateDataPermit() {
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
      const sheetName = "数据权限";
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/data_permit.xlsx`,
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
export function useExportExcelDataPermit() {
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
        await setLblByIdDataPermit(model, true);
      }
      try {
        const sheetName = "数据权限";
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
 * 批量导入 数据权限
 */
export async function importModelsDataPermit(
  inputs: DataPermitInput[],
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
      await createsDataPermit(
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
 * 获取 数据权限 字段注释
 */
export async function getFieldCommentsDataPermit(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsDataPermit: Query["getFieldCommentsDataPermit"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsDataPermit {
          id,
          menu_id,
          menu_id_lbl,
          scope,
          scope_lbl,
          type,
          type_lbl,
          rem,
          create_usr_id,
          create_usr_id_lbl,
          create_time,
          create_time_lbl,
          update_usr_id,
          update_usr_id_lbl,
          update_time,
          update_time_lbl,
        }
      }
    `,
    variables: {
    },
  }, opt);
  
  const field_comments = data.getFieldCommentsDataPermit as DataPermitFieldComment;
  
  return field_comments;
}

export function getPagePathDataPermit() {
  return "/base/data_permit";
}

/** 新增时的默认值 */
export async function getDefaultInputDataPermit() {
  const defaultInput: DataPermitInput = {
    scope: DataPermitScope.Tenant,
    type: DataPermitType.Editable,
  };
  return defaultInput;
}
