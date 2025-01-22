<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasPassword = columns.some((column) => column.isPassword);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasEnabled = columns.some((column) => column.COLUMN_NAME === "is_enabled");
const hasDefault = columns.some((column) => column.COLUMN_NAME === "is_default");
const hasIsMonth = columns.some((column) => column.isMonth);
const hasDate = columns.some((column) => column.DATA_TYPE === "date");
const hasDatetime = columns.some((column) => column.DATA_TYPE === "datetime");
const hasIsDeleted = columns.some((column) => column.COLUMN_NAME === "is_deleted");
const hasInlineForeignTabs = opts?.inlineForeignTabs && opts?.inlineForeignTabs.length > 0;
const hasRedundLbl = columns.some((column) => column.redundLbl && Object.keys(column.redundLbl).length > 0);
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
  modelName = Table_Up + "Model";
  fieldCommentName = Table_Up + "FieldComment";
  inputName = Table_Up + "Input";
  searchName = Table_Up + "Search";
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
  if (column_name === "id") return false;
  if (column_name === "is_sys") return false;
  if (column_name === "is_deleted") return false;
  if (column_name === "is_hidden") return false;
  return column.dict;
});
const hasDictbiz = columns.some((column) => {
  if (column.ignoreCodegen) {
    return false;
  }
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") return false;
  if (column_name === "is_sys") return false;
  if (column_name === "is_deleted") return false;
  if (column_name === "is_hidden") return false;
  return column.dictbiz;
});
const hasDictModelLabel = columns.some((column) => {
  if (column.ignoreCodegen) {
    return false;
  }
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") return false;
  if (column_name === "is_sys") return false;
  if (column_name === "is_deleted") return false;
  if (column_name === "is_hidden") return false;
  const modelLabel = column.modelLabel;
  if (modelLabel) return false;
  return column.dict;
});
const hasDictbizModelLabel = columns.some((column) => {
  if (column.ignoreCodegen) {
    return false;
  }
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") return false;
  if (column_name === "is_sys") return false;
  if (column_name === "is_deleted") return false;
  if (column_name === "is_hidden") return false;
  const modelLabel = column.modelLabel;
  if (modelLabel) return false;
  return column.dictbiz;
});
const hasMany2manyNotInline = columns.some((column) => {
  if (column.ignoreCodegen) {
    return false;
  }
  const foreignKey = column.foreignKey;
  if (foreignKey && foreignKey.type === "many2many" && !column.inlineMany2manyTab) {
    return true;
  }
  return false;
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
const langTableExcludeArr = [
  "id",
  "lang_id",
  "create_usr_id",
  "create_usr_id_lbl",
  "create_time",
  "update_usr_id",
  "update_usr_id_lbl",
  "update_time",
  "is_deleted",
  "tenant_id",
  "deleted_usr_id",
  "deleted_usr_id_lbl",
  "deleted_time",
];
langTableExcludeArr.push(`${ table }_id`);
const langTableRecords = [ ];
for (let i = 0; i < (opts.langTable?.records?.length || 0); i++) {
  const record = opts.langTable.records[i];
  const column_name = record.COLUMN_NAME;
  if (
    langTableExcludeArr.includes(column_name)
  ) continue;
  langTableRecords.push(record);
}
const findByIdTableUps = [ ];
const findOneTableUps = [ ];
const findAllTableUps = [ ];
const createTableUps = [ ];
const deleteByIdsTableUps = [ ];
const revertByIdsTableUps = [ ];
const updateByIdTableUps = [ ];
const forceDeleteByIdsUps = [ ];
const equalsByUniqueTableUps = [ ];
const idTableUps = [ ];
const modelTableUps = [ ];
const inputTableUps = [ ];
#><#
const hasSummary = columns.some((column) => column.showSummary);
#>// deno-lint-ignore-file prefer-const no-unused-vars<#
if (!(hasDataPermit() && hasCreateUsrId)) {
#> ban-types<#
}
#>
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
} from "/lib/util/dao_util.ts";<#
let hasDecimal = false;
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") continue;
  if (column_name === "version") continue;
  const foreignKey = column.foreignKey;
  const data_type = column.DATA_TYPE;
  if (data_type !== "decimal") {
    continue;
  }
  hasDecimal = true;
  break;
}
#><#
if (hasDecimal) {
#>

import Decimal from "decimal.js";<#
}
#><#
if (mod === "cron" && table === "cron_job") {
#>

import {
  newContext,
  runInAsyncHooks,
} from "/lib/context.ts";

import {
  refreshCronJobs,
} from "/src/cron/cron_job/cron_job.dao.ts";<# 
}
#>

import {
  log,
  error,
  escapeDec,
  reqDate,<#
  if (cache) {
  #>
  delCache as delCacheCtx,<#
  }
  #>
  query,
  queryOne,
  execute,
  QueryArgs,
} from "/lib/context.ts";

import {
  getParsedEnv,
} from "/lib/env.ts";<#
if (isUseI18n) {
#>

import {
  initN,
  ns,
} from "/src/base/i18n/i18n.ts";<#
}
#>

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
} from "/lib/util/string_util.ts";<#
if (opts?.history_table) {
#>

import {
  deepCompare,
} from "/lib/util/object_util.ts";<#
}
#>

import * as validators from "/lib/validators/mod.ts";<#
  if (hasDict) {
#>

import {
  getDict,<#
  if (hasRedundLbl) {
  #>
  val2Str,<#
  }
  #>
} from "/src/base/dict_detail/dict_detail.dao.ts";<#
  }
#><#
  if (hasDictbiz) {
#>

import {
  getDictbiz,
} from "/src/base/dictbiz_detail/dictbiz_detail.dao.ts";<#
  }
#>

import { UniqueException } from "/lib/exceptions/unique.execption.ts";

import {
  get_usr_id,<#
  if (hasPassword) {
  #>
  getPassword,<#
  }
  #><#
  if (opts.langTable) {
  #>
  get_lang_id,<#
  }
  #>
} from "/lib/auth/auth.dao.ts";<#
if (hasTenant_id) {
#>

import {
  getTenant_id,
} from "/src/base/usr/usr.dao.ts";

import {
  existById as existByIdTenant,
} from "/gen/base/tenant/tenant.dao.ts";<#
}
#><#
if (hasMany2manyNotInline) {
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
  SortOrderEnum,<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  DataPermitScope,
  DataPermitType,<#
  }
  #>
} from "/gen/types.ts";

import type {
  PageInput,
  SortInput,<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    if (column_name === "is_deleted") continue;
    const data_type = column.DATA_TYPE;
    const column_type = column.COLUMN_TYPE;
    let column_comment = column.COLUMN_COMMENT || "";
    if (column_comment.indexOf("[") !== -1) {
      column_comment = column_comment.substring(0, column_comment.indexOf("["));
    }
    if (
      [
        "is_default",
        "is_deleted",
        "tenant_id",
        "version",
      ].includes(column_name)
    ) {
      continue;
    }
    if (!column.dict && !column.dictbiz) {
      continue;
    }
    const columnDictModels = [
      ...dictModels.filter(function(item) {
        return item.code === column.dict || item.code === column.dict;
      }),
      ...dictbizModels.filter(function(item) {
        return item.code === column.dict || item.code === column.dictbiz;
      }),
    ];
    if ([ "int", "decimal", "tinyint" ].includes(column.DATA_TYPE) || columnDictModels.length === 0) {
      continue;
    }
    let Column_Up = column_name.substring(0, 1).toUpperCase()+column_name.substring(1);
    Column_Up = Column_Up.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
  #>
  <#=Table_Up#><#=Column_Up#>,<#
  }
  #>
} from "/gen/types.ts";<#
if (hasSummary) {
#>

import type {
  <#=Table_Up#>Summary,
} from "/gen/types.ts";<#
}
#><#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") continue;
  if (
    column_name === "create_usr_id"
    || column_name === "update_usr_id"
  ) {
    continue;
  }
  const data_type = column.DATA_TYPE;
  const column_type = column.COLUMN_TYPE;
  const column_comment = column.COLUMN_COMMENT || "";
  const foreignKey = column.foreignKey;
  const foreignTable = foreignKey && foreignKey.table;
  const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  const many2many = column.many2many;
  const isPassword = column.isPassword;
  const isVirtual = column.isVirtual;
  if (isVirtual) continue;
#><#
  if (foreignKey && foreignKey.type !== "many2many" && !foreignKey.multiple) {
    if (foreignTable === table) {
      continue;
    }
    if (findOneTableUps.includes(foreignTable_Up)) continue;
    findOneTableUps.push(foreignTable_Up);
#>

import {
  findOne as findOne<#=foreignTable_Up#>,
} from "/gen/<#=foreignKey.mod#>/<#=foreignTable#>/<#=foreignTable#>.dao.ts";<#
  }
#><#
}
#><#
if (hasDataPermit() && hasCreateUsrId) {
#>

import {
  getDataPermits,
} from "/src/base/data_permit/data_permit.dao.ts";

import {
  getAuthDeptIds,
  getAuthAndParentsDeptIds,
  getAuthAndChildrenDeptIds,
  getParentsDeptIds,
  getDeptIds,
} from "/src/base/dept/dept.dao.ts";

import {
  getAuthRoleIds,
  getRoleIds,
} from "/src/base/role/role.dao.ts";<#
}
#><#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  const column_name = column.COLUMN_NAME;
  const comment = column.COLUMN_COMMENT;
  let is_nullable = column.IS_NULLABLE === "YES";
  const foreignKey = column.foreignKey;
  const foreignTable = foreignKey && foreignKey.table;
  const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  let data_type = column.DATA_TYPE;
  const many2many = column.many2many;
  if (!many2many || !foreignKey) continue;
  if (!column.inlineMany2manyTab) continue;
  const inlineMany2manySchema = optTables[foreignKey.mod + "_" + foreignKey.table];
  const table = many2many.table;
  const mod = many2many.mod;
  if (!inlineMany2manySchema) {
    throw `inlineMany2manyTab 中的表: ${ mod }_${ table } 不存在`;
    process.exit(1);
  }
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
    forceDeleteByIdsUps.includes(Table_Up) &&
    equalsByUniqueTableUps.includes(Table_Up)
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
  const hasEqualsByUniqueTableUps = equalsByUniqueTableUps.includes(Table_Up);
  if (!hasEqualsByUniqueTableUps) {
    equalsByUniqueTableUps.push(Table_Up);
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
  #><#
  if (!hasEqualsByUniqueTableUps) {
  #>
  equalsByUnique as equalsByUnique<#=Table_Up#>,<#
  }
  #>
} from "/gen/<#=mod#>/<#=table#>/<#=table#>.dao.ts";<#
}
#><#
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
#><#
if (
  (
    (hasCreateUsrId && hasCreateUsrIdLbl)
    || (hasUpdateUsrId && hasUpdateUsrIdLbl)
    || (hasDeleteUsrId && hasDeleteUsrIdLbl)
  )
  && !findByIdTableUps.includes(Table_Up)
) {
  const hasFindByIdTableUps = findByIdTableUps.includes(Table_Up);
  if (!hasFindByIdTableUps) {
    findByIdTableUps.push(Table_Up);
  }
#>

import {<#
  if (!hasFindByIdTableUps) {  
  #>
  findById as findByIdUsr,<#
  }
  #>
} from "/gen/base/usr/usr.dao.ts";<#
}
#>

