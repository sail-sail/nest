import type {
  WxoLoginByCodeInput,
  LoginModel,
  LoginInput,
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
  updateById as updateByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  fetchOpenid as fetchOpenidWxoUsr,
} from "./wxo_usr.dao.ts";

import {
  createToken as createTokenAuth,
  getPassword,
} from "/lib/auth/auth.dao.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

import {
  UniqueType,
} from "/gen/types.ts";

import {
  findLoginUsr,
  getOrgIdsById,
} from "/src/base/usr/usr.dao.ts";

import {
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import {
  isEmpty,
} from "/lib/util/string_util.ts";

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
  
  const usr_id = wxo_usrModel.usr_id;
  const wxo_usr_id = wxo_usrModel.id;
  
  const {
    authorization,
  } = await createTokenAuth({
    id: usr_id,
    org_id,
    wxo_usr_id,
    tenant_id,
    lang,
  });
  
  const loginModel: LoginModel = {
    usr_id,
    username,
    tenant_id,
    org_id,
    authorization,
    lang,
  };
  
  return loginModel;
}

/**
 * 公众号用户是否已绑定
 */
export async function checkBindWxoUsr() {
  const authModel = await getAuthModel();
  const wxo_usr_id = authModel.wxo_usr_id;
  if (!wxo_usr_id) {
    return false;
  }
  const wxo_usrModel = await validateOptionWxoUsr(
    await findByIdWxoUsr(wxo_usr_id),
  );
  const usr_id = wxo_usrModel.usr_id;
  if (!usr_id) {
    return false;
  }
  const usrModel = await validateOptionUsr(
    await findByIdUsr(usr_id),
  );
  return !usrModel.is_hidden;
}

/**
 * 绑定公众号用户
 * 找到这个用户, 如果这个用户是 is_hidden 为0, 代表它未绑定, 否则已被绑定
 * 未绑定的, 就找到当前的登录用户, 修改它的用户名, 密码, 跟 租户ID, 还有 is_hidden 变为 1
 * 之后再执行登录流程
 */
export async function bindWxoUsr(
  input: LoginInput,
): Promise<LoginModel> {
  const authModel = await getAuthModel();
  
  const authUsrModel = await validateOptionUsr(
    await findByIdUsr(authModel.id),
  );
  if (!authUsrModel.is_hidden) {
    throw await ns("此微信已被其它用户绑定");
  }
  
  const wxo_usr_id = authModel.wxo_usr_id;
  if (!wxo_usr_id) {
    throw "wx_usr_id can not be null";
  }
  
  const username = input.username;
  const password = input.password;
  const tenant_id = input.tenant_id;
  let org_id = input.org_id;
  const lang = input.lang;
  if (isEmpty(username) || isEmpty(password)) {
    throw await ns("用户名或密码不能为空");
  }
  if (isEmpty(tenant_id)) {
    throw await ns("请选择租户");
  }
  const password2 = await getPassword(password);
  let model = await findLoginUsr(
    username,
    password2,
    tenant_id,
  );
  
  if (!model || !model.id) {
    model = {
      id: authModel.id,
      default_org_id: authUsrModel.default_org_id,
      is_hidden: authUsrModel.is_hidden,
    },
    await updateTenantByIdUsr(model.id, tenant_id);
    await updateByIdUsr(
      model.id,
      {
        username,
        password: password2,
        is_hidden: 0,
      },
    );
  } else {
    if (model.is_hidden) {
      await updateByIdUsr(
        model.id,
        {
          username,
          password,
          is_hidden: 0,
        },
      );
    }
  }
  
  if (org_id === null) {
    org_id = undefined;
  }
  const org_ids = await getOrgIdsById(
    model.id,
  );
  if (!org_id) {
    org_id = model.default_org_id || org_ids[0];
  }
  if (org_id) {
    if (!org_ids.includes(org_id)) {
      org_id = undefined;
    }
  }
  
  const wxo_usrModel = await validateOptionWxoUsr(
    await findByIdWxoUsr(wxo_usr_id),
  );
  if (wxo_usrModel.usr_id != model.id) {
    await updateByIdWxoUsr(
      wxo_usr_id,
      {
        usr_id: model.id,
        org_id,
      },
    );
  }
  const usr_id = model.id;
  
  const {
    authorization,
  } = await createTokenAuth({
    id: usr_id,
    org_id,
    tenant_id,
    lang,
    wxo_usr_id,
  });
  
  const loginModel: LoginModel = {
    usr_id,
    username,
    tenant_id,
    authorization,
    org_id,
    lang,
  };
  
  return loginModel;
}

/** 公众号用户解除绑定 */
export async function unBindWxoUsr() {
  const authModel = await getAuthModel();
  const wxo_usr_id = authModel.wxo_usr_id;
  if (!wxo_usr_id) {
    throw "wxo_usr_id can not be null";
  }
  await updateByIdWxoUsr(
    wxo_usr_id,
    {
      usr_id: "" as UsrId,
    },
  );
  return true;
}
