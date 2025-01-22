

import {
  LoginLogType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  loginLogQueryField,
} from "./Model";

async function setLblById(
  model?: LoginLogModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
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
 * 根据搜索条件查找登录日志列表
 */
export async function findAll(
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
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个登录日志
 */
export async function findOne(
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
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找登录日志总数
 */
export async function findCount(
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
 * 根据 id 查找登录日志
 */
export async function findById(
  id: LoginLogId,
  opt?: GqlOpt,
) {
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
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除登录日志
 */
export async function deleteByIds(
  ids: LoginLogId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 还原登录日志
 */
export async function revertByIds(
  ids: LoginLogId[],
  opt?: GqlOpt,
) {
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
 * 根据 ids 彻底删除登录日志
 */
export async function forceDeleteByIds(
  ids: LoginLogId[],
  opt?: GqlOpt,
) {
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

export function getPagePath() {
  return "/base/login_log";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: LoginLogInput = {
    type: LoginLogType.Account,
    is_succ: 0,
  };
  return defaultInput;
}
