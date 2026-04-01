
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  processDefQueryField,
} from "./Model.ts";

import {
  findTreeMenu,
} from "@/views/base/menu/Api.ts";

export async function setLblByIdProcessDef(
  model?: ProcessDefModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputProcessDef(
  model?: ProcessDefInput | null,
) {
  const input: ProcessDefInput = {
    // ID
    id: model?.id,
    // 编码
    code: model?.code,
    // 流程名称
    lbl: model?.lbl,
    // 关联页面
    menu_id: model?.menu_id,
    menu_id_lbl: model?.menu_id_lbl,
    // 当前生效版本
    current_revision_id: model?.current_revision_id,
    current_revision_id_lbl: model?.current_revision_id_lbl,
    // 启用
    is_enabled: model?.is_enabled,
    is_enabled_lbl: model?.is_enabled_lbl,
    // 排序
    order_by: model?.order_by != null ? Number(model?.order_by || 0) : undefined,
    // 流程描述
    description: model?.description,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找 流程定义 列表
 */
export async function findAllProcessDef(
  search?: ProcessDefSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllProcessDef: ProcessDefModel[];
  } = await query({
    query: `
      query($search: ProcessDefSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllProcessDef(search: $search, page: $page, sort: $sort) {
          ${ processDefQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllProcessDef;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdProcessDef(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 流程定义
 */
export async function findOneProcessDef(
  search?: ProcessDefSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneProcessDef?: ProcessDefModel;
  } = await query({
    query: `
      query($search: ProcessDefSearch, $sort: [SortInput!]) {
        findOneProcessDef(search: $search, sort: $sort) {
          ${ processDefQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneProcessDef;
  
  await setLblByIdProcessDef(model);
  
  return model;
}

/**
 * 根据条件查找第一个 流程定义, 如果不存在则抛错
 */
export async function findOneOkProcessDef(
  search?: ProcessDefSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkProcessDef?: ProcessDefModel;
  } = await query({
    query: `
      query($search: ProcessDefSearch, $sort: [SortInput!]) {
        findOneOkProcessDef(search: $search, sort: $sort) {
          ${ processDefQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkProcessDef;
  
  await setLblByIdProcessDef(model);
  
  return model;
}

/**
 * 根据搜索条件查找 流程定义 总数
 */
export async function findCountProcessDef(
  search?: ProcessDefSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountProcessDef: Query["findCountProcessDef"];
  } = await query({
    query: /* GraphQL */ `
      query($search: ProcessDefSearch) {
        findCountProcessDef(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountProcessDef;
  return count;
}

/**
 * 创建 流程定义
 */
export async function createProcessDef(
  input: ProcessDefInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<ProcessDefId> {
  const ids = await createsProcessDef(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 流程定义
 */
export async function createsProcessDef(
  inputs: ProcessDefInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<ProcessDefId[]> {
  inputs = inputs.map(intoInputProcessDef);
  const data: {
    createsProcessDef: Mutation["createsProcessDef"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [ProcessDefInput!]!, $unique_type: UniqueType) {
        createsProcessDef(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsProcessDef;
  return ids;
}

/**
 * 根据 id 修改 流程定义
 */
export async function updateByIdProcessDef(
  id: ProcessDefId,
  input: ProcessDefInput,
  opt?: GqlOpt,
): Promise<ProcessDefId> {
  input = intoInputProcessDef(input);
  const data: {
    updateByIdProcessDef: Mutation["updateByIdProcessDef"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: ProcessDefId!, $input: ProcessDefInput!) {
        updateByIdProcessDef(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: ProcessDefId = data.updateByIdProcessDef;
  return id2;
}

/**
 * 根据 id 查找 流程定义
 */
export async function findByIdProcessDef(
  id: ProcessDefId,
  opt?: GqlOpt,
): Promise<ProcessDefModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdProcessDef?: ProcessDefModel;
  } = await query({
    query: `
      query($id: ProcessDefId!) {
        findByIdProcessDef(id: $id) {
          ${ processDefQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdProcessDef;
  
  await setLblByIdProcessDef(model);
  
  return model;
}

/**
 * 根据 id 查找 流程定义, 如果不存在则抛错
 */
export async function findByIdOkProcessDef(
  id: ProcessDefId,
  opt?: GqlOpt,
): Promise<ProcessDefModel> {
  
  const data: {
    findByIdOkProcessDef: ProcessDefModel;
  } = await query({
    query: `
      query($id: ProcessDefId!) {
        findByIdOkProcessDef(id: $id) {
          ${ processDefQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkProcessDef;
  
  await setLblByIdProcessDef(model);
  
  return model;
}

/**
 * 根据 ids 查找 流程定义
 */
export async function findByIdsProcessDef(
  ids: ProcessDefId[],
  opt?: GqlOpt,
): Promise<ProcessDefModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsProcessDef: ProcessDefModel[];
  } = await query({
    query: `
      query($ids: [ProcessDefId!]!) {
        findByIdsProcessDef(ids: $ids) {
          ${ processDefQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsProcessDef;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdProcessDef(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 流程定义, 出现查询不到的 id 则报错
 */
export async function findByIdsOkProcessDef(
  ids: ProcessDefId[],
  opt?: GqlOpt,
): Promise<ProcessDefModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkProcessDef: ProcessDefModel[];
  } = await query({
    query: `
      query($ids: [ProcessDefId!]!) {
        findByIdsOkProcessDef(ids: $ids) {
          ${ processDefQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkProcessDef;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdProcessDef(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 流程定义
 */
export async function deleteByIdsProcessDef(
  ids: ProcessDefId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsProcessDef: Mutation["deleteByIdsProcessDef"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ProcessDefId!]!) {
        deleteByIdsProcessDef(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsProcessDef;
  return res;
}

/**
 * 根据 ids 启用或禁用 流程定义
 */
export async function enableByIdsProcessDef(
  ids: ProcessDefId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    enableByIdsProcessDef: Mutation["enableByIdsProcessDef"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ProcessDefId!]!, $is_enabled: Int!) {
        enableByIdsProcessDef(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsProcessDef;
  return res;
}

/**
 * 根据 ids 还原 流程定义
 */
export async function revertByIdsProcessDef(
  ids: ProcessDefId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsProcessDef: Mutation["revertByIdsProcessDef"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ProcessDefId!]!) {
        revertByIdsProcessDef(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsProcessDef;
  return res;
}

/**
 * 根据 ids 彻底删除 流程定义
 */
export async function forceDeleteByIdsProcessDef(
  ids: ProcessDefId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsProcessDef: Mutation["forceDeleteByIdsProcessDef"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ProcessDefId!]!) {
        forceDeleteByIdsProcessDef(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsProcessDef;
  return res;
}

export async function findAllMenu(
  search?: MenuSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllMenu: MenuModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: MenuSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllMenu(search: $search, page: $page, sort: $sort) {
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
  const menu_models = data.findAllMenu;
  return menu_models;
}

export async function getListMenu() {
  const data = await findAllMenu(
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

export async function getTreeMenu() {
  const data = await findTreeMenu(
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
 * 下载 流程定义 导入模板
 */
export function useDownloadImportTemplateProcessDef() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsProcessDef {
            lbl
            menu_id_lbl
            order_by
            description
            rem
          }
          findAllMenu {
            id
            lbl
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "流程定义";
      const buffer = await workerFn(
        `${ location.origin }/import_template/bpm/process_def.xlsx`,
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
export function useExportExcelProcessDef() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: ProcessDefSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: ProcessDefSearch, $page: PageInput, , $sort: [SortInput!]) {
            findAllProcessDef(search: $search, page: $page, sort: $sort) {
              ${ processDefQueryField }
            }
            findAllMenu {
              lbl
            }
            findAllProcessRevision {
              lbl
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
          page: {
            isResultLimit: false,
          },
          sort,
        },
      }, opt);
      for (const model of data.findAllProcessDef) {
        await setLblByIdProcessDef(model, true);
      }
      try {
        const sheetName = "流程定义";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/bpm/process_def.xlsx`,
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
 * 批量导入 流程定义
 */
export async function importModelsProcessDef(
  inputs: ProcessDefInput[],
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
      await createsProcessDef(
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
 * 查找 流程定义 order_by 字段的最大值
 */
export async function findLastOrderByProcessDef(
  search?: ProcessDefSearch,
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByProcessDef: Query["findLastOrderByProcessDef"];
  } = await query({
    query: /* GraphQL */ `
      query($search: ProcessDefSearch) {
        findLastOrderByProcessDef(search: $search)
      }
    `,
  }, opt);
  
  const order_by = data.findLastOrderByProcessDef;
  
  return order_by;
}

/**
 * 获取 流程定义 字段注释
 */
export async function getFieldCommentsProcessDef(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsProcessDef: Query["getFieldCommentsProcessDef"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsProcessDef {
          id,
          code,
          lbl,
          menu_id,
          menu_id_lbl,
          current_revision_id,
          current_revision_id_lbl,
          is_enabled,
          is_enabled_lbl,
          order_by,
          description,
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
  
  const field_comments = data.getFieldCommentsProcessDef as ProcessDefFieldComment;
  
  return field_comments;
}

export function getPagePathProcessDef() {
  return "/bpm/process_def";
}

/** 新增时的默认值 */
export async function getDefaultInputProcessDef() {
  const defaultInput: ProcessDefInput = {
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
