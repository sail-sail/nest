# GraphQL API 后端

## 核心约束

1. 手写业务逻辑优先放在 `app/`
2. `generated/` 为生成代码，可以修改, 不会被生成代码覆盖
3. `generated::common::context::Options`和所有id类型(比如:`UsrId`,`TenantId`) 都是`Copy`类型,不需要`.clone()`
4. 不允许执行 `cargo fmt` 命令!
5. 函数尽量写简要注释, `*_graphql.rs` 中的函数注释尽量详细
6. 尽量减少编译次数, 不写单元测试
7. `cargo check`要等30分钟不完成才认定卡主
8. 后端接口有改动可执行 `npm run gqlgen` 来生成前端接口类型
9. 数据库布尔字段统一 `tinyint unsigned`, 模型里是 `u8`(0/1) 而不是 `bool`; 判断写 `== 1`, 赋值/入参用 `Some(1)`, 默认值用 `0`, 前端拿到的也是数字
10. 前端 `pc/graphql.config.js` 用 `rust/generated/common/gql/schema.graphql` 校验 `Api.ts`/`Api2.ts` 里的 GraphQL 字符串, 没跑 `gqlgen` 前会报 `Cannot query field "xxx" on type "Mutation"`; 跑一次 `gqlgen` 即可消除