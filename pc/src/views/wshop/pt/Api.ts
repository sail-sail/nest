import {
  UniqueType,
} from "#/types";

import type {
  PtId,
} from "@/typings/ids";

import Decimal from "decimal.js-light";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import type {
  PtSearch,
  PtInput,
  PtModel,
} from "./Model";

// 产品类别
import type {
  PtTypeSearch,
  PtTypeModel,
} from "@/views/wshop/pt_type/Model";

async function setLblById(
  model?: PtModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
  
  // 图标
  if (model.img) {
    (model as any).img_lbl = location.origin + getImgUrl({
      id: model.img,
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
    (model as any).detail_top_img_lbl = location.origin + getImgUrl({
      id: model.detail_top_img,
    });
  }
  
  // 详情底部图片
  if (model.detail_bottom_img) {
    (model as any).detail_bottom_img_lbl = location.origin + getImgUrl({
      id: model.detail_bottom_img,
    });
  }
}

export function intoInput(
  model?: Record<string, any>,
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
 * 根据搜索条件查找产品列表
 * @param {PtSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: PtSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllPt: PtModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: PtSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllPt(search: $search, page: $page, sort: $sort) {
          id
          img
          lbl
          pt_type_ids
          pt_type_ids_lbl
          price
          original_price
          unit
          is_new
          is_new_lbl
          introduct
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          order_by
          detail
          detail_top_img
          detail_bottom_img
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
  const models = data.findAllPt;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个产品
 * @param {PtSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: PtSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOnePt?: PtModel;
  } = await query({
    query: /* GraphQL */ `
      query($search: PtSearch, $sort: [SortInput!]) {
        findOnePt(search: $search, sort: $sort) {
          id
          img
          lbl
          pt_type_ids
          pt_type_ids_lbl
          price
          original_price
          unit
          is_new
          is_new_lbl
          introduct
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          order_by
          detail
          detail_top_img
          detail_bottom_img
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
  const model = data.findOnePt;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找产品总数
 * @param {PtSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
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
 * 创建产品
 * @param {PtInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: PtInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<PtId> {
  input = intoInput(input);
  const data: {
    createPt: Mutation["createPt"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($input: PtInput!, $unique_type: UniqueType) {
        createPt(input: $input, unique_type: $unique_type)
      }
    `,
    variables: {
      input,
      unique_type,
    },
  }, opt);
  const id: PtId = data.createPt;
  return id;
}

/**
 * 根据 id 修改产品
 * @param {PtId} id
 * @param {PtInput} input
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: PtId,
  input: PtInput,
  opt?: GqlOpt,
): Promise<PtId> {
  input = intoInput(input);
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
 * 根据 id 查找产品
 * @param {PtId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: PtId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdPt?: PtModel;
  } = await query({
    query: /* GraphQL */ `
      query($id: PtId!) {
        findByIdPt(id: $id) {
          id
          img
          lbl
          pt_type_ids
          pt_type_ids_lbl
          price
          original_price
          unit
          is_new
          is_new_lbl
          introduct
          is_locked
          is_locked_lbl
          is_enabled
          is_enabled_lbl
          order_by
          detail
          detail_top_img
          detail_bottom_img
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
  const model = data.findByIdPt;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除产品
 * @param {PtId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: PtId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 启用或禁用产品
 * @param {PtId[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
 */
export async function enableByIds(
  ids: PtId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
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
 * 根据 ids 锁定或解锁产品
 * @param {PtId[]} ids
 * @param {0 | 1} is_locked
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: PtId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
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
 * 根据 ids 还原产品
 * @param {PtId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: PtId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 彻底删除产品
 * @param {PtId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: PtId[],
  opt?: GqlOpt,
) {
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
  const res = data.findAllPtType;
  return res;
}

export async function getPtTypeList() {
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
      const sheetName = await nsAsync("产品");
      const buffer = await workerFn(
        `${ location.origin }/import_template/wshop/pt.xlsx`,
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
    search?: PtSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: /* GraphQL */ `
          query($search: PtSearch, $sort: [SortInput!]) {
            findAllPt(search: $search, sort: $sort) {
              id
              img
              lbl
              pt_type_ids
              pt_type_ids_lbl
              price
              original_price
              unit
              is_new
              is_new_lbl
              introduct
              is_locked
              is_locked_lbl
              is_enabled
              is_enabled_lbl
              order_by
              detail
              detail_top_img
              detail_bottom_img
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
        const sheetName = await nsAsync("产品");
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
 * @param {PtInput[]} models
 */
export async function importModels(
  models: PtInput[],
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

/**
 * 查找 产品 order_by 字段的最大值
 * @param {GqlOpt} opt?
 */
export async function findLastOrderBy(
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

/** 新增时的默认值 */
export async function getDefaultInput() {
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