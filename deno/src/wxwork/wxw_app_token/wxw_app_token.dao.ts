import {
  error,
  log,
} from "/lib/context.ts";
 
import {
  isEmpty,
} from "/lib/util/string_util.ts";
 
import dayjs from "dayjs";

import {
  findOneWxwAppToken,
  createWxwAppToken,
  updateByIdWxwAppToken,
  validateOptionWxwAppToken,
} from "/gen/wxwork/wxw_app_token/wxw_app_token.dao.ts";

import {
  findByIdWxwApp,
  validateOptionWxwApp,
  validateIsEnabledWxwApp,
} from "/gen/wxwork/wxw_app/wxw_app.dao.ts";

import {
  sha1,
} from "./sha1.ts";

export async function getAccessToken(
  wxw_app_id: WxwAppId,
  force = false,
) {
  // 获取企微应用
  const wx_app_model = await validateOptionWxwApp(
    await findByIdWxwApp(wxw_app_id)
  );
  await validateIsEnabledWxwApp(wx_app_model);
  const corpid = wx_app_model.corpid;
  const corpsecret = wx_app_model.corpsecret;
  if (isEmpty(corpid) || isEmpty(corpsecret)) {
    throw `未设置 企微应用 密钥 ${ wx_app_model.lbl }`;
  }
  
  const wx_app_token_model = await findOneWxwAppToken(
    {
      wxw_app_id: [ wxw_app_id ],
      type: "corp",
    },
  );
  if (!wx_app_token_model) {
    const url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${
      encodeURIComponent(corpid)
    }&corpsecret=${
      encodeURIComponent(corpsecret)
    }`;
    const res = await fetch(url);
    const data: {
      errcode: number;
      errmsg: string;
      access_token: string;
      expires_in: number;
    } = await res.json();
    const errcode = data.errcode;
    if (errcode != 0) {
      error(data);
      throw new Error(data.errmsg);
    }
    if (isEmpty(data?.access_token)) {
      throw `企业微信应用 获取 access_token 失败: ${ url }`;
    }
    await createWxwAppToken(
      {
        wxw_app_id,
        type: "corp",
        access_token: data.access_token,
        expires_in: data.expires_in,
        token_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        tenant_id: wx_app_model.tenant_id!,
      },
    );
    return data.access_token;
  }
  const access_token = wx_app_token_model.access_token;
  const expires_in = wx_app_token_model.expires_in ?? 0;
  const token_time = dayjs(wx_app_token_model.token_time);
  const dateNow = dayjs();
  if (
    force
    || !(expires_in > 0)
    || !access_token
    || !wx_app_token_model.token_time
    || token_time.add(expires_in, "s").add(2, "m").isBefore(dateNow)
  ) {
    log(`企业微信应用 access_token 过期, 重新获取: ${ JSON.stringify(wx_app_token_model) }`);
    const url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${
      encodeURIComponent(corpid)
    }&corpsecret=${
      encodeURIComponent(corpsecret)
    }`;
    const res = await fetch(url);
    const data: {
      errcode: number;
      errmsg: string;
      access_token: string;
      expires_in: number;
    } = await res.json();
    const errcode = data.errcode;
    if (errcode != 0) {
      error(data);
      throw new Error(data.errmsg);
    }
    if (isEmpty(data?.access_token)) {
      throw `企业微信应用 获取 access_token 失败: ${ url }`;
    }
    await updateByIdWxwAppToken(
      wx_app_token_model.id,
      {
        access_token: data.access_token,
        expires_in: data.expires_in,
        token_time: dateNow.format("YYYY-MM-DD HH:mm:ss"),
        tenant_id: wx_app_model.tenant_id!,
      },
    );
    return data.access_token;
  }
  return access_token;
}

/**
 * 获取企微通讯录token
 */
