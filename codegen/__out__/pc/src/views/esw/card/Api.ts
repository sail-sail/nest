import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
  CardSearch,
  CardInput,
} from "#/types";

import type {
  UsrSearch,
  OrgSearch,
} from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
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
    findAllCard: Query["findAllCard"];
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
          is_default
          is_default_lbl
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
  const res = data.findAllCard;
  for (let i = 0; i < res.length; i++) {
    const item = res[i];
  }
  return res;
}

/**
 * 根据搜索条件查找第一条记录
 * @export findOne
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
    findOneCard: Query["findOneCard"];
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
          is_default
          is_default_lbl
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
  if (model) {
  }
  return model;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
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
  const res = data.findCountCard;
  return res;
}

/**
 * 创建一条数据
 * @export create
 * @param {CardInput} model
 * @param {UniqueType} uniqueType?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: CardInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
) {
  const data: {
    createCard: Mutation["createCard"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: CardInput!, $unique_type: UniqueType) {
        createCard(model: $model, unique_type: $unique_type)
      }
    `,
    variables: {
      model,
      unique_type,
    },
  }, opt);
  const res = data.createCard;
  return res;
}

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {string} id
 * @param {CardInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: string,
  model: CardInput,
  opt?: GqlOpt,
) {
  const data: {
    updateByIdCard: Mutation["updateByIdCard"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: String!, $model: CardInput!) {
        updateByIdCard(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const res = data.updateByIdCard;
  return res;
}

/**
 * 通过ID查找一条数据
 * @export findById
 * @param {string} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: string,
  opt?: GqlOpt,
) {
  const data: {
    findByIdCard: Query["findByIdCard"];
  } = await query({
    query: /* GraphQL */ `
      query($id: String!) {
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
          is_default
          is_default_lbl
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
  const res = data.findByIdCard;
  return res;
}

/**
 * 根据 ids 删除数据
 * @export deleteByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: string[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsCard: Mutation["deleteByIdsCard"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
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
 * 根据 id 设置默认记录
 * @export defaultById
 * @param {string} id
 * @param {GqlOpt} opt?
 */
export async function defaultById(
  id: string,
  opt?: GqlOpt,
) {
  const data: {
    defaultByIdCard: Mutation["defaultByIdCard"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: String!) {
        defaultByIdCard(id: $id)
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const res = data.defaultByIdCard;
  return res;
}

/**
 * 根据 ids 启用或禁用数据
 * @export enableByIds
 * @param {string[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
 */
export async function enableByIds(
  ids: string[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    enableByIdsCard: Mutation["enableByIdsCard"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!, $is_enabled: Int!) {
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
 * 根据 ids 锁定或解锁数据
 * @export lockByIds
 * @param {string[]} ids
 * @param {0 | 1} is_locked
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: string[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    lockByIdsCard: Mutation["lockByIdsCard"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!, $is_locked: Int!) {
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
 * 根据 ids 从回收站还原数据
 * @export revertByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: string[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsCard: Mutation["revertByIdsCard"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
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
 * 根据 ids 彻底删除数据
 * @export forceDeleteByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: string[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsCard: Mutation["forceDeleteByIdsCard"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
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
          getFieldCommentsCard {
            usr_id_lbl
            grade_lbl
            name
            mobile
            balance
            give_balance
            integral
            rem
          }
          findAllUsr {
            id
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
    const buffer = await workerFn(
      `${ location.origin }/import_template/esw/card.xlsx`,
      {
        data,
      },
    );
    saveAsExcel(buffer, `${ await nAsync("会员卡") }${ await nsAsync("导入") }`);
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
    search?: CardSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
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
            is_default
            is_default_lbl
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
          getFieldCommentsCard {
            lbl
            usr_id_lbl
            grade_lbl
            name
            mobile
            balance
            give_balance
            integral
            growth_amt
            is_default_lbl
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
    try {
      const buffer = await workerFn(
        `${ location.origin }/excel_template/esw/card.xlsx`,
        {
          data,
        },
      );
      saveAsExcel(buffer, await nAsync("会员卡"));
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
 * @param {CardInput[]} models
 * @export importModels
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