import {
  route_path,
} from "./<#=table#>.model.ts";
<#
if (
  !(
    (hasDataPermit() && hasCreateUsrId) ||
    hasTenant_id || hasOrgId
  )
) {
#>
// deno-lint-ignore require-await<#
}
#>
async function getWhereQuery(
  args: QueryArgs,
  search?: Readonly<<#=searchName#>>,
  options?: {<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    hasDataPermit?: boolean,<#
    }
    #>
  },
): Promise<string> {<#
  if (opts.langTable && isUseI18n) {
  #>
  
  const server_i18n_enable = getParsedEnv("server_i18n_enable") === "true";<#
  }
  #>
  
  let whereQuery = "";<#
  if (hasIsDeleted) {
  #>
  whereQuery += ` t.is_deleted=${ args.push(search?.is_deleted == null ? 0 : search.is_deleted) }`;<#
  } else {
  #>
  whereQuery += " 1=1"<#
  }
  #><#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  const dataPermitModels = await getDataPermits(route_path, options);
  const hasCreatePermit = dataPermitModels.some((item) => item.scope === DataPermitScope.Create);
  const hasRolePermit = dataPermitModels.some((item) => item.scope === DataPermitScope.Role);
  const hasDeptPermit = dataPermitModels.some((item) => item.scope === DataPermitScope.Dept);
  const hasDeptParentPermit = dataPermitModels.some((item) => item.scope === DataPermitScope.DeptParent);
  const hasTenantPermit = dataPermitModels.some((item) => item.scope === DataPermitScope.Tenant);<#
  }
  #><#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  if (!hasTenantPermit && !hasDeptPermit && !hasRolePermit && hasCreatePermit) {
    const usr_id = await get_usr_id();
    if (usr_id != null) {
      whereQuery += ` and t.create_usr_id=${ args.push(usr_id) }`;
    }
  } else if (!hasTenantPermit && hasDeptParentPermit) {
    const dept_ids = await getAuthAndChildrenDeptIds();
    whereQuery += ` and _permit_usr_dept_.dept_id in (${ args.push(dept_ids) })`;
  } else if (!hasTenantPermit && hasDeptPermit) {
    const dept_ids = await getAuthDeptIds();
    whereQuery += ` and _permit_usr_dept_.dept_id in (${ args.push(dept_ids) })`;
  }
  if (!hasTenantPermit && hasRolePermit) {
    const role_ids = await getAuthRoleIds();
    whereQuery += ` and _permit_usr_role_.role_id in (${ args.push(role_ids) })`;
  }<#
  }
  #><#
  if (hasTenant_id) {
  #>
  
  if (search?.tenant_id == null) {
    const usr_id = await get_usr_id();
    const tenant_id = await getTenant_id(usr_id);
    if (tenant_id) {
      whereQuery += ` and t.tenant_id=${ args.push(tenant_id) }`;
    }
  } else if (search?.tenant_id != null && search?.tenant_id !== "-") {
    whereQuery += ` and t.tenant_id=${ args.push(search.tenant_id) }`;
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
    const isEncrypt = column.isEncrypt;
    if (isEncrypt) {
      continue;
    }
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const modelLabel = column.modelLabel;
    let foreignSchema = undefined;
    const foreignLangTableRecords = [ ];
    if (foreignKey) {
      foreignSchema = optTables[foreignKey.mod + "_" + foreignKey.table];
      for (let i = 0; i < (foreignSchema.opts.langTable?.records?.length || 0); i++) {
        const record = foreignSchema.opts.langTable.records[i];
        const column_name = record.COLUMN_NAME;
        if (
          langTableExcludeArr.includes(column_name)
        ) continue;
        foreignLangTableRecords.push(record);
      }
    }
  #><#
    if (foreignKey) {
      if (foreignKey.type !== "many2many") {
  #>
  if (search?.<#=column_name#> != null) {
    whereQuery += ` and t.<#=column_name#> in (${ args.push(search.<#=column_name#>) })`;
  }
  if (search?.<#=column_name#>_is_null) {
    whereQuery += ` and t.<#=column_name#> is null`;
  }<#
    if (modelLabel) {
  #>
  if (search?.<#=modelLabel#> != null) {<#
    if (!langTableRecords.some((record) => record.COLUMN_NAME === modelLabel)) {
    #>
    whereQuery += ` and t.<#=modelLabel#> in (${ args.push(search.<#=modelLabel#>) })`;<#
    } else {
    #><#
    if (isUseI18n) {
    #>
    if (server_i18n_enable) {
      whereQuery += ` and (t.<#=modelLabel#> in (${ args.push(search.<#=modelLabel#>) }) or <#=opts.langTable.opts.table_name#>.<#=modelLabel#> in (${ args.push(search.<#=modelLabel#>) }))`;
    } else {
      whereQuery += ` and t.<#=modelLabel#> in (${ args.push(search.<#=modelLabel#>) })`;
    }<#
    } else {
    #>
    whereQuery += ` and t.<#=modelLabel#> in (${ args.push(search.<#=modelLabel#>) })`;<#
    }
    #><#
    }
    #>
  }
  if (isNotEmpty(search?.<#=modelLabel#>_like)) {<#
    if (!langTableRecords.some((record) => record.COLUMN_NAME === modelLabel)) {
    #>
    whereQuery += ` and t.<#=modelLabel#> like ${ args.push("%" + sqlLike(search.<#=modelLabel#>_like) + "%") }`;<#
    } else {
    #><#
    if (isUseI18n) {
    #>
    if (server_i18n_enable) {
      whereQuery += ` and (t.<#=modelLabel#> like ${ args.push("%" + sqlLike(search.<#=modelLabel#>_like) + "%") } or <#=opts.langTable.opts.table_name#>.<#=modelLabel#> like ${ args.push("%" + sqlLike(search.<#=modelLabel#>_like) + "%") })`;
    } else {
      whereQuery += ` and t.<#=modelLabel#> like ${ args.push("%" + sqlLike(search.<#=modelLabel#>_like) + "%") }`;
    }<#
    } else {
    #>
    whereQuery += ` and t.<#=modelLabel#> like ${ args.push("%" + sqlLike(search.<#=modelLabel#>_like) + "%") }`;<#
    }
    #><#
    }
    #>
  }<#
    } else if (foreignKey.lbl) {
  #>
  if (search?.<#=column_name#>_<#=foreignKey.lbl#> != null) {<#
    if (!foreignLangTableRecords.some((record) => record.COLUMN_NAME === column_name+"_"+foreignKey.lbl)) {
    #>
    whereQuery += ` and <#=column_name#>_lbl.<#=foreignKey.lbl#> in (${ args.push(search.<#=column_name#>_<#=foreignKey.lbl#>) })`;<#
    } else {
    #>
    whereQuery += ` and (<#=column_name#>_lbl.<#=foreignKey.lbl#> in (${ args.push(search.<#=column_name#>_<#=foreignKey.lbl#>) }) or <#=foreignSchema.opts.langTable.opts.table_name#>.<#=column_name#>_<#=foreignKey.lbl#> in (${ args.push(search.<#=column_name#>_<#=foreignKey.lbl#>) }))`;<#
    }
    #>
  }
  if (isNotEmpty(search?.<#=column_name#>_<#=foreignKey.lbl#>_like)) {<#
    if (!foreignLangTableRecords.some((record) => record.COLUMN_NAME === column_name+"_"+foreignKey.lbl)) {
    #>
    whereQuery += ` and <#=column_name#>_lbl.<#=foreignKey.lbl#> like ${ args.push("%" + sqlLike(search?.<#=column_name#>_<#=foreignKey.lbl#>_like) + "%") }`;<#
    } else {
    #>
    whereQuery += ` and (<#=column_name#>_lbl.<#=foreignKey.lbl#> like ${ args.push("%" + sqlLike(search?.<#=column_name#>_<#=foreignKey.lbl#>_like) + "%") } or <#=foreignSchema.opts.langTable.opts.table_name#>.<#=column_name#>_<#=foreignKey.lbl#> like ${ args.push("%" + sqlLike(search?.<#=column_name#>_<#=foreignKey.lbl#>_like) + "%") })`;<#
    }
    #>
  }<#
    }
  #><#
      } else if (foreignKey.type === "many2many") {
  #>
  if (search?.<#=column_name#> != null) {
    whereQuery += ` and <#=foreignKey.mod#>_<#=foreignKey.table#>.id in (${ args.push(search.<#=column_name#>) })`;
  }
  if (search?.<#=column_name#>_is_null) {
    whereQuery += ` and <#=foreignKey.mod#>_<#=foreignKey.table#>.id is null`;
  }<#
    }
  #><#
    } else if (column.dict || column.dictbiz) {
  #>
  if (search?.<#=column_name#> != null) {
    whereQuery += ` and t.<#=column_name#> in (${ args.push(search.<#=column_name#>) })`;
  }<#
  } else if (column_name === "id") {
  #>
  if (search?.<#=column_name#> != null) {
    whereQuery += ` and t.<#=column_name#>=${ args.push(search?.<#=column_name#>) }`;
  }
  if (search?.ids != null) {
    whereQuery += ` and t.id in (${ args.push(search.ids) })`;
  }<#
  } else if (data_type === "int" && column_name.startsWith("is_")) {
  #>
  if (search?.<#=column_name#> != null) {
    whereQuery += ` and t.<#=column_name#> in (${ args.push(search?.<#=column_name#>) })`;
  }<#
  } else if (data_type === "int" || data_type === "decimal" || data_type === "double" || data_type === "datetime" || data_type === "date") {
  #>
  if (search?.<#=column_name#> != null) {
    if (search.<#=column_name#>[0] != null) {
      whereQuery += ` and t.<#=column_name#>>=${ args.push(search.<#=column_name#>[0]) }`;
    }
    if (search.<#=column_name#>[1] != null) {
      whereQuery += ` and t.<#=column_name#><=${ args.push(search.<#=column_name#>[1]) }`;
    }
  }<#
  } else if (data_type === "tinyint") {
  #>
  if (search?.<#=column_name#> != null) {
    whereQuery += ` and t.<#=column_name#> in (${ args.push(search?.<#=column_name#>) })`;
  }<#
  } else if (!column.isEncrypt) {
  #>
  if (search?.<#=column_name#> != null) {<#
    if (!langTableRecords.some((record) => record.COLUMN_NAME === column_name)) {
    #>
    whereQuery += ` and t.<#=column_name#>=${ args.push(search.<#=column_name#>) }`;<#
    } else {
    #><#
    if (isUseI18n) {
    #>
    if (server_i18n_enable) {
      whereQuery += ` and (t.<#=column_name#>=${ args.push(search.<#=column_name#>) } or <#=opts.langTable.opts.table_name#>.<#=column_name#>=${ args.push(search.<#=column_name#>) })`;
    } else {
      whereQuery += ` and t.<#=column_name#>=${ args.push(search.<#=column_name#>) }`;
    }<#
    } else {
    #>
    whereQuery += ` and t.<#=column_name#>=${ args.push(search.<#=column_name#>) }`;<#
    }
    #><#
    }
    #>
  }
  if (isNotEmpty(search?.<#=column_name#>_like)) {<#
    if (!langTableRecords.some((record) => record.COLUMN_NAME === column_name)) {
    #>
    whereQuery += ` and t.<#=column_name#> like ${ args.push("%" + sqlLike(search?.<#=column_name#>_like) + "%") }`;<#
    } else {
    #><#
    if (isUseI18n) {
    #>
    if (server_i18n_enable) {
      whereQuery += ` and (t.<#=column_name#> like ${ args.push("%" + sqlLike(search?.<#=column_name#>_like) + "%") } or <#=opts.langTable.opts.table_name#>.<#=column_name#> like ${ args.push("%" + sqlLike(search?.<#=column_name#>_like) + "%") })`;
    } else {
      whereQuery += ` and t.<#=column_name#> like ${ args.push("%" + sqlLike(search?.<#=column_name#>_like) + "%") }`;
    }<#
    } else {
    #>
    whereQuery += ` and t.<#=column_name#> like ${ args.push("%" + sqlLike(search?.<#=column_name#>_like) + "%") }`;<#
    }
    #><#
    }
    #>
  }<#
  }
  #><#
  }
  #>
  return whereQuery;
}
<#
if (
  !(hasDataPermit() && hasCreateUsrId) && !opts.langTable
) {
#>
// deno-lint-ignore require-await<#
}
#>
async function getFromQuery(
  args: QueryArgs,
  search?: Readonly<<#=searchName#>>,
  options?: {<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    hasDataPermit?: boolean,<#
    }
    #>
  },
) {<#
  if (hasIsDeleted && hasMany2many) {
  #>
  
  const is_deleted = search?.is_deleted ?? 0;<#
  }
  #><#
  if (opts.langTable && isUseI18n) {
  #>
  
  const server_i18n_enable = getParsedEnv("server_i18n_enable") === "true";<#
  }
  #><#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  const dataPermitModels = await getDataPermits(route_path, options);
  const hasCreatePermit = dataPermitModels.some((item) => item.scope === DataPermitScope.Create);
  const hasRolePermit = dataPermitModels.some((item) => item.scope === DataPermitScope.Role);
  const hasDeptPermit = dataPermitModels.some((item) => item.scope === DataPermitScope.Dept || item.scope === DataPermitScope.DeptParent);
  const hasTenantPermit = dataPermitModels.some((item) => item.scope === DataPermitScope.Tenant);<#
  }
  #>
  let fromQuery = `<#=mod#>_<#=table#> t<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (column.isVirtual) continue;
    const foreignKey = column.foreignKey;
    let data_type = column.DATA_TYPE;
    if (!foreignKey) continue;
    const foreignTable = foreignKey.table;
    const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const many2many = column.many2many;
    const modelLabel = column.modelLabel;
    let cascade_fields = foreignKey.cascade_fields || [ ];
    if (foreignKey.lbl && cascade_fields.includes(foreignKey.lbl) && !modelLabel) {
      cascade_fields = cascade_fields.filter((item) => item !== foreignKey.lbl);
    }
    const foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
    const foreignHasIsDeleted = foreignSchema.columns.some((column) => column.COLUMN_NAME === "is_deleted");
  #><#
    if (foreignKey.type === "many2many") {
  #>
  left join <#=many2many.mod#>_<#=many2many.table#>
    on <#=many2many.mod#>_<#=many2many.table#>.<#=many2many.column1#>=t.id<#
    if (hasIsDeleted) {
    #>
    and <#=many2many.mod#>_<#=many2many.table#>.is_deleted=${ args.push(is_deleted) }<#
    }
    #>
  left join <#=foreignKey.mod#>_<#=foreignTable#>
    on <#=many2many.mod#>_<#=many2many.table#>.<#=many2many.column2#>=<#=foreignKey.mod#>_<#=foreignTable#>.<#=foreignKey.column#><#
    if (foreignHasIsDeleted) {
    #>
    and <#=foreignKey.mod#>_<#=foreignTable#>.is_deleted=${ args.push(is_deleted) }<#
    }
    #>
  left join(select
  json_objectagg(<#=many2many.mod#>_<#=many2many.table#>.order_by,<#=foreignKey.mod#>_<#=foreignTable#>.id) <#=column_name#>,<#
    if (foreignKey.lbl && !modelLabel) {
  #>
  json_objectagg(<#=many2many.mod#>_<#=many2many.table#>.order_by,<#=foreignKey.mod#>_<#=foreignTable#>.<#=foreignKey.lbl#>) <#=column_name#>_lbl,<#
    }
  #><#
    for (let j = 0; j < cascade_fields.length; j++) {
      const cascade_field = cascade_fields[j];
  #>
  json_objectagg(<#=many2many.mod#>_<#=many2many.table#>.order_by,<#=foreignKey.mod#>_<#=foreignTable#>.<#=cascade_field#>) <#=column_name#>_<#=cascade_field#>,<#
    }
  #>
  <#=mod#>_<#=table#>.id <#=many2many.column1#>
  from <#=foreignKey.mod#>_<#=many2many.table#>
  inner join <#=foreignKey.mod#>_<#=foreignKey.table#> on <#=foreignKey.mod#>_<#=foreignKey.table#>.<#=foreignKey.column#>=<#=many2many.mod#>_<#=many2many.table#>.<#=many2many.column2#>
  inner join <#=mod#>_<#=table#> on <#=mod#>_<#=table#>.id=<#=many2many.mod#>_<#=many2many.table#>.<#=many2many.column1#><#
  if (hasIsDeleted) {
  #>
  where <#=many2many.mod#>_<#=many2many.table#>.is_deleted=${ args.push(is_deleted) }<#
  }
  #>
  group by <#=many2many.column1#>) _<#=foreignTable#> on _<#=foreignTable#>.<#=many2many.column1#>=t.id<#
    } else if (foreignKey && !foreignKey.multiple) {
      if (modelLabel) {
        continue;
      }
  #>
  left join <#=foreignKey.mod#>_<#=foreignTable#> <#=column_name#>_lbl on <#=column_name#>_lbl.<#=foreignKey.column#>=t.<#=column_name#><#
    }
  #><#
  }
  #>`;<#
  if (opts.langTable && isUseI18n) {
  #>
  
  if (server_i18n_enable) {
    fromQuery += ` left join <#=opts.langTable.opts.table_name#> on <#=opts.langTable.opts.table_name#>.<#=table#>_id=t.id and <#=opts.langTable.opts.table_name#>.lang_id=${ args.push(await get_lang_id()) }`;
  }<#
  }
  #><#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  if (!hasTenantPermit && hasDeptPermit) {
    fromQuery += ` left join base_usr_dept _permit_usr_dept_ on _permit_usr_dept_.usr_id=t.create_usr_id`;
  }
  if (!hasTenantPermit && hasRolePermit) {
    fromQuery += ` left join base_usr_role _permit_usr_role_ on _permit_usr_role_.usr_id=t.create_usr_id`;
  }<#
  }
  #>
  return fromQuery;
}

// MARK: findCount
/** 根据条件查找<#=table_comment#>总数 */
export async function findCount(
  search?: Readonly<<#=searchName#>>,
  options?: {
    is_debug?: boolean;<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    hasDataPermit?: boolean,<#
    }
    #>
  },
): Promise<number> {
  
  const table = "<#=mod#>_<#=table#>";
  const method = "findCount";
  
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
  
  const args = new QueryArgs();
  let sql = `select count(1) total from (select 1 from ${ await getFromQuery(args, search, options) }`;
  const whereQuery = await getWhereQuery(args, search, options);
  if (isNotEmpty(whereQuery)) {
    sql += ` where ${ whereQuery }`;
  }
  sql += ` group by t.id) t`;<#
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
  let result = Number(model?.total || 0);
  
  return result;
}

