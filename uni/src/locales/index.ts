const systemInfo = uni.getSystemInfoSync();

let sysLang = systemInfo.language?.toLowerCase() || "zh-cn";
if ([ "zh", "zh-cn", "zh-hans", "zh-hans-cn" ].indexOf(sysLang) > -1) {
  sysLang = "zh-cn";
}

export function getLocale(): string {
  let usr: any = { };
  const usrStr = uni.getStorageSync("usr");
  if (usrStr) {
    try {
      usr = JSON.parse(usrStr);
    } catch (e) { }
  }
  let lang = usr?.lang?.toLowerCase();
  if (lang) {
    return lang;
  }
  lang = sysLang;
  if (lang && usr?.lang !== lang) {
    usr.lang = lang;
    uni.setStorageSync("usr", JSON.stringify(usr));
  }
  return lang;
}

export const lang = getLocale();
