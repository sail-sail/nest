export function isEmpty(str?: string | null): boolean {
  return str === undefined || str === null || str === "" || str.trim() === "";
}

export function isNotEmpty(str?: string | null): str is string {
  return !(str === undefined || str === null || str === "" || str.trim() === "");
}

let UID = Date.now();

export function uniqueID() {
  return (UID++).toString(36);
}

export function uuid() {
  if (typeof crypto !== "undefined") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Parse a query string into an object.
 */
function parseQuery(query: string): Record<string, string> {
  const result: Record<string, string> = { };
  if (query) {
    const pairs = query.split("&");
    for (const pair of pairs) {
      const [ key, value ] = pair.split("=");
      result[key] = value;
    }
  }
  return result;
}

const urlReg = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
const urlReg_names = ["url","scheme","slash","host","port","path","query","hash"];

/**
 * 解析url地址
 */
export function parseUrl(url: string) {
  const result = urlReg.exec(url);
  const urlObj: {
    url?: string;
    scheme?: string;
    slash?: string;
    host?: string;
    port?: string;
    path?: string;
    query: Record<string, string>;
    hash?: string;
  } = {
    query: { },
  };
  if (!result) {
    return urlObj;
  }
  for (let i = 0; i < urlReg_names.length; i++) {
    const urlReg_name = urlReg_names[i];
    urlObj[urlReg_name] = result[i];
    if (urlReg_name === "query") {
      urlObj.query = parseQuery(result[i]);
    }
  }
  return urlObj;
}