export async function getContactAccessToken(
  wxw_app_id: WxwAppId,
  force = false,
) {
  // 获取企微应用
  const wx_app_model = await validateOptionWxwApp(
    await findByIdWxwApp(wxw_app_id)
  );
  await validateIsEnabledWxwApp(wx_app_model);
  
  const corpid = wx_app_model.corpid;
  const contactsecret = wx_app_model.contactsecret;
  if (isEmpty(corpid) || isEmpty(contactsecret)) {
    throw `未设置 企微应用 通讯录密钥 ${ wx_app_model.lbl }`;
  }
  
  const dateNow = dayjs();
  const wx_app_token_model = await findOneWxwAppToken(
    {
      wxw_app_id: [ wxw_app_id ],
      type: "contact",
    },
  );
  if (!wx_app_token_model) {
    const url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${
      encodeURIComponent(corpid)
    }&corpsecret=${
      encodeURIComponent(contactsecret)
    }`;
    const res = await fetch(url);
    const data: {
      errcode: number;
      errmsg: string;
      access_token: string;
      expires_in: number;
    } = await res.json();
    const errcode = data.errcode;
    if (errcode != 0) {
      error(data);
      throw new Error(data.errmsg);
    }
    if (isEmpty(data?.access_token)) {
      throw `企业微信应用 获取 通讯录密钥 失败: ${ url }`;
    }
    await createWxwAppToken(
      {
        wxw_app_id,
        type: "contact",
        access_token: data.access_token,
        expires_in: data.expires_in,
        token_time: dateNow.format("YYYY-MM-DD HH:mm:ss"),
        tenant_id: wx_app_model.tenant_id!,
      },
    );
    return data.access_token;
  }
  const access_token = wx_app_token_model.access_token;
  const expires_in = wx_app_token_model.expires_in ?? 0;
  const token_time = dayjs(wx_app_token_model.token_time);
  if (
    force
    || !(expires_in > 0)
    || !access_token
    || !wx_app_token_model.token_time
    || token_time.add(expires_in, "s").add(2, "m").isBefore(dateNow)
    || corpid !== wx_app_token_model.corpid
    || contactsecret !== wx_app_token_model.contactsecret
  ) {
    log(`企业微信应用 通讯录密钥 过期, 重新获取: ${ JSON.stringify(wx_app_token_model) }`);
    const url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${
      encodeURIComponent(corpid)
    }&corpsecret=${
      encodeURIComponent(contactsecret)
    }`;
    const res = await fetch(url);
    const data: {
      errcode: number;
      errmsg: string;
      access_token: string;
      expires_in: number;
    } = await res.json();
    const errcode = data.errcode;
    if (errcode != 0) {
      error(data);
      throw new Error(data.errmsg);
    }
    if (isEmpty(data?.access_token)) {
      throw `企业微信应用 获取 通讯录密钥 失败: ${ url }`;
    }
    await updateByIdWxwAppToken(
      wx_app_token_model.id,
      {
        corpid,
        contactsecret,
        access_token: data.access_token,
        expires_in: data.expires_in,
        token_time: dateNow.format("YYYY-MM-DD HH:mm:ss"),
        tenant_id: wx_app_model.tenant_id!,
      },
    );
    return data.access_token;
  }
  return access_token;
}

/**
 * 获取企业的jsapi_ticket
 */
async function getJsapiTicket(
  wxw_app_id: WxwAppId,
  force = false,
) {
  const access_token = await getAccessToken(
    wxw_app_id,
  );
  
  const wx_app_token_model = await validateOptionWxwAppToken(
    await findOneWxwAppToken(
      {
        wxw_app_id: [ wxw_app_id ],
        type: "corp",
      },
    ),
  );
  const jsapi_ticket = wx_app_token_model.jsapi_ticket;
  const jsapi_ticket_expires_in = wx_app_token_model.jsapi_ticket_expires_in ?? 0;
  const jsapi_ticket_time = dayjs(wx_app_token_model.jsapi_ticket_time);
  const dateNow = dayjs();
  if (
    force
    || !(jsapi_ticket_expires_in > 0)
    || !jsapi_ticket
    || !wx_app_token_model.jsapi_ticket_time
    || jsapi_ticket_time.add(jsapi_ticket_expires_in, "s").add(2, "m").isBefore(dateNow)
  ) {
    const url = `https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket?access_token=${
      encodeURIComponent(access_token)
    }`;
    const res = await fetch(url);
    const data: {
      errcode: number;
      errmsg: string;
      ticket: string;
      expires_in: number;
    } = await res.json();
    log("getJsapiTicket: " + JSON.stringify(data));
    const errcode = data.errcode;
    if (errcode != 0) {
      error(data);
      throw new Error(data.errmsg);
    }
    if (isEmpty(data?.ticket)) {
      throw `企业微信应用 获取 jsapi_ticket 失败: ${ url }`;
    }
    await updateByIdWxwAppToken(
      wx_app_token_model.id,
      {
        jsapi_ticket: data.ticket,
        jsapi_ticket_expires_in: data.expires_in,
        jsapi_ticket_time: dateNow.format("YYYY-MM-DD HH:mm:ss"),
      },
    );
    return data.ticket;
  }
  return jsapi_ticket;
}

