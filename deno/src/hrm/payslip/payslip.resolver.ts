
/**
 * 发送企微工资条消息
 */
export async function sendMsgWxw(
  host: string,
  ids: string[],
) {
  const {
    sendMsgWxw,
  } = await import("./payslip.service.ts");
  
  const num = await sendMsgWxw(host, ids);
  return num;
}

/**
 * 一键发送企微工资条消息
 */
export async function sendMsgWxwOneKey(
  host: string,
) {
  const {
    sendMsgWxwOneKey,
  } = await import("./payslip.service.ts");
  
  const num = await sendMsgWxwOneKey(host);
  return num;
}

/**
 * 确认工资条
 */
export async function confirmPayslip(
  id: string,
) {
  const {
    confirmPayslip,
  } = await import("./payslip.service.ts");
  
  const num = await confirmPayslip(id);
  return num;
}
