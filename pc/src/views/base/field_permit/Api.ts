
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  fieldPermitQueryField,
} from "./Model.ts";

import {
  findTreeMenu,
} from "@/views/base/menu/Api.ts";

export async function setLblByIdFieldPermit(
  model?: FieldPermitModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputFieldPermit(
  model?: FieldPermitInput,
) {
  const input: FieldPermitInput = {
    // ID
    id: model?.id,
    // 菜单
    menu_id: model?.menu_id,
    menu_id_lbl: model?.menu_id_lbl,
    // 编码
    code: model?.code,
    // 名称
    lbl: model?.lbl,
    // 排序
    order_by: model?.order_by != null ? Number(model?.order_by || 0) : undefined,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找 字段权限 列表
 */
export async function findAllFieldPermit(
  search?: FieldPermitSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllFieldPermit: FieldPermitModel[];
  } = await query({
    query: `
      query($search: FieldPermitSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllFieldPermit(search: $search, page: $page, sort: $sort) {
          ${ fieldPermitQueryField }
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
    await setLblByIdFieldPermit(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 字段权限
 */
export async function findOneFieldPermit(
  search?: FieldPermitSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneFieldPermit?: FieldPermitModel;
  } = await query({
    query: `
      query($search: FieldPermitSearch, $sort: [SortInput!]) {
        findOneFieldPermit(search: $search, sort: $sort) {
          ${ fieldPermitQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneFieldPermit;
  
  await setLblByIdFieldPermit(model);
  
  return model;
}

/**
 * 根据条件查找第一个 字段权限, 如果不存在则抛错
 */
export async function findOneOkFieldPermit(
  search?: FieldPermitSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkFieldPermit?: FieldPermitModel;
  } = await query({
    query: `
      query($search: FieldPermitSearch, $sort: [SortInput!]) {
        findOneOkFieldPermit(search: $search, sort: $sort) {
          ${ fieldPermitQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkFieldPermit;
  
  await setLblByIdFieldPermit(model);
  
  return model;
}

/**
 * 根据搜索条件查找 字段权限 总数
 */
export async function findCountFieldPermit(
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
 * 根据 id 修改 字段权限
 */
export async function updateByIdFieldPermit(
  id: FieldPermitId,
  input: FieldPermitInput,
  opt?: GqlOpt,
): Promise<FieldPermitId> {
  input = intoInputFieldPermit(input);
  const data: {
    updateByIdFieldPermit: Mutation["updateByIdFieldPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: FieldPermitId!, $input: FieldPermitInput!) {
        updateByIdFieldPermit(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: FieldPermitId = data.updateByIdFieldPermit;
  return id2;
}

/**
 * 根据 id 查找 字段权限
 */
export async function findByIdFieldPermit(
  id: FieldPermitId,
  opt?: GqlOpt,
): Promise<FieldPermitModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdFieldPermit?: FieldPermitModel;
  } = await query({
    query: `
      query($id: FieldPermitId!) {
        findByIdFieldPermit(id: $id) {
          ${ fieldPermitQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdFieldPermit;
  
  await setLblByIdFieldPermit(model);
  
  return model;
}

/**
 * 根据 id 查找 字段权限, 如果不存在则抛错
 */
export async function findByIdOkFieldPermit(
  id: FieldPermitId,
  opt?: GqlOpt,
): Promise<FieldPermitModel> {
  
  const data: {
    findByIdOkFieldPermit: FieldPermitModel;
  } = await query({
    query: `
      query($id: FieldPermitId!) {
        findByIdOkFieldPermit(id: $id) {
          ${ fieldPermitQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkFieldPermit;
  
  await setLblByIdFieldPermit(model);
  
  return model;
}

/**
 * 根据 ids 查找 字段权限
 */
export async function findByIdsFieldPermit(
  ids: FieldPermitId[],
  opt?: GqlOpt,
): Promise<FieldPermitModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsFieldPermit: FieldPermitModel[];
  } = await query({
    query: `
      query($ids: [FieldPermitId!]!) {
        findByIdsFieldPermit(ids: $ids) {
          ${ fieldPermitQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsFieldPermit;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdFieldPermit(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 字段权限, 出现查询不到的 id 则报错
 */
export async function findByIdsOkFieldPermit(
  ids: FieldPermitId[],
  opt?: GqlOpt,
): Promise<FieldPermitModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkFieldPermit: FieldPermitModel[];
  } = await query({
    query: `
      query($ids: [FieldPermitId!]!) {
        findByIdsOkFieldPermit(ids: $ids) {
          ${ fieldPermitQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkFieldPermit;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdFieldPermit(model);
  }
  
  return models;
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

export async function getTreeMenu() {
  const data = await findTreeMenu(
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
 * 查找 字段权限 order_by 字段的最大值
 */
export async function findLastOrderByFieldPermit(
  search?: FieldPermitSearch,
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByFieldPermit: Query["findLastOrderByFieldPermit"];
  } = await query({
    query: /* GraphQL */ `
      query($search: FieldPermitSearch) {
        findLastOrderByFieldPermit(search: $search)
      }
    `,
  }, opt);
  
  const order_by = data.findLastOrderByFieldPermit;
  
  return order_by;
}

/**
 * 获取 字段权限 字段注释
 */
export async function getFieldCommentsFieldPermit(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsFieldPermit: Query["getFieldCommentsFieldPermit"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsFieldPermit {
          id,
          menu_id,
          menu_id_lbl,
          code,
          lbl,
          order_by,
          rem,
        }
      }
    `,
    variables: {
    },
  }, opt);
  
  const field_comments = data.getFieldCommentsFieldPermit as FieldPermitFieldComment;
  
  return field_comments;
}

export function getPagePathFieldPermit() {
  return "/base/field_permit";
}

/** 新增时的默认值 */
export async function getDefaultInputFieldPermit() {
  const defaultInput: FieldPermitInput = {
    order_by: 1,
  };
  return defaultInput;
}
