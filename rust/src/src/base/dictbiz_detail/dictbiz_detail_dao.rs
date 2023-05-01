use anyhow::Result;

use crate::common::context::{Ctx, QueryArgs, Options};

use super::dictbiz_detail_model::GetDictbiz;

/// 获取业务字典
pub async fn get_dictbiz<'a>(
  ctx: &mut impl Ctx<'a>,
  codes: &Vec<impl AsRef<str>>,
) -> Result<Vec<Vec<GetDictbiz>>> {
  if codes.is_empty() {
    return Ok(vec![]);
  }
  
  let table = "base_dict";
  
  let mut args = QueryArgs::new();
  
  let code = {
    let mut code = "".to_owned();
    for item in codes {
      code += &format!("{},", args.push(item.as_ref().to_string().into()));
    }
    code = code.trim_end_matches(",").to_owned();
    code
  };
  
  let sql = format!(r#"
    select
      t.id,
      base_dict.code,
      base_dict.type,
      t.lbl,
      t.val
    from
      base_dict_detail t
    inner join base_dict
      on t.dict_id = base_dict.id
      and base_dict.is_deleted = 0
      and base_dict.is_enabled = 1
    where
      t.is_deleted = 0
      and t.is_enabled = 1
      and base_dict.code in ({code})
    order by
      t.order_by asc
  "#);
  
  let args = args.value;
  
  let options = Options::new();
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let options = options.into();
  
  let res: Vec<GetDictbiz> = ctx.query(
    sql,
    args,
    options,
  ).await?;
  
  let mut data: Vec<Vec<GetDictbiz>> = vec![];
  
  for code in codes {
    let mut item: Vec<GetDictbiz> = vec![];
    for d in &res {
      if d.code == code.as_ref() {
        item.push(d.clone());
      }
    }
    data.push(item);
  }
  
  Ok(data)
}
