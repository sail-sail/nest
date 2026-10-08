use std::sync::{Arc, OnceLock};

use color_eyre::eyre::{Result, eyre};
use regex::Regex;
use serde::Serialize;
use serde_json::{Map, Value, json};

use super::mcp_model::{McpSchemaGetInput, McpSchemaSearchInput};

static SCHEMA_SEARCH_INDEX: OnceLock<std::result::Result<SchemaSearchIndex, String>> = OnceLock::new();
const SCHEMA_GET_MAX_MEMBER_COUNT: usize = 2000;
const SCHEMA_GET_MAX_SDL_CHARS: usize = 20_000;

pub fn search_schema(
  schema: &crate::QuerySchema,
  input: McpSchemaSearchInput,
) -> Result<Value> {
  if input.keyword.trim().is_empty() {
    return Err(eyre!("keyword 不能为空"));
  }
  let index = schema_search_index(schema)?;
  index.search(input)
}

pub fn get_schema(
  schema: &crate::QuerySchema,
  input: McpSchemaGetInput,
) -> Result<Value> {
  if input.name.trim().is_empty() {
    return Err(eyre!("name 不能为空"));
  }
  let index = schema_search_index(schema)?;
  index.get(input)
}

fn schema_search_index(
  schema: &crate::QuerySchema,
) -> Result<&'static SchemaSearchIndex> {
  SCHEMA_SEARCH_INDEX.get_or_init(|| {
    SchemaSearchIndex::build(schema.sdl())
      .map_err(|err| err.to_string())
  }).as_ref().map_err(|err| eyre!(err.clone()))
}

#[derive(Debug)]
struct SchemaSearchIndex {
  entries: Vec<SchemaSearchEntry>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum EntryScope {
  Definition,
  Member,
}

impl EntryScope {
  fn as_str(self) -> &'static str {
    match self {
      EntryScope::Definition => "definition",
      EntryScope::Member => "member",
    }
  }
}

#[derive(Debug)]
struct SchemaSearchEntry {
  scope: EntryScope,
  kind: String,
  name: String,
  parent_name: Option<String>,
  description: Option<String>,
  signature: String,
  related_types: Vec<String>,
  full_sdl: Arc<String>,
  member_count: usize,
  sdl_char_count: usize,
  ai_visible: bool,
  normalized_name: String,
  normalized_parent_name: Option<String>,
  normalized_description: String,
  normalized_signature: String,
  normalized_search_text: String,
}

#[derive(Debug)]
struct SchemaDefinition {
  kind: String,
  name: String,
  description: Option<String>,
  sdl: Arc<String>,
  members: Vec<SchemaMember>,
  related_types: Vec<String>,
}

#[derive(Debug)]
struct SchemaMember {
  name: String,
  description: Option<String>,
  signature: String,
  related_types: Vec<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
struct SchemaSearchResultItem {
  scope: String,
  kind: String,
  name: String,
  parent_name: Option<String>,
  description: Option<String>,
  signature: String,
  related_types: Vec<String>,
  #[serde(skip_serializing_if = "Option::is_none")]
  sdl: Option<String>,
}

#[derive(Debug)]
struct RankedEntry<'a> {
  entry: &'a SchemaSearchEntry,
  score: i64,
}

impl SchemaSearchIndex {
  fn build(
    schema_sdl: String,
  ) -> Result<Self> {
    let definitions = parse_schema_definitions(&schema_sdl)?;
    let mut entries = Vec::new();

    for definition in definitions {
      entries.push(SchemaSearchEntry::new_definition(&definition));
      let definition_kind = definition.kind.clone();
      let definition_name = definition.name.clone();
      let definition_ai_visible = is_ai_visible_definition(&definition.name);
      let definition_member_count = definition.members.len();
      entries.extend(
        definition.members.into_iter()
          .map(|member| {
            SchemaSearchEntry::new_member(
              &definition_kind,
              &definition_name,
              definition_member_count,
              definition_ai_visible,
              member,
            )
          })
      );
    }

    Ok(Self { entries })
  }

