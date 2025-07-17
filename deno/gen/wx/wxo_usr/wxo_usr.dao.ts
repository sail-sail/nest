// deno-lint-ignore-file prefer-const no-unused-vars ban-types
import {
  get_is_debug,
  get_is_silent_mode,
  get_is_creating,
} from "/lib/context.ts";

import {
  escapeId,
} from "sqlstring";

import dayjs from "dayjs";

import {
  getDebugSearch,
  splitCreateArr,
  FIND_ALL_IDS_LIMIT,
} from "/lib/util/dao_util.ts";

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
  getParsedEnv,
} from "/lib/env.ts";

import {
  isNotEmpty,
  isEmpty,
  sqlLike,
  shortUuidV4,
  hash,
} from "/lib/util/string_util.ts";

import * as validators from "/lib/validators/mod.ts";

import {
  getDict,
} from "/src/base/dict_detail/dict_detail.dao.ts";

import { UniqueException } from "/lib/exceptions/unique.execption.ts";

import {
  get_usr_id,
} from "/lib/auth/auth.dao.ts";

import {
  getTenant_id,
} from "/src/base/usr/usr.dao.ts";

import {
  existByIdTenant,
} from "/gen/base/tenant/tenant.dao.ts";

import {
  UniqueType,
  SortOrderEnum,
} from "/gen/types.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import {
  findOneUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<WxoUsrSearch>,
  options?: {
  },
): Promise<string> {
  
  let whereQuery = "";
  whereQuery += ` t.is_deleted=${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;
  
  if (search?.tenant_id == null) {
    const usr_id = await get_usr_id();
    const tenant_id = await getTenant_id(usr_id);
    if (tenant_id) {
      whereQuery += ` and t.tenant_id=${ args.push(tenant_id) }`;
    }
  } else if (search?.tenant_id != null && search?.tenant_id !== "-") {
    whereQuery += ` and t.tenant_id=${ args.push(search.tenant_id) }`;
  }
  if (search?.id != null) {
    whereQuery += ` and t.id=${ args.push(search?.id) }`;
  }
  if (search?.ids != null) {
    whereQuery += ` and t.id in (${ args.push(search.ids) })`;
  }
  if (search?.lbl != null) {
    whereQuery += ` and t.lbl=${ args.push(search.lbl) }`;
  }
  if (isNotEmpty(search?.lbl_like)) {
    whereQuery += ` and t.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") }`;
  }
  if (search?.head_img != null) {
    whereQuery += ` and t.head_img=${ args.push(search.head_img) }`;
  }
  if (isNotEmpty(search?.head_img_like)) {
    whereQuery += ` and t.head_img like ${ args.push("%" + sqlLike(search?.head_img_like) + "%") }`;
  }
  if (search?.usr_id != null) {
    whereQuery += ` and t.usr_id in (${ args.push(search.usr_id) })`;
  }
  if (search?.usr_id_is_null) {
    whereQuery += ` and t.usr_id is null`;
  }
  if (search?.usr_id_lbl != null) {
    whereQuery += ` and usr_id_lbl.lbl in (${ args.push(search.usr_id_lbl) })`;
  }
  if (isNotEmpty(search?.usr_id_lbl_like)) {
    whereQuery += ` and usr_id_lbl.lbl like ${ args.push("%" + sqlLike(search?.usr_id_lbl_like) + "%") }`;
  }
  if (search?.appid != null) {
    whereQuery += ` and t.appid=${ args.push(search.appid) }`;
  }
  if (isNotEmpty(search?.appid_like)) {
    whereQuery += ` and t.appid like ${ args.push("%" + sqlLike(search?.appid_like) + "%") }`;
  }
  if (search?.openid != null) {
    whereQuery += ` and t.openid=${ args.push(search.openid) }`;
  }
  if (isNotEmpty(search?.openid_like)) {
    whereQuery += ` and t.openid like ${ args.push("%" + sqlLike(search?.openid_like) + "%") }`;
  }
  if (search?.unionid != null) {
    whereQuery += ` and t.unionid=${ args.push(search.unionid) }`;
  }
  if (isNotEmpty(search?.unionid_like)) {
    whereQuery += ` and t.unionid like ${ args.push("%" + sqlLike(search?.unionid_like) + "%") }`;
  }
  if (search?.sex != null) {
    whereQuery += ` and t.sex in (${ args.push(search.sex) })`;
  }
  if (search?.province != null) {
    whereQuery += ` and t.province=${ args.push(search.province) }`;
  }
  if (isNotEmpty(search?.province_like)) {
    whereQuery += ` and t.province like ${ args.push("%" + sqlLike(search?.province_like) + "%") }`;
  }
  if (search?.city != null) {
    whereQuery += ` and t.city=${ args.push(search.city) }`;
  }
  if (isNotEmpty(search?.city_like)) {
    whereQuery += ` and t.city like ${ args.push("%" + sqlLike(search?.city_like) + "%") }`;
  }
  if (search?.country != null) {
    whereQuery += ` and t.country=${ args.push(search.country) }`;
  }
  if (isNotEmpty(search?.country_like)) {
    whereQuery += ` and t.country like ${ args.push("%" + sqlLike(search?.country_like) + "%") }`;
  }
  if (search?.privilege != null) {
    whereQuery += ` and t.privilege=${ args.push(search.privilege) }`;
  }
  if (isNotEmpty(search?.privilege_like)) {
    whereQuery += ` and t.privilege like ${ args.push("%" + sqlLike(search?.privilege_like) + "%") }`;
  }
  if (search?.rem != null) {
    whereQuery += ` and t.rem=${ args.push(search.rem) }`;
  }
  if (isNotEmpty(search?.rem_like)) {
    whereQuery += ` and t.rem like ${ args.push("%" + sqlLike(search?.rem_like) + "%") }`;
  }
  if (search?.create_usr_id != null) {
    whereQuery += ` and t.create_usr_id in (${ args.push(search.create_usr_id) })`;
  }
  if (search?.create_usr_id_is_null) {
    whereQuery += ` and t.create_usr_id is null`;
  }
  if (search?.create_usr_id_lbl != null) {
    whereQuery += ` and t.create_usr_id_lbl in (${ args.push(search.create_usr_id_lbl) })`;
  }
  if (isNotEmpty(search?.create_usr_id_lbl_like)) {
    whereQuery += ` and t.create_usr_id_lbl like ${ args.push("%" + sqlLike(search.create_usr_id_lbl_like) + "%") }`;
  }
  if (search?.create_time != null) {
    if (search.create_time[0] != null) {
      whereQuery += ` and t.create_time>=${ args.push(search.create_time[0]) }`;
    }
    if (search.create_time[1] != null) {
      whereQuery += ` and t.create_time<=${ args.push(search.create_time[1]) }`;
    }
  }
  if (search?.update_usr_id != null) {
    whereQuery += ` and t.update_usr_id in (${ args.push(search.update_usr_id) })`;
  }
  if (search?.update_usr_id_is_null) {
    whereQuery += ` and t.update_usr_id is null`;
  }
  if (search?.update_usr_id_lbl != null) {
    whereQuery += ` and t.update_usr_id_lbl in (${ args.push(search.update_usr_id_lbl) })`;
  }
  if (isNotEmpty(search?.update_usr_id_lbl_like)) {
    whereQuery += ` and t.update_usr_id_lbl like ${ args.push("%" + sqlLike(search.update_usr_id_lbl_like) + "%") }`;
  }
  if (search?.update_time != null) {
    if (search.update_time[0] != null) {
      whereQuery += ` and t.update_time>=${ args.push(search.update_time[0]) }`;
    }
    if (search.update_time[1] != null) {
      whereQuery += ` and t.update_time<=${ args.push(search.update_time[1]) }`;
    }
  }
  return whereQuery;
}

