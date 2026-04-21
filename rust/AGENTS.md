# Rust - GraphQL API 后端

## 目录约定

| 目录 | 说明 |
|------|------|
| `generated/common/` | 基础设施 |
| `generated/{mod}/{table}/` | codegen 生成的基础 CRUD 层, 不是默认编辑入口 |
| `app/{mod}/{table}/` | 手写业务代码, 默认从这里新增和扩展后端能力 |

## cargo check 时若有别的 cargo/rustc 在编译, 那就硬等