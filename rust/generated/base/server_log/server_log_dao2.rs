#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]

//! 系统日志 DAO2 — 从日志文件读取解析，不走数据库

use std::io::{BufRead, BufReader, Read, Seek, SeekFrom};
use std::fs::File;
use std::path::{Path, PathBuf};
use std::str::FromStr;
use std::sync::OnceLock;

use chrono::{NaiveDate, NaiveDateTime};
use color_eyre::eyre::{Result, eyre};
use regex::Regex;
use smol_str::SmolStr;
use tracing::info;

use crate::common::context::get_req_id;
use crate::common::gql::model::{PageInput, SortInput, SortOrderEnum};

use super::server_log_model::*;

/// 日志行正则: 匹配 timestamp, level, module, 然后剩余部分为 "req_id content"
static LOG_LINE_RE: OnceLock<Regex> = OnceLock::new();

fn get_log_line_re() -> &'static Regex {
  LOG_LINE_RE.get_or_init(|| {
    Regex::new(
      r"^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z)\s+(\w+)\s+([\w:]+):\s*(.*)"
    ).expect("Failed to compile log line regex")
  })
}

/// 获取日志目录路径
fn get_log_dir() -> PathBuf {
  let log_path = std::env::var("log_path").unwrap_or_else(|_| "../log".to_string());
  PathBuf::from(&log_path)
}

/// 获取日志文件后缀格式正则: .log.YYYY-MM-DD
static LOG_FILE_RE: OnceLock<Regex> = OnceLock::new();

fn get_log_file_re() -> &'static Regex {
  LOG_FILE_RE.get_or_init(|| {
    Regex::new(r"\.log\.(\d{4}-\d{2}-\d{2})$").expect("Failed to compile log file regex")
  })
}

/// 从日志文件名中提取日期
fn extract_date_from_filename(filename: &str) -> Option<NaiveDate> {
  let re = get_log_file_re();
  re.captures(filename).and_then(|caps| {
    caps.get(1).and_then(|m| NaiveDate::parse_from_str(m.as_str(), "%Y-%m-%d").ok())
  })
}

/// 解析的单条日志记录（原始）
#[derive(Debug, Clone)]
struct RawLogEntry {
  timestamp: NaiveDateTime,
  level: String,
  module: String,
  req_id: String,
  content: String,
}

/// 解析一行日志的头部
fn parse_log_line(line: &str) -> Option<RawLogEntry> {
  let re = get_log_line_re();
  let caps = re.captures(line)?;
  
  let timestamp_str = caps.get(1)?.as_str();
  // 解析 "2026-03-03T03:47:50.436048Z" 格式
  let timestamp = timestamp_str
    .strip_suffix('Z')
    .and_then(|s| {
      // 截断微秒到6位以内
      if let Some(dot_pos) = s.rfind('.') {
        let frac = &s[dot_pos + 1..];
        if frac.len() > 6 {
          let truncated = format!("{}.{}", &s[..dot_pos], &frac[..6]);
          NaiveDateTime::parse_from_str(&truncated, "%Y-%m-%dT%H:%M:%S%.f").ok()
        } else {
          NaiveDateTime::parse_from_str(s, "%Y-%m-%dT%H:%M:%S%.f").ok()
        }
      } else {
        NaiveDateTime::parse_from_str(s, "%Y-%m-%dT%H:%M:%S").ok()
      }
    })?;
  
  let level = caps.get(2)?.as_str().to_string();
  let module = caps.get(3)?.as_str().to_string();
  let rest = caps.get(4).map(|m| m.as_str()).unwrap_or("");
  
  // rest 格式: "1772538470424 rollback;" 或 "1772538470424 find_all: ..."
  // req_id 是第一个 空格前的数字串
  let (req_id, content) = if let Some(space_pos) = rest.find(' ') {
    let candidate = &rest[..space_pos];
    // req_id 应该是纯数字
    if candidate.chars().all(|c| c.is_ascii_digit()) && !candidate.is_empty() {
      (candidate.to_string(), rest[space_pos + 1..].to_string())
    } else {
      (String::new(), rest.to_string())
    }
  } else {
    // 没有空格, 可能整个 rest 就是 req_id 或 content
    if rest.chars().all(|c| c.is_ascii_digit()) && !rest.is_empty() {
      (rest.to_string(), String::new())
    } else {
      (String::new(), rest.to_string())
    }
  };
  
  Some(RawLogEntry {
    timestamp,
    level,
    module,
    req_id,
    content,
  })
}

