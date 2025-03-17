
import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  permitQueryField,
} from "./Model";

import {
  findTree as findMenuTree,
} from "@/views/base/menu/Api";

async function setLblById(
  model?: PermitModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
  model?: PermitInput,
) {
  const input: PermitInput = {
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
    order_by: model?.order_by,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找按钮权限列表
 */
export async function findAll(
  search?: PermitSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllPermit: PermitModel[];
  } = await query({
    query: `
      query($search: PermitSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllPermit(search: $search, page: $page, sort: $sort) {
          ${ permitQueryField }
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
 */
export async function findOne(
  search?: PermitSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOnePermit?: PermitModel;
  } = await query({
    query: `
      query($search: PermitSearch, $sort: [SortInput!]) {
        findOnePermit(search: $search, sort: $sort) {
          ${ permitQueryField }
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
 * 根据 id 修改按钮权限
 */
export async function updateById(
  id: PermitId,
  input: PermitInput,
  opt?: GqlOpt,
): Promise<PermitId> {
  input = intoInput(input);
  const data: {
    updateByIdPermit: Mutation["updateByIdPermit"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: PermitId!, $input: PermitInput!) {
        updateByIdPermit(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: PermitId = data.updateByIdPermit;
  return id2;
}

/**
 * 根据 id 查找按钮权限
 */
export async function findById(
  id?: PermitId,
  opt?: GqlOpt,
): Promise<PermitModel | undefined> {
  if (!id) {
    return;
  }
  const data: {
    findByIdPermit?: PermitModel;
  } = await query({
    query: `
      query($id: PermitId!) {
        findByIdPermit(id: $id) {
          ${ permitQueryField }
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
 * 根据 ids 查找按钮权限
 */
export async function findByIds(
  ids: PermitId[],
  opt?: GqlOpt,
): Promise<PermitModel[]> {
  if (ids.length === 0) {
    return [ ];
  }
  const data: {
    findByIdsPermit: PermitModel[];
  } = await query({
    query: `
      query($ids: [PermitId!]!) {
        findByIdsPermit(ids: $ids) {
          ${ permitQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const models = data.findByIdsPermit;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
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
 * 查找 按钮权限 order_by 字段的最大值
 */
export async function findLastOrderBy(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByPermit: Query["findLastOrderByPermit"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByPermit
      }
    `,
  }, opt);
  const res = data.findLastOrderByPermit;
  return res;
}

export function getPagePath() {
  return "/base/permit";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: PermitInput = {
    order_by: 1,
  };
  return defaultInput;
}
