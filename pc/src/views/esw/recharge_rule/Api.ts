import {
  UniqueType,
} from "#/types";


import type {
  RechargeRuleId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
  RechargeRuleSearch,
  RechargeRuleInput,
} from "#/types";

import type {
} from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {RechargeRuleSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: RechargeRuleSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllRechargeRule: Query["findAllRechargeRule"];
  } = await query({
    query: /* GraphQL */ `
      query($search: RechargeRuleSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllRechargeRule(search: $search, page: $page, sort: $sort) {
          id
          lbl
          amt
          give_amt
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
  const res = data.findAllRechargeRule;
  for (let i = 0; i < res.length; i++) {
    const item = res[i];
  }
  return res;
}

/**
 * 根据搜索条件查找第一条记录
 * @export findOne
 * @param {RechargeRuleSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: RechargeRuleSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneRechargeRule: Query["findOneRechargeRule"];
  } = await query({
    query: /* GraphQL */ `
      query($search: RechargeRuleSearch, $sort: [SortInput!]) {
        findOneRechargeRule(search: $search, sort: $sort) {
          id
          lbl
          amt
          give_amt
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
  const model = data.findOneRechargeRule;
  if (model) {
  }
  return model;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
 * @param {RechargeRuleSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
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
  const res = data.findCountRechargeRule;
  return res;
}

/**
 * 创建一条数据
 * @export create
 * @param {RechargeRuleInput} model
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: RechargeRuleInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<RechargeRuleId> {
  const data: {
    createRechargeRule: Mutation["createRechargeRule"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: RechargeRuleInput!, $unique_type: UniqueType) {
        createRechargeRule(model: $model, unique_type: $unique_type)
      }
    `,
    variables: {
      model,
      unique_type,
    },
  }, opt);
  const id: RechargeRuleId = data.createRechargeRule;
  return id;
}

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {RechargeRuleId} id
 * @param {RechargeRuleInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: RechargeRuleId,
  model: RechargeRuleInput,
  opt?: GqlOpt,
): Promise<RechargeRuleId> {
  const data: {
    updateByIdRechargeRule: Mutation["updateByIdRechargeRule"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: RechargeRuleId!, $model: RechargeRuleInput!) {
        updateByIdRechargeRule(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const id2: RechargeRuleId = data.updateByIdRechargeRule;
  return id2;
}

/**
 * 通过ID查找一条数据
 * @export findById
 * @param {RechargeRuleId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: RechargeRuleId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdRechargeRule: Query["findByIdRechargeRule"];
  } = await query({
    query: /* GraphQL */ `
      query($id: RechargeRuleId!) {
        findByIdRechargeRule(id: $id) {
          id
          lbl
          amt
          give_amt
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
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const res = data.findByIdRechargeRule;
  return res;
}

/**
 * 根据 ids 删除数据
 * @export deleteByIds
 * @param {RechargeRuleId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: RechargeRuleId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 启用或禁用数据
 * @export enableByIds
 * @param {RechargeRuleId[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
 */
export async function enableByIds(
  ids: RechargeRuleId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
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
 * 根据 ids 锁定或解锁数据
 * @export lockByIds
 * @param {RechargeRuleId[]} ids
 * @param {0 | 1} is_locked
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: RechargeRuleId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
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
 * 根据 ids 从回收站还原数据
 * @export revertByIds
 * @param {RechargeRuleId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: RechargeRuleId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 彻底删除数据
 * @export forceDeleteByIds
 * @param {RechargeRuleId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: RechargeRuleId[],
  opt?: GqlOpt,
) {
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
 * 下载导入模板
 */
export function useDownloadImportTemplate(routePath: string) {
  const {
    nAsync,
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
    const buffer = await workerFn(
      `${ location.origin }/import_template/esw/recharge_rule.xlsx`,
      {
        data,
      },
    );
    saveAsExcel(buffer, `${ await nAsync("充值赠送规则") }${ await nsAsync("导入") }`);
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
    nAsync,
    nsAsync,
  } = useI18n(routePath);
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2(
    search?: RechargeRuleSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const data = await query({
      query: /* GraphQL */ `
        query($search: RechargeRuleSearch, $sort: [SortInput!]) {
          findAllRechargeRule(search: $search, sort: $sort) {
            id
            lbl
            amt
            give_amt
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
          getFieldCommentsRechargeRule {
            lbl
            amt
            give_amt
            is_locked_lbl
            is_enabled_lbl
            rem
            create_usr_id_lbl
            create_time_lbl
            update_usr_id_lbl
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
    try {
      const buffer = await workerFn(
        `${ location.origin }/excel_template/esw/recharge_rule.xlsx`,
        {
          data,
        },
      );
      saveAsExcel(buffer, await nAsync("充值赠送规则"));
    } catch (err) {
      ElMessage.error(await nsAsync("导出失败"));
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
 * 批量导入
 * @param {RechargeRuleInput[]} models
 * @export importModels
 */
export async function importModels(
  models: RechargeRuleInput[],
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
