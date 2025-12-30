
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  dynPageQueryField,
} from "./Model.ts";

import {
  findTreeMenu,
} from "@/pages/menu/Api.ts";

import {
  intoInputDynPageField,
  setLblByIdDynPageField,
} from "@/pages/dyn_page_field/Api.ts";

export async function setLblByIdDynPage(
  model?: DynPageModel | null,
) {
  if (!model) {
    return;
  }
  // 动态页面字段
  model.dyn_page_field = model.dyn_page_field ?? [ ];
  for (let i = 0; i < model.dyn_page_field.length; i++) {
    const dyn_page_field_model = model.dyn_page_field[i] as DynPageFieldModel;
    await setLblByIdDynPageField(dyn_page_field_model);
  }
}

export function intoInputDynPage(
  model?: DynPageInput,
) {
  const input: DynPageInput = {
    // ID
    id: model?.id,
    // 路由
    code: model?.code,
    // 名称
    lbl: model?.lbl,
    // 父菜单
    parent_menu_id: model?.parent_menu_id,
    parent_menu_id_lbl: model?.parent_menu_id_lbl,
    // 所属角色
    role_ids: model?.role_ids,
    role_ids_lbl: model?.role_ids_lbl,
    // 排序
    order_by: model?.order_by != null ? Number(model?.order_by || 0) : undefined,
    // 启用
    is_enabled: model?.is_enabled,
    is_enabled_lbl: model?.is_enabled_lbl,
    // 备注
    rem: model?.rem,
    // 动态页面字段
    dyn_page_field: model?.dyn_page_field?.map(intoInputDynPageField),
  };
  return input;
}

/**
 * 根据搜索条件查找 动态页面 列表
 */
