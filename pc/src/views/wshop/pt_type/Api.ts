
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  ptTypeQueryField,
} from "./Model.ts";

async function setLblById(
  model?: PtTypeModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
  
  // 图标
  if (model.img) {
    model.img_lbl = location.origin + getImgUrl({
      id: model.img,
      height: 100,
    });
  }
}

export function intoInputPtType(
  model?: PtTypeInput,
) {
  const input: PtTypeInput = {
    // ID
    id: model?.id,
    // 图标
    img: model?.img,
    // 名称
    lbl: model?.lbl,
    // 首页显示
    is_home: model?.is_home,
    is_home_lbl: model?.is_home_lbl,
    // 推荐
    is_recommend: model?.is_recommend,
    is_recommend_lbl: model?.is_recommend_lbl,
    // 锁定
    is_locked: model?.is_locked,
    is_locked_lbl: model?.is_locked_lbl,
    // 启用
    is_enabled: model?.is_enabled,
    is_enabled_lbl: model?.is_enabled_lbl,
    // 排序
    order_by: model?.order_by,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找 产品类别 列表
 */
export async function findAllPtType(
  search?: PtTypeSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllPtType: PtTypeModel[];
  } = await query({
    query: `
      query($search: PtTypeSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllPtType(search: $search, page: $page, sort: $sort) {
          ${ ptTypeQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllPtType;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 产品类别
 */
export async function findOnePtType(
  search?: PtTypeSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOnePtType?: PtTypeModel;
  } = await query({
    query: `
      query($search: PtTypeSearch, $sort: [SortInput!]) {
        findOnePtType(search: $search, sort: $sort) {
          ${ ptTypeQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOnePtType;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据条件查找第一个 产品类别, 如果不存在则抛错
 */
export async function findOneOkPtType(
  search?: PtTypeSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkPtType?: PtTypeModel;
  } = await query({
    query: `
      query($search: PtTypeSearch, $sort: [SortInput!]) {
        findOneOkPtType(search: $search, sort: $sort) {
          ${ ptTypeQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkPtType;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据搜索条件查找 产品类别 总数
 */
export async function findCountPtType(
  search?: PtTypeSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountPtType: Query["findCountPtType"];
  } = await query({
    query: /* GraphQL */ `
      query($search: PtTypeSearch) {
        findCountPtType(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountPtType;
  return count;
}

/**
 * 创建 产品类别
 */
export async function createPtType(
  input: PtTypeInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<PtTypeId> {
  const ids = await createsPtType(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 产品类别
 */
export async function createsPtType(
  inputs: PtTypeInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<PtTypeId[]> {
  inputs = inputs.map(intoInputPtType);
  const data: {
    createsPtType: Mutation["createsPtType"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [PtTypeInput!]!, $unique_type: UniqueType) {
        createsPtType(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsPtType;
  return ids;
}

/**
 * 根据 id 修改 产品类别
 */
export async function updateByIdPtType(
  id: PtTypeId,
  input: PtTypeInput,
  opt?: GqlOpt,
): Promise<PtTypeId> {
  input = intoInputPtType(input);
  const data: {
    updateByIdPtType: Mutation["updateByIdPtType"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: PtTypeId!, $input: PtTypeInput!) {
        updateByIdPtType(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: PtTypeId = data.updateByIdPtType;
  return id2;
}

/**
 * 根据 id 查找 产品类别
 */
export async function findByIdPtType(
  id: PtTypeId,
  opt?: GqlOpt,
): Promise<PtTypeModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdPtType?: PtTypeModel;
  } = await query({
    query: `
      query($id: PtTypeId!) {
        findByIdPtType(id: $id) {
          ${ ptTypeQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdPtType;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据 id 查找 产品类别, 如果不存在则抛错
 */
export async function findByIdOkPtType(
  id: PtTypeId,
  opt?: GqlOpt,
): Promise<PtTypeModel> {
  
  const data: {
    findByIdOkPtType: PtTypeModel;
  } = await query({
    query: `
      query($id: PtTypeId!) {
        findByIdOkPtType(id: $id) {
          ${ ptTypeQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkPtType;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据 ids 查找 产品类别
 */
export async function findByIdsPtType(
  ids: PtTypeId[],
  opt?: GqlOpt,
): Promise<PtTypeModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsPtType: PtTypeModel[];
  } = await query({
    query: `
      query($ids: [PtTypeId!]!) {
        findByIdsPtType(ids: $ids) {
          ${ ptTypeQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsPtType;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 产品类别, 出现查询不到的 id 则报错
 */
export async function findByIdsOkPtType(
  ids: PtTypeId[],
  opt?: GqlOpt,
): Promise<PtTypeModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkPtType: PtTypeModel[];
  } = await query({
    query: `
      query($ids: [PtTypeId!]!) {
        findByIdsOkPtType(ids: $ids) {
          ${ ptTypeQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkPtType;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 产品类别
 */
export async function deleteByIdsPtType(
  ids: PtTypeId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsPtType: Mutation["deleteByIdsPtType"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [PtTypeId!]!) {
        deleteByIdsPtType(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsPtType;
  return res;
}

/**
 * 根据 ids 启用或禁用 产品类别
 */
export async function enableByIdsPtType(
  ids: PtTypeId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    enableByIdsPtType: Mutation["enableByIdsPtType"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [PtTypeId!]!, $is_enabled: Int!) {
        enableByIdsPtType(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsPtType;
  return res;
}

/**
 * 根据 ids 锁定或解锁 产品类别
 */
export async function lockByIdsPtType(
  ids: PtTypeId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    lockByIdsPtType: Mutation["lockByIdsPtType"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [PtTypeId!]!, $is_locked: Int!) {
        lockByIdsPtType(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsPtType;
  return res;
}

/**
 * 根据 ids 还原 产品类别
 */
export async function revertByIdsPtType(
  ids: PtTypeId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsPtType: Mutation["revertByIdsPtType"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [PtTypeId!]!) {
        revertByIdsPtType(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsPtType;
  return res;
}

/**
 * 根据 ids 彻底删除 产品类别
 */
export async function forceDeleteByIdsPtType(
  ids: PtTypeId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsPtType: Mutation["forceDeleteByIdsPtType"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [PtTypeId!]!) {
        forceDeleteByIdsPtType(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsPtType;
  return res;
}

/**
 * 下载 产品类别 导入模板
 */
export function useDownloadImportTemplatePtType() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsPtType {
            img
            lbl
            is_home_lbl
            is_recommend_lbl
            order_by
            rem
          }
          getDict(codes: [
            "yes_no",
            "yes_no",
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
      const sheetName = "产品类别";
      const buffer = await workerFn(
        `${ location.origin }/import_template/wshop/pt_type.xlsx`,
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
export function useExportExcelPtType() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: PtTypeSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: PtTypeSearch, $sort: [SortInput!]) {
            findAllPtType(search: $search, page: null, sort: $sort) {
              ${ ptTypeQueryField }
            }
            getDict(codes: [
              "yes_no",
              "yes_no",
              "is_locked",
              "is_enabled",
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
      for (const model of data.findAllPtType) {
        await setLblById(model, true);
      }
      try {
        const sheetName = "产品类别";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/wshop/pt_type.xlsx`,
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
 * 批量导入 产品类别
 */
export async function importModelsPtType(
  inputs: PtTypeInput[],
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
      await createsPtType(
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
 * 查找 产品类别 order_by 字段的最大值
 */
export async function findLastOrderByPtType(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByPtType: Query["findLastOrderByPtType"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByPtType
      }
    `,
  }, opt);
  const res = data.findLastOrderByPtType;
  return res;
}

export function getPagePathPtType() {
  return "/wshop/pt_type";
}

/** 新增时的默认值 */
export async function getDefaultInputPtType() {
  const defaultInput: PtTypeInput = {
    is_home: 1,
    is_recommend: 0,
    is_locked: 1,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
