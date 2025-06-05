
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  rechargeRuleQueryField,
} from "./Model.ts";

async function setLblById(
  model?: RechargeRuleModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
  
  // 充值金额
  if (!isExcelExport) {
    model.amt_lbl = new Intl.NumberFormat(getLocale(), {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(new Decimal(model.amt ?? 0).toNumber());
    model.amt = new Decimal(model.amt ?? 0);
    model.amt.toString = () => model.amt_lbl;
  } else {
    model.amt_lbl = new Decimal(model.amt ?? 0).toFixed(2);
  }
  
  // 赠送金额
  if (!isExcelExport) {
    model.give_amt_lbl = new Intl.NumberFormat(getLocale(), {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(new Decimal(model.give_amt ?? 0).toNumber());
    model.give_amt = new Decimal(model.give_amt ?? 0);
    model.give_amt.toString = () => model.give_amt_lbl;
  } else {
    model.give_amt_lbl = new Decimal(model.give_amt ?? 0).toFixed(2);
  }
}

export function intoInputRechargeRule(
  model?: RechargeRuleInput,
) {
  const input: RechargeRuleInput = {
    // ID
    id: model?.id,
    // 名称
    lbl: model?.lbl,
    // 充值金额
    amt: model?.amt,
    // 赠送金额
    give_amt: model?.give_amt,
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
 * 根据搜索条件查找 充值赠送规则 列表
 */
export async function findAllRechargeRule(
  search?: RechargeRuleSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllRechargeRule: RechargeRuleModel[];
  } = await query({
    query: `
      query($search: RechargeRuleSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllRechargeRule(search: $search, page: $page, sort: $sort) {
          ${ rechargeRuleQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllRechargeRule;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 充值赠送规则
 */
export async function findOneRechargeRule(
  search?: RechargeRuleSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneRechargeRule?: RechargeRuleModel;
  } = await query({
    query: `
      query($search: RechargeRuleSearch, $sort: [SortInput!]) {
        findOneRechargeRule(search: $search, sort: $sort) {
          ${ rechargeRuleQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneRechargeRule;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据条件查找第一个 充值赠送规则, 如果不存在则抛错
 */
export async function findOneOkRechargeRule(
  search?: RechargeRuleSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkRechargeRule?: RechargeRuleModel;
  } = await query({
    query: `
      query($search: RechargeRuleSearch, $sort: [SortInput!]) {
        findOneOkRechargeRule(search: $search, sort: $sort) {
          ${ rechargeRuleQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkRechargeRule;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据搜索条件查找 充值赠送规则 总数
 */
export async function findCountRechargeRule(
  search?: RechargeRuleSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountRechargeRule: Query["findCountRechargeRule"];
  } = await query({
    query: /* GraphQL */ `
      query($search: RechargeRuleSearch) {
        findCountRechargeRule(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountRechargeRule;
  return count;
}

/**
 * 创建 充值赠送规则
 */
export async function createRechargeRule(
  input: RechargeRuleInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<RechargeRuleId> {
  const ids = await createsRechargeRule(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 充值赠送规则
 */
export async function createsRechargeRule(
  inputs: RechargeRuleInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<RechargeRuleId[]> {
  inputs = inputs.map(intoInputRechargeRule);
  const data: {
    createsRechargeRule: Mutation["createsRechargeRule"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [RechargeRuleInput!]!, $unique_type: UniqueType) {
        createsRechargeRule(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsRechargeRule;
  return ids;
}

/**
 * 根据 id 修改 充值赠送规则
 */
export async function updateByIdRechargeRule(
  id: RechargeRuleId,
  input: RechargeRuleInput,
  opt?: GqlOpt,
): Promise<RechargeRuleId> {
  input = intoInputRechargeRule(input);
  const data: {
    updateByIdRechargeRule: Mutation["updateByIdRechargeRule"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: RechargeRuleId!, $input: RechargeRuleInput!) {
        updateByIdRechargeRule(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: RechargeRuleId = data.updateByIdRechargeRule;
  return id2;
}

/**
 * 根据 id 查找 充值赠送规则
 */
export async function findByIdRechargeRule(
  id: RechargeRuleId,
  opt?: GqlOpt,
): Promise<RechargeRuleModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdRechargeRule?: RechargeRuleModel;
  } = await query({
    query: `
      query($id: RechargeRuleId!) {
        findByIdRechargeRule(id: $id) {
          ${ rechargeRuleQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdRechargeRule;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据 id 查找 充值赠送规则, 如果不存在则抛错
 */
export async function findByIdOkRechargeRule(
  id: RechargeRuleId,
  opt?: GqlOpt,
): Promise<RechargeRuleModel> {
  
  const data: {
    findByIdOkRechargeRule: RechargeRuleModel;
  } = await query({
    query: `
      query($id: RechargeRuleId!) {
        findByIdOkRechargeRule(id: $id) {
          ${ rechargeRuleQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkRechargeRule;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据 ids 查找 充值赠送规则
 */
export async function findByIdsRechargeRule(
  ids: RechargeRuleId[],
  opt?: GqlOpt,
): Promise<RechargeRuleModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsRechargeRule: RechargeRuleModel[];
  } = await query({
    query: `
      query($ids: [RechargeRuleId!]!) {
        findByIdsRechargeRule(ids: $ids) {
          ${ rechargeRuleQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsRechargeRule;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 充值赠送规则, 出现查询不到的 id 则报错
 */
export async function findByIdsOkRechargeRule(
  ids: RechargeRuleId[],
  opt?: GqlOpt,
): Promise<RechargeRuleModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkRechargeRule: RechargeRuleModel[];
  } = await query({
    query: `
      query($ids: [RechargeRuleId!]!) {
        findByIdsOkRechargeRule(ids: $ids) {
          ${ rechargeRuleQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkRechargeRule;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 充值赠送规则
 */
export async function deleteByIdsRechargeRule(
  ids: RechargeRuleId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsRechargeRule: Mutation["deleteByIdsRechargeRule"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [RechargeRuleId!]!) {
        deleteByIdsRechargeRule(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsRechargeRule;
  return res;
}

/**
 * 根据 ids 启用或禁用 充值赠送规则
 */
export async function enableByIdsRechargeRule(
  ids: RechargeRuleId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    enableByIdsRechargeRule: Mutation["enableByIdsRechargeRule"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [RechargeRuleId!]!, $is_enabled: Int!) {
        enableByIdsRechargeRule(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsRechargeRule;
  return res;
}

/**
 * 根据 ids 锁定或解锁 充值赠送规则
 */
export async function lockByIdsRechargeRule(
  ids: RechargeRuleId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    lockByIdsRechargeRule: Mutation["lockByIdsRechargeRule"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [RechargeRuleId!]!, $is_locked: Int!) {
        lockByIdsRechargeRule(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsRechargeRule;
  return res;
}

/**
 * 根据 ids 还原 充值赠送规则
 */
export async function revertByIdsRechargeRule(
  ids: RechargeRuleId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsRechargeRule: Mutation["revertByIdsRechargeRule"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [RechargeRuleId!]!) {
        revertByIdsRechargeRule(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsRechargeRule;
  return res;
}

/**
 * 根据 ids 彻底删除 充值赠送规则
 */
export async function forceDeleteByIdsRechargeRule(
  ids: RechargeRuleId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsRechargeRule: Mutation["forceDeleteByIdsRechargeRule"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [RechargeRuleId!]!) {
        forceDeleteByIdsRechargeRule(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsRechargeRule;
  return res;
}

/**
 * 下载 充值赠送规则 导入模板
 */
export function useDownloadImportTemplateRechargeRule() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsRechargeRule {
            lbl
            amt
            give_amt
            rem
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "充值赠送规则";
      const buffer = await workerFn(
        `${ location.origin }/import_template/wshop/recharge_rule.xlsx`,
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
export function useExportExcelRechargeRule() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: RechargeRuleSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: RechargeRuleSearch, $sort: [SortInput!]) {
            findAllRechargeRule(search: $search, page: null, sort: $sort) {
              ${ rechargeRuleQueryField }
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
      for (const model of data.findAllRechargeRule) {
        await setLblById(model, true);
      }
      try {
        const sheetName = "充值赠送规则";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/wshop/recharge_rule.xlsx`,
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
 * 批量导入 充值赠送规则
 */
export async function importModelsRechargeRule(
  inputs: RechargeRuleInput[],
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
      await createsRechargeRule(
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

export function getPagePathRechargeRule() {
  return "/wshop/recharge_rule";
}

/** 新增时的默认值 */
export async function getDefaultInputRechargeRule() {
  const defaultInput: RechargeRuleInput = {
    amt: new Decimal(0.00),
    give_amt: new Decimal(0.00),
    is_locked: 0,
    is_enabled: 1,
  };
  return defaultInput;
}
