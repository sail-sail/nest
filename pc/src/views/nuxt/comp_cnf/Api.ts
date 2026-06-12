
import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  compCnfQueryField,
} from "./Model.ts";

export async function setLblByIdCompCnf(
  model?: CompCnfModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputCompCnf(
  model?: CompCnfInput | null,
) {
  const input: CompCnfInput = {
    // ID
    id: model?.id,
    // 分组
    group: model?.group,
    // 名称
    lbl: model?.lbl,
    // 类型
    type: model?.type,
    type_lbl: model?.type_lbl,
    // 排序
    order_by: model?.order_by != null ? Number(model?.order_by || 0) : undefined,
    // 备注
    rem: model?.rem,
    // 值
    val: model?.val,
  };
  return input;
}

/**
 * 根据搜索条件查找 组件配置 列表
 */
export async function findAllCompCnf(
  search?: CompCnfSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllCompCnf: CompCnfModel[];
  } = await query({
    query: `
      query($search: CompCnfSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllCompCnf(search: $search, page: $page, sort: $sort) {
          ${ compCnfQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllCompCnf;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdCompCnf(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 组件配置
 */
export async function findOneCompCnf(
  search?: CompCnfSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneCompCnf?: CompCnfModel;
  } = await query({
    query: `
      query($search: CompCnfSearch, $sort: [SortInput!]) {
        findOneCompCnf(search: $search, sort: $sort) {
          ${ compCnfQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneCompCnf;
  
  await setLblByIdCompCnf(model);
  
  return model;
}

/**
 * 根据条件查找第一个 组件配置, 如果不存在则抛错
 */
export async function findOneOkCompCnf(
  search?: CompCnfSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkCompCnf?: CompCnfModel;
  } = await query({
    query: `
      query($search: CompCnfSearch, $sort: [SortInput!]) {
        findOneOkCompCnf(search: $search, sort: $sort) {
          ${ compCnfQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkCompCnf;
  
  await setLblByIdCompCnf(model);
  
  return model;
}

/**
 * 根据搜索条件查找 组件配置 总数
 */
export async function findCountCompCnf(
  search?: CompCnfSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountCompCnf: Query["findCountCompCnf"];
  } = await query({
    query: /* GraphQL */ `
      query($search: CompCnfSearch) {
        findCountCompCnf(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountCompCnf;
  return count;
}

/**
 * 创建 组件配置
 */
export async function createCompCnf(
  input: CompCnfInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<CompCnfId> {
  const ids = await createsCompCnf(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 组件配置
 */
export async function createsCompCnf(
  inputs: CompCnfInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<CompCnfId[]> {
  inputs = inputs.map(intoInputCompCnf);
  const data: {
    createsCompCnf: Mutation["createsCompCnf"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [CompCnfInput!]!, $unique_type: UniqueType) {
        createsCompCnf(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsCompCnf;
  return ids;
}

/**
 * 根据 id 修改 组件配置
 */
export async function updateByIdCompCnf(
  id: CompCnfId,
  input: CompCnfInput,
  opt?: GqlOpt,
): Promise<CompCnfId> {
  input = intoInputCompCnf(input);
  const data: {
    updateByIdCompCnf: Mutation["updateByIdCompCnf"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: CompCnfId!, $input: CompCnfInput!) {
        updateByIdCompCnf(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: CompCnfId = data.updateByIdCompCnf;
  return id2;
}

/**
 * 根据 id 查找 组件配置
 */
export async function findByIdCompCnf(
  id: CompCnfId,
  opt?: GqlOpt,
): Promise<CompCnfModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdCompCnf?: CompCnfModel;
  } = await query({
    query: `
      query($id: CompCnfId!) {
        findByIdCompCnf(id: $id) {
          ${ compCnfQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdCompCnf;
  
  await setLblByIdCompCnf(model);
  
  return model;
}

/**
 * 根据 id 查找 组件配置, 如果不存在则抛错
 */
export async function findByIdOkCompCnf(
  id: CompCnfId,
  opt?: GqlOpt,
): Promise<CompCnfModel> {
  
  const data: {
    findByIdOkCompCnf: CompCnfModel;
  } = await query({
    query: `
      query($id: CompCnfId!) {
        findByIdOkCompCnf(id: $id) {
          ${ compCnfQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkCompCnf;
  
  await setLblByIdCompCnf(model);
  
  return model;
}

/**
 * 根据 ids 查找 组件配置
 */
export async function findByIdsCompCnf(
  ids: CompCnfId[],
  opt?: GqlOpt,
): Promise<CompCnfModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsCompCnf: CompCnfModel[];
  } = await query({
    query: `
      query($ids: [CompCnfId!]!) {
        findByIdsCompCnf(ids: $ids) {
          ${ compCnfQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsCompCnf;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdCompCnf(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 组件配置, 出现查询不到的 id 则报错
 */
export async function findByIdsOkCompCnf(
  ids: CompCnfId[],
  opt?: GqlOpt,
): Promise<CompCnfModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkCompCnf: CompCnfModel[];
  } = await query({
    query: `
      query($ids: [CompCnfId!]!) {
        findByIdsOkCompCnf(ids: $ids) {
          ${ compCnfQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkCompCnf;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdCompCnf(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 组件配置
 */
export async function deleteByIdsCompCnf(
  ids: CompCnfId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsCompCnf: Mutation["deleteByIdsCompCnf"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CompCnfId!]!) {
        deleteByIdsCompCnf(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsCompCnf;
  return res;
}

/**
 * 根据 ids 还原 组件配置
 */
export async function revertByIdsCompCnf(
  ids: CompCnfId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsCompCnf: Mutation["revertByIdsCompCnf"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CompCnfId!]!) {
        revertByIdsCompCnf(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsCompCnf;
  return res;
}

/**
 * 根据 ids 彻底删除 组件配置
 */
export async function forceDeleteByIdsCompCnf(
  ids: CompCnfId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsCompCnf: Mutation["forceDeleteByIdsCompCnf"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [CompCnfId!]!) {
        forceDeleteByIdsCompCnf(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsCompCnf;
  return res;
}

/**
 * 查找 组件配置 order_by 字段的最大值
 */
export async function findLastOrderByCompCnf(
  search?: CompCnfSearch,
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByCompCnf: Query["findLastOrderByCompCnf"];
  } = await query({
    query: /* GraphQL */ `
      query($search: CompCnfSearch) {
        findLastOrderByCompCnf(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  
  const order_by = data.findLastOrderByCompCnf;
  
  return order_by;
}

/**
 * 获取 组件配置 字段注释
 */
export async function getFieldCommentsCompCnf(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsCompCnf: Query["getFieldCommentsCompCnf"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsCompCnf {
          id,
          group,
          lbl,
          type,
          type_lbl,
          order_by,
          rem,
          val,
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
  
  const field_comments = data.getFieldCommentsCompCnf as CompCnfFieldComment;
  
  return field_comments;
}

export function getPagePathCompCnf() {
  return "/nuxt/comp_cnf";
}

/** 新增时的默认值 */
export async function getDefaultInputCompCnf() {
  const defaultInput: CompCnfInput = {
    type: "text",
    order_by: 1,
  };
  return defaultInput;
}
