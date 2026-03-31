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
- 在 `app/{mod}/{table}/` 中新增 `*_graphql.rs`、`*_resolver.rs`、`*_service.rs`、`*_model.rs`
- 只有当 `app/` 无法承载，且能力需要被 generated 内部复用时，才扩展 `generated/`

## 修改决策顺序

1. 默认先改 `app/{mod}/{table}/`

  新增业务接口、组合查询、业务校验、日志、事务，优先放在 `app/`。

2. 前端联动走手写接口文件

  PC 写到 `src/views/{mod}/{table}/Api2.ts`，uni 写到 `src/pages/{table}/Api2.ts`，不要改生成的 `Api.ts`。

3. 只有单向依赖做不到时才补 `generated/`

  典型场景是补基础 DAO、Model、Service 能力，且该能力必须继续被 generated 内部复用。

4. 扩展 `generated/` 时优先加同级扩展文件

  使用 `*_dao2.rs`、`*_service2.rs`、`*_resolver2.rs`、`*_model2.rs` 这类文件名，并在对应 `mod.rs` 中显式 `pub mod ...`。非必要不要在 `generated/*_graphql.rs` 中加业务接口。

## 目录边界

| 目录 | 角色 | 规则 |
|------|------|------|
| `app/{mod}/{table}/` | 手写业务层 | 默认入口 |
| `generated/{mod}/{table}/` | 基础 CRUD 层 | 非默认编辑入口，仅在必须补基础能力时扩展 |

- 允许 `app -> generated`
- 不允许 `generated -> app`

## 标准分层

```text
app/{mod}/{table}/
├── {table}_graphql.rs
├── {table}_resolver.rs
├── {table}_model.rs
├── {table}_dao.rs
└── {table}_service.rs
```

| 层 | 文件 | 职责 |
|----|------|------|
| GraphQL | `*_graphql.rs` | 定义接口、权限入口、构建 `Ctx` |
| Resolver | `*_resolver.rs` | 参数解构、日志、转调 Service |
| Model | `*_model.rs` | 输入输出类型 |
| Service | `*_service.rs` | 业务逻辑、事务内流程、调用 DAO |
| DAO | `*_dao.rs` | 数据库查询与写入 |

## 最小实现模式

### GraphQL

```rust
use async_graphql::{Context, Object};
use generated::common::context::Ctx;

#[derive(Default)]
pub struct {Table}Mutation;

#[Object(name = "{Table}Mutation")]
impl {Table}Mutation {
  #[graphql(name = "mutate_method")]
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
use smol_str::SmolStr;

use generated::common::context::{
  Options,
  get_auth_id_ok,
  get_now,
};

pub async fn method_name(
  input: ParamType,
  options: Option<Options>,
) -> Result<ReturnType> {
  
  if input.is_empty() {
    return Err(eyre!("参数不能为空"));
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

- 字符串优先使用 `SmolStr`，三方库要求时再转 `String`
- `options` 和所有 `id` 类型都是 `Copy`，不要 `.clone()`
- Input 中 `_lbl` 字段无需传递，DAO 会自动生成
- 修改操作通常加 `.with_tran()`
- 需要登录的接口加 `.with_auth()?`
- 函数定义和调用时，多参数统一换行
- 如需操作附件，使用 [generated/common/oss/oss_dao.rs](../../../generated/common/oss/oss_dao.rs)
- 不执行 `cargo fmt`
- 如需补注释，只写简洁业务注释

## 模块注册

```rust
pub mod xxx_graphql;
pub mod xxx_resolver;
pub mod xxx_service;

pub type Query = (XxxQuery,);
pub type Mutation = (XxxMutation,);
```

## 接口变更后的类型生成

在 `rust/` 目录执行 `npm run gqlgen`，会导出 schema 并更新前端类型：

- `pc/src/typings/types.ts`
- `uni/src/typings/types.ts`
