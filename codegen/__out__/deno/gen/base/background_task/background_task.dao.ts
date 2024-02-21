// deno-lint-ignore-file prefer-const no-unused-vars ban-types require-await
import {
  escapeId,
} from "sqlstring";

import dayjs from "dayjs";

import {
  log,
  error,
  escapeDec,
  reqDate,
  delCache as delCacheCtx,
  query,
  queryOne,
  execute,
  QueryArgs,
} from "/lib/context.ts";

import {
  initN,
  ns,
} from "/src/base/i18n/i18n.ts";

import {
  isNotEmpty,
  isEmpty,
  sqlLike,
  shortUuidV4,
} from "/lib/util/string_util.ts";

import {
  deepCompare,
} from "/lib/util/object_util.ts";

import * as validators from "/lib/validators/mod.ts";

import {
  getDict,
} from "/src/base/dict_detail/dict_detail.dao.ts";

import { UniqueException } from "/lib/exceptions/unique.execption.ts";

import {
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import {
  getTenant_id,
} from "/src/base/usr/usr.dao.ts";

import {
  existById as existByIdTenant,
} from "/gen/base/tenant/tenant.dao.ts";

import {
  UniqueType,
  SortOrderEnum,
} from "/gen/types.ts";

import type {
  PageInput,
  SortInput,
  BackgroundTaskState,
  BackgroundTaskType,
} from "/gen/types.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  BackgroundTaskInput,
  BackgroundTaskModel,
  BackgroundTaskSearch,
  BackgroundTaskFieldComment,
  BackgroundTaskId,
} from "./background_task.model.ts";

const route_path = "/base/background_task";

