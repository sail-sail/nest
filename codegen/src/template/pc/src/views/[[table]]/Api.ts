<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
#>import { <#=tableUp#>Model, <#=tableUp#>Search } from "./Model";
import { gql, GqlOpt, gqlQuery, baseURL } from "@/utils/graphql";
import useUsrStore from "@/store/usr";
import { PageModel } from "@/utils/page.model";
<#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  const column_name = column.COLUMN_NAME;
  const foreignKey = column.foreignKey;
  const data_type = column.DATA_TYPE;
  if (!foreignKey) continue;
  const foreignTable = foreignKey.table;
  const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  if (foreignTableUp === tableUp) continue;
#>
import { <#=foreignTableUp#>Model, <#=foreignTableUp#>Search } from "../<#=foreignTable#>/Model";<#
}
#>
/**
 * 根据搜索条件查找数据
 * @export findAll
 * @param {<#=tableUp#>Search} search
 * @param {PageModel} page
 * @param {GqlOpt} [opt]
 * @return {Promise<<#=tableUp#>Model[]>}
 */
export async function findAll(
  search?: <#=tableUp#>Search,
  page?: PageModel,
  opt?: GqlOpt,
): Promise<<#=tableUp#>Model[]> {
  const rvData = await gqlQuery({
    query: gql`
      query($search: <#=tableUp#>Search, $page: PageInput) {
        findAll<#=tableUp#>(search: $search, page: $page) {<#
          for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.ignoreCodegen) continue;
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
    },
  }, opt);
  const data = rvData?.findAll<#=tableUp#> || [ ];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    // if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    let data_type = column.DATA_TYPE;
    if (data_type === "json") {
  #>
    if (item.<#=column_name#>) {
      item.<#=column_name#> = JSON.stringify(item.<#=column_name#>);
    }<#
    }
  }
  #>
  }
  return data;
}

/**
 * 根据搜索条件和分页查找数据和总数
 * @export findAllAndCount
 * @param {<#=tableUp#>Search} search
 * @param {PageModel} page
 * @param {GqlOpt} [opt]
 * @return {Promise<{ data: <#=tableUp#>Model[], count: number }>} 
 */
export async function findAllAndCount(
  search?: <#=tableUp#>Search,
  page?: PageModel,
  opt?: GqlOpt,
): Promise<{ data: <#=tableUp#>Model[], count: number }> {
  const rvData = await gqlQuery({
    query: gql`
      query($search: <#=tableUp#>Search, $page: PageInput) {
        findAll<#=tableUp#>(search: $search, page: $page) {<#
          for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.ignoreCodegen) continue;
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
    },
  }, opt);
  const data = { data: rvData?.findAll<#=tableUp#> || [ ], count: rvData?.findCount<#=tableUp#> || 0 };
  for (let i = 0; i < data.data.length; i++) {
    const item = data.data[i];<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    // if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    let data_type = column.DATA_TYPE;
    if (data_type === "json") {
  #>
    if (item.<#=column_name#>) {
      item.<#=column_name#> = JSON.stringify(item.<#=column_name#>);
    }<#
    }
  }
  #>
  }
  return data;
}

/**
 * 创建一条数据
 * @export create
 * @param {<#=tableUp#>Model} model
 * @param {GqlOpt} [opt]
 * @return {Promise<string>} id
 */
export async function create(
  model: <#=tableUp#>Model,
  opt?: GqlOpt,
): Promise<string> {
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
  return data?.create<#=tableUp#>;
}

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {string} id
 * @param {GqlOpt} [opt]
 * @return {Promise<boolean>}
 */
export async function updateById(
  id: string,
  model: <#=tableUp#>Model,
  opt?: GqlOpt,
): Promise<boolean> {
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
  return data?.updateById<#=tableUp#>;
}

/**
 * 通过ID查找一条数据
 * @export findById
 * @param {string} id
 * @param {GqlOpt} [opt]
 * @return {Promise<<#=tableUp#>Model>}
 */