export async function findAllDynPage(
  search?: DynPageSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDynPage: DynPageModel[];
  } = await query({
    query: `
      query($search: DynPageSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDynPage(search: $search, page: $page, sort: $sort) {
          ${ dynPageQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllDynPage;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdDynPage(model);
  }
  return models;
}

/**
 * 根据条件查找第一个动态页面
 */
export async function findOneDynPage(
  search?: DynPageSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneDynPage?: DynPageModel;
  } = await query({
    query: `
      query($search: DynPageSearch, $sort: [SortInput!]) {
        findOneDynPage(search: $search, sort: $sort) {
          ${ dynPageQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneDynPage;
  
  await setLblByIdDynPage(model);
  
  return model;
}

/**
 * 根据条件查找第一个 动态页面, 如果不存在则抛错
 */
export async function findOneOkDynPage(
  search?: DynPageSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkDynPage?: DynPageModel;
  } = await query({
    query: `
      query($search: DynPageSearch, $sort: [SortInput!]) {
        findOneOkDynPage(search: $search, sort: $sort) {
          ${ dynPageQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkDynPage;
  
  await setLblByIdDynPage(model);
  
  return model;
}

/**
 * 根据搜索条件查找 动态页面 总数
 */
export async function findCountDynPage(
  search?: DynPageSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountDynPage: Query["findCountDynPage"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DynPageSearch) {
        findCountDynPage(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountDynPage;
  return count;
}

/**
 * 创建 动态页面
 */
export async function createDynPage(
  input: DynPageInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DynPageId> {
  const ids = await createsDynPage(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 动态页面
 */
export async function createsDynPage(
  inputs: DynPageInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DynPageId[]> {
  inputs = inputs.map(intoInputDynPage);
  const data: {
    createsDynPage: Mutation["createsDynPage"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [DynPageInput!]!, $unique_type: UniqueType) {
        createsDynPage(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsDynPage;
  return ids;
}

/**
 * 根据 id 修改 动态页面
 */
export async function updateByIdDynPage(
  id: DynPageId,
  input: DynPageInput,
  opt?: GqlOpt,
): Promise<DynPageId> {
  input = intoInputDynPage(input);
  const data: {
    updateByIdDynPage: Mutation["updateByIdDynPage"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: DynPageId!, $input: DynPageInput!) {
        updateByIdDynPage(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: DynPageId = data.updateByIdDynPage;
  return id2;
}

/**
 * 根据 id 查找 动态页面
 */
export async function findByIdDynPage(
  id: DynPageId,
  opt?: GqlOpt,
): Promise<DynPageModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdDynPage?: DynPageModel;
  } = await query({
    query: `
      query($id: DynPageId!) {
        findByIdDynPage(id: $id) {
          ${ dynPageQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdDynPage;
  
  await setLblByIdDynPage(model);
  
  return model;
}

/**
 * 根据 id 查找 动态页面, 如果不存在则抛错
 */
export async function findByIdOkDynPage(
  id: DynPageId,
  opt?: GqlOpt,
): Promise<DynPageModel> {
  
  const data: {
    findByIdOkDynPage: DynPageModel;
  } = await query({
    query: `
      query($id: DynPageId!) {
        findByIdOkDynPage(id: $id) {
          ${ dynPageQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkDynPage;
  
  await setLblByIdDynPage(model);
  
  return model;
}

/**
 * 根据 ids 查找 动态页面
 */
export async function findByIdsDynPage(
  ids: DynPageId[],
  opt?: GqlOpt,
): Promise<DynPageModel[]> {
  if (ids.length === 0) {
    return [ ];
  }
  opt = opt || { };
  opt.showErrMsg = false;
  const data: {
    findByIdsDynPage: DynPageModel[];
  } = await query({
    query: `
      query($ids: [DynPageId!]!) {
        findByIdsDynPage(ids: $ids) {
          ${ dynPageQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsDynPage;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdDynPage(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 动态页面, 出现查询不到的 id 则报错
 */
export async function findByIdsOkDynPage(
  ids: DynPageId[],
  opt?: GqlOpt,
): Promise<DynPageModel[]> {
  if (ids.length === 0) {
    return [ ];
  }
  opt = opt || { };
  opt.showErrMsg = false;
  const data: {
    findByIdsOkDynPage: DynPageModel[];
  } = await query({
    query: `
      query($ids: [DynPageId!]!) {
        findByIdsOkDynPage(ids: $ids) {
          ${ dynPageQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkDynPage;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdDynPage(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 动态页面
 */
export async function deleteByIdsDynPage(
  ids: DynPageId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsDynPage: Mutation["deleteByIdsDynPage"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DynPageId!]!) {
        deleteByIdsDynPage(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsDynPage;
  return res;
}

/**
 * 根据 ids 启用或禁用 动态页面
 */
export async function enableByIdsDynPage(
  ids: DynPageId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    enableByIdsDynPage: Mutation["enableByIdsDynPage"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DynPageId!]!, $is_enabled: Int!) {
        enableByIdsDynPage(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsDynPage;
  return res;
}

/**
 * 根据 ids 还原 动态页面
 */
export async function revertByIdsDynPage(
  ids: DynPageId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsDynPage: Mutation["revertByIdsDynPage"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DynPageId!]!) {
        revertByIdsDynPage(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsDynPage;
  return res;
}

/**
 * 根据 ids 彻底删除 动态页面
 */
export async function forceDeleteByIdsDynPage(
  ids: DynPageId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsDynPage: Mutation["forceDeleteByIdsDynPage"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DynPageId!]!) {
        forceDeleteByIdsDynPage(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsDynPage;
  return res;
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

export async function findAllRole(
  search?: RoleSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllRole: RoleModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: RoleSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllRole(search: $search, page: $page, sort: $sort) {
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
  const role_models = data.findAllRole;
  return role_models;
}

export async function getListRole() {
  const data = await findAllRole(
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
 * 查找 动态页面 order_by 字段的最大值
 */
export async function findLastOrderByDynPage(
  search?: DynPageSearch,
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByDynPage: Query["findLastOrderByDynPage"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DynPageSearch) {
        findLastOrderByDynPage(search: $search)
      }
    `,
  }, opt);
  
  const order_by = data.findLastOrderByDynPage;
  
  return order_by;
}

/**
 * 获取 动态页面 字段注释
 */
export async function getFieldCommentsDynPage(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsDynPage: Query["getFieldCommentsDynPage"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsDynPage {
          id,
          code,
          lbl,
          parent_menu_id,
          parent_menu_id_lbl,
          role_ids,
          role_ids_lbl,
          order_by,
          is_enabled,
          is_enabled_lbl,
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
  
  const field_comments = data.getFieldCommentsDynPage as DynPageFieldComment;
  
  return field_comments;
}

export function getPagePathDynPage() {
  return "/base/dyn_page";
}

/** 新增时的默认值 */
export async function getDefaultInputDynPage() {
  const defaultInput: DynPageInput = {
    order_by: 1,
    is_enabled: 1,
  };
  return defaultInput;
}
