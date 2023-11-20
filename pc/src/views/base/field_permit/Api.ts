import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
  FieldPermitSearch,
  FieldPermitInput,
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
 * @param {FieldPermitSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: FieldPermitSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllFieldPermit: Query["findAllFieldPermit"];
  } = await query({
    query: /* GraphQL */ `
      query($search: FieldPermitSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllFieldPermit(search: $search, page: $page, sort: $sort) {
          id
          menu_id
          menu_id_lbl
          code
          lbl
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
  const res = data.findAllFieldPermit;
  for (let i = 0; i < res.length; i++) {
    const item = res[i];
  }
  return res;
}

/**
 * 根据搜索条件查找第一条记录
 * @export findOne
 * @param {FieldPermitSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: FieldPermitSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneFieldPermit: Query["findOneFieldPermit"];
  } = await query({
    query: /* GraphQL */ `
      query($search: FieldPermitSearch, $sort: [SortInput!]) {
        findOneFieldPermit(search: $search, sort: $sort) {
          id
          menu_id
          menu_id_lbl
          code
          lbl
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
  const model = data.findOneFieldPermit;
  if (model) {
  }
  return model;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
 * @param {FieldPermitSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: FieldPermitSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountFieldPermit: Query["findCountFieldPermit"];
  } = await query({
    query: /* GraphQL */ `
      query($search: FieldPermitSearch) {
        findCountFieldPermit(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const res = data.findCountFieldPermit;
  return res;
}

/**
 * 创建一条数据
 * @export create
 * @param {FieldPermitInput} model
 * @param {UniqueType} uniqueType?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: FieldPermitInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
) {
  const data: {
    createFieldPermit: Mutation["createFieldPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: FieldPermitInput!, $unique_type: UniqueType) {
        createFieldPermit(model: $model, unique_type: $unique_type)
      }
    `,
    variables: {
      model,
      unique_type,
    },
  }, opt);
  const res = data.createFieldPermit;
  return res;
}

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {string} id
 * @param {FieldPermitInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: string,
  model: FieldPermitInput,
  opt?: GqlOpt,
) {
  const data: {
    updateByIdFieldPermit: Mutation["updateByIdFieldPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: String!, $model: FieldPermitInput!) {
        updateByIdFieldPermit(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const res = data.updateByIdFieldPermit;
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
    findByIdFieldPermit: Query["findByIdFieldPermit"];
  } = await query({
    query: /* GraphQL */ `
      query($id: String!) {
        findByIdFieldPermit(id: $id) {
          id
          menu_id
          menu_id_lbl
          code
          lbl
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
  const res = data.findByIdFieldPermit;
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
    deleteByIdsFieldPermit: Mutation["deleteByIdsFieldPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
        deleteByIdsFieldPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsFieldPermit;
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
    revertByIdsFieldPermit: Mutation["revertByIdsFieldPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
        revertByIdsFieldPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsFieldPermit;
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
    forceDeleteByIdsFieldPermit: Mutation["forceDeleteByIdsFieldPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [String!]!) {
        forceDeleteByIdsFieldPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsFieldPermit;
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
          getFieldCommentsFieldPermit {
            menu_id_lbl
            code
            lbl
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
            "field_permit_type",
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
      `${ location.origin }/import_template/base/field_permit.xlsx`,
      {
        data,
      },
    );
    saveAsExcel(buffer, `${ await nAsync("字段权限") }${ await nsAsync("导入") }`);
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
    search?: FieldPermitSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const data = await query({
      query: /* GraphQL */ `
        query($search: FieldPermitSearch, $sort: [SortInput!]) {
          findAllFieldPermit(search: $search, sort: $sort) {
            id
            menu_id
            menu_id_lbl
            code
            lbl
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
          getFieldCommentsFieldPermit {
            menu_id_lbl
            code
            lbl
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
            "field_permit_type",
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
        `${ location.origin }/excel_template/base/field_permit.xlsx`,
        {
          data,
        },
      );
      saveAsExcel(buffer, await nAsync("字段权限"));
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
 * @param {FieldPermitInput[]} models
 * @export importModels
 */
export async function importModels(
  models: FieldPermitInput[],
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
