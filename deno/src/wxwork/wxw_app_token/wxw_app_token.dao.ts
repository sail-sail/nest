import {
  error,
  log,
} from "/lib/context.ts";
 
import {
  isEmpty,
  shortUuidV4,
} from "/lib/util/string_util.ts";
 
import dayjs from "dayjs";

import {
  findOne as findOneWxwAppToken,
  create as createWxwAppToken,
  updateById as updateByIdWxwAppToken,
} from "/gen/wxwork/wxw_app_token/wxw_app_token.dao.ts";

import {
  findOne as findOneWxwApp,
} from "/gen/wxwork/wxw_app/wxw_app.dao.ts";

export async function getAccessToken(
  corpid: string,
  force = false,
) {
  const wx_appModel = await findOneWxwApp({
    corpid,
  });
  if (!wx_appModel) {
    throw `未设置企业微信应用, corpid: ${ corpid }`;
  }
  const wxw_app_id = wx_appModel.id;
  const corpsecret = wx_appModel.corpsecret;
  if (isEmpty(corpsecret)) {
    throw `未设置企业微信应用 应用密钥, corpid: ${ corpid }`;
  }
  const dateNow = dayjs();
  const wx_app_tokenModel = await findOneWxwAppToken(
    {
      wxw_app_id: [ wxw_app_id ],
      type: "corp",
    },
  );
  if (!wx_app_tokenModel) {
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
    const access_token = data.access_token;
    if (!access_token) {
      error(data);
      throw data;
    }
    if (isEmpty(access_token)) {
      throw `企业微信应用 获取 access_token 失败: ${ url }`;
    }
    const id = shortUuidV4();
    await createWxwAppToken(
      {
        id,
        wxw_app_id,
        type: "corp",
        access_token,
        expires_in: data.expires_in,
        token_time: dateNow.format("YYYY-MM-DD HH:mm:ss"),
        tenant_id: wx_appModel.tenant_id!,
      },
    );
    return access_token;
  }
  let access_token = wx_app_tokenModel.access_token;
  const expires_in = wx_app_tokenModel.expires_in ?? 0;
  const token_time = dayjs(wx_app_tokenModel.token_time);
  if (
    force
    || !(expires_in > 0)
    || !access_token
    || !wx_app_tokenModel.token_time
    || token_time.add(expires_in, "s").add(2, "m").isBefore(dateNow)
  ) {
    log(`企业微信应用 access_token 过期, 重新获取: ${ JSON.stringify(wx_app_tokenModel) }`);
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
    access_token = data.access_token;
    if (!access_token) {
      error(data);
      throw data;
    }
    if (isEmpty(access_token)) {
      throw `企业微信应用 获取 access_token 失败: ${ url }`;
    }
    const id = wx_app_tokenModel.id;
    await updateByIdWxwAppToken(
      id,
      {
        access_token: data.access_token,
        expires_in: data.expires_in,
        token_time: dateNow.format("YYYY-MM-DD HH:mm:ss"),
        tenant_id: wx_appModel.tenant_id!,
      },
    );
  }
  return access_token;
}

/**
 * 获取企微通讯录token
 */
export async function getContactAccessToken(
  corpid: string,
  force = false,
) {
  const wx_appModel = await findOneWxwApp({
    corpid,
  });
  if (!wx_appModel) {
    throw `未设置企业微信应用, 企业ID: ${ corpid }`;
  }
  const wxw_app_id = wx_appModel.id;
  const contactsecret = wx_appModel.contactsecret;
  if (isEmpty(contactsecret)) {
    throw `未设置企业微信应用 通讯录密钥, 企业ID: ${ corpid }`;
  }
  const dateNow = dayjs();
  const wx_app_tokenModel = await findOneWxwAppToken(
    {
      wxw_app_id: [ wxw_app_id ],
      type: "contact",
    },
  );
  if (!wx_app_tokenModel) {
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
    const access_token = data.access_token;
    if (!access_token) {
      error(data);
      throw data;
    }
    if (isEmpty(access_token)) {
      throw `企业微信应用 获取 通讯录密钥 失败: ${ url }`;
    }
    const id = shortUuidV4();
    await createWxwAppToken(
      {
        id,
        wxw_app_id,
        type: "contact",
        access_token,
        expires_in: data.expires_in,
        token_time: dateNow.format("YYYY-MM-DD HH:mm:ss"),
        tenant_id: wx_appModel.tenant_id!,
      },
    );
    return access_token;
  }
  let access_token = wx_app_tokenModel.access_token;
  const expires_in = wx_app_tokenModel.expires_in ?? 0;
  const token_time = dayjs(wx_app_tokenModel.token_time);
  if (
    force
    || !(expires_in > 0)
    || !access_token
    || !wx_app_tokenModel.token_time
    || token_time.add(expires_in, "s").add(2, "m").isBefore(dateNow)
  ) {
    log(`企业微信应用 通讯录密钥 过期, 重新获取: ${ JSON.stringify(wx_app_tokenModel) }`);
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
    access_token = data.access_token;
    if (!access_token) {
      error(data);
      throw data;
    }
    if (isEmpty(access_token)) {
      throw `企业微信应用 获取 通讯录密钥 失败: ${ url }`;
    }
    const id = wx_app_tokenModel.id;
    await updateByIdWxwAppToken(
      id,
      {
        access_token: data.access_token,
        expires_in: data.expires_in,
        token_time: dateNow.format("YYYY-MM-DD HH:mm:ss"),
        tenant_id: wx_appModel.tenant_id!,
      },
    );
  }
  return access_token;
}

/**
 * 获取访问用户身份
 * https://developer.work.weixin.qq.com/document/path/91023
 * @param code 通过成员授权获取到的code
 */
export async function getuserinfoByCode(
  corpid: string,
  code: string,
  opt: {
    force: boolean;
  } = {
    force: false,
  },
): Promise<{
  userid: string;
  user_ticket: string;
}> {
  const access_token = await getAccessToken(corpid);
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
  if (data.errcode === 42001 && opt.force) {
    return await getuserinfoByCode(
      corpid,
      code,
      {
        force: false,
      },
    );
  }
  if (data.errcode != 0) {
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
  corpid: string,
  opt: {
    force: boolean;
  } = {
    force: false,
  },
): Promise<string[]> {
  const access_token = await getContactAccessToken(corpid);
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
  if (data.errcode === 42001 && opt.force) {
    return await getuseridlist(
      corpid,
      {
        force: false,
      },
    );
  }
  if (data.errcode != 0) {
    error(data);
    throw data.errmsg;
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
  corpid: string,
  userid: string,
  opt: {
    force: boolean;
  } = {
    force: false,
  },
): Promise<typeof data> {
  const access_token = await getAccessToken(corpid);
  const url = `https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=${
    encodeURIComponent(access_token)
  }&userid=${
    encodeURIComponent(userid)
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
  if (data.errcode === 42001 && opt.force) {
    return await getuser(
      corpid,
      userid,
      {
        force: false,
      },
    );
  }
  if (data.errcode != 0) {
    error(data);
    throw data.errmsg;
  }
  return data;
}
