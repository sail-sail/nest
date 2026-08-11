import {
  UniqueType,
} from "#/types.ts";

import {
  UsrType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  usrQueryField,
} from "./Model.ts";

import {
  findTreeDept,
} from "@/pages/dept/Api.ts";

export async function setLblByIdUsr(
  model?: UsrModel | null,
) {
  if (!model) {
    return;
  }
  
  // 头像
  if (model.img) {
    model.img_lbl = getImgUrl({
      id: model.img,
    }) || "";
  }
}

export function intoInputUsr(
  model?: UsrInput | null,
) {
  const input: UsrInput = {
    // ID
    id: model?.id,
    // 头像
    img: model?.img,
    // 名称
    lbl: model?.lbl,
    // 用户名
    username: model?.username,
    // 密码
    password: model?.password,
    // 所属角色
    role_ids: model?.role_ids,
    role_ids_lbl: model?.role_ids_lbl,
    // 所属部门
    dept_ids: model?.dept_ids,
    dept_ids_lbl: model?.dept_ids_lbl,
    // 所属组织
    org_ids: model?.org_ids,
    org_ids_lbl: model?.org_ids_lbl,
    // 默认组织
    default_org_id: model?.default_org_id,
    default_org_id_lbl: model?.default_org_id_lbl,
    // 类型
    type: model?.type,
    type_lbl: model?.type_lbl,
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
    // 隐藏
    is_hidden: model?.is_hidden,
    is_hidden_lbl: model?.is_hidden_lbl,
  };
  return input;
}

/**
 * 根据搜索条件查找 用户 列表
 */
