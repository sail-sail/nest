use color_eyre::eyre::Result;
use tracing::{info, error};

use chrono::NaiveDate;

use generated::common::context::{
  Options,
  get_req_id,
};

use smol_str::SmolStr;

use generated::common::wx_pay::decode::{
  decode_wx_refund,
  WxRefundNotify,
  WxRefundResource,
};

use rust_decimal::Decimal;

// wx_pay
use generated::wx::wx_pay::wx_pay_dao::find_one_wx_pay;
use generated::wx::wx_pay::wx_pay_model::WxPaySearch;

// wx_refund_notice (generated dao)
use generated::wx::wx_refund_notice::wx_refund_notice_dao::create_wx_refund_notice;
use generated::wx::wx_refund_notice::wx_refund_notice_service::update_tenant_by_id_wx_refund_notice;
use generated::wx::wx_refund_notice::wx_refund_notice_model::{
  WxRefundNoticeInput,
  WxRefundNoticeRefundStatus,
};

// wx_refund (generated dao)
use generated::wx::wx_refund::wx_refund_dao::{
  find_one_wx_refund,
  update_by_id_wx_refund,
};
use generated::wx::wx_refund::wx_refund_model::{
  WxRefundInput,
  WxRefundStatus,
};

static REFUND_NOTIFY_URL: &str = "/api/wx_pay/wx_refund_notice";