/// 判断一行是否是新日志条目的开头
fn is_log_line_start(line: &str) -> bool {
  get_log_line_re().is_match(line)
}

/// 读取并解析整个日志文件，返回所有条目（按文件顺序）
fn parse_log_file(path: &Path) -> Result<Vec<RawLogEntry>> {
  let file = File::open(path)
    .map_err(|e| eyre!("无法打开日志文件 {}: {}", path.display(), e))?;
  let reader = BufReader::new(file);
  
  let mut entries: Vec<RawLogEntry> = Vec::new();
  
  for line in reader.lines() {
    let line = line.map_err(|e| eyre!("读取日志文件失败: {}", e))?;
    if line.is_empty() {
      // 空行追加到上一条
      if let Some(last) = entries.last_mut() {
        last.content.push('\n');
      }
      continue;
    }
    
    if is_log_line_start(&line) {
      if let Some(entry) = parse_log_line(&line) {
        entries.push(entry);
      }
    } else {
      // 续行, 合并到上一条记录
      if let Some(last) = entries.last_mut() {
        last.content.push('\n');
        last.content.push_str(&line);
      }
    }
  }
  
  entries.reverse();
  
  Ok(entries)
}

/// 从日志文件反向读取（用于大文件的性能优化）
/// 返回的条目已经是倒序（最新在前）
fn parse_log_file_reverse(
  path: &Path,
  max_entries: Option<usize>,
) -> Result<Vec<RawLogEntry>> {
  let mut file = File::open(path)
    .map_err(|e| eyre!("无法打开日志文件 {}: {}", path.display(), e))?;
  
  let file_size = file.metadata()
    .map_err(|e| eyre!("无法获取文件大小: {}", e))?
    .len();
  
  if file_size == 0 {
    return Ok(Vec::new());
  }
  
  // 对于小文件（< 5MB），直接全量读取
  if file_size < 5 * 1024 * 1024 {
    return parse_log_file(path);
  }
  
  // 大文件: 从尾部向前读取块
  let chunk_size: u64 = 1024 * 1024; // 1MB 块
  let max_entries = max_entries.unwrap_or(usize::MAX);
  let mut entries: Vec<RawLogEntry> = Vec::new();
  let mut remainder = String::new();
  let mut pos = file_size;
  
  'outer: while pos > 0 {
    let read_size = std::cmp::min(chunk_size, pos);
    pos -= read_size;
    
    file.seek(SeekFrom::Start(pos))
      .map_err(|e| eyre!("seek 失败: {}", e))?;
    
    let mut buf = vec![0u8; read_size as usize];
    file.read_exact(&mut buf)
      .map_err(|e| eyre!("读取失败: {}", e))?;
    
    let chunk_str = String::from_utf8_lossy(&buf);
    let combined = format!("{}{}", chunk_str, remainder);
    let lines: Vec<&str> = combined.split('\n').collect();
    
    // 第一个分片可能是不完整的行, 留给下一次
    remainder = lines[0].to_string();
    
    // 从后往前处理行
    let mut i = lines.len() - 1;
    while i >= 1 {
      let line = lines[i];
      if line.is_empty() {
        i -= 1;
        continue;
      }
      
      if is_log_line_start(line) {
        if let Some(entry) = parse_log_line(line) {
          entries.push(entry);
          if entries.len() >= max_entries {
            break 'outer;
          }
        }
      } else {
        // 续行, 追加到上一条（entries中最后添加的）
        if let Some(last) = entries.last_mut() {
          // 续行应放在 content 前面（因为我们是倒序处理）
          let old_content = last.content.clone();
          last.content = if old_content.is_empty() {
            line.to_string()
          } else {
            format!("{}\n{}", line, old_content)
          };
        }
      }
      
      i -= 1;
    }
  }
  
  // 处理剩余的 remainder
  if !remainder.is_empty() && is_log_line_start(&remainder) {
    if let Some(entry) = parse_log_line(&remainder) {
      entries.push(entry);
    }
  }
  
  Ok(entries)
}

