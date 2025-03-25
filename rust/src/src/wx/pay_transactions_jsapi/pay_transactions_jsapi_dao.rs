use color_eyre::eyre::{Result, eyre};

use crate::common::context::{
  Options,
  get_short_uuid,
  get_auth_model_err,
};
use crate::common::wx_pay::{Amount, Jsapi, Payer, WxPayData, WxPay, SceneInfo};

use super::pay_transactions_jsapi_model::RequestPaymentOptions;

// wx_pay
use crate::r#gen::wx::wx_pay::wx_pay_dao::{
  find_one_wx_pay,
  validate_option_wx_pay,
  validate_is_enabled_wx_pay,
};
use crate::r#gen::wx::wx_pay::wx_pay_model::WxPaySearch;

// wx_usr
use crate::r#gen::wx::wx_usr::wx_usr_dao::{
  find_by_id_wx_usr,
  validate_option_wx_usr,
};

// wxo_usr
use crate::r#gen::wx::wxo_usr::wxo_usr_dao::{
  find_by_id_wxo_usr,
  validate_option_wxo_usr,
};

use crate::r#gen::wx::pay_transactions_jsapi::pay_transactions_jsapi_model::{
  PayTransactionsJsapiTradeState,
  PayTransactionsJsapiInput,
};
use crate::r#gen::wx::pay_transactions_jsapi::pay_transactions_jsapi_dao::create_pay_transactions_jsapi;

use super::pay_transactions_jsapi_model::TransactionsJsapiInput;

use crate::common::oss::oss_dao::get_object;
use crate::r#gen::base::tenant::tenant_model::TenantId;

/// 生成商户订单号 out_trade_no
fn get_out_trade_no() -> String {
  get_short_uuid()
    .replace("+", "-")
    .replace("/", "_")
    .replace("=", "")
}

