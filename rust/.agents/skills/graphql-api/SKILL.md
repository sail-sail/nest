---
name: graphql-api
description: 创建自定义API使用.任意后端代码开发使用
---

# GraphQL 接口开发

## 三层架构

| 层 | 文件 | 职责 |
|----|------|------|
| GraphQL | `*_graphql.rs` | 接口定义/权限 |
| Model  | `*_model.rs`   | 输入输出类型(给各层函数用的结构体) |
| Resolver | `*_resolver.rs` | 参数解构/日志 |
| Service | `*_service.rs` | 业务逻辑 |
| DAO     | `*_dao.rs`     | 数据库操作(一般无需手动改动,已自动生成常用 DAO 函数) |

## GraphQL 层

```rust
use async_graphql::{Context, Object};
use generated::common::context::Ctx;

#[derive(Default)]
pub struct {Table}Query;

#[Object(name = "{Table}Query")]
impl {Table}Query {
  /// 接口描述
  #[graphql(name = "MethodName")]
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
        {table}_resolver::method_name(
          param_name,
          None,
        )
      }).await
  }
}

#[derive(Default)]
pub struct {Table}Mutation;

#[Object(name = "{Table}Mutation")]
impl {Table}Mutation {
  /// 修改操作
  #[graphql(name = "MutateMethod")]
  async fn mutate_method(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "input")]
    input: {Table}Input,
  ) -> Result<Vec<{Table}Model>> {
    
    Ctx::builder(ctx)
      .with_auth()? // 是否登录之后才能调用
      .with_tran() // 修改需事务
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

## Resolver 层

```rust
use tracing::info;
use generated::common::context::{
  Options,
  get_req_id,
};

#[function_name::named]
pub async fn method_name(
  param: ParamType,
  options: Option<Options>,
) -> Result<ReturnType> {
  
  info!(
    "{req_id} {function_name}: {param:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  {table}_service::method_name(
    param,
    options,
  ).await
}
```

- `options` 是 `Copy` 类型, 所有 Id 类型也是 `Copy` 类型

## Service 层

```rust
use color_eyre::eyre::{Result, eyre};

use smol_str::SmolStr;

use generated::common::context::{
  Options,
  get_auth_id_ok,
  get_now,
  get_short_uuid,
};

pub async fn method_name(
  param: ParamType,
  options: Option<Options>,
) -> Result<ReturnType> {
  
  if param.is_empty() {
    return Err(eyre!("参数不能为空"));
  }
  
  let usr_id: UsrId = get_auth_id_ok()?;
  
  // 查单条
  let {table}_model = find_one_ok_{table}(
    Some({Table}Search {
      field: Some(param),
      ..Default::default()
    }),
    None,
    options,
  ).await?;
  
  // 查列表(分页可传 None, 排序可传 None 走默认)
  let {table}_models = find_all_{table}(
    Some({Table}Search {
      field: Some(param),
      ..Default::default()
    }),
    Some(PageInput {
      pg_offset: Some(0),
      pg_size: Some(10),
      is_result_limit: Some(false),
    }),
    None,
    options,
  ).await?;
  
  let now = get_now();
  
  // 业务操作...
  
  Ok({table}_models)
}
```

- 如需操作附件, 则使用 [oss_dao.rs](../../../generated/common/oss/oss_dao.rs) 提供的函数进行操作

- 函数定义和调用时, 多个参数时要换行

## 常用 DAO 函数

| 函数 | 用途 |
|------|------|
| `find_by_id[_ok]_{table}` | ID查询，`_ok` 变体必存在否则抛异常 |
| `find_by_ids[_ok]_{table}` | 多ID查询，`_ok` 变体保证顺序一致 |
| `find_one[_ok]_{table}` | 条件查单条(搜索条件,排序) |
| `find_all_{table}` | 条件查列表(搜索条件,分页,排序) |
| `create[_return]_{table}` | 创建，`_return` 变体立即返回 |
| `update_by_id[_return]_{table}` | 更新，`_return` 变体立即返回 |
| `delete_by_ids_{table}` | 逻辑删除 |
| `force_delete_by_ids_{table}` | 彻底删除 |
| `validate_option_{table}` | 校验 None 抛异常 |
| `validate_is_enabled_{table}` | 校验禁用抛异常 |

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

## 编码要点
- 字符串用 `SmolStr`，三方库需要 `String` 时再转
- Input 中 `_lbl` 字段无需传递，dao 层自动生成
- 不执行 `cargo fmt`
- `options` 和所有 `id` 类型均为 `Copy`，无需 `.clone()`
- ⚠️ `generated` 不允许依赖 `app`，只能单向 `app` → `generated`

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

## 接口变更后的类型生成

在 `rust/` 目录执行 `npm run gqlgen`，自动导出 schema 并更新前端类型（`pc/src/typings/types.ts`、`uni/src/typings/types.ts`）。
