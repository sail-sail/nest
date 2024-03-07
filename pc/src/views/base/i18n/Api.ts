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
  I18nSearch,
  I18nInput,
  I18nModel,
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
  model?: I18nModel | null,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
  model?: Record<string, any>,
) {
  const input: I18nInput = {
    id: model?.id,
    lang_id: model?.lang_id,
    lang_id_lbl: model?.lang_id_lbl,
    menu_id: model?.menu_id,
    menu_id_lbl: model?.menu_id_lbl,
    code: model?.code,
    lbl: model?.lbl,
    rem: model?.rem,
    create_usr_id: model?.create_usr_id,
    create_usr_id_lbl: model?.create_usr_id_lbl,
    create_time: model?.create_time,
    create_time_lbl: model?.create_time_lbl,
    update_usr_id: model?.update_usr_id,
    update_usr_id_lbl: model?.update_usr_id_lbl,
    update_time: model?.update_time,
    update_time_lbl: model?.update_time_lbl,
  };
  return input;
}

/**
 * 根据搜索条件查找国际化列表
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
  const models = data.findAllI18n;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个国际化
 * @param {I18nSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: I18nSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneI18n: Query["findOneI18n"];
  } = await query({
    query: /* GraphQL */ `
      query($search: I18nSearch, $sort: [SortInput!]) {
        findOneI18n(search: $search, sort: $sort) {
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
  const model = data.findOneI18n;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找国际化总数
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
  const count = data.findCountI18n;
  return count;
}

/**
 * 创建国际化
 * @param {I18nInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: I18nInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<I18nId> {
  input = intoInput(input);
  const data: {
    createI18n: Mutation["createI18n"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($input: I18nInput!, $unique_type: UniqueType) {
        createI18n(input: $input, unique_type: $unique_type)
      }
    `,
    variables: {
      input,
      unique_type,
    },
  }, opt);
  const id: I18nId = data.createI18n;
  return id;
}

/**
 * 根据 id 修改国际化
 * @param {I18nId} id
 * @param {I18nInput} input
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: I18nId,
  input: I18nInput,
  opt?: GqlOpt,
): Promise<I18nId> {
  input = intoInput(input);
  const data: {
    updateByIdI18n: Mutation["updateByIdI18n"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: I18nId!, $input: I18nInput!) {
        updateByIdI18n(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: I18nId = data.updateByIdI18n;
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
    findByIdI18n: Query["findByIdI18n"];
  } = await query({
    query: /* GraphQL */ `
      query($id: I18nId!) {
        findByIdI18n(id: $id) {
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
      id,
    },
  }, opt);
  const model = data.findByIdI18n;
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
    deleteByIdsI18n: Mutation["deleteByIdsI18n"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [I18nId!]!) {
        deleteByIdsI18n(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsI18n;
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
    revertByIdsI18n: Mutation["revertByIdsI18n"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [I18nId!]!) {
        revertByIdsI18n(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsI18n;
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
    forceDeleteByIdsI18n: Mutation["forceDeleteByIdsI18n"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [I18nId!]!) {
        forceDeleteByIdsI18n(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsI18n;
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
          getFieldCommentsI18n {
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
    try {
      const sheetName = await nsAsync("国际化");
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/i18n.xlsx`,
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
    search?: I18nSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
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
              create_usr_id
              create_usr_id_lbl
              create_time
              create_time_lbl
              update_usr_id
              update_usr_id_lbl
              update_time
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
        const sheetName = await nsAsync("国际化");
        const buffer = await workerFn(
          `${ location.origin }/excel_template/base/i18n.xlsx`,
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
 * @param {I18nInput[]} models
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
  const defaultInput: I18nInput = {
  };
  return defaultInput;
}
