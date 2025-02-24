
import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  wxwAppQueryField,
} from "./Model";

// 域名
import {
  findOne as findOneDomain0,
} from "@/views/base/domain/Api.ts";

async function setLblById(
  model?: WxwAppModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
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
 * 根据搜索条件查找企微应用列表
 */
export async function findAll(
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
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个企微应用
 */
export async function findOne(
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
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找企微应用总数
 */
export async function findCount(
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
 * 创建企微应用
 * @param {WxwAppInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: WxwAppInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxwAppId> {
  const ids = await creates(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建企微应用
 */
export async function creates(
  inputs: WxwAppInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxwAppId[]> {
  inputs = inputs.map(intoInput);
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
 * 根据 id 修改企微应用
 */
export async function updateById(
  id: WxwAppId,
  input: WxwAppInput,
  opt?: GqlOpt,
): Promise<WxwAppId> {
  input = intoInput(input);
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
 * 根据 id 查找企微应用
 */
export async function findById(
  id: WxwAppId,
  opt?: GqlOpt,
) {
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
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除企微应用
 */
export async function deleteByIds(
  ids: WxwAppId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 启用或禁用企微应用
 */
export async function enableByIds(
  ids: WxwAppId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
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
 * 根据 ids 锁定或解锁企微应用
 */
export async function lockByIds(
  ids: WxwAppId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
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
 * 根据 ids 还原企微应用
 */
export async function revertByIds(
  ids: WxwAppId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 彻底删除企微应用
 */
export async function forceDeleteByIds(
  ids: WxwAppId[],
  opt?: GqlOpt,
) {
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
 * 下载企微应用导入模板
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
export function useExportExcel() {
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
        await setLblById(model, true);
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
 * 批量导入企微应用
 */
export async function importModels(
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

/**
 * 查找 企微应用 order_by 字段的最大值
 */
export async function findLastOrderBy(
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

export function getPagePath() {
  return "/wxwork/wxw_app";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: WxwAppInput = {
    domain_id: (await findOneDomain0({
      is_enabled: [ 1 ],
      is_default: [ 1 ],
    }))?.id,
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
