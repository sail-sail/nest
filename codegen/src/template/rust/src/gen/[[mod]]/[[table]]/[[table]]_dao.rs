<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasPassword = columns.some((column) => column.isPassword);
const hasLocked = columns.some((column) => column.COLUMN_NAME === "is_locked");
const hasDeptId = columns.some((column) => column.COLUMN_NAME === "dept_id");
const hasVersion = columns.some((column) => column.COLUMN_NAME === "version");
const hasMany2many = columns.some((column) => column.foreignKey?.type === "many2many");
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
use tracing::info;
<#
if (hasPassword) {
#>
use crate::common::auth::auth_dao::get_password;<#
}
#>
use crate::common::util::string::*;<#
if (hasMany2many) {
#>
use crate::common::util::dao::{many2many_update, ManyOpts};<#
}
#>

use crate::common::context::{
  Ctx,
  QueryArgs,
  Options,
  CountModel,
  UniqueType,
  SrvErr,<#
  if (hasOrderBy) {
  #>
  OrderByModel,<#
  }
  #>
  get_short_uuid,
  get_order_by_query,
  get_page_query,
};

use crate::src::base::i18n::i18n_dao::NRoute;

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

#[allow(unused_variables)]
fn get_where_query<'a>(
  ctx: &mut impl Ctx<'a>,
  args: &mut QueryArgs,
  search: Option<<#=tableUP#>Search>,
) -> String {
  let mut where_query = String::with_capacity(80 * 15 * 2);
  {
    let is_deleted = search.as_ref()
      .and_then(|item| item.is_deleted)
      .unwrap_or(0);
    where_query += " t.is_deleted = ?";
    args.push(is_deleted.into());
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
      where_query += " and t.id = ?";
      args.push(id.into());
    }
  }
  {
    let ids: Vec<String> = match &search {
      Some(item) => item.ids.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !ids.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(ids.len());
        for id in ids {
          args.push(id.into());
          items.push("?");
        }
        items.join(",")
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
      where_query += " and t.tenant_id = ?";
      args.push(tenant_id.into());
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
      where_query += " and base_dept.id = ?";
      args.push(dept_id.into());
    }
  }<#
    }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    const column_name_rust = rustKeyEscape(column.COLUMN_NAME); 
    if (column_name === 'id') continue;
    let data_type = column.DATA_TYPE;
    let column_type = column.COLUMN_TYPE?.toLowerCase() || "";
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
    let is_nullable = column.IS_NULLABLE === "YES";
    let _data_type = "String";
    if (foreignKey && foreignKey.multiple) {
      _data_type = "Vec<String>";
      is_nullable = true;
    } else if (foreignKey && !foreignKey.multiple) {
      _data_type = "String";
    } else if (data_type === 'varchar') {
      _data_type = 'String';
    } else if (data_type === 'date') {
      _data_type = "chrono::NaiveDate";
    } else if (data_type === 'datetime') {
      _data_type = "chrono::NaiveDateTime";
    } else if (data_type === 'time') {
      _data_type = "chrono::NaiveTime";
    } else if (data_type === 'int' && !column_type.endsWith("unsigned")) {
      _data_type = 'i32';
    } else if (data_type === 'int' && column_type.endsWith("unsigned")) {
      _data_type = 'u32';
    } else if (data_type === 'json') {
      _data_type = 'String';
    } else if (data_type === 'text') {
      _data_type = 'String';
    } else if (data_type === 'tinyint' && !column_type.endsWith("unsigned")) {
      _data_type = 'i8';
    } else if (data_type === 'tinyint' && column_type.endsWith("unsigned")) {
      _data_type = 'u8';
    } else if (data_type === 'decimal') {
      _data_type = "rust_decimal::Decimal";
    }
  #><#
    if (foreignKey && foreignKey.type !== "many2many") {
  #>
  {
    let <#=column_name_rust#>: Vec<String> = match &search {
      Some(item) => item.<#=column_name_rust#>.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !<#=column_name_rust#>.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(<#=column_name_rust#>.len());
        for item in <#=column_name_rust#> {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and <#=column_name#>_lbl.id in ({})", arg);
    }
  }
  {
    let <#=column_name#>_is_null: bool = match &search {
      Some(item) => item.<#=column_name#>_is_null.unwrap_or(false),
      None => false,
    };
    if <#=column_name#>_is_null {
      where_query += &format!(" and <#=column_name#>_lbl.id is null");
    }
  }<#
    } else if (foreignKey && foreignKey.type === "many2many") {
  #>
  {
    let <#=column_name_rust#>: Vec<String> = match &search {
      Some(item) => item.<#=column_name_rust#>.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !<#=column_name_rust#>.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(<#=column_name_rust#>.len());
        for item in <#=column_name_rust#> {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and <#=foreignKey.mod#>_<#=foreignKey.table#>.id in ({})", arg);
    }
  }
  {
    let <#=column_name#>_is_null: bool = match &search {
      Some(item) => item.<#=column_name#>_is_null.unwrap_or(false),
      None => false,
    };
    if <#=column_name#>_is_null {
      where_query += &format!(" and <#=column_name#>_lbl.id is null");
    }
  }<#
    } else if ((selectList && selectList.length > 0) || column.dict || column.dictbiz) {
  #>
  {
    let <#=column_name_rust#>: Vec<<#=_data_type#>> = match &search {
      Some(item) => item.<#=column_name_rust#>.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !<#=column_name_rust#>.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(<#=column_name_rust#>.len());
        for item in <#=column_name_rust#> {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and t.<#=column_name#> in ({})", arg);
    }
  }<#
    } else if (data_type === "int" && column_name.startsWith("is_")) {
  #>
  {
    let <#=column_name_rust#> = match &search {
      Some(item) => item.<#=column_name_rust#>.clone(),
      None => None,
    };
    if let Some(<#=column_name_rust#>) = <#=column_name_rust#> {
      where_query += &format!(" and t.<#=column_name#> = {}", args.push(<#=column_name_rust#>.into()));
    }
  }<#
    } else if (data_type === "int" || data_type === "decimal" || data_type === "double" || data_type === "datetime" || data_type === "date") {
  #>
  {
    let <#=column_name_rust#>: Vec<<#=_data_type#>> = match &search {
      Some(item) => item.<#=column_name_rust#>.clone().unwrap_or_default(),
      None => vec![],
    };
    let <#=column_name#>_gt: Option<<#=_data_type#>> = match &<#=column_name_rust#>.len() {
      0 => None,
      _ => <#=column_name#>[0].clone().into(),
    };
    let <#=column_name#>_lt: Option<<#=_data_type#>> = match &<#=column_name_rust#>.len() {
      0 => None,
      1 => None,
      _ => <#=column_name_rust#>[1].clone().into(),
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
    let <#=column_name_rust#> = match &search {
      Some(item) => item.<#=column_name_rust#>.clone(),
      None => None,
    };
    if let Some(<#=column_name_rust#>) = <#=column_name_rust#> {
      where_query += &format!(" and t.<#=column_name#> = {}", args.push(<#=column_name_rust#>.into()));
    }
  }<#
    } else if (data_type === "varchar" || data_type === "text") {
  #>
  {
    let <#=column_name_rust#> = match &search {
      Some(item) => item.<#=column_name_rust#>.clone(),
      None => None,
    };
    if let Some(<#=column_name_rust#>) = <#=column_name_rust#> {
      where_query += &format!(" and t.<#=column_name#> = {}", args.push(<#=column_name_rust#>.into()));
    }
    let <#=column_name#>_like = match &search {
      Some(item) => item.<#=column_name#>_like.clone(),
      None => None,
    };
    if let Some(<#=column_name#>_like) = <#=column_name#>_like {
      where_query += &format!(" and t.<#=column_name#> like {}", args.push((sql_like(&<#=column_name#>_like) + "%").into()));
    }
  }<#
    } else {
  #>
  {
    let <#=column_name_rust#> = match &search {
      Some(item) => item.<#=column_name_rust#>.clone(),
      None => None,
    };
    if let Some(<#=column_name_rust#>) = <#=column_name_rust#> {
      where_query += &format!(" and t.<#=column_name#> = {}", args.push(<#=column_name_rust#>.into()));
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
    left join <#=foreignKey.mod#>_<#=foreignTable#>
      on <#=many2many.mod#>_<#=many2many.table#>.<#=many2many.column2#> = <#=foreignKey.mod#>_<#=foreignTable#>.<#=foreignKey.column#>
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
      inner join <#=mod#>_<#=table#>
        on <#=mod#>_<#=table#>.id = <#=many2many.mod#>_<#=many2many.table#>.<#=many2many.column1#>
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
#[allow(unused_variables)]
pub async fn find_all<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<<#=tableUP#>Search>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<<#=tableUP#>Model>> {
  
  #[allow(unused_variables)]
  let table = "<#=mod#>_<#=table#>";
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
      {where_query}
    group by t.id{order_by_query}{page_query}
  "#);
  
  let args = args.into();
  
  let options = Options::from(options);<#
  if (cache) {
  #>
  
  let options = options.set_cache_key(table, &sql, &args);<#
  }
  #>
  
  let options = options.into();
  
  let mut res: Vec<<#=tableUP#>Model> = ctx.query(
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
      const column_name = rustKeyEscape(column.COLUMN_NAME);
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
    if ((column.dict || column.dictbiz) && ![ "int", "decimal", "tinyint" ].includes(data_type)) {
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

/// 根据搜索条件查询数据总数
pub async fn find_count<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<<#=tableUP#>Search>,
  options: Option<Options>,
) -> Result<i64> {
  
  #[allow(unused_variables)]
  let table = "<#=mod#>_<#=table#>";
  let _method = "find_count";
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query();
  let where_query = get_where_query(ctx, &mut args, search);
  
  let sql = format!(r#"
    select
      count(1) total
    from
      (
        select
          1
        from
          {from_query}
        where
          {where_query}
        group by t.id
      ) t
  "#);
  
  let args = args.into();
  
  let options = Options::from(options);<#
  if (cache) {
  #>
  
  let options = options.set_cache_key(table, &sql, &args);<#
  }
  #>
  
  let options = options.into();
  
  let res: Option<CountModel> = ctx.query_one(
    sql,
    args,
    options,
  ).await?;
  
  let total = res
    .map(|item| item.total)
    .unwrap_or_default()
    ;
  
  Ok(total)
}

/// 获取字段对应的国家化后的名称
pub async fn get_field_comments<'a>(
  ctx: &mut impl Ctx<'a>,
  _options: Option<Options>,
) -> Result<<#=tableUP#>FieldComment> {
  
  let n_route = NRoute {
    route_path: "/<#=mod#>/<#=table#>".to_owned().into(),
  };
  
  let field_comments = <#=tableUP#>FieldComment {<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = rustKeyEscape(column.COLUMN_NAME);
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
      if (foreignKey || selectList.length > 0 || column.dict || column.dictbiz
        || data_type === "datetime" || data_type === "date"
      ) {
    #>
    <#=column_name#>: n_route.n(ctx, "<#=column_comment#>".to_owned(), None).await?,
    <#=column_name#>_lbl: n_route.n(ctx, "<#=column_comment#>".to_owned(), None).await?,<#
      } else {
    #>
    <#=column_name#>: n_route.n(ctx, "<#=column_comment#>".to_owned(), None).await?,<#
      }
    #><#
    }
    #>
  };
  Ok(field_comments)
}

/// 获得表的唯一字段名列表
#[allow(dead_code)]
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

/// 根据条件查找第一条数据
pub async fn find_one<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<<#=tableUP#>Search>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<<#=tableUP#>Model>> {
  
  let page = PageInput {
    pg_offset: 0.into(),
    pg_size: 1.into(),
  }.into();
  
  let res = find_all(
    ctx,
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<<#=tableUP#>Model> = res.into_iter().next();
  
  Ok(model)
}

/// 根据ID查找第一条数据
pub async fn find_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<Option<<#=tableUP#>Model>> {
  
  let search = <#=tableUP#>Search {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let res = find_one(
    ctx,
    search,
    None,
    options,
  ).await?;
  
  Ok(res)
}

/// 通过唯一约束获得一行数据
#[allow(unused_variables)]
pub async fn find_by_unique<'a>(
  ctx: &mut impl Ctx<'a>,
  search: <#=tableUP#>Search,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<<#=tableUP#>Model>> {<#
  if (opts.unique && opts.unique.length > 0) {
  #>
  
  if search.id.is_none() {
    if<#
    for (let i = 0; i < (opts.unique || []).length; i++) {
      const uniqueKey = opts.unique[i];
    #>
      search.<#=uniqueKey#>.is_none()<#
      if (i !== (opts.unique || []).length - 1) {
      #> ||<#
      }
      #><#
    }
    #>
    {
      return Ok(None);
    }
  }
  
  let search = <#=tableUP#>Search {
    id: search.id,<#
    for (let i = 0; i < (opts.unique || []).length; i++) {
      const uniqueKey = opts.unique[i];
    #>
    <#=uniqueKey#>: search.<#=uniqueKey#>,<#
    }
    #>
    ..Default::default()
  }.into();
  
  let model = find_one(
    ctx,
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)<#
  } else {
  #>
  Ok(None)<#
  }
  #>
}

/// 根据唯一约束对比对象是否相等
#[allow(dead_code)]
fn equals_by_unique(
  input: &<#=tableUP#>Input,
  model: &<#=tableUP#>Model,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }<#
  if (opts.unique && opts.unique.length > 0) {
  #>
  if<#
    for (let i = 0; i < opts.unique.length; i++) {
      const uniqueKey = opts.unique[i];
    #>
    input.<#=uniqueKey#>.as_ref().is_none() || input.<#=uniqueKey#>.as_ref().unwrap() != &model.<#=uniqueKey#><#
      if (i !== opts.unique.length - 1) {
      #> ||<#
      }
      #><#
    }
    #>
  {
    return false;
  }
  true<#
  } else {
  #>
  false<#
  }
  #>
}

/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique<'a>(
  ctx: &mut impl Ctx<'a>,
  input: <#=tableUP#>Input,
  model: <#=tableUP#>Model,
  unique_type: UniqueType,
) -> Result<Option<String>> {<#
  if (opts.unique && opts.unique.length > 0) {
  #>
  let is_equals = equals_by_unique(
    &input,
    &model,
  );
  if !is_equals {
    return Ok(None);
  }
  if unique_type == UniqueType::Ignore {
    return Ok(None);
  }
  if unique_type == UniqueType::Update {
    let res = update_by_id(
      ctx,
      model.id.clone(),
      input,
      None,
    ).await?;
    return Ok(res.into());
  }
  if unique_type == UniqueType::Throw {
    let field_comments = get_field_comments(ctx, None).await?;
    let n_route = NRoute {
      route_path: "/<#=mod#>/<#=table#>".to_owned().into(),
    };
    let str = n_route.n(ctx, "已经存在".to_owned(), None).await?;
    let err_msg: String = format!(
      "<#
      for (let i = 0; i < (opts.unique || []).length; i++) {
        const uniqueKey = opts.unique[i];
      #>{}: {}<#
        if (i !== (opts.unique || []).length - 1) {
      #>, <#
        }
      #><#
      }
      #> {str}",<#
      for (let i = 0; i < (opts.unique || []).length; i++) {
        const uniqueKey = opts.unique[i];
      #>
      field_comments.<#=uniqueKey#>,
      input.<#=uniqueKey#>.unwrap_or_default(),<#
      }
      #>
    );
    return Err(SrvErr::msg(err_msg).into());
  }<#
  }
  #>
  Ok(None)
}

