import {
  log,
  error,
} from "/lib/context.ts";

import type {
  WxwGetAppid,
  WxwLoginByCodeInput,
  WxwLoginByCode,
} from "/gen/types.ts";

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
  findOne as findOneDomain,
  validateOption as validateOptionDomain,
  validateIsEnabled as validateIsEnabledDomain,
} from "/gen/base/domain/domain.dao.ts";

import * as authService from "/lib/auth/auth.service.ts";

/**
 * 通过host获取appid, agentid
 * @param host 域名
 */
export async function wxwGetAppid(
  host: string,
): Promise<WxwGetAppid> {
  // 获取域名
  const domainModel = await validateOptionDomain(
    await findOneDomain({
      lbl: host,
    }),
  );
  await validateIsEnabledDomain(domainModel);
  
  const domain_id: DomainId = domainModel.id;
  
  // 获取企微应用
  const wxw_appModel = await validateOptionWxwApp(
    await findOneWxwApp({
      domain_id: [ domain_id ],
    }),
  );
  await validateIsEnabledWxwApp(wxw_appModel);
  
  return {
    appid: wxw_appModel.corpid,
    agentid: wxw_appModel.agentid,
  };
}

/**
 * 企业微信单点登录
 * 如果 code 有效, 则返回授权码, 否则返回 undefined
 */
export async function wxwLoginByCode(
  input: WxwLoginByCodeInput,
): Promise<WxwLoginByCode | undefined> {
  const host = input.host;
  const code = input.code;
  const lang = input.lang || "zh_cn";
  
  // 获取域名
  const domainModel = await validateOptionDomain(
    await findOneDomain({
      lbl: host,
    }),
  );
  await validateIsEnabledDomain(domainModel);
  
  const domain_id: DomainId = domainModel.id;
  
  // 获取企微应用
  const wxw_appModel = await validateOptionWxwApp(
    await findOneWxwApp({
      domain_id: [ domain_id ],
    })
  );
  await validateIsEnabledWxwApp(wxw_appModel);
  
  const wxw_app_id: WxwAppId = wxw_appModel.id;
  const tenant_id: TenantId = wxw_appModel.tenant_id!;
  
  const userinfo = await getuserinfoByCode(
    wxw_app_id,
    code,
  );
  const userid = userinfo?.userid;
  
  if (!userid) {
    return;
  }
  
  const wxwUser = await getuser(
    wxw_app_id,
    userid,
  );
  if (!wxwUser) {
    throw `${ userid } 不在应用 ${ wxw_appModel.lbl } 的可见范围之内`;
  }
  const name = wxwUser.name;
  const position = wxwUser.position;
  
  // 企业微信用户
  const wxw_usrModel = await findOneWxwUsr({
    lbl: name,
  });
  if (!wxw_usrModel) {
    await createWxwUsr({
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
      usrModel = (await findByIdUsr(usrModel.id))!;
    }
  } else {
    const id: UsrId = await createUsr({
      username: name,
      lbl: name,
      tenant_id: wxw_appModel.tenant_id!,
    });
    usrModel = (await findByIdUsr(id))!;
  }
  const org_ids: OrgId[] = usrModel.org_ids || [ ];
  let org_id: OrgId = usrModel.default_org_id;
  if (!org_id) {
    org_id = org_ids[0];
  }
  if (org_id) {
    if (!org_ids.includes(org_id)) {
      org_id = "" as unknown as OrgId;
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
export async function wxwSyncUsr(
  host: string,
) {
  if (wxwSyncUsrLock) {
    throw "企微用户正在同步中, 请稍后再试";
  }
  wxwSyncUsrLock = true;
  let wxw_app_id: WxwAppId;
  let tenant_id: TenantId;
  let userids: string[];
  try {
    const res = await fetchUserIdList(host);
    wxw_app_id = res.wxw_app_id as WxwAppId;
    tenant_id = res.tenant_id as TenantId;
    userids = res.userids;
  } finally {
    wxwSyncUsrLock = false;
  }
  (async function() {
    try {
      await _wxwSyncUsr(
        wxw_app_id,
        tenant_id,
        userids,
      );
    } catch(err) {
      error(`企微应用 ${ wxw_app_id as unknown as string } 同步企微用户失败: ${ err }`);
    } finally {
      wxwSyncUsrLock = false;
    }
  })();
}

async function fetchUserIdList(
  host: string,
) {
  // 获取域名
  const domainModel = await validateOptionDomain(
    await findOneDomain({
      lbl: host,
    }),
  );
  await validateIsEnabledDomain(domainModel);
  
  const domain_id: DomainId = domainModel.id;
  
  // 获取企微应用
  const wxw_appModel = await validateOptionWxwApp(
    await findOneWxwApp({
      domain_id: [ domain_id ],
    }),
  );
  await validateIsEnabledWxwApp(wxw_appModel);
  
  const wxw_app_id: WxwAppId = wxw_appModel.id;
  const tenant_id = wxw_appModel.tenant_id!;
  
  const userids = await getuseridlist(wxw_app_id);
  log(`企微应用 ${ wxw_appModel.lbl } 同步企微用户, 获取到企微用户数量: ${ userids.length }`);
  return {
    wxw_app_id,
    tenant_id,
    userids,
  };
}

async function _wxwSyncUsr(
  wxw_app_id: WxwAppId,
  tenant_id: TenantId,
  userids: string[],
) {
  const wxw_usrModels = await findAllWxwUsr();
  const userids4add = userids.filter((userid) => {
    return !wxw_usrModels.some((wxw_usrModel) => {
      return wxw_usrModel.userid === userid as unknown as string;
    });
  });
  const wxw_usrModels4add: WxwUsrInput[] = [ ];
  for (let i = 0; i < userids4add.length; i++) {
    const userid = userids4add[i];
    const wxwUser = await getuser(wxw_app_id, userid);
    if (!wxwUser) {
      continue;
    }
    const name = wxwUser.name;
    wxw_usrModels4add.push({
      userid,
      lbl: name,
      tenant_id,
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
