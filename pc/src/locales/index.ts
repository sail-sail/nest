import elementEnLocale from "element-plus/es/locale/lang/en";
import elementZhLocale from "element-plus/es/locale/lang/zh-cn";

import enLocale from "./en";
import zhLocale from "./zh-cn";

const messages = {
  [elementEnLocale.name]: {
    ...enLocale,
    ...elementEnLocale,
  },
  [elementZhLocale.name]: {
    ...zhLocale,
    ...elementZhLocale,
  },
};

export function getLocale(): string {
  let usr: {
    lang?: string;
  } = {
    lang: undefined,
  };
  const usrStr = localStorage.getItem("usr");
  if (usrStr) {
    try {
      usr = JSON.parse(usrStr);
    } catch (e) { /* empty */ }
  }
  let lang = usr?.lang;
  if (lang) {
    return lang;
  }
  lang = navigator.language;
  if ([ "zh", "zh-cn", "zh-hans", "zh-hans-cn" ].indexOf(lang.toLowerCase()) > -1) {
    lang = "zh-CN";
  }
  if (lang && usr?.lang !== lang) {
    usr.lang = lang;
    localStorage.setItem("usr", JSON.stringify(usr));
  }
  return lang;
}

export const lang = getLocale();

let key = lang.toLowerCase();

if (key === "en-us") {
  key = "en";
}

if (!messages[key]) {
  key = "zh-cn";
}

export default messages[key];
