
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
