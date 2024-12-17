<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by' && !column.onlyCodegenDeno);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasEnabled = columns.some((column) => column.COLUMN_NAME === "is_enabled");
const hasDefault = columns.some((column) => column.COLUMN_NAME === "is_default");
const hasIsDeleted = columns.some((column) => column.COLUMN_NAME === "is_deleted");
const hasSummary = columns.some((column) => column.showSummary);
const hasUniques = columns.some((column) => column.uniques && column.uniques.length > 0);
const hasInlineForeignTabs = opts?.inlineForeignTabs && opts?.inlineForeignTabs.length > 0;
const inlineForeignTabs = opts?.inlineForeignTabs || [ ];
let Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
let Table_Up2 = Table_Up;
// if (/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 1))
//   && !/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 2))
// ) {
//   Table_Up2 = Table_Up.substring(0, Table_Up.length - 1) + Table_Up.substring(Table_Up.length - 1).toUpperCase();
// }
const table_Up = Table_Up.substring(0, 1).toLowerCase() + Table_Up.substring(1);
let modelName = "";
let fieldCommentName = "";
let inputName = "";
let searchName = "";
let modelNameTree = "";
let fieldsName = "";
if (/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 1))
  && !/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 2))
) {
  modelName = Table_Up2 + "Model";
  fieldCommentName = Table_Up2 + "FieldComment";
  inputName = Table_Up2 + "Input";
  searchName = Table_Up2 + "Search";
  modelNameTree = Table_Up2 + "ModelTree";
  fieldsName = table_Up + "Fields";
} else {
  modelName = Table_Up + "Model";
  fieldCommentName = Table_Up + "FieldComment";
  inputName = Table_Up + "Input";
  searchName = Table_Up + "Search";
  modelNameTree = Table_Up + "ModelTree";
  fieldsName = table_Up + "Fields";
}
#><#
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
#>import cfg from "@/utils/config";<#
if (opts.noAdd !== true || opts.noEdit !== true) {
#>

import {
  UniqueType,
} from "#/types";<#
}
#><#
let hasDefaultValue = false;
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
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
  if (!column.COLUMN_DEFAULT && column.COLUMN_DEFAULT !== 0) continue;
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
  let defaultValue = column.COLUMN_DEFAULT.toString();
  if (defaultValue == null || defaultValue === "null" || defaultValue === "NULL" || defaultValue === "") {
    continue;
  }
  hasDefaultValue = true;
  break;
}
#><#
if (hasDefaultValue) {
#>

import {<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
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
    if (!column.COLUMN_DEFAULT && column.COLUMN_DEFAULT !== 0) continue;
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
    let defaultValue = column.COLUMN_DEFAULT.toString();
    if (defaultValue == null || defaultValue === "null" || defaultValue === "NULL" || defaultValue === "") {
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
} from "#/types";<#
}
#>

import type {
  Query,
  Mutation,
  PageInput,
} from "#/types";

import {
  <#=table_Up#>QueryField,
} from "./Model";<#
const importForeignTablesTree = [ ];
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
  const column_name = column.COLUMN_NAME;
  const foreignKey = column.foreignKey;
  const data_type = column.DATA_TYPE;
  if (!foreignKey) continue;
  const foreignTable = foreignKey.table;
  const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  if (importForeignTablesTree.includes(Foreign_Table_Up)) {
    continue;
  }
  importForeignTablesTree.push(Foreign_Table_Up);
  let foreignSchema = undefined;
  if (foreignKey) {
    foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
  }
  if (!foreignSchema) {
    continue;
  }
  if (foreignSchema.opts?.ignoreCodegen || foreignSchema.opts?.onlyCodegenDeno) {
    continue;
  }
  if (foreignSchema.opts?.list_tree !== true) {
    continue;
  }
#>

import {
  findTree as find<#=Foreign_Table_Up#>Tree,
} from "@/views/<#=foreignKey.mod#>/<#=foreignTable#>/Api";<#
}
#><#
for (const inlineForeignTab of inlineForeignTabs) {
  const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
  const columns = inlineForeignSchema.columns;
  const table = inlineForeignTab.table;
  const mod = inlineForeignTab.mod;
  const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
  const Table_Up = tableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    const foreignKey = column.foreignKey;
    const data_type = column.DATA_TYPE;
    if (!foreignKey) continue;
    const foreignTable = foreignKey.table;
    const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    if (importForeignTablesTree.includes(Foreign_Table_Up)) {
      continue;
    }
    importForeignTablesTree.push(Foreign_Table_Up);
    let foreignSchema = undefined;
    if (foreignKey) {
      foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
    }
    if (!foreignSchema) {
      continue;
    }
    if (foreignSchema.opts?.ignoreCodegen || foreignSchema.opts?.onlyCodegenDeno) {
      continue;
    }
    if (foreignSchema.opts?.list_tree !== true) {
      continue;
    }
#>

import {
  findTree as find<#=Foreign_Table_Up#>Tree,
} from "@/views/<#=foreignKey.mod#>/<#=foreignTable#>/Api";<#
  }
}
#><#
const intoInputTableUps = [ ];
#><#
for (const inlineForeignTab of inlineForeignTabs) {
  const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
  const columns = inlineForeignSchema.columns.filter((item) => item.COLUMN_NAME !== inlineForeignTab.column);
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
#>
<#
  if (!intoInputTableUps.includes(Table_Up)) {
    intoInputTableUps.push(Table_Up);
#>
import {
  intoInput as intoInput<#=Table_Up#>,
} from "@/views/<#=mod#>/<#=table#>/Api";<#
  }
#><#
}
#><#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
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
  const table = many2many.table;
  const mod = many2many.mod;
  const inlineMany2manySchema = optTables[mod + "_" + table];
  if (!inlineMany2manySchema) {
    throw `表: ${ mod }_${ table } 的 inlineMany2manyTab 中的 ${ foreignKey.mod }_${ foreignKey.table } 不存在`;
    process.exit(1);
  }
  const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
  const Table_Up = tableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  const inlineMany2manyColumns = inlineMany2manySchema.columns;
#>
<#
  if (!intoInputTableUps.includes(Table_Up)) {
    intoInputTableUps.push(Table_Up);
#>
import {
  intoInput as intoInput<#=Table_Up#>,
} from "@/views/<#=mod#>/<#=table#>/Api";<#
  }