#[allow(unused_variables)]
pub async fn set_id_by_lbl<'a>(
  ctx: &mut impl Ctx<'a>,
  input: <#=tableUP#>Input,
) -> Result<<#=tableUP#>Input> {
  
  #[allow(unused_mut)]
  let mut input = input;<#
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
  ]).await?;<#
  let dictNum = 0;
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
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
  
  // <#=column_comment#>
  if input.<#=column_name_rust#>.is_none() {
    let <#=column_name#>_dict = &dict_vec[<#=String(dictNum)#>];
    if let Some(<#=column_name#>_lbl) = input.<#=column_name#>_lbl.clone() {
      input.<#=column_name_rust#> = <#=column_name#>_dict.into_iter()
        .find(|item| {
          item.lbl == <#=column_name#>_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        })
        .into();
    }
  }<#
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
    const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
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
    const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
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
  
  // <#=column_comment#>
  if input.<#=column_name_rust#>.is_none() {
    let <#=column_name#>_dictbiz = &dictbiz_vec[<#=dictBizNum#>];
    if let Some(<#=column_name#>_lbl) = input.<#=column_name#>_lbl.clone() {
      input.<#=column_name_rust#> = <#=column_name#>_dictbiz.into_iter()
        .find(|item| {
          item.lbl == <#=column_name#>_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        })
        .into();
    }
  }<#
  dictBizNum++;
  }
  #><#
    }
  #><#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    const column_name = column.COLUMN_NAME;
    const column_name_rust = rustKeyEscape(column_name);
    if ([ "id", "create_usr_id", "create_time", "update_usr_id", "update_time" ].includes(column_name)) continue;
    let data_type = column.DATA_TYPE;
    let column_type = column.COLUMN_TYPE;
    let column_comment = column.COLUMN_COMMENT || "";
    const foreignKey = column.foreignKey;
    const foreignTable = foreignKey && foreignKey.table;
    let foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    foreignTableUp = foreignTableUp && foreignTableUp.split("_").map(function(item) {
      return item.substring(0, 1).toUpperCase() + item.substring(1);
    }).join("");
    const many2many = column.many2many;
    const isPassword = column.isPassword;
    let daoStr = "";
    if (foreignKey && foreignTable) {
      if (foreignTable !== table) {
        daoStr = `crate::gen::${ foreignKey.mod }::${ foreignTable }::${ foreignTable }_dao::`;
      }
    }
  #><#
    if (foreignKey && foreignKey.type !== "many2many" && !foreignKey.multiple && foreignKey.lbl) {
  #>
  
  // <#=column_comment#>
  if input.<#=column_name_rust#>.is_none() {
    if is_not_empty_opt(&input.<#=column_name#>_lbl) && input.<#=column_name_rust#>.is_none() {
      input.<#=column_name#>_lbl = input.<#=column_name#>_lbl.map(|item| 
        item.trim().to_owned()
      );
      let model = <#=daoStr#>find_one(
        ctx,
        crate::gen::<#=foreignKey.mod#>::<#=foreignTable#>::<#=foreignTable#>_model::<#=foreignTableUp#>Search {
          <#=rustKeyEscape(foreignKey.lbl)#>: input.<#=column_name#>_lbl.clone(),
          ..Default::default()
        }.into(),
        None,
        None,
      ).await?;
      if let Some(model) = model {
        input.<#=column_name_rust#> = model.id.into();
      }
    }
  }<#
    } else if (foreignKey && (foreignKey.type === "many2many" || foreignKey.multiple) && foreignKey.lbl) {
  #>
  
  // <#=column_comment#>
  if input.<#=column_name_rust#>.is_none() {
    if input.<#=column_name#>_lbl.is_some() && input.<#=column_name_rust#>.is_none() {
      input.<#=column_name_rust#>_lbl = input.<#=column_name_rust#>_lbl.map(|item| 
        item.into_iter()
          .map(|item| item.trim().to_owned())
          .collect::<Vec<String>>()
      );
      let mut models = vec![];
      for lbl in input.<#=column_name_rust#>_lbl.clone().unwrap_or_default() {
        let model = <#=daoStr#>find_one(
          ctx,
          crate::gen::<#=foreignKey.mod#>::<#=foreignTable#>::<#=foreignTable#>_model::<#=foreignTableUp#>Search {
            lbl: lbl.into(),
            ..Default::default()
          }.into(),
          None,
          None,
        ).await?;
        if let Some(model) = model {
          models.push(model);
        }
      }
      if !models.is_empty() {
        input.<#=column_name_rust#> = models.into_iter()
          .map(|item| item.id)
          .collect::<Vec<String>>()
          .into();
      }
    }
  }<#
    }
  #><#
  }
  #>
  
  Ok(input)
}

