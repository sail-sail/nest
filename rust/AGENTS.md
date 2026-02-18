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

## 编码约定
- GraphQL 接口定义放在 `{table}_graphql.rs`，参数解构/日志放在 `{table}_resolver.rs`，类型定义放在 `{table}_model.rs`，数据库操作放在 `{table}_dao.rs`，业务逻辑/数据库放在 `{table}_service.rs`
- 业务逻辑的字符串类型使用 `SmolStr`，第三方类库如果需要求 `String` 则转换类型给三方库
- 函数调用和定义时，参数每行一个参数，尽可能换行
- 调用create或者update传入Input时，Input参数中的_lbl字段大多不用传递，dao层会自动生成_lbl的值

## 可用 Skills

- `excel-export` - Excel 导出功能开发. 移动端导出 Excel 时使用
- `graphql-api` - Rust GraphQL 接口开发. 创建自定义 API 时使用
- `wx-pay` - 微信支付流程开发. 需要实现支付功能时使用
