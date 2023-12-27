import {
  UniqueType,
} from "#/types";

import type {
  I18nId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
  I18Nsearch,
  I18Ninput,
  I18Nmodel,
} from "#/types";

import type {
  LangSearch,
} from "#/types";

import type {
  MenuSearch,
} from "#/types";

import {
  findTree as findMenuTree,
} from "@/views/base/menu/Api";

async function setLblById(
  model?: I18Nmodel | null,
) {
  if (!model) {
    return;
  }
}

/**
 * 根据搜索条件查找国际化列表
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
  const models = data.findAllI18N;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个国际化
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
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找国际化总数
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
  const count = data.findCountI18N;
  return count;
}

/**
 * 创建国际化
 * @param {I18Ninput} model
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: I18Ninput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<I18nId> {
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
  const id: I18nId = data.createI18N;
  return id;
}

/**
 * 根据 id 修改国际化
 * @param {I18nId} id
 * @param {I18Ninput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: I18nId,
  model: I18Ninput,
  opt?: GqlOpt,
): Promise<I18nId> {
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
  const id2: I18nId = data.updateByIdI18N;
  return id2;
}

/**
 * 根据 id 查找国际化
 * @param {I18nId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: I18nId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdI18N: Query["findByIdI18N"];
  } = await query({
    query: /* GraphQL */ `
      query($id: I18nId!) {
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
  const model = data.findByIdI18N;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除国际化
 * @param {I18nId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: I18nId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsI18N: Mutation["deleteByIdsI18N"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [I18nId!]!) {
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
 * 根据 ids 还原国际化
 * @param {I18nId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: I18nId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsI18N: Mutation["revertByIdsI18N"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [I18nId!]!) {
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
 * 根据 ids 彻底删除国际化
 * @param {I18nId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: I18nId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsI18N: Mutation["forceDeleteByIdsI18N"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [I18nId!]!) {
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
