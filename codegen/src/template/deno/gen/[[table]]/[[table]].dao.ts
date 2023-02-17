<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasPassword = columns.some((column) => column.isPassword);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasDeptId = columns.some((column) => column.COLUMN_NAME === "dept_id");
const Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("_");
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
#><#
const hasSummary = columns.some((column) => column.showSummary);
#>// deno-lint-ignore-file no-explicit-any prefer-const no-unused-vars ban-types
import {
  escapeId,
  escape,
} from "sqlstring";

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
  type PartialNull,
} from "/typings/types.ts";

import {
  isNotEmpty,
  isEmpty,
  sqlLike,
  shortUuidV4,
} from "/lib/util/string_util.ts";<#
  if (hasDict) {
#>

import {
  _internals as dictSrcDao,
} from "/src/dict_detail/dict_detail.dao.ts";<#
  }
#><#
  if (hasDictbiz) {
#>

import {
  _internals as dictbizSrcDao,
} from "/src/dictbiz_detail/dictbiz_detail.dao.ts";<#
  }
#>

import { UniqueException } from "/lib/exceptions/unique.execption.ts";

import {
  _internals as authDao,
} from "/lib/auth/auth.dao.ts";<#
if (hasTenant_id) {
#>

import {
  _internals as usrDaoSrc,
} from "/src/usr/usr.dao.ts";

import {
  _internals as tenantDao,
} from "/gen/tenant/tenant.dao.ts";<#
}
#><#
if (hasDeptId) {
#>

import {
  _internals as deptDao,
} from "/gen/dept/dept.dao.ts";<#
}
#>

import {
  many2manyUpdate,
  setModelIds,
} from "/lib/util/dao_util.ts";

import {
  SortOrderEnum,
  type PageInput,
  type SortInput,
} from "/gen/types.ts";

import {
  type <#=Table_Up#>Model,
  type <#=Table_Up#>Search,
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
  if (foreignKey && foreignKey.type !== "many2many" && !foreignKey.multiple) {
    if (foreignTable === table) {
      continue;
    }
    if (hasImportDaos.includes(foreignTable)) continue;
    hasImportDaos.push(foreignTable);
#>

import {
  _internals as <#=foreignTable#>Dao,
} from "/gen/<#=foreignTable#>/<#=foreignTable#>.dao.ts";<#
  }
#><#
}
#>

export const _internals = {
  findCount,
  findAll,
  getUniqueKeys,
  findByUnique,
  equalsByUnique,
  checkByUnique,<#
  if (hasSummary) {
  #>
  findSummary,<#
  }
  #>
  findOne,
  findById,
  exist,
  existById,
  create,<#
  if (cache) {
  #>
  delCache,<#
  }
  #><#
  if (hasTenant_id) {
  #>
  updateTenantById,<#
  }
  #><#
  if (hasDeptId) {
  #>
  updateDeptById,<#
  }
  #>
  updateById,
  deleteByIds,<#
  if (hasLocked) {
  #>
  getIs_lockedById,
  lockByIds,<#
  }
  #>
  revertByIds,
  forceDeleteByIds,<#
  if (hasOrderBy) {
  #>
  findLastOrderBy,<#
  }
  #>
};

