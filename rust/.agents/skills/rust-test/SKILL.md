---
name: rust-test
description: 编写 Rust 单元测试或数据刷新脚本时使用.
---

# Rust 测试规范

## 原则

- 普通测试只验证业务逻辑，可直接被 `cargo test` 执行.
- 数据刷新脚本、外部环境测试必须加 `#[ignore = "..."]`, 禁止默认执行.
- 测试返回值:
  - 需要 `?` 传播错误时返回 `Result<()>`.
  - 纯断言测试返回 `()`.

## 放置位置

测试与被测代码同文件, 通常放文件末尾:

```rust
#[cfg(test)]
mod tests {
  use super::*;
}
```

| 文件目录 | Ctx 引用 | PageInput 引用 |
|---|---|---|
| `generated/{mod}/{table}/` | `crate::common::context::Ctx` | `crate::common::gql::model::PageInput` |
| `app/{mod}/{table}/` | `generated::common::context::Ctx` | `generated::common::gql::model::PageInput` |

## 同步测试

```rust
#[test]
fn test_xxx() {
  let result = xxx();
  assert_eq!(result, expected);
}
```

## 异步测试

访问数据库或依赖 `Ctx` 时使用 `#[tokio::test]`:

```rust
#[cfg(test)]
mod tests {
  use super::*;
  use crate::common::context::Ctx;
  // app/ 目录使用 generated::common::context::Ctx

  #[tokio::test]
  async fn test_xxx() -> Result<()> {
    Ctx::test_builder()
      .with_silent_mode()
      .build()
      .scope(async {
        // 调用业务逻辑并断言
        Ok(())
      }).await
  }
}
```

`Ctx::test_builder()` 会加载 `.env`.

## Ctx 使用规则

- `.scope(async { ... })`: 普通 Future, 默认使用.
- `.scope_fn(async || { ... })`: 只在需要 `AsyncFnOnce` 时使用.
- REST 测试使用 `Ctx::resful_builder(Some(&req))`, 再调用 `.resful_scope(...)`; 不要用 `test_builder().resful_scope(...)`.
- `.with_tran()` 表示开启事务: 成功提交, 错误回滚. 它不会自动隔离测试数据.
- `.with_auth()` 依赖已注入的 token. 普通测试需要身份时，直接构造 `AuthModel` 并使用 `.with_auth_model(...)`.
- `.with_silent_mode()` 会跳过部分日志和自动审计字段; 业务断言依赖这些字段时须显式传入.
- DAO/Service 传参需要 `Options` 时优先复用同一个值; `Options` 和所有 id 类型都是 `Copy`, 不要 `.clone()`.

## 数据刷新脚本

必须分页、可重复检查、默认不执行:

```rust
#[cfg(test)]
mod tests {
  use super::*;
  use crate::common::context::Ctx;
  use crate::common::gql::model::{
    PageInput,
    SortInput,
    SortOrderEnum,
  };
  // app/ 目录统一改为 generated::common::gql::model

  #[tokio::test]
  #[ignore = "数据刷新脚本，确认后手动运行"]
  async fn test_refresh_xxx() -> Result<()> {
    Ctx::test_builder()
      .with_silent_mode()
      .build()
      .scope(async {
        let pg_size = 500_i64;
        let mut pg_offset = 0_i64;
        let mut processed = 0_usize;

        loop {
          let models = find_all_xxx(
            None,
            Some(PageInput {
              pg_offset: Some(pg_offset),
              pg_size: Some(pg_size),
              ..Default::default()
            }),
            Some(vec![SortInput {
              prop: "id".into(),
              order: SortOrderEnum::Asc,
            }]),
            None,
          ).await?;

          if models.is_empty() {
            break;
          }

          for model in models {
            // 更新单条数据
            processed += 1;
          }

          println!("已处理 {processed} 条");
          pg_offset += pg_size;
        }

        Ok(())
      }).await
  }
}
```

- 必须使用稳定排序分页, 禁止 `page = None` 拉全表.
- 更新会改变查询条件时, 固定 `pg_offset` 会跳数据; 改用每批重新从 0 查询, 或按主键游标分页.
- 大批量刷新不要包在单个 `.with_tran()` 长事务中; 按业务边界分批提交.
- 处理预期超过 1000 条时必须输出进度.
- 脚本执行前后检查目标条件与总量, 不在未确认时自动运行.

## 运行

```bash
# 普通测试
cargo test test_xxx -- --nocapture

# 数据刷新脚本
cargo test test_refresh_xxx -- --ignored --nocapture
```
