import {
  isEmpty,
} from "/lib/util/string_util.ts";

import {
  createToken,
  getAuthModel,
  getPassword,
} from "/lib/auth/auth.dao.ts";

import {
  findLoginUsr,
  getOrgIdsById,
} from "./usr.dao.ts";

import * as usrDaoGen from "/gen/base/usr/usr.dao.ts";

import * as orgDaoGen from "/gen/base/org/org.dao.ts";

import {
  create as createLoginLog,
  findCount as findCountLoginLog,
} from "/gen/base/login_log/login_log.dao.ts";

import {
  type MutationLoginArgs,
  type ChangePasswordInput,
  type LoginModel,
  LoginLogType,
} from "/gen/types.ts";

import {
  ns
} from "/src/base/i18n/i18n.ts";

import dayjs from "dayjs";

import {
  ServiceException,
} from "/lib/exceptions/service.exception.ts";

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
  ip: string,
  input: MutationLoginArgs["input"],
): Promise<LoginModel> {
  const username = input.username;
  const password = input.password;
  const tenant_id: TenantId = input.tenant_id;
  let org_id: OrgId | null | undefined = input.org_id;
  const lang = input.lang;
  if (isEmpty(username) || isEmpty(password)) {
    throw await ns("用户名或密码不能为空");
  }
  if (isEmpty(tenant_id)) {
    throw await ns("请选择租户");
  }
  // 最近10分钟内密码错误6次, 此用户名锁定10分钟
  const now = dayjs();
  const begin = now.subtract(10, "minute").format("YYYY-MM-DD HH:mm:ss");
  const end = now.format("YYYY-MM-DD HH:mm:ss");
  const loginLog1Count = await findCountLoginLog({
    type: [ LoginLogType.Account ],
    username,
    ip,
    is_succ: [ 1 ],
    create_time: [ begin, end ],
    tenant_id,
  });
  if (loginLog1Count === 0) {
    const loginLog0Count = await findCountLoginLog({
      type: [ LoginLogType.Account ],
      username,
      ip,
      is_succ: [ 0 ],
      create_time: [ begin, end ],
      tenant_id,
    });
    if (loginLog0Count >= 6) {
      throw await ns(`密码错误次数过多, 请10分钟后再试`);
    }
  }
  const password2 = await getPassword(password);
  const usr_model = await findLoginUsr(
    username,
    password2,
    tenant_id,
  );
  if (!usr_model || !usr_model.id) {
    await createLoginLog({
      type: LoginLogType.Account,
      username,
      ip,
      is_succ: 0,
      tenant_id,
    });
    throw new ServiceException(await ns("用户名或密码错误"), "username_or_password_error", false);
  }
  await createLoginLog({
    type: LoginLogType.Account,
    username,
    ip,
    is_succ: 1,
    tenant_id,
    create_usr_id: usr_model.id,
  });
  const usr_id = usr_model.id;
  if (org_id === null) {
    org_id = undefined;
  }
  if (!org_id) {
    org_id = usr_model.default_org_id;
  }
  if (org_id) {
    const org_ids = await getOrgIdsById(
      usr_model.id,
    );
    if (!org_ids.includes(org_id)) {
      org_id = undefined;
    }
  }
  const {
    authorization,
  } = await createToken({
    id: usr_model.id,
    org_id,
    tenant_id,
    lang,
  });
  return {
    usr_id,
    username,
    tenant_id,
    authorization,
    org_id,
    lang,
  };
}

export async function getLoginInfo() {
  const authModel = await getAuthModel();
  if (!authModel) {
    throw await ns("未登录");
  }
  const org_id = authModel.org_id;
  const id: UsrId = authModel.id;
  const usrModel = await usrDaoGen.findById(id);
  if (!usrModel) {
    throw await ns("用户不存在");
  }
  const org_ids = usrModel.org_ids || [ ];
  const orgModels = await orgDaoGen.findAll();
  const org_id_models: { id: OrgId, lbl: string }[] = [ ];
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
  const authModel = await getAuthModel();
  if (!authModel) {
    throw await ns("未登录");
  }
  const { authorization } = await createToken({
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
  
  const id = authModel?.id;
  
  const usrModel = await usrDaoGen.validateOption(
    await usrDaoGen.findOne({
      id,
    }),
  );
  await usrDaoGen.validateIsEnabled(usrModel);
  
  const usr_id: UsrId = usrModel.id;
  
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
