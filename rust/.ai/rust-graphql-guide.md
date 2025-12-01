# 后端接口开发规范

> 本文档定义了 Rust GraphQL 后端接口的标准开发流程和代码规范

## 目录结构说明

```
rust/
├── generated/        # 自动生成的代码(尽量不修改)
│   ├── base/
    └── wx/
└── app/             # 手写代码(定制开发接口)
    ├── base/
    └── wx/
```

**重要原则:**
- `generated/` 目录代码由工具生成,除非必要否则不要修改
- `app/` 目录用于手写业务逻辑和定制接口
- 上面的 `base` 和 `wx` 代表的是模块的名字, `base` 是基础模块, `wx` 是微信相关模块等
- 每个模块按照三层架构组织:`graphql → resolver → service`

---

## 标准三层架构

每个功能模块必须包含以下三个文件:

### 1. GraphQL 层 (`*_graphql.rs`)

**职责:** 定义 GraphQL 接口、参数验证、权限控制

**标准模板:**

```rust
use color_eyre::eyre::Result;
use async_graphql::{Context, Object};
use generated::common::context::Ctx;

#[derive(Default)]
pub struct XxxQuery;

#[derive(Default)]
pub struct XxxMutation;

#[Object(name = "XxxQuery")]
impl XxxQuery {
  
  /// 接口描述(必须写注释)
  async fn method_name(
    &self,
    ctx: &Context<'_>,
    // 参数使用 #[graphql(name = "snake_case")] 
    #[graphql(name = "param_name")]
    param_name: ParamType,
  ) -> Result<ReturnType> {
    Ctx::builder(ctx)
      .with_auth()?              // 需要认证
      // .with_tran()             // 需要事务(仅 Mutation)
      .build()
      .scope({
        xxx_resolver::method_name(
          param_name,
          None,                   // options 固定传 None
        )
      }).await
  }
  
}

#[Object(name = "XxxMutation")]
impl XxxMutation {
  
  /// 修改操作描述
  async fn mutate_method(
    &self,
    ctx: &Context<'_>,
    #[graphql(name = "input")]
    input: InputType,
  ) -> Result<ReturnType> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()                // Mutation 通常需要事务
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

**关键点:**
- Query/Mutation 分离定义
- `.with_auth()` 用于需要登录的接口
- `.with_tran()` 用于需要数据库事务的修改操作
- 参数名统一使用 `snake_case` 通过 `#[graphql(name = "")]` 指定
- 最后一个参数始终为 `None` (options)

---

### 2. Resolver 层 (`*_resolver.rs`)

**职责:** 参数解构、日志记录、调用 Service 层

**标准模板:**

```rust
use color_eyre::eyre::Result;
use tracing::info;

use generated::common::context::{
  Options,
  get_req_id,
};

/// 接口描述
pub async fn method_name(
  param1: Type1,
  param2: Type2,
  options: Option<Options>,
) -> Result<ReturnType> {
  
  // 简单查询可以不加日志
  
  let result = xxx_service::method_name(
    param1,
    param2,
    options,
  ).await?;
  
  Ok(result)
}

/// 复杂接口描述(带日志)
#[function_name::named]
pub async fn complex_method(
  param: ParamType,
  options: Option<Options>,
) -> Result<ReturnType> {
  
  // 重要接口必须记录日志
  info!(
    "{req_id} {function_name}: param: {param:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let result = xxx_service::complex_method(
    param,
    options,
  ).await?;
  
  Ok(result)
}
```

**关键点:**
- 简单查询接口可以省略日志
- 复杂/重要接口使用 `#[function_name::named]` 和 `info!` 记录日志
- 直接调用 Service 层,透传 `options`
- 错误使用 `?` 向上传播

---

### 3. Service 层 (`*_service.rs`)

**职责:** 核心业务逻辑、数据库操作、业务校验

**标准模板:**