/// 创建数据
pub async fn create<'a>(
  ctx: &mut impl Ctx<'a>,
  mut input: <#=tableUP#>Input,
  options: Option<Options>,
) -> Result<String> {
  
  let table = "<#=mod#>_<#=table#>";
  let _method = "create";
  
  let now = ctx.get_now();
  
  input = set_id_by_lbl(
    ctx,
    input,
  ).await?;
  
  let old_model = find_by_unique(
    ctx,
    input.clone().into(),
    None,
    None,
  ).await?;
  
  if old_model.is_some() {
    let id = check_by_unique(
      ctx,
      input.clone().into(),
      old_model.unwrap(),
      UniqueType::Update,
    ).await?;
    match id {
      Some(id) => return Ok(id),
      None => {},
    }
  }
  
  let id = get_short_uuid();
  
  if input.id.is_none() {
    input.id = Some(id.clone().into());
  }
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = "id,create_time".to_owned();
  
  let mut sql_values = "?,?".to_owned();
  
  args.push(id.clone().into());
  args.push(now.into());
  <#
  if (hasTenant_id) {
  #>
  
  if let Some(tenant_id) = ctx.get_auth_tenant_id() {
    sql_fields += ",tenant_id";
    sql_values += ",?";
    args.push(tenant_id.into());
  }<#
  }
  #><#
  if (hasDeptId) {
  #>
  
  if let Some(dept_id) = ctx.get_auth_dept_id() {
    sql_fields += ",dept_id";
    sql_values += ",?";
    args.push(dept_id.into());
  }<#
  }
  #>
  
  if let Some(auth_model) = ctx.get_auth_model() {
    let usr_id = auth_model.id;
    sql_fields += ",create_usr_id";
    sql_values += ",?";
    args.push(usr_id.into());
  }<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
    if (column_name === "id") continue;
    if (column_name === "create_usr_id") continue;
    if (column_name === "create_time") continue;
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
    if (column.isPassword) {
  #>
  // <#=column_comment#>
  if let Some(<#=column_name_rust#>) = input.<#=column_name_rust#> {
    sql_fields += ",<#=column_name#>";
    sql_values += ",?";
    args.push(get_password(<#=column_name_rust#>)?.into());
  }<#
    } else if (foreignKey && foreignKey.type === "json") {
  #><#
    } else if (foreignKey && foreignKey.type === "many2many") {
  #><#
    } else {
  #>
  // <#=column_comment#>
  if let Some(<#=column_name_rust#>) = input.<#=column_name_rust#> {
    sql_fields += ",<#=column_name#>";
    sql_values += ",?";
    args.push(<#=column_name_rust#>.into());
  }<#
    }
  #><#
  }
  #>
  
  let sql = format!(
    "insert into {} ({}) values ({})",
    table,
    sql_fields,
    sql_values,
  );
  
  let args = args.into();
  
  let options = Options::from(options);<#
  if (cache) {
  #>
  
  let options = options.set_del_cache_key1s(get_foreign_tables());<#
  }
  #>
  
  let options = options.into();
  
  ctx.execute(
    sql,
    args,
    options,
  ).await?;<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
    if (column_name === "id") continue;
    if (column_name === "create_usr_id") continue;
    if (column_name === "create_time") continue;
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
  #>
  
  // <#=column_comment#>
  if let Some(<#=column_name_rust#>) = input.<#=column_name_rust#> {
    many2many_update(
      ctx,
      id.clone(),
      <#=column_name_rust#>.clone(),
      ManyOpts {
        r#mod: "<#=many2many.mod#>",
        table: "<#=many2many.table#>",
        column1: "<#=many2many.column1#>",
        column2: "<#=many2many.column2#>",
      },
    ).await?;
  }<#
  }
  #><#
  }
  #>
  
  Ok(id)
}<#
if (hasTenant_id) {
#>

/// 根据id修改租户id
pub async fn update_tenant_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  tenant_id: String,
  options: Option<Options>,
) -> Result<u64> {
  let table = "<#=mod#>_<#=table#>";
  let _method = "update_tenant_by_id";
  
  let mut args = QueryArgs::new();
  
  let sql_fields = "tenant_id = ?,update_time = ?";
  args.push(tenant_id.into());
  args.push(ctx.get_now().into());
  
  let sql_where = "id = ?";
  args.push(id.into());
  
  let sql = format!(
    "update {} set {} where {}",
    table,
    sql_fields,
    sql_where,
  );
  
  let args = args.into();
  
  let options = Options::from(options);
  let options = options.into();
  
  let num = ctx.execute(
    sql,
    args,
    options,
  ).await?;
  
  Ok(num)
}<#
}
#><#
if (hasDeptId) {
#>

/// 根据id修改部门id
pub async fn update_dept_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  dept_id: String,
  options: Option<Options>,
) -> Result<u64> {
  let table = "<#=mod#>_<#=table#>";
  let _method = "update_dept_by_id";
  
  let mut args = QueryArgs::new();
  
  let sql_fields = "dept_id = ?,update_time = ?";
  args.push(dept_id.into());
  args.push(ctx.get_now().into());
  
  let sql_where = "id = ?";
  args.push(id.into());
  
  let sql = format!(
    "update {} set {} where {}",
    table,
    sql_fields,
    sql_where,
  );
  
  let args = args.into();
  
  let options = Options::from(options);
  let options = options.into();
  
  let num = ctx.execute(
    sql,
    args,
    options,
  ).await?;
  
  Ok(num)
}<#
}
#><#
if (hasVersion) {
#>

pub async fn get_version_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
) -> Result<Option<u32>> {
  
  let model = find_by_id(ctx, id, None).await?;
  
  if let Some(model) = model {
    return Ok(model.version.into());
  }
  
  Ok(0.into())
}<#
}
#>

