// deno-lint-ignore-file prefer-const no-unused-vars ban-types require-await
import {
  escapeId,
  escape,
} from "sqlstring";

import dayjs from "dayjs";

import {
  log,
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

import type {
  PartialNull,
} from "/typings/types.ts";

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

import * as dictSrcDao from "/src/base/dict_detail/dict_detail.dao.ts";

import { UniqueException } from "/lib/exceptions/unique.execption.ts";

import * as authDao from "/lib/auth/auth.dao.ts";

import * as usrDaoSrc from "/src/base/usr/usr.dao.ts";

import * as tenantDao from "/gen/base/tenant/tenant.dao.ts";

import * as orgDao from "/gen/base/org/org.dao.ts";

import {
  many2manyUpdate,
} from "/lib/util/dao_util.ts";

import {
  UniqueType,
  SortOrderEnum,
} from "/gen/types.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  DeptInput,
  DeptModel,
  DeptSearch,
  DeptFieldComment,
} from "./dept.model.ts";

const route_path = "/base/dept";

async function getWhereQuery(
  args: QueryArgs,
  search?: DeptSearch,
  options?: {
  },
): Promise<string> {
  let whereQuery = "";
  whereQuery += ` t.is_deleted = ${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;
  if (search?.tenant_id == null) {
    const authModel = await authDao.getAuthModel();
    const tenant_id = await usrDaoSrc.getTenant_id(authModel?.id);
    if (tenant_id) {
      whereQuery += ` and t.tenant_id = ${ args.push(tenant_id) }`;
    }
  } else if (isNotEmpty(search?.tenant_id) && search?.tenant_id !== "-") {
    whereQuery += ` and t.tenant_id = ${ args.push(search.tenant_id) }`;
  }
  if (search?.org_id == null) {
    const authModel = await authDao.getAuthModel();
    const org_id = authModel?.org_id;
    if (org_id) {
      whereQuery += ` and t.org_id = ${ args.push(org_id) }`;
    }
  } else if (isNotEmpty(search?.org_id) && search?.org_id !== "-") {
    whereQuery += ` and t.org_id = ${ args.push(search.org_id) }`;
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
  if (search?.parent_id && !Array.isArray(search?.parent_id)) {
    search.parent_id = [ search.parent_id ];
  }
  if (search?.parent_id && search?.parent_id.length > 0) {
    whereQuery += ` and parent_id_lbl.id in ${ args.push(search.parent_id) }`;
  }
  if (search?.parent_id === null) {
    whereQuery += ` and parent_id_lbl.id is null`;
  }
  if (search?.parent_id_is_null) {
    whereQuery += ` and parent_id_lbl.id is null`;
  }
  if (search?.lbl !== undefined) {
    whereQuery += ` and t.lbl = ${ args.push(search.lbl) }`;
  }
  if (search?.lbl === null) {
    whereQuery += ` and t.lbl is null`;
  }
  if (isNotEmpty(search?.lbl_like)) {
    whereQuery += ` and t.lbl like ${ args.push(sqlLike(search?.lbl_like) + "%") }`;
  }
  if (search?.usr_ids && !Array.isArray(search?.usr_ids)) {
    search.usr_ids = [ search.usr_ids ];
  }
  if (search?.usr_ids && search?.usr_ids.length > 0) {
    whereQuery += ` and base_usr.id in ${ args.push(search.usr_ids) }`;
  }
  if (search?.usr_ids === null) {
    whereQuery += ` and base_usr.id is null`;
  }
  if (search?.usr_ids_is_null) {
    whereQuery += ` and base_usr.id is null`;
  }
  if (search?.is_locked && !Array.isArray(search?.is_locked)) {
    search.is_locked = [ search.is_locked ];
  }
  if (search?.is_locked && search?.is_locked?.length > 0) {
    whereQuery += ` and t.is_locked in ${ args.push(search.is_locked) }`;
  }
  if (search?.is_enabled && !Array.isArray(search?.is_enabled)) {
    search.is_enabled = [ search.is_enabled ];
  }
  if (search?.is_enabled && search?.is_enabled?.length > 0) {
    whereQuery += ` and t.is_enabled in ${ args.push(search.is_enabled) }`;
  }
  if (search?.order_by && search?.order_by?.length > 0) {
    if (search.order_by[0] != null) {
      whereQuery += ` and t.order_by >= ${ args.push(search.order_by[0]) }`;
    }
    if (search.order_by[1] != null) {
      whereQuery += ` and t.order_by <= ${ args.push(search.order_by[1]) }`;
    }
  }
  if (search?.rem !== undefined) {
    whereQuery += ` and t.rem = ${ args.push(search.rem) }`;
  }
  if (search?.rem === null) {
    whereQuery += ` and t.rem is null`;
  }
  if (isNotEmpty(search?.rem_like)) {
    whereQuery += ` and t.rem like ${ args.push(sqlLike(search?.rem_like) + "%") }`;
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
    base_dept t
    left join base_dept parent_id_lbl
      on parent_id_lbl.id = t.parent_id
    left join base_dept_usr
      on base_dept_usr.dept_id = t.id
      and base_dept_usr.is_deleted = 0
    left join base_usr
      on base_dept_usr.usr_id = base_usr.id
      and base_usr.is_deleted = 0
    left join (
      select
        json_objectagg(base_dept_usr.order_by, base_usr.id) usr_ids,
        json_objectagg(base_dept_usr.order_by, base_usr.lbl) usr_ids_lbl,
        base_dept.id dept_id
      from base_dept_usr
      inner join base_usr
        on base_usr.id = base_dept_usr.usr_id
        and base_usr.is_deleted = 0
      inner join base_dept
        on base_dept.id = base_dept_usr.dept_id
      where
        base_dept_usr.is_deleted = 0
      group by dept_id
    ) _usr
      on _usr.dept_id = t.id
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id
  `;
  return fromQuery;
}