/**
 * 获取企业的jsapi_ticket, 跟签名
 * https://developer.work.weixin.qq.com/document/path/90506
 */
export async function getJsapiTicketSignature(
  wxw_app_id: WxwAppId,
  url: string,
  force = false,
) {
  const jsapi_ticket = await getJsapiTicket(
    wxw_app_id,
    force,
  );
  const nonceStr = crypto.randomUUID().replace(/-/gm, "");
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = `jsapi_ticket=${ jsapi_ticket }&noncestr=${ nonceStr }&timestamp=${ timestamp }&url=${ url }`;
  return {
    nonceStr,
    timestamp,
    signature: await sha1(signature),
  };
}

/**
 * 获取应用 jsapi_ticket
 */
async function getJsapiTicketAgentConfig(
  wxw_app_id: WxwAppId,
  force = false,
) {
  const wxw_app_model = await validateOptionWxwApp(
    await findByIdWxwApp(wxw_app_id),
  );
  await validateIsEnabledWxwApp(wxw_app_model);
  
  const access_token = await getAccessToken(
    wxw_app_id,
  );
  
  const wx_app_token_model = await validateOptionWxwAppToken(
    await findOneWxwAppToken(
      {
        wxw_app_id: [ wxw_app_id ],
        type: "corp",
      },
    ),
  );
  const corpid = wxw_app_model.corpid;
  const corpsecret = wxw_app_model.corpsecret;
  if (isEmpty(corpid) || isEmpty(corpsecret)) {
    throw `未设置 企微应用 密钥 ${ wxw_app_model.lbl }`;
  }
  const jsapi_ticket_agent_config = wx_app_token_model.jsapi_ticket_agent_config;
  const jsapi_ticket_agent_config_expires_in = wx_app_token_model.jsapi_ticket_agent_config_expires_in ?? 0;
  const jsapi_ticket_agent_config_time = dayjs(wx_app_token_model.jsapi_ticket_agent_config_time);
  const dateNow = dayjs();
  if (
    force
    || !(jsapi_ticket_agent_config_expires_in > 0)
    || !jsapi_ticket_agent_config
    || !wx_app_token_model.jsapi_ticket_agent_config_time
    || jsapi_ticket_agent_config_time.add(jsapi_ticket_agent_config_expires_in, "s").add(2, "m").isBefore(dateNow)
    || corpid !== wx_app_token_model.corpid
    || corpsecret !== wx_app_token_model.corpsecret
  ) {
    const url = `https://qyapi.weixin.qq.com/cgi-bin/ticket/get?access_token=${
      encodeURIComponent(access_token)
    }&type=agent_config`;
    const res = await fetch(url);
    const data: {
      errcode: number;
      errmsg: string;
      ticket: string;
      expires_in: number;
    } = await res.json();
    log("getJsapiTicketAgentConfig: " + JSON.stringify(data));
    const errcode = data.errcode;
    if (errcode != 0) {
      error(data);
      throw new Error(data.errmsg);
    }
    if (isEmpty(data?.ticket)) {
      throw `企业微信应用 获取 jsapi_ticket_agent_config 失败: ${ url }`;
    }
    await updateByIdWxwAppToken(
      wx_app_token_model.id,
      {
        jsapi_ticket_agent_config: data.ticket,
        jsapi_ticket_agent_config_expires_in: data.expires_in,
        jsapi_ticket_agent_config_time: dateNow.format("YYYY-MM-DD HH:mm:ss"),
      },
    );
    return data.ticket;
  }
  return jsapi_ticket_agent_config;
}

/**
 * 获取应用 jsapi_ticket, 跟签名
 * https://developer.work.weixin.qq.com/document/path/90506
 */
export async function getJsapiTicketAgentConfigSignature(
  wxw_app_id: WxwAppId,
  url: string,
  force = false,
) {
  const jsapi_ticket_agent_config = await getJsapiTicketAgentConfig(
    wxw_app_id,
    force,
  );
  const nonceStr = crypto.randomUUID().replace(/-/gm, "");
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = `jsapi_ticket=${ jsapi_ticket_agent_config }&noncestr=${ nonceStr }&timestamp=${ timestamp }&url=${ url }`;
  const res = {
    nonceStr,
    timestamp,
    signature: await sha1(signature),
  };
  return res;
}

