
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  wxUsrQueryField,
} from "./Model.ts";

export async function setLblByIdWxUsr(
  model?: WxUsrModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
  
  // 头像
  if (model.avatar_img) {
    model.avatar_img_lbl = location.origin + getImgUrl({
      id: model.avatar_img,
      height: 100,
    });
  }
}

export function intoInputWxUsr(
  model?: WxUsrInput,
) {
  const input: WxUsrInput = {
    // ID
    id: model?.id,
    // 名称
    lbl: model?.lbl,
    // 用户
    usr_id: model?.usr_id,
    usr_id_lbl: model?.usr_id_lbl,
    // 开发者ID
    appid: model?.appid,
    // 昵称
    nick_name: model?.nick_name,
    // 头像
    avatar_img: model?.avatar_img,
    // 手机
    mobile: model?.mobile,
    // 小程序用户唯一标识
    openid: model?.openid,
    // 用户统一标识
    unionid: model?.unionid,
    // 性别
    gender: model?.gender,
    gender_lbl: model?.gender_lbl,
    // 城市
    city: model?.city,
    // 省份
    province: model?.province,
    // 国家
    country: model?.country,
    // 语言
    language: model?.language,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找 小程序用户 列表
 */
export async function findAllWxUsr(
  search?: WxUsrSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllWxUsr: WxUsrModel[];
  } = await query({
    query: `
      query($search: WxUsrSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllWxUsr(search: $search, page: $page, sort: $sort) {
          ${ wxUsrQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllWxUsr;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxUsr(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 小程序用户
 */
export async function findOneWxUsr(
  search?: WxUsrSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneWxUsr?: WxUsrModel;
  } = await query({
    query: `
      query($search: WxUsrSearch, $sort: [SortInput!]) {
        findOneWxUsr(search: $search, sort: $sort) {
          ${ wxUsrQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneWxUsr;
  
  await setLblByIdWxUsr(model);
  
  return model;
}

/**
 * 根据条件查找第一个 小程序用户, 如果不存在则抛错
 */
export async function findOneOkWxUsr(
  search?: WxUsrSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkWxUsr?: WxUsrModel;
  } = await query({
    query: `
      query($search: WxUsrSearch, $sort: [SortInput!]) {
        findOneOkWxUsr(search: $search, sort: $sort) {
          ${ wxUsrQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkWxUsr;
  
  await setLblByIdWxUsr(model);
  
  return model;
}

/**
 * 根据搜索条件查找 小程序用户 总数
 */
export async function findCountWxUsr(
  search?: WxUsrSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountWxUsr: Query["findCountWxUsr"];
  } = await query({
    query: /* GraphQL */ `
      query($search: WxUsrSearch) {
        findCountWxUsr(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountWxUsr;
  return count;
}

/**
 * 创建 小程序用户
 */
export async function createWxUsr(
  input: WxUsrInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxUsrId> {
  const ids = await createsWxUsr(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 小程序用户
 */
export async function createsWxUsr(
  inputs: WxUsrInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxUsrId[]> {
  inputs = inputs.map(intoInputWxUsr);
  const data: {
    createsWxUsr: Mutation["createsWxUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [WxUsrInput!]!, $unique_type: UniqueType) {
        createsWxUsr(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsWxUsr;
  return ids;
}

/**
 * 根据 id 修改 小程序用户
 */
export async function updateByIdWxUsr(
  id: WxUsrId,
  input: WxUsrInput,
  opt?: GqlOpt,
): Promise<WxUsrId> {
  input = intoInputWxUsr(input);
  const data: {
    updateByIdWxUsr: Mutation["updateByIdWxUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: WxUsrId!, $input: WxUsrInput!) {
        updateByIdWxUsr(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: WxUsrId = data.updateByIdWxUsr;
  return id2;
}

/**
 * 根据 id 查找 小程序用户
 */
export async function findByIdWxUsr(
  id: WxUsrId,
  opt?: GqlOpt,
): Promise<WxUsrModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdWxUsr?: WxUsrModel;
  } = await query({
    query: `
      query($id: WxUsrId!) {
        findByIdWxUsr(id: $id) {
          ${ wxUsrQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdWxUsr;
  
  await setLblByIdWxUsr(model);
  
  return model;
}

/**
 * 根据 id 查找 小程序用户, 如果不存在则抛错
 */
export async function findByIdOkWxUsr(
  id: WxUsrId,
  opt?: GqlOpt,
): Promise<WxUsrModel> {
  
  const data: {
    findByIdOkWxUsr: WxUsrModel;
  } = await query({
    query: `
      query($id: WxUsrId!) {
        findByIdOkWxUsr(id: $id) {
          ${ wxUsrQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkWxUsr;
  
  await setLblByIdWxUsr(model);
  
  return model;
}

/**
 * 根据 ids 查找 小程序用户
 */
export async function findByIdsWxUsr(
  ids: WxUsrId[],
  opt?: GqlOpt,
): Promise<WxUsrModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsWxUsr: WxUsrModel[];
  } = await query({
    query: `
      query($ids: [WxUsrId!]!) {
        findByIdsWxUsr(ids: $ids) {
          ${ wxUsrQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsWxUsr;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxUsr(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 小程序用户, 出现查询不到的 id 则报错
 */
export async function findByIdsOkWxUsr(
  ids: WxUsrId[],
  opt?: GqlOpt,
): Promise<WxUsrModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkWxUsr: WxUsrModel[];
  } = await query({
    query: `
      query($ids: [WxUsrId!]!) {
        findByIdsOkWxUsr(ids: $ids) {
          ${ wxUsrQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkWxUsr;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdWxUsr(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 小程序用户
 */
export async function deleteByIdsWxUsr(
  ids: WxUsrId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsWxUsr: Mutation["deleteByIdsWxUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxUsrId!]!) {
        deleteByIdsWxUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsWxUsr;
  return res;
}

/**
 * 根据 ids 还原 小程序用户
 */
export async function revertByIdsWxUsr(
  ids: WxUsrId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsWxUsr: Mutation["revertByIdsWxUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxUsrId!]!) {
        revertByIdsWxUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsWxUsr;
  return res;
}

/**
 * 根据 ids 彻底删除 小程序用户
 */
export async function forceDeleteByIdsWxUsr(
  ids: WxUsrId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsWxUsr: Mutation["forceDeleteByIdsWxUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [WxUsrId!]!) {
        forceDeleteByIdsWxUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsWxUsr;
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
 * 下载 小程序用户 导入模板
 */
export function useDownloadImportTemplateWxUsr() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsWxUsr {
            lbl
            usr_id_lbl
            appid
            nick_name
            avatar_img
            mobile
            openid
            unionid
            gender_lbl
            city
            province
            country
            language
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
      const sheetName = "小程序用户";
      const buffer = await workerFn(
        `${ location.origin }/import_template/wx/wx_usr.xlsx`,
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
export function useExportExcelWxUsr() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: WxUsrSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: WxUsrSearch, $page: PageInput, , $sort: [SortInput!]) {
            findAllWxUsr(search: $search, page: $page, sort: $sort) {
              ${ wxUsrQueryField }
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
      for (const model of data.findAllWxUsr) {
        await setLblByIdWxUsr(model, true);
      }
      try {
        const sheetName = "小程序用户";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/wx/wx_usr.xlsx`,
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
 * 批量导入 小程序用户
 */
export async function importModelsWxUsr(
  inputs: WxUsrInput[],
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
      await createsWxUsr(
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
 * 获取 小程序用户 字段注释
 */
export async function getFieldCommentsWxUsr(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsWxUsr: Query["getFieldCommentsWxUsr"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsWxUsr {
          id,
          lbl,
          usr_id,
          usr_id_lbl,
          appid,
          nick_name,
          avatar_img,
          mobile,
          openid,
          unionid,
          gender,
          gender_lbl,
          city,
          province,
          country,
          language,
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
  
  const field_comments = data.getFieldCommentsWxUsr as WxUsrFieldComment;
  
  return field_comments;
}

export function getPagePathWxUsr() {
  return "/wx/wx_usr";
}

/** 新增时的默认值 */
export async function getDefaultInputWxUsr() {
  const defaultInput: WxUsrInput = {
    gender: 0,
  };
  return defaultInput;
}
