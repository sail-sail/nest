---
name: oai-api
description: 业务 HTTP 接口开发规范. 新增非 GraphQL 的业务接口(给前端和 AI 调用)时使用
---

# 业务接口开发 (OpenAPI)

## 何时使用

- 新增业务 HTTP 接口(非 GraphQL)
- 接口需要被 AI 通过 MCP 搜索到并调用
- 需要标准 openapi 文档给外部工具

## 不适用

以下系统级接口仍用原生 poem,见 `rest-api`:

- 附件上传 / 下载(multipart、二进制流)
- WebSocket / SSE
- 第三方 webhook 回调
- 健康检查、重定向

## 路径规范

业务接口统一挂在 `/api/oai` 下,按模块分前缀:

```text
/api/oai/{module}/{action}
```

`nest` 决定模块前缀,handler 里的 `path` 只写模块内相对路径,不要再写 `/api/oai`。

## 目录结构

```text
app/{mod}/{table}/
├── {table}_oai.rs      # #[OpenApi] impl, 薄壳, 只做参数提取和上下文
├── {table}_service.rs  # 业务逻辑, 与 GraphQL 共用
├── {table}_model.rs    # 输入输出类型
└── mod.rs
```

## Handler 模板

```rust
use poem_openapi::param::Header;
use poem_openapi::payload::{Json, Response as OaiResponse};
use poem_openapi::{Object, OpenApi, OpenApiService};

use crate::base::oai::types::{OaiAuth, R, scope_auth_tran};

/// 业务接口
pub struct {Table}Api;

/// 返回数据
#[derive(Object, Debug)]
struct ActionData {
  /// 字段说明会进 openapi 文档
  id: String,
}

#[OpenApi]
impl {Table}Api {
  /// 接口说明会作为 operation summary
  #[oai(path = "/do-action", method = "post")]
  async fn do_action(
    &self,
    #[oai(name = "Authorization")] auth: Header<Option<String>>,
    #[oai(name = "TenantId")] tenant: Header<Option<String>>,
  ) -> OaiResponse<Json<R<Option<ActionData>>>> {
    scope_auth_tran(
      OaiAuth::new(auth.0, tenant.0),
      async move {
        // 复用现有业务层
        let data = {table}_service::do_action(None).await?;
        Ok(ActionData {
          id: data.id.as_str().to_owned(),
        })
      },
    ).await.into_json()
  }
}

pub fn service() -> OpenApiService<{Table}Api, ()> {
  OpenApiService::new({Table}Api, "{module}-{table}", "1.0")
}
```

读写选择：

| 场景 | 用哪个 | 事务 |
|---|---|---|
| 查询、只读 | `scope_auth` | 不开 |
| 多表、多条记录写入、导入, 需要整体成功或失败 | `scope_auth_tran` | 开启, 失败整体回滚 |
| 单表单条非核心记录写入 | `scope_auth` | 不开 |

是否需要事务看业务, 不是所有写操作都要。项目里只有 `ctx.is_tran` 为真才会 `begin()`, 涉及多表或多条记录的写入漏用 `scope_auth_tran` 会留下半截数据。

不需要登录的接口直接返回,不走 `scope_auth`:

```rust
#[oai(path = "/public-info", method = "get")]
async fn public_info(&self) -> Json<R<PublicData>> {
  Json(R::ok(PublicData { /* ... */ }))
}
```

## 注册(两处都要)

```rust
// app/lib.rs — 第一处: 挂路由
#[allow(unused_mut, clippy::let_and_return)]
pub fn register_oai_routes(app: Route) -> Route {
  let mut app = app;

  app = app.nest(
    "/api/oai/system",
    base::oai::system::service(),
  );

  app = app.nest(
    "/api/oai/{module}",
    {mod}::{table}::{table}_oai::service(),
  );

  app
}

// app/lib.rs — 第二处: 合并文档
pub fn oai_modules() -> Vec<base::oai::OaiModule> {
  vec![
    base::oai::OaiModule::new("system", base::oai::system::service().spec()),
    base::oai::OaiModule::new("{module}", {mod}::{table}::{table}_oai::service().spec()),
  ]
}
```

漏掉第二处的后果很隐蔽:接口浏览器能直接访问,但 `/openapi.json` 里没有,AI 搜不到,`rest_call` 会以「不在 openapi 规范里」拒绝。

## 响应约定

- 统一 `R<T>`:`{ code, message, data }`
- 业务错误走 `code` + `message`,HTTP 仍然返回 200
- 鉴权失败 `code = 401`,其余业务错误自定
- 返回值用 `R<Option<T>>`:出错时 `data` 为 null,响应结构稳定,响应 schema 才能生成完整
- 鉴权接口返回 `OaiResponse<Json<R<Option<T>>>>` 并用 `.into_json()` 收尾:只有 token 真正续期时才回写 `Authorization`(未过期不回写,与原生 REST 一致),前端据此续期。不要图省事换成 `Json(...)`,那样 token 不会续期

## 参数来源

| 来源 | 写法 |
|---|---|
| 路径参数 | `#[oai(path = "/item/:id", method = "get")]` 参数名 `id` |
| query 参数 | 普通参数,名字不出现在 path 里 |
| 请求体 | `body: Data<&MyInput>` |
| 请求头 | `#[oai(name = "X-Foo")] foo: Header<Option<String>>` |

路径参数沿用 poem 的 `:name` 写法,参数类型用 `poem_openapi::param::Path<T>`。

生成规范时 `:name` 会转成 `{name}`。`schema_search` 的结果里带 `pathParameters`;
AI 调用 `rest_call` 时把 `{name}` 换成真实值即可,`rest_call` 按路径段做模板匹配,
不会因为「规范和实际路径不一致」被拒。

## 检查清单

- 路径在 `/api/oai/{module}` 前缀下,不要和 `/api/oss`、`/api/health`、`/api/websocket`、`/api/wxwork` 等原生路由重叠(`nest` 前缀重叠时 poem 行为未定义)
- 同一前缀下不要混用 `#[oai]` 和原生 `#[handler]`;混合挂在同一个 `nest` 里会导致内层 404 且不回落
- `#[derive(Object)]` 的 struct 名全局唯一:合并多模块 spec 时 `components.schemas` 按名字覆盖,冲突就加 `#[oai(rename = "...")]`
- `R<T>` 里的 `T` 要满足 `Type + ParseFromJSON + ToJSON`,derive `Object` 就够;自定义类型(Decimal 等)需单独实现 `Type`
- 加完接口跑 `cargo check`,再访问 `/openapi.json` 确认新路径出现

## 常见错误

| 现象 | 原因 |
|---|---|
| `rest_call` 报「不在 openapi 规范里」 | 忘了在 `oai_modules` 里加 spec |
| 接口 404 | `nest` 前缀和 `path` 拼错了,或者两个 `nest` 前缀重叠 |
| 编译报 trait bound | 返回类型没实现 `ApiResponse`,或 `Object` 字段类型没实现 `Type` |
| 文档里字段是 `null` schema | 用了 `serde_json::Value` 之类没有 `Type` 实现的类型 |
