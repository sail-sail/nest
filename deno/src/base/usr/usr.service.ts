import {
  isEmpty,
} from "/lib/util/string_util.ts";

import * as authService from "/lib/auth/auth.service.ts";

import * as usrDao from "./usr.dao.ts";

import * as usrDaoGen from "/gen/base/usr/usr.dao.ts";

import * as deptDaoGen from "/gen/base/dept/dept.dao.ts";

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
 * @param {MutationLoginArgs["dept_id"]} dept_id 部门id
 * @param {MutationLoginArgs["lang"]} lang 语言编码
 */
export async function login(
  username: MutationLoginArgs["username"],
  password: MutationLoginArgs["password"],
  tenant_id: MutationLoginArgs["tenant_id"],
  dept_id: MutationLoginArgs["dept_id"],
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
  if (dept_id === null) {
    dept_id = undefined;
  }
  const dept_ids = await usrDao.getDept_idsById(
    model.id,
  );
  if (!dept_id) {
    dept_id = model.default_dept_id || dept_ids[0];
  }
  if (dept_id) {
    if (!dept_ids.includes(dept_id)) {
      dept_id = undefined;
    }
  }
  const { authorization } = await authService.createToken({
    id: model.id,
    dept_id,
    lang,
  });
  return {
    authorization,
    dept_id,
  };
}

export async function getLoginInfo() {
  const authModel = await authService.getAuthModel();
  if (!authModel) {
    throw await ns("未登录");
  }
  const dept_id = authModel.dept_id;
  const id = authModel.id;
  const usrModel = await usrDaoGen.findById(id);
  if (!usrModel) {
    throw await ns("用户不存在");
  }
  const dept_ids = usrModel.dept_ids || [ ];
  const deptModels = await deptDaoGen.findAll();
  const dept_idModels: { id: string, lbl: string }[] = [ ];
  for (let i = 0; i < deptModels.length; i++) {
    const deptModel = deptModels[i];
    if (dept_ids.includes(deptModel.id)) {
      dept_idModels.push({
        id: deptModel.id,
        lbl: deptModel.lbl,
      });
    }
  }
  return {
    lbl: usrModel.lbl,
    lang: authModel.lang,
    dept_id,
    dept_idModels,
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
    id: authModel.id,
    dept_id: authModel.dept_id,
    lang,
  });
  return authorization;
}
