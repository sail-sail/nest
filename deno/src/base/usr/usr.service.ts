import {
  isEmpty,
} from "/lib/util/string_util.ts";

import * as authService from "/lib/auth/auth.service.ts";

import * as usrDao from "./usr.dao.ts";

import * as usrDaoGen from "/gen/base/usr/usr.dao.ts";

import * as orgDaoGen from "/gen/base/org/org.dao.ts";

import {
  type MutationLoginArgs,
} from "/gen/types.ts";

import {
  ns
} from "/src/base/i18n/i18n.ts";

/**
 * 登录获得 authorization
 * @param {MutationLoginArgs["username"]} username 用户名
 * @param {MutationLoginArgs["password"]} password 密码,传递进来的密码已经被前端md5加密过一次
 * @param {MutationLoginArgs["tenant_id"]} tenant_id 租户id
 * @param {MutationLoginArgs["org_id"]} org_id 组织id
 * @param {MutationLoginArgs["lang"]} lang 语言编码
 */
export async function login(
  username: MutationLoginArgs["username"],
  password: MutationLoginArgs["password"],
  tenant_id: MutationLoginArgs["tenant_id"],
  org_id: MutationLoginArgs["org_id"],
  lang: MutationLoginArgs["lang"],
) {
  if (isEmpty(username) || isEmpty(password)) {
    throw await ns("用户名或密码不能为空");
  }
  if (isEmpty(tenant_id)) {
    throw await ns("请选择租户");
  }
  const password2 = await authService.getPassword(password);
  const model = await usrDao.findLoginUsr(
    username,
    password2,
    tenant_id,
  );
  if (!model || !model.id) {
    throw await ns("用户名或密码错误");
  }
  if (org_id === null) {
    org_id = undefined;
  }
  const org_ids = await usrDao.getDeptIdsById(
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
  const { authorization } = await authService.createToken({
    id: model.id,
    org_id,
    tenant_id,
    lang,
  });
  return {
    authorization,
    org_id,
  };
}

export async function getLoginInfo() {
  const authModel = await authService.getAuthModel();
  if (!authModel) {
    throw await ns("未登录");
  }
  const org_id = authModel.org_id;
  const id = authModel.id;
  const usrModel = await usrDaoGen.findById(id);
  if (!usrModel) {
    throw await ns("用户不存在");
  }
  const org_ids = usrModel.org_ids || [ ];
  const orgModels = await orgDaoGen.findAll();
  const org_id_models: { id: string, lbl: string }[] = [ ];
  for (let i = 0; i < orgModels.length; i++) {
    const orgModel = orgModels[i];
    if (org_ids.includes(orgModel.id)) {
      org_id_models.push({
        id: orgModel.id,
        lbl: orgModel.lbl,
      });
    }
  }
  return {
    lbl: usrModel.lbl,
    lang: authModel.lang,
    org_id,
    org_id_models,
  };
}

/**
 * 切换语言
 * @param {string} lang 语言编码
 **/
export async function selectLang(lang: string) {
  if (!lang) {
    throw await ns("语言编码不能为空");
  }
  const authModel = await authService.getAuthModel();
  if (!authModel) {
    throw await ns("未登录");
  }
  const { authorization } = await authService.createToken({
    ...authModel,
    lang,
  });
  return authorization;
}