/// 将 RawLogEntry 转换为 ServerLogModel
fn raw_to_model(
  entry: &RawLogEntry,
  log_date: NaiveDate,
  line_idx: usize,
) -> ServerLogModel {
  // ID 必须是恰好 22 字节: YYYYMMDD_0000000000000 (8+1+13=22)
  let id_str = format!("{}_{:013}", log_date.format("%Y%m%d"), line_idx);
  let id = ServerLogId::from(id_str.as_str());
  
  let log_date_lbl = SmolStr::new(log_date.format("%Y-%m-%d").to_string());
  let log_time_lbl = SmolStr::new(entry.timestamp.format("%Y-%m-%d %H:%M:%S%.6f").to_string());
  
  let level = ServerLogLevel::from_str(&entry.level).unwrap_or_default();
  let level_lbl: SmolStr = level.into();
  
  ServerLogModel {
    id,
    log_date,
    log_date_lbl,
    log_time: entry.timestamp,
    log_time_lbl,
    level,
    level_lbl,
    module: SmolStr::new(&entry.module),
    req_id: SmolStr::new(&entry.req_id),
    content: Some(SmolStr::new(&entry.content)),
  }
}

/// 判断条目是否匹配搜索条件
fn matches_search(
  entry: &RawLogEntry,
  search: &ServerLogSearch,
) -> bool {
  
  // 日志级别
  if let Some(ref levels) = search.level {
    if !levels.is_empty() {
      let entry_level = ServerLogLevel::from_str(&entry.level).ok();
      match entry_level {
        Some(lv) => {
          if !levels.contains(&lv) {
            return false;
          }
        }
        None => return false,
      }
    }
  }
  
  // 模块 精确匹配
  if let Some(ref module) = search.module {
    if !module.is_empty() && entry.module.as_str() != module.as_str() {
      return false;
    }
  }
  
  // 模块 模糊匹配
  if let Some(ref module_like) = search.module_like {
    if !module_like.is_empty() {
      let lower_module = entry.module.to_lowercase();
      let lower_like = module_like.to_lowercase();
      if !lower_module.contains(&lower_like) {
        return false;
      }
    }
  }
  
  // 请求ID 精确匹配
  if let Some(ref req_id) = search.req_id {
    if !req_id.is_empty() && entry.req_id.as_str() != req_id.as_str() {
      return false;
    }
  }
  
  // 请求ID 模糊匹配
  if let Some(ref req_id_like) = search.req_id_like {
    if !req_id_like.is_empty() && !entry.req_id.contains(req_id_like.as_str()) {
      return false;
    }
  }
  
  // 日志内容 精确匹配
  if let Some(ref content) = search.content {
    if !content.is_empty() && entry.content.as_str() != content.as_str() {
      return false;
    }
  }
  
  // 日志内容 模糊匹配
  if let Some(ref content_like) = search.content_like {
    if !content_like.is_empty() {
      let lower_content = entry.content.to_lowercase();
      let lower_like = content_like.to_lowercase();
      if !lower_content.contains(&lower_like) {
        return false;
      }
    }
  }
  
  // 日志时间范围
  if let Some(ref log_time) = search.log_time {
    if let Some(ref start) = log_time[0] {
      if entry.timestamp < *start {
        return false;
      }
    }
    if let Some(ref end) = log_time[1] {
      if entry.timestamp > *end {
        return false;
      }
    }
  }
  
  true
}

/// 获取指定日期的日志文件路径
fn get_log_file_for_date(date: NaiveDate) -> Option<PathBuf> {
  let log_dir = get_log_dir();
  let date_str = date.format("%Y-%m-%d").to_string();
  
  if !log_dir.exists() {
    return None;
  }
  
  let entries = std::fs::read_dir(&log_dir).ok()?;
  for entry in entries.flatten() {
    let filename = entry.file_name().to_string_lossy().to_string();
    if filename.ends_with(&format!(".log.{}", date_str)) {
      return Some(entry.path());
    }
  }
  
  None
}

