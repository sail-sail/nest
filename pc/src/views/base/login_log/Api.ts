

import {
  LoginLogType,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  loginLogQueryField,
} from "./Model.ts";

export async function setLblByIdLoginLog(
  model?: LoginLogModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputLoginLog(
  model?: LoginLogInput,
) {
  const input: LoginLogInput = {
    // ID
    id: model?.id,
    // 类型
    type: model?.type,
    type_lbl: model?.type_lbl,
    // 用户名
    username: model?.username,
    // 登录成功
    is_succ: model?.is_succ,
    is_succ_lbl: model?.is_succ_lbl,
    // IP
    ip: model?.ip,
  };
  return input;
}

/**
 * 根据搜索条件查找 登录日志 列表
 */
export async function findAllLoginLog(
  search?: LoginLogSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllLoginLog: LoginLogModel[];
  } = await query({
    query: `
      query($search: LoginLogSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllLoginLog(search: $search, page: $page, sort: $sort) {
          ${ loginLogQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllLoginLog;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdLoginLog(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 登录日志
 */
export async function findOneLoginLog(
  search?: LoginLogSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneLoginLog?: LoginLogModel;
  } = await query({
    query: `
      query($search: LoginLogSearch, $sort: [SortInput!]) {
        findOneLoginLog(search: $search, sort: $sort) {
          ${ loginLogQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneLoginLog;
  
  await setLblByIdLoginLog(model);
  
  return model;
}

/**
 * 根据条件查找第一个 登录日志, 如果不存在则抛错
 */
export async function findOneOkLoginLog(
  search?: LoginLogSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkLoginLog?: LoginLogModel;
  } = await query({
    query: `
      query($search: LoginLogSearch, $sort: [SortInput!]) {
        findOneOkLoginLog(search: $search, sort: $sort) {
          ${ loginLogQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkLoginLog;
  
  await setLblByIdLoginLog(model);
  
  return model;
}

/**
 * 根据搜索条件查找 登录日志 总数
 */
export async function findCountLoginLog(
  search?: LoginLogSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountLoginLog: Query["findCountLoginLog"];
  } = await query({
    query: /* GraphQL */ `
      query($search: LoginLogSearch) {
        findCountLoginLog(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountLoginLog;
  return count;
}

/**
 * 根据 id 查找 登录日志
 */
export async function findByIdLoginLog(
  id: LoginLogId,
  opt?: GqlOpt,
): Promise<LoginLogModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdLoginLog?: LoginLogModel;
  } = await query({
    query: `
      query($id: LoginLogId!) {
        findByIdLoginLog(id: $id) {
          ${ loginLogQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdLoginLog;
  
  await setLblByIdLoginLog(model);
  
  return model;
}

/**
 * 根据 id 查找 登录日志, 如果不存在则抛错
 */
export async function findByIdOkLoginLog(
  id: LoginLogId,
  opt?: GqlOpt,
): Promise<LoginLogModel> {
  
  const data: {
    findByIdOkLoginLog: LoginLogModel;
  } = await query({
    query: `
      query($id: LoginLogId!) {
        findByIdOkLoginLog(id: $id) {
          ${ loginLogQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkLoginLog;
  
  await setLblByIdLoginLog(model);
  
  return model;
}

/**
 * 根据 ids 查找 登录日志
 */
export async function findByIdsLoginLog(
  ids: LoginLogId[],
  opt?: GqlOpt,
): Promise<LoginLogModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsLoginLog: LoginLogModel[];
  } = await query({
    query: `
      query($ids: [LoginLogId!]!) {
        findByIdsLoginLog(ids: $ids) {
          ${ loginLogQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsLoginLog;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdLoginLog(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 登录日志, 出现查询不到的 id 则报错
 */
export async function findByIdsOkLoginLog(
  ids: LoginLogId[],
  opt?: GqlOpt,
): Promise<LoginLogModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkLoginLog: LoginLogModel[];
  } = await query({
    query: `
      query($ids: [LoginLogId!]!) {
        findByIdsOkLoginLog(ids: $ids) {
          ${ loginLogQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkLoginLog;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdLoginLog(model);
  }
  
  return models;
}

/**
 * 根据 ids 删除 登录日志
 */
export async function deleteByIdsLoginLog(
  ids: LoginLogId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    deleteByIdsLoginLog: Mutation["deleteByIdsLoginLog"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [LoginLogId!]!) {
        deleteByIdsLoginLog(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsLoginLog;
  return res;
}

/**
 * 根据 ids 还原 登录日志
 */
export async function revertByIdsLoginLog(
  ids: LoginLogId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    revertByIdsLoginLog: Mutation["revertByIdsLoginLog"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [LoginLogId!]!) {
        revertByIdsLoginLog(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsLoginLog;
  return res;
}

/**
 * 根据 ids 彻底删除 登录日志
 */
export async function forceDeleteByIdsLoginLog(
  ids: LoginLogId[],
  opt?: GqlOpt,
): Promise<number> {
  if (ids.length === 0) {
    return 0;
  }
  const data: {
    forceDeleteByIdsLoginLog: Mutation["forceDeleteByIdsLoginLog"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [LoginLogId!]!) {
        forceDeleteByIdsLoginLog(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsLoginLog;
  return res;
}

/**
 * 获取 登录日志 字段注释
 */
export async function getFieldCommentsLoginLog(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsLoginLog: Query["getFieldCommentsLoginLog"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsLoginLog {
          id,
          type,
          type_lbl,
          username,
          is_succ,
          is_succ_lbl,
          ip,
          create_time,
          create_time_lbl,
        }
      }
    `,
    variables: {
    },
  }, opt);
  
  const field_comments = data.getFieldCommentsLoginLog as LoginLogFieldComment;
  
  return field_comments;
}

export function getPagePathLoginLog() {
  return "/base/login_log";
}

/** 新增时的默认值 */
export async function getDefaultInputLoginLog() {
  const defaultInput: LoginLogInput = {
    type: LoginLogType.Account,
    is_succ: 0,
  };
  return defaultInput;
}
