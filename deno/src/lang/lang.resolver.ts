import * as langService from "./lang.service.ts";

/**
 * 获取语言列表
 */
export async function getLoginLangs() {
  return await langService.getLoginLangs();
}