/// 获取搜索条件中的日期范围, 返回需要查询的日期列表
fn get_search_dates(search: &ServerLogSearch) -> Result<Vec<NaiveDate>> {
  if let Some(ref log_date) = search.log_date {
    let start = log_date[0];
    let end = log_date[1];
    
    match (start, end) {
      (Some(s), Some(e)) => {
        let mut dates = Vec::new();
        let mut d = s;
        while d <= e {
          dates.push(d);
          d = d.succ_opt().unwrap_or(d);
          if dates.len() > 31 {
            break; // 最多31天
          }
        }
        Ok(dates)
      }
      (Some(s), None) => Ok(vec![s]),
      (None, Some(e)) => Ok(vec![e]),
      (None, None) => {
        // 默认今天
        Ok(vec![chrono::Local::now().date_naive()])
      }
    }
  } else {
    // 无日期条件, 默认今天
    Ok(vec![chrono::Local::now().date_naive()])
  }
}

// MARK: find_all_server_log
/// 根据搜索条件和分页查找系统日志列表（从文件读取）
pub async fn find_all_server_log(
  search: Option<ServerLogSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  _options: Option<()>,
) -> Result<Vec<ServerLogModel>> {
  
  let search = search.unwrap_or_default();
  
  if let Some(id) = search.id {
    // 根据 id 定位日志文件和行号, 直接读取该行
    if let Some(model) = find_by_id_server_log(id.clone(), None).await? {
      return Ok(vec![model]);
    } else {
      return Ok(Vec::new());
    }
  }
  
  if let Some(ref ids) = search.ids {
    // 根据 ids 定位日志文件和行号, 直接读取这些行
    let mut models = Vec::new();
    for id in ids {
      if let Some(model) = find_by_id_server_log(id.clone(), None).await? {
        models.push(model);
      }
    }
    return Ok(models);
  }
  
  let dates = get_search_dates(&search)?;
  
  info!(
    "{req_id} server_log_dao2.find_all_server_log: search: {search:?}",
    req_id = get_req_id(),
  );
  
  // 确定排序方向
  let is_desc = sort
    .as_ref()
    .and_then(|s| s.first())
    .map(|s| !matches!(s.order, SortOrderEnum::Asc | SortOrderEnum::Ascending))
    .unwrap_or(true);
  
  // 分页参数
  let (offset, limit) = if let Some(ref page) = page {
    let pg_offset = page.pg_offset.unwrap_or(0) as usize;
    let pg_size = page.pg_size.unwrap_or(20) as usize;
    (pg_offset, pg_size)
  } else {
    (0, 20)
  };
  
  let mut all_models: Vec<ServerLogModel> = Vec::new();
  
  // 按日期从新到旧排序（倒序时）
  let mut sorted_dates = dates.clone();
  if is_desc {
    sorted_dates.sort_by(|a, b| b.cmp(a));
  } else {
    sorted_dates.sort();
  }
  
  for date in &sorted_dates {
    let log_file = match get_log_file_for_date(*date) {
      Some(f) => f,
      None => continue,
    };
    
    let entries = if is_desc {
      parse_log_file_reverse(&log_file, None)?
    } else {
      let mut entries = parse_log_file(&log_file)?;
      entries.reverse(); // parse_log_file 返回倒序, 我们要正序
      entries
    };
    
    let mut line_idx: usize = if is_desc { entries.len() } else { 0 };
    
    for entry in &entries {
      if is_desc {
        line_idx = line_idx.saturating_sub(1);
      }
      
      if matches_search(entry, &search) {
        let model = raw_to_model(entry, *date, line_idx);
        all_models.push(model);
      }
      
      if !is_desc {
        line_idx += 1;
      }
    }
  }
  
  // 分页
  let total = all_models.len();
  let start = std::cmp::min(offset, total);
  let end = std::cmp::min(offset + limit, total);
  let result = all_models[start..end].to_vec();
  
  Ok(result)
}

