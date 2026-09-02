-- 时序数据库
drop table if exists `tsdb_tsdb_app`;
CREATE TABLE if not exists `tsdb_tsdb_app` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lbl` varchar(45) NOT NULL default '' COMMENT '名称',
  `type` ENUM('influxdb3') NOT NULL default 'influxdb3' COMMENT '类型,dict:tsdb_tsdb_app_type',
  `protocol` ENUM('https', 'http') NOT NULL default 'https' COMMENT '协议,dict:tsdb_tsdb_app_protocol',
  `hostname` varchar(255) NOT NULL default '' COMMENT '主机名',
  `port` int NOT NULL default 8182 COMMENT '端口',
  `database` varchar(100) NOT NULL default '' COMMENT '数据库',
  `token` varchar(255) NOT NULL default '' COMMENT '令牌',
  `is_enabled` tinyint unsigned NOT NULL DEFAULT 1 COMMENT '启用,dict:is_enabled',
  `order_by` int unsigned NOT NULL DEFAULT 1 COMMENT '排序',
  `rem` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
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
  INDEX (`tenant_id`, `is_deleted`, `lbl`),
  INDEX (`tenant_id`, `is_deleted`, `database`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='时序数据库';