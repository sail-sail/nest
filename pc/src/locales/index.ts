import elementEnLocale from "element-plus/es/locale/lang/en";
import elementZhLocale from "element-plus/es/locale/lang/zh-cn";

import enLocale from "./en";
import zhLocale from "./zh-cn";

const messages = {
  [elementEnLocale.name]: {
    ...enLocale,
    ...elementZhLocale,
  },
  [elementZhLocale.name]: {
    ...zhLocale,
    ...elementZhLocale,
  },
};

export function getLocale(): string {
  let usr: any = { };
  const usrStr = localStorage.getItem("usr");
  if (usrStr) {
    try {
      usr = JSON.parse(usrStr);
    } catch (e) { }
  }
  let lang = usr?.lang?.toLowerCase();
  if (lang) {
    return lang;
  }
  lang = navigator.language.toLowerCase();
  if ([ "zh", "zh-cn", "zh-hans", "zh-hans-cn" ].indexOf(lang) > -1) {
    lang = "zh-cn";
  }
  const locales = Object.keys(messages);
  for (const locale of locales) {
    if (lang.indexOf(locale) > -1) {
      lang = locale;
      break;
    }
  }
  if (lang && usr?.lang !== lang) {
    usr.lang = lang;
    localStorage.setItem("usr", JSON.stringify(usr));
  }
  return lang;
}

export const lang = getLocale();

export default messages[lang];