  fn search(
    &self,
    input: McpSchemaSearchInput,
  ) -> Result<Value> {
    let keyword = normalize_text(&input.keyword);
    if keyword.is_empty() {
      return Err(eyre!("keyword 不能为空"));
    }

    let kind_filter = normalize_kind_filter(input.kind.as_deref())?;
    let scope_filter = normalize_scope_filter(input.scope.as_deref())?;
    let include_sdl = input.include_sdl.unwrap_or(false);
    let limit = input.limit.unwrap_or(8).clamp(1, 20);
    let tokens = tokenize(&keyword);

    let mut ranked = self.entries.iter()
      .filter(|entry| entry.ai_visible)
      .filter(|entry| match scope_filter {
        ScopeFilter::All => true,
        ScopeFilter::Definition => entry.scope == EntryScope::Definition,
        ScopeFilter::Member => entry.scope == EntryScope::Member,
      })
      .filter(|entry| match kind_filter.as_deref() {
        Some(kind) => entry.kind == kind,
        None => true,
      })
      .filter_map(|entry| {
        let score = score_entry(entry, &keyword, &tokens);
        (score > 0).then_some(RankedEntry { entry, score })
      })
      .collect::<Vec<_>>();

    ranked.sort_by(|left, right| {
      right.score.cmp(&left.score)
        .then_with(|| left.entry.name.len().cmp(&right.entry.name.len()))
        .then_with(|| left.entry.signature.len().cmp(&right.entry.signature.len()))
        .then_with(|| left.entry.name.cmp(&right.entry.name))
    });

    let ranked = ranked.into_iter()
      .take(limit)
      .collect::<Vec<_>>();

    let include_pagination_tips = ranked.iter()
      .any(|item| is_find_all_entry(item.entry) || references_page_input(item.entry));

    let items = ranked.iter()
      .map(|item| item.entry.to_result_item(include_sdl))
      .collect::<Vec<_>>();

    let mut payload = Map::new();
    payload.insert("query".to_owned(), json!(input.keyword));
    payload.insert("kind".to_owned(), json!(kind_filter));
    payload.insert("scope".to_owned(), json!(scope_filter.as_str()));
    payload.insert("items".to_owned(), json!(items));
    if include_pagination_tips {
      payload.insert("queryTips".to_owned(), json!(build_query_tips()));
    }
    Ok(Value::Object(payload))
  }

  fn get(
    &self,
    input: McpSchemaGetInput,
  ) -> Result<Value> {
    let name = normalize_text(&input.name);
    if name.is_empty() {
      return Err(eyre!("name 不能为空"));
    }

    let kind_filter = normalize_kind_filter(input.kind.as_deref())?;
    let exact_matches = self.entries.iter()
      .filter(|entry| entry.scope == EntryScope::Definition)
      .filter(|entry| entry.normalized_name == name)
      .filter(|entry| match kind_filter.as_deref() {
        Some(kind) => entry.kind == kind,
        None => true,
      })
      .collect::<Vec<_>>();

    if exact_matches.is_empty() {
      return Err(eyre!(format!(
        "未找到类型名 {}，可先调用 schema_search 搜索后再用 schema_get 精确查看",
        input.name,
      )));
    }

    let matches = exact_matches.into_iter()
      .filter(|entry| entry.ai_visible)
      .collect::<Vec<_>>();

    if matches.is_empty() {
      return Err(eyre!(format!(
        "类型名 {} 已被 AI 过滤，通常不需要查看这类定义",
        input.name,
      )));
    }

    if matches.len() > 1 {
      let kinds = matches.iter()
        .map(|entry| entry.kind.as_str())
        .collect::<Vec<_>>()
        .join(", ");
      return Err(eyre!(format!(
        "类型名 {} 命中了多个定义，请补充 kind。可选 kind: {}",
        input.name,
        kinds,
      )));
    }

    let entry = matches[0];
    if schema_get_entry_too_large(entry) {
      return Err(eyre!(format!(
        "类型名 {} 过大，请先用 schema_search 缩小范围。",
        entry.name,
      )));
    }
    let include_pagination_tips = references_page_input(entry);

    let mut payload = Map::new();
    payload.insert("name".to_owned(), json!(entry.name));
    payload.insert("kind".to_owned(), json!(entry.kind));
    payload.insert("description".to_owned(), json!(entry.description));
    payload.insert("relatedTypes".to_owned(), json!(entry.related_types));
    payload.insert("sdl".to_owned(), json!(entry.full_sdl.as_ref()));
    if include_pagination_tips {
      payload.insert("queryTips".to_owned(), json!(build_query_tips()));
    }
    Ok(Value::Object(payload))
  }
}

