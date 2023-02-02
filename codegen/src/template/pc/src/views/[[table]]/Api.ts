<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by' && !column.onlyCodegenDeno);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("_");
#><#
const hasSummary = columns.some((column) => column.showSummary);
#><#
const importForeignTables = [ ];
importForeignTables.push(Table_Up);
#>import {
  type Query,
  type Mutation,
  type PageInput,
  type <#=Table_Up#>Model,
  type <#=Table_Up#>Search,
  type <#=Table_Up#>Input,
} from "#/types";

import {<#
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
  if (foreignTableUp === tableUp) continue;
  const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("_");
  if (importForeignTables.includes(Foreign_Table_Up)) {
    continue;
  }
  importForeignTables.push(Foreign_Table_Up);
#>
  type <#=Foreign_Table_Up#>Search,<#
}
#>
} from "#/types";

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {<#=Table_Up#>Search} search?
 * @param {PageInput} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: <#=Table_Up#>Search,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAll<#=tableUp#>: Query["findAll<#=tableUp#>"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($search: <#=Table_Up#>Search, $page: PageInput, $sort: [SortInput]) {
        findAll<#=tableUp#>(search: $search, page: $page, sort: $sort) {<#
          for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.ignoreCodegen) continue;
            if (column.onlyCodegenDeno) continue;
            const column_name = column.COLUMN_NAME;
            let column_type = column.DATA_TYPE;
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
            if (!foreignKey && selectList.length === 0 && !column.dict && !column.dictbiz) {
          #>
          <#=column_name#><#
            } else {
          #>
          <#=column_name#>
          _<#=column_name#><#
            }
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
  const result = data.findAll<#=tableUp#>;
  for (let i = 0; i < result.length; i++) {
    const item = result[i];<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    const data_type = column.DATA_TYPE;
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
  return result;
}

/**
 * 根据搜索条件查找数据总数
 * @export findCount
 * @param {<#=Table_Up#>Search} search?
 * @param {GqlOpt} opt?
 */
