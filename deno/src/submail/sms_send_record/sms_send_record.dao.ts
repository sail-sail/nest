import {
  log,
  error,
} from "/lib/context.ts";

import {
  create as createSmsSendRecord,
  updateById as updateByIdSmsSendRecord,
} from "/gen/submail/sms_send_record/sms_send_record.dao.ts";

import {
  findOne as findOneSmsSendRecord,
  validateOption as validateOptionSmsSendRecord,
} from "/gen/submail/sms_app/sms_app.dao.ts";

import {
  SmsSendRecordStatus,
} from "/gen/types.ts";

import dayjs from "dayjs";

const SMS_URL = "https://api-v4.mysubmail.com/sms/send.json";

/**
 * 发送短信
 * https://www.mysubmail.com/documents/FppOR3
 * @param send_to 接收人手机号
 * @param content 短信内容
 * @param tag 短信标签
 * @returns 是否真正发送成功, 如果处于暂停状态, 则不发送, 返回false, 但会记录发送记录
 */
export async function sendSms(
  send_to: string,
  content: string,
  tag?: string,
  is_log = true,
): Promise<boolean> {
  if (!send_to) {
    throw new Error("手机号不能为空");
  }
  if (!content) {
    throw new Error("短信内容不能为空");
  }
  if (content.length > 1000) {
    throw new Error("短信内容不能超过 1000 个字符");
  }
  const sms_app_model = await validateOptionSmsSendRecord(
    await findOneSmsSendRecord(
      {
        is_enabled: [ 1 ],
      },
    ),
  );
  if (!tag) {
    tag = undefined;
  }
  const appid = sms_app_model.appid;
  const signature = sms_app_model.appkey;
  const sms_app_id = sms_app_model.id;
  const sms_app_id_lbl = sms_app_model.lbl;
  const is_paused = sms_app_model.is_paused;
  const body = {
    appid,
    signature,
    send_to,
    content,
    tag,
  };
  const bodyStr = JSON.stringify(body);
  log("sendSms.body", bodyStr);
  
  if (is_paused && is_log) {
    await createSmsSendRecord({
      sms_app_id,
      sms_app_id_lbl,
      send_to,
      content,
      tag,
      status: SmsSendRecordStatus.Paused,
    });
    return false;
  }
  
  let sms_send_record_id: SmsSendRecordId | undefined;
  
  if (is_log) {
    sms_send_record_id = await createSmsSendRecord({
      sms_app_id,
      sms_app_id_lbl,
      send_to,
      content,
      tag,
      status: SmsSendRecordStatus.Sending,
    });
  }
  
  let data: {
    status: "success" | "error";
    msg?: string;
  } | undefined;
  
  try {
    const res = await fetch(SMS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyStr,
    });
    const dataStr = await res.text();
    log("sendSms.return", dataStr);
    data = JSON.parse(dataStr);
  } catch (err) {
    if (sms_send_record_id) {
      const send_time = dayjs().format("YYYY-MM-DD HH:mm:ss");
      await updateByIdSmsSendRecord(
        sms_send_record_id,
        {
          status: SmsSendRecordStatus.Failure,
          send_time,
          msg: err.message,
        },
      );
    }
    error("sendSms.error", err);
    return false;
  }
  
  if (sms_send_record_id && data) {
    const send_time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    if (data.status === "success") {
      await updateByIdSmsSendRecord(
        sms_send_record_id,
        {
          status: SmsSendRecordStatus.Success,
          send_time,
        },
      );
      return true;
    }
    await updateByIdSmsSendRecord(
      sms_send_record_id,
      {
        status: SmsSendRecordStatus.Failure,
        send_time,
        msg: data.msg,
      },
    );
    return false;
  }
  return true;
}
