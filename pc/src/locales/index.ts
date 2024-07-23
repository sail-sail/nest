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

function getLocale(): string {
  let usr: any = { };
  const usrStr = localStorage.getItem("usr");
  if (usrStr) {
    try {
      usr = JSON.parse(usrStr);
    } catch (e) { }
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

export default messages[lang.toLowerCase()] || messages["zh-cn"];
