<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by' && !column.onlyCodegenDeno);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasEnabled = columns.some((column) => column.COLUMN_NAME === "is_enabled");
const hasDefault = columns.some((column) => column.COLUMN_NAME === "is_default");
const hasSummary = columns.some((column) => column.showSummary);
const hasUniques = columns.some((column) => column.uniques && column.uniques.length > 0);
const hasInlineForeignTabs = opts?.inlineForeignTabs && opts?.inlineForeignTabs.length > 0;
const inlineForeignTabs = opts?.inlineForeignTabs || [ ];
let Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
let Table_Up2 = Table_Up;
if (/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 1))
  && !/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 2))
) {
  Table_Up2 = Table_Up.substring(0, Table_Up.length - 1) + Table_Up.substring(Table_Up.length - 1).toUpperCase();
}
let modelName = "";
let fieldCommentName = "";
let inputName = "";
let searchName = "";
let modelNameTree = "";
if (/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 1))
  && !/^[A-Za-z]+$/.test(Table_Up.charAt(Table_Up.length - 2))
) {
  modelName = Table_Up2 + "model";
  fieldCommentName = Table_Up2 + "fieldComment";
  inputName = Table_Up2 + "input";
  searchName = Table_Up2 + "search";
  modelNameTree = Table_Up2 + "modelTree";
} else {
  modelName = Table_Up + "Model";
  fieldCommentName = Table_Up + "FieldComment";
  inputName = Table_Up + "Input";
  searchName = Table_Up + "Search";
  modelNameTree = Table_Up + "ModelTree";
}
#><#
if (opts.noAdd !== true && opts.noEdit !== true && opts.noImport !== true) {
#>import {
  UniqueType,
} from "#/types";
<#
}
#>

import type {
  <#=Table_Up#>Id,
} from "@/typings/ids";

import type {
  Query,
  Mutation,
  PageInput,
  <#=searchName#>,<#
  if (opts.noAdd !== true || opts.noEdit !== true) {
  #>
  <#=inputName#>,<#
  }
  #><#
  if (list_tree === true) {
  #>
  <#=modelName#>,<#
  }
  #>
} from "#/types";

import type {<#
const importForeignTables = [ ];
importForeignTables.push(Table_Up);
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
      "org_id", "org_id_lbl",
    ].includes(column_name)
    || column.readonly
    || (column.noAdd && column.noEdit)
  ) continue;
  const foreignKey = column.foreignKey;
  const data_type = column.DATA_TYPE;
  if (!foreignKey) continue;
  const foreignTable = foreignKey.table;
  const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  if (foreignTableUp === tableUp) continue;
  const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  if (importForeignTables.includes(Foreign_Table_Up)) {
    continue;
  }
  importForeignTables.push(Foreign_Table_Up);