async function getWhereQuery(
  args: QueryArgs,
  search?: BackgroundTaskSearch,
  options?: {
  },
): Promise<string> {
  let whereQuery = "";
  whereQuery += ` t.is_deleted = ${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;
  if (search?.tenant_id == null) {
    const authModel = await getAuthModel();
    const tenant_id = await getTenant_id(authModel?.id);
    if (tenant_id) {
      whereQuery += ` and t.tenant_id = ${ args.push(tenant_id) }`;
    }
  } else if (isNotEmpty(search?.tenant_id) && search?.tenant_id !== "-") {
    whereQuery += ` and t.tenant_id = ${ args.push(search.tenant_id) }`;
  }
  if (isNotEmpty(search?.id)) {
    whereQuery += ` and t.id = ${ args.push(search?.id) }`;
  }
  if (search?.ids && !Array.isArray(search?.ids)) {
    search.ids = [ search.ids ];
  }
  if (search?.ids && search?.ids.length > 0) {
    whereQuery += ` and t.id in ${ args.push(search.ids) }`;
  }
  if (search?.lbl !== undefined) {
    whereQuery += ` and t.lbl = ${ args.push(search.lbl) }`;
  }
  if (search?.lbl === null) {
    whereQuery += ` and t.lbl is null`;
  }
  if (isNotEmpty(search?.lbl_like)) {
    whereQuery += ` and t.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") }`;
  }
  if (search?.state && !Array.isArray(search?.state)) {
    search.state = [ search.state ];
  }
  if (search?.state && search?.state?.length > 0) {
    whereQuery += ` and t.state in ${ args.push(search.state) }`;
  }
  if (search?.type && !Array.isArray(search?.type)) {
    search.type = [ search.type ];
  }
  if (search?.type && search?.type?.length > 0) {
    whereQuery += ` and t.type in ${ args.push(search.type) }`;
  }
  if (search?.result !== undefined) {
    whereQuery += ` and t.result = ${ args.push(search.result) }`;
  }
  if (search?.result === null) {
    whereQuery += ` and t.result is null`;
  }
  if (isNotEmpty(search?.result_like)) {
    whereQuery += ` and t.result like ${ args.push("%" + sqlLike(search?.result_like) + "%") }`;
  }
  if (search?.err_msg !== undefined) {
    whereQuery += ` and t.err_msg = ${ args.push(search.err_msg) }`;
  }
  if (search?.err_msg === null) {
    whereQuery += ` and t.err_msg is null`;
  }
  if (isNotEmpty(search?.err_msg_like)) {
    whereQuery += ` and t.err_msg like ${ args.push("%" + sqlLike(search?.err_msg_like) + "%") }`;
  }
  if (search?.begin_time && search?.begin_time?.length > 0) {
    if (search.begin_time[0] != null) {
      whereQuery += ` and t.begin_time >= ${ args.push(search.begin_time[0]) }`;
    }
    if (search.begin_time[1] != null) {
      whereQuery += ` and t.begin_time <= ${ args.push(search.begin_time[1]) }`;
    }
  }
  if (search?.end_time && search?.end_time?.length > 0) {
    if (search.end_time[0] != null) {
      whereQuery += ` and t.end_time >= ${ args.push(search.end_time[0]) }`;
    }
    if (search.end_time[1] != null) {
      whereQuery += ` and t.end_time <= ${ args.push(search.end_time[1]) }`;
    }
  }
  if (search?.rem !== undefined) {
    whereQuery += ` and t.rem = ${ args.push(search.rem) }`;
  }
  if (search?.rem === null) {
    whereQuery += ` and t.rem is null`;
  }
  if (isNotEmpty(search?.rem_like)) {
    whereQuery += ` and t.rem like ${ args.push("%" + sqlLike(search?.rem_like) + "%") }`;
  }
  if (search?.create_usr_id && !Array.isArray(search?.create_usr_id)) {
    search.create_usr_id = [ search.create_usr_id ];
  }
  if (search?.create_usr_id && search?.create_usr_id.length > 0) {
    whereQuery += ` and create_usr_id_lbl.id in ${ args.push(search.create_usr_id) }`;
  }
  if (search?.create_usr_id === null) {
    whereQuery += ` and create_usr_id_lbl.id is null`;
  }
  if (search?.create_usr_id_is_null) {
    whereQuery += ` and create_usr_id_lbl.id is null`;
  }
  if (search?.create_time && search?.create_time?.length > 0) {
    if (search.create_time[0] != null) {
      whereQuery += ` and t.create_time >= ${ args.push(search.create_time[0]) }`;
    }
    if (search.create_time[1] != null) {
      whereQuery += ` and t.create_time <= ${ args.push(search.create_time[1]) }`;
    }
  }
  if (search?.update_usr_id && !Array.isArray(search?.update_usr_id)) {
    search.update_usr_id = [ search.update_usr_id ];
  }
  if (search?.update_usr_id && search?.update_usr_id.length > 0) {
    whereQuery += ` and update_usr_id_lbl.id in ${ args.push(search.update_usr_id) }`;
  }
  if (search?.update_usr_id === null) {
    whereQuery += ` and update_usr_id_lbl.id is null`;
  }
  if (search?.update_usr_id_is_null) {
    whereQuery += ` and update_usr_id_lbl.id is null`;
  }
  if (search?.update_time && search?.update_time?.length > 0) {
    if (search.update_time[0] != null) {
      whereQuery += ` and t.update_time >= ${ args.push(search.update_time[0]) }`;
    }
    if (search.update_time[1] != null) {
      whereQuery += ` and t.update_time <= ${ args.push(search.update_time[1]) }`;
    }
  }
  if (search?.$extra) {
    const extras = search.$extra;
    for (let i = 0; i < extras.length; i++) {
      const extra = extras[i];
      const queryTmp = await extra(args);
      if (queryTmp) {
        whereQuery += ` ${ queryTmp }`;
      }
    }
  }
  return whereQuery;
}

async function getFromQuery() {
  let fromQuery = `
    base_background_task t
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id
  `;
  return fromQuery;
}