// MARK: find_count_server_log
/// 根据条件查找系统日志总数（从文件读取, 估算）
pub async fn find_count_server_log(
  search: Option<ServerLogSearch>,
  _options: Option<()>,
) -> Result<u64> {
  
  let search = search.unwrap_or_default();
  let dates = get_search_dates(&search)?;
  
  info!(
    "{req_id} server_log_dao2.find_count_server_log: dates: {dates:?}",
    req_id = get_req_id(),
  );
  
  let has_filter = search.level.is_some()
    || search.module.is_some()
    || search.module_like.is_some()
    || search.req_id.is_some()
    || search.req_id_like.is_some()
    || search.content.is_some()
    || search.content_like.is_some()
    || search.log_time.is_some();
  
  let mut total: u64 = 0;
  
  for date in &dates {
    let log_file = match get_log_file_for_date(*date) {
      Some(f) => f,
      None => continue,
    };
    
    if has_filter {
      // 有过滤条件时, 需要遍历文件
      let entries = parse_log_file(&log_file)?;
      for entry in &entries {
        if matches_search(entry, &search) {
          total += 1;
        }
      }
    } else {
      // 无过滤条件, 快速估算: 统计日志行头的数量
      let file = File::open(&log_file)
        .map_err(|e| eyre!("无法打开日志文件: {}", e))?;
      let reader = BufReader::new(file);
      let re = get_log_line_re();
      for line in reader.lines() {
        if let Ok(line) = line {
          if re.is_match(&line) {
            total += 1;
          }
        }
      }
    }
  }
  
  Ok(total)
}

// MARK: find_by_id_server_log
/// 根据 id 查找系统日志
pub async fn find_by_id_server_log(
  id: ServerLogId,
  _options: Option<()>,
) -> Result<Option<ServerLogModel>> {
  
  info!(
    "{req_id} server_log_dao2.find_by_id_server_log: id: {id:?}",
    req_id = get_req_id(),
  );
  
  // id 格式: YYYYMMDD_0000000000000 (22字节)
  let id_str = id.as_str();
  if id_str.len() != 22 {
    return Ok(None);
  }
  let parts: Vec<&str> = id_str.splitn(2, '_').collect();
  if parts.len() != 2 {
    return Ok(None);
  }
  
  let date = NaiveDate::parse_from_str(parts[0], "%Y%m%d").ok();
  let line_idx: Option<usize> = parts[1].parse().ok();
  
  if date.is_none() || line_idx.is_none() {
    return Ok(None);
  }
  
  let date = date.unwrap();
  let line_idx = line_idx.unwrap();
  
  let log_file = match get_log_file_for_date(date) {
    Some(f) => f,
    None => return Ok(None),
  };
  
  let entries = parse_log_file(&log_file)?;
  // parse_log_file 返回倒序, 需要还原正序后按 line_idx 取
  let total = entries.len();
  // line_idx 是正序的 index, 倒序后 index 为 total - 1 - line_idx
  if line_idx >= total {
    return Ok(None);
  }
  let actual_idx = total - 1 - line_idx;
  
  let entry = &entries[actual_idx];
  let model = raw_to_model(entry, date, line_idx);
  
  Ok(Some(model))
}

// MARK: get_server_log_dates
/// 获取可用的日志日期列表
pub async fn get_server_log_dates() -> Result<Vec<NaiveDate>> {
  let log_dir = get_log_dir();
  
  info!(
    "{req_id} server_log_dao2.get_server_log_dates: log_dir: {log_dir:?}",
    req_id = get_req_id(),
  );
  
  if !log_dir.exists() {
    return Ok(Vec::new());
  }
  
  let mut dates: Vec<NaiveDate> = Vec::new();
  
  let entries = std::fs::read_dir(&log_dir)
    .map_err(|e| eyre!("无法读取日志目录: {}", e))?;
  
  for entry in entries.flatten() {
    let filename = entry.file_name().to_string_lossy().to_string();
    if let Some(date) = extract_date_from_filename(&filename) {
      dates.push(date);
    }
  }
  
  // 最新日期在前
  dates.sort_by(|a, b| b.cmp(a));
  
  Ok(dates)
}
