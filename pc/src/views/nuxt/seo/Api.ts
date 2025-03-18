
import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  seoQueryField,
} from "./Model";

async function setLblById(
  model?: SeoModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
  
  // 分享图片
  if (model.og_image) {
    model.og_image_lbl = location.origin + getImgUrl({
      id: model.og_image,
      height: 100,
    });
  }
}

export function intoInput(
  model?: SeoInput,
) {
  const input: SeoInput = {
    // ID
    id: model?.id,
    // 标题
    title: model?.title,
    // 描述
    description: model?.description,
    // 关键词
    keywords: model?.keywords,
    // 分享图片
    og_image: model?.og_image,
    // 分享标题
    og_title: model?.og_title,
    // 分享描述
    og_description: model?.og_description,
    // 锁定
    is_locked: model?.is_locked,
    is_locked_lbl: model?.is_locked_lbl,
    // 默认
    is_default: model?.is_default,
    is_default_lbl: model?.is_default_lbl,
    // 排序
    order_by: model?.order_by,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找SEO优化列表
 */
export async function findAll(
  search?: SeoSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllSeo: SeoModel[];
  } = await query({
    query: `
      query($search: SeoSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllSeo(search: $search, page: $page, sort: $sort) {
          ${ seoQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllSeo;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个SEO优化
 */
export async function findOne(
  search?: SeoSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneSeo?: SeoModel;
  } = await query({
    query: `
      query($search: SeoSearch, $sort: [SortInput!]) {
        findOneSeo(search: $search, sort: $sort) {
          ${ seoQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneSeo;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找SEO优化总数
 */
export async function findCount(
  search?: SeoSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountSeo: Query["findCountSeo"];
  } = await query({
    query: /* GraphQL */ `
      query($search: SeoSearch) {
        findCountSeo(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountSeo;
  return count;
}

/**
 * 创建SEO优化
 * @param {SeoInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: SeoInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<SeoId> {
  const ids = await creates(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建SEO优化
 */
export async function creates(
  inputs: SeoInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<SeoId[]> {
  inputs = inputs.map(intoInput);
  const data: {
    createsSeo: Mutation["createsSeo"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [SeoInput!]!, $unique_type: UniqueType) {
        createsSeo(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsSeo;
  return ids;
}

/**
 * 根据 id 修改SEO优化
 */
export async function updateById(
  id: SeoId,
  input: SeoInput,
  opt?: GqlOpt,
): Promise<SeoId> {
  input = intoInput(input);
  const data: {
    updateByIdSeo: Mutation["updateByIdSeo"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: SeoId!, $input: SeoInput!) {
        updateByIdSeo(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: SeoId = data.updateByIdSeo;
  return id2;
}

/**
 * 根据 id 查找SEO优化
 */
export async function findById(
  id?: SeoId,
  opt?: GqlOpt,
): Promise<SeoModel | undefined> {
  if (!id) {
    return;
  }
  const data: {
    findByIdSeo?: SeoModel;
  } = await query({
    query: `
      query($id: SeoId!) {
        findByIdSeo(id: $id) {
          ${ seoQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdSeo;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 查找SEO优化
 */
export async function findByIds(
  ids: SeoId[],
  opt?: GqlOpt,
): Promise<SeoModel[]> {
  if (ids.length === 0) {
    return [ ];
  }
  opt = opt || { };
  opt.showErrMsg = false;
  let models: SeoModel[] = [ ];
  try {
    const data: {
      findByIdsSeo: SeoModel[];
    } = await query({
      query: `
        query($ids: [SeoId!]!) {
          findByIdsSeo(ids: $ids) {
            ${ seoQueryField }
          }
        }
      `,
      variables: {
        ids,
      },
    }, opt);
    models = data.findByIdsSeo;
  } catch (_err) { /* empty */ }
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据 ids 删除SEO优化
 */
export async function deleteByIds(
  ids: SeoId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsSeo: Mutation["deleteByIdsSeo"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [SeoId!]!) {
        deleteByIdsSeo(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsSeo;
  return res;
}

/**
 * 根据 id 设置默认SEO优化
 */
export async function defaultById(
  id?: SeoId,
  opt?: GqlOpt,
) {
  if (!id) {
    return 0;
  }
  const data: {
    defaultByIdSeo: Mutation["defaultByIdSeo"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: SeoId!) {
        defaultByIdSeo(id: $id)
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const res = data.defaultByIdSeo;
  return res;
}

/**
 * 根据 ids 锁定或解锁SEO优化
 */
export async function lockByIds(
  ids: SeoId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    lockByIdsSeo: Mutation["lockByIdsSeo"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [SeoId!]!, $is_locked: Int!) {
        lockByIdsSeo(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsSeo;
  return res;
}

/**
 * 根据 ids 还原SEO优化
 */
export async function revertByIds(
  ids: SeoId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsSeo: Mutation["revertByIdsSeo"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [SeoId!]!) {
        revertByIdsSeo(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsSeo;
  return res;
}

/**
 * 根据 ids 彻底删除SEO优化
 */
export async function forceDeleteByIds(
  ids: SeoId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsSeo: Mutation["forceDeleteByIdsSeo"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [SeoId!]!) {
        forceDeleteByIdsSeo(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsSeo;
  return res;
}

/**
 * 下载SEO优化导入模板
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
          getFieldCommentsSeo {
            title
            description
            keywords
            og_image
            og_title
            og_description
            order_by
            rem
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "SEO优化";
      const buffer = await workerFn(
        `${ location.origin }/import_template/nuxt/seo.xlsx`,
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
    search?: SeoSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: SeoSearch, $sort: [SortInput!]) {
            findAllSeo(search: $search, page: null, sort: $sort) {
              ${ seoQueryField }
            }
            getDict(codes: [
              "is_locked",
              "is_default",
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
      for (const model of data.findAllSeo) {
        await setLblById(model, true);
      }
      try {
        const sheetName = "SEO优化";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/nuxt/seo.xlsx`,
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
 * 批量导入SEO优化
 */
export async function importModels(
  inputs: SeoInput[],
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

/**
 * 查找 SEO优化 order_by 字段的最大值
 */
export async function findLastOrderBy(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderBySeo: Query["findLastOrderBySeo"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderBySeo
      }
    `,
  }, opt);
  const res = data.findLastOrderBySeo;
  return res;
}

export function getPagePath() {
  return "/nuxt/seo";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: SeoInput = {
    is_locked: 0,
    order_by: 1,
  };
  return defaultInput;
}
