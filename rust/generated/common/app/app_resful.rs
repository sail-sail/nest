use poem::{
  http::{header, StatusCode},
  Request, Response,
};
use serde::Deserialize;
use serde_json::{Map, Value};
use tracing::info;

/// 统一跳转参数
#[derive(Deserialize, Default)]
pub struct RedirectQuery {
  /// 电脑端 hash 路由, 如 /scrm/clue
  pub route_path: Option<String>,
  /// 查询参数, 支持 JSON 对象 {"id":"x"} 与 a=1&b=2
  pub route_query: Option<String>,
  /// 手机端页面路径, 如 /pages/clue/List, 不传时按电脑端路由推导
  pub uni_path: Option<String>,
  /// 强制端: pc / uni, 不传时按 User-Agent 判断
  pub target: Option<String>,
}

/// 统一跳转: 电脑端跳 /#/route_path, 手机端跳 /uni/#/uni_path
pub async fn redirect(
  req: &Request,
  query: RedirectQuery,
) -> Response {
  let origin = request_origin(req);
  if origin.is_empty() {
    return bad_request("host_empty");
  }

  let Some(route_path) = query.route_path.as_deref().and_then(normalize_path) else {
    return bad_request("route_path_invalid");
  };

  let uni_path = query.uni_path.as_deref().and_then(normalize_path);
  let pairs = parse_query_pairs(query.route_query.as_deref().unwrap_or_default());

  let target = query.target.as_deref().unwrap_or_default().trim().to_lowercase();
  let is_uni = match target.as_str() {
    "uni" | "mobile" => true,
    "pc" | "desktop" => false,
    _ => {
      let user_agent = req.header(header::USER_AGENT).unwrap_or_default();
      let user_agent = UaInfo::parse(user_agent);
      !user_agent.is_pc() && user_agent.is_mobile()
    },
  };

  let location = if is_uni {
    match uni_path.or_else(|| guess_uni_path(&route_path)) {
      Some(uni_path) => build_uni_url(&origin, &uni_path, &pairs),
      // 手机端没有对应页面时回退电脑端, 避免白屏
      None => build_pc_url(&origin, &route_path, &pairs),
    }
  } else {
    build_pc_url(&origin, &route_path, &pairs)
  };

  info!(
    "统一跳转: route_path={route_path}, is_uni={is_uni}, location={location}",
  );

  Response::builder()
    .status(StatusCode::FOUND)
    .header(header::LOCATION, location)
    .finish()
}

/// User-Agent 判定结果, 规则与 uni/src/utils/UserAgent.ts 保持一致
struct UaInfo {
  os: String,
  platform: String,
  #[allow(dead_code)]
  is_wxwork: bool,
  #[allow(dead_code)]
  is_wechat: bool,
}

impl UaInfo {
  fn parse(user_agent: &str) -> Self {
    let user_agent = user_agent.to_lowercase();
    let mut os = detect_os(&user_agent);
    let platform = detect_platform(&user_agent);
    let is_wxwork = user_agent.contains("wxwork");
    let mut is_wechat = user_agent.contains("wechat") || user_agent.contains("micromessenger");

    if user_agent.contains("windowswechat") {
      is_wechat = true;
      os = "windows";
    } else if user_agent.contains("macwechat") {
      is_wechat = true;
      os = "mac";
    }

    Self {
      os: os.to_string(),
      platform: platform.to_string(),
      is_wxwork,
      is_wechat,
    }
  }

  /// 电脑端: windows/mac/linux, iPad 也按电脑端处理
  fn is_pc(&self) -> bool {
    matches!(self.os.as_str(), "windows" | "mac" | "linux") || self.platform == "ipad"
  }

  /// 手机端: android/iPhone/iPod/OpenHarmony
  fn is_mobile(&self) -> bool {
    self.os == "android" || matches!(self.platform.as_str(), "iphone" | "ipod" | "openharmony")
  }
}

fn detect_os(user_agent: &str) -> &'static str {
  if user_agent.contains("windows") {
    "windows"
  } else if user_agent.contains("android") {
    "android"
  } else if user_agent.contains("iphone") || user_agent.contains("ipad") || user_agent.contains("ipod") {
    "ios"
  } else if user_agent.contains("mac") {
    "mac"
  } else if user_agent.contains("linux") {
    "linux"
  } else if user_agent.contains("openharmony") {
    "openharmony"
  } else {
    "unknown"
  }
}

fn detect_platform(user_agent: &str) -> &'static str {
  if user_agent.contains("iphone") {
    "iphone"
  } else if user_agent.contains("android") {
    "android"
  } else if user_agent.contains("ipad") {
    "ipad"
  } else if user_agent.contains("ipod") {
    "ipod"
  } else if user_agent.contains("openharmony") {
    "openharmony"
  } else {
    "unknown"
  }
}

/// 取请求头第一个值
fn header_value<'a>(
  req: &'a Request,
  name: &str,
) -> Option<&'a str> {
  req.header(name)
    .and_then(|value| value.split(',').next())
    .map(str::trim)
    .filter(|value| !value.is_empty())
}

/// 当前请求的站点前缀, 兼容反向代理
fn request_origin(req: &Request) -> String {
  let protocol = header_value(req, "x-forwarded-proto").unwrap_or("https");
  let host = header_value(req, "x-forwarded-host")
    .or_else(|| header_value(req, "host"))
    .unwrap_or_default();

  if host.is_empty() {
    return String::new();
  }

  format!("{protocol}://{host}")
}

