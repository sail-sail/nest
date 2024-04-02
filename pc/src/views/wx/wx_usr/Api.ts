import {
  UniqueType,
} from "#/types";

import type {
  WxUsrId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import type {
  WxUsrSearch,
  WxUsrInput,
  WxUsrModel,
} from "./Model";

// 用户
import type {
  UsrSearch,
  UsrModel,
} from "@/views/base/usr/Model";

async function setLblById(
  model?: WxUsrModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
  model?: Record<string, any>,
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
    avatar_url: model?.avatar_url,
    // 手机
    mobile: model?.mobile,
    // 小程序用户唯一标识
    openid: model?.openid,
    // 小程序用户统一标识
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
 * @param {WxUsrSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
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
    query: /* GraphQL */ `
      query($search: WxUsrSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllWxUsr(search: $search, page: $page, sort: $sort) {
          id
          lbl
          usr_id
          usr_id_lbl
          nick_name
          avatar_url
          mobile
          openid
          unionid
          gender
          gender_lbl
          city
          province
          country
          language
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
  const models = data.findAllWxUsr;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个小程序用户
 * @param {WxUsrSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: WxUsrSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneWxUsr?: WxUsrModel;
  } = await query({
    query: /* GraphQL */ `
      query($search: WxUsrSearch, $sort: [SortInput!]) {
        findOneWxUsr(search: $search, sort: $sort) {
          id
          lbl
          usr_id
          usr_id_lbl
          nick_name
          avatar_url
          mobile
          openid
          unionid
          gender
          gender_lbl
          city
          province
          country
          language
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
  const model = data.findOneWxUsr;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找小程序用户总数
 * @param {WxUsrSearch} search?
 * @param {GqlOpt} opt?
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
  input = intoInput(input);
  const data: {
    createWxUsr: Mutation["createWxUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($input: WxUsrInput!, $unique_type: UniqueType) {
        createWxUsr(input: $input, unique_type: $unique_type)
      }
    `,
    variables: {
      input,
      unique_type,
    },
  }, opt);
  const id: WxUsrId = data.createWxUsr;
  return id;
}

/**
 * 根据 id 修改小程序用户
 * @param {WxUsrId} id
 * @param {WxUsrInput} input
 * @param {GqlOpt} opt?
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
 * @param {WxUsrId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: WxUsrId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdWxUsr?: WxUsrModel;
  } = await query({
    query: /* GraphQL */ `
      query($id: WxUsrId!) {
        findByIdWxUsr(id: $id) {
          id
          lbl
          usr_id
          usr_id_lbl
          nick_name
          avatar_url
          mobile
          openid
          unionid
          gender
          gender_lbl
          city
          province
          country
          language
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
  const model = data.findByIdWxUsr;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除小程序用户
 * @param {WxUsrId[]} ids
 * @param {GqlOpt} opt?
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
 * @param {WxUsrId[]} ids
 * @param {GqlOpt} opt?
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
 * @param {WxUsrId[]} ids
 * @param {GqlOpt} opt?
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
          getFieldCommentsWxUsr {
            lbl
            usr_id_lbl
            nick_name
            avatar_url
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
      const sheetName = await nsAsync("小程序用户");
      const buffer = await workerFn(
        `${ location.origin }/import_template/wx/wx_usr.xlsx`,
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
    search?: WxUsrSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: /* GraphQL */ `
          query($search: WxUsrSearch, $sort: [SortInput!]) {
            findAllWxUsr(search: $search, sort: $sort) {
              id
              lbl
              usr_id
              usr_id_lbl
              nick_name
              avatar_url
              mobile
              openid
              unionid
              gender
              gender_lbl
              city
              province
              country
              language
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
        const sheetName = await nsAsync("小程序用户");
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
 * @param {WxUsrInput[]} models
 */
export async function importModels(
  models: WxUsrInput[],
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
  const defaultInput: WxUsrInput = {
    gender: 0,
  };
  return defaultInput;
}
