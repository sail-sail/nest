
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  wxoUsrQueryField,
} from "./Model.ts";

export async function setLblByIdWxoUsr(
  model?: WxoUsrModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
  
  // 头像
  if (model.head_img) {
    model.head_img_lbl = location.origin + getImgUrl({
      id: model.head_img,
      height: 100,
    });
  }
}

export function intoInputWxoUsr(
  model?: WxoUsrInput,
) {
  const input: WxoUsrInput = {
    // ID
    id: model?.id,
    // 昵称
    lbl: model?.lbl,
    // 头像
    head_img: model?.head_img,
    // 绑定用户
    usr_id: model?.usr_id,
    usr_id_lbl: model?.usr_id_lbl,
    // 开发者ID
    appid: model?.appid,
    // 公众号用户唯一标识
    openid: model?.openid,
    // 用户统一标识
    unionid: model?.unionid,
    // 性别
    sex: model?.sex,
    sex_lbl: model?.sex_lbl,
    // 省份
    province: model?.province,
    // 城市
    city: model?.city,
    // 国家
    country: model?.country,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找 公众号用户 列表
 */
export async function findAllWxoUsr(
  search?: WxoUsrSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllWxoUsr: WxoUsrModel[];
  } = await query({
    query: `
      query($search: WxoUsrSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllWxoUsr(search: $search, page: $page, sort: $sort) {
          ${ wxoUsrQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllWxoUsr;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxoUsr(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 公众号用户
 */
export async function findOneWxoUsr(
  search?: WxoUsrSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneWxoUsr?: WxoUsrModel;
  } = await query({
    query: `
      query($search: WxoUsrSearch, $sort: [SortInput!]) {
        findOneWxoUsr(search: $search, sort: $sort) {
          ${ wxoUsrQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneWxoUsr;
  
  await setLblByIdWxoUsr(model);
  
  return model;
}

/**
 * 根据条件查找第一个 公众号用户, 如果不存在则抛错
 */
export async function findOneOkWxoUsr(
  search?: WxoUsrSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkWxoUsr?: WxoUsrModel;
  } = await query({
    query: `
      query($search: WxoUsrSearch, $sort: [SortInput!]) {
        findOneOkWxoUsr(search: $search, sort: $sort) {
          ${ wxoUsrQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkWxoUsr;
  
  await setLblByIdWxoUsr(model);
  
  return model;
}

/**
 * 根据搜索条件查找 公众号用户 总数
 */
export async function findCountWxoUsr(
  search?: WxoUsrSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountWxoUsr: Query["findCountWxoUsr"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxoUsrSearch) {
        findCountWxoUsr(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountWxoUsr;
  return count;
}

/**
 * 创建 公众号用户
 */
export async function createWxoUsr(
  input: WxoUsrInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxoUsrId> {
  const ids = await createsWxoUsr(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 公众号用户
 */
export async function createsWxoUsr(
  inputs: WxoUsrInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxoUsrId[]> {
  inputs = inputs.map(intoInputWxoUsr);
  const data: {
    createsWxoUsr: Mutation["createsWxoUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [WxoUsrInput!]!, $unique_type: UniqueType) {
        createsWxoUsr(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsWxoUsr;
  return ids;
}

/**
 * 根据 id 修改 公众号用户
 */
export async function updateByIdWxoUsr(
  id: WxoUsrId,
  input: WxoUsrInput,
  opt?: GqlOpt,
): Promise<WxoUsrId> {
  input = intoInputWxoUsr(input);
  const data: {
    updateByIdWxoUsr: Mutation["updateByIdWxoUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: WxoUsrId!, $input: WxoUsrInput!) {
        updateByIdWxoUsr(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: WxoUsrId = data.updateByIdWxoUsr;
  return id2;
}

/**
 * 根据 id 查找 公众号用户
 */
export async function findByIdWxoUsr(
  id: WxoUsrId,
  opt?: GqlOpt,
): Promise<WxoUsrModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdWxoUsr?: WxoUsrModel;
  } = await query({
    query: `
      query($id: WxoUsrId!) {
        findByIdWxoUsr(id: $id) {
          ${ wxoUsrQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdWxoUsr;
  
  await setLblByIdWxoUsr(model);
  
  return model;
}

/**
 * 根据 id 查找 公众号用户, 如果不存在则抛错
 */
export async function findByIdOkWxoUsr(
  id: WxoUsrId,
  opt?: GqlOpt,
): Promise<WxoUsrModel> {
  
  const data: {
    findByIdOkWxoUsr: WxoUsrModel;
  } = await query({
    query: `
      query($id: WxoUsrId!) {
        findByIdOkWxoUsr(id: $id) {
          ${ wxoUsrQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkWxoUsr;
  
  await setLblByIdWxoUsr(model);
  
  return model;
}

/**
 * 根据 ids 查找 公众号用户
 */
export async function findByIdsWxoUsr(
  ids: WxoUsrId[],
  opt?: GqlOpt,
): Promise<WxoUsrModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsWxoUsr: WxoUsrModel[];
  } = await query({
    query: `
      query($ids: [WxoUsrId!]!) {
        findByIdsWxoUsr(ids: $ids) {
          ${ wxoUsrQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsWxoUsr;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxoUsr(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 公众号用户, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxoUsr(
  ids: WxoUsrId[],
  opt?: GqlOpt,
): Promise<WxoUsrModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkWxoUsr: WxoUsrModel[];
  } = await query({
    query: `
      query($ids: [WxoUsrId!]!) {
        findByIdsOkWxoUsr(ids: $ids) {
          ${ wxoUsrQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkWxoUsr;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxoUsr(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 公众号用户
 */
export async function deleteByIdsWxoUsr(
  ids: WxoUsrId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsWxoUsr: Mutation["deleteByIdsWxoUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxoUsrId!]!) {
        deleteByIdsWxoUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsWxoUsr;
  return res;
}

/**
 * 根据 ids 还原 公众号用户
 */
export async function revertByIdsWxoUsr(
  ids: WxoUsrId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsWxoUsr: Mutation["revertByIdsWxoUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxoUsrId!]!) {
        revertByIdsWxoUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsWxoUsr;
  return res;
}

/**
 * 根据 ids 彻底删除 公众号用户
 */
export async function forceDeleteByIdsWxoUsr(
  ids: WxoUsrId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsWxoUsr: Mutation["forceDeleteByIdsWxoUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxoUsrId!]!) {
        forceDeleteByIdsWxoUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsWxoUsr;
  return res;
}

export async function findAllUsr(
  search?: UsrSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllUsr: UsrModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: UsrSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllUsr(search: $search, page: $page, sort: $sort) {
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
  const usr_models = data.findAllUsr;
  return usr_models;
}

export async function getListUsr() {
  const data = await findAllUsr(
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
 * 下载 公众号用户 导入模板
 */
export function useDownloadImportTemplateWxoUsr() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsWxoUsr {
            lbl
            head_img
            usr_id_lbl
            appid
            openid
            unionid
            sex_lbl
            province
            city
            country
            rem
          }
          findAllUsr {
            id
            lbl
          }
          getDict(codes: [
            "wx_usr_gender",
          ]) {
            code
            lbl
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "公众号用户";
      const buffer = await workerFn(
        `${ location.origin }/import_template/wx/wxo_usr.xlsx`,
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
export function useExportExcelWxoUsr() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: WxoUsrSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: WxoUsrSearch, $page: PageInput, , $sort: [SortInput!]) {
            findAllWxoUsr(search: $search, page: $page, sort: $sort) {
              ${ wxoUsrQueryField }
            }
            findAllUsr {
              lbl
            }
            getDict(codes: [
              "wx_usr_gender",
            ]) {
              code
              lbl
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
      for (const model of data.findAllWxoUsr) {
        await setLblByIdWxoUsr(model, true);
      }
      try {
        const sheetName = "公众号用户";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/wx/wxo_usr.xlsx`,
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
 * 批量导入 公众号用户
 */
export async function importModelsWxoUsr(
  inputs: WxoUsrInput[],
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
      await createsWxoUsr(
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
 * 获取 公众号用户 字段注释
 */
export async function getFieldCommentsWxoUsr(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsWxoUsr: Query["getFieldCommentsWxoUsr"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsWxoUsr {
          id,
          lbl,
          head_img,
          usr_id,
          usr_id_lbl,
          appid,
          openid,
          unionid,
          sex,
          sex_lbl,
          province,
          city,
          country,
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
  
  const field_comments = data.getFieldCommentsWxoUsr as WxoUsrFieldComment;
  
  return field_comments;
}

export function getPagePathWxoUsr() {
  return "/wx/wxo_usr";
}

/** 新增时的默认值 */
export async function getDefaultInputWxoUsr() {
  const defaultInput: WxoUsrInput = {
    sex: 0,
  };
  return defaultInput;
}