// deno-lint-ignore require-await
async function getFromQuery(
  args: QueryArgs,
  search?: Readonly<WxoUsrSearch>,
  options?: {
  },
) {
  let fromQuery = `wx_wxo_usr t
  left join base_usr usr_id_lbl on usr_id_lbl.id=t.usr_id`;
  return fromQuery;
}

// MARK: findCountWxoUsr
/** 根据条件查找公众号用户总数 */
export async function findCountWxoUsr(
  search?: Readonly<WxoUsrSearch>,
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<number> {
  
  const table = "wx_wxo_usr";
  const method = "findCountWxoUsr";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ method }:`;
    if (search) {
      msg += ` search:${ getDebugSearch(search) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (search?.id === "") {
    return 0;
  }
  if (search && search.ids && search.ids.length === 0) {
    return 0;
  }
  // 绑定用户
  if (search && search.usr_id != null) {
    const len = search.usr_id.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.usr_id.length > ${ ids_limit }`);
    }
  }
  // 性别
  if (search && search.sex != null) {
    const len = search.sex.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.sex.length > ${ ids_limit }`);
    }
  }
  // 创建人
  if (search && search.create_usr_id != null) {
    const len = search.create_usr_id.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.create_usr_id.length > ${ ids_limit }`);
    }
  }
  // 更新人
  if (search && search.update_usr_id != null) {
    const len = search.update_usr_id.length;
    if (len === 0) {
      return 0;
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.update_usr_id.length > ${ ids_limit }`);
    }
  }
  
  const args = new QueryArgs();
  let sql = `select count(1) total from (select 1 from ${ await getFromQuery(args, search, options) }`;
  const whereQuery = await getWhereQuery(args, search, options);
  if (isNotEmpty(whereQuery)) {
    sql += ` where ${ whereQuery }`;
  }
  sql += ` group by t.id) t`;
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  interface Result {
    total: number,
  }
  const model = await queryOne<Result>(sql, args, { cacheKey1, cacheKey2 });
  let result = Number(model?.total || 0);
  
  return result;
}

