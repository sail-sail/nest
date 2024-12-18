/* eslint-disable @typescript-eslint/no-explicit-any */
import cfg from "@/utils/config";

import {
  n0,
} from "./Api";

let i18nLblsLang: Record<string, any> | undefined = undefined;

const reg = /\{([\s\S]*?)\}/gm;

function setLblArgs(
  i18nLbl: string,
  args: any[],
) {
  if (args.length === 1 && typeof args[0] === "object") {
    const obj = args[0];
    i18nLbl = i18nLbl.replace(reg, (str) => {
      const str2 = str.substring(1, str.length-1);
      return obj[str2] ?? str;
    });
  } else if (args.length > 0) {
    i18nLbl = i18nLbl.replace(reg, (str) => {
      const str2 = str.substring(1, str.length-1);
      const num = Number(str2);
      if (isNaN(num)) {
        return str;
      }
      return args[num] ?? str;
    });
  }
  return i18nLbl;
}

/**
 * 页面打开后, 初始化当前页面的国际化
 * @param codes 
 * @returns 
 */
async function initI18ns(
  lang: string,
  codes: string[],
  routePath: string | null,
) {
  initI18nLblsLang();
  if (!i18nLblsLang) {
    return;
  }
  const i18nLbls = i18nLblsLang[lang];
  const keys2: string[] = [ ];
  const code2Prms: Promise<string>[] = [ ];
  for (let i = 0; i < codes.length; i++) {
    const code = codes[i];
    const key = JSON.stringify([ code, routePath ]);
    if (!i18nLbls[key]) {
      keys2.push(key);
      code2Prms.push(n0(lang, routePath, code, { notLoading: true }));
    }
  }
  if (code2Prms.length > 0) {
    const lbls2 = await Promise.all(code2Prms);
    for (let i = 0; i < keys2.length; i++) {
      const key = keys2[i];
      i18nLbls[key] = lbls2[i];
    }
    uni.setStorageSync(`i18nLblsLang`, JSON.stringify(i18nLblsLang));
  }
}

export function useI18n(routePath?: string | null) {
  const usrStore = useUsrStore(cfg.pinia);
  const lang = usrStore.getLang();
  return {
    n(code: string, ...args: any[]) {
      if (routePath === undefined) {
        const pages = getCurrentPages();
        const page = pages[pages.length - 1];
        routePath = page.route!;
      }
      return getLbl(lang, code, routePath, ...args);
    },
    initI18ns(
      codes: string[],
    ) {
      if (routePath === undefined) {
        const pages = getCurrentPages();
        const page = pages[pages.length - 1];
        routePath = page.route!;
      }
      return initI18ns(lang, codes, routePath);
    },
    ns(code: string, ...args: any[]) {
      return getLbl(lang, code, null, ...args);
    },
    initSysI18ns(
      codes: string[],
    ) {
      return initI18ns(lang, codes, null);
    },
  };
}

function initI18nLblsLang() {
  const usrStore = useUsrStore(cfg.pinia);
  const lang = usrStore.getLang();
  if (!i18nLblsLang) {
    const i18nsLangStr = uni.getStorageSync(`i18nLblsLang`);
    if (i18nsLangStr) {
      try {
        i18nLblsLang = JSON.parse(i18nsLangStr);
      } catch (e) { /* empty */ }
    }
    const __version = uni.getStorageSync("__i18n_version");
    if (i18nLblsLang?.__version !== __version) {
      i18nLblsLang = undefined;
    }
  }
  if (!i18nLblsLang) {
    i18nLblsLang = {
      [lang]: { },
    };
    const __version = uni.getStorageSync("__i18n_version");
    if (__version) {
      i18nLblsLang.__version = __version;
    }
    uni.setStorageSync(`i18nLblsLang`, JSON.stringify(i18nLblsLang));
  }
}

function getLbl(
  lang: string,
  code: string,
  routePath: string | null,
  ...args: any[]
) {
  initI18nLblsLang();
  if (!i18nLblsLang) {
    return "";
  }
  const i18nLbls = i18nLblsLang[lang];
  const key = JSON.stringify([ code, routePath ]);
  let i18nLbl: string = i18nLbls[key];
  if (i18nLbl) {
    i18nLbl = setLblArgs(i18nLbl, args);
    return i18nLbl;
  }
  const i18nLblRef = ref(setLblArgs(code, args));
  // 如果 i18nLbl 不存在, 则到服务器获取, 获取之后再缓存到本地
  if (!i18nLbls[key]) {
    (async function() {
        i18nLbls[key] = await n0(lang, routePath, code, { notLoading: true });
        uni.setStorageSync(`i18nLblsLang`, JSON.stringify(i18nLblsLang));
        i18nLblRef.value = setLblArgs(i18nLbls[key], args);
    })();
  }
  return i18nLblRef.value;
}
