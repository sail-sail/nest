import {
  setNotVerifyToken,
} from "/lib/context.ts";

/**
 * 国际化
 * @param langCode 语言编码, 例如: zh-CN
 * @param routePath 页面路由, 例如: /user
 * @param code 国际化编码
 */
export async function n(
  langCode: string,
  routePath: string | null,
  code: string,
) {
  
  const {
    nLang,
  } = await import("./i18n.ts");
  
  setNotVerifyToken(true);
  
  return await nLang(langCode, routePath, code);
}
