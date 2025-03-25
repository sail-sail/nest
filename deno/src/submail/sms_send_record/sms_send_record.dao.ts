import {
  log,
  error,
} from "/lib/context.ts";

import {
  createSmsSendRecord,
  updateByIdSmsSendRecord,
} from "/gen/submail/sms_send_record/sms_send_record.dao.ts";

import {
  findOneSmsApp,
  validateOptionSmsApp,
} from "/gen/submail/sms_app/sms_app.dao.ts";

import {
  SmsSendRecordStatus,
} from "/gen/types.ts";

import dayjs from "dayjs";

import {
  getDict,
} from "/src/base/dict_detail/dict_detail.dao.ts";

const SMS_URL = "https://api-v4.mysubmail.com/sms/send.json";

const XSMS_URL = "https://api-v4.mysubmail.com/sms/xsend.json";

/**
 * 发送模板短信
 * https://www.mysubmail.com/documents/OOVyh
 */
export async function xsendSms(
  send_to: string,
  project: string,
  vars: Record<string, string>,
  tag?: string,
  is_log = true,
): Promise<boolean> {
  if (!send_to) {
    throw new Error("手机号不能为空");
  }
  
  const [
    status_dict_models,
  ] = await getDict([
    "submail_sms_send_record_status",
  ]);
  
  const sms_app_model = await validateOptionSmsApp(
    await findOneSmsApp(
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
  const tenant_id = sms_app_model.tenant_id;
  
  if (is_paused && is_log) {
    const status = SmsSendRecordStatus.Paused;
    const status_lbl = status_dict_models.find((item) => item.val === status)?.lbl;
    await createSmsSendRecord({
      sms_app_id,
      sms_app_id_lbl,
      send_to,
      send_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      content: JSON.stringify({
        project,
        vars,
      }),
      tag,
      status,
      status_lbl,
      tenant_id,
    });
    return false;
  }
  
  let sms_send_record_id: SmsSendRecordId | undefined;
  
  if (is_log) {
    const status = SmsSendRecordStatus.Sending;
    const status_lbl = status_dict_models.find((item) => item.val === status)?.lbl;
    sms_send_record_id = await createSmsSendRecord({
      sms_app_id,
      sms_app_id_lbl,
      send_to,
      content: JSON.stringify({
        project,
        vars,
      }),
      tag,
      status,
      status_lbl,
      tenant_id,
    });
  }
  
  let data: {
    status: "success" | "error";
    msg?: string;
  } | undefined;
  
  try {
    const body = {
      appid,
      signature,
      to: send_to,
      project,
      vars: JSON.stringify(vars),
      tag,
    };
    const bodyStr = JSON.stringify(body);
    log("xsendSms.body", bodyStr);
    const res = await fetch(XSMS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyStr,
    });
    const dataStr = await res.text();
    log("xsendSms.return", dataStr);
    data = JSON.parse(dataStr);
  } catch (err0) {
    const err = err0 as Error;
    if (sms_send_record_id) {
      const send_time = dayjs().format("YYYY-MM-DD HH:mm:ss");
      const status = SmsSendRecordStatus.Failure;
      const status_lbl = status_dict_models.find((item) => item.val === status)?.lbl;
      await updateByIdSmsSendRecord(
        sms_send_record_id,
        {
          status,
          status_lbl,
          send_time,
          msg: err.message,
        },
      );
    }
    error("xsendSms.error", err);
    return false;
  }
  
  if (sms_send_record_id && data) {
    const send_time = dayjs().format("YYYY-MM-DD HH:mm:ss");
    if (data.status === "success") {
      const status = SmsSendRecordStatus.Success;
      const status_lbl = status_dict_models.find((item) => item.val === status)?.lbl;
      await updateByIdSmsSendRecord(
        sms_send_record_id,
        {
          status,
          status_lbl,
          send_time,
        },
      );
      return true;
    }
    const status = SmsSendRecordStatus.Failure;
    const status_lbl = status_dict_models.find((item) => item.val === status)?.lbl;
    await updateByIdSmsSendRecord(
      sms_send_record_id,
      {
        status,
        status_lbl,
        send_time,
        msg: data.msg,
      },
    );
    return false;
  }
  return true;
}

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
  
  const [
    status_dict_models,
  ] = await getDict([
    "submail_sms_send_record_status",
  ]);
  
  const sms_app_model = await validateOptionSmsApp(
    await findOneSmsApp(
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
  const tenant_id = sms_app_model.tenant_id;
  
  if (is_paused && is_log) {
    const status = SmsSendRecordStatus.Paused;
    const status_lbl = status_dict_models.find((item) => item.val === status)?.lbl;
    await createSmsSendRecord({
      sms_app_id,
      sms_app_id_lbl,
      send_to,
      send_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      content,
      tag,
      status,
      status_lbl,
      tenant_id,
    });
    return false;
  }
  
  let sms_send_record_id: SmsSendRecordId | undefined;
  
  if (is_log) {
    const status = SmsSendRecordStatus.Sending;
    const status_lbl = status_dict_models.find((item) => item.val === status)?.lbl;
    sms_send_record_id = await createSmsSendRecord({
      sms_app_id,
      sms_app_id_lbl,
      send_to,
      content,
      tag,
      status,
      status_lbl,
      tenant_id,
    });
  }
  
  let data: {
    status: "success" | "error";
    msg?: string;
  } | undefined;
  
  try {
    const body = {
      appid,
      signature,
      to: send_to,
      content,
      tag,
    };
    const bodyStr = JSON.stringify(body);
    log("sendSms.body", bodyStr);
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
  } catch (err0) {
    const err = err0 as Error;
    if (sms_send_record_id) {
      const send_time = dayjs().format("YYYY-MM-DD HH:mm:ss");
      const status = SmsSendRecordStatus.Failure;
      const status_lbl = status_dict_models.find((item) => item.val === status)?.lbl;
      await updateByIdSmsSendRecord(
        sms_send_record_id,
        {
          status,
          status_lbl,
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
      const status = SmsSendRecordStatus.Success;
      const status_lbl = status_dict_models.find((item) => item.val === status)?.lbl;
      await updateByIdSmsSendRecord(
        sms_send_record_id,
        {
          status,
          status_lbl,
          send_time,
        },
      );
      return true;
    }
    const status = SmsSendRecordStatus.Failure;
    const status_lbl = status_dict_models.find((item) => item.val === status)?.lbl;
    await updateByIdSmsSendRecord(
      sms_send_record_id,
      {
        status,
        status_lbl,
        send_time,
        msg: data.msg,
      },
    );
    return false;
  }
  return true;
}
