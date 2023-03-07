import {
  useContext,
} from "/lib/context.ts";

import {
  nLang,
} from "./i18n.ts";

export const _internals = {
  n,
};

/**
 * 国际化
 * @param langCode 语言编码, 例如: zh-CN
 * @param routePath 页面路由, 例如: /user
 * @param code 国际化编码
 */
async function n(
  langCode: string,
  routePath: string | null,
  code: string,
) {
  const context = useContext();
  context.notVerifyToken = true;
  return await nLang(langCode, routePath, code);
}
