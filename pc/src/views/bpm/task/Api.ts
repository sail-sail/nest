
import {
  UniqueType,
} from "#/types.ts";

import {
  TaskStatus,
  TaskAction,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  taskQueryField,
} from "./Model.ts";

export async function setLblByIdTask(
  model?: TaskModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputTask(
  model?: TaskInput | null,
) {
  const input: TaskInput = {
    // ID
    id: model?.id,
    // 任务标题
    lbl: model?.lbl,
    // 流程实例
    process_inst_id: model?.process_inst_id,
    process_inst_id_lbl: model?.process_inst_id_lbl,
    // 节点实例
    node_inst_id: model?.node_inst_id,
    node_inst_id_lbl: model?.node_inst_id_lbl,
    // 处理人
    assignee_usr_id: model?.assignee_usr_id,
    assignee_usr_id_lbl: model?.assignee_usr_id_lbl,
    // 任务状态
    status: model?.status,
    status_lbl: model?.status_lbl,
    // 审批动作
    action: model?.action,
    action_lbl: model?.action_lbl,
    // 审批意见
    opinion: model?.opinion,
  };
  return input;
}

/**
 * 根据搜索条件查找 审批任务 列表
 */
export async function findAllTask(
  search?: TaskSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllTask: TaskModel[];
  } = await query({
    query: `
      query($search: TaskSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllTask(search: $search, page: $page, sort: $sort) {
          ${ taskQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllTask;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdTask(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 审批任务
 */
export async function findOneTask(
  search?: TaskSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneTask?: TaskModel;
  } = await query({
    query: `
      query($search: TaskSearch, $sort: [SortInput!]) {
        findOneTask(search: $search, sort: $sort) {
          ${ taskQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneTask;
  
  await setLblByIdTask(model);
  
  return model;
}

/**
 * 根据条件查找第一个 审批任务, 如果不存在则抛错
 */
export async function findOneOkTask(
  search?: TaskSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkTask?: TaskModel;
  } = await query({
    query: `
      query($search: TaskSearch, $sort: [SortInput!]) {
        findOneOkTask(search: $search, sort: $sort) {
          ${ taskQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkTask;
  
  await setLblByIdTask(model);
  
  return model;
}

/**
 * 根据搜索条件查找 审批任务 总数
 */
export async function findCountTask(
  search?: TaskSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountTask: Query["findCountTask"];
  } = await query({
    query: /* GraphQL */ `
      query($search: TaskSearch) {
        findCountTask(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountTask;
  return count;
}

/**
 * 创建 审批任务
 */
export async function createTask(
  input: TaskInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<TaskId> {
  const ids = await createsTask(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 审批任务
 */
export async function createsTask(
  inputs: TaskInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<TaskId[]> {
  inputs = inputs.map(intoInputTask);
  const data: {
    createsTask: Mutation["createsTask"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [TaskInput!]!, $unique_type: UniqueType) {
        createsTask(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsTask;
  return ids;
}

/**
 * 根据 id 修改 审批任务
 */
export async function updateByIdTask(
  id: TaskId,
  input: TaskInput,
  opt?: GqlOpt,
): Promise<TaskId> {
  input = intoInputTask(input);
  const data: {
    updateByIdTask: Mutation["updateByIdTask"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: TaskId!, $input: TaskInput!) {
        updateByIdTask(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: TaskId = data.updateByIdTask;
  return id2;
}

/**
 * 根据 id 查找 审批任务
 */
export async function findByIdTask(
  id: TaskId,
  opt?: GqlOpt,
): Promise<TaskModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdTask?: TaskModel;
  } = await query({
    query: `
      query($id: TaskId!) {
        findByIdTask(id: $id) {
          ${ taskQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdTask;
  
  await setLblByIdTask(model);
  
  return model;
}

/**
 * 根据 id 查找 审批任务, 如果不存在则抛错
 */
export async function findByIdOkTask(
  id: TaskId,
  opt?: GqlOpt,
): Promise<TaskModel> {
  
  const data: {
    findByIdOkTask: TaskModel;
  } = await query({
    query: `
      query($id: TaskId!) {
        findByIdOkTask(id: $id) {
          ${ taskQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkTask;
  
  await setLblByIdTask(model);
  
  return model;
}

/**
 * 根据 ids 查找 审批任务
 */
export async function findByIdsTask(
  ids: TaskId[],
  opt?: GqlOpt,
): Promise<TaskModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsTask: TaskModel[];
  } = await query({
    query: `
      query($ids: [TaskId!]!) {
        findByIdsTask(ids: $ids) {
          ${ taskQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsTask;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdTask(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 审批任务, 出现查询不到的 id 则报错
 */
export async function findByIdsOkTask(
  ids: TaskId[],
  opt?: GqlOpt,
): Promise<TaskModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkTask: TaskModel[];
  } = await query({
    query: `
      query($ids: [TaskId!]!) {
        findByIdsOkTask(ids: $ids) {
          ${ taskQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkTask;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdTask(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 审批任务
 */
export async function deleteByIdsTask(
  ids: TaskId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsTask: Mutation["deleteByIdsTask"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [TaskId!]!) {
        deleteByIdsTask(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsTask;
  return res;
}

/**
 * 根据 ids 还原 审批任务
 */
export async function revertByIdsTask(
  ids: TaskId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsTask: Mutation["revertByIdsTask"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [TaskId!]!) {
        revertByIdsTask(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsTask;
  return res;
}

/**
 * 根据 ids 彻底删除 审批任务
 */
export async function forceDeleteByIdsTask(
  ids: TaskId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsTask: Mutation["forceDeleteByIdsTask"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [TaskId!]!) {
        forceDeleteByIdsTask(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsTask;
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
 * 下载 审批任务 导入模板
 */
export function useDownloadImportTemplateTask() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsTask {
            lbl
            process_inst_id_lbl
            node_inst_id_lbl
            assignee_usr_id_lbl
            status_lbl
            action_lbl
            opinion
          }
          findAllProcessInst {
            id
            lbl
          }
          findAllNodeInst {
            id
            lbl
          }
          findAllUsr {
            id
            lbl
          }
          getDict(codes: [
            "bpm_task_status",
            "bpm_task_action",
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
      const sheetName = "审批任务";
      const buffer = await workerFn(
        `${ location.origin }/import_template/bpm/task.xlsx`,
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
export function useExportExcelTask() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: TaskSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: TaskSearch, $page: PageInput, , $sort: [SortInput!]) {
            findAllTask(search: $search, page: $page, sort: $sort) {
              ${ taskQueryField }
            }
            findAllProcessInst {
              lbl
            }
            findAllNodeInst {
              lbl
            }
            findAllUsr {
              lbl
            }
            getDict(codes: [
              "bpm_task_status",
              "bpm_task_action",
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
      for (const model of data.findAllTask) {
        await setLblByIdTask(model, true);
      }
      try {
        const sheetName = "审批任务";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/bpm/task.xlsx`,
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
 * 批量导入 审批任务
 */
export async function importModelsTask(
  inputs: TaskInput[],
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
      await createsTask(
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
 * 获取 审批任务 字段注释
 */
export async function getFieldCommentsTask(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsTask: Query["getFieldCommentsTask"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsTask {
          id,
          lbl,
          process_inst_id,
          process_inst_id_lbl,
          node_inst_id,
          node_inst_id_lbl,
          assignee_usr_id,
          assignee_usr_id_lbl,
          status,
          status_lbl,
          action,
          action_lbl,
          opinion,
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
  
  const field_comments = data.getFieldCommentsTask as TaskFieldComment;
  
  return field_comments;
}

export function getPagePathTask() {
  return "/bpm/task";
}

/** 新增时的默认值 */
export async function getDefaultInputTask() {
  const defaultInput: TaskInput = {
    status: TaskStatus.Pending,
    action: TaskAction.Pending,
  };
  return defaultInput;
}
