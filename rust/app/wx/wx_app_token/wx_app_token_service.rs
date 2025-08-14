use tracing::{info, error};
use color_eyre::eyre::{eyre, Result};

use generated::common::context::{
  Options,
  get_req_id,
  get_now,
};

use generated::common::util::http::client as reqwest_client;

use std::io::Cursor;
use image::ImageReader;
use image::ImageFormat;

// wx_app
use generated::wx::wx_app::wx_app_model::WxAppSearch;
use generated::wx::wx_app::wx_app_dao::{
  find_one_wx_app,
  validate_option_wx_app,
  validate_is_enabled_wx_app,
};

// wx_app_token
use generated::wx::wx_app_token::wx_app_token_model::{
  WxAppTokenInput,
  WxAppTokenSearch,
};
use generated::wx::wx_app_token::wx_app_token_dao::{
  find_one_wx_app_token,
  create_wx_app_token,
  update_by_id_wx_app_token,
};

use super::wx_app_token_model::{
  GetAccessTokenModel,
  GetwxacodeunlimitInput,
};
use generated::common::exceptions::service_exception::ServiceException;

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
      wx_app_id: Some(vec![wx_app_id]),
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
        wx_app_id: Some(wx_app_id),
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

/**
 * 获取不限制的小程序码
 * https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/qrcode-link/qr-code/getUnlimitedQRCode.html
 */
#[allow(dead_code)]
pub async fn get_wxa_code_unlimit(
  appid: String,
  input: GetwxacodeunlimitInput,
  options: Option<Options>,
) -> Result<Vec<u8>> {
  
  let access_token = get_access_token(
    appid,
    false,
    options.clone(),
  ).await?;
  
  let url = format!(
    "https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token={access_token}",
    access_token = urlencoding::encode(&access_token),
  );
  
  info!(
    "{req_id} WxAppTokenService.get_wxa_code_unlimit.url: {url:} {input:}",
    req_id = get_req_id(),
    input = serde_json::to_string(&input).unwrap(),
  );
  
  let res = reqwest_client()
    .post(&url)
    .header("Content-Type", "application/json")
    .json(&input)
    .send().await?;
  
  let status = res.status();
  
  if !status.is_success() {
    let text = res.text().await?;
    error!(
      "{req_id} WxAppTokenService.get_wxa_code_unlimit.res: {text:#?}",
      req_id = get_req_id(),
    );
    return Err(eyre!(ServiceException {
      message: text,
      trace: true,
      ..Default::default()
    }));
  }
  
  let headers = res.headers();
  let content_type = headers.get("Content-Type");
  
  if content_type.is_some() &&
    content_type.unwrap().to_str().unwrap_or_default().starts_with("application/json")
  {
    let text = res.text().await?;
    println!(
      "{req_id} WxAppTokenService.get_wxa_code_unlimit.res: {text:#?}",
      req_id = get_req_id(),
    );
    return Err(eyre!(ServiceException {
      message: text,
      trace: true,
      ..Default::default()
    }));
  }
  
  let bytes = res.bytes().await?;
  let mut bytes2: Vec<u8> = Vec::with_capacity(bytes.len());
  
  ImageReader::new(Cursor::new(&bytes)).with_guessed_format()?
    .decode()?
    .write_to(&mut Cursor::new(&mut bytes2), ImageFormat::WebP)?;
  
  Ok(bytes2)
}

#[cfg(test)]
mod tests {
  
  use super::*;
  
  use generated::common::context::Ctx;
  
  #[tokio::test]
  async fn test_get_access_token() -> () {
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
  
  #[tokio::test]
  async fn test_get_wxa_code_unlimit() -> () {
    use crate::wx::wx_app_token::wx_app_token_model::{
      GetwxacodeunlimitEnvVersion,
      GetwxacodeunlimitLineColor,
    };
    let res = Ctx::test_builder()
      .build()
      .scope_fn(async || -> Result<()> {
        let appid = "wx1749ec165167d4f3".to_string();
        let input = GetwxacodeunlimitInput {
          scene: "123".to_string(),
          page: Some("pages/index/index".to_string()),
          check_path: Some(false),
          env_version: Some(GetwxacodeunlimitEnvVersion::Release),
          width: Some(430),
          line_color: Some(GetwxacodeunlimitLineColor {
            r: 0,
            g: 0,
            b: 0,
          }),
          auto_color: Some(false),
          is_hyaline: Some(true),
        };
        let options = None;
        
        let bytes2 = get_wxa_code_unlimit(
          appid,
          input,
          options,
        ).await?;
        
        let mut file = std::fs::File::create("D:/wxa_code_unlimit.webp")?;
        std::io::copy(&mut Cursor::new(&bytes2[..]), &mut file)?;
        
        Ok(())
      }).await;
    if let Err(err) = &res {
      println!("err: {:?}", err);
    }
    assert!(res.is_ok());
  }
  
}
