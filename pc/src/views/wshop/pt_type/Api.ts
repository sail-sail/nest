
import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  ptTypeQueryField,
} from "./Model";

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

export function intoInput(
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
 * 根据搜索条件查找产品类别列表
 */
export async function findAll(
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
 * 根据条件查找第一个产品类别
 */
export async function findOne(
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
 * 根据搜索条件查找产品类别总数
 */
export async function findCount(
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
 * 创建产品类别
 * @param {PtTypeInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: PtTypeInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<PtTypeId> {
  const ids = await creates(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建产品类别
 */
export async function creates(
  inputs: PtTypeInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<PtTypeId[]> {
  inputs = inputs.map(intoInput);
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
 * 根据 id 修改产品类别
 */
export async function updateById(
  id: PtTypeId,
  input: PtTypeInput,
  opt?: GqlOpt,
): Promise<PtTypeId> {
  input = intoInput(input);
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
 * 根据 id 查找产品类别
 */
export async function findById(
  id?: PtTypeId,
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
 * 根据 ids 查找产品类别
 */
export async function findByIds(
  ids: PtTypeId[],
  opt?: GqlOpt,
): Promise<PtTypeModel[]> {
  if (ids.length === 0) {
    return [ ];
  }
  opt = opt || { };
  opt.showErrMsg = false;
  let models: PtTypeModel[] = [ ];
  try {
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
    models = data.findByIdsPtType;
  } catch (_err) { /* empty */ }
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据 ids 删除产品类别
 */
export async function deleteByIds(
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
 * 根据 ids 启用或禁用产品类别
 */
export async function enableByIds(
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
 * 根据 ids 锁定或解锁产品类别
 */
export async function lockByIds(
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
 * 根据 ids 还原产品类别
 */
export async function revertByIds(
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
 * 根据 ids 彻底删除产品类别
 */
export async function forceDeleteByIds(
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
 * 下载产品类别导入模板
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
export function useExportExcel() {
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
 * 批量导入产品类别
 */
export async function importModels(
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
 * 查找 产品类别 order_by 字段的最大值
 */
export async function findLastOrderBy(
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

export function getPagePath() {
  return "/wshop/pt_type";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: PtTypeInput = {
    is_home: 1,
    is_recommend: 0,
    is_locked: 1,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
