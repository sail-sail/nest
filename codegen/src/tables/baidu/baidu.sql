------------------------------------------------------------------------ 百度应用
drop table if exists `baidu_baidu_app`;
CREATE TABLE `baidu_baidu_app` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lbl` varchar(40) NOT NULL DEFAULT '' COMMENT '应用名称',
  `appid` varchar(20) NOT NULL DEFAULT '' COMMENT 'AppID',
  `api_key` varchar(40) NOT NULL DEFAULT '' COMMENT 'API Key',
  `secret_key` varchar(40) NOT NULL DEFAULT '' COMMENT 'Secret Key',
  `aes_key` varchar(40) NOT NULL DEFAULT '' COMMENT 'AES Key',
  `is_locked` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
  `is_enabled` tinyint(1) unsigned NOT NULL DEFAULT 1 COMMENT '启用,dict:is_enabled',
  `order_by` int(11) unsigned NOT NULL DEFAULT 1 COMMENT '排序',
  `rem` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '删除人',
  `delete_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '删除人',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`lbl`, `tenant_id`, `is_deleted`),
  INDEX (`appid`, `tenant_id`, `is_deleted`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='百度应用';

------------------------------------------------------------------------ 百度接口凭据
drop table if exists `baidu_baidu_app_token`;
CREATE TABLE `baidu_baidu_app_token` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `baidu_app_id` varchar(22) NOT NULL DEFAULT '' COMMENT '百度应用',
  `access_token` varchar(600) NOT NULL DEFAULT '' COMMENT '令牌',
  `token_time` datetime DEFAULT NULL COMMENT '令牌创建时间',
  `expires_in` int unsigned NOT NULL DEFAULT 0 COMMENT '令牌超时时间',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '删除人',
  `delete_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '删除人',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`baidu_app_id`, `tenant_id`, `is_deleted`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='百度接口凭据';
