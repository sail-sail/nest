use anyhow::Result;

use crate::common::context::Ctx;

use crate::gen::base::domain::domain_dao::{
  find_one as find_one_domain,
  validate_option as validate_option_domain,
  validate_is_enabled as validate_is_enabled_domain,
};
use crate::gen::base::domain::domain_model::DomainSearch;

use crate::gen::wxwork::wxw_app::wxw_app_dao::{
  find_one as find_one_wxw_app,
  validate_option as validate_option_wxw_app,
  validate_is_enabled as validate_is_enabled_wxw_app,
};
use crate::gen::wxwork::wxw_app::wxw_app_model::WxwAppSearch;

use crate::gen::wxwork::wxw_usr::wxw_usr_dao::{
  find_one as find_one_wxw_usr,
  validate_option as validate_option_wxw_usr,
};
use crate::gen::wxwork::wxw_usr::wxw_usr_model::WxwUsrSearch;

use crate::gen::hrm::payslip::payslip_dao::{
  find_all as find_all_payslip,
  find_by_id as find_by_id_payslip,
  validate_option as validate_option_payslip,
  update_by_id as update_by_id_payslip,
};
use crate::gen::hrm::payslip::payslip_model::{
  PayslipInput,
  PayslipSearch,
};

use crate::src::wxwork::wxw_msg::wxw_msg_dao::send_card_msg;
use crate::src::wxwork::wxw_msg::wxw_msg_model::SendCardMsgInput;

/// 发送企微工资条
pub async fn send_msg_wxw<'a>(
  ctx: &mut impl Ctx<'a>,
  host: String,
  ids: Vec<String>,
) -> Result<i32> {
  
  let domain_model = find_one_domain(
    ctx,
    DomainSearch {
      lbl: host.into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  let domain_model = validate_option_domain(
    ctx,
    domain_model,
  ).await?;
  validate_is_enabled_domain(
    ctx,
    &domain_model,
  ).await?;
  
  let domain_id = domain_model.id;
  
  let wxw_app_model = find_one_wxw_app(
    ctx,
    WxwAppSearch {
      domain_id: vec![domain_id].into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  let wxw_app_model = validate_option_wxw_app(
    ctx,
    wxw_app_model,
  ).await?;
  validate_is_enabled_wxw_app(
    ctx,
    &wxw_app_model,
  ).await?;
  
  let wxw_app_id = wxw_app_model.id;
  
  let mut num = 0;
  for id in ids {
    let payslip_model = find_by_id_payslip(
      ctx,
      id,
      None,
    ).await?;
    let payslip_model = validate_option_payslip(
      ctx,
      payslip_model,
    ).await?;
    
    let wxw_usr_model = find_one_wxw_usr(
      ctx,
      WxwUsrSearch {
        lbl: payslip_model.lbl.clone().into(),
        ..Default::default()
      }.into(),
      None,
      None,
    ).await?;
    let wxw_usr_model = validate_option_wxw_usr(
      ctx,
      wxw_usr_model,
    ).await?;
    
    let touser = wxw_usr_model.userid;
    let is_succ = send_card_msg(
      ctx,
      SendCardMsgInput {
        wxw_app_id: wxw_app_id.clone(),
        touser,
        title: format!(
          "{pay_month_lbl} 月份工资条",
          pay_month_lbl = payslip_model.pay_month_lbl,
        ),
        description: format!(
          "{lbl} 的 {pay_month_lbl} 月份工资条",
          lbl = payslip_model.lbl,
          pay_month_lbl = payslip_model.pay_month_lbl,
        ),
        url: format!(
          "{protocol}://{lbl}/uni/#/pages/payslip/index?id={id}",
          protocol = domain_model.protocol,
          lbl = domain_model.lbl,
          id = urlencoding::encode(&payslip_model.id),
        ),
        btntxt: "详情".to_owned(),
      },
    ).await?;
    if !is_succ {
      continue;
    }
    num += 1;
  }
  Ok(num)
}

/// 一键发送企微工资条
pub async fn send_msg_wxw_one_key<'a>(
  ctx: &mut impl Ctx<'a>,
  host: String,
) -> Result<i32> {
  let payslip_models = find_all_payslip(
    ctx,
    PayslipSearch {
      is_send: vec![0].into(),
      ..Default::default()
    }.into(),
    None,
    None,
    None,
  ).await?;
  let ids = payslip_models.into_iter()
    .map(|payslip_model| payslip_model.id)
    .collect::<Vec<String>>();
  let num = send_msg_wxw(
    ctx,
    host,
    ids,
  ).await?;
  Ok(num)
}

/// 确认工资条
pub async fn confirm_payslip<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
) -> Result<i32> {
  let payslip_model = find_by_id_payslip(
    ctx,
    id,
    None,
  ).await?;
  let payslip_model = validate_option_payslip(
    ctx,
    payslip_model,
  ).await?;
  
  let id = payslip_model.id;
  
  update_by_id_payslip(
    ctx,
    id,
    PayslipInput {
      is_confirm: 1.into(),
      ..Default::default()
    },
    None,
  ).await?;
  
  Ok(1)
}
