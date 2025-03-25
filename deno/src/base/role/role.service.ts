import {
  findAllRole,
} from "/gen/base/role/role.dao.ts";

import {
  findByIdUsr,
  validateOptionUsr,
  validateIsEnabledUsr,
} from "/gen/base/usr/usr.dao.ts";

import {
  get_usr_id,
} from "/lib/auth/auth.dao.ts";

import {
  isEmpty,
} from "/lib/util/string_util.ts";

/** 获取当前角色的首页轮播图路由 */
export async function getHomeUrls() {
  
  const usr_id = await get_usr_id();
  
  const usr_model = await validateOptionUsr(
    await findByIdUsr(
      usr_id,
      {
        is_debug: false,
      },
    ),
  );
  await validateIsEnabledUsr(usr_model);
  
  const role_ids = usr_model.role_ids;
  
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