// MARK: findAll
/** 根据搜索条件和分页查找<#=table_comment#>列表 */
export async function findAll(
  search?: Readonly<<#=searchName#>>,
  page?: Readonly<PageInput>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;
    ids_limit?: number;<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    hasDataPermit?: boolean,<#
    }
    #>
  },
): Promise<<#=modelName#>[]> {
  
  const table = "<#=mod#>_<#=table#>";
  const method = "findAll";
  
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
  }<#
  if (opts.langTable && isUseI18n) {
  #>
  
  const server_i18n_enable = getParsedEnv("server_i18n_enable") === "true";<#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === 'id') continue;
    if (
      column_name === "tenant_id" ||
      column_name === "is_sys" ||
      column_name === "is_deleted"
    ) continue;
    const column_name_rust = rustKeyEscape(column.COLUMN_NAME); 
    const data_type = column.DATA_TYPE;
    const column_type = column.COLUMN_TYPE?.toLowerCase() || "";
    const column_comment = column.COLUMN_COMMENT || "";
    const isPassword = column.isPassword;
    if (isPassword) {
      continue;
    }
    if (column.isEncrypt) {
      continue;
    }
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
  #><#
    if (
      [
        "is_hidden",
        "is_sys",
      ].includes(column_name)
      || foreignKey
      || column.dict || column.dictbiz
    ) {
  #>
  // <#=column_comment#>
  if (search && search.<#=column_name#> != null) {
    const len = search.<#=column_name#>.length;
    if (len === 0) {
      return [ ];
    }
    const ids_limit = options?.ids_limit ?? FIND_ALL_IDS_LIMIT;
    if (len > ids_limit) {
      throw new Error(`search.<#=column_name#>.length > ${ ids_limit }`);
    }
  }<#
    }
  #><#
  }
  #><#
  if (opts.langTable && isUseI18n) {
  #>
  
  let lang_sql = "";
  
  if (server_i18n_enable) {<#
    for (let i = 0; i < langTableRecords.length; i++) {
      const record = langTableRecords[i];
      const column_name = record.COLUMN_NAME;
    #>
    lang_sql += ",max(<#=opts.langTable.opts.table_name#>.<#=column_name#>) <#=column_name#>_lang";<#
    }
    #>
  }<#
  }
  #>
  
  const args = new QueryArgs();
  let sql = `select f.* from (select t.*<#
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.ignoreCodegen) continue;
        const column_name = column.COLUMN_NAME;
        if (column.isVirtual) continue;
        const foreignKey = column.foreignKey;
        if (!foreignKey) continue;
        const foreignTable = foreignKey.table;
        const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
        const many2many = column.many2many;
        const modelLabel = column.modelLabel;
        let cascade_fields = foreignKey.cascade_fields || [ ];
        if (foreignKey.lbl && cascade_fields.includes(foreignKey.lbl) && !modelLabel) {
          cascade_fields = cascade_fields.filter((item) => item !== foreignKey.lbl);
        }
      #><#
        if (foreignKey.type === "many2many") {
      #>
      ,max(<#=column_name#>) <#=column_name#><#
        if (foreignKey.lbl && !modelLabel) {
      #>
      ,max(<#=column_name#>_lbl) <#=column_name#>_lbl<#
        }
      #><#
        for (let j = 0; j < cascade_fields.length; j++) {
          const cascade_field = cascade_fields[j];
      #>
      ,max(<#=column_name#>_<#=cascade_field#>) <#=column_name#>_<#=cascade_field#><#
        }
      #><#
      } else {
      #><#
        if (foreignKey.lbl && !modelLabel) {
      #>
      ,<#=column_name#>_lbl.<#=foreignKey.lbl#> <#=column_name#>_lbl<#
        }
      #><#
        for (let j = 0; j < cascade_fields.length; j++) {
          const cascade_field = cascade_fields[j];
      #>
      ,max(<#=column_name#>_<#=cascade_field#>) <#=column_name#>_<#=cascade_field#><#
        }
      #><#
      }
      #><#
      }
      #><#
      if (opts.langTable && isUseI18n) {
      #>
      ${ lang_sql }<#
      }
      #>
    from
      ${ await getFromQuery(args, search, options) }
  `;
  const whereQuery = await getWhereQuery(args, search, options);
  if (isNotEmpty(whereQuery)) {
    sql += ` where ${ whereQuery }`;
  }
  sql += ` group by t.id`;
  
  sort = sort ?? [ ];
  sort = sort.filter((item) => item.prop);<#
  if (defaultSort) {
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
  if (hasCreateTime && opts?.defaultSort.prop !== "create_time") {
  #>
  
  if (!sort.some((item) => item.prop === "create_time")) {
    sort.push({
      prop: "create_time",
      order: SortOrderEnum.Desc,
    });
  }<#
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
  }
  sql += `) f`;
  
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
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
  
  const result = await query<<#=modelName#>>(
    sql,
    args,<#
    if (cache) {
    #>
    {
      cacheKey1,
      cacheKey2,
      debug: is_debug_sql,
    },<#
    } else {
    #>
    {
      debug: is_debug_sql,
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
    if (column.isVirtual) continue;
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
      if (column.isVirtual) continue;
      const foreignKey = column.foreignKey;
      let data_type = column.DATA_TYPE;
      if (!foreignKey) continue;
      if (foreignKey.type !== "many2many") {
        continue;
      }
      const foreignTable = foreignKey.table;
      const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const many2many = column.many2many;
      const modelLabel = column.modelLabel;
      let cascade_fields = foreignKey.cascade_fields || [ ];
      if (foreignKey.lbl && cascade_fields.includes(foreignKey.lbl) && !modelLabel) {
        cascade_fields = cascade_fields.filter((item) => item !== foreignKey.lbl);
      }
    #>
    
    // <#=column_comment#>
    if (item.<#=column_name#>) {
      const obj = item.<#=column_name#>;
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.<#=column_name#> = keys.map((key) => obj[key]);
    } else {
      item.<#=column_name#> = [ ];
    }<#
      if (foreignKey.lbl && !modelLabel) {
    #>
    if (item.<#=column_name#>_lbl) {
      const obj = item.<#=column_name#>_lbl;
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.<#=column_name#>_lbl = keys.map((key) => obj[key]);
    } else {
      item.<#=column_name#>_lbl = [ ];
    }<#
      }
    #><#
      for (let j = 0; j < cascade_fields.length; j++) {
        const cascade_field = cascade_fields[j];
    #>
    if (item.<#=column_name#>_<#=cascade_field#>) {
      const obj = item.<#=column_name#>_<#=cascade_field#>;
      const keys = Object.keys(obj)
        .map((key) => Number(key))
        .sort((a, b) => {
          return a - b ? 1 : -1;
        });
      item.<#=column_name#>_<#=cascade_field#> = keys.map((key) => obj[key]);
    } else {
      item.<#=column_name#>_<#=cascade_field#> = [ ];
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
  if (hasDictModelLabel) {
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
      const column_comment = column.COLUMN_COMMENT || "";
      const modelLabel = column.modelLabel;
      if (modelLabel) continue;
    #><#
      if (column.dict) {
    #>
    <#=column_name#>Dict, // <#=column_comment#><#
      }
    #><#
    }
    #>
  ] = await getDict([<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      if (column_name === "is_sys") continue;
      if (column_name === "is_deleted") continue;
      if (column_name === "is_hidden") continue;
      const column_comment = column.COLUMN_COMMENT || "";
      const modelLabel = column.modelLabel;
      if (modelLabel) continue;
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
  if (hasDictbizModelLabel) {
  #>
  
  const [<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      if (column_name === "is_deleted") continue;
      if (column_name === "is_hidden") continue;
      const column_comment = column.COLUMN_COMMENT || "";
      const modelLabel = column.modelLabel;
      if (modelLabel) continue;
    #><#
      if (column.dictbiz) {
    #>
    <#=column_name#>Dict, // <#=column_comment#><#
      }
    #><#
    }
    #>
  ] = await getDictbiz([<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      if (column_name === "is_deleted") continue;
      if (column_name === "is_hidden") continue;
      const column_comment = column.COLUMN_COMMENT || "";
      const modelLabel = column.modelLabel;
      if (modelLabel) continue;
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
  for (const inlineForeignTab of inlineForeignTabs) {
    const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
    const table = inlineForeignTab.table;
    const mod = inlineForeignTab.mod;
    if (!inlineForeignSchema) {
      throw `表: ${ mod }_${ table } 的 inlineForeignTabs 中的 ${ inlineForeignTab.mod }_${ inlineForeignTab.table } 不存在`;
      process.exit(1);
    }
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const inline_column_name = inlineForeignTab.column_name;
    const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
  #>
  
  // <#=inlineForeignTab.label#>
  const <#=inline_column_name#>_models = await findAll<#=Table_Up#>(
    {
      <#=inlineForeignTab.column#>: result.map((item) => item.id),
      is_deleted: search?.is_deleted,
    },
    undefined,
    undefined,
    options,
  );<#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    const table_comment = column.COLUMN_COMMENT;
    let is_nullable = column.IS_NULLABLE === "YES";
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    let data_type = column.DATA_TYPE;
    const many2many = column.many2many;
    if (!many2many || !foreignKey) continue;
    if (!column.inlineMany2manyTab) continue;
    const inlineMany2manySchema = optTables[foreignKey.mod + "_" + foreignKey.table];
    const table = many2many.table;
    const mod = many2many.mod;
    if (!inlineMany2manySchema) {
      throw `表: ${ mod }_${ table } 的 inlineMany2manyTab 中的 ${ many2many.mod }_${ many2many.table } 不存在`;
      process.exit(1);
    }
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
  #>
  
  // <#=table_comment#>
  const <#=column_name#>_<#=table#>_models = await findAll<#=Table_Up#>({
    <#=many2many.column1#>: result.map((item) => item.id),<#
    if (hasIsDeleted) {
    #>
    is_deleted: search?.is_deleted,<#
    }
    #>
  });<#
  }
  #>
  
  for (let i = 0; i < result.length; i++) {
    const model = result[i];<#
    if (opts.langTable && isUseI18n) {
    #>
    
    if (server_i18n_enable) {<#
      for (let i = 0; i < langTableRecords.length; i++) {
        const record = langTableRecords[i];
        const column_name = record.COLUMN_NAME;
      #>
      
      // deno-lint-ignore no-explicit-any
      if ((model as any).<#=column_name#>_lang) {
        // deno-lint-ignore no-explicit-any
        model.<#=column_name#> = (model as any).<#=column_name#>_lang;
        // deno-lint-ignore no-explicit-any
        (model as any).<#=column_name#>_lang = undefined;
      }<#
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
      if (column_name === "is_sys") continue;
      if (column_name === "is_deleted") continue;
      if (column_name === "is_hidden") continue;
      if (column_name === "tenant_id") continue;
      const data_type = column.DATA_TYPE;
      const column_type = column.COLUMN_TYPE;
      const column_comment = column.COLUMN_COMMENT || "";
      const column_default = column.COLUMN_DEFAULT;
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const many2many = column.many2many;
      const modelLabel = column.modelLabel;
      const isPassword = column.isPassword;
      const isEncrypt = column.isEncrypt;
      const isVirtual = column.isVirtual;
      let precision = 0;
      if (data_type === "decimal") {
        const arr = JSON.parse("["+column_type.substring(column_type.indexOf("(")+1, column_type.lastIndexOf(")"))+"]");
        precision = Number(arr[1]);
      }
    #><#
      if (foreignKey && !foreignKey.multiple) {
    #><#
      if (foreignKey.lbl && !modelLabel) {
    #>
    
    // <#=column_comment#>
    model.<#=column_name#>_lbl = model.<#=column_name#>_lbl || "";<#
      }
    #><#
      } else if (data_type === "decimal" && isVirtual) {
    #>
    
    // <#=column_comment#>
    model.<#=column_name#> = new Decimal(<#=column_default || 0#>);<#
        continue;
      } else if ((data_type === "varchar" || data_type === "text") && isVirtual) {
    #>
    
    // <#=column_comment#>
    model.<#=column_name#> = "<#=column_default#>";<#
        continue;
      } else if ([ "int", "tinyint" ].includes(data_type) && isVirtual) {
    #>
    
    // <#=column_comment#>
    model.<#=column_name#> = <#=column_default#>;<#
        continue;
      }
    #><#
      if (isEncrypt && [ "varchar", "text" ].includes(data_type)) {
    #>
    // <#=column_comment#>
    model.<#=column_name#> = await decrypt(model.<#=column_name#>);<#
      } else if (isEncrypt && [ "decimal" ].includes(data_type)) {
    #>
    // <#=column_comment#>
    try {
      model.<#=column_name#> = new Decimal(await decrypt(model.<#=column_name#>.toString()) || 0);
      model.<#=column_name#> = new Decimal(model.<#=column_name#>.toFixed(<#=precision#>));
    } catch(err) {
      error(err);
      model.<#=column_name#> = new Decimal(0);
    }<#
      } else if (isEncrypt && [ "int" ].includes(data_type)) {
    #>
    // <#=column_comment#>
    model.<#=column_name#> = Number(await decrypt(model.<#=column_name#>.toString()) || 0);<#
      } else if ((column.dict || column.dictbiz) && ![ "int", "decimal", "tinyint" ].includes(data_type)) {
    #><#
      if (!modelLabel) {
    #>
    
    // <#=column_comment#>
    let <#=column_name#>_lbl = model.<#=column_name#> as string;
    if (!isEmpty(model.<#=column_name#>)) {
      const dictItem = <#=column_name#>Dict.find((dictItem) => dictItem.val === model.<#=column_name#>);
      if (dictItem) {
        <#=column_name#>_lbl = dictItem.lbl;
      }
    }
    model.<#=column_name#>_lbl = <#=column_name#>_lbl || "";<#
      }
    #><#
      } else if ((column.dict || column.dictbiz) && [ "int", "decimal", "tinyint" ].includes(data_type)) {
    #><#
      if (!modelLabel) {
    #>
    
    // <#=column_comment#>
    let <#=column_name#>_lbl = model.<#=column_name#>?.toString() || "";
    if (model.<#=column_name#> != null) {
      const dictItem = <#=column_name#>Dict.find((dictItem) => dictItem.val === String(model.<#=column_name#>));
      if (dictItem) {
        <#=column_name#>_lbl = dictItem.lbl;
      }
    }
    model.<#=column_name#>_lbl = <#=column_name#>_lbl || "";<#
      }
    #><#
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
      } else if (data_type === "decimal") {
    #>
    
    // <#=column_comment#>
    model.<#=column_name#> = new Decimal(model.<#=column_name#> ?? 0);<#
      }
    #><#
    }
    #><#
    for (const inlineForeignTab of inlineForeignTabs) {
      const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
      const table = inlineForeignTab.table;
      const mod = inlineForeignTab.mod;
      if (!inlineForeignSchema) {
        throw `表: ${ mod }_${ table } 的 inlineForeignTabs 中的 ${ inlineForeignTab.mod }_${ inlineForeignTab.table } 不存在`;
        process.exit(1);
      }
      const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
      const Table_Up = tableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const inline_column_name = inlineForeignTab.column_name;
      const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
    #><#
      if (inline_foreign_type === "one2many") {
    #>
    
    // <#=inlineForeignTab.label#>
    model.<#=inline_column_name#> = <#=inline_column_name#>_models
      .filter((item) => item.<#=inlineForeignTab.column#> === model.id);<#
      } else if (inline_foreign_type === "one2one") {
      #>
    
    // <#=inlineForeignTab.label#>
    model.<#=inline_column_name#> = <#=inline_column_name#>_models
      .filter((item) => item.<#=inlineForeignTab.column#> === model.id)[0];<#
      }
      #><#
    }
    #><#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      const column_comment = column.COLUMN_COMMENT;
      let is_nullable = column.IS_NULLABLE === "YES";
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      let data_type = column.DATA_TYPE;
      const many2many = column.many2many;
      if (!many2many || !foreignKey) continue;
      if (!column.inlineMany2manyTab) continue;
      const inlineMany2manySchema = optTables[foreignKey.mod + "_" + foreignKey.table];
      const table = many2many.table;
      const mod = many2many.mod;
      if (!inlineMany2manySchema) {
        throw `表: ${ mod }_${ table } 的 inlineMany2manyTab 中的 ${ many2many.mod }_${ many2many.table } 不存在`;
        process.exit(1);
      }
      const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
      const Table_Up = tableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
    #>
    
    // <#=column_comment#>
    model.<#=column_name#>_<#=table#>_models = <#=column_name#>_<#=table#>_models
      .filter((item) => item.<#=many2many.column1#> === model.id);<#
    }
    #>
  }
  
  return result;
}

// MARK: setIdByLbl
/** 根据lbl翻译业务字典, 外键关联id, 日期 */
export async function setIdByLbl(
  input: <#=inputName#>,
) {
  
  const options = {
    is_debug: false,
  };<#
  if (hasIsMonth || hasDate || hasDatetime) {
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    if (column.isPassword) continue;
    if (column.isEncrypt) continue;
    if (column.onlyCodegenDeno) continue;
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
      const fieldComments = await getFieldComments();<#
      if (isUseI18n) {
      #>
      throw `${ fieldComments.<#=column_name#> } ${ await ns("日期格式错误") }`;<#
      } else {
      #>
      throw `${ fieldComments.<#=column_name#> } 日期格式错误`;<#
      }
      #>
    }
  }
  if (input.<#=column_name#>) {
    const <#=column_name#> = dayjs(input.<#=column_name#>);
    if (!<#=column_name#>.isValid()) {
      const fieldComments = await getFieldComments();<#
      if (isUseI18n) {
      #>
      throw `${ fieldComments.<#=column_name#> } ${ await ns("日期格式错误") }`;<#
      } else {
      #>
      throw `${ fieldComments.<#=column_name#> } 日期格式错误`;<#
      }
      #>
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
      const fieldComments = await getFieldComments();<#
      if (isUseI18n) {
      #>
      throw `${ fieldComments.<#=column_name#> } ${ await ns("日期格式错误") }`;<#
      } else {
      #>
      throw `${ fieldComments.<#=column_name#> } 日期格式错误`;<#
      }
      #>
    }
  }
  if (input.<#=column_name#>) {
    const <#=column_name#> = dayjs(input.<#=column_name#>);
    if (!<#=column_name#>.isValid()) {
      const fieldComments = await getFieldComments();<#
      if (isUseI18n) {
      #>
      throw `${ fieldComments.<#=column_name#> } ${ await ns("日期格式错误") }`;<#
      } else {
      #>
      throw `${ fieldComments.<#=column_name#> } 日期格式错误`;<#
      }
      #>
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
      const fieldComments = await getFieldComments();<#
      if (isUseI18n) {
      #>
      throw `${ fieldComments.<#=column_name#> } ${ await ns("日期格式错误") }`;<#
      } else {
      #>
      throw `${ fieldComments.<#=column_name#> } 日期格式错误`;<#
      }
      #>
    }
  }
  if (input.<#=column_name#>) {
    const <#=column_name#> = dayjs(input.<#=column_name#>);
    if (!<#=column_name#>.isValid()) {
      const fieldComments = await getFieldComments();<#
      if (isUseI18n) {
      #>
      throw `${ fieldComments.<#=column_name#> } ${ await ns("日期格式错误") }`;<#
      } else {
      #>
      throw `${ fieldComments.<#=column_name#> } 日期格式错误`;<#
      }
      #>
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
      const column_comment = column.COLUMN_COMMENT || "";
    #><#
      if (column.dict) {
    #>
    <#=column_name#>Dict, // <#=column_comment#><#
      }
    #><#
    }
    #>
  ] = await getDict([<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      if (column_name === "is_sys") continue;
      if (column_name === "is_deleted") continue;
      if (column_name === "is_hidden") continue;
      const column_comment = column.COLUMN_COMMENT || "";
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
      const column_comment = column.COLUMN_COMMENT || "";
    #><#
      if (column.dictbiz) {
    #>
    <#=column_name#>Dict, // <#=column_comment#><#
      }
    #><#
    }
    #>
  ] = await getDictbiz([<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      if (column_name === "is_deleted") continue;
      if (column_name === "is_hidden") continue;
      const column_comment = column.COLUMN_COMMENT || "";
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
    const data_type = column.DATA_TYPE;
    const column_type = column.COLUMN_TYPE;
    const column_comment = column.COLUMN_COMMENT || "";
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const many2many = column.many2many;
    const isPassword = column.isPassword;
    const isVirtual = column.isVirtual;
    if (isVirtual) continue;
  #><#
    if ((column.dict || column.dictbiz) && ![ "int", "decimal", "tinyint" ].includes(data_type)) {
      let Column_Up = column_name.substring(0, 1).toUpperCase()+column_name.substring(1);
      Column_Up = Column_Up.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const columnDictModels = [
        ...dictModels.filter(function(item) {
          return item.code === column.dict || item.code === column.dict;
        }),
        ...dictbizModels.filter(function(item) {
          return item.code === column.dict || item.code === column.dictbiz;
        }),
      ];
  #><#
      if (columnDictModels.length > 0) {
  #>
  
  // <#=column_comment#>
  if (isNotEmpty(input.<#=column_name#>_lbl) && input.<#=column_name#> == null) {
    const val = <#=column_name#>Dict.find((itemTmp) => itemTmp.lbl === input.<#=column_name#>_lbl)?.val;
    if (val != null) {
      input.<#=column_name#> = val as <#=Table_Up#><#=Column_Up#>;
    }
  } else if (isEmpty(input.<#=column_name#>_lbl) && input.<#=column_name#> != null) {
    const lbl = <#=column_name#>Dict.find((itemTmp) => itemTmp.val === input.<#=column_name#>)?.lbl || "";
    input.<#=column_name#>_lbl = lbl;
  }<#
      } else {
  #>
  
  // <#=column_comment#>
  if (isNotEmpty(input.<#=column_name#>_lbl) && input.<#=column_name#> == null) {
    const val = <#=column_name#>Dict.find((itemTmp) => itemTmp.lbl === input.<#=column_name#>_lbl)?.val;
    if (val != null) {
      input.<#=column_name#> = val;
    }
  } else if (isEmpty(input.<#=column_name#>_lbl) && input.<#=column_name#> != null) {
    const lbl = <#=column_name#>Dict.find((itemTmp) => itemTmp.val === input.<#=column_name#>)?.lbl || "";
    input.<#=column_name#>_lbl = lbl;
  }<#
      }
  #><#
    } else if ((column.dict || column.dictbiz) && [ "int", "decimal", "tinyint" ].includes(data_type)) {
  #>
  
  // <#=column_comment#>
  if (isNotEmpty(input.<#=column_name#>_lbl) && input.<#=column_name#> == null) {
    const val = <#=column_name#>Dict.find((itemTmp) => itemTmp.lbl === input.<#=column_name#>_lbl)?.val;
    if (val != null) {
      input.<#=column_name#> = Number(val);
    }
  } else if (isEmpty(input.<#=column_name#>_lbl) && input.<#=column_name#> != null) {
    const lbl = <#=column_name#>Dict.find((itemTmp) => itemTmp.val === String(input.<#=column_name#>))?.lbl || "";
    input.<#=column_name#>_lbl = lbl;
  }<#
    } else if (foreignKey && foreignKey.type !== "many2many" && !foreignKey.multiple && foreignKey.lbl) {
  #>
  
  // <#=column_comment#>
  if (isNotEmpty(input.<#=column_name#>_<#=foreignKey.lbl#>) && input.<#=column_name#> == null) {
    input.<#=column_name#>_<#=foreignKey.lbl#> = String(input.<#=column_name#>_<#=foreignKey.lbl#>).trim();<#
    let foreignTable_UpTmp = foreignTable_Up;
    if (foreignTable_Up === Table_Up) {
      foreignTable_UpTmp = "";
    }
    #>
    const <#=foreignTable#>Model = await findOne<#=foreignTable_UpTmp#>(
      {
        <#=foreignKey.lbl#>: input.<#=column_name#>_<#=foreignKey.lbl#>,
      },
      undefined,
      options,
    );
    if (<#=foreignTable#>Model) {
      input.<#=column_name#> = <#=foreignTable#>Model.id;
    }
  } else if (isEmpty(input.<#=column_name#>_<#=foreignKey.lbl#>) && input.<#=column_name#> != null) {
    const <#=foreignTable#>_model = await findOne<#=foreignTable_UpTmp#>(
      {
        id: input.<#=column_name#>,
      },
      undefined,
      options,
    );
    if (<#=foreignTable#>_model) {
      input.<#=column_name#>_<#=foreignKey.lbl#> = <#=foreignTable#>_model.<#=foreignKey.lbl#>;
    }
  }<#
    } else if (foreignKey && (foreignKey.type === "many2many" || foreignKey.multiple) && foreignKey.lbl) {
      if (foreignKey.notSetIdByLbl) continue;
  #>
  
  // <#=column_comment#>
  if (!input.<#=column_name#> && input.<#=column_name#>_<#=foreignKey.lbl#>) {
    input.<#=column_name#>_<#=foreignKey.lbl#> = input.<#=column_name#>_<#=foreignKey.lbl#>
      .map((item: string) => item.trim())
      .filter((item: string) => item);
    input.<#=column_name#>_<#=foreignKey.lbl#> = Array.from(new Set(input.<#=column_name#>_<#=foreignKey.lbl#>));
    if (input.<#=column_name#>_<#=foreignKey.lbl#>.length === 0) {
      input.<#=column_name#> = [ ];
    } else {
      const is_debug_sql = getParsedEnv("database_debug_sql") === "true";
      const args = new QueryArgs();
      const sql = `select t.id from <#=foreignKey.mod#>_<#=foreignTable#> t where t.<#=foreignKey.lbl#> in (${ args.push(input.<#=column_name#>_<#=foreignKey.lbl#>) })`;
      interface Result {
        id: <#=foreignTable_Up#>Id;
      }
      const models = await query<Result>(sql, args, {
        debug: is_debug_sql,
      });
      input.<#=column_name#> = models.map((item: { id: <#=foreignTable_Up#>Id }) => item.id);
    }
  }<#
  } else if (data_type === "date" || data_type === "datetime" || data_type === "timestamp") {
  #>
  
  // <#=column_comment#>
  if (isNotEmpty(input.<#=column_name#>_lbl) && input.<#=column_name#> == null) {
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
    const column_comment = column.COLUMN_COMMENT || "";
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
      return itemTmp.val === val2Str(input.<#=column_name#>, itemTmp.type as any);
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
      return itemTmp.val === val2Str(input.<#=column_name#>, itemTmp.type as any);
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
    const column_comment = column.COLUMN_COMMENT || "";
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
    
    const <#=foreignTable#>Model = await findById<#=foreignTableUp#>(
      input.<#=column_name#>,
      options,
    );
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

// MARK: getFieldComments
/** 获取<#=table_comment#>字段注释 */
export async function getFieldComments(): Promise<<#=fieldCommentName#>> {<#
  if (isUseI18n) {
  #>
  const n = initN(route_path);
  const fieldComments: <#=fieldCommentName#> = {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno && !column.onlyCodegenDenoButApi) continue;
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
      if (column_name === "tenant_id") {
        continue;
      }
      if (column_name === "is_hidden") {
        continue;
      }
      const isPassword = column.isPassword;
      if (isPassword) continue;
      const foreignKey = column.foreignKey;
    #><#
      if (foreignKey || column.dict || column.dictbiz
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
  };<#
  } else {
  #>
  const fieldComments: <#=fieldCommentName#> = {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno && !column.onlyCodegenDenoButApi) continue;
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
      if (column_name === "tenant_id") {
        continue;
      }
      if (column_name === "is_hidden") {
        continue;
      }
      const isPassword = column.isPassword;
      if (isPassword) continue;
      const foreignKey = column.foreignKey;
    #><#
      if (foreignKey || column.dict || column.dictbiz
        || data_type === "datetime" || data_type === "date"
      ) {
    #>
    <#=column_name#>: "<#=column_comment#>",<#
        if (!columns.some((item) => item.COLUMN_NAME === column_name + "_lbl")) {
    #>
    <#=column_name#>_lbl: "<#=column_comment#>",<#
        }
    #><#
      } else {
    #>
    <#=column_name#>: "<#=column_comment#>",<#
      }
    #><#
    }
    #>
  };<#
  }
  #>
  return fieldComments;
}

// MARK: findByUnique
/** 通过唯一约束获得<#=table_comment#>列表 */
export async function findByUnique(
  search0: Readonly<<#=inputName#>>,
  options?: {
    is_debug?: boolean;<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    hasDataPermit?: boolean,<#
    }
    #>
  },
): Promise<<#=modelName#>[]> {
  
  const table = "<#=mod#>_<#=table#>";
  const method = "findByUnique";
  
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
    const model = await findOne(
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
      const column_name = column.COLUMN_NAME;
      if (
        [
          "id",
          "tenant_id",
          "is_sys",
          "is_deleted",
          "is_hidden",
        ].includes(column_name)
      ) {
        continue;
      }
      const data_type = column.DATA_TYPE;
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const isPassword = column.isPassword;
      if (isPassword) continue;
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
        const columnDictModels = [
          ...dictModels.filter(function(item) {
            return item.code === column.dict || item.code === column.dict;
          }),
          ...dictbizModels.filter(function(item) {
            return item.code === column.dict || item.code === column.dictbiz;
          }),
        ];
        if (![ "int", "decimal", "tinyint" ].includes(column.DATA_TYPE) && columnDictModels.length > 0) {
          let Column_Up = column_name.substring(0, 1).toUpperCase()+column_name.substring(1);
          Column_Up = Column_Up.split("_").map(function(item) {
            return item.substring(0, 1).toUpperCase() + item.substring(1);
          }).join("");
          _data_type = Table_Up + Column_Up;
        }
      }
      if (foreignKey) {
        _data_type = foreignTable_Up + "Id";
      }
    #>
    let <#=unique#>: <#=_data_type#>[] = [ ];
    if (!Array.isArray(search0.<#=unique#>) && search0.<#=unique#> != null) {
      <#=unique#> = [ search0.<#=unique#>, search0.<#=unique#> ];
    } else {
      <#=unique#> = search0.<#=unique#> || [ ];
    }<#
    } else {
    #>
    const <#=unique#> = search0.<#=unique#>;<#
    }
    #><#
    }
    #>
    const modelTmps = await findAll(
      {<#
        for (let k = 0; k < uniques.length; k++) {
          const unique = uniques[k];
        #>
        <#=unique#>,<#
        }
        #>
      },
      undefined,
      undefined,
      options,
    );
    models.push(...modelTmps);
  }<#
  }
  #>
  
  return models;
}

/** 根据唯一约束对比对象是否相等 */
export function equalsByUnique(
  oldModel: Readonly<<#=modelName#>>,
  input: Readonly<<#=inputName#>>,
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

// MARK: checkByUnique
/** 通过唯一约束检查 <#=table_comment#> 是否已经存在 */
export async function checkByUnique(
  input: Readonly<<#=inputName#>>,
  oldModel: Readonly<<#=modelName#>>,
  uniqueType: Readonly<UniqueType> = UniqueType.Throw,
  options?: {
    is_debug?: boolean;
  },
): Promise<<#=Table_Up#>Id | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const isEquals = equalsByUnique(oldModel, input);
  
  if (isEquals) {
    if (uniqueType === UniqueType.Throw) {<#
      if (isUseI18n) {
      #>
      throw new UniqueException(await ns("此 {0} 已经存在", await ns("<#=table_comment#>")));<#
      } else {
      #>
      throw new UniqueException("此 <#=table_comment#> 已经存在");<#
      }
      #>
    }
    if (uniqueType === UniqueType.Update) {
      const id: <#=Table_Up#>Id = await updateById(
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
}<#
if (hasSummary) {
#>

// MARK: findSummary
/** 根据搜索条件查找 <#=table_comment#> 合计 */
export async function findSummary(
  search?: Readonly<<#=searchName#>>,
  options?: {
    is_debug?: boolean;<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    hasDataPermit?: boolean,<#
    }
    #>
  },
): Promise<<#=Table_Up#>Summary> {
  
  const table = "<#=mod#>_<#=table#>";
  const method = "findSummary";
  
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
  }<#
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
  const sql = `select<#
  for (let i = 0; i < findSummaryColumns.length; i++) {
    const column = findSummaryColumns[i];
    const column_name = column.COLUMN_NAME;
  #> sum(t.<#=column_name#>) <#=column_name#><#
    if (i !== findSummaryColumns.length - 1) {
  #>,<#
    }
  #><#
  }
  #> from ${ await getFromQuery(args, search, options) } where ${ await getWhereQuery(args, search, options) }
  `;
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = JSON.stringify({ sql, args });
  
  const model = (await queryOne<<#=Table_Up#>Summary>(sql, args, { cacheKey1, cacheKey2 }))!;
  
  return model;
}<#
}
#>

// MARK: findOne
/** 根据条件查找第一<#=table_comment#> */
export async function findOne(
  search?: Readonly<<#=searchName#>>,
  sort?: SortInput[],
  options?: {
    is_debug?: boolean;<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    hasDataPermit?: boolean,<#
    }
    #>
  },
): Promise<<#=modelName#> | undefined> {
  
  const table = "<#=mod#>_<#=table#>";
  const method = "findOne";
  
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
  
  if (search && search.ids && search.ids.length === 0) {
    return;
  }
  const page: PageInput = {
    pgOffset: 0,
    pgSize: 1,
  };
  const models = await findAll(
    search,
    page,
    sort,
    options,
  );
  const model = models[0];
  return model;
}

// MARK: findById
/** 根据 id 查找<#=table_comment#> */
export async function findById(
  id?: <#=Table_Up#>Id | null,
  options?: {
    is_debug?: boolean;<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    hasDataPermit?: boolean,<#
    }
    #>
  },
): Promise<<#=modelName#> | undefined> {
  
  const table = "<#=mod#>_<#=table#>";
  const method = "findById";
  
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
  
  const model = await findOne(
    {
      id,
    },
    undefined,
    options,
  );
  
  return model;
}

// MARK: findByIds
/** 根据 ids 查找<#=table_comment#> */
export async function findByIds(
  ids: <#=Table_Up#>Id[],
  options?: {
    is_debug?: boolean;<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    hasDataPermit?: boolean,<#
    }
    #>
  },
): Promise<<#=modelName#>[]> {
  
  const table = "<#=mod#>_<#=table#>";
  const method = "findByIds";
  
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
  
  const models = await findAll(
    {
      ids,
    },
    undefined,
    undefined,
    options,
  );
  
  if (models.length !== ids.length) {
    throw new Error("findByIds: models.length !== ids.length");
  }
  
  const models2 = ids.map((id) => {
    const model = models.find((item) => item.id === id);
    if (!model) {
      throw new Error(`findByIds: id: ${ id } not found`);
    }
    return model;
  });
  
  return models2;
}

// MARK: exist
/** 根据搜索条件判断<#=table_comment#>是否存在 */
export async function exist(
  search?: Readonly<<#=searchName#>>,
  options?: {
    is_debug?: boolean;<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    hasDataPermit?: boolean,<#
    }
    #>
  },
): Promise<boolean> {
  
  const table = "<#=mod#>_<#=table#>";
  const method = "exist";
  
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
  const model = await findOne(search, undefined, options);
  const exist = !!model;
  
  return exist;
}

// MARK: existById
/** 根据id判断<#=table_comment#>是否存在 */
export async function existById(
  id?: Readonly<<#=Table_Up#>Id | null>,
  options?: {
    is_debug?: boolean;<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    hasDataPermit?: boolean,<#
    }
    #>
  },
) {
  
  const table = "<#=mod#>_<#=table#>";
  const method = "existById";
  
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
  const sql = `select 1 e from <#=mod#>_<#=table#> t where t.id=${ args.push(id) }<#
  if (hasIsDeleted) {
  #> and t.is_deleted = 0<#
  }
  #> limit 1`;<#
  if (cache) {
  #>
  
  const cacheKey1 = `dao.sql.${ table }`;
  const cacheKey2 = await hash(JSON.stringify({ sql, args }));
  
  const queryOptions = {
    cacheKey1,
    cacheKey2,
  };<#
  }
  #>
  
  interface Result {
    e: number,
  }
  const model = await queryOne<Result>(
    sql,
    args,<#
    if (cache) {
    #>
    queryOptions,<#
    }
    #>
  );
  const result = !!model?.e;
  
  return result;
}<#
if (hasEnabled) {
#>

// MARK: validateIsEnabled
/** 校验<#=table_comment#>是否启用 */
export async function validateIsEnabled(
  model: Readonly<<#=modelName#>>,
) {
  if (model.is_enabled == 0) {<#
    if (isUseI18n) {
    #>
    throw `${ await ns("<#=table_comment#>") } ${ await ns("已禁用") }`;<#
    } else {
    #>
    throw "<#=table_comment#> 已禁用";<#
    }
    #>
  }
}<#
}
#>

// MARK: validateOption
/** 校验<#=table_comment#>是否存在 */
export async function validateOption(
  model?: <#=modelName#>,
) {
  if (!model) {<#
    if (isUseI18n) {
    #>
    const err_msg = `${ await ns("<#=table_comment#>") } ${ await ns("不存在") }`;<#
    } else {
    #>
    const err_msg = "<#=table_comment#> 不存在";<#
    }
    #>
    error(new Error(err_msg));
    throw err_msg;
  }
  return model;
}

// MARK: validate
/** <#=table_comment#>增加和修改时校验输入 */
export async function validate(
  input: Readonly<<#=inputName#>>,
) {
  const fieldComments = await getFieldComments();<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno && !column.onlyCodegenDenoButApi) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "is_sys") {
      continue;
    }
    if (column_name === "is_deleted") {
      continue;
    }
    if (column_name === "tenant_id") {
      continue;
    }
    if (column_name === 'is_hidden') {
      continue;
    }
    const data_type = column.DATA_TYPE;
    const column_type = column.COLUMN_TYPE?.toLowerCase() || "";
    const column_comment = column.COLUMN_COMMENT || "";
    const isPassword = column.isPassword;
    if (isPassword) continue;
    const foreignKey = column.foreignKey;
    const validators = column.validators || [ ];
  #><#
    if ((foreignKey || column.dict || column.dictbiz) && foreignKey?.multiple) {
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
    } else if ((foreignKey || column.dict || column.dictbiz) && !foreignKey?.multiple) {
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
  
}<#
const autoCodeColumn = columns.find((item) => item.autoCode);
if (autoCodeColumn) {
#>

// MARK: findAutoCode
/** 获得 <#=table_comment#> 自动编码 */
export async function findAutoCode(
  options?: {
    is_debug?: boolean;
  },
) {
  
  const table = "<#=mod#>_<#=table#>";
  const method = "findAutoCode";
  
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
  
  const model = await findOne(
    undefined,
    [
      {
        prop: "<#=autoCodeColumn.autoCode.seq#>",
        order: SortOrderEnum.Desc,
      },
    ],
  );
  
  const <#=autoCodeColumn.autoCode.seq#> = (model?.<#=autoCodeColumn.autoCode.seq#> || 0) + 1;<#
  if (!autoCodeColumn.autoCode.prefix && !autoCodeColumn.autoCode.suffix) {
  #>
  const <#=autoCodeColumn.COLUMN_NAME#> = <#=autoCodeColumn.autoCode.seq#>.toString().padStart(<#=autoCodeColumn.autoCode.seqPadStart0#>, "0");<#
  } else if (autoCodeColumn.autoCode.prefix && !autoCodeColumn.autoCode.suffix) {
  #>
  const <#=autoCodeColumn.COLUMN_NAME#> = "<#=autoCodeColumn.autoCode.prefix#>" + <#=autoCodeColumn.autoCode.seq#>.toString().padStart(<#=autoCodeColumn.autoCode.seqPadStart0#>, "0");<#
  } else if (!autoCodeColumn.autoCode.prefix && autoCodeColumn.autoCode.suffix) {
  #>
  const <#=autoCodeColumn.COLUMN_NAME#> = <#=autoCodeColumn.autoCode.seq#>.toString().padStart(<#=autoCodeColumn.autoCode.seqPadStart0#>, "0") + "<#=autoCodeColumn.autoCode.suffix#>";<#
  } else {
  #>
  const <#=autoCodeColumn.COLUMN_NAME#> = "<#=autoCodeColumn.autoCode.prefix#>" + <#=autoCodeColumn.autoCode.seq#>.toString().padStart(<#=autoCodeColumn.autoCode.seqPadStart0#>, "0") + "<#=autoCodeColumn.autoCode.suffix#>";<#
  }
  #>
  
  return {
    <#=autoCodeColumn.autoCode.seq#>,
    <#=autoCodeColumn.COLUMN_NAME#>,
  };
}<#
}
#>

// MARK: createReturn
/** 创建 <#=table_comment#> 并返回 */
export async function createReturn(
  input: Readonly<<#=inputName#>>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<<#=modelName#>> {
  
  const table = "<#=mod#>_<#=table#>";
  const method = "createReturn";
  
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
  
  const model = await validateOption(
    await findOne(
      {
        id,
      },
      undefined,
      options,
    ),
  );
  
  return model;
}

// MARK: create
/** 创建 <#=table_comment#> */
export async function create(
  input: Readonly<<#=inputName#>>,
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<<#=Table_Up#>Id> {
  
  const table = "<#=mod#>_<#=table#>";
  const method = "create";
  
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

// MARK: createsReturn
/** 批量创建 <#=table_comment#> 并返回 */
export async function createsReturn(
  inputs: <#=inputName#>[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<<#=modelName#>[]> {
  
  const table = "<#=mod#>_<#=table#>";
  const method = "createsReturn";
  
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
  
  const models = await findByIds(ids, options);
  
  return models;
}

// MARK: creates
/** 批量创建 <#=table_comment#> */
export async function creates(
  inputs: <#=inputName#>[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<<#=Table_Up#>Id[]> {
  
  const table = "<#=mod#>_<#=table#>";
  const method = "creates";
  
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
  inputs: <#=inputName#>[],
  options?: {
    is_debug?: boolean;
    uniqueType?: UniqueType;
    hasDataPermit?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<<#=Table_Up#>Id[]> {
  
  if (inputs.length === 0) {
    return [ ];
  }<#
  if (autoCodeColumn) {
  #>
  
  // 设置自动编码
  for (const input of inputs) {
    if (input.<#=autoCodeColumn.COLUMN_NAME#>) {
      continue;
    }
    const {
      <#=autoCodeColumn.autoCode.seq#>,
      <#=autoCodeColumn.COLUMN_NAME#>,
    } = await findAutoCode(options);
    input.<#=autoCodeColumn.autoCode.seq#> = <#=autoCodeColumn.autoCode.seq#>;
    input.<#=autoCodeColumn.COLUMN_NAME#> = <#=autoCodeColumn.COLUMN_NAME#>;
  }<#
  }
  #>
  
  const table = "<#=mod#>_<#=table#>";
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  
  const ids2: <#=Table_Up#>Id[] = [ ];
  const inputs2: <#=inputName#>[] = [ ];
  
  for (const input of inputs) {
  
    if (input.id) {
      throw new Error(`Can not set id when create in dao: ${ table }`);
    }
    
    const oldModels = await findByUnique(input, options);
    if (oldModels.length > 0) {
      let id: <#=Table_Up#>Id | undefined = undefined;
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
        ids2.push(id);
        continue;
      }
      inputs2.push(input);
    } else {
      inputs2.push(input);
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
    
    const id = shortUuidV4<<#=Table_Up#>Id>();
    input.id = id;
    ids2.push(id);
  }
  
  if (inputs2.length === 0) {
    return ids2;
  }
  
  const is_debug_sql = getParsedEnv("database_debug_sql") === "true";<#
  if (cache) {
  #>
  
  await delCache();<#
  }
  #>
  
  const args = new QueryArgs();
  let sql = "insert into <#=mod#>_<#=table#>(id<#
if (hasCreateTime) {
#>,create_time<#
}
#><#
if (hasUpdateTime) {
#>,update_time<#
}
#><#
if (hasTenant_id) {
#>,tenant_id<#
}
#><#
if (hasCreateUsrId) {
#>,create_usr_id<#
}
#><#
if (hasCreateUsrIdLbl) {
#>,create_usr_id_lbl<#
}
#><#
if (hasUpdateUsrId) {
#>,update_usr_id<#
}
#><#
if (hasUpdateUsrIdLbl) {
#>,update_usr_id_lbl<#
}
#><#
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
  const modelLabel = column.modelLabel;
#><#
  if (modelLabel) {
#>,<#=modelLabel#><#
  }
#><#
  if (column.isPassword) {
#>,<#=column_name_mysql#><#
  } else if (foreignKey && foreignKey.type === "many2many") {
#><#
  } else if (!foreignKey) {
#>,<#=column_name_mysql#><#
  } else {
#>,<#=column_name_mysql#><#
  }
#><#
}
#><#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") continue;
  const column_comment = column.COLUMN_COMMENT || "";
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
#>,<#=val#><#
}
#><#
}
#>)values";
  
  const inputs2Arr = splitCreateArr(inputs2);
  for (const inputs2 of inputs2Arr) {
    for (let i = 0; i < inputs2.length; i++) {
      const input = inputs2[i];
      sql += `(${ args.push(input.id) }`;<#
      if (hasCreateTime) {
      #>
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
      }<#
      }
      #><#
      if (hasUpdateTime) {
      #>
      if (input.update_time != null || input.update_time_save_null) {
        sql += `,${ args.push(input.update_time) }`;
      } else {
        sql += `,null`;
      }<#
      }
      #><#
      if (hasTenant_id) {
      #>
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
      }<#
      }
      #><#
      if (hasCreateUsrId && !hasCreateUsrIdLbl) {
      #>
      if (!is_silent_mode) {
        if (input.create_usr_id == null) {
          const usr_id = await get_usr_id();
          if (usr_id != null) {
            sql += `,${ args.push(usr_id) }`;
          } else {
            sql += ",default";
          }
        } else if (input.create_usr_id as unknown as string === "-") {
          sql += ",default";
        } else {
          sql += `,${ args.push(input.create_usr_id) }`;
        }
      } else {
        if (input.create_usr_id == null) {
          sql += ",default";
        } else {
          sql += `,${ args.push(input.create_usr_id) }`;
        }
      }<#
      } else if (hasCreateUsrId && hasCreateUsrIdLbl) {
      #>
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
      }<#
      }
      #><#
      if (hasUpdateUsrId) {
      #>
      if (input.update_usr_id != null) {
        sql += `,${ args.push(input.update_usr_id) }`;
      } else {
        sql += ",default";
      }<#
      }
      #><#
      if (hasUpdateUsrIdLbl) {
      #>
      if (input.update_usr_id_lbl != null) {
        sql += `,${ args.push(input.update_usr_id_lbl) }`;
      } else {
        sql += ",default";
      }<#
      }
      #><#
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
        const is_nullable = column.IS_NULLABLE === "YES";
        const data_type = column.DATA_TYPE;
        const column_type = column.COLUMN_TYPE;
        const column_comment = column.COLUMN_COMMENT || "";
        const foreignKey = column.foreignKey;
        const foreignTable = foreignKey && foreignKey.table;
        const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
        const modelLabel = column.modelLabel;
        const isEncrypt = column.isEncrypt;
      #><#
        if (modelLabel) {
      #>
      if (input.<#=modelLabel#> != null) {
        sql += `,${ args.push(input.<#=modelLabel#>) }`;
      } else {
        sql += ",default";
      }<#
        }
      #><#
        if (column.isPassword) {
      #>
      if (isNotEmpty(input.<#=column_name#>)) {
        sql += `,${ args.push(await getPassword(input.<#=column_name#>)) }`;
      } else {
        sql += ",default";
      }<#
        } else if (foreignKey && foreignKey.type === "many2many") {
      #><#
        } else if (!foreignKey) {
      #>
      if (input.<#=column_name#> != null<#
        if (is_nullable && [ "date", "datetime" ].includes(data_type)) {
      #> || input.<#=column_name#>_save_null<#
        }
      #>) {<#
        if (isEncrypt && [ "varchar", "text" ].includes(data_type)) {
        #>
        sql += `,${ args.push(await encrypt(input.<#=column_name#>)) }`;<#
        } else if (isEncrypt && [ "decimal" ].includes(data_type)) {
        #>
        sql += `,${ args.push(await encrypt(input.<#=column_name#>.toString())) }`;<#
        } else if (isEncrypt && [ "int" ].includes(data_type)) {
        #>
        sql += `,${ args.push(await encrypt(input.<#=column_name#>.toString())) }`;<#
        } else {
        #>
        sql += `,${ args.push(input.<#=column_name#>) }`;<#
        }
        #>
      } else {
        sql += ",default";
      }<#
        } else {
      #>
      if (input.<#=column_name#> != null) {<#
        if (isEncrypt && [ "varchar", "text" ].includes(data_type)) {
        #>
        sql += `,${ args.push(await encrypt(input.<#=column_name#>)) }`;<#
        } else if (isEncrypt && [ "decimal" ].includes(data_type)) {
        #>
        sql += `,${ args.push(await encrypt(input.<#=column_name#>.toString())) }`;<#
        } else if (isEncrypt && [ "int" ].includes(data_type)) {
        #>
        sql += `,${ args.push(await encrypt(input.<#=column_name#>.toString())) }`;<#
        } else {
        #>
        sql += `,${ args.push(input.<#=column_name#>) }`;<#
        }
        #>
      } else {
        sql += ",default";
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
        const column_comment = column.COLUMN_COMMENT || "";
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
      
      if (input.<#=val#> != null) {
        sql += `,${ args.push(input.<#=val#>) }`;
      } else {
        sql += ",default";
      }<#
        }
      #><#
      }
      #>
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
  }<#
  if (opts.langTable && isUseI18n) {
  #>
  
  for (const input of inputs) {
    await refreshLangByInput(input);
  }<#
  }
  #><#
  let hasMany2manyInputs2 = false;
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
    if (foreignKey && foreignKey.type === "many2many") {
      if (column.inlineMany2manyTab) continue;
      hasMany2manyInputs2 = true;
      break;
    }
    if (inlineForeignTabs.length > 0) {
      hasMany2manyInputs2 = true;
      break;
    }
    if (column.inlineMany2manyTab) {
      hasMany2manyInputs2 = true;
      break;
    }
  }
  #><#
  if (hasMany2manyInputs2) {
  #>
  
  for (let i = 0; i < inputs2.length; i++) {
    const input = inputs2[i];<#
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
      if (foreignKey && foreignKey.type === "many2many") {
        if (column.inlineMany2manyTab) continue;
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
      }
    #><#
    }
    #><#
    for (const inlineForeignTab of inlineForeignTabs) {
      const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
      const table = inlineForeignTab.table;
      const mod = inlineForeignTab.mod;
      if (!inlineForeignSchema) {
        throw `表: ${ mod }_${ table } 的 inlineForeignTabs 中的 ${ inlineForeignTab.mod }_${ inlineForeignTab.table } 不存在`;
        process.exit(1);
      }
      const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
      const Table_Up = tableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const inline_column_name = inlineForeignTab.column_name;
      const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
      const inline_column = inlineForeignSchema.columns.find((item) => item.COLUMN_NAME === inlineForeignTab.column);
      if (!inline_column) {
        throw `表: ${ mod }_${ table } 的 inlineForeignTabs 中的 ${ inlineForeignTab.mod }_${ inlineForeignTab.table } 的列 ${ inlineForeignTab.column } 不存在`;
      }
      const modelLabel = inline_column.modelLabel;
    #>
    
    // <#=inlineForeignTab.label#><#
      if (inline_foreign_type === "one2many") {
    #>
    const <#=inline_column_name#>_input = input.<#=inline_column_name#>;
    if (<#=inline_column_name#>_input && <#=inline_column_name#>_input.length > 0) {
      for (let i = 0; i < <#=inline_column_name#>_input.length; i++) {
        const model = <#=inline_column_name#>_input[i];
        model.<#=inlineForeignTab.column#> = input.id;<#
        if (modelLabel) {
        #>
        model.<#=modelLabel#> = input.<#=inline_column.foreignKey.lbl#>;<#
        }
        #>
        await create<#=Table_Up#>(model, options);
      }
    }<#
      } else if (inline_foreign_type === "one2one") {
    #>
    if (input.<#=inline_column_name#>) {
      input.<#=inline_column_name#>.<#=inlineForeignTab.column#> = input.id;<#
      if (modelLabel) {
      #>
      input.<#=inline_column_name#>.<#=modelLabel#> = input.<#=inline_column.foreignKey.lbl#>;<#
      }
      #>
      await create<#=Table_Up#>(input.<#=inline_column_name#>, options);
    }<#
      }
    #><#
    }
    #><#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      const column_comment = column.COLUMN_COMMENT;
      let is_nullable = column.IS_NULLABLE === "YES";
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      let data_type = column.DATA_TYPE;
      const many2many = column.many2many;
      if (!many2many || !foreignKey) continue;
      if (!column.inlineMany2manyTab) continue;
      const inlineMany2manySchema = optTables[foreignKey.mod + "_" + foreignKey.table];
      const table = many2many.table;
      const mod = many2many.mod;
      if (!inlineMany2manySchema) {
        throw `inlineMany2manyTab 中的表: ${ mod }_${ table } 不存在`;
        process.exit(1);
      }
      const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
      const Table_Up = tableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
    #>
    
    // <#=column_comment#>
    if (input.<#=column_name#>_<#=table#>_models) {
      for (const item of input.<#=column_name#>_<#=table#>_models) {
        await create<#=Table_Up#>({ ...item, <#=many2many.column1#>: input.id }, options);
      }
    }<#
    }
    #>
  }<#
  }
  #><#
  if (cache) {
  #>
  
  await delCache();<#
  }
  #><#
  if (mod === "cron" && table === "cron_job") {
  #>
  
  await refreshCronJobs();<#
  }
  #>
  
  return ids2;
}<#
if (cache) {
#>

// MARK: delCache
/** 删除缓存 */
export async function delCache() {
  await delCacheCtx(`dao.sql.<#=mod#>_<#=table#>`);<#
  if (
    (mod === "base" && table === "tenant") ||
    (mod === "base" && table === "role") ||
    (mod === "base" && table === "menu") ||
    (mod === "base" && table === "usr")
  ) {
  #>
  await delCacheCtx(`dao.sql.base_menu._getMenus`);<#
  }
  #>
}<#
}
#><#
if (hasTenant_id) {
#>

// MARK: updateTenantById
/** <#=table_comment#> 根据 id 修改 租户id */
export async function updateTenantById(
  id: <#=Table_Up#>Id,
  tenant_id: Readonly<TenantId>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "<#=mod#>_<#=table#>";
  const method = "updateTenantById";
  
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
  const sql = `update <#=mod#>_<#=table#> set tenant_id=${ args.push(tenant_id) } where id=${ args.push(id) }`;
  const res = await execute(sql, args);
  const affectedRows = res.affectedRows;<#
  if (cache) {
  #>
  
  await delCache();<#
  }
  #><#
  if (mod === "cron" && table === "cron_job") {
  #>
  
  await refreshCronJobs();<#
  }
  #>
  return affectedRows;
}<#
}
#><#
if (hasVersion) {
#>

// MARK: getVersionById
/** 根据 id 获取<#=table_comment#>版本号 */
export async function getVersionById(
  id: <#=Table_Up#>Id,
): Promise<number> {
  
  const model = await findById(
    id,
    {
      is_debug: false,
    },
  );
  if (!model) {
    return 0;
  }
  const version = model.version;
  
  return version;
}<#
}
#><#
if (hasDataPermit() && hasCreateUsrId) {
#>

// MARK: getEditableDataPermitsByIds
/** 根据 ids 获取<#=table_comment#>是否可编辑数据权限 */
export async function getEditableDataPermitsByIds(
  ids: <#=Table_Up#>Id[],
) {
  if (ids.length === 0) {
    return [ ];
  }
  const dataPermitModels = await getDataPermits(route_path, {
    hasDataPermit: true,
  });
  
  if (dataPermitModels.length === 0) {
    return ids.map(() => 1);
  }
  
  const hasCreatePermit = dataPermitModels.some((item) => item.scope === DataPermitScope.Create && item.type === DataPermitType.Editable);
  const hasRolePermit = dataPermitModels.some((item) => item.scope === DataPermitScope.Role && item.type === DataPermitType.Editable);
  const hasDeptPermit = dataPermitModels.some((item) => item.scope === DataPermitScope.Dept && item.type === DataPermitType.Editable);
  const hasDeptParentPermit = dataPermitModels.some((item) => item.scope === DataPermitScope.DeptParent && item.type === DataPermitType.Editable);
  const hasTenantPermit = dataPermitModels.some((item) => item.scope === DataPermitScope.Tenant && item.type === DataPermitType.Editable);
  
  const dataPermits = [ ];
  const models = await findAll(
    {
      ids,
    },
    undefined,
    undefined,
    {
      is_debug: false,
    },
  );
  for (const id of ids) {
    const model = models.find((item) => item.id === id);
    if (!model) {
      dataPermits.push(0);
      continue;
    }
    if (!model.create_usr_id) {
      dataPermits.push(1);
      continue;
    }
    if (!hasTenantPermit && !hasDeptPermit && !hasDeptParentPermit && !hasRolePermit && hasCreatePermit) {
      const usr_id = await get_usr_id();
      if (usr_id === model.create_usr_id) {
        dataPermits.push(1);
      } else {
        dataPermits.push(0);
      }
    } else if (!hasTenantPermit && hasDeptParentPermit) {
      const dept_ids = await getAuthAndParentsDeptIds();
      const model_dept_ids = await getParentsDeptIds(model.create_usr_id);
      if (model_dept_ids.some((item) => dept_ids.includes(item))) {
        dataPermits.push(1);
      } else {
        dataPermits.push(0);
      }
    } else if (!hasTenantPermit && hasDeptPermit) {
      const dept_ids = await getAuthDeptIds();
      const model_dept_ids = await getDeptIds(model.create_usr_id);
      if (model_dept_ids.some((item) => dept_ids.includes(item))) {
        dataPermits.push(1);
      } else {
        dataPermits.push(0);
      }
    }
    
    if (!hasTenantPermit && hasRolePermit) {
      const role_ids = await getAuthRoleIds();
      const model_role_ids = await getRoleIds(model.create_usr_id);
      if (model_role_ids.some((item) => role_ids.includes(item))) {
        dataPermits.push(1);
      } else {
        dataPermits.push(0);
      }
    }
  }
  return dataPermits;
}<#
}
#><#
if (opts.langTable && isUseI18n) {
#>

async function refreshLangByInput(
  input: Readonly<<#=inputName#>>,
) {
  const server_i18n_enable = getParsedEnv("server_i18n_enable") === "true";
  if (!server_i18n_enable) {
    return;
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
    const is_nullable = column.IS_NULLABLE === "YES";
    const data_type = column.DATA_TYPE;
    const column_type = column.COLUMN_TYPE;
    const column_comment = column.COLUMN_COMMENT || "";
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const ForeighTableUp = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const modelLabel = column.modelLabel;
    if (!modelLabel) continue;
    if (!langTableRecords.some((item) => item.COLUMN_NAME === modelLabel)) {
      continue;
    }
    let foreignSchema = undefined;
    const foreignLangTableRecords = [ ];
    if (foreignKey) {
      foreignSchema = optTables[foreignKey.mod + "_" + foreignKey.table];
      for (let i = 0; i < (foreignSchema.opts.langTable?.records?.length || 0); i++) {
        const record = foreignSchema.opts.langTable.records[i];
        const column_name = record.COLUMN_NAME;
        if (
          langTableExcludeArr.includes(column_name)
        ) continue;
        foreignLangTableRecords.push(record);
      }
    }
  #>
  
  // <#=column_comment#>
  {
    const sql = "select lang_id,<#=foreignKey.lbl#> from <#=foreignSchema.opts.langTable.opts.table_name#> where <#=foreignTable#>_id=?";
    const args = new QueryArgs();
    args.push(input.<#=column_name#>);
    const models = await query<{
      lang_id: LangId;
      <#=foreignKey.lbl#>: string;
    }>(
      sql,
      args,
    );
    for (const model of models) {
      const sql = "select id,<#=modelLabel#> from <#=opts.langTable.opts.table_name#> where lang_id=? and <#=table#>_id=?";
      const args = new QueryArgs();
      args.push(model.lang_id);
      args.push(input.id);
      const lang_model = await queryOne<{
        id: string;
        <#=modelLabel#>: string;
      }>(
        sql,
        args,
      );
      const lang_id = lang_model?.id;
      if (!lang_id) {
        const lang_sql = "insert into <#=opts.langTable.opts.table_name#>(id,lang_id,<#=table#>_id,<#=modelLabel#>)values(?,?,?,?)";
        const lang_args = new QueryArgs();
        lang_args.push(shortUuidV4());
        lang_args.push(model.lang_id);
        lang_args.push(input.id);
        lang_args.push(model.<#=foreignKey.lbl#>);
        await execute(lang_sql, lang_args);
        continue;
      }
      if (lang_model.<#=modelLabel#> !== model.<#=foreignKey.lbl#>) {
        const lang_sql = "update <#=opts.langTable.opts.table_name#> set <#=modelLabel#>=? where id=?";
        const lang_args = new QueryArgs();
        lang_args.push(model.<#=foreignKey.lbl#>);
        lang_args.push(lang_id);
        await execute(lang_sql, lang_args);
      }
    }
  }<#
  }
  #>
  const lang_sql = "select id from <#=opts.langTable.opts.table_name#> where lang_id=? and <#=table#>_id=?";
  const lang_args = new QueryArgs();
  lang_args.push(await get_lang_id());
  lang_args.push(input.id);
  const model = await queryOne<{ id: string }>(
    lang_sql,
    lang_args,
  );
  const lang_id = model?.id;
  if (lang_id) {
    let lang_sql = "update <#=opts.langTable.opts.table_name#> set ";
    const lang_args = new QueryArgs();<#
    for (let i = 0; i < langTableRecords.length; i++) {
      const record = langTableRecords[i];
      const column_name = record.COLUMN_NAME;
      const column_comment = record.COLUMN_COMMENT || "";
    #>
    // <#=column_comment#>
    if (input.<#=column_name#> != null) {
      lang_sql += "<#=column_name#>=?,";
      lang_args.push(input.<#=column_name#>);
    }<#
    }
    #>
    if (lang_sql.endsWith(",")) {
      lang_sql = lang_sql.substring(0, lang_sql.length - 1);
    }
    lang_sql += " where id=?";
    lang_args.push(lang_id);
    await execute(lang_sql, lang_args);
  } else {
    const sql_fields: string[] = [ ];
    const lang_args = new QueryArgs();
    lang_args.push(shortUuidV4());
    lang_args.push(await get_lang_id());
    lang_args.push(input.id);<#
    for (let i = 0; i < langTableRecords.length; i++) {
      const record = langTableRecords[i];
      const column_name = record.COLUMN_NAME;
      const column_comment = record.COLUMN_COMMENT || "";
    #>
    // <#=column_comment#>
    if (input.<#=column_name#> != null) {
      sql_fields.push("<#=column_name#>");
      lang_args.push(input.<#=column_name#>);
    }<#
    }
    #>
    let lang_sql = "insert into <#=opts.langTable.opts.table_name#>(id,lang_id,<#=table#>_id";
    for (const sql_field of sql_fields) {
      lang_sql += "," + sql_field;
    }
    lang_sql += ")values(?,?,?";
    for (let i = 0; i < sql_fields.length; i++) {
      lang_sql += ",?";
    }
    lang_sql += ")";
    await execute(lang_sql, lang_args);
  }
}<#
}
#>

// MARK: updateById
/** 根据 id 修改 <#=table_comment#> */
export async function updateById(
  id: <#=Table_Up#>Id,
  input: <#=inputName#>,
  options?: {
    is_debug?: boolean;
    uniqueType?: Exclude<UniqueType, UniqueType.Update>;
    is_silent_mode?: boolean;
    is_creating?: boolean;<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    hasDataPermit?: boolean,<#
    }
    #>
  },
): Promise<<#=Table_Up#>Id> {
  
  const table = "<#=mod#>_<#=table#>";
  const method = "updateById";
  
  const is_debug = get_is_debug(options?.is_debug);
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  const is_creating = get_is_creating(options?.is_creating);<#
  if (opts.langTable && isUseI18n) {
  #>
  
  const server_i18n_enable = getParsedEnv("server_i18n_enable") === "true";<#
  }
  #>
  
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
    throw new Error("updateById: id cannot be empty");
  }
  if (!input) {
    throw new Error("updateById: input cannot be null");
  }<#
  if (hasTenant_id) {
  #>
  
  // 修改租户id
  if (isNotEmpty(input.tenant_id)) {
    await updateTenantById(id, input.tenant_id, options);
  }<#
  }
  #>
  
  {
    const input2 = {
      ...input,
      id: undefined,
    };
    let models = await findByUnique(input2, options);
    models = models.filter((item) => item.id !== id);
    if (models.length > 0) {
      if (!options || !options.uniqueType || options.uniqueType === UniqueType.Throw) {<#
        if (isUseI18n) {
        #>
        throw await ns("此 {0} 已经存在", await ns("<#=table_comment#>"));<#
        } else {
        #>
        throw "此 <#=table_comment#> 已经存在";<#
        }
        #>
      } else if (options.uniqueType === UniqueType.Ignore) {
        return id;
      }
    }
  }
  
  const oldModel = await findById(id, options);
  
  if (!oldModel) {<#
    if (isUseI18n) {
    #>
    throw await ns("编辑失败, 此 {0} 已被删除", await ns("<#=table_comment#>"));<#
    } else {
    #>
    throw "编辑失败, 此 <#=table_comment#> 已被删除";<#
    }
    #>
  }<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  const dataPermitModels = await getDataPermits(route_path, options);
  const hasCreatePermit = dataPermitModels.some((item) => item.scope === DataPermitScope.Create && item.type === DataPermitType.Editable);
  const hasRolePermit = dataPermitModels.some((item) => item.scope === DataPermitScope.Role && item.type === DataPermitType.Editable);
  const hasDeptPermit = dataPermitModels.some((item) => item.scope === DataPermitScope.Dept && item.type === DataPermitType.Editable);
  const hasDeptParentPermit = dataPermitModels.some((item) => item.scope === DataPermitScope.DeptParent && item.type === DataPermitType.Editable);
  const hasTenantPermit = dataPermitModels.some((item) => item.scope === DataPermitScope.Tenant && item.type === DataPermitType.Editable);
  
  if (!hasTenantPermit && !hasDeptPermit && !hasDeptParentPermit && !hasRolePermit && !hasCreatePermit && dataPermitModels.length > 0) {<#
    if (isUseI18n) {
    #>
    throw await ns("没有权限编辑此 {0}", await ns("<#=table_comment#>"));<#
    } else {
    #>
    throw "没有权限编辑此 <#=table_comment#>";<#
    }
    #>
  }
  
  if (!hasTenantPermit && !hasDeptPermit && !hasDeptParentPermit && !hasRolePermit && hasCreatePermit) {
    const usr_id = await get_usr_id();
    if (oldModel.create_usr_id !== usr_id) {<#
      if (isUseI18n) {
      #>
      throw await ns("没有权限编辑此 {0}", await ns("<#=table_comment#>"));<#
      } else {
      #>
      throw "没有权限编辑此 <#=table_comment#>";<#
      }
      #>
    }
  } else if (!hasTenantPermit && hasDeptParentPermit) {
    const dept_ids = await getAuthAndChildrenDeptIds();
    const model_dept_ids = await getParentsDeptIds(oldModel.create_usr_id);
    if (!model_dept_ids.some((item) => dept_ids.includes(item))) {<#
      if (isUseI18n) {
      #>
      throw await ns("没有权限编辑此 {0}", await ns("<#=table_comment#>"));<#
      } else {
      #>
      throw "没有权限编辑此 <#=table_comment#>";<#
      }
      #>
    }
  } else if (!hasTenantPermit && hasDeptPermit) {
    const dept_ids = await getAuthDeptIds();
    const model_dept_ids = await getDeptIds(oldModel.create_usr_id);
    if (!model_dept_ids.some((item) => dept_ids.includes(item))) {<#
      if (isUseI18n) {
      #>
      throw await ns("没有权限编辑此 {0}", await ns("<#=table_comment#>"));<#
      } else {
      #>
      throw "没有权限编辑此 <#=table_comment#>";<#
      }
      #>
    }
  }
  
  if (!hasTenantPermit && hasRolePermit) {
    const role_ids = await getAuthRoleIds();
    const model_role_ids = await getRoleIds(oldModel.create_usr_id);
    if (!model_role_ids.some((item) => role_ids.includes(item))) {<#
      if (isUseI18n) {
      #>
      throw await ns("没有权限编辑此 {0}", await ns("<#=table_comment#>"));<#
      } else {
      #>
      throw "没有权限编辑此 <#=table_comment#>";<#
      }
      #>
    }
  }<#
  }
  #><#
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
  let sql = `update <#=mod#>_<#=table#> set `;
  let updateFldNum = 0;<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    if ([ "id", "update_usr_id", "update_time" ].includes(column_name)) continue;
    const is_nullable = column.IS_NULLABLE === "YES";
    const data_type = column.DATA_TYPE;
    const column_type = column.COLUMN_TYPE;
    const column_comment = column.COLUMN_COMMENT || "";
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    if (column_name === "tenant_id") {
      continue;
    }
    const column_name_mysql = mysqlKeyEscape(column_name);
    const modelLabel = column.modelLabel;
    const isEncrypt = column.isEncrypt;
    let precision = 0;
    if (data_type === "decimal") {
      const arr = JSON.parse("["+column_type.substring(column_type.indexOf("(")+1, column_type.lastIndexOf(")"))+"]");
      precision = Number(arr[1]);
    }
  #><#
    if (modelLabel) {
  #>
  if (isNotEmpty(input.<#=modelLabel#>)) {<#
    if (!langTableRecords.some((item) => item.COLUMN_NAME === modelLabel)) {
    #>
    sql += `<#=modelLabel#>=?,`;
    args.push(input.<#=modelLabel#>);<#
    } else {
    #><#
    if (isUseI18n) {
    #>
    if (!server_i18n_enable) {
      sql += `<#=modelLabel#>=?,`;
      args.push(input.<#=modelLabel#>);
    }<#
    } else {
    #>
    sql += `<#=modelLabel#>=?,`;
    args.push(input.<#=modelLabel#>);<#
    }
    #><#
    }
    #>
    updateFldNum++;
  }<#
    }
  #><#
    if (column.isPassword) {
  #>
  if (isNotEmpty(input.<#=column_name#>)) {
    sql += `<#=column_name_mysql#>=?,`;
    args.push(await getPassword(input.<#=column_name#>));
    updateFldNum++;
  }<#
    } else if (foreignKey && foreignKey.type === "many2many") {
  #><#
    } else if (!foreignKey) {
  #>
  if (input.<#=column_name#> != null<#
    if (is_nullable && [ "date", "datetime" ].includes(data_type)) {
  #> || input.<#=column_name#>_save_null<#
    }
  #>) {
    if (input.<#=column_name#> != oldModel.<#=column_name#>) {<#
      if (isEncrypt && [ "varchar", "text" ].includes(data_type)) {
      #>
      sql += `<#=column_name_mysql#>=${ args.push(await encrypt(input.<#=column_name#>)) },`;<#
      } else if (isEncrypt && [ "decimal" ].includes(data_type)) {
      #>
      input.<#=column_name#> = new Decimal(input.<#=column_name#>.toFixed(<#=precision#>));
      sql += `<#=column_name_mysql#> = ${ args.push(await encrypt(input.<#=column_name#>.toString())) },`;<#
      } else if (isEncrypt && [ "int" ].includes(data_type)) {
      #>
      sql += `<#=column_name_mysql#>=${ args.push(await encrypt(input.<#=column_name#>.toString())) },`;<#
      } else {
      #><#
        if (!langTableRecords.some((item) => item.COLUMN_NAME === column_name)) {
      #>
      sql += `<#=column_name_mysql#>=${ args.push(input.<#=column_name#>) },`;<#
        } else {
      #><#
      if (isUseI18n) {
      #>
      if (!server_i18n_enable) {
        sql += `<#=column_name_mysql#>=${ args.push(input.<#=column_name#>) },`;
      }<#
      } else {
      #>
      sql += `<#=column_name_mysql#>=${ args.push(input.<#=column_name#>) },`;<#
      }
      #><#
        }
      #><#
      }
      #>
      updateFldNum++;
    }
  }<#
    } else {
  #>
  if (input.<#=column_name#> != null) {
    if (input.<#=column_name#> != oldModel.<#=column_name#>) {<#
      if (isEncrypt && [ "varchar", "text" ].includes(data_type)) {
      #>
      sql += `<#=column_name_mysql#> = ${ args.push(await encrypt(input.<#=column_name#>)) },`;<#
      } else if (isEncrypt && [ "decimal" ].includes(data_type)) {
      #>
      input.<#=column_name#> = new Decimal(input.<#=column_name#>.toFixed(<#=precision#>));
      sql += `<#=column_name_mysql#> = ${ args.push(await encrypt(input.<#=column_name#>.toString())) },`;<#
      } else if (isEncrypt && [ "int" ].includes(data_type)) {
      #>
      sql += `<#=column_name_mysql#>=${ args.push(await encrypt(input.<#=column_name#>.toString())) },`;<#
      } else {
      #><#
        if (!langTableRecords.some((item) => item.COLUMN_NAME === column_name)) {
      #>
      sql += `<#=column_name_mysql#>=${ args.push(input.<#=column_name#>) },`;<#
        } else {
      #><#
      if (isUseI18n) {
      #>
      if (!server_i18n_enable) {
        sql += `<#=column_name_mysql#>=${ args.push(input.<#=column_name#>) },`;
      }<#
      } else {
      #>
      sql += `<#=column_name_mysql#>=${ args.push(input.<#=column_name#>) },`;<#
      }
      #><#
        }
      #><#
      }
      #>
      updateFldNum++;
    }
  }<#
    }
  #><#
  }
  #>
  let sqlSetFldNum = updateFldNum;<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    const column_comment = column.COLUMN_COMMENT || "";
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
  if (input.<#=val#> != null) {
    if (input.<#=val#> != oldModel.<#=val#>) {<#
        if (!langTableRecords.some((item) => item.COLUMN_NAME === val)) {
      #>
      sql += `<#=val_mysql#> = ${ args.push(input.<#=val#>) },`;<#
        } else {
      #><#
      if (isUseI18n) {
      #>
      if (!server_i18n_enable) {
        sql += `<#=val_mysql#> = ${ args.push(input.<#=val#>) },`;
      }<#
      } else {
      #>
      sql += `<#=val_mysql#> = ${ args.push(input.<#=val#>) },`;<#
      }
      #><#
        }
      #>
      updateFldNum++;
    }
  }<#
    }
  #><#
  }
  #><#
  for (const inlineForeignTab of inlineForeignTabs) {
    const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
    const table = inlineForeignTab.table;
    const mod = inlineForeignTab.mod;
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const inline_column_name = inlineForeignTab.column_name;
    const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
  #>
  
  // <#=inlineForeignTab.label#><#
    if (inline_foreign_type === "one2many") {
  #>
  const <#=inline_column_name#>_input = input.<#=inline_column_name#>;
  if (<#=inline_column_name#>_input) {
    const <#=inline_column_name#>_models = await findAll<#=Table_Up#>(
      {
        <#=inlineForeignTab.column#>: [ id ],
      },
      undefined,
      undefined,
      options,
    );
    if (<#=inline_column_name#>_models.length > 0 && <#=inline_column_name#>_input.length > 0) {
      updateFldNum++;
    }
    for (let i = 0; i < <#=inline_column_name#>_models.length; i++) {
      const model = <#=inline_column_name#>_models[i];
      if (<#=inline_column_name#>_input.some((item) => item.id === model.id)) {
        continue;
      }
      await deleteByIds<#=Table_Up#>(
        [ model.id ],
        options,
      );
    }
    for (let i = 0; i < <#=inline_column_name#>_input.length; i++) {
      const model = <#=inline_column_name#>_input[i];
      if (!model.id) {
        model.<#=inlineForeignTab.column#> = id;
        await create<#=Table_Up#>(
          model,
          options,
        );
        continue;
      }
      if (<#=inline_column_name#>_models.some((item) => item.id === model.id)) {
        await revertByIds<#=Table_Up#>(
          [ model.id ],
          options,
        );
      }
      await updateById<#=Table_Up#>(
        model.id,
        {
          ...model,
          id: undefined,
        },
        options,
      );
    }
  }<#
    } else if (inline_foreign_type === "one2one") {
  #>
  if (input.<#=inline_column_name#>) {
    const <#=inline_column_name#>_models = await findAll<#=Table_Up#>(
      {
        <#=inlineForeignTab.column#>: [ id ],
      },
      undefined,
      undefined,
      options,
    );
    if (<#=inline_column_name#>_models.length > 0) {
      updateFldNum++;
    }
    for (let i = 0; i < <#=inline_column_name#>_models.length; i++) {
      const model = <#=inline_column_name#>_models[i];
      if (input.<#=inline_column_name#>.id === model.id) {
        continue;
      }
      await deleteByIds<#=Table_Up#>(
        [ model.id ],
        options,
      );
    }
    if (!input.<#=inline_column_name#>.id) {
      input.<#=inline_column_name#>.<#=inlineForeignTab.column#> = id;
      await create<#=Table_Up#>(
        input.<#=inline_column_name#>,
        options,
      );
    } else {
      if (<#=inline_column_name#>_models.some((item) => item.id === input.<#=inline_column_name#>!.id)) {
        await revertByIds<#=Table_Up#>(
          [ input.<#=inline_column_name#>.id ],
          options,
        );
      }
      await updateById<#=Table_Up#>(
        input.<#=inline_column_name#>.id,
        {
          ...input.<#=inline_column_name#>,
          id: undefined,
        },
        options,
      );
    }
  }<#
    }
  #><#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    if ([ "id", "create_usr_id", "create_time", "update_usr_id", "update_time" ].includes(column_name)) continue;
    const data_type = column.DATA_TYPE;
    const column_type = column.COLUMN_TYPE;
    const column_comment = column.COLUMN_COMMENT || "";
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const many2many = column.many2many;
  #><#
    if (foreignKey && foreignKey.type === "json") {
  #><#
    } else if (foreignKey && foreignKey.type === "many2many") {
      if (column.inlineMany2manyTab) continue;
  #>
  
  updateFldNum++;
  
  // <#=column_comment#>
  await many2manyUpdate(
    {
      ...input,
      id: id as unknown as string,
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
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    const column_comment = column.COLUMN_COMMENT;
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    let data_type = column.DATA_TYPE;
    const many2many = column.many2many;
    if (!many2many || !foreignKey) continue;
    if (!column.inlineMany2manyTab) continue;
    const inlineMany2manySchema = optTables[foreignKey.mod + "_" + foreignKey.table];
    const table = many2many.table;
    const mod = many2many.mod;
    if (!inlineMany2manySchema) {
      throw `inlineMany2manyTab 中的表: ${ mod }_${ table } 不存在`;
      process.exit(1);
    }
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
  #>
  
  // <#=column_comment#>
  {
    const <#=table#>_models = await findAll<#=Table_Up#>(
      {
        <#=many2many.column1#>: [ id ],
      },
      undefined,
      undefined,
      options,
    );
    const <#=table#>_create_models: <#=Table_Up#>Input[] = [ ];
    const <#=table#>_update_models: {
      id: <#=Table_Up#>Id,
      input: <#=Table_Up#>Input,
    }[] = [ ];
    const <#=table#>_delete_ids: <#=Table_Up#>Id[] = [ ];
    
    const <#=column_name#>_<#=table#>_models = input.<#=column_name#>_<#=table#>_models ?? [ ];
    for (const <#=table#>_model of <#=table#>_models) {
      let hasIn = false;
      for (const <#=table#>_model2 of <#=column_name#>_<#=table#>_models) {
        const isEquals = equalsByUnique<#=Table_Up#>(<#=table#>_model, <#=table#>_model2);
        if (isEquals) {
          hasIn = true;
          break;
        }
      }
      if (!hasIn) {
        <#=table#>_delete_ids.push(<#=table#>_model.id);
      }
    }
    for (let i = 0; i < <#=column_name#>_<#=table#>_models.length; i++) {
      const input = <#=column_name#>_<#=table#>_models[i];
      input.order_by = i + 1;
      let old_model: <#=Table_Up#>Model | undefined = undefined;
      for (const model of <#=table#>_models) {
        const isEquals = equalsByUnique<#=Table_Up#>(model, input);
        if (isEquals) {
          old_model = model;
          break;
        }
      }
      if (old_model) {
        <#=table#>_update_models.push({
          id: old_model.id,
          input,
        });
      } else {
        <#=table#>_create_models.push(input);
      }
    }
    
    for (const input of <#=table#>_create_models) {
      await create<#=Table_Up#>(input, options);
    }
    for (let i = 0; i < <#=table#>_update_models.length; i++) {
      const { id, input } = <#=table#>_update_models[i];
      await updateById<#=Table_Up#>(
        id,
        {
          ...input,
          id: undefined,
        },
        options,
      );
    }
    await deleteByIds<#=Table_Up#>(
      <#=table#>_delete_ids,
      options,
    );
    await forceDeleteByIds<#=Table_Up#>(
      <#=table#>_delete_ids,
      options,
    );
    
    updateFldNum++;
  }<#
  }
  #>
  
  if (updateFldNum > 0) {<#
    if (hasUpdateUsrId && !hasUpdateUsrIdLbl) {
    #>
    if (!is_silent_mode && !is_creating) {
      if (input.update_usr_id == null) {
        const usr_id = await get_usr_id();
        if (usr_id != null) {
          sql += `update_usr_id=${ args.push(usr_id) },`;
        }
      } else if (input.update_usr_id as unknown as string !== "-") {
        sql += `update_usr_id=${ args.push(input.update_usr_id) },`;
      }
    } else if (input.update_usr_id != null) {
      sql += `update_usr_id=${ args.push(input.update_usr_id) },`;
    }<#
    } else if (hasUpdateUsrId && hasUpdateUsrIdLbl) {
    #>
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
    }<#
    }
    #><#
    if (hasVersion) {
    #>
    if (!is_silent_mode) {
      if (input.version != null) {
        const version = await getVersionById(id);
        if (version && version > input.version) {<#
          if (isUseI18n) {
          #>
          throw await ns("此 {0} 已被修改，请刷新后重试", await ns("<#=table_comment#>"));<#
          } else {
          #>
          throw "此 <#=table_comment#> 已被修改，请刷新后重试";<#
          }
          #>
        }
        sql += `version=${ args.push(version + 1) },`;
        sqlSetFldNum++;
      }
    } else if (input.version != null) {
      sql += `version=${ args.push(input.version) },`;
      sqlSetFldNum++;
    }<#
    }
    #><#
    if (hasUpdateTime) {
    #>
    if (!is_silent_mode && !is_creating) {
      if (input.update_time != null || input.update_time_save_null) {
        sql += `update_time=${ args.push(input.update_time) },`;
      } else {
        sql += `update_time=${ args.push(reqDate()) },`;
      }
    } else if (input.update_time != null || input.update_time_save_null) {
      sql += `update_time=${ args.push(input.update_time) },`;
    }<#
    }
    #>
    if (sql.endsWith(",")) {
      sql = sql.substring(0, sql.length - 1);
    }
    sql += ` where id=${ args.push(id) } limit 1`;<#
    if (cache) {
    #>
    
    await delCache();<#
    }
    #>
    
    if (sqlSetFldNum > 0) {
      await execute(sql, args);<#
      if (opts.langTable && isUseI18n) {
      #>
      if (server_i18n_enable) {
        await refreshLangByInput({
          ...input,
          id,
        });
      }<#
      }
      #>
    }
  }<#
  if (cache) {
  #>
  
  if (updateFldNum > 0) {
    await delCache();
  }<#
  }
  #>
  
  if (!is_silent_mode) {
    log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
  }<#
  if (opts?.history_table) {
  #>
  
  if (!is_silent_mode) {
    const newModel = await findById(id, options);
    
    if (!deepCompare(oldModel, newModel)) {
      const {
        create: createHistory,
      } = await import("/gen/<#=mod#>/<#=opts.history_table#>/<#=opts.history_table#>.dao.ts");
      
      await createHistory(
        {
          ...oldModel,
          <#=table#>_id: id,
          id: undefined,
        },
        options,
      );
    }
  }<#
  }
  #><#
  if (mod === "cron" && table === "cron_job") {
  #>
  
  await refreshCronJobs();<#
  }
  #>
  
  return id;
}

