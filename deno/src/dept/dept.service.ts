import {
  type Mutation,
} from "/gen/types.ts"

import * as authDao from "/lib/auth/auth.dao.ts";

import * as usrDao from "/gen/usr/usr.dao.ts";

import * as authService from "/lib/auth/auth.service.ts";

export async function deptLoginSelect(
  dept_id: string,
): Promise<Mutation["deptLoginSelect"]> {
  const authModel = await authDao.getAuthModel();
  if (authModel.dept_id === dept_id) {
    return "";
  }
  const usrModel = await usrDao.findById(authModel.id);
  const dept_ids = usrModel?.dept_ids || [ ];
  if (!dept_ids.includes(dept_id)) {
    throw `dept_id: ${ dept_id } dose not exit in login usr`;
  }
  authModel.dept_id = dept_id;
  // authModel.exp = undefined;
  const { authorization } = await authService.createToken(authModel);
  return authorization;
}
