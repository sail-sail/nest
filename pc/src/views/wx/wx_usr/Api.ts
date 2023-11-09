import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
  WxUsrSearch,
  WxUsrInput,
} from "#/types";

import type {
  UsrSearch,
} from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {WxUsrSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: WxUsrSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllWxUsr: Query["findAllWxUsr"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxUsrSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllWxUsr(search: $search, page: $page, sort: $sort) {
          id
          lbl
          usr_id
          usr_id_lbl
          nick_name
          avatar_url
          mobile
          openid
          gz_openid
          unionid
          gender
          gender_lbl
          city
          province
          country
          language
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
  const res = data.findAllWxUsr;
  for (let i = 0; i < res.length; i++) {
    const item = res[i];
  }
  return res;
}

/**
 * 根据搜索条件查找第一条记录
 * @export findOne
 * @param {WxUsrSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: WxUsrSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneWxUsr: Query["findOneWxUsr"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxUsrSearch, $sort: [SortInput!]) {
        findOneWxUsr(search: $search, sort: $sort) {
          id
          lbl
          usr_id
          usr_id_lbl
          nick_name
          avatar_url
          mobile
          openid
          gz_openid
          unionid
          gender
          gender_lbl
          city
          province
          country
          language
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
  const model = data.findOneWxUsr;
  if (model) {
  }
  return model;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
 * @param {WxUsrSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: WxUsrSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountWxUsr: Query["findCountWxUsr"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxUsrSearch) {
        findCountWxUsr(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const res = data.findCountWxUsr;
  return res;
}

/**
 * 创建一条数据
 * @export create
 * @param {WxUsrInput} model
 * @param {UniqueType} uniqueType?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: WxUsrInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
) {
  const data: {
    createWxUsr: Mutation["createWxUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: WxUsrInput!, $unique_type: UniqueType) {
        createWxUsr(model: $model, unique_type: $unique_type)
      }
    `,
    variables: {
      model,
      unique_type,
    },
  }, opt);
  const res = data.createWxUsr;
  return res;
}

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {string} id
 * @param {WxUsrInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: string,
  model: WxUsrInput,
  opt?: GqlOpt,
) {
  const data: {
    updateByIdWxUsr: Mutation["updateByIdWxUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: String!, $model: WxUsrInput!) {
        updateByIdWxUsr(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const res = data.updateByIdWxUsr;
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
    findByIdWxUsr: Query["findByIdWxUsr"];
  } = await query({
    query: /* GraphQL */ `
      query($id: String!) {
        findByIdWxUsr(id: $id) {
          id
          lbl
          usr_id
          usr_id_lbl
          nick_name
          avatar_url
          mobile
          openid
          gz_openid
          unionid
          gender
          gender_lbl
          city
          province
          country
          language
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
  const res = data.findByIdWxUsr;
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
    deleteByIdsWxUsr: Mutation["deleteByIdsWxUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
        deleteByIdsWxUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsWxUsr;
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
    enableByIdsWxUsr: Mutation["enableByIdsWxUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!, $is_enabled: Int!) {
        enableByIdsWxUsr(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsWxUsr;
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
    lockByIdsWxUsr: Mutation["lockByIdsWxUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!, $is_locked: Int!) {
        lockByIdsWxUsr(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsWxUsr;
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
    revertByIdsWxUsr: Mutation["revertByIdsWxUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
        revertByIdsWxUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsWxUsr;
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
    forceDeleteByIdsWxUsr: Mutation["forceDeleteByIdsWxUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
        forceDeleteByIdsWxUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsWxUsr;
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
          getFieldCommentsWxUsr {
            lbl
            usr_id_lbl
            nick_name
            avatar_url
            mobile
            openid
            gz_openid
            unionid
            gender_lbl
            city
            province
            country
            language
            is_locked_lbl
            is_enabled_lbl
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
            "wx_usr_gender",
            "is_locked",
            "is_enabled",
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
      `${ location.origin }/import_template/wx/wx_usr.xlsx`,
      {
        data,
      },
    );
    saveAsExcel(buffer, `${ await nAsync("微信用户") }${ await nsAsync("导入") }`);
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
    search?: WxUsrSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const data = await query({
      query: /* GraphQL */ `
        query($search: WxUsrSearch, $sort: [SortInput!]) {
          findAllWxUsr(search: $search, sort: $sort) {
            id
            lbl
            usr_id
            usr_id_lbl
            nick_name
            avatar_url
            mobile
            openid
            gz_openid
            unionid
            gender
            gender_lbl
            city
            province
            country
            language
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
          getFieldCommentsWxUsr {
            lbl
            usr_id_lbl
            nick_name
            avatar_url
            mobile
            openid
            gz_openid
            unionid
            gender_lbl
            city
            province
            country
            language
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
            "wx_usr_gender",
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
        `${ location.origin }/excel_template/wx/wx_usr.xlsx`,
        {
          data,
        },
      );
      saveAsExcel(buffer, await nAsync("微信用户"));
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
 * @param {WxUsrInput[]} models
 * @export importModels
 */
export async function importModels(
  models: WxUsrInput[],
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
