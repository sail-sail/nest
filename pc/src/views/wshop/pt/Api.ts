
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  ptQueryField,
} from "./Model.ts";

async function setLblById(
  model?: PtModel | null,
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
  
  // 价格
  if (!isExcelExport) {
    model.price_lbl = new Intl.NumberFormat(getLocale(), {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(new Decimal(model.price ?? 0).toNumber());
    model.price = new Decimal(model.price ?? 0);
    model.price.toString = () => model.price_lbl;
  } else {
    model.price_lbl = new Decimal(model.price ?? 0).toFixed(2);
  }
  
  // 原价
  if (!isExcelExport) {
    model.original_price_lbl = new Intl.NumberFormat(getLocale(), {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(new Decimal(model.original_price ?? 0).toNumber());
    model.original_price = new Decimal(model.original_price ?? 0);
    model.original_price.toString = () => model.original_price_lbl;
  } else {
    model.original_price_lbl = new Decimal(model.original_price ?? 0).toFixed(2);
  }
  
  // 详情顶部图片
  if (model.detail_top_img) {
    model.detail_top_img_lbl = location.origin + getImgUrl({
      id: model.detail_top_img,
      height: 100,
    });
  }
  
  // 详情底部图片
  if (model.detail_bottom_img) {
    model.detail_bottom_img_lbl = location.origin + getImgUrl({
      id: model.detail_bottom_img,
      height: 100,
    });
  }
}

export function intoInputPt(
  model?: PtInput,
) {
  const input: PtInput = {
    // ID
    id: model?.id,
    // 图标
    img: model?.img,
    // 名称
    lbl: model?.lbl,
    // 产品类别
    pt_type_ids: model?.pt_type_ids,
    pt_type_ids_lbl: model?.pt_type_ids_lbl,
    // 价格
    price: model?.price,
    // 原价
    original_price: model?.original_price,
    // 单位
    unit: model?.unit,
    // 新品
    is_new: model?.is_new,
    is_new_lbl: model?.is_new_lbl,
    // 简介
    introduct: model?.introduct,
    // 锁定
    is_locked: model?.is_locked,
    is_locked_lbl: model?.is_locked_lbl,
    // 启用
    is_enabled: model?.is_enabled,
    is_enabled_lbl: model?.is_enabled_lbl,
    // 排序
    order_by: model?.order_by,
    // 详情
    detail: model?.detail,
    // 详情顶部图片
    detail_top_img: model?.detail_top_img,
    // 详情底部图片
    detail_bottom_img: model?.detail_bottom_img,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找 产品 列表
 */
export async function findAllPt(
  search?: PtSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllPt: PtModel[];
  } = await query({
    query: `
      query($search: PtSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllPt(search: $search, page: $page, sort: $sort) {
          ${ ptQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllPt;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 产品
 */
export async function findOnePt(
  search?: PtSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOnePt?: PtModel;
  } = await query({
    query: `
      query($search: PtSearch, $sort: [SortInput!]) {
        findOnePt(search: $search, sort: $sort) {
          ${ ptQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOnePt;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据条件查找第一个 产品, 如果不存在则抛错
 */
export async function findOneOkPt(
  search?: PtSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkPt?: PtModel;
  } = await query({
    query: `
      query($search: PtSearch, $sort: [SortInput!]) {
        findOneOkPt(search: $search, sort: $sort) {
          ${ ptQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkPt;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据搜索条件查找 产品 总数
 */
export async function findCountPt(
  search?: PtSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountPt: Query["findCountPt"];
  } = await query({
    query: /* GraphQL */ `
      query($search: PtSearch) {
        findCountPt(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountPt;
  return count;
}

/**
 * 创建 产品
 */
export async function createPt(
  input: PtInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<PtId> {
  const ids = await createsPt(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 产品
 */
export async function createsPt(
  inputs: PtInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<PtId[]> {
  inputs = inputs.map(intoInputPt);
  const data: {
    createsPt: Mutation["createsPt"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [PtInput!]!, $unique_type: UniqueType) {
        createsPt(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsPt;
  return ids;
}

/**
 * 根据 id 修改 产品
 */
export async function updateByIdPt(
  id: PtId,
  input: PtInput,
  opt?: GqlOpt,
): Promise<PtId> {
  input = intoInputPt(input);
  const data: {
    updateByIdPt: Mutation["updateByIdPt"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: PtId!, $input: PtInput!) {
        updateByIdPt(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: PtId = data.updateByIdPt;
  return id2;
}

/**
 * 根据 id 查找 产品
 */
export async function findByIdPt(
  id: PtId,
  opt?: GqlOpt,
): Promise<PtModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdPt?: PtModel;
  } = await query({
    query: `
      query($id: PtId!) {
        findByIdPt(id: $id) {
          ${ ptQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdPt;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据 id 查找 产品, 如果不存在则抛错
 */
export async function findByIdOkPt(
  id: PtId,
  opt?: GqlOpt,
): Promise<PtModel> {
  
  const data: {
    findByIdOkPt: PtModel;
  } = await query({
    query: `
      query($id: PtId!) {
        findByIdOkPt(id: $id) {
          ${ ptQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkPt;
  
  await setLblById(model);
  
  return model;
}

/**
 * 根据 ids 查找 产品
 */
export async function findByIdsPt(
  ids: PtId[],
  opt?: GqlOpt,
): Promise<PtModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsPt: PtModel[];
  } = await query({
    query: `
      query($ids: [PtId!]!) {
        findByIdsPt(ids: $ids) {
          ${ ptQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsPt;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 产品, 出现查询不到的 id 则报错
 */
export async function findByIdsOkPt(
  ids: PtId[],
  opt?: GqlOpt,
): Promise<PtModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkPt: PtModel[];
  } = await query({
    query: `
      query($ids: [PtId!]!) {
        findByIdsOkPt(ids: $ids) {
          ${ ptQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkPt;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 产品
 */
export async function deleteByIdsPt(
  ids: PtId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsPt: Mutation["deleteByIdsPt"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [PtId!]!) {
        deleteByIdsPt(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsPt;
  return res;
}

/**
 * 根据 ids 启用或禁用 产品
 */
export async function enableByIdsPt(
  ids: PtId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    enableByIdsPt: Mutation["enableByIdsPt"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [PtId!]!, $is_enabled: Int!) {
        enableByIdsPt(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsPt;
  return res;
}

/**
 * 根据 ids 锁定或解锁 产品
 */
export async function lockByIdsPt(
  ids: PtId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    lockByIdsPt: Mutation["lockByIdsPt"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [PtId!]!, $is_locked: Int!) {
        lockByIdsPt(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsPt;
  return res;
}

/**
 * 根据 ids 还原 产品
 */
export async function revertByIdsPt(
  ids: PtId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsPt: Mutation["revertByIdsPt"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [PtId!]!) {
        revertByIdsPt(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsPt;
  return res;
}

/**
 * 根据 ids 彻底删除 产品
 */
export async function forceDeleteByIdsPt(
  ids: PtId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsPt: Mutation["forceDeleteByIdsPt"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [PtId!]!) {
        forceDeleteByIdsPt(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsPt;
  return res;
}

export async function findAllPtType(
  search?: PtTypeSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllPtType: PtTypeModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: PtTypeSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllPtType(search: $search, page: $page, sort: $sort) {
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
  const pt_type_models = data.findAllPtType;
  return pt_type_models;
}

export async function getListPtType() {
  const data = await findAllPtType(
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
 * 下载 产品 导入模板
 */
export function useDownloadImportTemplatePt() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsPt {
            img
            lbl
            pt_type_ids_lbl
            price
            original_price
            unit
            is_new_lbl
            introduct
            order_by
            detail
            detail_top_img
            detail_bottom_img
            rem
          }
          findAllPtType {
            id
            lbl
          }
          getDict(codes: [
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
      const sheetName = "产品";
      const buffer = await workerFn(
        `${ location.origin }/import_template/wshop/pt.xlsx`,
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
export function useExportExcelPt() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: PtSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: PtSearch, $sort: [SortInput!]) {
            findAllPt(search: $search, page: null, sort: $sort) {
              ${ ptQueryField }
            }
            findAllPtType {
              lbl
            }
            getDict(codes: [
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
      for (const model of data.findAllPt) {
        await setLblById(model, true);
      }
      try {
        const sheetName = "产品";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/wshop/pt.xlsx`,
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
 * 批量导入 产品
 */
export async function importModelsPt(
  inputs: PtInput[],
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
      await createsPt(
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
 * 查找 产品 order_by 字段的最大值
 */
export async function findLastOrderByPt(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByPt: Query["findLastOrderByPt"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByPt
      }
    `,
  }, opt);
  const res = data.findLastOrderByPt;
  return res;
}

export function getPagePathPt() {
  return "/wshop/pt";
}

/** 新增时的默认值 */
export async function getDefaultInputPt() {
  const defaultInput: PtInput = {
    price: new Decimal(0.00),
    original_price: new Decimal(0.00),
    unit: "次",
    is_new: 0,
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