/// 根据id修改数据
pub async fn update_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  mut input: <#=tableUP#>Input,
  options: Option<Options>,
) -> Result<String> {
  
  input = set_id_by_lbl(
    ctx,
    input,
  ).await?;
  
  let table = "<#=mod#>_<#=table#>";
  let _method = "update_by_id";
  
  let now = ctx.get_now();
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = "update_time = ?".to_owned();
  args.push(now.into());
  
  let mut field_num: usize = 0;<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
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
    if (column.isPassword) {
  #>
  // <#=column_comment#>
  if let Some(<#=column_name_rust#>) = input.<#=column_name_rust#> {
    field_num += 1;
    sql_fields += ",<#=column_name#> = ?";
    args.push(get_password(<#=column_name_rust#>)?.into());
  }<#
    } else if (foreignKey && foreignKey.type === "json") {
  #>
  // <#=column_comment#>
  if let Some(<#=column_name_rust#>) = input.<#=column_name_rust#> {
    field_num += 1;
    sql_fields += ",<#=column_name#> = ?";
    args.push(<#=column_name_rust#>.into());
  }<#
    } else if (foreignKey && foreignKey.type === "many2many") {
  #><#
    } else {
  #>
  // <#=column_comment#>
  if let Some(<#=column_name_rust#>) = input.<#=column_name_rust#> {
    field_num += 1;
    sql_fields += ",<#=column_name#> = ?";
    args.push(<#=column_name_rust#>.into());
  }<#
  }
  #><#
  }
  #>
  
  if field_num == 0 {
    return Ok(id);
  }<#
  if (hasVersion) {
  #>if let Some(version) = input.version {
    if version > 0 {
      let version2 = get_version_by_id(ctx, id.clone()).await?;
      if let Some(version2) = version2 {
        if version2 > version {
          return Err(SrvErr::msg("数据已被修改，请刷新后重试".into()).into());
        }
      }
      sql_fields += ",version = ?";
      args.push((version + 1).into());
    }
  }<#
  }
  #>
  
  if let Some(auth_model) = ctx.get_auth_model() {
    let usr_id = auth_model.id;
    sql_fields += ",update_usr_id = ?";
    args.push(usr_id.into());
  }
  
  let sql_where = "id = ?";
  args.push(id.clone().into());
  
  let sql = format!(
    "update {} set {} where {} limit 1",
    table,
    sql_fields,
    sql_where,
  );
  
  let args = args.into();
  
  let options = Options::from(options);<#
  if (cache) {
  #>
  
  let options = options.set_del_cache_key1s(get_foreign_tables());<#
  }
  #>
  
  let options = options.into();
  
  ctx.execute(
    sql,
    args,
    options,
  ).await?;<#
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    if (column.ignoreCodegen) continue;
    if (column.isVirtual) continue;
    const column_name = column.COLUMN_NAME;
    const column_name_rust = rustKeyEscape(column.COLUMN_NAME);
    if (column_name === "id") continue;
    if (column_name === "create_usr_id") continue;
    if (column_name === "create_time") continue;
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
  #>
  
  // <#=column_comment#>
  if let Some(<#=column_name_rust#>) = input.<#=column_name_rust#> {
    many2many_update(
      ctx,
      id.clone(),
      <#=column_name_rust#>.clone(),
      ManyOpts {
        r#mod: "<#=many2many.mod#>",
        table: "<#=many2many.table#>",
        column1: "<#=many2many.column1#>",
        column2: "<#=many2many.column2#>",
      },
    ).await?;
  }<#
  }
  #><#
  }
  #><#
    if (table === "i18n") {
  #>
  
  crate::src::base::options::options_dao::update_i18n_version(ctx).await?;<#
    }
  #>
  
  Ok(id)
}