/**
 * 根据条件查找总数据数
 * @param { DeptSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: DeptSearch,
  options?: {
  },
): Promise<number> {
  const table = "base_dept";
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
        where
          ${ await getWhereQuery(args, search, options) }
        group by t.id
      ) t
  `;
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = JSON.stringify({ sql, args });
  
  interface Result {
    total: number,
  }
  const model = await queryOne<Result>(sql, args, { cacheKey1, cacheKey2 });
  let result = model?.total || 0;
  
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 * @param {DeptSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: DeptSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<DeptModel[]> {
  const table = "base_dept";
  const method = "findAll";
  
  const args = new QueryArgs();
  let sql = `
    select t.*
      ,parent_id_lbl.lbl parent_id_lbl
      ,max(usr_ids) usr_ids
      ,max(usr_ids_lbl) usr_ids_lbl
      ,create_usr_id_lbl.lbl create_usr_id_lbl
      ,update_usr_id_lbl.lbl update_usr_id_lbl
    from
      ${ await getFromQuery() }
    where
      ${ await getWhereQuery(args, search, options) }
    group by t.id
  `;
  
  // 排序
  if (!sort) {
    sort = [
      {
        prop: "order_by",
        order: SortOrderEnum.Asc,
      },
    ];
  } else if (!Array.isArray(sort)) {
    sort = [ sort ];
  }
  sort = sort.filter((item) => item.prop);
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
  
  // 缓存
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = JSON.stringify({ sql, args });
  
  const result = await query<DeptModel>(
    sql,
    args,
    {
      cacheKey1,
      cacheKey2,
    },
  );
  for (const item of result) {
    
    // 部门负责人
    if (item.usr_ids) {
      const obj = item.usr_ids as unknown as {[key: string]: string};
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.usr_ids = keys.map((key) => obj[key]);
    }
    if (item.usr_ids_lbl) {
      const obj = item.usr_ids_lbl as unknown as {[key: string]: string};
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.usr_ids_lbl = keys.map((key) => obj[key]);
    }
  }
  
  const [
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await dictSrcDao.getDict([
    "is_locked",
    "is_enabled",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 锁定
    let is_locked_lbl = model.is_locked.toString();
    if (model.is_locked !== undefined && model.is_locked !== null) {
      const dictItem = is_lockedDict.find((dictItem) => dictItem.val === model.is_locked.toString());
      if (dictItem) {
        is_locked_lbl = dictItem.lbl;
      }
    }
    model.is_locked_lbl = is_locked_lbl;
    
    // 启用
    let is_enabled_lbl = model.is_enabled.toString();
    if (model.is_enabled !== undefined && model.is_enabled !== null) {
      const dictItem = is_enabledDict.find((dictItem) => dictItem.val === model.is_enabled.toString());
      if (dictItem) {
        is_enabled_lbl = dictItem.lbl;
      }
    }
    model.is_enabled_lbl = is_enabled_lbl;
    
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

/**
 * 获取字段对应的名称
 */
