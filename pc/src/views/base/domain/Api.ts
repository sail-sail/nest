
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  domainQueryField,
} from "./Model.ts";

export async function setLblByIdDomain(
  model?: DomainModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputDomain(
  model?: DomainInput,
) {
  const input: DomainInput = {
    // ID
    id: model?.id,
    // 协议
    protocol: model?.protocol,
    // 名称
    lbl: model?.lbl,
    // 锁定
    is_locked: model?.is_locked,
    is_locked_lbl: model?.is_locked_lbl,
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
 * 根据搜索条件查找 域名 列表
 */
export async function findAllDomain(
  search?: DomainSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDomain: DomainModel[];
  } = await query({
    query: `
      query($search: DomainSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDomain(search: $search, page: $page, sort: $sort) {
          ${ domainQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllDomain;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdDomain(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 域名
 */
export async function findOneDomain(
  search?: DomainSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneDomain?: DomainModel;
  } = await query({
    query: `
      query($search: DomainSearch, $sort: [SortInput!]) {
        findOneDomain(search: $search, sort: $sort) {
          ${ domainQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneDomain;
  
  await setLblByIdDomain(model);
  
  return model;
}

/**
 * 根据条件查找第一个 域名, 如果不存在则抛错
 */
export async function findOneOkDomain(
  search?: DomainSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkDomain?: DomainModel;
  } = await query({
    query: `
      query($search: DomainSearch, $sort: [SortInput!]) {
        findOneOkDomain(search: $search, sort: $sort) {
          ${ domainQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkDomain;
  
  await setLblByIdDomain(model);
  
  return model;
}

/**
 * 根据搜索条件查找 域名 总数
 */
export async function findCountDomain(
  search?: DomainSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountDomain: Query["findCountDomain"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DomainSearch) {
        findCountDomain(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountDomain;
  return count;
}

/**
 * 创建 域名
 */
export async function createDomain(
  input: DomainInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DomainId> {
  const ids = await createsDomain(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 域名
 */
export async function createsDomain(
  inputs: DomainInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DomainId[]> {
  inputs = inputs.map(intoInputDomain);
  const data: {
    createsDomain: Mutation["createsDomain"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [DomainInput!]!, $unique_type: UniqueType) {
        createsDomain(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsDomain;
  return ids;
}

/**
 * 根据 id 修改 域名
 */
export async function updateByIdDomain(
  id: DomainId,
  input: DomainInput,
  opt?: GqlOpt,
): Promise<DomainId> {
  input = intoInputDomain(input);
  const data: {
    updateByIdDomain: Mutation["updateByIdDomain"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: DomainId!, $input: DomainInput!) {
        updateByIdDomain(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: DomainId = data.updateByIdDomain;
  return id2;
}

/**
 * 根据 id 查找 域名
 */
export async function findByIdDomain(
  id: DomainId,
  opt?: GqlOpt,
): Promise<DomainModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdDomain?: DomainModel;
  } = await query({
    query: `
      query($id: DomainId!) {
        findByIdDomain(id: $id) {
          ${ domainQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdDomain;
  
  await setLblByIdDomain(model);
  
  return model;
}

/**
 * 根据 id 查找 域名, 如果不存在则抛错
 */
export async function findByIdOkDomain(
  id: DomainId,
  opt?: GqlOpt,
): Promise<DomainModel> {
  
  const data: {
    findByIdOkDomain: DomainModel;
  } = await query({
    query: `
      query($id: DomainId!) {
        findByIdOkDomain(id: $id) {
          ${ domainQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkDomain;
  
  await setLblByIdDomain(model);
  
  return model;
}

/**
 * 根据 ids 查找 域名
 */
export async function findByIdsDomain(
  ids: DomainId[],
  opt?: GqlOpt,
): Promise<DomainModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsDomain: DomainModel[];
  } = await query({
    query: `
      query($ids: [DomainId!]!) {
        findByIdsDomain(ids: $ids) {
          ${ domainQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsDomain;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdDomain(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 域名, 出现查询不到的 id 则报错
 */
export async function findByIdsOkDomain(
  ids: DomainId[],
  opt?: GqlOpt,
): Promise<DomainModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkDomain: DomainModel[];
  } = await query({
    query: `
      query($ids: [DomainId!]!) {
        findByIdsOkDomain(ids: $ids) {
          ${ domainQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkDomain;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdDomain(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 域名
 */
export async function deleteByIdsDomain(
  ids: DomainId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsDomain: Mutation["deleteByIdsDomain"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DomainId!]!) {
        deleteByIdsDomain(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsDomain;
  return res;
}

/**
 * 根据 ids 启用或禁用 域名
 */
export async function enableByIdsDomain(
  ids: DomainId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    enableByIdsDomain: Mutation["enableByIdsDomain"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DomainId!]!, $is_enabled: Int!) {
        enableByIdsDomain(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsDomain;
  return res;
}

/**
 * 根据 ids 锁定或解锁 域名
 */
export async function lockByIdsDomain(
  ids: DomainId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    lockByIdsDomain: Mutation["lockByIdsDomain"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DomainId!]!, $is_locked: Int!) {
        lockByIdsDomain(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsDomain;
  return res;
}

/**
 * 根据 ids 还原 域名
 */
export async function revertByIdsDomain(
  ids: DomainId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsDomain: Mutation["revertByIdsDomain"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DomainId!]!) {
        revertByIdsDomain(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsDomain;
  return res;
}

/**
 * 根据 ids 彻底删除 域名
 */
export async function forceDeleteByIdsDomain(
  ids: DomainId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsDomain: Mutation["forceDeleteByIdsDomain"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DomainId!]!) {
        forceDeleteByIdsDomain(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsDomain;
  return res;
}

/**
 * 下载 域名 导入模板
 */
export function useDownloadImportTemplateDomain() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsDomain {
            protocol
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
      const sheetName = "域名";
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/domain.xlsx`,
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
export function useExportExcelDomain() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: DomainSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: DomainSearch, $sort: [SortInput!]) {
            findAllDomain(search: $search, page: null, sort: $sort) {
              ${ domainQueryField }
            }
            getDict(codes: [
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
      for (const model of data.findAllDomain) {
        await setLblByIdDomain(model, true);
      }
      try {
        const sheetName = "域名";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/base/domain.xlsx`,
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
 * 批量导入 域名
 */
export async function importModelsDomain(
  inputs: DomainInput[],
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
      await createsDomain(
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
 * 查找 域名 order_by 字段的最大值
 */
export async function findLastOrderByDomain(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByDomain: Query["findLastOrderByDomain"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByDomain
      }
    `,
  }, opt);
  const res = data.findLastOrderByDomain;
  return res;
}

/**
 * 获取 域名 字段注释
 */
export async function getFieldCommentsDomain(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsDomain: Query["getFieldCommentsDomain"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsDomain {
          id,
          protocol,
          lbl,
          is_locked,
          is_locked_lbl,
          is_enabled,
          is_enabled_lbl,
          order_by,
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
  
  const field_comments = data.getFieldCommentsDomain as DomainFieldComment;
  
  return field_comments;
}

export function getPagePathDomain() {
  return "/base/domain";
}

/** 新增时的默认值 */
export async function getDefaultInputDomain() {
  const defaultInput: DomainInput = {
    protocol: "https",
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
