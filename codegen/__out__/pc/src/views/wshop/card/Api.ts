import {
  UniqueType,
} from "#/types";

import type {
  CardId,
} from "@/typings/ids";

import {
  CardGrade,
} from "#/types";

import Decimal from "decimal.js-light";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import type {
  CardSearch,
  CardInput,
  CardModel,
} from "./Model";

// 用户
import type {
  UsrSearch,
  UsrModel,
} from "@/views/base/usr/Model";

async function setLblById(
  model?: CardModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
  
  // 充值余额
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
  
  // 赠送余额
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
  
  // 累计消费
  if (!isExcelExport) {
    model.growth_amt_lbl = new Intl.NumberFormat(getLocale(), {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(new Decimal(model.growth_amt ?? 0).toNumber());
    model.growth_amt = new Decimal(model.growth_amt ?? 0);
    model.growth_amt.toString = () => model.growth_amt_lbl;
  } else {
    model.growth_amt_lbl = new Decimal(model.growth_amt ?? 0).toFixed(2);
  }
}

export function intoInput(
  model?: Record<string, any>,
) {
  const input: CardInput = {
    // ID
    id: model?.id,
    // 卡号
    lbl: model?.lbl,
    // 绑定用户
    usr_id: model?.usr_id,
    usr_id_lbl: model?.usr_id_lbl,
    // 会员等级
    grade: model?.grade,
    grade_lbl: model?.grade_lbl,
    // 姓名
    name: model?.name,
    // 电话
    mobile: model?.mobile,
    // 充值余额
    balance: model?.balance,
    // 赠送余额
    give_balance: model?.give_balance,
    // 积分
    integral: model?.integral,
    // 累计消费
    growth_amt: model?.growth_amt,
    // 默认
    is_default_card: model?.is_default_card,
    is_default_card_lbl: model?.is_default_card_lbl,
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
 * 根据搜索条件查找会员卡列表
 * @param {CardSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
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
          usr_id
          usr_id_lbl
          grade
          grade_lbl
          name
          mobile
          balance
          give_balance
          integral
          growth_amt
          is_default_card
          is_default_card_lbl
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
  const models = data.findAllCard;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个会员卡
 * @param {CardSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: CardSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneCard?: CardModel;
  } = await query({
    query: /* GraphQL */ `
      query($search: CardSearch, $sort: [SortInput!]) {
        findOneCard(search: $search, sort: $sort) {
          id
          lbl
          usr_id
          usr_id_lbl
          grade
          grade_lbl
          name
          mobile
          balance
          give_balance
          integral
          growth_amt
          is_default_card
          is_default_card_lbl
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
  const model = data.findOneCard;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找会员卡总数
 * @param {CardSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: CardSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountCard: Query["findCountCard"];
  } = await query({
    query: /* GraphQL */ `
      query($search: CardSearch) {
        findCountCard(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountCard;
  return count;
}

/**
 * 创建会员卡
 * @param {CardInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: CardInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<CardId> {
  input = intoInput(input);
  const data: {
    createCard: Mutation["createCard"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($input: CardInput!, $unique_type: UniqueType) {
        createCard(input: $input, unique_type: $unique_type)
      }
    `,
    variables: {
      input,
      unique_type,
    },
  }, opt);
  const id: CardId = data.createCard;
  return id;
}

/**
 * 根据 id 修改会员卡
 * @param {CardId} id
 * @param {CardInput} input
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: CardId,
  input: CardInput,
  opt?: GqlOpt,
): Promise<CardId> {
  input = intoInput(input);
  const data: {
    updateByIdCard: Mutation["updateByIdCard"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: CardId!, $input: CardInput!) {
        updateByIdCard(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: CardId = data.updateByIdCard;
  return id2;
}

/**
 * 根据 id 查找会员卡
 * @param {CardId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: CardId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdCard?: CardModel;
  } = await query({
    query: /* GraphQL */ `
      query($id: CardId!) {
        findByIdCard(id: $id) {
          id
          lbl
          usr_id
          usr_id_lbl
          grade
          grade_lbl
          name
          mobile
          balance
          give_balance
          integral
          growth_amt
          is_default_card
          is_default_card_lbl
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
      id,
    },
  }, opt);
  const model = data.findByIdCard;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除会员卡
 * @param {CardId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: CardId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsCard: Mutation["deleteByIdsCard"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CardId!]!) {
        deleteByIdsCard(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsCard;
  return res;
}

/**
 * 根据 ids 启用或禁用会员卡
 * @param {CardId[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
 */
export async function enableByIds(
  ids: CardId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    enableByIdsCard: Mutation["enableByIdsCard"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CardId!]!, $is_enabled: Int!) {
        enableByIdsCard(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsCard;
  return res;
}

/**
 * 根据 ids 锁定或解锁会员卡
 * @param {CardId[]} ids
 * @param {0 | 1} is_locked
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: CardId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    lockByIdsCard: Mutation["lockByIdsCard"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CardId!]!, $is_locked: Int!) {
        lockByIdsCard(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsCard;
  return res;
}

/**
 * 根据 ids 还原会员卡
 * @param {CardId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: CardId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsCard: Mutation["revertByIdsCard"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CardId!]!) {
        revertByIdsCard(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsCard;
  return res;
}

/**
 * 根据 ids 彻底删除会员卡
 * @param {CardId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: CardId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsCard: Mutation["forceDeleteByIdsCard"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CardId!]!) {
        forceDeleteByIdsCard(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsCard;
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
          getFieldCommentsCard {
            usr_id_lbl
            grade_lbl
            name
            mobile
            balance
            give_balance
            integral
            is_default_card_lbl
            rem
          }
          findAllUsr {
            id
            lbl
          }
          getDict(codes: [
            "is_default",
          ]) {
            code
            lbl
          }
          getDictbiz(codes: [
            "card_grade",
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
      const sheetName = await nsAsync("会员卡");
      const buffer = await workerFn(
        `${ location.origin }/import_template/wshop/card.xlsx`,
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
    search?: CardSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: /* GraphQL */ `
          query($search: CardSearch, $sort: [SortInput!]) {
            findAllCard(search: $search, sort: $sort) {
              id
              lbl
              usr_id
              usr_id_lbl
              grade
              grade_lbl
              name
              mobile
              balance
              give_balance
              integral
              growth_amt
              is_default_card
              is_default_card_lbl
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
            findAllUsr {
              lbl
            }
            getDict(codes: [
              "is_default",
              "is_locked",
              "is_enabled",
            ]) {
              code
              lbl
            }
            getDictbiz(codes: [
              "card_grade",
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
      for (const model of data.findAllCard) {
        await setLblById(model, true);
      }
      try {
        const sheetName = await nsAsync("会员卡");
        const buffer = await workerFn(
          `${ location.origin }/excel_template/wshop/card.xlsx`,
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
 * 批量导入
 * @param {CardInput[]} models
 */
export async function importModels(
  models: CardInput[],
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

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: CardInput = {
    grade: CardGrade.Normal,
    balance: new Decimal(0.00),
    give_balance: new Decimal(0.00),
    integral: 0,
    growth_amt: new Decimal(0.00),
    is_default_card: 1,
    is_locked: 1,
    is_enabled: 1,
  };
  return defaultInput;
}
