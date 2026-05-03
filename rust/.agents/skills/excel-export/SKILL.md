---
name: excel-export
description: 移动端导出 Excel 时使用
---

# Excel 导出

后端 Rust + xlsx_handlebars + rust-embed，前端 uni.downloadFile。

> 注意: 此功能在项目中尚未有实际使用案例, 以下为指导性参考模式。实现时请根据实际模块路径调整, 不要照抄示例中的 `spc` 目录。

## 文件结构

```rust/app/{mod}/
├── {table}_model.rs           # ExportExcel{Table}Asset
├── {table}_service.rs         # 导出逻辑
├── {table}_resful.rs          # HTTP 处理
├── {table}_router.rs          # 路由 handler
└── export_excel_{table}.xlsx  # 模板(放在编译时能访问的路径)
```

路由在 `main.rs` 或 `app/lib.rs` 的 `register_routes` 中注册。

## 1. model.rs - 嵌入模板

```rust
#[derive(rust_embed::Embed)]
#[folder = "app/{mod}/{table}/"]
#[include = "export_excel_{table}.xlsx"]
pub struct ExportExcel{Table}Asset;
```

## 2. service.rs - 导出逻辑

```rust
use color_eyre::eyre::{Result, eyre};
use smol_str::SmolStr;

use generated::common::context::Options;
use generated::{mod}::{table}::{table}_service::find_all_{table};
use generated::{mod}::{table}::{table}_model::TableSearch;
use super::{mod}::{table}_model::ExportExcel{Table}Asset;

pub async fn export_excel_{table}(
  search: Option<{Table}Search>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<(Vec<u8>, SmolStr)> {
  
  let models = find_all_{table}(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let template = ExportExcel{Table}Asset::get("export_excel_{table}.xlsx")
    .ok_or_else(|| eyre!("模板不存在"))?;
  
  let buf = xlsx_handlebars::render_template(
    template.data.into_owned(),
    &serde_json::json!({ "{table}_models": models }),
  ).map_err(|e| eyre!("渲染失败: {e}"))?;
  
  Ok((buf, SmolStr::new("导出.xlsx")))
}
```

## 3. resful.rs - HTTP 请求

```rust
#[function_name::named]
pub async fn export_excel_{table}(
  search: Option<SmolStr>,
  page: Option<SmolStr>,
  sort: Option<SmolStr>,
  options: Option<Options>,
) -> Result<Response> {
  
  let search = search.and_then(|s| serde_json::from_str(&s).ok());
  let page = page.and_then(|s| serde_json::from_str(&s).ok());
  let sort = sort.and_then(|s| serde_json::from_str(&s).ok());
  
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
use smol_str::SmolStr;
use generated::common::context::Ctx;
use super::{table}_resful;

#[derive(Deserialize)]
struct ExportExcel{Table}Request {
  search: Option<SmolStr>,
  page: Option<SmolStr>,
  sort: Option<SmolStr>,
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
  "/api/{mod}/export_excel_{table}",
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
