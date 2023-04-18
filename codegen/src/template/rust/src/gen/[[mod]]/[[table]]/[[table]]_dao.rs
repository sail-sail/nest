<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasPassword = columns.some((column) => column.isPassword);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasDeptId = columns.some((column) => column.COLUMN_NAME === "dept_id");
const hasVersion = columns.some((column) => column.COLUMN_NAME === "version");
const Table_Up = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("_");
const tableUP = tableUp.split("_").map(function(item) {
  return item.substring(0, 1).toUpperCase() + item.substring(1);
}).join("");
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
#>use anyhow::Result;

use crate::common::util::string::*;

use crate::common::context::{
  Ctx,
  QueryArgs,
  Options,
  get_order_by_query,
  get_page_query,
};

use crate::common::gql::model::{PageInput, SortInput};<#
  if (hasDict) {
#>

use crate::src::base::dict_detail::dict_detail_dao::get_dict;<#
  }
#><#
  if (hasDictbiz) {
#>

use crate::src::base::dictbiz_detail::dictbiz_detail_dao::get_dictbiz;<#
  }
#>

use super::<#=table#>_model::*;

fn get_where_query<'a>(
  ctx: &mut impl Ctx<'a>,
  args: &mut QueryArgs,
  search: Option<UsrSearch>,
) -> String {
  let mut where_query = String::with_capacity(80 * 15 * 2);
  {
    let is_deleted = search.as_ref()
      .and_then(|item| item.is_deleted)
      .unwrap_or(0);
    where_query += &format!(" t.is_deleted = {}", args.push(is_deleted.into()));
  }
  {
    let id = match &search {
      Some(item) => &item.id,
      None => &None,
    };
    let id = match trim_opt(id) {
      None => None,
      Some(item) => match item.as_str() {
        "-" => None,
        _ => item.into(),
      },
    };
    if let Some(id) = id {
      where_query += &format!(" and t.id = {}", args.push(id.into()));
    }
  }
  {
    let ids: Vec<String> = match &search {
      Some(item) => item.ids.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !ids.is_empty() {
      let arg = {
        let mut item = "".to_owned();
        for tmp in ids {
          item += &format!("{},", args.push(tmp.into()));
        }
        item = item.trim_end_matches(",").to_owned();
        item
      };
      where_query += &format!(" and id in ({})", arg);
    }
  }<#
    if (hasTenant_id) {
  #>
  {
    let tenant_id = {
      let tenant_id = match &search {
        Some(item) => &item.tenant_id,
        None => &None,
      };
      let tenant_id = match trim_opt(tenant_id) {
        None => ctx.get_auth_tenant_id(),
        Some(item) => match item.as_str() {
          "-" => None,
          _ => item.into(),
        },
      };
      tenant_id
    };
    if let Some(tenant_id) = tenant_id {
      where_query += &format!(" and t.tenant_id = {}", args.push(tenant_id.into()));
    }
  }<#
    }
  #><#
    if (hasDeptId) {
  #>
  {
    let dept_id = {
      let dept_id = match &search {
        Some(item) => &item.dept_id,
        None => &None,
      };
      let dept_id = match trim_opt(dept_id) {
        None => ctx.get_auth_dept_id(),
        Some(item) => match item.as_str() {
          "-" => None,
          _ => item.into(),
        },
      };
      dept_id
    };
    if let Some(dept_id) = dept_id {
      where_query += &format!(" and base_dept.id = {}", args.push(dept_id.into()));
    }
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
    if (foreignKey && foreignKey.type !== "many2many") {
  #>
  {
    let <#=column_name#>: Vec<String> = match &search {
      Some(item) => item.<#=column_name#>.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !<#=column_name#>.is_empty() {
      let arg = {
        let mut item = "".to_owned();
        for tmp in <#=column_name#> {
          item += &format!("{},", args.push(tmp.into()));
        }
        item = item.trim_end_matches(",").to_owned();
        item
      };
      where_query += &format!(" and <#=column_name#>_lbl.id in ({})", arg);
    }
  }<#
    } else if (foreignKey && foreignKey.type === "many2many") {
  #>
  {
    let <#=column_name#>: Vec<String> = match &search {
      Some(item) => item.<#=column_name#>.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !<#=column_name#>.is_empty() {
      let arg = {
        let mut item = "".to_owned();
        for tmp in <#=column_name#> {
          item += &format!("{},", args.push(tmp.into()));
        }
        item = item.trim_end_matches(",").to_owned();
        item
      };
      where_query += &format!(" and <#=foreignKey.table#>.id in ({})", arg);
    }
  }<#
    } else if ((selectList && selectList.length > 0) || column.dict || column.dictbiz) {
  #>
  {
    let <#=column_name#>: Vec<String> = match &search {
      Some(item) => item.<#=column_name#>.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !<#=column_name#>.is_empty() {
      let arg = {
        let mut item = "".to_owned();
        for tmp in <#=column_name#> {
          item += &format!("{},", args.push(tmp.into()));
        }
        item = item.trim_end_matches(",").to_owned();
        item
      };
      where_query += &format!(" and t.<#=column_name#> in ({})", arg);
    }
  }<#
    } else if (data_type === "int" && column_name.startsWith("is_")) {
  #>
  {
    let <#=column_name#> = match &search {
      Some(item) => item.<#=column_name#>.clone(),
      None => None,
    };
    if let Some(<#=column_name#>) = <#=column_name#> {
      where_query += &format!(" and t.<#=column_name#> = {}", args.push(<#=column_name#>.into()));
    }
  }<#
    } else if (data_type === "int" || data_type === "decimal" || data_type === "double" || data_type === "datetime" || data_type === "date") {
  #>
  {
    let <#=column_name#>: &Vec<Option<i64>> = match &search {
      Some(item) => item.<#=column_name#>.unwrap(),
      None => &vec![],
    };
    let <#=column_name#>_gt: Option<i64> = match &<#=column_name#>.len() {
      0 => None,
      _ => <#=column_name#>[0],
    };
    let <#=column_name#>_lt: Option<i64> = match &<#=column_name#>.len() {
      0 => None,
      1 => None,
      _ => <#=column_name#>[1],
    };
    if let Some(<#=column_name#>_gt) = <#=column_name#>_gt {
      where_query += &format!(" and t.<#=column_name#> >= {}", args.push(<#=column_name#>_gt.into()));
    }
    if let Some(<#=column_name#>_lt) = <#=column_name#>_lt {
      where_query += &format!(" and t.<#=column_name#> <= {}", args.push(<#=column_name#>_lt.into()));
    }
  }<#
    } else if (data_type === "tinyint") {
  #>
  {
    let <#=column_name#> = match &search {
      Some(item) => item.<#=column_name#>.clone(),
      None => None,
    };
    if let Some(<#=column_name#>) = <#=column_name#> {
      where_query += &format!(" and t.<#=column_name#> = {}", args.push(<#=column_name#>.into()));
    }
  }<#
    } else {
  #>
  {
    let <#=column_name#> = match &search {
      Some(item) => item.<#=column_name#>.clone(),
      None => None,
    };
    if let Some(<#=column_name#>) = <#=column_name#> {
      where_query += &format!(" and t.<#=column_name#> = {}", args.push(<#=column_name#>.into()));
    }
    let <#=column_name#>_like = match &search {
      Some(item) => item.<#=column_name#>.clone(),
      None => None,
    };
    if let Some(<#=column_name#>_like) = <#=column_name#>_like {
      where_query += &format!(" and t.<#=column_name#> like {}", args.push((sql_like(&<#=column_name#>_like) + "%").into()));
    }
  }<#
    }
  #><#
  }
  #>
  where_query
}

fn get_from_query() -> &'static str {
  let from_query = r#"<#=mod#>_<#=table#> t<#
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
    left join <#=many2many.mod#>_<#=many2many.table#>
      on <#=many2many.mod#>_<#=many2many.table#>.<#=many2many.column1#> = t.id
      and <#=many2many.mod#>_<#=many2many.table#>.is_deleted = 0
    left join <#=foreignKey.mod#>_<#=foreignTable#>
      on <#=many2many.mod#>_<#=many2many.table#>.<#=many2many.column2#> = <#=foreignKey.mod#>_<#=foreignTable#>.<#=foreignKey.column#>
      and <#=foreignKey.mod#>_<#=foreignTable#>.is_deleted = 0
    left join (
      select
        json_arrayagg(<#=foreignKey.mod#>_<#=foreignTable#>.id) <#=column_name#>,<#
          if (foreignKey.lbl) {
        #>
        json_arrayagg(<#=foreignKey.mod#>_<#=foreignTable#>.<#=foreignKey.lbl#>) <#=column_name#>_lbl,<#
          }
        #>
        <#=mod#>_<#=table#>.id <#=many2many.column1#>
      from <#=foreignKey.mod#>_<#=many2many.table#>
      inner join <#=foreignKey.mod#>_<#=foreignKey.table#>
        on <#=foreignKey.mod#>_<#=foreignKey.table#>.<#=foreignKey.column#> = <#=many2many.mod#>_<#=many2many.table#>.<#=many2many.column2#>
        and <#=foreignKey.mod#>_<#=foreignKey.table#>.is_deleted = 0
      inner join <#=mod#>_<#=table#>
        on <#=mod#>_<#=table#>.id = <#=many2many.mod#>_<#=many2many.table#>.<#=many2many.column1#>
        and <#=mod#>_<#=table#>.is_deleted = 0
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
    #>"#;
  from_query
}

/// 根据搜索条件和分页查找数据
pub async fn find_all<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<<#=tableUP#>Search>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<<#=tableUP#>Model>> {
  let table = "base_<#=table#>";
  let _method = "find_all";
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query();
  let where_query = get_where_query(ctx, &mut args, search);
  let order_by_query = get_order_by_query(sort);
  let page_query = get_page_query(page);
  
  let sql = format!(r#"
    select
      t.*<#
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
      ,max(<#=column_name#>_lbl) <#=column_name#>_lbl<#
      } else if (foreignKey && !foreignKey.multiple && foreignKey.lbl) {
      #>
      ,<#=column_name#>_lbl.<#=foreignKey.lbl#> <#=column_name#>_lbl<#
        }
      #><#
      }
      #>
    from
      {from_query}
    where
      {where_query}{order_by_query}{page_query}
    group by t.id
  "#);
  
  let args = args.into();
  
  let options = Options::from(options);<#
  if (cache) {
  #>
  
  let options = options.set_cache_key(table, &sql, &args);<#
  }
  #>
  
  let options = options.into();
  
  let mut res: Vec<UsrModel> = ctx.query(
    sql,
    args,
    options,
  ).await?;<#
    if (hasDict) {
  #>
  
  let dict_vec = get_dict(ctx, &vec![<#
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
    if (!column.dict) continue;
  #>
    "<#=column.dict#>",<#
  }
  #>
  ]).await?;
  <#
  let dictNum = 0;
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
    if (!column.dict) continue;
  #>
  let <#=column_name#>_dict = &dict_vec[<#=String(dictNum)#>];<#
    dictNum++;
  }
  #><#
    }
  #><#
    if (hasDictbiz) {
  #>
  let dictbiz_vec = get_dictbiz(ctx, &vec![<#
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
    if (!column.dictbiz) continue;
  #>
    "<#=column.dictbiz#>",<#
  }
  #>
  ]).await?;
  <#
  let dictBizNum = 0;
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
    if (!column.dictbiz) continue;
  #>
  let <#=column_name#>_dictbiz = &dictbiz_vec[<#=dictBizNum#>];<#
  dictBizNum++;
  }
  #><#
    }
  #>
  
  for model in &mut res {<#
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
    if (isPassword) {
    #>
    
    // <#=column_comment#>
    model.<#=column_name#> = "".to_owned();<#
    } else if ((column.dict || column.dictbiz) && ![ "int", "decimal", "tinyint" ].includes(data_type)) {
    #>
    
    // <#=column_comment#>
    model.<#=column_name#>_lbl = {
      <#=column_name#>_dict.iter()
        .find(|item| item.val == model.<#=column_name#>.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.<#=column_name#>.to_string())
    };<#
    } else if ((column.dict || column.dictbiz) && [ "int", "decimal", "tinyint" ].includes(data_type)) {
    #>
    
    // <#=column_comment#>
    model.<#=column_name#>_lbl = {
      <#=column_name#>_dict.iter()
        .find(|item| item.val == model.<#=column_name#>.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.<#=column_name#>.to_string())
    };<#
    }
    #><#
    }
    #>
    
  }
  
  Ok(res)
}

/// 获取字段对应的国家化后的名称
pub async fn get_field_comments() -> Result<<#=tableUP#>FieldComment> {
  let field_comments = <#=tableUP#>FieldComment {<#
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
      const isPassword = column.isPassword;
      if (isPassword) continue;
      const foreignKey = column.foreignKey;
    #><#
      if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz) {
    #>
    <#=column_name#>: "<#=column_comment#>".to_owned(),
    <#=column_name#>_lbl: "<#=column_comment#>".to_owned(),<#
      } else {
    #>
    <#=column_name#>: "<#=column_comment#>".to_owned(),<#
      }
    #><#
    }
    #>
  };
  Ok(field_comments)
}

/// 获得表的唯一字段名列表
pub fn get_unique_keys() -> Vec<&'static str> {
  let unique_keys = vec![<#
    for (let i = 0; i < (opts.unique || []).length; i++) {
      const uniqueKey = opts.unique[i];
    #>
    "<#=uniqueKey#>",<#
    }
    #>
  ];
  unique_keys
}
