<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by' && !column.onlyCodegenDeno);
const Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("_");
#><#
const hasSummary = columns.some((column) => column.showSummary);
#>import {
  Query,
  Mutation,
  <#=Table_Up#>Model,
  <#=Table_Up#>Search,
  <#=Table_Up#>Input,
} from "#/types";
import dayjs from "dayjs";
import { uploadFile } from "@/utils/axios";
import { gql, GqlOpt, gqlQuery, baseURL } from "@/utils/graphql";
import { Page, Sort } from "@/utils/page.model";
<#
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
#>
import { <#=Foreign_Table_Up#>Model, <#=Foreign_Table_Up#>Search } from "#/types";<#
}
#>

/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {<#=Table_Up#>Search} search?
 * @param {Page} page
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAll(
  search?: <#=Table_Up#>Search,
  page?: Page,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: gql`
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
            if (!foreignKey && selectList.length === 0) {
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
  const result: Query["findAll<#=tableUp#>"] = data?.findAll<#=tableUp#> || [ ];
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
      } else if (data_type === "date") {
        formatter = `item.${ column_name } = item.${ column_name } && new Date(item.${ column_name }).toLocaleDateString() || "";`;
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
 * 根据搜索条件和分页查找数据和总数
 * @export findAllAndCount
 * @param {<#=Table_Up#>Search} search?
 * @param {Page} page?
 * @param {Sort[]} sort?
 * @param {GqlOpt} opt?
 */
export async function findAllAndCount(
  search?: <#=Table_Up#>Search,
  page?: Page,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: gql`
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
            if (!foreignKey && selectList.length === 0) {
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
        findCount<#=tableUp#>(search: $search)
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const result: {
    data: Query["findAll<#=tableUp#>"];
    count: Query["findCount<#=tableUp#>"];
  } = {
    data: data?.findAll<#=tableUp#> || [ ],
    count: data?.findCount<#=tableUp#> || 0,
  };
  for (let i = 0; i < result.data.length; i++) {
    const item = result.data[i];<#
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
      } else if (data_type === "date") {
        formatter = `item.${ column_name } = item.${ column_name } && dayjs(item.${ column_name }).format("YYYY-MM-DD") || "";`;
      }
    }
    if (formatter) {
  #>
    <#=formatter#><#
    }
  }
  #>
  }
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
  const data = await gqlQuery({
    query: gql`
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
  const result: Query["findSummary<#=tableUp#>"] = data?.findSummary<#=tableUp#> || { };
  return result;
}<#
}
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
  const data = await gqlQuery({
    query: gql`
      mutation($model: <#=tableUp#>Input!) {
        create<#=tableUp#>(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  const result: Mutation["create<#=tableUp#>"] = data?.create<#=tableUp#>;
  return result;
}

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
  const data = await gqlQuery({
    query: gql`
      mutation($id: ID!, $model: <#=tableUp#>Input!) {
        updateById<#=tableUp#>(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const result: Mutation["updateById<#=tableUp#>"] = data?.updateById<#=tableUp#>;
  return result;
}

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
  const data = await gqlQuery({
    query: gql`
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
            if (!foreignKey && selectList.length === 0) {
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
  const result: Query["findById<#=tableUp#>"] = data?.findById<#=tableUp#>;<#
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
}

/**
 * 根据ID列表删除数据
 * @export deleteByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 */
export async function deleteByIds(
  ids: string[],
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: gql`
      mutation($ids: [ID]!) {
        deleteByIds<#=tableUp#>(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result: Mutation["deleteByIds<#=tableUp#>"] = data?.deleteByIds<#=tableUp#>;
  return result;
}

/**
 * 根据ID列表从回收站还原数据
 * @export revertByIds
 * @param {string[]} ids
 * @param {GqlOpt} opt?
 */
export async function revertByIds(
  ids: string[],
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: gql`
      mutation($ids: [ID]!) {
        revertByIds<#=tableUp#>(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const result: Mutation["revertByIds<#=tableUp#>"] = data?.revertByIds<#=tableUp#>;
  return result;
}<#
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
#>

export async function findAllAndCount<#=foreignTableUp#>(
  search?: <#=Foreign_Table_Up#>Search,
  page?: Page,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: gql`
      query($search: <#=Foreign_Table_Up#>Search, $page: PageInput, $sort: [SortInput]) {
        findAll<#=foreignTableUp#>(search: $search, page: $page, sort: $sort) {
          <#=foreignKey.column#>
          <#=foreignKey.lbl#>
        }
        findCount<#=foreignTableUp#>(search: $search)
      }
    `,
    variables: {
      search,
      page,
      sort,
    },
  }, opt);
  const result: {
    data: Query["findAll<#=foreignTableUp#>"];
    count: Query["findCount<#=foreignTableUp#>"];
  } = {
    data: data?.findAll<#=foreignTableUp#> || [ ],
    count: data?.findCount<#=foreignTableUp#> || 0,
  };
  return result;
}

export async function findAll<#=foreignTableUp#>(
  search?: <#=Foreign_Table_Up#>Search,
  page?: Page,
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const data = await gqlQuery({
    query: gql`
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
  const result: Query["findAll<#=foreignTableUp#>"] = data?.findAll<#=foreignTableUp#> || [ ];
  return result;
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
  const data = await gqlQuery({
    query: gql`
      query($search: <#=Table_Up#>Search, $sort: [SortInput]) {
        exportExcel<#=tableUp#>(search: $search, sort: $sort)
      }
    `,
    variables: {
      search,
      sort,
    },
  }, opt);
  const result: Query["exportExcel<#=tableUp#>"] = data?.exportExcel<#=tableUp#> || "";
  return result;
}

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
  const data = await gqlQuery({
    query: gql`
      mutation($id: ID!) {
        importFile<#=tableUp#>(id: $id)
      }
    `,
    variables: {
      id,
    },
  }, opt);
  const result: Mutation["importFile<#=tableUp#>"] = data?.importFile<#=tableUp#>;
  return result;
}<#
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
  const data = await gqlQuery({
    query: gql`
      query {
        findLastOrderBy<#=tableUp#>
      }
    `,
  }, opt);
  const result: Query["findLastOrderBy<#=tableUp#>"] = data?.findLastOrderBy<#=tableUp#> || 0;
  return result;
}<#
}
#>
