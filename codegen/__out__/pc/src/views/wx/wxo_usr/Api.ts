import {
  UniqueType,
} from "#/types";

import type {
  WxoUsrId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
  WxoUsrSearch,
  WxoUsrInput,
  WxoUsrModel,
} from "#/types";

import type {
  UsrSearch,
} from "#/types";

async function setLblById(
  model?: WxoUsrModel | null,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
  model?: Record<string, any>,
) {
  const input: WxoUsrInput = {
    // ID
    id: model?.id,
    // 名称
    lbl: model?.lbl,
    // 用户
    usr_id: model?.usr_id,
    usr_id_lbl: model?.usr_id_lbl,
    // 公众号用户唯一标识
    openid: model?.openid,
    // 公众号用户统一标识
    unionid: model?.unionid,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找公众号用户列表
 * @param {WxoUsrSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: WxoUsrSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllWxoUsr: Query["findAllWxoUsr"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxoUsrSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllWxoUsr(search: $search, page: $page, sort: $sort) {
          id
          lbl
          usr_id
          usr_id_lbl
          openid
          unionid
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
  const models = data.findAllWxoUsr;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个公众号用户
 * @param {WxoUsrSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: WxoUsrSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneWxoUsr: Query["findOneWxoUsr"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxoUsrSearch, $sort: [SortInput!]) {
        findOneWxoUsr(search: $search, sort: $sort) {
          id
          lbl
          usr_id
          usr_id_lbl
          openid
          unionid
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
  const model = data.findOneWxoUsr;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找公众号用户总数
 * @param {WxoUsrSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: WxoUsrSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountWxoUsr: Query["findCountWxoUsr"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxoUsrSearch) {
        findCountWxoUsr(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountWxoUsr;
  return count;
}

/**
 * 创建公众号用户
 * @param {WxoUsrInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: WxoUsrInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxoUsrId> {
  input = intoInput(input);
  const data: {
    createWxoUsr: Mutation["createWxoUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($input: WxoUsrInput!, $unique_type: UniqueType) {
        createWxoUsr(input: $input, unique_type: $unique_type)
      }
    `,
    variables: {
      input,
      unique_type,
    },
  }, opt);
  const id: WxoUsrId = data.createWxoUsr;
  return id;
}

/**
 * 根据 id 修改公众号用户
 * @param {WxoUsrId} id
 * @param {WxoUsrInput} input
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: WxoUsrId,
  input: WxoUsrInput,
  opt?: GqlOpt,
): Promise<WxoUsrId> {
  input = intoInput(input);
  const data: {
    updateByIdWxoUsr: Mutation["updateByIdWxoUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: WxoUsrId!, $input: WxoUsrInput!) {
        updateByIdWxoUsr(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: WxoUsrId = data.updateByIdWxoUsr;
  return id2;
}

/**
 * 根据 id 查找公众号用户
 * @param {WxoUsrId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: WxoUsrId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdWxoUsr: Query["findByIdWxoUsr"];
  } = await query({
    query: /* GraphQL */ `
      query($id: WxoUsrId!) {
        findByIdWxoUsr(id: $id) {
          id
          lbl
          usr_id
          usr_id_lbl
          openid
          unionid
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
  const model = data.findByIdWxoUsr;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除公众号用户
 * @param {WxoUsrId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: WxoUsrId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsWxoUsr: Mutation["deleteByIdsWxoUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxoUsrId!]!) {
        deleteByIdsWxoUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsWxoUsr;
  return res;
}

/**
 * 根据 ids 还原公众号用户
 * @param {WxoUsrId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: WxoUsrId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsWxoUsr: Mutation["revertByIdsWxoUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxoUsrId!]!) {
        revertByIdsWxoUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsWxoUsr;
  return res;
}

/**
 * 根据 ids 彻底删除公众号用户
 * @param {WxoUsrId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: WxoUsrId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsWxoUsr: Mutation["forceDeleteByIdsWxoUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxoUsrId!]!) {
        forceDeleteByIdsWxoUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsWxoUsr;
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
          getFieldCommentsWxoUsr {
            lbl
            usr_id_lbl
            openid
            unionid
            rem
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
      const sheetName = await nsAsync("公众号用户");
      const buffer = await workerFn(
        `${ location.origin }/import_template/wx/wxo_usr.xlsx`,
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
    search?: WxoUsrSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: /* GraphQL */ `
          query($search: WxoUsrSearch, $sort: [SortInput!]) {
            findAllWxoUsr(search: $search, sort: $sort) {
              id
              lbl
              usr_id
              usr_id_lbl
              openid
              unionid
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
          }
        `,
        variables: {
          search,
          sort,
        },
      }, opt);
      try {
        const sheetName = await nsAsync("公众号用户");
        const buffer = await workerFn(
          `${ location.origin }/excel_template/wx/wxo_usr.xlsx`,
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
 * @param {WxoUsrInput[]} models
 */
export async function importModels(
  models: WxoUsrInput[],
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
  const defaultInput: WxoUsrInput = {
  };
  return defaultInput;
}
