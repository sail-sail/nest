# Nest Rust - GraphQL API 后端

Rust + async-graphql + sqlx 后端服务

## 目录约定

| 目录 | 说明 |
|------|------|
| `generated/{mod}/{table}/` | 生成代码(可改但尽量不改)|
| `app/{mod}/` | 手写业务代码 |

## 三层架构

```
app/{mod}/{table}/
├── {table}_graphql.rs   # GraphQL 接口定义
├── {table}_resolver.rs  # 参数解构/日志
├── {table}_model.rs     # 类型定义
├── {table}_dao.rs       # 数据库操作
└── {table}_service.rs   # 业务逻辑/数据库
```

- `generated` 也是三层架构, 代码由 `codegen` 生成, 尽量不修改除非业务需求无法通过`app`新接口实现
- 若违背`generated`->`app`的单向依赖关系, 那就不得不修改`generated`的代码了, 但尽量是独立的文件以减少git冲突, 比如 `{table}_service2.rs`

## 可用 Skills (.agents/skills/)

- `excel-export` - Excel 导出功能开发. 移动端导出 Excel 时使用
- `graphql-api` - Rust GraphQL 接口开发. 创建自定义 API 时使用
- `rust-test` - Rust 测试用例编写规范. 编写单元测试或数据刷新脚本时使用
- `wx-pay` - 微信支付流程开发. 需要实现支付功能时使用
