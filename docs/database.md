### MySQL 数据库规范
+ 当用数据库足够大时(超过5千万行)之后, 可以考虑迁移至完全兼容mysql数据库 `新型分布式关系型数据库 TiDB`
```
TiDB 是一款同时支持在`线事务处理`与`在线分析处理`的融合型分布式数据库:
具备水平扩容或者缩容、
金融级高可用、
实时 HTAP、
云原生的分布式数据库、
兼容 MySQL 5.7 协议和 MySQL 生态等重要特性。

(简单的说就是融合 `行数据存储` 跟 `列数据存储`,
在传统Mysql能力的基础上, 增加瞬间查询统计各类 `数据统计报表` 的能力)

TiDB 适合高可用、强一致要求较高、数据规模较大等各种应用场景。
```

+ 数据库采用 innodb 存储引擎, utf8mb4 编码

+ 表名称, 字段名称, 字段类型均为小写英文字母

+ 主键固定采用 22 位区分大小写的 uuid

+ 外键命名规范: 尽量采用: 字段名称_id, 若无法采用则采用: 名称_id

+ varchar int 字段不能为空, 必须设置默认值, 逻辑字段 is_名称, 类型为 int(1) 且必须有默认值

+ 所有表固定的字段:
```sql
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` int(1) NOT NULL DEFAULT '0' COMMENT '删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
```

+ 原则上, 只要遇到有 `is_deleted` 字段, 代表这个表是逻辑删除的, 否则是物理删除的, 物理删除的表自然也就没有数据回收站的概念

+ 如果表需要排序则固定为:
```sql
  `order_by` int NOT NULL DEFAULT '0' COMMENT '排序',
```

+ 如果表需要备注则固定为:
```sql
  `rem` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
```

+ 如果表需要是否启用字段:
```sql
  `is_enabled` int(1) NOT NULL DEFAULT '1' COMMENT '启用[ { value: 1, label: "是" }, { value: 0, label: "否" } ]',
```

其中: [ { value: 1, label: "是" }, { value: 0, label: "否" } ] 给生成代码工具使用, 为增加修改时的下拉选项, 列表页面的翻译

+ 在根目录或 `nest` 目录下执行 `npm run uuid` 可随机生成生成一个 `主键uuid`

+ 在代码中生成主键 uuid:
```typescript
import { shortUuidV4 } from "../common/util/uuid";
const id = shortUuidV4();
```

+ 创建数据库:
```sql
-- 创建数据库
CREATE DATABASE IF NOT EXISTS [数据库] CHARSET utf8mb4;
-- 修改密码策略
set global validate_password_policy=0;
-- 创建用户
create user '[用户名]'@'%' identified by '[密码]';
-- 设置用户密码不过期
ALTER USER '[用户名]'@'%' IDENTIFIED BY '[密码]' PASSWORD EXPIRE NEVER;
-- 修改密码策略
ALTER USER '[用户名]'@'%' IDENTIFIED WITH mysql_native_password BY '[密码]';
-- 给用户授权
grant drop,index,select,insert,update,delete,execute,alter,create,references,lock tables on [数据库].* to '[用户名]'@'%';
-- 刷新权限
flush privileges;
```

+ 导出数据库
```powershell
mysqldump --defaults-file="/etc/my.cnf" --user=[用户名] -p --host=[IP地址] --protocol=tcp --port=[端口] --default-character-set=utf8 --skip-triggers "[数据库]" > [数据库].sql
```