impl SchemaSearchEntry {
  fn new_definition(
    definition: &SchemaDefinition,
  ) -> Self {
    let description = definition.description.clone();
    let ai_visible = is_ai_visible_definition(&definition.name);
    let member_count = definition.members.len();
    let sdl_char_count = definition.sdl.chars().count();
    let signature = definition.sdl.lines()
      .next()
      .unwrap_or_default()
      .trim()
      .to_owned();
    let normalized_name = normalize_text(&definition.name);
    let normalized_parent_name = None;
    let normalized_description = normalize_text_option(description.as_deref());
    let normalized_signature = normalize_text(&signature);
    let normalized_search_text = normalize_text(&[
      definition.kind.as_str(),
      definition.name.as_str(),
      description.as_deref().unwrap_or_default(),
      signature.as_str(),
      definition.sdl.as_str(),
      &definition.related_types.join(" "),
    ].join("\n"));

    Self {
      scope: EntryScope::Definition,
      kind: definition.kind.clone(),
      name: definition.name.clone(),
      parent_name: None,
      description,
      signature,
      related_types: definition.related_types.clone(),
      full_sdl: definition.sdl.clone(),
      member_count,
      sdl_char_count,
      ai_visible,
      normalized_name,
      normalized_parent_name,
      normalized_description,
      normalized_signature,
      normalized_search_text,
    }
  }

  fn new_member(
    definition_kind: &str,
    definition_name: &str,
    definition_member_count: usize,
    definition_ai_visible: bool,
    member: SchemaMember,
  ) -> Self {
    let member_sdl = build_member_sdl(definition_kind, definition_name, &member);
    let ai_visible = definition_ai_visible && is_ai_visible_member(definition_name, &member.name);
    let sdl_char_count = member_sdl.chars().count();
    let normalized_name = normalize_text(&member.name);
    let normalized_parent_name = Some(normalize_text(definition_name));
    let normalized_description = normalize_text_option(member.description.as_deref());
    let normalized_signature = normalize_text(&member.signature);
    let normalized_search_text = normalize_text(&[
      definition_kind,
      definition_name,
      member.name.as_str(),
      member.description.as_deref().unwrap_or_default(),
      member.signature.as_str(),
      &member.related_types.join(" "),
    ].join("\n"));

    Self {
      scope: EntryScope::Member,
      kind: definition_kind.to_owned(),
      name: member.name,
      parent_name: Some(definition_name.to_owned()),
      description: member.description,
      signature: member.signature,
      related_types: member.related_types,
      full_sdl: Arc::new(member_sdl),
      member_count: definition_member_count,
      sdl_char_count,
      ai_visible,
      normalized_name,
      normalized_parent_name,
      normalized_description,
      normalized_signature,
      normalized_search_text,
    }
  }

  fn to_result_item(
    &self,
    include_sdl: bool,
  ) -> SchemaSearchResultItem {
    SchemaSearchResultItem {
      scope: self.scope.as_str().to_owned(),
      kind: self.kind.clone(),
      name: self.name.clone(),
      parent_name: self.parent_name.clone(),
      description: self.description.clone(),
      signature: self.signature.clone(),
      related_types: self.related_types.clone(),
      sdl: include_sdl.then_some(self.full_sdl.as_ref().clone()),
    }
  }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum ScopeFilter {
  All,
  Definition,
  Member,
}

impl ScopeFilter {
  fn as_str(self) -> &'static str {
    match self {
      ScopeFilter::All => "all",
      ScopeFilter::Definition => "definition",
      ScopeFilter::Member => "member",
    }
  }
}

