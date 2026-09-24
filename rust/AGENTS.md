# GraphQL API 后端

## 核心约束

1. 手写业务逻辑优先放在 `app/`
2. `generated/` 为生成代码，可以修改, 不会被生成代码覆盖
3. `generated::common::context::Options`和所有id类型(比如:`UsrId`,`TenantId`) 都是`Copy`类型,不需要`.clone()`
4. 不允许执行 `cargo fmt` 命令!
5. 保留代码空白行的前置空格缩进
6. 尽量减少编译次数, 不写单元测试
7. `cargo check`要等30分钟不完成才认定卡主
8. 后端接口有改动可执行 `npm run gqlgen` 来生成前端接口类型