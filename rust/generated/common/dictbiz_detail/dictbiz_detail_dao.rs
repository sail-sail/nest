use color_eyre::eyre::Result;

use crate::common::context::{
  query,
  QueryArgs,
  Options,
};

use super::dictbiz_detail_model::GetDictbiz;

/// 获取业务字典
pub async fn get_dictbiz<T: AsRef<str>>(
  codes: &[T],
) -> Result<Vec<Vec<GetDictbiz>>> {
  if codes.is_empty() {
    return Ok(vec![]);
  }
  
  let table = "base_dictbiz";
  
  let mut args = QueryArgs::new();
  
  let code  = codes
    .iter()
    .map(|x| args.push(x.as_ref().into()))
    .collect::<Vec<_>>()
    .join(",");
  
  let sql = format!(r#"
    select
      t.id,
      base_dictbiz.code,
      base_dictbiz.type,
      t.lbl,
      t.val
    from
      base_dictbiz_detail t
    inner join base_dictbiz
      on t.dictbiz_id = base_dictbiz.id
      and base_dictbiz.is_deleted = 0
      and base_dictbiz.is_enabled = 1
    where
      t.is_deleted = 0
      and t.is_enabled = 1
      and base_dictbiz.code in ({code})
    order by
      t.order_by asc
  "#);
  
  let args = args.value;
  
  let options = Options::new()
    .set_is_debug(Some(false))
    .set_cache_key(table, &sql, &args);
  let options = Some(options);
  
  let res: Vec<GetDictbiz> = query(
    sql,
    args,
    options,
  ).await?;
  
  let res_len = res.len();
  
  let mut data: Vec<Vec<GetDictbiz>> = Vec::with_capacity(res_len);
  
  for code in codes.iter() {
    let mut item: Vec<GetDictbiz> = Vec::with_capacity(res_len);
    for d in res.clone() {
      if d.code == code.as_ref() {
        item.push(d);
      }
    }
    data.push(item);
  }
  
  Ok(data)
}
