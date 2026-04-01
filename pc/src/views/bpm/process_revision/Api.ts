
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  processRevisionQueryField,
} from "./Model.ts";

export async function setLblByIdProcessRevision(
  model?: ProcessRevisionModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputProcessRevision(
  model?: ProcessRevisionInput | null,
) {
  const input: ProcessRevisionInput = {
    // ID
    id: model?.id,
    // 流程定义
    process_def_id: model?.process_def_id,
    process_def_id_lbl: model?.process_def_id_lbl,
    // 名称
    lbl: model?.lbl,
    // 版本号
    process_version: model?.process_version != null ? Number(model?.process_version || 0) : undefined,
    // 流程图
    graph_json: model?.graph_json,
    // 发布时间
    publish_time: model?.publish_time,
    publish_time_lbl: model?.publish_time_lbl,
    publish_time_save_null: model?.publish_time_save_null,
    // 发布人
    publish_usr_id: model?.publish_usr_id,
    publish_usr_id_lbl: model?.publish_usr_id_lbl,
  };
  return input;
}

/**
 * 根据搜索条件查找 流程版本 列表
 */
export async function findAllProcessRevision(
  search?: ProcessRevisionSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllProcessRevision: ProcessRevisionModel[];
  } = await query({
    query: `
      query($search: ProcessRevisionSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllProcessRevision(search: $search, page: $page, sort: $sort) {
          ${ processRevisionQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllProcessRevision;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdProcessRevision(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 流程版本
 */
export async function findOneProcessRevision(
  search?: ProcessRevisionSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneProcessRevision?: ProcessRevisionModel;
  } = await query({
    query: `
      query($search: ProcessRevisionSearch, $sort: [SortInput!]) {
        findOneProcessRevision(search: $search, sort: $sort) {
          ${ processRevisionQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneProcessRevision;
  
  await setLblByIdProcessRevision(model);
  
  return model;
}

/**
 * 根据条件查找第一个 流程版本, 如果不存在则抛错
 */
export async function findOneOkProcessRevision(
  search?: ProcessRevisionSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkProcessRevision?: ProcessRevisionModel;
  } = await query({
    query: `
      query($search: ProcessRevisionSearch, $sort: [SortInput!]) {
        findOneOkProcessRevision(search: $search, sort: $sort) {
          ${ processRevisionQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkProcessRevision;
  
  await setLblByIdProcessRevision(model);
  
  return model;
}

/**
 * 根据搜索条件查找 流程版本 总数
 */
export async function findCountProcessRevision(
  search?: ProcessRevisionSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountProcessRevision: Query["findCountProcessRevision"];
  } = await query({
    query: /* GraphQL */ `
      query($search: ProcessRevisionSearch) {
        findCountProcessRevision(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountProcessRevision;
  return count;
}

/**
 * 创建 流程版本
 */
export async function createProcessRevision(
  input: ProcessRevisionInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<ProcessRevisionId> {
  const ids = await createsProcessRevision(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 流程版本
 */
export async function createsProcessRevision(
  inputs: ProcessRevisionInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<ProcessRevisionId[]> {
  inputs = inputs.map(intoInputProcessRevision);
  const data: {
    createsProcessRevision: Mutation["createsProcessRevision"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [ProcessRevisionInput!]!, $unique_type: UniqueType) {
        createsProcessRevision(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsProcessRevision;
  return ids;
}

/**
 * 根据 id 修改 流程版本
 */
export async function updateByIdProcessRevision(
  id: ProcessRevisionId,
  input: ProcessRevisionInput,
  opt?: GqlOpt,
): Promise<ProcessRevisionId> {
  input = intoInputProcessRevision(input);
  const data: {
    updateByIdProcessRevision: Mutation["updateByIdProcessRevision"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: ProcessRevisionId!, $input: ProcessRevisionInput!) {
        updateByIdProcessRevision(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: ProcessRevisionId = data.updateByIdProcessRevision;
  return id2;
}

/**
 * 根据 id 查找 流程版本
 */
export async function findByIdProcessRevision(
  id: ProcessRevisionId,
  opt?: GqlOpt,
): Promise<ProcessRevisionModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdProcessRevision?: ProcessRevisionModel;
  } = await query({
    query: `
      query($id: ProcessRevisionId!) {
        findByIdProcessRevision(id: $id) {
          ${ processRevisionQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdProcessRevision;
  
  await setLblByIdProcessRevision(model);
  
  return model;
}

/**
 * 根据 id 查找 流程版本, 如果不存在则抛错
 */
export async function findByIdOkProcessRevision(
  id: ProcessRevisionId,
  opt?: GqlOpt,
): Promise<ProcessRevisionModel> {
  
  const data: {
    findByIdOkProcessRevision: ProcessRevisionModel;
  } = await query({
    query: `
      query($id: ProcessRevisionId!) {
        findByIdOkProcessRevision(id: $id) {
          ${ processRevisionQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkProcessRevision;
  
  await setLblByIdProcessRevision(model);
  
  return model;
}

/**
 * 根据 ids 查找 流程版本
 */
export async function findByIdsProcessRevision(
  ids: ProcessRevisionId[],
  opt?: GqlOpt,
): Promise<ProcessRevisionModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsProcessRevision: ProcessRevisionModel[];
  } = await query({
    query: `
      query($ids: [ProcessRevisionId!]!) {
        findByIdsProcessRevision(ids: $ids) {
          ${ processRevisionQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsProcessRevision;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdProcessRevision(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 流程版本, 出现查询不到的 id 则报错
 */
export async function findByIdsOkProcessRevision(
  ids: ProcessRevisionId[],
  opt?: GqlOpt,
): Promise<ProcessRevisionModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkProcessRevision: ProcessRevisionModel[];
  } = await query({
    query: `
      query($ids: [ProcessRevisionId!]!) {
        findByIdsOkProcessRevision(ids: $ids) {
          ${ processRevisionQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkProcessRevision;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdProcessRevision(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 流程版本
 */
export async function deleteByIdsProcessRevision(
  ids: ProcessRevisionId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsProcessRevision: Mutation["deleteByIdsProcessRevision"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ProcessRevisionId!]!) {
        deleteByIdsProcessRevision(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsProcessRevision;
  return res;
}

/**
 * 根据 ids 还原 流程版本
 */
export async function revertByIdsProcessRevision(
  ids: ProcessRevisionId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsProcessRevision: Mutation["revertByIdsProcessRevision"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ProcessRevisionId!]!) {
        revertByIdsProcessRevision(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsProcessRevision;
  return res;
}

/**
 * 根据 ids 彻底删除 流程版本
 */
export async function forceDeleteByIdsProcessRevision(
  ids: ProcessRevisionId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsProcessRevision: Mutation["forceDeleteByIdsProcessRevision"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ProcessRevisionId!]!) {
        forceDeleteByIdsProcessRevision(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsProcessRevision;
  return res;
}

export async function findAllProcessDef(
  search?: ProcessDefSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllProcessDef: ProcessDefModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: ProcessDefSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllProcessDef(search: $search, page: $page, sort: $sort) {
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
  const process_def_models = data.findAllProcessDef;
  return process_def_models;
}

export async function getListProcessDef() {
  const data = await findAllProcessDef(
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
 * 下载 流程版本 导入模板
 */
export function useDownloadImportTemplateProcessRevision() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsProcessRevision {
            process_def_id_lbl
            graph_json
          }
          findAllProcessDef {
            id
            lbl
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "流程版本";
      const buffer = await workerFn(
        `${ location.origin }/import_template/bpm/process_revision.xlsx`,
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
export function useExportExcelProcessRevision() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: ProcessRevisionSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: ProcessRevisionSearch, $page: PageInput, , $sort: [SortInput!]) {
            findAllProcessRevision(search: $search, page: $page, sort: $sort) {
              ${ processRevisionQueryField }
            }
            findAllProcessDef {
              lbl
            }
            findAllUsr {
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
      for (const model of data.findAllProcessRevision) {
        await setLblByIdProcessRevision(model, true);
      }
      try {
        const sheetName = "流程版本";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/bpm/process_revision.xlsx`,
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
 * 批量导入 流程版本
 */
export async function importModelsProcessRevision(
  inputs: ProcessRevisionInput[],
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
      await createsProcessRevision(
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
 * 获取 流程版本 字段注释
 */
export async function getFieldCommentsProcessRevision(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsProcessRevision: Query["getFieldCommentsProcessRevision"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsProcessRevision {
          id,
          process_def_id,
          process_def_id_lbl,
          lbl,
          process_version,
          graph_json,
          publish_time,
          publish_time_lbl,
          publish_usr_id,
          publish_usr_id_lbl,
        }
      }
    `,
    variables: {
    },
  }, opt);
  
  const field_comments = data.getFieldCommentsProcessRevision as ProcessRevisionFieldComment;
  
  return field_comments;
}

export function getPagePathProcessRevision() {
  return "/bpm/process_revision";
}

/** 新增时的默认值 */
export async function getDefaultInputProcessRevision() {
  const defaultInput: ProcessRevisionInput = {
    process_version: 0,
  };
  return defaultInput;
}