#><#
}
#>

async function setLblById(
  model?: <#=modelName#> | null,
  isExcelExport = false,
) {
  if (!model) {
    return;
  }<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    if (column_name === "id") continue;
    if (column_name === "is_sys") continue;
    if (column_name === "is_deleted") continue;
    if (column_name === "is_hidden") continue;
    const data_type = column.DATA_TYPE;
    const column_comment = column.COLUMN_COMMENT || "";
    let formatter = column.formatter;
    if (!formatter) {
      if (data_type === "json") {
        formatter = `model.${ column_name } = model.${ column_name } && JSON.stringify(model.${ column_name }) || "";`;
      }
    }
    const column_type = column.COLUMN_TYPE;
    let precision = 0;
    if (data_type === "decimal") {
      const arr = JSON.parse("["+column_type.substring(column_type.indexOf("(")+1, column_type.lastIndexOf(")"))+"]");
      precision = Number(arr[1]);
    }
  #><#
    if (formatter) {
  #>
  <#=formatter#><#
    }
  #><#
    if (data_type === "decimal") {
  #>
  
  // <#=column_comment#>
  if (!isExcelExport) {
    model.<#=column_name#>_lbl = new Intl.NumberFormat(getLocale(), {
      style: "decimal",
      minimumFractionDigits: <#=precision#>,
      maximumFractionDigits: <#=precision#>,
    }).format(new Decimal(model.<#=column_name#> ?? 0).toNumber());
    model.<#=column_name#> = new Decimal(model.<#=column_name#> ?? 0);
    model.<#=column_name#>.toString = () => model.<#=column_name#>_lbl;
  } else {
    model.<#=column_name#>_lbl = new Decimal(model.<#=column_name#> ?? 0).toFixed(<#=precision#>);
  }<#
    } else if (column.isImg) {
  #>
  
  // <#=column_comment#>
  if (model.<#=column_name#>) {
    model.<#=column_name#>_lbl = location.origin + getImgUrl({
      id: model.<#=column_name#>,
      height: 100,
    });
  }<#
    }
  #><#
  }
  #>
}

export function intoInput(
  model?: <#=inputName#>,
) {
  const input: <#=inputName#> = {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno) continue;
      const column_name = column.COLUMN_NAME;
      if (
        [
          "is_deleted", "tenant_id",
          "create_time", "create_time_lbl",
          "create_usr_id", "create_usr_id_lbl",
          "update_time", "update_time_lbl",
          "update_usr_id", "update_usr_id_lbl",
        ].includes(column_name)
      ) {
        continue;
      }
      const is_nullable = column.IS_NULLABLE === "YES";
      const column_type = column.COLUMN_TYPE;
      const data_type = column.DATA_TYPE;
      const column_comment = column.COLUMN_COMMENT;
      const foreignKey = column.foreignKey;
      let modelLabel = column.modelLabel;
      let cascade_fields = [ ];
      if (foreignKey) {
        cascade_fields = foreignKey.cascade_fields || [ ];
        if (foreignKey.lbl && cascade_fields.includes(foreignKey.lbl) && !modelLabel) {
          cascade_fields = cascade_fields.filter((item) => item !== column_name + "_" + foreignKey.lbl);
        } else if (modelLabel) {
          cascade_fields = cascade_fields.filter((item) => item !== modelLabel);
        }
      }
      if (foreignKey && foreignKey.lbl && !modelLabel) {
        modelLabel = column_name + "_" + foreignKey.lbl;
      } else if (!foreignKey && !modelLabel) {
        modelLabel = column_name + "_lbl";
      }
      let hasModelLabel = !!column.modelLabel;
      if (column.dict || column.dictbiz || data_type === "date" || data_type === "datetime") {
        hasModelLabel = true;
      } else if (foreignKey && foreignKey.lbl) {
        hasModelLabel = true;
      }
    #><#
      if (foreignKey || column.dict || column.dictbiz) {
    #>
    // <#=column_comment#>
    <#=column_name#>: model?.<#=column_name#>,<#
      if (hasModelLabel) {
    #>
    <#=modelLabel#>: model?.<#=modelLabel#>,<#
      }
    #><#
      } else if (data_type === "datetime" || data_type === "date") {
    #>
    // <#=column_comment#>
    <#=column_name#>: model?.<#=column_name#>,
    <#=column_name#>_lbl: model?.<#=column_name#>_lbl,<#
      if (is_nullable) {
    #>
    <#=column_name#>_save_null: model?.<#=column_name#>_save_null,<#
      }
    #><#
      } else {
    #>
    // <#=column_comment#>
    <#=column_name#>: model?.<#=column_name#>,<#
      }
    #><#
    }
    #><#
    if (hasVersion) {
    #>
    version: model?.version,<#
    }
    #><#
    for (const inlineForeignTab of inlineForeignTabs) {
      const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
      const columns = inlineForeignSchema.columns.filter((item) => item.COLUMN_NAME !== inlineForeignTab.column);
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
      const inline_column_name = inlineForeignTab.column_name;
      const inline_foreign_type = inlineForeignTab.foreign_type || "one2many";
    #><#
      if (inline_foreign_type === "one2many") {
    #>
    // <#=inlineForeignTab.label#>
    <#=inline_column_name#>: model?.<#=inline_column_name#>?.map(intoInput<#=Table_Up#>),<#
      } else if (inline_foreign_type === "one2one") {
    #>
    // <#=inlineForeignTab.label#>
    <#=inline_column_name#>: intoInput<#=Table_Up#>(model?.<#=inline_column_name#>),<#
      }
    #><#
    }
    #><#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno) continue;
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
      const table = many2many.table;
      const mod = many2many.mod;
      const inlineMany2manySchema = optTables[mod + "_" + table];
      if (!inlineMany2manySchema) {
        throw `表: ${ mod }_${ table } 的 inlineMany2manyTab 中的 ${ foreignKey.mod }_${ foreignKey.table } 不存在`;
        process.exit(1);
      }
      const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
      const Table_Up = tableUp.split("_").map(function(item) {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
      }).join("");
      const inlineMany2manyColumns = inlineMany2manySchema.columns;
    #>
    <#=column_name#>_<#=table#>_models: model?.<#=column_name#>_<#=table#>_models?.map(intoInput<#=Table_Up#>),<#
    }
    #>
  };
  return input;
}

