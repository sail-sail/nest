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
  hash,
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
  UsrInput,
  UsrModel,
  UsrSearch,
  UsrFieldComment,
} from "./usr.model.ts";

import * as orgDao from "/gen/base/org/org.dao.ts";

const route_path = "/base/usr";

async function getWhereQuery(
  args: QueryArgs,
  search?: UsrSearch,
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
  if (isNotEmpty(search?.id)) {
    whereQuery += ` and t.id = ${ args.push(search?.id) }`;
  }
  if (search?.ids && !Array.isArray(search?.ids)) {
    search.ids = [ search.ids ];
  }
  if (search?.ids && search?.ids.length > 0) {
    whereQuery += ` and t.id in ${ args.push(search.ids) }`;
  }
  if (search?.img !== undefined) {
    whereQuery += ` and t.img = ${ args.push(search.img) }`;
  }
  if (search?.img === null) {
    whereQuery += ` and t.img is null`;
  }
  if (isNotEmpty(search?.img_like)) {
    whereQuery += ` and t.img like ${ args.push(sqlLike(search?.img_like) + "%") }`;
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
  if (search?.username !== undefined) {
    whereQuery += ` and t.username = ${ args.push(search.username) }`;
  }
  if (search?.username === null) {
    whereQuery += ` and t.username is null`;
  }
  if (isNotEmpty(search?.username_like)) {
    whereQuery += ` and t.username like ${ args.push(sqlLike(search?.username_like) + "%") }`;
  }
  if (search?.default_org_id && !Array.isArray(search?.default_org_id)) {
    search.default_org_id = [ search.default_org_id ];
  }
  if (search?.default_org_id && search?.default_org_id.length > 0) {
    whereQuery += ` and default_org_id_lbl.id in ${ args.push(search.default_org_id) }`;
  }
  if (search?.default_org_id === null) {
    whereQuery += ` and default_org_id_lbl.id is null`;
  }
  if (search?.default_org_id_is_null) {
    whereQuery += ` and default_org_id_lbl.id is null`;
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
  if (search?.org_ids && !Array.isArray(search?.org_ids)) {
    search.org_ids = [ search.org_ids ];
  }
  if (search?.org_ids && search?.org_ids.length > 0) {
    whereQuery += ` and base_org.id in ${ args.push(search.org_ids) }`;
  }
  if (search?.org_ids === null) {
    whereQuery += ` and base_org.id is null`;
  }
  if (search?.org_ids_is_null) {
    whereQuery += ` and base_org.id is null`;
  }
  if (search?.dept_ids && !Array.isArray(search?.dept_ids)) {
    search.dept_ids = [ search.dept_ids ];
  }
  if (search?.dept_ids && search?.dept_ids.length > 0) {
    whereQuery += ` and base_dept.id in ${ args.push(search.dept_ids) }`;
  }
  if (search?.dept_ids === null) {
    whereQuery += ` and base_dept.id is null`;
  }
  if (search?.dept_ids_is_null) {
    whereQuery += ` and base_dept.id is null`;
  }
  if (search?.role_ids && !Array.isArray(search?.role_ids)) {
    search.role_ids = [ search.role_ids ];
  }
  if (search?.role_ids && search?.role_ids.length > 0) {
    whereQuery += ` and base_role.id in ${ args.push(search.role_ids) }`;
  }
  if (search?.role_ids === null) {
    whereQuery += ` and base_role.id is null`;
  }
  if (search?.role_ids_is_null) {
    whereQuery += ` and base_role.id is null`;
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
    base_usr t
    left join base_org default_org_id_lbl
      on default_org_id_lbl.id = t.default_org_id
    left join base_usr_org
      on base_usr_org.usr_id = t.id
      and base_usr_org.is_deleted = 0
    left join base_org
      on base_usr_org.org_id = base_org.id
      and base_org.is_deleted = 0
    left join (
      select
        json_objectagg(base_usr_org.order_by, base_org.id) org_ids,
        json_objectagg(base_usr_org.order_by, base_org.lbl) org_ids_lbl,
        base_usr.id usr_id
      from base_usr_org
      inner join base_org
        on base_org.id = base_usr_org.org_id
        and base_org.is_deleted = 0
      inner join base_usr
        on base_usr.id = base_usr_org.usr_id
      where
        base_usr_org.is_deleted = 0
      group by usr_id
    ) _org
      on _org.usr_id = t.id
    left join base_usr_dept
      on base_usr_dept.usr_id = t.id
      and base_usr_dept.is_deleted = 0
    left join base_dept
      on base_usr_dept.dept_id = base_dept.id
      and base_dept.is_deleted = 0
    left join (
      select
        json_objectagg(base_usr_dept.order_by, base_dept.id) dept_ids,
        json_objectagg(base_usr_dept.order_by, base_dept.lbl) dept_ids_lbl,
        base_usr.id usr_id
      from base_usr_dept
      inner join base_dept
        on base_dept.id = base_usr_dept.dept_id
        and base_dept.is_deleted = 0
      inner join base_usr
        on base_usr.id = base_usr_dept.usr_id
      where
        base_usr_dept.is_deleted = 0
      group by usr_id
    ) _dept
      on _dept.usr_id = t.id
    left join base_usr_role
      on base_usr_role.usr_id = t.id
      and base_usr_role.is_deleted = 0
    left join base_role
      on base_usr_role.role_id = base_role.id
      and base_role.is_deleted = 0
    left join (
      select
        json_objectagg(base_usr_role.order_by, base_role.id) role_ids,
        json_objectagg(base_usr_role.order_by, base_role.lbl) role_ids_lbl,
        base_usr.id usr_id
      from base_usr_role
      inner join base_role
        on base_role.id = base_usr_role.role_id
        and base_role.is_deleted = 0
      inner join base_usr
        on base_usr.id = base_usr_role.usr_id
      where
        base_usr_role.is_deleted = 0
      group by usr_id
    ) _role
      on _role.usr_id = t.id
  `;
  return fromQuery;
}

/**
 * 根据条件查找总数据数
 * @param { UsrSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: UsrSearch,
  options?: {
  },
): Promise<number> {
  const table = "base_usr";
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
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  interface Result {
    total: number,
  }
  const model = await queryOne<Result>(sql, args, { cacheKey1, cacheKey2 });
  let result = model?.total || 0;
  
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 * @param {UsrSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: UsrSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<UsrModel[]> {
  const table = "base_usr";
  const method = "findAll";
  
  const args = new QueryArgs();
  let sql = `
    select t.*
      ,default_org_id_lbl.lbl default_org_id_lbl
      ,max(org_ids) org_ids
      ,max(org_ids_lbl) org_ids_lbl
      ,max(dept_ids) dept_ids
      ,max(dept_ids_lbl) dept_ids_lbl
      ,max(role_ids) role_ids
      ,max(role_ids_lbl) role_ids_lbl
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
        prop: "update_time",
        order: SortOrderEnum.Desc,
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
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  const result = await query<UsrModel>(
    sql,
    args,
    {
      cacheKey1,
      cacheKey2,
    },
  );
  for (const item of result) {
    
    // 所属组织
    if (item.org_ids) {
      const obj = item.org_ids as unknown as {[key: string]: string};
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.org_ids = keys.map((key) => obj[key]);
    }
    if (item.org_ids_lbl) {
      const obj = item.org_ids_lbl as unknown as {[key: string]: string};
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.org_ids_lbl = keys.map((key) => obj[key]);
    }
    
    // 所属部门
    if (item.dept_ids) {
      const obj = item.dept_ids as unknown as {[key: string]: string};
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.dept_ids = keys.map((key) => obj[key]);
    }
    if (item.dept_ids_lbl) {
      const obj = item.dept_ids_lbl as unknown as {[key: string]: string};
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.dept_ids_lbl = keys.map((key) => obj[key]);
    }
    
    // 拥有角色
    if (item.role_ids) {
      const obj = item.role_ids as unknown as {[key: string]: string};
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.role_ids = keys.map((key) => obj[key]);
    }
    if (item.role_ids_lbl) {
      const obj = item.role_ids_lbl as unknown as {[key: string]: string};
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.role_ids_lbl = keys.map((key) => obj[key]);
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
    // 密码
    model.password = "";
    
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
  }
  
  return result;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments(): Promise<UsrFieldComment> {
  const n = initN(route_path);
  const fieldComments: UsrFieldComment = {
    id: await n("ID"),
    img: await n("头像"),
    lbl: await n("名称"),
    username: await n("用户名"),
    default_org_id: await n("默认组织"),
    default_org_id_lbl: await n("默认组织"),
    is_locked: await n("锁定"),
    is_locked_lbl: await n("锁定"),
    is_enabled: await n("启用"),
    is_enabled_lbl: await n("启用"),
    org_ids: await n("所属组织"),
    org_ids_lbl: await n("所属组织"),
    dept_ids: await n("所属部门"),
    dept_ids_lbl: await n("所属部门"),
    role_ids: await n("拥有角色"),
    role_ids_lbl: await n("拥有角色"),
    rem: await n("备注"),
  };
  return fieldComments;
}

/**
 * 通过唯一约束获得数据列表
 * @param {UsrSearch | PartialNull<UsrModel>} search0
 */
export async function findByUnique(
  search0: UsrSearch | PartialNull<UsrModel>,
  options?: {
  },
): Promise<UsrModel[]> {
  if (search0.id) {
    const model = await findOne({
      id: search0.id,
    });
    if (!model) {
      return [ ];
    }
    return [ model ];
  }
  const models: UsrModel[] = [ ];
  {
    if (search0.lbl == null) {
      return [ ];
    }
    const lbl = search0.lbl;
    const modelTmps = await findAll({
      lbl,
    });
    models.push(...modelTmps);
  }
  return models;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {UsrModel} oldModel
 * @param {PartialNull<UsrModel>} model
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: UsrModel,
  model: PartialNull<UsrModel>,
): boolean {
  if (!oldModel || !model) {
    return false;
  }
  if (
    oldModel.lbl === model.lbl
  ) {
    return true;
  }
  return false;
}

/**
 * 通过唯一约束检查数据是否已经存在
 * @param {UsrInput} model
 * @param {UsrModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<string>}
 */
export async function checkByUnique(
  model: UsrInput,
  oldModel: UsrModel,
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
 * @param {UsrSearch} search?
 */
export async function findOne(
  search?: UsrSearch,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<UsrModel | undefined> {
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
): Promise<UsrModel | undefined> {
  if (isEmpty(id)) {
    return;
  }
  const model = await findOne({ id });
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {UsrSearch} search?
 */
export async function exist(
  search?: UsrSearch,
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
  const table = "base_usr";
  const method = "existById";
  
  if (isEmpty(id)) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = `
    select
      1 e
    from
      base_usr t
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

/**
 * 增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: UsrInput,
) {
  const fieldComments = await getFieldComments();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 头像
  await validators.chars_max_length(
    input.img,
    22,
    fieldComments.img,
  );
  
  // 名称
  await validators.chars_max_length(
    input.lbl,
    45,
    fieldComments.lbl,
  );
  
  // 用户名
  await validators.chars_max_length(
    input.username,
    45,
    fieldComments.username,
  );
  
  // 默认组织
  await validators.chars_max_length(
    input.default_org_id,
    22,
    fieldComments.default_org_id,
  );
  
  // 备注
  await validators.chars_max_length(
    input.rem,
    100,
    fieldComments.rem,
  );
  
}

/**
 * 创建数据
 * @param {UsrInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<string>} 
 */
export async function create(
  input: UsrInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<string> {
  const table = "base_usr";
  const method = "create";
  
  const [
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await dictSrcDao.getDict([
    "is_locked",
    "is_enabled",
  ]);
  
  // 默认组织
  if (isNotEmpty(input.default_org_id_lbl) && input.default_org_id === undefined) {
    input.default_org_id_lbl = String(input.default_org_id_lbl).trim();
    const orgModel = await orgDao.findOne({ lbl: input.default_org_id_lbl });
    if (orgModel) {
      input.default_org_id = orgModel.id;
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
  
  // 所属组织
  if (!input.org_ids && input.org_ids_lbl) {
    if (typeof input.org_ids_lbl === "string" || input.org_ids_lbl instanceof String) {
      input.org_ids_lbl = input.org_ids_lbl.split(",");
    }
    input.org_ids_lbl = input.org_ids_lbl.map((item: string) => item.trim());
    const args = new QueryArgs();
    const sql = `
      select
        t.id
      from
        base_org t
      where
        t.lbl in ${ args.push(input.org_ids_lbl) }
    `;
    interface Result {
      id: string;
    }
    const models = await query<Result>(sql, args);
    input.org_ids = models.map((item: { id: string }) => item.id);
  }
  
  // 所属部门
  if (!input.dept_ids && input.dept_ids_lbl) {
    if (typeof input.dept_ids_lbl === "string" || input.dept_ids_lbl instanceof String) {
      input.dept_ids_lbl = input.dept_ids_lbl.split(",");
    }
    input.dept_ids_lbl = input.dept_ids_lbl.map((item: string) => item.trim());
    const args = new QueryArgs();
    const sql = `
      select
        t.id
      from
        base_dept t
      where
        t.lbl in ${ args.push(input.dept_ids_lbl) }
    `;
    interface Result {
      id: string;
    }
    const models = await query<Result>(sql, args);
    input.dept_ids = models.map((item: { id: string }) => item.id);
  }
  
  // 拥有角色
  if (!input.role_ids && input.role_ids_lbl) {
    if (typeof input.role_ids_lbl === "string" || input.role_ids_lbl instanceof String) {
      input.role_ids_lbl = input.role_ids_lbl.split(",");
    }
    input.role_ids_lbl = input.role_ids_lbl.map((item: string) => item.trim());
    const args = new QueryArgs();
    const sql = `
      select
        t.id
      from
        base_role t
      where
        t.lbl in ${ args.push(input.role_ids_lbl) }
    `;
    interface Result {
      id: string;
    }
    const models = await query<Result>(sql, args);
    input.role_ids = models.map((item: { id: string }) => item.id);
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
    insert into base_usr(
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
  if (input.img !== undefined) {
    sql += `,img`;
  }
  if (input.lbl !== undefined) {
    sql += `,lbl`;
  }
  if (input.username !== undefined) {
    sql += `,username`;
  }
  if (isNotEmpty(input.password)) {
    sql += `,password`;
  }
  if (input.default_org_id !== undefined) {
    sql += `,default_org_id`;
  }
  if (input.is_locked !== undefined) {
    sql += `,is_locked`;
  }
  if (input.is_enabled !== undefined) {
    sql += `,is_enabled`;
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
  if (input.img !== undefined) {
    sql += `,${ args.push(input.img) }`;
  }
  if (input.lbl !== undefined) {
    sql += `,${ args.push(input.lbl) }`;
  }
  if (input.username !== undefined) {
    sql += `,${ args.push(input.username) }`;
  }
  if (isNotEmpty(input.password)) {
    sql += `,${ args.push(await authDao.getPassword(input.password)) }`;
  }
  if (input.default_org_id !== undefined) {
    sql += `,${ args.push(input.default_org_id) }`;
  }
  if (input.is_locked !== undefined) {
    sql += `,${ args.push(input.is_locked) }`;
  }
  if (input.is_enabled !== undefined) {
    sql += `,${ args.push(input.is_enabled) }`;
  }
  if (input.rem !== undefined) {
    sql += `,${ args.push(input.rem) }`;
  }
  sql += `)`;
  
  const result = await execute(sql, args);
  
  // 所属组织
  await many2manyUpdate(
    input,
    "org_ids",
    {
      mod: "base",
      table: "usr_org",
      column1: "usr_id",
      column2: "org_id",
    },
  );
  
  // 所属部门
  await many2manyUpdate(
    input,
    "dept_ids",
    {
      mod: "base",
      table: "usr_dept",
      column1: "usr_id",
      column2: "dept_id",
    },
  );
  
  // 拥有角色
  await many2manyUpdate(
    input,
    "role_ids",
    {
      mod: "base",
      table: "usr_role",
      column1: "usr_id",
      column2: "role_id",
    },
  );
  
  await delCache();
  
  return input.id;
}

/**
 * 删除缓存
 */
export async function delCache() {
  const table = "base_usr";
  const method = "delCache";
  
  await delCacheCtx(`dao.sql.${ table }`);
  const foreignTables: string[] = [
    "base_org",
    "base_usr_dept",
    "base_dept",
    "base_usr_role",
    "base_role",
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
  const table = "base_usr";
  const method = "updateTenantById";
  
  const tenantExist = await tenantDao.existById(tenant_id);
  if (!tenantExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `
    update
      base_usr
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
 * 根据id修改一行数据
 * @param {string} id
 * @param {UsrInput} input
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
  input: UsrInput,
  options?: {
    uniqueType?: "ignore" | "throw" | "create";
  },
): Promise<string> {
  const table = "base_usr";
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
  
  // 默认组织
  if (isNotEmpty(input.default_org_id_lbl) && input.default_org_id === undefined) {
    input.default_org_id_lbl = String(input.default_org_id_lbl).trim();
    const orgModel = await orgDao.findOne({ lbl: input.default_org_id_lbl });
    if (orgModel) {
      input.default_org_id = orgModel.id;
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

  // 所属组织
  if (!input.org_ids && input.org_ids_lbl) {
    if (typeof input.org_ids_lbl === "string" || input.org_ids_lbl instanceof String) {
      input.org_ids_lbl = input.org_ids_lbl.split(",");
    }
    input.org_ids_lbl = input.org_ids_lbl.map((item: string) => item.trim());
    const args = new QueryArgs();
    const sql = `
      select
        t.id
      from
        base_org t
      where
        t.lbl in ${ args.push(input.org_ids_lbl) }
    `;
    interface Result {
      id: string;
    }
    const models = await query<Result>(sql, args);
    input.org_ids = models.map((item: { id: string }) => item.id);
  }

  // 所属部门
  if (!input.dept_ids && input.dept_ids_lbl) {
    if (typeof input.dept_ids_lbl === "string" || input.dept_ids_lbl instanceof String) {
      input.dept_ids_lbl = input.dept_ids_lbl.split(",");
    }
    input.dept_ids_lbl = input.dept_ids_lbl.map((item: string) => item.trim());
    const args = new QueryArgs();
    const sql = `
      select
        t.id
      from
        base_dept t
      where
        t.lbl in ${ args.push(input.dept_ids_lbl) }
    `;
    interface Result {
      id: string;
    }
    const models = await query<Result>(sql, args);
    input.dept_ids = models.map((item: { id: string }) => item.id);
  }

  // 拥有角色
  if (!input.role_ids && input.role_ids_lbl) {
    if (typeof input.role_ids_lbl === "string" || input.role_ids_lbl instanceof String) {
      input.role_ids_lbl = input.role_ids_lbl.split(",");
    }
    input.role_ids_lbl = input.role_ids_lbl.map((item: string) => item.trim());
    const args = new QueryArgs();
    const sql = `
      select
        t.id
      from
        base_role t
      where
        t.lbl in ${ args.push(input.role_ids_lbl) }
    `;
    interface Result {
      id: string;
    }
    const models = await query<Result>(sql, args);
    input.role_ids = models.map((item: { id: string }) => item.id);
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
    update base_usr set
  `;
  let updateFldNum = 0;
  if (input.img !== undefined) {
    if (input.img != oldModel.img) {
      sql += `img = ${ args.push(input.img) },`;
      updateFldNum++;
    }
  }
  if (input.lbl !== undefined) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl = ${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  if (input.username !== undefined) {
    if (input.username != oldModel.username) {
      sql += `username = ${ args.push(input.username) },`;
      updateFldNum++;
    }
  }
  if (isNotEmpty(input.password)) {
    sql += `password = ?,`;
    args.push(await authDao.getPassword(input.password));
    updateFldNum++;
  }
  if (input.default_org_id !== undefined) {
    if (input.default_org_id != oldModel.default_org_id) {
      sql += `default_org_id = ${ args.push(input.default_org_id) },`;
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
  
  // 所属组织
  await many2manyUpdate(
    {
      ...input,
      id,
    },
    "org_ids",
    {
      mod: "base",
      table: "usr_org",
      column1: "usr_id",
      column2: "org_id",
    },
  );
  
  updateFldNum++;
  
  // 所属部门
  await many2manyUpdate(
    {
      ...input,
      id,
    },
    "dept_ids",
    {
      mod: "base",
      table: "usr_dept",
      column1: "usr_id",
      column2: "dept_id",
    },
  );
  
  updateFldNum++;
  
  // 拥有角色
  await many2manyUpdate(
    {
      ...input,
      id,
    },
    "role_ids",
    {
      mod: "base",
      table: "usr_role",
      column1: "usr_id",
      column2: "role_id",
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
  const table = "base_usr";
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
        base_usr
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
  const table = "base_usr";
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
      base_usr
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
  const table = "base_usr";
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
      base_usr
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
  const table = "base_usr";
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
        base_usr
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
  const table = "base_usr";
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
          base_usr
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `
      delete from
        base_usr
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
