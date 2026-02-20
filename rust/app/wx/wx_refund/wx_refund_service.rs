use color_eyre::eyre::{Result, eyre};
use tracing::info;

use generated::common::context::{
  Options,
  get_req_id,
  get_short_uuid,
};

use smol_str::SmolStr;

use generated::common::wx_pay::{
  WxPay,
  Refund,
  RefundAmount,
  RefundStatus,
};

// wx_pay
use generated::wx::wx_pay::wx_pay_dao::{
  find_one_wx_pay,
  validate_option_wx_pay,
  validate_is_enabled_wx_pay,
};
use generated::wx::wx_pay::wx_pay_model::WxPaySearch;

// base_domain
use generated::base::domain::domain_dao::{
  find_by_id_ok_domain,
  validate_is_enabled_domain,
};

// base_tenant
use generated::base::tenant::tenant_dao::{
  find_by_id_tenant,
  validate_option_tenant,
  validate_is_enabled_tenant,
};

// wx_refund (generated dao)
use generated::wx::wx_refund::wx_refund_dao::{
  create_wx_refund,
  find_one_wx_refund,
  validate_option_wx_refund,
};
use generated::wx::wx_refund::wx_refund_model::{
  WxRefundId,
  WxRefundInput,
  WxRefundChannel,
  WxRefundStatus,
  WxRefundFundsAccount,
  WxRefundAmountCurrency,
  WxRefundSearch,
  WxRefundModel,
};

// oss
use generated::common::oss::oss_dao::get_object;

use num_traits::ToPrimitive;

use generated::common::exceptions::service_exception::ServiceException;

use generated::wx::pay_transactions_jsapi::pay_transactions_jsapi_dao::find_one_ok_pay_transactions_jsapi;
use generated::wx::pay_transactions_jsapi::pay_transactions_jsapi_model::PayTransactionsJsapiSearch;

