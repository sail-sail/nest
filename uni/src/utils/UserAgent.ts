
// exports.UserAgent = class UserAgent {
export class UserAgent {
  
  /**
   * 谷歌浏览器: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36
   * 企业微信桌: Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.1.11.0 Safari/537.36 Language/zh wxwork/4.0.20 (MicroMessenger/6.2) WindowsWechat  MailPlugin_Electron WeMail embeddisk
   * iPhone: mozilla/5.0 (iphone; cpu iphone os 16 11 like mac os x) applewebkit/605.1.15 (khtml, like gecko) mobile/15e148 wxwork/4.0.20 micromessenger/7.0.1 languagezh colorscheme/light
   * 微信安卓: Mozilla/5.0 (Linux; Android 10; DT1901A Build/QKQ1.191222.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/107.0.5304.141 Mobile Safari/537.36 XWEB/5015 MMWEBSDK/20221206 MMWEBID/8573 MicroMessenger/8.0.32.2300(0x2800205D) WeChat/arm64 Weixin NetType/4G Language/zh_CN ABI/arm64
   * @type {string}
   * @memberof UserAgent
   */
  #userAgent: string;
  
  os: "windows" | "android" | "mac" | "linux" | "openharmony" | "unknown";
  
  platform: "android" | "iphone" | "ipad" | "ipod" | "openharmony" | "unknown";
  
  isWxwork: boolean;
  
  isWechat: boolean;
  
  /**
   * Mozilla/5.0 (iPhone; CPU iPhone OS 17_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.52(0x18003425) NetType/4G Language/zh_CN
   */
  constructor(userAgent0: string) {
    this.#userAgent = userAgent0;
    let userAgent = userAgent0.toLowerCase();
    if (userAgent.includes("windows")) {
      this.os = "windows";
    } else if (userAgent.includes("android")) {
      this.os = "android";
    } else if (userAgent.includes("mac")) {
      this.os = "mac";
    } else if (userAgent.includes("openharmony")) {
      this.os = "openharmony";
    } else {
      this.os = "unknown";
    }
    if (userAgent.includes("iphone")) {
      this.platform = "iphone";
    } else if (userAgent.includes("android")) {
      this.platform = "android";
    } else if (userAgent.includes("ipad")) {
      this.platform = "ipad";
    } else if (userAgent.includes("ipod")) {
      this.platform = "ipod";
    } else if (userAgent.includes("openharmony")) {
      this.platform = "openharmony";
    } else {
      this.platform = "unknown";
    }
    this.isWxwork = userAgent.includes(" wxwork");
    this.isWechat = userAgent.includes(" wechat");
    if (!this.isWechat) {
      if (userAgent.includes("micromessenger")) {
        this.isWechat = true;
      }
    }
    if (userAgent.includes("windowswechat")) {
      this.isWechat = true;
      this.os = "windows";
    } else if (userAgent.includes("macwechat")) {
      this.isWechat = true;
      this.os = "mac";
    }
  }
  
  get isPc() {
    return this.os === "windows" || this.os === "linux" || this.platform === "ipad";
  }
  
  get isMobile() {
    return this.os === "android" || this.platform === "iphone" || this.platform === "ipod" || this.platform === "openharmony";
  }
  
  get isShareWeixin() {
    return this.os === "android" || this.platform === "iphone" || this.platform === "ipad" || this.platform === "openharmony";
  }
  
  toString() {
    return this.#userAgent;
  }
  
  toJSON() {
    return {
      os: this.os,
      isWxwork: this.isWxwork,
      isPc: this.isPc,
      isMobile: this.isMobile,
      isShareWeixin: this.isShareWeixin,
    };
  }
  
}
