
import {
  UniqueType,
} from "#/types.ts";

import {
  NodeInstNodeType,
  NodeInstStatus,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  nodeInstQueryField,
} from "./Model.ts";

export async function setLblByIdNodeInst(
  model?: NodeInstModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputNodeInst(
  model?: NodeInstInput | null,
) {
  const input: NodeInstInput = {
    // ID
    id: model?.id,
    // 流程实例
    process_inst_id: model?.process_inst_id,
    process_inst_id_lbl: model?.process_inst_id_lbl,
    // 节点ID
    node_id: model?.node_id,
    // 节点类型
    node_type: model?.node_type,
    node_type_lbl: model?.node_type_lbl,
    // 节点名称
    lbl: model?.lbl,
    // 节点状态
    status: model?.status,
    status_lbl: model?.status_lbl,
    // 开始时间
    start_time: model?.start_time,
    start_time_lbl: model?.start_time_lbl,
    start_time_save_null: model?.start_time_save_null,
    // 结束时间
    end_time: model?.end_time,
    end_time_lbl: model?.end_time_lbl,
    end_time_save_null: model?.end_time_save_null,
  };
  return input;
}

/**
 * 根据搜索条件查找 节点实例 列表
 */
export async function findAllNodeInst(
  search?: NodeInstSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllNodeInst: NodeInstModel[];
  } = await query({
    query: `
      query($search: NodeInstSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllNodeInst(search: $search, page: $page, sort: $sort) {
          ${ nodeInstQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllNodeInst;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdNodeInst(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 节点实例
 */
export async function findOneNodeInst(
  search?: NodeInstSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneNodeInst?: NodeInstModel;
  } = await query({
    query: `
      query($search: NodeInstSearch, $sort: [SortInput!]) {
        findOneNodeInst(search: $search, sort: $sort) {
          ${ nodeInstQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneNodeInst;
  
  await setLblByIdNodeInst(model);
  
  return model;
}

/**
 * 根据条件查找第一个 节点实例, 如果不存在则抛错
 */
export async function findOneOkNodeInst(
  search?: NodeInstSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkNodeInst?: NodeInstModel;
  } = await query({
    query: `
      query($search: NodeInstSearch, $sort: [SortInput!]) {
        findOneOkNodeInst(search: $search, sort: $sort) {
          ${ nodeInstQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkNodeInst;
  
  await setLblByIdNodeInst(model);
  
  return model;
}

/**
 * 根据搜索条件查找 节点实例 总数
 */
export async function findCountNodeInst(
  search?: NodeInstSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountNodeInst: Query["findCountNodeInst"];
  } = await query({
    query: /* GraphQL */ `
      query($search: NodeInstSearch) {
        findCountNodeInst(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountNodeInst;
  return count;
}

/**
 * 创建 节点实例
 */
export async function createNodeInst(
  input: NodeInstInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<NodeInstId> {
  const ids = await createsNodeInst(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 节点实例
 */
export async function createsNodeInst(
  inputs: NodeInstInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<NodeInstId[]> {
  inputs = inputs.map(intoInputNodeInst);
  const data: {
    createsNodeInst: Mutation["createsNodeInst"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [NodeInstInput!]!, $unique_type: UniqueType) {
        createsNodeInst(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsNodeInst;
  return ids;
}

/**
 * 根据 id 修改 节点实例
 */
export async function updateByIdNodeInst(
  id: NodeInstId,
  input: NodeInstInput,
  opt?: GqlOpt,
): Promise<NodeInstId> {
  input = intoInputNodeInst(input);
  const data: {
    updateByIdNodeInst: Mutation["updateByIdNodeInst"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: NodeInstId!, $input: NodeInstInput!) {
        updateByIdNodeInst(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: NodeInstId = data.updateByIdNodeInst;
  return id2;
}

/**
 * 根据 id 查找 节点实例
 */
export async function findByIdNodeInst(
  id: NodeInstId,
  opt?: GqlOpt,
): Promise<NodeInstModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdNodeInst?: NodeInstModel;
  } = await query({
    query: `
      query($id: NodeInstId!) {
        findByIdNodeInst(id: $id) {
          ${ nodeInstQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdNodeInst;
  
  await setLblByIdNodeInst(model);
  
  return model;
}

/**
 * 根据 id 查找 节点实例, 如果不存在则抛错
 */
export async function findByIdOkNodeInst(
  id: NodeInstId,
  opt?: GqlOpt,
): Promise<NodeInstModel> {
  
  const data: {
    findByIdOkNodeInst: NodeInstModel;
  } = await query({
    query: `
      query($id: NodeInstId!) {
        findByIdOkNodeInst(id: $id) {
          ${ nodeInstQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkNodeInst;
  
  await setLblByIdNodeInst(model);
  
  return model;
}

/**
 * 根据 ids 查找 节点实例
 */
export async function findByIdsNodeInst(
  ids: NodeInstId[],
  opt?: GqlOpt,
): Promise<NodeInstModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsNodeInst: NodeInstModel[];
  } = await query({
    query: `
      query($ids: [NodeInstId!]!) {
        findByIdsNodeInst(ids: $ids) {
          ${ nodeInstQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsNodeInst;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdNodeInst(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 节点实例, 出现查询不到的 id 则报错
 */
export async function findByIdsOkNodeInst(
  ids: NodeInstId[],
  opt?: GqlOpt,
): Promise<NodeInstModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkNodeInst: NodeInstModel[];
  } = await query({
    query: `
      query($ids: [NodeInstId!]!) {
        findByIdsOkNodeInst(ids: $ids) {
          ${ nodeInstQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkNodeInst;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdNodeInst(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 节点实例
 */
export async function deleteByIdsNodeInst(
  ids: NodeInstId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsNodeInst: Mutation["deleteByIdsNodeInst"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [NodeInstId!]!) {
        deleteByIdsNodeInst(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsNodeInst;
  return res;
}

/**
 * 根据 ids 还原 节点实例
 */
export async function revertByIdsNodeInst(
  ids: NodeInstId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsNodeInst: Mutation["revertByIdsNodeInst"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [NodeInstId!]!) {
        revertByIdsNodeInst(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsNodeInst;
  return res;
}

/**
 * 根据 ids 彻底删除 节点实例
 */
export async function forceDeleteByIdsNodeInst(
  ids: NodeInstId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsNodeInst: Mutation["forceDeleteByIdsNodeInst"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [NodeInstId!]!) {
        forceDeleteByIdsNodeInst(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsNodeInst;
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

/**
 * 下载 节点实例 导入模板
 */
export function useDownloadImportTemplateNodeInst() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsNodeInst {
            process_inst_id_lbl
            node_id
            node_type_lbl
            lbl
            status_lbl
            start_time_lbl
            end_time_lbl
          }
          findAllProcessInst {
            id
            lbl
          }
          getDict(codes: [
            "bpm_node_type",
            "bpm_node_inst_status",
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
      const sheetName = "节点实例";
      const buffer = await workerFn(
        `${ location.origin }/import_template/bpm/node_inst.xlsx`,
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
export function useExportExcelNodeInst() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: NodeInstSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: NodeInstSearch, $page: PageInput, , $sort: [SortInput!]) {
            findAllNodeInst(search: $search, page: $page, sort: $sort) {
              ${ nodeInstQueryField }
            }
            findAllProcessInst {
              lbl
            }
            getDict(codes: [
              "bpm_node_type",
              "bpm_node_inst_status",
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
      for (const model of data.findAllNodeInst) {
        await setLblByIdNodeInst(model, true);
      }
      try {
        const sheetName = "节点实例";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/bpm/node_inst.xlsx`,
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
 * 批量导入 节点实例
 */
export async function importModelsNodeInst(
  inputs: NodeInstInput[],
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
      await createsNodeInst(
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
 * 获取 节点实例 字段注释
 */
export async function getFieldCommentsNodeInst(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsNodeInst: Query["getFieldCommentsNodeInst"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsNodeInst {
          id,
          process_inst_id,
          process_inst_id_lbl,
          node_id,
          node_type,
          node_type_lbl,
          lbl,
          status,
          status_lbl,
          start_time,
          start_time_lbl,
          end_time,
          end_time_lbl,
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
  
  const field_comments = data.getFieldCommentsNodeInst as NodeInstFieldComment;
  
  return field_comments;
}

export function getPagePathNodeInst() {
  return "/bpm/node_inst";
}

/** 新增时的默认值 */
export async function getDefaultInputNodeInst() {
  const defaultInput: NodeInstInput = {
    node_type: NodeInstNodeType.Approve,
    status: NodeInstStatus.Pending,
  };
  return defaultInput;
}
