import {
  UniqueType,
} from "#/types";

import type {
  WxwUsrId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import type {
  WxwUsrSearch,
  WxwUsrInput,
  WxwUsrModel,
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
  model?: Record<string, any>,
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
 * @param {WxwUsrSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
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
    query: /* GraphQL */ `
      query($search: WxwUsrSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllWxwUsr(search: $search, page: $page, sort: $sort) {
          id
          lbl
          userid
          rem
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
  const models = data.findAllWxwUsr;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个企微用户
 * @param {WxwUsrSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: WxwUsrSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneWxwUsr?: WxwUsrModel;
  } = await query({
    query: /* GraphQL */ `
      query($search: WxwUsrSearch, $sort: [SortInput!]) {
        findOneWxwUsr(search: $search, sort: $sort) {
          id
          lbl
          userid
          rem
          is_deleted
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
 * @param {WxwUsrSearch} search?
 * @param {GqlOpt} opt?
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
  input = intoInput(input);
  const data: {
    createWxwUsr: Mutation["createWxwUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($input: WxwUsrInput!, $unique_type: UniqueType) {
        createWxwUsr(input: $input, unique_type: $unique_type)
      }
    `,
    variables: {
      input,
      unique_type,
    },
  }, opt);
  const id: WxwUsrId = data.createWxwUsr;
  return id;
}

/**
 * 根据 id 修改企微用户
 * @param {WxwUsrId} id
 * @param {WxwUsrInput} input
 * @param {GqlOpt} opt?
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
 * @param {WxwUsrId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: WxwUsrId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdWxwUsr?: WxwUsrModel;
  } = await query({
    query: /* GraphQL */ `
      query($id: WxwUsrId!) {
        findByIdWxwUsr(id: $id) {
          id
          lbl
          userid
          rem
          is_deleted
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
 * @param {WxwUsrId[]} ids
 * @param {GqlOpt} opt?
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
 * @param {WxwUsrId[]} ids
 * @param {GqlOpt} opt?
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
 * @param {WxwUsrId[]} ids
 * @param {GqlOpt} opt?
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
 * 下载导入模板
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
        query: /* GraphQL */ `
          query($search: WxwUsrSearch, $sort: [SortInput!]) {
            findAllWxwUsr(search: $search, sort: $sort) {
              id
              lbl
              userid
              rem
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
 * 批量导入
 * @param {WxwUsrInput[]} models
 */
export async function importModels(
  models: WxwUsrInput[],
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

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: WxwUsrInput = {
  };
  return defaultInput;
}
