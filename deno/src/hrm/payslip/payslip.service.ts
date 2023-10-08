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
  findOne as findOneDomain,
  validateOption as validateOptionDomain,
  validateIsEnabled as validateIsEnabledDomain,
} from "/gen/base/domain/domain.dao.ts";

import {
  sendCardMsg,
} from "/src/wxwork/wxw_msg/wxw_msg.dao.ts";

/**
 * 发送企微工资条消息
 */
export async function sendMsgWxw(
  host: string,
  ids: string[],
) {
  
  // 获取域名
  const domainModel = await validateOptionDomain(
    await findOneDomain({
      lbl: host,
    }),
  );
  await validateIsEnabledDomain(domainModel);
  
  const domain_id = domainModel.id;
  
  // 获取企微应用
  const wxw_appModel = await validateOptionWxwApp(
    await findOneWxwApp({
      domain_id: [ domain_id ],
    }),
  );
  await validateIsEnabledWxwApp(wxw_appModel);
  
  const wxw_app_id = wxw_appModel.id;
  
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
