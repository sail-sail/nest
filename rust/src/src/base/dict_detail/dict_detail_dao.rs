use anyhow::Result;

use crate::common::context::{
  query,
  QueryArgs,
  Options,
};

use super::dict_detail_model::GetDict;

/// 获取业务字典
pub async fn get_dict(
  codes: Vec<String>,
) -> Result<Vec<Vec<GetDict>>> {
  if codes.is_empty() {
    return Ok(vec![]);
  }
  
  let table = "base_dict";
  
  let mut args = QueryArgs::new();
  
  let code = {
    let mut code = "".to_owned();
    for item in codes.clone() {
      code += &format!("{},", args.push(item.into()));
    }
    code = code.trim_end_matches(',').to_owned();
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
  
  let options = options.set_is_debug(false);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let options = options.into();
  
  let res: Vec<GetDict> = query(
    sql,
    args,
    options,
  ).await?;
  
  let res_len = res.len();
  
  let mut data: Vec<Vec<GetDict>> = Vec::with_capacity(res_len);
  
  for code in codes {
    let mut item: Vec<GetDict> = Vec::with_capacity(res_len);
    for d in res.clone() {
      if d.code == code {
        item.push(d);
      }
    }
    data.push(item);
  }
  
  Ok(data)
}