/**
 * 根据条件查找后台任务总数
 * @param { BackgroundTaskSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: BackgroundTaskSearch,
  options?: {
  },
): Promise<number> {
  const table = "base_background_task";
  const method = "findCount";
  
  const args = new QueryArgs();
  let sql = `
    select
      count(1) total
    from
      (
        select
          1
        from
          ${ await getFromQuery() }
  `;
  const whereQuery = await getWhereQuery(args, search, options);
  if (isNotEmpty(whereQuery)) {
    sql += `
        where
          ${ whereQuery }
    `;
  }
  sql += `
        group by t.id
      ) t
  `;
  
  interface Result {
    total: number,
  }
  const model = await queryOne<Result>(sql, args);
  let result = Number(model?.total || 0);
  
  return result;
}

/**
 * 根据搜索条件和分页查找后台任务列表
 * @param {BackgroundTaskSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: BackgroundTaskSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<BackgroundTaskModel[]> {
  const table = "base_background_task";
  const method = "findAll";
  
  const args = new QueryArgs();
  let sql = `
    select t.*
      ,create_usr_id_lbl.lbl create_usr_id_lbl
      ,update_usr_id_lbl.lbl update_usr_id_lbl
    from
      ${ await getFromQuery() }
  `;
  const whereQuery = await getWhereQuery(args, search, options);
  if (isNotEmpty(whereQuery)) {
    sql += `
    where
      ${ whereQuery }
    `;
  }
  sql += `
    group by t.id
  `;
  
  // 排序
  if (!sort) {
    sort = [
      {
        prop: "begin_time",
        order: SortOrderEnum.Desc,
      },
    ];
  } else if (!Array.isArray(sort)) {
    sort = [ sort ];
  }
  sort = sort.filter((item) => item.prop);
  sort.push({
    prop: "begin_time",
    order: SortOrderEnum.Desc,
  });
  sort.push({
    prop: "create_time",
    order: SortOrderEnum.Desc,
  });
  for (let i = 0; i < sort.length; i++) {
    const item = sort[i];
    if (i === 0) {
      sql += ` order by`;
    } else {
      sql += `,`;
    }
    sql += ` ${ escapeId(item.prop) } ${ escapeDec(item.order) }`;
  }
  
  // 分页
  if (page?.pgSize) {
    sql += ` limit ${ Number(page?.pgOffset) || 0 },${ Number(page.pgSize) }`;
  }
  
  const result = await query<BackgroundTaskModel>(
    sql,
    args,
  );
  
  const [
    stateDict, // 状态
    typeDict, // 类型
  ] = await getDict([
    "background_task_state",
    "background_task_type",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 状态
    let state_lbl = model.state as string;
    if (!isEmpty(model.state)) {
      const dictItem = stateDict.find((dictItem) => dictItem.val === model.state);
      if (dictItem) {
        state_lbl = dictItem.lbl;
      }
    }
    model.state_lbl = state_lbl;
    
    // 类型
    let type_lbl = model.type as string;
    if (!isEmpty(model.type)) {
      const dictItem = typeDict.find((dictItem) => dictItem.val === model.type);
      if (dictItem) {
        type_lbl = dictItem.lbl;
      }
    }
    model.type_lbl = type_lbl;
    
    // 开始时间
    if (model.begin_time) {
      const begin_time = dayjs(model.begin_time);
      if (isNaN(begin_time.toDate().getTime())) {
        model.begin_time_lbl = (model.begin_time || "").toString();
      } else {
        model.begin_time_lbl = begin_time.format("YYYY-MM-DD HH:mm:ss");
      }
    } else {
      model.begin_time_lbl = "";
    }
    
    // 结束时间
    if (model.end_time) {
      const end_time = dayjs(model.end_time);
      if (isNaN(end_time.toDate().getTime())) {
        model.end_time_lbl = (model.end_time || "").toString();
      } else {
        model.end_time_lbl = end_time.format("YYYY-MM-DD HH:mm:ss");
      }
    } else {
      model.end_time_lbl = "";
    }
    
    // 创建时间
    if (model.create_time) {
      const create_time = dayjs(model.create_time);
      if (isNaN(create_time.toDate().getTime())) {
        model.create_time_lbl = (model.create_time || "").toString();
      } else {
        model.create_time_lbl = create_time.format("YYYY-MM-DD HH:mm:ss");
      }
    } else {
      model.create_time_lbl = "";
    }
    
    // 更新时间
    if (model.update_time) {
      const update_time = dayjs(model.update_time);
      if (isNaN(update_time.toDate().getTime())) {
        model.update_time_lbl = (model.update_time || "").toString();
      } else {
        model.update_time_lbl = update_time.format("YYYY-MM-DD HH:mm:ss");
      }
    } else {
      model.update_time_lbl = "";
    }
  }
  
  return result;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: BackgroundTaskInput,
) {
  // 开始时间
  if (!input.begin_time && input.begin_time_lbl) {
    const begin_time_lbl = dayjs(input.begin_time_lbl);
    if (begin_time_lbl.isValid()) {
      input.begin_time = begin_time_lbl.format("YYYY-MM-DD HH:mm:ss");
    } else {
      const fieldComments = await getFieldComments();
      throw `${ fieldComments.begin_time } ${ await ns("日期格式错误") }`;
    }
  }
  if (input.begin_time) {
    const begin_time = dayjs(input.begin_time);
    if (!begin_time.isValid()) {
      const fieldComments = await getFieldComments();
      throw `${ fieldComments.begin_time } ${ await ns("日期格式错误") }`;
    }
    input.begin_time = dayjs(input.begin_time).format("YYYY-MM-DD HH:mm:ss");
  }
  // 结束时间
  if (!input.end_time && input.end_time_lbl) {
    const end_time_lbl = dayjs(input.end_time_lbl);
    if (end_time_lbl.isValid()) {
      input.end_time = end_time_lbl.format("YYYY-MM-DD HH:mm:ss");
    } else {
      const fieldComments = await getFieldComments();
      throw `${ fieldComments.end_time } ${ await ns("日期格式错误") }`;
    }
  }
  if (input.end_time) {
    const end_time = dayjs(input.end_time);
    if (!end_time.isValid()) {
      const fieldComments = await getFieldComments();
      throw `${ fieldComments.end_time } ${ await ns("日期格式错误") }`;
    }
    input.end_time = dayjs(input.end_time).format("YYYY-MM-DD HH:mm:ss");
  }
  
  const [
    stateDict, // 状态
    typeDict, // 类型
  ] = await getDict([
    "background_task_state",
    "background_task_type",
  ]);
  
  // 状态
  if (isNotEmpty(input.state_lbl) && input.state === undefined) {
    const val = stateDict.find((itemTmp) => itemTmp.lbl === input.state_lbl)?.val;
    if (val !== undefined) {
      input.state = val as BackgroundTaskState;
    }
  }
  
  // 类型
  if (isNotEmpty(input.type_lbl) && input.type === undefined) {
    const val = typeDict.find((itemTmp) => itemTmp.lbl === input.type_lbl)?.val;
    if (val !== undefined) {
      input.type = val as BackgroundTaskType;
    }
  }
  
  // 开始时间
  if (isNotEmpty(input.begin_time_lbl) && input.begin_time === undefined) {
    input.begin_time_lbl = String(input.begin_time_lbl).trim();
    input.begin_time = input.begin_time_lbl;
  }
  
  // 结束时间
  if (isNotEmpty(input.end_time_lbl) && input.end_time === undefined) {
    input.end_time_lbl = String(input.end_time_lbl).trim();
    input.end_time = input.end_time_lbl;
  }
}

/**
 * 获取后台任务字段注释
 */
