import cfg from "@/utils/config";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  cardConsumeQueryField,
} from "./Model";

async function setLblById(
  model?: CardConsumeModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
  
  // 消费充值金额
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
  
  // 消费赠送金额
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
  
  // 消费后余额
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
  
  // 消费后赠送余额
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

export function intoInput(
  model?: CardConsumeInput,
) {
  const input: CardConsumeInput = {
    // ID
    id: model?.id,
    // 卡号
    card_id: model?.card_id,
    card_id_lbl: model?.card_id_lbl,
    // 用户
    usr_id: model?.usr_id,
    usr_id_lbl: model?.usr_id_lbl,
    // 消费充值金额
    amt: model?.amt,
    // 消费赠送金额
    give_amt: model?.give_amt,
    // 获得积分
    integral: model?.integral,
    // 消费后余额
    balance: model?.balance,
    // 消费后赠送余额
    give_balance: model?.give_balance,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找会员卡消费记录列表
 */
export async function findAll(
  search?: CardConsumeSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllCardConsume: CardConsumeModel[];
  } = await query({
    query: `
      query($search: CardConsumeSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllCardConsume(search: $search, page: $page, sort: $sort) {
          ${ cardConsumeQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllCardConsume;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个会员卡消费记录
 */
export async function findOne(
  search?: CardConsumeSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneCardConsume?: CardConsumeModel;
  } = await query({
    query: `
      query($search: CardConsumeSearch, $sort: [SortInput!]) {
        findOneCardConsume(search: $search, sort: $sort) {
          ${ cardConsumeQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneCardConsume;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找会员卡消费记录总数
 */
export async function findCount(
  search?: CardConsumeSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountCardConsume: Query["findCountCardConsume"];
  } = await query({
    query: /* GraphQL */ `
      query($search: CardConsumeSearch) {
        findCountCardConsume(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountCardConsume;
  return count;
}

/**
 * 根据 id 查找会员卡消费记录
 */
export async function findById(
  id: CardConsumeId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdCardConsume?: CardConsumeModel;
  } = await query({
    query: `
      query($id: CardConsumeId!) {
        findByIdCardConsume(id: $id) {
          ${ cardConsumeQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdCardConsume;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除会员卡消费记录
 */
export async function deleteByIds(
  ids: CardConsumeId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsCardConsume: Mutation["deleteByIdsCardConsume"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CardConsumeId!]!) {
        deleteByIdsCardConsume(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsCardConsume;
  return res;
}

/**
 * 根据 ids 还原会员卡消费记录
 */
export async function revertByIds(
  ids: CardConsumeId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsCardConsume: Mutation["revertByIdsCardConsume"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CardConsumeId!]!) {
        revertByIdsCardConsume(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsCardConsume;
  return res;
}

/**
 * 根据 ids 彻底删除会员卡消费记录
 */
export async function forceDeleteByIds(
  ids: CardConsumeId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsCardConsume: Mutation["forceDeleteByIdsCardConsume"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CardConsumeId!]!) {
        forceDeleteByIdsCardConsume(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsCardConsume;
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
 * 下载会员卡消费记录导入模板
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
          getFieldCommentsCardConsume {
            card_id_lbl
            usr_id_lbl
            amt
            give_amt
            integral
            balance
            give_balance
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
      const sheetName = await nsAsync("会员卡消费记录");
      const buffer = await workerFn(
        `${ location.origin }/import_template/wshop/card_consume.xlsx`,
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
    search?: CardConsumeSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: CardConsumeSearch, $sort: [SortInput!]) {
            findAllCardConsume(search: $search, page: null, sort: $sort) {
              ${ cardConsumeQueryField }
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
      for (const model of data.findAllCardConsume) {
        await setLblById(model, true);
      }
      try {
        const sheetName = await nsAsync("会员卡消费记录");
        const buffer = await workerFn(
          `${ location.origin }/excel_template/wshop/card_consume.xlsx`,
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

export function getPagePath() {
  return "/wshop/card_consume";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: CardConsumeInput = {
    amt: new Decimal(0.00),
    give_amt: new Decimal(0.00),
    integral: 0,
    balance: new Decimal(0.00),
    give_balance: new Decimal(0.00),
  };
  return defaultInput;
}
