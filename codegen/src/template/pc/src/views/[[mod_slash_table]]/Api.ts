<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by' && !column.onlyCodegenDeno);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
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
  }).join("");
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
    findAll<#=Table_Up#>: Query["findAll<#=Table_Up#>"];
  } = await query({
    query: /* GraphQL */ `
      query($search: <#=Table_Up#>Search, $page: PageInput, $sort: [SortInput!]) {
        findAll<#=Table_Up#>(search: $search, page: $page, sort: $sort) {<#
          for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.ignoreCodegen) continue;
            if (column.onlyCodegenDeno) continue;
            const column_name = column.COLUMN_NAME;
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
        }
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const result = data.findAll<#=Table_Up#>;
  for (let i = 0; i < result.length; i++) {
    const item = result[i];<#
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
    findCount<#=Table_Up#>: Query["findCount<#=Table_Up#>"];
  } = await query({
    query: /* GraphQL */ `
      query($search: <#=Table_Up#>Search) {
        findCount<#=Table_Up#>(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const result = data.findCount<#=Table_Up#>;
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
    findSummary<#=Table_Up#>: Query["findSummary<#=Table_Up#>"];
  } = await query({
    query: /* GraphQL */ `
      query($search: <#=Table_Up#>Search) {
        findSummary<#=Table_Up#>(search: $search) {<#
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
  const result = data.findSummary<#=Table_Up#>;
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
    create<#=Table_Up#>: Mutation["create<#=Table_Up#>"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: <#=Table_Up#>Input!) {
        create<#=Table_Up#>(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  const result = data.create<#=Table_Up#>;
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
    updateById<#=Table_Up#>: Mutation["updateById<#=Table_Up#>"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: ID!, $model: <#=Table_Up#>Input!) {
        updateById<#=Table_Up#>(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const result = data.updateById<#=Table_Up#>;
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
    findById<#=Table_Up#>: Query["findById<#=Table_Up#>"];
  } = await query({
    query: /* GraphQL */ `
      query($id: ID!) {
        findById<#=Table_Up#>(id: $id) {<#
          for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.ignoreCodegen) continue;
            if (column.onlyCodegenDeno) continue;
            const column_name = column.COLUMN_NAME;
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
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result = data.findById<#=Table_Up#>;<#
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
    deleteByIds<#=Table_Up#>: Mutation["deleteByIds<#=Table_Up#>"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        deleteByIds<#=Table_Up#>(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.deleteByIds<#=Table_Up#>;
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
    lockByIds<#=Table_Up#>: Mutation["lockByIds<#=Table_Up#>"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!, $is_locked: Int!) {
        lockByIds<#=Table_Up#>(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const result = data.lockByIds<#=Table_Up#>;
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
    revertByIds<#=Table_Up#>: Mutation["revertByIds<#=Table_Up#>"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        revertByIds<#=Table_Up#>(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.revertByIds<#=Table_Up#>;
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
    forceDeleteByIds<#=Table_Up#>: Mutation["forceDeleteByIds<#=Table_Up#>"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($ids: [ID!]!) {
        forceDeleteByIds<#=Table_Up#>(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result = data.forceDeleteByIds<#=Table_Up#>;
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
  }).join("");
  const defaultSort = foreignKey && foreignKey.defaultSort;
#>

export async function findAll<#=Foreign_Table_Up#>(
  search?: <#=Foreign_Table_Up#>Search,
  page?: PageInput,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data: {
    findAll<#=Foreign_Table_Up#>: Query["findAll<#=Foreign_Table_Up#>"];
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
  const result = data.findAll<#=Foreign_Table_Up#>;
  return result;
}

export async function get<#=Foreign_Table_Up#>List() {
  const data = await findAll<#=Foreign_Table_Up#>(
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
 */
export function useExportExcel() {
  const route = useRoute();
  const {
    nAsync,
    nsAsync,
  } = useI18n(route.path);
  const {
    workerFn,
    workerStatus,
    workerTerminate,
  } = useRenderExcel();
  async function workerFn2(
    search?: <#=Table_Up#>Search,
    sort?: Sort[],
    opt?: GqlOpt,
  ) {
    const queryStr = getQueryUrl({
      query: /* GraphQL */ `
        query($search: <#=Table_Up#>Search, $sort: [SortInput!]) {
          findAll<#=Table_Up#>(search: $search, sort: $sort) {<#
            for (let i = 0; i < columns.length; i++) {
              const column = columns[i];
              if (column.ignoreCodegen) continue;
              if (column.onlyCodegenDeno) continue;
              const column_name = column.COLUMN_NAME;
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
          getFieldComments<#=Table_Up#> {<#
            for (let i = 0; i < columns.length; i++) {
              const column = columns[i];
              if (column.ignoreCodegen) continue;
              if (column.onlyCodegenDeno) continue;
              const column_name = column.COLUMN_NAME;
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
            <#=column_name#>
            <#=column_name#>_lbl<#
              } else {
            #>
            <#=column_name#><#
              }
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
    try {
      const buffer = await workerFn(
        `${ location.origin }/excel_template/<#=mod_slash_table#>.xlsx`,
        `${ location.origin }${ queryStr }`,
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
 * @param {<#=Table_Up#>Input[]} models
 * @export importModels
 */
export async function importModels(
  models: <#=Table_Up#>Input[],
  opt?: GqlOpt,
) {
  const data: {
    importModels<#=Table_Up#>: Mutation["importModels<#=Table_Up#>"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($models: [<#=Table_Up#>Input!]!) {
        importModels<#=Table_Up#>(models: $models)
      }
    `,
    variables: {
      models,
    },
  }, opt);
  const res = data.importModels<#=Table_Up#>;
  return res;
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
    findLastOrderBy<#=Table_Up#>: Query["findLastOrderBy<#=Table_Up#>"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderBy<#=Table_Up#>
      }
    `,
  }, opt);
  const result = data.findLastOrderBy<#=Table_Up#>;
  return result;
}<#
}
#>
