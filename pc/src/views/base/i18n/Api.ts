
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  i18nQueryField,
} from "./Model.ts";

import {
  findTreeMenu,
} from "@/views/base/menu/Api.ts";

export async function setLblByIdI18n(
  model?: I18nModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputI18n(
  model?: I18nInput,
) {
  const input: I18nInput = {
    // ID
    id: model?.id,
    // 语言
    lang_id: model?.lang_id,
    lang_id_lbl: model?.lang_id_lbl,
    // 菜单
    menu_id: model?.menu_id,
    menu_id_lbl: model?.menu_id_lbl,
    // 编码
    code: model?.code,
    // 名称
    lbl: model?.lbl,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找 国际化 列表
 */
export async function findAllI18n(
  search?: I18nSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllI18n: I18nModel[];
  } = await query({
    query: `
      query($search: I18nSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllI18n(search: $search, page: $page, sort: $sort) {
          ${ i18nQueryField }
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
    await setLblByIdI18n(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 国际化
 */
export async function findOneI18n(
  search?: I18nSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneI18n?: I18nModel;
  } = await query({
    query: `
      query($search: I18nSearch, $sort: [SortInput!]) {
        findOneI18n(search: $search, sort: $sort) {
          ${ i18nQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneI18n;
  
  await setLblByIdI18n(model);
  
  return model;
}

/**
 * 根据条件查找第一个 国际化, 如果不存在则抛错
 */
export async function findOneOkI18n(
  search?: I18nSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkI18n?: I18nModel;
  } = await query({
    query: `
      query($search: I18nSearch, $sort: [SortInput!]) {
        findOneOkI18n(search: $search, sort: $sort) {
          ${ i18nQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkI18n;
  
  await setLblByIdI18n(model);
  
  return model;
}

/**
 * 根据搜索条件查找 国际化 总数
 */
export async function findCountI18n(
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
 * 创建 国际化
 */
export async function createI18n(
  input: I18nInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<I18nId> {
  const ids = await createsI18n(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 国际化
 */
export async function createsI18n(
  inputs: I18nInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<I18nId[]> {
  inputs = inputs.map(intoInputI18n);
  const data: {
    createsI18n: Mutation["createsI18n"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [I18nInput!]!, $unique_type: UniqueType) {
        createsI18n(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsI18n;
  return ids;
}

/**
 * 根据 id 修改 国际化
 */
export async function updateByIdI18n(
  id: I18nId,
  input: I18nInput,
  opt?: GqlOpt,
): Promise<I18nId> {
  input = intoInputI18n(input);
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
 * 根据 id 查找 国际化
 */
export async function findByIdI18n(
  id: I18nId,
  opt?: GqlOpt,
): Promise<I18nModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdI18n?: I18nModel;
  } = await query({
    query: `
      query($id: I18nId!) {
        findByIdI18n(id: $id) {
          ${ i18nQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdI18n;
  
  await setLblByIdI18n(model);
  
  return model;
}

/**
 * 根据 id 查找 国际化, 如果不存在则抛错
 */
export async function findByIdOkI18n(
  id: I18nId,
  opt?: GqlOpt,
): Promise<I18nModel> {
  
  const data: {
    findByIdOkI18n: I18nModel;
  } = await query({
    query: `
      query($id: I18nId!) {
        findByIdOkI18n(id: $id) {
          ${ i18nQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkI18n;
  
  await setLblByIdI18n(model);
  
  return model;
}

/**
 * 根据 ids 查找 国际化
 */
export async function findByIdsI18n(
  ids: I18nId[],
  opt?: GqlOpt,
): Promise<I18nModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsI18n: I18nModel[];
  } = await query({
    query: `
      query($ids: [I18nId!]!) {
        findByIdsI18n(ids: $ids) {
          ${ i18nQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsI18n;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdI18n(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 国际化, 出现查询不到的 id 则报错
 */
export async function findByIdsOkI18n(
  ids: I18nId[],
  opt?: GqlOpt,
): Promise<I18nModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkI18n: I18nModel[];
  } = await query({
    query: `
      query($ids: [I18nId!]!) {
        findByIdsOkI18n(ids: $ids) {
          ${ i18nQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkI18n;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdI18n(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 国际化
 */
export async function deleteByIdsI18n(
  ids: I18nId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
 * 根据 ids 还原 国际化
 */
export async function revertByIdsI18n(
  ids: I18nId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
 * 根据 ids 彻底删除 国际化
 */
export async function forceDeleteByIdsI18n(
  ids: I18nId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
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
    findAllLang: LangModel[];
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
  const lang_models = data.findAllLang;
  return lang_models;
}

export async function getListLang() {
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
    findAllMenu: MenuModel[];
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
  const menu_models = data.findAllMenu;
  return menu_models;
}

export async function getListMenu() {
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

export async function getTreeMenu() {
  const data = await findTreeMenu(
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
 * 下载 国际化 导入模板
 */
export function useDownloadImportTemplateI18n() {
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
      const sheetName = "国际化";
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/i18n.xlsx`,
        {
          sheetName,
          data,
        },
      );
      saveAsExcel(buffer, `${ sheetName}导入`);
    } catch (err) {
      ElMessage.error("下载失败");
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
export function useExportExcelI18n() {
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
        query: `
          query($search: I18nSearch, $sort: [SortInput!]) {
            findAllI18n(search: $search, page: null, sort: $sort) {
              ${ i18nQueryField }
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
      for (const model of data.findAllI18n) {
        await setLblByIdI18n(model, true);
      }
      try {
        const sheetName = "国际化";
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
        ElMessage.error("导出失败");
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
 * 批量导入 国际化
 */
export async function importModelsI18n(
  inputs: I18nInput[],
  percentage: Ref<number>,
  isCancel: Ref<boolean>,
  opt?: GqlOpt,
) {
  opt = opt || { };
  opt.showErrMsg = false;
  opt.notLoading = true;
  
  let succNum = 0;
  let failNum = 0;
  const failErrMsgs: string[] = [ ];
  percentage.value = 0;
  
  const len = inputs.length;
  const inputsArr = splitCreateArr(inputs);
  
  let i = 0;
  for (const inputs of inputsArr) {
    if (isCancel.value) {
      break;
    }
    
    i += inputs.length;
    
    try {
      await createsI18n(
        inputs,
        UniqueType.Update,
        opt,
      );
      succNum += inputs.length;
    } catch (err) {
      failNum += inputs.length;
      failErrMsgs.push(`批量导入第 ${ i + 1 - inputs.length } 至 ${ i + 1 } 行时失败: ${ err }`);
    }
    
    percentage.value = Math.floor((i + 1) / len * 100);
  }
  
  return showUploadMsg(succNum, failNum, failErrMsgs);
}

export function getPagePathI18n() {
  return "/base/i18n";
}

/** 新增时的默认值 */
export async function getDefaultInputI18n() {
  const defaultInput: I18nInput = {
  };
  return defaultInput;
}
