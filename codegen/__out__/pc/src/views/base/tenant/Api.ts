
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  tenantQueryField,
} from "./Model.ts";

import {
  findTreeMenu,
} from "@/views/base/menu/Api.ts";

export async function setLblByIdTenant(
  model?: TenantModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputTenant(
  model?: TenantInput,
) {
  const input: TenantInput = {
    // ID
    id: model?.id,
    // 编码
    code: model?.code,
    // 名称
    lbl: model?.lbl,
    // 所属域名
    domain_ids: model?.domain_ids,
    domain_ids_lbl: model?.domain_ids_lbl,
    // 菜单权限
    menu_ids: model?.menu_ids,
    menu_ids_lbl: model?.menu_ids_lbl,
    // 标题
    title: model?.title,
    // 简介
    info: model?.info,
    // 语言
    lang_id: model?.lang_id,
    lang_id_lbl: model?.lang_id_lbl,
    // 锁定
    is_locked: model?.is_locked,
    is_locked_lbl: model?.is_locked_lbl,
    // 启用
    is_enabled: model?.is_enabled,
    is_enabled_lbl: model?.is_enabled_lbl,
    // 排序
    order_by: model?.order_by != null ? Number(model?.order_by || 0) : undefined,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找 租户 列表
 */
export async function findAllTenant(
  search?: TenantSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllTenant: TenantModel[];
  } = await query({
    query: `
      query($search: TenantSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllTenant(search: $search, page: $page, sort: $sort) {
          ${ tenantQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllTenant;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdTenant(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 租户
 */
export async function findOneTenant(
  search?: TenantSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneTenant?: TenantModel;
  } = await query({
    query: `
      query($search: TenantSearch, $sort: [SortInput!]) {
        findOneTenant(search: $search, sort: $sort) {
          ${ tenantQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneTenant;
  
  await setLblByIdTenant(model);
  
  return model;
}

/**
 * 根据条件查找第一个 租户, 如果不存在则抛错
 */
export async function findOneOkTenant(
  search?: TenantSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkTenant?: TenantModel;
  } = await query({
    query: `
      query($search: TenantSearch, $sort: [SortInput!]) {
        findOneOkTenant(search: $search, sort: $sort) {
          ${ tenantQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkTenant;
  
  await setLblByIdTenant(model);
  
  return model;
}

/**
 * 根据搜索条件查找 租户 总数
 */
export async function findCountTenant(
  search?: TenantSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountTenant: Query["findCountTenant"];
  } = await query({
    query: /* GraphQL */ `
      query($search: TenantSearch) {
        findCountTenant(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountTenant;
  return count;
}

/**
 * 创建 租户
 */
export async function createTenant(
  input: TenantInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<TenantId> {
  const ids = await createsTenant(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 租户
 */
export async function createsTenant(
  inputs: TenantInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<TenantId[]> {
  inputs = inputs.map(intoInputTenant);
  const data: {
    createsTenant: Mutation["createsTenant"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [TenantInput!]!, $unique_type: UniqueType) {
        createsTenant(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsTenant;
  return ids;
}

/**
 * 根据 id 修改 租户
 */
export async function updateByIdTenant(
  id: TenantId,
  input: TenantInput,
  opt?: GqlOpt,
): Promise<TenantId> {
  input = intoInputTenant(input);
  const data: {
    updateByIdTenant: Mutation["updateByIdTenant"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: TenantId!, $input: TenantInput!) {
        updateByIdTenant(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: TenantId = data.updateByIdTenant;
  return id2;
}

/**
 * 根据 id 查找 租户
 */
export async function findByIdTenant(
  id: TenantId,
  opt?: GqlOpt,
): Promise<TenantModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdTenant?: TenantModel;
  } = await query({
    query: `
      query($id: TenantId!) {
        findByIdTenant(id: $id) {
          ${ tenantQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdTenant;
  
  await setLblByIdTenant(model);
  
  return model;
}

/**
 * 根据 id 查找 租户, 如果不存在则抛错
 */
export async function findByIdOkTenant(
  id: TenantId,
  opt?: GqlOpt,
): Promise<TenantModel> {
  
  const data: {
    findByIdOkTenant: TenantModel;
  } = await query({
    query: `
      query($id: TenantId!) {
        findByIdOkTenant(id: $id) {
          ${ tenantQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkTenant;
  
  await setLblByIdTenant(model);
  
  return model;
}

/**
 * 根据 ids 查找 租户
 */
export async function findByIdsTenant(
  ids: TenantId[],
  opt?: GqlOpt,
): Promise<TenantModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsTenant: TenantModel[];
  } = await query({
    query: `
      query($ids: [TenantId!]!) {
        findByIdsTenant(ids: $ids) {
          ${ tenantQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsTenant;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdTenant(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 租户, 出现查询不到的 id 则报错
 */
export async function findByIdsOkTenant(
  ids: TenantId[],
  opt?: GqlOpt,
): Promise<TenantModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkTenant: TenantModel[];
  } = await query({
    query: `
      query($ids: [TenantId!]!) {
        findByIdsOkTenant(ids: $ids) {
          ${ tenantQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkTenant;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdTenant(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 租户
 */
export async function deleteByIdsTenant(
  ids: TenantId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsTenant: Mutation["deleteByIdsTenant"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [TenantId!]!) {
        deleteByIdsTenant(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsTenant;
  return res;
}

/**
 * 根据 ids 启用或禁用 租户
 */
export async function enableByIdsTenant(
  ids: TenantId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    enableByIdsTenant: Mutation["enableByIdsTenant"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [TenantId!]!, $is_enabled: Int!) {
        enableByIdsTenant(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsTenant;
  return res;
}

/**
 * 根据 ids 锁定或解锁 租户
 */
export async function lockByIdsTenant(
  ids: TenantId[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    lockByIdsTenant: Mutation["lockByIdsTenant"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [TenantId!]!, $is_locked: Int!) {
        lockByIdsTenant(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsTenant;
  return res;
}

/**
 * 根据 ids 还原 租户
 */
export async function revertByIdsTenant(
  ids: TenantId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsTenant: Mutation["revertByIdsTenant"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [TenantId!]!) {
        revertByIdsTenant(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsTenant;
  return res;
}

/**
 * 根据 ids 彻底删除 租户
 */
export async function forceDeleteByIdsTenant(
  ids: TenantId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsTenant: Mutation["forceDeleteByIdsTenant"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [TenantId!]!) {
        forceDeleteByIdsTenant(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsTenant;
  return res;
}

export async function findAllDomain(
  search?: DomainSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDomain: DomainModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: DomainSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDomain(search: $search, page: $page, sort: $sort) {
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
  const domain_models = data.findAllDomain;
  return domain_models;
}

export async function getListDomain() {
  const data = await findAllDomain(
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

export async function findAllMenu(
  search?: MenuSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllMenu: MenuModel[];
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
  const menu_models = data.findAllMenu;
  return menu_models;
}

export async function getListMenu() {
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

export async function findAllLang(
  search?: LangSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllLang: LangModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: LangSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllLang(search: $search, page: $page, sort: $sort) {
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
  const lang_models = data.findAllLang;
  return lang_models;
}

export async function getListLang() {
  const data = await findAllLang(
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

export async function getTreeMenu() {
  const data = await findTreeMenu(
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
 * 下载 租户 导入模板
 */
export function useDownloadImportTemplateTenant() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldCommentsTenant {
            lbl
            domain_ids_lbl
            menu_ids_lbl
            title
            info
            lang_id_lbl
            order_by
            rem
          }
          findAllDomain {
            id
            lbl
          }
          findAllMenu {
            id
            lbl
          }
          findAllLang {
            id
            lbl
          }
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = "租户";
      const buffer = await workerFn(
        `${ location.origin }/import_template/base/tenant.xlsx`,
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
export function useExportExcelTenant() {
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: TenantSearch,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: TenantSearch, $page: PageInput, , $sort: [SortInput!]) {
            findAllTenant(search: $search, page: $page, sort: $sort) {
              ${ tenantQueryField }
            }
            findAllDomain {
              lbl
            }
            findAllMenu {
              lbl
            }
            findAllLang {
              lbl
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
          page: {
            isResultLimit: false,
          },
          sort,
        },
      }, opt);
      for (const model of data.findAllTenant) {
        await setLblByIdTenant(model, true);
      }
      try {
        const sheetName = "租户";
        const buffer = await workerFn(
          `${ location.origin }/excel_template/base/tenant.xlsx`,
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
 * 批量导入 租户
 */
export async function importModelsTenant(
  inputs: TenantInput[],
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
      await createsTenant(
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
 * 查找 租户 order_by 字段的最大值
 */
export async function findLastOrderByTenant(
  search?: TenantSearch,
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByTenant: Query["findLastOrderByTenant"];
  } = await query({
    query: /* GraphQL */ `
      query($search: TenantSearch) {
        findLastOrderByTenant(search: $search)
      }
    `,
  }, opt);
  
  const order_by = data.findLastOrderByTenant;
  
  return order_by;
}

/**
 * 获取 租户 字段注释
 */
export async function getFieldCommentsTenant(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsTenant: Query["getFieldCommentsTenant"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsTenant {
          id,
          code,
          lbl,
          domain_ids,
          domain_ids_lbl,
          menu_ids,
          menu_ids_lbl,
          title,
          info,
          lang_id,
          lang_id_lbl,
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
  
  const field_comments = data.getFieldCommentsTenant as TenantFieldComment;
  
  return field_comments;
}

export function getPagePathTenant() {
  return "/base/tenant";
}

/** 新增时的默认值 */
export async function getDefaultInputTenant() {
  const defaultInput: TenantInput = {
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