export async function getFieldComments(): Promise<BackgroundTaskFieldComment> {
  const n = initN(route_path);
  const fieldComments: BackgroundTaskFieldComment = {
    id: await n("ID"),
    lbl: await n("名称"),
    state: await n("状态"),
    state_lbl: await n("状态"),
    type: await n("类型"),
    type_lbl: await n("类型"),
    result: await n("执行结果"),
    err_msg: await n("错误信息"),
    begin_time: await n("开始时间"),
    begin_time_lbl: await n("开始时间"),
    end_time: await n("结束时间"),
    end_time_lbl: await n("结束时间"),
    rem: await n("备注"),
    create_usr_id: await n("创建人"),
    create_usr_id_lbl: await n("创建人"),
    create_time: await n("创建时间"),
    create_time_lbl: await n("创建时间"),
    update_usr_id: await n("更新人"),
    update_usr_id_lbl: await n("更新人"),
    update_time: await n("更新时间"),
    update_time_lbl: await n("更新时间"),
  };
  return fieldComments;
}

/**
 * 通过唯一约束获得后台任务列表
 * @param {BackgroundTaskInput} search0
 */
export async function findByUnique(
  search0: BackgroundTaskInput,
  options?: {
  },
): Promise<BackgroundTaskModel[]> {
  if (search0.id) {
    const model = await findOne({
      id: search0.id,
    });
    if (!model) {
      return [ ];
    }
    return [ model ];
  }
  const models: BackgroundTaskModel[] = [ ];
  return models;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {BackgroundTaskModel} oldModel
 * @param {BackgroundTaskInput} input
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: BackgroundTaskModel,
  input: BackgroundTaskInput,
): boolean {
  if (!oldModel || !input) {
    return false;
  }
  return false;
}

/**
 * 通过唯一约束检查后台任务是否已经存在
 * @param {BackgroundTaskInput} input
 * @param {BackgroundTaskModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<BackgroundTaskId | undefined>}
 */
