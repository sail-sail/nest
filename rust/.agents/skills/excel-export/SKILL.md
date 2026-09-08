---
name: excel-export
description: 移动端导出Excel时使用
---

# Excel 导出

后端 Rust + xlsx_handlebars + rust-embed，前端 uni.downloadFile。

> 注意:
> 1. 此功能在项目中尚未有实际使用案例，以下内容是参考模式。
> 2. 示例里的 `{mod}`、`{table}` 以及历史示例中出现过的 `spc` 都是占位符；其中 `spc` 仅表示某个业务模块名，落地时要替换成真实模块路径，例如 `app/base/usr/`。
> 3. 开始实现前，先确认模块目录、导出路由和模板文件名，再按下面片段替换。

## 文件结构

```rust/app/{mod}/
├── {table}_model.rs           # ExportExcel{Table}Asset
├── {table}_service.rs         # 导出逻辑
├── {table}_resful.rs          # HTTP 处理
├── {table}_router.rs          # 路由 handler
└── export_excel_{table}.xlsx  # 模板(放在编译时能访问的路径)
```

根据用户提供的项目结构，如果存在集中式的路由文件，则在 `app/lib.rs` 的 `register_routes` 中注册；如果是简单项目，则在 `main.rs` 中注册。

## 1. model.rs - 嵌入模板

```rust
#[derive(rust_embed::Embed)]
#[folder = "app/{mod}/{table}/"]
#[include = "export_excel_{table}.xlsx"]
pub struct ExportExcel{Table}Asset;
```

## 2. service.rs - 导出逻辑

模板读取或渲染失败时，记录模板文件名和底层错误，并返回前端可理解的导出失败提示，不要直接把原始异常文本暴露给用户。

```rust
use color_eyre::eyre::{Result, eyre};
use tracing::error;

use generated::common::context::Options;
use generated::{mod}::{table}::{table}_service::find_all_{table};
use generated::{mod}::{table}::{table}_model::TableSearch;
use super::{mod}::{table}_model::ExportExcel{Table}Asset;

pub async fn export_excel_{table}(
  search: Option<{Table}Search>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<(Vec<u8>, String)> {
  let template_name = "export_excel_{table}.xlsx";
  
  let models = find_all_{table}(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let template = ExportExcel{Table}Asset::get(template_name)
    .ok_or_else(|| {
      error!(template_name = template_name, "excel 模板不存在");
      eyre!("导出失败，请检查模板配置")
    })?;
  
  let buf = xlsx_handlebars::render_template(
    template.data.into_owned(),
    &serde_json::json!({ "{table}_models": models }),
  ).map_err(|e| {
    error!(template_name = template_name, error = %e, "excel 模板渲染失败");
    eyre!("导出失败，请稍后重试")
  })?;
  
  Ok((buf, "导出.xlsx".to_string()))
}
```

## 3. resful.rs - HTTP 请求

在解析 `search`、`page`、`sort` 参数时，如果遇到无效的 JSON 字符串，必须返回 Http 400 错误，而不能静默消耗错误并将值设为 `None`。

```rust
#[function_name::named]
pub async fn export_excel_{table}(
  search: Option<String>,
  page: Option<String>,
  sort: Option<String>,
  options: Option<Options>,
) -> Result<Response> {
  fn parse_query_json<T: serde::de::DeserializeOwned>(
    field: &str,
    raw: Option<String>,
  ) -> Result<Option<T>> {
    match raw {
      Some(s) => serde_json::from_str::<T>(&s)
        .map(Some)
        .map_err(|_| poem::Error::from_string(
          format!("参数 {field} 不是合法 JSON"),
          poem::http::StatusCode::BAD_REQUEST,
        )),
      None => Ok(None),
    }
  }
  
  let search = parse_query_json("search", search)?;
  let page = parse_query_json("page", page)?;
  let sort = parse_query_json("sort", sort)?;
  
  info!(
    "{req_id} {function_name}: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let (buf, filename) = {table}_service::export_excel_{table}(
    search, page, sort, options,
  ).await?;
  
  Ok(Response::builder()
    .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    .header("Content-Disposition", format!("attachment; filename=\"{}\"", urlencoding::encode(&filename)))
    .body(buf))
}
```

## 4. router.rs - 路由

```rust
use poem::{Request, Response, handler, web::Query};
use serde::Deserialize;
use generated::common::context::Ctx;
use super::{table}_resful;

#[derive(Deserialize)]
struct ExportExcel{Table}Request {
  search: Option<String>,
  page: Option<String>,
  sort: Option<String>,
}

#[handler]
pub async fn export_excel_{table}(
  req: &Request,
  Query(params): Query<ExportExcel{Table}Request>,
) -> Result<Response> {
  Ctx::resful_builder(Some(req))
    .with_auth()?
    .build()
    .resful_scope({
      {table}_resful::export_excel_{table}(
        params.search,
        params.page,
        params.sort,
        None,
      ).await
    }).await
}
```

## 5. 路由注册

在 `main.rs` 的 app 构建区域添加:

```rust
app = app.at(
  "/api/{mod}/{table}/export_excel_{table}",
  get(app::{mod}::{table}::{table}_router::export_excel_{table}),
);
```

或在 `app/lib.rs` 的 `register_routes` 中:

```rust
pub fn register_routes(app: Route) -> Route {
  let mut app = app;
  app = app.at(
    "/api/{mod}/{table}/export_excel_{table}",
    get({mod}::{table}::{table}_router::export_excel_{table}),
  );
  app
}
```

## Excel 模板语法

```handlebars
{{#each {table}_models}}
  {{lbl}}
  {{order_date}}
{{/each}}
```

## 前端调用

```typescript
// Api2.ts
export function exportExcel(
  search: Search,
  page: PageInput,
  sort: SortInput[],
) {
  const params = new URLSearchParams({
    search: JSON.stringify(search),
    page: JSON.stringify(page),
    sort: JSON.stringify(sort),
  });
  return `${ baseUrl }/api/{mod}/{table}/export_excel_{table}?${ params.toString() }`;
}
```
