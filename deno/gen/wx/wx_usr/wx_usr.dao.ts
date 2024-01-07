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

import * as orgDao from "/gen/base/org/org.dao.ts";

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
  OrgId,
} from "/gen/base/org/org.model.ts";

import type {
  WxUsrInput,
  WxUsrModel,
  WxUsrSearch,
  WxUsrFieldComment,
  WxUsrId,
} from "./wx_usr.model.ts";

import * as usrDao from "/gen/base/usr/usr.dao.ts";

const route_path = "/wx/wx_usr";

async function getWhereQuery(
  args: QueryArgs,
  search?: WxUsrSearch,
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
  if (search?.org_id == null) {
    const authModel = await getAuthModel();
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
  if (search?.lbl !== undefined) {
    whereQuery += ` and t.lbl = ${ args.push(search.lbl) }`;
  }
  if (search?.lbl === null) {
    whereQuery += ` and t.lbl is null`;
  }
  if (isNotEmpty(search?.lbl_like)) {
    whereQuery += ` and t.lbl like ${ args.push("%" + sqlLike(search?.lbl_like) + "%") }`;
  }
  if (search?.usr_id && !Array.isArray(search?.usr_id)) {
    search.usr_id = [ search.usr_id ];
  }
  if (search?.usr_id && search?.usr_id.length > 0) {
    whereQuery += ` and usr_id_lbl.id in ${ args.push(search.usr_id) }`;
  }
  if (search?.usr_id === null) {
    whereQuery += ` and usr_id_lbl.id is null`;
  }
  if (search?.usr_id_is_null) {
    whereQuery += ` and usr_id_lbl.id is null`;
  }
  if (search?.nick_name !== undefined) {
    whereQuery += ` and t.nick_name = ${ args.push(search.nick_name) }`;
  }
  if (search?.nick_name === null) {
    whereQuery += ` and t.nick_name is null`;
  }
  if (isNotEmpty(search?.nick_name_like)) {
    whereQuery += ` and t.nick_name like ${ args.push("%" + sqlLike(search?.nick_name_like) + "%") }`;
  }
  if (search?.avatar_url !== undefined) {
    whereQuery += ` and t.avatar_url = ${ args.push(search.avatar_url) }`;
  }
  if (search?.avatar_url === null) {
    whereQuery += ` and t.avatar_url is null`;
  }
  if (isNotEmpty(search?.avatar_url_like)) {
    whereQuery += ` and t.avatar_url like ${ args.push("%" + sqlLike(search?.avatar_url_like) + "%") }`;
  }
  if (search?.mobile !== undefined) {
    whereQuery += ` and t.mobile = ${ args.push(search.mobile) }`;
  }
  if (search?.mobile === null) {
    whereQuery += ` and t.mobile is null`;
  }
  if (isNotEmpty(search?.mobile_like)) {
    whereQuery += ` and t.mobile like ${ args.push("%" + sqlLike(search?.mobile_like) + "%") }`;
  }
  if (search?.openid !== undefined) {
    whereQuery += ` and t.openid = ${ args.push(search.openid) }`;
  }
  if (search?.openid === null) {
    whereQuery += ` and t.openid is null`;
  }
  if (isNotEmpty(search?.openid_like)) {
    whereQuery += ` and t.openid like ${ args.push("%" + sqlLike(search?.openid_like) + "%") }`;
  }
  if (search?.gz_openid !== undefined) {
    whereQuery += ` and t.gz_openid = ${ args.push(search.gz_openid) }`;
  }
  if (search?.gz_openid === null) {
    whereQuery += ` and t.gz_openid is null`;
  }
  if (isNotEmpty(search?.gz_openid_like)) {
    whereQuery += ` and t.gz_openid like ${ args.push("%" + sqlLike(search?.gz_openid_like) + "%") }`;
  }
  if (search?.unionid !== undefined) {
    whereQuery += ` and t.unionid = ${ args.push(search.unionid) }`;
  }
  if (search?.unionid === null) {
    whereQuery += ` and t.unionid is null`;
  }
  if (isNotEmpty(search?.unionid_like)) {
    whereQuery += ` and t.unionid like ${ args.push("%" + sqlLike(search?.unionid_like) + "%") }`;
  }
  if (search?.gender && !Array.isArray(search?.gender)) {
    search.gender = [ search.gender ];
  }
  if (search?.gender && search?.gender?.length > 0) {
    whereQuery += ` and t.gender in ${ args.push(search.gender) }`;
  }
  if (search?.city !== undefined) {
    whereQuery += ` and t.city = ${ args.push(search.city) }`;
  }
  if (search?.city === null) {
    whereQuery += ` and t.city is null`;
  }
  if (isNotEmpty(search?.city_like)) {
    whereQuery += ` and t.city like ${ args.push("%" + sqlLike(search?.city_like) + "%") }`;
  }
  if (search?.province !== undefined) {
    whereQuery += ` and t.province = ${ args.push(search.province) }`;
  }
  if (search?.province === null) {
    whereQuery += ` and t.province is null`;
  }
  if (isNotEmpty(search?.province_like)) {
    whereQuery += ` and t.province like ${ args.push("%" + sqlLike(search?.province_like) + "%") }`;
  }
  if (search?.country !== undefined) {
    whereQuery += ` and t.country = ${ args.push(search.country) }`;
  }
  if (search?.country === null) {
    whereQuery += ` and t.country is null`;
  }
  if (isNotEmpty(search?.country_like)) {
    whereQuery += ` and t.country like ${ args.push("%" + sqlLike(search?.country_like) + "%") }`;
  }
  if (search?.language !== undefined) {
    whereQuery += ` and t.language = ${ args.push(search.language) }`;
  }
  if (search?.language === null) {
    whereQuery += ` and t.language is null`;
  }
  if (isNotEmpty(search?.language_like)) {
    whereQuery += ` and t.language like ${ args.push("%" + sqlLike(search?.language_like) + "%") }`;
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
    wx_wx_usr t
    left join base_usr usr_id_lbl
      on usr_id_lbl.id = t.usr_id
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id
  `;
  return fromQuery;
}

/**
 * 根据条件查找微信用户总数
 * @param { WxUsrSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: WxUsrSearch,
  options?: {
  },
): Promise<number> {
  const table = "wx_wx_usr";
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
 * 根据搜索条件和分页查找微信用户列表
 * @param {WxUsrSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: WxUsrSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<WxUsrModel[]> {
  const table = "wx_wx_usr";
  const method = "findAll";
  
  const args = new QueryArgs();
  let sql = `
    select t.*
      ,usr_id_lbl.lbl usr_id_lbl
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
        prop: "create_time",
        order: SortOrderEnum.Desc,
      },
    ];
  } else if (!Array.isArray(sort)) {
    sort = [ sort ];
  }
  sort = sort.filter((item) => item.prop);
  sort.push({
    prop: "create_time",
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
  
  // 缓存
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  const result = await query<WxUsrModel>(
    sql,
    args,
    {
      cacheKey1,
      cacheKey2,
    },
  );
  
  const [
    genderDict, // 性别
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await getDict([
    "wx_usr_gender",
    "is_locked",
    "is_enabled",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 性别
    let gender_lbl = model.gender?.toString() || "";
    if (model.gender !== undefined && model.gender !== null) {
      const dictItem = genderDict.find((dictItem) => dictItem.val === model.gender.toString());
      if (dictItem) {
        gender_lbl = dictItem.lbl;
      }
    }
    model.gender_lbl = gender_lbl;
    
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
  input: WxUsrInput,
) {
  
  const [
    genderDict, // 性别
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await getDict([
    "wx_usr_gender",
    "is_locked",
    "is_enabled",
  ]);
  
  // 用户
  if (isNotEmpty(input.usr_id_lbl) && input.usr_id === undefined) {
    input.usr_id_lbl = String(input.usr_id_lbl).trim();
    const usrModel = await usrDao.findOne({ lbl: input.usr_id_lbl });
    if (usrModel) {
      input.usr_id = usrModel.id;
    }
  }
  
  // 性别
  if (isNotEmpty(input.gender_lbl) && input.gender === undefined) {
    const val = genderDict.find((itemTmp) => itemTmp.lbl === input.gender_lbl)?.val;
    if (val !== undefined) {
      input.gender = Number(val);
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
 * 获取微信用户字段注释
 */
export async function getFieldComments(): Promise<WxUsrFieldComment> {
  const n = initN(route_path);
  const fieldComments: WxUsrFieldComment = {
    id: await n("ID"),
    lbl: await n("名称"),
    usr_id: await n("用户"),
    usr_id_lbl: await n("用户"),
    nick_name: await n("昵称"),
    avatar_url: await n("头像"),
    mobile: await n("手机"),
    openid: await n("小程序openid"),
    gz_openid: await n("公众号openid"),
    unionid: await n("unionid"),
    gender: await n("性别"),
    gender_lbl: await n("性别"),
    city: await n("城市"),
    province: await n("省份"),
    country: await n("国家"),
    language: await n("语言"),
    is_locked: await n("锁定"),
    is_locked_lbl: await n("锁定"),
    is_enabled: await n("启用"),
    is_enabled_lbl: await n("启用"),
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
 * 通过唯一约束获得微信用户列表
 * @param {WxUsrInput} search0
 */
export async function findByUnique(
  search0: WxUsrInput,
  options?: {
  },
): Promise<WxUsrModel[]> {
  if (search0.id) {
    const model = await findOne({
      id: search0.id,
    });
    if (!model) {
      return [ ];
    }
    return [ model ];
  }
  const models: WxUsrModel[] = [ ];
  {
    if (search0.openid == null) {
      return [ ];
    }
    const openid = search0.openid;
    const modelTmps = await findAll({
      openid,
    });
    models.push(...modelTmps);
  }
  return models;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {WxUsrModel} oldModel
 * @param {WxUsrInput} input
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: WxUsrModel,
  input: WxUsrInput,
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

/**
 * 通过唯一约束检查微信用户是否已经存在
 * @param {WxUsrInput} input
 * @param {WxUsrModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<WxUsrId | undefined>}
 */
export async function checkByUnique(
  input: WxUsrInput,
  oldModel: WxUsrModel,
  uniqueType: UniqueType = UniqueType.Throw,
  options?: {
  },
): Promise<WxUsrId | undefined> {
  const isEquals = equalsByUnique(oldModel, input);
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("数据已经存在"));
    }
    if (uniqueType === UniqueType.Update) {
      const id: WxUsrId = await updateById(
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
 * 根据条件查找第一个微信用户
 * @param {WxUsrSearch} search?
 */
export async function findOne(
  search?: WxUsrSearch,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<WxUsrModel | undefined> {
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  const models = await findAll(search, page, sort);
  const model = models[0];
  return model;
}

/**
 * 根据 id 查找微信用户
 * @param {WxUsrId} id
 */
export async function findById(
  id?: WxUsrId | null,
  options?: {
  },
): Promise<WxUsrModel | undefined> {
  if (isEmpty(id as unknown as string)) {
    return;
  }
  const model = await findOne({ id });
  return model;
}

/**
 * 根据搜索条件判断微信用户是否存在
 * @param {WxUsrSearch} search?
 */
export async function exist(
  search?: WxUsrSearch,
  options?: {
  },
): Promise<boolean> {
  const model = await findOne(search);
  const exist = !!model;
  return exist;
}

/**
 * 根据id判断微信用户是否存在
 * @param {WxUsrId} id
 */
export async function existById(
  id?: WxUsrId | null,
) {
  const table = "wx_wx_usr";
  const method = "existById";
  
  if (isEmpty(id as unknown as string)) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = `
    select
      1 e
    from
      wx_wx_usr t
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

/** 校验微信用户是否启用 */
export async function validateIsEnabled(
  model: WxUsrModel,
) {
  if (model.is_enabled == 0) {
    throw `${ await ns("微信用户") } ${ await ns("已禁用") }`;
  }
}

/** 校验微信用户是否存在 */
export async function validateOption(
  model?: WxUsrModel,
) {
  if (!model) {
    throw `${ await ns("微信用户") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 微信用户增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: WxUsrInput,
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
    100,
    fieldComments.lbl,
  );
  
  // 用户
  await validators.chars_max_length(
    input.usr_id,
    22,
    fieldComments.usr_id,
  );
  
  // 昵称
  await validators.chars_max_length(
    input.nick_name,
    100,
    fieldComments.nick_name,
  );
  
  // 头像
  await validators.chars_max_length(
    input.avatar_url,
    500,
    fieldComments.avatar_url,
  );
  
  // 手机
  await validators.chars_max_length(
    input.mobile,
    30,
    fieldComments.mobile,
  );
  
  // 小程序openid
  await validators.chars_max_length(
    input.openid,
    100,
    fieldComments.openid,
  );
  
  // 公众号openid
  await validators.chars_max_length(
    input.gz_openid,
    100,
    fieldComments.gz_openid,
  );
  
  // unionid
  await validators.chars_max_length(
    input.unionid,
    100,
    fieldComments.unionid,
  );
  
  // 城市
  await validators.chars_max_length(
    input.city,
    100,
    fieldComments.city,
  );
  
  // 省份
  await validators.chars_max_length(
    input.province,
    100,
    fieldComments.province,
  );
  
  // 国家
  await validators.chars_max_length(
    input.country,
    100,
    fieldComments.country,
  );
  
  // 语言
  await validators.chars_max_length(
    input.language,
    100,
    fieldComments.language,
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
 * 创建微信用户
 * @param {WxUsrInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<WxUsrId>} 
 */
export async function create(
  input: WxUsrInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<WxUsrId> {
  const table = "wx_wx_usr";
  const method = "create";
  
  if (input.id) {
    throw new Error(`Can not set id when create in dao: ${ table }`);
  }
  
  await setIdByLbl(input);
  
  const oldModels = await findByUnique(input, options);
  if (oldModels.length > 0) {
    let id: WxUsrId | undefined = undefined;
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
    input.id = shortUuidV4<WxUsrId>();
    const isExist = await existById(input.id);
    if (!isExist) {
      break;
    }
    error(`ID_COLLIDE: ${ table } ${ input.id as unknown as string }`);
  }
  
  const args = new QueryArgs();
  let sql = `
    insert into wx_wx_usr(
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
  if (input.org_id != null) {
    sql += `,org_id`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.org_id) {
      sql += `,org_id`;
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
  if (input.usr_id !== undefined) {
    sql += `,usr_id`;
  }
  if (input.nick_name !== undefined) {
    sql += `,nick_name`;
  }
  if (input.avatar_url !== undefined) {
    sql += `,avatar_url`;
  }
  if (input.mobile !== undefined) {
    sql += `,mobile`;
  }
  if (input.openid !== undefined) {
    sql += `,openid`;
  }
  if (input.gz_openid !== undefined) {
    sql += `,gz_openid`;
  }
  if (input.unionid !== undefined) {
    sql += `,unionid`;
  }
  if (input.gender !== undefined) {
    sql += `,gender`;
  }
  if (input.city !== undefined) {
    sql += `,city`;
  }
  if (input.province !== undefined) {
    sql += `,province`;
  }
  if (input.country !== undefined) {
    sql += `,country`;
  }
  if (input.language !== undefined) {
    sql += `,language`;
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
    const authModel = await getAuthModel();
    const tenant_id = await getTenant_id(authModel?.id);
    if (tenant_id) {
      sql += `,${ args.push(tenant_id) }`;
    }
  }
  if (input.org_id != null) {
    sql += `,${ args.push(input.org_id) }`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.org_id) {
      sql += `,${ args.push(authModel?.org_id) }`;
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
  if (input.usr_id !== undefined) {
    sql += `,${ args.push(input.usr_id) }`;
  }
  if (input.nick_name !== undefined) {
    sql += `,${ args.push(input.nick_name) }`;
  }
  if (input.avatar_url !== undefined) {
    sql += `,${ args.push(input.avatar_url) }`;
  }
  if (input.mobile !== undefined) {
    sql += `,${ args.push(input.mobile) }`;
  }
  if (input.openid !== undefined) {
    sql += `,${ args.push(input.openid) }`;
  }
  if (input.gz_openid !== undefined) {
    sql += `,${ args.push(input.gz_openid) }`;
  }
  if (input.unionid !== undefined) {
    sql += `,${ args.push(input.unionid) }`;
  }
  if (input.gender !== undefined) {
    sql += `,${ args.push(input.gender) }`;
  }
  if (input.city !== undefined) {
    sql += `,${ args.push(input.city) }`;
  }
  if (input.province !== undefined) {
    sql += `,${ args.push(input.province) }`;
  }
  if (input.country !== undefined) {
    sql += `,${ args.push(input.country) }`;
  }
  if (input.language !== undefined) {
    sql += `,${ args.push(input.language) }`;
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
  
  await delCache();
  const res = await execute(sql, args);
  log(JSON.stringify(res));
  
  await delCache();
  
  return input.id;
}

/**
 * 删除缓存
 */
export async function delCache() {
  const table = "wx_wx_usr";
  const method = "delCache";
  
  await delCacheCtx(`dao.sql.${ table }`);
  const foreignTables: string[] = [
    "base_usr",
  ];
  for (let k = 0; k < foreignTables.length; k++) {
    const foreignTable = foreignTables[k];
    if (foreignTable === table) continue;
    await delCacheCtx(`dao.sql.${ foreignTable }`);
  }
}

/**
 * 微信用户根据id修改租户id
 * @param {WxUsrId} id
 * @param {TenantId} tenant_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateTenantById(
  id: WxUsrId,
  tenant_id: TenantId,
  options?: {
  },
): Promise<number> {
  const table = "wx_wx_usr";
  const method = "updateTenantById";
  
  const tenantExist = await existByIdTenant(tenant_id);
  if (!tenantExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `
    update
      wx_wx_usr
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
 * 微信用户根据id修改组织id
 * @export
 * @param {WxUsrId} id
 * @param {OrgId} org_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateOrgById(
  id: WxUsrId,
  org_id: OrgId,
  options?: {
  },
): Promise<number> {
  const table = "wx_wx_usr";
  const method = "updateOrgById";
  
  const orgExist = await orgDao.existById(org_id);
  if (!orgExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `
    update
      wx_wx_usr
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
 * 根据 id 修改微信用户
 * @param {WxUsrId} id
 * @param {WxUsrInput} input
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<WxUsrId>}
 */
export async function updateById(
  id: WxUsrId,
  input: WxUsrInput,
  options?: {
    uniqueType?: "ignore" | "throw";
  },
): Promise<WxUsrId> {
  const table = "wx_wx_usr";
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
  
  // 修改组织id
  if (isNotEmpty(input.org_id)) {
    await updateOrgById(id, input.org_id as unknown as OrgId);
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
        throw await ns("数据已经存在");
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id);
  
  if (!oldModel) {
    throw await ns("修改失败, 数据已被删除");
  }
  
  const args = new QueryArgs();
  let sql = `
    update wx_wx_usr set
  `;
  let updateFldNum = 0;
  if (input.lbl !== undefined) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl = ${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  if (input.usr_id !== undefined) {
    if (input.usr_id != oldModel.usr_id) {
      sql += `usr_id = ${ args.push(input.usr_id) },`;
      updateFldNum++;
    }
  }
  if (input.nick_name !== undefined) {
    if (input.nick_name != oldModel.nick_name) {
      sql += `nick_name = ${ args.push(input.nick_name) },`;
      updateFldNum++;
    }
  }
  if (input.avatar_url !== undefined) {
    if (input.avatar_url != oldModel.avatar_url) {
      sql += `avatar_url = ${ args.push(input.avatar_url) },`;
      updateFldNum++;
    }
  }
  if (input.mobile !== undefined) {
    if (input.mobile != oldModel.mobile) {
      sql += `mobile = ${ args.push(input.mobile) },`;
      updateFldNum++;
    }
  }
  if (input.openid !== undefined) {
    if (input.openid != oldModel.openid) {
      sql += `openid = ${ args.push(input.openid) },`;
      updateFldNum++;
    }
  }
  if (input.gz_openid !== undefined) {
    if (input.gz_openid != oldModel.gz_openid) {
      sql += `gz_openid = ${ args.push(input.gz_openid) },`;
      updateFldNum++;
    }
  }
  if (input.unionid !== undefined) {
    if (input.unionid != oldModel.unionid) {
      sql += `unionid = ${ args.push(input.unionid) },`;
      updateFldNum++;
    }
  }
  if (input.gender !== undefined) {
    if (input.gender != oldModel.gender) {
      sql += `gender = ${ args.push(input.gender) },`;
      updateFldNum++;
    }
  }
  if (input.city !== undefined) {
    if (input.city != oldModel.city) {
      sql += `city = ${ args.push(input.city) },`;
      updateFldNum++;
    }
  }
  if (input.province !== undefined) {
    if (input.province != oldModel.province) {
      sql += `province = ${ args.push(input.province) },`;
      updateFldNum++;
    }
  }
  if (input.country !== undefined) {
    if (input.country != oldModel.country) {
      sql += `country = ${ args.push(input.country) },`;
      updateFldNum++;
    }
  }
  if (input.language !== undefined) {
    if (input.language != oldModel.language) {
      sql += `language = ${ args.push(input.language) },`;
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
 * 根据 ids 删除微信用户
 * @param {WxUsrId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: WxUsrId[],
  options?: {
  },
): Promise<number> {
  const table = "wx_wx_usr";
  const method = "deleteByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  if (ids.length > 0) {
    await delCache();
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: WxUsrId = ids[i];
    const isExist = await existById(id);
    if (!isExist) {
      continue;
    }
    const args = new QueryArgs();
    const sql = `
      update
        wx_wx_usr
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
 * 根据 ID 查找微信用户是否已启用
 * 不存在则返回 undefined
 * @param {WxUsrId} id
 * @return {Promise<0 | 1 | undefined>}
 */
export async function getIsEnabledById(
  id: WxUsrId,
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
 * 根据 ids 启用或者禁用微信用户
 * @param {WxUsrId[]} ids
 * @param {0 | 1} is_enabled
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: WxUsrId[],
  is_enabled: 0 | 1,
  options?: {
  },
): Promise<number> {
  const table = "wx_wx_usr";
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
      wx_wx_usr
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
 * 根据 ID 查找微信用户是否已锁定
 * 已锁定的不能修改和删除
 * 不存在则返回 undefined
 * @param {WxUsrId} id
 * @return {Promise<0 | 1 | undefined>}
 */
export async function getIsLockedById(
  id: WxUsrId,
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
 * 根据 ids 锁定或者解锁微信用户
 * @param {WxUsrId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: WxUsrId[],
  is_locked: 0 | 1,
  options?: {
  },
): Promise<number> {
  const table = "wx_wx_usr";
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
      wx_wx_usr
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
 * 根据 ids 还原微信用户
 * @param {WxUsrId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: WxUsrId[],
  options?: {
  },
): Promise<number> {
  const table = "wx_wx_usr";
  const method = "revertByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  if (ids.length > 0) {
    await delCache();
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: WxUsrId = ids[i];
    const args = new QueryArgs();
    const sql = `
      update
        wx_wx_usr
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
 * 根据 ids 彻底删除微信用户
 * @param {WxUsrId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: WxUsrId[],
  options?: {
  },
): Promise<number> {
  const table = "wx_wx_usr";
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
          wx_wx_usr
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `
      delete from
        wx_wx_usr
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
