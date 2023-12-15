import {
  UniqueType,
} from "#/types";

import type {
  PtId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
  PtSearch,
  PtInput,
} from "#/types";

import type {
  PtTypeSearch,
} from "#/types";

/**
 * 根据搜索条件查找产品列表
 * @param {PtSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: PtSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllPt: Query["findAllPt"];
  } = await query({
    query: /* GraphQL */ `
      query($search: PtSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllPt(search: $search, page: $page, sort: $sort) {
          id
          img
          lbl
          pt_type_ids
          pt_type_ids_lbl
          price
          original_price
          unit
          is_new
          is_new_lbl
          introduct
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          order_by
          detail
          detail_top_img
          detail_bottom_img
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
  const res = data.findAllPt;
  for (let i = 0; i < res.length; i++) {
    const item = res[i];
  }
  return res;
}

/**
 * 根据搜索条件查找第一个产品
 * @param {PtSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: PtSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOnePt: Query["findOnePt"];
  } = await query({
    query: /* GraphQL */ `
      query($search: PtSearch, $sort: [SortInput!]) {
        findOnePt(search: $search, sort: $sort) {
          id
          img
          lbl
          pt_type_ids
          pt_type_ids_lbl
          price
          original_price
          unit
          is_new
          is_new_lbl
          introduct
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          order_by
          detail
          detail_top_img
          detail_bottom_img
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
  const model = data.findOnePt;
  if (model) {
  }
  return model;
}

/**
 * 根据搜索条件查找产品总数
 * @param {PtSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: PtSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountPt: Query["findCountPt"];
  } = await query({
    query: /* GraphQL */ `
      query($search: PtSearch) {
        findCountPt(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const res = data.findCountPt;
  return res;
}

/**
 * 创建一条产品
 * @param {PtInput} model
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: PtInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<PtId> {
  const data: {
    createPt: Mutation["createPt"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: PtInput!, $unique_type: UniqueType) {
        createPt(model: $model, unique_type: $unique_type)
      }
    `,
    variables: {
      model,
      unique_type,
    },
  }, opt);
  const id: PtId = data.createPt;
  return id;
}

/**
 * 根据id修改一条产品
 * @param {PtId} id
 * @param {PtInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: PtId,
  model: PtInput,
  opt?: GqlOpt,
): Promise<PtId> {
  const data: {
    updateByIdPt: Mutation["updateByIdPt"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: PtId!, $model: PtInput!) {
        updateByIdPt(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const id2: PtId = data.updateByIdPt;
  return id2;
}

/**
 * 通过ID查找一条产品
 * @param {PtId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: PtId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdPt: Query["findByIdPt"];
  } = await query({
    query: /* GraphQL */ `
      query($id: PtId!) {
        findByIdPt(id: $id) {
          id
          img
          lbl
          pt_type_ids
          pt_type_ids_lbl
          price
          original_price
          unit
          is_new
          is_new_lbl
          introduct
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          order_by
          detail
          detail_top_img
          detail_bottom_img
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
  const res = data.findByIdPt;
  return res;
}

/**
 * 根据 ids 删除产品
 * @param {PtId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: PtId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsPt: Mutation["deleteByIdsPt"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [PtId!]!) {
        deleteByIdsPt(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsPt;
  return res;
}

/**
 * 根据 ids 启用或禁用产品
 * @param {PtId[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
 */
export async function enableByIds(
  ids: PtId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    enableByIdsPt: Mutation["enableByIdsPt"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [PtId!]!, $is_enabled: Int!) {
        enableByIdsPt(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsPt;
  return res;
}

/**
 * 根据 ids 锁定或解锁产品
 * @param {PtId[]} ids
 * @param {0 | 1} is_locked
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: PtId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    lockByIdsPt: Mutation["lockByIdsPt"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [PtId!]!, $is_locked: Int!) {
        lockByIdsPt(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsPt;
  return res;
}

/**
 * 根据 ids 从回收站还原产品
 * @param {PtId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: PtId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsPt: Mutation["revertByIdsPt"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [PtId!]!) {
        revertByIdsPt(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsPt;
  return res;
}

/**
 * 根据 ids 彻底删除产品
 * @param {PtId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: PtId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsPt: Mutation["forceDeleteByIdsPt"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [PtId!]!) {
        forceDeleteByIdsPt(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsPt;
  return res;
}

export async function findAllPtType(
  search?: PtTypeSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllPtType: Query["findAllPtType"];
  } = await query({
    query: /* GraphQL */ `
      query($search: PtTypeSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllPtType(search: $search, page: $page, sort: $sort) {
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
  const res = data.findAllPtType;
  return res;
}

export async function getPtTypeList() {
  const data = await findAllPtType(
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
          getFieldCommentsPt {
            img
            lbl
            pt_type_ids_lbl
            price
            original_price
            unit
            is_new_lbl
            introduct
            order_by
            detail
            detail_top_img
            detail_bottom_img
            rem
          }
          findAllPtType {
            id
            lbl
          }
          getDict(codes: [
            "yes_no",
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
      `${ location.origin }/import_template/esw/pt.xlsx`,
      {
        data,
      },
    );
    saveAsExcel(buffer, `${ await nAsync("产品") }${ await nsAsync("导入") }`);
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
    search?: PtSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const data = await query({
      query: /* GraphQL */ `
        query($search: PtSearch, $sort: [SortInput!]) {
          findAllPt(search: $search, sort: $sort) {
            id
            img
            lbl
            pt_type_ids
            pt_type_ids_lbl
            price
            original_price
            unit
            is_new
            is_new_lbl
            introduct
            is_locked
            is_locked_lbl
            is_enabled
            is_enabled_lbl
            order_by
            detail
            detail_top_img
            detail_bottom_img
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
          getFieldCommentsPt {
            img
            lbl
            pt_type_ids_lbl
            price
            original_price
            unit
            is_new_lbl
            introduct
            is_locked_lbl
            is_enabled_lbl
            order_by
            detail
            detail_top_img
            detail_bottom_img
            rem
            create_usr_id_lbl
            create_time_lbl
            update_usr_id_lbl
            update_time_lbl
          }
          findAllPtType {
            lbl
          }
          getDict(codes: [
            "yes_no",
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
        `${ location.origin }/excel_template/esw/pt.xlsx`,
        {
          data,
        },
      );
      saveAsExcel(buffer, await nAsync("产品"));
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
 * @param {PtInput[]} models
 */
export async function importModels(
  models: PtInput[],
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

/**
 * 查找order_by字段的最大值
 * @param {GqlOpt} opt?
 */
export async function findLastOrderBy(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByPt: Query["findLastOrderByPt"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByPt
      }
    `,
  }, opt);
  const res = data.findLastOrderByPt;
  return res;
}
