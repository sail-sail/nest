import type {
  Mutation,
} from "/gen/types.ts"

import {
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import {
  findById as findByIdOrg,
} from "/gen/base/usr/usr.dao.ts";

import {
  createToken,
} from "/lib/auth/auth.dao.ts";

export async function orgLoginSelect(
  org_id: OrgId,
): Promise<Mutation["orgLoginSelect"]> {
  const authModel = await getAuthModel();
  if (authModel.org_id === org_id) {
    return "";
  }
  const usrModel = await findByIdOrg(authModel.id);
  const org_ids = usrModel?.org_ids || [ ];
  if (!org_ids.includes(org_id)) {
    throw `org_id: ${ org_id as unknown as string } dose not exit in login usr`;
  }
  authModel.org_id = org_id;
  // authModel.exp = undefined;
  const { authorization } = await createToken(authModel);
  return authorization;
}