/// 获取外键关联表, 第一个是主表
#[allow(dead_code)]
fn get_foreign_tables() -> Vec<&'static str> {
  let table = "<#=mod#>_<#=table#>";
  vec![
    table,<#
    let foreign_tableArr = [ ];
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
        if (foreign_tableArr.includes(many2many.table)) {
          continue;
        } else {
          foreign_tableArr.push(many2many.table);
        }
        if (foreign_tableArr.includes(foreignTable)) {
          continue;
        } else {
          foreign_tableArr.push(foreignTable);
        }
    #>
    "<#=many2many.table#>",
    "<#=foreignTable#>",<#
    } else if (foreignKey && !foreignKey.multiple) {
      if (foreign_tableArr.includes(foreignTable)) {
        continue;
      } else {
        foreign_tableArr.push(foreignTable);
      }
    #>
    "<#=foreignTable#>",<#
    }
    #><#
    }
    #>
  ]
}

/// 根据 ids 删除数据
pub async fn delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "<#=mod#>_<#=table#>";
  let _method = "delete_by_ids";
  
  let options = Options::from(options);
  
  let mut num = 0;
  for id in ids {
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "update {} set is_deleted=1,delete_time=? where id=? limit 1",
      table,
    );
    
    args.push(ctx.get_now().into());
    args.push(id.into());
    
    let args = args.into();
    
    let options = options.clone();<#
    if (cache) {
    #>
    
    let options = options.set_del_cache_key1s(get_foreign_tables());<#
    }
    #>
    
    let options = options.into();
    
    num += ctx.execute(
      sql,
      args,
      options,
    ).await?;
  }<#
    if (table === "i18n") {
  #>
  
  crate::src::base::options::options_dao::update_i18n_version(ctx).await?;<#
    }
  #>
  
  Ok(num)
}<#
if (hasLocked) {
#>

/// 根据 ID 查找是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
pub async fn get_is_locked_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<bool> {
  
  let model = find_by_id(ctx, id, options).await?;
  
  let is_locked = {
    if let Some(model) = model {
      model.is_locked == 1
    } else {
      false
    }
  };
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁数据
pub async fn lock_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "<#=mod#>_<#=table#>";
  let _method = "lock_by_ids";
  
  let options = Options::from(options);
  
  let mut num = 0;
  for id in ids {
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "update {} set is_locked=? where id=? limit 1",
      table,
    );
    
    args.push(is_locked.into());
    args.push(id.into());
    
    let args = args.into();
    
    let options = options.clone().into();
    
    num += ctx.execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  Ok(num)
}<#
}
#>

