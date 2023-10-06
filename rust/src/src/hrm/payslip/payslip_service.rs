use anyhow::{Result, anyhow};

use crate::common::context::Ctx;

use crate::gen::base::tenant::tenant_dao::{
  find_by_id as find_by_id_tenant,
  validate_option as validate_option_tenant,
  validate_is_enabled as validate_is_enabled_tenant,
};
use crate::gen::base::domain::domain_dao::{
  find_one as find_one_domain,
  validate_option as validate_option_domain,
  validate_is_enabled as validate_is_enabled_domain,
};
use crate::gen::base::domain::domain_model::DomainSearch;

use crate::gen::base::optbiz::optbiz_dao::{
  find_one as find_one_optbiz,
  validate_option as validate_option_optbiz,
};
use crate::gen::base::optbiz::optbiz_model::OptbizSearch;

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
  find_by_id as find_by_id_payslip,
  validate_option as validate_option_payslip,
};

use crate::src::wxwork::wxw_msg::wxw_msg_dao::send_card_msg;
use crate::src::wxwork::wxw_msg::wxw_msg_model::SendCardMsgInput;

/// 发送企微工资条
pub async fn send_msg_wxw<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
) -> Result<i32> {
  let optbiz_model = find_one_optbiz(
    ctx,
    OptbizSearch {
      lbl: "企微应用-发送工资".to_owned().into(),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  let optbiz_model = validate_option_optbiz(
    ctx,
    optbiz_model,
  ).await?;
  let wxw_app_lbl = optbiz_model.lbl;
  if wxw_app_lbl.is_empty() {
    return Err(anyhow!("业务选项未配置 企微应用-发送工资 的企微应用名称"));
  }
  let wxw_app_model = find_one_wxw_app(
    ctx,
    WxwAppSearch {
      lbl: wxw_app_lbl.into(),
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
  let tenant_id = wxw_app_model.tenant_id;
  let tenant_model = find_by_id_tenant(
    ctx,
    tenant_id.into(),
    None,
  ).await?;
  let tenant_model = validate_option_tenant(
    ctx,
    tenant_model,
  ).await?;
  validate_is_enabled_tenant(
    ctx,
    &tenant_model,
  ).await?;
  let domain_ids = tenant_model.domain_ids;
  if domain_ids.len() == 0 {
    return Err(anyhow!(
      "租户未配置域名 {lbl}",
      lbl = tenant_model.lbl,
    ));
  }
  let domain_model = find_one_domain(
    ctx,
    DomainSearch {
      ids: domain_ids.into(),
      is_default: vec![1].into(),
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
  let mut num = 0;
  for id in ids {
    let payslip_model = find_by_id_payslip(
      ctx,
      id.into(),
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