export async function getFieldComments(): Promise<DeptFieldComment> {
  const n = initN(route_path);
  const fieldComments: DeptFieldComment = {
    id: await n("ID"),
    parent_id: await n("父部门"),
    parent_id_lbl: await n("父部门"),
    lbl: await n("名称"),
    usr_ids: await n("部门负责人"),
    usr_ids_lbl: await n("部门负责人"),
    is_locked: await n("锁定"),
    is_locked_lbl: await n("锁定"),
    is_enabled: await n("启用"),
    is_enabled_lbl: await n("启用"),
    order_by: await n("排序"),
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
 * 通过唯一约束获得数据列表
 * @param {DeptSearch | PartialNull<DeptModel>} search0
 */
export async function findByUnique(
  search0: DeptSearch | PartialNull<DeptModel>,
  options?: {
  },
): Promise<DeptModel[]> {
  if (search0.id) {
    const model = await findOne({
      id: search0.id,
    });
    if (!model) {
      return [ ];
    }
    return [ model ];
  }
  const models: DeptModel[] = [ ];
  {
    if (search0.parent_id == null) {
      return [ ];
    }
    let parent_id: string[] = [ ];
    if (!Array.isArray(search0.parent_id)) {
      parent_id.push(search0.parent_id);
    } else {
      parent_id = search0.parent_id;
    }
    if (search0.lbl == null) {
      return [ ];
    }
    const lbl = search0.lbl;
    const modelTmps = await findAll({
      parent_id,
      lbl,
    });
    models.push(...modelTmps);
  }
  return models;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {DeptModel} oldModel
 * @param {PartialNull<DeptModel>} model
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: DeptModel,
  model: PartialNull<DeptModel>,
): boolean {
  if (!oldModel || !model) {
    return false;
  }
  if (
    oldModel.parent_id === model.parent_id &&
    oldModel.lbl === model.lbl
  ) {
    return true;
  }
  return false;
}

/**
 * 通过唯一约束检查数据是否已经存在
 * @param {DeptInput} model
 * @param {DeptModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<string>}
 */
export async function checkByUnique(
  model: DeptInput,
  oldModel: DeptModel,
  uniqueType: UniqueType = UniqueType.Throw,
  options?: {
  },
): Promise<string | undefined> {
  const isEquals = equalsByUnique(oldModel, model);
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("数据已经存在"));
    }
    if (uniqueType === UniqueType.Update) {
      const result = await updateById(
        oldModel.id,
        {
          ...model,
          id: undefined,
        },
        options
      );
      return result;
    }
    if (uniqueType === UniqueType.Ignore) {
      return;
    }
  }
  return;
}

/**
 * 根据条件查找第一条数据
 * @param {DeptSearch} search?
 */
