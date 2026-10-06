

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  wxwOaApprovalDetailQueryField,
} from "./Model.ts";

export async function setLblByIdWxwOaApprovalDetail(
  model?: WxwOaApprovalDetailModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputWxwOaApprovalDetail(
  model?: WxwOaApprovalDetailInput | null,
) {
  const input: WxwOaApprovalDetailInput = {
    // ID
    id: model?.id,
    // 审批编号
    sp_no: model?.sp_no,
    // 审批申请类型名称
    sp_name: model?.sp_name,
    // 审批申请状态
    sp_status: model?.sp_status,
    sp_status_lbl: model?.sp_status_lbl,
    // 模板ID
    template_id: model?.template_id,
    // 审批申请提交时间
    apply_time: model?.apply_time,
    apply_time_lbl: model?.apply_time_lbl,
    apply_time_save_null: model?.apply_time_save_null,
    // 申请人
    applyer_userid: model?.applyer_userid,
    // 批量申请人
    batch_applyer_userid: model?.batch_applyer_userid,
    // 原始数据
    raw_data: model?.raw_data,
    // 所属组织
    org_id: model?.org_id,
    org_id_lbl: model?.org_id_lbl,
  };
  return input;
}

/**
 * 根据搜索条件查找 审批申请详情 列表
 */
export async function findAllWxwOaApprovalDetail(
  search?: WxwOaApprovalDetailSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllWxwOaApprovalDetail: WxwOaApprovalDetailModel[];
  } = await query({
    query: `
      query($search: WxwOaApprovalDetailSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllWxwOaApprovalDetail(search: $search, page: $page, sort: $sort) {
          ${ wxwOaApprovalDetailQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllWxwOaApprovalDetail;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxwOaApprovalDetail(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 审批申请详情
 */
export async function findOneWxwOaApprovalDetail(
  search?: WxwOaApprovalDetailSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneWxwOaApprovalDetail?: WxwOaApprovalDetailModel;
  } = await query({
    query: `
      query($search: WxwOaApprovalDetailSearch, $sort: [SortInput!]) {
        findOneWxwOaApprovalDetail(search: $search, sort: $sort) {
          ${ wxwOaApprovalDetailQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneWxwOaApprovalDetail;
  
  await setLblByIdWxwOaApprovalDetail(model);
  
  return model;
}

/**
 * 根据条件查找第一个 审批申请详情, 如果不存在则抛错
 */
export async function findOneOkWxwOaApprovalDetail(
  search?: WxwOaApprovalDetailSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkWxwOaApprovalDetail?: WxwOaApprovalDetailModel;
  } = await query({
    query: `
      query($search: WxwOaApprovalDetailSearch, $sort: [SortInput!]) {
        findOneOkWxwOaApprovalDetail(search: $search, sort: $sort) {
          ${ wxwOaApprovalDetailQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkWxwOaApprovalDetail;
  
  await setLblByIdWxwOaApprovalDetail(model);
  
  return model;
}

/**
 * 根据搜索条件查找 审批申请详情 总数
 */
export async function findCountWxwOaApprovalDetail(
  search?: WxwOaApprovalDetailSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountWxwOaApprovalDetail: Query["findCountWxwOaApprovalDetail"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxwOaApprovalDetailSearch) {
        findCountWxwOaApprovalDetail(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountWxwOaApprovalDetail;
  return count;
}

/**
 * 根据 id 查找 审批申请详情
 */
export async function findByIdWxwOaApprovalDetail(
  id: WxwOaApprovalDetailId,
  opt?: GqlOpt,
): Promise<WxwOaApprovalDetailModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdWxwOaApprovalDetail?: WxwOaApprovalDetailModel;
  } = await query({
    query: `
      query($id: WxwOaApprovalDetailId!) {
        findByIdWxwOaApprovalDetail(id: $id) {
          ${ wxwOaApprovalDetailQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdWxwOaApprovalDetail;
  
  await setLblByIdWxwOaApprovalDetail(model);
  
  return model;
}

/**
 * 根据 id 查找 审批申请详情, 如果不存在则抛错
 */
export async function findByIdOkWxwOaApprovalDetail(
  id: WxwOaApprovalDetailId,
  opt?: GqlOpt,
): Promise<WxwOaApprovalDetailModel> {
  
  const data: {
    findByIdOkWxwOaApprovalDetail: WxwOaApprovalDetailModel;
  } = await query({
    query: `
      query($id: WxwOaApprovalDetailId!) {
        findByIdOkWxwOaApprovalDetail(id: $id) {
          ${ wxwOaApprovalDetailQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkWxwOaApprovalDetail;
  
  await setLblByIdWxwOaApprovalDetail(model);
  
  return model;
}

/**
 * 根据 ids 查找 审批申请详情
 */
export async function findByIdsWxwOaApprovalDetail(
  ids: WxwOaApprovalDetailId[],
  opt?: GqlOpt,
): Promise<WxwOaApprovalDetailModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsWxwOaApprovalDetail: WxwOaApprovalDetailModel[];
  } = await query({
    query: `
      query($ids: [WxwOaApprovalDetailId!]!) {
        findByIdsWxwOaApprovalDetail(ids: $ids) {
          ${ wxwOaApprovalDetailQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsWxwOaApprovalDetail;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxwOaApprovalDetail(model);
  }
  
  return models;
}

/**
 * 根据搜索条件判断审批申请详情是否存在
 */
export async function existsWxwOaApprovalDetail(
  search?: WxwOaApprovalDetailSearch,
  opt?: GqlOpt,
): Promise<boolean> {
  
  const data: {
    existsWxwOaApprovalDetail: Query["existsWxwOaApprovalDetail"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxwOaApprovalDetailSearch) {
        existsWxwOaApprovalDetail(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  
  const res = data.existsWxwOaApprovalDetail;
  
  return res;
}

/**
 * 根据 ids 查找 审批申请详情, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxwOaApprovalDetail(
  ids: WxwOaApprovalDetailId[],
  opt?: GqlOpt,
): Promise<WxwOaApprovalDetailModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkWxwOaApprovalDetail: WxwOaApprovalDetailModel[];
  } = await query({
    query: `
      query($ids: [WxwOaApprovalDetailId!]!) {
        findByIdsOkWxwOaApprovalDetail(ids: $ids) {
          ${ wxwOaApprovalDetailQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkWxwOaApprovalDetail;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxwOaApprovalDetail(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 审批申请详情
 */
export async function deleteByIdsWxwOaApprovalDetail(
  ids: WxwOaApprovalDetailId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsWxwOaApprovalDetail: Mutation["deleteByIdsWxwOaApprovalDetail"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxwOaApprovalDetailId!]!) {
        deleteByIdsWxwOaApprovalDetail(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsWxwOaApprovalDetail;
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
 * 导出Excel
 */
export function useExportExcelWxwOaApprovalDetail() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: WxwOaApprovalDetailSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: WxwOaApprovalDetailSearch, $page: PageInput, $sort: [SortInput!]) {
            findAllWxwOaApprovalDetail(search: $search, page: $page, sort: $sort) {
              ${ wxwOaApprovalDetailQueryField }
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
      for (const model of data.findAllWxwOaApprovalDetail) {
        await setLblByIdWxwOaApprovalDetail(model, true);
      }
      try {
        const sheetName = "审批申请详情";
        const buffer = await workerFn(
          `${ location.origin }${ location.pathname }/excel_template/wxwork/wxw_oa_approval_detail.xlsx`,
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
 * 获取 审批申请详情 字段注释
 */
export async function getFieldCommentsWxwOaApprovalDetail(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsWxwOaApprovalDetail: Query["getFieldCommentsWxwOaApprovalDetail"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsWxwOaApprovalDetail {
          id,
          sp_no,
          sp_name,
          sp_status,
          sp_status_lbl,
          template_id,
          apply_time,
          apply_time_lbl,
          applyer_userid,
          batch_applyer_userid,
          raw_data,
          org_id,
          org_id_lbl,
        }
      }
    `,
    variables: {
    },
  }, opt);
  
  const field_comments = data.getFieldCommentsWxwOaApprovalDetail as WxwOaApprovalDetailFieldComment;
  
  return field_comments;
}

export function getPagePathWxwOaApprovalDetail() {
  return "/wxwork/wxw_oa_approval_detail";
}

/** 新增时的默认值 */
export async function getDefaultInputWxwOaApprovalDetail() {
  const usrStore = useUsrStore();
  const defaultInput: WxwOaApprovalDetailInput = {
    sp_status: 0,
    org_id: usrStore.loginInfo?.org_id,
  };
  return defaultInput;
}