/**
 * 获取访问用户身份
 * https://developer.work.weixin.qq.com/document/path/91023
 * 如果 code 无效, 已经被使用过, 或则不合法, 则返回 undefined
 * @param code 通过成员授权获取到的code
 */
export async function getuserinfoByCode(
  wxw_app_id: WxwAppId,
  code: string,
  force = false,
): Promise<{
  userid: string;
  user_ticket: string;
} | undefined> {
  const access_token = await getAccessToken(
    wxw_app_id,
    force,
  );
  const url = `https://qyapi.weixin.qq.com/cgi-bin/auth/getuserinfo?access_token=${
    encodeURIComponent(access_token)
  }&code=${
    encodeURIComponent(code)
  }`;
  const res = await fetch(
    url,
    {
      method: "GET",
    },
  );
  const data: {
    errcode: number;
    errmsg: string;
    userid: string;
    user_ticket: string;
  } = await res.json();
  const errcode = data.errcode;
  if (errcode === 42001 && !force) {
    return await getuserinfoByCode(
      wxw_app_id,
      code,
      true,
    );
  }
  if (errcode === 40029) {
    return;
  }
  if (errcode != 0) {
    error(data);
    throw data.errmsg;
  }
  return {
    userid: data.userid,
    user_ticket: data.user_ticket,
  };
}

/**
 * 获取成员ID列表
 */
export async function getuseridlist(
  wxw_app_id: WxwAppId,
  force = false,
): Promise<string[]> {
  const access_token = await getContactAccessToken(
    wxw_app_id,
    force,
  );
  const url = `https://qyapi.weixin.qq.com/cgi-bin/user/list_id?access_token=${
    encodeURIComponent(access_token)
  }`;
  const res = await fetch(
    url,
    {
      method: "POST",
    },
  );
  const data: {
    errcode: number;
    errmsg: string;
    next_cursor?: string;
    dept_user: {
      userid: string;
      department: number;
    }[];
  } = await res.json();
  const errcode = data.errcode;
  if (errcode === 42001 && !force) {
    return await getuseridlist(
      wxw_app_id,
      true,
    );
  }
  if (errcode != 0) {
    error(data);
    let errmsg = data.errmsg;
    if (errcode === 60020) {
      errmsg = "外网IP地址未在企微白名单中, 请联系管理员";
    }
    throw errmsg;
  }
  const userids: string[] = [ ];
  for (const dept_user of data.dept_user) {
    if (userids.includes(dept_user.userid)) {
      continue;
    }
    userids.push(dept_user.userid);
  }
  return userids;
}

/**
 * 读取成员
 * https://developer.work.weixin.qq.com/document/path/90196
 */
export async function getuser(
  wxw_app_id: WxwAppId,
  userid: string,
  force = false,
): Promise<typeof data | undefined> {
  const access_token = await getAccessToken(
    wxw_app_id,
    force,
  );
  const url = `https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=${
    encodeURIComponent(access_token)
  }&userid=${
    encodeURIComponent(userid as unknown as string)
  }`;
  const res = await fetch(
    url,
    {
      method: "GET",
    },
  );
  /**
   {
    errcode: 0,
    errmsg: "ok",
    userid: "HuangZhiYong",
    name: "黄智勇",
    department: [ 1 ],
    position: "",
    status: 1,
    isleader: 0,
    extattr: { attrs: [] },
    telephone: "",
    enable: 1,
    hide_mobile: 0,
    order: [ 0 ],
    main_department: 1,
    alias: "",
    is_leader_in_dept: [ 0 ],
    direct_leader: []
  }
  */
  const data: {
    errcode: number;
    errmsg: string;
    userid: string;
    name: string;
    department: number[];
    position: string;
    status: number;
    isleader: 0|1;
    extattr: {
      // deno-lint-ignore no-explicit-any
      attrs: any[];
    };
    telephone: string;
    enable: 0|1;
    hide_mobile: 0|1;
    order: number[];
    main_department: number;
    alias: string;
    is_leader_in_dept: number[];
    // deno-lint-ignore no-explicit-any
    direct_leader: any[];
  } = await res.json();
  // 指定的成员/部门/标签参数无权限, 指定的成员或部门或标签不在应用的可见范围之内
  if (data.errcode === 60011) {
    return;
  }
  if (data.errcode === 42001 && !force) {
    return await getuser(
      wxw_app_id,
      userid,
      true,
    );
  }
  if (data.errcode != 0) {
    error(data);
    throw data.errmsg;
  }
  return data;
}
