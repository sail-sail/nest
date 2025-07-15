# 数据库建表规范 (TABLE_RULES)

本文档定义了 Nest 全栈代码生成系统的数据库建表规范，用于指导 Agent 自动建表和代码生成。

## 1. 表命名规范

### 1.1 表名格式
- **格式**：`[模块名]_[表名]`
- **示例**：`base_usr`、`base_dept`、`base_role`
- **说明**：表名必须小写，使用下划线分隔

### 1.2 常见模块名
- `base` - 基础模块（用户、部门、角色等）
- `crm` - 客户关系管理
- `hrm` - 人力资源管理

## 2. 字段命名规范

### 2.1 主键字段
```sql
`id` varchar(22) NOT NULL COMMENT 'ID',
```
- **固定名称**：`id`
- **类型**：`varchar(22)`
- **说明**：存储 base64 编码的 UUID

### 2.2 外键字段
```sql
`usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '用户',
`dept_id` varchar(22) NOT NULL DEFAULT '' COMMENT '部门',
```
- **格式**：`[表名]_id`
- **类型**：`varchar(22)`
- **说明**：关联其他表的主键

### 2.3 多对多关联字段
```sql
`role_ids` varchar(1000) NOT NULL DEFAULT '' COMMENT '角色',
```
- **格式**：`[表名]_ids`
- **类型**：`varchar(长度)`
- **说明**：存储逗号分隔的多个 ID

### 2.4 显示标签字段
```sql
`lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '名称',
`usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '用户',
```
- **主标签**：`lbl` - 表的主要显示字段
- **外键标签**：`[外键字段名]_lbl` - 外键对应的显示名称
- **说明**：如果业务上判断此外键关联不需要冗余 lbl, 则不需要 `[外键字段名]_lbl` 字段, 否则需要

## 3. 系统字段规范

### 3.1 状态控制字段
```sql
`is_enabled` tinyint unsigned NOT NULL DEFAULT 1 COMMENT '启用,dict:is_enabled',
`is_hidden` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '隐藏记录',
```

### 3.2 排序和备注字段
```sql
`order_by` int unsigned NOT NULL DEFAULT 1 COMMENT '排序',
`rem` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
```
`order_by` 不是必须的, 比如 订单表 肯定是根据创建时间倒序排序的, 相当于 `订单` 是 `业务表` 所以不需要 `order_by` 字段去人工排序 

### 3.3 多租户字段
```sql
`tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
`org_id` varchar(22) NOT NULL DEFAULT '' COMMENT '组织',
```

### 3.4 审计字段（必须包含）
```sql
`create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
`create_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '创建人',
`create_time` datetime DEFAULT NULL COMMENT '创建时间',
`update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
`update_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '更新人',
`update_time` datetime DEFAULT NULL COMMENT '更新时间',
```

### 3.5 软删除字段（必须包含）
```sql
`is_deleted` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
`delete_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '删除人',
`delete_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '删除人',
`delete_time` datetime DEFAULT NULL COMMENT '删除时间',
```

## 4. 特殊字段类型

### 4.1 图片字段
```sql
`img` varchar(22) NOT NULL DEFAULT '' COMMENT '头像',
`user_img` varchar(46) NOT NULL DEFAULT '' COMMENT '用户图片',
```
- **命名**：`img` 或 `_img` 结尾
- **长度**：`varchar(22)` 存储 1 张图片，`varchar(46)` 存储 2 张图片
- **规则**：长度必须是 23 的倍数

### 4.2 附件字段
```sql
`att` varchar(22) NOT NULL DEFAULT '' COMMENT '附件',
`doc_att` varchar(92) NOT NULL DEFAULT '' COMMENT '文档附件',
```
- **命名**：`att` 或 `_att` 结尾
- **长度**：同图片字段规则

### 4.3 图标字段
```sql
`icon` varchar(22) NOT NULL DEFAULT '' COMMENT '图标',
`menu_icon` varchar(22) NOT NULL DEFAULT '' COMMENT '菜单图标',
```
- **命名**：`icon` 或 `_icon` 结尾

### 4.4 地址相关字段
```sql
`province_code` varchar(6) NOT NULL DEFAULT '' COMMENT '省份代码',
`province_lbl` varchar(20) NOT NULL DEFAULT '' COMMENT '省份名称',
`city_code` varchar(6) NOT NULL DEFAULT '' COMMENT '城市代码',
`city_lbl` varchar(20) NOT NULL DEFAULT '' COMMENT '城市名称',
`county_code` varchar(6) NOT NULL DEFAULT '' COMMENT '区县代码',
`county_lbl` varchar(20) NOT NULL DEFAULT '' COMMENT '区县名称',
`address` varchar(200) NOT NULL DEFAULT '' COMMENT '详细地址',
```

### 4.5 树形结构字段
```sql
`parent_id` varchar(22) NOT NULL DEFAULT '' COMMENT '父级',
```
- **用途**：实现树形结构
- **说明**：指向同一表的 ID

## 5. 索引规范

### 5.1 主键索引
```sql
PRIMARY KEY (`id`)
```

