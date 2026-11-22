---
name: excel-export
description: Uni 移动端列表导出 Excel 时使用
---

# Excel 导出

后端暂无实际业务样例。实现前确认 `{mod}`、`{table}`、搜索类型和模板字段。

## 固定约定

- 手写代码放 `app/{mod}/{table}/`，不绕过 generated 查询服务
- 模板放同一目录，`rust-embed` 的 folder 写 `{mod}/{table}/`
- 前端生成地址是 `{cfg.url}/{mod}/export_excel_{table}`；后端路由固定为 `/api/{mod}/export_excel_{table}`
- 导出必须显式设置 `is_result_limit: false`

## 前端

对应表配置开启，并按现有 codegen 流程重新生成：

```ts
opts: {
  isUniPage: {
    list_page: {
      is_export_excel: true,
    },
  },
}
```

生成器已处理登录态、租户、`uni.downloadFile`、状态检查和 `uni.openDocument`，不要另写下载 URL。

## 后端

在现有 `{table}_model.rs`、`{table}_service.rs`、`{table}_resful.rs`、`{table}_router.rs` 中追加逻辑；模板命名为 `export_excel_{table}.xlsx`，新模块同时更新 `mod.rs`。

### Model

```rust
#[derive(Debug, serde::Deserialize)]
pub struct ExportExcel{Table}Query {
  pub search: Option<String>,
  pub page: Option<String>,
  pub sort: Option<String>,
}

#[derive(rust_embed::Embed)]
#[folder = "{mod}/{table}/"]
#[include = "export_excel_{table}.xlsx"]
pub struct ExportExcel{Table}Asset;
```

### Service

```rust
pub async fn export_excel_{table}(
  search: Option<{Table}Search>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<(Vec<u8>, String)> {
  let models = find_all_{table}(
    search,
    Some(PageInput {
      is_result_limit: Some(false),
      ..page.unwrap_or_default()
    }),
    sort,
    options,
  ).await?;

  let template_name = "export_excel_{table}.xlsx";
  let template = ExportExcel{Table}Asset::get(template_name)
    .ok_or_else(|| {
      error!(template_name, "excel 模板不存在");
      eyre!("导出失败，请检查模板配置")
    })?;

  let buf = xlsx_handlebars::render_template(
    template.data.into_owned(),
    &serde_json::json!({ "{table}_models": models }),
  ).map_err(|err| {
    error!(template_name, error = %err, "excel 模板渲染失败");
    eyre!("导出失败，请稍后重试")
  })?;

  Ok((buf, "{Table}.xlsx".to_string()))
}
```

模板语法：

```handlebars
{{#each {table}_models}}
  {{lbl}}
{{/each}}
```

查询必须调用 generated service，保留权限、租户和数据过滤；底层异常只记录日志。

### Resful

- `search`、`page`、`sort` 无效 JSON 返回 400
- 读取、查询或渲染失败返回安全提示
- 文件响应：

```rust
Response::builder()
  .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
  .header(
    "Content-Disposition",
    format!("attachment; filename=\"{}\"", urlencoding::encode(&filename)),
  )
  .body(buf)
```

### Router

```rust
#[handler]
pub async fn export_excel_{table}(
  req: &Request,
  Query(query): Query<ExportExcel{Table}Query>,
) -> Result<Response> {
  Ctx::resful_builder(Some(req))
    .with_auth()?
    .build()
    .resful_scope({
      {table}_resful::export_excel_{table}(
        query.search,
        query.page,
        query.sort,
        None,
      ).await
    })
    .await
}
```

在 `app/lib.rs::register_routes` 注册：

```rust
app = app.at(
  "/api/{mod}/export_excel_{table}",
  get({mod}::{table}::{table}_router::export_excel_{table}),
);
```

## 验证

- `cargo check -p app`
- `uni` 下运行 `pnpm run typecheck`
- 文件可下载打开且包含全部匹配数据
- 三种 JSON 参数分别传非法值，均返回 400