export async function findOne(
  search?: DeptSearch,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<DeptModel | undefined> {
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  const result = await findAll(search, page, sort);
  if (result && result.length > 0) {
    return result[0];
  }
  return;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
  options?: {
  },
): Promise<DeptModel | undefined> {
  if (isEmpty(id)) {
    return;
  }
  const model = await findOne({ id });
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {DeptSearch} search?
 */
export async function exist(
  search?: DeptSearch,
  options?: {
  },
): Promise<boolean> {
  const model = await findOne(search);
  const exist = !!model;
  return exist;
}

/**
 * 根据id判断数据是否存在
 * @param {string} id
 */
export async function existById(
  id?: string | null,
) {
  const table = "base_dept";
  const method = "existById";
  
  if (isEmpty(id)) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = `
    select
      1 e
    from
      base_dept t
    where
      t.id = ${ args.push(id) }
      and t.is_deleted = 0
    limit 1
  `;
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = JSON.stringify({ sql, args });
  
  interface Result {
    e: number,
  }
  let model = await queryOne<Result>(
    sql,
    args,{ cacheKey1, cacheKey2 },
  );
  let result = !!model?.e;
  
  return result;
}

/**
 * 增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: DeptInput,
) {
  const fieldComments = await getFieldComments();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 父部门
  await validators.chars_max_length(
    input.parent_id,
    22,
    fieldComments.parent_id,
  );
  
  // 名称
  await validators.chars_max_length(
    input.lbl,
    22,
    fieldComments.lbl,
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
 * 创建数据
 * @param {DeptInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<string>} 
 */
export async function create(
  input: DeptInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<string> {
  const table = "base_dept";
  const method = "create";
  
  const [
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await dictSrcDao.getDict([
    "is_locked",
    "is_enabled",
  ]);
  
  // 父部门
  if (isNotEmpty(input.parent_id_lbl) && input.parent_id === undefined) {
    input.parent_id_lbl = String(input.parent_id_lbl).trim();
    const deptModel = await findOne({ lbl: input.parent_id_lbl });
    if (deptModel) {
      input.parent_id = deptModel.id;
    }
  }
  
  // 部门负责人
  if (!input.usr_ids && input.usr_ids_lbl) {
    if (typeof input.usr_ids_lbl === "string" || input.usr_ids_lbl instanceof String) {
      input.usr_ids_lbl = input.usr_ids_lbl.split(",");
    }
    input.usr_ids_lbl = input.usr_ids_lbl.map((item: string) => item.trim());
    const args = new QueryArgs();
    const sql = `
      select
        t.id
      from
        base_usr t
      where
        t.lbl in ${ args.push(input.usr_ids_lbl) }
    `;
    interface Result {
      id: string;
    }
    const models = await query<Result>(sql, args);
    input.usr_ids = models.map((item: { id: string }) => item.id);
  }
  
  // 锁定
  if (isNotEmpty(input.is_locked_lbl) && input.is_locked === undefined) {
    const val = is_lockedDict.find((itemTmp) => itemTmp.lbl === input.is_locked_lbl)?.val;
    if (val !== undefined) {
      input.is_locked = Number(val);
    }
  }
  
  // 启用
  if (isNotEmpty(input.is_enabled_lbl) && input.is_enabled === undefined) {
    const val = is_enabledDict.find((itemTmp) => itemTmp.lbl === input.is_enabled_lbl)?.val;
    if (val !== undefined) {
      input.is_enabled = Number(val);
    }
  }
  
  const oldModels = await findByUnique(input, options);
  if (oldModels.length > 0) {
    let id: string | undefined = undefined;
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
  
  if (!input.id) {
    input.id = shortUuidV4();
  }
  
  const args = new QueryArgs();
  let sql = `
    insert into base_dept(
      id
      ,create_time
      ,update_time
  `;
  if (input.tenant_id != null) {
    sql += `,tenant_id`;
  } else {
    const authModel = await authDao.getAuthModel();
    const tenant_id = await usrDaoSrc.getTenant_id(authModel?.id);
    if (tenant_id) {
      sql += `,tenant_id`;
    }
  }
  if (input.org_id != null) {
    sql += `,org_id`;
  } else {
    const authModel = await authDao.getAuthModel();
    if (authModel?.org_id) {
      sql += `,org_id`;
    }
  }
  if (input.create_usr_id != null) {
    sql += `,create_usr_id`;
  } else {
    const authModel = await authDao.getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,create_usr_id`;
    }
  }
  if (input.update_usr_id != null) {
    sql += `,update_usr_id`;
  } else {
    const authModel = await authDao.getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,update_usr_id`;
    }
  }
  if (input.parent_id !== undefined) {
    sql += `,parent_id`;
  }
  if (input.lbl !== undefined) {
    sql += `,lbl`;
  }
  if (input.is_locked !== undefined) {
    sql += `,is_locked`;
  }
  if (input.is_enabled !== undefined) {
    sql += `,is_enabled`;
  }
  if (input.order_by !== undefined) {
    sql += `,order_by`;
  }
  if (input.rem !== undefined) {
    sql += `,rem`;
  }
  sql += `) values(${ args.push(input.id) },${ args.push(reqDate()) },${ args.push(reqDate()) }`;
  if (input.tenant_id != null) {
    sql += `,${ args.push(input.tenant_id) }`;
  } else {
    const authModel = await authDao.getAuthModel();
    const tenant_id = await usrDaoSrc.getTenant_id(authModel?.id);
    if (tenant_id) {
      sql += `,${ args.push(tenant_id) }`;
    }
  }
  if (input.org_id != null) {
    sql += `,${ args.push(input.org_id) }`;
  } else {
    const authModel = await authDao.getAuthModel();
    if (authModel?.org_id) {
      sql += `,${ args.push(authModel?.org_id) }`;
    }
  }
  if (input.create_usr_id != null && input.create_usr_id !== "-") {
    sql += `,${ args.push(input.create_usr_id) }`;
  } else {
    const authModel = await authDao.getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,${ args.push(authModel.id) }`;
    }
  }
  if (input.update_usr_id != null && input.update_usr_id !== "-") {
    sql += `,${ args.push(input.update_usr_id) }`;
  } else {
    const authModel = await authDao.getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,${ args.push(authModel.id) }`;
    }
  }
  if (input.parent_id !== undefined) {
    sql += `,${ args.push(input.parent_id) }`;
  }
  if (input.lbl !== undefined) {
    sql += `,${ args.push(input.lbl) }`;
  }
  if (input.is_locked !== undefined) {
    sql += `,${ args.push(input.is_locked) }`;
  }
  if (input.is_enabled !== undefined) {
    sql += `,${ args.push(input.is_enabled) }`;
  }
  if (input.order_by !== undefined) {
    sql += `,${ args.push(input.order_by) }`;
  }
  if (input.rem !== undefined) {
    sql += `,${ args.push(input.rem) }`;
  }
  sql += `)`;
  
  const result = await execute(sql, args);
  
  // 部门负责人
  await many2manyUpdate(
    input,
    "usr_ids",
    {
      mod: "base",
      table: "dept_usr",
      column1: "dept_id",
      column2: "usr_id",
    },
  );
  
  await delCache();
  
  return input.id;
}

/**
 * 删除缓存
 */
export async function delCache() {
  const table = "base_dept";
  const method = "delCache";
  
  await delCacheCtx(`dao.sql.${ table }`);
  const foreignTables: string[] = [
    "base_dept",
    "base_dept_usr",
    "base_usr",
  ];
  for (let k = 0; k < foreignTables.length; k++) {
    const foreignTable = foreignTables[k];
    if (foreignTable === table) continue;
    await delCacheCtx(`dao.sql.${ foreignTable }`);
  }
}

/**
 * 根据id修改租户id
 * @param {string} id
 * @param {string} tenant_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateTenantById(
  id: string,
  tenant_id: string,
  options?: {
  },
): Promise<number> {
  const table = "base_dept";
  const method = "updateTenantById";
  
  const tenantExist = await tenantDao.existById(tenant_id);
  if (!tenantExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `
    update
      base_dept
    set
      update_time = ${ args.push(reqDate()) },
      tenant_id = ${ args.push(tenant_id) }
    where
      id = ${ args.push(id) }
  `;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCache();
  return num;
}

/**
 * 根据id修改部门id
 * @export
 * @param {string} id
 * @param {string} org_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateOrgById(
  id: string,
  org_id: string,
  options?: {
  },
): Promise<number> {
  const table = "base_dept";
  const method = "updateOrgById";
  
  const orgExist = await orgDao.existById(org_id);
  if (!orgExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `
    update
      base_dept
    set
      update_time = ${ args.push(reqDate()) },
      org_id = ${ args.push(org_id) }
    where
      id = ${ args.push(id) }
  `;
  
  await delCache();
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCache();
  return num;
}

/**
 * 根据id修改一行数据
 * @param {string} id
 * @param {DeptInput} input
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<string>}
 */
export async function updateById(
  id: string,
  input: DeptInput,
  options?: {
    uniqueType?: "ignore" | "throw" | "create";
  },
): Promise<string> {
  const table = "base_dept";
  const method = "updateById";
  
  if (!id) {
    throw new Error("updateById: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateById: input cannot be null");
  }
  
  const [
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await dictSrcDao.getDict([
    "is_locked",
    "is_enabled",
  ]);
  
  // 修改租户id
  if (isNotEmpty(input.tenant_id)) {
    await updateTenantById(id, input.tenant_id);
  }
  
  // 修改部门id
  if (isNotEmpty(input.org_id)) {
    await updateOrgById(id, input.org_id);
  }
  
  // 父部门
  if (isNotEmpty(input.parent_id_lbl) && input.parent_id === undefined) {
    input.parent_id_lbl = String(input.parent_id_lbl).trim();
    const deptModel = await findOne({ lbl: input.parent_id_lbl });
    if (deptModel) {
      input.parent_id = deptModel.id;
    }
  }

  // 部门负责人
  if (!input.usr_ids && input.usr_ids_lbl) {
    if (typeof input.usr_ids_lbl === "string" || input.usr_ids_lbl instanceof String) {
      input.usr_ids_lbl = input.usr_ids_lbl.split(",");
    }
    input.usr_ids_lbl = input.usr_ids_lbl.map((item: string) => item.trim());
    const args = new QueryArgs();
    const sql = `
      select
        t.id
      from
        base_usr t
      where
        t.lbl in ${ args.push(input.usr_ids_lbl) }
    `;
    interface Result {
      id: string;
    }
    const models = await query<Result>(sql, args);
    input.usr_ids = models.map((item: { id: string }) => item.id);
  }
  
  // 锁定
  if (isNotEmpty(input.is_locked_lbl) && input.is_locked === undefined) {
    const val = is_lockedDict.find((itemTmp) => itemTmp.lbl === input.is_locked_lbl)?.val;
    if (val !== undefined) {
      input.is_locked = Number(val);
    }
  }
  
  // 启用
  if (isNotEmpty(input.is_enabled_lbl) && input.is_enabled === undefined) {
    const val = is_enabledDict.find((itemTmp) => itemTmp.lbl === input.is_enabled_lbl)?.val;
    if (val !== undefined) {
      input.is_enabled = Number(val);
    }
  }
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUnique(input2);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      throw await ns("数据已经存在");
    }
  }
  
  const oldModel = await findById(id);
  
  if (!oldModel) {
    throw await ns("修改失败, 数据已被删除");
  }
  
  const args = new QueryArgs();
  let sql = `
    update base_dept set
  `;
  let updateFldNum = 0;
  if (input.parent_id !== undefined) {
    if (input.parent_id != oldModel.parent_id) {
      sql += `parent_id = ${ args.push(input.parent_id) },`;
      updateFldNum++;
    }
  }
  if (input.lbl !== undefined) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl = ${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  if (input.is_locked !== undefined) {
    if (input.is_locked != oldModel.is_locked) {
      sql += `is_locked = ${ args.push(input.is_locked) },`;
      updateFldNum++;
    }
  }
  if (input.is_enabled !== undefined) {
    if (input.is_enabled != oldModel.is_enabled) {
      sql += `is_enabled = ${ args.push(input.is_enabled) },`;
      updateFldNum++;
    }
  }
  if (input.order_by !== undefined) {
    if (input.order_by != oldModel.order_by) {
      sql += `order_by = ${ args.push(input.order_by) },`;
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
    if (input.update_usr_id && input.update_usr_id !== "-") {
      sql += `update_usr_id = ${ args.push(input.update_usr_id) },`;
    } else {
      const authModel = await authDao.getAuthModel();
      if (authModel?.id !== undefined) {
        sql += `update_usr_id = ${ args.push(authModel.id) },`;
      }
    }
    sql += `update_time = ${ args.push(new Date()) }`;
    sql += ` where id = ${ args.push(id) } limit 1`;
    
    await delCache();
    
    const result = await execute(sql, args);
  }
  
  updateFldNum++;
  
  // 部门负责人
  await many2manyUpdate(
    {
      ...input,
      id,
    },
    "usr_ids",
    {
      mod: "base",
      table: "dept_usr",
      column1: "dept_id",
      column2: "usr_id",
    },
  );
  
  if (updateFldNum > 0) {
    await delCache();
  }
  
  const newModel = await findById(id);
  
  if (!deepCompare(oldModel, newModel)) {
    console.log(JSON.stringify(oldModel));
  }
  
  return id;
}

/**
 * 根据 ids 删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: string[],
  options?: {
  },
): Promise<number> {
  const table = "base_dept";
  const method = "deleteByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  if (ids.length > 0) {
    await delCache();
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const isExist = await existById(id);
    if (!isExist) {
      continue;
    }
    const args = new QueryArgs();
    const sql = `
      update
        base_dept
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
  
  await delCache();
  
  return num;
}

/**
 * 根据 ID 查找是否已启用
 * 记录不存在则返回 undefined
 * @param {string} id
 * @return {Promise<0 | 1 | undefined>}
 */
export async function getIsEnabledById(
  id: string,
  options?: {
  },
): Promise<0 | 1 | undefined> {
  const model = await findById(
    id,
    options,
  );
  const is_enabled = model?.is_enabled as (0 | 1 | undefined);
  return is_enabled;
}

/**
 * 根据 ids 启用或者禁用数据
 * @param {string[]} ids
 * @param {0 | 1} is_enabled
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: string[],
  is_enabled: 0 | 1,
  options?: {
  },
): Promise<number> {
  const table = "base_dept";
  const method = "enableByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  if (ids.length > 0) {
    await delCache();
  }
  
  const args = new QueryArgs();
  let sql = `
    update
      base_dept
    set
      is_enabled = ${ args.push(is_enabled) }
    
  `;
  {
    const authModel = await authDao.getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,update_usr_id = ${ args.push(authModel.id) }`;
    }
  }
  sql += `
  
  where
      id in ${ args.push(ids) }
  `;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCache();
  
  return num;
}

/**
 * 根据 ID 查找是否已锁定
 * 已锁定的记录不能修改和删除
 * 记录不存在则返回 undefined
 * @param {string} id
 * @return {Promise<0 | 1 | undefined>}
 */
export async function getIsLockedById(
  id: string,
  options?: {
  },
): Promise<0 | 1 | undefined> {
  const model = await findById(
    id,
    options,
  );
  const is_locked = model?.is_locked as (0 | 1 | undefined);
  return is_locked;
}

/**
 * 根据 ids 锁定或者解锁数据
 * @param {string[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: string[],
  is_locked: 0 | 1,
  options?: {
  },
): Promise<number> {
  const table = "base_dept";
  const method = "lockByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  if (ids.length > 0) {
    await delCache();
  }
  
  const args = new QueryArgs();
  let sql = `
    update
      base_dept
    set
      is_locked = ${ args.push(is_locked) }
    
  `;
  {
    const authModel = await authDao.getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,update_usr_id = ${ args.push(authModel.id) }`;
    }
  }
  sql += `
  
  where
      id in ${ args.push(ids) }
  `;
  const result = await execute(sql, args);
  const num = result.affectedRows;
  
  await delCache();
  
  return num;
}

/**
 * 根据 ids 还原数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: string[],
  options?: {
  },
): Promise<number> {
  const table = "base_dept";
  const method = "revertByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  if (ids.length > 0) {
    await delCache();
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const args = new QueryArgs();
    const sql = `
      update
        base_dept
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
        throw await ns("数据已经存在");
      }
    }
  }
  
  await delCache();
  
  return num;
}

/**
 * 根据 ids 彻底删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: string[],
  options?: {
  },
): Promise<number> {
  const table = "base_dept";
  const method = "forceDeleteByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  if (ids.length > 0) {
    await delCache();
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
          base_dept
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `
      delete from
        base_dept
      where
        id = ${ args.push(id) }
        and is_deleted = 1
      limit 1
    `;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  await delCache();
  
  return num;
}
  
/**
 * 查找 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
  options?: {
  },
): Promise<number> {
  const table = "base_dept";
  const method = "findLastOrderBy";
  
  let sql = `
    select
      t.order_by order_by
    from
      base_dept t
  `;
  const whereQuery: string[] = [ ];
  const args = new QueryArgs();
  whereQuery.push(`t.is_deleted = 0`);
  {
    const authModel = await authDao.getAuthModel();
    const tenant_id = await usrDaoSrc.getTenant_id(authModel?.id);
    whereQuery.push(`t.tenant_id = ${ args.push(tenant_id) }`);
  }
  {
    const authModel = await authDao.getAuthModel();
    const org_id = authModel?.org_id;
    if (org_id) {
      whereQuery.push(`t.org_id = ${ args.push(org_id) }`);
    }
  }
  if (whereQuery.length > 0) {
    sql += " where " + whereQuery.join(" and ");
  }
  sql += `
    order by
      t.order_by desc
    limit 1
  `;
  
  interface Result {
    order_by: number;
  }
  let model = await queryOne<Result>(sql, args);
  let result = model?.order_by ?? 0;
  
  return result;
}
