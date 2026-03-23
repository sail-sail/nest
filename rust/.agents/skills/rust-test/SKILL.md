---
name: rust-test
description: Rust 测试用例编写规范。编写单元测试或数据刷新脚本时使用
---

# Rust 测试用例编写

## 用途

测试用例（`#[cfg(test)]`）在本项目中有两种主要用途：
1. **单元测试** — 验证业务逻辑正确性
2. **数据刷新脚本** — 批量修改/迁移数据（一次性脚本，以测试形式运行）

## 放置位置

测试代码放在 `*_service.rs` 文件末尾的 `#[cfg(test)] mod tests { }` 块中。

| 目录 | Ctx 引用路径 |
|------|-------------|
| `generated/{mod}/{table}/` | `use crate::common::context::Ctx;` |
| `app/{mod}/{table}/` | `use generated::common::context::Ctx;` |

## 基本模板

```rust
#[cfg(test)]
mod tests {
  
  use super::*;
  use crate::common::context::Ctx;
  // app/ 目录下则用: use generated::common::context::Ctx;
  
  /// 测试描述（说明目的、做了什么）
  #[tokio::test]
  async fn test_xxx() -> Result<()> {
    
    Ctx::test_builder()
      .with_silent_mode()
      .build()
      .scope(async {
        
        let options = Options::new()
          .set_is_silent_mode(Some(true));
        let options = Some(options);
        
        // 业务逻辑...
        
        Ok(())
        
      }).await
  }
  
}
```

## Ctx::test_builder() 说明

`Ctx::test_builder()` 会自动加载 `.env` 环境变量并创建上下文构建器，提供以下链式方法：

| 方法 | 说明 |
|------|------|
| `.with_silent_mode()` | 静默模式，减少日志输出，同时不会影响 create_usr_id 等审计字段 |
| `.with_tran()` | 开启数据库事务（需要回滚时使用） |
| `.with_auth()?` | 需要登录认证（测试中一般不用） |
| `.build()` | 构建 `Ctx` 实例 |

## scope 方法

构建完 `Ctx` 后，通过 `scope` 执行异步测试体：

```rust
// 方式1: scope — 传入 Future（推荐）
Ctx::test_builder()
  .with_silent_mode()
  .build()
  .scope(async {
    // 测试逻辑
    Ok(())
  }).await

// 方式2: scope_fn — 传入 AsyncFnOnce 闭包
Ctx::test_builder()
  .build()
  .scope_fn(async || -> Result<()> {
    // 测试逻辑
    Ok(())
  }).await
```

## Options 传递

测试中调用 DAO/Service 函数时，构造静默模式的 `Options` 传入：

```rust
let options = Options::new()
  .set_is_silent_mode(Some(true));
let options = Some(options);

let models = find_all_{table}(
  None,   // search
  None,   // page
  None,   // sort
  options,
).await?;
```

## 数据刷新脚本示例

```rust
#[cfg(test)]
mod tests {
  
  use super::*;
  use crate::common::context::Ctx;
  
  use crate::exh::some_table::some_table_dao::find_by_id_ok_some_table;
  use crate::exh::booking_order::booking_order_dao::{
    find_all_booking_order,
    update_by_id_booking_order,
  };
  
  /// 扫描 booking_order 表, 从关联表补充缺失字段
  #[tokio::test]
  async fn test_fill_missing_fields() -> Result<()> {
    
    Ctx::test_builder()
      .with_silent_mode()
      .build()
      .scope(async {
        
        let options = Options::new()
          .set_is_silent_mode(Some(true));
        let options = Some(options);
        
        let models = find_all_booking_order(
          None,
          None,
          None,
          options,
        ).await?;
        
        for (i, model) in models.into_iter().enumerate() {
          if i % 10 == 0 {
            println!("正在处理第 {i} 条");
          }
          if model.some_field.is_empty() {
            let related = find_by_id_ok_some_table(
              model.some_table_id,
              options,
            ).await?;
            update_by_id_booking_order(
              model.id,
              BookingOrderInput {
                some_field: Some(related.value),
                ..Default::default()
              },
              options,
            ).await?;
          }
        }
        
        Ok(())
        
      }).await
  }
  
}
```

## 编码约定

- 测试函数返回 `Result<()>`，使用 `?` 传播错误
- 大批量处理加 `println!` 打印进度
- `imports` 按需引入，使用完整路径

## 运行测试

```bash
# 运行指定测试
cargo test test_xxx -- --nocapture
```
