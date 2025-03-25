use tracing::{info, error};
use color_eyre::eyre::{eyre, Result};

use crate::common::context::{
  Options,
  get_req_id,
  get_now,
};

use crate::common::util::http::client as reqwest_client;

// wx_app
use crate::r#gen::wx::wx_app::wx_app_model::WxAppSearch;
use crate::r#gen::wx::wx_app::wx_app_dao::{
  find_one_wx_app,
  validate_option_wx_app,
  validate_is_enabled_wx_app,
};

// wx_app_token
use crate::r#gen::wx::wx_app_token::wx_app_token_model::{
  WxAppTokenInput,
  WxAppTokenSearch,
};
use crate::r#gen::wx::wx_app_token::wx_app_token_dao::{
  find_one_wx_app_token,
  create_wx_app_token,
  update_by_id_wx_app_token,
};

use super::wx_app_token_model::GetAccessTokenModel;

#[allow(dead_code)]
async fn fetch_access_token_model(
  appid: &str,
  appsecret: &str,
) -> Result<GetAccessTokenModel> {
  let url = format!(
    "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={appid}&secret={appsecret}",
    appid = urlencoding::encode(appid),
    appsecret = urlencoding::encode(appsecret),
  );
  let res = reqwest_client().get(&url).send().await?;
  let get_access_token_model = res.json::<GetAccessTokenModel>().await?;
  
  let errcode = get_access_token_model.errcode;
  let errmsg = get_access_token_model.errmsg.clone();
  
  if errcode.is_some() && errcode.unwrap() != 0 {
    error!(
      "{req_id} WxAppTokenService.getAccessToken: {get_access_token_model:#?}",
      req_id = get_req_id(),
    );
    return Err(eyre!(errmsg.unwrap_or_default()));
  }
  
  Ok(get_access_token_model)
}

#[allow(dead_code)]
pub async fn get_access_token(
  appid: String,
  force: bool,
  options: Option<Options>,
) -> Result<String> {
  
  let wx_app_model = validate_option_wx_app(
    find_one_wx_app(
      Some(WxAppSearch {
        appid: Some(appid.clone()),
        ..Default::default()
      }),
      None,
      options.clone(),
    ).await?,
  ).await?;
  
  validate_is_enabled_wx_app(
    &wx_app_model,
  ).await?;
  
  let wx_app_id = wx_app_model.id;
  let appid = wx_app_model.appid;
  let appsecret = wx_app_model.appsecret;
  
  let now = get_now();
  
  let wx_app_token_model = find_one_wx_app_token(
    Some(WxAppTokenSearch {
      wx_app_id: Some(vec![wx_app_id.clone()]),
      ..Default::default()
    }),
    None,
    options.clone(),
  ).await?;
  
  if wx_app_token_model.is_none() {
    let get_access_token_model = fetch_access_token_model(
      &appid,
      &appsecret,
    ).await?;
    
    let access_token = get_access_token_model.access_token;
    let expires_in = get_access_token_model.expires_in;
    
    create_wx_app_token(
      WxAppTokenInput {
        wx_app_id: Some(wx_app_id.clone()),
        appid: Some(appid.clone()),
        appsecret: Some(appsecret.clone()),
        access_token: Some(access_token.clone()),
        expires_in: Some(expires_in),
        token_time: Some(now),
        ..Default::default()
      },
      options.clone(),
    ).await?;
    return Ok(access_token);
  }
  
  let wx_app_token_model = wx_app_token_model.unwrap();
  
  let wx_app_token_id = wx_app_token_model.id;
  let access_token = wx_app_token_model.access_token;
  let expires_in = wx_app_token_model.expires_in;
  let token_time = wx_app_token_model.token_time;
  
  // token_time 加上 expires_in * 5分钟
  let token_time2 = token_time
    .and_then(|v|
      v.checked_add_signed(chrono::Duration::seconds(expires_in as i64))
    )
    .and_then(|v|
      v.checked_add_signed(chrono::Duration::minutes(5))
    );
  
  if force ||
    expires_in == 0 ||
    token_time2.is_none() ||
    token_time2.unwrap() < now ||
    appid != wx_app_token_model.appid ||
    appsecret != wx_app_token_model.appsecret
  {
    info!(
      "{req_id} WxAppTokenService.getAccessToken-timeout: {token_time2:#?}",
      req_id = get_req_id(),
    );
    
    let get_access_token_model = fetch_access_token_model(
      &appid,
      &appsecret,
    ).await?;
    
    let access_token = get_access_token_model.access_token;
    let expires_in = get_access_token_model.expires_in;
    
    update_by_id_wx_app_token(
      wx_app_token_id,
      WxAppTokenInput {
        appid: Some(appid),
        appsecret: Some(appsecret),
        access_token: Some(access_token.clone()),
        expires_in: Some(expires_in),
        token_time: Some(now),
        ..Default::default()
      },
      options.clone(),
    ).await?;
    
    return Ok(access_token);
  }
  
  Ok(access_token)
}

#[cfg(test)]
mod tests {
  
  use super::*;
  
  use crate::common::context::Ctx;
  
  #[tokio::test]
  async fn test_get_access_token()-> () {
    let res = Ctx::test_builder()
      .build()
      .scope_fn(async || -> Result<()> {
        let appid = "wxd4b24c53a1813485".to_string();
        let options = None;
        
        let access_token = get_access_token(
          appid,
          false,
          options,
        ).await?;
        
        println!("access_token: {:?}", access_token);
        
        Ok(())
      }).await;
    if let Err(err) = &res {
      println!("err: {:?}", err);
    }
    assert!(res.is_ok());
  }
}
