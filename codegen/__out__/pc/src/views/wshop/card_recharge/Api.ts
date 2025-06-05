

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  cardRechargeQueryField,
} from "./Model.ts";

async function setLblById(
  model?: CardRechargeModel | null,
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
  
  // 充值后充值余额
  if (!isExcelExport) {
    model.balance_lbl = new Intl.NumberFormat(getLocale(), {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(new Decimal(model.balance ?? 0).toNumber());
    model.balance = new Decimal(model.balance ?? 0);
    model.balance.toString = () => model.balance_lbl;
  } else {
    model.balance_lbl = new Decimal(model.balance ?? 0).toFixed(2);
  }
  
  // 充值后赠送余额
  if (!isExcelExport) {
    model.give_balance_lbl = new Intl.NumberFormat(getLocale(), {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(new Decimal(model.give_balance ?? 0).toNumber());
    model.give_balance = new Decimal(model.give_balance ?? 0);
    model.give_balance.toString = () => model.give_balance_lbl;
  } else {
    model.give_balance_lbl = new Decimal(model.give_balance ?? 0).toFixed(2);
  }
}

export function intoInputCardRecharge(
  model?: CardRechargeInput,
) {
  const input: CardRechargeInput = {
    // ID
    id: model?.id,
    // 会员卡
    card_id: model?.card_id,
    card_id_lbl: model?.card_id_lbl,
    // 用户
    usr_id: model?.usr_id,
    usr_id_lbl: model?.usr_id_lbl,
    // 充值金额
    amt: model?.amt,
    // 赠送金额
    give_amt: model?.give_amt,
    // 充值后充值余额
    balance: model?.balance,
    // 充值后赠送余额
    give_balance: model?.give_balance,
    // 充值后积分
    integral: model?.integral,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找 会员卡充值记录 列表
 */
export async function findAllCardRecharge(
  search?: CardRechargeSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllCardRecharge: CardRechargeModel[];
  } = await query({
    query: `
      query($search: CardRechargeSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllCardRecharge(search: $search, page: $page, sort: $sort) {
          ${ cardRechargeQueryField }
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
 * 根据条件查找第一个 会员卡充值记录
 */
export async function findOneCardRecharge(
  search?: CardRechargeSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneCardRecharge?: CardRechargeModel;
  } = await query({
    query: `
      query($search: CardRechargeSearch, $sort: [SortInput!]) {
        findOneCardRecharge(search: $search, sort: $sort) {
          ${ cardRechargeQueryField }
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
 * 根据条件查找第一个 会员卡充值记录, 如果不存在则抛错
 */
export async function findOneOkCardRecharge(
  search?: CardRechargeSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkCardRecharge?: CardRechargeModel;
  } = await query({
    query: `
      query($search: CardRechargeSearch, $sort: [SortInput!]) {
        findOneOkCardRecharge(search: $search, sort: $sort) {
          ${ cardRechargeQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkCardRecharge;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据搜索条件查找 会员卡充值记录 总数
 */
export async function findCountCardRecharge(
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
 * 根据 id 查找 会员卡充值记录
 */
export async function findByIdCardRecharge(
  id: CardRechargeId,
  opt?: GqlOpt,
): Promise<CardRechargeModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdCardRecharge?: CardRechargeModel;
  } = await query({
    query: `
      query($id: CardRechargeId!) {
        findByIdCardRecharge(id: $id) {
          ${ cardRechargeQueryField }
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
 * 根据 id 查找 会员卡充值记录, 如果不存在则抛错
 */
export async function findByIdOkCardRecharge(
  id: CardRechargeId,
  opt?: GqlOpt,
): Promise<CardRechargeModel> {
  
  const data: {
    findByIdOkCardRecharge: CardRechargeModel;
  } = await query({
    query: `
      query($id: CardRechargeId!) {
        findByIdOkCardRecharge(id: $id) {
          ${ cardRechargeQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkCardRecharge;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据 ids 查找 会员卡充值记录
 */
export async function findByIdsCardRecharge(
  ids: CardRechargeId[],
  opt?: GqlOpt,
): Promise<CardRechargeModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsCardRecharge: CardRechargeModel[];
  } = await query({
    query: `
      query($ids: [CardRechargeId!]!) {
        findByIdsCardRecharge(ids: $ids) {
          ${ cardRechargeQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsCardRecharge;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 会员卡充值记录, 出现查询不到的 id 则报错
 */
export async function findByIdsOkCardRecharge(
  ids: CardRechargeId[],
  opt?: GqlOpt,
): Promise<CardRechargeModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkCardRecharge: CardRechargeModel[];
  } = await query({
    query: `
      query($ids: [CardRechargeId!]!) {
        findByIdsOkCardRecharge(ids: $ids) {
          ${ cardRechargeQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkCardRecharge;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 会员卡充值记录
 */
export async function deleteByIdsCardRecharge(
  ids: CardRechargeId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
 * 根据 ids 还原 会员卡充值记录
 */
export async function revertByIdsCardRecharge(
  ids: CardRechargeId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
 * 根据 ids 彻底删除 会员卡充值记录
 */
export async function forceDeleteByIdsCardRecharge(
  ids: CardRechargeId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
    findAllCard: CardModel[];
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
  const card_models = data.findAllCard;
  return card_models;
}

export async function getListCard() {
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
    findAllUsr: UsrModel[];
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
  const usr_models = data.findAllUsr;
  return usr_models;
}

export async function getListUsr() {
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
 * 导出Excel
 */
export function useExportExcelCardRecharge() {
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
        query: `
          query($search: CardRechargeSearch, $sort: [SortInput!]) {
            findAllCardRecharge(search: $search, page: null, sort: $sort) {
              ${ cardRechargeQueryField }
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
      for (const model of data.findAllCardRecharge) {
        await setLblById(model, true);
      }
      try {
        const sheetName = "会员卡充值记录";
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

export function getPagePathCardRecharge() {
  return "/wshop/card_recharge";
}

/** 新增时的默认值 */
export async function getDefaultInputCardRecharge() {
  const defaultInput: CardRechargeInput = {
    amt: new Decimal(0.00),
    give_amt: new Decimal(0.00),
    balance: new Decimal(0.00),
    give_balance: new Decimal(0.00),
    integral: 0,
  };
  return defaultInput;
}
