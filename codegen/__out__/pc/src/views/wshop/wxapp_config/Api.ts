
import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  wxappConfigQueryField,
} from "./Model";

async function setLblById(
  model?: WxappConfigModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
  
  // 图片
  if (model.img) {
    model.img_lbl = location.origin + getImgUrl({
      id: model.img,
      height: 100,
    });
  }
}

export function intoInput(
  model?: WxappConfigInput,
) {
  const input: WxappConfigInput = {
    // ID
    id: model?.id,
    // 图片
    img: model?.img,
    // 名称
    lbl: model?.lbl,
    // 值
    val: model?.val,
    // 锁定
    is_locked: model?.is_locked,
    is_locked_lbl: model?.is_locked_lbl,
    // 启用
    is_enabled: model?.is_enabled,
    is_enabled_lbl: model?.is_enabled_lbl,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找小程序配置列表
 */
export async function findAll(
  search?: WxappConfigSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllWxappConfig: WxappConfigModel[];
  } = await query({
    query: `
      query($search: WxappConfigSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllWxappConfig(search: $search, page: $page, sort: $sort) {
          ${ wxappConfigQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllWxappConfig;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个小程序配置
 */
export async function findOne(
  search?: WxappConfigSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneWxappConfig?: WxappConfigModel;
  } = await query({
    query: `
      query($search: WxappConfigSearch, $sort: [SortInput!]) {
        findOneWxappConfig(search: $search, sort: $sort) {
          ${ wxappConfigQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneWxappConfig;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找小程序配置总数
 */
export async function findCount(
  search?: WxappConfigSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountWxappConfig: Query["findCountWxappConfig"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxappConfigSearch) {
        findCountWxappConfig(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountWxappConfig;
  return count;
}

/**
 * 创建小程序配置
 * @param {WxappConfigInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: WxappConfigInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxappConfigId> {
  const ids = await creates(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建小程序配置
 */
export async function creates(
  inputs: WxappConfigInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxappConfigId[]> {
  inputs = inputs.map(intoInput);
  const data: {
    createsWxappConfig: Mutation["createsWxappConfig"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [WxappConfigInput!]!, $unique_type: UniqueType) {
        createsWxappConfig(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsWxappConfig;
  return ids;
}

/**
 * 根据 id 修改小程序配置
 */
export async function updateById(
  id: WxappConfigId,
  input: WxappConfigInput,
  opt?: GqlOpt,
): Promise<WxappConfigId> {
  input = intoInput(input);
  const data: {
    updateByIdWxappConfig: Mutation["updateByIdWxappConfig"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: WxappConfigId!, $input: WxappConfigInput!) {
        updateByIdWxappConfig(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: WxappConfigId = data.updateByIdWxappConfig;
  return id2;
}

/**
 * 根据 id 查找小程序配置
 */
export async function findById(
  id: WxappConfigId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdWxappConfig?: WxappConfigModel;
  } = await query({
    query: `
      query($id: WxappConfigId!) {
        findByIdWxappConfig(id: $id) {
          ${ wxappConfigQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdWxappConfig;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除小程序配置
 */
export async function deleteByIds(
  ids: WxappConfigId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsWxappConfig: Mutation["deleteByIdsWxappConfig"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxappConfigId!]!) {
        deleteByIdsWxappConfig(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsWxappConfig;
  return res;
}

/**
 * 根据 ids 启用或禁用小程序配置
 */
export async function enableByIds(
  ids: WxappConfigId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    enableByIdsWxappConfig: Mutation["enableByIdsWxappConfig"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxappConfigId!]!, $is_enabled: Int!) {
        enableByIdsWxappConfig(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsWxappConfig;
  return res;
}

/**
 * 根据 ids 锁定或解锁小程序配置
 */
export async function lockByIds(
  ids: WxappConfigId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    lockByIdsWxappConfig: Mutation["lockByIdsWxappConfig"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxappConfigId!]!, $is_locked: Int!) {
        lockByIdsWxappConfig(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsWxappConfig;
  return res;
}

/**
 * 根据 ids 还原小程序配置
 */
export async function revertByIds(
  ids: WxappConfigId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsWxappConfig: Mutation["revertByIdsWxappConfig"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxappConfigId!]!) {
        revertByIdsWxappConfig(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsWxappConfig;
  return res;
}

/**
 * 根据 ids 彻底删除小程序配置
 */
export async function forceDeleteByIds(
  ids: WxappConfigId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsWxappConfig: Mutation["forceDeleteByIdsWxappConfig"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxappConfigId!]!) {
        forceDeleteByIdsWxappConfig(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsWxappConfig;
  return res;
}

/**
 * 下载小程序配置导入模板
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
          getFieldCommentsWxappConfig {
            img
            lbl
            val
            rem
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "小程序配置";
      const buffer = await workerFn(
        `${ location.origin }/import_template/wshop/wxapp_config.xlsx`,
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
    search?: WxappConfigSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: WxappConfigSearch, $sort: [SortInput!]) {
            findAllWxappConfig(search: $search, page: null, sort: $sort) {
              ${ wxappConfigQueryField }
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
      for (const model of data.findAllWxappConfig) {
        await setLblById(model, true);
      }
      try {
        const sheetName = "小程序配置";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/wshop/wxapp_config.xlsx`,
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
 * 批量导入小程序配置
 */
export async function importModels(
  inputs: WxappConfigInput[],
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

export function getPagePath() {
  return "/wshop/wxapp_config";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: WxappConfigInput = {
    is_locked: 0,
    is_enabled: 1,
  };
  return defaultInput;
}
