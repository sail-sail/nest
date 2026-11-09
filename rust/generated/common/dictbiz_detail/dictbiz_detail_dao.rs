use color_eyre::eyre::Result;

use crate::common::context::{
  query,
  QueryArgs,
  Options,
  get_auth_tenant_id,
};

use crate::common::cache::cache_dao;

use crate::common::i18n::i18n_dao::get_server_i18n_enable;

use crate::common::lang::lang_dao::get_lang_id;

use super::dictbiz_detail_model::GetDictbiz;

/// 获取业务字典
pub async fn get_dictbiz<T: AsRef<str>>(
  codes: &[T],
) -> Result<Vec<Vec<GetDictbiz>>> {
  
  if codes.is_empty() {
    return Ok(vec![]);
  }
  
  let options = Options::new()
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let table = "base_dictbiz";
  
  let server_i18n_enable = get_server_i18n_enable();
  
  let mut args = QueryArgs::new();
  let mut lang_join = "";
  let mut lang_select = "null as lbl_lang,";
  
  if server_i18n_enable {
    let lang_id = get_lang_id().await?;
    if let Some(lang_id) = lang_id {
      lang_join = r#"
      left join base_dictbiz_detail_lang
        on t.id=base_dictbiz_detail_lang.dictbiz_detail_id
        and base_dictbiz_detail_lang.lang_id=?
      "#;
      args.push(lang_id.into());
      lang_select = "base_dictbiz_detail_lang.lbl as lbl_lang,";
    }
  }
  let lang_join = lang_join;
  let lang_select = lang_select;
  
  let tenant_id = get_auth_tenant_id().unwrap_or_default();
  args.push(tenant_id.into());
  
  for x in codes.iter() {
    args.push(x.as_ref().into());
  }
  let code = vec!["?"; codes.len()].join(",");
  
  let sql = format!(r#"
    select
      t.id,
      base_dictbiz.code,
      base_dictbiz.type,
      t.lbl,
      {lang_select}
      t.val
    from
      base_dictbiz_detail t
    inner join base_dictbiz
      on t.dictbiz_id = base_dictbiz.id
      and base_dictbiz.is_deleted = 0
      and base_dictbiz.is_enabled = 1
    {lang_join}
    where
      t.is_deleted = 0
      and t.is_enabled = 1
      and t.tenant_id = ?
      and base_dictbiz.code in ({code})
    order by
      t.order_by asc
  "#);
  
  let args = args.value;
  
  let cache_key1 = format!("dao.sql.{table}");
  let cache_key2 = crate::common::util::string::hash(serde_json::json!([ &sql, args ]).to_string().as_bytes());
  {
    let str = cache_dao::get_cache(&cache_key1, &cache_key2).await?;
    if let Some(str) = str {
      let res2: Vec<Vec<GetDictbiz>>;
      let res = serde_json::from_str::<Vec<Vec<GetDictbiz>>>(&str);
      if let Ok(res) = res {
        res2 = res;
      } else {
        res2 = vec![];
        cache_dao::del_cache(&cache_key1).await?;
      }
      return Ok(res2);
    }
  }
  
  let mut res: Vec<GetDictbiz> = query(
    sql,
    args,
    options,
  ).await?;
  
  for d in res.iter_mut() {
    if let Some(lbl_lang) = d.lbl_lang.as_ref() && !lbl_lang.is_empty() {
      d.lbl = lbl_lang.clone();
    }
  }
  
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
  
  {
    let str = serde_json::to_string(&data)?;
    cache_dao::set_cache(&cache_key1, &cache_key2, &str).await?;
  }
  
  Ok(data)
}
