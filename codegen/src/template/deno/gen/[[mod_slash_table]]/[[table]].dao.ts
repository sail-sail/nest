<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasPassword = columns.some((column) => column.isPassword);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasEnabled = columns.some((column) => column.COLUMN_NAME === "is_enabled");
const hasDefault = columns.some((column) => column.COLUMN_NAME === "is_default");
const hasIsMonth = columns.some((column) => column.isMonth);
const hasDate = columns.some((column) => column.DATA_TYPE === "date");
const hasDatetime = columns.some((column) => column.DATA_TYPE === "datetime");
const hasOrgId = columns.some((column) => column.COLUMN_NAME === "org_id");
const hasVersion = columns.some((column) => column.COLUMN_NAME === "version");
const hasCreateUsrId = columns.some((column) => column.COLUMN_NAME === "create_usr_id");
const hasCreateTime = columns.some((column) => column.COLUMN_NAME === "create_time");
const hasInlineForeignTabs = opts?.inlineForeignTabs && opts?.inlineForeignTabs.length > 0;
const inlineForeignTabs = opts?.inlineForeignTabs || [ ];
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
const hasEncrypt = columns.some((column) => {
  if (column.ignoreCodegen) {
    return false;
  }
  return !!column.isEncrypt;
});
#><#
const hasSummary = columns.some((column) => column.showSummary);
#>// deno-lint-ignore-file prefer-const no-unused-vars ban-types require-await
import {
  escapeId,
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
  shortUuidV4,<#
  if (cache) {
  #>
  hash,<#
  }
  #>
} from "/lib/util/string_util.ts";

import {
  deepCompare,
} from "/lib/util/object_util.ts";

import * as validators from "/lib/validators/mod.ts";<#
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
#><#
if (hasEncrypt) {
#>

import {
  encrypt,
  decrypt,
} from "/lib/util/dao_util.ts";<#
}
#>

import {
  UniqueType,
  SortOrderEnum,
} from "/gen/types.ts";

import type {
  PageInput,
  SortInput,
} from "/gen/types.ts";

