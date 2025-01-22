
import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  archiveQueryField,
} from "./Model";

async function setLblById(
  model?: ArchiveModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
  model?: ArchiveInput,
) {
  const input: ArchiveInput = {
    // ID
    id: model?.id,
    // 编号
    code: model?.code,
    // 名称
    lbl: model?.lbl,
    // 关联单位
    company_id: model?.company_id,
    company_id_lbl: model?.company_id_lbl,
    // 排序
    order_by: model?.order_by,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找全宗设置列表
 */
export async function findAll(
  search?: ArchiveSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllArchive: ArchiveModel[];
  } = await query({
    query: `
      query($search: ArchiveSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllArchive(search: $search, page: $page, sort: $sort) {
          ${ archiveQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllArchive;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个全宗设置
 */
export async function findOne(
  search?: ArchiveSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneArchive?: ArchiveModel;
  } = await query({
    query: `
      query($search: ArchiveSearch, $sort: [SortInput!]) {
        findOneArchive(search: $search, sort: $sort) {
          ${ archiveQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneArchive;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找全宗设置总数
 */
export async function findCount(
  search?: ArchiveSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountArchive: Query["findCountArchive"];
  } = await query({
    query: /* GraphQL */ `
      query($search: ArchiveSearch) {
        findCountArchive(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountArchive;
  return count;
}

/**
 * 创建全宗设置
 * @param {ArchiveInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: ArchiveInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<ArchiveId> {
  const ids = await creates(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建全宗设置
 */
export async function creates(
  inputs: ArchiveInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<ArchiveId[]> {
  inputs = inputs.map(intoInput);
  const data: {
    createsArchive: Mutation["createsArchive"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [ArchiveInput!]!, $unique_type: UniqueType) {
        createsArchive(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsArchive;
  return ids;
}

/**
 * 根据 id 修改全宗设置
 */
export async function updateById(
  id: ArchiveId,
  input: ArchiveInput,
  opt?: GqlOpt,
): Promise<ArchiveId> {
  input = intoInput(input);
  const data: {
    updateByIdArchive: Mutation["updateByIdArchive"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: ArchiveId!, $input: ArchiveInput!) {
        updateByIdArchive(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: ArchiveId = data.updateByIdArchive;
  return id2;
}

/**
 * 根据 id 查找全宗设置
 */
export async function findById(
  id: ArchiveId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdArchive?: ArchiveModel;
  } = await query({
    query: `
      query($id: ArchiveId!) {
        findByIdArchive(id: $id) {
          ${ archiveQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdArchive;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除全宗设置
 */
export async function deleteByIds(
  ids: ArchiveId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsArchive: Mutation["deleteByIdsArchive"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ArchiveId!]!) {
        deleteByIdsArchive(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsArchive;
  return res;
}

/**
 * 根据 ids 还原全宗设置
 */
export async function revertByIds(
  ids: ArchiveId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsArchive: Mutation["revertByIdsArchive"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ArchiveId!]!) {
        revertByIdsArchive(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsArchive;
  return res;
}

/**
 * 根据 ids 彻底删除全宗设置
 */
export async function forceDeleteByIds(
  ids: ArchiveId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsArchive: Mutation["forceDeleteByIdsArchive"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ArchiveId!]!) {
        forceDeleteByIdsArchive(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsArchive;
  return res;
}

export async function findAllCompany(
  search?: CompanySearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllCompany: CompanyModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: CompanySearch, $page: PageInput, $sort: [SortInput!]) {
        findAllCompany(search: $search, page: $page, sort: $sort) {
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
  const res = data.findAllCompany;
  return res;
}

export async function getCompanyList() {
  const data = await findAllCompany(
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
 * 下载全宗设置导入模板
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
          getFieldCommentsArchive {
            code
            lbl
            company_id_lbl
            order_by
            rem
          }
          findAllCompany {
            id
            lbl
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "全宗设置";
      const buffer = await workerFn(
        `${ location.origin }/import_template/eams/archive.xlsx`,
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
    search?: ArchiveSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: ArchiveSearch, $sort: [SortInput!]) {
            findAllArchive(search: $search, page: null, sort: $sort) {
              ${ archiveQueryField }
            }
            findAllCompany {
              lbl
            }
          }
        `,
        variables: {
          search,
          sort,
        },
      }, opt);
      for (const model of data.findAllArchive) {
        await setLblById(model, true);
      }
      try {
        const sheetName = "全宗设置";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/eams/archive.xlsx`,
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
 * 批量导入全宗设置
 */
export async function importModels(
  inputs: ArchiveInput[],
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
 * 查找 全宗设置 order_by 字段的最大值
 */
export async function findLastOrderBy(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByArchive: Query["findLastOrderByArchive"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByArchive
      }
    `,
  }, opt);
  const res = data.findLastOrderByArchive;
  return res;
}

export function getPagePath() {
  return "/eams/archive";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: ArchiveInput = {
    order_by: 0,
  };
  return defaultInput;
}
