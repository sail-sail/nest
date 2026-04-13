
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  seoQueryField,
} from "./Model.ts";

export async function setLblByIdSeo(
  model?: SeoModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
  
  // 图标
  if (model.ico) {
    model.ico_lbl = location.origin + getImgUrl({
      id: model.ico,
      height: 100,
    });
  }
  
  // 分享图片
  if (model.og_image) {
    model.og_image_lbl = location.origin + getImgUrl({
      id: model.og_image,
      height: 100,
    });
  }
}

export function intoInputSeo(
  model?: SeoInput | null,
) {
  const input: SeoInput = {
    // ID
    id: model?.id,
    // 图标
    ico: model?.ico,
    // 标题
    lbl: model?.lbl,
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
    // 排序
    order_by: model?.order_by != null ? Number(model?.order_by || 0) : undefined,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找 SEO优化 列表
 */
export async function findAllSeo(
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
    await setLblByIdSeo(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 SEO优化
 */
export async function findOneSeo(
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
  
  await setLblByIdSeo(model);
  
  return model;
}

/**
 * 根据条件查找第一个 SEO优化, 如果不存在则抛错
 */
export async function findOneOkSeo(
  search?: SeoSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkSeo?: SeoModel;
  } = await query({
    query: `
      query($search: SeoSearch, $sort: [SortInput!]) {
        findOneOkSeo(search: $search, sort: $sort) {
          ${ seoQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkSeo;
  
  await setLblByIdSeo(model);
  
  return model;
}

/**
 * 根据搜索条件查找 SEO优化 总数
 */
export async function findCountSeo(
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
 * 创建 SEO优化
 */
export async function createSeo(
  input: SeoInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<SeoId> {
  const ids = await createsSeo(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 SEO优化
 */
export async function createsSeo(
  inputs: SeoInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<SeoId[]> {
  inputs = inputs.map(intoInputSeo);
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
 * 根据 id 修改 SEO优化
 */
export async function updateByIdSeo(
  id: SeoId,
  input: SeoInput,
  opt?: GqlOpt,
): Promise<SeoId> {
  input = intoInputSeo(input);
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
 * 根据 id 查找 SEO优化
 */
export async function findByIdSeo(
  id: SeoId,
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
  
  await setLblByIdSeo(model);
  
  return model;
}

/**
 * 根据 id 查找 SEO优化, 如果不存在则抛错
 */
export async function findByIdOkSeo(
  id: SeoId,
  opt?: GqlOpt,
): Promise<SeoModel> {
  
  const data: {
    findByIdOkSeo: SeoModel;
  } = await query({
    query: `
      query($id: SeoId!) {
        findByIdOkSeo(id: $id) {
          ${ seoQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkSeo;
  
  await setLblByIdSeo(model);
  
  return model;
}

/**
 * 根据 ids 查找 SEO优化
 */
export async function findByIdsSeo(
  ids: SeoId[],
  opt?: GqlOpt,
): Promise<SeoModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
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
  
  const models = data.findByIdsSeo;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdSeo(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 SEO优化, 出现查询不到的 id 则报错
 */
export async function findByIdsOkSeo(
  ids: SeoId[],
  opt?: GqlOpt,
): Promise<SeoModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkSeo: SeoModel[];
  } = await query({
    query: `
      query($ids: [SeoId!]!) {
        findByIdsOkSeo(ids: $ids) {
          ${ seoQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkSeo;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdSeo(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 SEO优化
 */
export async function deleteByIdsSeo(
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
 * 根据 ids 还原 SEO优化
 */
export async function revertByIdsSeo(
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
 * 根据 ids 彻底删除 SEO优化
 */
export async function forceDeleteByIdsSeo(
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
 * 下载 SEO优化 导入模板
 */
export function useDownloadImportTemplateSeo() {
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
            ico
            lbl
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
export function useExportExcelSeo() {
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
          query($search: SeoSearch, $page: PageInput, , $sort: [SortInput!]) {
            findAllSeo(search: $search, page: $page, sort: $sort) {
              ${ seoQueryField }
            }
          }
        `,
        variables: {
          search,
          page: {
            isResultLimit: false,
          },
          sort,
        },
      }, opt);
      for (const model of data.findAllSeo) {
        await setLblByIdSeo(model, true);
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
 * 批量导入 SEO优化
 */
export async function importModelsSeo(
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
      await createsSeo(
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
export async function findLastOrderBySeo(
  search?: SeoSearch,
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderBySeo: Query["findLastOrderBySeo"];
  } = await query({
    query: /* GraphQL */ `
      query($search: SeoSearch) {
        findLastOrderBySeo(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  
  const order_by = data.findLastOrderBySeo;
  
  return order_by;
}

/**
 * 获取 SEO优化 字段注释
 */
export async function getFieldCommentsSeo(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsSeo: Query["getFieldCommentsSeo"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsSeo {
          id,
          ico,
          lbl,
          description,
          keywords,
          og_image,
          og_title,
          og_description,
          order_by,
          rem,
          create_usr_id,
          create_usr_id_lbl,
          create_time,
          create_time_lbl,
          update_usr_id,
          update_usr_id_lbl,
          update_time,
          update_time_lbl,
        }
      }
    `,
    variables: {
    },
  }, opt);
  
  const field_comments = data.getFieldCommentsSeo as SeoFieldComment;
  
  return field_comments;
}

export function getPagePathSeo() {
  return "/nuxt/seo";
}

/** 新增时的默认值 */
export async function getDefaultInputSeo() {
  const defaultInput: SeoInput = {
    order_by: 1,
  };
  return defaultInput;
}
