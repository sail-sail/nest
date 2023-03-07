import {
  type Query,
} from "/gen/types.ts";

import {
  _internals as langDao,
} from "/gen/lang/lang.dao.ts";

export const _internals = {
  getLoginLangs,
};

/**
 * 获取语言列表
 */
async function getLoginLangs(): Promise<Query["getLoginLangs"]> {
  const langs = await langDao.findAll({
    is_enabled: [ 1 ],
  });
  return langs;
}
