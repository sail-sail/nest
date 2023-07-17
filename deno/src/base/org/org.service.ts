import {
  type Mutation,
} from "/gen/types.ts"

import * as authDao from "/lib/auth/auth.dao.ts";

import * as usrDao from "/gen/base/usr/usr.dao.ts";

import * as authService from "/lib/auth/auth.service.ts";

export async function orgLoginSelect(
  org_id: string,
): Promise<Mutation["orgLoginSelect"]> {
  const authModel = await authDao.getAuthModel();
  if (authModel.org_id === org_id) {
    return "";
  }
  const usrModel = await usrDao.findById(authModel.id);
  const org_ids = usrModel?.org_ids || [ ];
  if (!org_ids.includes(org_id)) {
    throw `org_id: ${ org_id } dose not exit in login usr`;
  }
  authModel.org_id = org_id;
  // authModel.exp = undefined;
  const { authorization } = await authService.createToken(authModel);
  return authorization;
}
