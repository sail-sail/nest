import type {
  CardConsumeId,
} from "@/typings/ids";

import Decimal from "decimal.js-light";

import type {
  Query,
  Mutation,
  PageInput,
  CardConsumeSearch,
} from "#/types";

import type {
  CardSearch,
} from "#/types";

import type {
  UsrSearch,
} from "#/types";

async function setLblById(
  model?: CardConsumeModel,
) {
  if (!model) {
    return;
  }
  
  // 消费充值金额
  if (model.amt != null) {
    model.amt = new Decimal(model.amt);
  }
  
  // 消费赠送金额
  if (model.give_amt != null) {
    model.give_amt = new Decimal(model.give_amt);
  }
  
  // 消费后余额
  if (model.balance != null) {
    model.balance = new Decimal(model.balance);
  }
  
  // 消费后赠送余额
  if (model.give_balance != null) {
    model.give_balance = new Decimal(model.give_balance);
  }
}

/**
 * 根据搜索条件查找会员卡消费记录列表
 * @param {CardConsumeSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: CardConsumeSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllCardConsume: Query["findAllCardConsume"];
  } = await query({
    query: /* GraphQL */ `
      query($search: CardConsumeSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllCardConsume(search: $search, page: $page, sort: $sort) {
          id
          card_id
          card_id_lbl
          usr_id
          usr_id_lbl
          amt
          give_amt
          integral
          balance
          give_balance
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
  const models = data.findAllCardConsume;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个会员卡消费记录
 * @param {CardConsumeSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: CardConsumeSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneCardConsume: Query["findOneCardConsume"];
  } = await query({
    query: /* GraphQL */ `
      query($search: CardConsumeSearch, $sort: [SortInput!]) {
        findOneCardConsume(search: $search, sort: $sort) {
          id
          card_id
          card_id_lbl
          usr_id
          usr_id_lbl
          amt
          give_amt
          integral
          balance
          give_balance
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
  const model = data.findOneCardConsume;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找会员卡消费记录总数
 * @param {CardConsumeSearch} search?
 * @param {GqlOpt} opt?
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
 * @param {CardConsumeId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: CardConsumeId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdCardConsume: Query["findByIdCardConsume"];
  } = await query({
    query: /* GraphQL */ `
      query($id: CardConsumeId!) {
        findByIdCardConsume(id: $id) {
          id
          card_id
          card_id_lbl
          usr_id
          usr_id_lbl
          amt
          give_amt
          integral
          balance
          give_balance
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
  const model = data.findByIdCardConsume;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除会员卡消费记录
 * @param {CardConsumeId[]} ids
 * @param {GqlOpt} opt?
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
 * @param {CardConsumeId[]} ids
 * @param {GqlOpt} opt?
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
 * @param {CardConsumeId[]} ids
 * @param {GqlOpt} opt?
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
    const buffer = await workerFn(
      `${ location.origin }/import_template/wshop/card_consume.xlsx`,
      {
        data,
      },
    );
    saveAsExcel(buffer, `${ await nAsync("会员卡消费记录") }${ await nsAsync("导入") }`);
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
    search?: CardConsumeSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const data = await query({
      query: /* GraphQL */ `
        query($search: CardConsumeSearch, $sort: [SortInput!]) {
          findAllCardConsume(search: $search, sort: $sort) {
            id
            card_id
            card_id_lbl
            usr_id
            usr_id_lbl
            amt
            give_amt
            integral
            balance
            give_balance
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
          getFieldCommentsCardConsume {
            card_id_lbl
            usr_id_lbl
            amt
            give_amt
            integral
            balance
            give_balance
            rem
            create_usr_id_lbl
            create_time_lbl
            update_usr_id_lbl
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
      const buffer = await workerFn(
        `${ location.origin }/excel_template/wshop/card_consume.xlsx`,
        {
          data,
        },
      );
      saveAsExcel(buffer, await nAsync("会员卡消费记录"));
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
