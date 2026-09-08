
type UaOs = "windows" | "android" | "ios" | "mac" | "linux" | "openharmony" | "unknown";
type UaPlatform = "android" | "iphone" | "ipad" | "ipod" | "openharmony" | "unknown";

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
  
  os: UaOs;
  
  platform: UaPlatform;
  
  isWxwork: boolean;
  
  isWechat: boolean;
  
  /**
   * Mozilla/5.0 (iPhone; CPU iPhone OS 17_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.52(0x18003425) NetType/4G Language/zh_CN
   */
  constructor(userAgent0: string) {
    this.#userAgent = userAgent0;
    const userAgent = userAgent0.toLowerCase();

    this.os = this.detectOs(userAgent);
    this.platform = this.detectPlatform(userAgent);

    this.isWxwork = userAgent.includes("wxwork");
    this.isWechat = userAgent.includes("wechat") || userAgent.includes("micromessenger");

    if (userAgent.includes("windowswechat")) {
      this.isWechat = true;
      this.os = "windows";
    } else if (userAgent.includes("macwechat")) {
      this.isWechat = true;
      this.os = "mac";
    }
  }

  private detectOs(userAgent: string): UaOs {
    if (userAgent.includes("windows")) {
      return "windows";
    }
    if (userAgent.includes("android")) {
      return "android";
    }
    if (userAgent.includes("iphone") || userAgent.includes("ipad") || userAgent.includes("ipod")) {
      return "ios";
    }
    if (userAgent.includes("mac")) {
      return "mac";
    }
    if (userAgent.includes("linux")) {
      return "linux";
    }
    if (userAgent.includes("openharmony")) {
      return "openharmony";
    }
    return "unknown";
  }

  private detectPlatform(userAgent: string): UaPlatform {
    if (userAgent.includes("iphone")) {
      return "iphone";
    }
    if (userAgent.includes("android")) {
      return "android";
    }
    if (userAgent.includes("ipad")) {
      return "ipad";
    }
    if (userAgent.includes("ipod")) {
      return "ipod";
    }
    if (userAgent.includes("openharmony")) {
      return "openharmony";
    }
    return "unknown";
  }
  
  get isPc() {
    return this.os === "windows" || this.os === "mac" || this.os === "linux" || this.platform === "ipad";
  }
  
  get isMobile() {
    return this.os === "android" || this.platform === "iphone" || this.platform === "ipod" || this.platform === "openharmony";
  }
  
  get isShareWeixin() {
    return this.isMobile || this.platform === "ipad";
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
