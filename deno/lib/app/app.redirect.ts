/**
 * 统一跳转: 电脑端跳 /#/route_path, 手机端跳 /uni/#/uni_path
 * 不需要登录, 供企微卡片等外部链接落地使用
 */

/** 统一跳转参数 */
export interface RedirectQuery {
  /** 电脑端 hash 路由, 如 /scrm/clue */
  route_path?: string | null;
  /** 查询参数, 支持 JSON 对象 {"id":"x"} 与 id=x&a=1 */
  route_query?: string | null;
  /** 手机端页面路径, 如 /pages/clue/List, 不传时按电脑端路由推导 */
  uni_path?: string | null;
  /** 强制端: pc / uni, 不传时按 User-Agent 判断 */
  target?: string | null;
  /** 消息ID, 会以 _message_id 透传给落地页, 落地页据此标记消息已读 */
  message_id?: string | null;
}

/** 统一跳转结果 */
export interface RedirectResult {
  /** 跳转地址, 为空表示参数不合法 */
  location?: string;
  /** 参数不合法时的说明 */
  message?: string;
}

/** User-Agent 判定结果, 规则与 uni/src/utils/UserAgent.ts 保持一致 */
interface UaInfo {
  os: string;
  platform: string;
  /** 电脑端: windows/mac/linux, iPad 也按电脑端处理 */
  is_pc: boolean;
  /** 手机端: android/iPhone/iPod/OpenHarmony */
  is_mobile: boolean;
}

function detectOs(user_agent: string): string {
  if (user_agent.includes("windows")) {
    return "windows";
  } else if (user_agent.includes("android")) {
    return "android";
  } else if (
    user_agent.includes("iphone") ||
    user_agent.includes("ipad") ||
    user_agent.includes("ipod")
  ) {
    return "ios";
  } else if (user_agent.includes("mac")) {
    return "mac";
  } else if (user_agent.includes("linux")) {
    return "linux";
  } else if (user_agent.includes("openharmony")) {
    return "openharmony";
  }
  return "unknown";
}

function detectPlatform(user_agent: string): string {
  if (user_agent.includes("iphone")) {
    return "iphone";
  } else if (user_agent.includes("android")) {
    return "android";
  } else if (user_agent.includes("ipad")) {
    return "ipad";
  } else if (user_agent.includes("ipod")) {
    return "ipod";
  } else if (user_agent.includes("openharmony")) {
    return "openharmony";
  }
  return "unknown";
}

/** 解析 User-Agent */
export function parseUserAgent(user_agent0: string): UaInfo {
  const user_agent = (user_agent0 || "").toLowerCase();
  const os = detectOs(user_agent);
  const platform = detectPlatform(user_agent);
  return {
    os,
    platform,
    is_pc: os === "windows" || os === "mac" || os === "linux" || platform === "ipad",
    is_mobile: os === "android" ||
      platform === "iphone" ||
      platform === "ipod" ||
      platform === "openharmony",
  };
}

/** 取请求头第一个值 */
export function headerValue(headers: Headers, name: string): string {
  const value = headers.get(name);
  if (!value) {
    return "";
  }
  return value.split(",")[0].trim();
}

/** 当前请求的站点前缀, 兼容反向代理 */
export function getRequestOrigin(headers: Headers): string {
  const protocol = headerValue(headers, "x-forwarded-proto") || "https";
  const host = headerValue(headers, "x-forwarded-host") || headerValue(headers, "host");
  if (!host) {
    return "";
  }
  return `${ protocol }://${ host }`;
}

