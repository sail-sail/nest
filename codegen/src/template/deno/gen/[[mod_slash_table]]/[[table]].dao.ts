<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasPassword = columns.some((column) => column.isPassword);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasEnabled = columns.some((column) => column.COLUMN_NAME === "is_enabled");
const hasDefault = columns.some((column) => column.COLUMN_NAME === "is_default");
const hasOrgId = columns.some((column) => column.COLUMN_NAME === "org_id");
const hasVersion = columns.some((column) => column.COLUMN_NAME === "version");
let Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
let modelName = "";
let fieldCommentName = "";
let inputName = "";
let searchName = "";
if (/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 1))
  && !/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 2))
) {
  Table_Up = Table_Up.substring(0, Table_Up.length - 1) + Table_Up.substring(Table_Up.length - 1).toUpperCase();
  modelName = Table_Up + "model";
  fieldCommentName = Table_Up + "fieldComment";
  inputName = Table_Up + "input";
  searchName = Table_Up + "search";
} else {
  modelName = Table_Up + "Model";
  fieldCommentName = Table_Up + "FieldComment";
  inputName = Table_Up + "Input";
  searchName = Table_Up + "Search";
}
const hasDict = columns.some((column) => {
  if (column.ignoreCodegen) {
    return false;
  }
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") {
    return false;
  }
  return column.dict;
});
const hasDictbiz = columns.some((column) => {
  if (column.ignoreCodegen) {
    return false;
  }
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") {
    return false;
  }
  return column.dictbiz;
});
const hasMany2many = columns.some((column) => {
  if (column.ignoreCodegen) {
    return false;
  }
  const foreignKey = column.foreignKey;
  if (foreignKey && foreignKey.type === "many2many") {
    return true;
  }
  return false;
});
const hasForeignJson = columns.some((column) => {
  if (column.ignoreCodegen) {
    return false;
  }
  const foreignKey = column.foreignKey;
  if (foreignKey && foreignKey.type === "json") {
    return true;
  }
  return false;
});
#><#
const hasSummary = columns.some((column) => column.showSummary);
#>// deno-lint-ignore-file no-explicit-any prefer-const no-unused-vars ban-types
import {
  escapeId,
  escape,
} from "sqlstring";

import dayjs from "dayjs";<#
let hasDecimal = false;
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
  if (column.noList) continue;
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") continue;
  if (column_name === "version") continue;
  const foreignKey = column.foreignKey;
  let data_type = column.DATA_TYPE;
  let column_type = column.COLUMN_TYPE;
  if (!column_type) {
    continue;
  }
  if (!column_type.startsWith("decimal")) {
    continue;
  }
  hasDecimal = true;
}
#><#
if (hasDecimal) {
#>

import Decimal from "decimal.js";<#
}
#>

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
} from "/lib/util/object_util.ts";<#
  if (hasDict) {
#>

import * as dictSrcDao from "/src/base/dict_detail/dict_detail.dao.ts";<#
  }
#><#
  if (hasDictbiz) {
#>

import * as dictbizSrcDao from "/src/base/dictbiz_detail/dictbiz_detail.dao.ts";<#
  }
#>

import { UniqueException } from "/lib/exceptions/unique.execption.ts";

import * as authDao from "/lib/auth/auth.dao.ts";<#
if (hasTenant_id) {
#>

import * as usrDaoSrc from "/src/base/usr/usr.dao.ts";

import * as tenantDao from "/gen/base/tenant/tenant.dao.ts";<#
}
#><#
if (hasOrgId) {
#>

import * as orgDao from "/gen/base/org/org.dao.ts";<#
}
#><#
if (hasMany2many) {
#>

import {
  many2manyUpdate,
} from "/lib/util/dao_util.ts";<#
}
#><#
if (hasForeignJson) {
#>

import {
  setModelIds,
} from "/lib/util/dao_util.ts";<#
}
#>

import {
  SortOrderEnum,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type <#=inputName#>,
  type <#=modelName#>,
  type <#=searchName#>,
} from "./<#=table#>.model.ts";<#
if (hasSummary) {
#>

import {
  type <#=Table_Up#>Summary,
} from "/gen/types.ts";<#
}
#><#
const hasImportDaos = [ ];
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") continue;
  if (column_name === "create_usr_id"
    || column_name === "update_usr_id"
  ) {
    continue;
  }
  let data_type = column.DATA_TYPE;
  let column_type = column.COLUMN_TYPE;
  let column_comment = column.COLUMN_COMMENT || "";
  let selectList = [ ];
  let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
  if (selectStr) {
    selectList = eval(`(${ selectStr })`);
  }
  if (column_comment.indexOf("[") !== -1) {
    column_comment = column_comment.substring(0, column_comment.indexOf("["));
  }
  const foreignKey = column.foreignKey;
  const foreignTable = foreignKey && foreignKey.table;
  const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  const many2many = column.many2many;
  const isPassword = column.isPassword;
  const isVirtual = column.isVirtual;
  if (isVirtual) continue;
#><#
  if (foreignKey && foreignKey.type !== "many2many" && !foreignKey.multiple) {
    if (foreignTable === table) {
      continue;
    }
    if (hasImportDaos.includes(foreignTable)) continue;
    hasImportDaos.push(foreignTable);
#>

import * as <#=foreignTable#>Dao from "/gen/<#=foreignKey.mod#>/<#=foreignTable#>/<#=foreignTable#>.dao.ts";<#
  }
#><#
}
#>

