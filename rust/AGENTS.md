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

## 可用 Skills

- `excel-export` - Excel 导出功能开发. 移动端导出 Excel 时使用
- `graphql-api` - Rust GraphQL 接口开发. 创建自定义 API 时使用
