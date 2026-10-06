import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  wxwOaTemplateQueryField,
} from "./Model.ts";

export async function setLblByIdWxwOaTemplate(
  model?: WxwOaTemplateModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
  
  // 流程图
  if (model.flow_img) {
    const flow_img_lbls: string[] = [ ];
    const flow_imgs = model.flow_img.split(",");
    for (let i = 0; i < flow_imgs.length; i++) {
      const img = flow_imgs[i];
      const img_lbl = location.origin + location.pathname + getImgUrl({
        id: img,
        height: 100,
      }) || "";
      flow_img_lbls.push(img_lbl);
    }
    model.flow_img_lbls = flow_img_lbls;
    model.flow_img_lbl = flow_img_lbls[0] || "";
  }
}

export function intoInputWxwOaTemplate(
  model?: WxwOaTemplateInput | null,
) {
  const input: WxwOaTemplateInput = {
    // ID
    id: model?.id,
    // 流程图
    flow_img: model?.flow_img,
    // 模板名称
    lbl: model?.lbl,
    // 模板ID
    template_id: model?.template_id,
    // 业务类型
    business_type: model?.business_type,
    // 启用
    is_enabled: model?.is_enabled,
    is_enabled_lbl: model?.is_enabled_lbl,
    // 排序
    order_by: model?.order_by != null ? Number(model?.order_by || 0) : undefined,
    // 备注
    rem: model?.rem,
    // 所属组织
    org_id: model?.org_id,
    org_id_lbl: model?.org_id_lbl,
  };
  return input;
}

/**
 * 根据搜索条件查找 审批模板 列表
 */
