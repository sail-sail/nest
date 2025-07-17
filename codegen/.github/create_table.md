# 数据库建表规范

1. 在 `codegen/tables/base/base.sql` 文件中, 用户表实例: `base_usr` `base_dept` `base_usr_dept`:
```sql
------------------------------------------------------------------------ 用户
drop table if exists `base_usr`;
CREATE TABLE if not exists `base_usr` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `img` varchar(22) NOT NULL DEFAULT '' COMMENT '头像',
  `lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '名称',
  `username` varchar(45) NOT NULL DEFAULT '' COMMENT '用户名',
  `password` varchar(43) NOT NULL DEFAULT '' COMMENT '密码',
  `default_org_id` varchar(22) NOT NULL DEFAULT '' COMMENT '默认组织',
  `is_locked` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
  `is_enabled` tinyint unsigned NOT NULL DEFAULT 1 COMMENT '启用,dict:is_enabled',
  `order_by` int unsigned NOT NULL DEFAULT 1 COMMENT '排序',
  `rem` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  `is_hidden` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '隐藏记录',
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
  INDEX (`lbl`, `tenant_id`, `is_deleted`),
  INDEX (`username`, `tenant_id`, `is_deleted`),
  INDEX (`username`, `password`, `tenant_id`, `is_deleted`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='用户';

------------------------------------------------------------------------ 部门
drop table if exists `base_dept`;
CREATE TABLE if not exists `base_dept` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `parent_id` varchar(22) NOT NULL DEFAULT '' COMMENT '父部门',
  `lbl` varchar(22) NOT NULL DEFAULT '' COMMENT '名称',
  `is_locked` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
  `is_enabled` tinyint unsigned NOT NULL DEFAULT 1 COMMENT '启用,dict:is_enabled',
  `order_by` int unsigned NOT NULL DEFAULT 1 COMMENT '排序',
  `rem` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  `org_id` varchar(22) NOT NULL DEFAULT '' COMMENT '组织',
  `org_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '组织',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '操作人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '删除人',
  `delete_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '删除人',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`parent_id`, `lbl`, `org_id`, `tenant_id`, `is_deleted`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='部门';

------------------------------------------------------------------------ 用户部门
drop table if exists `base_usr_dept`;
CREATE TABLE if not exists `base_usr_dept` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '用户',
  `dept_id` varchar(22) NOT NULL DEFAULT '' COMMENT '部门',
  `order_by` int unsigned NOT NULL DEFAULT 1 COMMENT '排序',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`usr_id`, `dept_id`, `tenant_id`, `is_deleted`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='用户部门';
```

2. 其中表名 `base_usr` 规范为 `[模块名]_[表名]`, `表名` 为小写, 用 `_` 分隔

3. 主键名称固定为 `id`, 类型为 `varchar(22)`, 且不为空, 里面存储经过 `base64` 编码的 `uuid`, 例如:

    ```sql
    `id` varchar(22) NOT NULL COMMENT 'ID',
    ```

4. 外键名称固定为 `[表名]_id`, 类型为 `varchar(22)`, 且不为空, 例如:

    ```sql
    `usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '用户',
    ```

    如果外键命名方式不是 `[表名]_id`, 则需要在配置文件 `codegen/src/tables/[模块名]/[模块名].ts` 中对应的列配置外键相关的配置 `foreignKey`

5. 字段名如果是 `img` 或者 `_img` 结尾的字段, 则该字段会被认为是图片字段, 会被自动处理为图片上传字段, 里面存储的是逗号分隔的图片 `uuid`, 这个 `uuid` 对应的附件存储在 `minio` 中的图片, 例如:
  
    ```sql
    `img` varchar(22) NOT NULL DEFAULT '' COMMENT '头像',
    ```
    
    - 如果字段名不是 `img` 也不是 `_img` 结尾, 但是需要被处理为图片上传字段, 则需要在配置文件 `codegen/src/tables/[模块名]/[模块名].ts` 中对应的列配置图片上传相关的配置 `isImg`
    
    - 如果字段的长度是 `varchar(22)`, 则只能存储 `1` 张图片, 如果是 `varchar(46)`, 则可以存储 `2` 张图片, 以此类推, 存储图片的最大数量是 `varchar` 的长度是 `23` 的倍数

6. `锁定` 功能的字段名固定为 `is_locked`, 如果一张表需要 `锁定` 功能, 则需要在表中添加 `is_locked` 字段, 例如:
    
    ```sql
    `is_locked` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
    ```
7. 同理, 这些字段名也是固定的:

    ```sql
    `is_enabled` tinyint unsigned NOT NULL DEFAULT 1 COMMENT '启用,dict:is_enabled',
    `order_by` int unsigned NOT NULL DEFAULT 1 COMMENT '排序',
    `rem` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
    `is_hidden` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '隐藏记录',
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
    ```
    
    - `is_enabled` 字段用于标记记录是否启用, 0: 禁用, 1: 启用
    - `order_by` 字段用于排序
    - `rem` 字段用于备注
    - `is_hidden` 字段用于标记记录是否隐藏, 0: 显示, 1: 隐藏, 在前端列表中不显示的记录
    - `tenant_id` 字段用于标记这张表是否需要进行租户隔离
    - `org_id` 字段用于标记这张表是否需要进行组织隔离
    - `create_usr_id` 字段用于标记创建人
    - `create_usr_id_lbl` 字段用于标记创建人名称, 冗余字段
    - `create_time` 字段用于标记创建时间
    - `update_usr_id` 字段用于标记更新人
    - `update_usr_id_lbl` 字段用于标记更新人名称, 冗余字段
    - `update_time` 字段用于标记更新时间
    - `is_deleted` 字段用于标记记录是否删除, 0: 未删除, 1: 已删除
    - `delete_usr_id` 字段用于标记删除人
    - `delete_usr_id_lbl` 字段用于标记删除人名称, 冗余字段
    - `delete_time` 字段用于标记删除时间