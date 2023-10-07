import {
  error,
} from "/lib/context.ts";

import {
  findOne as findOneWxwApp,
  validateOption as validateOptionWxwApp,
  validateIsEnabled as validateIsEnabledWxwApp,
} from "/gen/wxwork/wxw_app/wxw_app.dao.ts";

import {
  findById as findByIdPayslip,
} from "/gen/hrm/payslip/payslip.dao.ts"

import {
  findOne as findOneWxwUsr,
} from "/gen/wxwork/wxw_usr/wxw_usr.dao.ts"

import {
  findById as findByIdTenant,
  validateOption as validateOptionTenant,
  validateIsEnabled as validateIsEnabledTenant,
} from "/gen/base/tenant/tenant.dao.ts";

import {
  findOne as findOneDomain,
  validateOption as validateOptionDomain,
  validateIsEnabled as validateIsEnabledDomain,
} from "/gen/base/domain/domain.dao.ts";

import {
  sendCardMsg,
} from "/src/wxwork/wxw_msg/wxw_msg.dao.ts";

import {
  findOne as findOneOptbiz,
  validateOption as validateOptionOptbiz,
  validateIsEnabled as validateIsEnabledOptbiz,
} from "/gen/base/optbiz/optbiz.dao.ts";

/**
 * 发送企微工资条消息
 */
export async function sendMsgWxw(
  host: string,
  ids: string[],
) {
  const optbizModel = await validateOptionOptbiz(
    await findOneOptbiz({
      lbl: "企微应用-发送工资",
    }),
  );
  await validateIsEnabledOptbiz(optbizModel);
  
  const wxw_app_lbl = optbizModel.lbl;
  if (!wxw_app_lbl) {
    throw `业务选项未配置 企微应用-发送工资 的企微应用名称`;
  }
  const wxw_appModel = await validateOptionWxwApp(
    await findOneWxwApp({
      lbl: wxw_app_lbl,
    }),
  );
  await validateIsEnabledWxwApp(wxw_appModel);
  
  const wxw_app_id = wxw_appModel.id;
  const tenant_id = wxw_appModel.tenant_id;
  const tenantModel = await validateOptionTenant(
    await findByIdTenant(tenant_id),
  );
  await validateIsEnabledTenant(tenantModel);
  
  const domain_ids = tenantModel.domain_ids;
  if (!domain_ids || domain_ids.length === 0) {
    throw `租户未配置域名 ${ tenantModel.lbl }`;
  }
  const domainModel = await validateOptionDomain(
    await findOneDomain({
      ids: domain_ids,
      lbl: host,
    }),
  );
  await validateIsEnabledDomain(domainModel);
  let num = 0;
  for (const id of ids) {
    const payslipModel = await findByIdPayslip(id);
    if (!payslipModel) {
      continue;
    }
    const wxw_usrModel = await findOneWxwUsr({
      lbl: payslipModel.lbl,
    });
    if (!wxw_usrModel || !wxw_usrModel.userid) {
      error(`sendMsgWxw: 企微用户不存在: ${ payslipModel.lbl }`);
      throw `企微用户不存在: ${ payslipModel.lbl }`;
    }
    const touser = wxw_usrModel.userid;
    const isSucc = await sendCardMsg({
      wxw_app_id,
      touser,
      title: `${ payslipModel.pay_month_lbl } 月份工资条`,
      description: `${ wxw_usrModel.lbl } 的 ${ payslipModel.pay_month_lbl } 月份工资条`,
      url: `${ domainModel.protocol }://${ domainModel.lbl }/uni/#/pages/payslip/index?id=${ encodeURIComponent(payslipModel.id) }`,
      btntxt: `详情`,
    });
    if (isSucc) {
      num++;
    }
  }
  return num;
}
