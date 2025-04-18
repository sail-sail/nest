use color_eyre::eyre::Result;

use crate::common::context::{
  query,
  QueryArgs,
  Options,
};

use crate::common::i18n::i18n_dao::get_server_i18n_enable;

use crate::common::lang::lang_dao::get_lang_id;

use super::dict_detail_model::GetDict;

/// 获取系统字典
pub async fn get_dict<T: AsRef<str>>(
  codes: &[T],
) -> Result<Vec<Vec<GetDict>>> {
  if codes.is_empty() {
    return Ok(vec![]);
  }
  
  let table = "base_dict";
  
  let server_i18n_enable = get_server_i18n_enable();
  
  let mut args = QueryArgs::new();
  let mut lang_join = "";
  let mut lang_select = "";
  
  if server_i18n_enable {
    let lang_id = get_lang_id().await?;
    if let Some(lang_id) = lang_id {
      lang_join = r#"
      left join base_dict_detail_lang
        on t.id=base_dict_detail_lang.dict_detail_id
        and base_dict_detail_lang.lang_id=?
      "#;
      args.push(lang_id.into());
      lang_select = "base_dict_detail_lang.lbl as lbl_lang,";
    }
  } else {
    lang_select = "null as lbl_lang,";
  }
  let lang_join = lang_join;
  let lang_select = lang_select;
  
  let code = codes
    .iter()
    .map(|item| args.push(item.as_ref().into()))
    .collect::<Vec<_>>()
    .join(",");
  
  let sql = format!(r#"select t.id,base_dict.code,base_dict.type,t.lbl,{lang_select}t.val from base_dict_detail t inner join base_dict on t.dict_id=base_dict.id and base_dict.is_deleted=0 and base_dict.is_enabled=1 {lang_join} where t.is_deleted=0 and t.is_enabled=1 and base_dict.code in({code})order by t.order_by asc"#);
  
  let args = args.value;
  
  let options = Options::new()
    .set_is_debug(Some(false))
    .set_cache_key(table, &sql, &args);
  let options = Some(options);
  
  let mut res: Vec<GetDict> = query(
    sql,
    args,
    options,
  ).await?;
  
  for d in res.iter_mut() {
    if let Some(lbl_lang) = d.lbl_lang.as_ref() {
      if !lbl_lang.is_empty() {
        d.lbl = lbl_lang.clone();
      }
    }
  }
  
  let res = res;
  let res_len = res.len();
  
  let mut data: Vec<Vec<GetDict>> = Vec::with_capacity(res_len);
  
  for code in codes.iter() {
    let mut item: Vec<GetDict> = Vec::with_capacity(res_len);
    for d in res.clone() {
      if d.code == code.as_ref() {
        item.push(d);
      }
    }
    data.push(item);
  }
  
  Ok(data)
}
