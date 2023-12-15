import {
  UniqueType,
} from "#/types";

import type {
  OrderId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
  OrderSearch,
  OrderInput,
} from "#/types";

import type {
  UsrSearch,
} from "#/types";

import type {
  CardSearch,
} from "#/types";

/**
 * 根据搜索条件查找订单列表
 * @param {OrderSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: OrderSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllOrder: Query["findAllOrder"];
  } = await query({
    query: /* GraphQL */ `
      query($search: OrderSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllOrder(search: $search, page: $page, sort: $sort) {
          id
          lbl
          status
          status_lbl
          usr_id
          usr_id_lbl
          card_id
          card_id_lbl
          price
          type
          type_lbl
          amt
          give_amt
          balance
          give_balance
          integral
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
  const res = data.findAllOrder;
  for (let i = 0; i < res.length; i++) {
    const item = res[i];
  }
  return res;
}

/**
 * 根据搜索条件查找第一个订单
 * @param {OrderSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: OrderSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneOrder: Query["findOneOrder"];
  } = await query({
    query: /* GraphQL */ `
      query($search: OrderSearch, $sort: [SortInput!]) {
        findOneOrder(search: $search, sort: $sort) {
          id
          lbl
          status
          status_lbl
          usr_id
          usr_id_lbl
          card_id
          card_id_lbl
          price
          type
          type_lbl
          amt
          give_amt
          balance
          give_balance
          integral
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
  const model = data.findOneOrder;
  if (model) {
  }
  return model;
}

/**
 * 根据搜索条件查找订单总数
 * @param {OrderSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: OrderSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountOrder: Query["findCountOrder"];
  } = await query({
    query: /* GraphQL */ `
      query($search: OrderSearch) {
        findCountOrder(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const res = data.findCountOrder;
  return res;
}

/**
 * 创建一条订单
 * @param {OrderInput} model
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: OrderInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<OrderId> {
  const data: {
    createOrder: Mutation["createOrder"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: OrderInput!, $unique_type: UniqueType) {
        createOrder(model: $model, unique_type: $unique_type)
      }
    `,
    variables: {
      model,
      unique_type,
    },
  }, opt);
  const id: OrderId = data.createOrder;
  return id;
}

/**
 * 根据id修改一条订单
 * @param {OrderId} id
 * @param {OrderInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: OrderId,
  model: OrderInput,
  opt?: GqlOpt,
): Promise<OrderId> {
  const data: {
    updateByIdOrder: Mutation["updateByIdOrder"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: OrderId!, $model: OrderInput!) {
        updateByIdOrder(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const id2: OrderId = data.updateByIdOrder;
  return id2;
}

/**
 * 通过ID查找一条订单
 * @param {OrderId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: OrderId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdOrder: Query["findByIdOrder"];
  } = await query({
    query: /* GraphQL */ `
      query($id: OrderId!) {
        findByIdOrder(id: $id) {
          id
          lbl
          status
          status_lbl
          usr_id
          usr_id_lbl
          card_id
          card_id_lbl
          price
          type
          type_lbl
          amt
          give_amt
          balance
          give_balance
          integral
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
  const res = data.findByIdOrder;
  return res;
}

/**
 * 根据 ids 删除订单
 * @param {OrderId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: OrderId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsOrder: Mutation["deleteByIdsOrder"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [OrderId!]!) {
        deleteByIdsOrder(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsOrder;
  return res;
}

/**
 * 根据 ids 启用或禁用订单
 * @param {OrderId[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
 */
export async function enableByIds(
  ids: OrderId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    enableByIdsOrder: Mutation["enableByIdsOrder"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [OrderId!]!, $is_enabled: Int!) {
        enableByIdsOrder(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsOrder;
  return res;
}

/**
 * 根据 ids 锁定或解锁订单
 * @param {OrderId[]} ids
 * @param {0 | 1} is_locked
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: OrderId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    lockByIdsOrder: Mutation["lockByIdsOrder"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [OrderId!]!, $is_locked: Int!) {
        lockByIdsOrder(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsOrder;
  return res;
}

/**
 * 根据 ids 从回收站还原订单
 * @param {OrderId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: OrderId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsOrder: Mutation["revertByIdsOrder"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [OrderId!]!) {
        revertByIdsOrder(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsOrder;
  return res;
}

/**
 * 根据 ids 彻底删除订单
 * @param {OrderId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: OrderId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsOrder: Mutation["forceDeleteByIdsOrder"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [OrderId!]!) {
        forceDeleteByIdsOrder(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsOrder;
  return res;
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
          getFieldCommentsOrder {
            status_lbl
            usr_id_lbl
            card_id_lbl
            price
            type_lbl
            rem
          }
          findAllUsr {
            id
            lbl
          }
          findAllCard {
            id
            lbl
          }
          getDictbiz(codes: [
            "order_status",
            "order_type",
          ]) {
            code
            lbl
          }
        }
      `,
      variables: {
      },
    });
    const buffer = await workerFn(
      `${ location.origin }/import_template/esw/order.xlsx`,
      {
        data,
      },
    );
    saveAsExcel(buffer, `${ await nAsync("订单") }${ await nsAsync("导入") }`);
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
    search?: OrderSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const data = await query({
      query: /* GraphQL */ `
        query($search: OrderSearch, $sort: [SortInput!]) {
          findAllOrder(search: $search, sort: $sort) {
            id
            lbl
            status
            status_lbl
            usr_id
            usr_id_lbl
            card_id
            card_id_lbl
            price
            type
            type_lbl
            amt
            give_amt
            balance
            give_balance
            integral
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
          getFieldCommentsOrder {
            lbl
            status_lbl
            usr_id_lbl
            card_id_lbl
            price
            type_lbl
            amt
            give_amt
            balance
            give_balance
            integral
            is_locked_lbl
            is_enabled_lbl
            rem
            create_usr_id_lbl
            create_time_lbl
            update_usr_id_lbl
            update_time_lbl
          }
          findAllUsr {
            lbl
          }
          findAllCard {
            lbl
          }
          getDict(codes: [
            "is_locked",
            "is_enabled",
          ]) {
            code
            lbl
          }
          getDictbiz(codes: [
            "order_status",
            "order_type",
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
        `${ location.origin }/excel_template/esw/order.xlsx`,
        {
          data,
        },
      );
      saveAsExcel(buffer, await nAsync("订单"));
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
 * @param {OrderInput[]} models
 */
export async function importModels(
  models: OrderInput[],
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
