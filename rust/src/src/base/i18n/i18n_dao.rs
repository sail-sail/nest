use std::borrow::Cow;
use std::collections::HashMap;

use std::sync::OnceLock;

use color_eyre::eyre::Result;
use crate::common::context::{
  get_auth_lang,
  Options,
};
use regex::{Regex, Captures};

use crate::r#gen::base::lang::lang_dao::find_one as find_one_lang;
use crate::r#gen::base::lang::lang_model::LangSearch;
use crate::r#gen::base::i18n::i18n_dao::find_one as find_one_i18n;
use crate::r#gen::base::i18n::i18n_model::I18nSearch;
use crate::r#gen::base::menu::menu_dao::find_one as find_one_menu;
use crate::r#gen::base::menu::menu_model::MenuSearch;
use crate::r#gen::base::menu::menu_model::MenuModel;

static REG: OnceLock<Regex> = OnceLock::new();
static SERVER_I18N_ENABLE: OnceLock<bool> = OnceLock::new();

fn reg() -> Regex {
  REG.get_or_init(|| Regex::new(r"\{([\s\S]*?)\}").unwrap())
    .clone()
}
fn server_i18n_enable() -> bool {
  *SERVER_I18N_ENABLE.get_or_init(|| {
    std::env::var("server_i18n_enable")
      .map(|v| v.parse().unwrap_or(true))
      .unwrap_or(true)
  })
}

pub struct NRoute {
  pub route_path: Option<String>,
}

impl NRoute {
  
  #[allow(dead_code)]
  pub async fn n(
    &self,
    code: String,
    map: Option<HashMap<String, String>>,
  ) -> Result<String> {
    let res = n(self.route_path.clone(), code, map).await?;
    Ok(res)
  }
  
  pub async fn n_batch(
    &self,
    i18n_code_maps: Vec<I18nCodeMap>,
  ) -> Result<HashMap<String, String>> {
    let res = n_batch(self.route_path.clone(), i18n_code_maps).await?;
    Ok(res)
  }
  
}

#[allow(dead_code)]
pub async fn n(
  route_path: Option<String>,
  code: String,
  map: Option<HashMap<String, String>>,
) -> Result<String> {
  let lang_code = get_auth_lang();
  if lang_code.is_none() {
    return Ok(code);
  }
  let lang_code = lang_code.unwrap();
  if lang_code.is_empty() {
    return Ok(code);
  }
  let i18n_lbl = n_lang(lang_code, route_path, code, map).await?;
  Ok(i18n_lbl)
}

#[derive(Debug, Clone)]
pub struct I18nCodeMap {
  pub code: String,
  pub map: Option<HashMap<String, String>>,
}

impl From<String> for I18nCodeMap {
  fn from(code: String) -> Self {
    Self {
      code,
      map: None,
    }
  }
}

impl From<&str> for I18nCodeMap {
  fn from(code: &str) -> Self {
    Self {
      code: code.to_owned(),
      map: None,
    }
  }
}

impl From<(String, HashMap<String, String>)> for I18nCodeMap {
  fn from((code, map): (String, HashMap<String, String>)) -> Self {
    Self {
      code,
      map: Some(map),
    }
  }
}

#[allow(dead_code)]
pub async fn n_batch(
  route_path: Option<String>,
  i18n_code_maps: Vec<I18nCodeMap>,
) -> Result<HashMap<String, String>> {
  let lang_code = get_auth_lang();
  if lang_code.is_none() {
    return Ok(
      i18n_code_maps.iter()
      .map(
        |item| (item.code.clone(), item.code.clone()),
      )
      .collect::<HashMap<String, String>>()
    );
  }
  let lang_code = lang_code.unwrap();
  if lang_code.is_empty() {
    return Ok(
      i18n_code_maps.iter()
      .map(
        |item| (item.code.clone(), item.code.clone()),
      )
      .collect::<HashMap<String, String>>()
    );
  }
  let mut i18n_lbls: HashMap<String, String> = HashMap::new();
  for i18n_code_map in i18n_code_maps {
    let i18n_lbl = n_lang(
      lang_code.clone(),
      route_path.clone(),
      i18n_code_map.code.clone(),
      i18n_code_map.map,
    ).await?;
    i18n_lbls.insert(i18n_code_map.code, i18n_lbl);
  }
  Ok(i18n_lbls)
}

