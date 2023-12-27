import {
  UniqueType,
  PermitModel,
} from "#/types";

import type {
  PermitId,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
  PermitSearch,
  PermitInput,
} from "#/types";

import type {
  MenuSearch,
} from "#/types";

import {
  findTree as findMenuTree,
} from "@/views/base/menu/Api";

async function setLblById(
  model?: PermitModel | null,
) {
  if (!model) {
    return;
  }
}

/**
 * 根据搜索条件查找按钮权限列表
 * @param {PermitSearch} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: PermitSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllPermit: Query["findAllPermit"];
  } = await query({
    query: /* GraphQL */ `
      query($search: PermitSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllPermit(search: $search, page: $page, sort: $sort) {
          id
          menu_id
          menu_id_lbl
          code
          lbl
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
  const models = data.findAllPermit;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个按钮权限
 * @param {PermitSearch} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: PermitSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOnePermit: Query["findOnePermit"];
  } = await query({
    query: /* GraphQL */ `
      query($search: PermitSearch, $sort: [SortInput!]) {
        findOnePermit(search: $search, sort: $sort) {
          id
          menu_id
          menu_id_lbl
          code
          lbl
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
  const model = data.findOnePermit;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找按钮权限总数
 * @param {PermitSearch} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: PermitSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountPermit: Query["findCountPermit"];
  } = await query({
    query: /* GraphQL */ `
      query($search: PermitSearch) {
        findCountPermit(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountPermit;
  return count;
}

/**
 * 创建按钮权限
 * @param {PermitInput} model
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: PermitInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<PermitId> {
  const data: {
    createPermit: Mutation["createPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: PermitInput!, $unique_type: UniqueType) {
        createPermit(model: $model, unique_type: $unique_type)
      }
    `,
    variables: {
      model,
      unique_type,
    },
  }, opt);
  const id: PermitId = data.createPermit;
  return id;
}

/**
 * 根据 id 修改按钮权限
 * @param {PermitId} id
 * @param {PermitInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: PermitId,
  model: PermitInput,
  opt?: GqlOpt,
): Promise<PermitId> {
  const data: {
    updateByIdPermit: Mutation["updateByIdPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: PermitId!, $model: PermitInput!) {
        updateByIdPermit(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const id2: PermitId = data.updateByIdPermit;
  return id2;
}

/**
 * 根据 id 查找按钮权限
 * @param {PermitId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: PermitId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdPermit: Query["findByIdPermit"];
  } = await query({
    query: /* GraphQL */ `
      query($id: PermitId!) {
        findByIdPermit(id: $id) {
          id
          menu_id
          menu_id_lbl
          code
          lbl
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
  const model = data.findByIdPermit;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除按钮权限
 * @param {PermitId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: PermitId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsPermit: Mutation["deleteByIdsPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [PermitId!]!) {
        deleteByIdsPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsPermit;
  return res;
}

/**
 * 根据 ids 还原按钮权限
 * @param {PermitId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: PermitId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsPermit: Mutation["revertByIdsPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [PermitId!]!) {
        revertByIdsPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsPermit;
  return res;
}

/**
 * 根据 ids 彻底删除按钮权限
 * @param {PermitId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: PermitId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsPermit: Mutation["forceDeleteByIdsPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [PermitId!]!) {
        forceDeleteByIdsPermit(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsPermit;
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
          getFieldCommentsPermit {
            menu_id_lbl
            code
            lbl
            rem
          }
          findAllMenu {
            id
            lbl
          }
        }
      `,
      variables: {
      },
    });
    const buffer = await workerFn(
      `${ location.origin }/import_template/base/permit.xlsx`,
      {
        data,
      },
    );
    saveAsExcel(buffer, `${ await nAsync("按钮权限") }${ await nsAsync("导入") }`);
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
    search?: PermitSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const data = await query({
      query: /* GraphQL */ `
        query($search: PermitSearch, $sort: [SortInput!]) {
          findAllPermit(search: $search, sort: $sort) {
            id
            menu_id
            menu_id_lbl
            code
            lbl
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
          getFieldCommentsPermit {
            menu_id_lbl
            code
            lbl
            rem
            create_usr_id_lbl
            create_time_lbl
            update_usr_id_lbl
            update_time_lbl
          }
          findAllMenu {
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
        `${ location.origin }/excel_template/base/permit.xlsx`,
        {
          data,
        },
      );
      saveAsExcel(buffer, await nAsync("按钮权限"));
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
 * @param {PermitInput[]} models
 */
export async function importModels(
  models: PermitInput[],
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
