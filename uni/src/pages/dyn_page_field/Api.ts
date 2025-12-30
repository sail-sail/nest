
import {
  UniqueType,
} from "#/types.ts";

import {
  DynPageFieldAlign,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  dynPageFieldQueryField,
} from "./Model.ts";

export async function setLblByIdDynPageField(
  model?: DynPageFieldModel | null,
) {
  if (!model) {
    return;
  }
}

export function intoInputDynPageField(
  model?: DynPageFieldInput,
) {
  const input: DynPageFieldInput = {
    // ID
    id: model?.id,
    // 编码
    code: model?.code,
    // 动态页面
    dyn_page_id: model?.dyn_page_id,
    dyn_page_id_lbl: model?.dyn_page_id_lbl,
    // 名称
    lbl: model?.lbl,
    // 类型
    type: model?.type,
    // 属性
    attrs: model?.attrs,
    // 计算公式
    formula: model?.formula,
    // 必填
    is_required: model?.is_required,
    is_required_lbl: model?.is_required_lbl,
    // 查询条件
    is_search: model?.is_search,
    is_search_lbl: model?.is_search_lbl,
    // 宽度
    width: model?.width != null ? Number(model?.width || 0) : undefined,
    // 对齐方式
    align: model?.align,
    align_lbl: model?.align_lbl,
    // 启用
    is_enabled: model?.is_enabled,
    is_enabled_lbl: model?.is_enabled_lbl,
    // 排序
    order_by: model?.order_by != null ? Number(model?.order_by || 0) : undefined,
  };
  return input;
}

/**
 * 根据搜索条件查找 动态页面字段 列表
 */