#>
  <#=Foreign_Table_Up#>Search,<#
}
#>
} from "#/types";<#
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
#>

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {<#=searchName#>} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: <#=searchName#>,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAll<#=Table_Up2#>: Query["findAll<#=Table_Up2#>"];
  } = await query({
    query: /* GraphQL */ `
      query($search: <#=searchName#>, $page: PageInput, $sort: [SortInput!]) {
        findAll<#=Table_Up2#>(search: $search, page: $page, sort: $sort) {<#
          for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.ignoreCodegen) continue;
            if (column.onlyCodegenDeno) continue;
            const column_name = column.COLUMN_NAME;
            if (column_name === "is_deleted") continue;
            if (column_name === "tenant_id") continue;
            if (column_name === "org_id") continue;
            let column_type = column.COLUMN_TYPE;
            let data_type = column.DATA_TYPE;
            let column_comment = column.COLUMN_COMMENT;
            let selectList = [ ];
            let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
            if (selectStr) {
              selectList = eval(`(${ selectStr })`);
            }
            if (column_comment.includes("[")) {
              column_comment = column_comment.substring(0, column_comment.indexOf("["));
            }
            const foreignKey = column.foreignKey;
            const isPassword = column.isPassword;
            if (isPassword) continue;
          #><#
            if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz
              || data_type === "datetime" || data_type === "date"
            ) {
          #>
          <#=column_name#>
          <#=column_name#>_lbl<#
            } else {
          #>
          <#=column_name#><#
            }
          }
          #>
          is_deleted<#
          for (const inlineForeignTab of inlineForeignTabs) {
            const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
            if (!inlineForeignSchema) {
              throw `表: ${ mod }_${ table } 的 inlineForeignTabs 中的 ${ inlineForeignTab.mod }_${ inlineForeignTab.table } 不存在`;
              process.exit(1);
            }
            const columns = inlineForeignSchema.columns.filter((item) => item.COLUMN_NAME !== inlineForeignTab.column);
            const table = inlineForeignTab.table;
            const mod = inlineForeignTab.mod;
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
          <#=table#>_models {<#
            for (let i = 0; i < columns.length; i++) {
              const column = columns[i];
              if (column.ignoreCodegen) continue;
              if (column.onlyCodegenDeno) continue;
              const column_name = column.COLUMN_NAME;
              if (column_name === "is_deleted") continue;
              if (column_name === "tenant_id") continue;
              let column_type = column.COLUMN_TYPE;
              let data_type = column.DATA_TYPE;
              let column_comment = column.COLUMN_COMMENT;
              let selectList = [ ];
              let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
              if (selectStr) {
                selectList = eval(`(${ selectStr })`);
              }
              if (column_comment.includes("[")) {
                column_comment = column_comment.substring(0, column_comment.indexOf("["));
              }
              const foreignKey = column.foreignKey;
            #><#
              if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz
                || data_type === "datetime" || data_type === "date"
              ) {
            #>
            <#=column_name#>
            <#=column_name#>_lbl<#
              } else {
            #>
            <#=column_name#><#
              }
            }
            #>
          }<#
          }
          #>
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const res = data.findAll<#=Table_Up2#>;
  for (let i = 0; i < res.length; i++) {
    const item = res[i];<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    const data_type = column.DATA_TYPE;
    let column_comment = column.COLUMN_COMMENT || "";
    let formatter = column.formatter;
    if (!formatter) {
      if (data_type === "json") {
        formatter = `item.${ column_name } = item.${ column_name } && JSON.stringify(item.${ column_name }) || "";`;
      }
    }
    if (formatter) {
  #>
    <#=formatter#><#
    }
  #><#
  }
  #>
  }
  return res;
}

/**
 * 根据搜索条件查找第一条记录
 * @export findOne
 * @param {<#=searchName#>} search?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findOne(
  search?: <#=searchName#>,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findOne<#=Table_Up2#>: Query["findOne<#=Table_Up2#>"];
  } = await query({
    query: /* GraphQL */ `
      query($search: <#=searchName#>, $sort: [SortInput!]) {
        findOne<#=Table_Up2#>(search: $search, sort: $sort) {<#
          for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.ignoreCodegen) continue;
            if (column.onlyCodegenDeno) continue;
            const column_name = column.COLUMN_NAME;
            if (column_name === "is_deleted") continue;
            if (column_name === "tenant_id") continue;
            if (column_name === "org_id") continue;
            let column_type = column.COLUMN_TYPE;
            let data_type = column.DATA_TYPE;
            let column_comment = column.COLUMN_COMMENT;
            let selectList = [ ];
            let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
            if (selectStr) {
              selectList = eval(`(${ selectStr })`);
            }
            if (column_comment.includes("[")) {
              column_comment = column_comment.substring(0, column_comment.indexOf("["));
            }
            const foreignKey = column.foreignKey;
            const isPassword = column.isPassword;
            if (isPassword) continue;
          #><#
            if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz
              || data_type === "datetime" || data_type === "date"
            ) {
          #>
          <#=column_name#>
          <#=column_name#>_lbl<#
            } else {
          #>
          <#=column_name#><#
            }
          }
          #>
          is_deleted<#
          for (const inlineForeignTab of inlineForeignTabs) {
            const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
            if (!inlineForeignSchema) {
              throw `表: ${ mod }_${ table } 的 inlineForeignTabs 中的 ${ inlineForeignTab.mod }_${ inlineForeignTab.table } 不存在`;
              process.exit(1);
            }
            const columns = inlineForeignSchema.columns.filter((item) => item.COLUMN_NAME !== inlineForeignTab.column);
            const table = inlineForeignTab.table;
            const mod = inlineForeignTab.mod;
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
          <#=table#>_models {<#
            for (let i = 0; i < columns.length; i++) {
              const column = columns[i];
              if (column.ignoreCodegen) continue;
              if (column.onlyCodegenDeno) continue;
              const column_name = column.COLUMN_NAME;
              if (column_name === "is_deleted") continue;
              if (column_name === "tenant_id") continue;
              let column_type = column.COLUMN_TYPE;
              let data_type = column.DATA_TYPE;
              let column_comment = column.COLUMN_COMMENT;
              let selectList = [ ];
              let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
              if (selectStr) {
                selectList = eval(`(${ selectStr })`);
              }
              if (column_comment.includes("[")) {
                column_comment = column_comment.substring(0, column_comment.indexOf("["));
              }
              const foreignKey = column.foreignKey;
            #><#
              if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz
                || data_type === "datetime" || data_type === "date"
              ) {
            #>
            <#=column_name#>
            <#=column_name#>_lbl<#
              } else {
            #>
            <#=column_name#><#
              }
            }
            #>
          }<#
          }
          #>
        }
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const model = data.findOne<#=Table_Up2#>;
  if (model) {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.onlyCodegenDeno) continue;
      const column_name = column.COLUMN_NAME;
      const data_type = column.DATA_TYPE;
      let column_comment = column.COLUMN_COMMENT || "";
      let formatter = column.formatter;
      if (!formatter) {
        if (data_type === "json") {
          formatter = `model.${ column_name } = model.${ column_name } && JSON.stringify(model.${ column_name }) || "";`;
        }
      }
      if (formatter) {
    #>
      <#=formatter#><#
      }
    #><#
    }
    #>
  }
  return model;
}<#
if (list_tree === true) {
#>

export type <#=modelNameTree#> = <#=modelName#> & {
  children?: <#=modelNameTree#>[];
}

