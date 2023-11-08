import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
  DataPermitSearch,
  DataPermitInput,
} from "#/types";

import type {
  MenuSearch,
  UsrSearch,
} from "#/types";

import {
  findTree as findMenuTree,
} from "@/views/base/menu/Api";

/**
 * 根据搜索条件查找数据
 * @export findAll
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
  const res = data.findAllDataPermit;
  for (let i = 0; i < res.length; i++) {
    const item = res[i];
  }
  return res;
}

/**
 * 根据搜索条件查找第一条记录
 * @export findOne
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
  if (model) {
  }
  return model;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
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
  const res = data.findCountDataPermit;
  return res;
}

/**
 * 创建一条数据
 * @export create
 * @param {DataPermitInput} model
 * @param {UniqueType} uniqueType?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: DataPermitInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
) {
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
  const res = data.createDataPermit;
  return res;
}

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {string} id
 * @param {DataPermitInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: string,
  model: DataPermitInput,
  opt?: GqlOpt,
) {
  const data: {
    updateByIdDataPermit: Mutation["updateByIdDataPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: String!, $model: DataPermitInput!) {
        updateByIdDataPermit(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const res = data.updateByIdDataPermit;
  return res;
}

/**
 * 通过ID查找一条数据
 * @export findById
 * @param {string} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: string,
  opt?: GqlOpt,
) {
  const data: {
    findByIdDataPermit: Query["findByIdDataPermit"];
  } = await query({
    query: /* GraphQL */ `
      query($id: String!) {
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
  const res = data.findByIdDataPermit;
  return res;
}

/**
 * 根据 ids 删除数据
 * @export deleteByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: string[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsDataPermit: Mutation["deleteByIdsDataPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
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
 * 根据 ids 从回收站还原数据
 * @export revertByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: string[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsDataPermit: Mutation["revertByIdsDataPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
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
 * 根据 ids 彻底删除数据
 * @export forceDeleteByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: string[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsDataPermit: Mutation["forceDeleteByIdsDataPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
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

export async function findAllUsr(
  search?: UsrSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllUsr: Query["findAllUsr"];
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
  const res = data.findAllUsr;
  return res;
}

export async function getUsrList() {
  const data = await findAllUsr(
    {
      is_enabled: [ 1 ],
    },
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
            create_usr_id_lbl
            create_time_lbl
            update_usr_id_lbl
            update_time_lbl
          }
          findAllMenu {
            id
            lbl
          }
          findAllUsr {
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
          findAllUsr {
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
 * @export importModels
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
