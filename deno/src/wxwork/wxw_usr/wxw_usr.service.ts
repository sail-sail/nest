import type {
  WxwLoginByCodeInput,
  WxwLoginByCode,
} from "/gen/types.ts";

import {
  getuserinfoByCode,
  getuser,
} from "/src/wxwork/wxw_app_token/wxw_app_token.dao.ts";

import {
  findOne as findOneUsr,
  findById as findByIdUsr,
  create as createUsr,
  updateById as updateUsrById,
} from "/gen/base/usr/usr.dao.ts"

import {
  findOne as findOneWxwUsr,
  create as createWxwUsr,
  updateById as updateWxwUsrById,
} from "/gen/wxwork/wxw_usr/wxw_usr.dao.ts"

import {
  findOne as findOneWxwApp,
} from "/gen/wxwork/wxw_app/wxw_app.dao.ts"

import {
  shortUuidV4,
} from "/lib/util/string_util.ts";

import * as authService from "/lib/auth/auth.service.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

/**
 * 企业微信单点登录
 */
export async function wxwLoginByCode(
  input: WxwLoginByCodeInput,
): Promise<WxwLoginByCode> {
  const corpid = input.corpid;
  const agentid = input.agentid;
  const code = input.code;
  const lang = input.lang || "zh_CN";
  const { userid } = await getuserinfoByCode(corpid, code);
  const {
    name,
    position,
  } = await getuser(corpid, userid);
  const wxw_appModel = await findOneWxwApp({
    corpid,
    agentid,
  });
  if (!wxw_appModel) {
    throw new Error(`企业微信应用 未配置 corpid: ${ corpid }, agentid: ${ agentid }`);
  }
  if (!wxw_appModel.is_enabled) {
    throw new Error(`企业微信应用 已禁用 corpid: ${ corpid }, agentid: ${ agentid }`);
  }
  const tenant_id = wxw_appModel.tenant_id!;
  // 企业微信用户
  const wxw_usrModel = await findOneWxwUsr({
    wxw_app_id: [ wxw_appModel.id ],
    lbl: name,
  });
  if (!wxw_usrModel) {
    const id = shortUuidV4();
    await createWxwUsr({
      id,
      wxw_app_id: wxw_appModel.id,
      userid,
      lbl: name,
      position,
      tenant_id,
    });
  } else if (
    wxw_usrModel.userid !== userid ||
    wxw_usrModel.lbl !== name ||
    wxw_usrModel.position !== position ||
    wxw_usrModel.tenant_id !== tenant_id
  ) {
    await updateWxwUsrById(
      wxw_usrModel.id,
      {
        userid,
        lbl: name,
        position,
        tenant_id,
      },
    );
  }
  let usrModel = await findOneUsr({
    lbl: name,
  });
  if (usrModel && !usrModel.is_enabled) {
    throw await ns("用户已禁用");
  }
  if (!usrModel) {
    const id = shortUuidV4();
    await createUsr({
      id,
      username: name,
      lbl: name,
      tenant_id: wxw_appModel.tenant_id!,
    });
    usrModel = (await findByIdUsr(id))!;
  } else if (
    usrModel.username !== name ||
    usrModel.lbl !== name ||
    usrModel.tenant_id !== wxw_appModel.tenant_id!
  ) {
    await updateUsrById(
      usrModel.id,
      {
        username: name,
        lbl: name,
        tenant_id: wxw_appModel.tenant_id!,
      },
    );
  }
  const org_ids = usrModel.org_ids || [ ];
  let org_id = usrModel.default_org_id;
  if (!org_id) {
    org_id = org_ids[0];
  }
  if (org_id) {
    if (!org_ids.includes(org_id)) {
      org_id = "";
    }
  }
  const {
    authorization,
  } = await authService.createToken({
    id: usrModel.id,
    org_id,
    tenant_id,
    lang,
  });
  return {
    username: name,
    name,
    authorization,
    org_id,
    tenant_id,
    lang,
  };
}
