import {
  isEmpty,
} from "/lib/util/string_util.ts";

import * as authService from "/lib/auth/auth.service.ts";

import {
  getAuthModel,
  getPassword,
} from "/lib/auth/auth.dao.ts";

import * as usrDao from "./usr.dao.ts";

import * as usrDaoGen from "/gen/base/usr/usr.dao.ts";

import * as orgDaoGen from "/gen/base/org/org.dao.ts";

import type {
  MutationLoginArgs,
  ChangePasswordInput,
} from "/gen/types.ts";

import {
  ns
} from "/src/base/i18n/i18n.ts";

/**
 * 登录获得 authorization
 * @param {MutationLoginArgs["input"]} input 登录信息
 *  username 用户名
 *  password 密码,传递进来的密码已经被前端md5加密过一次
 *  tenant_id 租户id
 *  org_id 组织id
 *  lang 语言编码
 */
export async function login(
  input: MutationLoginArgs["input"],
) {
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
  const org_ids = await usrDao.getOrgIdsById(
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
    username: usrModel.username,
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

/**
 * 修改密码
 * @param {ChangePasswordInput} input 修改密码信息
 *  oldPassword 旧密码
 *  password 新密码
 *  confirmPassword 确认密码
 **/
export async function changePassword(
  input: ChangePasswordInput,
) {
  const oldPassword = input.oldPassword;
  const password = input.password;
  const confirmPassword = input.confirmPassword;
  if (isEmpty(oldPassword)) {
    throw await ns("旧密码不能为空");
  }
  if (isEmpty(password)) {
    throw await ns("新密码不能为空");
  }
  if (isEmpty(confirmPassword)) {
    throw await ns("确认密码不能为空");
  }
  if (password !== confirmPassword) {
    throw await ns("两次输入的密码不一致");
  }
  const authModel = await getAuthModel();
  
  const id = authModel.id;
  
  const usrModel = await usrDaoGen.validateOption(
    await usrDaoGen.findOne({
      id,
    }),
  );
  await usrDaoGen.validateIsEnabled(usrModel);
  
  const usr_id = usrModel.id;
  
  const oldPassword2 = await getPassword(oldPassword);
  if (usrModel.password !== oldPassword2) {
    throw await ns("旧密码错误");
  }
  await usrDaoGen.updateById(
    usr_id,
    {
      password,
    },
  );
  return true;
}