/// 根据 ids 还原数据
pub async fn revert_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "<#=mod#>_<#=table#>";
  let _method = "revert_by_ids";
  
  let options = Options::from(options);
  
  let mut num = 0;
  for id in ids {
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "update {} set is_deleted=0 where id=? limit 1",
      table,
    );
    
    args.push(id.into());
    
    let args = args.into();
    
    let options = options.clone();<#
    if (cache) {
    #>
    
    let options = options.set_del_cache_key1s(get_foreign_tables());<#
    }
    #>
    
    let options = options.into();
    
    num += ctx.execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  Ok(num)
}

/// 根据 ids 彻底删除数据
pub async fn force_delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "<#=mod#>_<#=table#>";
  let _method = "force_delete_by_ids";
  
  let options = Options::from(options);
  
  let mut num = 0;
  for id in ids {
    
    let model = find_by_id(ctx, id.clone(), None).await?;
    info!("force_delete_by_ids: {:?}", model);
    
    if model.is_none() {
      continue;
    }
    
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "delete from {} set where id=? and is_deleted = 1 limit 1",
      table,
    );
    
    args.push(id.into());
    
    let args = args.into();
    
    let options = options.clone();<#
    if (cache) {
    #>
    
    let options = options.set_del_cache_key1s(get_foreign_tables());<#
    }
    #>
    
    let options = options.into();
    
    num += ctx.execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  Ok(num)
}<#
if (hasOrderBy) {
#>

/// 查找 order_by 字段的最大值
pub async fn find_last_order_by<'a>(
  ctx: &mut impl Ctx<'a>,
  _options: Option<Options>,
) -> Result<i64> {
  
  let table = "<#=mod#>_<#=table#>";
  let _method = "find_last_order_by";
  
  #[allow(unused_mut)]
  let mut args = QueryArgs::new();
  let mut sql_where = "".to_owned();
  
  sql_where += "t.is_deleted = 0";<#
  if (hasTenant_id) {
  #>
  
  if let Some(tenant_id) = ctx.get_auth_tenant_id() {
    sql_where += " and t.tenant_id = ?";
    args.push(tenant_id.into());
  }<#
  }
  #><#
  if (hasDeptId) {
  #>
  
  if let Some(dept_id) = ctx.get_auth_dept_id() {
    sql_where += " and t.dept_id = ?";
    args.push(dept_id.into());
  }<#
  }
  #>
  
  let sql = format!(
    "select t.order_by order_by from {} t where {} order by t.order_by desc limit 1",
    table,
    sql_where,
  );
  
  let args = args.into();
  
  let model = ctx.query_one::<OrderByModel>(
    sql,
    args,
    None,
  ).await?;
  
  let order_by = {
    if let Some(model) = model {
      model.order_by
    } else {
      0
    }
  };
  
  Ok(order_by)
}<#
}
#>
