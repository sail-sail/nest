// deno-lint-ignore-file no-explicit-any prefer-const no-unused-vars ban-types
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

import {
  type PartialNull,
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

import * as dictSrcDao from "/src/base/dict_detail/dict_detail.dao.ts";

import { UniqueException } from "/lib/exceptions/unique.execption.ts";

import * as authDao from "/lib/auth/auth.dao.ts";

import {
  many2manyUpdate,
} from "/lib/util/dao_util.ts";

import {
  UniqueType,
  SortOrderEnum,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type MenuInput,
  type MenuModel,
  type MenuSearch,
} from "./menu.model.ts";

async function getWhereQuery(
  args: QueryArgs,
  search?: MenuSearch,
  options?: {
  },
) {
  let whereQuery = "";
  whereQuery += ` t.is_deleted = ${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;
  if (isNotEmpty(search?.id)) {
    whereQuery += ` and t.id = ${ args.push(search?.id) }`;
  }
  if (search?.ids && !Array.isArray(search?.ids)) {
    search.ids = [ search.ids ];
  }
  if (search?.ids && search?.ids.length > 0) {
    whereQuery += ` and t.id in ${ args.push(search.ids) }`;
  }
  if (search?.type && !Array.isArray(search?.type)) {
    search.type = [ search.type ];
  }
  if (search?.type && search?.type?.length > 0) {
    whereQuery += ` and t.type in ${ args.push(search.type) }`;
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
  if (search?.route_path !== undefined) {
    whereQuery += ` and t.route_path = ${ args.push(search.route_path) }`;
  }
  if (search?.route_path === null) {
    whereQuery += ` and t.route_path is null`;
  }
  if (isNotEmpty(search?.route_path_like)) {
    whereQuery += ` and t.route_path like ${ args.push(sqlLike(search?.route_path_like) + "%") }`;
  }
  if (search?.route_query !== undefined) {
    whereQuery += ` and t.route_query = ${ args.push(search.route_query) }`;
  }
  if (search?.route_query === null) {
    whereQuery += ` and t.route_query is null`;
  }
  if (isNotEmpty(search?.route_query_like)) {
    whereQuery += ` and t.route_query like ${ args.push(sqlLike(search?.route_query_like) + "%") }`;
  }
  if (search?.is_locked && !Array.isArray(search?.is_locked)) {
    search.is_locked = [ search.is_locked ];
  }
  if (search?.is_locked && search?.is_locked?.length > 0) {
    whereQuery += ` and t.is_locked in ${ args.push(search.is_locked) }`;
  }
  if (search?.tenant_ids && !Array.isArray(search?.tenant_ids)) {
    search.tenant_ids = [ search.tenant_ids ];
  }
  if (search?.tenant_ids && search?.tenant_ids.length > 0) {
    whereQuery += ` and base_tenant.id in ${ args.push(search.tenant_ids) }`;
  }
  if (search?.tenant_ids === null) {
    whereQuery += ` and base_tenant.id is null`;
  }
  if (search?.tenant_ids_is_null) {
    whereQuery += ` and base_tenant.id is null`;
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

function getFromQuery() {
  const fromQuery = /*sql*/ `
    base_menu t
    left join base_menu parent_id_lbl
      on parent_id_lbl.id = t.parent_id
    left join base_tenant_menu
      on base_tenant_menu.menu_id = t.id
      and base_tenant_menu.is_deleted = 0
    left join base_tenant
      on base_tenant_menu.tenant_id = base_tenant.id
      and base_tenant.is_deleted = 0
    left join (
      select
        json_arrayagg(base_tenant.id) tenant_ids,
        json_arrayagg(base_tenant.lbl) tenant_ids_lbl,
        base_menu.id menu_id
      from base_tenant_menu
      inner join base_tenant
        on base_tenant.id = base_tenant_menu.tenant_id
        and base_tenant.is_deleted = 0
      inner join base_menu
        on base_menu.id = base_tenant_menu.menu_id
      where
        base_tenant_menu.is_deleted = 0
      group by menu_id
    ) _tenant
      on _tenant.menu_id = t.id
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id
  `;
  return fromQuery;
}

/**
 * 根据条件查找总数据数
 * @param { MenuSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: MenuSearch,
  options?: {
  },
): Promise<number> {
  const table = "base_menu";
  const method = "findCount";
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    select
      count(1) total
    from
      (
        select
          1
        from
          ${ getFromQuery() }
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
 * @param {MenuSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: MenuSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
  },
) {
  const table = "base_menu";
  const method = "findAll";
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    select t.*
      ,parent_id_lbl.lbl parent_id_lbl
      ,max(tenant_ids) tenant_ids
      ,max(tenant_ids_lbl) tenant_ids_lbl
      ,create_usr_id_lbl.lbl create_usr_id_lbl
      ,update_usr_id_lbl.lbl update_usr_id_lbl
    from
      ${ getFromQuery() }
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
  
  const result = await query<MenuModel>(
    sql,
    args,
    {
      cacheKey1,
      cacheKey2,
    },
  );
  
  const [
    typeDict, // 类型
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await dictSrcDao.getDict([
    "menu_type",
    "is_locked",
    "is_enabled",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 类型
    let type_lbl = model.type;
    if (!isEmpty(model.type)) {
      const dictItem = typeDict.find((dictItem) => dictItem.val === model.type);
      if (dictItem) {
        type_lbl = dictItem.lbl;
      }
    }
    model.type_lbl = type_lbl;
    
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
export async function getFieldComments() {
  const n = initN("/menu");
  const fieldComments = {
    type: await n("类型"),
    type_lbl: await n("类型"),
    parent_id: await n("父菜单"),
    parent_id_lbl: await n("父菜单"),
    lbl: await n("名称"),
    route_path: await n("路由"),
    route_query: await n("参数"),
    is_locked: await n("锁定"),
    is_locked_lbl: await n("锁定"),
    tenant_ids: await n("所在租户"),
    tenant_ids_lbl: await n("所在租户"),
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
 * @param {MenuSearch | PartialNull<MenuModel>} search0
 */
export async function findByUnique(
  search0: MenuSearch | PartialNull<MenuModel>,
  options?: {
  },
): Promise<MenuModel[]> {
  if (search0.id) {
    const model = await findOne({
      id: search0.id,
    });
    if (!model) {
      return [ ];
    }
    return [ model ];
  }
  const models: MenuModel[] = [ ];
  {
    let parent_id: string[] = [ ];
    if (search0.parent_id) {
      if (!Array.isArray(search0.parent_id)) {
        parent_id.push(search0.parent_id);
      } else {
        parent_id = search0.parent_id;
      }
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
 * @param {MenuModel} oldModel
 * @param {PartialNull<MenuModel>} model
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: MenuModel,
  model: PartialNull<MenuModel>,
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
 * @param {MenuInput} model
 * @param {MenuModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<string>}
 */
export async function checkByUnique(
  model: MenuInput,
  oldModel: MenuModel,
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
 * @param {MenuSearch} search?
 */
export async function findOne(
  search?: MenuSearch,
  sort?: SortInput | SortInput[],
  options?: {
  },
) {
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
) {
  if (isEmpty(id)) {
    return;
  }
  const model = await findOne({ id });
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {MenuSearch} search?
 */
export async function exist(
  search?: MenuSearch,
  options?: {
  },
) {
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
  const table = "base_menu";
  const method = "existById";
  
  if (isEmpty(id)) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = /*sql*/ `
    select
      1 e
    from
      base_menu t
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
 * 创建数据
 * @param {MenuInput} model
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<string>} 
 */
export async function create(
  model: MenuInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<string> {
  const table = "base_menu";
  const method = "create";
  
  const [
    typeDict, // 类型
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await dictSrcDao.getDict([
    "menu_type",
    "is_locked",
    "is_enabled",
  ]);
  
  // 类型
  if (isNotEmpty(model.type_lbl) && model.type === undefined) {
    const val = typeDict.find((itemTmp) => itemTmp.lbl === model.type_lbl)?.val;
    if (val !== undefined) {
      model.type = val;
    }
  }
  
  // 父菜单
  if (isNotEmpty(model.parent_id_lbl) && model.parent_id === undefined) {
    model.parent_id_lbl = String(model.parent_id_lbl).trim();
    const menuModel = await findOne({ lbl: model.parent_id_lbl });
    if (menuModel) {
      model.parent_id = menuModel.id;
    }
  }
  
  // 锁定
  if (isNotEmpty(model.is_locked_lbl) && model.is_locked === undefined) {
    const val = is_lockedDict.find((itemTmp) => itemTmp.lbl === model.is_locked_lbl)?.val;
    if (val !== undefined) {
      model.is_locked = Number(val);
    }
  }
  
  // 所在租户
  if (!model.tenant_ids && model.tenant_ids_lbl) {
    if (typeof model.tenant_ids_lbl === "string" || model.tenant_ids_lbl instanceof String) {
      model.tenant_ids_lbl = model.tenant_ids_lbl.split(",");
    }
    model.tenant_ids_lbl = model.tenant_ids_lbl.map((item: string) => item.trim());
    const args = new QueryArgs();
    const sql = /*sql*/ `
      select
        t.id
      from
        base_tenant t
      where
        t.lbl in ${ args.push(model.tenant_ids_lbl) }
    `;
    interface Result {
      id: string;
    }
    const models = await query<Result>(sql, args);
    model.tenant_ids = models.map((item: { id: string }) => item.id);
  }
  
  // 启用
  if (isNotEmpty(model.is_enabled_lbl) && model.is_enabled === undefined) {
    const val = is_enabledDict.find((itemTmp) => itemTmp.lbl === model.is_enabled_lbl)?.val;
    if (val !== undefined) {
      model.is_enabled = Number(val);
    }
  }
  
  const oldModels = await findByUnique(model, options);
  if (oldModels.length > 0) {
    let id: string | undefined = undefined;
    for (const oldModel of oldModels) {
      id = await checkByUnique(
        model,
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
  
  if (!model.id) {
    model.id = shortUuidV4();
  }
  
  const args = new QueryArgs();
  let sql = `
    insert into base_menu(
      id
      ,create_time
  `;
  if (model.create_usr_id != null) {
    sql += `,create_usr_id`;
  } else {
    const authModel = await authDao.getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,create_usr_id`;
    }
  }
  if (model.type !== undefined) {
    sql += `,type`;
  }
  if (model.parent_id !== undefined) {
    sql += `,parent_id`;
  }
  if (model.lbl !== undefined) {
    sql += `,lbl`;
  }
  if (model.route_path !== undefined) {
    sql += `,route_path`;
  }
  if (model.route_query !== undefined) {
    sql += `,route_query`;
  }
  if (model.is_locked !== undefined) {
    sql += `,is_locked`;
  }
  if (model.is_enabled !== undefined) {
    sql += `,is_enabled`;
  }
  if (model.order_by !== undefined) {
    sql += `,order_by`;
  }
  if (model.rem !== undefined) {
    sql += `,rem`;
  }
  if (model.update_usr_id !== undefined) {
    sql += `,update_usr_id`;
  }
  if (model.update_time !== undefined) {
    sql += `,update_time`;
  }
  sql += `) values(${ args.push(model.id) },${ args.push(reqDate()) }`;
  if (model.create_usr_id != null && model.create_usr_id !== "-") {
    sql += `,${ args.push(model.create_usr_id) }`;
  } else {
    const authModel = await authDao.getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,${ args.push(authModel.id) }`;
    }
  }
  if (model.type !== undefined) {
    sql += `,${ args.push(model.type) }`;
  }
  if (model.parent_id !== undefined) {
    sql += `,${ args.push(model.parent_id) }`;
  }
  if (model.lbl !== undefined) {
    sql += `,${ args.push(model.lbl) }`;
  }
  if (model.route_path !== undefined) {
    sql += `,${ args.push(model.route_path) }`;
  }
  if (model.route_query !== undefined) {
    sql += `,${ args.push(model.route_query) }`;
  }
  if (model.is_locked !== undefined) {
    sql += `,${ args.push(model.is_locked) }`;
  }
  if (model.is_enabled !== undefined) {
    sql += `,${ args.push(model.is_enabled) }`;
  }
  if (model.order_by !== undefined) {
    sql += `,${ args.push(model.order_by) }`;
  }
  if (model.rem !== undefined) {
    sql += `,${ args.push(model.rem) }`;
  }
  if (model.update_usr_id !== undefined) {
    sql += `,${ args.push(model.update_usr_id) }`;
  }
  if (model.update_time !== undefined) {
    sql += `,${ args.push(model.update_time) }`;
  }
  sql += `)`;
  
  const result = await execute(sql, args);
  // 所在租户
  await many2manyUpdate(model, "tenant_ids", { mod: "base", table: "tenant_menu", column1: "menu_id", column2: "tenant_id" });
  
  await delCache();
  
  return model.id;
}

/**
 * 删除缓存
 */
export async function delCache() {
  const table = "base_menu";
  const method = "delCache";
  
  await delCacheCtx(`dao.sql.${ table }`);
  const foreignTables: string[] = [
    "base_menu",
    "base_tenant_menu",
    "base_tenant",
    "base_usr",
  ];
  for (let k = 0; k < foreignTables.length; k++) {
    const foreignTable = foreignTables[k];
    if (foreignTable === table) continue;
    await delCacheCtx(`dao.sql.${ foreignTable }`);
  }
}

/**
 * 根据id修改一行数据
 * @param {string} id
 * @param {MenuInput} model
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
  model: MenuInput,
  options?: {
    uniqueType?: "ignore" | "throw" | "create";
  },
): Promise<string> {
  const table = "base_menu";
  const method = "updateById";
  
  if (!id) {
    throw new Error("updateById: id cannot be empty");
  }
  if (!model) {
    throw new Error("updateById: model cannot be null");
  }
  
  const [
    typeDict, // 类型
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await dictSrcDao.getDict([
    "menu_type",
    "is_locked",
    "is_enabled",
  ]);
  
  // 类型
  if (isNotEmpty(model.type_lbl) && model.type === undefined) {
    const val = typeDict.find((itemTmp) => itemTmp.lbl === model.type_lbl)?.val;
    if (val !== undefined) {
      model.type = val;
    }
  }
  
  // 父菜单
  if (isNotEmpty(model.parent_id_lbl) && model.parent_id === undefined) {
    model.parent_id_lbl = String(model.parent_id_lbl).trim();
    const menuModel = await findOne({ lbl: model.parent_id_lbl });
    if (menuModel) {
      model.parent_id = menuModel.id;
    }
  }
  
  // 锁定
  if (isNotEmpty(model.is_locked_lbl) && model.is_locked === undefined) {
    const val = is_lockedDict.find((itemTmp) => itemTmp.lbl === model.is_locked_lbl)?.val;
    if (val !== undefined) {
      model.is_locked = Number(val);
    }
  }

  // 所在租户
  if (!model.tenant_ids && model.tenant_ids_lbl) {
    if (typeof model.tenant_ids_lbl === "string" || model.tenant_ids_lbl instanceof String) {
      model.tenant_ids_lbl = model.tenant_ids_lbl.split(",");
    }
    model.tenant_ids_lbl = model.tenant_ids_lbl.map((item: string) => item.trim());
    const args = new QueryArgs();
    const sql = /*sql*/ `
      select
        t.id
      from
        base_tenant t
      where
        t.lbl in ${ args.push(model.tenant_ids_lbl) }
    `;
    interface Result {
      id: string;
    }
    const models = await query<Result>(sql, args);
    model.tenant_ids = models.map((item: { id: string }) => item.id);
  }
  
  // 启用
  if (isNotEmpty(model.is_enabled_lbl) && model.is_enabled === undefined) {
    const val = is_enabledDict.find((itemTmp) => itemTmp.lbl === model.is_enabled_lbl)?.val;
    if (val !== undefined) {
      model.is_enabled = Number(val);
    }
  }
  
  {
    const input = {
      ...model,
      id: undefined,
    };
    let models = await findByUnique(input);
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
    update base_menu set
  `;
  let updateFldNum = 0;
  if (model.type !== undefined) {
    if (model.type != oldModel.type) {
      sql += `type = ${ args.push(model.type) },`;
      updateFldNum++;
    }
  }
  if (model.parent_id !== undefined) {
    if (model.parent_id != oldModel.parent_id) {
      sql += `parent_id = ${ args.push(model.parent_id) },`;
      updateFldNum++;
    }
  }
  if (model.lbl !== undefined) {
    if (model.lbl != oldModel.lbl) {
      sql += `lbl = ${ args.push(model.lbl) },`;
      updateFldNum++;
    }
  }
  if (model.route_path !== undefined) {
    if (model.route_path != oldModel.route_path) {
      sql += `route_path = ${ args.push(model.route_path) },`;
      updateFldNum++;
    }
  }
  if (model.route_query !== undefined) {
    if (model.route_query != oldModel.route_query) {
      sql += `route_query = ${ args.push(model.route_query) },`;
      updateFldNum++;
    }
  }
  if (model.is_locked !== undefined) {
    if (model.is_locked != oldModel.is_locked) {
      sql += `is_locked = ${ args.push(model.is_locked) },`;
      updateFldNum++;
    }
  }
  if (model.is_enabled !== undefined) {
    if (model.is_enabled != oldModel.is_enabled) {
      sql += `is_enabled = ${ args.push(model.is_enabled) },`;
      updateFldNum++;
    }
  }
  if (model.order_by !== undefined) {
    if (model.order_by != oldModel.order_by) {
      sql += `order_by = ${ args.push(model.order_by) },`;
      updateFldNum++;
    }
  }
  if (model.rem !== undefined) {
    if (model.rem != oldModel.rem) {
      sql += `rem = ${ args.push(model.rem) },`;
      updateFldNum++;
    }
  }
  if (updateFldNum > 0) {
    if (model.update_usr_id && model.update_usr_id !== "-") {
      sql += `update_usr_id = ${ args.push(model.update_usr_id) },`;
    } else {
      const authModel = await authDao.getAuthModel();
      if (authModel?.id !== undefined) {
        sql += `update_usr_id = ${ args.push(authModel.id) },`;
      }
    }
    sql += `update_time = ${ args.push(new Date()) }`;
    sql += ` where id = ${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
  }
  
  updateFldNum++;
  // 所在租户
  await many2manyUpdate({ ...model, id }, "tenant_ids", { mod: "base", table: "tenant_menu", column1: "menu_id", column2: "tenant_id" });
  
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
  const table = "base_menu";
  const method = "deleteByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const isExist = await existById(id);
    if (!isExist) {
      continue;
    }
    const args = new QueryArgs();
    const sql = /*sql*/ `
      update
        base_menu
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
  const table = "base_menu";
  const method = "enableByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    update
      base_menu
    set
      is_enabled = ${ args.push(is_enabled) }
    
  `;
  {
    const authModel = await authDao.getAuthModel();
    if (authModel?.id !== undefined) {
      sql += /*sql*/ `,update_usr_id = ${ args.push(authModel.id) }`;
    }
  }
  sql += /*sql*/ `
  
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
  const table = "base_menu";
  const method = "lockByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    update
      base_menu
    set
      is_locked = ${ args.push(is_locked) }
    
  `;
  {
    const authModel = await authDao.getAuthModel();
    if (authModel?.id !== undefined) {
      sql += /*sql*/ `,update_usr_id = ${ args.push(authModel.id) }`;
    }
  }
  sql += /*sql*/ `
  
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
  const table = "base_menu";
  const method = "revertByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const args = new QueryArgs();
    const sql = /*sql*/ `
      update
        base_menu
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
  const table = "base_menu";
  const method = "forceDeleteByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    {
      const args = new QueryArgs();
      const sql = /*sql*/ `
        select
          *
        from
          base_menu
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = /*sql*/ `
      delete from
        base_menu
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
  const table = "base_menu";
  const method = "findLastOrderBy";
  
  let sql = `
    select
      t.order_by order_by
    from
      base_menu t
  `;
  const whereQuery: string[] = [ ];
  const args = new QueryArgs();
  whereQuery.push(`t.is_deleted = 0`);
  if (whereQuery.length > 0) {
    sql += " where " + whereQuery.join(" and ");
  }
  sql += /*sql*/ `
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