async function getWhereQuery(
  args: QueryArgs,
  search?: <#=searchName#>,
  options?: {
  },
) {
  let whereQuery = "";
  whereQuery += ` t.is_deleted = ${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;<#
  if (hasTenant_id) {
  #>
  if (search?.tenant_id == null) {
    const authModel = await authDao.getAuthModel();
    const tenant_id = await usrDaoSrc.getTenant_id(authModel?.id);
    if (tenant_id) {
      whereQuery += ` and t.tenant_id = ${ args.push(tenant_id) }`;
    }
  } else if (isNotEmpty(search?.tenant_id) && search?.tenant_id !== "-") {
    whereQuery += ` and t.tenant_id = ${ args.push(search.tenant_id) }`;
  }<#
  }
  #><#
  if (hasOrgId) {
  #>
  if (search?.org_id == null) {
    const authModel = await authDao.getAuthModel();
    const org_id = authModel?.org_id;
    if (org_id) {
      whereQuery += ` and t.org_id = ${ args.push(org_id) }`;
    }
  } else if (isNotEmpty(search?.org_id) && search?.org_id !== "-") {
    whereQuery += ` and t.org_id = ${ args.push(search.org_id) }`;
  }<#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    let data_type = column.DATA_TYPE;
    let column_type = column.DATA_TYPE;
    let column_comment = column.COLUMN_COMMENT || "";
    const isPassword = column.isPassword;
    if (isPassword) {
      continue;
    }
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  #><#
    if (foreignKey) {
      if (foreignKey.type !== "many2many") {
  #>
  if (search?.<#=column_name#> && !Array.isArray(search?.<#=column_name#>)) {
    search.<#=column_name#> = [ search.<#=column_name#> ];
  }
  if (search?.<#=column_name#> && search?.<#=column_name#>.length > 0) {
    whereQuery += ` and <#=column_name#>_lbl.id in ${ args.push(search.<#=column_name#>) }`;
  }
  if (search?.<#=column_name#> === null) {
    whereQuery += ` and <#=column_name#>_lbl.id is null`;
  }
  if (search?.<#=column_name#>_is_null) {
    whereQuery += ` and <#=column_name#>_lbl.id is null`;
  }<#
      } else if (foreignKey.type === "many2many") {
  #>
  if (search?.<#=column_name#> && !Array.isArray(search?.<#=column_name#>)) {
    search.<#=column_name#> = [ search.<#=column_name#> ];
  }
  if (search?.<#=column_name#> && search?.<#=column_name#>.length > 0) {
    whereQuery += ` and <#=foreignKey.mod#>_<#=foreignKey.table#>.id in ${ args.push(search.<#=column_name#>) }`;
  }
  if (search?.<#=column_name#> === null) {
    whereQuery += ` and <#=foreignKey.mod#>_<#=foreignKey.table#>.id is null`;
  }
  if (search?.<#=column_name#>_is_null) {
    whereQuery += ` and <#=foreignKey.mod#>_<#=foreignKey.table#>.id is null`;
  }<#
    }
  #><#
    } else if ((selectList && selectList.length > 0) || column.dict || column.dictbiz) {
  #>
  if (search?.<#=column_name#> && !Array.isArray(search?.<#=column_name#>)) {
    search.<#=column_name#> = [ search.<#=column_name#> ];
  }
  if (search?.<#=column_name#> && search?.<#=column_name#>?.length > 0) {
    whereQuery += ` and t.<#=column_name#> in ${ args.push(search.<#=column_name#>) }`;
  }<#
    } else if (column_name === "id") {
  #>
  if (isNotEmpty(search?.<#=column_name#>)) {
    whereQuery += ` and t.<#=column_name#> = ${ args.push(search?.<#=column_name#>) }`;
  }
  if (search?.ids && !Array.isArray(search?.ids)) {
    search.ids = [ search.ids ];
  }
  if (search?.ids && search?.ids.length > 0) {
    whereQuery += ` and t.id in ${ args.push(search.ids) }`;
  }<#
  } else if (data_type === "int" && column_name.startsWith("is_")) {
  #>
  if (isNotEmpty(search?.<#=column_name#>)) {
    whereQuery += ` and t.<#=column_name#> = ${ args.push(search?.<#=column_name#>) }`;
  }<#
    } else if (data_type === "int" || data_type === "decimal" || data_type === "double" || data_type === "datetime" || data_type === "date") {
  #>
  if (search?.<#=column_name#> && search?.<#=column_name#>?.length > 0) {
    if (search.<#=column_name#>[0] != null) {
      whereQuery += ` and t.<#=column_name#> >= ${ args.push(search.<#=column_name#>[0]) }`;
    }
    if (search.<#=column_name#>[1] != null) {
      whereQuery += ` and t.<#=column_name#> <= ${ args.push(search.<#=column_name#>[1]) }`;
    }
  }<#
  } else if (data_type === "tinyint") {
  #>
  if (isNotEmpty(search?.<#=column_name#>)) {
    whereQuery += ` and t.<#=column_name#> = ${ args.push(search?.<#=column_name#>) }`;
  }<#
    } else {
  #>
  if (search?.<#=column_name#> !== undefined) {
    whereQuery += ` and t.<#=column_name#> = ${ args.push(search.<#=column_name#>) }`;
  }
  if (search?.<#=column_name#> === null) {
    whereQuery += ` and t.<#=column_name#> is null`;
  }
  if (isNotEmpty(search?.<#=column_name#>_like)) {
    whereQuery += ` and t.<#=column_name#> like ${ args.push(sqlLike(search?.<#=column_name#>_like) + "%") }`;
  }<#
    }
  #><#
  }
  #>
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
    <#=mod#>_<#=table#> t<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column.isVirtual && column_name !== "org_id") continue;
      const foreignKey = column.foreignKey;
      let data_type = column.DATA_TYPE;
      if (!foreignKey) continue;
      const foreignTable = foreignKey.table;
      const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const many2many = column.many2many;
    #><#
      if (foreignKey && foreignKey.type === "many2many") {
    #>
    left join <#=many2many.mod#>_<#=many2many.table#>
      on <#=many2many.mod#>_<#=many2many.table#>.<#=many2many.column1#> = t.id
      and <#=many2many.mod#>_<#=many2many.table#>.is_deleted = 0
    left join <#=foreignKey.mod#>_<#=foreignTable#>
      on <#=many2many.mod#>_<#=many2many.table#>.<#=many2many.column2#> = <#=foreignKey.mod#>_<#=foreignTable#>.<#=foreignKey.column#>
      and <#=foreignKey.mod#>_<#=foreignTable#>.is_deleted = 0
    left join (
      select
        json_arrayagg(<#=foreignKey.mod#>_<#=foreignTable#>.id) <#=column_name#>,<#
          if (foreignKey.lbl) {
        #>
        json_arrayagg(<#=foreignKey.mod#>_<#=foreignTable#>.<#=foreignKey.lbl#>) <#=column_name#>_lbl,<#
          }
        #>
        <#=mod#>_<#=table#>.id <#=many2many.column1#>
      from <#=foreignKey.mod#>_<#=many2many.table#>
      inner join <#=foreignKey.mod#>_<#=foreignKey.table#>
        on <#=foreignKey.mod#>_<#=foreignKey.table#>.<#=foreignKey.column#> = <#=many2many.mod#>_<#=many2many.table#>.<#=many2many.column2#>
        and <#=foreignKey.mod#>_<#=foreignKey.table#>.is_deleted = 0
      inner join <#=mod#>_<#=table#>
        on <#=mod#>_<#=table#>.id = <#=many2many.mod#>_<#=many2many.table#>.<#=many2many.column1#>
      where
        <#=many2many.mod#>_<#=many2many.table#>.is_deleted = 0
      group by <#=many2many.column1#>
    ) _<#=foreignTable#>
      on _<#=foreignTable#>.<#=many2many.column1#> = t.id<#
      } else if (foreignKey && !foreignKey.multiple) {
    #>
    left join <#=foreignKey.mod#>_<#=foreignTable#> <#=column_name#>_lbl
      on <#=column_name#>_lbl.<#=foreignKey.column#> = t.<#=column_name#><#
      }
    #><#
    }
    #>
  `;
  return fromQuery;
}

/**
 * 根据条件查找总数据数
 * @param { <#=searchName#> } search?
 * @return {Promise<number>}
 */
export async function findCount(
  search?: <#=searchName#>,
  options?: {
  },
): Promise<number> {
  const table = "<#=mod#>_<#=table#>";
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
  `;<#
  if (cache) {
  #>
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = JSON.stringify({ sql, args });<#
  }
  #>
  
  interface Result {
    total: number,
  }
  const model = await queryOne<Result>(sql, args<#
  if (cache) {
  #>, { cacheKey1, cacheKey2 }<#
  }
  #>);
  let result = model?.total || 0;
  
  return result;
}

/**
 * 根据搜索条件和分页查找数据
 * @param {<#=searchName#>} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
export async function findAll(
  search?: <#=searchName#>,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
  },
) {
  const table = "<#=mod#>_<#=table#>";
  const method = "findAll";
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    select t.*<#
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.ignoreCodegen) continue;
        const column_name = column.COLUMN_NAME;
        if (column.isVirtual && column_name !== "org_id") continue;
        const foreignKey = column.foreignKey;
        let data_type = column.DATA_TYPE;
        if (!foreignKey) continue;
        const foreignTable = foreignKey.table;
        const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
        const many2many = column.many2many;
      #><#
        if (foreignKey && foreignKey.type === "many2many") {
      #>
      ,max(<#=column_name#>) <#=column_name#>
      ,max(<#=column_name#>_lbl) <#=column_name#>_lbl<#
      } else if (foreignKey && !foreignKey.multiple && foreignKey.lbl) {
      #>
      ,<#=column_name#>_lbl.<#=foreignKey.lbl#> <#=column_name#>_lbl<#
        }
      #><#
      }
      #>
    from
      ${ getFromQuery() }
    where
      ${ await getWhereQuery(args, search, options) }
    group by t.id
  `;<#
  if (defaultSort) {
  #>
  
  // 排序
  if (!sort) {
    sort = [
      {
        prop: "<#=defaultSort.prop#>",
        order: <#=(defaultSort.order || "asc").startsWith("asc") ? "SortOrderEnum.Asc" : "SortOrderEnum.Desc"#>,
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
  }<#
  } else {
  #>
  
  // 排序
  if (!sort) {
    sort = [ ];
  } else if (!Array.isArray(sort)) {
    sort = [ sort ];
  }
  sort = sort.filter((item) => item?.prop);
  for (let i = 0; i < sort.length; i++) {
    const item = sort[i];
    if (i === 0) {
      sql += ` order by`;
    } else {
      sql += `,`;
    }
    sql += ` ${ escapeId(item.prop) } ${ escapeDec(item.order) }`;
  }<#
  }
  #>
  
  // 分页
  if (page?.pgSize) {
    sql += ` limit ${ Number(page?.pgOffset) || 0 },${ Number(page.pgSize) }`;
  }<#
  if (cache) {
  #>
  
  // 缓存
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = JSON.stringify({ sql, args });<#
  }
  #>
  
  const result = await query<<#=modelName#>>(
    sql,
    args,<#
    if (cache) {
    #>
    {
      cacheKey1,
      cacheKey2,
    },<#
    }
  #>
  );<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    let data_type = column.DATA_TYPE;
    let column_type = column.COLUMN_TYPE;
    let column_comment = column.COLUMN_COMMENT || "";
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const many2many = column.many2many;
  #><#
    if (foreignKey && foreignKey.type === "json") {
  #>
  await setModelIds(result, [ { table: "<#=foreignTable#>", fld: "<#=column_name#>"<#
    if (foreignKey.lbl) {
  #>, lbl: "<#=foreignKey.lbl#>"<#
    }
  #> } ]);<#
    } else if (foreignKey && foreignKey.type === "many2many") {
  #><#
    } else if (!foreignKey) {
  #><#
    } else {
  #><#
    }
  #><#
  }
  #><#
  if (hasDict) {
  #>
  
  const [<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      let column_comment = column.COLUMN_COMMENT || "";
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
    #><#
      if (column.dict) {
    #>
    <#=column_name#>Dict, // <#=column_comment#><#
      }
    #><#
    }
    #>
  ] = await dictSrcDao.getDict([<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      let column_comment = column.COLUMN_COMMENT || "";
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
    #><#
      if (column.dict) {
    #>
    "<#=column.dict#>",<#
      }
    #><#
    }
    #>
  ]);
  <#
  }
  #><#
  if (hasDictbiz) {
  #>
  
  const [<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      let column_comment = column.COLUMN_COMMENT || "";
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
    #><#
      if (column.dictbiz) {
    #>
    <#=column_name#>Dict, // <#=column_comment#><#
      }
    #><#
    }
    #>
  ] = await dictbizSrcDao.getDictbiz([<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      let column_comment = column.COLUMN_COMMENT || "";
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
    #><#
      if (column.dictbiz) {
    #>
    "<#=column.dictbiz#>",<#
      }
    #><#
    }
    #>
  ]);
  <#
  }
  #>
  for (let i = 0; i < result.length; i++) {
    const model = result[i];<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      let data_type = column.DATA_TYPE;
      let column_type = column.COLUMN_TYPE;
      let column_comment = column.COLUMN_COMMENT || "";
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const many2many = column.many2many;
      const isPassword = column.isPassword;
    #><#
      if (column_type && column_type.startsWith("decimal")) {
    #>
    
    // <#=column_comment#>
    if (model.<#=column_name#> != null) {
      model.<#=column_name#> = new Decimal(model.<#=column_name#>);
    }<#
      }
    #><#
      if (foreignKey && foreignKey.type === "json") {
    #><#
      } else if (isPassword) {
    #>
    // <#=column_comment#>
    model.<#=column_name#> = "";<#
      } else if (selectList.length > 0) {
    #>
    // <#=column_comment#>
    let <#=column_name#>_lbl = "";
    <#
    for (let i = 0; i < selectList.length; i++) {
      const item = selectList[i];
      let value = item.value;
      let label = item.label;
      if (typeof(value) === "string") {
        value = `"${ value }"`;
      } else if (typeof(value) === "number") {
        value = value.toString();
      }
    #><#=i>0?" else ":""#>if (model.<#=column_name#> === <#=value#>) {
      <#=column_name#>_lbl = "<#=label#>";
    }<#
    }
    #> else {
      <#=column_name#>_lbl = String(model.<#=column_name#>);
    }
    model.<#=column_name#>_lbl = <#=column_name#>_lbl;<#
      } else if ((column.dict || column.dictbiz) && ![ "int", "decimal", "tinyint" ].includes(data_type)) {
    #>
    
    // <#=column_comment#>
    let <#=column_name#>_lbl = model.<#=column_name#>;
    if (!isEmpty(model.<#=column_name#>)) {
      const dictItem = <#=column_name#>Dict.find((dictItem) => dictItem.val === model.<#=column_name#>);
      if (dictItem) {
        <#=column_name#>_lbl = dictItem.lbl;
      }
    }
    model.<#=column_name#>_lbl = <#=column_name#>_lbl;<#
      } else if ((column.dict || column.dictbiz) && [ "int", "decimal", "tinyint" ].includes(data_type)) {
    #>
    
    // <#=column_comment#>
    let <#=column_name#>_lbl = model.<#=column_name#>.toString();
    if (model.<#=column_name#> !== undefined && model.<#=column_name#> !== null) {
      const dictItem = <#=column_name#>Dict.find((dictItem) => dictItem.val === model.<#=column_name#>.toString());
      if (dictItem) {
        <#=column_name#>_lbl = dictItem.lbl;
      }
    }
    model.<#=column_name#>_lbl = <#=column_name#>_lbl;<#
      } else if (data_type === "datetime") {
    #>
    
    // <#=column_comment#>
    if (model.<#=column_name#>) {
      const <#=column_name#> = dayjs(model.<#=column_name#>);
      if (isNaN(<#=column_name#>.toDate().getTime())) {
        model.<#=column_name#>_lbl = (model.<#=column_name#> || "").toString();
      } else {
        model.<#=column_name#>_lbl = <#=column_name#>.format("YYYY-MM-DD HH:mm:ss");
      }
    } else {
      model.<#=column_name#>_lbl = "";
    }<#
      } else if (data_type === "date") {
    #>
    
    // <#=column_comment#>
    if (model.<#=column_name#>) {
      const <#=column_name#> = dayjs(model.<#=column_name#>);
      if (isNaN(<#=column_name#>.toDate().getTime())) {
        model.<#=column_name#>_lbl = (model.<#=column_name#> || "").toString();
      } else {
        model.<#=column_name#>_lbl = <#=column_name#>.format("YYYY-MM-DD");
      }
    } else {
      model.<#=column_name#>_lbl = "";
    }<#
      }
    #><#
    }
    #>
  }
  
  return result;
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments() {
  const n = initN("/<#=table#>");
  const fieldComments = {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      let data_type = column.DATA_TYPE;
      let column_type = column.COLUMN_TYPE;
      let column_comment = column.COLUMN_COMMENT || "";
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      const isPassword = column.isPassword;
      if (isPassword) continue;
      const foreignKey = column.foreignKey;
    #><#
      if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz
        || data_type === "datetime" || data_type === "date"
      ) {
    #>
    <#=column_name#>: await n("<#=column_comment#>"),<#
        if (!columns.some((item) => item.COLUMN_NAME === column_name + "_lbl")) {
    #>
    <#=column_name#>_lbl: await n("<#=column_comment#>"),<#
        }
    #><#
      } else {
    #>
    <#=column_name#>: await n("<#=column_comment#>"),<#
      }
    #><#
    }
    #>
  };
  return fieldComments;
}

/**
 * 通过唯一约束获得一行数据
 * @param {<#=searchName#> | PartialNull<<#=modelName#>>} search0
 */
export async function findByUnique(
  search0: <#=searchName#> | PartialNull<<#=modelName#>>,
  options?: {
  },
) {
  if (search0.id) {
    const model = await findOne({
      id: search0.id,
    });
    return model;
  }<#
  for (let i = 0; i < (opts.uniques || [ ]).length; i++) {
    const uniques = opts.uniques[i];
  #>
  {
    const model = await findOne({<#
      for (let k = 0; k < uniques.length; k++) {
        const unique = uniques[k];
      #>
      <#=unique#>: search0.<#=unique#>,<#
      }
      #>
    });
    if (model) {
      return model;
    }
  }<#
  }
  #>
  return;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {<#=modelName#>} oldModel
 * @param {PartialNull<<#=modelName#>>} model
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: <#=modelName#>,
  model: PartialNull<<#=modelName#>>,
): boolean {
  if (!oldModel || !model) {
    return false;
  }<#
  for (let i = 0; i < (opts.uniques || [ ]).length; i++) {
    const uniques = opts.uniques[i];
  #>
  if (<#
    for (let k = 0; k < uniques.length; k++) {
      const unique = uniques[k];
    #>
    oldModel.<#=unique#> === model.<#=unique#><#=(k === uniques.length - 1) ? "" : " &&" #><#
    }
    #>
  ) {
    return true;
  }<#
  }
  #>
  return false;
}

/**
 * 通过唯一约束检查数据是否已经存在
 * @param {<#=inputName#>} model
 * @param {<#=modelName#>} oldModel
 * @param {("ignore" | "throw" | "update")} uniqueType
 * @return {Promise<string>}
 */
export async function checkByUnique(
  model: <#=inputName#>,
  oldModel: <#=modelName#>,
  uniqueType: "ignore" | "throw" | "update" = "throw",
  options?: {
  },
): Promise<string | undefined> {
  const isEquals = equalsByUnique(oldModel, model);
  if (isEquals) {
    if (uniqueType === "throw") {
      throw new UniqueException(await ns("数据已经存在"));
    }
    if (uniqueType === "update") {
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
    if (uniqueType === "ignore") {
      return;
    }
  }
  return;
}<#
if (hasSummary) {
#>

/**
 * 根据搜索条件查找合计
 * @param {<#=searchName#>} search? 搜索条件
 * @return {Promise<<#=Table_Up#>Summary>}
 */
export async function findSummary(
  search?: <#=searchName#>,
  options?: {
  },
): Promise<<#=Table_Up#>Summary> {
  const table = "<#=mod#>_<#=table#>";
  const method = "findSummary";<#
  const findSummaryColumns = [ ];
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    if (column.showSummary) {
      findSummaryColumns.push(column);
    }
  }
  #>
  
  const args = new QueryArgs();
  let sql = `
    select<#
      for (let i = 0; i < findSummaryColumns.length; i++) {
        const column = findSummaryColumns[i];
        const column_name = column.COLUMN_NAME;
      #>
      sum(t.<#=column_name#>) <#=column_name#><#
        if (i !== findSummaryColumns.length - 1) {
      #>,<#
        }
      #><#
      }
      #>
    from
      ${ getFromQuery() }
    where
      ${ await getWhereQuery(args, search, options) }
  `;
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = JSON.stringify({ sql, args });
  
  const model = (await queryOne<<#=Table_Up#>Summary>(sql, args, { cacheKey1, cacheKey2 }))!;
  
  return model;
}<#
}
#>

/**
 * 根据条件查找第一条数据
 * @param {<#=searchName#>} search?
 */
export async function findOne(
  search?: <#=searchName#>,
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
 * @param {<#=searchName#>} search?
 */
export async function exist(
  search?: <#=searchName#>,
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
  const table = "<#=mod#>_<#=table#>";
  const method = "existById";
  
  if (isEmpty(id)) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = /*sql*/ `
    select
      1 e
    from
      <#=mod#>_<#=table#> t
    where
      t.id = ${ args.push(id) }
      and t.is_deleted = 0
    limit 1
  `;<#
  if (cache) {
  #>
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = JSON.stringify({ sql, args });<#
  }
  #>
  
  interface Result {
    e: number,
  }
  let model = await queryOne<Result>(
    sql,
    args,<#
    if (cache) {
    #>{ cacheKey1, cacheKey2 },<#
    }
    #>
  );
  let result = !!model?.e;
  
  return result;
}

/**
 * 创建数据
 * @param {<#=inputName#>} model
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<string>} 
 */
export async function create(
  model: <#=inputName#>,
  options?: {
    uniqueType?: "ignore" | "throw" | "update";
  },
): Promise<string> {
  const table = "<#=mod#>_<#=table#>";
  const method = "create";<#
  if (hasDict) {
  #>
  
  const [<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      let column_comment = column.COLUMN_COMMENT || "";
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
    #><#
      if (column.dict) {
    #>
    <#=column_name#>Dict, // <#=column_comment#><#
      }
    #><#
    }
    #>
  ] = await dictSrcDao.getDict([<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      let column_comment = column.COLUMN_COMMENT || "";
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
    #><#
      if (column.dict) {
    #>
    "<#=column.dict#>",<#
      }
    #><#
    }
    #>
  ]);<#
  }
  #><#
  if (hasDictbiz) {
  #>
  
  const [<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      let column_comment = column.COLUMN_COMMENT || "";
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
    #><#
      if (column.dictbiz) {
    #>
    <#=column_name#>Dict, // <#=column_comment#><#
      }
    #><#
    }
    #>
  ] = await dictbizSrcDao.getDictbiz([<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      let column_comment = column.COLUMN_COMMENT || "";
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
    #><#
      if (column.dictbiz) {
    #>
    "<#=column.dictbiz#>",<#
      }
    #><#
    }
    #>
  ]);<#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if ([ "id", "create_usr_id", "create_time", "update_usr_id", "update_time" ].includes(column_name)) continue;
    let data_type = column.DATA_TYPE;
    let column_type = column.COLUMN_TYPE;
    let column_comment = column.COLUMN_COMMENT || "";
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const many2many = column.many2many;
    const isPassword = column.isPassword;
    const isVirtual = column.isVirtual;
    if (isVirtual) continue;
  #><#
    if (selectList.length > 0) {
  #>
  
  // <#=column_comment#>
  if (isNotEmpty(model.<#=column_name#>_lbl) && model.<#=column_name#> === undefined) {
    model.<#=column_name#>_lbl = String(model.<#=column_name#>_lbl).trim();<#
      for (let i = 0; i < selectList.length; i++) {
        const item = selectList[i];
        let value = item.value;
        let label = item.label;
        if (typeof(value) === "string") {
          value = `"${ value }"`;
        } else if (typeof(value) === "number") {
          value = value.toString();
        }
    #><#=i>0?" else ":"\n      "#>if (model.<#=column_name#>_lbl === "<#=label#>") {
      model.<#=column_name#> = <#=value#>;
    }<#
      }
    #>
  }<#
    } else if ((column.dict || column.dictbiz) && ![ "int", "decimal", "tinyint" ].includes(data_type)) {
  #>
  
  // <#=column_comment#>
  if (isNotEmpty(model.<#=column_name#>_lbl) && model.<#=column_name#> === undefined) {
    const val = <#=column_name#>Dict.find((itemTmp) => itemTmp.lbl === model.<#=column_name#>_lbl)?.val;
    if (val !== undefined) {
      model.<#=column_name#> = val;
    }
  }<#
    } else if ((column.dict || column.dictbiz) && [ "int", "decimal", "tinyint" ].includes(data_type)) {
  #>
  
  // <#=column_comment#>
  if (isNotEmpty(model.<#=column_name#>_lbl) && model.<#=column_name#> === undefined) {
    const val = <#=column_name#>Dict.find((itemTmp) => itemTmp.lbl === model.<#=column_name#>_lbl)?.val;
    if (val !== undefined) {
      model.<#=column_name#> = Number(val);
    }
  }<#
    } else if (foreignKey && foreignKey.type !== "many2many" && !foreignKey.multiple && foreignKey.lbl) {
      let daoStr = "";
      if (foreignTable !== table) {
        daoStr = `${ foreignTable }Dao.`;
      }
  #>
  
  // <#=column_comment#>
  if (isNotEmpty(model.<#=column_name#>_lbl) && model.<#=column_name#> === undefined) {
    model.<#=column_name#>_lbl = String(model.<#=column_name#>_lbl).trim();
    const <#=foreignTable#>Model = await <#=daoStr#>findOne({ <#=foreignKey.lbl#>: model.<#=column_name#>_lbl });
    if (<#=foreignTable#>Model) {
      model.<#=column_name#> = <#=foreignTable#>Model.id;
    }
  }<#
    } else if (foreignKey && (foreignKey.type === "many2many" || foreignKey.multiple) && foreignKey.lbl) {
  #>
  
  // <#=column_comment#>
  if (!model.<#=column_name#> && model.<#=column_name#>_lbl) {
    if (typeof model.<#=column_name#>_lbl === "string" || model.<#=column_name#>_lbl instanceof String) {
      model.<#=column_name#>_lbl = model.<#=column_name#>_lbl.split(",");
    }
    model.<#=column_name#>_lbl = model.<#=column_name#>_lbl.map((item: string) => item.trim());
    const args = new QueryArgs();
    const sql = /*sql*/ `
      select
        t.id
      from
        <#=foreignKey.mod#>_<#=foreignTable#> t
      where
        t.<#=foreignKey.lbl#> in ${ args.push(model.<#=column_name#>_lbl) }
    `;
    interface Result {
      id: string;
    }
    const models = await query<Result>(sql, args);
    model.<#=column_name#> = models.map((item: { id: string }) => item.id);
  }<#
  } else if (data_type === "date" || data_type === "datetime" || data_type === "timestamp") {
  #>
  
  // <#=column_comment#>
  if (isNotEmpty(model.<#=column_name#>_lbl) && model.<#=column_name#> === undefined) {
    model.<#=column_name#>_lbl = String(model.<#=column_name#>_lbl).trim();
    model.<#=column_name#> = model.<#=column_name#>_lbl;
  }<#
  }
  #><#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    let column_comment = column.COLUMN_COMMENT || "";
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    const redundLbl = column.redundLbl;
    if (!redundLbl) {
      continue;
    }
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    if (foreignTable) {
      continue;
    }
    const redundLblKeys = Object.keys(redundLbl);
    if (redundLblKeys.length === 0) {
      continue;
    }
  #><#
    if (column.dict) {
  #>
  
  // <#=column_comment#>
  if (model.<#=column_name#> != null) {
    const dictModel = <#=column_name#>Dict.find((itemTmp) => {
      return itemTmp.val === dictSrcDao.val2Str(model.<#=column_name#>, itemTmp.type as any);
    });<#
    for (const key of redundLblKeys) {
      const val = redundLbl[key];
    #>
    model.<#=val#> = dictModel?.<#=key#>;<#
    }
    #>
  }<#
    } else if (column.dictbiz) {
  #>
  
  // <#=column_comment#>
  if (model.<#=column_name#> != null) {
    const dictbizModel = <#=column_name#>Dict.find((itemTmp) => {
      return itemTmp.val === dictbizSrcDao.val2Str(model.<#=column_name#>, itemTmp.type as any);
    });<#
    for (const key of redundLblKeys) {
      const val = redundLbl[key];
    #>
    model.<#=val#> = dictbizModel?.<#=key#>;<#
    }
    #>
  }<#
    }
  #><#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    let column_comment = column.COLUMN_COMMENT || "";
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    const redundLbl = column.redundLbl;
    if (!redundLbl) {
      continue;
    }
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    if (!foreignTable) {
      continue;
    }
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const redundLblKeys = Object.keys(redundLbl);
    if (redundLblKeys.length === 0) {
      continue;
    }
  #>
  
  // <#=column_comment#>
  if (isNotEmpty(model.<#=column_name#>)) {
    const {
      findById: findById<#=foreignTableUp#>,
    } = await import("/gen/<#=foreignKey.mod#>/<#=foreignTable#>/<#=foreignTable#>.dao.ts");
    
    const <#=foreignTable#>Model = await findById<#=foreignTableUp#>(model.<#=column_name#>);
    if (<#=foreignTable#>Model) {<#
      for (const key of redundLblKeys) {
        const val = redundLbl[key];
      #>
      model.<#=val#> = <#=foreignTable#>Model.<#=key#>;<#
      }
      #>
    }
  }<#
  }
  #>
  
  const oldModel = await findByUnique(model, options);
  if (oldModel) {
    const result = await checkByUnique(model, oldModel, options?.uniqueType, options);
    if (result) {
      return result;
    }
  }<#
  if (mod === "base" && table === "role") {
  #>
  
  {
    const {
      filterMenuIdsByTenant,
    } = await import("/src/base/tenant/tenant.dao.ts");
    
    model.menu_ids = await filterMenuIdsByTenant(model.menu_ids);
  }<#
  }
  #>
  
  if (!model.id) {
    model.id = shortUuidV4();
  }
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    insert into <#=mod#>_<#=table#>(
      id
      ,create_time
  `;<#
  if (hasTenant_id) {
  #>
  if (model.tenant_id != null) {
    sql += `,tenant_id`;
  } else {
    const authModel = await authDao.getAuthModel();
    const tenant_id = await usrDaoSrc.getTenant_id(authModel?.id);
    if (tenant_id) {
      sql += `,tenant_id`;
    }
  }<#
  }
  #><#
  if (hasOrgId) {
  #>
  if (model.org_id != null) {
    sql += `,org_id`;
  } else {
    const authModel = await authDao.getAuthModel();
    if (authModel?.org_id) {
      sql += `,org_id`;
    }
  }<#
  }
  #>
  if (model.create_usr_id != null) {
    sql += `,create_usr_id`;
  } else {
    const authModel = await authDao.getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,create_usr_id`;
    }
  }<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    if (column_name === "create_usr_id") continue;
    if (column_name === "create_time") continue;
    let data_type = column.DATA_TYPE;
    let column_type = column.COLUMN_TYPE;
    let column_comment = column.COLUMN_COMMENT || "";
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const many2many = column.many2many;
  #><#
    if (column.isPassword) {
  #>
  if (isNotEmpty(model.<#=column_name#>)) {
    sql += `,<#=column_name#>`;
  }<#
    } else if (foreignKey && foreignKey.type === "json") {
  #>
  if (model.<#=column_name#> !== undefined) {
    sql += `,<#=column_name#>`;
  }<#
    } else if (foreignKey && foreignKey.type === "many2many") {
  #><#
    } else if (!foreignKey) {
  #>
  if (model.<#=column_name#> !== undefined) {
    sql += `,<#=column_name#>`;
  }<#
    } else {
  #>
  if (model.<#=column_name#> !== undefined) {
    sql += `,<#=column_name#>`;
  }<#
    }
  #><#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    let column_comment = column.COLUMN_COMMENT || "";
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    const redundLbl = column.redundLbl;
    if (!redundLbl) {
      continue;
    }
    const redundLblKeys = Object.keys(redundLbl);
    if (redundLblKeys.length === 0) {
      continue;
    }
  #><#
  for (const key of redundLblKeys) {
    const val = redundLbl[key];
  #>
  
  if (model.<#=val#> !== undefined) {
    sql += `,<#=val#>`;
  }<#
  }
  #><#
  }
  #>
  sql += `) values(${ args.push(model.id) },${ args.push(reqDate()) }`;<#
  if (hasTenant_id) {
  #>
  if (model.tenant_id != null) {
    sql += `,${ args.push(model.tenant_id) }`;
  } else {
    const authModel = await authDao.getAuthModel();
    const tenant_id = await usrDaoSrc.getTenant_id(authModel?.id);
    if (tenant_id) {
      sql += `,${ args.push(tenant_id) }`;
    }
  }<#
  }
  #><#
  if (hasOrgId) {
  #>
  if (model.org_id != null) {
    sql += `,${ args.push(model.org_id) }`;
  } else {
    const authModel = await authDao.getAuthModel();
    if (authModel?.org_id) {
      sql += `,${ args.push(authModel?.org_id) }`;
    }
  }<#
  }
  #>
  if (model.create_usr_id != null && model.create_usr_id !== "-") {
    sql += `,${ args.push(model.create_usr_id) }`;
  } else {
    const authModel = await authDao.getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,${ args.push(authModel.id) }`;
    }
  }<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    if (column_name === "create_usr_id") continue;
    if (column_name === "create_time") continue;
    let data_type = column.DATA_TYPE;
    let column_type = column.COLUMN_TYPE;
    let column_comment = column.COLUMN_COMMENT || "";
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  #><#
    if (column.isPassword) {
  #>
  if (isNotEmpty(model.<#=column_name#>)) {
    sql += `,${ args.push(await authDao.getPassword(model.<#=column_name#>)) }`;
  }<#
    } else if (foreignKey && foreignKey.type === "json") {
  #>
  if (model.<#=column_name#> !== undefined) {
    sql += `,${ args.push(model.<#=column_name#>) }`;
  }<#
    } else if (foreignKey && foreignKey.type === "many2many") {
  #><#
    } else if (!foreignKey) {
  #>
  if (model.<#=column_name#> !== undefined) {
    sql += `,${ args.push(model.<#=column_name#>) }`;
  }<#
    } else {
  #>
  if (model.<#=column_name#> !== undefined) {
    sql += `,${ args.push(model.<#=column_name#>) }`;
  }<#
    }
  #><#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    let column_comment = column.COLUMN_COMMENT || "";
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    const redundLbl = column.redundLbl;
    if (!redundLbl) {
      continue;
    }
    const redundLblKeys = Object.keys(redundLbl);
    if (redundLblKeys.length === 0) {
      continue;
    }
  #><#
  for (const key of redundLblKeys) {
    const val = redundLbl[key];
  #>
  
  if (model.<#=val#> !== undefined) {
    sql += `,${ args.push(model.<#=val#>) }`;
  }<#
  }
  #><#
  }
  #>
  sql += `)`;
  
  const result = await execute(sql, args);<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    let data_type = column.DATA_TYPE;
    let column_type = column.COLUMN_TYPE;
    let column_comment = column.COLUMN_COMMENT || "";
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const many2many = column.many2many;
  #><#
    if (foreignKey && foreignKey.type === "json") {
  #><#
    } else if (foreignKey && foreignKey.type === "many2many") {
  #>
  // <#=column_comment#>
  await many2manyUpdate(model, "<#=column_name#>", { mod: "<#=many2many.mod#>", table: "<#=many2many.table#>", column1: "<#=many2many.column1#>", column2: "<#=many2many.column2#>" });<#
    } else if (!foreignKey) {
  #><#
    } else {
  #><#
    }
  #><#
  }
  #><#
  if (cache) {
  #>
  
  await delCache();<#
  }
  #>
  
  return model.id;
}<#
if (cache) {
#>

/**
 * 删除缓存
 */
export async function delCache() {
  const table = "<#=mod#>_<#=table#>";
  const method = "delCache";
  
  await delCacheCtx(`dao.sql.${ table }`);
  const foreignTables: string[] = [<#
  const foreignTablesCache = [ ];
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    const foreignKey = column.foreignKey;
    let data_type = column.DATA_TYPE;
    if (!foreignKey) continue;
    const foreignTable = foreignKey.table;
    const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const many2many = column.many2many;
    if (foreignTablesCache.includes(foreignTable)) {
      continue;
    }
    foreignTablesCache.push(foreignTable);
  #><#
    if (foreignKey && foreignKey.type === "many2many") {
  #>
    "<#=many2many.mod#>_<#=many2many.table#>",
    "<#=foreignKey.mod#>_<#=foreignTable#>",<#
    } else if (foreignKey && !foreignKey.multiple) {
  #>
    "<#=foreignKey.mod#>_<#=foreignTable#>",<#
    }
  #><#
  }
  #>
  ];
  for (let k = 0; k < foreignTables.length; k++) {
    const foreignTable = foreignTables[k];
    if (foreignTable === table) continue;
    await delCacheCtx(`dao.sql.${ foreignTable }`);
  }
}<#
}
#><#
if (hasTenant_id) {
#>

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
  const table = "<#=mod#>_<#=table#>";
  const method = "updateTenantById";
  
  const tenantExist = await tenantDao.existById(tenant_id);
  if (!tenantExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = /*sql*/ `
    update
      <#=mod#>_<#=table#>
    set
      update_time = ${ args.push(reqDate()) },
      tenant_id = ${ args.push(tenant_id) }
    where
      id = ${ args.push(id) }
  `;
  const result = await execute(sql, args);
  const num = result.affectedRows;<#
  if (cache) {
  #>
  
  await delCache();<#
  }
  #>
  return num;
}<#
}
#><#
if (hasOrgId) {
#>

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
  const table = "<#=mod#>_<#=table#>";
  const method = "updateOrgById";
  
  const orgExist = await orgDao.existById(org_id);
  if (!orgExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = /*sql*/ `
    update
      <#=mod#>_<#=table#>
    set
      update_time = ${ args.push(reqDate()) },
      org_id = ${ args.push(org_id) }
    where
      id = ${ args.push(id) }
  `;
  const result = await execute(sql, args);
  const num = result.affectedRows;<#
  if (cache) {
  #>
  
  await delCache();<#
  }
  #>
  return num;
}<#
}
#><#
if (hasVersion) {
#>

/**
 * 根据 id 获取版本号
 */
export async function getVersionById(id: string) {
  const model = await findById(id);
  if (!model) {
    return 0;
  }
  const version = model.version;
  return version;
}<#
}
#>

/**
 * 根据id修改一行数据
 * @param {string} id
 * @param {<#=inputName#>} model
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
  model: <#=inputName#>,
  options?: {
    uniqueType?: "ignore" | "throw" | "create";
  },
): Promise<string> {
  const table = "<#=mod#>_<#=table#>";
  const method = "updateById";
  
  if (!id) {
    throw new Error("updateById: id cannot be empty");
  }
  if (!model) {
    throw new Error("updateById: model cannot be null");
  }<#
  if (hasDict) {
  #>
  
  const [<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      let column_comment = column.COLUMN_COMMENT || "";
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
    #><#
      if (column.dict) {
    #>
    <#=column_name#>Dict, // <#=column_comment#><#
      }
    #><#
    }
    #>
  ] = await dictSrcDao.getDict([<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      let column_comment = column.COLUMN_COMMENT || "";
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
    #><#
      if (column.dict) {
    #>
    "<#=column.dict#>",<#
      }
    #><#
    }
    #>
  ]);<#
  }
  #><#
  if (hasDictbiz) {
  #>
  
  const [<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      let column_comment = column.COLUMN_COMMENT || "";
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
    #><#
      if (column.dictbiz) {
    #>
    <#=column_name#>Dict, // <#=column_comment#><#
      }
    #><#
    }
    #>
  ] = await dictbizSrcDao.getDictbiz([<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      let column_comment = column.COLUMN_COMMENT || "";
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
    #><#
      if (column.dictbiz) {
    #>
    "<#=column.dictbiz#>",<#
      }
    #><#
    }
    #>
  ]);<#
  }
  #><#
  if (hasTenant_id) {
  #>
  
  // 修改租户id
  if (isNotEmpty(model.tenant_id)) {
    await updateTenantById(id, model.tenant_id);
  }<#
  }
  #><#
  if (hasOrgId) {
  #>
  
  // 修改部门id
  if (isNotEmpty(model.org_id)) {
    await updateOrgById(id, model.org_id);
  }<#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if ([ "id", "create_usr_id", "create_time", "update_usr_id", "update_time" ].includes(column_name)) continue;
    let data_type = column.DATA_TYPE;
    let column_type = column.COLUMN_TYPE;
    let column_comment = column.COLUMN_COMMENT || "";
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const many2many = column.many2many;
    const isPassword = column.isPassword;
    const isVirtual = column.isVirtual;
    if (isVirtual) continue;
  #><#
    if (selectList.length > 0) {
  #>
  
  // <#=column_comment#>
  if (isNotEmpty(model.<#=column_name#>_lbl) && model.<#=column_name#> === undefined) {
    model.<#=column_name#>_lbl = String(model.<#=column_name#>_lbl).trim();<#
      for (let i = 0; i < selectList.length; i++) {
        const item = selectList[i];
        let value = item.value;
        let label = item.label;
        if (typeof(value) === "string") {
          value = `"${ value }"`;
        } else if (typeof(value) === "number") {
          value = value.toString();
        }
    #><#=i>0?" else ":"\n      "#>if (model.<#=column_name#>_lbl === "<#=label#>") {
      model.<#=column_name#> = <#=value#>;
    }<#
      }
    #>
  }<#
    } else if ((column.dict || column.dictbiz) && ![ "int", "decimal", "tinyint" ].includes(data_type)) {
  #>
  
  // <#=column_comment#>
  if (isNotEmpty(model.<#=column_name#>_lbl) && model.<#=column_name#> === undefined) {
    const val = <#=column_name#>Dict.find((itemTmp) => itemTmp.lbl === model.<#=column_name#>_lbl)?.val;
    if (val !== undefined) {
      model.<#=column_name#> = val;
    }
  }<#
    } else if ((column.dict || column.dictbiz) && [ "int", "decimal", "tinyint" ].includes(data_type)) {
  #>
  
  // <#=column_comment#>
  if (isNotEmpty(model.<#=column_name#>_lbl) && model.<#=column_name#> === undefined) {
    const val = <#=column_name#>Dict.find((itemTmp) => itemTmp.lbl === model.<#=column_name#>_lbl)?.val;
    if (val !== undefined) {
      model.<#=column_name#> = Number(val);
    }
  }<#
    } else if (foreignKey && foreignKey.type !== "many2many" && !foreignKey.multiple && foreignKey.lbl) {
      let daoStr = "";
      if (foreignTable !== table) {
        daoStr = `${ foreignTable }Dao.`;
      }
  #>
  
  // <#=column_comment#>
  if (isNotEmpty(model.<#=column_name#>_lbl) && model.<#=column_name#> === undefined) {
    model.<#=column_name#>_lbl = String(model.<#=column_name#>_lbl).trim();
    const <#=foreignTable#>Model = await <#=daoStr#>findOne({ <#=foreignKey.lbl#>: model.<#=column_name#>_lbl });
    if (<#=foreignTable#>Model) {
      model.<#=column_name#> = <#=foreignTable#>Model.id;
    }
  }<#
    } else if (foreignKey && (foreignKey.type === "many2many" || foreignKey.multiple) && foreignKey.lbl) {
  #>

  // <#=column_comment#>
  if (!model.<#=column_name#> && model.<#=column_name#>_lbl) {
    if (typeof model.<#=column_name#>_lbl === "string" || model.<#=column_name#>_lbl instanceof String) {
      model.<#=column_name#>_lbl = model.<#=column_name#>_lbl.split(",");
    }
    model.<#=column_name#>_lbl = model.<#=column_name#>_lbl.map((item: string) => item.trim());
    const args = new QueryArgs();
    const sql = /*sql*/ `
      select
        t.id
      from
        <#=foreignKey.mod#>_<#=foreignTable#> t
      where
        t.<#=foreignKey.lbl#> in ${ args.push(model.<#=column_name#>_lbl) }
    `;
    interface Result {
      id: string;
    }
    const models = await query<Result>(sql, args);
    model.<#=column_name#> = models.map((item: { id: string }) => item.id);
  }<#
    }
  #><#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    let column_comment = column.COLUMN_COMMENT || "";
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    const redundLbl = column.redundLbl;
    if (!redundLbl) {
      continue;
    }
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    if (foreignTable) {
      continue;
    }
    const redundLblKeys = Object.keys(redundLbl);
    if (redundLblKeys.length === 0) {
      continue;
    }
  #><#
    if (column.dict) {
  #>
  
  // <#=column_comment#>
  if (model.<#=column_name#> != null) {
    const dictModel = <#=column_name#>Dict.find((itemTmp) => {
      return itemTmp.val === dictSrcDao.val2Str(model.<#=column_name#>, itemTmp.type as any);
    });<#
    for (const key of redundLblKeys) {
      const val = redundLbl[key];
    #>
    model.<#=val#> = dictModel?.<#=key#>;<#
    }
    #>
  }<#
    } else if (column.dictbiz) {
  #>
  
  // <#=column_comment#>
  if (model.<#=column_name#> != null) {
    const dictbizModel = <#=column_name#>Dict.find((itemTmp) => {
      return itemTmp.val === dictbizSrcDao.val2Str(model.<#=column_name#>, itemTmp.type as any);
    });<#
    for (const key of redundLblKeys) {
      const val = redundLbl[key];
    #>
    model.<#=val#> = dictbizModel?.<#=key#>;<#
    }
    #>
  }<#
    }
  #><#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    let column_comment = column.COLUMN_COMMENT || "";
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    const redundLbl = column.redundLbl;
    if (!redundLbl) {
      continue;
    }
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    if (!foreignTable) {
      continue;
    }
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const redundLblKeys = Object.keys(redundLbl);
    if (redundLblKeys.length === 0) {
      continue;
    }
  #>
  
  // <#=column_comment#>
  if (isNotEmpty(model.<#=column_name#>)) {
    const {
      findById: findById<#=foreignTableUp#>,
    } = await import("/gen/<#=foreignKey.mod#>/<#=foreignTable#>/<#=foreignTable#>.dao.ts");
    
    const <#=foreignTable#>Model = await findById<#=foreignTableUp#>(model.<#=column_name#>);
    if (<#=foreignTable#>Model) {<#
      for (const key of redundLblKeys) {
        const val = redundLbl[key];
      #>
      model.<#=val#> = <#=foreignTable#>Model.<#=key#>;<#
      }
      #>
    }
  }<#
  }
  #>
  
  const oldModel = await findById(id);
  
  if (!oldModel) {
    throw await ns("修改失败, 数据已被删除");
  }<#
  if (mod === "base" && table === "role") {
  #>
  
  {
    const {
      filterMenuIdsByTenant,
    } = await import("/src/base/tenant/tenant.dao.ts");
    
    model.menu_ids = await filterMenuIdsByTenant(model.menu_ids);
  }<#
  }
  #>
  
  const args = new QueryArgs();
  let sql = `
    update <#=mod#>_<#=table#> set
  `;
  let updateFldNum = 0;<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    if ([ "id", "create_usr_id", "create_time", "update_usr_id", "update_time" ].includes(column_name)) continue;
    let data_type = column.DATA_TYPE;
    let column_type = column.COLUMN_TYPE;
    let column_comment = column.COLUMN_COMMENT || "";
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    if (column_name === "tenant_id") {
      continue;
    }
    if (column_name === "org_id") {
      continue;
    }
  #><#
    if (column.isPassword) {
  #>
  if (isNotEmpty(model.<#=column_name#>)) {
    sql += `<#=column_name#> = ?,`;
    args.push(await authDao.getPassword(model.<#=column_name#>));
    updateFldNum++;
  }<#
    } else if (foreignKey && foreignKey.type === "json") {
  #>
  if (model.<#=column_name#> !== undefined) {
    if (isEmpty(model.<#=column_name#>)) {
      model.<#=column_name#> = null;
    }
    if (model.<#=column_name#> != oldModel.<#=column_name#>) {
      sql += `<#=column_name#> = ${ args.push(model.<#=column_name#>) },`;
      updateFldNum++;
    }
  }<#
    } else if (foreignKey && foreignKey.type === "many2many") {
  #><#
    } else if (!foreignKey) {
  #>
  if (model.<#=column_name#> !== undefined) {
    if (model.<#=column_name#> != oldModel.<#=column_name#>) {
      sql += `<#=column_name#> = ${ args.push(model.<#=column_name#>) },`;
      updateFldNum++;
    }
  }<#
    } else {
  #>
  if (model.<#=column_name#> !== undefined) {
    if (model.<#=column_name#> != oldModel.<#=column_name#>) {
      sql += `<#=column_name#> = ${ args.push(model.<#=column_name#>) },`;
      updateFldNum++;
    }
  }<#
    }
  #><#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    let column_comment = column.COLUMN_COMMENT || "";
    let selectList = [ ];
    let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
    if (selectStr) {
      selectList = eval(`(${ selectStr })`);
    }
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    const redundLbl = column.redundLbl;
    if (!redundLbl) {
      continue;
    }
    const redundLblKeys = Object.keys(redundLbl);
    if (redundLblKeys.length === 0) {
      continue;
    }
  #><#
    for (const key of redundLblKeys) {
      const val = redundLbl[key];
  #>
  if (model.<#=val#> !== undefined) {
    if (model.<#=val#> != oldModel.<#=val#>) {
      sql += `<#=val#> = ${ args.push(model.<#=val#>) },`;
      updateFldNum++;
    }
  }<#
    }
  #><#
  }
  #>
  if (updateFldNum > 0) {
    if (model.update_usr_id && model.update_usr_id !== "-") {
      sql += `update_usr_id = ${ args.push(model.update_usr_id) },`;
    } else {
      const authModel = await authDao.getAuthModel();
      if (authModel?.id !== undefined) {
        sql += `update_usr_id = ${ args.push(authModel.id) },`;
      }
    }<#
    if (hasVersion) {
    #>
    if (model.version != null && model.version > 0) {
      const version = await getVersionById(id);
      if (version && version > model.version) {
        throw await ns("数据已被修改，请刷新后重试");
      }
      sql += `version = ${ args.push(version + 1) },`;
    }<#
    }
    #>
    sql += `update_time = ${ args.push(new Date()) }`;
    sql += ` where id = ${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
  }<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    if ([ "id", "create_usr_id", "create_time", "update_usr_id", "update_time" ].includes(column_name)) continue;
    let data_type = column.DATA_TYPE;
    let column_type = column.COLUMN_TYPE;
    let column_comment = column.COLUMN_COMMENT || "";
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const many2many = column.many2many;
  #><#
    if (foreignKey && foreignKey.type === "json") {
  #><#
    } else if (foreignKey && foreignKey.type === "many2many") {
  #>
  
  updateFldNum++;
  // <#=column_comment#>
  await many2manyUpdate({ ...model, id }, "<#=column_name#>", { mod: "<#=many2many.mod#>", table: "<#=many2many.table#>", column1: "<#=many2many.column1#>", column2: "<#=many2many.column2#>" });<#
    } else if (!foreignKey) {
  #><#
    } else {
  #><#
    }
  #><#
  }
  #><#
  if (cache) {
  #>
  
  if (updateFldNum > 0) {
    await delCache();
  }<#
  }
  #>
  
  const newModel = await findById(id);
  
  if (!deepCompare(oldModel, newModel)) {
    console.log(JSON.stringify(oldModel));<#
    if (opts?.history_table) {
    #>
    
    const {
      create: createHistory,
    } = await import("/gen/<#=mod#>/<#=opts.history_table#>/<#=opts.history_table#>.dao.ts");
    
    await createHistory({
      ...oldModel,
      <#=table#>_id: id,
      id: undefined,
    });<#
    }
    #>
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
  const table = "<#=mod#>_<#=table#>";
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
        <#=mod#>_<#=table#>
      set
        is_deleted = 1,
        delete_time = ${ args.push(reqDate()) }
      where
        id = ${ args.push(id) }
      limit 1
    `;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }<#
  if (cache) {
  #>
  
  await delCache();<#
  }
  #>
  
  return num;
}<#
if (hasDefault) {
#>

/**
 * 根据 id 设置默认记录
 * @param {string} id
 * @return {Promise<number>}
 */
export async function defaultById(
  id: string,
  options?: {
  },
): Promise<number> {
  const table = "<#=mod#>_<#=table#>";
  const method = "defaultById";
  
  if (!id) {
    throw new Error("defaultById: id cannot be empty");
  }
  
  {
    const args = new QueryArgs();
    let sql = `
      update
        <#=mod#>_<#=table#>
      set
        is_default = 0
      where
        is_default = 1
        and id != ${ args.push(id) }
    `;
    await execute(sql, args);
  }
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    update
      <#=mod#>_<#=table#>
    set
      is_default = 1
    
  `;
  {
    const authModel = await authDao.getAuthModel();
    if (authModel?.id !== undefined) {
      sql += /*sql*/ `,update_usr_id = ${ args.push(authModel.id) }`;
    }
  }
  sql += /*sql*/ `
  
  where
      id = ${ args.push(id) }
  `;
  const result = await execute(sql, args);
  const num = result.affectedRows;<#
  if (cache) {
  #>
  
  await delCache();<#
  }
  #>
  
  return num;
}<#
}
#><#
if (hasEnabled) {
#>

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
  const table = "<#=mod#>_<#=table#>";
  const method = "enableByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    update
      <#=mod#>_<#=table#>
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
  const num = result.affectedRows;<#
  if (cache) {
  #>
  
  await delCache();<#
  }
  #>
  
  return num;
}<#
}
#><#
if (hasLocked) {
#>

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
  const table = "<#=mod#>_<#=table#>";
  const method = "lockByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    update
      <#=mod#>_<#=table#>
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
  const num = result.affectedRows;<#
  if (cache) {
  #>
  
  await delCache();<#
  }
  #>
  
  return num;
}<#
}
#>

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
  const table = "<#=mod#>_<#=table#>";
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
        <#=mod#>_<#=table#>
      set
        is_deleted = 0
      where
        id = ${ args.push(id) }
      limit 1
    `;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }<#
  if (cache) {
  #>
  await delCache();<#
  }
  #>
  
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
  const table = "<#=mod#>_<#=table#>";
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
          <#=mod#>_<#=table#>
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = /*sql*/ `
      delete from
        <#=mod#>_<#=table#>
      where
        id = ${ args.push(id) }
        and is_deleted = 1
      limit 1
    `;
    const result = await execute(sql, args);
    num += result.affectedRows;
  }<#
  if (cache) {
  #>
  await delCache();<#
  }
  #>
  
  return num;
}<#
if (hasOrderBy) {
#>
  
/**
 * 查找 order_by 字段的最大值
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
  options?: {
  },
): Promise<number> {
  const table = "<#=mod#>_<#=table#>";
  const method = "findLastOrderBy";
  
  let sql = /*sql*/ `
    select
      t.order_by order_by
    from
      <#=mod#>_<#=table#> t
  `;
  const whereQuery: string[] = [ ];
  const args = new QueryArgs();
  whereQuery.push(`t.is_deleted = 0`);<#
  if (hasTenant_id) {
  #>
  {
    const authModel = await authDao.getAuthModel();
    const tenant_id = await usrDaoSrc.getTenant_id(authModel?.id);
    whereQuery.push(`t.tenant_id = ${ args.push(tenant_id) }`);
  }<#
  }
  #><#
  if (hasOrgId) {
  #>
  {
    const authModel = await authDao.getAuthModel();
    const org_id = authModel?.org_id;
    if (org_id) {
      whereQuery.push(`t.org_id = ${ args.push(org_id) }`);
    }
  }<#
  }
  #>
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
}<#
}
#>
