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
  encrypt,
  decrypt,
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
  DomainId,
} from "/gen/base/domain/domain.model.ts";

import type {
  WxwAppInput,
  WxwAppModel,
  WxwAppSearch,
  WxwAppFieldComment,
  WxwAppId,
} from "./wxw_app.model.ts";

import * as domainDao from "/gen/base/domain/domain.dao.ts";

const route_path = "/wxwork/wxw_app";

async function getWhereQuery(
  args: QueryArgs,
  search?: WxwAppSearch,
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
  if (search?.corpid !== undefined) {
    whereQuery += ` and t.corpid = ${ args.push(search.corpid) }`;
  }
  if (search?.corpid === null) {
    whereQuery += ` and t.corpid is null`;
  }
  if (isNotEmpty(search?.corpid_like)) {
    whereQuery += ` and t.corpid like ${ args.push("%" + sqlLike(search?.corpid_like) + "%") }`;
  }
  if (search?.agentid !== undefined) {
    whereQuery += ` and t.agentid = ${ args.push(search.agentid) }`;
  }
  if (search?.agentid === null) {
    whereQuery += ` and t.agentid is null`;
  }
  if (isNotEmpty(search?.agentid_like)) {
    whereQuery += ` and t.agentid like ${ args.push("%" + sqlLike(search?.agentid_like) + "%") }`;
  }
  if (search?.domain_id && !Array.isArray(search?.domain_id)) {
    search.domain_id = [ search.domain_id ];
  }
  if (search?.domain_id && search?.domain_id.length > 0) {
    whereQuery += ` and domain_id_lbl.id in ${ args.push(search.domain_id) }`;
  }
  if (search?.domain_id === null) {
    whereQuery += ` and domain_id_lbl.id is null`;
  }
  if (search?.domain_id_is_null) {
    whereQuery += ` and domain_id_lbl.id is null`;
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
    wxwork_wxw_app t
    left join base_domain domain_id_lbl
      on domain_id_lbl.id = t.domain_id
  `;
  return fromQuery;
}

/**
 * 根据条件查找企微应用总数
 * @param { WxwAppSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: WxwAppSearch,
  options?: {
  },
): Promise<number> {
  const table = "wxwork_wxw_app";
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
 * 根据搜索条件和分页查找企微应用列表
 * @param {WxwAppSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: WxwAppSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<WxwAppModel[]> {
  const table = "wxwork_wxw_app";
  const method = "findAll";
  
  const args = new QueryArgs();
  let sql = `
    select t.*
      ,domain_id_lbl.lbl domain_id_lbl
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
  
  const result = await query<WxwAppModel>(
    sql,
    args,
    {
      cacheKey1,
      cacheKey2,
    },
  );
  
  const [
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await getDict([
    "is_locked",
    "is_enabled",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    // 应用密钥
    model.corpsecret = await decrypt(model.corpsecret);
    // 通讯录密钥
    model.contactsecret = await decrypt(model.contactsecret);
    
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

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: WxwAppInput,
) {
  
  const [
    is_lockedDict, // 锁定
    is_enabledDict, // 启用
  ] = await getDict([
    "is_locked",
    "is_enabled",
  ]);
  
  // 可信域名
  if (isNotEmpty(input.domain_id_lbl) && input.domain_id === undefined) {
    input.domain_id_lbl = String(input.domain_id_lbl).trim();
    const domainModel = await domainDao.findOne({ lbl: input.domain_id_lbl });
    if (domainModel) {
      input.domain_id = domainModel.id;
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
 * 获取企微应用字段注释
 */
export async function getFieldComments(): Promise<WxwAppFieldComment> {
  const n = initN(route_path);
  const fieldComments: WxwAppFieldComment = {
    id: await n("ID"),
    lbl: await n("名称"),
    corpid: await n("企业ID"),
    agentid: await n("应用ID"),
    domain_id: await n("可信域名"),
    domain_id_lbl: await n("可信域名"),
    corpsecret: await n("应用密钥"),
    contactsecret: await n("通讯录密钥"),
    is_locked: await n("锁定"),
    is_locked_lbl: await n("锁定"),
    is_enabled: await n("启用"),
    is_enabled_lbl: await n("启用"),
    order_by: await n("排序"),
    rem: await n("备注"),
  };
  return fieldComments;
}

/**
 * 通过唯一约束获得企微应用列表
 * @param {WxwAppInput} search0
 */
export async function findByUnique(
  search0: WxwAppInput,
  options?: {
  },
): Promise<WxwAppModel[]> {
  if (search0.id) {
    const model = await findOne({
      id: search0.id,
    });
    if (!model) {
      return [ ];
    }
    return [ model ];
  }
  const models: WxwAppModel[] = [ ];
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
  {
    if (search0.corpid == null) {
      return [ ];
    }
    const corpid = search0.corpid;
    if (search0.agentid == null) {
      return [ ];
    }
    const agentid = search0.agentid;
    const modelTmps = await findAll({
      corpid,
      agentid,
    });
    models.push(...modelTmps);
  }
  {
    if (search0.domain_id == null) {
      return [ ];
    }
    let domain_id: DomainId[] = [ ];
    if (!Array.isArray(search0.domain_id)) {
      domain_id.push(search0.domain_id, search0.domain_id);
    } else {
      domain_id = search0.domain_id;
    }
    const modelTmps = await findAll({
      domain_id,
    });
    models.push(...modelTmps);
  }
  return models;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {WxwAppModel} oldModel
 * @param {WxwAppInput} input
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: WxwAppModel,
  input: WxwAppInput,
): boolean {
  if (!oldModel || !input) {
    return false;
  }
  if (
    oldModel.lbl === input.lbl
  ) {
    return true;
  }
  if (
    oldModel.corpid === input.corpid &&
    oldModel.agentid === input.agentid
  ) {
    return true;
  }
  if (
    oldModel.domain_id === input.domain_id
  ) {
    return true;
  }
  return false;
}

/**
 * 通过唯一约束检查企微应用是否已经存在
 * @param {WxwAppInput} input
 * @param {WxwAppModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<WxwAppId | undefined>}
 */
export async function checkByUnique(
  input: WxwAppInput,
  oldModel: WxwAppModel,
  uniqueType: UniqueType = UniqueType.Throw,
  options?: {
    isEncrypt?: boolean;
  },
): Promise<WxwAppId | undefined> {
  const isEquals = equalsByUnique(oldModel, input);
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("数据已经存在"));
    }
    if (uniqueType === UniqueType.Update) {
      const id: WxwAppId = await updateById(
        oldModel.id,
        {
          ...input,
          id: undefined,
        },
        {
          ...options,
          isEncrypt: false,
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
 * 根据条件查找第一个企微应用
 * @param {WxwAppSearch} search?
 */
export async function findOne(
  search?: WxwAppSearch,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<WxwAppModel | undefined> {
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  const models = await findAll(search, page, sort);
  const model = models[0];
  return model;
}

/**
 * 根据 id 查找企微应用
 * @param {WxwAppId} id
 */
export async function findById(
  id?: WxwAppId | null,
  options?: {
  },
): Promise<WxwAppModel | undefined> {
  if (isEmpty(id as unknown as string)) {
    return;
  }
  const model = await findOne({ id });
  return model;
}

/**
 * 根据搜索条件判断企微应用是否存在
 * @param {WxwAppSearch} search?
 */
export async function exist(
  search?: WxwAppSearch,
  options?: {
  },
): Promise<boolean> {
  const model = await findOne(search);
  const exist = !!model;
  return exist;
}

/**
 * 根据id判断企微应用是否存在
 * @param {WxwAppId} id
 */
export async function existById(
  id?: WxwAppId | null,
) {
  const table = "wxwork_wxw_app";
  const method = "existById";
  
  if (isEmpty(id as unknown as string)) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = `
    select
      1 e
    from
      wxwork_wxw_app t
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

/** 校验企微应用是否启用 */
export async function validateIsEnabled(
  model: WxwAppModel,
) {
  if (model.is_enabled == 0) {
    throw `${ await ns("企微应用") } ${ await ns("已禁用") }`;
  }
}

/** 校验企微应用是否存在 */
export async function validateOption(
  model?: WxwAppModel,
) {
  if (!model) {
    throw `${ await ns("企微应用") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 企微应用增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: WxwAppInput,
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
  
  // 企业ID
  await validators.chars_max_length(
    input.corpid,
    18,
    fieldComments.corpid,
  );
  
  // 应用ID
  await validators.chars_max_length(
    input.agentid,
    7,
    fieldComments.agentid,
  );
  
  // 可信域名
  await validators.chars_max_length(
    input.domain_id,
    22,
    fieldComments.domain_id,
  );
  
  // 应用密钥
  await validators.chars_max_length(
    input.corpsecret,
    120,
    fieldComments.corpsecret,
  );
  
  // 通讯录密钥
  await validators.chars_max_length(
    input.contactsecret,
    120,
    fieldComments.contactsecret,
  );
  
  // 备注
  await validators.chars_max_length(
    input.rem,
    100,
    fieldComments.rem,
  );
  
}

/**
 * 创建企微应用
 * @param {WxwAppInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<WxwAppId>} 
 */
export async function create(
  input: WxwAppInput,
  options?: {
    uniqueType?: UniqueType;
    isEncrypt?: boolean;
  },
): Promise<WxwAppId> {
  const table = "wxwork_wxw_app";
  const method = "create";
  
  if (input.id) {
    throw new Error(`Can not set id when create in dao: ${ table }`);
  }
  if (options?.isEncrypt !== false) {
    // 应用密钥
    if (input.corpsecret != null) {
      input.corpsecret = await encrypt(input.corpsecret);
    }
    // 通讯录密钥
    if (input.contactsecret != null) {
      input.contactsecret = await encrypt(input.contactsecret);
    }
  }
  
  await setIdByLbl(input);
  
  const oldModels = await findByUnique(input, options);
  if (oldModels.length > 0) {
    let id: WxwAppId | undefined = undefined;
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
    input.id = shortUuidV4<WxwAppId>();
    const isExist = await existById(input.id);
    if (!isExist) {
      break;
    }
    error(`ID_COLLIDE: ${ table } ${ input.id as unknown as string }`);
  }
  
  const args = new QueryArgs();
  let sql = `
    insert into wxwork_wxw_app(
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
  if (input.corpid !== undefined) {
    sql += `,corpid`;
  }
  if (input.agentid !== undefined) {
    sql += `,agentid`;
  }
  if (input.domain_id !== undefined) {
    sql += `,domain_id`;
  }
  if (input.corpsecret !== undefined) {
    sql += `,corpsecret`;
  }
  if (input.contactsecret !== undefined) {
    sql += `,contactsecret`;
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
  if (input.corpid !== undefined) {
    sql += `,${ args.push(input.corpid) }`;
  }
  if (input.agentid !== undefined) {
    sql += `,${ args.push(input.agentid) }`;
  }
  if (input.domain_id !== undefined) {
    sql += `,${ args.push(input.domain_id) }`;
  }
  if (input.corpsecret !== undefined) {
    sql += `,${ args.push(input.corpsecret) }`;
  }
  if (input.contactsecret !== undefined) {
    sql += `,${ args.push(input.contactsecret) }`;
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
  
  await delCache();
  
  return input.id;
}

/**
 * 删除缓存
 */
export async function delCache() {
  const table = "wxwork_wxw_app";
  const method = "delCache";
  
  await delCacheCtx(`dao.sql.${ table }`);
  const foreignTables: string[] = [
    "base_domain",
  ];
  for (let k = 0; k < foreignTables.length; k++) {
    const foreignTable = foreignTables[k];
    if (foreignTable === table) continue;
    await delCacheCtx(`dao.sql.${ foreignTable }`);
  }
}

/**
 * 企微应用根据id修改租户id
 * @param {WxwAppId} id
 * @param {TenantId} tenant_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
export async function updateTenantById(
  id: WxwAppId,
  tenant_id: TenantId,
  options?: {
  },
): Promise<number> {
  const table = "wxwork_wxw_app";
  const method = "updateTenantById";
  
  const tenantExist = await existByIdTenant(tenant_id);
  if (!tenantExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `
    update
      wxwork_wxw_app
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
 * 根据 id 修改企微应用
 * @param {WxwAppId} id
 * @param {WxwAppInput} input
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<WxwAppId>}
 */
export async function updateById(
  id: WxwAppId,
  input: WxwAppInput,
  options?: {
    uniqueType?: "ignore" | "throw";
    isEncrypt?: boolean;
  },
): Promise<WxwAppId> {
  const table = "wxwork_wxw_app";
  const method = "updateById";
  
  if (!id) {
    throw new Error("updateById: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateById: input cannot be null");
  }
  if (options?.isEncrypt !== false) {
    // 应用密钥
    if (input.corpsecret != null) {
      input.corpsecret = await encrypt(input.corpsecret);
    }
    // 通讯录密钥
    if (input.contactsecret != null) {
      input.contactsecret = await encrypt(input.contactsecret);
    }
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
        throw await ns("此 {0} 已经存在", await ns("企微应用"));
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id);
  
  if (!oldModel) {
    throw await ns("编辑失败, 此 {0} 已被删除", await ns("企微应用"));
  }
  
  const args = new QueryArgs();
  let sql = `
    update wxwork_wxw_app set
  `;
  let updateFldNum = 0;
  if (input.lbl !== undefined) {
    if (input.lbl != oldModel.lbl) {
      sql += `lbl = ${ args.push(input.lbl) },`;
      updateFldNum++;
    }
  }
  if (input.corpid !== undefined) {
    if (input.corpid != oldModel.corpid) {
      sql += `corpid = ${ args.push(input.corpid) },`;
      updateFldNum++;
    }
  }
  if (input.agentid !== undefined) {
    if (input.agentid != oldModel.agentid) {
      sql += `agentid = ${ args.push(input.agentid) },`;
      updateFldNum++;
    }
  }
  if (input.domain_id !== undefined) {
    if (input.domain_id != oldModel.domain_id) {
      sql += `domain_id = ${ args.push(input.domain_id) },`;
      updateFldNum++;
    }
  }
  if (input.corpsecret !== undefined) {
    if (input.corpsecret != oldModel.corpsecret) {
      sql += `corpsecret = ${ args.push(input.corpsecret) },`;
      updateFldNum++;
    }
  }
  if (input.contactsecret !== undefined) {
    if (input.contactsecret != oldModel.contactsecret) {
      sql += `contactsecret = ${ args.push(input.contactsecret) },`;
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
 * 根据 ids 删除企微应用
 * @param {WxwAppId[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: WxwAppId[],
  options?: {
  },
): Promise<number> {
  const table = "wxwork_wxw_app";
  const method = "deleteByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  if (ids.length > 0) {
    await delCache();
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: WxwAppId = ids[i];
    const isExist = await existById(id);
    if (!isExist) {
      continue;
    }
    const args = new QueryArgs();
    const sql = `
      update
        wxwork_wxw_app
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
 * 根据 ID 查找企微应用是否已启用
 * 不存在则返回 undefined
 * @param {WxwAppId} id
 * @return {Promise<0 | 1 | undefined>}
 */
export async function getIsEnabledById(
  id: WxwAppId,
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
 * 根据 ids 启用或者禁用企微应用
 * @param {WxwAppId[]} ids
 * @param {0 | 1} is_enabled
 * @return {Promise<number>}
 */
export async function enableByIds(
  ids: WxwAppId[],
  is_enabled: 0 | 1,
  options?: {
  },
): Promise<number> {
  const table = "wxwork_wxw_app";
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
      wxwork_wxw_app
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
 * 根据 ID 查找企微应用是否已锁定
 * 已锁定的不能修改和删除
 * 不存在则返回 undefined
 * @param {WxwAppId} id
 * @return {Promise<0 | 1 | undefined>}
 */
export async function getIsLockedById(
  id: WxwAppId,
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
 * 根据 ids 锁定或者解锁企微应用
 * @param {WxwAppId[]} ids
 * @param {0 | 1} is_locked
 * @return {Promise<number>}
 */
export async function lockByIds(
  ids: WxwAppId[],
  is_locked: 0 | 1,
  options?: {
  },
): Promise<number> {
  const table = "wxwork_wxw_app";
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
      wxwork_wxw_app
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
 * 根据 ids 还原企微应用
 * @param {WxwAppId[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: WxwAppId[],
  options?: {
  },
): Promise<number> {
  const table = "wxwork_wxw_app";
  const method = "revertByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  if (ids.length > 0) {
    await delCache();
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id: WxwAppId = ids[i];
    const args = new QueryArgs();
    const sql = `
      update
        wxwork_wxw_app
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
 * 根据 ids 彻底删除企微应用
 * @param {WxwAppId[]} ids
 * @return {Promise<number>}
 */
export async function forceDeleteByIds(
  ids: WxwAppId[],
  options?: {
  },
): Promise<number> {
  const table = "wxwork_wxw_app";
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
          wxwork_wxw_app
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `
      delete from
        wxwork_wxw_app
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
 * 查找 企微应用 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
  options?: {
  },
): Promise<number> {
  const table = "wxwork_wxw_app";
  const method = "findLastOrderBy";
  
  let sql = `
    select
      t.order_by order_by
    from
      wxwork_wxw_app t
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
