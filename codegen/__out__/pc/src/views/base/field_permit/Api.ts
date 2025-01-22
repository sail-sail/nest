
import {
  UniqueType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  fieldPermitQueryField,
} from "./Model";

import {
  findTree as findMenuTree,
} from "@/views/base/menu/Api";

async function setLblById(
  model?: FieldPermitModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
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
    order_by: model?.order_by,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找字段权限列表
 */
export async function findAll(
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
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个字段权限
 */
export async function findOne(
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
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找字段权限总数
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
 * 根据 id 修改字段权限
 */
export async function updateById(
  id: FieldPermitId,
  input: FieldPermitInput,
  opt?: GqlOpt,
): Promise<FieldPermitId> {
  input = intoInput(input);
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
 * 根据 id 查找字段权限
 */
export async function findById(
  id: FieldPermitId,
  opt?: GqlOpt,
) {
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
  await setLblById(model);
  return model;
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
 * 查找 字段权限 order_by 字段的最大值
 */
export async function findLastOrderBy(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByFieldPermit: Query["findLastOrderByFieldPermit"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderByFieldPermit
      }
    `,
  }, opt);
  const res = data.findLastOrderByFieldPermit;
  return res;
}

export function getPagePath() {
  return "/base/field_permit";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: FieldPermitInput = {
    order_by: 1,
  };
  return defaultInput;
}
