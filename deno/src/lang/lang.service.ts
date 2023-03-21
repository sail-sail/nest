import {
  type Query,
} from "/gen/types.ts";

import * as langDao from "/gen/lang/lang.dao.ts";

/**
 * 获取语言列表
 */
export async function getLoginLangs(): Promise<Query["getLoginLangs"]> {
  const langs = await langDao.findAll({
    is_enabled: [ 1 ],
  });
  return langs;
}
