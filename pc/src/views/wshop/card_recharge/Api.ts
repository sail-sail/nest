import type {
  CardRechargeId,
} from "@/typings/ids";

import Decimal from "decimal.js-light";

import type {
  Query,
  Mutation,
  PageInput,
  CardRechargeSearch,
  CardRechargeInput,
  CardRechargeModel,
} from "#/types";

import type {
  CardSearch,
} from "#/types";

import type {
  UsrSearch,
} from "#/types";

async function setLblById(
  model?: CardRechargeModel | null,
) {
  if (!model) {
    return;
  }
  
  // 充值金额
  if (model.amt != null) {
    model.amt = new Decimal(model.amt);
  }
  
  // 赠送金额
  if (model.give_amt != null) {
    model.give_amt = new Decimal(model.give_amt);
  }
  
  // 充值后充值余额
  if (model.balance != null) {
    model.balance = new Decimal(model.balance);
  }
  
  // 充值后赠送余额
  if (model.give_balance != null) {
    model.give_balance = new Decimal(model.give_balance);
  }
}

/**
 * 根据搜索条件查找会员卡充值记录列表
 * @param {CardRechargeSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: CardRechargeSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllCardRecharge: Query["findAllCardRecharge"];
  } = await query({
    query: /* GraphQL */ `
      query($search: CardRechargeSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllCardRecharge(search: $search, page: $page, sort: $sort) {
          id
          card_id
          card_id_lbl
          usr_id
          usr_id_lbl
          amt
          give_amt
          balance
          give_balance
          integral
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
  const models = data.findAllCardRecharge;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个会员卡充值记录
 * @param {CardRechargeSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: CardRechargeSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneCardRecharge: Query["findOneCardRecharge"];
  } = await query({
    query: /* GraphQL */ `
      query($search: CardRechargeSearch, $sort: [SortInput!]) {
        findOneCardRecharge(search: $search, sort: $sort) {
          id
          card_id
          card_id_lbl
          usr_id
          usr_id_lbl
          amt
          give_amt
          balance
          give_balance
          integral
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
  const model = data.findOneCardRecharge;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找会员卡充值记录总数
 * @param {CardRechargeSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: CardRechargeSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountCardRecharge: Query["findCountCardRecharge"];
  } = await query({
    query: /* GraphQL */ `
      query($search: CardRechargeSearch) {
        findCountCardRecharge(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountCardRecharge;
  return count;
}

/**
 * 根据 id 查找会员卡充值记录
 * @param {CardRechargeId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: CardRechargeId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdCardRecharge: Query["findByIdCardRecharge"];
  } = await query({
    query: /* GraphQL */ `
      query($id: CardRechargeId!) {
        findByIdCardRecharge(id: $id) {
          id
          card_id
          card_id_lbl
          usr_id
          usr_id_lbl
          amt
          give_amt
          balance
          give_balance
          integral
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
  const model = data.findByIdCardRecharge;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除会员卡充值记录
 * @param {CardRechargeId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: CardRechargeId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsCardRecharge: Mutation["deleteByIdsCardRecharge"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CardRechargeId!]!) {
        deleteByIdsCardRecharge(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsCardRecharge;
  return res;
}

/**
 * 根据 ids 还原会员卡充值记录
 * @param {CardRechargeId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: CardRechargeId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsCardRecharge: Mutation["revertByIdsCardRecharge"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CardRechargeId!]!) {
        revertByIdsCardRecharge(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsCardRecharge;
  return res;
}

/**
 * 根据 ids 彻底删除会员卡充值记录
 * @param {CardRechargeId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: CardRechargeId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsCardRecharge: Mutation["forceDeleteByIdsCardRecharge"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CardRechargeId!]!) {
        forceDeleteByIdsCardRecharge(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsCardRecharge;
  return res;
}

export async function findAllCard(
  search?: CardSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllCard: Query["findAllCard"];
  } = await query({
    query: /* GraphQL */ `
      query($search: CardSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllCard(search: $search, page: $page, sort: $sort) {
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
  const res = data.findAllCard;
  return res;
}

export async function getCardList() {
  const data = await findAllCard(
    {
      is_enabled: [ 1 ],
    },
    undefined,
    [
      {
        prop: "create_time",
        order: "descending",
      },
    ],
    {
      notLoading: true,
    },
  );
  return data;
}

export async function findAllUsr(
  search?: UsrSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllUsr: Query["findAllUsr"];
  } = await query({
    query: /* GraphQL */ `
      query($search: UsrSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllUsr(search: $search, page: $page, sort: $sort) {
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
  const res = data.findAllUsr;
  return res;
}

export async function getUsrList() {
  const data = await findAllUsr(
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
          getFieldCommentsCardRecharge {
            card_id_lbl
            usr_id_lbl
            amt
            give_amt
            balance
            give_balance
            integral
            rem
          }
          findAllCard {
            id
            lbl
          }
          findAllUsr {
            id
            lbl
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = await nsAsync("会员卡充值记录");
      const buffer = await workerFn(
        `${ location.origin }/import_template/wshop/card_recharge.xlsx`,
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
    search?: CardRechargeSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: /* GraphQL */ `
          query($search: CardRechargeSearch, $sort: [SortInput!]) {
            findAllCardRecharge(search: $search, sort: $sort) {
              id
              card_id
              card_id_lbl
              usr_id
              usr_id_lbl
              amt
              give_amt
              balance
              give_balance
              integral
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
            findAllCard {
              lbl
            }
            findAllUsr {
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
        const sheetName = await nsAsync("会员卡充值记录");
        const buffer = await workerFn(
          `${ location.origin }/excel_template/wshop/card_recharge.xlsx`,
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

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: CardRechargeInput = {
    amt: new Decimal(0.00),
    give_amt: new Decimal(0.00),
    balance: new Decimal(0.00),
    give_balance: new Decimal(0.00),
    integral: 0,
  };
  return defaultInput;
}