export async function findAllWxwOaTemplate(
  search?: WxwOaTemplateSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllWxwOaTemplate: WxwOaTemplateModel[];
  } = await query({
    query: `
      query($search: WxwOaTemplateSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllWxwOaTemplate(search: $search, page: $page, sort: $sort) {
          ${ wxwOaTemplateQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllWxwOaTemplate;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxwOaTemplate(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 审批模板
 */
export async function findOneWxwOaTemplate(
  search?: WxwOaTemplateSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneWxwOaTemplate?: WxwOaTemplateModel;
  } = await query({
    query: `
      query($search: WxwOaTemplateSearch, $sort: [SortInput!]) {
        findOneWxwOaTemplate(search: $search, sort: $sort) {
          ${ wxwOaTemplateQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneWxwOaTemplate;
  
  await setLblByIdWxwOaTemplate(model);
  
  return model;
}

/**
 * 根据条件查找第一个 审批模板, 如果不存在则抛错
 */
export async function findOneOkWxwOaTemplate(
  search?: WxwOaTemplateSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkWxwOaTemplate?: WxwOaTemplateModel;
  } = await query({
    query: `
      query($search: WxwOaTemplateSearch, $sort: [SortInput!]) {
        findOneOkWxwOaTemplate(search: $search, sort: $sort) {
          ${ wxwOaTemplateQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkWxwOaTemplate;
  
  await setLblByIdWxwOaTemplate(model);
  
  return model;
}

/**
 * 根据搜索条件查找 审批模板 总数
 */
export async function findCountWxwOaTemplate(
  search?: WxwOaTemplateSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountWxwOaTemplate: Query["findCountWxwOaTemplate"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxwOaTemplateSearch) {
        findCountWxwOaTemplate(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountWxwOaTemplate;
  return count;
}

/**
 * 创建 审批模板
 */
export async function createWxwOaTemplate(
  input: WxwOaTemplateInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxwOaTemplateId> {
  const ids = await createsWxwOaTemplate(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 审批模板
 */
export async function createsWxwOaTemplate(
  inputs: WxwOaTemplateInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxwOaTemplateId[]> {
  inputs = inputs.map(intoInputWxwOaTemplate);
  const data: {
    createsWxwOaTemplate: Mutation["createsWxwOaTemplate"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [WxwOaTemplateInput!]!, $unique_type: UniqueType) {
        createsWxwOaTemplate(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsWxwOaTemplate;
  return ids;
}

/**
 * 根据 id 修改 审批模板
 */
export async function updateByIdWxwOaTemplate(
  id: WxwOaTemplateId,
  input: WxwOaTemplateInput,
  opt?: GqlOpt,
): Promise<WxwOaTemplateId> {
  input = intoInputWxwOaTemplate(input);
  const data: {
    updateByIdWxwOaTemplate: Mutation["updateByIdWxwOaTemplate"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: WxwOaTemplateId!, $input: WxwOaTemplateInput!) {
        updateByIdWxwOaTemplate(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: WxwOaTemplateId = data.updateByIdWxwOaTemplate;
  return id2;
}

/**
 * 根据 id 查找 审批模板
 */
export async function findByIdWxwOaTemplate(
  id: WxwOaTemplateId,
  opt?: GqlOpt,
): Promise<WxwOaTemplateModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdWxwOaTemplate?: WxwOaTemplateModel;
  } = await query({
    query: `
      query($id: WxwOaTemplateId!) {
        findByIdWxwOaTemplate(id: $id) {
          ${ wxwOaTemplateQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdWxwOaTemplate;
  
  await setLblByIdWxwOaTemplate(model);
  
  return model;
}

/**
 * 根据 id 查找 审批模板, 如果不存在则抛错
 */
export async function findByIdOkWxwOaTemplate(
  id: WxwOaTemplateId,
  opt?: GqlOpt,
): Promise<WxwOaTemplateModel> {
  
  const data: {
    findByIdOkWxwOaTemplate: WxwOaTemplateModel;
  } = await query({
    query: `
      query($id: WxwOaTemplateId!) {
        findByIdOkWxwOaTemplate(id: $id) {
          ${ wxwOaTemplateQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkWxwOaTemplate;
  
  await setLblByIdWxwOaTemplate(model);
  
  return model;
}

/**
 * 根据 ids 查找 审批模板
 */
export async function findByIdsWxwOaTemplate(
  ids: WxwOaTemplateId[],
  opt?: GqlOpt,
): Promise<WxwOaTemplateModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsWxwOaTemplate: WxwOaTemplateModel[];
  } = await query({
    query: `
      query($ids: [WxwOaTemplateId!]!) {
        findByIdsWxwOaTemplate(ids: $ids) {
          ${ wxwOaTemplateQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsWxwOaTemplate;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxwOaTemplate(model);
  }
  
  return models;
}

/**
 * 根据搜索条件判断审批模板是否存在
 */
export async function existsWxwOaTemplate(
  search?: WxwOaTemplateSearch,
  opt?: GqlOpt,
): Promise<boolean> {
  
  const data: {
    existsWxwOaTemplate: Query["existsWxwOaTemplate"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxwOaTemplateSearch) {
        existsWxwOaTemplate(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  
  const res = data.existsWxwOaTemplate;
  
  return res;
}

/**
 * 根据 ids 查找 审批模板, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxwOaTemplate(
  ids: WxwOaTemplateId[],
  opt?: GqlOpt,
): Promise<WxwOaTemplateModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkWxwOaTemplate: WxwOaTemplateModel[];
  } = await query({
    query: `
      query($ids: [WxwOaTemplateId!]!) {
        findByIdsOkWxwOaTemplate(ids: $ids) {
          ${ wxwOaTemplateQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkWxwOaTemplate;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxwOaTemplate(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 审批模板
 */
export async function deleteByIdsWxwOaTemplate(
  ids: WxwOaTemplateId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsWxwOaTemplate: Mutation["deleteByIdsWxwOaTemplate"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxwOaTemplateId!]!) {
        deleteByIdsWxwOaTemplate(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsWxwOaTemplate;
  return res;
}

/**
 * 根据 ids 启用或禁用 审批模板
 */
export async function enableByIdsWxwOaTemplate(
  ids: WxwOaTemplateId[],
  is_enabled: number,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    enableByIdsWxwOaTemplate: Mutation["enableByIdsWxwOaTemplate"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxwOaTemplateId!]!, $is_enabled: Int!) {
        enableByIdsWxwOaTemplate(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsWxwOaTemplate;
  return res;
}

/**
 * 根据 ids 还原 审批模板
 */
export async function revertByIdsWxwOaTemplate(
  ids: WxwOaTemplateId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsWxwOaTemplate: Mutation["revertByIdsWxwOaTemplate"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxwOaTemplateId!]!) {
        revertByIdsWxwOaTemplate(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsWxwOaTemplate;
  return res;
}

/**
 * 根据 ids 彻底删除 审批模板
 */
export async function forceDeleteByIdsWxwOaTemplate(
  ids: WxwOaTemplateId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsWxwOaTemplate: Mutation["forceDeleteByIdsWxwOaTemplate"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxwOaTemplateId!]!) {
        forceDeleteByIdsWxwOaTemplate(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsWxwOaTemplate;
  return res;
}

export async function findAllOrg(
  search?: OrgSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllOrg: OrgModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: OrgSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllOrg(search: $search, page: $page, sort: $sort) {
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
  const org_models = data.findAllOrg;
  return org_models;
}

export async function getListOrg() {
  const data = await findAllOrg(
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
 * 下载 审批模板 导入模板
 */
export function useDownloadImportTemplateWxwOaTemplate() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsWxwOaTemplate {
            flow_img
            lbl
            template_id
            business_type
            order_by
            rem
            org_id_lbl
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "审批模板";
      const buffer = await workerFn(
        `${ location.origin }${ location.pathname }/import_template/wxwork/wxw_oa_template.xlsx`,
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
export function useExportExcelWxwOaTemplate() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: WxwOaTemplateSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: WxwOaTemplateSearch, $page: PageInput, $sort: [SortInput!]) {
            findAllWxwOaTemplate(search: $search, page: $page, sort: $sort) {
              ${ wxwOaTemplateQueryField }
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
      for (const model of data.findAllWxwOaTemplate) {
        await setLblByIdWxwOaTemplate(model, true);
      }
      try {
        const sheetName = "审批模板";
        const buffer = await workerFn(
          `${ location.origin }${ location.pathname }/excel_template/wxwork/wxw_oa_template.xlsx`,
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
 * 批量导入 审批模板
 */
export async function importModelsWxwOaTemplate(
  inputs: WxwOaTemplateInput[],
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
      await createsWxwOaTemplate(
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
 * 查找 审批模板 order_by 字段的最大值
 */
export async function findLastOrderByWxwOaTemplate(
  search?: WxwOaTemplateSearch,
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByWxwOaTemplate: Query["findLastOrderByWxwOaTemplate"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxwOaTemplateSearch) {
        findLastOrderByWxwOaTemplate(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  
  const order_by = data.findLastOrderByWxwOaTemplate;
  
  return order_by;
}

/**
 * 获取 审批模板 字段注释
 */
export async function getFieldCommentsWxwOaTemplate(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsWxwOaTemplate: Query["getFieldCommentsWxwOaTemplate"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsWxwOaTemplate {
          id,
          flow_img,
          lbl,
          template_id,
          business_type,
          is_enabled,
          is_enabled_lbl,
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
          org_id,
          org_id_lbl,
        }
      }
    `,
    variables: {
    },
  }, opt);
  
  const field_comments = data.getFieldCommentsWxwOaTemplate as WxwOaTemplateFieldComment;
  
  return field_comments;
}

export function getPagePathWxwOaTemplate() {
  return "/wxwork/wxw_oa_template";
}

/** 新增时的默认值 */
export async function getDefaultInputWxwOaTemplate() {
  const usrStore = useUsrStore();
  const defaultInput: WxwOaTemplateInput = {
    is_enabled: 1,
    order_by: 1,
    org_id: usrStore.loginInfo?.org_id,
  };
  return defaultInput;
}
