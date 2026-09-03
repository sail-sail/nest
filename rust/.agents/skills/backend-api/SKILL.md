---
name: backend-api
description: 当需要修改后端与新API开发时使用
compatibility: Rust + async-graphql
metadata:
  version: "1.1"
---

# Rust GraphQL 后端接口开发

## 何时使用

- 新增或修改自定义 Query、Mutation
- 组合多个 generated DAO 做聚合查询或特殊流程
- 增加业务校验、日志、权限、事务
- 在 `app/{mod}/{table}/` 中新增 `*_graphql.rs`、`*_resolver.rs`、`*_service.rs`（`*_model.rs` 按需新增）

## 放置映射

| 场景 | 放置位置 | 规则 |
|------|------|------|
| 业务接口/流程编排（Query、Mutation、聚合查询、业务校验、日志、事务） | `app/{mod}/{table}/` | 默认都在手写层实现 |
| 前端调用自定义 GraphQL | PC: `src/views/{mod}/{table}/Api2.ts`；uni: `src/pages/{table}/Api2.ts` | 不要改生成的 `Api.ts` |
| 需要补基础能力并被多个 generated 文件复用 | `generated/{mod}/{table}/` | 仅在 `app/` 无法完成且存在跨 generated 复用时放这里 |

- 扩展 `generated/` 时，优先新增 `*_dao2.rs`、`*_service2.rs`、`*_resolver2.rs`、`*_model2.rs` 并在 `mod.rs` 显式 `pub mod ...`；仅在确需让 `generated/` 复用 GraphQL 接口时才加 `generated/*_graphql.rs`。

## 依赖边界

- `app/{mod}/{table}/` 是默认手写业务入口
- `generated/{mod}/{table}/` 是基础 CRUD 层，扩展规则见上表
- 只允许 `app -> generated`，不允许 `generated -> app`

## 标准分层

```text
app/{mod}/{table}/
├── {table}_graphql.rs
├── {table}_resolver.rs
├── {table}_dao.rs        (可选, 多数情况 generated 已够)
└── {table}_service.rs
```

| 层 | 文件 | 职责 |
|----|------|------|
| GraphQL | `*_graphql.rs` | 定义接口、权限入口、构建 `Ctx` |
| Resolver | `*_resolver.rs` | `#[function_name::named]` 日志、转调 Service |
| Model | `*_model.rs` | 可选，仅在 app 层定义专用输入输出类型时新增 |
| Service | `*_service.rs` | 业务逻辑、事务内流程、调用 DAO |
| DAO | `*_dao.rs` | 数据库查询与写入 (通常用 generated 的即可) |

## 最小实现模式

### GraphQL

```rust
use async_graphql::{Context, Object};
use generated::common::context::Ctx;

#[derive(Default)]
pub struct {Table}Mutation;

#[Object(name = "{Table}Mutation")]
impl {Table}Mutation {
  #[graphql(name = "mutateMethod")]
  async fn mutate_method(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "input")]
    input: {Table}Input,
  ) -> Result<ReturnType> {

    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        {table}_resolver::mutate_method(
          input,
          None,
        )
      }).await
  }
}
```

### Resolver

```rust
use tracing::info;
use generated::common::context::{
  Options,
  get_req_id,
};

#[function_name::named]
pub async fn method_name(
  input: ParamType,
  options: Option<Options>,
) -> Result<ReturnType> {
  
  info!(
    "{req_id} {function_name}: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  {table}_service::method_name(
    input,
    options,
  ).await
}
```

### Service

```rust
use color_eyre::eyre::{Result, eyre};

use generated::common::context::{
  Options,
  get_auth_id_ok,
  get_now,
};
use generated::common::exceptions::service_exception::ServiceException;

pub async fn method_name(
  input: ParamType,
  options: Option<Options>,
) -> Result<ReturnType> {
  
  if input.is_empty() {
    return Err(eyre!(ServiceException {
      message: "参数不能为空".into(),
      trace: true,
      ..Default::default()
    }));
  }
  
  let usr_id: UsrId = get_auth_id_ok()?;
  let now = get_now();
  
  let model = find_one_ok_{table}(
    Some({Table}Search {
      field: Some(input),
      ..Default::default()
    }),
    None,
    options,
  ).await?;

  Ok(model)
}
```

### REST

文件结构（最小实现）：

```text
app/{mod}/{table}/
├── {table}_router.rs
├── {table}_restful.rs
├── mod.rs
└── {table}_service.rs
```

`{table}_router.rs`（注册路由）：

```rust
use poem::Route;
use poem::post;

pub fn create_routes() -> Route {
  Route::new()
    .at(
      "/{table}/do_action",
      post({table}_restful::do_action),
    )
}
```

`mod.rs`（模块内注册）：

```rust
pub mod {table}_router;
pub mod {table}_restful;
pub mod {table}_service;
```

`{table}_restful.rs`（入口鉴权 + 构建 Ctx + 调 service）：

