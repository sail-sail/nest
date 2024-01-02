------------------------------------------------------------------------ 任务
drop table if exists `cron_job`;
CREATE TABLE if not exists `cron_job` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `code` varchar(100) NOT NULL DEFAULT '' COMMENT '编码',
  `lbl` varchar(100) NOT NULL DEFAULT '' COMMENT '名称',
  `is_locked` tinyint(1) unsigned NOT NULL DEFAULT 1 COMMENT '锁定,dict:is_locked',
  `is_enabled` tinyint(1) unsigned NOT NULL DEFAULT 1 COMMENT '启用,dict:is_enabled',
  `order_by` int(11) unsigned NOT NULL DEFAULT 1 COMMENT '排序',
  `rem` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  `is_sys` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '系统记录,dict:is_sys',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX(`code`, `tenant_id`, `is_deleted`),
  INDEX(`lbl`, `tenant_id`, `is_deleted`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='任务';

------------------------------------------------------------------------ 定时任务
drop table if exists `cron_cron_job`;
CREATE TABLE if not exists `cron_cron_job` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lbl` varchar(50) NOT NULL DEFAULT '' COMMENT '名称',
  `job_id` varchar(22) NOT NULL DEFAULT '' COMMENT '任务',
  `cron` varchar(50) NOT NULL DEFAULT '' COMMENT 'Cron表达式',
  `timezone` varchar(20) NOT NULL DEFAULT 'Asia/Shanghai' COMMENT '时区,dict:cron_job_timezone',
  `is_locked` tinyint(1) unsigned NOT NULL DEFAULT 1 COMMENT '锁定,dict:is_locked',
  `is_enabled` tinyint(1) unsigned NOT NULL DEFAULT 1 COMMENT '启用,dict:is_enabled',
  `order_by` int(11) unsigned NOT NULL DEFAULT 1 COMMENT '排序',
  `rem` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX(`job_id`, `cron`, `tenant_id`, `is_deleted`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='定时任务';

------------------------------------------------------------------------ 任务执行日志
drop table if exists `cron_cron_job_log`;
CREATE TABLE if not exists `cron_cron_job_log` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `cron_job_id` varchar(22) NOT NULL DEFAULT '' COMMENT '定时任务',
  `exec_state` varchar(10) NOT NULL DEFAULT 'running' COMMENT '执行状态,dict:cron_job_log_exec_state',
  `exec_result` varchar(500) NOT NULL DEFAULT '' COMMENT '执行结果',
  `begin_time` datetime DEFAULT NULL COMMENT '开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '结束时间',
  `rem` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX(`cron_job_id`, `tenant_id`, `is_deleted`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='任务执行日志';