/** 校验路径: 只允许站内绝对路径, 防止开放重定向 */
export function normalizePath(raw?: string | null): string | undefined {
  const path = (raw ?? "").trim().split(/[?#]/)[0].trim();
  if (
    !path.startsWith("/") ||
    path.startsWith("//") ||
    path.includes("://") ||
    path.includes("\\")
  ) {
    return;
  }
  return path.replace(/\/+$/, "") || "/";
}

function capitalize(value: string): string {
  if (!value) {
    return "";
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** 电脑端路由推导手机端页面: /scrm/clue -> /pages/clue/List, /scrm/clue/pool -> /pages/clue/Pool */
export function guessUniPath(route_path: string): string | undefined {
  const segments = route_path.split("/").filter((segment) => segment !== "");
  if (segments.length === 2) {
    return `/pages/${ segments[1] }/List`;
  }
  if (segments.length === 3) {
    return `/pages/${ segments[1] }/${ capitalize(segments[2]) }`;
  }
  return;
}

function decodeValue(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch (err) {
    return value;
  }
}

/** 解析查询参数, 支持 JSON 对象与 a=1&b=2 */
export function parseQueryPairs(route_query0?: string | null): [string, string][] {
  const route_query = (route_query0 ?? "").trim();
  if (!route_query) {
    return [ ];
  }

  const pairs: [string, string][] = [ ];

  try {
    const json = JSON.parse(route_query);
    if (json && typeof json === "object" && !Array.isArray(json)) {
      for (const key of Object.keys(json)) {
        const value = json[key];
        pairs.push([
          key,
          typeof value === "string" ? value : JSON.stringify(value),
        ]);
      }
      return pairs;
    }
  } catch (err) {
    // 不是 JSON 时按查询字符串解析
  }

  const query_string = route_query.replace(/^\?+/, "");
  for (const pair of query_string.split("&")) {
    if (!pair) {
      continue;
    }
    const index = pair.indexOf("=");
    if (index < 0) {
      pairs.push([ pair, "" ]);
      continue;
    }
    pairs.push([
      pair.slice(0, index),
      decodeValue(pair.slice(index + 1)),
    ]);
  }
  return pairs;
}

function appendQuery(base: string, pairs: [string, string][]): string {
  if (pairs.length === 0) {
    return base;
  }
  const query_string = pairs.map(([ key, value ]) => {
    return `${ encodeURIComponent(key) }=${ encodeURIComponent(value) }`;
  }).join("&");
  return base.includes("?")
    ? `${ base }&${ query_string }`
    : `${ base }?${ query_string }`;
}

/** 电脑端: {origin}/#/route_path?参数 */
export function buildPcUrl(
  origin: string,
  route_path: string,
  pairs: [string, string][],
): string {
  return appendQuery(`${ origin }/#${ route_path }`, pairs);
}

/** 手机端: _tab_name / _message_id 平铺, 其余参数打包进 builtInSearch(JSON) */
export function buildUniUrl(
  origin: string,
  uni_path: string,
  pairs: [string, string][],
): string {
  const flat_pairs: [string, string][] = [ ];
  const built_in_search: Record<string, string> = { };

  for (const [ key, value ] of pairs) {
    if (key === "_tab_name" || key === "_message_id") {
      flat_pairs.push([ key, value ]);
    } else {
      built_in_search[key] = value;
    }
  }

  if (Object.keys(built_in_search).length > 0) {
    flat_pairs.push([ "builtInSearch", JSON.stringify(built_in_search) ]);
  }

  return appendQuery(`${ origin }/uni/#${ uni_path }`, flat_pairs);
}

/**
 * 计算统一跳转地址
 * @param query 跳转参数
 * @param user_agent 请求的 User-Agent, 不传 target 时用它判断端
 * @param origin 站点前缀, 如 https://cloud.pomeas.cn
 */
export function redirect(
  query: RedirectQuery,
  user_agent: string,
  origin: string,
): RedirectResult {
  if (!origin) {
    return { message: "host_empty" };
  }

  const route_path = normalizePath(query.route_path);
  if (!route_path) {
    return { message: "route_path_invalid" };
  }

  const uni_path = normalizePath(query.uni_path);
  const pairs = parseQueryPairs(query.route_query);

  // 企微消息带的 message_id 统一转成落地页的 _message_id, 与业务参数区分开
  const message_id = (query.message_id ?? "").trim();
  if (message_id) {
    pairs.push([ "_message_id", message_id ]);
  }

  const target = (query.target ?? "").trim().toLowerCase();
  let is_uni: boolean;
  if (target === "uni" || target === "mobile") {
    is_uni = true;
  } else if (target === "pc" || target === "desktop") {
    is_uni = false;
  } else {
    const ua = parseUserAgent(user_agent);
    is_uni = !ua.is_pc && ua.is_mobile;
  }

  let location: string;
  if (is_uni) {
    const uni_path2 = uni_path || guessUniPath(route_path);
    // 手机端没有对应页面时回退电脑端, 避免白屏
    location = uni_path2
      ? buildUniUrl(origin, uni_path2, pairs)
      : buildPcUrl(origin, route_path, pairs);
  } else {
    location = buildPcUrl(origin, route_path, pairs);
  }

  return { location };
}
