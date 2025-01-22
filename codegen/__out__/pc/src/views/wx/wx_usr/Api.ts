
import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  wxUsrQueryField,
} from "./Model";

async function setLblById(
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

export function intoInput(
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
 * 根据搜索条件查找小程序用户列表
 */
export async function findAll(
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
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个小程序用户
 */
export async function findOne(
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
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找小程序用户总数
 */
export async function findCount(
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
 * 创建小程序用户
 * @param {WxUsrInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: WxUsrInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxUsrId> {
  const ids = await creates(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建小程序用户
 */
export async function creates(
  inputs: WxUsrInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<WxUsrId[]> {
  inputs = inputs.map(intoInput);
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
 * 根据 id 修改小程序用户
 */
export async function updateById(
  id: WxUsrId,
  input: WxUsrInput,
  opt?: GqlOpt,
): Promise<WxUsrId> {
  input = intoInput(input);
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
 * 根据 id 查找小程序用户
 */
export async function findById(
  id: WxUsrId,
  opt?: GqlOpt,
) {
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
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除小程序用户
 */
export async function deleteByIds(
  ids: WxUsrId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 还原小程序用户
 */
export async function revertByIds(
  ids: WxUsrId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 彻底删除小程序用户
 */
export async function forceDeleteByIds(
  ids: WxUsrId[],
  opt?: GqlOpt,
) {
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
  const res = data.findAllUsr;
  return res;
}

export async function getUsrList() {
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
 * 下载小程序用户导入模板
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
          getFieldCommentsWxUsr {
            lbl
            usr_id_lbl
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
export function useExportExcel() {
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
          query($search: WxUsrSearch, $sort: [SortInput!]) {
            findAllWxUsr(search: $search, page: null, sort: $sort) {
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
          sort,
        },
      }, opt);
      for (const model of data.findAllWxUsr) {
        await setLblById(model, true);
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
 * 批量导入小程序用户
 */
export async function importModels(
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
  return "/wx/wx_usr";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: WxUsrInput = {
    gender: 0,
  };
  return defaultInput;
}