fn normalize_kind_filter(
  kind: Option<&str>,
) -> Result<Option<String>> {
  let Some(kind) = kind else {
    return Ok(None);
  };
  let kind = normalize_text(kind);
  if kind.is_empty() {
    return Ok(None);
  }
  let kind = match kind.as_str() {
    "object" => "type".to_owned(),
    "type" | "input" | "enum" | "scalar" | "interface" | "union" | "directive" | "schema" => kind,
    _ => return Err(eyre!(format!("kind 不支持: {kind}"))),
  };
  Ok(Some(kind))
}

fn normalize_scope_filter(
  scope: Option<&str>,
) -> Result<ScopeFilter> {
  let Some(scope) = scope else {
    return Ok(ScopeFilter::All);
  };
  let scope = normalize_text(scope);
  if scope.is_empty() || scope == "all" {
    return Ok(ScopeFilter::All);
  }
  match scope.as_str() {
    "definition" => Ok(ScopeFilter::Definition),
    "member" | "field" => Ok(ScopeFilter::Member),
    _ => Err(eyre!(format!("scope 不支持: {scope}"))),
  }
}

fn parse_schema_definitions(
  schema_sdl: &str,
) -> Result<Vec<SchemaDefinition>> {
  let lines = schema_sdl.lines().collect::<Vec<_>>();
  let mut definitions = Vec::new();
  let mut pending_description = None;
  let mut index = 0;

  while index < lines.len() {
    let trimmed = lines[index].trim();
    if trimmed.is_empty() {
      pending_description = None;
      index += 1;
      continue;
    }

    if trimmed.starts_with("\"\"\"") {
      let (description, next_index) = parse_description_block(&lines, index)?;
      pending_description = Some(description);
      index = next_index;
      continue;
    }

    let Some((kind, name)) = parse_definition_header(trimmed) else {
      pending_description = None;
      index += 1;
      continue;
    };

    let start = index;
    let end = find_definition_end(&lines, start);
    let sdl = Arc::new(lines[start..=end].join("\n"));
    let members = parse_members(&kind, &sdl)?;
    let related_types = collect_related_types(&members);
    definitions.push(SchemaDefinition {
      kind,
      name,
      description: pending_description.take(),
      sdl,
      members,
      related_types,
    });
    index = end + 1;
  }

  Ok(definitions)
}

fn parse_members(
  kind: &str,
  sdl: &str,
) -> Result<Vec<SchemaMember>> {
  if !matches!(kind, "type" | "input" | "enum" | "interface" | "schema") {
    return Ok(Vec::new());
  }

  let lines = sdl.lines().collect::<Vec<_>>();
  let mut members = Vec::new();
  let mut index = 1;
  let mut pending_description = None;

  while index + 1 < lines.len() {
    let trimmed = lines[index].trim();
    if trimmed.is_empty() {
      pending_description = None;
      index += 1;
      continue;
    }

    if trimmed.starts_with("\"\"\"") {
      let (description, next_index) = parse_description_block(&lines, index)?;
      pending_description = Some(description);
      index = next_index;
      continue;
    }

    if trimmed == "}" || trimmed.starts_with('#') {
      pending_description = None;
      index += 1;
      continue;
    }

    if kind == "enum" {
      if let Some(name) = parse_enum_value_name(trimmed) {
        members.push(SchemaMember {
          name,
          description: pending_description.take(),
          signature: trimmed.to_owned(),
          related_types: Vec::new(),
        });
      }
      index += 1;
      continue;
    }

    if let Some(name) = parse_field_name(trimmed) {
      members.push(SchemaMember {
        name,
        description: pending_description.take(),
        signature: trimmed.to_owned(),
        related_types: extract_related_types(trimmed),
      });
    } else {
      pending_description = None;
    }
    index += 1;
  }

  Ok(members)
}

fn parse_description_block(
  lines: &[&str],
  start: usize,
) -> Result<(String, usize)> {
  let line = lines[start].trim();
  if let Some(content) = line.strip_prefix("\"\"\"")
    && let Some(content) = content.strip_suffix("\"\"\"") {
      return Ok((content.trim().to_owned(), start + 1));
    }

  let mut content = Vec::new();
  let mut index = start + 1;
  while index < lines.len() {
    let trimmed = lines[index].trim();
    if trimmed == "\"\"\"" {
      return Ok((content.join("\n"), index + 1));
    }
    content.push(trimmed.to_owned());
    index += 1;
  }

  Err(eyre!("schema 描述块未正常闭合"))
}

