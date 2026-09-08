# GraphQL API 后端

## 核心约束

1. 手写业务逻辑优先放在 `app/`
2. `generated/` 为生成代码，可以修改, 不会被生成代码覆盖
3. `generated::common::context::Options`是`Copy`类型,不需要`.clone()`
4. 不允许执行 `cargo fmt` 命令!
5. 尽量减少编译次数