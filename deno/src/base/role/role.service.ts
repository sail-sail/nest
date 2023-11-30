import {
  findAll as findAllRole,
} from "/gen/base/role/role.dao.ts";

import {
  findById as findByIdUsr,
  validateOption as validateOptionUsr,
  validateIsEnabled as validateIsEnabledUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import {
  isEmpty,
} from "/lib/util/string_util.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

/** 获取当前角色的首页轮播图路由 */
export async function getHomeUrls() {
  
  const authModel = await getAuthModel();
  const usr_id: UsrId = authModel.id;
  
  const usrModel = await validateOptionUsr(
    await findByIdUsr(usr_id),
  );
  await validateIsEnabledUsr(usrModel);
  
  const role_ids = usrModel.role_ids;
  
  const roleModels = await findAllRole({
    ids: role_ids,
  });
  
  const home_urls = [ ];
  for (const roleModel of roleModels) {
    const home_url = roleModel.home_url;
    if (isEmpty(home_url)) {
      continue;
    }
    const strs = home_url
      .split(",")
      .filter((str) => !isEmpty(str));
    home_urls.push(...strs);
  }
  return home_urls;
}
