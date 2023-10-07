import {
  log,
} from "/lib/context.ts";

import type {
  WxwLoginByCodeInput,
  WxwLoginByCode,
} from "/gen/types.ts";

import type {
  WxwUsrInput,
} from "/gen/wxwork/wxw_usr/wxw_usr.model.ts";

import {
  getuserinfoByCode,
  getuser,
  getuseridlist,
} from "/src/wxwork/wxw_app_token/wxw_app_token.dao.ts";

import {
  findOne as findOneUsr,
  findById as findByIdUsr,
  create as createUsr,
  updateById as updateUsrById,
  validateIsEnabled as validateIsEnabledUsr,
} from "/gen/base/usr/usr.dao.ts"

import {
  findAll as findAllWxwUsr,
  findOne as findOneWxwUsr,
  create as createWxwUsr,
  updateById as updateWxwUsrById,
} from "/gen/wxwork/wxw_usr/wxw_usr.dao.ts"

import {
  findOne as findOneWxwApp,
  validateOption as validateOptionWxwApp,
  validateIsEnabled as validateIsEnabledWxwApp,
} from "/gen/wxwork/wxw_app/wxw_app.dao.ts"

import {
  findOne as findOneOptbiz,
  validateOption as validateOptionOptbiz,
  validateIsEnabled as validateIsEnabledOptbiz,
} from "/gen/base/optbiz/optbiz.dao.ts";

import {
  shortUuidV4,
} from "/lib/util/string_util.ts";

import * as authService from "/lib/auth/auth.service.ts";

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
  
  let wxw_appModel = await findOneWxwApp({
    corpid,
    agentid,
  });
  wxw_appModel = await validateOptionWxwApp(wxw_appModel);
  await validateIsEnabledWxwApp(wxw_appModel);
  
  const wxw_app_id = wxw_appModel.id;
  const tenant_id = wxw_appModel.tenant_id!;
  const {
    userid,
  } = await getuserinfoByCode(
    wxw_app_id,
    code,
  );
  const {
    name,
    position,
  } = await getuser(
    wxw_app_id,
    userid,
  );
  
  // 企业微信用户
  const wxw_usrModel = await findOneWxwUsr({
    lbl: name,
  });
  if (!wxw_usrModel) {
    const id = shortUuidV4();
    await createWxwUsr({
      id,
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
  if (usrModel) {
    await validateIsEnabledUsr(usrModel);
    if (
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
  } else {
    const id = shortUuidV4();
    await createUsr({
      id,
      username: name,
      lbl: name,
      tenant_id: wxw_appModel.tenant_id!,
    });
    usrModel = (await findByIdUsr(id))!;
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

let wxwSyncUsrLock = false;

/**
 * 企业微信同步企微用户
 */
export async function wxwSyncUsr() {
  if (wxwSyncUsrLock) {
    throw "企微用户正在同步中, 请稍后再试";
  }
  wxwSyncUsrLock = true;
  let num = 0;
  try {
    num = await _wxwSyncUsr();
  } finally {
    wxwSyncUsrLock = false;
  }
  return num;
}

async function _wxwSyncUsr() {
  const optbizModel = await validateOptionOptbiz(
    await findOneOptbiz({
      lbl: "企微应用-同步通讯录",
    }),
  );
  await validateIsEnabledOptbiz(optbizModel);
  
  const wxw_app_lbl = optbizModel.lbl;
  if (!wxw_app_lbl) {
    throw `业务选项未配置 企微应用-同步通讯录 的企微应用名称`;
  }
  const wxw_appModel = await validateOptionWxwApp(
    await findOneWxwApp({
      lbl: wxw_app_lbl,
    }),
  );
  await validateIsEnabledWxwApp(wxw_appModel);
  
  const wxw_app_id = wxw_appModel.id;
  const userids = await getuseridlist(wxw_app_id);
  log(`企微应用 ${ wxw_appModel.lbl } 同步企微用户, 获取到企微用户数量: ${ userids.length }`);
  
  const wxw_usrModels = await findAllWxwUsr();
  const userids4add = userids.filter((userid) => {
    return !wxw_usrModels.some((wxw_usrModel) => {
      return wxw_usrModel.userid === userid;
    });
  });
  const wxw_usrModels4add: WxwUsrInput[] = [ ];
  for (let i = 0; i < userids4add.length; i++) {
    const userid = userids4add[i];
    const { name } = await getuser(wxw_app_id, userid);
    wxw_usrModels4add.push({
      id: shortUuidV4(),
      userid,
      lbl: name,
      tenant_id: wxw_appModel.tenant_id!,
    });
  }
  let num = 0;
  for (let i = 0; i < wxw_usrModels4add.length; i++) {
    const item = wxw_usrModels4add[i];
    await createWxwUsr(item);
    num++;
  }
  return num;
}