fn parse_definition_header(
  line: &str,
) -> Option<(String, String)> {
  let mut trimmed = line.trim();
  if let Some(rest) = trimmed.strip_prefix("extend ") {
    trimmed = rest.trim_start();
  }

  for kind in ["type", "input", "enum", "scalar", "union", "interface", "directive", "schema"] {
    let Some(rest) = trimmed.strip_prefix(kind) else {
      continue;
    };
    let rest = rest.trim_start();
    let name = match kind {
      "schema" => "schema".to_owned(),
      "directive" => {
        let directive = rest.strip_prefix('@')?;
        take_graphql_name(directive)?
      },
      _ => take_graphql_name(rest)?,
    };
    return Some((kind.to_owned(), name));
  }

  None
}

fn find_definition_end(
  lines: &[&str],
  start: usize,
) -> usize {
  let header = lines[start].trim();
  if header.contains('{') {
    let mut brace_depth = brace_delta(header);
    let mut index = start;
    while brace_depth > 0 && index + 1 < lines.len() {
      index += 1;
      brace_depth += brace_delta(lines[index]);
    }
    return index;
  }

  let mut end = start;
  while end + 1 < lines.len() {
    let next = lines[end + 1].trim();
    if next.is_empty() || next.starts_with("\"\"\"") || parse_definition_header(next).is_some() {
      break;
    }
    end += 1;
  }
  end
}

fn brace_delta(
  line: &str,
) -> i32 {
  line.chars().fold(0, |delta, ch| match ch {
    '{' => delta + 1,
    '}' => delta - 1,
    _ => delta,
  })
}

fn take_graphql_name(
  value: &str,
) -> Option<String> {
  graphql_name_regex().find(value)
    .map(|capture| capture.as_str().to_owned())
}

fn parse_enum_value_name(
  line: &str,
) -> Option<String> {
  take_graphql_name(line)
}

fn parse_field_name(
  line: &str,
) -> Option<String> {
  field_name_regex().captures(line)
    .and_then(|capture| capture.get(1))
    .map(|capture| capture.as_str().to_owned())
}

fn extract_related_types(
  signature: &str,
) -> Vec<String> {
  let mut related_types = Vec::new();
  for capture in type_expr_regex().captures_iter(signature) {
    let Some(type_expr) = capture.get(1) else {
      continue;
    };
    for type_name in graphql_name_regex().find_iter(type_expr.as_str()) {
      let type_name = type_name.as_str();
      if is_builtin_scalar(type_name) || related_types.iter().any(|item| item == type_name) {
        continue;
      }
      related_types.push(type_name.to_owned());
    }
  }
  related_types
}

fn collect_related_types(
  members: &[SchemaMember],
) -> Vec<String> {
  let mut related_types = Vec::new();
  for member in members {
    for type_name in &member.related_types {
      if related_types.iter().any(|item| item == type_name) {
        continue;
      }
      related_types.push(type_name.clone());
    }
  }
  related_types
}

fn is_ai_visible_definition(
  definition_name: &str,
) -> bool {
  !definition_name.ends_with("FieldComment")
}

fn is_ai_visible_member(
  definition_name: &str,
  member_name: &str,
) -> bool {
  if definition_name != "Query" {
    return true;
  }
  !member_name.starts_with("findOneOk")
    && !member_name.starts_with("findByIdOk")
    && !member_name.starts_with("findByIdsOk")
    && !member_name.starts_with("getFieldComments")
}

fn is_find_all_entry(
  entry: &SchemaSearchEntry,
) -> bool {
  entry.parent_name.as_deref() == Some("Query")
    && entry.name.starts_with("findAll")
}

fn references_page_input(
  entry: &SchemaSearchEntry,
) -> bool {
  entry.name == "PageInput"
    || entry.related_types.iter().any(|item| item == "PageInput")
    || entry.signature.contains("page: PageInput")
}

