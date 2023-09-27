import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
  PayslipSearch,
  PayslipInput,
} from "#/types";

import type {
  UsrSearch,
} from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {PayslipSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: PayslipSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllPayslip: Query["findAllPayslip"];
  } = await query({
    query: /* GraphQL */ `
      query($search: PayslipSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllPayslip(search: $search, page: $page, sort: $sort) {
          id
          pay_month
          pay_month_lbl
          lbl
          job_num
          company
          gross_pay
          social_security
          individual_tax
          self_pay
          net_pay
          is_send
          is_send_lbl
          is_confirm
          is_confirm_lbl
          is_locked
          is_locked_lbl
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
  const res = data.findAllPayslip;
  for (let i = 0; i < res.length; i++) {
    const item = res[i];
  }
  return res;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
 * @param {PayslipSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: PayslipSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountPayslip: Query["findCountPayslip"];
  } = await query({
    query: /* GraphQL */ `
      query($search: PayslipSearch) {
        findCountPayslip(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const res = data.findCountPayslip;
  return res;
}

/**
 * 创建一条数据
 * @export create
 * @param {PayslipInput} model
 * @param {UniqueType} uniqueType?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: PayslipInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
) {
  const data: {
    createPayslip: Mutation["createPayslip"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: PayslipInput!, $unique_type: UniqueType) {
        createPayslip(model: $model, unique_type: $unique_type)
      }
    `,
    variables: {
      model,
      unique_type,
    },
  }, opt);
  const res = data.createPayslip;
  return res;
}

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {string} id
 * @param {PayslipInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: string,
  model: PayslipInput,
  opt?: GqlOpt,
) {
  const data: {
    updateByIdPayslip: Mutation["updateByIdPayslip"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: String!, $model: PayslipInput!) {
        updateByIdPayslip(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const res = data.updateByIdPayslip;
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
    findByIdPayslip: Query["findByIdPayslip"];
  } = await query({
    query: /* GraphQL */ `
      query($id: String!) {
        findByIdPayslip(id: $id) {
          id
          pay_month
          pay_month_lbl
          lbl
          job_num
          company
          gross_pay
          social_security
          individual_tax
          self_pay
          net_pay
          is_send
          is_send_lbl
          is_confirm
          is_confirm_lbl
          is_locked
          is_locked_lbl
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
  const res = data.findByIdPayslip;
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
    deleteByIdsPayslip: Mutation["deleteByIdsPayslip"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
        deleteByIdsPayslip(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsPayslip;
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
    lockByIdsPayslip: Mutation["lockByIdsPayslip"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!, $is_locked: Int!) {
        lockByIdsPayslip(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsPayslip;
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
    revertByIdsPayslip: Mutation["revertByIdsPayslip"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
        revertByIdsPayslip(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsPayslip;
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
    forceDeleteByIdsPayslip: Mutation["forceDeleteByIdsPayslip"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
        forceDeleteByIdsPayslip(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsPayslip;
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
    undefined,
    {
    },
    [
      {
        prop: "update_time",
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
          getFieldCommentsPayslip {
            pay_month_lbl
            lbl
            job_num
            company
            gross_pay
            social_security
            individual_tax
            self_pay
            net_pay
            is_send_lbl
            is_confirm_lbl
            is_locked_lbl
            rem
            create_usr_id_lbl
            create_time_lbl
            update_usr_id_lbl
            update_time_lbl
          }
          findAllUsr {
            id
            lbl
          }
          getDict(codes: [
            "yes_no",
            "yes_no",
            "is_locked",
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
      `${ location.origin }/import_template/hrm/payslip.xlsx`,
      {
        data,
      },
    );
    saveAsExcel(buffer, `${ await nAsync("工资条") }${ await nsAsync("导入模板") }`);
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
    search?: PayslipSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const data = await query({
      query: /* GraphQL */ `
        query($search: PayslipSearch, $sort: [SortInput!]) {
          findAllPayslip(search: $search, sort: $sort) {
            id
            pay_month
            pay_month_lbl
            lbl
            job_num
            company
            gross_pay
            social_security
            individual_tax
            self_pay
            net_pay
            is_send
            is_send_lbl
            is_confirm
            is_confirm_lbl
            is_locked
            is_locked_lbl
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
          getFieldCommentsPayslip {
            pay_month_lbl
            lbl
            job_num
            company
            gross_pay
            social_security
            individual_tax
            self_pay
            net_pay
            is_send_lbl
            is_confirm_lbl
            is_locked_lbl
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
            "yes_no",
            "yes_no",
            "is_locked",
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
        `${ location.origin }/excel_template/hrm/payslip.xlsx`,
        {
          data,
        },
      );
      saveAsExcel(buffer, await nAsync("工资条"));
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
 * @param {PayslipInput[]} models
 * @export importModels
 */
export async function importModels(
  models: PayslipInput[],
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
    
    percentage.value = Math.floor((i + 1) / models.length * 100);
  }
  
  return showUploadMsg(succNum, failNum, failErrMsgs);
}
