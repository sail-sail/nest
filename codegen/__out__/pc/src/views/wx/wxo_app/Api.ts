
import {
  UniqueType,
} from "#/types.ts";

import {
  WxoAppEncodingType,
  WxoAppScope,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  wxoAppQueryField,
} from "./Model.ts";

export async function setLblByIdWxoApp(
  model?: WxoAppModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputWxoApp(
  model?: WxoAppInput,
) {
  const input: WxoAppInput = {
    // ID
    id: model?.id,
    // 原始ID
    code: model?.code,
    // 名称
    lbl: model?.lbl,
    // 开发者ID
    appid: model?.appid,
    // 开发者密码
    appsecret: model?.appsecret,
    // 令牌
    token: model?.token,
    // 消息加解密密钥
    encoding_aes_key: model?.encoding_aes_key,
    // 消息加解密方式
    encoding_type: model?.encoding_type,
    encoding_type_lbl: model?.encoding_type_lbl,
    // 授权作用域
    scope: model?.scope,
    scope_lbl: model?.scope_lbl,
    // 网页授权域名
    domain_id: model?.domain_id,
    domain_id_lbl: model?.domain_id_lbl,
    // 默认角色
    default_role_codes: model?.default_role_codes,
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
 * 根据搜索条件查找 公众号设置 列表
 */
export async function findAllWxoApp(
  search?: WxoAppSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllWxoApp: WxoAppModel[];
  } = await query({
    query: `
      query($search: WxoAppSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllWxoApp(search: $search, page: $page, sort: $sort) {
          ${ wxoAppQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllWxoApp;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxoApp(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 公众号设置
 */
export async function findOneWxoApp(
  search?: WxoAppSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneWxoApp?: WxoAppModel;
  } = await query({
    query: `
      query($search: WxoAppSearch, $sort: [SortInput!]) {
        findOneWxoApp(search: $search, sort: $sort) {
          ${ wxoAppQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneWxoApp;
  
  await setLblByIdWxoApp(model);
  
  return model;
}

/**
 * 根据条件查找第一个 公众号设置, 如果不存在则抛错
 */
export async function findOneOkWxoApp(
  search?: WxoAppSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkWxoApp?: WxoAppModel;
  } = await query({
    query: `
      query($search: WxoAppSearch, $sort: [SortInput!]) {
        findOneOkWxoApp(search: $search, sort: $sort) {
          ${ wxoAppQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkWxoApp;
  
  await setLblByIdWxoApp(model);
  
  return model;
}

/**
 * 根据搜索条件查找 公众号设置 总数
 */
export async function findCountWxoApp(
  search?: WxoAppSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountWxoApp: Query["findCountWxoApp"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxoAppSearch) {
        findCountWxoApp(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountWxoApp;
  return count;
}

/**
 * 创建 公众号设置
 */
export async function createWxoApp(
  input: WxoAppInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxoAppId> {
  const ids = await createsWxoApp(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 公众号设置
 */
export async function createsWxoApp(
  inputs: WxoAppInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxoAppId[]> {
  inputs = inputs.map(intoInputWxoApp);
  const data: {
    createsWxoApp: Mutation["createsWxoApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [WxoAppInput!]!, $unique_type: UniqueType) {
        createsWxoApp(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsWxoApp;
  return ids;
}

/**
 * 根据 id 修改 公众号设置
 */
export async function updateByIdWxoApp(
  id: WxoAppId,
  input: WxoAppInput,
  opt?: GqlOpt,
): Promise<WxoAppId> {
  input = intoInputWxoApp(input);
  const data: {
    updateByIdWxoApp: Mutation["updateByIdWxoApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: WxoAppId!, $input: WxoAppInput!) {
        updateByIdWxoApp(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: WxoAppId = data.updateByIdWxoApp;
  return id2;
}

/**
 * 根据 id 查找 公众号设置
 */
export async function findByIdWxoApp(
  id: WxoAppId,
  opt?: GqlOpt,
): Promise<WxoAppModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdWxoApp?: WxoAppModel;
  } = await query({
    query: `
      query($id: WxoAppId!) {
        findByIdWxoApp(id: $id) {
          ${ wxoAppQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdWxoApp;
  
  await setLblByIdWxoApp(model);
  
  return model;
}

/**
 * 根据 id 查找 公众号设置, 如果不存在则抛错
 */
export async function findByIdOkWxoApp(
  id: WxoAppId,
  opt?: GqlOpt,
): Promise<WxoAppModel> {
  
  const data: {
    findByIdOkWxoApp: WxoAppModel;
  } = await query({
    query: `
      query($id: WxoAppId!) {
        findByIdOkWxoApp(id: $id) {
          ${ wxoAppQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkWxoApp;
  
  await setLblByIdWxoApp(model);
  
  return model;
}

/**
 * 根据 ids 查找 公众号设置
 */
export async function findByIdsWxoApp(
  ids: WxoAppId[],
  opt?: GqlOpt,
): Promise<WxoAppModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsWxoApp: WxoAppModel[];
  } = await query({
    query: `
      query($ids: [WxoAppId!]!) {
        findByIdsWxoApp(ids: $ids) {
          ${ wxoAppQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsWxoApp;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxoApp(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 公众号设置, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxoApp(
  ids: WxoAppId[],
  opt?: GqlOpt,
): Promise<WxoAppModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkWxoApp: WxoAppModel[];
  } = await query({
    query: `
      query($ids: [WxoAppId!]!) {
        findByIdsOkWxoApp(ids: $ids) {
          ${ wxoAppQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkWxoApp;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxoApp(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 公众号设置
 */
export async function deleteByIdsWxoApp(
  ids: WxoAppId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsWxoApp: Mutation["deleteByIdsWxoApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxoAppId!]!) {
        deleteByIdsWxoApp(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsWxoApp;
  return res;
}

/**
 * 根据 ids 启用或禁用 公众号设置
 */
export async function enableByIdsWxoApp(
  ids: WxoAppId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    enableByIdsWxoApp: Mutation["enableByIdsWxoApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxoAppId!]!, $is_enabled: Int!) {
        enableByIdsWxoApp(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsWxoApp;
  return res;
}

/**
 * 根据 ids 锁定或解锁 公众号设置
 */
export async function lockByIdsWxoApp(
  ids: WxoAppId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    lockByIdsWxoApp: Mutation["lockByIdsWxoApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxoAppId!]!, $is_locked: Int!) {
        lockByIdsWxoApp(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsWxoApp;
  return res;
}

/**
 * 根据 ids 还原 公众号设置
 */
export async function revertByIdsWxoApp(
  ids: WxoAppId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsWxoApp: Mutation["revertByIdsWxoApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxoAppId!]!) {
        revertByIdsWxoApp(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsWxoApp;
  return res;
}

/**
 * 根据 ids 彻底删除 公众号设置
 */
export async function forceDeleteByIdsWxoApp(
  ids: WxoAppId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsWxoApp: Mutation["forceDeleteByIdsWxoApp"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxoAppId!]!) {
        forceDeleteByIdsWxoApp(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsWxoApp;
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
 * 下载 公众号设置 导入模板
 */
export function useDownloadImportTemplateWxoApp() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsWxoApp {
            code
            lbl
            appid
            appsecret
            token
            encoding_aes_key
            encoding_type_lbl
            scope_lbl
            domain_id_lbl
            default_role_codes
            order_by
            rem
          }
          findAllDomain {
            id
            lbl
          }
          getDict(codes: [
            "wxo_app_encoding_type",
            "wxo_app_scope",
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
      const sheetName = "公众号设置";
      const buffer = await workerFn(
        `${ location.origin }/import_template/wx/wxo_app.xlsx`,
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
export function useExportExcelWxoApp() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: WxoAppSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: WxoAppSearch, $sort: [SortInput!]) {
            findAllWxoApp(search: $search, page: null, sort: $sort) {
              ${ wxoAppQueryField }
            }
            findAllDomain {
              lbl
            }
            getDict(codes: [
              "wxo_app_encoding_type",
              "wxo_app_scope",
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
      for (const model of data.findAllWxoApp) {
        await setLblByIdWxoApp(model, true);
      }
      try {
        const sheetName = "公众号设置";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/wx/wxo_app.xlsx`,
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
 * 批量导入 公众号设置
 */
export async function importModelsWxoApp(
  inputs: WxoAppInput[],
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
      await createsWxoApp(
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
 * 查找 公众号设置 order_by 字段的最大值
 */
export async function findLastOrderByWxoApp(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByWxoApp: Query["findLastOrderByWxoApp"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByWxoApp
      }
    `,
  }, opt);
  const res = data.findLastOrderByWxoApp;
  return res;
}

/**
 * 获取 公众号设置 字段注释
 */
export async function getFieldCommentsWxoApp(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsWxoApp: Query["getFieldCommentsWxoApp"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsWxoApp {
          id,
          code,
          lbl,
          appid,
          appsecret,
          token,
          encoding_aes_key,
          encoding_type,
          encoding_type_lbl,
          scope,
          scope_lbl,
          domain_id,
          domain_id_lbl,
          default_role_codes,
          is_locked,
          is_locked_lbl,
          is_enabled,
          is_enabled_lbl,
          order_by,
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
  
  const field_comments = data.getFieldCommentsWxoApp as WxoAppFieldComment;
  
  return field_comments;
}

export function getPagePathWxoApp() {
  return "/wx/wxo_app";
}

/** 新增时的默认值 */
export async function getDefaultInputWxoApp() {
  const defaultInput: WxoAppInput = {
    encoding_type: WxoAppEncodingType.Plaintext,
    scope: WxoAppScope.SnsapiBase,
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