fn build_query_tips() -> Vec<String> {
  vec![
    "任何 findAll* 查询都要显式传 page: { pgOffset, pgSize, isResultLimit: true }。".to_owned(),
    "列表场景优先先查对应的 findCount* 确认总量，再决定 findAll* 的 pgSize。".to_owned(),
  ]
}

fn build_member_sdl(
  definition_kind: &str,
  definition_name: &str,
  member: &SchemaMember,
) -> String {
  let mut lines = vec![format!("{definition_kind} {definition_name} {{")];
  if let Some(description) = member.description.as_deref()
    .map(str::trim)
    .filter(|value| !value.is_empty()) {
    lines.push("\"\"\"".to_owned());
    lines.extend(description.lines().map(|line| line.to_owned()));
    lines.push("\"\"\"".to_owned());
  }
  lines.push(format!("  {}", member.signature.trim()));
  lines.push("}".to_owned());
  lines.join("\n")
}

fn schema_get_entry_too_large(
  entry: &SchemaSearchEntry,
) -> bool {
  entry.member_count > SCHEMA_GET_MAX_MEMBER_COUNT
    || entry.sdl_char_count > SCHEMA_GET_MAX_SDL_CHARS
}

fn score_entry(
  entry: &SchemaSearchEntry,
  keyword: &str,
  tokens: &[String],
) -> i64 {
  let mut score = 0;

  if entry.normalized_name == keyword {
    score += 10000;
  }
  if entry.normalized_signature == keyword {
    score += 9000;
  }
  if entry.normalized_name.starts_with(keyword) {
    score += 2600;
  }
  if entry.normalized_name.contains(keyword) {
    score += 1800;
  }
  if entry.normalized_parent_name.as_deref() == Some(keyword) {
    score += 1200;
  }
  if !entry.normalized_description.is_empty() && entry.normalized_description.contains(keyword) {
    score += 1400;
  }
  if entry.normalized_signature.contains(keyword) {
    score += 1000;
  }
  if entry.normalized_search_text.contains(keyword) {
    score += 300;
  }

  for token in tokens {
    if token == keyword {
      continue;
    }
    if entry.normalized_name.contains(token) {
      score += 180;
    }
    if entry.normalized_parent_name.as_deref().is_some_and(|value| value.contains(token)) {
      score += 100;
    }
    if entry.normalized_signature.contains(token) {
      score += 80;
    }
    if !entry.normalized_description.is_empty() && entry.normalized_description.contains(token) {
      score += 120;
    }
  }

  if entry.scope == EntryScope::Member && entry.parent_name.as_deref().is_some_and(|name| name == "Query" || name == "Mutation") {
    score += 50;
  }

  score
}

fn normalize_text(
  value: &str,
) -> String {
  value.trim().to_lowercase()
}

fn normalize_text_option(
  value: Option<&str>,
) -> String {
  value.map(normalize_text).unwrap_or_default()
}

fn tokenize(
  value: &str,
) -> Vec<String> {
  value.split(|ch: char| !ch.is_alphanumeric() && ch != '_')
    .map(str::trim)
    .filter(|item| !item.is_empty())
    .map(|item| item.to_owned())
    .collect::<Vec<_>>()
}

fn is_builtin_scalar(
  value: &str,
) -> bool {
  matches!(value, "String" | "Int" | "Float" | "Boolean" | "ID")
}

fn graphql_name_regex() -> &'static Regex {
  static REGEX: OnceLock<Regex> = OnceLock::new();
  REGEX.get_or_init(|| Regex::new(r"[_A-Za-z][_0-9A-Za-z]*").expect("graphql name regex invalid"))
}

fn field_name_regex() -> &'static Regex {
  static REGEX: OnceLock<Regex> = OnceLock::new();
  REGEX.get_or_init(|| Regex::new(r"^([_A-Za-z][_0-9A-Za-z]*)\s*(?:\(|:)").expect("field name regex invalid"))
}

fn type_expr_regex() -> &'static Regex {
  static REGEX: OnceLock<Regex> = OnceLock::new();
  REGEX.get_or_init(|| Regex::new(r":\s*([\[\]!_A-Za-z0-9]+)").expect("type expr regex invalid"))
}