```rust
use color_eyre::eyre::{Result, eyre};

use generated::common::context::{
  Options,
  get_auth_id_ok,    // 获取当前登录用户ID
  get_now,           // 获取当前时间
  get_short_uuid,    // 生成短UUID
};

// 导入需要的 DAO 和 Model
use generated::xxx::xxx_dao::{
  find_by_id_xxx,
  find_by_id_ok_xxx,
  find_one_xxx,
  find_all_xxx,
  create_xxx,
  update_by_id_xxx,
  delete_by_ids_xxx,
  validate_option_xxx,
  validate_is_enabled_xxx,
};
use generated::xxx::xxx_model::{
  XxxId,
  XxxInput,
  XxxModel,
  XxxSearch,
};

/// 接口业务逻辑实现
pub async fn method_name(
  param1: Type1,
  param2: Type2,
  options: Option<Options>,
) -> Result<ReturnType> {
  
  // 1. 参数校验
  if param1.is_empty() {
    return Err(eyre!("参数不能为空"));
  }
  
  // 2. 获取当前用户
  let usr_id = get_auth_id_ok()?;
  
  // 3. 查询数据
  let model = validate_option_xxx(
    find_one_xxx(
      Some(XxxSearch {
        usr_id: Some(vec![usr_id]),
        ..Default::default()
      }),
      None,
      options.clone(),
    ).await?,
  ).await?;
  
  // 4. 业务校验
  validate_is_enabled_xxx(&model).await?;
  
  // 5. 数据操作
  let result = create_xxx(
    XxxInput {
      field1: Some(value1),
      field2: Some(value2),
      ..Default::default()
    },
    options.clone(),
  ).await?;
  
  // 6. 返回结果
  Ok(result)
}
```

**关键点:**
- 所有业务逻辑和数据库操作都在这一层
- 使用 `generated` 中的 DAO 函数进行数据库操作
- 错误信息使用中文,便于前端展示
- `options.clone()` 传递给 DAO 层
- 遵循: 参数校验 → 权限检查 → 数据查询 → 业务校验 → 数据操作 → 返回结果

---

## 常用 DAO 函数规范

所有 DAO 函数都从 `generated/xxx/xxx_dao.rs` 导入:

| 函数名 | 用途 | 返回值 | 说明 |
|--------|------|--------|------|
| `find_by_id_xxx` | 根据ID查询 | `Option<Model>` | 不存在返回 None |
| `find_by_id_ok_xxx` | 根据ID查询(必存在) | `Model` | 不存在抛异常 |
| `find_by_ids_xxx` | 根据ID列表查询 | `Vec<Model>` | 批量查询 |
| `find_one_xxx` | 条件查询单条 | `Option<Model>` | 使用 Search 对象 |
| `find_all_xxx` | 条件查询所有 | `Vec<Model>` | 支持排序、分页 |
| `create_xxx` | 创建记录 | `Id` | 返回新记录ID |
| `update_by_id_xxx` | 根据ID更新 | `u64` | 返回影响行数 |
| `delete_by_ids_xxx` | 根据ID列表删除 | `u64` | 物理或逻辑删除 |
| `validate_option_xxx` | 校验 Option | `Model` | None 时抛异常 |
| `validate_is_enabled_xxx` | 校验启用状态 | `()` | 禁用时抛异常 |

**使用示例:**

```rust
// 查询 + 校验
let model = validate_option_xxx(
  find_one_xxx(
    Some(XxxSearch {
      field: Some(vec![value]),
      ..Default::default()
    }),
    None,
    options.clone(),
  ).await?,
).await?;

// 状态校验
validate_is_enabled_xxx(&model).await?;

// 创建
let id = create_xxx(
  XxxInput {
    field: Some(value),
    ..Default::default()
  },
  options.clone(),
).await?;

// 更新
update_by_id_xxx(
  id,
  XxxInput {
    field: Some(new_value),
    ..Default::default()
  },
  options.clone(),
).await?;
```

---

## 模块注册规范

创建新模块后需要在 `mod.rs` 中注册:

```rust
// 文件声明
pub mod xxx_graphql;
pub mod xxx_resolver;
pub mod xxx_service;

// GraphQL Schema 注册(在上层模块)
use crate::spc::xxx::xxx_graphql::{XxxQuery, XxxMutation};

pub type Query = (
  // ...其他Query
  XxxQuery,
);

pub type Mutation = (
  // ...其他Mutation
  XxxMutation,
);
```

---

## 错误处理规范

### 1. 业务错误(用户可见)

```rust
use color_eyre::eyre::eyre;

// 简单错误
return Err(eyre!("中文错误提示"));

// 带详细信息的错误
use generated::common::exceptions::service_exception::ServiceException;

return Err(eyre!(ServiceException {
  code: "BUSINESS_ERROR_CODE".to_string(),
  message: "详细错误说明".to_string(),
  trace: true,  // 是否记录堆栈
  ..Default::default()
}));
```