import type {
  <#=inputName#>,
  <#=modelName#>,
  <#=searchName#>,
  <#=fieldCommentName#>,
} from "./<#=table#>.model.ts";<#
if (hasSummary) {
#>

import type {
  <#=Table_Up#>Summary,
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
#><#
if (hasDataPermit()) {
#>

import {
  getDataPermits,
} from "/src/base/data_permit/data_permit.dao.ts";

import {
  getAuthDeptIds,
  getAuthAndParentsDeptIds,
} from "/src/base/dept/dept.dao.ts";

import {
  getAuthRoleIds,
} from "/src/base/role/role.dao.ts";<#
}
#><#
const findAllTableUps = [ ];
const createTableUps = [ ];
const deleteByIdsTableUps = [ ];
const revertByIdsTableUps = [ ];
const updateByIdTableUps = [ ];
const forceDeleteByIdsUps = [ ];
for (const inlineForeignTab of inlineForeignTabs) {
  const table = inlineForeignTab.table;
  const mod = inlineForeignTab.mod;
  const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
  const Table_Up = tableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  if (
    findAllTableUps.includes(Table_Up) &&
    createTableUps.includes(Table_Up) &&
    deleteByIdsTableUps.includes(Table_Up) &&
    revertByIdsTableUps.includes(Table_Up) &&
    updateByIdTableUps.includes(Table_Up) &&
    forceDeleteByIdsUps.includes(Table_Up)
  ) {
    continue;
  }
  const hasFindAllTableUps = findAllTableUps.includes(Table_Up);
  if (!hasFindAllTableUps) {
    findAllTableUps.push(Table_Up);
  }
  const hasCreateTableUps = createTableUps.includes(Table_Up);
  if (!hasCreateTableUps) {
    createTableUps.push(Table_Up);
  }
  const hasDeleteByIdsTableUps = deleteByIdsTableUps.includes(Table_Up);
  if (!hasDeleteByIdsTableUps) {
    deleteByIdsTableUps.push(Table_Up);
  }
  const hasRevertByIdsTableUps = revertByIdsTableUps.includes(Table_Up);
  if (!hasRevertByIdsTableUps) {
    revertByIdsTableUps.push(Table_Up);
  }
  const hasUpdateByIdTableUps = updateByIdTableUps.includes(Table_Up);
  if (!hasUpdateByIdTableUps) {
    updateByIdTableUps.push(Table_Up);
  }
  const hasForceDeleteByIdsUps = forceDeleteByIdsUps.includes(Table_Up);
  if (!hasForceDeleteByIdsUps) {
    forceDeleteByIdsUps.push(Table_Up);
  }
#>

import {<#
  if (!hasFindAllTableUps) {
  #>
  findAll as findAll<#=Table_Up#>,<#
  }
  #><#
  if (!hasCreateTableUps) {
  #>
  create as create<#=Table_Up#>,<#
  }
  #><#
  if (!hasDeleteByIdsTableUps) {
  #>
  deleteByIds as deleteByIds<#=Table_Up#>,<#
  }
  #><#
  if (!hasRevertByIdsTableUps) {
  #>
  revertByIds as revertByIds<#=Table_Up#>,<#
  }
  #><#
  if (!hasUpdateByIdTableUps) {
  #>
  updateById as updateById<#=Table_Up#>,<#
  }
  #><#
  if (!hasForceDeleteByIdsUps) {
  #>
  forceDeleteByIds as forceDeleteByIds<#=Table_Up#>,<#
  }
  #>
} from "/gen/<#=mod#>/<#=table#>/<#=table#>.dao.ts";<#
}
#>

const route_path = "/<#=mod#>/<#=table#>";

async function getWhereQuery(
  args: QueryArgs,
  search?: <#=searchName#>,
  options?: {
  },
): Promise<string> {<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  const dataPermitModels = await getDataPermits(route_path);
  const hasUsrPermit = dataPermitModels.some((item) => item.type === "create_usr");
  const hasRolePermit = dataPermitModels.some((item) => item.type === "role");
  const hasDeptPermit = dataPermitModels.some((item) => item.type === "dept");
  const hasDeptParentPermit = dataPermitModels.some((item) => item.type === "dept_parent");
  const hasTenantPermit = dataPermitModels.some((item) => item.type === "tenant");<#
  }
  #>
  let whereQuery = "";
  whereQuery += ` t.is_deleted = ${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  if (!hasTenantPermit && !hasDeptPermit && !hasRolePermit && hasUsrPermit) {
    const authModel = await authDao.getAuthModel();
    if (authModel?.id !== undefined) {
      whereQuery += ` and t.create_usr_id = ${ args.push(authModel.id) }`;
    }
  } else if (!hasTenantPermit && hasDeptParentPermit) {
    const dept_ids = await getAuthAndParentsDeptIds();
    whereQuery += ` and _permit_usr_dept_.dept_id in ${ args.push(dept_ids) }`;
  } else if (!hasTenantPermit && hasDeptPermit) {
    const dept_ids = await getAuthDeptIds();
    whereQuery += ` and _permit_usr_dept_.dept_id in ${ args.push(dept_ids) }`;
  }
  if (!hasTenantPermit && hasRolePermit) {
    const role_ids = await getAuthRoleIds();
    whereQuery += ` and _permit_usr_role_.role_id in ${ args.push(role_ids) }`;
  }<#
  }
  #><#
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
    if (column_name === "is_sys") continue;
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
  } else if (!column.isEncrypt) {
  #>
  if (search?.<#=column_name#> !== undefined) {
    whereQuery += ` and t.<#=column_name#> = ${ args.push(search.<#=column_name#>) }`;
  }
  if (search?.<#=column_name#> === null) {
    whereQuery += ` and t.<#=column_name#> is null`;
  }
  if (isNotEmpty(search?.<#=column_name#>_like)) {
    whereQuery += ` and t.<#=column_name#> like ${ args.push("%" + sqlLike(search?.<#=column_name#>_like) + "%") }`;
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

async function getFromQuery() {<#
  if (hasDataPermit()) {
  #>
  const dataPermitModels = await getDataPermits(route_path);
  const hasUsrPermit = dataPermitModels.some((item) => item.type === "create_usr");
  const hasRolePermit = dataPermitModels.some((item) => item.type === "role");
  const hasDeptPermit = dataPermitModels.some((item) => item.type === "dept" || item.type === "dept_parent");
  const hasTenantPermit = dataPermitModels.some((item) => item.type === "tenant");<#
  }
  #>
  let fromQuery = `
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
        json_objectagg(<#=many2many.mod#>_<#=many2many.table#>.order_by, <#=foreignKey.mod#>_<#=foreignTable#>.id) <#=column_name#>,<#
          if (foreignKey.lbl) {
        #>
        json_objectagg(<#=many2many.mod#>_<#=many2many.table#>.order_by, <#=foreignKey.mod#>_<#=foreignTable#>.<#=foreignKey.lbl#>) <#=column_name#>_lbl,<#
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
  `;<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  if (!hasTenantPermit && hasDeptPermit) {
    fromQuery += `
      left join base_usr_dept _permit_usr_dept_
        on _permit_usr_dept_.usr_id  = t.create_usr_id
    `;
  }
  if (!hasTenantPermit && hasRolePermit) {
    fromQuery += `
      left join base_usr_role _permit_usr_role_
        on _permit_usr_role_.usr_id  = t.create_usr_id
    `;
  }<#
  }
  #>
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
  `;<#
  if (cache) {
  #>
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));<#
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
): Promise<<#=modelName#>[]> {
  const table = "<#=mod#>_<#=table#>";
  const method = "findAll";
  
  const args = new QueryArgs();
  let sql = `
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
      ${ await getFromQuery() }
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
  sort = sort.filter((item) => item.prop);<#
  if (opts?.defaultSort) {
    const prop = opts?.defaultSort.prop;
    let order = "asc";
    if (opts?.defaultSort.order === "ascending") {
      order = "asc";
    } else if (opts?.defaultSort.order === "descending") {
      order = "desc";
    }
    if (order === "asc") {
      order = "SortOrderEnum.Asc";
    } else {
      order = "SortOrderEnum.Desc";
    }
  #>
  sort.push({
    prop: "<#=prop#>",
    order: <#=order#>,
  });<#
  }
  #><#
  if (hasCreateTime) {
  #>
  sort.push({
    prop: "create_time",
    order: SortOrderEnum.Desc,
  });<#
  }
  #>
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
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));<#
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
  var hasMany2manyTmp = false;
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    const column_comment = column.COLUMN_COMMENT || "";
    if (column.isVirtual && column_name !== "org_id") continue;
    const foreignKey = column.foreignKey;
    let data_type = column.DATA_TYPE;
    if (!foreignKey) continue;
    if (foreignKey.type !== "many2many") {
      continue;
    }
    const foreignTable = foreignKey.table;
    const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const many2many = column.many2many;
    hasMany2manyTmp = true;
    break;
  }
  #><#
  if (hasMany2manyTmp) {
  #>
  for (const item of result) {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      const column_comment = column.COLUMN_COMMENT || "";
      if (column.isVirtual && column_name !== "org_id") continue;
      const foreignKey = column.foreignKey;
      let data_type = column.DATA_TYPE;
      if (!foreignKey) continue;
      if (foreignKey.type !== "many2many") {
        continue;
      }
      const foreignTable = foreignKey.table;
      const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const many2many = column.many2many;
    #>
    
    // <#=column_comment#>
    if (item.<#=column_name#>) {
      const obj = item.<#=column_name#> as unknown as {[key: string]: string};
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.<#=column_name#> = keys.map((key) => obj[key]);
    }<#
      if (foreignKey.lbl) {
    #>
    if (item.<#=column_name#>_lbl) {
      const obj = item.<#=column_name#>_lbl as unknown as {[key: string]: string};
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.<#=column_name#>_lbl = keys.map((key) => obj[key]);
    }<#
      }
    #><#
    }
    #>
  }<#
  }
  #><#
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
      if (column_name === "is_sys") continue;
      if (column_name === "is_deleted") continue;
      if (column_name === "is_hidden") continue;
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
      if (column_name === "is_sys") continue;
      if (column_name === "is_deleted") continue;
      if (column_name === "is_hidden") continue;
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
      if (column_name === "is_deleted") continue;
      if (column_name === "is_hidden") continue;
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
      if (column_name === "is_deleted") continue;
      if (column_name === "is_hidden") continue;
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
  #><#
  for (const inlineForeignTab of inlineForeignTabs) {
    const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
    if (!inlineForeignSchema) {
      throw `表: ${ mod }_${ table } 的 inlineForeignTabs 中的 ${ inlineForeignTab.mod }_${ inlineForeignTab.table } 不存在`;
      process.exit(1);
    }
    const table = inlineForeignTab.table;
    const mod = inlineForeignTab.mod;
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
  #>
  
  // <#=inlineForeignTab.label#>
  const <#=table#>_models = await findAll<#=Table_Up#>({
    <#=inlineForeignTab.column#>: result.map((item) => item.id),
    is_deleted: search?.is_deleted,
  });<#
  }
  #>
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      if (column_name === "is_sys") continue;
      if (column_name === "is_deleted") continue;
      if (column_name === "is_hidden") continue;
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
      const isEncrypt = column.isEncrypt;
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
      } else if (isEncrypt) {
    #>
    // <#=column_comment#>
    model.<#=column_name#> = await decrypt(model.<#=column_name#>);<#
      } else if (selectList.length > 0) {
    #>
    // <#=column_comment#>
    let <#=column_name#>_lbl = "";<#
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
    let <#=column_name#>_lbl = model.<#=column_name#>?.toString() || "";
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
      } else if (data_type === "date" && !column.isMonth) {
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
      } else if (column.isMonth) {
    #>
    
    // <#=column_comment#>
    if (model.<#=column_name#>) {
      const <#=column_name#> = dayjs(model.<#=column_name#>);
      if (!<#=column_name#>.isValid()) {
        model.<#=column_name#>_lbl = (model.<#=column_name#> || "").toString();
      } else {
        model.<#=column_name#>_lbl = <#=column_name#>.format("YYYY-MM");
      }
    } else {
      model.<#=column_name#>_lbl = "";
    }<#
      }
    #><#
    }
    #><#
    for (const inlineForeignTab of inlineForeignTabs) {
      const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
      if (!inlineForeignSchema) {
        throw `表: ${ mod }_${ table } 的 inlineForeignTabs 中的 ${ inlineForeignTab.mod }_${ inlineForeignTab.table } 不存在`;
        process.exit(1);
      }
      const table = inlineForeignTab.table;
      const mod = inlineForeignTab.mod;
      const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
      const Table_Up = tableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
    #>
    
    // <#=inlineForeignTab.label#>
    model.<#=table#>_models = <#=table#>_models
      .filter((item) => item.<#=inlineForeignTab.column#> === model.id)<#
    }
    #>
  }
  
  return result;
}

