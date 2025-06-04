
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  wxwUsrQueryField,
} from "./Model.ts";

async function setLblById(
  model?: WxwUsrModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputWxwUsr(
  model?: WxwUsrInput,
) {
  const input: WxwUsrInput = {
    // ID
    id: model?.id,
    // 企微应用
    wxw_app_id: model?.wxw_app_id,
    wxw_app_id_lbl: model?.wxw_app_id_lbl,
    // 姓名
    lbl: model?.lbl,
    // 用户ID
    userid: model?.userid,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找 企微用户 列表
 */
export async function findAllWxwUsr(
  search?: WxwUsrSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllWxwUsr: WxwUsrModel[];
  } = await query({
    query: `
      query($search: WxwUsrSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllWxwUsr(search: $search, page: $page, sort: $sort) {
          ${ wxwUsrQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllWxwUsr;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 企微用户
 */
export async function findOneWxwUsr(
  search?: WxwUsrSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneWxwUsr?: WxwUsrModel;
  } = await query({
    query: `
      query($search: WxwUsrSearch, $sort: [SortInput!]) {
        findOneWxwUsr(search: $search, sort: $sort) {
          ${ wxwUsrQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneWxwUsr;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据条件查找第一个 企微用户, 如果不存在则抛错
 */
export async function findOneOkWxwUsr(
  search?: WxwUsrSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkWxwUsr?: WxwUsrModel;
  } = await query({
    query: `
      query($search: WxwUsrSearch, $sort: [SortInput!]) {
        findOneOkWxwUsr(search: $search, sort: $sort) {
          ${ wxwUsrQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkWxwUsr;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据搜索条件查找 企微用户 总数
 */
export async function findCountWxwUsr(
  search?: WxwUsrSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountWxwUsr: Query["findCountWxwUsr"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxwUsrSearch) {
        findCountWxwUsr(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountWxwUsr;
  return count;
}

/**
 * 创建 企微用户
 */
export async function createWxwUsr(
  input: WxwUsrInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxwUsrId> {
  const ids = await createsWxwUsr(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 企微用户
 */
export async function createsWxwUsr(
  inputs: WxwUsrInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxwUsrId[]> {
  inputs = inputs.map(intoInputWxwUsr);
  const data: {
    createsWxwUsr: Mutation["createsWxwUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [WxwUsrInput!]!, $unique_type: UniqueType) {
        createsWxwUsr(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsWxwUsr;
  return ids;
}

/**
 * 根据 id 修改 企微用户
 */
export async function updateByIdWxwUsr(
  id: WxwUsrId,
  input: WxwUsrInput,
  opt?: GqlOpt,
): Promise<WxwUsrId> {
  input = intoInputWxwUsr(input);
  const data: {
    updateByIdWxwUsr: Mutation["updateByIdWxwUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: WxwUsrId!, $input: WxwUsrInput!) {
        updateByIdWxwUsr(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: WxwUsrId = data.updateByIdWxwUsr;
  return id2;
}

/**
 * 根据 id 查找 企微用户
 */
export async function findByIdWxwUsr(
  id: WxwUsrId,
  opt?: GqlOpt,
): Promise<WxwUsrModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdWxwUsr?: WxwUsrModel;
  } = await query({
    query: `
      query($id: WxwUsrId!) {
        findByIdWxwUsr(id: $id) {
          ${ wxwUsrQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdWxwUsr;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据 id 查找 企微用户, 如果不存在则抛错
 */
export async function findByIdOkWxwUsr(
  id: WxwUsrId,
  opt?: GqlOpt,
): Promise<WxwUsrModel> {
  
  const data: {
    findByIdOkWxwUsr: WxwUsrModel;
  } = await query({
    query: `
      query($id: WxwUsrId!) {
        findByIdOkWxwUsr(id: $id) {
          ${ wxwUsrQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkWxwUsr;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据 ids 查找 企微用户
 */
export async function findByIdsWxwUsr(
  ids: WxwUsrId[],
  opt?: GqlOpt,
): Promise<WxwUsrModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsWxwUsr: WxwUsrModel[];
  } = await query({
    query: `
      query($ids: [WxwUsrId!]!) {
        findByIdsWxwUsr(ids: $ids) {
          ${ wxwUsrQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsWxwUsr;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 企微用户, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxwUsr(
  ids: WxwUsrId[],
  opt?: GqlOpt,
): Promise<WxwUsrModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkWxwUsr: WxwUsrModel[];
  } = await query({
    query: `
      query($ids: [WxwUsrId!]!) {
        findByIdsOkWxwUsr(ids: $ids) {
          ${ wxwUsrQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkWxwUsr;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 企微用户
 */
export async function deleteByIdsWxwUsr(
  ids: WxwUsrId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsWxwUsr: Mutation["deleteByIdsWxwUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxwUsrId!]!) {
        deleteByIdsWxwUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsWxwUsr;
  return res;
}

/**
 * 根据 ids 还原 企微用户
 */
export async function revertByIdsWxwUsr(
  ids: WxwUsrId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsWxwUsr: Mutation["revertByIdsWxwUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxwUsrId!]!) {
        revertByIdsWxwUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsWxwUsr;
  return res;
}

/**
 * 根据 ids 彻底删除 企微用户
 */
export async function forceDeleteByIdsWxwUsr(
  ids: WxwUsrId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsWxwUsr: Mutation["forceDeleteByIdsWxwUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxwUsrId!]!) {
        forceDeleteByIdsWxwUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsWxwUsr;
  return res;
}

export async function findAllWxwApp(
  search?: WxwAppSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllWxwApp: WxwAppModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxwAppSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllWxwApp(search: $search, page: $page, sort: $sort) {
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
  const wxw_app_models = data.findAllWxwApp;
  return wxw_app_models;
}

export async function getListWxwApp() {
  const data = await findAllWxwApp(
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

/**
 * 下载 企微用户 导入模板
 */
export function useDownloadImportTemplateWxwUsr() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsWxwUsr {
            wxw_app_id_lbl
            lbl
            userid
            rem
          }
          findAllWxwApp {
            id
            lbl
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "企微用户";
      const buffer = await workerFn(
        `${ location.origin }/import_template/wxwork/wxw_usr.xlsx`,
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
export function useExportExcelWxwUsr() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: WxwUsrSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: WxwUsrSearch, $sort: [SortInput!]) {
            findAllWxwUsr(search: $search, page: null, sort: $sort) {
              ${ wxwUsrQueryField }
            }
            findAllWxwApp {
              lbl
            }
          }
        `,
        variables: {
          search,
          sort,
        },
      }, opt);
      for (const model of data.findAllWxwUsr) {
        await setLblById(model, true);
      }
      try {
        const sheetName = "企微用户";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/wxwork/wxw_usr.xlsx`,
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
 * 批量导入 企微用户
 */
export async function importModelsWxwUsr(
  inputs: WxwUsrInput[],
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
      await createsWxwUsr(
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

export function getPagePathWxwUsr() {
  return "/wxwork/wxw_usr";
}

/** 新增时的默认值 */
export async function getDefaultInputWxwUsr() {
  const defaultInput: WxwUsrInput = {
  };
  return defaultInput;
}