### 2. 系统错误(开发调试)

```rust
// 直接传播
let result = operation().await?;

// 转换错误类型
let num: u32 = value.try_into()
  .map_err(|_| eyre!("数据转换失败"))?;
```

---

## 常用辅助函数

```rust
use generated::common::context::{
  get_auth_id_ok,      // 获取当前登录用户ID(无则抛异常)
  get_auth_id,         // 获取当前登录用户ID(无则返回None)
  get_tenant_id_ok,    // 获取当前租户ID
  get_now,             // 获取当前时间(DateTime<Utc>)
  get_short_uuid,      // 生成短UUID(用于主键)
  get_req_id,          // 获取请求ID(用于日志追踪)
};

// 使用示例
let usr_id = get_auth_id_ok()?;
let now = get_now();
let id = get_short_uuid();
```

---

## 命名约定

### 文件命名
- GraphQL 层: `{module}_graphql.rs`
- Resolver 层: `{module}_resolver.rs`
- Service 层: `{module}_service.rs`

### 函数命名
- 查询: `get_xxx`, `find_xxx`, `list_xxx`
- 创建: `create_xxx`, `add_xxx`
- 修改: `update_xxx`, `edit_xxx`
- 删除: `delete_xxx`, `remove_xxx`
- 校验: `validate_xxx`, `check_xxx`

### 类型命名
- ID 类型: `XxxId`
- 模型: `XxxModel`
- 输入: `XxxInput`
- 搜索: `XxxSearch`
- Query: `XxxQuery`
- Mutation: `XxxMutation`

---

## 完整示例对照

参考 `app/spc/employee/` 目录:

```
employee/
├── employee_graphql.rs    # GraphQL 接口定义
├── employee_resolver.rs   # 参数解构、日志记录
├── employee_service.rs    # 业务逻辑实现
└── mod.rs                # 模块导出
```

**开发新接口时:**
1. 复制 `employee` 目录作为模板
2. 全局替换 `employee` 为新模块名
3. 根据业务需求修改具体逻辑
4. 在上层 `mod.rs` 中注册模块

---

## 最佳实践

### ✅ 推荐做法

1. **分层清晰** - 每层只做该层的事情
2. **错误友好** - 业务错误用中文,便于展示
3. **日志完整** - 重要操作必须记录日志
4. **参数校验前置** - 在 Service 层入口校验
5. **使用 validate 函数** - 统一的校验逻辑
6. **options.clone()** - 传递上下文时需要 clone

### ❌ 避免的做法

1. 在 GraphQL 层写业务逻辑
2. 在 Resolver 层操作数据库
3. 直接修改 `generated/` 目录代码
4. 遗漏事务标记(修改操作)
5. 不写函数注释
6. 硬编码魔法值

---

## 快速开发检查清单

创建新接口时,确保完成以下步骤:

- [ ] 在 `app/` 目录创建模块文件夹
- [ ] 创建 `*_graphql.rs` 定义接口
- [ ] 创建 `*_resolver.rs` 处理参数
- [ ] 创建 `*_service.rs` 实现逻辑
- [ ] 创建 `mod.rs` 导出模块
- [ ] 在上层 `mod.rs` 注册 Query/Mutation
- [ ] 添加必要的注释说明
- [ ] 查询接口使用 `.with_auth()`
- [ ] 修改接口使用 `.with_auth().with_tran()`
- [ ] 重要操作添加日志记录
- [ ] 错误信息使用中文
- [ ] 运行 `cargo check` 检查编译

---

## 附录:依赖导入模板

```rust
// GraphQL 层常用导入
use color_eyre::eyre::Result;
use async_graphql::{Context, Object};
use generated::common::context::Ctx;

// Resolver 层常用导入
use color_eyre::eyre::Result;
use tracing::info;
use generated::common::context::{Options, get_req_id};

// Service 层常用导入
use color_eyre::eyre::{Result, eyre};
use generated::common::context::{
  Options,
  get_auth_id_ok,
  get_now,
  get_short_uuid,
};
use generated::common::exceptions::service_exception::ServiceException;
```

---

**最后更新:** 2025-11-28  
**维护者:** 项目开发团队  
**用途:** AI 辅助开发、团队规范参考
