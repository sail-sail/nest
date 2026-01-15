---
name: graphql-api
description: Rust GraphQL 接口开发. 创建自定义 API 时使用
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
    input: {Table}Input,
  ) -> Result<Vec<{Table}Model>> {
    Ctx::builder(ctx)
      .with_auth()? // 是否登录之后才能调用
      .with_tran() // 修改需事务
      .build()
      .scope({
        xxx_resolver::mutate_method(
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
    "{} {}: {:?}",
    get_req_id(),
    function_name!(),
    param,
  );
  
  xxx_service::method_name(
    param,
    options,
  ).await
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
  let usr_id: UsrId = get_auth_id_ok()?;
  
  // 3. 查询数据
  let {table}_model = find_one_ok_xxx(
    Some(XxxSearch {
      field: Some(param),
      ..Default::default()
    }),
    None,
    options.clone(),
  ).await?;
  
  // 查询列表
  let {table}_models = find_all_xxx(
    Some(XxxSearch {
      field: Some(param),
      ..Default::default()
    }),
    Some(PageInput {
      pg_offset: 0,
      pg_size: 10,
      is_result_limit: Some(false), // 不限制总数, 默认 find_all_xxx 会限制总数, 超过1000报错, 可配置, 默认true, 一般无需此参数
    }),
    Some(SortInput {
      prop: "created_time".to_string(),
      order: SortOrderEnum::Desc,
    }), // 一般无需排序参数, 建表时已加默认排序
    options.clone(),
  ).await?;
  
  // 获取当前时间
  let now = get_now();
  
  // 4. 业务操作 ...
  
  // 5. 返回结果
  Ok({table}_models)
}
```

## 常用 DAO 函数

| 函数 | 用途 |
|------|------|
| `find_by_id_xxx` | ID查询 → `Option<Model>` |
| `find_by_id_ok_xxx` | ID查询（必存在否则抛异常）|
| `find_by_ids_xxx` | 多ID查询 → `Vec<Model>` |
| `find_by_ids_ok_xxx` | 多ID查询（必存在且顺序跟ids一致）|
| `find_one_xxx` | 条件查单条 包括搜索条件,排序参数 |
| `find_one_ok_xxx` | 条件查单条（必存在）|
| `find_all_xxx` | 条件查列表 包括搜索条件,分页,排序参数 |
| `create_xxx` | 创建 → ID |
| `create_return_xxx` | 创建 → 立即查询返回 |
| `update_by_id_xxx` | 更新 |
| `update_by_id_return_xxx` | 更新 → 立即查询返回 |
| `delete_by_ids_xxx` | 逻辑删除 |
| `force_delete_by_ids_xxx` | 彻底删除 |
| `validate_option_xxx` | 校验 None 时抛异常 |
| `validate_is_enabled_xxx` | 校验禁用时抛异常 |

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
