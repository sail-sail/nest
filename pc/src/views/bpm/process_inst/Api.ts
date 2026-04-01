
import {
  UniqueType,
} from "#/types.ts";

import {
  ProcessInstStatus,
  ProcessInstBizCode,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  processInstQueryField,
} from "./Model.ts";

import {
  findTreeDept,
} from "@/views/base/dept/Api.ts";

export async function setLblByIdProcessInst(
  model?: ProcessInstModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputProcessInst(
  model?: ProcessInstInput | null,
) {
  const input: ProcessInstInput = {
    // ID
    id: model?.id,
    // 实例标题
    lbl: model?.lbl,
    // 流程定义
    process_def_id: model?.process_def_id,
    process_def_id_lbl: model?.process_def_id_lbl,
    // 流程版本
    process_revision_id: model?.process_revision_id,
    process_revision_id_lbl: model?.process_revision_id_lbl,
    // 状态
    status: model?.status,
    status_lbl: model?.status_lbl,
    // 关联业务
    biz_code: model?.biz_code,
    biz_code_lbl: model?.biz_code_lbl,
    // 业务数据ID
    form_data_id: model?.form_data_id,
    // 发起人
    start_usr_id: model?.start_usr_id,
    start_usr_id_lbl: model?.start_usr_id_lbl,
    // 发起人部门
    start_dept_id: model?.start_dept_id,
    start_dept_id_lbl: model?.start_dept_id_lbl,
    // 当前活跃节点
    current_node_ids: model?.current_node_ids,
    // 当前节点名称
    current_node_lbls: model?.current_node_lbls,
    // 总耗时(秒)
    duration_seconds: model?.duration_seconds != null ? Number(model?.duration_seconds || 0) : undefined,
  };
  return input;
}

/**
 * 根据搜索条件查找 流程实例 列表
 */
export async function findAllProcessInst(
  search?: ProcessInstSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllProcessInst: ProcessInstModel[];
  } = await query({
    query: `
      query($search: ProcessInstSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllProcessInst(search: $search, page: $page, sort: $sort) {
          ${ processInstQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllProcessInst;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdProcessInst(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 流程实例
 */
export async function findOneProcessInst(
  search?: ProcessInstSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneProcessInst?: ProcessInstModel;
  } = await query({
    query: `
      query($search: ProcessInstSearch, $sort: [SortInput!]) {
        findOneProcessInst(search: $search, sort: $sort) {
          ${ processInstQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneProcessInst;
  
  await setLblByIdProcessInst(model);
  
  return model;
}

/**
 * 根据条件查找第一个 流程实例, 如果不存在则抛错
 */
export async function findOneOkProcessInst(
  search?: ProcessInstSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkProcessInst?: ProcessInstModel;
  } = await query({
    query: `
      query($search: ProcessInstSearch, $sort: [SortInput!]) {
        findOneOkProcessInst(search: $search, sort: $sort) {
          ${ processInstQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkProcessInst;
  
  await setLblByIdProcessInst(model);
  
  return model;
}

/**
 * 根据搜索条件查找 流程实例 总数
 */
export async function findCountProcessInst(
  search?: ProcessInstSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountProcessInst: Query["findCountProcessInst"];
  } = await query({
    query: /* GraphQL */ `
      query($search: ProcessInstSearch) {
        findCountProcessInst(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountProcessInst;
  return count;
}

/**
 * 创建 流程实例
 */
export async function createProcessInst(
  input: ProcessInstInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<ProcessInstId> {
  const ids = await createsProcessInst(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 流程实例
 */
export async function createsProcessInst(
  inputs: ProcessInstInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<ProcessInstId[]> {
  inputs = inputs.map(intoInputProcessInst);
  const data: {
    createsProcessInst: Mutation["createsProcessInst"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [ProcessInstInput!]!, $unique_type: UniqueType) {
        createsProcessInst(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsProcessInst;
  return ids;
}

/**
 * 根据 id 修改 流程实例
 */
export async function updateByIdProcessInst(
  id: ProcessInstId,
  input: ProcessInstInput,
  opt?: GqlOpt,
): Promise<ProcessInstId> {
  input = intoInputProcessInst(input);
  const data: {
    updateByIdProcessInst: Mutation["updateByIdProcessInst"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: ProcessInstId!, $input: ProcessInstInput!) {
        updateByIdProcessInst(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: ProcessInstId = data.updateByIdProcessInst;
  return id2;
}

/**
 * 根据 id 查找 流程实例
 */
export async function findByIdProcessInst(
  id: ProcessInstId,
  opt?: GqlOpt,
): Promise<ProcessInstModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdProcessInst?: ProcessInstModel;
  } = await query({
    query: `
      query($id: ProcessInstId!) {
        findByIdProcessInst(id: $id) {
          ${ processInstQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdProcessInst;
  
  await setLblByIdProcessInst(model);
  
  return model;
}

/**
 * 根据 id 查找 流程实例, 如果不存在则抛错
 */
export async function findByIdOkProcessInst(
  id: ProcessInstId,
  opt?: GqlOpt,
): Promise<ProcessInstModel> {
  
  const data: {
    findByIdOkProcessInst: ProcessInstModel;
  } = await query({
    query: `
      query($id: ProcessInstId!) {
        findByIdOkProcessInst(id: $id) {
          ${ processInstQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkProcessInst;
  
  await setLblByIdProcessInst(model);
  
  return model;
}

/**
 * 根据 ids 查找 流程实例
 */
export async function findByIdsProcessInst(
  ids: ProcessInstId[],
  opt?: GqlOpt,
): Promise<ProcessInstModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsProcessInst: ProcessInstModel[];
  } = await query({
    query: `
      query($ids: [ProcessInstId!]!) {
        findByIdsProcessInst(ids: $ids) {
          ${ processInstQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsProcessInst;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdProcessInst(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 流程实例, 出现查询不到的 id 则报错
 */
export async function findByIdsOkProcessInst(
  ids: ProcessInstId[],
  opt?: GqlOpt,
): Promise<ProcessInstModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkProcessInst: ProcessInstModel[];
  } = await query({
    query: `
      query($ids: [ProcessInstId!]!) {
        findByIdsOkProcessInst(ids: $ids) {
          ${ processInstQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkProcessInst;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdProcessInst(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 流程实例
 */
export async function deleteByIdsProcessInst(
  ids: ProcessInstId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsProcessInst: Mutation["deleteByIdsProcessInst"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ProcessInstId!]!) {
        deleteByIdsProcessInst(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsProcessInst;
  return res;
}

/**
 * 根据 ids 还原 流程实例
 */
export async function revertByIdsProcessInst(
  ids: ProcessInstId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsProcessInst: Mutation["revertByIdsProcessInst"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ProcessInstId!]!) {
        revertByIdsProcessInst(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsProcessInst;
  return res;
}

/**
 * 根据 ids 彻底删除 流程实例
 */
export async function forceDeleteByIdsProcessInst(
  ids: ProcessInstId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsProcessInst: Mutation["forceDeleteByIdsProcessInst"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ProcessInstId!]!) {
        forceDeleteByIdsProcessInst(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsProcessInst;
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

export async function findAllProcessRevision(
  search?: ProcessRevisionSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllProcessRevision: ProcessRevisionModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: ProcessRevisionSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllProcessRevision(search: $search, page: $page, sort: $sort) {
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
  const process_revision_models = data.findAllProcessRevision;
  return process_revision_models;
}

export async function getListProcessRevision() {
  const data = await findAllProcessRevision(
    undefined,
    undefined,
    [
      {
        prop: "process_version",
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

export async function findAllDept(
  search?: DeptSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDept: DeptModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: DeptSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDept(search: $search, page: $page, sort: $sort) {
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
  const dept_models = data.findAllDept;
  return dept_models;
}

export async function getListDept() {
  const data = await findAllDept(
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

export async function getTreeDept() {
  const data = await findTreeDept(
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
 * 下载 流程实例 导入模板
 */
export function useDownloadImportTemplateProcessInst() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsProcessInst {
            lbl
            process_def_id_lbl
            process_revision_id_lbl
            status_lbl
            biz_code_lbl
            form_data_id
            start_usr_id_lbl
            start_dept_id_lbl
          }
          findAllProcessDef {
            id
            lbl
          }
          findAllProcessRevision {
            id
            lbl
          }
          findAllUsr {
            id
            lbl
          }
          findAllDept {
            id
            lbl
          }
          getDict(codes: [
            "bpm_inst_status",
            "bpm_biz_code",
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
      const sheetName = "流程实例";
      const buffer = await workerFn(
        `${ location.origin }/import_template/bpm/process_inst.xlsx`,
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
export function useExportExcelProcessInst() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: ProcessInstSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: ProcessInstSearch, $page: PageInput, , $sort: [SortInput!]) {
            findAllProcessInst(search: $search, page: $page, sort: $sort) {
              ${ processInstQueryField }
            }
            findAllProcessDef {
              lbl
            }
            findAllProcessRevision {
              lbl
            }
            findAllUsr {
              lbl
            }
            findAllDept {
              lbl
            }
            getDict(codes: [
              "bpm_inst_status",
              "bpm_biz_code",
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
      for (const model of data.findAllProcessInst) {
        await setLblByIdProcessInst(model, true);
      }
      try {
        const sheetName = "流程实例";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/bpm/process_inst.xlsx`,
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
 * 批量导入 流程实例
 */
export async function importModelsProcessInst(
  inputs: ProcessInstInput[],
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
      await createsProcessInst(
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
 * 获取 流程实例 字段注释
 */
export async function getFieldCommentsProcessInst(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsProcessInst: Query["getFieldCommentsProcessInst"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsProcessInst {
          id,
          lbl,
          process_def_id,
          process_def_id_lbl,
          process_revision_id,
          process_revision_id_lbl,
          status,
          status_lbl,
          biz_code,
          biz_code_lbl,
          form_data_id,
          start_usr_id,
          start_usr_id_lbl,
          start_dept_id,
          start_dept_id_lbl,
          current_node_ids,
          current_node_lbls,
          duration_seconds,
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
  
  const field_comments = data.getFieldCommentsProcessInst as ProcessInstFieldComment;
  
  return field_comments;
}

export function getPagePathProcessInst() {
  return "/bpm/process_inst";
}

/** 新增时的默认值 */
export async function getDefaultInputProcessInst() {
  const defaultInput: ProcessInstInput = {
    status: ProcessInstStatus.Running,
    biz_code: ProcessInstBizCode.BpmTest,
    duration_seconds: 0,
  };
  return defaultInput;
}
