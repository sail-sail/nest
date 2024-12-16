export function getLocale(): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let usr: any = { };
  const usrStr = uni.getStorageSync("usr");
  if (usrStr) {
    try {
      usr = JSON.parse(usrStr);
    } catch (e) { /* empty */ }
  }
  let lang = usr?.lang?.toLowerCase();
  if (lang) {
    return lang;
  }
  let sysLang = uni.getLocale() || "zh-cn";
  if ([ "zh", "zh-cn", "zh-hans", "zh-hans-cn" ].indexOf(sysLang) > -1) {
    sysLang = "zh-cn";
  }
  
  lang = sysLang;
  if (lang && usr?.lang !== lang) {
    usr.lang = lang;
    uni.setStorageSync("usr", JSON.stringify(usr));
  }
  return lang;
}

export const lang = getLocale();
