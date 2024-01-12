import type {
  WxoLoginByCodeInput,
  LoginModel,
} from "/gen/types.ts";

import {
  findOne as findOneDomain,
  validateOption as validateOptionDomain,
  validateIsEnabled as validateIsEnabledDomain,
} from "/gen/base/domain/domain.dao.ts";

import {
  findOne as findOneWxoApp,
  validateOption as validateOptionWxoApp,
  validateIsEnabled as validateIsEnabledWxoApp,
} from "/gen/wx/wxo_app/wxo_app.dao.ts";

import {
  findById as findByIdWxoUsr,
  findOne as findOneWxoUsr,
  create as createWxoUsr,
  updateById as updateByIdWxoUsr,
  updateTenantById as updateTenantByIdWxoUsr,
  validateOption as validateOptionWxoUsr,
} from "/gen/wx/wxo_usr/wxo_usr.dao.ts";

import {
  findById as findByIdUsr,
  create as createUsr,
  updateTenantById as updateTenantByIdUsr,
  validateOption as validateOptionUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  fetchOpenid as fetchOpenidWxoUsr,
} from "./wxo_usr.dao.ts";

import type {
  OrgId,
} from "/gen/base/org/org.model.ts";

import {
  createToken as createTokenAuth,
} from "/lib/auth/auth.dao.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import {
  UniqueType,
} from "/gen/types.ts";

import {
  getOrgIdsById,
} from "/src/base/usr/usr.dao.ts";

/** 通过域名获取开发者ID */
export async function wxoGetAppid(
  host: string,
) {
  // 获取域名
  const domainModel = await validateOptionDomain(
    await findOneDomain({
      lbl: host,
    }),
  );
  await validateIsEnabledDomain(domainModel);
  
  const domain_id = domainModel.id;
  
  // 获取微信公众号的开发者ID
  const wxoAppModel = await validateOptionWxoApp(
    await findOneWxoApp({
      domain_id: [ domain_id ],
    }),
  );
  await validateIsEnabledWxoApp(wxoAppModel);
  
  const appid = wxoAppModel.appid;
  
  return {
    appid,
  };
}

/**
 * 微信公众号单点登录
 */
export async function wxoLoginByCode(
  input: WxoLoginByCodeInput,
): Promise<LoginModel> {
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
  
  const domain_id = domainModel.id;
  
  // 获取企微应用
  const wxo_appModel = await validateOptionWxoApp(
    await findOneWxoApp({
      domain_id: [ domain_id ],
    })
  );
  await validateIsEnabledWxoApp(wxo_appModel);
  
  const tenant_id = wxo_appModel.tenant_id!;
  const appid = wxo_appModel.appid;
  
  // 获取微信公众号的openid
  const {
    openid,
    unionid,
  } = await fetchOpenidWxoUsr(code, appid);
  
  // 微信公众号用户
  let wxo_usrModel = await findOneWxoUsr({
    lbl: openid,
  });
  // 用户初次登录, 设置租户
  if (!wxo_usrModel) {
    const id = await createWxoUsr(
      {
        openid,
        lbl: openid,
        unionid,
      },
    );
    await updateTenantByIdWxoUsr(id, tenant_id!);
    wxo_usrModel = await validateOptionWxoUsr(
      await findByIdWxoUsr(id),
    );
  }
  if (wxo_usrModel.tenant_id !== tenant_id) {
    await updateTenantByIdWxoUsr(wxo_usrModel.id, tenant_id);
  }
  if (wxo_usrModel.unionid != unionid) {
    await updateByIdWxoUsr(
      wxo_usrModel.id,
      {
        unionid,
      },
    );
  }
  if (!wxo_usrModel.usr_id) {
    const id = await createUsr(
      {
        lbl: await ns("游客"),
        rem: await ns("微信用户"),
        is_hidden: 1,
      },
      {
        uniqueType: UniqueType.Update,
      },
    );
    await updateTenantByIdUsr(id, tenant_id);
    await updateByIdWxoUsr(
      wxo_usrModel.id,
      {
        usr_id: id,
      },
    );
    wxo_usrModel = await validateOptionWxoUsr(
      await findByIdWxoUsr(wxo_usrModel.id),
    );
  }
  
  const usrModel = await validateOptionUsr(
    await findByIdUsr(wxo_usrModel.usr_id),
  );
  const username = usrModel.username;
  
  let org_id: OrgId | undefined = undefined;
  const org_ids = await getOrgIdsById(wxo_usrModel.usr_id);
  if (!org_id) {
    org_id = org_ids[0];
  }
  if (org_id) {
    if (!org_ids.includes(org_id)) {
      org_id = undefined;
    }
  }
  
  const {
    authorization,
  } = await createTokenAuth({
    id: wxo_usrModel.usr_id,
    org_id,
    wx_usr_id: wxo_usrModel.id,
    tenant_id,
    lang,
  });
  
  const loginModel: LoginModel = {
    usr_id: wxo_usrModel.usr_id,
    username,
    tenant_id,
    org_id,
    authorization,
    lang,
  };
  
  return loginModel;
}