/**
 * 根据搜索条件查找<#=table_comment#>列表
 */
export async function findAll(
  search?: <#=searchName#>,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAll<#=Table_Up2#>: <#=modelName#>[];
  } = await query({
    query: `
      query($search: <#=searchName#>, $page: PageInput, $sort: [SortInput!]) {
        findAll<#=Table_Up2#>(search: $search, page: $page, sort: $sort) {
          ${ <#=table_Up#>QueryField }
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const models = data.findAll<#=Table_Up2#>;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    await setLblById(model);
  }
  return models;
}

/**
 * 根据条件查找第一个<#=table_comment#>
 */
export async function findOne(
  search?: <#=searchName#>,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOne<#=Table_Up2#>?: <#=modelName#>;
  } = await query({
    query: `
      query($search: <#=searchName#>, $sort: [SortInput!]) {
        findOne<#=Table_Up2#>(search: $search, sort: $sort) {
          ${ <#=table_Up#>QueryField }
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOne<#=Table_Up2#>;
  await setLblById(model);
  return model;
}<#
if (hasDataPermit() && hasCreateUsrId) {
#>

/**
 * 根据 ids 获取会员卡是否可编辑数据权限
 */
export async function getEditableDataPermitsByIds(
  ids: <#=Table_Up2#>Id[],
  opt?: GqlOpt,
) {
  const data: {
    getEditableDataPermitsByIds<#=Table_Up2#>: Query["getEditableDataPermitsByIds<#=Table_Up2#>"];
  } = await query({
    query: /* GraphQL */ `
      query($ids: [<#=Table_Up2#>Id!]!) {
        getEditableDataPermitsByIds<#=Table_Up2#>(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.getEditableDataPermitsByIds<#=Table_Up2#>;
  return res;
}<#
}
#><#
if (list_tree === true) {
#>

export type <#=modelNameTree#> = <#=modelName#> & {
  children?: <#=modelNameTree#>[];
}

/**
 * 查找<#=table_comment#>树形列表
 */
export async function findTree(
  search?: <#=searchName#>,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const res = await findAll(
    search,
    undefined,
    sort,
    opt,
  );
  const treeData = list2tree(res);
  return treeData;
}<#
}
#>

/**
 * 根据搜索条件查找<#=table_comment#>总数
 */
export async function findCount(
  search?: <#=searchName#>,
  opt?: GqlOpt,
) {
  const data: {
    findCount<#=Table_Up2#>: Query["findCount<#=Table_Up2#>"];
  } = await query({
    query: /* GraphQL */ `
      query($search: <#=searchName#>) {
        findCount<#=Table_Up2#>(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const count = data.findCount<#=Table_Up2#>;
  return count;
}<#
if (hasSummary) {
#>

/**
 * 根据搜索条件查找<#=table_comment#>合计
 */
export async function findSummary(
  search?: <#=searchName#>,
  opt?: GqlOpt,
) {
  const data: {
    findSummary<#=Table_Up2#>: Query["findSummary<#=Table_Up2#>"];
  } = await query({
    query: /* GraphQL */ `
      query($search: <#=searchName#>) {
        findSummary<#=Table_Up2#>(search: $search) {<#
          for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.ignoreCodegen) continue;
            if (column.onlyCodegenDeno) continue;
            const column_name = column.COLUMN_NAME;
            if (column_name === "id") continue;
          #><#
            if (column.showSummary) {
          #>
          <#=column_name#><#
            }
          #><#
          }
          #>
        }
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const res = data.findSummary<#=Table_Up2#>;
  return res;
}<#
}
#><#
if (opts.noAdd !== true) {
#>

/**
 * 创建<#=table_comment#>
 * @param {<#=inputName#>} input
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  input: <#=inputName#>,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<<#=Table_Up#>Id> {
  const ids = await creates(
    [ input ],
    unique_type,
    opt,
  );
  const id = ids[0];
  return id;
}

/**
 * 批量创建<#=table_comment#>
 */
export async function creates(
  inputs: <#=inputName#>[],
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<<#=Table_Up#>Id[]> {
  inputs = inputs.map(intoInput);
  const data: {
    creates<#=Table_Up2#>: Mutation["creates<#=Table_Up2#>"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($inputs: [<#=inputName#>!]!, $unique_type: UniqueType) {
        creates<#=Table_Up2#>(inputs: $inputs, unique_type: $unique_type)
      }
    `,
    variables: {
      inputs,
      unique_type,
    },
  }, opt);
  const ids = data.creates<#=Table_Up2#>;
  return ids;
}<#
}
#><#
if (opts.noEdit !== true) {
#>

/**
 * 根据 id 修改<#=table_comment#>
 */
export async function updateById(
  id: <#=Table_Up#>Id,
  input: <#=inputName#>,
  opt?: GqlOpt,
): Promise<<#=Table_Up#>Id> {
  input = intoInput(input);
  const data: {
    updateById<#=Table_Up2#>: Mutation["updateById<#=Table_Up2#>"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: <#=Table_Up2#>Id!, $input: <#=inputName#>!) {
        updateById<#=Table_Up2#>(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  const id2: <#=Table_Up#>Id = data.updateById<#=Table_Up2#>;
  return id2;
}<#
}
#>

/**
 * 根据 id 查找<#=table_comment#>
 */
export async function findById(
  id: <#=Table_Up#>Id,
  opt?: GqlOpt,
) {
  const data: {
    findById<#=Table_Up2#>?: <#=modelName#>;
  } = await query({
    query: `
      query($id: <#=Table_Up#>Id!) {
        findById<#=Table_Up2#>(id: $id) {
          ${ <#=table_Up#>QueryField }
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const model = data.findById<#=Table_Up2#>;
  await setLblById(model);
  return model;
}<#
if (opts.noDelete !== true) {
#>

/**
 * 根据 ids 删除<#=table_comment#>
 */
export async function deleteByIds(
  ids: <#=Table_Up#>Id[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIds<#=Table_Up2#>: Mutation["deleteByIds<#=Table_Up2#>"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [<#=Table_Up#>Id!]!) {
        deleteByIds<#=Table_Up2#>(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIds<#=Table_Up2#>;
  return res;
}<#
}
#><#
if (hasDefault && opts.noEdit !== true) {
#>

/**
 * 根据 id 设置默认<#=table_comment#>
 */
export async function defaultById(
  id: <#=Table_Up#>Id,
  opt?: GqlOpt,
) {
  const data: {
    defaultById<#=Table_Up2#>: Mutation["defaultById<#=Table_Up2#>"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: <#=Table_Up#>Id!) {
        defaultById<#=Table_Up2#>(id: $id)
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const res = data.defaultById<#=Table_Up2#>;
  return res;
}<#
}
#><#
if (hasEnabled && opts.noEdit !== true) {
#>

/**
 * 根据 ids 启用或禁用<#=table_comment#>
 */
export async function enableByIds(
  ids: <#=Table_Up#>Id[],
  is_enabled: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    enableByIds<#=Table_Up2#>: Mutation["enableByIds<#=Table_Up2#>"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [<#=Table_Up#>Id!]!, $is_enabled: Int!) {
        enableByIds<#=Table_Up2#>(ids: $ids, is_enabled: $is_enabled)
      }
    `,
    variables: {
      ids,
      is_enabled,
    },
  }, opt);
  const res = data.enableByIds<#=Table_Up2#>;
  return res;
}<#
}
#><#
if (hasLocked && opts.noEdit !== true) {
#>

/**
 * 根据 ids 锁定或解锁<#=table_comment#>
 */
export async function lockByIds(
  ids: <#=Table_Up#>Id[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    lockByIds<#=Table_Up2#>: Mutation["lockByIds<#=Table_Up2#>"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [<#=Table_Up#>Id!]!, $is_locked: Int!) {
        lockByIds<#=Table_Up2#>(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIds<#=Table_Up2#>;
  return res;
}<#
}
#><#
if (opts.noRevert !== true && hasIsDeleted) {
#>

/**
 * 根据 ids 还原<#=table_comment#>
 */
export async function revertByIds(
  ids: <#=Table_Up#>Id[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIds<#=Table_Up2#>: Mutation["revertByIds<#=Table_Up2#>"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [<#=Table_Up#>Id!]!) {
        revertByIds<#=Table_Up2#>(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIds<#=Table_Up2#>;
  return res;
}<#
}
#><#
if (opts.noForceDelete !== true && hasIsDeleted) {
#>

/**
 * 根据 ids 彻底删除<#=table_comment#>
 */
export async function forceDeleteByIds(
  ids: <#=Table_Up#>Id[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIds<#=Table_Up2#>: Mutation["forceDeleteByIds<#=Table_Up2#>"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [<#=Table_Up#>Id!]!) {
        forceDeleteByIds<#=Table_Up2#>(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIds<#=Table_Up2#>;
  return res;
}<#
}
#><#
const foreignTableArr = [];
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
  if (column.isAtt) continue;
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") continue;
  if (
    [
      "is_default", "is_deleted", "is_enabled", "is_locked", "is_sys",
      "tenant_id", "tenant_id_lbl",
    ].includes(column_name)
    || (column.noAdd && column.noEdit && !column.search)
  ) continue;
  if (column_name === "create_usr_id" && !column.search) continue;
  if (column_name === "update_usr_id" && !column.search) continue;
  const foreignKey = column.foreignKey;
  const data_type = column.DATA_TYPE;
  if (!foreignKey) continue;
  const foreignTable = foreignKey.table;
  const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  if (foreignTableArr.includes(foreignTable)) continue;
  foreignTableArr.push(foreignTable);
  const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  const defaultSort = foreignKey && foreignKey.defaultSort;
  const foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
  const foreignHasEnabled = foreignSchema.columns.some((column) => column.COLUMN_NAME === "is_enabled");
#>

export async function findAll<#=Foreign_Table_Up#>(
  search?: <#=Foreign_Table_Up#>Search,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAll<#=Foreign_Table_Up#>: <#=Foreign_Table_Up#>Model[];
  } = await query({
    query: /* GraphQL */ `
      query($search: <#=Foreign_Table_Up#>Search, $page: PageInput, $sort: [SortInput!]) {
        findAll<#=Foreign_Table_Up#>(search: $search, page: $page, sort: $sort) {
          <#=foreignKey.column#>
          <#=foreignKey.lbl#>
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const res = data.findAll<#=Foreign_Table_Up#>;
  return res;
}

export async function get<#=Foreign_Table_Up#>List() {
  const data = await findAll<#=Foreign_Table_Up#>(<#
    if (foreignHasEnabled && foreignTable !== table) {
    #>
    {
      is_enabled: [ 1 ],
    },<#
    } else {
    #>
    undefined,<#
    }
    #>
    undefined,
    [
      {
        prop: "<#=defaultSort && defaultSort.prop || ""#>",
        order: "<#=defaultSort && defaultSort.order || "ascending"#>",
      },
    ],
    {
      notLoading: true,
    },
  );
  return data;
}<#
}
#><#
const foreignTableTreeArr = [];
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  if (column.onlyCodegenDeno) continue;
  const column_name = column.COLUMN_NAME;
  const foreignKey = column.foreignKey;
  const data_type = column.DATA_TYPE;
  if (!foreignKey) continue;
  const foreignTable = foreignKey.table;
  const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  if (foreignTableTreeArr.includes(foreignTable)) continue;
  foreignTableTreeArr.push(foreignTable);
  const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  const defaultSort = foreignKey && foreignKey.defaultSort;
  let foreignSchema = undefined;
  if (foreignKey) {
    foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
  }
  if (!foreignSchema) {
    continue;
  }
  if (foreignSchema.opts?.ignoreCodegen || foreignSchema.opts?.onlyCodegenDeno) {
    continue;
  }
  if (foreignSchema.opts?.list_tree !== true) {
    continue;
  }
  let list_treeForeignTable = undefined;
  if (typeof list_tree === "string") {
    list_treeForeignTable = optTables[foreignKey.mod + "_" + foreignKey.table];
  }
#>

export async function get<#=Foreign_Table_Up#>Tree() {
  const data = await find<#=Foreign_Table_Up#>Tree(<#
    if (list_treeForeignTable && list_treeForeignTable.columns.some(function (item) { return item.COLUMN_NAME === "is_enabled" })) {
    #>
    {
      is_enabled: [ 1 ],
    },<#
    } else {
    #>
    undefined,<#
    }
    #>
    [
      {
        prop: "<#=defaultSort && defaultSort.prop || ""#>",
        order: "<#=defaultSort && defaultSort.order || "ascending"#>",
      },
    ],
    {
      notLoading: true,
    },
  );
  return data;
}<#
  if (mod === "base" && table === "menu") {
#>

export const menuDataPermit = {<#
  const optKeys = Object.keys(optTables);
  for (let i = 0; i < optKeys.length; i++) {
    const optKey = optKeys[i];
    const optTable = optTables[optKey];
    if (!optTable.opts.dataPermit) {
      continue;
    }
  #>
  "/<#=optTable.opts.mod#>/<#=optTable.opts.table#>": true,<#
  }
  #>
} as const;

export function useMenuTreeFilter(_value: string, model: MenuModel): boolean {
  const route_path = model.route_path;
  if (!route_path) {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isPermit = (menuDataPermit as any)[route_path];
  return isPermit;
}<#
  }
#><#
}
#><#
for (const inlineForeignTab of inlineForeignTabs) {
  const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
  const columns = inlineForeignSchema.columns;
  const table = inlineForeignTab.table;
  const mod = inlineForeignTab.mod;
  const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
  const Table_Up = tableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    if (
      [
        "create_usr_id", "create_usr_id_lbl", "create_time", "update_usr_id", "update_usr_id_lbl", "update_time",
        "is_default", "is_deleted", "is_enabled", "is_locked", "is_sys",
        "tenant_id", "tenant_id_lbl",
      ].includes(column_name)
      || column.readonly
      || (column.noAdd && column.noEdit)
    ) continue;
    const foreignKey = column.foreignKey;
    const data_type = column.DATA_TYPE;
    if (!foreignKey) continue;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    if (foreignTableArr.includes(foreignTable)) continue;
    foreignTableArr.push(foreignTable);
    const defaultSort = foreignKey && foreignKey.defaultSort;
    const foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
    const foreignHasEnabled = foreignSchema.columns.some((column) => column.COLUMN_NAME === "is_enabled");
#>

export async function findAll<#=Foreign_Table_Up#>(
  search?: <#=Foreign_Table_Up#>Search,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAll<#=Foreign_Table_Up#>: <#=Foreign_Table_Up#>Model[];
  } = await query({
    query: /* GraphQL */ `
      query($search: <#=Foreign_Table_Up#>Search, $page: PageInput, $sort: [SortInput!]) {
        findAll<#=Foreign_Table_Up#>(search: $search, page: $page, sort: $sort) {
          <#=foreignKey.column#>
          <#=foreignKey.lbl#>
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const res = data.findAll<#=Foreign_Table_Up#>;
  return res;
}

export async function get<#=Foreign_Table_Up#>List() {
  const data = await findAll<#=Foreign_Table_Up#>(<#
    if (foreignHasEnabled && foreignTable !== table) {
    #>
    {
      is_enabled: [ 1 ],
    },<#
    } else {
    #>
    undefined,<#
    }
    #>
    undefined,
    [
      {
        prop: "<#=defaultSort && defaultSort.prop || ""#>",
        order: "<#=defaultSort && defaultSort.order || "ascending"#>",
      },
    ],
    {
      notLoading: true,
    },
  );
  return data;
}<#
  }
}
#><#
for (const inlineForeignTab of inlineForeignTabs) {
  const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
  const columns = inlineForeignSchema.columns;
  const table = inlineForeignTab.table;
  const mod = inlineForeignTab.mod;
  const tableUp = table.substring(0, 1).toUpperCase()+table.substring(1);
  const Table_Up = tableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    const foreignKey = column.foreignKey;
    const data_type = column.DATA_TYPE;
    if (!foreignKey) continue;
    const foreignTable = foreignKey && foreignKey.table;
    const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    if (foreignTableTreeArr.includes(foreignTable)) continue;
    foreignTableTreeArr.push(foreignTable);
    const defaultSort = foreignKey && foreignKey.defaultSort;
    let foreignSchema = undefined;
    if (foreignKey) {
      foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
    }
    if (!foreignSchema) {
      continue;
    }
    if (foreignSchema.opts?.ignoreCodegen || foreignSchema.opts?.onlyCodegenDeno) {
      continue;
    }
    if (foreignSchema.opts?.list_tree !== true) {
      continue;
    }
    let list_treeForeignTable = undefined;
    if (typeof list_tree === "string") {
      list_treeForeignTable = optTables[foreignKey.mod + "_" + foreignKey.table];
    }
#>

export async function get<#=Foreign_Table_Up#>Tree() {
  const data = await find<#=Foreign_Table_Up#>Tree(<#
    if (list_treeForeignTable && list_treeForeignTable.columns.some(function (item) { return item.COLUMN_NAME === "is_enabled" })) {
    #>
    {
      is_enabled: [ 1 ],
    },<#
    } else {
    #>
    undefined,<#
    }
    #>
    [
      {
        prop: "<#=defaultSort && defaultSort.prop || ""#>",
        order: "<#=defaultSort && defaultSort.order || "ascending"#>",
      },
    ],
    {
      notLoading: true,
    },
  );
  return data;
}<#
  }
}
#>