// MARK: deleteByIds
/** 根据 ids 删除 <#=table_comment#> */
export async function deleteByIds(
  ids: <#=Table_Up#>Id[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
    is_creating?: boolean;<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    hasDataPermit?: boolean,<#
    }
    #>
  },
): Promise<number> {
  
  const table = "<#=mod#>_<#=table#>";
  const method = "deleteByIds";
  
  const is_debug = get_is_debug(options?.is_debug);
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  const is_creating = get_is_creating(options?.is_creating);<#
  if (opts.langTable && isUseI18n) {
  #>
  const server_i18n_enable = getParsedEnv("server_i18n_enable") === "true";<#
  }
  #>
  
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
  }<#
  if (hasDataPermit() && hasCreateUsrId) {
  #>
  
  const dataPermitModels = await getDataPermits(route_path, options);
  const hasCreatePermit = dataPermitModels.some((item) => item.scope === DataPermitScope.Create && item.type === DataPermitType.Editable);
  const hasRolePermit = dataPermitModels.some((item) => item.scope === DataPermitScope.Role && item.type === DataPermitType.Editable);
  const hasDeptPermit = dataPermitModels.some((item) => item.scope === DataPermitScope.Dept && item.type === DataPermitType.Editable);
  const hasDeptParentPermit = dataPermitModels.some((item) => item.scope === DataPermitScope.DeptParent && item.type === DataPermitType.Editable);
  const hasTenantPermit = dataPermitModels.some((item) => item.scope === DataPermitScope.Tenant && item.type === DataPermitType.Editable);
  
  if (!hasTenantPermit && !hasDeptPermit && !hasDeptParentPermit && !hasRolePermit && !hasCreatePermit && dataPermitModels.length > 0) {<#
    if (isUseI18n) {
    #>
    throw await ns("没有权限删除此 {0}", await ns("<#=table_comment#>"));<#
    } else {
    #>
    throw "没有权限删除此 <#=table_comment#>";<#
    }
    #>
  }<#
  }
  #><#
  if (cache) {
  #>
  
  await delCache();<#
  }
  #>
  
  let affectedRows = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findById(id, options);
    if (!oldModel) {
      continue;
    }
    if (!is_silent_mode) {
      log(`${ table }.${ method }.old_model: ${ JSON.stringify(oldModel) }`);
    }<#
    if (hasDataPermit() && hasCreateUsrId) {
    #>
    
    if (!hasTenantPermit && !hasDeptPermit && !hasDeptParentPermit && !hasRolePermit && hasCreatePermit) {
      const usr_id = await get_usr_id();
      if (oldModel.create_usr_id !== usr_id) {<#
        if (isUseI18n) {
        #>
        throw await ns("没有权限删除此 {0}", await ns("<#=table_comment#>"));<#
        } else {
        #>
        throw "没有权限删除此 <#=table_comment#>";<#
        }
        #>
      }
    } else if (!hasTenantPermit && hasDeptParentPermit) {
      const dept_ids = await getAuthAndParentsDeptIds();
      const model_dept_ids = await getParentsDeptIds(oldModel.create_usr_id);
      if (!model_dept_ids.some((item) => dept_ids.includes(item))) {<#
        if (isUseI18n) {
        #>
        throw await ns("没有权限删除此 {0}", await ns("<#=table_comment#>"));<#
        } else {
        #>
        throw "没有权限删除此 <#=table_comment#>";<#
        }
        #>
      }
    } else if (!hasTenantPermit && hasDeptPermit) {
      const dept_ids = await getAuthDeptIds();
      const model_dept_ids = await getDeptIds(oldModel.create_usr_id);
      if (!model_dept_ids.some((item) => dept_ids.includes(item))) {<#
        if (isUseI18n) {
        #>
        throw await ns("没有权限删除此 {0}", await ns("<#=table_comment#>"));<#
        } else {
        #>
        throw "没有权限删除此 <#=table_comment#>";<#
        }
        #>
      }
    }
  
    if (!hasTenantPermit && hasRolePermit) {
      const role_ids = await getAuthRoleIds();
      const model_role_ids = await getRoleIds(oldModel.create_usr_id);
      if (!model_role_ids.some((item) => role_ids.includes(item))) {<#
        if (isUseI18n) {
        #>
        throw await ns("没有权限删除此 {0}", await ns("<#=table_comment#>"));<#
        } else {
        #>
        throw "没有权限删除此 <#=table_comment#>";<#
        }
        #>
      }
    }<#
    }
    #>
    const args = new QueryArgs();<#
    if (hasIsDeleted) {
    #>
    let sql = `update <#=mod#>_<#=table#> set is_deleted=1`;
    if (!is_silent_mode && !is_creating) {<#
      if (hasDeleteUsrId || hasDeleteUsrIdLbl) {
      #>
      let usr_id = await get_usr_id();<#
      }
      #><#
      if (hasDeleteUsrId) {
      #>
      if (usr_id != null) {
        sql += `,delete_usr_id=${ args.push(usr_id) }`;
      }<#
      }
      #><#
      if (hasDeleteUsrIdLbl) {
      #>
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
      }<#
      }
      #><#
      if (hasDeleteTime) {
      #>
      sql += `,delete_time=${ args.push(reqDate()) }`;<#
      }
      #>
    }
    sql += ` where id=${ args.push(id) } limit 1`;<#
    } else {
    #>
    const sql = `delete from <#=mod#>_<#=table#> where id=${ args.push(id) } limit 1`;<#
    }
    #>
    const res = await execute(sql, args);
    affectedRows += res.affectedRows;<#
    if (opts.langTable && isUseI18n) {
    #>
    if (server_i18n_enable) {<#
      if (hasIsDeleted) {
      #>
      const sql = "update <#=opts.langTable.opts.table_name#> set is_deleted=1 where <#=table#>_id=?";<#
      } else {
      #>
      const sql = "delete from <#=opts.langTable.opts.table_name#> where <#=table#>_id=?";<#
      }
      #>
      const args = new QueryArgs();
      args.push(id);
      await execute(sql, args);
    }<#
    }
    #><#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.inlineMany2manyTab) continue;
      const column_name = column.COLUMN_NAME;
      const column_comment = column.COLUMN_COMMENT;
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const many2many = column.many2many;
      if (!many2many || !foreignKey) continue;
      const many2many_no_cascade_delete = foreignKey.many2many_no_cascade_delete;
      const many2manySchema = optTables[foreignKey.mod + "_" + foreignKey.table];
      if (!many2manySchema) {
        throw `many2many 中的表: ${ foreignKey.mod }_${ foreignKey.table } 不存在`;
        process.exit(1);
      }
    #>
    {
      const <#=column_name#> = oldModel.<#=column_name#>;
      if (<#=column_name#> && <#=column_name#>.length > 0) {
        const args = new QueryArgs();<#
        if (!many2many_no_cascade_delete) {
        #><#
        if (hasIsDeleted) {
        #>
        const sql = `update <#=mod#>_<#=many2many.table#> set is_deleted=1 where <#=many2many.column1#>=${ args.push(id) } and <#=many2many.column2#> in (${ args.push(<#=column_name#>) }) and is_deleted=0`;<#
        } else {
        #>
        const sql = `delete from <#=mod#>_<#=many2many.table#> where <#=many2many.column1#>=${ args.push(id) } and <#=many2many.column2#> in (${ args.push(<#=column_name#>) }) and is_deleted=0`;<#
        }
        #>
        await execute(sql, args);<#
        } else {
        #>
        const sql = `select id from <#=mod#>_<#=many2many.table#> where <#=many2many.column1#>=${ args.push(id) } and <#=many2many.column2#> in (${ args.push(<#=column_name#>) }) and is_deleted=0`;
        const model = await queryOne(sql, args);
        if (model) {<#
          if (isUseI18n) {
          #>
          throw await ns("请先删除关联数据");<#
          } else {
          #>
          throw "请先删除关联数据";<#
          }
          #>
        }<#
        }
        #>
      }
    }<#
    }
    #><#
    for (const table_name of table_names) {
    const optTable = optTables[table_name];
    const hasIsDeleted = optTable.columns.some((column) => column.COLUMN_NAME === "is_deleted");
    for (const column of optTable.columns) {
      if (column.inlineMany2manyTab) continue;
      const foreignKey = column.foreignKey;
      const many2many = column.many2many;
      if (!many2many || !foreignKey) continue;
      if (foreignKey.mod !== mod || foreignKey.table !== table) continue;
      const many2many_no_cascade_delete = foreignKey.many2many_no_cascade_delete;
    #>
    {
      const args = new QueryArgs();<#
      if (!many2many_no_cascade_delete) {
      #><#
      if (hasIsDeleted) {
      #>
      const sql = `update <#=mod#>_<#=many2many.table#> set is_deleted=1 where <#=many2many.column2#>=${ args.push(id) } and is_deleted=0`;<#
      } else {
      #>
      const sql = `delete from <#=mod#>_<#=many2many.table#> where <#=many2many.column2#>=${ args.push(id) } and is_deleted=0`;<#
      }
      #>
      await execute(sql, args);<#
      } else {
      #>
      const sql = `select id from <#=mod#>_<#=many2many.table#> where <#=many2many.column2#>=${ args.push(id) } and is_deleted=0`;
      const model = await queryOne(sql, args);
      if (model) {<#
        if (isUseI18n) {
        #>
        throw await ns("请先删除关联数据");<#
        } else {
        #>
        throw "请先删除关联数据";<#
        }
        #>
      }<#
      }
      #>
    }<#
    }
    #><#
    }
    #>
  }<#
  for (const inlineForeignTab of inlineForeignTabs) {
    const table = inlineForeignTab.table;
    const mod = inlineForeignTab.mod;
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const inline_column_name = inlineForeignTab.column_name;
  #>
  
  // <#=inlineForeignTab.label#>
  const <#=inline_column_name#> = await findAll<#=Table_Up#>(
    {
      <#=inlineForeignTab.column#>: ids,
    },
    undefined,
    undefined,
    options,
  );
  await deleteByIds<#=Table_Up#>(
    <#=inline_column_name#>.map((item) => item.id),
    options,
  );<#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    const column_comment = column.COLUMN_COMMENT;
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    let data_type = column.DATA_TYPE;
    const many2many = column.many2many;
    if (!many2many || !foreignKey) continue;
    if (!column.inlineMany2manyTab) continue;
    const inlineMany2manySchema = optTables[foreignKey.mod + "_" + foreignKey.table];
    const table = many2many.table;
    const mod = many2many.mod;
    if (!inlineMany2manySchema) {
      throw `inlineMany2manyTab 中的表: ${ mod }_${ table } 不存在`;
      process.exit(1);
    }
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
  #>
  
  // <#=column_comment#>
  if (ids && ids.length > 0) {
    {
      const <#=table#>_models = await findAll<#=Table_Up#>(
        {
          <#=many2many.column1#>: ids,
          is_deleted: 1,
        },
        undefined,
        undefined,
        options,
      );
      await forceDeleteByIds<#=Table_Up#>(
        <#=table#>_models.map((item) => item.id),
        options,
      );
    }
    const <#=table#>_models = await findAll<#=Table_Up#>(
      {
        <#=many2many.column1#>: ids,
      },
      undefined,
      undefined,
      options,
    );
    await deleteByIds<#=Table_Up#>(
      <#=table#>_models.map((item) => item.id),
      options,
    );
  }<#
  }
  #><#
  if (cache) {
  #>
  
  await delCache();<#
  }
  #><#
  if (mod === "cron" && table === "cron_job") {
  #>
  
  await refreshCronJobs();<#
  }
  #>
  
  return affectedRows;
}<#
if (hasDefault) {
#>

// MARK: defaultById
/** 根据 id 设置默认<#=table_comment#> */
export async function defaultById(
  id: <#=Table_Up#>Id,
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
    const sql = `update <#=mod#>_<#=table#> set is_default=0 where is_default=1 and id!=${ args.push(id) }`;
    await execute(sql, args);
  }
  
  const args = new QueryArgs();
  const sql = `update <#=mod#>_<#=table#> set is_default=1 where id=${ args.push(id) }`;
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

// MARK: getIsEnabledById
/** 根据 id 查找 <#=table_comment#> 是否已启用, 不存在则返回 undefined */
export async function getIsEnabledById(
  id: <#=Table_Up#>Id,
  options?: {
    is_debug?: boolean;
  },
): Promise<0 | 1 | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const model = await findById(
    id,
    options,
  );
  const is_enabled = model?.is_enabled as (0 | 1 | undefined);
  
  return is_enabled;
}

