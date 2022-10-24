import {
  type Context,
} from "/lib/context.ts";

import {
  type Query,
} from "/gen/types.ts"

import { getAuthModel } from "/lib/auth/auth.dao.ts";

import * as usrDao from "/gen/usr/usr.dao.ts";

export async function findDeptsByToken(
  context: Context,
): Promise<Query["findDeptsByToken"]> {
  const authModel = (await getAuthModel(context))!;
  const usrModel = await usrDao.findOne(
    context,
    {
      id: authModel.id,
    },
  );
  const dept_ids = usrModel.dept_ids || [ ];
  const _dept_ids = usrModel._dept_ids || [ ];
  const models: Query["findDeptsByToken"] = [ ];
  for (let i = 0; i < dept_ids.length; i++) {
    const id = dept_ids[i];
    const lbl = _dept_ids[i];
    models.push({
      id,
      lbl,
    });
  }
  return models;
}
