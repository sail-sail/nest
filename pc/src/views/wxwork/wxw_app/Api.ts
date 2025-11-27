
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  wxwAppQueryField,
} from "./Model.ts";

export async function setLblByIdWxwApp(
  model?: WxwAppModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputWxwApp(
  model?: WxwAppInput,
) {
  const input: WxwAppInput = {
    // ID
    id: model?.id,
    // 名称
    lbl: model?.lbl,
    // 企业ID
    corpid: model?.corpid,
    // 应用ID
    agentid: model?.agentid,
    // 可信域名
    domain_id: model?.domain_id,
    domain_id_lbl: model?.domain_id_lbl,
    // 应用密钥
    corpsecret: model?.corpsecret,
    // 通讯录密钥
    contactsecret: model?.contactsecret,
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
 * 根据搜索条件查找 企微应用 列表
 */
export async function findAllWxwApp(
  search?: WxwAppSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllWxwApp: WxwAppModel[];
  } = await query({
    query: `
      query($search: WxwAppSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllWxwApp(search: $search, page: $page, sort: $sort) {
          ${ wxwAppQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllWxwApp;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxwApp(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 企微应用
 */
export async function findOneWxwApp(
  search?: WxwAppSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneWxwApp?: WxwAppModel;
  } = await query({
    query: `
      query($search: WxwAppSearch, $sort: [SortInput!]) {
        findOneWxwApp(search: $search, sort: $sort) {
          ${ wxwAppQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneWxwApp;
  
  await setLblByIdWxwApp(model);
  
  return model;
}

/**
 * 根据条件查找第一个 企微应用, 如果不存在则抛错
 */
export async function findOneOkWxwApp(
  search?: WxwAppSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkWxwApp?: WxwAppModel;
  } = await query({
    query: `
      query($search: WxwAppSearch, $sort: [SortInput!]) {
        findOneOkWxwApp(search: $search, sort: $sort) {
          ${ wxwAppQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkWxwApp;
  
  await setLblByIdWxwApp(model);
  
  return model;
}

/**
 * 根据搜索条件查找 企微应用 总数
 */
export async function findCountWxwApp(
  search?: WxwAppSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountWxwApp: Query["findCountWxwApp"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxwAppSearch) {
        findCountWxwApp(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountWxwApp;
  return count;
}

/**
 * 创建 企微应用
 */
export async function createWxwApp(
  input: WxwAppInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxwAppId> {
  const ids = await createsWxwApp(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 企微应用
 */
export async function createsWxwApp(
  inputs: WxwAppInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxwAppId[]> {
  inputs = inputs.map(intoInputWxwApp);
  const data: {
    createsWxwApp: Mutation["createsWxwApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [WxwAppInput!]!, $unique_type: UniqueType) {
        createsWxwApp(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsWxwApp;
  return ids;
}

/**
 * 根据 id 修改 企微应用
 */
export async function updateByIdWxwApp(
  id: WxwAppId,
  input: WxwAppInput,
  opt?: GqlOpt,
): Promise<WxwAppId> {
  input = intoInputWxwApp(input);
  const data: {
    updateByIdWxwApp: Mutation["updateByIdWxwApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: WxwAppId!, $input: WxwAppInput!) {
        updateByIdWxwApp(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: WxwAppId = data.updateByIdWxwApp;
  return id2;
}

/**
 * 根据 id 查找 企微应用
 */
export async function findByIdWxwApp(
  id: WxwAppId,
  opt?: GqlOpt,
): Promise<WxwAppModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdWxwApp?: WxwAppModel;
  } = await query({
    query: `
      query($id: WxwAppId!) {
        findByIdWxwApp(id: $id) {
          ${ wxwAppQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdWxwApp;
  
  await setLblByIdWxwApp(model);
  
  return model;
}

/**
 * 根据 id 查找 企微应用, 如果不存在则抛错
 */
export async function findByIdOkWxwApp(
  id: WxwAppId,
  opt?: GqlOpt,
): Promise<WxwAppModel> {
  
  const data: {
    findByIdOkWxwApp: WxwAppModel;
  } = await query({
    query: `
      query($id: WxwAppId!) {
        findByIdOkWxwApp(id: $id) {
          ${ wxwAppQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkWxwApp;
  
  await setLblByIdWxwApp(model);
  
  return model;
}

/**
 * 根据 ids 查找 企微应用
 */
export async function findByIdsWxwApp(
  ids: WxwAppId[],
  opt?: GqlOpt,
): Promise<WxwAppModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsWxwApp: WxwAppModel[];
  } = await query({
    query: `
      query($ids: [WxwAppId!]!) {
        findByIdsWxwApp(ids: $ids) {
          ${ wxwAppQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsWxwApp;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxwApp(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 企微应用, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxwApp(
  ids: WxwAppId[],
  opt?: GqlOpt,
): Promise<WxwAppModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkWxwApp: WxwAppModel[];
  } = await query({
    query: `
      query($ids: [WxwAppId!]!) {
        findByIdsOkWxwApp(ids: $ids) {
          ${ wxwAppQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkWxwApp;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxwApp(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 企微应用
 */
export async function deleteByIdsWxwApp(
  ids: WxwAppId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsWxwApp: Mutation["deleteByIdsWxwApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxwAppId!]!) {
        deleteByIdsWxwApp(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsWxwApp;
  return res;
}

/**
 * 根据 ids 启用或禁用 企微应用
 */
export async function enableByIdsWxwApp(
  ids: WxwAppId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    enableByIdsWxwApp: Mutation["enableByIdsWxwApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxwAppId!]!, $is_enabled: Int!) {
        enableByIdsWxwApp(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsWxwApp;
  return res;
}

/**
 * 根据 ids 锁定或解锁 企微应用
 */
export async function lockByIdsWxwApp(
  ids: WxwAppId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    lockByIdsWxwApp: Mutation["lockByIdsWxwApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxwAppId!]!, $is_locked: Int!) {
        lockByIdsWxwApp(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsWxwApp;
  return res;
}

/**
 * 根据 ids 还原 企微应用
 */
export async function revertByIdsWxwApp(
  ids: WxwAppId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsWxwApp: Mutation["revertByIdsWxwApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxwAppId!]!) {
        revertByIdsWxwApp(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsWxwApp;
  return res;
}

/**
 * 根据 ids 彻底删除 企微应用
 */
export async function forceDeleteByIdsWxwApp(
  ids: WxwAppId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsWxwApp: Mutation["forceDeleteByIdsWxwApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxwAppId!]!) {
        forceDeleteByIdsWxwApp(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsWxwApp;
  return res;
}

export async function findAllDomain(
  search?: DomainSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDomain: DomainModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: DomainSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDomain(search: $search, page: $page, sort: $sort) {
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
  const domain_models = data.findAllDomain;
  return domain_models;
}

export async function getListDomain() {
  const data = await findAllDomain(
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
 * 下载 企微应用 导入模板
 */
export function useDownloadImportTemplateWxwApp() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsWxwApp {
            lbl
            corpid
            agentid
            domain_id_lbl
            corpsecret
            contactsecret
            order_by
            rem
          }
          findAllDomain {
            id
            lbl
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "企微应用";
      const buffer = await workerFn(
        `${ location.origin }/import_template/wxwork/wxw_app.xlsx`,
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
export function useExportExcelWxwApp() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: WxwAppSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: WxwAppSearch, $sort: [SortInput!]) {
            findAllWxwApp(search: $search, page: null, sort: $sort) {
              ${ wxwAppQueryField }
            }
            findAllDomain {
              lbl
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
      for (const model of data.findAllWxwApp) {
        await setLblByIdWxwApp(model, true);
      }
      try {
        const sheetName = "企微应用";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/wxwork/wxw_app.xlsx`,
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
 * 批量导入 企微应用
 */
export async function importModelsWxwApp(
  inputs: WxwAppInput[],
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
      await createsWxwApp(
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
 * 查找 企微应用 order_by 字段的最大值
 */
export async function findLastOrderByWxwApp(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByWxwApp: Query["findLastOrderByWxwApp"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByWxwApp
      }
    `,
  }, opt);
  const res = data.findLastOrderByWxwApp;
  return res;
}

/**
 * 获取 企微应用 字段注释
 */
export async function getFieldCommentsWxwApp(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsWxwApp: Query["getFieldCommentsWxwApp"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsWxwApp {
          id,
          lbl,
          corpid,
          agentid,
          domain_id,
          domain_id_lbl,
          corpsecret,
          contactsecret,
          is_locked,
          is_locked_lbl,
          is_enabled,
          is_enabled_lbl,
          order_by,
          rem,
        }
      }
    `,
    variables: {
    },
  }, opt);
  
  const field_comments = data.getFieldCommentsWxwApp as WxwAppFieldComment;
  
  return field_comments;
}

export function getPagePathWxwApp() {
  return "/wxwork/wxw_app";
}

/** 新增时的默认值 */
export async function getDefaultInputWxwApp() {
  const defaultInput: WxwAppInput = {
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
