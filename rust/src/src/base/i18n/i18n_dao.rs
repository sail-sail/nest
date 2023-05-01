use std::borrow::Cow;
use std::collections::HashMap;

use anyhow::Result;
use crate::common::context::Ctx;

use regex::{Regex, Captures};

use crate::gen::base::lang::lang_dao;
use crate::gen::base::lang::lang_model::LangSearch;
use crate::gen::base::i18n::i18n_dao;
use crate::gen::base::i18n::i18n_model::{I18nSearch, I18nModel};
use crate::gen::base::menu::menu_dao;
use crate::gen::base::menu::menu_model::MenuSearch;

lazy_static! {
  static ref REG: Regex = Regex::new(r"\{([\s\S]*?)\}").unwrap();
}

pub async fn n<'a>(
  ctx: &mut impl Ctx<'a>,
  route_path: Option<String>,
  code: String,
  map: &HashMap<&'a str, &'a str>,
) -> Result<String> {
  let lang_code = ctx.get_auth_lang();
  if lang_code.is_none() {
    return Ok(code);
  }
  let lang_code = lang_code.unwrap();
  if lang_code.is_empty() {
    return Ok(code);
  }
  let i18n_lbl = n_lang(ctx, lang_code, route_path, code, map.into()).await?;
  Ok(i18n_lbl)
}

pub async fn ns<'a>(
  ctx: &mut impl Ctx<'a>,
  code: String,
  map: &HashMap<&'a str, &'a str>,
) -> Result<String> {
  let lang_code = ctx.get_auth_lang();
  if lang_code.is_none() {
    return Ok(code);
  }
  let lang_code = lang_code.unwrap();
  if lang_code.is_empty() {
    return Ok(code);
  }
  let i18n_lbl = n_lang(ctx, lang_code, None, code, map.into()).await?;
  Ok(i18n_lbl)
}

pub async fn n_lang<'a>(
  ctx: &mut impl Ctx<'a>,
  lang_code: String,
  route_path: Option<String>,
  code: String,
  map: Option<&HashMap<&'a str, &'a str>>,
) -> Result<String> {
  let mut i18n_lbl = code.clone();
  let lang_model = lang_dao::find_one(
    ctx,
    LangSearch {
      code: lang_code.into(),
      is_enabled: vec![1].into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  let mut menu_id: Option<String> = None;
  if let Some(route_path) = route_path {
    let menu_model = menu_dao::find_one(
      ctx,
      MenuSearch {
        route_path: route_path.into(),
        is_enabled: vec![1].into(),
        ..Default::default()
      }.into(),
      None,
      None,
    ).await?;
    if let Some(menu_model) = menu_model {
      menu_id = menu_model.id.to_string().into();
    }
  }
  if let Some(lang_model) = lang_model {
    #[allow(unused_assignments)]
    let mut i18n_model: Option<I18nModel> = None;
    if let Some(menu_id) = menu_id {
      i18n_model = i18n_dao::find_one(
        ctx,
        I18nSearch {
          lang_id: vec![lang_model.id.to_string()].into(),
          menu_id: vec![menu_id].into(),
          code: code.clone().into(),
          ..Default::default()
        }.into(),
        None,
        None,
      ).await?;
      if i18n_model.is_none() {
        i18n_model = i18n_dao::find_one(
          ctx,
          I18nSearch {
            lang_id: vec![lang_model.id.to_string()].into(),
            menu_id_is_null: true.into(),
            code: code.into(),
            ..Default::default()
          }.into(),
          None,
          None,
        ).await?;
      }
    } else {
      i18n_model = i18n_dao::find_one(
        ctx,
        I18nSearch {
          lang_id: vec![lang_model.id.to_string()].into(),
          menu_id_is_null: true.into(),
          code: code.into(),
          ..Default::default()
        }.into(),
        None,
        None,
      ).await?;
    }
    if let Some(i18n_model) = i18n_model {
      i18n_lbl = i18n_model.lbl;
    }
  }
  if let Some(map) = map {
    let res: Cow<str> = REG.replace_all(&i18n_lbl, |caps: &Captures| {
      let key = caps.get(1).map(|m| m.as_str()).unwrap_or_default();
      let value = map.get(key).unwrap_or(&"");
      value
    });
    i18n_lbl = res.to_string();
  }
  Ok(i18n_lbl)
}

#[test]
#[cfg(test)]
fn test_regex() {
    use std::collections::HashMap;

  let mut map = HashMap::new();
  map.insert("name", "黄智勇");
  map.insert("0", "黄0");
  let re = Regex::new(r"\{([\s\S]*?)\}").unwrap();
  let text = "Hello {name} {name2} {0}!";
  let result = re.replace_all(text, |caps: &Captures| {
    println!("{:#?}", caps);
    let key = caps.get(1).map(|m| m.as_str()).unwrap_or_default();
    let value = map.get(key).unwrap_or(&"");
    value
  });
  println!("{}", result);
}