/// 微信退款通知
pub async fn wx_refund_notify(
  wx_refund_notify: WxRefundNotify,
  options: Option<Options>,
) -> Result<()> {
  
  info!(
    "{req_id} wx_refund_notify: {wx_refund_notify:?}",
    req_id = get_req_id(),
  );

  let wx_pay_model = find_one_wx_pay(
    Some(WxPaySearch {
      refund_notify_url: Some(REFUND_NOTIFY_URL.into()),
      ..Default::default()
    }),
    None,
    options,
  ).await?;
  
  let wx_pay_model = match wx_pay_model {
    Some(model) => model,
    None => {
      error!(
        "{req_id} No matching wx_pay_model found for refund_notify_url: {REFUND_NOTIFY_URL}",
        req_id = get_req_id(),
      );
      return Ok(());
    }
  };

  let v3_key = wx_pay_model.v3_key;
  
  if v3_key.is_empty() {
    error!(
      "{req_id} v3_key is empty for wx_pay_model with refund_notify_url: {REFUND_NOTIFY_URL}",
      req_id = get_req_id(),
    );
    return Ok(());
  }

  let wx_refund_resource: WxRefundResource = decode_wx_refund(
    &v3_key,
    wx_refund_notify,
  )?;

  info!(
    "{req_id} wx_refund_resource: {wx_refund_resource:?}",
    req_id = get_req_id()
  );

  // 提取字段
  let refund_id = SmolStr::new(&wx_refund_resource.refund_id);
  let out_refund_no = SmolStr::new(&wx_refund_resource.out_refund_no);
  let out_trade_no = SmolStr::new(&wx_refund_resource.out_trade_no);
  let transaction_id = SmolStr::new(&wx_refund_resource.transaction_id);
  let user_received_account = SmolStr::new(&wx_refund_resource.user_received_account);

  let success_time = wx_refund_resource.success_time
    .map(|s| chrono::NaiveDateTime::parse_from_str(&s, "%Y-%m-%dT%H:%M:%S%z"))
    .transpose()?;
  
  if wx_refund_resource.amount.refund > u32::MAX as u64 ||
    wx_refund_resource.amount.payer_refund > u32::MAX as u64
  {
    error!(
      "{req_id} Refund amounts exceed u32::MAX: refund={refund}, payer_refund={payer_refund}",
      req_id = get_req_id(),
      refund = wx_refund_resource.amount.refund,
      payer_refund = wx_refund_resource.amount.payer_refund,
    );
    return Ok(());
  }
  
  // amounts: already 分
  let amount_refund = wx_refund_resource.amount.refund as u32;
  let amount_payer_refund = wx_refund_resource.amount.payer_refund as u32;
  
  // refund_status (enum in resource)
  let refund_status = match wx_refund_resource.refund_status {
    generated::common::wx_pay::RefundStatus::SUCCESS => WxRefundNoticeRefundStatus::Success,
    generated::common::wx_pay::RefundStatus::CLOSED => WxRefundNoticeRefundStatus::Closed,
    generated::common::wx_pay::RefundStatus::PROCESSING => WxRefundNoticeRefundStatus::Processing,
    _ => WxRefundNoticeRefundStatus::Abnormal,
  };

  // 根据 transaction_id 查询 wx_refund，更新其状态
  let wx_refund_model = find_one_wx_refund(
    Some(generated::wx::wx_refund::wx_refund_model::WxRefundSearch {
      transaction_id: Some(transaction_id.clone()),
      ..Default::default()
    }),
    None,
    options,
  ).await?;
  
  let wx_refund_model = match wx_refund_model {
    Some(model) => model,
    None => {
      error!(
        "{req_id} No matching wx_refund_model found for transaction_id: {transaction_id}",
        req_id = get_req_id(),
        transaction_id = transaction_id,
      );
      return Ok(());
    }
  };
  
  let appid = wx_refund_model.appid;
  let mchid = wx_refund_model.mchid;
  let tenant_id = wx_refund_model.tenant_id;
  let attach2 = wx_refund_model.attach2;
  
  let wx_refund_notice_id = create_wx_refund_notice(
    WxRefundNoticeInput {
      appid: Some(appid),
      mchid: Some(mchid),
      tenant_id: Some(tenant_id),
      refund_id: Some(refund_id.clone()),
      out_trade_no: Some(out_trade_no.clone()),
      transaction_id: Some(transaction_id),
      out_refund_no: Some(out_refund_no),
      refund_status: Some(refund_status),
      success_time,
      user_received_account: Some(user_received_account),
      amount_refund: Some(amount_refund),
      amount_payer_refund: Some(amount_payer_refund),
      create_time: Some(chrono::Local::now().naive_local()),
      ..Default::default()
    },
    options,
  ).await?;
  
  update_tenant_by_id_wx_refund_notice(
    wx_refund_notice_id,
    tenant_id,
    options,
  ).await?;
  
  // 更新 wx_refund 的状态
  update_by_id_wx_refund(
    wx_refund_model.id,
    WxRefundInput {
      refund_id: Some(refund_id),
      out_trade_no: Some(out_trade_no),
      status: Some(match refund_status {
        WxRefundNoticeRefundStatus::Success => WxRefundStatus::Success,
        WxRefundNoticeRefundStatus::Closed => WxRefundStatus::Closed,
        WxRefundNoticeRefundStatus::Processing => WxRefundStatus::Processing,
        WxRefundNoticeRefundStatus::Abnormal => WxRefundStatus::Abnormal,
        _ => WxRefundStatus::NoRefund,
      }),
      success_time,
      ..Default::default()
    },
    options,
  ).await?;
  
  if refund_status != WxRefundNoticeRefundStatus::Success {
    error!(
      "{req_id} Refund status is not success: {refund_status:?}",
      req_id = get_req_id(),
      refund_status = refund_status,
    );
    return Ok(());
  }
  
  if attach2.is_empty() {
    error!(
      "{req_id} pay_notice_attach2: attach2 is empty",
      req_id = get_req_id(),
    );
    return Ok(());
  }
  
  let attach2_obj: serde_json::Value = serde_json::from_str(&attach2)?;
  let action = attach2_obj["action"].as_str().unwrap_or_default();
  let payload = &attach2_obj["payload"];
  
  let amt = Decimal::from(amount_refund) / Decimal::from(100);
  
  info!(
    "{req_id} refund_notice_attach2: amt: {amt} {attach2:?}",
    req_id = get_req_id(),
    attach2 = attach2_obj,
  );
  
  if action == "Test" {
    info!(
      "{req_id} refund notice action: {action} payload: {payload:?} wx_refund_notice_id: {wx_refund_notice_id}",
      req_id = get_req_id(),
    );
    return Ok(());
  }
  
  Ok(())
}
