import {
  type Query,
  type Mutation,
  type PageInput,
  type I18nModel,
  type I18nSearch,
  type I18nInput,
} from "#/types";

import {
  type LangSearch,
  type MenuSearch,
} from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {I18nSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: I18nSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllI18n: Query["findAllI18n"];
  } = await query({
    query: /* GraphQL */ `
      query($search: I18nSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllI18n(search: $search, page: $page, sort: $sort) {
          id
          lang_id
          lang_id_lbl
          menu_id
          menu_id_lbl
          code
          lbl
          rem
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const result = data.findAllI18n;
  for (let i = 0; i < result.length; i++) {
    const item = result[i];
  }
  return result;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
 * @param {I18nSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: I18nSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountI18n: Query["findCountI18n"];
  } = await query({
    query: /* GraphQL */ `
      query($search: I18nSearch) {
        findCountI18n(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const result = data.findCountI18n;
  return result;
}

/**
 * 创建一条数据
 * @export create
 * @param {I18nInput} model
 * @param {GqlOpt} opt?
 */
export async function create(
  model: I18nInput,
  opt?: GqlOpt,
) {
  const data: {
    createI18n: Mutation["createI18n"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: I18nInput!) {
        createI18n(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  const result = data.createI18n;
  return result;
}

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {string} id
 * @param {I18nInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: string,
  model: I18nInput,
  opt?: GqlOpt,
) {
  const data: {
    updateByIdI18n: Mutation["updateByIdI18n"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: ID!, $model: I18nInput!) {
        updateByIdI18n(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const result = data.updateByIdI18n;
  return result;
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
    findByIdI18n: Query["findByIdI18n"];
  } = await query({
    query: /* GraphQL */ `
      query($id: ID!) {
        findByIdI18n(id: $id) {
          id
          lang_id
          lang_id_lbl
          menu_id
          menu_id_lbl
          code
          lbl
          rem
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result = data.findByIdI18n;
  return result;
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
    deleteByIdsI18n: Mutation["deleteByIdsI18n"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        deleteByIdsI18n(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.deleteByIdsI18n;
  return result;
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
    revertByIdsI18n: Mutation["revertByIdsI18n"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        revertByIdsI18n(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.revertByIdsI18n;
  return result;
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
    forceDeleteByIdsI18n: Mutation["forceDeleteByIdsI18n"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        forceDeleteByIdsI18n(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.forceDeleteByIdsI18n;
  return result;
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
  const result = data.findAllLang;
  return result;
}

export async function getLangList() {
  const data = await findAllLang(
    undefined,
    {
    },
    [
      {
        prop: "",
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
  const result = data.findAllMenu;
  return result;
}

export async function getMenuList() {
  const data = await findAllMenu(
    undefined,
    {
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
 * 导出Excel
 */
export function useExportExcel() {
  const route = useRoute();
  const {
    nAsync,
    nsAsync,
  } = useI18n(route.path);
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2(
    search?: I18nSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const queryStr = getQueryUrl({
      query: /* GraphQL */ `
        query($search: I18nSearch, $sort: [SortInput!]) {
          findAllI18n(search: $search, sort: $sort) {
            id
            lang_id
            lang_id_lbl
            menu_id
            menu_id_lbl
            code
            lbl
            rem
          }
          getFieldCommentsI18n {
            lang_id
            lang_id_lbl
            menu_id
            menu_id_lbl
            code
            lbl
            rem
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
        `${ location.origin }${ queryStr }`,
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
 * @param {I18nInput[]} models
 * @export importModels
 */
export async function importModels(
  models: I18nInput[],
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
      await create(item, opt);
      succNum++;
    } catch (err) {
      failNum++;
      failErrMsgs.push(await nsAsync(`第 {0} 行导入失败: {1}`, i + 1, err));
    }
    
    percentage.value = Math.floor((i + 1) / models.length * 100);
  }
  
  return showUploadMsg(succNum, failNum, failErrMsgs);
}
