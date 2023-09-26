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
    throw `未设置企业微信应用 corpsecret, corpid: ${ corpid }`;
  }
  const dateNow = dayjs();
  const wx_app_tokenModel = await findOneWxwAppToken(
    {
      wxw_app_id: [ wxw_app_id ],
    },
  );
  if (!wx_app_tokenModel) {
    const url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${ corpid }&corpsecret=${ corpsecret }`;
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
    const url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${ corpid }&corpsecret=${ corpsecret }`;
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
    const id = wx_appModel.id;
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
    access_token
  }&code=${
    code
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
  if (data.errcode === 42001) {
    if (opt.force) {
      return await getuserinfoByCode(
        corpid,
        code,
        {
        force: false,
        },
      );
    }
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
    access_token
  }&userid=${
    userid
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
  if (data.errcode === 42001) {
    if (opt.force) {
      return await getuser(
        corpid,
        userid,
        {
        force: false,
        },
      );
    }
  }
  if (data.errcode != 0) {
    error(data);
    throw data.errmsg;
  }
  return data;
}
