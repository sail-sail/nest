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
  
  // 1. 参数校验
  if param.is_empty() {
    return Err(eyre!("参数不能为空"));
  }
  
  // 2. 获取当前用户
  let usr_id: UsrId = get_auth_id_ok()?;
  
  // 3. 查询数据
  let {table}_model = find_one_ok_{table}(
    Some({Table}Search {
      field: Some(param),
      ..Default::default()
    }),
    None,
    options,
  ).await?;
  
  // 查询列表, 变量名命名通常是 {table}_models 或者 {table}_model
  let {table}_models = find_all_{table}(
    Some({Table}Search {
      field: Some(param),
      ..Default::default()
    }),
    Some(PageInput {
      pg_offset: Some(0),
      pg_size: Some(10),
      is_result_limit: Some(false), // 不限制总数, 默认 find_all_xxx 会限制总数, 超过1000报错, 可配置, 默认true, 一般无需此参数
    }), // 不分页则传入 None 即可
    Some(SortInput {
      prop: SmolStr::new("created_time"),
      order: SortOrderEnum::Desc,
    }), // 一般无需排序参数传入 None 即可, 建表时已加默认排序
    options,
  ).await?;
  
  // 获取当前时间
  let now = get_now();
  
  // 4. 业务操作, 业务操作过程中如果不清楚表结构则可以到这里查看表结构 `src/tables/{mod}/{mod}.sql`, `src/tables/{mod}/{mod}.ts`
  // 注意: 业务逻辑开发过程中, 不需要写太多注释, 关键位置写一点业务注释即可
  
  // 5. 返回结果
  Ok({table}_models)
}
```

- 如需操作附件, 则使用 [oss_dao.rs](../../../generated/common/oss/oss_dao.rs) 提供的函数进行操作

- 函数定义和调用时, 多个参数时要换行

## 常用 DAO 函数

| 函数 | 用途 |
|------|------|
| `find_by_id_{table}` | ID查询 → `Option<{Table}Model>` |
| `find_by_id_ok_{table}` | ID查询（必存在否则抛异常）|
| `find_by_ids_{table}` | 多ID查询 → `Vec<{Table}Model>` |
| `find_by_ids_ok_{table}` | 多ID查询（必存在且顺序跟ids一致）|
| `find_one_{table}` | 条件查单条 包括搜索条件,排序参数 |
| `find_one_ok_{table}` | 条件查单条（必存在）|
| `find_all_{table}` | 条件查列表 包括搜索条件,分页,排序参数 |
| `create_{table}` | 创建 → ID |
| `create_return_{table}` | 创建 → 立即查询返回 |
| `update_by_id_{table}` | 更新 |
| `update_by_id_return_{table}` | 更新 → 立即查询返回 |
| `delete_by_ids_{table}` | 逻辑删除 |
| `force_delete_by_ids_{table}` | 彻底删除 |
| `validate_option_{table}` | 校验 None 时抛异常 |
| `validate_is_enabled_{table}` | 校验禁用时抛异常 |

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

## 编码约定
- GraphQL 接口定义放在 `{table}_graphql.rs`，参数解构/日志放在 `{table}_resolver.rs`，类型定义放在 `{table}_model.rs`，数据库操作放在 `{table}_dao.rs`，业务逻辑/数据库放在 `{table}_service.rs`
- 业务逻辑的字符串类型使用 `SmolStr`，第三方类库如果需要求 `String` 则转换类型给三方库
- 函数调用和定义时，参数每行一个参数，尽可能换行
- 调用create或者update传入Input时，Input参数中的_lbl字段大多不用传递，dao层会自动生成_lbl的值
- 用不执行 `cargo fmt`, 因为格式由架构编码约定决定
- ⚠️ `generated` 不允许依赖 `app`, 只能由 `app` 单向依赖 `generated`, 避免循环依赖, 如果业务逻辑无法避免, 则不得不把代码写到 `generated` 中

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

当后端 GraphQL 接口（尤其是 `*_graphql.rs` 的 Query/Mutation 入参或返回）发生变更后：

1. 在 `rust/` 目录执行：

```bash
npm run gqlgen
```

2. 该命令会执行：

- `cargo run --bin schema`（重新导出 schema）
- `graphql-codegen --config ./generated/common/script/graphql_codegen_config.ts`（生成前端类型）

3. 会同步更新前端类型文件（如 `pc/src/typings/types.ts`、`uni/src/typings/types.ts`）

> 说明：后端改动接口需要刷新前端类型时，优先执行 `npm run gqlgen`, `cargo run` 也会自动执行 `npm run gqlgen` 效果相同
