import {
  UniqueType,
} from "#/types";

import type {
  FieldPermitId,
} from "@/typings/ids";

import {
  FieldPermitType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
  FieldPermitSearch,
  FieldPermitInput,
  FieldPermitModel,
} from "#/types";

import type {
  MenuSearch,
} from "#/types";

import {
  findTree as findMenuTree,
} from "@/views/base/menu/Api";

async function setLblById(
  model?: FieldPermitModel | null,
) {
  if (!model) {
    return;
  }
}

/**
 * 根据搜索条件查找字段权限列表
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
  const models = data.findAllFieldPermit;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个字段权限
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
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找字段权限总数
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
  const count = data.findCountFieldPermit;
  return count;
}

/**
 * 创建字段权限
 * @param {FieldPermitInput} model
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: FieldPermitInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<FieldPermitId> {
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
  const id: FieldPermitId = data.createFieldPermit;
  return id;
}

/**
 * 根据 id 修改字段权限
 * @param {FieldPermitId} id
 * @param {FieldPermitInput} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: FieldPermitId,
  model: FieldPermitInput,
  opt?: GqlOpt,
): Promise<FieldPermitId> {
  const data: {
    updateByIdFieldPermit: Mutation["updateByIdFieldPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: FieldPermitId!, $model: FieldPermitInput!) {
        updateByIdFieldPermit(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const id2: FieldPermitId = data.updateByIdFieldPermit;
  return id2;
}

/**
 * 根据 id 查找字段权限
 * @param {FieldPermitId} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: FieldPermitId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdFieldPermit: Query["findByIdFieldPermit"];
  } = await query({
    query: /* GraphQL */ `
      query($id: FieldPermitId!) {
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
          is_deleted
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdFieldPermit;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除字段权限
 * @param {FieldPermitId[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: FieldPermitId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsFieldPermit: Mutation["deleteByIdsFieldPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [FieldPermitId!]!) {
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
 * 根据 ids 还原字段权限
 * @param {FieldPermitId[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: FieldPermitId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsFieldPermit: Mutation["revertByIdsFieldPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [FieldPermitId!]!) {
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
 * 根据 ids 彻底删除字段权限
 * @param {FieldPermitId[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: FieldPermitId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsFieldPermit: Mutation["forceDeleteByIdsFieldPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [FieldPermitId!]!) {
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
          getFieldCommentsFieldPermit {
            menu_id_lbl
            code
            lbl
            type_lbl
            rem
          }
          findAllMenu {
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
    try {
      const sheetName = await nsAsync("字段权限");
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/field_permit.xlsx`,
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
    search?: FieldPermitSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
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
            findAllMenu {
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
        const sheetName = await nsAsync("字段权限");
        const buffer = await workerFn(
          `${ location.origin }/excel_template/base/field_permit.xlsx`,
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
 * @param {FieldPermitInput[]} models
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

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: FieldPermitInput = {
    type: FieldPermitType.Editable,
  };
  return defaultInput;
}
