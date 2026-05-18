# Deno - GraphQL API 后端

## 目录约定

- `gen/` - 自动生成（尽量少改, 但不会被覆盖, 原理是生成代码覆盖到 `gen/__out__` 目录, 然后再 `git diff` `git patch` 到工程目录）
- `src/` - 手写业务逻辑