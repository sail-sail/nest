import {
  getAuthModel,
} from "/lib/auth/auth.dao.ts";

import {
  useContext,
} from "/lib/context.ts";

import { getEnv } from "/lib/env.ts";

const reg = /\{([\s\S]*?)\}/gm;

export async function n(
  routePath: string | null,
  code: string,
  // deno-lint-ignore no-explicit-any
  ...args: any[]
) {
  const authModel = await getAuthModel();
  let langCode = authModel?.lang;
  if (!langCode) {
    const context = useContext();
    langCode = context.lang;
  }
  return await nLang(langCode, routePath, code, ...args);
}

export function initN(
  routePath: string | null,
) {
  // deno-lint-ignore no-explicit-any
  return function(code: string, ...args: any[]) {
    return n(routePath, code, ...args);
  };
}

export async function ns(
  code: string,
  // deno-lint-ignore no-explicit-any
  ...args: any[]
) {
  const authModel = await getAuthModel();
  let langCode = authModel?.lang;
  if (!langCode) {
    const context = useContext();
    langCode = context.lang;
  }
  return await nLang(langCode, null, code, ...args);
}

export async function nLang(
  langCode: string,
  route_path: string | null,
  code: string,
  // deno-lint-ignore no-explicit-any
  ...args: any[]
) {
  const server_i18n_enable = await getEnv("server_i18n_enable");
  if (server_i18n_enable === "false" || !langCode) {
    if (args.length === 1 && typeof args[0] === "object") {
      const obj = args[0];
      let i18nLbl = code;
      i18nLbl = i18nLbl.replace(reg, (str) => {
        const str2 = str.substring(1, str.length-1);
        return obj[str2] ?? str;
      });
      return i18nLbl;
    } else if (args.length > 0) {
      let i18nLbl = code;
      i18nLbl = i18nLbl.replace(reg, (str) => {
        const str2 = str.substring(1, str.length-1);
        const num = Number(str2);
        if (isNaN(num)) {
          return str;
        }
        return args[num] ?? str;
      });
      return i18nLbl;
    }
    return code;
  }
  
  const {
    findOneLang,
  } = await import("/gen/base/lang/lang.dao.ts");
  const {
    findOneI18n,
  } = await import("/gen/base/i18n/i18n.dao.ts");
  
  const {
    findOneMenu,
  } = await import("/gen/base/menu/menu.dao.ts");
  
  let i18n_lbl = code;
  const lang_model = await findOneLang(
    {
      code: langCode,
      is_enabled: [ 1 ],
    },
    undefined,
    {
      is_debug: false,
    },
  );
  route_path = route_path ?? "";
  let menu_model: MenuModel | undefined;
  if (route_path) {
    menu_model = await findOneMenu(
      {
        route_path,
        is_enabled: [ 1 ],
      },
      undefined,
      {
        is_debug: false,
      },
    );
  }
  const menu_id = menu_model?.id ?? "" as MenuId;
  if (lang_model) {
    const i18n_model = await findOneI18n(
      {
        lang_id: [ lang_model.id ],
        menu_id: [ menu_id ],
        code,
      },
      undefined,
      {
        is_debug: false,
      },
    );
    if (i18n_model) {
      i18n_lbl = i18n_model.lbl;
    }
  }
  if (args.length === 1 && typeof args[0] === "object") {
    const obj = args[0];
    i18n_lbl = i18n_lbl.replace(reg, (str) => {
      const str2 = str.substring(1, str.length-1);
      return obj[str2] ?? str;
    });
  } else if (args.length > 0) {
    i18n_lbl = i18n_lbl.replace(reg, (str) => {
      const str2 = str.substring(1, str.length-1);
      const num = Number(str2);
      if (isNaN(num)) {
        return str;
      }
      return args[num] ?? str;
    });
  }
  return i18n_lbl;
}