### 5.2 常用组合索引
```sql
INDEX (`lbl`, `org_id`, `tenant_id`, `is_deleted`),
```
通常业务上有唯一性的才创建 联合索引

### 5.3 索引设计原则
- 包含 `org_id`, `tenant_id` 和 `is_deleted` 进行数据隔离, 如果有 `org_id` 和 `tenant_id` 字段, 则必须包含这两个字段
- 有组合唯一性的业务字段组合才建立索引

## 7. 字段约定

### 7.1 必填字段
- `id` - 主键
- `lbl` - 显示标签
- `create_usr_id` - 创建人
- `create_time` - 创建时间
- `update_usr_id` - 更新人
- `update_time` - 更新时间
- `is_deleted` - 删除标记

### 7.2 可选字段
- `tenant_id` - 多租户时必须
- `org_id` - 多组织时必须
- `is_locked` - 需要锁定功能时
- `is_enabled` - 需要启用/禁用功能时
- `order_by` - 需要排序时
- `rem` - 需要备注时

## 8. 数据类型规范

### 8.1 字符串类型
```sql
varchar(22)   -- ID、外键
varchar(45)   -- 标签、名称
varchar(100)  -- 备注
varchar(200)  -- 长文本
text          -- 大文本
```

### 8.2 数值类型
```sql
tinyint unsigned  -- 布尔值、状态
int unsigned      -- 排序、计数
decimal(10,2)     -- 金额、价格
```

### 8.3 日期类型
```sql
datetime      -- 时间戳
date          -- 日期
time          -- 时间
```

## 9. 字符集和排序规则

```sql
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin
```
- **引擎**：InnoDB
- **字符集**：utf8mb4
- **排序规则**：utf8mb4_bin（区分大小写）

## 10. 建表完整示例

```sql
------------------------------------------------------------------------ 示例
DROP TABLE IF EXISTS `base_example`;
CREATE TABLE IF NOT EXISTS `base_example` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `code_seq` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '编码-序列号',
  `code` varchar(20) NOT NULL DEFAULT '' COMMENT '编码',
  `lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '名称',
  `parent_id` varchar(22) NOT NULL DEFAULT '' COMMENT '父级',
  `is_new` tinyint unsigned NOT NULL DEFAULT 1 COMMENT '新品,dict:yes_no',
  `type` varchar(20) NOT NULL DEFAULT '' COMMENT '类型,dictbiz:example_type',
  `usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '用户',
  `usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '用户',
  `img` varchar(22) NOT NULL DEFAULT '' COMMENT '图片',
  `att` varchar(22) NOT NULL DEFAULT '' COMMENT '附件',
  `is_locked` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
  `is_enabled` tinyint unsigned NOT NULL DEFAULT 1 COMMENT '启用,dict:is_enabled',
  `order_by` int unsigned NOT NULL DEFAULT 1 COMMENT '排序',
  `rem` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  `org_id` varchar(22) NOT NULL DEFAULT '' COMMENT '组织',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '删除人',
  `delete_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '删除人',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`code`, `tenant_id`, `is_deleted`),
  INDEX (`lbl`, `tenant_id`, `is_deleted`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='示例';
```

## 11. 注意事项

1. **字段注释**：必须为每个字段添加中文注释
2. **字典引用**：状态字段需标注字典类型，如 `dict:is_enabled`
3. **默认值**：所有字段必须设置合理的默认值
4. **长度规划**：根据实际业务需求合理设置字段长度
5. **软删除**：系统采用软删除机制，禁止物理删除数据
6. **多租户**：需要数据隔离的表必须包含 `tenant_id` 字段
7. **代码生成**：建表后需要在配置文件中添加相应配置才能生成代码

## 12. 禁止事项

1. **禁止硬删除**：不允许使用 DELETE 语句物理删除数据
2. **禁止手动 CRUD**：必须通过代码生成器生成 CRUD 操作
3. **禁止随意命名**：必须遵循字段命名规范
4. **禁止遗漏审计字段**：必须包含完整的审计字段
5. **禁止跳过配置**：建表后必须配置相应的表配置文件

## 13. 租户隔离, 组织隔离

1. tenant_id 如果表有这个字段代表需要租户隔离
2. org_id 跟 org_id_lbl 如果表有这2个字段代表需要组织隔离

## 14. 自动编码规则

1. 如果表需要自动编码, 一般是 code 字段, 同时
  ```sql
  `code_seq` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '编码-序列号',
  ```
  用于自动编码的序列号, 如果此表, 比如订单表, 没有 lbl 字段, 则是 lbl 字段, code_seq 也改为 lbl_seq

2. 如果自动编码需要日期序列, 则在 code_seq 或者 lbl_seq 前面加上
  ```sql
  `date_seq` date NOT NULL DEFAULT (CURRENT_DATE) COMMENT '日期-序列号',
  ```
  用于存储编码的日期, 每天都是从 1 开始的序列号
  
## 15. 业务字段
  ```sql
  `type` varchar(20) NOT NULL DEFAULT '' COMMENT '类型,dictbiz:example_type',
  ```
  其中: `dictbiz` 代表这是一个业务字段, `dict`代表系统字典, `example_type` 则是业务字典的编码