import {
  error,
} from "/lib/context.ts";

import {
  findOne as findOneWxwApp,
} from "/gen/wxwork/wxw_app/wxw_app.dao.ts";

import {
  findById as findByIdPayslip,
} from "/gen/hrm/payslip/payslip.dao.ts"

import {
  findOne as findOneWxwUsr,
} from "/gen/wxwork/wxw_usr/wxw_usr.dao.ts"

import {
  findById as findByIdTenant,
} from "/gen/base/tenant/tenant.dao.ts";

import {
  findAll as findAllDomain,
} from "/gen/base/domain/domain.dao.ts";

import {
  sendCardMsg,
} from "/src/wxwork/wxw_msg/wxw_msg.dao.ts";

/**
 * 发送企微工资条消息
 */
export async function sendMsgWxw(
  ids: string[],
) {
  // TODO 业务选项 里面配置用哪个企微应用发送工资条消息
  const wxw_appModel = await findOneWxwApp();
  if (!wxw_appModel || !wxw_appModel.corpid || !wxw_appModel.agentid) {
    throw `企微应用未配置`;
  }
  if (!wxw_appModel.is_enabled) {
    throw `企微应用已禁用 ${ wxw_appModel.lbl }`;
  }
  const wxw_app_id = wxw_appModel.id;
  const tenant_id = wxw_appModel.tenant_id;
  const tenantModel = await findByIdTenant(tenant_id);
  if (!tenantModel) {
    throw `租户不存在 ${ tenant_id }`;
  }
  const domain_ids = tenantModel.domain_ids;
  if (!domain_ids || domain_ids.length === 0) {
    throw `租户未配置域名 ${ tenantModel.lbl }`;
  }
  const domainModels = await findAllDomain({
    ids: domain_ids,
  });
  const domainModel = domainModels.find((item) => item.is_default);
  if (!domainModel) {
    throw `租户的默认域名不存在 ${ tenantModel.lbl }`;
  }
  let num = 0;
  for (const id of ids) {
    const payslipModel = await findByIdPayslip(id);
    if (!payslipModel) {
      continue;
    }
    const wxw_usrModel = await findOneWxwUsr({
      wxw_app_id: [ wxw_app_id ],
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
      // TODO 协议字段 protocol=https:
      url: `https://${ domainModel.lbl }/uni/#/pages/payslip/index?id=${ encodeURIComponent(payslipModel.id) }`,
      btntxt: `详情`,
    });
    if (isSucc) {
      num++;
    }
  }
  return num;
}
