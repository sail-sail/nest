---
name: excel-export
description: Excel 导出功能开发. 移动端导出 Excel 时使用
---

# Excel 导出

后端 Rust + xlsx_handlebars，前端 uni.downloadFile。

## 文件结构

```
rust/app/spc/{mod}/
├── {table}_model.rs           # ExportExcelAsset
├── {table}_service.rs         # 导出逻辑
├── {table}_resful.rs          # HTTP 处理
├── {table}_router.rs          # 路由 handler
└── export_excel_{table}.xlsx  # 模板

rust/app/lib.rs              # 注册路由
```

## 1. model.rs - 嵌入模板

```rust
#[derive(rust_embed::Embed)]
#[folder = "spc/{mod}/"]
#[include = "export_excel_{table}.xlsx"]
pub struct ExportExcel{Table}Asset;
```

## 2. service.rs - 导出逻辑

```rust
use generated::spc::{mod}::{table}_service;
use generated::spc::{mod}::{table}_model::{TableSearch};
use super::{mod}_model::ExportExcel{Table}Asset;

pub async fn export_excel_{table}(
  search: Option<{Table}Search>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<(Vec<u8>, String)> {
  
  let models = {table}_service::find_all_{table}(
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
  ).map_err(|e| eyre!("渲染失败: {}", e))?;
  
  Ok((buf, "导出.xlsx".to_string()))
}
```

## 3. resful.rs - HTTP 请求

```rust
#[function_name::named]
pub async fn export_excel_{table}(
  search: Option<String>,
  page: Option<String>,
  sort: Option<String>,
  options: Option<Options>,
) -> Result<Response> {
  
  let search = search.and_then(|s| serde_json::from_str(&s).ok());
  let page = page.and_then(|s| serde_json::from_str(&s).ok());
  let sort = sort.and_then(|s| serde_json::from_str(&s).ok());
  
  info!("{} {}: {:?}", get_req_id(), function_name!(), search);
  
  let (buf, filename) = {table}_service::export_excel_{table}(search, page, sort, options).await?;
  
  Ok(Response::builder()
    .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    .header("Content-Disposition", format!("attachment; filename=\"{}\"", urlencoding::encode(&filename)))
    .body(buf))
}
```

## 4. router.rs - 路由

```rust
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
    .resful_scope(async {
      {table}_resful::export_excel_{table}(
        params.search,
        params.page,
        params.sort,
        None,
      ).await
    }).await
}
```

## 5. lib.rs - 注册

```rust
pub fn register_routes(app: Route) -> Route {
  app.at("/api/{mod}/export_excel_{table}", get(spc::{mod}::{table}_router::export_excel_{table}))
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
  return `${ baseUrl }/api/{mod}/export_excel_{table}?${ params.toString() }`;
}
```
