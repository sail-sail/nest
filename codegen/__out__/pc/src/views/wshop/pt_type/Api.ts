import {
  UniqueType,
} from "#/types";

import type {
  PtTypeId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
  PtTypeSearch,
  PtTypeInput,
  PtTypeModel,
} from "#/types";

async function setLblById(
  model?: PtTypeModel | null,
) {
  if (!model) {
    return;
  }
}

/**
 * 根据搜索条件查找产品类别列表
 * @param {PtTypeSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
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
          img
          lbl
          is_home
          is_home_lbl
          is_recommend
          is_recommend_lbl
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          order_by
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
  const models = data.findAllPtType;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个产品类别
 * @param {PtTypeSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: PtTypeSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOnePtType: Query["findOnePtType"];
  } = await query({
    query: /* GraphQL */ `
      query($search: PtTypeSearch, $sort: [SortInput!]) {
        findOnePtType(search: $search, sort: $sort) {
          id
          img
          lbl
          is_home
          is_home_lbl
          is_recommend
          is_recommend_lbl
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          order_by
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
  const model = data.findOnePtType;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找产品类别总数
 * @param {PtTypeSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: PtTypeSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountPtType: Query["findCountPtType"];
  } = await query({
    query: /* GraphQL */ `
      query($search: PtTypeSearch) {
        findCountPtType(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountPtType;
  return count;
}

/**
 * 创建产品类别
 * @param {PtTypeInput} model
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: PtTypeInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<PtTypeId> {
  const data: {
    createPtType: Mutation["createPtType"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: PtTypeInput!, $unique_type: UniqueType) {
        createPtType(model: $model, unique_type: $unique_type)
      }
    `,
    variables: {
      model,
      unique_type,
    },
  }, opt);
  const id: PtTypeId = data.createPtType;
  return id;
}

/**
 * 根据 id 修改产品类别
 * @param {PtTypeId} id
 * @param {PtTypeInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: PtTypeId,
  model: PtTypeInput,
  opt?: GqlOpt,
): Promise<PtTypeId> {
  const data: {
    updateByIdPtType: Mutation["updateByIdPtType"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: PtTypeId!, $model: PtTypeInput!) {
        updateByIdPtType(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const id2: PtTypeId = data.updateByIdPtType;
  return id2;
}

/**
 * 根据 id 查找产品类别
 * @param {PtTypeId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: PtTypeId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdPtType: Query["findByIdPtType"];
  } = await query({
    query: /* GraphQL */ `
      query($id: PtTypeId!) {
        findByIdPtType(id: $id) {
          id
          img
          lbl
          is_home
          is_home_lbl
          is_recommend
          is_recommend_lbl
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          order_by
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
  const model = data.findByIdPtType;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除产品类别
 * @param {PtTypeId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: PtTypeId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsPtType: Mutation["deleteByIdsPtType"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [PtTypeId!]!) {
        deleteByIdsPtType(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsPtType;
  return res;
}

/**
 * 根据 ids 启用或禁用产品类别
 * @param {PtTypeId[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
 */
export async function enableByIds(
  ids: PtTypeId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    enableByIdsPtType: Mutation["enableByIdsPtType"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [PtTypeId!]!, $is_enabled: Int!) {
        enableByIdsPtType(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsPtType;
  return res;
}

/**
 * 根据 ids 锁定或解锁产品类别
 * @param {PtTypeId[]} ids
 * @param {0 | 1} is_locked
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: PtTypeId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    lockByIdsPtType: Mutation["lockByIdsPtType"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [PtTypeId!]!, $is_locked: Int!) {
        lockByIdsPtType(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsPtType;
  return res;
}

/**
 * 根据 ids 还原产品类别
 * @param {PtTypeId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: PtTypeId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsPtType: Mutation["revertByIdsPtType"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [PtTypeId!]!) {
        revertByIdsPtType(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsPtType;
  return res;
}

/**
 * 根据 ids 彻底删除产品类别
 * @param {PtTypeId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: PtTypeId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsPtType: Mutation["forceDeleteByIdsPtType"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [PtTypeId!]!) {
        forceDeleteByIdsPtType(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsPtType;
  return res;
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
          getFieldCommentsPtType {
            img
            lbl
            is_home_lbl
            is_recommend_lbl
            order_by
            rem
          }
          getDict(codes: [
            "yes_no",
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
    try {
      const sheetName = await nsAsync("产品类别");
      const buffer = await workerFn(
        `${ location.origin }/import_template/wshop/pt_type.xlsx`,
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
    search?: PtTypeSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: /* GraphQL */ `
          query($search: PtTypeSearch, $sort: [SortInput!]) {
            findAllPtType(search: $search, sort: $sort) {
              id
              img
              lbl
              is_home
              is_home_lbl
              is_recommend
              is_recommend_lbl
              is_locked
              is_locked_lbl
              is_enabled
              is_enabled_lbl
              order_by
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
            getDict(codes: [
              "yes_no",
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
        const sheetName = await nsAsync("产品类别");
        const buffer = await workerFn(
          `${ location.origin }/excel_template/wshop/pt_type.xlsx`,
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
 * @param {PtTypeInput[]} models
 */
export async function importModels(
  models: PtTypeInput[],
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
 * 查找 产品类别 order_by 字段的最大值
 * @param {GqlOpt} opt?
 */
export async function findLastOrderBy(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByPtType: Query["findLastOrderByPtType"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByPtType
      }
    `,
  }, opt);
  const res = data.findLastOrderByPtType;
  return res;
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: PtTypeInput = {
    is_home: 1,
    is_recommend: 0,
    is_locked: 1,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