#[allow(dead_code)]
pub async fn ns(
  code: impl Into<String>,
  map: Option<HashMap<String, String>>,
) -> Result<String> {
  let code = code.into();
  let lang_code = get_auth_lang();
  if lang_code.is_none() {
    return Ok(code);
  }
  let lang_code = lang_code.unwrap();
  if lang_code.is_empty() {
    return Ok(code);
  }
  let i18n_lbl = n_lang(lang_code, None, code, map).await?;
  Ok(i18n_lbl)
}

pub async fn n_lang(
  lang_code: String,
  route_path: Option<String>,
  code: String,
  map: Option<HashMap<String, String>>,
) -> Result<String> {
  
  let server_i18n_enable = server_i18n_enable();
  if !server_i18n_enable {
    let mut i18n_lbl = code;
    if let Some(map) = map {
      let res: Cow<str> = reg().replace_all(&i18n_lbl, |caps: &Captures| {
        let key = caps.get(1).map(|m| m.as_str().to_owned()).unwrap_or_default();
        let value = map.get(&key).unwrap_or(&"".to_owned()).clone();
        value
      });
      i18n_lbl = res.to_string();
    }
    return Ok(i18n_lbl);
  }
  
  let options = Options::new();
  
  let options = options.set_is_debug(Some(false));
  
  let options: Option<Options> = options.into();
  
  let mut i18n_lbl = code.clone();
  let lang_model = find_one_lang(
    LangSearch {
      code: lang_code.into(),
      is_enabled: vec![1].into(),
      ..Default::default()
    }.into(),
    None,
    options.clone(),
  ).await?;
  let mut menu_model: Option<MenuModel> = None;
  if let Some(route_path) = route_path {
    menu_model = find_one_menu(
      MenuSearch {
        route_path: route_path.into(),
        is_enabled: vec![1].into(),
        ..Default::default()
      }.into(),
      None,
      options.clone(),
    ).await?;
  }
  let menu_id = menu_model.map(|m| m.id).unwrap_or_default();
  if let Some(lang_model) = lang_model {
    let lang_id = lang_model.id;
    let i18n_model = find_one_i18n(
      I18nSearch {
        lang_id: vec![lang_id.clone()].into(),
        menu_id: vec![menu_id].into(),
        code: code.clone().into(),
        ..Default::default()
      }.into(),
      None,
      options.clone(),
    ).await?;
    if let Some(i18n_model) = i18n_model {
      i18n_lbl = i18n_model.lbl;
    }
  }
  if let Some(map) = map {
    let res: Cow<str> = reg().replace_all(&i18n_lbl, |caps: &Captures| {
      let key = caps.get(1).map(|m| m.as_str().to_owned()).unwrap_or_default();
      let value = map.get(&key).unwrap_or(&"".to_owned()).clone();
      value
    });
    i18n_lbl = res.to_string();
  }
  Ok(i18n_lbl)
}

pub fn get_server_i18n_enable() -> bool {
  server_i18n_enable()
}

// #[test]
// #[cfg(test)]
// fn test_regex() {
//     use std::collections::HashMap;

//   let mut map = HashMap::new();
//   map.insert("name".to_owned(), "黄智勇".to_owned());
//   map.insert("0".to_owned(), "黄0".to_owned());
//   let re = Regex::new(r"\{([\s\S]*?)\}").unwrap();
//   let text = "Hello {name} {name2} {0}!";
//   let result = re.replace_all(text, |caps: &Captures| {
//     println!("{:#?}", caps);
//     let key = caps.get(1).map(|m| m.as_str()).unwrap_or_default();
//     let value = map.get(key).unwrap_or(&"".to_owned()).clone();
//     value
//   });
//   println!("{}", result);
// }