/// 微信支付 统一下单
#[allow(dead_code)]
pub async fn transactions_jsapi(
  transactions_jsapi_input: TransactionsJsapiInput,
  options: Option<Options>,
) -> Result<RequestPaymentOptions> {
  
  let appid = transactions_jsapi_input.appid;
  let description = transactions_jsapi_input.description;
  let amount = transactions_jsapi_input.amount;
  
  // 微信支付设置
  let wx_pay_model = validate_option_wx_pay(
    find_one_wx_pay(
      Some(WxPaySearch {
        appid: Some(appid),
        ..Default::default()
      }),
      None,
      options.clone(),
    ).await?
  ).await?;
  
  validate_is_enabled_wx_pay(
    &wx_pay_model,
  ).await?;
  
  // 当前登录用户有可能尚未绑定微信
  let auth_model = get_auth_model_err()?;
  
  let wx_usr_id = auth_model.wx_usr_id;
  let wxo_usr_id = auth_model.wxo_usr_id;
  
  let mut openid: Option<String> = None;
  let mut tenant_id: Option<TenantId> = None;
  
  if let Some(wx_usr_id) = wx_usr_id {
    let wx_usr_model = validate_option_wx_usr(
      find_by_id_wx_usr(
        wx_usr_id,
        options.clone(),
      ).await?
    ).await?;
    openid = Some(wx_usr_model.openid);
    tenant_id = Some(wx_usr_model.tenant_id);
  } else if let Some(wxo_usr_id) = wxo_usr_id {
    let wx_usr_model = validate_option_wxo_usr(
      find_by_id_wxo_usr(
        wxo_usr_id,
        options.clone(),
      ).await?
    ).await?;
    openid = Some(wx_usr_model.openid);
    tenant_id = Some(wx_usr_model.tenant_id);
  }
  
  if openid.is_none() || openid.as_ref().unwrap().is_empty() {
    return Err(eyre!("openid 不能为空"));
  }
  let openid = openid.unwrap();
  
  if tenant_id.is_none() || tenant_id.as_ref().unwrap().is_empty() {
    return Err(eyre!("tenant_id 不能为空"));
  }
  let tenant_id = tenant_id.unwrap();
  
  let private_key_str: Option<String> = {
    if wx_pay_model.private_key.is_empty() {
      None
    } else {
      let data = get_object(
        wx_pay_model.private_key.as_str(),
      ).await?;
      if let Some(data) = data {
        Some(String::from_utf8(data.into())?)
      } else {
        None
      }
    }
  };
  if private_key_str.is_none() || private_key_str.as_ref().unwrap().is_empty() {
    return Err(eyre!("私钥不存在"));
  }
  let private_key_str = private_key_str.unwrap();
  
  let appid = wx_pay_model.appid;
  let mchid = wx_pay_model.mchid;
  let serial_no = wx_pay_model.serial_no;
  let private_key = private_key_str;
  let v3_key = wx_pay_model.v3_key;
  let payer_client_ip = if wx_pay_model.payer_client_ip.is_empty() {
    None
  } else {
    Some(wx_pay_model.payer_client_ip)
  };
  let scene_info: Option<SceneInfo> = if let Some(payer_client_ip) = payer_client_ip {
    Some(SceneInfo {
      payer_client_ip: Some(payer_client_ip),
      ..Default::default()
    })
  } else {
    None
  };
  let notify_url: String = wx_pay_model.notify_url;
  
  if notify_url.is_empty() {
    return Err(eyre!("notify_url 不能为空"));
  }
  
  let wxpay = WxPay {
    appid: appid.as_str(),
    mchid: mchid.as_str(),
    private_key: private_key.as_str(),
    serial_no: serial_no.as_str(),
    api_v3_private_key: v3_key.as_str(),
    notify_url: notify_url.as_str(),
  };
  
  let out_trade_no = get_out_trade_no();
  
  let jsapi = Jsapi {
    description: description.clone(),
    out_trade_no: out_trade_no.clone(),
    amount: Amount {
      total: amount,
      ..Default::default()
    },
    payer: Payer {
      openid: openid.clone(),
    },
    time_expire: transactions_jsapi_input.time_expire.clone(),
    attach: transactions_jsapi_input.attach.clone(),
    scene_info,
    ..Default::default()
  };
  
  let wx_pay_data: WxPayData = wxpay.jsapi(&jsapi).await?;
  
  let request_payment_options = RequestPaymentOptions {
    time_stamp: wx_pay_data.time_stamp.to_string(),
    nonce_str: wx_pay_data.nonce_str,
    package: wx_pay_data.package.clone(),
    sign_type: wx_pay_data.sign_type,
    pay_sign: wx_pay_data.pay_sign,
  };
  
  let profit_sharing = if transactions_jsapi_input.profit_sharing.unwrap_or_default() {
    Some("Y".to_string())
  } else {
    Some("N".to_string())
  };
  
  if amount > u32::MAX as u64 {
    return Err(eyre!("金额超出范围"));
  }
  let amount = amount as u32;
  
  // 创建支付交易
  create_pay_transactions_jsapi(
    PayTransactionsJsapiInput {
      appid: Some(appid),
      mchid: Some(mchid),
      description: Some(description),
      out_trade_no: Some(out_trade_no),
      transaction_id: Some("".to_string()),
      trade_state: Some(PayTransactionsJsapiTradeState::Notpay),
      trade_state_desc: Some("未支付".to_string()),
      time_expire: transactions_jsapi_input.time_expire.clone(),
      attach: transactions_jsapi_input.attach.clone(),
      attach2: Some(transactions_jsapi_input.attach2),
      notify_url: Some(notify_url),
      receipt: transactions_jsapi_input.receipt,
      profit_sharing,
      total_fee: Some(amount),
      openid: Some(openid),
      prepay_id: Some(wx_pay_data.package),
      tenant_id: Some(tenant_id),
      ..Default::default()
    },
    options.clone(),
  ).await?;
  
  Ok(request_payment_options)
}