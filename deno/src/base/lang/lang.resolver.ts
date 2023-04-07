
/**
 * 获取语言列表
 */
export async function getLoginLangs() {
  // import * as langService from "./lang.service.ts";
  const {
    getLoginLangs,
  } = await import("./lang.service.ts");
  return await getLoginLangs();
}
