import {
  UniqueType,
} from "#/types";

import type {
  WxappConfigId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import type {
  WxappConfigSearch,
  WxappConfigInput,
  WxappConfigModel,
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
    (model as any).img_lbl = location.origin + getImgUrl({
      id: model.img,
    });
  }
}

export function intoInput(
  model?: Record<string, any>,
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
 * @param {WxappConfigSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
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
    query: /* GraphQL */ `
      query($search: WxappConfigSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllWxappConfig(search: $search, page: $page, sort: $sort) {
          id
          img
          lbl
          val
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          rem
          create_usr_id
          create_usr_id_lbl
          create_time
          create_time_lbl
          update_usr_id
          update_usr_id_lbl
          update_time
          update_time_lbl
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
  const models = data.findAllWxappConfig;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个小程序配置
 * @param {WxappConfigSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: WxappConfigSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneWxappConfig?: WxappConfigModel;
  } = await query({
    query: /* GraphQL */ `
      query($search: WxappConfigSearch, $sort: [SortInput!]) {
        findOneWxappConfig(search: $search, sort: $sort) {
          id
          img
          lbl
          val
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          rem
          create_usr_id
          create_usr_id_lbl
          create_time
          create_time_lbl
          update_usr_id
          update_usr_id_lbl
          update_time
          update_time_lbl
          is_deleted
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
 * @param {WxappConfigSearch} search?
 * @param {GqlOpt} opt?
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
  input = intoInput(input);
  const data: {
    createWxappConfig: Mutation["createWxappConfig"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($input: WxappConfigInput!, $unique_type: UniqueType) {
        createWxappConfig(input: $input, unique_type: $unique_type)
      }
    `,
    variables: {
      input,
      unique_type,
    },
  }, opt);
  const id: WxappConfigId = data.createWxappConfig;
  return id;
}

/**
 * 根据 id 修改小程序配置
 * @param {WxappConfigId} id
 * @param {WxappConfigInput} input
 * @param {GqlOpt} opt?
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
 * @param {WxappConfigId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: WxappConfigId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdWxappConfig?: WxappConfigModel;
  } = await query({
    query: /* GraphQL */ `
      query($id: WxappConfigId!) {
        findByIdWxappConfig(id: $id) {
          id
          img
          lbl
          val
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          rem
          create_usr_id
          create_usr_id_lbl
          create_time
          create_time_lbl
          update_usr_id
          update_usr_id_lbl
          update_time
          update_time_lbl
          is_deleted
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
 * @param {WxappConfigId[]} ids
 * @param {GqlOpt} opt?
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
 * @param {WxappConfigId[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
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
 * @param {WxappConfigId[]} ids
 * @param {0 | 1} is_locked
 * @param {GqlOpt} opt?
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
 * @param {WxappConfigId[]} ids
 * @param {GqlOpt} opt?
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
 * @param {WxappConfigId[]} ids
 * @param {GqlOpt} opt?
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
      const sheetName = await nsAsync("小程序配置");
      const buffer = await workerFn(
        `${ location.origin }/import_template/wshop/wxapp_config.xlsx`,
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
    search?: WxappConfigSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: /* GraphQL */ `
          query($search: WxappConfigSearch, $sort: [SortInput!]) {
            findAllWxappConfig(search: $search, sort: $sort) {
              id
              img
              lbl
              val
              is_locked
              is_locked_lbl
              is_enabled
              is_enabled_lbl
              rem
              create_usr_id
              create_usr_id_lbl
              create_time
              create_time_lbl
              update_usr_id
              update_usr_id_lbl
              update_time
              update_time_lbl
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
        const sheetName = await nsAsync("小程序配置");
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
 * @param {WxappConfigInput[]} models
 */
export async function importModels(
  models: WxappConfigInput[],
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
  const defaultInput: WxappConfigInput = {
    is_locked: 0,
    is_enabled: 1,
  };
  return defaultInput;
}