export async function findAllDynPageField(
  search?: DynPageFieldSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDynPageField: DynPageFieldModel[];
  } = await query({
    query: `
      query($search: DynPageFieldSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDynPageField(search: $search, page: $page, sort: $sort) {
          ${ dynPageFieldQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllDynPageField;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdDynPageField(model);
  }
  return models;
}

/**
 * 根据条件查找第一个动态页面字段
 */
export async function findOneDynPageField(
  search?: DynPageFieldSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneDynPageField?: DynPageFieldModel;
  } = await query({
    query: `
      query($search: DynPageFieldSearch, $sort: [SortInput!]) {
        findOneDynPageField(search: $search, sort: $sort) {
          ${ dynPageFieldQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneDynPageField;
  
  await setLblByIdDynPageField(model);
  
  return model;
}

/**
 * 根据条件查找第一个 动态页面字段, 如果不存在则抛错
 */
export async function findOneOkDynPageField(
  search?: DynPageFieldSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkDynPageField?: DynPageFieldModel;
  } = await query({
    query: `
      query($search: DynPageFieldSearch, $sort: [SortInput!]) {
        findOneOkDynPageField(search: $search, sort: $sort) {
          ${ dynPageFieldQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkDynPageField;
  
  await setLblByIdDynPageField(model);
  
  return model;
}

/**
 * 根据搜索条件查找 动态页面字段 总数
 */
export async function findCountDynPageField(
  search?: DynPageFieldSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountDynPageField: Query["findCountDynPageField"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DynPageFieldSearch) {
        findCountDynPageField(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountDynPageField;
  return count;
}

/**
 * 创建 动态页面字段
 */
export async function createDynPageField(
  input: DynPageFieldInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DynPageFieldId> {
  const ids = await createsDynPageField(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 动态页面字段
 */
export async function createsDynPageField(
  inputs: DynPageFieldInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<DynPageFieldId[]> {
  inputs = inputs.map(intoInputDynPageField);
  const data: {
    createsDynPageField: Mutation["createsDynPageField"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [DynPageFieldInput!]!, $unique_type: UniqueType) {
        createsDynPageField(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsDynPageField;
  return ids;
}

/**
 * 根据 id 修改 动态页面字段
 */
export async function updateByIdDynPageField(
  id: DynPageFieldId,
  input: DynPageFieldInput,
  opt?: GqlOpt,
): Promise<DynPageFieldId> {
  input = intoInputDynPageField(input);
  const data: {
    updateByIdDynPageField: Mutation["updateByIdDynPageField"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: DynPageFieldId!, $input: DynPageFieldInput!) {
        updateByIdDynPageField(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: DynPageFieldId = data.updateByIdDynPageField;
  return id2;
}

/**
 * 根据 id 查找 动态页面字段
 */
export async function findByIdDynPageField(
  id: DynPageFieldId,
  opt?: GqlOpt,
): Promise<DynPageFieldModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdDynPageField?: DynPageFieldModel;
  } = await query({
    query: `
      query($id: DynPageFieldId!) {
        findByIdDynPageField(id: $id) {
          ${ dynPageFieldQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdDynPageField;
  
  await setLblByIdDynPageField(model);
  
  return model;
}

/**
 * 根据 id 查找 动态页面字段, 如果不存在则抛错
 */
export async function findByIdOkDynPageField(
  id: DynPageFieldId,
  opt?: GqlOpt,
): Promise<DynPageFieldModel> {
  
  const data: {
    findByIdOkDynPageField: DynPageFieldModel;
  } = await query({
    query: `
      query($id: DynPageFieldId!) {
        findByIdOkDynPageField(id: $id) {
          ${ dynPageFieldQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkDynPageField;
  
  await setLblByIdDynPageField(model);
  
  return model;
}

/**
 * 根据 ids 查找 动态页面字段
 */
export async function findByIdsDynPageField(
  ids: DynPageFieldId[],
  opt?: GqlOpt,
): Promise<DynPageFieldModel[]> {
  if (ids.length === 0) {
    return [ ];
  }
  opt = opt || { };
  opt.showErrMsg = false;
  const data: {
    findByIdsDynPageField: DynPageFieldModel[];
  } = await query({
    query: `
      query($ids: [DynPageFieldId!]!) {
        findByIdsDynPageField(ids: $ids) {
          ${ dynPageFieldQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsDynPageField;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdDynPageField(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 动态页面字段, 出现查询不到的 id 则报错
 */
export async function findByIdsOkDynPageField(
  ids: DynPageFieldId[],
  opt?: GqlOpt,
): Promise<DynPageFieldModel[]> {
  if (ids.length === 0) {
    return [ ];
  }
  opt = opt || { };
  opt.showErrMsg = false;
  const data: {
    findByIdsOkDynPageField: DynPageFieldModel[];
  } = await query({
    query: `
      query($ids: [DynPageFieldId!]!) {
        findByIdsOkDynPageField(ids: $ids) {
          ${ dynPageFieldQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkDynPageField;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdDynPageField(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 动态页面字段
 */
export async function deleteByIdsDynPageField(
  ids: DynPageFieldId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsDynPageField: Mutation["deleteByIdsDynPageField"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DynPageFieldId!]!) {
        deleteByIdsDynPageField(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsDynPageField;
  return res;
}

/**
 * 根据 ids 启用或禁用 动态页面字段
 */
export async function enableByIdsDynPageField(
  ids: DynPageFieldId[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    enableByIdsDynPageField: Mutation["enableByIdsDynPageField"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DynPageFieldId!]!, $is_enabled: Int!) {
        enableByIdsDynPageField(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIdsDynPageField;
  return res;
}

/**
 * 根据 ids 还原 动态页面字段
 */
export async function revertByIdsDynPageField(
  ids: DynPageFieldId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsDynPageField: Mutation["revertByIdsDynPageField"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DynPageFieldId!]!) {
        revertByIdsDynPageField(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsDynPageField;
  return res;
}

/**
 * 根据 ids 彻底删除 动态页面字段
 */
export async function forceDeleteByIdsDynPageField(
  ids: DynPageFieldId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsDynPageField: Mutation["forceDeleteByIdsDynPageField"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [DynPageFieldId!]!) {
        forceDeleteByIdsDynPageField(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsDynPageField;
  return res;
}

export async function findAllDynPage(
  search?: DynPageSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllDynPage: DynPageModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: DynPageSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllDynPage(search: $search, page: $page, sort: $sort) {
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
  const dyn_page_models = data.findAllDynPage;
  return dyn_page_models;
}

export async function getListDynPage() {
  const data = await findAllDynPage(
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

/**
 * 查找 动态页面字段 order_by 字段的最大值
 */
export async function findLastOrderByDynPageField(
  search?: DynPageFieldSearch,
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderByDynPageField: Query["findLastOrderByDynPageField"];
  } = await query({
    query: /* GraphQL */ `
      query($search: DynPageFieldSearch) {
        findLastOrderByDynPageField(search: $search)
      }
    `,
  }, opt);
  
  const order_by = data.findLastOrderByDynPageField;
  
  return order_by;
}

/**
 * 获取 动态页面字段 字段注释
 */
export async function getFieldCommentsDynPageField(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsDynPageField: Query["getFieldCommentsDynPageField"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsDynPageField {
          id,
          code,
          dyn_page_id,
          dyn_page_id_lbl,
          lbl,
          type,
          attrs,
          formula,
          is_required,
          is_required_lbl,
          is_search,
          is_search_lbl,
          width,
          align,
          align_lbl,
          is_enabled,
          is_enabled_lbl,
          order_by,
        }
      }
    `,
    variables: {
    },
  }, opt);
  
  const field_comments = data.getFieldCommentsDynPageField as DynPageFieldFieldComment;
  
  return field_comments;
}

export function getPagePathDynPageField() {
  return "/base/dyn_page_field";
}

/** 新增时的默认值 */
export async function getDefaultInputDynPageField() {
  const defaultInput: DynPageFieldInput = {
    is_required: 0,
    is_search: 0,
    width: 0,
    align: DynPageFieldAlign.Center,
    is_enabled: 1,
    order_by: 1,
  };
  return defaultInput;
}