/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: <#=inputName#>,
) {<#
  if (hasIsMonth || hasDate || hasDatetime) {
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (
      [
        "id",
        "create_usr_id",
        "create_time",
        "update_usr_id",
        "update_time",
        "is_sys",
        "is_deleted",
        "is_hidden",
      ].includes(column_name)
    ) continue;
    let column_comment = column.COLUMN_COMMENT || "";
  #><#
    if (column.isMonth) {
  #>
  // <#=column_comment#>
  if (!input.<#=column_name#> && input.<#=column_name#>_lbl) {
    const <#=column_name#>_lbl = dayjs(input.<#=column_name#>_lbl);
    if (<#=column_name#>_lbl.isValid()) {
      input.<#=column_name#> = <#=column_name#>_lbl.format("YYYY-MM-DD HH:mm:ss");
    } else {
      const fieldComments = await getFieldComments();
      throw `${ fieldComments.<#=column_name#> } ${ await ns("日期格式错误") }`;
    }
  }
  if (input.<#=column_name#>) {
    const <#=column_name#> = dayjs(input.<#=column_name#>);
    if (!<#=column_name#>.isValid()) {
      const fieldComments = await getFieldComments();
      throw `${ fieldComments.<#=column_name#> } ${ await ns("日期格式错误") }`;
    }
    input.<#=column_name#> = dayjs(input.<#=column_name#>).startOf("month").format("YYYY-MM-DD HH:mm:ss");
  }<#
    } else if (column.DATA_TYPE === "date") {
  #>
  // <#=column_comment#>
  if (!input.<#=column_name#> && input.<#=column_name#>_lbl) {
    const <#=column_name#>_lbl = dayjs(input.<#=column_name#>_lbl);
    if (<#=column_name#>_lbl.isValid()) {
      input.<#=column_name#> = <#=column_name#>_lbl.format("YYYY-MM-DD HH:mm:ss");
    } else {
      const fieldComments = await getFieldComments();
      throw `${ fieldComments.<#=column_name#> } ${ await ns("日期格式错误") }`;
    }
  }
  if (input.<#=column_name#>) {
    const <#=column_name#> = dayjs(input.<#=column_name#>);
    if (!<#=column_name#>.isValid()) {
      const fieldComments = await getFieldComments();
      throw `${ fieldComments.<#=column_name#> } ${ await ns("日期格式错误") }`;
    }
    input.<#=column_name#> = dayjs(input.<#=column_name#>).format("YYYY-MM-DD HH:mm:ss");
  }<#
    } else if (column.DATA_TYPE === "datetime") {
  #>
  // <#=column_comment#>
  if (!input.<#=column_name#> && input.<#=column_name#>_lbl) {
    const <#=column_name#>_lbl = dayjs(input.<#=column_name#>_lbl);
    if (<#=column_name#>_lbl.isValid()) {
      input.<#=column_name#> = <#=column_name#>_lbl.format("YYYY-MM-DD HH:mm:ss");
    } else {
      const fieldComments = await getFieldComments();
      throw `${ fieldComments.<#=column_name#> } ${ await ns("日期格式错误") }`;
    }
  }
  if (input.<#=column_name#>) {
    const <#=column_name#> = dayjs(input.<#=column_name#>);
    if (!<#=column_name#>.isValid()) {
      const fieldComments = await getFieldComments();
      throw `${ fieldComments.<#=column_name#> } ${ await ns("日期格式错误") }`;
    }
    input.<#=column_name#> = dayjs(input.<#=column_name#>).format("YYYY-MM-DD HH:mm:ss");
  }<#
    }
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
      if (column_name === "is_sys") continue;
      if (column_name === "is_deleted") continue;
      if (column_name === "is_hidden") continue;
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
      if (column_name === "is_sys") continue;
      if (column_name === "is_deleted") continue;
      if (column_name === "is_hidden") continue;
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
      if (column_name === "is_deleted") continue;
      if (column_name === "is_hidden") continue;
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
      if (column_name === "is_deleted") continue;
      if (column_name === "is_hidden") continue;
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
    if ([
      "id",
      "create_usr_id",
      "create_time",
      "update_usr_id",
      "update_time",
      "is_sys",
      "is_deleted",
      "is_hidden",
    ].includes(column_name)) continue;
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
  if (isNotEmpty(input.<#=column_name#>_lbl) && input.<#=column_name#> === undefined) {
    input.<#=column_name#>_lbl = String(input.<#=column_name#>_lbl).trim();<#
      for (let i = 0; i < selectList.length; i++) {
        const item = selectList[i];
        let value = item.value;
        let label = item.label;
        if (typeof(value) === "string") {
          value = `"${ value }"`;
        } else if (typeof(value) === "number") {
          value = value.toString();
        }
    #><#=i>0?" else ":"\n      "#>if (input.<#=column_name#>_lbl === "<#=label#>") {
      input.<#=column_name#> = <#=value#>;
    }<#
      }
    #>
  }<#
    } else if ((column.dict || column.dictbiz) && ![ "int", "decimal", "tinyint" ].includes(data_type)) {
  #>
  
  // <#=column_comment#>
  if (isNotEmpty(input.<#=column_name#>_lbl) && input.<#=column_name#> === undefined) {
    const val = <#=column_name#>Dict.find((itemTmp) => itemTmp.lbl === input.<#=column_name#>_lbl)?.val;
    if (val !== undefined) {
      input.<#=column_name#> = val;
    }
  }<#
    } else if ((column.dict || column.dictbiz) && [ "int", "decimal", "tinyint" ].includes(data_type)) {
  #>
  
  // <#=column_comment#>
  if (isNotEmpty(input.<#=column_name#>_lbl) && input.<#=column_name#> === undefined) {
    const val = <#=column_name#>Dict.find((itemTmp) => itemTmp.lbl === input.<#=column_name#>_lbl)?.val;
    if (val !== undefined) {
      input.<#=column_name#> = Number(val);
    }
  }<#
    } else if (foreignKey && foreignKey.type !== "many2many" && !foreignKey.multiple && foreignKey.lbl) {
      let daoStr = "";
      if (foreignTable !== table) {
        daoStr = `${ foreignTable }Dao.`;
      }
  #>
  
  // <#=column_comment#>
  if (isNotEmpty(input.<#=column_name#>_lbl) && input.<#=column_name#> === undefined) {
    input.<#=column_name#>_lbl = String(input.<#=column_name#>_lbl).trim();
    const <#=foreignTable#>Model = await <#=daoStr#>findOne({ <#=foreignKey.lbl#>: input.<#=column_name#>_lbl });
    if (<#=foreignTable#>Model) {
      input.<#=column_name#> = <#=foreignTable#>Model.id;
    }
  }<#
    } else if (foreignKey && (foreignKey.type === "many2many" || foreignKey.multiple) && foreignKey.lbl) {
  #>
  
  // <#=column_comment#>
  if (!input.<#=column_name#> && input.<#=column_name#>_lbl) {
    if (typeof input.<#=column_name#>_lbl === "string" || input.<#=column_name#>_lbl instanceof String) {
      input.<#=column_name#>_lbl = input.<#=column_name#>_lbl.split(",");
    }
    input.<#=column_name#>_lbl = input.<#=column_name#>_lbl.map((item: string) => item.trim());
    const args = new QueryArgs();
    const sql = `
      select
        t.id
      from
        <#=foreignKey.mod#>_<#=foreignTable#> t
      where
        t.<#=foreignKey.lbl#> in ${ args.push(input.<#=column_name#>_lbl) }
    `;
    interface Result {
      id: string;
    }
    const models = await query<Result>(sql, args);
    input.<#=column_name#> = models.map((item: { id: string }) => item.id);
  }<#
  } else if (data_type === "date" || data_type === "datetime" || data_type === "timestamp") {
  #>
  
  // <#=column_comment#>
  if (isNotEmpty(input.<#=column_name#>_lbl) && input.<#=column_name#> === undefined) {
    input.<#=column_name#>_lbl = String(input.<#=column_name#>_lbl).trim();
    input.<#=column_name#> = input.<#=column_name#>_lbl;<#
    if (column.isMonth) {
    #>
    if (input.<#=column_name#>) {
      input.<#=column_name#> = dayjs(input.<#=column_name#>).startOf("month").format("YYYY-MM-DD HH:mm:ss");
    }<#
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
    if (column_name === "is_sys") continue;
    if (column_name === "is_deleted") continue;
    if (column_name === "is_hidden") continue;
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
  if (input.<#=column_name#> != null) {
    const dictModel = <#=column_name#>Dict.find((itemTmp) => {
      return itemTmp.val === dictSrcDao.val2Str(input.<#=column_name#>, itemTmp.type as any);
    });<#
    for (const key of redundLblKeys) {
      const val = redundLbl[key];
    #>
    input.<#=val#> = dictModel?.<#=key#>;<#
    }
    #>
  }<#
    } else if (column.dictbiz) {
  #>
  
  // <#=column_comment#>
  if (input.<#=column_name#> != null) {
    const dictbizModel = <#=column_name#>Dict.find((itemTmp) => {
      return itemTmp.val === dictbizSrcDao.val2Str(input.<#=column_name#>, itemTmp.type as any);
    });<#
    for (const key of redundLblKeys) {
      const val = redundLbl[key];
    #>
    input.<#=val#> = dictbizModel?.<#=key#>;<#
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
    if (column_name === "is_sys") continue;
    if (column_name === "is_deleted") continue;
    if (column_name === "is_hidden") continue;
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
  if (isNotEmpty(input.<#=column_name#>)) {
    const {
      findById: findById<#=foreignTableUp#>,
    } = await import("/gen/<#=foreignKey.mod#>/<#=foreignTable#>/<#=foreignTable#>.dao.ts");
    
    const <#=foreignTable#>Model = await findById<#=foreignTableUp#>(input.<#=column_name#>);
    if (<#=foreignTable#>Model) {<#
      for (const key of redundLblKeys) {
        const val = redundLbl[key];
      #>
      input.<#=val#> = <#=foreignTable#>Model.<#=key#>;<#
      }
      #>
    }
  }<#
  }
  #>
}

/**
 * 获取字段对应的名称
 */
export async function getFieldComments(): Promise<<#=fieldCommentName#>> {
  const n = initN(route_path);
  const fieldComments: <#=fieldCommentName#> = {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      let data_type = column.DATA_TYPE;
      let column_type = column.COLUMN_TYPE;
      let column_comment = column.COLUMN_COMMENT || "";
      if (column_name === "is_sys") {
        continue;
      }
      if (column_name === "is_deleted") {
        continue;
      }
      if (column_name === "org_id") {
        continue;
      }
      if (column_name === "tenant_id") {
        continue;
      }
      if (column_name === "is_hidden") {
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
 * 通过唯一约束获得数据列表
 * @param {<#=inputName#>} search0
 */
export async function findByUnique(
  search0: <#=inputName#>,
  options?: {
  },
): Promise<<#=modelName#>[]> {
  if (search0.id) {
    const model = await findOne({
      id: search0.id,
    });
    if (!model) {
      return [ ];
    }
    return [ model ];
  }
  const models: <#=modelName#>[] = [ ];<#
  for (let i = 0; i < (opts.uniques || [ ]).length; i++) {
    const uniques = opts.uniques[i];
  #>
  {<#
    for (let k = 0; k < uniques.length; k++) {
      const unique = uniques[k];
      const column = columns.find((item) => item.COLUMN_NAME === unique);
      if (!column) {
        throw new Error(`找不到列：${ unique }, 请检查表 ${ table } 的索引配置opts.uniques: ${ uniques.join(",") }`);
      }
      const data_type = column.DATA_TYPE;
      const foreignKey = column.foreignKey;
    #>
    if (search0.<#=unique#> == null) {
      return [ ];
    }<#
    if (
      foreignKey
      || data_type === "datetime"
      || data_type === "date"
      || data_type === "int"
      || data_type === "decimal"
      || column.dict
      || column.dictbiz
    ) {
      let _data_type = "string";
      if (column.dict || column.dictbiz) {
        if (data_type === "tinyint" || data_type === "int") {
          _data_type = "number";
        }
      }
    #>
    let <#=unique#>: <#=_data_type#>[] = [ ];
    if (!Array.isArray(search0.<#=unique#>)) {
      <#=unique#>.push(search0.<#=unique#>, search0.<#=unique#>);
    } else {
      <#=unique#> = search0.<#=unique#>;
    }<#
    } else {
    #>
    const <#=unique#> = search0.<#=unique#>;<#
    }
    #><#
    }
    #>
    const modelTmps = await findAll({<#
      for (let k = 0; k < uniques.length; k++) {
        const unique = uniques[k];
      #>
      <#=unique#>,<#
      }
      #>
    });
    models.push(...modelTmps);
  }<#
  }
  #>
  return models;
}

/**
 * 根据唯一约束对比对象是否相等
 * @param {<#=modelName#>} oldModel
 * @param {<#=inputName#>} input
 * @return {boolean}
 */
export function equalsByUnique(
  oldModel: <#=modelName#>,
  input: <#=inputName#>,
): boolean {
  if (!oldModel || !input) {
    return false;
  }<#
  for (let i = 0; i < (opts.uniques || [ ]).length; i++) {
    const uniques = opts.uniques[i];
  #>
  if (<#
    for (let k = 0; k < uniques.length; k++) {
      const unique = uniques[k];
      const column = columns.find((item) => item.COLUMN_NAME === unique);
      if (!column) {
        throw new Error(`找不到列：${ unique }, 请检查表 ${ table } 的索引配置opts.uniques: ${ uniques.join(",") }`);
      }
      const data_type = column.DATA_TYPE;
    #><#
      if (data_type === "date" && !column.isMonth) {
    #>
    dayjs(oldModel.<#=unique#>).isSame(input.<#=unique#>)<#
      } else if (data_type === "date" && column.isMonth) {
    #>
    dayjs(oldModel.<#=unique#>).isSame(input.<#=unique#>, "month")<#
      } else if (data_type === "decimal") {
    #>
    String(oldModel.<#=unique#>) === String(input.<#=unique#>)<#
      } else {
    #>
    oldModel.<#=unique#> === input.<#=unique#><#
      }
    #><#=(k === uniques.length - 1) ? "" : " &&" #><#
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
 * @param {<#=inputName#>} input
 * @param {<#=modelName#>} oldModel
 * @param {UniqueType} uniqueType
 * @return {Promise<string>}
 */
export async function checkByUnique(
  input: <#=inputName#>,
  oldModel: <#=modelName#>,
  uniqueType: UniqueType = UniqueType.Throw,
  options?: {<#
    if (hasEncrypt) {
    #>
    isEncrypt?: boolean;<#
    }
    #>
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
          ...options,<#
          if (hasEncrypt) {
          #>
          isEncrypt: false,<#
          }
          #>
        },
      );
      return result;
    }
    if (uniqueType === UniqueType.Ignore) {
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
      ${ await getFromQuery() }
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
): Promise<<#=modelName#> | undefined> {
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
): Promise<<#=modelName#> | undefined> {
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
  const table = "<#=mod#>_<#=table#>";
  const method = "existById";
  
  if (isEmpty(id)) {
    return false;
  }
  
  const args = new QueryArgs();
  const sql = `
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
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));<#
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
}<#
if (hasEnabled) {
#>

/** 校验记录是否启用 */
export async function validateIsEnabled(
  model: <#=modelName#>,
) {
  if (model.is_enabled == 0) {
    throw `${ await ns("<#=table_comment#>") } ${ await ns("已禁用") }`;
  }
}<#
}
#>

/** 校验记录是否存在 */
export async function validateOption(
  model?: <#=modelName#>,
) {
  if (!model) {
    throw `${ await ns("<#=table_comment#>") } ${ await ns("不存在") }`;
  }
  return model;
}

/**
 * 增加和修改时校验输入
 * @param input 
 */
export async function validate(
  input: <#=inputName#>,
) {
  const fieldComments = await getFieldComments();<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
    let data_type = column.DATA_TYPE;
    let column_type = column.COLUMN_TYPE?.toLowerCase() || "";
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
    const validators = column.validators || [ ];
  #><#
    if ((foreignKey || selectList.length > 0 || column.dict || column.dictbiz) && foreignKey?.multiple) {
  #><#
    for (let j = 0; j < validators.length; j++) {
      const validator = validators[j];
  #>
  
  // <#=column_comment#><#
    if (validator.max_items != null) {
  #>
  await validators.max_items(
    input.<#=column_name#>,
    <#=validator.max_items#>,
    fieldComments.<#=column_name#>,
  );
  await validators.max_items(
    input.<#=column_name#>_lbl,
    <#=validator.max_items#>,
    fieldComments.<#=column_name#>_lbl,
  );<#
    } else if (validator.min_items != null) {
  #>
  await validators.min_items(
    input.<#=column_name#>,
    <#=validator.min_items#>,
    fieldComments.<#=column_name#>,
  );
  await validators.min_items(
    input.<#=column_name#>_lbl,
    <#=validator.min_items#>,
    fieldComments.<#=column_name#>_lbl,
  );<#
    }
  #><#
    }
  #><#
    } else if ((foreignKey || selectList.length > 0 || column.dict || column.dictbiz) && !foreignKey?.multiple) {
  #><#
    for (let j = 0; j < validators.length; j++) {
      const validator = validators[j];
  #>
  
  // <#=column_comment#><#
    if (validator.maximum != null && [ "int", "decimal", "tinyint" ].includes(data_type)) {
  #>
  await validators.maximum(
    input.<#=column_name#>,
    <#=validator.maximum#>,
    fieldComments.<#=column_name#>,
  );<#
    } else if (validator.minimum != null && [ "int", "decimal", "tinyint" ].includes(data_type)) {
  #>
  await validators.minimum(
    input.<#=column_name#>,
    <#=validator.minimum#>,
    fieldComments.<#=column_name#>,
  );<#
    } else if (validator.multiple_of != null && [ "int", "decimal", "tinyint" ].includes(data_type)) {
  #>
  await validators.multiple_of(
    input.<#=column_name#>,
    <#=validator.multiple_of#>,
    fieldComments.<#=column_name#>,
  );<#
    } else if (validator.chars_max_length != null && [ "varchar", "text" ].includes(data_type)) {
  #>
  await validators.chars_max_length(
    input.<#=column_name#>,
    <#=validator.chars_max_length#>,
    fieldComments.<#=column_name#>,
  );<#
    } else if (validator.chars_min_length != null && [ "varchar", "text" ].includes(data_type)) {
  #>
  await validators.chars_min_length(
    input.<#=column_name#>,
    <#=validator.chars_min_length#>,
    fieldComments.<#=column_name#>,
  );<#
    } else if (validator.regex != null && [ "varchar", "text" ].includes(data_type)) {
  #>
  await validators.regex(
    input.<#=column_name#>,
    "<#=validator.regex#>",
    fieldComments.<#=column_name#>,
  );<#
    } else if (validator.email != null && [ "varchar", "text" ].includes(data_type)) {
  #>
  await validators.email(
    input.<#=column_name#>,
    fieldComments.<#=column_name#>,
  );<#
    } else if (validator.url != null && [ "varchar", "text" ].includes(data_type)) {
  #>
  await validators.url(
    input.<#=column_name#>,
    fieldComments.<#=column_name#>,
  );<#
    } else if (validator.ip != null && [ "varchar", "text" ].includes(data_type)) {
  #>
  await validators.ip(
    input.<#=column_name#>,
    fieldComments.<#=column_name#>,
  );<#
    }
  #><#
    }
  #><#
    } else {
  #><#
    for (let j = 0; j < validators.length; j++) {
      const validator = validators[j];
  #>
  
  // <#=column_comment#><#
    if (validator.chars_max_length != null) {
  #>
  await validators.chars_max_length(
    input.<#=column_name#>,
    <#=validator.chars_max_length#>,
    fieldComments.<#=column_name#>,
  );<#
    } else if (validator.chars_min_length != null) {
  #>
  await validators.chars_min_length(
    input.<#=column_name#>,
    <#=validator.chars_min_length#>,
    fieldComments.<#=column_name#>,
  );<#
    }
  #><#
    }
  #><#
    }
  #><#
  }
  #>
  
}

/**
 * 创建数据
 * @param {<#=inputName#>} input
 * @param {({
 *   uniqueType?: UniqueType,
 * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
 *   ignore: 忽略冲突
 *   throw: 抛出异常
 *   update: 更新冲突数据
 * @return {Promise<string>} 
 */
export async function create(
  input: <#=inputName#>,
  options?: {
    uniqueType?: UniqueType;<#
    if (hasEncrypt) {
    #>
    isEncrypt?: boolean;<#
    }
    #>
  },
): Promise<string> {
  const table = "<#=mod#>_<#=table#>";
  const method = "create";
  
  if (input.id) {
    throw new Error(`Can not set id when create in dao: ${ table }`);
  }<#
  if (hasEncrypt) {
  #>
  if (options?.isEncrypt !== false) {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (!column.isEncrypt) {
        continue;
      }
      const column_name = column.COLUMN_NAME;
      let is_nullable = column.IS_NULLABLE === "YES";
      const foreignKey = column.foreignKey;
      let data_type = column.DATA_TYPE;
      let column_comment = column.COLUMN_COMMENT;
      let selectList = [ ];
      if (column_comment.endsWith("multiple")) {
        _data_type = "[String]";
      }
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.includes("[")) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      if (column_name === 'id') column_comment = 'ID';
    #>
    // <#=column_comment#>
    if (input.<#=column_name#> != null) {
      input.<#=column_name#> = await encrypt(input.<#=column_name#>);
    }<#
    }
    #>
  }<#
  }
  #>
  
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
  }<#
  if (mod === "base" && table === "role") {
  #>
  
  {
    const {
      filterMenuIdsByTenant,
    } = await import("/src/base/tenant/tenant.dao.ts");
    
    input.menu_ids = await filterMenuIdsByTenant(input.menu_ids);
  }<#
  }
  #>
  
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
    insert into <#=mod#>_<#=table#>(
      id
      ,create_time
      ,update_time
  `;<#
  if (hasTenant_id) {
  #>
  if (input.tenant_id != null) {
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
  if (input.org_id != null) {
    sql += `,org_id`;
  } else {
    const authModel = await authDao.getAuthModel();
    if (authModel?.org_id) {
      sql += `,org_id`;
    }
  }<#
  }
  #>
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
  }<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    if (column_name === "create_usr_id") continue;
    if (column_name === "create_time") continue;
    if (column_name === "update_usr_id") continue;
    if (column_name === "update_time") continue;
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
    const column_name_mysql = mysqlKeyEscape(column_name);
  #><#
    if (column.isPassword) {
  #>
  if (isNotEmpty(input.<#=column_name#>)) {
    sql += `,<#=column_name_mysql#>`;
  }<#
    } else if (foreignKey && foreignKey.type === "json") {
  #>
  if (input.<#=column_name#> !== undefined) {
    sql += `,<#=column_name_mysql#>`;
  }<#
    } else if (foreignKey && foreignKey.type === "many2many") {
  #><#
    } else if (!foreignKey) {
  #>
  if (input.<#=column_name#> !== undefined) {
    sql += `,<#=column_name_mysql#>`;
  }<#
    } else {
  #>
  if (input.<#=column_name#> !== undefined) {
    sql += `,<#=column_name_mysql#>`;
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
  
  if (input.<#=val#> !== undefined) {
    sql += `,<#=val#>`;
  }<#
  }
  #><#
  }
  #>
  sql += `) values(${ args.push(input.id) },${ args.push(reqDate()) },${ args.push(reqDate()) }`;<#
  if (hasTenant_id) {
  #>
  if (input.tenant_id != null) {
    sql += `,${ args.push(input.tenant_id) }`;
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
  if (input.org_id != null) {
    sql += `,${ args.push(input.org_id) }`;
  } else {
    const authModel = await authDao.getAuthModel();
    if (authModel?.org_id) {
      sql += `,${ args.push(authModel?.org_id) }`;
    }
  }<#
  }
  #>
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
  }<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    if (column_name === "create_usr_id") continue;
    if (column_name === "create_time") continue;
    if (column_name === "update_usr_id") continue;
    if (column_name === "update_time") continue;
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
  if (isNotEmpty(input.<#=column_name#>)) {
    sql += `,${ args.push(await authDao.getPassword(input.<#=column_name#>)) }`;
  }<#
    } else if (foreignKey && foreignKey.type === "json") {
  #>
  if (input.<#=column_name#> !== undefined) {
    sql += `,${ args.push(input.<#=column_name#>) }`;
  }<#
    } else if (foreignKey && foreignKey.type === "many2many") {
  #><#
    } else if (!foreignKey) {
  #>
  if (input.<#=column_name#> !== undefined) {
    sql += `,${ args.push(input.<#=column_name#>) }`;
  }<#
    } else {
  #>
  if (input.<#=column_name#> !== undefined) {
    sql += `,${ args.push(input.<#=column_name#>) }`;
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
  
  if (input.<#=val#> !== undefined) {
    sql += `,${ args.push(input.<#=val#>) }`;
  }<#
  }
  #><#
  }
  #>
  sql += `)`;<#
  if (cache) {
  #>
  
  await delCache();<#
  }
  #>
  const res = await execute(sql, args);
  log(JSON.stringify(res));<#
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
  await many2manyUpdate(
    input,
    "<#=column_name#>",
    {
      mod: "<#=many2many.mod#>",
      table: "<#=many2many.table#>",
      column1: "<#=many2many.column1#>",
      column2: "<#=many2many.column2#>",
    },
  );<#
    } else if (!foreignKey) {
  #><#
    } else {
  #><#
    }
  #><#
  }
  #><#
  for (const inlineForeignTab of inlineForeignTabs) {
    const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
    if (!inlineForeignSchema) {
      throw `表: ${ mod }_${ table } 的 inlineForeignTabs 中的 ${ inlineForeignTab.mod }_${ inlineForeignTab.table } 不存在`;
      process.exit(1);
    }
    const table = inlineForeignTab.table;
    const mod = inlineForeignTab.mod;
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
  #>
  
  // <#=inlineForeignTab.label#>
  if (input.<#=table#>_models && input.<#=table#>_models.length > 0) {
    for (let i = 0; i < input.<#=table#>_models.length; i++) {
      const <#=table#>_model = input.<#=table#>_models[i];
      <#=table#>_model.<#=inlineForeignTab.column#> = input.id;
      await create<#=Table_Up#>(<#=table#>_model);
    }
  }<#
  }
  #><#
  if (cache) {
  #>
  
  await delCache();<#
  }
  #>
  
  return input.id;
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
  const sql = `
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
 * 根据id修改组织id
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
  const sql = `
    update
      <#=mod#>_<#=table#>
    set
      update_time = ${ args.push(reqDate()) },
      org_id = ${ args.push(org_id) }
    where
      id = ${ args.push(id) }
  `;<#
  if (cache) {
  #>
  
  await delCache();<#
  }
  #>
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
export async function getVersionById(
  id: string,
): Promise<number> {
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
 * @param {<#=inputName#>} input
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
  input: <#=inputName#>,
  options?: {
    uniqueType?: "ignore" | "throw";<#
    if (hasEncrypt) {
    #>
    isEncrypt?: boolean;<#
    }
    #>
  },
): Promise<string> {
  const table = "<#=mod#>_<#=table#>";
  const method = "updateById";
  
  if (!id) {
    throw new Error("updateById: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateById: input cannot be null");
  }<#
  if (hasEncrypt) {
  #>
  if (options?.isEncrypt !== false) {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (!column.isEncrypt) {
        continue;
      }
      const column_name = column.COLUMN_NAME;
      let is_nullable = column.IS_NULLABLE === "YES";
      const foreignKey = column.foreignKey;
      let data_type = column.DATA_TYPE;
      let column_comment = column.COLUMN_COMMENT;
      let selectList = [ ];
      if (column_comment.endsWith("multiple")) {
        _data_type = "[String]";
      }
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.includes("[")) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      if (column_name === 'id') column_comment = 'ID';
    #>
    // <#=column_comment#>
    if (input.<#=column_name#> != null) {
      input.<#=column_name#> = await encrypt(input.<#=column_name#>);
    }<#
    }
    #>
  }<#
  }
  #><#
  if (hasTenant_id) {
  #>
  
  // 修改租户id
  if (isNotEmpty(input.tenant_id)) {
    await updateTenantById(id, input.tenant_id);
  }<#
  }
  #><#
  if (hasOrgId) {
  #>
  
  // 修改组织id
  if (isNotEmpty(input.org_id)) {
    await updateOrgById(id, input.org_id);
  }<#
  }
  #>
  
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
  }<#
  if (mod === "base" && table === "role") {
  #>
  
  {
    const {
      filterMenuIdsByTenant,
    } = await import("/src/base/tenant/tenant.dao.ts");
    
    input.menu_ids = await filterMenuIdsByTenant(input.menu_ids);
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
    const column_name_mysql = mysqlKeyEscape(column_name);
  #><#
    if (column.isPassword) {
  #>
  if (isNotEmpty(input.<#=column_name#>)) {
    sql += `<#=column_name_mysql#> = ?,`;
    args.push(await authDao.getPassword(input.<#=column_name#>));
    updateFldNum++;
  }<#
    } else if (foreignKey && foreignKey.type === "json") {
  #>
  if (input.<#=column_name#> !== undefined) {
    if (isEmpty(input.<#=column_name#>)) {
      input.<#=column_name#> = null;
    }
    if (input.<#=column_name#> != oldModel.<#=column_name#>) {
      sql += `<#=column_name_mysql#> = ${ args.push(input.<#=column_name#>) },`;
      updateFldNum++;
    }
  }<#
    } else if (foreignKey && foreignKey.type === "many2many") {
  #><#
    } else if (!foreignKey) {
  #>
  if (input.<#=column_name#> !== undefined) {
    if (input.<#=column_name#> != oldModel.<#=column_name#>) {
      sql += `<#=column_name_mysql#> = ${ args.push(input.<#=column_name#>) },`;
      updateFldNum++;
    }
  }<#
    } else {
  #>
  if (input.<#=column_name#> !== undefined) {
    if (input.<#=column_name#> != oldModel.<#=column_name#>) {
      sql += `<#=column_name_mysql#> = ${ args.push(input.<#=column_name#>) },`;
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
      const val_mysql = mysqlKeyEscape(val);
  #>
  if (input.<#=val#> !== undefined) {
    if (input.<#=val#> != oldModel.<#=val#>) {
      sql += `<#=val_mysql#> = ${ args.push(input.<#=val#>) },`;
      updateFldNum++;
    }
  }<#
    }
  #><#
  }
  #>
  if (updateFldNum > 0) {
    if (input.update_usr_id && input.update_usr_id !== "-") {
      sql += `update_usr_id = ${ args.push(input.update_usr_id) },`;
    } else {
      const authModel = await authDao.getAuthModel();
      if (authModel?.id !== undefined) {
        sql += `update_usr_id = ${ args.push(authModel.id) },`;
      }
    }<#
    if (hasVersion) {
    #>
    if (input.version != null && input.version > 0) {
      const version = await getVersionById(id);
      if (version && version > input.version) {
        throw await ns("数据已被修改，请刷新后重试");
      }
      sql += `version = ${ args.push(version + 1) },`;
    }<#
    }
    #>
    sql += `update_time = ${ args.push(new Date()) }`;
    sql += ` where id = ${ args.push(id) } limit 1`;<#
    if (cache) {
    #>
    
    await delCache();<#
    }
    #>
    
    const res = await execute(sql, args);
    log(JSON.stringify(res));
  }<#
  for (const inlineForeignTab of inlineForeignTabs) {
    const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
    const table = inlineForeignTab.table;
    const mod = inlineForeignTab.mod;
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
  #>
  
  // <#=inlineForeignTab.label#>
  if (input.<#=table#>_models) {
    const <#=table#>_models = await findAll<#=Table_Up#>({
      <#=inlineForeignTab.column#>: [ id ],
    });
    if (<#=table#>_models.length > 0 && input.<#=table#>_models.length > 0) {
      updateFldNum++;
    }
    for (let i = 0; i < <#=table#>_models.length; i++) {
      const <#=table#>_model = <#=table#>_models[i];
      if (input.<#=table#>_models.some((item) => item.id === <#=table#>_model.id)) {
        continue;
      }
      await deleteByIds<#=Table_Up#>([ <#=table#>_model.id ]);
    }
    for (let i = 0; i < input.<#=table#>_models.length; i++) {
      const <#=table#>_model = input.<#=table#>_models[i];
      if (!<#=table#>_model.id) {
        <#=table#>_model.<#=inlineForeignTab.column#> = id;
        await create<#=Table_Up#>(<#=table#>_model);
        continue;
      }
      if (<#=table#>_models.some((item) => item.id === <#=table#>_model.id)) {
        await revertByIds<#=Table_Up#>([ <#=table#>_model.id ]);
      }
      await updateById<#=Table_Up#>(<#=table#>_model.id, <#=table#>_model);
    }
  }<#
  }
  #><#
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
  await many2manyUpdate(
    {
      ...input,
      id,
    },
    "<#=column_name#>",
    {
      mod: "<#=many2many.mod#>",
      table: "<#=many2many.table#>",
      column1: "<#=many2many.column1#>",
      column2: "<#=many2many.column2#>",
    },
  );<#
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
  }<#
  if (cache) {
  #>
  
  if (ids.length > 0) {
    await delCache();
  }<#
  }
  #>
  
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
  for (const inlineForeignTab of inlineForeignTabs) {
    const table = inlineForeignTab.table;
    const mod = inlineForeignTab.mod;
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
  #>
  
  // <#=inlineForeignTab.label#>
  const <#=table#>_models = await findAll<#=Table_Up#>({
    <#=inlineForeignTab.column#>: ids,
    is_deleted: 0,
  });
  await deleteByIds<#=Table_Up#>(<#=table#>_models.map((item) => item.id));<#
  }
  #><#
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
  }<#
  if (cache) {
  #>
  
  await delCache();<#
  }
  #>
  
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
  let sql = `
    update
      <#=mod#>_<#=table#>
    set
      is_default = 1
    
  `;
  {
    const authModel = await authDao.getAuthModel();
    if (authModel?.id !== undefined) {
      sql += `,update_usr_id = ${ args.push(authModel.id) }`;
    }
  }
  sql += `
  
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
  }<#
  if (cache) {
  #>
  
  if (ids.length > 0) {
    await delCache();
  }<#
  }
  #>
  
  const args = new QueryArgs();
  let sql = `
    update
      <#=mod#>_<#=table#>
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
  }<#
  if (cache) {
  #>
  
  if (ids.length > 0) {
    await delCache();
  }<#
  }
  #>
  
  const args = new QueryArgs();
  let sql = `
    update
      <#=mod#>_<#=table#>
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
  }<#
  if (cache) {
  #>
  
  if (ids.length > 0) {
    await delCache();
  }<#
  }
  #>
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const args = new QueryArgs();
    const sql = `
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
  }<#
  for (const inlineForeignTab of inlineForeignTabs) {
    const table = inlineForeignTab.table;
    const mod = inlineForeignTab.mod;
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
  #>
  
  // <#=inlineForeignTab.label#>
  const <#=table#>_models = await findAll<#=Table_Up#>({
    <#=inlineForeignTab.column#>: ids,
    is_deleted: 1,
  });
  await revertByIds<#=Table_Up#>(<#=table#>_models.map((item) => item.id));<#
  }
  #><#
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
  }<#
  if (cache) {
  #>
  
  if (ids.length > 0) {
    await delCache();
  }<#
  }
  #>
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    {
      const args = new QueryArgs();
      const sql = `
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
    const sql = `
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
  for (const inlineForeignTab of inlineForeignTabs) {
    const table = inlineForeignTab.table;
    const mod = inlineForeignTab.mod;
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
  #>
  
  // <#=inlineForeignTab.label#>
  const <#=table#>_models = await findAll<#=Table_Up#>({
    <#=inlineForeignTab.column#>: ids,
    is_deleted: 1,
  });
  await forceDeleteByIds<#=Table_Up#>(<#=table#>_models.map((item) => item.id));<#
  }
  #><#
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
  
  let sql = `
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
}<#
}
#>
