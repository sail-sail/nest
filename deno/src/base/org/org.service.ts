import type {
  Mutation,
} from "/gen/types.ts"

import {
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import {
  findByIdUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  createToken,
} from "/lib/auth/auth.dao.ts";

import {
  ns,
} from "/src/base/i18n/i18n.ts";

export async function orgLoginSelect(
  org_id?: OrgId,
): Promise<Mutation["orgLoginSelect"]> {
  
  const authModel = await getAuthModel();
  if (!authModel) {
    throw await ns("用户未登录");
  }
  if (!org_id && !authModel.org_id) {
    return "";
  }
  if (authModel.org_id === org_id) {
    return "";
  }
  if (org_id) {
    const usr_model = await findByIdUsr(authModel.id);
    const org_ids = usr_model?.org_ids || [ ];
    if (!org_ids.includes(org_id)) {
      throw await ns("无权限切换到该组织");
    }
  }
  authModel.org_id = org_id;
  // authModel.exp = undefined;
  const { authorization } = await createToken(authModel);
  return authorization;
}