/// 发起退款申请
#[allow(dead_code)]
#[function_name::named]
pub async fn refund(
  input: WxRefundInput,
  options: Option<Options>,
) -> Result<WxRefundId> {

  info!(
    "{req_id} {function_name}: input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );

  // 查找并校验 wx_pay 配置
  let wx_pay_model = validate_option_wx_pay(
    find_one_wx_pay(
      Some(WxPaySearch {
        ..Default::default()
      }),
      None,
      options,
    ).await?,
  ).await?;

  validate_is_enabled_wx_pay(&wx_pay_model).await?;
  
  let appid = wx_pay_model.appid;
  let tenant_id = wx_pay_model.tenant_id;
  
  if tenant_id.is_empty() {
    return Err(eyre!(ServiceException {
      message: "tenant_id 不能为空".into(),
      trace: true,
      ..Default::default()
    }));
  }
  
  let tenant_model = validate_option_tenant(
    find_by_id_tenant(
      tenant_id,
      options,
    ).await?
  ).await?;
  
  validate_is_enabled_tenant(
    &tenant_model,
  ).await?;
  
  let domain_ids = tenant_model.domain_ids;
  
  let domain_id = if domain_ids.is_empty() {
    return Err(eyre!(ServiceException {
      message: "domain_ids 不能为空".into(),
      trace: true,
      ..Default::default()
    }));
  } else {
    domain_ids[0]
  };
  
  let domain_model = find_by_id_ok_domain(
    domain_id,
    options,
  ).await?;
  
  validate_is_enabled_domain(
    &domain_model,
  ).await?;
  
  let domain_protocol = domain_model.protocol;
  let domain_lbl = domain_model.lbl;
  
  if domain_protocol.is_empty() {
    return Err(eyre!(ServiceException {
      message: "domain_protocol 不能为空".into(),
      trace: true,
      ..Default::default()
    }));
  }
  
  if domain_lbl.is_empty() {
    return Err(eyre!(ServiceException {
      message: "domain_lbl 不能为空".into(),
      trace: true,
      ..Default::default()
    }));
  }
  
  let refund_notify_url = wx_pay_model.refund_notify_url;
  
  if refund_notify_url.is_empty() {
    return Err(eyre!(ServiceException {
      message: "refund_notify_url 不能为空".into(),
      trace: true,
      ..Default::default()
    }));
  }
  
  let refund_notify_url = SmolStr::new(format!("{domain_protocol}://{domain_lbl}{refund_notify_url}"));

  // 私钥
  let private_key_str: Option<String> = {
    if wx_pay_model.private_key.is_empty() {
      None
    } else {
      let data = get_object(wx_pay_model.private_key.as_str()).await?;
      if let Some(data) = data {
        Some(String::from_utf8(data.into())?)
      } else {
        None
      }
    }
  };
  
  let private_key = private_key_str
    .filter(|s| !s.is_empty())
    .ok_or_else(|| eyre!(ServiceException {
      message: "私钥不存在".into(),
      trace: true,
      ..Default::default()
    }))?;

  let wxpay = WxPay {
    appid: appid.as_str(),
    mchid: wx_pay_model.mchid.as_str(),
    private_key: private_key.as_str(),
    serial_no: wx_pay_model.serial_no.as_str(),
    api_v3_private_key: wx_pay_model.v3_key.as_str(),
    notify_url: refund_notify_url.as_str(),
  };

  let out_refund_no = get_short_uuid()
    .replace("+", "-")
    .replace("/", "_")
    .replace("=", "");

  let amount_refund = input.amount_refund
    .ok_or_else(|| eyre!(ServiceException {
      message: "退款金额计算错误".into(),
      trace: true,
      ..Default::default()
    }))?
    .to_u64()
    .ok_or_else(|| eyre!(ServiceException {
      message: "退款金额计算错误".into(),
      trace: true,
      ..Default::default()
    }))?;

  // amount_total: 若未传入, 报错
  let amount_total = input.amount_total
    .ok_or_else(|| eyre!(ServiceException {
      message: "订单总金额不能为空".into(),
      trace: true,
      ..Default::default()
    }))?
    .to_u64()
    .ok_or_else(|| eyre!(ServiceException {
      message: "订单总金额计算错误".into(),
      trace: true,
      ..Default::default()
    }))?;
  
  if amount_total == 0 {
    return Err(eyre!(ServiceException {
      message: "订单总金额必须大于0".into(),
      trace: true,
      ..Default::default()
    }));
  }
  
  let transaction_id = match input.transaction_id {
    Some(transaction_id) => transaction_id,
    _ => return Err(eyre!(ServiceException {
      message: "微信支付订单号不能为空".into(),
      trace: true,
      ..Default::default()
    })),
  };
  
  // 通过 transaction_id 查找微信商户订单
  let pay_transactions_jsapi_model = find_one_ok_pay_transactions_jsapi(
    Some(PayTransactionsJsapiSearch {
      transaction_id: Some(transaction_id.clone()),
      ..Default::default()
    }),
    None,
    options,
  ).await?;
  
  let out_trade_no = pay_transactions_jsapi_model.out_trade_no;
  
  if out_trade_no.is_empty() {
    return Err(eyre!(ServiceException {
      message: "微信支付订单号对应的商户订单号不能为空".into(),
      trace: true,
      ..Default::default()
    }));
  }

  // 构造 Refund 请求
  let refund_req = Refund {
    transaction_id: Some(transaction_id.to_string()),
    out_trade_no: Some(out_trade_no.to_string()),
    out_refund_no: out_refund_no.to_string(),
    reason: input.reason
      .clone()
      .map(|x| x.to_string()),
    notify_url: Some(refund_notify_url.to_string()),
    funds_account: input.funds_account
      .map(|x| x.to_string()),
    amount: RefundAmount {
      refund: amount_refund,
      total: amount_total,
      currency: "CNY".to_string(),
      ..Default::default()
    },
    goods_detail: None,
  };
  
  // 调用微信退款接口
  let refund_detail = wxpay.refund(&refund_req).await?;
  
  let status: WxRefundStatus = match refund_detail.status {
    RefundStatus::SUCCESS => WxRefundStatus::Success,
    RefundStatus::CLOSED => WxRefundStatus::Closed,
    RefundStatus::PROCESSING => WxRefundStatus::Processing,
    RefundStatus::ABNORMAL => WxRefundStatus::Abnormal,
  };
  
  let channel: WxRefundChannel = refund_detail
    .channel
    .as_str()
    .try_into()
    .unwrap_or_else(|_| Default::default());
  
  let funds_account: Option<WxRefundFundsAccount> = refund_detail
    .funds_account
    .as_deref()
    .and_then(|s| s.try_into().ok());
  
  let create_time = chrono::NaiveDateTime::parse_from_str(&refund_detail.create_time, "%Y-%m-%dT%H:%M:%S%z")?;
  let success_time = refund_detail.success_time
    .map(|s| chrono::NaiveDateTime::parse_from_str(&s, "%Y-%m-%dT%H:%M:%S%z")).transpose()?;
  
  let wx_refund_input = WxRefundInput {
    appid: Some(appid),
    mchid: Some(wx_pay_model.mchid),
    out_trade_no: Some(SmolStr::new(&refund_detail.out_trade_no)),
    transaction_id: Some(SmolStr::new(&refund_detail.transaction_id)),
    out_refund_no: Some(SmolStr::new(&refund_detail.out_refund_no)),
    refund_id: refund_detail.refund_id.map(SmolStr::new),
    reason: input.reason,
    attach2: input.attach2,
    notify_url: Some(refund_notify_url),
    channel: Some(channel),
    user_received_account: Some(SmolStr::new(refund_detail.user_received_account)),
    success_time,
    status: Some(status),
    funds_account,
    amount_total: Some(refund_detail.amount.total as u32),
    amount_refund: Some(refund_detail.amount.refund as u32),
    amount_payer_total: refund_detail.amount.payer_total.map(|v| v as u32),
    amount_payer_refund: refund_detail.amount.payer_refund.map(|v| v as u32),
    amount_settlement_refund: refund_detail.amount.settlement_refund.map(|v| v as u32),
    amount_discount_refund: refund_detail.amount.discount_refund.map(|v| v as u32),
    amount_currency: Some(WxRefundAmountCurrency::Cny),
    amount_refund_fee: refund_detail.amount.refund_fee.map(|v| v as u32),
    create_time: Some(create_time),
    ..Default::default()
  };

  let wx_refund_id = create_wx_refund(
    wx_refund_input,
    options,
  ).await?;

  Ok(wx_refund_id)
}

/// 查询退款状态
pub async fn trade_state_wx_refund(
  search: Option<WxRefundSearch>,
  options: Option<Options>,
) -> Result<WxRefundModel> {
  
  let wx_refund_model = validate_option_wx_refund(
    find_one_wx_refund(
      search,
      None,
      options,
    ).await?,
  ).await?;
  
  let wx_refund_status = wx_refund_model.status;
  
  if wx_refund_status != WxRefundStatus::Processing {
    return Ok(WxRefundModel {
      status: wx_refund_status,
      ..Default::default()
    });
  }
  
  let id = wx_refund_model.id;
  
  // 循环检查退款状态20次, 每次间隔500毫秒
  for _ in 0..20 {
    let wx_refund_model = validate_option_wx_refund(
      find_one_wx_refund(
        Some(WxRefundSearch {
          id: Some(id),
          ..Default::default()
        }),
        None,
        options,
      ).await?,
    ).await?;
    
    if wx_refund_model.status != WxRefundStatus::Processing {
      return Ok(wx_refund_model);
    }
    
    tokio::time::sleep(std::time::Duration::from_millis(500)).await;
  }
  
  Ok(WxRefundModel {
    status: wx_refund_model.status,
    ..Default::default()
  })
}
