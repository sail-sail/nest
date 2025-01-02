
import {
  UniqueType,
} from "#/types";

import {
  WxoAppEncodingType,
  WxoAppScope,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  wxoAppQueryField,
} from "./Model";

async function setLblById(
  model?: WxoAppModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
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
 * 根据搜索条件查找公众号设置列表
 */
export async function findAll(
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
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个公众号设置
 */
export async function findOne(
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
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找公众号设置总数
 */
export async function findCount(
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
 * 创建公众号设置
 * @param {WxoAppInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: WxoAppInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxoAppId> {
  const ids = await creates(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建公众号设置
 */
export async function creates(
  inputs: WxoAppInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxoAppId[]> {
  inputs = inputs.map(intoInput);
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
 * 根据 id 修改公众号设置
 */
export async function updateById(
  id: WxoAppId,
  input: WxoAppInput,
  opt?: GqlOpt,
): Promise<WxoAppId> {
  input = intoInput(input);
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
 * 根据 id 查找公众号设置
 */
export async function findById(
  id: WxoAppId,
  opt?: GqlOpt,
) {
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
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除公众号设置
 */
export async function deleteByIds(
  ids: WxoAppId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 启用或禁用公众号设置
 */
export async function enableByIds(
  ids: WxoAppId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
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
 * 根据 ids 锁定或解锁公众号设置
 */
export async function lockByIds(
  ids: WxoAppId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
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
 * 根据 ids 还原公众号设置
 */
export async function revertByIds(
  ids: WxoAppId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 彻底删除公众号设置
 */
export async function forceDeleteByIds(
  ids: WxoAppId[],
  opt?: GqlOpt,
) {
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
  const res = data.findAllDomain;
  return res;
}

export async function getDomainList() {
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
 * 下载公众号设置导入模板
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
      const sheetName = await nsAsync("公众号设置");
      const buffer = await workerFn(
        `${ location.origin }/import_template/wx/wxo_app.xlsx`,
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
        await setLblById(model, true);
      }
      try {
        const sheetName = await nsAsync("公众号设置");
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
 * 批量导入公众号设置
 */
export async function importModels(
  inputs: WxoAppInput[],
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

/**
 * 查找 公众号设置 order_by 字段的最大值
 */
export async function findLastOrderBy(
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

export function getPagePath() {
  return "/wx/wxo_app";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: WxoAppInput = {
    encoding_type: WxoAppEncodingType.Plaintext,
    scope: WxoAppScope.SnsapiBase,
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