// MARK: enableByIds
/** 根据 ids 启用或者禁用 <#=table_comment#> */
export async function enableByIds(
  ids: <#=Table_Up#>Id[],
  is_enabled: Readonly<0 | 1>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "<#=mod#>_<#=table#>";
  const method = "enableByIds";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ JSON.stringify(ids) }`;
    }
    if (is_enabled != null) {
      msg += ` is_enabled:${ is_enabled }`;
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
  }<#
  if (cache) {
  #>
  
  if (ids.length > 0) {
    await delCache();
  }<#
  }
  #>
  
  const args = new QueryArgs();
  const sql = `update <#=mod#>_<#=table#> set is_enabled=${ args.push(is_enabled) } where id in (${ args.push(ids) })`;
  const result = await execute(sql, args);
  const num = result.affectedRows;<#
  if (cache) {
  #>
  
  await delCache();<#
  }
  #><#
  if (mod === "cron" && table === "cron_job") {
  #>
  
  await refreshCronJobs();<#
  }
  #>
  
  return num;
}<#
}
#><#
if (hasLocked) {
#>

// MARK: getIsLockedById
/** 根据 id 查找 <#=table_comment#> 是否已锁定, 不存在则返回 undefined, 已锁定的不能修改和删除 */
export async function getIsLockedById(
  id: <#=Table_Up#>Id,
  options?: {
    is_debug?: boolean;
  },
): Promise<0 | 1 | undefined> {
  
  options = options ?? { };
  options.is_debug = false;
  
  const model = await findById(
    id,
    options,
  );
  const is_locked = model?.is_locked as (0 | 1 | undefined);
  
  return is_locked;
}

// MARK: lockByIds
/** 根据 ids 锁定或者解锁 <#=table_comment#> */
export async function lockByIds(
  ids: <#=Table_Up#>Id[],
  is_locked: Readonly<0 | 1>,
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "<#=mod#>_<#=table#>";
  const method = "lockByIds";
  
  const is_debug = get_is_debug(options?.is_debug);
  
  if (is_debug !== false) {
    let msg = `${ table }.${ method }:`;
    if (ids) {
      msg += ` ids:${ JSON.stringify(ids) }`;
    }
    if (is_locked != null) {
      msg += ` is_locked:${ is_locked }`;
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
  }<#
  if (cache) {
  #>
  
  await delCache();<#
  }
  #>
  
  const args = new QueryArgs();
  let sql = `update <#=mod#>_<#=table#> set is_locked=${ args.push(is_locked) } where id in (${ args.push(ids) })`;
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
if (hasIsDeleted) {
#>

// MARK: revertByIds
/** 根据 ids 还原 <#=table_comment#> */
export async function revertByIds(
  ids: <#=Table_Up#>Id[],
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "<#=mod#>_<#=table#>";
  const method = "revertByIds";
  
  const is_debug = get_is_debug(options?.is_debug);<#
  if (opts.langTable && isUseI18n) {
  #>
  const server_i18n_enable = getParsedEnv("server_i18n_enable") === "true";<#
  }
  #>
  
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
  }<#
  if (cache) {
  #>
  
  await delCache();<#
  }
  #>
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    let old_model = await findOne(
      {
        id,<#
        if (hasIsDeleted) {
        #>
        is_deleted: 1,<#
        }
        #>
      },
      undefined,
      options,
    );
    if (!old_model) {
      old_model = await findById(
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
      } as <#=Table_Up#>Input;
      const models = await findByUnique(input, options);
      for (const model of models) {
        if (model.id === id) {
          continue;
        }<#
        if (isUseI18n) {
        #>
        throw await ns("此 {0} 已经存在", await ns("<#=table_comment#>"));<#
        } else {
        #>
        throw "此 <#=table_comment#> 已经存在";<#
        }
        #>
      }
    }
    const args = new QueryArgs();
    const sql = `update <#=mod#>_<#=table#> set is_deleted=0 where id=${ args.push(id) } limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;<#
    if (opts.langTable && isUseI18n) {
    #>
    if (server_i18n_enable) {
      const sql = "update <#=opts.langTable.opts.table_name#> set is_deleted=0 where <#=table#>_id=?";
      const args = new QueryArgs();
      args.push(id);
      await execute(sql, args);
    }<#
    }
    #><#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.inlineMany2manyTab) continue;
      const column_name = column.COLUMN_NAME;
      const column_comment = column.COLUMN_COMMENT;
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const many2many = column.many2many;
      if (!many2many || !foreignKey) continue;
      const many2many_no_cascade_delete = foreignKey.many2many_no_cascade_delete;
      const many2manySchema = optTables[foreignKey.mod + "_" + foreignKey.table];
      if (!many2manySchema) {
        throw `many2many 中的表: ${ foreignKey.mod }_${ foreignKey.table } 不存在`;
        process.exit(1);
      }
    #>
    {
      const <#=column_name#> = old_model.<#=column_name#>;
      if (<#=column_name#> && <#=column_name#>.length > 0) {
        const args = new QueryArgs();<#
        if (!many2many_no_cascade_delete) {
        #><#
        if (hasIsDeleted) {
        #>
        const sql = `update <#=mod#>_<#=many2many.table#> set is_deleted=0 where <#=many2many.column1#>=${ args.push(id) } and <#=many2many.column2#> in (${ args.push(<#=column_name#>) }) and is_deleted=1`;<#
        }
        #>
        await execute(sql, args);<#
        }
        #>
      }
    }<#
    }
    #>
  }<#
  for (const inlineForeignTab of inlineForeignTabs) {
    const table = inlineForeignTab.table;
    const mod = inlineForeignTab.mod;
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const inline_column_name = inlineForeignTab.column_name;
    const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
  #><#
    if (inline_foreign_type === "one2many") {
  #>
  
  // <#=inlineForeignTab.label#>
  const <#=inline_column_name#>_models = await findAll<#=Table_Up#>(
    {
      <#=inlineForeignTab.column#>: ids,
      is_deleted: 1,
    },
    undefined,
    undefined,
    options,
  );
  await revertByIds<#=Table_Up#>(
    <#=inline_column_name#>_models.map((item) => item.id),
    options,
  );<#
    } else if (inline_foreign_type === "one2one") {
  #>
  
  // <#=inlineForeignTab.label#>
  const <#=inline_column_name#>_models = await findAll<#=Table_Up#>(
    {
      <#=inlineForeignTab.column#>: ids,
      is_deleted: 1,
    },
    undefined,
    undefined,
    options,
  );
  await revertByIds<#=Table_Up#>(
    <#=inline_column_name#>_models.slice(0, 1).map((item) => item.id),
    options,
  );<#
    }
  #><#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    const column_comment = column.COLUMN_COMMENT;
    let is_nullable = column.IS_NULLABLE === "YES";
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    let data_type = column.DATA_TYPE;
    const many2many = column.many2many;
    if (!many2many || !foreignKey) continue;
    if (!column.inlineMany2manyTab) continue;
    const inlineMany2manySchema = optTables[foreignKey.mod + "_" + foreignKey.table];
    const table = many2many.table;
    const mod = many2many.mod;
    if (!inlineMany2manySchema) {
      throw `inlineMany2manyTab 中的表: ${ mod }_${ table } 不存在`;
      process.exit(1);
    }
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
  #>
  
  // <#=column_comment#>
  const <#=table#>_models = await findAll<#=Table_Up#>(
    {
      <#=many2many.column1#>: ids,
      is_deleted: 1,
    },
    undefined,
    undefined,
    options,
  );
  const <#=table#>_ids = <#=table#>_models.map((item) => item.id);
  await revertByIds<#=Table_Up#>(
    <#=table#>_ids,
    options,
  );<#
  }
  #><#
  if (cache) {
  #>
  
  await delCache();<#
  }
  #><#
  if (mod === "cron" && table === "cron_job") {
  #>
  
  await refreshCronJobs();<#
  }
  #>
  
  return num;
}<#
}
#><#
if (hasIsDeleted) {
#>

// MARK: forceDeleteByIds
/** 根据 ids 彻底删除 <#=table_comment#> */
export async function forceDeleteByIds(
  ids: <#=Table_Up#>Id[],
  options?: {
    is_debug?: boolean;
    is_silent_mode?: boolean;
  },
): Promise<number> {
  
  const table = "<#=mod#>_<#=table#>";
  const method = "forceDeleteByIds";
  
  const is_silent_mode = get_is_silent_mode(options?.is_silent_mode);
  const is_debug = get_is_debug(options?.is_debug);<#
  if (opts.langTable && isUseI18n) {
  #>
  const server_i18n_enable = getParsedEnv("server_i18n_enable") === "true";<#
  }
  #>
  
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
  }<#
  if (cache) {
  #>
  
  await delCache();<#
  }
  #>
  
  let num = 0;
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const oldModel = await findOne(
      {
        id,<#
        if (hasIsDeleted) {
        #>
        is_deleted: 1,<#
        }
        #>
      },
      undefined,
      options,
    );
    if (oldModel && !is_silent_mode) {
      log(`${ table }.${ method }: ${ JSON.stringify(oldModel) }`);
    }
    const args = new QueryArgs();
    const sql = `delete from <#=mod#>_<#=table#> where id=${ args.push(id) }<#
    if (hasIsDeleted) {
    #> and is_deleted = 1<#
    }
    #> limit 1`;
    const result = await execute(sql, args);
    num += result.affectedRows;<#
    if (opts.langTable && isUseI18n) {
    #>
    if (server_i18n_enable) {
      const sql = "delete from <#=opts.langTable.opts.table_name#> where <#=table#>_id=?";
      const args = new QueryArgs();
      args.push(id);
      await execute(sql, args);
    }<#
    }
    #><#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.inlineMany2manyTab) continue;
      const column_name = column.COLUMN_NAME;
      const column_comment = column.COLUMN_COMMENT;
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const many2many = column.many2many;
      if (!many2many || !foreignKey) continue;
      const many2many_no_cascade_delete = foreignKey.many2many_no_cascade_delete;
      const many2manySchema = optTables[foreignKey.mod + "_" + foreignKey.table];
      if (!many2manySchema) {
        throw `many2many 中的表: ${ foreignKey.mod }_${ foreignKey.table } 不存在`;
        process.exit(1);
      }
    #>
    if (oldModel) {
      const <#=column_name#> = oldModel.<#=column_name#>;
      if (<#=column_name#> && <#=column_name#>.length > 0) {
        const args = new QueryArgs();
        const sql = `delete from <#=mod#>_<#=many2many.table#> where <#=many2many.column1#>=${ args.push(id) } and <#=many2many.column2#> in (${ args.push(<#=column_name#>) })`;
        await execute(sql, args);
      }
    }<#
    }
    #><#
    for (const table_name of table_names) {
    const optTable = optTables[table_name];
    const hasIsDeleted = optTable.columns.some((column) => column.COLUMN_NAME === "is_deleted");
    for (const column of optTable.columns) {
      if (column.inlineMany2manyTab) continue;
      const foreignKey = column.foreignKey;
      const many2many = column.many2many;
      if (!many2many || !foreignKey) continue;
      if (foreignKey.mod !== mod || foreignKey.table !== table) continue;
      const many2many_no_cascade_delete = foreignKey.many2many_no_cascade_delete;
    #>
    {
      const args = new QueryArgs();
      const sql = `delete from <#=mod#>_<#=many2many.table#> where <#=many2many.column2#>=${ args.push(id) }`;
      await execute(sql, args);
    }<#
    }
    #><#
    }
    #>
  }<#
  for (const inlineForeignTab of inlineForeignTabs) {
    const table = inlineForeignTab.table;
    const mod = inlineForeignTab.mod;
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const inline_column_name = inlineForeignTab.column_name;
  #>
  
  // <#=inlineForeignTab.label#>
  const <#=inline_column_name#>_models = await findAll<#=Table_Up#>(
    {
      <#=inlineForeignTab.column#>: ids,
      is_deleted: 1,
    },
    undefined,
    undefined,
    options,
  );
  await forceDeleteByIds<#=Table_Up#>(
    <#=inline_column_name#>_models.map((item) => item.id),
    options,
  );<#
  }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    const column_comment = column.COLUMN_COMMENT;
    let is_nullable = column.IS_NULLABLE === "YES";
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const foreignTable_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    let data_type = column.DATA_TYPE;
    const many2many = column.many2many;
    if (!many2many || !foreignKey) continue;
    if (!column.inlineMany2manyTab) continue;
    const inlineMany2manySchema = optTables[foreignKey.mod + "_" + foreignKey.table];
    const table = many2many.table;
    const mod = many2many.mod;
    if (!inlineMany2manySchema) {
      throw `inlineMany2manyTab 中的表: ${ mod }_${ table } 不存在`;
      process.exit(1);
    }
    const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
    const Table_Up = tableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
  #>
  
  // <#=column_comment#>
  const <#=table#>_models = await findAll<#=Table_Up#>(
    {
      <#=many2many.column1#>: ids,
    },
    undefined,
    undefined,
    options,
  );
  await deleteByIds<#=Table_Up#>(
    <#=table#>_models.map((item) => item.id),
    options,
  );
  {
    const <#=table#>_models = await findAll<#=Table_Up#>(
      {
        <#=many2many.column1#>: ids,
        is_deleted: 1,
      },
      undefined,
      undefined,
      options,
    );
    await forceDeleteByIds<#=Table_Up#>(
      <#=table#>_models.map((item) => item.id),
      options,
    );
  }<#
  }
  #><#
  if (cache) {
  #>
  
  await delCache();<#
  }
  #>
  
  return num;
}<#
}
#><#
if (hasOrderBy) {
#>

// MARK: findLastOrderBy
/** 查找 <#=table_comment#> order_by 字段的最大值 */
export async function findLastOrderBy(
  options?: {
    is_debug?: boolean;
  },
): Promise<number> {
  
  const table = "<#=mod#>_<#=table#>";
  const method = "findLastOrderBy";
  
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
  
  let sql = `select t.order_by order_by from <#=mod#>_<#=table#> t`;
  const whereQuery: string[] = [ ];
  const args = new QueryArgs();
  whereQuery.push(` t.is_deleted=0`);<#
  if (hasTenant_id) {
  #>
  {
    const usr_id = await get_usr_id();
    const tenant_id = await getTenant_id(usr_id);
    whereQuery.push(` t.tenant_id=${ args.push(tenant_id) }`);
  }<#
  }
  #>
  if (whereQuery.length > 0) {
    sql += " where " + whereQuery.join(" and ");
  }
  sql += ` order by t.order_by desc limit 1`;
  
  interface Result {
    order_by: number;
  }
  let model = await queryOne<Result>(sql, args);
  let result = model?.order_by ?? 0;
  
  return result;
}<#
}
#><#
if (mod === "cron" && table === "cron_job") {
#>

{
  const context = newContext();
  context.notVerifyToken = true;
  runInAsyncHooks(context, async () => {
    try {
      await refreshCronJobs();
    } catch (err) {
      console.error(err);
    }
  });
}<#
}
#>