// MARK: findAllWxoUsr
/** 根据搜索条件和分页查找公众号用户列表 */
export async function findAllWxoUsr(
  search?: Readonly<WxoUsrSearch>,
  page?: Readonly<PageInput>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
    ids_limit?: number;
  },
): Promise<WxoUsrModel[]> {
  
  const table = "wx_wxo_usr";
  const method = "findAllWxoUsr";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search) {
      msg += ` search:${ getDebugSearch(search) }`;
    }
    if (page && Object.keys(page).length > 0) {
      msg += ` page:${ JSON.stringify(page) }`;
    }
    if (sort && Object.keys(sort).length > 0) {
      msg += ` sort:${ JSON.stringify(sort) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (search?.id === "") {
    return [ ];
  }
  if (search && search.ids && search.ids.length === 0) {
    return [ ];
  }
  // 绑定用户
  if (search && search.usr_id != null) {
    const len = search.usr_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.usr_id.length > ${ ids_limit }`);
    }
  }
  // 性别
  if (search && search.sex != null) {
    const len = search.sex.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.sex.length > ${ ids_limit }`);
    }
  }
  // 创建人
  if (search && search.create_usr_id != null) {
    const len = search.create_usr_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.create_usr_id.length > ${ ids_limit }`);
    }
  }
  // 更新人
  if (search && search.update_usr_id != null) {
    const len = search.update_usr_id.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.update_usr_id.length > ${ ids_limit }`);
    }
  }
  
  const args = new QueryArgs();
  let sql = `select f.* from (select t.*
      ,usr_id_lbl.lbl usr_id_lbl
    from
      ${ await getFromQuery(args, search, options) }
  `;
  const whereQuery = await getWhereQuery(args, search, options);
  if (isNotEmpty(whereQuery)) {
    sql += ` where ${ whereQuery }`;
  }
  sql += ` group by t.id`;
  
  sort = sort ?? [ ];
  sort = sort.filter((item) => item.prop);
  
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
  sql += `) f`;
  
  // 分页
  if (page?.pgSize) {
    sql += ` limit ${ Number(page?.pgOffset) || 0 },${ Number(page.pgSize) }`;
  }
  
  // 缓存
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const result = await query<WxoUsrModel>(
    sql,
    args,
    {
      cacheKey1,
      cacheKey2,
      debug: is_debug_sql,
    },
  );
  
  const [
    sexDict, // 性别
  ] = await getDict([
    "wx_usr_gender",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 绑定用户
    model.usr_id_lbl = model.usr_id_lbl || "";
    
    // 性别
    let sex_lbl = model.sex?.toString() || "";
    if (model.sex != null) {
      const dictItem = sexDict.find((dictItem) => dictItem.val === String(model.sex));
      if (dictItem) {
        sex_lbl = dictItem.lbl;
      }
    }
    model.sex_lbl = sex_lbl || "";
    
    // 创建时间
    if (model.create_time) {
      const create_time = dayjs(model.create_time);
      if (create_time.isValid()) {
        model.create_time = create_time.format("YYYY-MM-DDTHH:mm:ss");
        model.create_time_lbl = create_time.format("YYYY-MM-DD HH:mm:ss");
      } else {
        model.create_time_lbl = (model.create_time || "").toString();
      }
    } else {
      model.create_time_lbl = "";
    }
    
    // 更新时间
    if (model.update_time) {
      const update_time = dayjs(model.update_time);
      if (update_time.isValid()) {
        model.update_time = update_time.format("YYYY-MM-DDTHH:mm:ss");
        model.update_time_lbl = update_time.format("YYYY-MM-DD HH:mm:ss");
      } else {
        model.update_time_lbl = (model.update_time || "").toString();
      }
    } else {
      model.update_time_lbl = "";
    }
  }
  
  return result;
}

// MARK: setIdByLblWxoUsr
/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLblWxoUsr(
  input: WxoUsrInput,
) {
  
  const options = {
    is_debug: false,
  };
  
  const [
    sexDict, // 性别
  ] = await getDict([
    "wx_usr_gender",
  ]);
  
  // 绑定用户
  if (isNotEmpty(input.usr_id_lbl) && input.usr_id == null) {
    input.usr_id_lbl = String(input.usr_id_lbl).trim();
    const usrModel = await findOneUsr(
      {
        lbl: input.usr_id_lbl,
      },
      undefined,
      options,
    );
    if (usrModel) {
      input.usr_id = usrModel.id;
    }
  } else if (isEmpty(input.usr_id_lbl) && input.usr_id != null) {
    const usr_model = await findOneUsr(
      {
        id: input.usr_id,
      },
      undefined,
      options,
    );
    if (usr_model) {
      input.usr_id_lbl = usr_model.lbl;
    }
  }
  
  // 性别
  if (isNotEmpty(input.sex_lbl) && input.sex == null) {
    const val = sexDict.find((itemTmp) => itemTmp.lbl === input.sex_lbl)?.val;
    if (val != null) {
      input.sex = Number(val);
    }
  } else if (isEmpty(input.sex_lbl) && input.sex != null) {
    const lbl = sexDict.find((itemTmp) => itemTmp.val === String(input.sex))?.lbl || "";
    input.sex_lbl = lbl;
  }
}

// MARK: getFieldCommentsWxoUsr
/** 获取公众号用户字段注释 */
export async function getFieldCommentsWxoUsr(): Promise<WxoUsrFieldComment> {
  const fieldComments: WxoUsrFieldComment = {
    id: "ID",
    lbl: "昵称",
    head_img: "头像",
    usr_id: "绑定用户",
    usr_id_lbl: "绑定用户",
    appid: "开发者ID",
    openid: "公众号用户唯一标识",
    unionid: "用户统一标识",
    sex: "性别",
    sex_lbl: "性别",
    province: "省份",
    city: "城市",
    country: "国家",
    rem: "备注",
    create_usr_id: "创建人",
    create_usr_id_lbl: "创建人",
    create_time: "创建时间",
    create_time_lbl: "创建时间",
    update_usr_id: "更新人",
    update_usr_id_lbl: "更新人",
    update_time: "更新时间",
    update_time_lbl: "更新时间",
  };
  return fieldComments;
}

// MARK: findByUniqueWxoUsr
/** 通过唯一约束获得公众号用户列表 */
export async function findByUniqueWxoUsr(
  search0: Readonly<WxoUsrInput>,
  options?: {
    is_debug?: boolean;
  },
): Promise<WxoUsrModel[]> {
  
  const table = "wx_wxo_usr";
  const method = "findByUniqueWxoUsr";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search0) {
      msg += ` search0:${ getDebugSearch(search0) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (search0.id) {
    const model = await findOneWxoUsr(
      {
        id: search0.id,
      },
      undefined,
      options,
    );
    if (!model) {
      return [ ];
    }
    return [ model ];
  }
  const models: WxoUsrModel[] = [ ];
  {
    if (search0.openid == null) {
      return [ ];
    }
    const openid = search0.openid;
    const modelTmps = await findAllWxoUsr(
      {
        openid,
      },
      undefined,
      undefined,
      options,
    );
    models.push(...modelTmps);
  }
  
  return models;
}

/** 根据唯一约束对比对象是否相等 */
export function equalsByUniqueWxoUsr(
  oldModel: Readonly<WxoUsrModel>,
  input: Readonly<WxoUsrInput>,
): boolean {
  
  if (!oldModel || !input) {
    return false;
  }
  if (
    oldModel.openid === input.openid
  ) {
    return true;
  }
  return false;
}

// MARK: checkByUniqueWxoUsr
/** 通过唯一约束检查 公众号用户 是否已经存在 */
export async function checkByUniqueWxoUsr(
  input: Readonly<WxoUsrInput>,
  oldModel: Readonly<WxoUsrModel>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: {
    is_debug?: boolean;
  },
): Promise<WxoUsrId | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const isEquals = equalsByUniqueWxoUsr(oldModel, input);
  
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException("此 公众号用户 已经存在");
    }
    if (uniqueType === UniqueType.Update) {
      const id: WxoUsrId = await updateByIdWxoUsr(
        oldModel.id,
        {
          ...input,
          id: undefined,
        },
        options,
      );
      return id;
    }
    if (uniqueType === UniqueType.Ignore) {
      return;
    }
  }
  return;
}