export async function findAllUsr(
  search?: UsrSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllUsr: UsrModel[];
  } = await query({
    query: `
      query($search: UsrSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllUsr(search: $search, page: $page, sort: $sort) {
          ${ usrQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllUsr;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdUsr(model);
  }
  return models;
}

/**
 * 根据条件查找第一个用户
 */
export async function findOneUsr(
  search?: UsrSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneUsr?: UsrModel;
  } = await query({
    query: `
      query($search: UsrSearch, $sort: [SortInput!]) {
        findOneUsr(search: $search, sort: $sort) {
          ${ usrQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneUsr;
  
  await setLblByIdUsr(model);
  
  return model;
}

/**
 * 根据条件查找第一个 用户, 如果不存在则抛错
 */
export async function findOneOkUsr(
  search?: UsrSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkUsr?: UsrModel;
  } = await query({
    query: `
      query($search: UsrSearch, $sort: [SortInput!]) {
        findOneOkUsr(search: $search, sort: $sort) {
          ${ usrQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkUsr;
  
  await setLblByIdUsr(model);
  
  return model;
}

/**
 * 根据搜索条件查找 用户 总数
 */
export async function findCountUsr(
  search?: UsrSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountUsr: Query["findCountUsr"];
  } = await query({
    query: /* GraphQL */ `
      query($search: UsrSearch) {
        findCountUsr(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountUsr;
  return count;
}

/**
 * 创建 用户
 */
export async function createUsr(
  input: UsrInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<UsrId> {
  const ids = await createsUsr(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 用户
 */
export async function createsUsr(
  inputs: UsrInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<UsrId[]> {
  inputs = inputs.map(intoInputUsr);
  const data: {
    createsUsr: Mutation["createsUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [UsrInput!]!, $unique_type: UniqueType) {
        createsUsr(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsUsr;
  return ids;
}

/**
 * 根据 id 修改 用户
 */
export async function updateByIdUsr(
  id: UsrId,
  input: UsrInput,
  opt?: GqlOpt,
): Promise<UsrId> {
  input = intoInputUsr(input);
  const data: {
    updateByIdUsr: Mutation["updateByIdUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: UsrId!, $input: UsrInput!) {
        updateByIdUsr(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: UsrId = data.updateByIdUsr;
  return id2;
}

/**
 * 根据 id 查找 用户
 */
export async function findByIdUsr(
  id: UsrId,
  opt?: GqlOpt,
): Promise<UsrModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdUsr?: UsrModel;
  } = await query({
    query: `
      query($id: UsrId!) {
        findByIdUsr(id: $id) {
          ${ usrQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdUsr;
  
  await setLblByIdUsr(model);
  
  return model;
}

/**
 * 根据 id 查找 用户, 如果不存在则抛错
 */
export async function findByIdOkUsr(
  id: UsrId,
  opt?: GqlOpt,
): Promise<UsrModel> {
  
  const data: {
    findByIdOkUsr: UsrModel;
  } = await query({
    query: `
      query($id: UsrId!) {
        findByIdOkUsr(id: $id) {
          ${ usrQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkUsr;
  
  await setLblByIdUsr(model);
  
  return model;
}

/**
 * 根据 ids 查找 用户
 */
export async function findByIdsUsr(
  ids: UsrId[],
  opt?: GqlOpt,
): Promise<UsrModel[]> {
  if (ids.length === 0) {
    return [ ];
  }
  opt = opt || { };
  opt.showErrMsg = false;
  const data: {
    findByIdsUsr: UsrModel[];
  } = await query({
    query: `
      query($ids: [UsrId!]!) {
        findByIdsUsr(ids: $ids) {
          ${ usrQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsUsr;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdUsr(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 用户, 出现查询不到的 id 则报错
 */
export async function findByIdsOkUsr(
  ids: UsrId[],
  opt?: GqlOpt,
): Promise<UsrModel[]> {
  if (ids.length === 0) {
    return [ ];
  }
  opt = opt || { };
  opt.showErrMsg = false;
  const data: {
    findByIdsOkUsr: UsrModel[];
  } = await query({
    query: `
      query($ids: [UsrId!]!) {
        findByIdsOkUsr(ids: $ids) {
          ${ usrQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkUsr;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdUsr(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 用户
 */
export async function deleteByIdsUsr(
  ids: UsrId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsUsr: Mutation["deleteByIdsUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [UsrId!]!) {
        deleteByIdsUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsUsr;
  return res;
}

/**
 * 根据 ids 启用或禁用 用户
 */
export async function enableByIdsUsr(
  ids: UsrId[],
  is_enabled: number,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    enableByIdsUsr: Mutation["enableByIdsUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [UsrId!]!, $is_enabled: Int!) {
        enableByIdsUsr(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsUsr;
  return res;
}

/**
 * 根据 ids 锁定或解锁 用户
 */
export async function lockByIdsUsr(
  ids: UsrId[],
  is_locked: number,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    lockByIdsUsr: Mutation["lockByIdsUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [UsrId!]!, $is_locked: Int!) {
        lockByIdsUsr(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIdsUsr;
  return res;
}

/**
 * 根据 ids 还原 用户
 */
export async function revertByIdsUsr(
  ids: UsrId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsUsr: Mutation["revertByIdsUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [UsrId!]!) {
        revertByIdsUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsUsr;
  return res;
}

/**
 * 根据 ids 彻底删除 用户
 */
export async function forceDeleteByIdsUsr(
  ids: UsrId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsUsr: Mutation["forceDeleteByIdsUsr"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [UsrId!]!) {
        forceDeleteByIdsUsr(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsUsr;
  return res;
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

export async function getListRole(
  search?: RoleSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data = await findAllRole(
    {
      ...search,
      is_enabled: [ 1 ],
    },
    page,
    (sort || [ ]).concat([
      {
        prop: "code",
        order: "descending",
      },
    ]),
    {
      ...opt,
      notLoading: true,
    },
  );
  return data;
}

export async function findAllDept(
  search?: DeptSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDept: DeptModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: DeptSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDept(search: $search, page: $page, sort: $sort) {
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
  const dept_models = data.findAllDept;
  return dept_models;
}

export async function getListDept(
  search?: DeptSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data = await findAllDept(
    {
      ...search,
      is_enabled: [ 1 ],
    },
    page,
    (sort || [ ]).concat([
      {
        prop: "order_by",
        order: "ascending",
      },
    ]),
    {
      ...opt,
      notLoading: true,
    },
  );
  return data;
}

export async function findAllOrg(
  search?: OrgSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllOrg: OrgModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: OrgSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllOrg(search: $search, page: $page, sort: $sort) {
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
  const org_models = data.findAllOrg;
  return org_models;
}

export async function getListOrg(
  search?: OrgSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data = await findAllOrg(
    {
      ...search,
      is_enabled: [ 1 ],
    },
    page,
    (sort || [ ]).concat([
      {
        prop: "order_by",
        order: "ascending",
      },
    ]),
    {
      ...opt,
      notLoading: true,
    },
  );
  return data;
}

export async function getTreeDept() {
  const data = await findTreeDept(
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
 * 查找 用户 order_by 字段的最大值
 */
export async function findLastOrderByUsr(
  search?: UsrSearch,
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByUsr: Query["findLastOrderByUsr"];
  } = await query({
    query: /* GraphQL */ `
      query($search: UsrSearch) {
        findLastOrderByUsr(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  
  const order_by = data.findLastOrderByUsr;
  
  return order_by;
}

/**
 * 获取 用户 字段注释
 */
export async function getFieldCommentsUsr(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsUsr: Query["getFieldCommentsUsr"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsUsr {
          id,
          img,
          lbl,
          username,
          role_ids,
          role_ids_lbl,
          dept_ids,
          dept_ids_lbl,
          org_ids,
          org_ids_lbl,
          default_org_id,
          default_org_id_lbl,
          type,
          type_lbl,
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
  
  const field_comments = data.getFieldCommentsUsr as UsrFieldComment;
  
  return field_comments;
}

export function getPagePathUsr() {
  return "/base/usr";
}

/** 新增时的默认值 */
export async function getDefaultInputUsr() {
  const defaultInput: UsrInput = {
    type: UsrType.Login,
    is_locked: 0,
    is_enabled: 1,
    order_by: 1,
    is_hidden: 0,
  };
  return defaultInput;
}
