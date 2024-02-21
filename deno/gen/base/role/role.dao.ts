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
  hash,
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
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  MenuId,
} from "/gen/base/menu/menu.model.ts";

import type {
  PermitId,
} from "/gen/base/permit/permit.model.ts";

import type {
  DataPermitId,
} from "/gen/base/data_permit/data_permit.model.ts";

import type {
  RoleInput,
  RoleModel,
  RoleSearch,
  RoleFieldComment,
  RoleId,
} from "./role.model.ts";

const route_path = "/base/role";

async function getWhereQuery(
  args: QueryArgs,
  search?: RoleSearch,
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
  if (search?.home_url !== undefined) {
    whereQuery += ` and t.home_url = ${ args.push(search.home_url) }`;
  }
  if (search?.home_url === null) {
    whereQuery += ` and t.home_url is null`;
  }
  if (isNotEmpty(search?.home_url_like)) {
    whereQuery += ` and t.home_url like ${ args.push("%" + sqlLike(search?.home_url_like) + "%") }`;
  }
  if (search?.menu_ids && !Array.isArray(search?.menu_ids)) {
    search.menu_ids = [ search.menu_ids ];
  }
  if (search?.menu_ids && search?.menu_ids.length > 0) {
    whereQuery += ` and base_menu.id in ${ args.push(search.menu_ids) }`;
  }
  if (search?.menu_ids === null) {
    whereQuery += ` and base_menu.id is null`;
  }
  if (search?.menu_ids_is_null) {
    whereQuery += ` and base_menu.id is null`;
  }
  if (search?.permit_ids && !Array.isArray(search?.permit_ids)) {
    search.permit_ids = [ search.permit_ids ];
  }
  if (search?.permit_ids && search?.permit_ids.length > 0) {
    whereQuery += ` and base_permit.id in ${ args.push(search.permit_ids) }`;
  }
  if (search?.permit_ids === null) {
    whereQuery += ` and base_permit.id is null`;
  }
  if (search?.permit_ids_is_null) {
    whereQuery += ` and base_permit.id is null`;
  }
  if (search?.data_permit_ids && !Array.isArray(search?.data_permit_ids)) {
    search.data_permit_ids = [ search.data_permit_ids ];
  }
  if (search?.data_permit_ids && search?.data_permit_ids.length > 0) {
    whereQuery += ` and base_data_permit.id in ${ args.push(search.data_permit_ids) }`;
  }
  if (search?.data_permit_ids === null) {
    whereQuery += ` and base_data_permit.id is null`;
  }
  if (search?.data_permit_ids_is_null) {
    whereQuery += ` and base_data_permit.id is null`;
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
    base_role t
    left join base_role_menu
      on base_role_menu.role_id = t.id
      and base_role_menu.is_deleted = 0
    left join base_menu
      on base_role_menu.menu_id = base_menu.id
      and base_menu.is_deleted = 0
    left join (
      select
        json_objectagg(base_role_menu.order_by, base_menu.id) menu_ids,
        json_objectagg(base_role_menu.order_by, base_menu.lbl) menu_ids_lbl,
        base_role.id role_id
      from base_role_menu
      inner join base_menu
        on base_menu.id = base_role_menu.menu_id
        and base_menu.is_deleted = 0
      inner join base_role
        on base_role.id = base_role_menu.role_id
      where
        base_role_menu.is_deleted = 0
      group by role_id
    ) _menu
      on _menu.role_id = t.id
    left join base_role_permit
      on base_role_permit.role_id = t.id
      and base_role_permit.is_deleted = 0
    left join base_permit
      on base_role_permit.permit_id = base_permit.id
      and base_permit.is_deleted = 0
    left join (
      select
        json_objectagg(base_role_permit.order_by, base_permit.id) permit_ids,
        json_objectagg(base_role_permit.order_by, base_permit.lbl) permit_ids_lbl,
        base_role.id role_id
      from base_role_permit
      inner join base_permit
        on base_permit.id = base_role_permit.permit_id
        and base_permit.is_deleted = 0
      inner join base_role
        on base_role.id = base_role_permit.role_id
      where
        base_role_permit.is_deleted = 0
      group by role_id
    ) _permit
      on _permit.role_id = t.id
    left join base_role_data_permit
      on base_role_data_permit.role_id = t.id
      and base_role_data_permit.is_deleted = 0
    left join base_data_permit
      on base_role_data_permit.data_permit_id = base_data_permit.id
      and base_data_permit.is_deleted = 0
    left join (
      select
        json_objectagg(base_role_data_permit.order_by, base_data_permit.id) data_permit_ids,
        json_objectagg(base_role_data_permit.order_by, base_data_permit.scope) data_permit_ids_lbl,
        base_role.id role_id
      from base_role_data_permit
      inner join base_data_permit
        on base_data_permit.id = base_role_data_permit.data_permit_id
        and base_data_permit.is_deleted = 0
      inner join base_role
        on base_role.id = base_role_data_permit.role_id
      where
        base_role_data_permit.is_deleted = 0
      group by role_id
    ) _data_permit
      on _data_permit.role_id = t.id
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id
  `;
  return fromQuery;
}

/**
 * 根据条件查找角色总数
 * @param { RoleSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: RoleSearch,
  options?: {
  },
): Promise<number> {
  const table = "base_role";
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
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  interface Result {
    total: number,
  }
  const model = await queryOne<Result>(sql, args, { cacheKey1, cacheKey2 });
  let result = Number(model?.total || 0);
  
  return result;
}

/**
 * 根据搜索条件和分页查找角色列表
 * @param {RoleSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: RoleSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<RoleModel[]> {
  const table = "base_role";
  const method = "findAll";
  
  const args = new QueryArgs();
  let sql = `
    select t.*
      ,max(menu_ids) menu_ids
      ,max(menu_ids_lbl) menu_ids_lbl
      ,max(permit_ids) permit_ids
      ,max(permit_ids_lbl) permit_ids_lbl
      ,max(data_permit_ids) data_permit_ids
      ,max(data_permit_ids_lbl) data_permit_ids_lbl
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
        prop: "order_by",
        order: SortOrderEnum.Asc,
      },
    ];
  } else if (!Array.isArray(sort)) {
    sort = [ sort ];
  }
  sort = sort.filter((item) => item.prop);
  sort.push({
    prop: "order_by",
    order: SortOrderEnum.Asc,
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
  
  // 缓存
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  const result = await query<RoleModel>(
    sql,
    args,
    {
      cacheKey1,
      cacheKey2,
    },
  );
  for (const item of result) {
    
    // 菜单权限
    if (item.menu_ids) {
      const obj = item.menu_ids;
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.menu_ids = keys.map((key) => obj[key]);
    }
    if (item.menu_ids_lbl) {
      const obj = item.menu_ids_lbl;
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.menu_ids_lbl = keys.map((key) => obj[key]);
    }
    
    // 按钮权限
    if (item.permit_ids) {
      const obj = item.permit_ids;
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.permit_ids = keys.map((key) => obj[key]);
    }
    if (item.permit_ids_lbl) {
      const obj = item.permit_ids_lbl;
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.permit_ids_lbl = keys.map((key) => obj[key]);
    }
    
    // 数据权限
    if (item.data_permit_ids) {
      const obj = item.data_permit_ids;
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.data_permit_ids = keys.map((key) => obj[key]);
    }
    if (item.data_permit_ids_lbl) {
      const obj = item.data_permit_ids_lbl;
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.data_permit_ids_lbl = keys.map((key) => obj[key]);
    }
  }
  
  const [
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await getDict([
    "is_locked",
    "is_enabled",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 锁定
    let is_locked_lbl = model.is_locked?.toString() || "";
    if (model.is_locked !== undefined && model.is_locked !== null) {
      const dictItem = is_lockedDict.find((dictItem) => dictItem.val === model.is_locked.toString());
      if (dictItem) {
        is_locked_lbl = dictItem.lbl;
      }
    }
    model.is_locked_lbl = is_locked_lbl;
    
    // 启用
    let is_enabled_lbl = model.is_enabled?.toString() || "";
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

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: RoleInput,
) {
  
  const [
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await getDict([
    "is_locked",
    "is_enabled",
  ]);
  
  // 菜单权限
  if (!input.menu_ids && input.menu_ids_lbl) {
    input.menu_ids_lbl = input.menu_ids_lbl
      .map((item: string) => item.trim())
      .filter((item: string) => item);
    input.menu_ids_lbl = Array.from(new Set(input.menu_ids_lbl));
    if (input.menu_ids_lbl.length === 0) {
      input.menu_ids = [ ];
    } else {
      const args = new QueryArgs();
      const sql = `
        select
          t.id
        from
          base_menu t
        where
          t.lbl in ${ args.push(input.menu_ids_lbl) }
      `;
      interface Result {
        id: MenuId;
      }
      const models = await query<Result>(sql, args);
      input.menu_ids = models.map((item: { id: MenuId }) => item.id);
    }
  }
  
  // 按钮权限
  if (!input.permit_ids && input.permit_ids_lbl) {
    input.permit_ids_lbl = input.permit_ids_lbl
      .map((item: string) => item.trim())
      .filter((item: string) => item);
    input.permit_ids_lbl = Array.from(new Set(input.permit_ids_lbl));
    if (input.permit_ids_lbl.length === 0) {
      input.permit_ids = [ ];
    } else {
      const args = new QueryArgs();
      const sql = `
        select
          t.id
        from
          base_permit t
        where
          t.lbl in ${ args.push(input.permit_ids_lbl) }
      `;
      interface Result {
        id: PermitId;
      }
      const models = await query<Result>(sql, args);
      input.permit_ids = models.map((item: { id: PermitId }) => item.id);
    }
  }
  
  // 数据权限
  if (!input.data_permit_ids && input.data_permit_ids_lbl) {
    input.data_permit_ids_lbl = input.data_permit_ids_lbl
      .map((item: string) => item.trim())
      .filter((item: string) => item);
    input.data_permit_ids_lbl = Array.from(new Set(input.data_permit_ids_lbl));
    if (input.data_permit_ids_lbl.length === 0) {
      input.data_permit_ids = [ ];
    } else {
      const args = new QueryArgs();
      const sql = `
        select
          t.id
        from
          base_data_permit t
        where
          t.scope in ${ args.push(input.data_permit_ids_lbl) }
      `;
      interface Result {
        id: DataPermitId;
      }
      const models = await query<Result>(sql, args);
      input.data_permit_ids = models.map((item: { id: DataPermitId }) => item.id);
    }
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
}

/**
 * 获取角色字段注释
 */
export async function getFieldComments(): Promise<RoleFieldComment> {
  const n = initN(route_path);
  const fieldComments: RoleFieldComment = {
    id: await n("ID"),
    lbl: await n("名称"),
    home_url: await n("首页"),
    menu_ids: await n("菜单权限"),
    menu_ids_lbl: await n("菜单权限"),
    permit_ids: await n("按钮权限"),
    permit_ids_lbl: await n("按钮权限"),
    data_permit_ids: await n("数据权限"),
    data_permit_ids_lbl: await n("数据权限"),
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
 * 通过唯一约束获得角色列表
 * @param {RoleInput} search0
 */
export async function findByUnique(
  search0: RoleInput,
  options?: {
  },
): Promise<RoleModel[]> {
  if (search0.id) {
    const model = await findOne({
      id: search0.id,
    });
    if (!model) {
      return [ ];
    }
    return [ model ];
  }
  const models: RoleModel[] = [ ];
  {
    const lbl = search0.lbl ?? "";
    const modelTmps = await findAll({
      lbl,
    });
    models.push(...modelTmps);
  }
  return models;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {RoleModel} oldModel
 * @param {RoleInput} input
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: RoleModel,
  input: RoleInput,
): boolean {
  if (!oldModel || !input) {
    return false;
  }
  if (
    oldModel.lbl === input.lbl
  ) {
    return true;
  }
  return false;
}

/**
 * 通过唯一约束检查角色是否已经存在
 * @param {RoleInput} input
 * @param {RoleModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<RoleId | undefined>}
 */
export async function checkByUnique(
  input: RoleInput,
  oldModel: RoleModel,
  uniqueType: UniqueType = UniqueType.Throw,
  options?: {
  },
): Promise<RoleId | undefined> {
  const isEquals = equalsByUnique(oldModel, input);
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("此 {0} 已经存在", await ns("角色")));
    }
    if (uniqueType === UniqueType.Update) {
      const id: RoleId = await updateById(
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
 * 根据条件查找第一个角色
 * @param {RoleSearch} search?
 */
export async function findOne(
  search?: RoleSearch,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<RoleModel | undefined> {
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  const models = await findAll(search, page, sort);
  const model = models[0];
  return model;
}

/**
 * 根据 id 查找角色
 * @param {RoleId} id
 */
export async function findById(
  id?: RoleId | null,
  options?: {
  },
): Promise<RoleModel | undefined> {
  if (isEmpty(id as unknown as string)) {
    return;
  }
  const model = await findOne({ id });
  return model;
}

/**
 * 根据搜索条件判断角色是否存在
 * @param {RoleSearch} search?
 */
export async function exist(
  search?: RoleSearch,
  options?: {
  },
): Promise<boolean> {
  const model = await findOne(search);
  const exist = !!model;
  return exist;
}

/**
 * 根据id判断角色是否存在
 * @param {RoleId} id
 */
export async function existById(
  id?: RoleId | null,
) {
  const table = "base_role";
  const method = "existById";
  
  if (isEmpty(id as unknown as string)) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = `
    select
      1 e
    from
      base_role t
    where
      t.id = ${ args.push(id) }
      and t.is_deleted = 0
    limit 1
  `;
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
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

/** 校验角色是否启用 */
export async function validateIsEnabled(
  model: RoleModel,
) {
  if (model.is_enabled == 0) {
    throw `${ await ns("角色") } ${ await ns("已禁用") }`;
  }
}

/** 校验角色是否存在 */
export async function validateOption(
  model?: RoleModel,
) {
  if (!model) {
    throw `${ await ns("角色") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 角色增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: RoleInput,
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
  
  // 首页
  await validators.chars_max_length(
    input.home_url,
    200,
    fieldComments.home_url,
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
 * 创建角色
 * @param {RoleInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<RoleId>} 
 */
export async function create(
  input: RoleInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<RoleId> {
  const table = "base_role";
  const method = "create";
  
  if (input.id) {
    throw new Error(`Can not set id when create in dao: ${ table }`);
  }
  
  await setIdByLbl(input);
  
  const oldModels = await findByUnique(input, options);
  if (oldModels.length > 0) {
    let id: RoleId | undefined = undefined;
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
  
  {
    const {
      filterMenuIdsByTenant,
    } = await import("/src/base/tenant/tenant.dao.ts");
    
    input.menu_ids = await filterMenuIdsByTenant(input.menu_ids);
  }
  
  while (true) {
    input.id = shortUuidV4<RoleId>();
    const isExist = await existById(input.id);
    if (!isExist) {
      break;
    }
    error(`ID_COLLIDE: ${ table } ${ input.id as unknown as string }`);
  }
  
  const args = new QueryArgs();
  let sql = `
    insert into base_role(
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
  if (input.home_url !== undefined) {
    sql += `,home_url`;
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
  if (input.home_url !== undefined) {
    sql += `,${ args.push(input.home_url) }`;
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
  
  await delCache();
  const res = await execute(sql, args);
  log(JSON.stringify(res));
  
  // 菜单权限
  await many2manyUpdate(
    input,
    "menu_ids",
    {
      mod: "base",
      table: "role_menu",
      column1: "role_id",
      column2: "menu_id",
    },
  );
  
  // 按钮权限
  await many2manyUpdate(
    input,
    "permit_ids",
    {
      mod: "base",
      table: "role_permit",
      column1: "role_id",
      column2: "permit_id",
    },
  );
  
  // 数据权限
  await many2manyUpdate(
    input,
    "data_permit_ids",
    {
      mod: "base",
      table: "role_data_permit",
      column1: "role_id",
      column2: "data_permit_id",
    },
  );
  
  await delCache();
  
  return input.id;
}

/**
 * 删除缓存
 */
export async function delCache() {
  const table = "base_role";
  const method = "delCache";
  
  await delCacheCtx(`dao.sql.${ table }`);
  const foreignTables: string[] = [
    "base_role_menu",
    "base_menu",
    "base_role_permit",
    "base_permit",
    "base_role_data_permit",
    "base_data_permit",
    "base_usr",
  ];
  for (let k = 0; k < foreignTables.length; k++) {
    const foreignTable = foreignTables[k];
    if (foreignTable === table) continue;
    await delCacheCtx(`dao.sql.${ foreignTable }`);
  }
}

/**
 * 角色根据id修改租户id
 * @param {RoleId} id
 * @param {TenantId} tenant_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateTenantById(
  id: RoleId,
  tenant_id: TenantId,
  options?: {
  },
): Promise<number> {
  const table = "base_role";
  const method = "updateTenantById";
  
  const tenantExist = await existByIdTenant(tenant_id);
  if (!tenantExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `
    update
      base_role
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
 * 根据 id 修改角色
 * @param {RoleId} id
 * @param {RoleInput} input
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<RoleId>}
 */
export async function updateById(
  id: RoleId,
  input: RoleInput,
  options?: {
    uniqueType?: "ignore" | "throw";
  },
): Promise<RoleId> {
  const table = "base_role";
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
        throw await ns("此 {0} 已经存在", await ns("角色"));
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id);
  
  if (!oldModel) {
    throw await ns("编辑失败, 此 {0} 已被删除", await ns("角色"));
  }
  
  {
    const {
      filterMenuIdsByTenant,
    } = await import("/src/base/tenant/tenant.dao.ts");
    
    input.menu_ids = await filterMenuIdsByTenant(input.menu_ids);
  }
  
  const args = new QueryArgs();
  let sql = `
    update base_role set
  `;
  let updateFldNum = 0;
  if (input.lbl !== undefined) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl = ${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  if (input.home_url !== undefined) {
    if (input.home_url != oldModel.home_url) {
      sql += `home_url = ${ args.push(input.home_url) },`;
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
    
    await delCache();
    
    const res = await execute(sql, args);
    log(JSON.stringify(res));
  }
  
  updateFldNum++;
  
  // 菜单权限
  await many2manyUpdate(
    {
      ...input,
      id: id as unknown as string,
    },
    "menu_ids",
    {
      mod: "base",
      table: "role_menu",
      column1: "role_id",
      column2: "menu_id",
    },
  );
  
  updateFldNum++;
  
  // 按钮权限
  await many2manyUpdate(
    {
      ...input,
      id: id as unknown as string,
    },
    "permit_ids",
    {
      mod: "base",
      table: "role_permit",
      column1: "role_id",
      column2: "permit_id",
    },
  );
  
  updateFldNum++;
  
  // 数据权限
  await many2manyUpdate(
    {
      ...input,
      id: id as unknown as string,
    },
    "data_permit_ids",
    {
      mod: "base",
      table: "role_data_permit",
      column1: "role_id",
      column2: "data_permit_id",
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
 * 根据 ids 删除角色
 * @param {RoleId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: RoleId[],
  options?: {
  },
): Promise<number> {
  const table = "base_role";
  const method = "deleteByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  if (ids.length > 0) {
    await delCache();
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: RoleId = ids[i];
    const isExist = await existById(id);
    if (!isExist) {
      continue;
    }
    const args = new QueryArgs();
    const sql = `
      update
        base_role
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
 * 根据 ID 查找角色是否已启用
 * 不存在则返回 undefined
 * @param {RoleId} id
 * @return {Promise<0 | 1 | undefined>}
 */
export async function getIsEnabledById(
  id: RoleId,
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
 * 根据 ids 启用或者禁用角色
 * @param {RoleId[]} ids
 * @param {0 | 1} is_enabled
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: RoleId[],
  is_enabled: 0 | 1,
  options?: {
  },
): Promise<number> {
  const table = "base_role";
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
      base_role
    set
      is_enabled = ${ args.push(is_enabled) }
    
  `;
  {
    const authModel = await getAuthModel();
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
 * 根据 ID 查找角色是否已锁定
 * 已锁定的不能修改和删除
 * 不存在则返回 undefined
 * @param {RoleId} id
 * @return {Promise<0 | 1 | undefined>}
 */
export async function getIsLockedById(
  id: RoleId,
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
 * 根据 ids 锁定或者解锁角色
 * @param {RoleId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: RoleId[],
  is_locked: 0 | 1,
  options?: {
  },
): Promise<number> {
  const table = "base_role";
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
      base_role
    set
      is_locked = ${ args.push(is_locked) }
    
  `;
  {
    const authModel = await getAuthModel();
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
 * 根据 ids 还原角色
 * @param {RoleId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: RoleId[],
  options?: {
  },
): Promise<number> {
  const table = "base_role";
  const method = "revertByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  if (ids.length > 0) {
    await delCache();
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: RoleId = ids[i];
    const args = new QueryArgs();
    const sql = `
      update
        base_role
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
        throw await ns("此 {0} 已经存在", await ns("角色"));
      }
    }
  }
  
  await delCache();
  
  return num;
}

/**
 * 根据 ids 彻底删除角色
 * @param {RoleId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: RoleId[],
  options?: {
  },
): Promise<number> {
  const table = "base_role";
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
          base_role
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `
      delete from
        base_role
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
 * 查找 角色 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
  options?: {
  },
): Promise<number> {
  const table = "base_role";
  const method = "findLastOrderBy";
  
  let sql = `
    select
      t.order_by order_by
    from
      base_role t
  `;
  const whereQuery: string[] = [ ];
  const args = new QueryArgs();
  whereQuery.push(`t.is_deleted = 0`);
  {
    const authModel = await getAuthModel();
    const tenant_id = await getTenant_id(authModel?.id);
    whereQuery.push(`t.tenant_id = ${ args.push(tenant_id) }`);
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
