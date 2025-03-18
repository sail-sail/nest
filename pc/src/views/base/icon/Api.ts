
import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  iconQueryField,
} from "./Model";

async function setLblById(
  model?: IconModel | null,
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
  model?: IconInput,
) {
  const input: IconInput = {
    // ID
    id: model?.id,
    // 图标
    img: model?.img,
    // 编码
    code: model?.code,
    // 名称
    lbl: model?.lbl,
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
 * 根据搜索条件查找图标库列表
 */
export async function findAll(
  search?: IconSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllIcon: IconModel[];
  } = await query({
    query: `
      query($search: IconSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllIcon(search: $search, page: $page, sort: $sort) {
          ${ iconQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllIcon;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个图标库
 */
export async function findOne(
  search?: IconSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneIcon?: IconModel;
  } = await query({
    query: `
      query($search: IconSearch, $sort: [SortInput!]) {
        findOneIcon(search: $search, sort: $sort) {
          ${ iconQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneIcon;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找图标库总数
 */
export async function findCount(
  search?: IconSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountIcon: Query["findCountIcon"];
  } = await query({
    query: /* GraphQL */ `
      query($search: IconSearch) {
        findCountIcon(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountIcon;
  return count;
}

/**
 * 创建图标库
 * @param {IconInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: IconInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<IconId> {
  const ids = await creates(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建图标库
 */
export async function creates(
  inputs: IconInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<IconId[]> {
  inputs = inputs.map(intoInput);
  const data: {
    createsIcon: Mutation["createsIcon"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [IconInput!]!, $unique_type: UniqueType) {
        createsIcon(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsIcon;
  return ids;
}

/**
 * 根据 id 修改图标库
 */
export async function updateById(
  id: IconId,
  input: IconInput,
  opt?: GqlOpt,
): Promise<IconId> {
  input = intoInput(input);
  const data: {
    updateByIdIcon: Mutation["updateByIdIcon"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: IconId!, $input: IconInput!) {
        updateByIdIcon(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: IconId = data.updateByIdIcon;
  return id2;
}

/**
 * 根据 id 查找图标库
 */
export async function findById(
  id?: IconId,
  opt?: GqlOpt,
): Promise<IconModel | undefined> {
  if (!id) {
    return;
  }
  const data: {
    findByIdIcon?: IconModel;
  } = await query({
    query: `
      query($id: IconId!) {
        findByIdIcon(id: $id) {
          ${ iconQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdIcon;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 查找图标库
 */
export async function findByIds(
  ids: IconId[],
  opt?: GqlOpt,
): Promise<IconModel[]> {
  if (ids.length === 0) {
    return [ ];
  }
  opt = opt || { };
  opt.showErrMsg = false;
  let models: IconModel[] = [ ];
  try {
    const data: {
      findByIdsIcon: IconModel[];
    } = await query({
      query: `
        query($ids: [IconId!]!) {
          findByIdsIcon(ids: $ids) {
            ${ iconQueryField }
          }
        }
      `,
      variables: {
        ids,
      },
    }, opt);
    models = data.findByIdsIcon;
  } catch (_err) { /* empty */ }
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据 ids 删除图标库
 */
export async function deleteByIds(
  ids: IconId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsIcon: Mutation["deleteByIdsIcon"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [IconId!]!) {
        deleteByIdsIcon(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsIcon;
  return res;
}

/**
 * 根据 ids 启用或禁用图标库
 */
export async function enableByIds(
  ids: IconId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    enableByIdsIcon: Mutation["enableByIdsIcon"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [IconId!]!, $is_enabled: Int!) {
        enableByIdsIcon(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsIcon;
  return res;
}

/**
 * 根据 ids 还原图标库
 */
export async function revertByIds(
  ids: IconId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsIcon: Mutation["revertByIdsIcon"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [IconId!]!) {
        revertByIdsIcon(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsIcon;
  return res;
}

/**
 * 根据 ids 彻底删除图标库
 */
export async function forceDeleteByIds(
  ids: IconId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsIcon: Mutation["forceDeleteByIdsIcon"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [IconId!]!) {
        forceDeleteByIdsIcon(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsIcon;
  return res;
}

/**
 * 下载图标库导入模板
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
          getFieldCommentsIcon {
            img
            code
            lbl
            order_by
            rem
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "图标库";
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/icon.xlsx`,
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
    search?: IconSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: IconSearch, $sort: [SortInput!]) {
            findAllIcon(search: $search, page: null, sort: $sort) {
              ${ iconQueryField }
            }
            getDict(codes: [
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
      for (const model of data.findAllIcon) {
        await setLblById(model, true);
      }
      try {
        const sheetName = "图标库";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/base/icon.xlsx`,
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
 * 批量导入图标库
 */
export async function importModels(
  inputs: IconInput[],
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
 * 查找 图标库 order_by 字段的最大值
 */
export async function findLastOrderBy(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByIcon: Query["findLastOrderByIcon"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByIcon
      }
    `,
  }, opt);
  const res = data.findLastOrderByIcon;
  return res;
}

export function getPagePath() {
  return "/base/icon";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: IconInput = {
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
