import {
  useContext,
} from "/lib/context.ts";

import {
  _internals as lanService,
} from "./lang.service.ts";

export const _internals = {
  getLoginLangs,
};

/**
 * 获取语言列表
 */
export async function getLoginLangs() {
  return await lanService.getLoginLangs();
}
