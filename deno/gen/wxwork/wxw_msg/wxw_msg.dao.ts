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
} from "/gen/types.ts";

import type {
  WxwMsgInput,
  WxwMsgModel,
  WxwMsgSearch,
  WxwMsgFieldComment,
} from "./wxw_msg.model.ts";

import * as wxw_appDao from "/gen/wxwork/wxw_app/wxw_app.dao.ts";

const route_path = "/wxwork/wxw_msg";

async function getWhereQuery(
  args: QueryArgs,
  search?: WxwMsgSearch,
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
  if (search?.wxw_app_id && !Array.isArray(search?.wxw_app_id)) {
    search.wxw_app_id = [ search.wxw_app_id ];
  }
  if (search?.wxw_app_id && search?.wxw_app_id.length > 0) {
    whereQuery += ` and wxw_app_id_lbl.id in ${ args.push(search.wxw_app_id) }`;
  }
  if (search?.wxw_app_id === null) {
    whereQuery += ` and wxw_app_id_lbl.id is null`;
  }
  if (search?.wxw_app_id_is_null) {
    whereQuery += ` and wxw_app_id_lbl.id is null`;
  }
  if (search?.errcode && !Array.isArray(search?.errcode)) {
    search.errcode = [ search.errcode ];
  }
  if (search?.errcode && search?.errcode?.length > 0) {
    whereQuery += ` and t.errcode in ${ args.push(search.errcode) }`;
  }
  if (search?.touser !== undefined) {
    whereQuery += ` and t.touser = ${ args.push(search.touser) }`;
  }
  if (search?.touser === null) {
    whereQuery += ` and t.touser is null`;
  }
  if (isNotEmpty(search?.touser_like)) {
    whereQuery += ` and t.touser like ${ args.push("%" + sqlLike(search?.touser_like) + "%") }`;
  }
  if (search?.title !== undefined) {
    whereQuery += ` and t.title = ${ args.push(search.title) }`;
  }
  if (search?.title === null) {
    whereQuery += ` and t.title is null`;
  }
  if (isNotEmpty(search?.title_like)) {
    whereQuery += ` and t.title like ${ args.push("%" + sqlLike(search?.title_like) + "%") }`;
  }
  if (search?.description !== undefined) {
    whereQuery += ` and t.description = ${ args.push(search.description) }`;
  }
  if (search?.description === null) {
    whereQuery += ` and t.description is null`;
  }
  if (isNotEmpty(search?.description_like)) {
    whereQuery += ` and t.description like ${ args.push("%" + sqlLike(search?.description_like) + "%") }`;
  }
  if (search?.url !== undefined) {
    whereQuery += ` and t.url = ${ args.push(search.url) }`;
  }
  if (search?.url === null) {
    whereQuery += ` and t.url is null`;
  }
  if (isNotEmpty(search?.url_like)) {
    whereQuery += ` and t.url like ${ args.push("%" + sqlLike(search?.url_like) + "%") }`;
  }
  if (search?.btntxt !== undefined) {
    whereQuery += ` and t.btntxt = ${ args.push(search.btntxt) }`;
  }
  if (search?.btntxt === null) {
    whereQuery += ` and t.btntxt is null`;
  }
  if (isNotEmpty(search?.btntxt_like)) {
    whereQuery += ` and t.btntxt like ${ args.push("%" + sqlLike(search?.btntxt_like) + "%") }`;
  }
  if (search?.create_time && search?.create_time?.length > 0) {
    if (search.create_time[0] != null) {
      whereQuery += ` and t.create_time >= ${ args.push(search.create_time[0]) }`;
    }
    if (search.create_time[1] != null) {
      whereQuery += ` and t.create_time <= ${ args.push(search.create_time[1]) }`;
    }
  }
  if (search?.errmsg !== undefined) {
    whereQuery += ` and t.errmsg = ${ args.push(search.errmsg) }`;
  }
  if (search?.errmsg === null) {
    whereQuery += ` and t.errmsg is null`;
  }
  if (isNotEmpty(search?.errmsg_like)) {
    whereQuery += ` and t.errmsg like ${ args.push("%" + sqlLike(search?.errmsg_like) + "%") }`;
  }
  if (search?.msgid !== undefined) {
    whereQuery += ` and t.msgid = ${ args.push(search.msgid) }`;
  }
  if (search?.msgid === null) {
    whereQuery += ` and t.msgid is null`;
  }
  if (isNotEmpty(search?.msgid_like)) {
    whereQuery += ` and t.msgid like ${ args.push("%" + sqlLike(search?.msgid_like) + "%") }`;
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
    wxwork_wxw_msg t
    left join wxwork_wxw_app wxw_app_id_lbl
      on wxw_app_id_lbl.id = t.wxw_app_id
  `;
  return fromQuery;
}

/**
 * 根据条件查找总数据数
 * @param { WxwMsgSearch } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: WxwMsgSearch,
  options?: {
  },
): Promise<number> {
  const table = "wxwork_wxw_msg";
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
  
  interface Result {
    total: number,
  }
  const model = await queryOne<Result>(sql, args);
  let result = model?.total || 0;
  
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 * @param {WxwMsgSearch} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: WxwMsgSearch,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<WxwMsgModel[]> {
  const table = "wxwork_wxw_msg";
  const method = "findAll";
  
  const args = new QueryArgs();
  let sql = `
    select t.*
      ,wxw_app_id_lbl.lbl wxw_app_id_lbl
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
  
  const result = await query<WxwMsgModel>(
    sql,
    args,
  );
  
  const [
    errcodeDict, // 发送状态
  ] = await getDict([
    "wxw_msg_errcode",
  ]);
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];
    
    // 发送状态
    let errcode_lbl = model.errcode;
    if (!isEmpty(model.errcode)) {
      const dictItem = errcodeDict.find((dictItem) => dictItem.val === model.errcode);
      if (dictItem) {
        errcode_lbl = dictItem.lbl;
      }
    }
    model.errcode_lbl = errcode_lbl;
    
    // 发送时间
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
  }
  
  return result;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: WxwMsgInput,
) {
  
  const [
    errcodeDict, // 发送状态
  ] = await getDict([
    "wxw_msg_errcode",
  ]);
  
  // 企微应用
  if (isNotEmpty(input.wxw_app_id_lbl) && input.wxw_app_id === undefined) {
    input.wxw_app_id_lbl = String(input.wxw_app_id_lbl).trim();
    const wxw_appModel = await wxw_appDao.findOne({ lbl: input.wxw_app_id_lbl });
    if (wxw_appModel) {
      input.wxw_app_id = wxw_appModel.id;
    }
  }
  
  // 发送状态
  if (isNotEmpty(input.errcode_lbl) && input.errcode === undefined) {
    const val = errcodeDict.find((itemTmp) => itemTmp.lbl === input.errcode_lbl)?.val;
    if (val !== undefined) {
      input.errcode = val;
    }
  }
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments(): Promise<WxwMsgFieldComment> {
  const n = initN(route_path);
  const fieldComments: WxwMsgFieldComment = {
    id: await n("ID"),
    wxw_app_id: await n("企微应用"),
    wxw_app_id_lbl: await n("企微应用"),
    errcode: await n("发送状态"),
    errcode_lbl: await n("发送状态"),
    touser: await n("成员ID"),
    title: await n("标题"),
    description: await n("描述"),
    btntxt: await n("按钮文字"),
    create_time: await n("发送时间"),
    create_time_lbl: await n("发送时间"),
    errmsg: await n("错误信息"),
  };
  return fieldComments;
}

/**
 * 通过唯一约束获得数据列表
 * @param {WxwMsgInput} search0
 */
export async function findByUnique(
  search0: WxwMsgInput,
  options?: {
  },
): Promise<WxwMsgModel[]> {
  if (search0.id) {
    const model = await findOne({
      id: search0.id,
    });
    if (!model) {
      return [ ];
    }
    return [ model ];
  }
  const models: WxwMsgModel[] = [ ];
  return models;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {WxwMsgModel} oldModel
 * @param {WxwMsgInput} input
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: WxwMsgModel,
  input: WxwMsgInput,
): boolean {
  if (!oldModel || !input) {
    return false;
  }
  return false;
}

/**
 * 通过唯一约束检查数据是否已经存在
 * @param {WxwMsgInput} input
 * @param {WxwMsgModel} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<string>}
 */
export async function checkByUnique(
  input: WxwMsgInput,
  oldModel: WxwMsgModel,
  uniqueType: UniqueType = UniqueType.Throw,
  options?: {
  },
): Promise<string | undefined> {
  const isEquals = equalsByUnique(oldModel, input);
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {
      throw new UniqueException(await ns("数据已经存在"));
    }
    if (uniqueType === UniqueType.Update) {
      const result = await updateById(
        oldModel.id,
        {
          ...input,
          id: undefined,
        },
        {
          ...options,
        },
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
 * @param {WxwMsgSearch} search?
 */
export async function findOne(
  search?: WxwMsgSearch,
  sort?: SortInput | SortInput[],
  options?: {
  },
): Promise<WxwMsgModel | undefined> {
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  const models = await findAll(search, page, sort);
  const model = models[0];
  return model;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
export async function findById(
  id?: string | null,
  options?: {
  },
): Promise<WxwMsgModel | undefined> {
  if (isEmpty(id)) {
    return;
  }
  const model = await findOne({ id });
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {WxwMsgSearch} search?
 */
export async function exist(
  search?: WxwMsgSearch,
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
  const table = "wxwork_wxw_msg";
  const method = "existById";
  
  if (isEmpty(id)) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = `
    select
      1 e
    from
      wxwork_wxw_msg t
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

/** 校验记录是否存在 */
export async function validateOption(
  model?: WxwMsgModel,
) {
  if (!model) {
    throw `${ await ns("企微消息") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: WxwMsgInput,
) {
  const fieldComments = await getFieldComments();
  
  // ID
  await validators.chars_max_length(
    input.id,
    22,
    fieldComments.id,
  );
  
  // 企微应用
  await validators.chars_max_length(
    input.wxw_app_id,
    22,
    fieldComments.wxw_app_id,
  );
  
  // 发送状态
  await validators.chars_max_length(
    input.errcode,
    5,
    fieldComments.errcode,
  );
  
  // 成员ID
  await validators.chars_max_length(
    input.touser,
    256,
    fieldComments.touser,
  );
  
  // 标题
  await validators.chars_max_length(
    input.title,
    64,
    fieldComments.title,
  );
  
  // 描述
  await validators.chars_max_length(
    input.description,
    256,
    fieldComments.description,
  );
  
  // 按钮文字
  await validators.chars_max_length(
    input.btntxt,
    4,
    fieldComments.btntxt,
  );
  
  // 错误信息
  await validators.chars_max_length(
    input.errmsg,
    256,
    fieldComments.errmsg,
  );
  
}

/**
 * 创建数据
 * @param {WxwMsgInput} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<string>} 
 */
export async function create(
  input: WxwMsgInput,
  options?: {
    uniqueType?: UniqueType;
  },
): Promise<string> {
  const table = "wxwork_wxw_msg";
  const method = "create";
  
  if (input.id) {
    throw new Error(`Can not set id when create in dao: ${ table }`);
  }
  
  await setIdByLbl(input);
  
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
  
  while (true) {
    input.id = shortUuidV4();
    const isExist = await existById(input.id);
    if (!isExist) {
      break;
    }
    error(`ID_COLLIDE: ${ table } ${ input.id }`);
  }
  
  const args = new QueryArgs();
  let sql = `
    insert into wxwork_wxw_msg(
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
  if (input.wxw_app_id !== undefined) {
    sql += `,wxw_app_id`;
  }
  if (input.errcode !== undefined) {
    sql += `,errcode`;
  }
  if (input.touser !== undefined) {
    sql += `,touser`;
  }
  if (input.title !== undefined) {
    sql += `,title`;
  }
  if (input.description !== undefined) {
    sql += `,description`;
  }
  if (input.url !== undefined) {
    sql += `,url`;
  }
  if (input.btntxt !== undefined) {
    sql += `,btntxt`;
  }
  if (input.errmsg !== undefined) {
    sql += `,errmsg`;
  }
  if (input.msgid !== undefined) {
    sql += `,msgid`;
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
  if (input.create_usr_id != null && input.create_usr_id !== "-") {
    sql += `,${ args.push(input.create_usr_id) }`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,${ args.push(authModel.id) }`;
    }
  }
  if (input.update_usr_id != null && input.update_usr_id !== "-") {
    sql += `,${ args.push(input.update_usr_id) }`;
  } else {
    const authModel = await getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,${ args.push(authModel.id) }`;
    }
  }
  if (input.wxw_app_id !== undefined) {
    sql += `,${ args.push(input.wxw_app_id) }`;
  }
  if (input.errcode !== undefined) {
    sql += `,${ args.push(input.errcode) }`;
  }
  if (input.touser !== undefined) {
    sql += `,${ args.push(input.touser) }`;
  }
  if (input.title !== undefined) {
    sql += `,${ args.push(input.title) }`;
  }
  if (input.description !== undefined) {
    sql += `,${ args.push(input.description) }`;
  }
  if (input.url !== undefined) {
    sql += `,${ args.push(input.url) }`;
  }
  if (input.btntxt !== undefined) {
    sql += `,${ args.push(input.btntxt) }`;
  }
  if (input.errmsg !== undefined) {
    sql += `,${ args.push(input.errmsg) }`;
  }
  if (input.msgid !== undefined) {
    sql += `,${ args.push(input.msgid) }`;
  }
  sql += `)`;
  const res = await execute(sql, args);
  log(JSON.stringify(res));
  
  return input.id;
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
  const table = "wxwork_wxw_msg";
  const method = "updateTenantById";
  
  const tenantExist = await existByIdTenant(tenant_id);
  if (!tenantExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = `
    update
      wxwork_wxw_msg
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
 * 根据id修改一行数据
 * @param {string} id
 * @param {WxwMsgInput} input
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
  input: WxwMsgInput,
  options?: {
    uniqueType?: "ignore" | "throw";
  },
): Promise<string> {
  const table = "wxwork_wxw_msg";
  const method = "updateById";
  
  if (!id) {
    throw new Error("updateById: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateById: input cannot be null");
  }
  
  // 修改租户id
  if (isNotEmpty(input.tenant_id)) {
    await updateTenantById(id, input.tenant_id);
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
    update wxwork_wxw_msg set
  `;
  let updateFldNum = 0;
  if (input.wxw_app_id !== undefined) {
    if (input.wxw_app_id != oldModel.wxw_app_id) {
      sql += `wxw_app_id = ${ args.push(input.wxw_app_id) },`;
      updateFldNum++;
    }
  }
  if (input.errcode !== undefined) {
    if (input.errcode != oldModel.errcode) {
      sql += `errcode = ${ args.push(input.errcode) },`;
      updateFldNum++;
    }
  }
  if (input.touser !== undefined) {
    if (input.touser != oldModel.touser) {
      sql += `touser = ${ args.push(input.touser) },`;
      updateFldNum++;
    }
  }
  if (input.title !== undefined) {
    if (input.title != oldModel.title) {
      sql += `title = ${ args.push(input.title) },`;
      updateFldNum++;
    }
  }
  if (input.description !== undefined) {
    if (input.description != oldModel.description) {
      sql += `description = ${ args.push(input.description) },`;
      updateFldNum++;
    }
  }
  if (input.url !== undefined) {
    if (input.url != oldModel.url) {
      sql += `url = ${ args.push(input.url) },`;
      updateFldNum++;
    }
  }
  if (input.btntxt !== undefined) {
    if (input.btntxt != oldModel.btntxt) {
      sql += `btntxt = ${ args.push(input.btntxt) },`;
      updateFldNum++;
    }
  }
  if (input.errmsg !== undefined) {
    if (input.errmsg != oldModel.errmsg) {
      sql += `errmsg = ${ args.push(input.errmsg) },`;
      updateFldNum++;
    }
  }
  if (input.msgid !== undefined) {
    if (input.msgid != oldModel.msgid) {
      sql += `msgid = ${ args.push(input.msgid) },`;
      updateFldNum++;
    }
  }
  if (updateFldNum > 0) {
    if (input.update_usr_id && input.update_usr_id !== "-") {
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
 * 根据 ids 删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: string[],
  options?: {
  },
): Promise<number> {
  const table = "wxwork_wxw_msg";
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
    const sql = `
      update
        wxwork_wxw_msg
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
 * 根据 ids 还原数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: string[],
  options?: {
  },
): Promise<number> {
  const table = "wxwork_wxw_msg";
  const method = "revertByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const args = new QueryArgs();
    const sql = `
      update
        wxwork_wxw_msg
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
  const table = "wxwork_wxw_msg";
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
          wxwork_wxw_msg
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = `
      delete from
        wxwork_wxw_msg
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
