
import {
  UniqueType,
} from "#/types";

import {
  OrderStatus,
  OrderType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  orderQueryField,
} from "./Model";

async function setLblById(
  model?: OrderModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
  
  // 订单金额
  if (!isExcelExport) {
    model.price_lbl = new Intl.NumberFormat(getLocale(), {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(new Decimal(model.price ?? 0).toNumber());
    model.price = new Decimal(model.price ?? 0);
    model.price.toString = () => model.price_lbl;
  } else {
    model.price_lbl = new Decimal(model.price ?? 0).toFixed(2);
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
  
  // 消费后充值余额
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
  model?: OrderInput,
) {
  const input: OrderInput = {
    // ID
    id: model?.id,
    // 订单号
    lbl: model?.lbl,
    // 公司
    company: model?.company,
    // 联系电话
    phone: model?.phone,
    // 订单状态
    status: model?.status,
    status_lbl: model?.status_lbl,
    // 用户
    usr_id: model?.usr_id,
    usr_id_lbl: model?.usr_id_lbl,
    // 会员卡
    card_id: model?.card_id,
    card_id_lbl: model?.card_id_lbl,
    // 订单金额
    price: model?.price,
    // 订单类别
    type: model?.type,
    type_lbl: model?.type_lbl,
    // 消费充值金额
    amt: model?.amt,
    // 消费赠送金额
    give_amt: model?.give_amt,
    // 获得积分
    integral: model?.integral,
    // 消费后充值余额
    balance: model?.balance,
    // 消费后赠送余额
    give_balance: model?.give_balance,
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
 * 根据搜索条件查找订单列表
 */
export async function findAll(
  search?: OrderSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllOrder: OrderModel[];
  } = await query({
    query: `
      query($search: OrderSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllOrder(search: $search, page: $page, sort: $sort) {
          ${ orderQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllOrder;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个订单
 */
export async function findOne(
  search?: OrderSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneOrder?: OrderModel;
  } = await query({
    query: `
      query($search: OrderSearch, $sort: [SortInput!]) {
        findOneOrder(search: $search, sort: $sort) {
          ${ orderQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneOrder;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找订单总数
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
  const count = data.findCountOrder;
  return count;
}

/**
 * 创建订单
 * @param {OrderInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: OrderInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<OrderId> {
  const ids = await creates(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建订单
 */
export async function creates(
  inputs: OrderInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<OrderId[]> {
  inputs = inputs.map(intoInput);
  const data: {
    createsOrder: Mutation["createsOrder"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [OrderInput!]!, $unique_type: UniqueType) {
        createsOrder(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsOrder;
  return ids;
}

/**
 * 根据 id 修改订单
 */
export async function updateById(
  id: OrderId,
  input: OrderInput,
  opt?: GqlOpt,
): Promise<OrderId> {
  input = intoInput(input);
  const data: {
    updateByIdOrder: Mutation["updateByIdOrder"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: OrderId!, $input: OrderInput!) {
        updateByIdOrder(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: OrderId = data.updateByIdOrder;
  return id2;
}

/**
 * 根据 id 查找订单
 */
export async function findById(
  id?: OrderId,
  opt?: GqlOpt,
): Promise<OrderModel | undefined> {
  if (!id) {
    return;
  }
  const data: {
    findByIdOrder?: OrderModel;
  } = await query({
    query: `
      query($id: OrderId!) {
        findByIdOrder(id: $id) {
          ${ orderQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdOrder;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 查找订单
 */
export async function findByIds(
  ids: OrderId[],
  opt?: GqlOpt,
): Promise<OrderModel[]> {
  if (ids.length === 0) {
    return [ ];
  }
  opt = opt || { };
  opt.showErrMsg = false;
  let models: OrderModel[] = [ ];
  try {
    const data: {
      findByIdsOrder: OrderModel[];
    } = await query({
      query: `
        query($ids: [OrderId!]!) {
          findByIdsOrder(ids: $ids) {
            ${ orderQueryField }
          }
        }
      `,
      variables: {
        ids,
      },
    }, opt);
    models = data.findByIdsOrder;
  } catch (_err) { /* empty */ }
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据 ids 删除订单
 */
export async function deleteByIds(
  ids: OrderId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
 */
export async function enableByIds(
  ids: OrderId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
 */
export async function lockByIds(
  ids: OrderId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
 * 根据 ids 还原订单
 */
export async function revertByIds(
  ids: OrderId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
 */
export async function forceDeleteByIds(
  ids: OrderId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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

/**
 * 下载订单导入模板
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
          getFieldCommentsOrder {
            company
            phone
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
    try {
      const sheetName = "订单";
      const buffer = await workerFn(
        `${ location.origin }/import_template/wshop/order.xlsx`,
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
    search?: OrderSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: OrderSearch, $sort: [SortInput!]) {
            findAllOrder(search: $search, page: null, sort: $sort) {
              ${ orderQueryField }
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
      for (const model of data.findAllOrder) {
        await setLblById(model, true);
      }
      try {
        const sheetName = "订单";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/wshop/order.xlsx`,
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
 * 批量导入订单
 */
export async function importModels(
  inputs: OrderInput[],
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

export function getPagePath() {
  return "/wshop/order";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: OrderInput = {
    status: OrderStatus.ToBePaid,
    price: new Decimal(0.00),
    type: OrderType.Pay,
    amt: new Decimal(0.00),
    give_amt: new Decimal(0.00),
    integral: 0,
    balance: new Decimal(0.00),
    give_balance: new Decimal(0.00),
    is_locked: 0,
    is_enabled: 1,
  };
  return defaultInput;
}
