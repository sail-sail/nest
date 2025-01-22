
import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  i18nQueryField,
} from "./Model";

import {
  findTree as findMenuTree,
} from "@/views/base/menu/Api";

async function setLblById(
  model?: I18nModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
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
 * 根据搜索条件查找国际化列表
 */
export async function findAll(
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
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个国际化
 */
export async function findOne(
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
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找国际化总数
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
  const ids = await creates(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建国际化
 */
export async function creates(
  inputs: I18nInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<I18nId[]> {
  inputs = inputs.map(intoInput);
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
 * 根据 id 修改国际化
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
 */
export async function findById(
  id: I18nId,
  opt?: GqlOpt,
) {
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
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除国际化
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
 * 下载国际化导入模板
 */
export function useDownloadImportTemplate() {
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
export function useExportExcel() {
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
        await setLblById(model, true);
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
 * 批量导入国际化
 */
export async function importModels(
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
      await creates(
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

export function getPagePath() {
  return "/base/i18n";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: I18nInput = {
  };
  return defaultInput;
}
