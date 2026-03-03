

import {
  ServerLogLevel,
} from "#/types.ts";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types.ts";

import {
  serverLogQueryField,
} from "./Model.ts";

export async function setLblByIdServerLog(
  model?: ServerLogModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInputServerLog(
  model?: ServerLogInput,
) {
  const input: ServerLogInput = {
    // ID
    id: model?.id,
    // 日志日期
    log_date: model?.log_date,
    log_date_lbl: model?.log_date_lbl,
    // 日志时间
    log_time: model?.log_time,
    log_time_lbl: model?.log_time_lbl,
    // 日志级别
    level: model?.level,
    level_lbl: model?.level_lbl,
    // 模块
    module: model?.module,
    // 请求ID
    req_id: model?.req_id,
    // 日志内容
    content: model?.content,
  };
  return input;
}

/**
 * 根据搜索条件查找 系统日志 列表
 */
export async function findAllServerLog(
  search?: ServerLogSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllServerLog: ServerLogModel[];
  } = await query({
    query: `
      query($search: ServerLogSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllServerLog(search: $search, page: $page, sort: $sort) {
          ${ serverLogQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllServerLog;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdServerLog(model);
  }
  return models;
}

/**
 * 根据条件查找第一个 系统日志
 */
export async function findOneServerLog(
  search?: ServerLogSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneServerLog?: ServerLogModel;
  } = await query({
    query: `
      query($search: ServerLogSearch, $sort: [SortInput!]) {
        findOneServerLog(search: $search, sort: $sort) {
          ${ serverLogQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneServerLog;
  
  await setLblByIdServerLog(model);
  
  return model;
}

/**
 * 根据条件查找第一个 系统日志, 如果不存在则抛错
 */
export async function findOneOkServerLog(
  search?: ServerLogSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  
  const data: {
    findOneOkServerLog?: ServerLogModel;
  } = await query({
    query: `
      query($search: ServerLogSearch, $sort: [SortInput!]) {
        findOneOkServerLog(search: $search, sort: $sort) {
          ${ serverLogQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  
  const model = data.findOneOkServerLog;
  
  await setLblByIdServerLog(model);
  
  return model;
}

/**
 * 根据搜索条件查找 系统日志 总数
 */
export async function findCountServerLog(
  search?: ServerLogSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountServerLog: Query["findCountServerLog"];
  } = await query({
    query: /* GraphQL */ `
      query($search: ServerLogSearch) {
        findCountServerLog(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountServerLog;
  return count;
}

/**
 * 根据 id 查找 系统日志
 */
export async function findByIdServerLog(
  id: ServerLogId,
  opt?: GqlOpt,
): Promise<ServerLogModel | undefined> {
  
  if (!id) {
    return;
  }
  
  const data: {
    findByIdServerLog?: ServerLogModel;
  } = await query({
    query: `
      query($id: ServerLogId!) {
        findByIdServerLog(id: $id) {
          ${ serverLogQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdServerLog;
  
  await setLblByIdServerLog(model);
  
  return model;
}

/**
 * 根据 id 查找 系统日志, 如果不存在则抛错
 */
export async function findByIdOkServerLog(
  id: ServerLogId,
  opt?: GqlOpt,
): Promise<ServerLogModel> {
  
  const data: {
    findByIdOkServerLog: ServerLogModel;
  } = await query({
    query: `
      query($id: ServerLogId!) {
        findByIdOkServerLog(id: $id) {
          ${ serverLogQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  
  const model = data.findByIdOkServerLog;
  
  await setLblByIdServerLog(model);
  
  return model;
}

/**
 * 根据 ids 查找 系统日志
 */
export async function findByIdsServerLog(
  ids: ServerLogId[],
  opt?: GqlOpt,
): Promise<ServerLogModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsServerLog: ServerLogModel[];
  } = await query({
    query: `
      query($ids: [ServerLogId!]!) {
        findByIdsServerLog(ids: $ids) {
          ${ serverLogQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsServerLog;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdServerLog(model);
  }
  
  return models;
}

/**
 * 根据 ids 查找 系统日志, 出现查询不到的 id 则报错
 */
export async function findByIdsOkServerLog(
  ids: ServerLogId[],
  opt?: GqlOpt,
): Promise<ServerLogModel[]> {
  
  if (ids.length === 0) {
    return [ ];
  }
  
  const data: {
    findByIdsOkServerLog: ServerLogModel[];
  } = await query({
    query: `
      query($ids: [ServerLogId!]!) {
        findByIdsOkServerLog(ids: $ids) {
          ${ serverLogQueryField }
        }
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  
  const models = data.findByIdsOkServerLog;
  
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblByIdServerLog(model);
  }
  
  return models;
}

/**
 * 获取 系统日志 字段注释
 */
export async function getFieldCommentsServerLog(
  opt?: GqlOpt,
) {
  
  const data: {
    getFieldCommentsServerLog: Query["getFieldCommentsServerLog"];
  } = await query({
    query: /* GraphQL */ `
      query {
        getFieldCommentsServerLog {
          id,
          log_date,
          log_date_lbl,
          log_time,
          log_time_lbl,
          level,
          level_lbl,
          module,
          req_id,
          content,
        }
      }
    `,
    variables: {
    },
  }, opt);
  
  const field_comments = data.getFieldCommentsServerLog as ServerLogFieldComment;
  
  return field_comments;
}

export function getPagePathServerLog() {
  return "/base/server_log";
}

/**
 * 获取可用的日志日期列表
 */
export async function getServerLogDates(
  opt?: GqlOpt,
): Promise<string[]> {
  
  const data: {
    getServerLogDates: string[];
  } = await query({
    query: /* GraphQL */ `
      query {
        getServerLogDates
      }
    `,
    variables: {
    },
  }, opt);
  
  return data.getServerLogDates;
}

/** 新增时的默认值 */
export async function getDefaultInputServerLog() {
  const defaultInput: ServerLogInput = {
    level: ServerLogLevel.Trace,
  };
  return defaultInput;
}