export async function findById(
  id: string,
  opt?: GqlOpt,
): Promise<<#=tableUp#>Model> {
  const rvData = await gqlQuery({
    query: gql`
      query($id: ID!) {
        findById<#=tableUp#>(id: $id) {<#
          for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
            if (column.ignoreCodegen) continue;
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
  const data = rvData?.findById<#=tableUp#>;<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    // if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    let data_type = column.DATA_TYPE;
    if (data_type === "json") {
  #>
  if (data?.<#=column_name#>) {
    data.<#=column_name#> = JSON.stringify(data.<#=column_name#>);
  }<#
    }
  }
  #>
  return data;
}

/**
 * 根据ID列表删除数据
 * @export deleteByIds
 * @param {string[]} ids
 * @param {GqlOpt} [opt]
 * @return {Promise<number>}
 */
export async function deleteByIds(
  ids: string[],
  opt?: GqlOpt,
): Promise<number> {
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
  return data?.deleteByIds<#=tableUp#>;
}

/**
 * 根据ID列表从回收站还原数据
 * @export revertByIds
 * @param {string[]} ids
 * @param {GqlOpt} [opt]
 * @return {Promise<number>}
 */
export async function revertByIds(
  ids: string[],
  opt?: GqlOpt,
): Promise<number> {
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
  return data?.revertByIds<#=tableUp#>;
}<#
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  const column_name = column.COLUMN_NAME;
  const foreignKey = column.foreignKey;
  const data_type = column.DATA_TYPE;
  if (!foreignKey) continue;
  const foreignTable = foreignKey.table;
  const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
#>

export async function findAllAndCount<#=foreignTableUp#>(
  search?: <#=foreignTableUp#>Search,
  page?: PageModel,
  opt?: GqlOpt,
): Promise<{ data: <#=foreignTableUp#>Model[], count: number }> {
  const data = await gqlQuery({
    query: gql`
      query($search: <#=foreignTableUp#>Search, $page: PageInput) {
        findAll<#=foreignTableUp#>(search: $search, page: $page) {
          <#=foreignKey.column#>
          <#=foreignKey.lbl#>
        }
        findCount<#=foreignTableUp#>(search: $search)
      }
    `,
    variables: {
      search,
      page,
    },
  }, opt);
  return { data: data?.findAll<#=foreignTableUp#> || [ ], count: data?.findCount<#=foreignTableUp#> || 0 };
}

export async function findAll<#=foreignTableUp#>(
  search?: <#=foreignTableUp#>Search,
  page?: PageModel,
  opt?: GqlOpt,
): Promise<<#=foreignTableUp#>Model[]> {
  const data = await gqlQuery({
    query: gql`
      query($search: <#=foreignTableUp#>Search, $page: PageInput) {
        findAll<#=foreignTableUp#>(search: $search, page: $page) {
          <#=foreignKey.column#>
          <#=foreignKey.lbl#>
        }
      }
    `,
    variables: {
      search,
      page,
    },
  }, opt);
  return data?.findAll<#=foreignTableUp#> || [ ];
}<#
}
#>

/**
 * 导出Excel
 * @export exportExcel
 * @param {<#=tableUp#>Search} search
 */
export async function exportExcel(
  search: <#=tableUp#>Search,
) {
  let url = `${ baseURL }/api/exportExcel<#=tableUp#>`;
  const usrStore = useUsrStore();
  const access_token: string = usrStore.access_token;
  const params = new URLSearchParams();
  if (access_token) {
    params.set("access_token", access_token);
  }
  if (search) {
    const keys = Object.keys(search);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = search[key];
      if (value == null) continue;
      params.set(key, value);
    }
  }
  url += "?" + params.toString();
  window.location.href = url;
}<#
if (hasOrderBy) {
#>

/**
 * 查找order_by字段的最大值
 * @export findLastOrderBy
 * @param {GqlOpt} [opt]
 * @return {Promise<number>}
 */
export async function findLastOrderBy(
  opt?: GqlOpt,
): Promise<number> {
  const data = await gqlQuery({
    query: gql`
      query {
        findLastOrderBy<#=tableUp#>
      }
    `,
  }, opt);
  return data?.findLastOrderBy<#=tableUp#> || 1;
}<#
}
#>