async function getWhereQuery(
  args: QueryArgs,
  search?: <#=Table_Up#>Search,
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
  } else if (isNotEmpty(search?.tenant_id) || search?.tenant_id === "-") {
    whereQuery += ` and t.tenant_id = ${ args.push(search.tenant_id) }`;
  }<#
  }
  #><#
  if (hasDeptId) {
  #>
  if (search?.dept_id == null) {
    const authModel = await authDao.getAuthModel();
    const dept_id = authModel?.dept_id;
    if (dept_id) {
      whereQuery += ` and t.dept_id = ${ args.push(dept_id) }`;
    }
  } else if (isNotEmpty(search?.dept_id) || search?.dept_id === "-") {
    whereQuery += ` and t.dept_id = ${ args.push(search.dept_id) }`;
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
    whereQuery += ` and _<#=column_name#>.id in ${ args.push(search.<#=column_name#>) }`;
  }<#
    if (foreignKey.lbl) {
  #>
  if (search?._<#=column_name#> && !Array.isArray(search?._<#=column_name#>)) {
    search._<#=column_name#> = [ search._<#=column_name#> ];
  }
  if (search?._<#=column_name#> && search._<#=column_name#>?.length > 0) {
    whereQuery += ` and _<#=column_name#> in ${ args.push(search._<#=column_name#>) }`;
  }<#
    }
  #><#
      } else if (foreignKey.type === "many2many") {
  #>
  if (search?.<#=column_name#> && !Array.isArray(search?.<#=column_name#>)) {
    search.<#=column_name#> = [ search.<#=column_name#> ];
  }
  if (search?.<#=column_name#> && search?.<#=column_name#>.length > 0) {
    whereQuery += ` and <#=foreignKey.table#>.id in ${ args.push(search.<#=column_name#>) }`;
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
  if (isNotEmpty(search?.<#=column_name#>Like)) {
    whereQuery += ` and t.<#=column_name#> like ${ args.push(sqlLike(search?.<#=column_name#>Like) + "%") }`;
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
    \\`<#=table#>\\` t<#
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
    #><#
      if (foreignKey && foreignKey.type === "many2many") {
    #>
    left join \\`<#=many2many.table#>\\`
      on \\`<#=many2many.table#>\\`.<#=many2many.column1#> = t.id
      and \\`<#=many2many.table#>\\`.is_deleted = 0
    left join \\`<#=foreignTable#>\\`
      on \\`<#=many2many.table#>\\`.<#=many2many.column2#> = <#=foreignTable#>.<#=foreignKey.column#>
      and <#=foreignTable#>.is_deleted = 0
    left join (
      select
        json_arrayagg(<#=foreignTable#>.id) <#=column_name#>,<#
          if (foreignKey.lbl) {
        #>
        json_arrayagg(<#=foreignTable#>.<#=foreignKey.lbl#>) _<#=column_name#>,<#
          }
        #>
        <#=table#>.id <#=many2many.column1#>
      from \\`<#=many2many.table#>\\`
      inner join <#=foreignKey.table#>
        on <#=foreignKey.table#>.<#=foreignKey.column#> = \\`<#=many2many.table#>\\`.<#=many2many.column2#>
        and <#=foreignKey.table#>.is_deleted = 0
      inner join <#=table#>
        on <#=table#>.id = \\`<#=many2many.table#>\\`.<#=many2many.column1#>
        and <#=table#>.is_deleted = 0
      where
      \\`<#=many2many.table#>\\`.is_deleted = 0
      group by <#=many2many.column1#>
    ) _<#=foreignTable#>
      on _<#=foreignTable#>.<#=many2many.column1#> = t.id<#
      } else if (foreignKey && !foreignKey.multiple) {
    #>
    left join <#=foreignTable#> _<#=column_name#>
      on _<#=column_name#>.<#=foreignKey.column#> = t.<#=column_name#><#
      }
    #><#
    }
    #>
  `;
  return fromQuery;
}

/**
 * 根据条件查找总数据数
 * @param { <#=Table_Up#>Search } search?
 * @return {Promise<number>}
 */
async function findCount(
  search?: <#=Table_Up#>Search,
  options?: {
  },
): Promise<number> {
  const table = "<#=table#>";
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
 * @param {<#=Table_Up#>Search} search? 搜索条件
 * @param {SortInput|SortInput[]} sort? 排序
 */
async function findAll(
  search?: <#=Table_Up#>Search,
  page?: PageInput,
  sort?: SortInput | SortInput[],
  options?: {
  },
) {
  const table = "<#=table#>";
  const method = "findAll";
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    select t.*<#
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
      #><#
        if (foreignKey && foreignKey.type === "many2many") {
      #>
      ,max(<#=column_name#>) <#=column_name#>
      ,max(_<#=column_name#>) _<#=column_name#><#
      } else if (foreignKey && !foreignKey.multiple && foreignKey.lbl) {
      #>
      ,_<#=column_name#>.<#=foreignKey.lbl#> _<#=column_name#><#
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
  
  let result = await query<<#=Table_Up#>Model>(sql, args<#
  if (cache) {
  #>, { cacheKey1, cacheKey2 }<#
  }
  #>);<#
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
      if (foreignKey && foreignKey.type === "json") {
    #><#
      } else if (isPassword) {
    #>
    // <#=column_comment#>
    model.<#=column_name#> = "";<#
      } else if (selectList.length > 0) {
    #>
    // <#=column_comment#>
    let _<#=column_name#> = "";
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
      _<#=column_name#> = "<#=label#>";
    }<#
    }
    #> else {
      _<#=column_name#> = String(model.<#=column_name#>);
    }
    model._<#=column_name#> = _<#=column_name#>;<#
      } else if ((column.dict || column.dictbiz) && ![ "int", "decimal", "tinyint" ].includes(data_type)) {
    #>
    
    // <#=column_comment#>
    let _<#=column_name#> = model.<#=column_name#>;
    if (!isEmpty(model.<#=column_name#>)) {
      const dictItem = <#=column_name#>Dict.find((dictItem) => dictItem.val === model.<#=column_name#>);
      if (dictItem) {
        _<#=column_name#> = dictItem.lbl;
      }
    }
    model._<#=column_name#> = _<#=column_name#>;<#
      } else if ((column.dict || column.dictbiz) && [ "int", "decimal", "tinyint" ].includes(data_type)) {
    #>
    
    // <#=column_comment#>
    let _<#=column_name#> = model.<#=column_name#>.toString();
    if (model.<#=column_name#> !== undefined && model.<#=column_name#> !== null) {
      const dictItem = <#=column_name#>Dict.find((dictItem) => dictItem.val === model.<#=column_name#>.toString());
      if (dictItem) {
        _<#=column_name#> = dictItem.lbl;
      }
    }
    model._<#=column_name#> = _<#=column_name#>;<#
      }
    #><#
    }
    #>
  }
  
  return result;
}

/**
 * 获得表的唯一字段名列表
 * @return {{ uniqueKeys: (keyof <#=Table_Up#>Model)[]; uniqueComments: { [key: string]: string }; }}
 */
function getUniqueKeys(): {
  uniqueKeys: (keyof <#=Table_Up#>Model)[];
  uniqueComments: { [key: string]: string };
} {
  const uniqueKeys: (keyof <#=Table_Up#>Model)[] = [<#
  for (let i = 0; i < (opts.unique || []).length; i++) {
    const uniqueKey = opts.unique[i];
  #>
    "<#=uniqueKey#>",<#
  }
  #>
  ];
  const uniqueComments = {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      const unique = opts.unique || [ ];
      if (!unique.includes(column_name)) continue;
      let column_comment = column.COLUMN_COMMENT || "";
      if (column_comment.includes("[")) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      if (column_comment.includes("[")) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
  #>
    <#=column_name#>: "<#=column_comment#>",<#
    }
  #>
  };
  return { uniqueKeys, uniqueComments };
}

/**
 * 通过唯一约束获得一行数据
 * @param {<#=Table_Up#>Search | PartialNull<<#=Table_Up#>Model>} search0
 */
async function findByUnique(
  search0: <#=Table_Up#>Search | PartialNull<<#=Table_Up#>Model>,
  options?: {
  },
) {
  if (search0.id) {
    const model = await findOne({ id: search0.id }, options);
    return model;
  }
  const { uniqueKeys } = getUniqueKeys();
  if (!uniqueKeys || uniqueKeys.length === 0) {
    return;
  }
  const search: <#=Table_Up#>Search = { };
  for (let i = 0; i < uniqueKeys.length; i++) {
    const key = uniqueKeys[i];
    const val = (search0 as any)[key];
    if (isEmpty(val)) {
      return;
    }
    (search as any)[key] = val;
  }
  const model = await findOne(search, options);
  return model;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {<#=Table_Up#>Model} oldModel
 * @param {PartialNull<<#=Table_Up#>Model>} model
 * @return {boolean}
 */
function equalsByUnique(
  oldModel: <#=Table_Up#>Model,
  model: PartialNull<<#=Table_Up#>Model>,
): boolean {
  if (!oldModel || !model) return false;
  const { uniqueKeys } = getUniqueKeys();
  if (!uniqueKeys || uniqueKeys.length === 0) return false;
  let isEquals = true;
  for (let i = 0; i < uniqueKeys.length; i++) {
    const key = uniqueKeys[i];
    const oldVal = oldModel[key];
    const val = model[key];
    if (oldVal != val) {
      isEquals = false;
      break;
    }
  }
  return isEquals;
}

/**
 * 通过唯一约束检查数据是否已经存在
 * @param {PartialNull<<#=Table_Up#>Model>} model
 * @param {<#=Table_Up#>Model} oldModel
 * @param {("ignore" | "throw" | "update")} uniqueType
 * @return {Promise<string>}
 */
async function checkByUnique(
  model: PartialNull<<#=Table_Up#>Model>,
  oldModel: <#=Table_Up#>Model,
  uniqueType: "ignore" | "throw" | "update" = "throw",
  options?: {
  },
): Promise<string | undefined> {
  const isEquals = equalsByUnique(oldModel, model);
  if (isEquals) {
    if (uniqueType === "throw") {
      const { uniqueKeys, uniqueComments } = getUniqueKeys();
      const lbl = uniqueKeys.map((key) => uniqueComments[key]).join(", ");
      throw new UniqueException(`${ lbl } 的值已经存在!`);
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
 * @param {<#=Table_Up#>Search} search? 搜索条件
 * @return {Promise<<#=Table_Up#>Summary>}
 */
async function findSummary(
  search?: <#=Table_Up#>Search,
  options?: {
  },
): Promise<<#=Table_Up#>Summary> {
  const table = "<#=table#>";
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
 * @param {<#=Table_Up#>Search} search?
 */
async function findOne(
  search?: <#=Table_Up#>Search,
  options?: {
  },
) {
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  const result = await findAll(search, page, undefined, options);
  if (result && result.length > 0) {
    return result[0];
  }
  return;
}

/**
 * 根据id查找数据
 * @param {string} id
 */
async function findById(
  id?: string,
  options?: {
  },
) {
  if (!id) return;
  const model = await findOne({ id }, options);
  return model;
}

/**
 * 根据搜索条件判断数据是否存在
 * @param {<#=Table_Up#>Search} search?
 */
async function exist(
  search?: <#=Table_Up#>Search,
  options?: {
  },
) {
  const model = await findOne(search, options);
  const exist = !!model;
  return exist;
}

/**
 * 根据id判断数据是否存在
 * @param {string} id
 */
async function existById(
  id: string,
) {
  const table = "<#=table#>";
  const method = "existById";
  
  if (!id) {
    throw new Error(`${ table }Dao.${ method }: id 不能为空!`);
  }
  
  const args = new QueryArgs();
  const sql = /*sql*/ `
    select
      1 e
    from
      <#=table#> t
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
 * @param {PartialNull<<#=Table_Up#>Model>} model
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<string>} 
 */
async function create(
  model: PartialNull<<#=Table_Up#>Model>,
  options?: {
    uniqueType?: "ignore" | "throw" | "update";
  },
): Promise<string> {
  const table = "<#=table#>";
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
  #><#
    if (selectList.length > 0) {
  #>
  
  // <#=column_comment#>
  if (isNotEmpty(model._<#=column_name#>) && model.<#=column_name#> === undefined) {
    model._<#=column_name#> = String(model._<#=column_name#>).trim();<#
      for (let i = 0; i < selectList.length; i++) {
        const item = selectList[i];
        let value = item.value;
        let label = item.label;
        if (typeof(value) === "string") {
          value = `"${ value }"`;
        } else if (typeof(value) === "number") {
          value = value.toString();
        }
    #><#=i>0?" else ":"\n      "#>if (model._<#=column_name#> === "<#=label#>") {
      model.<#=column_name#> = <#=value#>;
    }<#
      }
    #>
  }<#
    } else if ((column.dict || column.dictbiz) && ![ "int", "decimal", "tinyint" ].includes(data_type)) {
  #>
  
  // <#=column_comment#>
  if (isNotEmpty(model._<#=column_name#>) && model.<#=column_name#> === undefined) {
    const val = <#=column_name#>Dict.find((itemTmp) => itemTmp.lbl === model._<#=column_name#>)?.val;
    if (val !== undefined) {
      model.<#=column_name#> = val;
    }
  }<#
    } else if ((column.dict || column.dictbiz) && [ "int", "decimal", "tinyint" ].includes(data_type)) {
  #>
  
  // <#=column_comment#>
  if (isNotEmpty(model._<#=column_name#>) && model.<#=column_name#> === undefined) {
    const val = <#=column_name#>Dict.find((itemTmp) => itemTmp.lbl === model._<#=column_name#>)?.val;
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
  if (isNotEmpty(model._<#=column_name#>) && model.<#=column_name#> === undefined) {
    model._<#=column_name#> = String(model._<#=column_name#>).trim();
    const <#=foreignTable#>Model = await <#=daoStr#>findOne({ <#=foreignKey.lbl#>: model._<#=column_name#> });
    if (<#=foreignTable#>Model) {
      model.<#=column_name#> = <#=foreignTable#>Model.id;
    }
  }<#
    } else if (foreignKey && (foreignKey.type === "many2many" || foreignKey.multiple) && foreignKey.lbl) {
  #>
  
  // <#=column_comment#>
  if (!model.<#=column_name#> && model._<#=column_name#>) {
    if (typeof model._<#=column_name#> === "string" || model._<#=column_name#> instanceof String) {
      model._<#=column_name#> = model._<#=column_name#>.split(",");
    }
    model._<#=column_name#> = model._<#=column_name#>.map((item: string) => item.trim());
    const args = new QueryArgs();
    const sql = /*sql*/ `
      select
        t.id
      from
        <#=foreignTable#> t
      where
        t.<#=foreignKey.lbl#> in ${ args.push(model._<#=column_name#>) }
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
  #>
  
  const oldModel = await findByUnique(model, options);
  if (oldModel) {
    const result = await checkByUnique(model, oldModel, options?.uniqueType, options);
    if (result) {
      return result;
    }
  }
  
  if (!model.id) {
    model.id = shortUuidV4();
  }
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    insert into <#=table#>(
      id
      ,create_time
  `;<#
  if (hasTenant_id) {
  #>
  {
    const authModel = await authDao.getAuthModel();
    const tenant_id = await usrDaoSrc.getTenant_id(authModel?.id);
    if (tenant_id) {
      sql += `,tenant_id`;
    }
  }<#
  }
  #><#
  if (hasDeptId) {
  #>
  {
    const authModel = await authDao.getAuthModel();
    if (authModel?.dept_id) {
      sql += `,dept_id`;
    }
  }<#
  }
  #>
  {
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
    sql += `,\\`<#=column_name#>\\``;
  }<#
    } else if (foreignKey && foreignKey.type === "json") {
  #>
  if (model.<#=column_name#> !== undefined) {
    sql += `,\\`<#=column_name#>\\``;
  }<#
    } else if (foreignKey && foreignKey.type === "many2many") {
  #><#
    } else if (!foreignKey) {
  #>
  if (model.<#=column_name#> !== undefined) {
    sql += `,\\`<#=column_name#>\\``;
  }<#
    } else {
  #>
  if (model.<#=column_name#> !== undefined) {
    sql += `,\\`<#=column_name#>\\``;
  }<#
    }
  #><#
  }
  #>
  sql += `) values(${ args.push(model.id) },${ args.push(reqDate()) }`;<#
  if (hasTenant_id) {
  #>
  {
    const authModel = await authDao.getAuthModel();
    const tenant_id = await usrDaoSrc.getTenant_id(authModel?.id);
    if (tenant_id) {
      sql += `,${ args.push(tenant_id) }`;
    }
  }<#
  }
  #><#
  if (hasDeptId) {
  #>
  {
    const authModel = await authDao.getAuthModel();
    if (authModel?.dept_id) {
      sql += `,${ args.push(authModel?.dept_id) }`;
    }
  }<#
  }
  #>
  {
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
  await many2manyUpdate(model, "<#=column_name#>", { table: "<#=many2many.table#>", column1: "<#=many2many.column1#>", column2: "<#=many2many.column2#>" });<#
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
async function delCache() {
  const table = "<#=table#>";
  const method = "delCache";
  
  const cacheKey1 = `dao.sql.${ table }`;
  await delCacheCtx(cacheKey1);
  const foreignTables: string[] = [<#
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
  #><#
    if (foreignKey && foreignKey.type === "many2many") {
  #>
    "<#=many2many.table#>",
    "<#=foreignTable#>",<#
    } else if (foreignKey && !foreignKey.multiple) {
  #>
    "<#=foreignTable#>",<#
    }
  #><#
  }
  #>
  ];
  for (let k = 0; k < foreignTables.length; k++) {
    const foreignTable = foreignTables[k];
    if (foreignTable === table) continue;
    const cacheKey1 = `dao.sql.${ foreignTable }`;
    await delCacheCtx(cacheKey1);
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
async function updateTenantById(
  id: string,
  tenant_id: string,
  options?: {
  },
): Promise<number> {
  const table = "<#=table#>";
  const method = "updateTenantById";
  
  const tenantExist = await tenantDao.existById(tenant_id);
  if (!tenantExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = /*sql*/ `
    update
      <#=table#>
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
if (hasDeptId) {
#>

/**
 * 根据id修改部门id
 * @export
 * @param {string} id
 * @param {string} dept_id
 * @param {{
 *   }} [options]
 * @return {Promise<number>}
 */
async function updateDeptById(
  id: string,
  dept_id: string,
  options?: {
  },
): Promise<number> {
  const table = "<#=table#>";
  const method = "updateDeptById";
  
  const deptExist = await deptDao.existById(dept_id);
  if (!deptExist) {
    return 0;
  }
  
  const args = new QueryArgs();
  const sql = /*sql*/ `
    update
      <#=table#>
    set
      update_time = ${ args.push(reqDate()) },
      dept_id = ${ args.push(dept_id) }
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
#>

/**
 * 根据id修改一行数据
 * @param {string} id
 * @param {PartialNull<<#=Table_Up#>Model>} model
 * @param {({
 *   uniqueType?: "ignore" | "throw" | "update",
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   create: 级联插入新数据
 * @return {Promise<string>}
 */
async function updateById(
  id: string,
  model: PartialNull<<#=Table_Up#>Model>,
  options?: {
    uniqueType?: "ignore" | "throw" | "create";
  },
): Promise<string> {
  const table = "<#=table#>";
  const method = "updateById";
  
  if (!id || !model) {
    return id;
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
  if (hasLocked) {
  #>
  
  const is_locked = await getIs_lockedById(id);
  if (is_locked) {
    throw "不能修改已经锁定的数据";
  }<#
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
  if (hasDeptId) {
  #>
  
  // 修改部门id
  if (isNotEmpty(model.dept_id)) {
    await updateDeptById(id, model.dept_id);
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
  #><#
    if (selectList.length > 0) {
  #>
  
  // <#=column_comment#>
  if (isNotEmpty(model._<#=column_name#>) && model.<#=column_name#> === undefined) {
    model._<#=column_name#> = String(model._<#=column_name#>).trim();<#
      for (let i = 0; i < selectList.length; i++) {
        const item = selectList[i];
        let value = item.value;
        let label = item.label;
        if (typeof(value) === "string") {
          value = `"${ value }"`;
        } else if (typeof(value) === "number") {
          value = value.toString();
        }
    #><#=i>0?" else ":"\n      "#>if (model._<#=column_name#> === "<#=label#>") {
      model.<#=column_name#> = <#=value#>;
    }<#
      }
    #>
  }<#
    } else if ((column.dict || column.dictbiz) && ![ "int", "decimal", "tinyint" ].includes(data_type)) {
  #>
  
  // <#=column_comment#>
  if (isNotEmpty(model._<#=column_name#>) && model.<#=column_name#> === undefined) {
    const val = <#=column_name#>Dict.find((itemTmp) => itemTmp.lbl === model._<#=column_name#>)?.val;
    if (val !== undefined) {
      model.<#=column_name#> = val;
    }
  }<#
    } else if ((column.dict || column.dictbiz) && [ "int", "decimal", "tinyint" ].includes(data_type)) {
  #>
  
  // <#=column_comment#>
  if (isNotEmpty(model._<#=column_name#>) && model.<#=column_name#> === undefined) {
    const val = <#=column_name#>Dict.find((itemTmp) => itemTmp.lbl === model._<#=column_name#>)?.val;
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
  if (isNotEmpty(model._<#=column_name#>) && model.<#=column_name#> === undefined) {
    model._<#=column_name#> = String(model._<#=column_name#>).trim();
    const <#=foreignTable#>Model = await <#=daoStr#>findOne({ <#=foreignKey.lbl#>: model._<#=column_name#> });
    if (<#=foreignTable#>Model) {
      model.<#=column_name#> = <#=foreignTable#>Model.id;
    }
  }<#
    } else if (foreignKey && (foreignKey.type === "many2many" || foreignKey.multiple) && foreignKey.lbl) {
  #>

  // <#=column_comment#>
  if (!model.<#=column_name#> && model._<#=column_name#>) {
    if (typeof model._<#=column_name#> === "string" || model._<#=column_name#> instanceof String) {
      model._<#=column_name#> = model._<#=column_name#>.split(",");
    }
    model._<#=column_name#> = model._<#=column_name#>.map((item: string) => item.trim());
    const args = new QueryArgs();
    const sql = /*sql*/ `
      select
        t.id
      from
        <#=foreignTable#> t
      where
        t.<#=foreignKey.lbl#> in ${ args.push(model._<#=column_name#>) }
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
  #>
  
  const oldModel = await findByUnique(model);
  if (oldModel) {
    if (oldModel.id !== id && options?.uniqueType !== "create") {
      const result = await checkByUnique(model, oldModel, options?.uniqueType);
      if (result) {
        return result;
      }
    }
  } else {
    if (options?.uniqueType === "create") {
      const result = await create({ ...model, id });
      return result;
    }
  }
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    update <#=table#> set update_time = ${ args.push(reqDate()) }
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
  #><#
    if (column.isPassword) {
  #>
  if (isNotEmpty(model.<#=column_name#>)) {
    sql += `,<#=column_name#> = ?`;
    args.push(await authDao.getPassword(model.<#=column_name#>));
    updateFldNum++;
  }<#
    } else if (foreignKey && foreignKey.type === "json") {
  #>
  if (model.<#=column_name#> !== undefined) {
    if (isEmpty(model.<#=column_name#>)) {
      model.<#=column_name#> = null;
    }
    if (model.<#=column_name#> != oldModel?.<#=column_name#>) {
      sql += `,\\`<#=column_name#>\\` = ${ args.push(model.<#=column_name#>) }`;
      updateFldNum++;
    }
  }<#
    } else if (foreignKey && foreignKey.type === "many2many") {
  #><#
    } else if (!foreignKey) {
  #>
  if (model.<#=column_name#> !== undefined) {
    if (model.<#=column_name#> != oldModel?.<#=column_name#>) {
      sql += `,\\`<#=column_name#>\\` = ${ args.push(model.<#=column_name#>) }`;
      updateFldNum++;
    }
  }<#
    } else {
  #>
  if (model.<#=column_name#> !== undefined) {
    if (model.<#=column_name#> != oldModel?.<#=column_name#>) {
      sql += `,\\`<#=column_name#>\\` = ${ args.push(model.<#=column_name#>) }`;
      updateFldNum++;
    }
  }<#
    }
  #><#
  }
  #>
  if (updateFldNum > 0) {
    {
      const authModel = await authDao.getAuthModel();
      if (authModel?.id !== undefined) {
        sql += `,update_usr_id = ${ args.push(authModel.id) }`;
      }
    }
    sql += /*sql*/ ` where id = ${ args.push(id) } limit 1`;
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
  await many2manyUpdate({ ...model, id }, "<#=column_name#>", { table: "<#=many2many.table#>", column1: "<#=many2many.column1#>", column2: "<#=many2many.column2#>" });<#
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
  
  return id;
}

/**
 * 根据 ids 删除数据
 * @param {string[]} ids
 * @return {Promise<number>}
 */
async function deleteByIds(
  ids: string[],
  options?: {
  },
): Promise<number> {
  const table = "<#=table#>";
  const method = "deleteByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const args = new QueryArgs();
    const id = ids[i];
    const isExist = await existById(id);
    if (!isExist) {
      continue;
    }<#
    if (hasLocked) {
    #>
    
    const is_locked = await getIs_lockedById(id);
    if (is_locked) {
      continue;
    }<#
    }
    #>
    const sql = /*sql*/ `
      update
        <#=table#>
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
if (hasLocked) {
#>

/**
 * 根据 ID 查找是否已锁定
 * 已锁定的记录不能修改和删除
 * 记录不存在则返回 undefined
 * @param {string} id
 * @return {Promise<0 | 1 | undefined>}
 */
async function getIs_lockedById(
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
async function lockByIds(
  ids: string[],
  is_locked: 0 | 1,
  options?: {
  },
): Promise<number> {
  const table = "<#=table#>";
  const method = "lockByIds";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  const args = new QueryArgs();
  let sql = /*sql*/ `
    update
      <#=table#>
    set
      is_locked = ${ args.push(is_locked) },
      update_time = ${ args.push(reqDate()) }
    
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
async function revertByIds(
  ids: string[],
  options?: {
  },
): Promise<number> {
  const table = "<#=table#>";
  const method = "create";
  
  if (!ids || !ids.length) {
    return 0;
  }
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const args = new QueryArgs();
    const sql = /*sql*/ `
      update
        <#=table#>
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
async function forceDeleteByIds(
  ids: string[],
  options?: {
  },
): Promise<number> {
  const table = "<#=table#>";
  const method = "create";
  
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
          <#=table#>
        where
          id = ${ args.push(id) }
      `;
      const model = await queryOne(sql, args);
      log("forceDeleteByIds:", model);
    }
    const args = new QueryArgs();
    const sql = /*sql*/ `
      delete from
        <#=table#>
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
async function findLastOrderBy(
  options?: {
  },
): Promise<number> {
  const table = "<#=table#>";
  const method = "findLastOrderBy";
  
  let sql = /*sql*/ `
    select
      t.order_by order_by
    from
      <#=table#> t
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
  if (hasDeptId) {
  #>
  {
    const authModel = await authDao.getAuthModel();
    const dept_id = authModel?.dept_id;
    if (dept_id) {
      whereQuery.push(`t.dept_id = ${ args.push(dept_id) }`);
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
