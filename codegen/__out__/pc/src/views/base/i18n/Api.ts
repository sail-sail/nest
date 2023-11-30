import {
  UniqueType,
} from "#/types";


import type {
  I18NId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
  I18Nsearch,
  I18Ninput,
} from "#/types";

import type {
  LangSearch,
  MenuSearch,
} from "#/types";

import {
  findTree as findMenuTree,
} from "@/views/base/menu/Api";

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {I18Nsearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: I18Nsearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllI18N: Query["findAllI18N"];
  } = await query({
    query: /* GraphQL */ `
      query($search: I18Nsearch, $page: PageInput, $sort: [SortInput!]) {
        findAllI18N(search: $search, page: $page, sort: $sort) {
          id
          lang_id
          lang_id_lbl
          menu_id
          menu_id_lbl
          code
          lbl
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
  const res = data.findAllI18N;
  for (let i = 0; i < res.length; i++) {
    const item = res[i];
  }
  return res;
}

/**
 * 根据搜索条件查找第一条记录
 * @export findOne
 * @param {I18Nsearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: I18Nsearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneI18N: Query["findOneI18N"];
  } = await query({
    query: /* GraphQL */ `
      query($search: I18Nsearch, $sort: [SortInput!]) {
        findOneI18N(search: $search, sort: $sort) {
          id
          lang_id
          lang_id_lbl
          menu_id
          menu_id_lbl
          code
          lbl
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
  const model = data.findOneI18N;
  if (model) {
  }
  return model;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
 * @param {I18Nsearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: I18Nsearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountI18N: Query["findCountI18N"];
  } = await query({
    query: /* GraphQL */ `
      query($search: I18Nsearch) {
        findCountI18N(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const res = data.findCountI18N;
  return res;
}

/**
 * 创建一条数据
 * @export create
 * @param {I18Ninput} model
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: I18Ninput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<I18NId> {
  const data: {
    createI18N: Mutation["createI18N"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: I18Ninput!, $unique_type: UniqueType) {
        createI18N(model: $model, unique_type: $unique_type)
      }
    `,
    variables: {
      model,
      unique_type,
    },
  }, opt);
  const id: I18NId = data.createI18N;
  return id;
}

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {I18NId} id
 * @param {I18Ninput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: I18NId,
  model: I18Ninput,
  opt?: GqlOpt,
): Promise<I18NId> {
  const data: {
    updateByIdI18N: Mutation["updateByIdI18N"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: I18NId!, $model: I18Ninput!) {
        updateByIdI18N(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const id2: I18NId = data.updateByIdI18N;
  return id2;
}

/**
 * 通过ID查找一条数据
 * @export findById
 * @param {I18NId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: I18NId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdI18N: Query["findByIdI18N"];
  } = await query({
    query: /* GraphQL */ `
      query($id: I18NId!) {
        findByIdI18N(id: $id) {
          id
          lang_id
          lang_id_lbl
          menu_id
          menu_id_lbl
          code
          lbl
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
  const res = data.findByIdI18N;
  return res;
}

/**
 * 根据 ids 删除数据
 * @export deleteByIds
 * @param {I18NId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: I18NId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsI18N: Mutation["deleteByIdsI18N"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [I18NId!]!) {
        deleteByIdsI18N(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsI18N;
  return res;
}

/**
 * 根据 ids 从回收站还原数据
 * @export revertByIds
 * @param {I18NId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: I18NId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsI18N: Mutation["revertByIdsI18N"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [I18NId!]!) {
        revertByIdsI18N(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsI18N;
  return res;
}

/**
 * 根据 ids 彻底删除数据
 * @export forceDeleteByIds
 * @param {I18NId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: I18NId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsI18N: Mutation["forceDeleteByIdsI18N"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [I18NId!]!) {
        forceDeleteByIdsI18N(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsI18N;
  return res;
}

export async function findAllLang(
  search?: LangSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllLang: Query["findAllLang"];
  } = await query({
    query: /* GraphQL */ `
      query($search: LangSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllLang(search: $search, page: $page, sort: $sort) {
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
  const res = data.findAllLang;
  return res;
}

export async function getLangList() {
  const data = await findAllLang(
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

export async function findAllMenu(
  search?: MenuSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllMenu: Query["findAllMenu"];
  } = await query({
    query: /* GraphQL */ `
      query($search: MenuSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllMenu(search: $search, page: $page, sort: $sort) {
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
  const res = data.findAllMenu;
  return res;
}

export async function getMenuList() {
  const data = await findAllMenu(
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

export async function getMenuTree() {
  const data = await findMenuTree(
    {
      is_enabled: [ 1 ],
    },
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
          getFieldCommentsI18N {
            lang_id_lbl
            menu_id_lbl
            code
            lbl
            rem
          }
          findAllLang {
            id
            lbl
          }
          findAllMenu {
            id
            lbl
          }
        }
      `,
      variables: {
      },
    });
    const buffer = await workerFn(
      `${ location.origin }/import_template/base/i18n.xlsx`,
      {
        data,
      },
    );
    saveAsExcel(buffer, `${ await nAsync("国际化") }${ await nsAsync("导入") }`);
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
    search?: I18Nsearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const data = await query({
      query: /* GraphQL */ `
        query($search: I18Nsearch, $sort: [SortInput!]) {
          findAllI18N(search: $search, sort: $sort) {
            id
            lang_id
            lang_id_lbl
            menu_id
            menu_id_lbl
            code
            lbl
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
          getFieldCommentsI18N {
            lang_id_lbl
            menu_id_lbl
            code
            lbl
            rem
            create_usr_id_lbl
            create_time_lbl
            update_usr_id_lbl
            update_time_lbl
          }
          findAllLang {
            lbl
          }
          findAllMenu {
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
        `${ location.origin }/excel_template/base/i18n.xlsx`,
        {
          data,
        },
      );
      saveAsExcel(buffer, await nAsync("国际化"));
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
 * @param {I18Ninput[]} models
 * @export importModels
 */
export async function importModels(
  models: I18Ninput[],
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
