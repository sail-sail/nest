---
name: backend-api
description: Rust 自定义 GraphQL API 开发；新增或修改 Query、Mutation、聚合查询、权限或事务时使用
compatibility: Rust + async-graphql
metadata:
  version: "1.3"
---

# Rust GraphQL 后端接口开发

## 适用边界

- 自定义 Query / Mutation、跨表查询或业务流程：使用本技能
- GraphQL 文件上传：转 `graphql-upload`
- 非 GraphQL 业务 HTTP 接口：转 `oai-api`
- 附件、WebSocket、外部回调等系统接口：转 `rest-api`
- PC / uni 调用层：分别转 `pc-graphql-frontend` / `uni-graphql-frontend`

## 放置与依赖

- 手写业务默认放 `app/{mod}/{table}/`
- `generated/{mod}/{table}/` 提供基础 CRUD；优先复用，确需跨 generated 复用时再扩展
- 扩展 generated 优先新增 `*_dao2.rs`、`*_service2.rs` 等文件，并在 `mod.rs` 声明
- 依赖方向只能是 `app -> generated`，禁止 `generated -> app`

## 分层

```text
app/{mod}/{table}/
├── {table}_graphql.rs
├── {table}_resolver.rs
├── {table}_service.rs
├── {table}_model.rs  # 可选，app 专用输入输出
└── {table}_dao.rs    # 可选，generated 无法覆盖时
```

| 层 | 职责 |
|---|---|
| GraphQL | 定义字段、构建 `Ctx`、鉴权/事务、调用 resolver |
| Resolver | 日志、权限、输入预处理、调用 service |
| Service | 业务规则、事务内流程、组合 DAO |
| DAO | 数据库读写；优先调用 generated DAO |

## GraphQL 入口

```rust
#[derive(Default)]
pub struct TableAppMutation;

#[Object(rename_args = "snake_case")]
impl TableAppMutation {
  #[graphql(name = "doSomething")]
  async fn do_something(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "input")]
    input: TableInput,
  ) -> Result<TableId> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        table_resolver::do_something(input, None)
      }).await
  }
}
```

- 业务接口默认 `.with_auth()?`；仅明确匿名的入口可省略
- 多表、多记录写入必须 `.with_tran()`；只读查询不加
- 单表单记录写入是否开事务按业务原子性决定

## Resolver

```rust
#[function_name::named]
pub async fn do_something(
  input: TableInput,
  options: Option<Options>,
) -> Result<TableId> {
  info!(
    "{req_id} {function_name}: input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );

  use_permit(
    String::from(get_page_path_table()),
    String::from("action"),
  ).await?;

  table_service::do_something(input, options).await
}
```

- `#[function_name::named]` 只为 `function_name!()` 提供名称，不会自动记录日志
- Resolver 保持薄层；不要把业务判断和多表流程写在这里
- 需要权限时在 Resolver 调 `use_permit`

## Service

- 业务错误统一使用 `ServiceException`：

```rust
return Err(eyre!(ServiceException {
  message: "业务错误".into(),
  trace: true,
  ..Default::default()
}));
```

- 标准 CRUD 需保留 generated service 的校验和副作用时，调用 generated service；纯查询或底层改写可直接用 DAO
- 不在 GraphQL、Resolver、OAI、REST 层重复实现业务逻辑

## DAO 约定

| 函数 | 用途 |
|---|---|
| `find_by_id[_ok]_{table}` | 按 ID 查询，`_ok` 表示不存在时报错 |
| `find_by_ids[_ok]_{table}` | 按多个 ID 查询 |
| `find_one[_ok]_{table}` / `find_all_{table}` | 条件查询 |
| `create[_return]_{table}` / `update_by_id[_return]_{table}` | 新增 / 修改 |
| `delete_by_ids_{table}` / `force_delete_by_ids_{table}` | 逻辑删除 / 彻底删除 |

- 有 `is_deleted` 的表只能物理删除已逻辑删除的记录
- 需要行锁时复用 generated DAO：表配置 `opts.isHasForUpdate: true` 后，在事务内传
  `Options::from(options).set_is_for_update(Some(true)).into()`
- 不要为 `for update` 绕过 generated DAO 改写手写 SQL
- 普通外键字段只传 ID；generated DAO 会补齐配置的 `*_id_lbl`，不要重复传空值

## 强制规则

- `Options` 与所有 ID 类型均为 `Copy`，不要 `.clone()`
- 布尔数据库列用 `tinyint unsigned` / `u8`，只使用 `0/1`：判断 `xxx == 1`，写入 `Some(1)`
- 时间戳使用 `naive_local_timestamp` / `naive_local_timestamp_millis`；`get_now()` 是本地墙钟时间，禁止直接 `.and_utc().timestamp()`
- generated import 优先使用函数级 `use`；调用点避免大段模块前缀
- 保持 2 空格缩进和现有空白行风格；不要执行 `cargo fmt`

## 模块注册

先在 `app/{mod}/{table}/mod.rs` 声明文件：

```rust
pub mod table_graphql;
pub mod table_resolver;
pub mod table_service;
pub mod table_model; // 仅定义时需要
pub mod table_dao;   // 仅定义时需要
```

已有业务模块时，把 GraphQL 类型加入 `app/{mod}/mod.rs` 的聚合对象：

```rust
#[derive(MergedObject, Default)]
pub struct XxxAppMutation(
  self::table::table_graphql::TableAppMutation,
);
```

只有新增顶层模块时，才需要在 `app/lib.rs`：

```rust
pub mod xxx;

#[derive(MergedObject, Default)]
pub struct Mutation(
  // ...
  xxx::XxxAppMutation,
);
```

## 变更后验证

- 在 `rust/` 执行 `cargo check`
- GraphQL schema 有变化时执行 `npm run gqlgen`，更新 schema 与 PC / uni 类型
- 禁止手工修改生成的类型文件或 PC / uni `Api.ts`