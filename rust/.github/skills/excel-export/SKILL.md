---
name: excel-export
description: Excel 导出功能开发。移动端导出 Excel 时使用。
---

# Excel 导出

后端 Rust + xlsx_handlebars，前端 uni.downloadFile。

## 文件结构

```
rust/app/spc/{mod}/
├── {mod}_model.rs           # ExportExcelAsset
├── {mod}_service.rs         # 导出逻辑
├── {mod}_resful.rs          # HTTP 处理
├── {mod}_router.rs          # 路由 handler
└── export_excel_{mod}.xlsx  # 模板

rust/app/lib.rs              # 注册路由
```

## 1. model.rs - 嵌入模板

```rust
#[derive(rust_embed::Embed)]
#[folder = "spc/{mod}/"]
#[include = "export_excel_{mod}.xlsx"]
pub struct ExportExcel{Mod}Asset;
```

## 2. service.rs - 导出逻辑

```rust
use generated::spc::{mod}::{mod}_service;
use generated::spc::{mod}::{mod}_model::{ModSearch};
use super::{mod}_model::ExportExcel{Mod}Asset;

pub async fn export_excel_{mod}(
  search: Option<{Mod}Search>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<(Vec<u8>, String)> {
  
  let models = {mod}_service::find_all_{mod}(search, page, sort, options).await?;
  
  let template = ExportExcel{Mod}Asset::get("export_excel_{mod}.xlsx")
    .ok_or_else(|| eyre!("模板不存在"))?;
  
  let buf = xlsx_handlebars::render_template(
    template.data.into_owned(),
    &serde_json::json!({ "{mod}_models": models }),
  ).map_err(|e| eyre!("渲染失败: {}", e))?;
  
  Ok((buf, "导出.xlsx".to_string()))
}
```

## 3. resful.rs - HTTP 请求

```rust
#[function_name::named]
pub async fn export_excel_{mod}(
  search: Option<String>,
  page: Option<String>,
  sort: Option<String>,
  options: Option<Options>,
) -> Result<Response> {
  
  let search = search.and_then(|s| serde_json::from_str(&s).ok());
  let page = page.and_then(|s| serde_json::from_str(&s).ok());
  let sort = sort.and_then(|s| serde_json::from_str(&s).ok());
  
  info!("{} {}: {:?}", get_req_id(), function_name!(), search);
  
  let (buf, filename) = {mod}_service::export_excel_{mod}(search, page, sort, options).await?;
  
  Ok(Response::builder()
    .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    .header("Content-Disposition", format!("attachment; filename=\"{}\"", urlencoding::encode(&filename)))
    .body(buf))
}
```

## 4. router.rs - 路由

```rust
#[derive(Deserialize)]
struct ExportExcel{Mod}Request {
  search: Option<String>,
  page: Option<String>,
  sort: Option<String>,
}

#[handler]
pub async fn export_excel_{mod}(
  req: &Request,
  Query(params): Query<ExportExcel{Mod}Request>,
) -> Result<Response> {
  Ctx::resful_builder(Some(req))
    .with_auth()?
    .build()
    .resful_scope(async {
      {mod}_resful::export_excel_{mod}(params.search, params.page, params.sort, None).await
    }).await
}
```

## 5. lib.rs - 注册

```rust
pub fn register_routes(app: Route) -> Route {
  app.at("/api/{mod}/export_excel_{mod}", get(spc::{mod}::{mod}_router::export_excel_{mod}))
}
```

## Excel 模板语法

```handlebars
{{#each {mod}_models}}
  {{lbl}}
  {{order_date}}
{{/each}}
```

## 前端调用

```typescript
// Api2.ts
export function exportExcel(search: Search, page: PageInput, sort: SortInput[]) {
  const params = new URLSearchParams({
    search: JSON.stringify(search),
    page: JSON.stringify(page),
    sort: JSON.stringify(sort),
  });
  return `${baseUrl}/api/{mod}/export_excel_{mod}?${params}`;
}
```
