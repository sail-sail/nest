import type {
  Mutation,
} from "/gen/types.ts"

import {
  getCacheEnabled,
  delCache,
  execute,
  QueryArgs,
} from "/lib/context.ts";

import {
  createToken,
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import {
  getOrgIdsById,
} from "/src/base/usr/usr.dao.ts";

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
    const org_ids = await getOrgIdsById(
      authModel.id,
      authModel.tenant_id,
    );
    if (!org_ids.includes(org_id)) {
      throw await ns("无权限切换到该组织");
    }
  }
  authModel.org_id = org_id;
  const args = new QueryArgs();
  const sql = `update base_usr set default_org_id=${ args.push(org_id) } where id=${ args.push(authModel.id) } and tenant_id=${ args.push(authModel.tenant_id) } and is_deleted=0`;
  await execute(sql, args);
  if (getCacheEnabled()) {
    await delCache("dao.sql.base_usr");
  }
  // authModel.exp = undefined;
  const { authorization } = await createToken(authModel);
  return authorization;
}
