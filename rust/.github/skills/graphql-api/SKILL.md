---
name: graphql-api
description: Rust GraphQL 接口开发. 创建自定义 API 时使用
---

# GraphQL 接口开发

## 三层架构

| 层 | 文件 | 职责 |
|----|------|------|
| GraphQL | `*_graphql.rs` | 接口定义/权限 |
| Resolver | `*_resolver.rs` | 参数解构/日志 |
| Service | `*_service.rs` | 业务逻辑/DB |

## GraphQL 层

```rust
use async_graphql::{Context, Object};
use generated::common::context::Ctx;

#[derive(Default)]
pub struct XxxQuery;

#[Object(name = "XxxQuery")]
impl XxxQuery {
  /// 接口描述
  async fn method_name(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "param_name")]
    param_name: ParamType,
  ) -> Result<ReturnType> {
    Ctx::builder(ctx)
      .with_auth()?           // 需要认证
      .build()
      .scope({
        xxx_resolver::method_name(param_name, None)
      }).await
  }
}

#[derive(Default)]
pub struct XxxMutation;

#[Object(name = "XxxMutation")]
impl XxxMutation {
  /// 修改操作
  async fn mutate_method(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "input")]
    input: InputType,
  ) -> Result<ReturnType> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()            // 修改需事务
      .build()
      .scope({
        xxx_resolver::mutate_method(input, None)
      }).await
  }
}
```

## Resolver 层

```rust
use tracing::info;
use generated::common::context::{Options, get_req_id};

#[function_name::named]
pub async fn method_name(
  param: ParamType,
  options: Option<Options>,
) -> Result<ReturnType> {
  info!("{} {}: {:?}", get_req_id(), function_name!(), param);
  xxx_service::method_name(param, options).await
}
```

## Service 层

```rust
use color_eyre::eyre::{Result, eyre};
use generated::common::context::{Options, get_auth_id_ok, get_now, get_short_uuid};

pub async fn method_name(
  param: ParamType,
  options: Option<Options>,
) -> Result<ReturnType> {
  // 1. 参数校验
  if param.is_empty() {
    return Err(eyre!("参数不能为空"));
  }
  
  // 2. 获取当前用户
  let usr_id = get_auth_id_ok()?;
  
  // 3. 查询数据
  let model = validate_option_xxx(
    find_one_xxx(Some(XxxSearch { ... }), None, options.clone()).await?,
  ).await?;
  
  // 4. 业务操作
  Ok(result)
}
```

## 常用 DAO 函数

| 函数 | 用途 |
|------|------|
| `find_by_id_xxx` | ID查询 → `Option<Model>` |
| `find_by_id_ok_xxx` | ID查询（必存在）|
| `find_one_xxx` | 条件查单条 |
| `find_all_xxx` | 条件查列表 |
| `create_xxx` | 创建 → ID |
| `update_by_id_xxx` | 更新 |
| `delete_by_ids_xxx` | 软删除 |
| `validate_option_xxx` | None 时抛异常 |
| `validate_is_enabled_xxx` | 禁用时抛异常 |

## 辅助函数

```rust
use generated::common::context::{
  get_auth_id_ok,    // 当前用户ID
  get_tenant_id_ok,  // 当前租户ID
  get_now,           // 当前时间
  get_short_uuid,    // 生成ID
  get_req_id,        // 请求ID(日志)
};
```

## 模块注册

```rust
// mod.rs
pub mod xxx_graphql;
pub mod xxx_resolver;
pub mod xxx_service;

// 上层 schema
pub type Query = (XxxQuery,);
pub type Mutation = (XxxMutation,);
```
