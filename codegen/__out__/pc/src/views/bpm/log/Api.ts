
import {
  UniqueType,
} from "#/types.ts";

import {
  LogAction,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  logQueryField,
} from "./Model.ts";

export async function setLblByIdLog(
  model?: LogModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputLog(
  model?: LogInput | null,
) {
  const input: LogInput = {
    // ID
    id: model?.id,
    // 流程实例
    process_inst_id: model?.process_inst_id,
    process_inst_id_lbl: model?.process_inst_id_lbl,
    // 节点实例
    node_inst_id: model?.node_inst_id,
    node_inst_id_lbl: model?.node_inst_id_lbl,
    // 关联任务
    task_id: model?.task_id,
    task_id_lbl: model?.task_id_lbl,
    // 动作
    action: model?.action,
    action_lbl: model?.action_lbl,
    // 操作人
    usr_id: model?.usr_id,
    usr_id_lbl: model?.usr_id_lbl,
    // 审批意见
    opinion: model?.opinion,
    // 节点名称
    node_label: model?.node_label,
  };
  return input;
}

/**
 * 根据搜索条件查找 流程日志 列表
 */
export async function findAllLog(
  search?: LogSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllLog: LogModel[];
  } = await query({
    query: `
      query($search: LogSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllLog(search: $search, page: $page, sort: $sort) {
          ${ logQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllLog;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdLog(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 流程日志
 */
export async function findOneLog(
  search?: LogSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneLog?: LogModel;
  } = await query({
    query: `
      query($search: LogSearch, $sort: [SortInput!]) {
        findOneLog(search: $search, sort: $sort) {
          ${ logQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneLog;
  
  await setLblByIdLog(model);
  
  return model;
}

/**
 * 根据条件查找第一个 流程日志, 如果不存在则抛错
 */
export async function findOneOkLog(
  search?: LogSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkLog?: LogModel;
  } = await query({
    query: `
      query($search: LogSearch, $sort: [SortInput!]) {
        findOneOkLog(search: $search, sort: $sort) {
          ${ logQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkLog;
  
  await setLblByIdLog(model);
  
  return model;
}

/**
 * 根据搜索条件查找 流程日志 总数
 */
export async function findCountLog(
  search?: LogSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountLog: Query["findCountLog"];
  } = await query({
    query: /* GraphQL */ `
      query($search: LogSearch) {
        findCountLog(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountLog;
  return count;
}

/**
 * 创建 流程日志
 */
export async function createLog(
  input: LogInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<LogId> {
  const ids = await createsLog(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 流程日志
 */
export async function createsLog(
  inputs: LogInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<LogId[]> {
  inputs = inputs.map(intoInputLog);
  const data: {
    createsLog: Mutation["createsLog"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [LogInput!]!, $unique_type: UniqueType) {
        createsLog(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsLog;
  return ids;
}

/**
 * 根据 id 修改 流程日志
 */
export async function updateByIdLog(
  id: LogId,
  input: LogInput,
  opt?: GqlOpt,
): Promise<LogId> {
  input = intoInputLog(input);
  const data: {
    updateByIdLog: Mutation["updateByIdLog"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: LogId!, $input: LogInput!) {
        updateByIdLog(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: LogId = data.updateByIdLog;
  return id2;
}

/**
 * 根据 id 查找 流程日志
 */
export async function findByIdLog(
  id: LogId,
  opt?: GqlOpt,
): Promise<LogModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdLog?: LogModel;
  } = await query({
    query: `
      query($id: LogId!) {
        findByIdLog(id: $id) {
          ${ logQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdLog;
  
  await setLblByIdLog(model);
  
  return model;
}

/**
 * 根据 id 查找 流程日志, 如果不存在则抛错
 */
export async function findByIdOkLog(
  id: LogId,
  opt?: GqlOpt,
): Promise<LogModel> {
  
  const data: {
    findByIdOkLog: LogModel;
  } = await query({
    query: `
      query($id: LogId!) {
        findByIdOkLog(id: $id) {
          ${ logQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkLog;
  
  await setLblByIdLog(model);
  
  return model;
}

/**
 * 根据 ids 查找 流程日志
 */
export async function findByIdsLog(
  ids: LogId[],
  opt?: GqlOpt,
): Promise<LogModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsLog: LogModel[];
  } = await query({
    query: `
      query($ids: [LogId!]!) {
        findByIdsLog(ids: $ids) {
          ${ logQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsLog;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdLog(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 流程日志, 出现查询不到的 id 则报错
 */
export async function findByIdsOkLog(
  ids: LogId[],
  opt?: GqlOpt,
): Promise<LogModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkLog: LogModel[];
  } = await query({
    query: `
      query($ids: [LogId!]!) {
        findByIdsOkLog(ids: $ids) {
          ${ logQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkLog;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdLog(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 流程日志
 */
export async function deleteByIdsLog(
  ids: LogId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsLog: Mutation["deleteByIdsLog"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [LogId!]!) {
        deleteByIdsLog(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsLog;
  return res;
}

/**
 * 根据 ids 还原 流程日志
 */
export async function revertByIdsLog(
  ids: LogId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsLog: Mutation["revertByIdsLog"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [LogId!]!) {
        revertByIdsLog(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsLog;
  return res;
}

/**
 * 根据 ids 彻底删除 流程日志
 */
export async function forceDeleteByIdsLog(
  ids: LogId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsLog: Mutation["forceDeleteByIdsLog"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [LogId!]!) {
        forceDeleteByIdsLog(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsLog;
  return res;
}

export async function findAllProcessInst(
  search?: ProcessInstSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllProcessInst: ProcessInstModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: ProcessInstSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllProcessInst(search: $search, page: $page, sort: $sort) {
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
  const process_inst_models = data.findAllProcessInst;
  return process_inst_models;
}

export async function getListProcessInst() {
  const data = await findAllProcessInst(
    undefined,
    undefined,
    [
      {
        prop: "create_time",
        order: "descending",
      },
    ],
    {
      notLoading: true,
    },
  );
  return data;
}

export async function findAllNodeInst(
  search?: NodeInstSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllNodeInst: NodeInstModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: NodeInstSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllNodeInst(search: $search, page: $page, sort: $sort) {
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
  const node_inst_models = data.findAllNodeInst;
  return node_inst_models;
}

export async function getListNodeInst() {
  const data = await findAllNodeInst(
    undefined,
    undefined,
    [
      {
        prop: "create_time",
        order: "descending",
      },
    ],
    {
      notLoading: true,
    },
  );
  return data;
}

export async function findAllTask(
  search?: TaskSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllTask: TaskModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: TaskSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllTask(search: $search, page: $page, sort: $sort) {
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
  const task_models = data.findAllTask;
  return task_models;
}

export async function getListTask() {
  const data = await findAllTask(
    undefined,
    undefined,
    [
      {
        prop: "create_time",
        order: "descending",
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
 * 下载 流程日志 导入模板
 */
export function useDownloadImportTemplateLog() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsLog {
            process_inst_id_lbl
            node_inst_id_lbl
            task_id_lbl
            action_lbl
            usr_id_lbl
            opinion
            node_label
          }
          findAllProcessInst {
            id
            lbl
          }
          findAllNodeInst {
            id
            lbl
          }
          findAllTask {
            id
            lbl
          }
          findAllUsr {
            id
            lbl
          }
          getDict(codes: [
            "bpm_log_action",
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
      const sheetName = "流程日志";
      const buffer = await workerFn(
        `${ location.origin }/import_template/bpm/log.xlsx`,
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
export function useExportExcelLog() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: LogSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: LogSearch, $page: PageInput, , $sort: [SortInput!]) {
            findAllLog(search: $search, page: $page, sort: $sort) {
              ${ logQueryField }
            }
            findAllProcessInst {
              lbl
            }
            findAllNodeInst {
              lbl
            }
            findAllTask {
              lbl
            }
            findAllUsr {
              lbl
            }
            getDict(codes: [
              "bpm_log_action",
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
      for (const model of data.findAllLog) {
        await setLblByIdLog(model, true);
      }
      try {
        const sheetName = "流程日志";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/bpm/log.xlsx`,
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
 * 批量导入 流程日志
 */
export async function importModelsLog(
  inputs: LogInput[],
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
      await createsLog(
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
 * 获取 流程日志 字段注释
 */
export async function getFieldCommentsLog(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsLog: Query["getFieldCommentsLog"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsLog {
          id,
          process_inst_id,
          process_inst_id_lbl,
          node_inst_id,
          node_inst_id_lbl,
          task_id,
          task_id_lbl,
          action,
          action_lbl,
          usr_id,
          usr_id_lbl,
          opinion,
          node_label,
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
  
  const field_comments = data.getFieldCommentsLog as LogFieldComment;
  
  return field_comments;
}

export function getPagePathLog() {
  return "/bpm/log";
}

/** 新增时的默认值 */
export async function getDefaultInputLog() {
  const defaultInput: LogInput = {
    action: LogAction.Start,
  };
  return defaultInput;
}