/// 校验路径: 只允许站内绝对路径, 防止开放重定向
fn normalize_path(raw: &str) -> Option<String> {
  let raw = raw.trim();
  let path = raw.split(['?', '#']).next().unwrap_or_default().trim();

  if !path.starts_with('/') || path.starts_with("//") || path.contains("://") || path.contains('\\') {
    return None;
  }

  let path = path.trim_end_matches('/');
  if path.is_empty() {
    return Some("/".to_string());
  }

  Some(path.to_string())
}

/// 电脑端路由推导手机端页面: /scrm/clue -> /pages/clue/List, /scrm/clue/pool -> /pages/clue/Pool
fn guess_uni_path(route_path: &str) -> Option<String> {

  let segments = route_path
    .trim_matches('/')
    .split('/')
    .filter(|segment| !segment.is_empty())
    .collect::<Vec<_>>();

  match segments.as_slice() {
    [_, table] => Some(format!("/pages/{table}/List")),
    [_, table, page] => Some(format!("/pages/{table}/{}", capitalize(page))),
    _ => None,
  }
}

fn capitalize(value: &str) -> String {
  let mut chars = value.chars();
  match chars.next() {
    Some(first) => first.to_uppercase().collect::<String>() + chars.as_str(),
    None => String::new(),
  }
}

/// 解析查询参数, 支持 JSON 对象与 a=1&b=2
fn parse_query_pairs(route_query: &str) -> Vec<(String, String)> {
  let route_query = route_query.trim();
  if route_query.is_empty() {
    return Vec::new();
  }

  if let Ok(Value::Object(map)) = serde_json::from_str::<Value>(route_query) {
    return map
      .into_iter()
      .map(|(key, value)| {
        let value = match value {
          Value::String(value) => value,
          value => value.to_string(),
        };
        (key, value)
      })
      .collect();
  }

  route_query
    .trim_start_matches('?')
    .split('&')
    .filter(|pair| !pair.is_empty())
    .map(|pair| match pair.split_once('=') {
      Some((key, value)) => (
        key.to_string(),
        urlencoding::decode(value)
          .map(|value| value.into_owned())
          .unwrap_or_else(|_| value.to_string()),
      ),
      None => (pair.to_string(), String::new()),
    })
    .collect()
}

fn build_pc_url(
  origin: &str,
  route_path: &str,
  pairs: &[(String, String)],
) -> String {
  append_query(format!("{origin}/#{route_path}"), pairs)
}

/// 手机端: _tab_name 平铺, 其余参数打包进 builtInSearch(JSON)
fn build_uni_url(
  origin: &str,
  uni_path: &str,
  pairs: &[(String, String)],
) -> String {
  let mut flat_pairs = Vec::with_capacity(pairs.len());
  let mut built_in_search = Map::new();

  for (key, value) in pairs {
    if key == "_tab_name" {
      flat_pairs.push((key.clone(), value.clone()));
    } else {
      built_in_search.insert(key.clone(), Value::String(value.clone()));
    }
  }

  if !built_in_search.is_empty() {
    let built_in_search = serde_json::to_string(&Value::Object(built_in_search)).unwrap_or_default();
    flat_pairs.push(("builtInSearch".to_string(), built_in_search));
  }

  append_query(format!("{origin}/uni/#{uni_path}"), &flat_pairs)
}

fn append_query(
  base: String,
  pairs: &[(String, String)],
) -> String {
  if pairs.is_empty() {
    return base;
  }

  let query_string = pairs
    .iter()
    .map(|(key, value)| format!("{}={}", urlencoding::encode(key), urlencoding::encode(value)))
    .collect::<Vec<_>>()
    .join("&");

  if base.contains('?') {
    format!("{base}&{query_string}")
  } else {
    format!("{base}?{query_string}")
  }
}

fn bad_request(message: &str) -> Response {
  Response::builder()
    .status(StatusCode::BAD_REQUEST)
    .body(message.to_string())
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_build_pc_url() {
    let pairs = parse_query_pairs(
      r#"{"_tab_name":"测试222","id":"AaHX0bHjcD+R0ywWhzFPkA"}"#,
    );
    assert_eq!(
      build_pc_url("https://cloud.pomeas.cn", "/scrm/clue", &pairs),
      "https://cloud.pomeas.cn/#/scrm/clue?_tab_name=%E6%B5%8B%E8%AF%95222&id=AaHX0bHjcD%2BR0ywWhzFPkA",
    );
  }

  #[test]
  fn test_build_uni_url() {
    let pairs = parse_query_pairs(
      r#"{"_tab_name":"测试222","id":"AaHX0bHjcD+R0ywWhzFPkA"}"#,
    );
    assert_eq!(
      build_uni_url("https://cloud.pomeas.cn", "/pages/clue/List", &pairs),
      "https://cloud.pomeas.cn/uni/#/pages/clue/List?_tab_name=%E6%B5%8B%E8%AF%95222&builtInSearch=%7B%22id%22%3A%22AaHX0bHjcD%2BR0ywWhzFPkA%22%7D",
    );
  }

  #[test]
  fn test_guess_uni_path() {
    assert_eq!(guess_uni_path("/scrm/clue"), Some("/pages/clue/List".to_string()));
    assert_eq!(guess_uni_path("/scrm/clue/pool"), Some("/pages/clue/Pool".to_string()));
    assert_eq!(guess_uni_path("/scrm/myfollow"), Some("/pages/follow/MyList".to_string()));
    assert_eq!(guess_uni_path("/base/usr"), None);
  }

  #[test]
  fn test_normalize_path() {
    assert_eq!(normalize_path("/scrm/clue?x=1"), Some("/scrm/clue".to_string()));
    assert_eq!(normalize_path("//evil.com"), None);
    assert_eq!(normalize_path("https://evil.com"), None);
  }
}