/**
 * 查找树形数据
 * @param sort 
 * @param opt 
 * @returns 
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
 * 根据搜索条件查找数据总数
 * @export findCount
 * @param {<#=searchName#>} search?
 * @param {GqlOpt} opt?
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
  const res = data.findCount<#=Table_Up2#>;
  return res;
}<#
if (hasSummary) {
#>

/**
 * 根据搜索条件查找合计
 * @param {<#=searchName#>} search
 * @param {GqlOpt} opt?
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
 * 创建一条数据
 * @export create
 * @param {<#=inputName#>} model
 * @param {UniqueType} unique_type?
 * @param {GqlOpt} opt?
 */
export async function create(
  model: <#=inputName#>,
  unique_type?: UniqueType,
  opt?: GqlOpt,
): Promise<<#=Table_Up#>Id> {
  const data: {
    create<#=Table_Up2#>: Mutation["create<#=Table_Up2#>"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: <#=inputName#>!, $unique_type: UniqueType) {
        create<#=Table_Up2#>(model: $model, unique_type: $unique_type)
      }
    `,
    variables: {
      model,
      unique_type,
    },
  }, opt);
  const id: <#=Table_Up#>Id = data.create<#=Table_Up2#>;
  return id;
}<#
}
#><#
if (opts.noEdit !== true) {
#>

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {<#=Table_Up#>Id} id
 * @param {<#=inputName#>} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: <#=Table_Up#>Id,
  model: <#=inputName#>,
  opt?: GqlOpt,
): Promise<<#=Table_Up#>Id> {
  const data: {
    updateById<#=Table_Up2#>: Mutation["updateById<#=Table_Up2#>"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: <#=Table_Up2#>Id!, $model: <#=inputName#>!) {
        updateById<#=Table_Up2#>(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const id2: <#=Table_Up#>Id = data.updateById<#=Table_Up2#>;
  return id2;
}<#
}
#>

/**
 * 通过ID查找一条数据
 * @export findById
 * @param {<#=Table_Up#>Id} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: <#=Table_Up#>Id,
  opt?: GqlOpt,
) {
  const data: {
    findById<#=Table_Up2#>: Query["findById<#=Table_Up2#>"];
  } = await query({
    query: /* GraphQL */ `
      query($id: <#=Table_Up#>Id!) {
        findById<#=Table_Up2#>(id: $id) {<#
          for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.ignoreCodegen) continue;
            if (column.onlyCodegenDeno) continue;
            const column_name = column.COLUMN_NAME;
            if (column_name === "is_deleted") continue;
            if (column_name === "tenant_id") continue;
            if (column_name === "org_id") continue;
            let column_type = column.COLUMN_TYPE;
            let data_type = column.DATA_TYPE;
            let column_comment = column.COLUMN_COMMENT;
            let selectList = [ ];
            let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
            if (selectStr) {
              selectList = eval(`(${ selectStr })`);
            }
            if (column_comment.includes("[")) {
              column_comment = column_comment.substring(0, column_comment.indexOf("["));
            }
            const foreignKey = column.foreignKey;
          #><#
            if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz
              || data_type === "datetime" || data_type === "date"
            ) {
          #>
          <#=column_name#>
          <#=column_name#>_lbl<#
            } else {
          #>
          <#=column_name#><#
            }
          }
          #><#
          for (const inlineForeignTab of inlineForeignTabs) {
            const inlineForeignSchema = optTables[inlineForeignTab.mod + "_" + inlineForeignTab.table];
            if (!inlineForeignSchema) {
              throw `表: ${ mod }_${ table } 的 inlineForeignTabs 中的 ${ inlineForeignTab.mod }_${ inlineForeignTab.table } 不存在`;
              process.exit(1);
            }
            const columns = inlineForeignSchema.columns.filter((item) => item.COLUMN_NAME !== inlineForeignTab.column);
            const table = inlineForeignTab.table;
            const mod = inlineForeignTab.mod;
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
          <#=table#>_models {<#
            for (let i = 0; i < columns.length; i++) {
              const column = columns[i];
              if (column.ignoreCodegen) continue;
              if (column.onlyCodegenDeno) continue;
              const column_name = column.COLUMN_NAME;
              if (column_name === "is_deleted") continue;
              if (column_name === "tenant_id") continue;
              let column_type = column.COLUMN_TYPE;
              let data_type = column.DATA_TYPE;
              let column_comment = column.COLUMN_COMMENT;
              let selectList = [ ];
              let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
              if (selectStr) {
                selectList = eval(`(${ selectStr })`);
              }
              if (column_comment.includes("[")) {
                column_comment = column_comment.substring(0, column_comment.indexOf("["));
              }
              const foreignKey = column.foreignKey;
            #><#
              if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz
                || data_type === "datetime" || data_type === "date"
              ) {
            #>
            <#=column_name#>
            <#=column_name#>_lbl<#
              } else {
            #>
            <#=column_name#><#
              }
            }
            #>
          }<#
          }
          #>
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const res = data.findById<#=Table_Up2#>;<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    let data_type = column.DATA_TYPE;
    if (data_type === "json") {
  #>
  if (res?.<#=column_name#>) {
    res.<#=column_name#> = JSON.stringify(res.<#=column_name#>);
  }<#
    }
  }
  #>
  return res;
}<#
if (opts.noDelete !== true) {
#>

/**
 * 根据 ids 删除数据
 * @export deleteByIds
 * @param {<#=Table_Up#>Id[]} ids
 * @param {GqlOpt} opt?
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
 * 根据 id 设置默认记录
 * @export defaultById
 * @param {<#=Table_Up#>Id} id
 * @param {GqlOpt} opt?
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
 * 根据 ids 启用或禁用数据
 * @export enableByIds
 * @param {<#=Table_Up#>Id[]} ids
 * @param {0 | 1} is_enabled
 * @param {GqlOpt} opt?
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
 * 根据 ids 锁定或解锁数据
 * @export lockByIds
 * @param {<#=Table_Up#>Id[]} ids
 * @param {0 | 1} is_locked
 * @param {GqlOpt} opt?
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
if (opts.noDelete !== true && opts.noRevert !== true) {
#>

/**
 * 根据 ids 从回收站还原数据
 * @export revertByIds
 * @param {<#=Table_Up#>Id[]} ids
 * @param {GqlOpt} opt?
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
}

/**
 * 根据 ids 彻底删除数据
 * @export forceDeleteByIds
 * @param {<#=Table_Up#>Id[]} ids
 * @param {GqlOpt} opt?
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
      "create_usr_id", "create_usr_id_lbl", "create_time", "update_usr_id", "update_usr_id_lbl", "update_time",
      "is_default", "is_deleted", "is_enabled", "is_locked", "is_sys",
      "tenant_id", "tenant_id_lbl",
      "org_id", "org_id_lbl",
    ].includes(column_name)
    || column.readonly
    || (column.noAdd && column.noEdit)
  ) continue;
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
  let Foreign_Table_Up2 = Foreign_Table_Up;
  if (/^[A-Za-z]+$/.test(Foreign_Table_Up.charAt(Foreign_Table_Up.length - 1))
    && !/^[A-Za-z]+$/.test(Foreign_Table_Up.charAt(Foreign_Table_Up.length - 2))
  ) {
    Foreign_Table_Up2 = Foreign_Table_Up.substring(0, Foreign_Table_Up.length - 1) + Foreign_Table_Up.substring(Foreign_Table_Up.length - 1).toUpperCase();
  }
  const defaultSort = foreignKey && foreignKey.defaultSort;
  const foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
  const foreignHasEnabled = foreignSchema.columns.some((column) => column.COLUMN_NAME === "is_enabled");
#>

export async function findAll<#=Foreign_Table_Up2#>(
  search?: <#=Foreign_Table_Up2#>Search,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAll<#=Foreign_Table_Up2#>: Query["findAll<#=Foreign_Table_Up2#>"];
  } = await query({
    query: /* GraphQL */ `
      query($search: <#=Foreign_Table_Up2#>Search, $page: PageInput, $sort: [SortInput!]) {
        findAll<#=Foreign_Table_Up2#>(search: $search, page: $page, sort: $sort) {
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
  const res = data.findAll<#=Foreign_Table_Up2#>;
  return res;
}

export async function get<#=Foreign_Table_Up2#>List() {
  const data = await findAll<#=Foreign_Table_Up2#>(<#
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
  let Foreign_Table_Up2 = Foreign_Table_Up;
  if (/^[A-Za-z]+$/.test(Foreign_Table_Up.charAt(Foreign_Table_Up.length - 1))
    && !/^[A-Za-z]+$/.test(Foreign_Table_Up.charAt(Foreign_Table_Up.length - 2))
  ) {
    Foreign_Table_Up2 = Foreign_Table_Up.substring(0, Foreign_Table_Up.length - 1) + Foreign_Table_Up.substring(Foreign_Table_Up.length - 1).toUpperCase();
  }
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

export async function get<#=Foreign_Table_Up2#>Tree() {
  const data = await find<#=Foreign_Table_Up2#>Tree(<#
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
        "org_id", "org_id_lbl",
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
    let Foreign_Table_Up2 = Foreign_Table_Up;
    if (/^[A-Za-z]+$/.test(Foreign_Table_Up.charAt(Foreign_Table_Up.length - 1))
      && !/^[A-Za-z]+$/.test(Foreign_Table_Up.charAt(Foreign_Table_Up.length - 2))
    ) {
      Foreign_Table_Up2 = Foreign_Table_Up.substring(0, Foreign_Table_Up.length - 1) + Foreign_Table_Up.substring(Foreign_Table_Up.length - 1).toUpperCase();
    }
    if (foreignTableArr.includes(foreignTable)) continue;
    foreignTableArr.push(foreignTable);
    const defaultSort = foreignKey && foreignKey.defaultSort;
    const foreignSchema = optTables[foreignKey.mod + "_" + foreignTable];
    const foreignHasEnabled = foreignSchema.columns.some((column) => column.COLUMN_NAME === "is_enabled");
#>

export async function findAll<#=Foreign_Table_Up2#>(
  search?: <#=Foreign_Table_Up2#>Search,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAll<#=Foreign_Table_Up2#>: Query["findAll<#=Foreign_Table_Up2#>"];
  } = await query({
    query: /* GraphQL */ `
      query($search: <#=Foreign_Table_Up2#>Search, $page: PageInput, $sort: [SortInput!]) {
        findAll<#=Foreign_Table_Up2#>(search: $search, page: $page, sort: $sort) {
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
  const res = data.findAll<#=Foreign_Table_Up2#>;
  return res;
}

export async function get<#=Foreign_Table_Up2#>List() {
  const data = await findAll<#=Foreign_Table_Up2#>(<#
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
    let Foreign_Table_Up2 = Foreign_Table_Up;
    if (/^[A-Za-z]+$/.test(Foreign_Table_Up.charAt(Foreign_Table_Up.length - 1))
      && !/^[A-Za-z]+$/.test(Foreign_Table_Up.charAt(Foreign_Table_Up.length - 2))
    ) {
      Foreign_Table_Up2 = Foreign_Table_Up.substring(0, Foreign_Table_Up.length - 1) + Foreign_Table_Up.substring(Foreign_Table_Up.length - 1).toUpperCase();
    }
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

export async function get<#=Foreign_Table_Up2#>Tree() {
  const data = await find<#=Foreign_Table_Up2#>Tree(<#
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
 * 下载导入模板
 */
export function useDownloadImportTemplate(routePath: string) {
  const {
    nAsync,
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
                  "org_id", "org_id_lbl",
                ].includes(column_name)
                || column.readonly
                || column.noAdd
              ) continue;
              let column_type = column.COLUMN_TYPE;
              let data_type = column.DATA_TYPE;
              let column_comment = column.COLUMN_COMMENT;
              let selectList = [ ];
              let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
              if (selectStr) {
                selectList = eval(`(${ selectStr })`);
              }
              if (column_comment.includes("[")) {
                column_comment = column_comment.substring(0, column_comment.indexOf("["));
              }
              const foreignKey = column.foreignKey;
              if (column_name === "id") {
                continue;
              }
              const isPassword = column.isPassword;
              if (isPassword) continue;
            #><#
              if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz
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
                "org_id", "org_id_lbl",
              ].includes(column_name)
              || column.readonly
              || column.noAdd
            ) continue;
            let column_type = column.COLUMN_TYPE;
            let data_type = column.DATA_TYPE;
            let column_comment = column.COLUMN_COMMENT;
            let selectList = [ ];
            let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
            if (selectStr) {
              selectList = eval(`(${ selectStr })`);
            }
            if (column_comment.includes("[")) {
              column_comment = column_comment.substring(0, column_comment.indexOf("["));
            }
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
            let Foreign_Table_Up2 = Foreign_Table_Up;
            if (/^[A-Za-z]+$/.test(Foreign_Table_Up.charAt(Foreign_Table_Up.length - 1))
              && !/^[A-Za-z]+$/.test(Foreign_Table_Up.charAt(Foreign_Table_Up.length - 2))
            ) {
              Foreign_Table_Up2 = Foreign_Table_Up.substring(0, Foreign_Table_Up.length - 1) + Foreign_Table_Up.substring(Foreign_Table_Up.length - 1).toUpperCase();
            }
          #>
          findAll<#=Foreign_Table_Up2#> {
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
                "org_id", "org_id_lbl",
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
                  "org_id", "org_id_lbl",
                ].includes(column_name)
                || column.readonly
                || column.noAdd
              ) continue;
              let column_type = column.COLUMN_TYPE;
              let data_type = column.DATA_TYPE;
              let column_comment = column.COLUMN_COMMENT;
              let selectList = [ ];
              let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
              if (selectStr) {
                selectList = eval(`(${ selectStr })`);
              }
              if (column_comment.includes("[")) {
                column_comment = column_comment.substring(0, column_comment.indexOf("["));
              }
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
                "org_id", "org_id_lbl",
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
                  "org_id", "org_id_lbl",
                ].includes(column_name)
                || column.readonly
                || column.noAdd
              ) continue;
              let column_type = column.COLUMN_TYPE;
              let data_type = column.DATA_TYPE;
              let column_comment = column.COLUMN_COMMENT;
              let selectList = [ ];
              let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
              if (selectStr) {
                selectList = eval(`(${ selectStr })`);
              }
              if (column_comment.includes("[")) {
                column_comment = column_comment.substring(0, column_comment.indexOf("["));
              }
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
    const buffer = await workerFn(
      `${ location.origin }/import_template/<#=mod_slash_table#>.xlsx`,
      {
        data,
      },
    );
    saveAsExcel(buffer, `${ await nAsync("<#=table_comment#>") }${ await nsAsync("导入") }`);
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
    nAsync,
    nsAsync,
  } = useI18n(routePath);
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2(
    search?: <#=searchName#>,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const data = await query({
      query: /* GraphQL */ `
        query($search: <#=searchName#>, $sort: [SortInput!]) {
          findAll<#=Table_Up2#>(search: $search, sort: $sort) {<#
            for (let i = 0; i < columns.length; i++) {
              const column = columns[i];
              if (column.ignoreCodegen) continue;
              if (column.onlyCodegenDeno) continue;
              const column_name = column.COLUMN_NAME;
              if (
                [
                  "is_deleted", "is_sys",
                  "tenant_id", "tenant_id_lbl",
                  "org_id", "org_id_lbl",
                ].includes(column_name)
              ) continue;
              let column_type = column.COLUMN_TYPE;
              let data_type = column.DATA_TYPE;
              let column_comment = column.COLUMN_COMMENT;
              let selectList = [ ];
              let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
              if (selectStr) {
                selectList = eval(`(${ selectStr })`);
              }
              if (column_comment.includes("[")) {
                column_comment = column_comment.substring(0, column_comment.indexOf("["));
              }
              const foreignKey = column.foreignKey;
            #><#
              if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz
                || data_type === "datetime" || data_type === "date"
              ) {
            #>
            <#=column_name#>
            <#=column_name#>_lbl<#
              } else {
            #>
            <#=column_name#><#
              }
            }
            #>
          }
          getFieldComments<#=Table_Up2#> {<#
            for (let i = 0; i < columns.length; i++) {
              const column = columns[i];
              if (column.ignoreCodegen) continue;
              if (column.onlyCodegenDeno) continue;
              const column_name = column.COLUMN_NAME;
              if (
                [
                  "is_deleted", "is_sys",
                  "tenant_id", "tenant_id_lbl",
                  "org_id", "org_id_lbl",
                ].includes(column_name)
              ) continue;
              let column_type = column.COLUMN_TYPE;
              let data_type = column.DATA_TYPE;
              let column_comment = column.COLUMN_COMMENT;
              let selectList = [ ];
              let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
              if (selectStr) {
                selectList = eval(`(${ selectStr })`);
              }
              if (column_comment.includes("[")) {
                column_comment = column_comment.substring(0, column_comment.indexOf("["));
              }
              const foreignKey = column.foreignKey;
              if (column_name === "id") {
                continue;
              }
              const isPassword = column.isPassword;
              if (isPassword) continue;
            #><#
              if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz
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
          const foreignTableArrTmp2 = [];
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
                "org_id", "org_id_lbl",
              ].includes(column_name)
            ) continue;
            let column_type = column.COLUMN_TYPE;
            let data_type = column.DATA_TYPE;
            let column_comment = column.COLUMN_COMMENT;
            let selectList = [ ];
            let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
            if (selectStr) {
              selectList = eval(`(${ selectStr })`);
            }
            if (column_comment.includes("[")) {
              column_comment = column_comment.substring(0, column_comment.indexOf("["));
            }
            if (column_name === "id") {
              continue;
            }
            const isPassword = column.isPassword;
            if (isPassword) continue;
            const foreignKey = column.foreignKey;
            if (!foreignKey) continue;
            const foreignTable = foreignKey && foreignKey.table;
            if (foreignTableArrTmp2.includes(foreignTable)) continue;
            foreignTableArrTmp2.push(foreignTable);
            const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
            const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
              return item.substring(0, 1).toUpperCase() + item.substring(1);
            }).join("");
            let Foreign_Table_Up2 = Foreign_Table_Up;
            if (/^[A-Za-z]+$/.test(Foreign_Table_Up.charAt(Foreign_Table_Up.length - 1))
              && !/^[A-Za-z]+$/.test(Foreign_Table_Up.charAt(Foreign_Table_Up.length - 2))
            ) {
              Foreign_Table_Up2 = Foreign_Table_Up.substring(0, Foreign_Table_Up.length - 1) + Foreign_Table_Up.substring(Foreign_Table_Up.length - 1).toUpperCase();
            }
          #>
          findAll<#=Foreign_Table_Up2#> {
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
                "is_deleted", "is_sys",
                "tenant_id", "tenant_id_lbl",
                "org_id", "org_id_lbl",
              ].includes(column_name)
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
              const column_name = column.COLUMN_NAME;
              if (
                [
                  "is_deleted", "is_sys",
                  "tenant_id", "tenant_id_lbl",
                  "org_id", "org_id_lbl",
                ].includes(column_name)
              ) continue;
              let column_type = column.COLUMN_TYPE;
              let data_type = column.DATA_TYPE;
              let column_comment = column.COLUMN_COMMENT;
              let selectList = [ ];
              let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
              if (selectStr) {
                selectList = eval(`(${ selectStr })`);
              }
              if (column_comment.includes("[")) {
                column_comment = column_comment.substring(0, column_comment.indexOf("["));
              }
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
                "is_deleted", "is_sys",
                "tenant_id", "tenant_id_lbl",
                "org_id", "org_id_lbl",
              ].includes(column_name)
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
              const column_name = column.COLUMN_NAME;
              if (
                [
                  "is_deleted", "is_sys",
                  "tenant_id", "tenant_id_lbl",
                  "org_id", "org_id_lbl",
                ].includes(column_name)
              ) continue;
              let column_type = column.COLUMN_TYPE;
              let data_type = column.DATA_TYPE;
              let column_comment = column.COLUMN_COMMENT;
              let selectList = [ ];
              let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
              if (selectStr) {
                selectList = eval(`(${ selectStr })`);
              }
              if (column_comment.includes("[")) {
                column_comment = column_comment.substring(0, column_comment.indexOf("["));
              }
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
        search,
        sort,
      },
    }, opt);
    try {
      const buffer = await workerFn(
        `${ location.origin }/excel_template/<#=mod_slash_table#>.xlsx`,
        {
          data,
        },
      );
      saveAsExcel(buffer, await nAsync("<#=table_comment#>"));
    } catch (err) {
      ElMessage.error(await nsAsync("导出失败"));
      throw err;
    }
  }
  return {
    workerFn: workerFn2,
    workerStatus,
    workerTerminate,
  };
}<#
if (opts.noAdd !== true && opts.noEdit !== true && opts.noImport !== true) {
#>

/**
 * 批量导入
 * @param {<#=inputName#>[]} models
 * @export importModels
 */
export async function importModels(
  models: <#=inputName#>[],
  percentage: Ref<number>,
  isCancel: Ref<boolean>,
  opt?: GqlOpt,
) {
  const {
    nsAsync,
  } = useI18n();
  
  let succNum = 0;
  let failNum = 0;
  const failErrMsgs: string[] = [ ];
  percentage.value = 0;
  
  for (let i = 0; i < models.length; i++) {
    if (isCancel.value) {
      break;
    }
    
    percentage.value = Math.floor((i + 1) / models.length * 100);
    
    const item = models[i];
    
    opt = opt || { };
    opt.showErrMsg = false;
    opt.notLoading = true;
    
    try {
      await create(
        item,
        UniqueType.Update,
        opt,
      );
      succNum++;
    } catch (err) {
      failNum++;
      failErrMsgs.push(await nsAsync(`第 {0} 行导入失败: {1}`, i + 1, err));
    }
    
  }
  
  return showUploadMsg(succNum, failNum, failErrMsgs);
}<#
}
#><#
if (hasOrderBy) {
#>

/**
 * 查找order_by字段的最大值
 * @export findLastOrderBy
 * @param {GqlOpt} opt?
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
