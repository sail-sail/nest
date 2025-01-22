

import {
  BackgroundTaskState,
  BackgroundTaskType,
} from "#/types";

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  backgroundTaskQueryField,
} from "./Model";

async function setLblById(
  model?: BackgroundTaskModel | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }
}

export function intoInput(
  model?: BackgroundTaskInput,
) {
  const input: BackgroundTaskInput = {
    // ID
    id: model?.id,
    // 名称
    lbl: model?.lbl,
    // 状态
    state: model?.state,
    state_lbl: model?.state_lbl,
    // 类型
    type: model?.type,
    type_lbl: model?.type_lbl,
    // 执行结果
    result: model?.result,
    // 错误信息
    err_msg: model?.err_msg,
    // 开始时间
    begin_time: model?.begin_time,
    begin_time_lbl: model?.begin_time_lbl,
    begin_time_save_null: model?.begin_time_save_null,
    // 结束时间
    end_time: model?.end_time,
    end_time_lbl: model?.end_time_lbl,
    end_time_save_null: model?.end_time_save_null,
    // 备注
    rem: model?.rem,
  };
  return input;
}

/**
 * 根据搜索条件查找后台任务列表
 */
export async function findAll(
  search?: BackgroundTaskSearch,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAllBackgroundTask: BackgroundTaskModel[];
  } = await query({
    query: `
      query($search: BackgroundTaskSearch, $page: PageInput, $sort: [SortInput!]) {
        findAllBackgroundTask(search: $search, page: $page, sort: $sort) {
          ${ backgroundTaskQueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAllBackgroundTask;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个后台任务
 */
export async function findOne(
  search?: BackgroundTaskSearch,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOneBackgroundTask?: BackgroundTaskModel;
  } = await query({
    query: `
      query($search: BackgroundTaskSearch, $sort: [SortInput!]) {
        findOneBackgroundTask(search: $search, sort: $sort) {
          ${ backgroundTaskQueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOneBackgroundTask;
  await setLblById(model);
  return model;
}

/**
 * 根据搜索条件查找后台任务总数
 */
export async function findCount(
  search?: BackgroundTaskSearch,
  opt?: GqlOpt,
) {
  const data: {
    findCountBackgroundTask: Query["findCountBackgroundTask"];
  } = await query({
    query: /* GraphQL */ `
      query($search: BackgroundTaskSearch) {
        findCountBackgroundTask(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCountBackgroundTask;
  return count;
}

/**
 * 根据 id 查找后台任务
 */
export async function findById(
  id: BackgroundTaskId,
  opt?: GqlOpt,
) {
  const data: {
    findByIdBackgroundTask?: BackgroundTaskModel;
  } = await query({
    query: `
      query($id: BackgroundTaskId!) {
        findByIdBackgroundTask(id: $id) {
          ${ backgroundTaskQueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findByIdBackgroundTask;
  await setLblById(model);
  return model;
}

/**
 * 根据 ids 删除后台任务
 */
export async function deleteByIds(
  ids: BackgroundTaskId[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIdsBackgroundTask: Mutation["deleteByIdsBackgroundTask"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [BackgroundTaskId!]!) {
        deleteByIdsBackgroundTask(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIdsBackgroundTask;
  return res;
}

/**
 * 根据 ids 还原后台任务
 */
export async function revertByIds(
  ids: BackgroundTaskId[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIdsBackgroundTask: Mutation["revertByIdsBackgroundTask"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [BackgroundTaskId!]!) {
        revertByIdsBackgroundTask(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIdsBackgroundTask;
  return res;
}

/**
 * 根据 ids 彻底删除后台任务
 */
export async function forceDeleteByIds(
  ids: BackgroundTaskId[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIdsBackgroundTask: Mutation["forceDeleteByIdsBackgroundTask"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [BackgroundTaskId!]!) {
        forceDeleteByIdsBackgroundTask(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIdsBackgroundTask;
  return res;
}

export function getPagePath() {
  return "/base/background_task";
}

/** 新增时的默认值 */
export async function getDefaultInput() {
  const defaultInput: BackgroundTaskInput = {
    state: BackgroundTaskState.Running,
    type: BackgroundTaskType.Text,
  };
  return defaultInput;
}
