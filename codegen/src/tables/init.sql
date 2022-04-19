------------------------------------------------------------------------------------------------ 租户
CREATE TABLE if not exists `tenant` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '名称',
  `host` varchar(255) NOT NULL DEFAULT '' COMMENT '域名绑定',
  `expiration` date DEFAULT NULL COMMENT '到期日',
  `max_usr_num` int NOT NULL DEFAULT '0' COMMENT '最大用户数',
  `is_enabled` int(1) NOT NULL DEFAULT '1' COMMENT '启用[ { value: 1, label: "是" }, { value: 0, label: "否" } ]',
  `order_by` int NOT NULL DEFAULT '0' COMMENT '排序',
  `rem` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` int(1) NOT NULL DEFAULT '0' COMMENT '删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`order_by`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='租户';

------------------------------------------------------------------------------------------------ 租户菜单
CREATE TABLE if not exists `tenant_menu` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `tenant_id` varchar(22) NOT NULL COMMENT '租户',
  `menu_id` varchar(22) NOT NULL COMMENT '菜单',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` int(1) NOT NULL DEFAULT '0' COMMENT '删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`tenant_id`, `menu_id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='租户菜单';

------------------------------------------------------------------------------------------------ 用户
CREATE TABLE if not exists `usr` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '名称',
  `username` varchar(45) NOT NULL DEFAULT '' COMMENT '用户名',
  `password` varchar(43) NOT NULL DEFAULT '' COMMENT '密码',
  `is_enabled` int(1) NOT NULL DEFAULT '1' COMMENT '启用[ { value: 1, label: "是" }, { value: 0, label: "否" } ]',
  `rem` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` int(1) NOT NULL DEFAULT '0' COMMENT '删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`username`, `password`, `tenant_id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='用户';

------------------------------------------------------------------------------------------------ 角色
CREATE TABLE if not exists `role` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '名称',
  `rem` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `is_enabled` int(1) NOT NULL DEFAULT '1' COMMENT '启用[ { value: 1, label: "是" }, { value: 0, label: "否" } ]',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` int(1) NOT NULL DEFAULT '0' COMMENT '删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='角色';

------------------------------------------------------------------------------------------------ 用户角色
CREATE TABLE if not exists `usr_role` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '用户',
  `role_id` varchar(22) NOT NULL DEFAULT '' COMMENT '角色',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` int(1) NOT NULL DEFAULT '0' COMMENT '删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`usr_id`, `role_id`, `tenant_id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='用户角色';

------------------------------------------------------------------------------------------------ 菜单
CREATE TABLE if not exists `menu` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `type` varchar(10) NOT NULL DEFAULT 'pc' COMMENT '类型[ { value: "pc", label: "电脑端" }, { value: "mobile", label: "手机端" } ]',
  `menu_id` varchar(22) NOT NULL DEFAULT '' COMMENT '父菜单',
  `lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '名称',
  `route_path` varchar(255) NOT NULL DEFAULT '' COMMENT '路由',
  `route_query` json COMMENT '参数',
  `is_enabled` int(1) NOT NULL DEFAULT '1' COMMENT '启用[ { value: 1, label: "是" }, { value: 0, label: "否" } ]',
  `order_by` int NOT NULL DEFAULT '0' COMMENT '排序',
  `rem` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` int(1) NOT NULL DEFAULT '0' COMMENT '删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='菜单';

------------------------------------------------------------------------------------------------ 权限
CREATE TABLE if not exists `permit` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `menu_id` varchar(22) NOT NULL DEFAULT '' COMMENT '菜单',
  `lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '名称',
  `rem` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` int(1) NOT NULL DEFAULT '0' COMMENT '删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`menu_id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='权限';

------------------------------------------------------------------------------------------------ 角色菜单
CREATE TABLE if not exists `role_menu` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `role_id` varchar(22) NOT NULL DEFAULT '' COMMENT '角色',
  `menu_id` varchar(22) NOT NULL DEFAULT '' COMMENT '菜单',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` int(1) NOT NULL DEFAULT '0' COMMENT '删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`role_id`, `menu_id`, `tenant_id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='角色菜单';

------------------------------------------------------------------------------------------------ 后台任务
CREATE TABLE if not exists `background_task` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '名称',
  `state` varchar(10) NOT NULL DEFAULT '' COMMENT '状态[{value: "running", label: "运行中"},{value: "success", label: "成功"},{value: "fail", label: "失败"},{value: "cancel", label: "取消"}]',
  `type` varchar(10) NOT NULL DEFAULT '' COMMENT '类型[{value: "text", label: "文本"},{value: "download", label: "下载"},{value: "inline", label: "查看"},{value: "tag", label: "标签"}]',
  `result` varchar(500) NOT NULL DEFAULT '' COMMENT '执行结果',
  `err_msg` varchar(255) NOT NULL DEFAULT '' COMMENT '错误信息',
  `begin_time` datetime DEFAULT NULL COMMENT '开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '结束时间',
  `rem` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` int(1) NOT NULL DEFAULT '0' COMMENT '删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`begin_time`, `tenant_id`),
  INDEX (`end_time`, `tenant_id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='后台任务';