/**
 * 下载<#=table_comment#>导入模板
 */
export function useDownloadImportTemplate(routePath: string) {
  const {
    nsAsync,
  } = useI18n(routePath);
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2() {
    const data = await query({
      query: /* GraphQL */ `
        query {
          getFieldComments<#=Table_Up2#> {<#
            for (let i = 0; i < columns.length; i++) {
              const column = columns[i];
              if (column.ignoreCodegen) continue;
              if (column.onlyCodegenDeno) continue;
              if (column.isAtt) continue;
              const column_name = column.COLUMN_NAME;
              if (
                [
                  "create_usr_id", "create_usr_id_lbl", "create_time", "update_usr_id", "update_usr_id_lbl", "update_time",
                  "is_default", "is_deleted", "is_enabled", "is_locked", "is_sys",
                  "tenant_id", "tenant_id_lbl",
                ].includes(column_name)
                || column.readonly
                || column.noAdd
              ) continue;
              const column_type = column.COLUMN_TYPE;
              const data_type = column.DATA_TYPE;
              const column_comment = column.COLUMN_COMMENT;
              const foreignKey = column.foreignKey;
              if (column_name === "id") {
                continue;
              }
              const isPassword = column.isPassword;
              if (isPassword) continue;
            #><#
              if (foreignKey || column.dict || column.dictbiz
                || data_type === "datetime" || data_type === "date"
              ) {
            #>
            <#=column_name#>_lbl<#
              } else {
            #>
            <#=column_name#><#
              }
            }
            #>
          }<#
          const foreignTableArrTmp1 = [];
          for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.ignoreCodegen) continue;
            if (column.onlyCodegenDeno) continue;
            if (column.notImportExportList) continue;
            if (column.isAtt) continue;
            const column_name = column.COLUMN_NAME;
            if (
              [
                "create_usr_id", "create_usr_id_lbl", "create_time", "update_usr_id", "update_usr_id_lbl", "update_time",
                "is_default", "is_deleted", "is_enabled", "is_locked", "is_sys",
                "tenant_id", "tenant_id_lbl",
              ].includes(column_name)
              || column.readonly
              || column.noAdd
            ) continue;
            const column_type = column.COLUMN_TYPE;
            const data_type = column.DATA_TYPE;
            const column_comment = column.COLUMN_COMMENT;
            if (column_name === "id") {
              continue;
            }
            const isPassword = column.isPassword;
            if (isPassword) continue;
            const foreignKey = column.foreignKey;
            if (!foreignKey) continue;
            const foreignTable = foreignKey && foreignKey.table;
            if (foreignTableArrTmp1.includes(foreignTable)) continue;
            foreignTableArrTmp1.push(foreignTable);
            const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
            const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
              return item.substring(0, 1).toUpperCase() + item.substring(1);
            }).join("");
          #>
          findAll<#=Foreign_Table_Up#> {
            <#=foreignKey.column#>
            <#=foreignKey.lbl#>
          }<#
          }
          #><#
          let hasDict = false;
          for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.ignoreCodegen) continue;
            if (column.onlyCodegenDeno) continue;
            if (column.notImportExportList) continue;
            if (column.isAtt) continue;
            const column_name = column.COLUMN_NAME;
            if (
              [
                "create_usr_id", "create_usr_id_lbl", "create_time", "update_usr_id", "update_usr_id_lbl", "update_time",
                "is_default", "is_deleted", "is_enabled", "is_locked", "is_sys",
                "tenant_id", "tenant_id_lbl",
              ].includes(column_name)
              || column.readonly
              || column.noAdd
            ) continue;
            if (column_name === "id") {
              continue;
            }
            const isPassword = column.isPassword;
            if (isPassword) continue;
            if (column.dict) {
              hasDict = true;
              break;
            }
          }
          if (hasDict) {
          #>
          getDict(codes: [<#
            for (let i = 0; i < columns.length; i++) {
              const column = columns[i];
              if (column.ignoreCodegen) continue;
              if (column.onlyCodegenDeno) continue;
              if (column.notImportExportList) continue;
              if (column.isAtt) continue;
              const column_name = column.COLUMN_NAME;
              if (
                [
                  "create_usr_id", "create_usr_id_lbl", "create_time", "update_usr_id", "update_usr_id_lbl", "update_time",
                  "is_default", "is_deleted", "is_enabled", "is_locked", "is_sys",
                  "tenant_id", "tenant_id_lbl",
                ].includes(column_name)
                || column.readonly
                || column.noAdd
              ) continue;
              const column_type = column.COLUMN_TYPE;
              const data_type = column.DATA_TYPE;
              const column_comment = column.COLUMN_COMMENT;
              const foreignKey = column.foreignKey;
              if (column_name === "id") {
                continue;
              }
              const isPassword = column.isPassword;
              if (isPassword) continue;
            #><#
              if (column.dict) {
            #>
            "<#=column.dict#>",<#
              }
            #><#
            }
            #>
          ]) {
            code
            lbl
          }<#
          }
          #><#
          let hasDictbiz = false;
          for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.ignoreCodegen) continue;
            if (column.onlyCodegenDeno) continue;
            if (column.notImportExportList) continue;
            if (column.isAtt) continue;
            const column_name = column.COLUMN_NAME;
            if (
              [
                "create_usr_id", "create_usr_id_lbl", "create_time", "update_usr_id", "update_usr_id_lbl", "update_time",
                "is_default", "is_deleted", "is_enabled", "is_locked", "is_sys",
                "tenant_id", "tenant_id_lbl",
              ].includes(column_name)
              || column.readonly
              || column.noAdd
            ) continue;
            if (column_name === "id") {
              continue;
            }
            const isPassword = column.isPassword;
            if (isPassword) continue;
            if (column.dictbiz) {
              hasDictbiz = true;
              break;
            }
          }
          if (hasDictbiz) {
          #>
          getDictbiz(codes: [<#
            for (let i = 0; i < columns.length; i++) {
              const column = columns[i];
              if (column.ignoreCodegen) continue;
              if (column.onlyCodegenDeno) continue;
              if (column.notImportExportList) continue;
              if (column.isAtt) continue;
              const column_name = column.COLUMN_NAME;
              if (
                [
                  "create_usr_id", "create_usr_id_lbl", "create_time", "update_usr_id", "update_usr_id_lbl", "update_time",
                  "is_default", "is_deleted", "is_enabled", "is_locked", "is_sys",
                  "tenant_id", "tenant_id_lbl",
                ].includes(column_name)
                || column.readonly
                || column.noAdd
              ) continue;
              const column_type = column.COLUMN_TYPE;
              const data_type = column.DATA_TYPE;
              const column_comment = column.COLUMN_COMMENT;
              const foreignKey = column.foreignKey;
              if (column_name === "id") {
                continue;
              }
              const isPassword = column.isPassword;
              if (isPassword) continue;
            #><#
              if (column.dictbiz) {
            #>
            "<#=column.dictbiz#>",<#
              }
            #><#
            }
            #>
          ]) {
            code
            lbl
          }<#
          }
          #>
        }
      `,
      variables: {
      },
    });
    try {
      const sheetName = await nsAsync("<#=table_comment#>");
      const buffer = await workerFn(
        `${ location.origin }/import_template/<#=mod_slash_table#>.xlsx`,
        {
          sheetName,
          data,
        },
      );
      saveAsExcel(buffer, `${ sheetName }${ await nsAsync("导入") }`);
    } catch (err) {
      ElMessage.error(await nsAsync("下载失败"));
      throw err;
    }
  }
  return {
    workerFn: workerFn2,
    workerStatus,
    workerTerminate,
  };
}