```rust
use poem::web::Json;
use poem::Result;
use generated::common::context::Ctx;

pub async fn do_action(
  req: Json<{Table}Input>,
) -> Result<Json<{Table}Output>> {
  // 该示例包含写操作, 因此开启事务
  let data = Ctx::poem_builder()
    .with_auth()?
    .with_tran()
    .build()
    .scope({
      {table}_service::do_action(
        req.0,
        None,
      )
    }).await?;

  Ok(Json(data))
}
```

`{table}_service.rs` 保持与 GraphQL 同一套业务逻辑，统一复用 generated DAO。

路由挂载（在 `app/lib.rs` 或对应聚合路由处）：

```rust
use poem::Route;

pub fn app_routes() -> Route {
  Route::new().nest(
    "/api",
    {mod}::{table}::{table}_router::create_routes(),
  )
}
```

## 常用 DAO 函数

| 函数 | 用途 |
|------|------|
| `find_by_id[_ok]_{table}` | 按 ID 查单条 |
| `find_by_ids[_ok]_{table}` | 按多个 ID 查询 |
| `find_one[_ok]_{table}` | 按条件查单条 |
| `find_all_{table}` | 按条件查列表 |
| `create[_return]_{table}` | 创建 |
| `update_by_id[_return]_{table}` | 按 ID 更新 |
| `delete_by_ids_{table}` | 逻辑删除 |
| `force_delete_by_ids_{table}` | 彻底删除 |
| `validate_option_{table}` | 校验 `None` |
| `validate_is_enabled_{table}` | 校验是否启用 |

- 对于有逻辑删除字段 `is_deleted` 的表，只有被删除 `delete_by_ids_{table}` 的记录才能被彻底删除 `force_delete_by_ids_{table}`，否则被跳过不删除也不报错

## 常用上下文函数

```rust
use generated::common::context::{
  get_auth_id_ok,
  get_tenant_id_ok,
  get_now,
  get_short_uuid,
  get_req_id,
};
```

## 编码规则

1. 类型与参数

- `options` 和所有 `id` 类型都是 `Copy`，不要 `.clone()`
- Input 中 `_lbl` 字段无需传递，DAO 会自动生成
- 函数定义和调用时，多参数统一换行

2. 事务与鉴权

- 修改涉及多个表或多条记录的操作必须加 `.with_tran()`；仅涉及单表单条非核心记录修改时可不加
- 需要登录的接口加 `.with_auth()?`

3. 查询与锁

- 需要行锁时，优先复用 generated DAO。若表在 codegen 配置里已开启 `opts.isHasForUpdate: true`，则在事务内调用 `find_one[_ok]_*`、`find_by_id[_ok]_*`、`find_all_*` 时传 `Options::from(options).set_is_for_update(Some(true)).into()` 追加 `for update`，不要为了加锁回退到手写 SQL

4. 附件与冗余字段

- 如需操作附件，使用 [generated/common/oss/oss_dao.rs](../../../generated/common/oss/oss_dao.rs)
- service 层业务开发过程中，若表有配置 `modelLabel` 冗余字段 `xxx_id_lbl`，则 create/update 要传入显示名称，否则可不传

5. 错误与日志

- 业务错误使用 `ServiceException` 而非裸 `eyre!()`：`eyre!(ServiceException { message: "xxx".into(), trace: true, ..Default::default() })`
- resolver 层必须加 `#[function_name::named]` 宏，用于自动日志记录

6. 格式保持

- 手动编辑时，空白行缩进与周围代码保持一致
- 除非用户明确要求，不要额外执行 `cargo fmt` 做整文件格式化

7. generated service 导入风格（统一约定）

- 默认优先“函数级 use 终点”写法，例如 `use generated::{mod}::{table}::{table}_service::find_by_id_ok_{table};`，然后直接调用 `find_by_id_ok_{table}(...)`；DAO 层同理

## 模块注册

在 `app/lib.rs` 中注册:

```rust
// 顶层 Query/Mutation 合并
#[derive(MergedObject, Default)]
pub struct Query(
  generated::common::CommonQuery,
  generated::GenQuery,
  crate::base::menu::menu_graphql::MenuQuery,
  ccs::card::card_graphql::CardQuery,
  // ... 新增模块加在这里
);

#[derive(MergedObject, Default)]
pub struct Mutation(
  generated::common::CommonMutation,
  generated::GenMutation,
  ccs::card::card_graphql::CardMutation,
  ccs::order::order_graphql::OrderMutation,
  // ... 新增模块加在这里
);
```

每个 `app/{mod}/{table}/mod.rs` 只需声明:
```rust
pub mod {table}_graphql;
pub mod {table}_resolver;
pub mod {table}_service;
// 若在 app 层定义了专用输入输出类型, 再加 pub mod {table}_model;
```

## 接口变更后的类型生成

在 `rust/` 目录执行 `npm run gqlgen`，会导出 schema 并更新前端类型：

- `pc/src/typings/types.ts`
- `uni/src/typings/types.ts`

## 技术栈

- **Web 框架**: poem (REST) + async-graphql (GraphQL)
- **数据库**: MySQL (sqlx)
- **运行时**: tokio
- **序列化**: serde_json
- **错误处理**: color-eyre
- **日志**: tracing + tracing-subscriber