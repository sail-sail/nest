import {
  UniqueType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  messageQueryField,
} from "./Model.ts";

export async function setLblByIdMessage(
  model?: MessageModel | null,
) {
  if (!model) {
    return;
  }
}

export function intoInputMessage(
  model?: MessageInput | null,
) {
  const input: MessageInput = {
    // ID
    id: model?.id,
    // 分类
    category: model?.category,
    category_lbl: model?.category_lbl,
    // 发送通道
    channel: model?.channel,
    channel_lbl: model?.channel_lbl,
    // 标题
    title: model?.title,
    // 内容
    content: model?.content,
    // 跳转路由
    route_path: model?.route_path,
    // 跳转参数
    route_query: model?.route_query,
    // 发送人
    sender_usr_id: model?.sender_usr_id,
    sender_usr_id_lbl: model?.sender_usr_id_lbl,
    // 系统消息
    is_sys_msg: model?.is_sys_msg,
    is_sys_msg_lbl: model?.is_sys_msg_lbl,
    // 置顶
    is_pinned: model?.is_pinned,
    is_pinned_lbl: model?.is_pinned_lbl,
    // 所属组织
    org_id: model?.org_id,
    org_id_lbl: model?.org_id_lbl,
  };
  return input;
}

/**
 * 根据搜索条件查找 消息 列表
 */
export async function findAllMessage(
  search?: MessageSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllMessage: MessageModel[];
  } = await query({
    query: `
      query($search: MessageSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllMessage(search: $search, page: $page, sort: $sort) {
          ${ messageQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllMessage;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdMessage(model);
  }
  return models;
}

/**
 * 根据条件查找第一个消息
 */
export async function findOneMessage(
  search?: MessageSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneMessage?: MessageModel;
  } = await query({
    query: `
      query($search: MessageSearch, $sort: [SortInput!]) {
        findOneMessage(search: $search, sort: $sort) {
          ${ messageQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneMessage;
  
  await setLblByIdMessage(model);
  
  return model;
}

/**
 * 根据条件查找第一个 消息, 如果不存在则抛错
 */
export async function findOneOkMessage(
  search?: MessageSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkMessage?: MessageModel;
  } = await query({
    query: `
      query($search: MessageSearch, $sort: [SortInput!]) {
        findOneOkMessage(search: $search, sort: $sort) {
          ${ messageQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkMessage;
  
  await setLblByIdMessage(model);
  
  return model;
}

/**
 * 根据搜索条件查找 消息 总数
 */
export async function findCountMessage(
  search?: MessageSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountMessage: Query["findCountMessage"];
  } = await query({
    query: /* GraphQL */ `
      query($search: MessageSearch) {
        findCountMessage(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountMessage;
  return count;
}

/**
 * 创建 消息
 */
export async function createMessage(
  input: MessageInput,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<MessageId> {
  const ids = await createsMessage(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建 消息
 */
export async function createsMessage(
  inputs: MessageInput[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<MessageId[]> {
  inputs = inputs.map(intoInputMessage);
  const data: {
    createsMessage: Mutation["createsMessage"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [MessageInput!]!, $unique_type: UniqueType) {
        createsMessage(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.createsMessage;
  return ids;
}

/**
 * 根据 id 修改 消息
 */
export async function updateByIdMessage(
  id: MessageId,
  input: MessageInput,
  opt?: GqlOpt,
): Promise<MessageId> {
  input = intoInputMessage(input);
  const data: {
    updateByIdMessage: Mutation["updateByIdMessage"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: MessageId!, $input: MessageInput!) {
        updateByIdMessage(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: MessageId = data.updateByIdMessage;
  return id2;
}

/**
 * 根据 id 查找 消息
 */
export async function findByIdMessage(
  id: MessageId,
  opt?: GqlOpt,
): Promise<MessageModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdMessage?: MessageModel;
  } = await query({
    query: `
      query($id: MessageId!) {
        findByIdMessage(id: $id) {
          ${ messageQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdMessage;
  
  await setLblByIdMessage(model);
  
  return model;
}

/**
 * 根据 id 查找 消息, 如果不存在则抛错
 */
export async function findByIdOkMessage(
  id: MessageId,
  opt?: GqlOpt,
): Promise<MessageModel> {
  
  const data: {
    findByIdOkMessage: MessageModel;
  } = await query({
    query: `
      query($id: MessageId!) {
        findByIdOkMessage(id: $id) {
          ${ messageQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkMessage;
  
  await setLblByIdMessage(model);
  
  return model;
}

/**
 * 根据 ids 查找 消息
 */
export async function findByIdsMessage(
  ids: MessageId[],
  opt?: GqlOpt,
): Promise<MessageModel[]> {
  if (ids.length === 0) {
    return [ ];
  }
  opt = opt || { };
  opt.showErrMsg = false;
  const data: {
    findByIdsMessage: MessageModel[];
  } = await query({
    query: `
      query($ids: [MessageId!]!) {
        findByIdsMessage(ids: $ids) {
          ${ messageQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsMessage;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdMessage(model);
  }
  
  return models;
}

/**
 * 根据搜索条件判断消息是否存在
 */
export async function existsMessage(
  search?: MessageSearch,
  opt?: GqlOpt,
): Promise<boolean> {
  
  const data: {
    existsMessage: Query["existsMessage"];
  } = await query({
    query: /* GraphQL */ `
      query($search: MessageSearch) {
        existsMessage(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  
  const res = data.existsMessage;
  
  return res;
}

/**
 * 根据 ids 查找 消息, 出现查询不到的 id 则报错
 */
export async function findByIdsOkMessage(
  ids: MessageId[],
  opt?: GqlOpt,
): Promise<MessageModel[]> {
  if (ids.length === 0) {
    return [ ];
  }
  opt = opt || { };
  opt.showErrMsg = false;
  const data: {
    findByIdsOkMessage: MessageModel[];
  } = await query({
    query: `
      query($ids: [MessageId!]!) {
        findByIdsOkMessage(ids: $ids) {
          ${ messageQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkMessage;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdMessage(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 消息
 */
export async function deleteByIdsMessage(
  ids: MessageId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsMessage: Mutation["deleteByIdsMessage"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [MessageId!]!) {
        deleteByIdsMessage(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsMessage;
  return res;
}

/**
 * 根据 ids 还原 消息
 */
export async function revertByIdsMessage(
  ids: MessageId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsMessage: Mutation["revertByIdsMessage"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [MessageId!]!) {
        revertByIdsMessage(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsMessage;
  return res;
}

/**
 * 根据 ids 彻底删除 消息
 */
export async function forceDeleteByIdsMessage(
  ids: MessageId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsMessage: Mutation["forceDeleteByIdsMessage"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [MessageId!]!) {
        forceDeleteByIdsMessage(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsMessage;
  return res;
}

export async function findAllUsr(
  search?: UsrSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllUsr: UsrModel[];
  } = await query({
    query: /* GraphQL */ `
      query($search: UsrSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllUsr(search: $search, page: $page, sort: $sort) {
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
  const usr_models = data.findAllUsr;
  return usr_models;
}

export async function getListUsr(
  search?: UsrSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data = await findAllUsr(
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

export function getPagePathMessage() {
  return "/base/message";
}

/** 新增时的默认值 */
export async function getDefaultInputMessage() {
  const usrStore = useUsrStore();
  const defaultInput: MessageInput = {
    channel: "sys",
    is_sys_msg: 0,
    is_pinned: 0,
    org_id: usrStore.getLoginInfo()?.org_id,
  };
  return defaultInput;
}
