use tracing::info;
use color_eyre::eyre::{Result, eyre};

use generated::common::context::{
  Options,
  get_req_id,
  get_now,
  get_server_tokentimeout,
};

use super::wx_usr_model::{
  Code2sessionInput,
  Code2sessionModel,
};

use generated::common::usr::usr_model::LoginModel;

// wx_app
use generated::wx::wx_app::wx_app_model::WxAppSearch;
use generated::wx::wx_app::wx_app_dao::{
  find_one_wx_app,
  validate_option_wx_app,
  validate_is_enabled_wx_app,
};

// wx_usr
use generated::wx::wx_usr::wx_usr_model::{
  WxUsrInput,
  WxUsrSearch,
};
use generated::wx::wx_usr::wx_usr_dao::{
  find_by_id_wx_usr,
  find_one_wx_usr,
  validate_option_wx_usr,
  create_wx_usr,
  update_by_id_wx_usr,
  update_tenant_by_id_wx_usr,
};

// base_usr
use generated::base::usr::usr_model::UsrInput;
use generated::base::usr::usr_dao::{
  validate_option_usr,
  create_usr,
  update_tenant_by_id_usr,
  find_by_id_usr,
};

// base_org
use generated::base::org::org_model::OrgId;

use generated::common::auth::auth_dao::get_token_by_auth_model;
use generated::common::auth::auth_model::AuthModel;
use generated::common::gql::model::UniqueType;

use generated::common::util::http::client as reqwest_client;
use generated::common::exceptions::service_exception::ServiceException;

pub async fn code2session(
  code2session_input: Code2sessionInput,
  options: Option<Options>,
) -> Result<LoginModel> {
  
  let code = code2session_input.code;
  let appid = code2session_input.appid;
  let lang = code2session_input.lang;
  
  let wx_app_model = validate_option_wx_app(
    find_one_wx_app(
      Some(WxAppSearch {
        appid: Some(appid),
        ..Default::default()
      }),
      None,
      options.clone(),
    ).await?,
  ).await?;
  
  validate_is_enabled_wx_app(&wx_app_model).await?;
  
  let appid = wx_app_model.appid;
  let appsecret = wx_app_model.appsecret;
  let js_code = code;
  let tenant_id = wx_app_model.tenant_id;
  
  let base_url = "https://api.weixin.qq.com/sns/jscode2session?";
  
  let mut query_string = String::new();
  query_string.push_str(&format!("appid={}&", urlencoding::encode(&appid)));
  query_string.push_str(&format!("secret={}&", urlencoding::encode(&appsecret)));
  query_string.push_str(&format!("js_code={}&", urlencoding::encode(&js_code)));
  query_string.push_str("grant_type=authorization_code");
  let url = format!("{}{}", base_url, query_string);
  
  info!(
    "{req_id} WxUsrService.code2Session: {url}",
    req_id = get_req_id(),
  );
  
  let res = reqwest_client().get(&url).send().await?;
  let code2session_str = res.text().await?;
  info!(
    "{req_id} WxUsrService.code2Session: {code2session_str}",
    req_id = get_req_id(),
  );
  let code2session_model: Code2sessionModel = serde_json::from_str(&code2session_str)?;
  
  let errcode = code2session_model.errcode;
  let errmsg = code2session_model.errmsg;
  let openid = code2session_model.openid;
  let unionid = code2session_model.unionid
    .unwrap_or_default();
  
  if (errcode.is_some() && errcode.unwrap() != 0) ||
    openid.is_empty()
  {
    return Err(eyre!(
      ServiceException {
        code: errcode.unwrap_or_default().to_string(),
        message: errmsg.unwrap_or_default(),
        trace: true,
        ..Default::default()
      }
    ));
  }
  
  let mut wx_usr_model = find_one_wx_usr(
    Some(WxUsrSearch {
      openid: Some(openid.clone()),
      ..Default::default()
    }),
    None,
    options.clone(),
  ).await?;
  
  if wx_usr_model.is_none() {
    let wx_usr_id = create_wx_usr(
      WxUsrInput {
        appid: Some(appid.clone()),
        openid: Some(openid.clone()),
        lbl: Some(openid.clone()),
        unionid: Some(unionid.clone()),
        ..Default::default()
      },
      options.clone(),
    ).await?;
    update_tenant_by_id_wx_usr(
      wx_usr_id.clone(),
      tenant_id.clone(),
      options.clone(),
    ).await?;
    wx_usr_model = find_by_id_wx_usr(
      wx_usr_id,
      options.clone(),
    ).await?;
  }
  let mut wx_usr_model = validate_option_wx_usr(
    wx_usr_model,
  ).await?;
  
  if wx_usr_model.tenant_id != tenant_id {
    update_tenant_by_id_wx_usr(
      wx_usr_model.id.clone(),
      tenant_id.clone(),
      options.clone(),
    ).await?;
  }
  
  if wx_usr_model.unionid != unionid {
    update_by_id_wx_usr(
      wx_usr_model.id.clone(),
      WxUsrInput {
        unionid: Some(unionid.clone()),
        ..Default::default()
      },
      options.clone(),
    ).await?;
  }
  
  let usr_model = find_by_id_usr(
    wx_usr_model.usr_id.clone(),
    options.clone(),
  ).await?;
  
  if usr_model.is_none() {
    wx_usr_model.usr_id = "".into();
  }
  
  if wx_usr_model.usr_id.is_empty() {
    let usr_id = create_usr(
      UsrInput {
        lbl: Some("游客".to_string()),
        rem: Some("游客".to_string()),
        is_hidden: Some(1),
        ..Default::default()
      },
      Some(
        options.clone()
          .unwrap_or_default()
          .set_unique_type(UniqueType::Update)
      ),
    ).await?;
    wx_usr_model.usr_id = usr_id.clone();
    update_tenant_by_id_usr(
      usr_id.clone(),
      tenant_id.clone(),
      options.clone(),
    ).await?;
    update_by_id_wx_usr(
      wx_usr_model.id.clone(),
      WxUsrInput {
        usr_id: Some(usr_id.clone()),
        ..Default::default()
      },
      options.clone(),
    ).await?;
    wx_usr_model = validate_option_wx_usr(
      find_by_id_wx_usr(
        wx_usr_model.id.clone(),
        options.clone(),
      ).await?,
    ).await?;
  }
  
  let usr_id = wx_usr_model.usr_id;
  let wx_usr_id = wx_usr_model.id;
  
  let usr_model = validate_option_usr(
    find_by_id_usr(
      usr_id.clone(),
      options.clone(),
    ).await?,
  ).await?;
  
  let username = usr_model.username;
  let org_ids =  usr_model.org_ids;
  
  let org_id: Option<OrgId> = if !usr_model.default_org_id.is_empty() {
    Some(usr_model.default_org_id)
  } else {
    org_ids.first().cloned()
  };
  
  let now = get_now();
  let server_tokentimeout = get_server_tokentimeout();
  let exp = now.and_utc().timestamp_millis() / 1000 + server_tokentimeout;
  
  let authorization = get_token_by_auth_model(&AuthModel {
    id: usr_id.clone(),
    wx_usr_id: Some(wx_usr_id),
    wxo_usr_id: None,
    tenant_id: tenant_id.clone(),
    org_id: org_id.clone(),
    lang: lang.clone(),
    exp,
  })?;
  
  Ok(LoginModel {
    usr_id,
    username,
    tenant_id,
    org_id,
    authorization,
    lang: lang.unwrap_or_else(|| "zh-CN".to_owned()),
  })
}
