import {
  UniqueType,
} from "#/types";

import type {
  DataPermitId,
} from "@/typings/ids";

import {
  DataPermitScope,
  DataPermitType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
  DataPermitSearch,
  DataPermitInput,
  DataPermitModel,
} from "#/types";

import type {
  MenuSearch,
} from "#/types";

import {
  findTree as findMenuTree,
} from "@/views/base/menu/Api";

async function setLblById(
  model?: DataPermitModel | null,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
  model?: Record<string, any>,
) {
  const input: DataPermitInput = {
    id: model?.id,
    menu_id: model?.menu_id,
    menu_id_lbl: model?.menu_id_lbl,
    scope: model?.scope,
    scope_lbl: model?.scope_lbl,
    type: model?.type,
    type_lbl: model?.type_lbl,
    rem: model?.rem,
    create_usr_id: model?.create_usr_id,
    create_usr_id_lbl: model?.create_usr_id_lbl,
    create_time: model?.create_time,
    create_time_lbl: model?.create_time_lbl,
    update_usr_id: model?.update_usr_id,
    update_usr_id_lbl: model?.update_usr_id_lbl,
    update_time: model?.update_time,
    update_time_lbl: model?.update_time_lbl,
  };
  return input;
}

/**
 * 根据搜索条件查找数据权限列表
 * @param {DataPermitSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: DataPermitSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDataPermit: Query["findAllDataPermit"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DataPermitSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDataPermit(search: $search, page: $page, sort: $sort) {
          id
          menu_id
          menu_id_lbl
          scope
          scope_lbl
          type
          type_lbl
          rem
          create_usr_id
          create_usr_id_lbl
          create_time
          create_time_lbl
          update_usr_id
          update_usr_id_lbl
          update_time
          update_time_lbl
          is_deleted
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllDataPermit;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个数据权限
 * @param {DataPermitSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: DataPermitSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneDataPermit: Query["findOneDataPermit"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DataPermitSearch, $sort: [SortInput!]) {
        findOneDataPermit(search: $search, sort: $sort) {
          id
          menu_id
          menu_id_lbl
          scope
          scope_lbl
          type
          type_lbl
          rem
          create_usr_id
          create_usr_id_lbl
          create_time
          create_time_lbl
          update_usr_id
          update_usr_id_lbl
          update_time
          update_time_lbl
          is_deleted
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneDataPermit;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找数据权限总数
 * @param {DataPermitSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: DataPermitSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountDataPermit: Query["findCountDataPermit"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DataPermitSearch) {
        findCountDataPermit(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountDataPermit;
  return count;
}

/**
 * 创建数据权限
 * @param {DataPermitInput} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: DataPermitInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DataPermitId> {
  const data: {
    createDataPermit: Mutation["createDataPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($input: DataPermitInput!, $unique_type: UniqueType) {
        createDataPermit(input: $input, unique_type: $unique_type)
      }
    `,
    variables: {
      input,
      unique_type,
    },
  }, opt);
  const id: DataPermitId = data.createDataPermit;
  return id;
}

/**
 * 根据 id 修改数据权限
 * @param {DataPermitId} id
 * @param {DataPermitInput} input
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: DataPermitId,
  input: DataPermitInput,
  opt?: GqlOpt,
): Promise<DataPermitId> {
  const data: {
    updateByIdDataPermit: Mutation["updateByIdDataPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: DataPermitId!, $input: DataPermitInput!) {
        updateByIdDataPermit(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: DataPermitId = data.updateByIdDataPermit;
  return id2;
}

/**
 * 根据 id 查找数据权限
 * @param {DataPermitId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: DataPermitId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdDataPermit: Query["findByIdDataPermit"];
  } = await query({
    query: /* GraphQL */ `
      query($id: DataPermitId!) {
        findByIdDataPermit(id: $id) {
          id
          menu_id
          menu_id_lbl
          scope
          scope_lbl
          type
          type_lbl
          rem
          create_usr_id
          create_usr_id_lbl
          create_time
          create_time_lbl
          update_usr_id
          update_usr_id_lbl
          update_time
          update_time_lbl
          is_deleted
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdDataPermit;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除数据权限
 * @param {DataPermitId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: DataPermitId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsDataPermit: Mutation["deleteByIdsDataPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DataPermitId!]!) {
        deleteByIdsDataPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsDataPermit;
  return res;
}

/**
 * 根据 ids 还原数据权限
 * @param {DataPermitId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: DataPermitId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsDataPermit: Mutation["revertByIdsDataPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DataPermitId!]!) {
        revertByIdsDataPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsDataPermit;
  return res;
}

/**
 * 根据 ids 彻底删除数据权限
 * @param {DataPermitId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: DataPermitId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsDataPermit: Mutation["forceDeleteByIdsDataPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DataPermitId!]!) {
        forceDeleteByIdsDataPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsDataPermit;
  return res;
}

export async function findAllMenu(
  search?: MenuSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllMenu: Query["findAllMenu"];
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
  const res = data.findAllMenu;
  return res;
}

export async function getMenuList() {
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

export async function getMenuTree() {
  const data = await findMenuTree(
    {
      is_enabled: [ 1 ],
    },
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
 * 下载导入模板
 */
export function useDownloadImportTemplate(routePath: string) {
  const {
    nsAsync,
  } = useI18n(routePath);
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsDataPermit {
            menu_id_lbl
            scope_lbl
            type_lbl
            rem
          }
          findAllMenu {
            id
            lbl
          }
          getDict(codes: [
            "data_permit_scope",
            "data_permit_type",
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
      const sheetName = await nsAsync("数据权限");
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/data_permit.xlsx`,
        {
          sheetName,
          data,
        },
      );
      saveAsExcel(buffer, `${ sheetName }${ await nsAsync("导入") }`);
    } catch (err) {
      ElMessage.error(await nsAsync("下载失败"));
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
export function useExportExcel(routePath: string) {
  const {
    nsAsync,
  } = useI18n(routePath);
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: DataPermitSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: /* GraphQL */ `
          query($search: DataPermitSearch, $sort: [SortInput!]) {
            findAllDataPermit(search: $search, sort: $sort) {
              id
              menu_id
              menu_id_lbl
              scope
              scope_lbl
              type
              type_lbl
              rem
              create_usr_id
              create_usr_id_lbl
              create_time
              create_time_lbl
              update_usr_id
              update_usr_id_lbl
              update_time
              update_time_lbl
            }
            findAllMenu {
              lbl
            }
            getDict(codes: [
              "data_permit_scope",
              "data_permit_type",
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
      try {
        const sheetName = await nsAsync("数据权限");
        const buffer = await workerFn(
          `${ location.origin }/excel_template/base/data_permit.xlsx`,
          {
            sheetName,
            columns,
            data,
          },
        );
        saveAsExcel(buffer, sheetName);
      } catch (err) {
        ElMessage.error(await nsAsync("导出失败"));
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
 * 批量导入
 * @param {DataPermitInput[]} models
 */
export async function importModels(
  models: DataPermitInput[],
  percentage: Ref<number>,
  isCancel: Ref<boolean>,
  opt?: GqlOpt,
) {
  const {
    nsAsync,
  } = useI18n();
  
  let succNum = 0;
  let failNum = 0;
  const failErrMsgs: string[] = [ ];
  percentage.value = 0;
  
  for (let i = 0; i < models.length; i++) {
    if (isCancel.value) {
      break;
    }
    
    percentage.value = Math.floor((i + 1) / models.length * 100);
    
    const item = models[i];
    
    opt = opt || { };
    opt.showErrMsg = false;
    opt.notLoading = true;
    
    try {
      await create(
        item,
        UniqueType.Update,
        opt,
      );
      succNum++;
    } catch (err) {
      failNum++;
      failErrMsgs.push(await nsAsync(`第 {0} 行导入失败: {1}`, i + 1, err));
    }
    
  }
  
  return showUploadMsg(succNum, failNum, failErrMsgs);
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: DataPermitInput = {
    scope: DataPermitScope.Tenant,
    type: DataPermitType.Editable,
  };
  return defaultInput;
}