export async function findCount(
  search?: <#=Table_Up#>Search,
  opt?: GqlOpt,
) {
  const data: {
    findCount<#=tableUp#>: Query["findCount<#=tableUp#>"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($search: <#=Table_Up#>Search) {
        findCount<#=tableUp#>(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const result = data.findCount<#=tableUp#>;
  return result;
}<#
if (hasSummary) {
#>

/**
 * 根据搜索条件查找合计
 * @param {<#=Table_Up#>Search} search
 * @param {GqlOpt} opt?
 */
export async function findSummary(
  search?: <#=Table_Up#>Search,
  opt?: GqlOpt,
) {
  const data: {
    findSummary<#=tableUp#>: Query["findSummary<#=tableUp#>"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($search: <#=Table_Up#>Search) {
        findSummary<#=tableUp#>(search: $search) {<#
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
  const result = data.findSummary<#=tableUp#>;
  return result;
}<#
}
#><#
if (opts.noAdd !== true) {
#>

/**
 * 创建一条数据
 * @export create
 * @param {<#=Table_Up#>Input} model
 * @param {GqlOpt} opt?
 */
export async function create(
  model: <#=Table_Up#>Input,
  opt?: GqlOpt,
) {
  const data: {
    create<#=tableUp#>: Mutation["create<#=tableUp#>"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($model: <#=Table_Up#>Input!) {
        create<#=tableUp#>(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  const result = data.create<#=tableUp#>;
  return result;
}<#
}
#><#
if (opts.noEdit !== true) {
#>

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {string} id
 * @param {<#=Table_Up#>Input} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: string,
  model: <#=Table_Up#>Input,
  opt?: GqlOpt,
) {
  const data: {
    updateById<#=tableUp#>: Mutation["updateById<#=tableUp#>"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($id: ID!, $model: <#=Table_Up#>Input!) {
        updateById<#=tableUp#>(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const result = data.updateById<#=tableUp#>;
  return result;
}<#
}
#>

/**
 * 通过ID查找一条数据
 * @export findById
 * @param {string} id
 * @param {GqlOpt} opt?
 */
export async function findById(
  id: string,
  opt?: GqlOpt,
) {
  const data: {
    findById<#=tableUp#>: Query["findById<#=tableUp#>"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($id: ID!) {
        findById<#=tableUp#>(id: $id) {<#
          for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.ignoreCodegen) continue;
            if (column.onlyCodegenDeno) continue;
            const column_name = column.COLUMN_NAME;
            let column_type = column.DATA_TYPE;
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
            if (!foreignKey && selectList.length === 0 && !column.dict && !column.dictbiz) {
          #>
          <#=column_name#><#
            } else {
          #>
          <#=column_name#>
          _<#=column_name#><#
            }
          }
          #>
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result = data.findById<#=tableUp#>;<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.onlyCodegenDeno) continue;
    const column_name = column.COLUMN_NAME;
    let data_type = column.DATA_TYPE;
    if (data_type === "json") {
  #>
  if (result?.<#=column_name#>) {
    result.<#=column_name#> = JSON.stringify(result.<#=column_name#>);
  }<#
    }
  }
  #>
  return result;
}<#
if (opts.noDelete !== true) {
#>

/**
 * 根据 ids 删除数据
 * @export deleteByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: string[],
  opt?: GqlOpt,
) {
  const data: {
    deleteByIds<#=tableUp#>: Mutation["deleteByIds<#=tableUp#>"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        deleteByIds<#=tableUp#>(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.deleteByIds<#=tableUp#>;
  return result;
}<#
}
#><#
if (hasLocked && opts.noEdit !== true) {
#>

/**
 * 根据 ids 删除数据
 * @export lockByIds
 * @param {string[]} ids
 * @param {0 | 1} lockByIds
 * @param {GqlOpt} opt?
 */
export async function lockByIds(
  ids: string[],
  is_locked: 0 | 1,
  opt?: GqlOpt,
) {
  const data: {
    lockByIds<#=tableUp#>: Mutation["lockByIds<#=tableUp#>"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!, $is_locked: Int!) {
        lockByIds<#=tableUp#>(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const result = data.lockByIds<#=tableUp#>;
  return result;
}<#
}
#><#
if (opts.noDelete !== true && opts.noRevert !== true) {
#>

/**
 * 根据 ids 从回收站还原数据
 * @export revertByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: string[],
  opt?: GqlOpt,
) {
  const data: {
    revertByIds<#=tableUp#>: Mutation["revertByIds<#=tableUp#>"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        revertByIds<#=tableUp#>(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.revertByIds<#=tableUp#>;
  return result;
}

/**
 * 根据 ids 彻底删除数据
 * @export forceDeleteByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 */
export async function forceDeleteByIds(
  ids: string[],
  opt?: GqlOpt,
) {
  const data: {
    forceDeleteByIds<#=tableUp#>: Mutation["forceDeleteByIds<#=tableUp#>"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        forceDeleteByIds<#=tableUp#>(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.forceDeleteByIds<#=tableUp#>;
  return result;
}<#
}
#><#
const foreignTableArr = [];
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
  if (foreignTableArr.includes(foreignTable)) continue;
  foreignTableArr.push(foreignTable);
  const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("_");
  const defaultSort = foreignKey && foreignKey.defaultSort;
#>

export async function findAll<#=foreignTableUp#>(
  search?: <#=Foreign_Table_Up#>Search,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAll<#=foreignTableUp#>: Query["findAll<#=foreignTableUp#>"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($search: <#=Foreign_Table_Up#>Search, $page: PageInput, $sort: [SortInput]) {
        findAll<#=foreignTableUp#>(search: $search, page: $page, sort: $sort) {
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
  const result = data.findAll<#=foreignTableUp#>;
  return result;
}

export async function get<#=foreignTableUp#>List() {
  const data = await findAll<#=foreignTableUp#>(
    undefined,
    {
    },
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
#>

/**
 * 导出Excel
 * @export exportExcel
 * @param {<#=Table_Up#>Search} search?
 * @param {Sort[]} sort?
 */
export async function exportExcel(
  search?: <#=Table_Up#>Search,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    exportExcel<#=tableUp#>: Query["exportExcel<#=tableUp#>"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query($search: <#=Table_Up#>Search, $sort: [SortInput]) {
        exportExcel<#=tableUp#>(search: $search, sort: $sort)
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const result = data.exportExcel<#=tableUp#>;
  return result;
}<#
if (opts.noAdd !== true && opts.noEdit !== true && opts.noImport !== true) {
#>

/**
 * 导入文件
 * @param {File} file
 * @export importFile
 */
export async function importFile(
  file: File,
  opt?: GqlOpt,
) {
  if (!file) return;
  const id = await uploadFile(file, undefined, { type: "tmpfile" });
  if (!id) return;
  const data: {
    importFile<#=tableUp#>: Mutation["importFile<#=tableUp#>"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      mutation($id: ID!) {
        importFile<#=tableUp#>(id: $id)
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result = data.importFile<#=tableUp#>;
  return result;
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
    findLastOrderBy<#=tableUp#>: Query["findLastOrderBy<#=tableUp#>"];
  } = await gqlQuery({
    query: /* GraphQL */ `
      query {
        findLastOrderBy<#=tableUp#>
      }
    `,
  }, opt);
  const result = data.findLastOrderBy<#=tableUp#>;
  return result;
}<#
}
#>