// MARK: findOneWxoUsr
/** 根据条件查找第一公众号用户 */
export async function findOneWxoUsr(
  search?: Readonly<WxoUsrSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<WxoUsrModel | undefined> {
  
  const table = "wx_wxo_usr";
  const method = "findOneWxoUsr";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search) {
      msg += ` search:${ getDebugSearch(search) }`;
    }
    if (sort) {
      msg += ` sort:${ JSON.stringify(sort) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  
  const wxo_usr_models = await findAllWxoUsr(
    search,
    page,
    sort,
    options,
  );
  
  const wxo_usr_model = wxo_usr_models[0];
  
  return wxo_usr_model;
}

// MARK: findOneOkWxoUsr
/** 根据条件查找第一公众号用户, 如果不存在则抛错 */
export async function findOneOkWxoUsr(
  search?: Readonly<WxoUsrSearch>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
  },
): Promise<WxoUsrModel> {
  
  const table = "wx_wxo_usr";
  const method = "findOneOkWxoUsr";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search) {
      msg += ` search:${ getDebugSearch(search) }`;
    }
    if (sort) {
      msg += ` sort:${ JSON.stringify(sort) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  
  const wxo_usr_models = await findAllWxoUsr(
    search,
    page,
    sort,
    options,
  );
  
  const wxo_usr_model = wxo_usr_models[0];
  
  if (!wxo_usr_model) {
    const err_msg = "此 公众号用户 已被删除";
    throw new Error(err_msg);
  }
  
  return wxo_usr_model;
}

// MARK: findByIdWxoUsr
/** 根据 id 查找公众号用户 */
export async function findByIdWxoUsr(
  id: WxoUsrId,
  options?: {
    is_debug?: boolean;
  },
): Promise<WxoUsrModel | undefined> {
  
  const table = "wx_wxo_usr";
  const method = "findByIdWxoUsr";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (id) {
      msg += ` id:${ id }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!id) {
    return;
  }
  
  const wxo_usr_model = await findOneWxoUsr(
    {
      id,
    },
    undefined,
    options,
  );
  
  return wxo_usr_model;
}

// MARK: findByIdOkWxoUsr
/** 根据 id 查找公众号用户, 如果不存在则抛错 */
export async function findByIdOkWxoUsr(
  id: WxoUsrId,
  options?: {
    is_debug?: boolean;
  },
): Promise<WxoUsrModel> {
  
  const table = "wx_wxo_usr";
  const method = "findByIdOkWxoUsr";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (id) {
      msg += ` id:${ id }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  const wxo_usr_model = await findByIdWxoUsr(
    id,
    options,
  );
  
  if (!wxo_usr_model) {
    const err_msg = "此 公众号用户 已被删除";
    console.error(`${ err_msg } id: ${ id }`);
    throw new Error(err_msg);
  }
  
  return wxo_usr_model;
}

// MARK: findByIdsWxoUsr
/** 根据 ids 查找公众号用户 */
export async function findByIdsWxoUsr(
  ids: WxoUsrId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<WxoUsrModel[]> {
  
  const table = "wx_wxo_usr";
  const method = "findByIdsWxoUsr";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ ids }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!ids || ids.length === 0) {
    return [ ];
  }
  
  const models = await findAllWxoUsr(
    {
      ids,
    },
    undefined,
    undefined,
    options,
  );
  
  const models2 = ids
    .map((id) => models.find((item) => item.id === id))
    .filter((item) => !!item);
  
  return models2;
}

// MARK: findByIdsOkWxoUsr
/** 根据 ids 查找公众号用户, 出现查询不到的 id 则报错 */
export async function findByIdsOkWxoUsr(
  ids: WxoUsrId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<WxoUsrModel[]> {
  
  const table = "wx_wxo_usr";
  const method = "findByIdsOkWxoUsr";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ ids }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  const models = await findByIdsWxoUsr(
    ids,
    options,
  );
  
  if (models.length !== ids.length) {
    const err_msg = "此 公众号用户 已被删除";
    throw err_msg;
  }
  
  const models2 = ids.map((id) => {
    const model = models.find((item) => item.id === id);
    if (!model) {
      const err_msg = "此 公众号用户 已被删除";
      throw err_msg;
    }
    return model;
  });
  
  return models2;
}

// MARK: existWxoUsr
/** 根据搜索条件判断公众号用户是否存在 */
export async function existWxoUsr(
  search?: Readonly<WxoUsrSearch>,
  options?: {
    is_debug?: boolean;
  },
): Promise<boolean> {
  
  const table = "wx_wxo_usr";
  const method = "existWxoUsr";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (search) {
      msg += ` search:${ getDebugSearch(search) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  const model = await findOneWxoUsr(search, undefined, options);
  const exist = !!model;
  
  return exist;
}

// MARK: existByIdWxoUsr
/** 根据id判断公众号用户是否存在 */
export async function existByIdWxoUsr(
  id?: Readonly<WxoUsrId | null>,
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = "wx_wxo_usr";
  const method = "existByIdWxoUsr";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (id == null) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = `select 1 e from wx_wxo_usr t where t.id=${ args.push(id) } and t.is_deleted = 0 limit 1`;
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  const queryOptions = {
    cacheKey1,
    cacheKey2,
  };
  
  interface Result {
    e: number,
  }
  const model = await queryOne<Result>(
    sql,
    args,
    queryOptions,
  );
  const result = !!model?.e;
  
  return result;
}

// MARK: validateOptionWxoUsr
/** 校验公众号用户是否存在 */
export async function validateOptionWxoUsr(
  model?: WxoUsrModel,
) {
  if (!model) {
    const err_msg = "公众号用户 不存在";
    error(new Error(err_msg));
    throw err_msg;
  }
  return model;
}

// MARK: validateWxoUsr
/** 公众号用户增加和修改时校验输入 */
export async function validateWxoUsr(
  input: Readonly<WxoUsrInput>,
) {
  const fieldComments = await getFieldCommentsWxoUsr();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 昵称
  await validators.chars_max_length(
    input.lbl,
    100,
    fieldComments.lbl,
  );
  
  // 头像
  await validators.chars_max_length(
    input.head_img,
    22,
    fieldComments.head_img,
  );
  
  // 绑定用户
  await validators.chars_max_length(
    input.usr_id,
    22,
    fieldComments.usr_id,
  );
  
  // 开发者ID
  await validators.chars_max_length(
    input.appid,
    22,
    fieldComments.appid,
  );
  
  // 公众号用户唯一标识
  await validators.chars_max_length(
    input.openid,
    100,
    fieldComments.openid,
  );
  
  // 用户统一标识
  await validators.chars_max_length(
    input.unionid,
    100,
    fieldComments.unionid,
  );
  
  // 省份
  await validators.chars_max_length(
    input.province,
    10,
    fieldComments.province,
  );
  
  // 城市
  await validators.chars_max_length(
    input.city,
    10,
    fieldComments.city,
  );
  
  // 国家
  await validators.chars_max_length(
    input.country,
    10,
    fieldComments.country,
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

// MARK: createReturnWxoUsr
/** 创建 公众号用户 并返回 */
export async function createReturnWxoUsr(
  input: Readonly<WxoUsrInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxoUsrModel> {
  
  const table = "wx_wxo_usr";
  const method = "createReturnWxoUsr";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (input) {
      msg += ` input:${ JSON.stringify(input) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!input) {
    throw new Error(`input is required in dao: ${ table }`);
  }
  
  const [
    id,
  ] = await _creates([ input ], options);
  
  const model = await validateOptionWxoUsr(
    await findOneWxoUsr(
      {
        id,
      },
      undefined,
      options,
    ),
  );
  
  return model;
}

// MARK: createWxoUsr
/** 创建 公众号用户 */
export async function createWxoUsr(
  input: Readonly<WxoUsrInput>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxoUsrId> {
  
  const table = "wx_wxo_usr";
  const method = "createWxoUsr";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (input) {
      msg += ` input:${ JSON.stringify(input) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!input) {
    throw new Error(`input is required in dao: ${ table }`);
  }
  
  const [
    id,
  ] = await _creates([ input ], options);
  
  return id;
}

// MARK: createsReturnWxoUsr
/** 批量创建 公众号用户 并返回 */
export async function createsReturnWxoUsr(
  inputs: WxoUsrInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxoUsrModel[]> {
  
  const table = "wx_wxo_usr";
  const method = "createsReturnWxoUsr";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (inputs) {
      msg += ` inputs:${ JSON.stringify(inputs) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  const ids = await _creates(inputs, options);
  
  const models = await findByIdsWxoUsr(ids, options);
  
  return models;
}

// MARK: createsWxoUsr
/** 批量创建 公众号用户 */
export async function createsWxoUsr(
  inputs: WxoUsrInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxoUsrId[]> {
  
  const table = "wx_wxo_usr";
  const method = "createsWxoUsr";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (inputs) {
      msg += ` inputs:${ JSON.stringify(inputs) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  const ids = await _creates(inputs, options);
  
  return ids;
}

async function _creates(
  inputs: WxoUsrInput[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<WxoUsrId[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }
  
  const table = "wx_wxo_usr";
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  
  const ids2: WxoUsrId[] = [ ];
  const inputs2: WxoUsrInput[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUniqueWxoUsr(input, options);
    if (oldModels.length > 0) {
      let id: WxoUsrId | undefined = undefined;
      for (const oldModel of oldModels) {
        id = await checkByUniqueWxoUsr(
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
        ids2.push(id);
        continue;
      }
      inputs2.push(input);
    } else {
      inputs2.push(input);
    }
    
    const id = shortUuidV4<WxoUsrId>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  await delCacheWxoUsr();
  
  const args = new QueryArgs();
  let sql = "insert into wx_wxo_usr(id,create_time,update_time,tenant_id,create_usr_id,create_usr_id_lbl,update_usr_id,update_usr_id_lbl,lbl,head_img,usr_id,appid,openid,unionid,sex,province,city,country,privilege,rem)values";
  
  const inputs2Arr = splitCreateArr(inputs2);
  for (const inputs2 of inputs2Arr) {
    for (let i = 0; i < inputs2.length; i++) {
      const input = inputs2[i];
      sql += `(${ args.push(input.id) }`;
      if (!is_silent_mode) {
        if (input.create_time != null || input.create_time_save_null) {
          sql += `,${ args.push(input.create_time) }`;
        } else {
          sql += `,${ args.push(reqDate()) }`;
        }
      } else {
        if (input.create_time != null || input.create_time_save_null) {
          sql += `,${ args.push(input.create_time) }`;
        } else {
          sql += `,null`;
        }
      }
      if (input.update_time != null || input.update_time_save_null) {
        sql += `,${ args.push(input.update_time) }`;
      } else {
        sql += `,null`;
      }
      if (input.tenant_id == null) {
        const usr_id = await get_usr_id();
        const tenant_id = await getTenant_id(usr_id);
        if (tenant_id) {
          sql += `,${ args.push(tenant_id) }`;
        } else {
          sql += ",default";
        }
      } else if (input.tenant_id as unknown as string === "-") {
        sql += ",default";
      } else {
        sql += `,${ args.push(input.tenant_id) }`;
      }
      if (!is_silent_mode) {
        if (input.create_usr_id == null) {
          let usr_id = await get_usr_id();
          let usr_lbl = "";
          if (usr_id) {
            const usr_model = await findByIdUsr(usr_id, options);
            if (!usr_model) {
              usr_id = undefined;
            } else {
              usr_lbl = usr_model.lbl;
            }
          }
          if (usr_id != null) {
            sql += `,${ args.push(usr_id) }`;
          } else {
            sql += ",default";
          }
          sql += `,${ args.push(usr_lbl) }`;
        } else if (input.create_usr_id as unknown as string === "-") {
          sql += ",default";
          sql += ",default";
        } else {
          let usr_id: UsrId | undefined = input.create_usr_id;
          let usr_lbl = "";
          const usr_model = await findByIdUsr(usr_id, options);
          if (!usr_model) {
            usr_id = undefined;
            usr_lbl = "";
          } else {
            usr_lbl = usr_model.lbl;
          }
          if (usr_id) {
            sql += `,${ args.push(usr_id) }`;
          } else {
            sql += ",default";
          }
          sql += `,${ args.push(usr_lbl) }`;
        }
      } else {
        if (input.create_usr_id == null) {
          sql += ",default";
        } else {
          sql += `,${ args.push(input.create_usr_id) }`;
        }
        if (input.create_usr_id_lbl == null) {
          sql += ",default";
        } else {
          sql += `,${ args.push(input.create_usr_id_lbl) }`;
        }
      }
      if (input.update_usr_id != null) {
        sql += `,${ args.push(input.update_usr_id) }`;
      } else {
        sql += ",default";
      }
      if (input.update_usr_id_lbl != null) {
        sql += `,${ args.push(input.update_usr_id_lbl) }`;
      } else {
        sql += ",default";
      }
      if (input.lbl != null) {
        sql += `,${ args.push(input.lbl) }`;
      } else {
        sql += ",default";
      }
      if (input.head_img != null) {
        sql += `,${ args.push(input.head_img) }`;
      } else {
        sql += ",default";
      }
      if (input.usr_id != null) {
        sql += `,${ args.push(input.usr_id) }`;
      } else {
        sql += ",default";
      }
      if (input.appid != null) {
        sql += `,${ args.push(input.appid) }`;
      } else {
        sql += ",default";
      }
      if (input.openid != null) {
        sql += `,${ args.push(input.openid) }`;
      } else {
        sql += ",default";
      }
      if (input.unionid != null) {
        sql += `,${ args.push(input.unionid) }`;
      } else {
        sql += ",default";
      }
      if (input.sex != null) {
        sql += `,${ args.push(input.sex) }`;
      } else {
        sql += ",default";
      }
      if (input.province != null) {
        sql += `,${ args.push(input.province) }`;
      } else {
        sql += ",default";
      }
      if (input.city != null) {
        sql += `,${ args.push(input.city) }`;
      } else {
        sql += ",default";
      }
      if (input.country != null) {
        sql += `,${ args.push(input.country) }`;
      } else {
        sql += ",default";
      }
      if (input.privilege != null) {
        sql += `,${ args.push(input.privilege) }`;
      } else {
        sql += ",default";
      }
      if (input.rem != null) {
        sql += `,${ args.push(input.rem) }`;
      } else {
        sql += ",default";
      }
      sql += ")";
      if (i !== inputs2.length - 1) {
        sql += ",";
      }
    }
  }
  
  const res = await execute(sql, args, {
    debug: is_debug_sql,
  });
  const affectedRows = res.affectedRows;
  
  if (affectedRows !== inputs2.length) {
    throw new Error(`affectedRows: ${ affectedRows } != ${ inputs2.length }`);
  }
  
  await delCacheWxoUsr();
  
  return ids2;
}

// MARK: delCacheWxoUsr
/** 删除缓存 */
export async function delCacheWxoUsr() {
  await delCacheCtx(`dao.sql.wx_wxo_usr`);
}

// MARK: updateTenantByIdWxoUsr
/** 公众号用户 根据 id 修改 租户id */
export async function updateTenantByIdWxoUsr(
  id: WxoUsrId,
  tenant_id: Readonly<TenantId>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "wx_wxo_usr";
  const method = "updateTenantByIdWxoUsr";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (id) {
      msg += ` id:${ id } `;
    }
    if (tenant_id) {
      msg += ` tenant_id:${ tenant_id }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  const tenantExist = await existByIdTenant(tenant_id, options);
  if (!tenantExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `update wx_wxo_usr set tenant_id=${ args.push(tenant_id) } where id=${ args.push(id) }`;
  const res = await execute(sql, args);
  const affectedRows = res.affectedRows;
  
  await delCacheWxoUsr();
  return affectedRows;
}

// MARK: updateByIdWxoUsr
/** 根据 id 修改 公众号用户 */
export async function updateByIdWxoUsr(
  id: WxoUsrId,
  input: WxoUsrInput,
  options?: {
    is_debug?: boolean;
    uniqueType?: Exclude<UniqueType, UniqueType.Update>;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<WxoUsrId> {
  
  const table = "wx_wxo_usr";
  const method = "updateByIdWxoUsr";
  
  const is_debug = get_is_debug(options?.is_debug);
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  const is_creating = get_is_creating(options?.is_creating);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (id) {
      msg += ` id:${ id }`;
    }
    if (input) {
      msg += ` input:${ JSON.stringify(input) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!id) {
    throw new Error("updateByIdWxoUsr: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateByIdWxoUsr: input cannot be null");
  }
  
  // 修改租户id
  if (isNotEmpty(input.tenant_id)) {
    await updateTenantByIdWxoUsr(id, input.tenant_id, options);
  }
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUniqueWxoUsr(input2, options);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || !options.uniqueType || options.uniqueType === UniqueType.Throw) {
        throw "此 公众号用户 已经存在";
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findByIdWxoUsr(id, options);
  
  if (!oldModel) {
    throw "编辑失败, 此 公众号用户 已被删除";
  }
  
  const args = new QueryArgs();
  let sql = `update wx_wxo_usr set `;
  let updateFldNum = 0;
  if (input.lbl != null) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl=${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  if (input.head_img != null) {
    if (input.head_img != oldModel.head_img) {
      sql += `head_img=${ args.push(input.head_img) },`;
      updateFldNum++;
    }
  }
  if (input.usr_id != null) {
    if (input.usr_id != oldModel.usr_id) {
      sql += `usr_id=${ args.push(input.usr_id) },`;
      updateFldNum++;
    }
  }
  if (input.appid != null) {
    if (input.appid != oldModel.appid) {
      sql += `appid=${ args.push(input.appid) },`;
      updateFldNum++;
    }
  }
  if (input.openid != null) {
    if (input.openid != oldModel.openid) {
      sql += `openid=${ args.push(input.openid) },`;
      updateFldNum++;
    }
  }
  if (input.unionid != null) {
    if (input.unionid != oldModel.unionid) {
      sql += `unionid=${ args.push(input.unionid) },`;
      updateFldNum++;
    }
  }
  if (input.sex != null) {
    if (input.sex != oldModel.sex) {
      sql += `sex=${ args.push(input.sex) },`;
      updateFldNum++;
    }
  }
  if (input.province != null) {
    if (input.province != oldModel.province) {
      sql += `province=${ args.push(input.province) },`;
      updateFldNum++;
    }
  }
  if (input.city != null) {
    if (input.city != oldModel.city) {
      sql += `city=${ args.push(input.city) },`;
      updateFldNum++;
    }
  }
  if (input.country != null) {
    if (input.country != oldModel.country) {
      sql += `country=${ args.push(input.country) },`;
      updateFldNum++;
    }
  }
  if (input.privilege != null) {
    if (input.privilege != oldModel.privilege) {
      sql += `privilege=${ args.push(input.privilege) },`;
      updateFldNum++;
    }
  }
  if (input.rem != null) {
    if (input.rem != oldModel.rem) {
      sql += `rem=${ args.push(input.rem) },`;
      updateFldNum++;
    }
  }
  if (isNotEmpty(input.create_usr_id_lbl)) {
    sql += `create_usr_id_lbl=?,`;
    args.push(input.create_usr_id_lbl);
    updateFldNum++;
  }
  if (input.create_usr_id != null) {
    if (input.create_usr_id != oldModel.create_usr_id) {
      sql += `create_usr_id=${ args.push(input.create_usr_id) },`;
      updateFldNum++;
    }
  }
  if (input.create_time != null || input.create_time_save_null) {
    if (input.create_time != oldModel.create_time) {
      sql += `create_time=${ args.push(input.create_time) },`;
      updateFldNum++;
    }
  }
  let sqlSetFldNum = updateFldNum;
  
  if (updateFldNum > 0) {
    if (!is_silent_mode && !is_creating) {
      if (input.update_usr_id == null) {
        let usr_id = await get_usr_id();
        let usr_lbl = "";
        if (usr_id) {
          const usr_model = await findByIdUsr(usr_id, options);
          if (!usr_model) {
            usr_id = undefined;
          } else {
            usr_lbl = usr_model.lbl;
          }
        }
        if (usr_id != null) {
          sql += `update_usr_id=${ args.push(usr_id) },`;
        }
        if (usr_lbl) {
          sql += `update_usr_id_lbl=${ args.push(usr_lbl) },`;
        }
      } else if (input.update_usr_id && input.update_usr_id as unknown as string !== "-") {
        let usr_id: UsrId | undefined = input.update_usr_id;
        let usr_lbl = "";
        if (usr_id) {
          const usr_model = await findByIdUsr(usr_id, options);
          if (!usr_model) {
            usr_id = undefined;
          } else {
            usr_lbl = usr_model.lbl;
          }
        }
        if (usr_id) {
          sql += `update_usr_id=${ args.push(usr_id) },`;
          sql += `update_usr_id_lbl=${ args.push(usr_lbl) },`;
        }
      }
    } else {
      if (input.update_usr_id != null) {
        sql += `update_usr_id=${ args.push(input.update_usr_id) },`;
      }
      if (input.update_usr_id_lbl != null) {
        sql += `update_usr_id_lbl=${ args.push(input.update_usr_id_lbl) },`;
      }
    }
    if (!is_silent_mode && !is_creating) {
      if (input.update_time != null || input.update_time_save_null) {
        sql += `update_time=${ args.push(input.update_time) },`;
      } else {
        sql += `update_time=${ args.push(reqDate()) },`;
      }
    } else if (input.update_time != null || input.update_time_save_null) {
      sql += `update_time=${ args.push(input.update_time) },`;
    }
    if (sql.endsWith(",")) {
      sql = sql.substring(0, sql.length - 1);
    }
    sql += ` where id=${ args.push(id) } limit 1`;
    
    await delCacheWxoUsr();
    
    if (sqlSetFldNum > 0) {
      await execute(sql, args);
    }
  }
  
  if (updateFldNum > 0) {
    await delCacheWxoUsr();
  }
  
  if (!is_silent_mode) {
    log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
  }
  
  return id;
}

// MARK: deleteByIdsWxoUsr
/** 根据 ids 删除 公众号用户 */
export async function deleteByIdsWxoUsr(
  ids: WxoUsrId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;
  },
): Promise<number> {
  
  const table = "wx_wxo_usr";
  const method = "deleteByIdsWxoUsr";
  
  const is_debug = get_is_debug(options?.is_debug);
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  const is_creating = get_is_creating(options?.is_creating);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ JSON.stringify(ids) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  await delCacheWxoUsr();
  
  let affectedRows = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findByIdWxoUsr(id, options);
    if (!oldModel) {
      continue;
    }
    if (!is_silent_mode) {
      log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
    }
    const args = new QueryArgs();
    let sql = `update wx_wxo_usr set is_deleted=1`;
    if (!is_silent_mode && !is_creating) {
      let usr_id = await get_usr_id();
      if (usr_id != null) {
        sql += `,delete_usr_id=${ args.push(usr_id) }`;
      }
      let usr_lbl = "";
      if (usr_id) {
        const usr_model = await findByIdUsr(usr_id, options);
        if (!usr_model) {
          usr_id = undefined;
        } else {
          usr_lbl = usr_model.lbl;
        }
      }
      if (usr_lbl) {
        sql += `,delete_usr_id_lbl=${ args.push(usr_lbl) }`;
      }
      sql += `,delete_time=${ args.push(reqDate()) }`;
    }
    sql += ` where id=${ args.push(id) } limit 1`;
    const res = await execute(sql, args);
    affectedRows += res.affectedRows;
  }
  
  await delCacheWxoUsr();
  
  return affectedRows;
}

// MARK: revertByIdsWxoUsr
/** 根据 ids 还原 公众号用户 */
export async function revertByIdsWxoUsr(
  ids: WxoUsrId[],
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "wx_wxo_usr";
  const method = "revertByIdsWxoUsr";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ JSON.stringify(ids) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  await delCacheWxoUsr();
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    let old_model = await findOneWxoUsr(
      {
        id,
        is_deleted: 1,
      },
      undefined,
      options,
    );
    if (!old_model) {
      old_model = await findByIdWxoUsr(
        id,
        options,
      );
    }
    if (!old_model) {
      continue;
    }
    {
      const input = {
        ...old_model,
        id: undefined,
      } as WxoUsrInput;
      const models = await findByUniqueWxoUsr(input, options);
      for (const model of models) {
        if (model.id === id) {
          continue;
        }
        throw "此 公众号用户 已经存在";
      }
    }
    const args = new QueryArgs();
    const sql = `update wx_wxo_usr set is_deleted=0 where id=${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  await delCacheWxoUsr();
  
  return num;
}

// MARK: forceDeleteByIdsWxoUsr
/** 根据 ids 彻底删除 公众号用户 */
export async function forceDeleteByIdsWxoUsr(
  ids: WxoUsrId[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<number> {
  
  const table = "wx_wxo_usr";
  const method = "forceDeleteByIdsWxoUsr";
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ JSON.stringify(ids) }`;
    }
    if (options && Object.keys(options).length > 0) {
      msg += ` options:${ JSON.stringify(options) }`;
    }
    log(msg);
    options = options ?? { };
    options.is_debug = false;
  }
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  await delCacheWxoUsr();
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findOneWxoUsr(
      {
        id,
        is_deleted: 1,
      },
      undefined,
      options,
    );
    if (oldModel && !is_silent_mode) {
      log(`${ table }.${ method }: ${ JSON.stringify(oldModel) }`);
    }
    const args = new QueryArgs();
    const sql = `delete from wx_wxo_usr where id=${ args.push(id) } and is_deleted = 1 limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }
  
  await delCacheWxoUsr();
  
  return num;
}
