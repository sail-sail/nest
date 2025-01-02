
import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  wxwUsrQueryField,
} from "./Model";

async function setLblById(
  model?: WxwUsrModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
  model?: WxwUsrInput,
) {
  const input: WxwUsrInput = {
    // ID
    id: model?.id,
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
 * 根据搜索条件查找企微用户列表
 */
export async function findAll(
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
 * 根据条件查找第一个企微用户
 */
export async function findOne(
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
 * 根据搜索条件查找企微用户总数
 */
export async function findCount(
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
 * 创建企微用户
 * @param {WxwUsrInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: WxwUsrInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxwUsrId> {
  const ids = await creates(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建企微用户
 */
export async function creates(
  inputs: WxwUsrInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxwUsrId[]> {
  inputs = inputs.map(intoInput);
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
 * 根据 id 修改企微用户
 */
export async function updateById(
  id: WxwUsrId,
  input: WxwUsrInput,
  opt?: GqlOpt,
): Promise<WxwUsrId> {
  input = intoInput(input);
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
 * 根据 id 查找企微用户
 */
export async function findById(
  id: WxwUsrId,
  opt?: GqlOpt,
) {
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
 * 根据 ids 删除企微用户
 */
export async function deleteByIds(
  ids: WxwUsrId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 还原企微用户
 */
export async function revertByIds(
  ids: WxwUsrId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 彻底删除企微用户
 */
export async function forceDeleteByIds(
  ids: WxwUsrId[],
  opt?: GqlOpt,
) {
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

/**
 * 下载企微用户导入模板
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
          getFieldCommentsWxwUsr {
            lbl
            userid
            rem
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = await nsAsync("企微用户");
      const buffer = await workerFn(
        `${ location.origin }/import_template/wxwork/wxw_usr.xlsx`,
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
        const sheetName = await nsAsync("企微用户");
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
 * 批量导入企微用户
 */
export async function importModels(
  inputs: WxwUsrInput[],
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
  return "/wxwork/wxw_usr";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: WxwUsrInput = {
  };
  return defaultInput;
}
