
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  transferQueryField,
} from "./Model.ts";

export async function setLblByIdTransfer(
  model?: TransferModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputTransfer(
  model?: TransferInput | null,
) {
  const input: TransferInput = {
    // ID
    id: model?.id,
    // 原任务
    task_id: model?.task_id,
    task_id_lbl: model?.task_id_lbl,
    // 转出人
    from_usr_id: model?.from_usr_id,
    from_usr_id_lbl: model?.from_usr_id_lbl,
    // 接收人
    to_usr_id: model?.to_usr_id,
    to_usr_id_lbl: model?.to_usr_id_lbl,
  };
  return input;
}

/**
 * 根据搜索条件查找 转交记录 列表
 */
export async function findAllTransfer(
  search?: TransferSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllTransfer: TransferModel[];
  } = await query({
    query: `
      query($search: TransferSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllTransfer(search: $search, page: $page, sort: $sort) {
          ${ transferQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllTransfer;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdTransfer(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 转交记录
 */
export async function findOneTransfer(
  search?: TransferSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneTransfer?: TransferModel;
  } = await query({
    query: `
      query($search: TransferSearch, $sort: [SortInput!]) {
        findOneTransfer(search: $search, sort: $sort) {
          ${ transferQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneTransfer;
  
  await setLblByIdTransfer(model);
  
  return model;
}

/**
 * 根据条件查找第一个 转交记录, 如果不存在则抛错
 */
export async function findOneOkTransfer(
  search?: TransferSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkTransfer?: TransferModel;
  } = await query({
    query: `
      query($search: TransferSearch, $sort: [SortInput!]) {
        findOneOkTransfer(search: $search, sort: $sort) {
          ${ transferQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkTransfer;
  
  await setLblByIdTransfer(model);
  
  return model;
}

/**
 * 根据搜索条件查找 转交记录 总数
 */
export async function findCountTransfer(
  search?: TransferSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountTransfer: Query["findCountTransfer"];
  } = await query({
    query: /* GraphQL */ `
      query($search: TransferSearch) {
        findCountTransfer(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountTransfer;
  return count;
}

/**
 * 创建 转交记录
 */
export async function createTransfer(
  input: TransferInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<TransferId> {
  const ids = await createsTransfer(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 转交记录
 */
export async function createsTransfer(
  inputs: TransferInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<TransferId[]> {
  inputs = inputs.map(intoInputTransfer);
  const data: {
    createsTransfer: Mutation["createsTransfer"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [TransferInput!]!, $unique_type: UniqueType) {
        createsTransfer(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsTransfer;
  return ids;
}

/**
 * 根据 id 修改 转交记录
 */
export async function updateByIdTransfer(
  id: TransferId,
  input: TransferInput,
  opt?: GqlOpt,
): Promise<TransferId> {
  input = intoInputTransfer(input);
  const data: {
    updateByIdTransfer: Mutation["updateByIdTransfer"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: TransferId!, $input: TransferInput!) {
        updateByIdTransfer(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: TransferId = data.updateByIdTransfer;
  return id2;
}

/**
 * 根据 id 查找 转交记录
 */
export async function findByIdTransfer(
  id: TransferId,
  opt?: GqlOpt,
): Promise<TransferModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdTransfer?: TransferModel;
  } = await query({
    query: `
      query($id: TransferId!) {
        findByIdTransfer(id: $id) {
          ${ transferQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdTransfer;
  
  await setLblByIdTransfer(model);
  
  return model;
}

/**
 * 根据 id 查找 转交记录, 如果不存在则抛错
 */
export async function findByIdOkTransfer(
  id: TransferId,
  opt?: GqlOpt,
): Promise<TransferModel> {
  
  const data: {
    findByIdOkTransfer: TransferModel;
  } = await query({
    query: `
      query($id: TransferId!) {
        findByIdOkTransfer(id: $id) {
          ${ transferQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkTransfer;
  
  await setLblByIdTransfer(model);
  
  return model;
}

/**
 * 根据 ids 查找 转交记录
 */
export async function findByIdsTransfer(
  ids: TransferId[],
  opt?: GqlOpt,
): Promise<TransferModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsTransfer: TransferModel[];
  } = await query({
    query: `
      query($ids: [TransferId!]!) {
        findByIdsTransfer(ids: $ids) {
          ${ transferQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsTransfer;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdTransfer(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 转交记录, 出现查询不到的 id 则报错
 */
export async function findByIdsOkTransfer(
  ids: TransferId[],
  opt?: GqlOpt,
): Promise<TransferModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkTransfer: TransferModel[];
  } = await query({
    query: `
      query($ids: [TransferId!]!) {
        findByIdsOkTransfer(ids: $ids) {
          ${ transferQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkTransfer;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdTransfer(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 转交记录
 */
export async function deleteByIdsTransfer(
  ids: TransferId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsTransfer: Mutation["deleteByIdsTransfer"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [TransferId!]!) {
        deleteByIdsTransfer(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsTransfer;
  return res;
}

/**
 * 根据 ids 还原 转交记录
 */
export async function revertByIdsTransfer(
  ids: TransferId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsTransfer: Mutation["revertByIdsTransfer"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [TransferId!]!) {
        revertByIdsTransfer(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsTransfer;
  return res;
}

/**
 * 根据 ids 彻底删除 转交记录
 */
export async function forceDeleteByIdsTransfer(
  ids: TransferId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsTransfer: Mutation["forceDeleteByIdsTransfer"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [TransferId!]!) {
        forceDeleteByIdsTransfer(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsTransfer;
  return res;
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
 * 下载 转交记录 导入模板
 */
export function useDownloadImportTemplateTransfer() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsTransfer {
            task_id_lbl
            from_usr_id_lbl
            to_usr_id_lbl
          }
          findAllTask {
            id
            lbl
          }
          findAllUsr {
            id
            lbl
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "转交记录";
      const buffer = await workerFn(
        `${ location.origin }/import_template/bpm/transfer.xlsx`,
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
export function useExportExcelTransfer() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: TransferSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: TransferSearch, $page: PageInput, , $sort: [SortInput!]) {
            findAllTransfer(search: $search, page: $page, sort: $sort) {
              ${ transferQueryField }
            }
            findAllTask {
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
      for (const model of data.findAllTransfer) {
        await setLblByIdTransfer(model, true);
      }
      try {
        const sheetName = "转交记录";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/bpm/transfer.xlsx`,
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
 * 批量导入 转交记录
 */
export async function importModelsTransfer(
  inputs: TransferInput[],
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
      await createsTransfer(
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
 * 获取 转交记录 字段注释
 */
export async function getFieldCommentsTransfer(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsTransfer: Query["getFieldCommentsTransfer"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsTransfer {
          id,
          task_id,
          task_id_lbl,
          from_usr_id,
          from_usr_id_lbl,
          to_usr_id,
          to_usr_id_lbl,
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
  
  const field_comments = data.getFieldCommentsTransfer as TransferFieldComment;
  
  return field_comments;
}

export function getPagePathTransfer() {
  return "/bpm/transfer";
}

/** 新增时的默认值 */
export async function getDefaultInputTransfer() {
  const defaultInput: TransferInput = {
  };
  return defaultInput;
}
