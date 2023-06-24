<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by' && !column.onlyCodegenDeno);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
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
#><#
const hasSummary = columns.some((column) => column.showSummary);
#><#
const importForeignTables = [ ];
importForeignTables.push(Table_Up);
#>import {
  type Query,
  type Mutation,
  type PageInput,
  type <#=searchName#>,<#
  if (opts.noAdd !== true || opts.noEdit !== true) {
  #>
  type <#=inputName#>,<#
  }
  #><#
  if (list_tree) {
  #>
  type <#=modelName#>,<#
  }
  #>
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
  if (foreignKey.selectType !== "tree") {
    continue;
  }
#>

import {
  findTree as find<#=Foreign_Table_Up#>Tree,
} from "@/views/<#=foreignKey.mod#>/<#=foreignTable#>/Api";<#
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
    findAll<#=Table_Up#>: Query["findAll<#=Table_Up#>"];
  } = await query({
    query: /* GraphQL */ `
      query($search: <#=searchName#>, $page: PageInput, $sort: [SortInput!]) {
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
  const res = data.findAll<#=Table_Up#>;
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
}<#
if (list_tree) {
#>

/**
 * 查找树形数据
 * @param sort 
 * @param opt 
 * @returns 
 */
export async function findTree(
  sort?: Sort[],
  opt?: GqlOpt,
) {
  const res = await findAll(
    undefined,
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
    findCount<#=Table_Up#>: Query["findCount<#=Table_Up#>"];
  } = await query({
    query: /* GraphQL */ `
      query($search: <#=searchName#>) {
        findCount<#=Table_Up#>(search: $search)
      }
    `,
    variables: {
      search,
    },
  }, opt);
  const res = data.findCount<#=Table_Up#>;
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
    findSummary<#=Table_Up#>: Query["findSummary<#=Table_Up#>"];
  } = await query({
    query: /* GraphQL */ `
      query($search: <#=searchName#>) {
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
  const res = data.findSummary<#=Table_Up#>;
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
 * @param {GqlOpt} opt?
 */
export async function create(
  model: <#=inputName#>,
  opt?: GqlOpt,
) {
  const data: {
    create<#=Table_Up#>: Mutation["create<#=Table_Up#>"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($model: <#=inputName#>!) {
        create<#=Table_Up#>(model: $model)
      }
    `,
    variables: {
      model,
    },
  }, opt);
  const res = data.create<#=Table_Up#>;
  return res;
}<#
}
#><#
if (opts.noEdit !== true) {
#>

/**
 * 根据id修改一条数据
 * @export updateById
 * @param {string} id
 * @param {<#=inputName#>} model
 * @param {GqlOpt} opt?
 */
export async function updateById(
  id: string,
  model: <#=inputName#>,
  opt?: GqlOpt,
) {
  const data: {
    updateById<#=Table_Up#>: Mutation["updateById<#=Table_Up#>"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: String!, $model: <#=inputName#>!) {
        updateById<#=Table_Up#>(id: $id, model: $model)
      }
    `,
    variables: {
      id,
      model,
    },
  }, opt);
  const res = data.updateById<#=Table_Up#>;
  return res;
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
      query($id: String!) {
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
  const res = data.findById<#=Table_Up#>;<#
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
      mutation($ids: [String!]!) {
        deleteByIds<#=Table_Up#>(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.deleteByIds<#=Table_Up#>;
  return res;
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
      mutation($ids: [String!]!, $is_locked: Int!) {
        lockByIds<#=Table_Up#>(ids: $ids, is_locked: $is_locked)
      }
    `,
    variables: {
      ids,
      is_locked,
    },
  }, opt);
  const res = data.lockByIds<#=Table_Up#>;
  return res;
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
      mutation($ids: [String!]!) {
        revertByIds<#=Table_Up#>(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.revertByIds<#=Table_Up#>;
  return res;
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
      mutation($ids: [String!]!) {
        forceDeleteByIds<#=Table_Up#>(ids: $ids)
      }
    `,
    variables: {
      ids,
    },
  }, opt);
  const res = data.forceDeleteByIds<#=Table_Up#>;
  return res;
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
  const res = data.findAll<#=Foreign_Table_Up#>;
  return res;
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
  if (foreignKey.selectType !== "tree") continue;
  const foreignTable = foreignKey.table;
  const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  if (foreignTableTreeArr.includes(foreignTable)) continue;
  foreignTableTreeArr.push(foreignTable);
  const Foreign_Table_Up = foreignTableUp && foreignTableUp.split("_").map(function(item) {
    return item.substring(0, 1).toUpperCase() + item.substring(1);
  }).join("");
  const defaultSort = foreignKey && foreignKey.defaultSort;
#>

export async function get<#=Foreign_Table_Up#>Tree() {
  const data = await find<#=Foreign_Table_Up#>Tree(
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
    const queryStr = getQueryUrl({
      query: /* GraphQL */ `
        query($search: <#=searchName#>, $sort: [SortInput!]) {
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
    
    const item = models[i];
    
    opt = opt || { };
    opt.showErrMsg = false;
    opt.notLoading = true;
    
    try {
      await create(item, opt);
      succNum++;
    } catch (err) {
      failNum++;
      failErrMsgs.push(await nsAsync(`第 {0} 行导入失败: {1}`, i + 1, err));
    }
    
    percentage.value = Math.floor((i + 1) / models.length * 100);
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
    findLastOrderBy<#=Table_Up#>: Query["findLastOrderBy<#=Table_Up#>"];
  } = await query({
    query: /* GraphQL */ `
      query {
        findLastOrderBy<#=Table_Up#>
      }
    `,
  }, opt);
  const res = data.findLastOrderBy<#=Table_Up#>;
  return res;
}<#
}
#>