export async function checkByUnique(
  input: BackgroundTaskInput,
  oldModel: BackgroundTaskModel,
  uniqueType: UniqueType = UniqueType.Throw,
  options?: {
  },
): Promise<BackgroundTaskId | undefined> {
  const isEquals = equalsByUnique(oldModel, input);
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("此 {0} 已经存在", await ns("后台任务")));
    }
    if (uniqueType === UniqueType.Update) {
      const id: BackgroundTaskId = await updateById(
        oldModel.id,
        {
          ...input,
          id: undefined,
        },
        {
          ...options,
        },
      );
      return id;
    }
    if (uniqueType === UniqueType.Ignore) {
      return;
    }
  }
  return;
}

/**
 * 根据条件查找第一个后台任务
 * @param {BackgroundTaskSearch} search?
 */
export async function findOne(
  search?: BackgroundTaskSearch,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<BackgroundTaskModel | undefined> {
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  const models = await findAll(search, page, sort);
  const model = models[0];
  return model;
}

/**
 * 根据 id 查找后台任务
 * @param {BackgroundTaskId} id
 */
export async function findById(
  id?: BackgroundTaskId | null,
  options?: {
  },
): Promise<BackgroundTaskModel | undefined> {
  if (isEmpty(id as unknown as string)) {
    return;
  }
  const model = await findOne({ id });
  return model;
}

/**
 * 根据搜索条件判断后台任务是否存在
 * @param {BackgroundTaskSearch} search?
 */
export async function exist(
  search?: BackgroundTaskSearch,
  options?: {
  },
): Promise<boolean> {
  const model = await findOne(search);
  const exist = !!model;
  return exist;
}

/**
 * 根据id判断后台任务是否存在
 * @param {BackgroundTaskId} id
 */
export async function existById(
  id?: BackgroundTaskId | null,
) {
  const table = "base_background_task";
  const method = "existById";
  
  if (isEmpty(id as unknown as string)) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = `
    select
      1 e
    from
      base_background_task t
    where
      t.id = ${ args.push(id) }
      and t.is_deleted = 0
    limit 1
  `;
  
  interface Result {
    e: number,
  }
  let model = await queryOne<Result>(
    sql,
    args,
  );
  let result = !!model?.e;
  
  return result;
}

/** 校验后台任务是否存在 */
export async function validateOption(
  model?: BackgroundTaskModel,
) {
  if (!model) {
    throw `${ await ns("后台任务") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 后台任务增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: BackgroundTaskInput,
) {
  const fieldComments = await getFieldComments();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 名称
  await validators.chars_max_length(
    input.lbl,
    45,
    fieldComments.lbl,
  );
  
  // 状态
  await validators.chars_max_length(
    input.state,
    10,
    fieldComments.state,
  );
  
  // 类型
  await validators.chars_max_length(
    input.type,
    10,
    fieldComments.type,
  );
  
  // 执行结果
  await validators.chars_max_length(
    input.result,
    500,
    fieldComments.result,
  );
  
  // 错误信息
  await validators.chars_max_length(
    input.err_msg,
    100,
    fieldComments.err_msg,
  );
  
  // 备注
  await validators.chars_max_length(
    input.rem,
    100,
    fieldComments.rem,
  );
  
  // 创建人
  await validators.chars_max_length(
    input.create_usr_id,
    22,
    fieldComments.create_usr_id,
  );
  
  // 更新人
  await validators.chars_max_length(
    input.update_usr_id,
    22,
    fieldComments.update_usr_id,
  );
  
}

/**
 * 创建后台任务
 * @param {BackgroundTaskInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<BackgroundTaskId>} 
 */
export async function create(
  input: BackgroundTaskInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<BackgroundTaskId> {
  const table = "base_background_task";
  const method = "create";
  
  if (input.id) {
    throw new Error(`Can not set id when create in dao: ${ table }`);
  }
  
  await setIdByLbl(input);
  
  const oldModels = await findByUnique(input, options);
  if (oldModels.length > 0) {
    let id: BackgroundTaskId | undefined = undefined;
    for (const oldModel of oldModels) {
      id = await checkByUnique(
        input,
        oldModel,
        options?.uniqueType,
        options,
      );
      if (id) {
        break;
      }
    }
    if (id) {
      return id;
    }
  }
  
  while (true) {
    input.id = shortUuidV4<BackgroundTaskId>();
    const isExist = await existById(input.id);
    if (!isExist) {
      break;
    }
    error(`ID_COLLIDE: ${ table } ${ input.id as unknown as string }`);
  }
  
  const args = new QueryArgs();
  let sql = `
    insert into base_background_task(
      id
      ,create_time
      ,update_time
  `;
  if (input.tenant_id != null) {
    sql += `,tenant_id`;
  } else {
    const authModel = await getAuthModel();
    const tenant_id = await getTenant_id(authModel?.id);
    if (tenant_id) {
      sql += `,tenant_id`;
    }
  }
  if (input.create_usr_id != null) {
    sql += `,create_usr_id`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,create_usr_id`;
    }
  }
  if (input.update_usr_id != null) {
    sql += `,update_usr_id`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,update_usr_id`;
    }
  }
  if (input.lbl !== undefined) {
    sql += `,lbl`;
  }
  if (input.state !== undefined) {
    sql += `,state`;
  }
  if (input.type !== undefined) {
    sql += `,type`;
  }
  if (input.result !== undefined) {
    sql += `,result`;
  }
  if (input.err_msg !== undefined) {
    sql += `,err_msg`;
  }
  if (input.begin_time !== undefined) {
    sql += `,begin_time`;
  }
  if (input.end_time !== undefined) {
    sql += `,end_time`;
  }
  if (input.rem !== undefined) {
    sql += `,rem`;
  }
  sql += `) values(${ args.push(input.id) },${ args.push(reqDate()) },${ args.push(reqDate()) }`;
  if (input.tenant_id != null) {
    sql += `,${ args.push(input.tenant_id) }`;
  } else {
    const authModel = await getAuthModel();
    const tenant_id = await getTenant_id(authModel?.id);
    if (tenant_id) {
      sql += `,${ args.push(tenant_id) }`;
    }
  }
  if (input.create_usr_id != null && input.create_usr_id as unknown as string !== "-") {
    sql += `,${ args.push(input.create_usr_id) }`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,${ args.push(authModel.id) }`;
    }
  }
  if (input.update_usr_id != null && input.update_usr_id as unknown as string !== "-") {
    sql += `,${ args.push(input.update_usr_id) }`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,${ args.push(authModel.id) }`;
    }
  }
  if (input.lbl !== undefined) {
    sql += `,${ args.push(input.lbl) }`;
  }
  if (input.state !== undefined) {
    sql += `,${ args.push(input.state) }`;
  }
  if (input.type !== undefined) {
    sql += `,${ args.push(input.type) }`;
  }
  if (input.result !== undefined) {
    sql += `,${ args.push(input.result) }`;
  }
  if (input.err_msg !== undefined) {
    sql += `,${ args.push(input.err_msg) }`;
  }
  if (input.begin_time !== undefined) {
    sql += `,${ args.push(input.begin_time) }`;
  }
  if (input.end_time !== undefined) {
    sql += `,${ args.push(input.end_time) }`;
  }
  if (input.rem !== undefined) {
    sql += `,${ args.push(input.rem) }`;
  }
  sql += `)`;
  const res = await execute(sql, args);
  log(JSON.stringify(res));
  
  return input.id;
}

/**
 * 后台任务根据id修改租户id
 * @param {BackgroundTaskId} id
 * @param {TenantId} tenant_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateTenantById(
  id: BackgroundTaskId,
  tenant_id: TenantId,
  options?: {
  },
): Promise<number> {
  const table = "base_background_task";
  const method = "updateTenantById";
  
  const tenantExist = await existByIdTenant(tenant_id);
  if (!tenantExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `
    update
      base_background_task
    set
      update_time = ${ args.push(reqDate()) },
      tenant_id = ${ args.push(tenant_id) }
    where
      id = ${ args.push(id) }
  `;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  return num;
}

/**
 * 根据 id 修改后台任务
 * @param {BackgroundTaskId} id
 * @param {BackgroundTaskInput} input
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<BackgroundTaskId>}
 */
export async function updateById(
  id: BackgroundTaskId,
  input: BackgroundTaskInput,
  options?: {
    uniqueType?: "ignore" | "throw";
  },
): Promise<BackgroundTaskId> {
  const table = "base_background_task";
  const method = "updateById";
  
  if (!id) {
    throw new Error("updateById: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateById: input cannot be null");
  }
  
  // 修改租户id
  if (isNotEmpty(input.tenant_id)) {
    await updateTenantById(id, input.tenant_id as unknown as TenantId);
  }
  
  await setIdByLbl(input);
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUnique(input2);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || options.uniqueType === UniqueType.Throw) {
        throw await ns("此 {0} 已经存在", await ns("后台任务"));
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id);
  
  if (!oldModel) {
    throw await ns("编辑失败, 此 {0} 已被删除", await ns("后台任务"));
  }
  
  const args = new QueryArgs();
  let sql = `
    update base_background_task set
  `;
  let updateFldNum = 0;
  if (input.lbl !== undefined) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl = ${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  if (input.state !== undefined) {
    if (input.state != oldModel.state) {
      sql += `state = ${ args.push(input.state) },`;
      updateFldNum++;
    }
  }
  if (input.type !== undefined) {
    if (input.type != oldModel.type) {
      sql += `type = ${ args.push(input.type) },`;
      updateFldNum++;
    }
  }
  if (input.result !== undefined) {
    if (input.result != oldModel.result) {
      sql += `result = ${ args.push(input.result) },`;
      updateFldNum++;
    }
  }
  if (input.err_msg !== undefined) {
    if (input.err_msg != oldModel.err_msg) {
      sql += `err_msg = ${ args.push(input.err_msg) },`;
      updateFldNum++;
    }
  }
  if (input.begin_time !== undefined) {
    if (input.begin_time != oldModel.begin_time) {
      sql += `begin_time = ${ args.push(input.begin_time) },`;
      updateFldNum++;
    }
  }
  if (input.end_time !== undefined) {
    if (input.end_time != oldModel.end_time) {
      sql += `end_time = ${ args.push(input.end_time) },`;
      updateFldNum++;
    }
  }
  if (input.rem !== undefined) {
    if (input.rem != oldModel.rem) {
      sql += `rem = ${ args.push(input.rem) },`;
      updateFldNum++;
    }
  }
  if (updateFldNum > 0) {
    if (input.update_usr_id && input.update_usr_id as unknown as string !== "-") {
      sql += `update_usr_id = ${ args.push(input.update_usr_id) },`;
    } else {
      const authModel = await getAuthModel();
      if (authModel?.id !== undefined) {
        sql += `update_usr_id = ${ args.push(authModel.id) },`;
      }
    }
    sql += `update_time = ${ args.push(new Date()) }`;
    sql += ` where id = ${ args.push(id) } limit 1`;
    
    const res = await execute(sql, args);
    log(JSON.stringify(res));
  }
  
  const newModel = await findById(id);
  
  if (!deepCompare(oldModel, newModel)) {
    console.log(JSON.stringify(oldModel));
  }
  
  return id;
}

/**
 * 根据 ids 删除后台任务
 * @param {BackgroundTaskId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: BackgroundTaskId[],
  options?: {
  },
): Promise<number> {
  const table = "base_background_task";
  const method = "deleteByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: BackgroundTaskId = ids[i];
    const isExist = await existById(id);
    if (!isExist) {
      continue;
    }
    const args = new QueryArgs();
    const sql = `
      update
        base_background_task
      set
        is_deleted = 1,
        delete_time = ${ args.push(reqDate()) }
      where
        id = ${ args.push(id) }
      limit 1
    `;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}

/**
 * 根据 ids 还原后台任务
 * @param {BackgroundTaskId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: BackgroundTaskId[],
  options?: {
  },
): Promise<number> {
  const table = "base_background_task";
  const method = "revertByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: BackgroundTaskId = ids[i];
    const args = new QueryArgs();
    const sql = `
      update
        base_background_task
      set
        is_deleted = 0
      where
        id = ${ args.push(id) }
      limit 1
    `;
    const result = await execute(sql, args);
    num += result.affectedRows;
    // 检查数据的唯一索引
    {
      const old_model = await findById(id);
      if (!old_model) {
        continue;
      }
      const input = {
        ...old_model,
        id: undefined,
      };
      let models = await findByUnique(input);
      models = models.filter((item) => item.id !== id);
      if (models.length > 0) {
        throw await ns("此 {0} 已经存在", await ns("后台任务"));
      }
    }
  }
  
  return num;
}

/**
 * 根据 ids 彻底删除后台任务
 * @param {BackgroundTaskId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: BackgroundTaskId[],
  options?: {
  },
): Promise<number> {
  const table = "base_background_task";
  const method = "forceDeleteByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    {
      const args = new QueryArgs();
      const sql = `
        select
          *
        from
          base_background_task
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `
      delete from
        base_background_task
      where
        id = ${ args.push(id) }
        and is_deleted = 1
      limit 1
    `;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  return num;
}
