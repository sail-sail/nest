import {
  UniqueType,
} from "#/types";

import type {
  DataPermitId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
  DataPermitSearch,
  DataPermitInput,
} from "#/types";

import type {
  MenuSearch,
} from "#/types";

import {
  findTree as findMenuTree,
} from "@/views/base/menu/Api";

async function setLblById(
  model?: DataPermitModel,
) {
  if (!model) {
    return;
  }
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
          lbl
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
          lbl
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
 * @param {DataPermitInput} model
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: DataPermitInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DataPermitId> {
  const data: {
    createDataPermit: Mutation["createDataPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: DataPermitInput!, $unique_type: UniqueType) {
        createDataPermit(model: $model, unique_type: $unique_type)
      }
    `,
    variables: {
      model,
      unique_type,
    },
  }, opt);
  const id: DataPermitId = data.createDataPermit;
  return id;
}

/**
 * 根据 id 修改数据权限
 * @param {DataPermitId} id
 * @param {DataPermitInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: DataPermitId,
  model: DataPermitInput,
  opt?: GqlOpt,
): Promise<DataPermitId> {
  const data: {
    updateByIdDataPermit: Mutation["updateByIdDataPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: DataPermitId!, $model: DataPermitInput!) {
        updateByIdDataPermit(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
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
          lbl
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
    nAsync,
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
            lbl
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
    const buffer = await workerFn(
      `${ location.origin }/import_template/base/data_permit.xlsx`,
      {
        data,
      },
    );
    saveAsExcel(buffer, `${ await nAsync("数据权限") }${ await nsAsync("导入") }`);
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
    nAsync,
    nsAsync,
  } = useI18n(routePath);
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2(
    search?: DataPermitSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const data = await query({
      query: /* GraphQL */ `
        query($search: DataPermitSearch, $sort: [SortInput!]) {
          findAllDataPermit(search: $search, sort: $sort) {
            id
            menu_id
            menu_id_lbl
            lbl
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
          getFieldCommentsDataPermit {
            menu_id_lbl
            lbl
            scope_lbl
            type_lbl
            rem
            create_usr_id_lbl
            create_time_lbl
            update_usr_id_lbl
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
      const buffer = await workerFn(
        `${ location.origin }/excel_template/base/data_permit.xlsx`,
        {
          data,
        },
      );
      saveAsExcel(buffer, await nAsync("数据权限"));
    } catch (err) {
      ElMessage.error(await nsAsync("导出失败"));
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