/**
 * 导出Excel
 */
export function useExportExcel(routePath: string) {
  const {
    nsAsync,
  } = useI18n(routePath);
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  
  const loading = ref(false);
  
  async function workerFn2(
    columns: ExcelColumnType[],
    search?: <#=searchName#>,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    workerStatus.value = "PENDING";
    
    loading.value = true;
    
    try {
      const data = await query({
        query: `
          query($search: <#=searchName#>, $sort: [SortInput!]) {
            findAll<#=Table_Up2#>(search: $search, page: null, sort: $sort) {
              ${ <#=table_Up#>QueryField }
            }<#
            const foreignTableArrTmp2 = [ table ];
            for (let i = 0; i < columns.length; i++) {
              const column = columns[i];
              if (column.ignoreCodegen) continue;
              if (column.onlyCodegenDeno) continue;
              if (column.notImportExportList) continue;
              const column_name = column.COLUMN_NAME;
              if (
                [
                  "id",
                  "is_deleted", "is_sys",
                  "tenant_id", "tenant_id_lbl",
                ].includes(column_name)
              ) continue;
              let column_type = column.COLUMN_TYPE;
              let data_type = column.DATA_TYPE;
              const column_comment = column.COLUMN_COMMENT;
              const isPassword = column.isPassword;
              if (isPassword) continue;
              const foreignKey = column.foreignKey;
              if (!foreignKey) continue;
              if (!foreignKey.lbl) continue;
              const foreignTable = foreignKey && foreignKey.table;
              if (foreignTableArrTmp2.includes(foreignTable)) continue;
              foreignTableArrTmp2.push(foreignTable);
              const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
              const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
                return item.substring(0, 1).toUpperCase() + item.substring(1);
              }).join("");
            #>
            findAll<#=Foreign_Table_Up#> {
              <#=foreignKey.lbl#>
            }<#
            }
            #><#
            hasDict = false;
            for (let i = 0; i < columns.length; i++) {
              const column = columns[i];
              if (column.ignoreCodegen) continue;
              if (column.onlyCodegenDeno) continue;
              if (column.notImportExportList) continue;
              const column_name = column.COLUMN_NAME;
              if (
                [
                  "id",
                  "is_deleted", "is_sys",
                  "tenant_id", "tenant_id_lbl",
                ].includes(column_name)
              ) continue;
              const isPassword = column.isPassword;
              if (isPassword) continue;
              if (column.dict) {
                hasDict = true;
                break;
              }
            }
            if (hasDict) {
            #>
            getDict(codes: [<#
              for (let i = 0; i < columns.length; i++) {
                const column = columns[i];
                if (column.ignoreCodegen) continue;
                if (column.onlyCodegenDeno) continue;
                if (column.notImportExportList) continue;
                const column_name = column.COLUMN_NAME;
                if (
                  [
                    "is_deleted", "is_sys",
                    "tenant_id", "tenant_id_lbl",
                  ].includes(column_name)
                ) continue;
                const column_type = column.COLUMN_TYPE;
                const data_type = column.DATA_TYPE;
                const column_comment = column.COLUMN_COMMENT;
                const foreignKey = column.foreignKey;
                if (column_name === "id") {
                  continue;
                }
                const isPassword = column.isPassword;
                if (isPassword) continue;
              #><#
                if (column.dict) {
              #>
              "<#=column.dict#>",<#
                }
              #><#
              }
              #>
            ]) {
              code
              lbl
            }<#
            }
            #><#
            hasDictbiz = false;
            for (let i = 0; i < columns.length; i++) {
              const column = columns[i];
              if (column.ignoreCodegen) continue;
              if (column.onlyCodegenDeno) continue;
              if (column.notImportExportList) continue;
              const column_name = column.COLUMN_NAME;
              if (
                [
                  "id",
                  "is_deleted", "is_sys",
                  "tenant_id", "tenant_id_lbl",
                ].includes(column_name)
              ) continue;
              const isPassword = column.isPassword;
              if (isPassword) continue;
              if (column.dictbiz) {
                hasDictbiz = true;
                break;
              }
            }
            if (hasDictbiz) {
            #>
            getDictbiz(codes: [<#
              for (let i = 0; i < columns.length; i++) {
                const column = columns[i];
                if (column.ignoreCodegen) continue;
                if (column.onlyCodegenDeno) continue;
                if (column.notImportExportList) continue;
                const column_name = column.COLUMN_NAME;
                if (
                  [
                    "id",
                    "is_deleted", "is_sys",
                    "tenant_id", "tenant_id_lbl",
                  ].includes(column_name)
                ) continue;
                let column_type = column.COLUMN_TYPE;
                let data_type = column.DATA_TYPE;
                const column_comment = column.COLUMN_COMMENT;
                const foreignKey = column.foreignKey;
                const isPassword = column.isPassword;
                if (isPassword) continue;
              #><#
                if (column.dictbiz) {
              #>
              "<#=column.dictbiz#>",<#
                }
              #><#
              }
              #>
            ]) {
              code
              lbl
            }<#
            }
            #>
          }
        `,
        variables: {
          search,
          sort,
        },
      }, opt);
      for (const model of data.findAll<#=Table_Up2#>) {
        await setLblById(model, true);
      }
      try {
        const sheetName = await nsAsync("<#=table_comment#>");
        const buffer = await workerFn(
          `${ location.origin }/excel_template/<#=mod_slash_table#>.xlsx`,
          {
            sheetName,
            columns,
            data,
          },
        );
        saveAsExcel(buffer, sheetName);
      } catch (err) {
        ElMessage.error(await nsAsync("导出失败"));
        throw err;
      }
    } finally {
      loading.value = false;
    }
  }
  return {
    loading,
    workerFn: workerFn2,
    workerStatus,
    workerTerminate,
  };
}<#
if (opts.noAdd !== true && opts.noEdit !== true && opts.noImport !== true) {
#>

/**
 * 批量导入<#=table_comment#>
 */
export async function importModels(
  inputs: <#=inputName#>[],
  percentage: Ref<number>,
  isCancel: Ref<boolean>,
  opt?: GqlOpt,
) {
  const {
    nsAsync,
  } = useI18n();
  
  opt = opt || { };
  opt.showErrMsg = false;
  opt.notLoading = true;
  
  let succNum = 0;
  let failNum = 0;
  const failErrMsgs: string[] = [ ];
  percentage.value = 0;
  
  const len = inputs.length;
  const inputsArr = splitCreateArr(inputs);
  
  let i = 0;
  for (const inputs of inputsArr) {
    if (isCancel.value) {
      break;
    }
    
    i += inputs.length;
    
    try {
      await creates(
        inputs,
        UniqueType.Update,
        opt,
      );
      succNum += inputs.length;
    } catch (err) {
      failNum += inputs.length;
      failErrMsgs.push(await nsAsync(`批量导入第 {0} 至 {1} 行时失败: {1}`, i + 1 - inputs.length, i + 1, err));
    }
    
    percentage.value = Math.floor((i + 1) / len * 100);
  }
  
  return showUploadMsg(succNum, failNum, failErrMsgs);
}<#
}
#><#
if (hasOrderBy) {
#>

/**
 * 查找 <#=table_comment#> order_by 字段的最大值
 */
export async function findLastOrderBy(
  opt?: GqlOpt,
) {
  const data: {
    findLastOrderBy<#=Table_Up2#>: Query["findLastOrderBy<#=Table_Up2#>"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderBy<#=Table_Up2#>
      }
    `,
  }, opt);
  const res = data.findLastOrderBy<#=Table_Up2#>;
  return res;
}<#
}
#>

export function getPagePath() {
  return "/<#=mod#>/<#=table#>";
}

/** 新增时的默认值 */
export async function getDefaultInput() {<#
  let hasUsrStore = false;
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    if (
      [
        "id",
        "is_default",
        "is_deleted",
        "tenant_id",
      ].includes(column_name)
    ) {
      continue;
    }
    if (!column.COLUMN_DEFAULT && column.COLUMN_DEFAULT !== 0) continue;
    let defaultValue = column.COLUMN_DEFAULT.toString();
    if (
      [
        "CURRENT_USR_ID",
        "CURRENT_ORG_ID",
        "CURRENT_TENANT_ID",
        "CURRENT_USERNAME",
      ].includes(defaultValue)
    ) {
      hasUsrStore = true;
      break;
    }
  }
  #><#
  if (hasUsrStore) {
  #>
  const usrStore = useUsrStore(cfg.pinia);<#
  }
  #>
  const defaultInput: <#=inputName#> = {<#
    if (hasVersion) {
    #>
    version: 1,<#
    }
    #><#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      if (column_name === "is_deleted") continue;
      const data_type = column.DATA_TYPE;
      const column_type = column.COLUMN_TYPE;
      const column_comment = column.COLUMN_COMMENT || "";
      if (
        [
          "is_default",
          "is_deleted",
          "tenant_id",
        ].includes(column_name)
      ) {
        continue;
      }
      if (!column.COLUMN_DEFAULT && column.COLUMN_DEFAULT !== 0) continue;
      let defaultValue = column.COLUMN_DEFAULT.toString();
      if (defaultValue == null || defaultValue === "null" || defaultValue === "NULL" || defaultValue === "") {
        continue;
      }
      if (column_type.startsWith("int") || column_type.startsWith("tinyint")) {
        defaultValue = defaultValue;
      } else if (data_type === "datetime" || data_type === "date") {
        let valueFormat = "YYYY-MM-DD HH:mm:ss";
        if (data_type === "date") {
          valueFormat = "YYYY-MM-DD";
        }
        if (defaultValue === "CURRENT_DATE") {
          if (data_type === "datetime") {
            defaultValue = "dayjs().format('YYYY-MM-DD 00:00:00')";
          } else {
            defaultValue = "dayjs().format('YYYY-MM-DD')";
          }
        } else if (defaultValue === "CURRENT_DATETIME") {
          defaultValue = `dayjs().format('${ valueFormat }')`;
        } else if (defaultValue.startsWith("start_of_")) {
          defaultValue = `dayjs().startOf("${ defaultValue.substring("start_of_".length) }").format("${ valueFormat }")`;
        } else if (defaultValue.startsWith("end_of_")) {
          defaultValue = `dayjs().endOf('${ defaultValue.substring("end_of_".length) }').format("${ valueFormat }")`;
        } else {
          defaultValue = `"${ defaultValue }"`;
        }
      } else if (data_type === "decimal") {
        defaultValue = `new Decimal(${ defaultValue })`;
      } else if (column.dict || column.dictbiz) {
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
          let defaultValue_Up = column.COLUMN_DEFAULT.toString();
          defaultValue_Up = defaultValue_Up.split("_").map(function(item) {
            return item.substring(0, 1).toUpperCase() + item.substring(1).toLowerCase();
          }).join("");
          defaultValue = Table_Up + Column_Up + "." + defaultValue_Up;
        } else {
          if (![ "int", "decimal", "tinyint" ].includes(column.DATA_TYPE)) {
            defaultValue = `"${ defaultValue }"`;
          } else {
            defaultValue = defaultValue;
          }
        }
      } else if (data_type === "varchar" || data_type === "text") {
        if (defaultValue === "CURRENT_USR_ID") {
          defaultValue = "usrStore.usr_id";
        } else if (defaultValue === "CURRENT_ORG_ID") {
          defaultValue = "usrStore.loginInfo?.org_id";
        } else if (defaultValue === "CURRENT_TENANT_ID") {
          defaultValue = "usrStore.tenant_id";
        } else if (defaultValue === "CURRENT_USERNAME") {
          defaultValue = "usrStore.username";
        } else {
          defaultValue = `"${ defaultValue }"`;
        }
      } else {
        defaultValue = `"${ defaultValue }"`;
      }
    #>
    <#=column_name#>: <#=defaultValue#>,<#
    }
    #>
  };
  return defaultInput;
}
