------------------------------------------------------------------------ 企业微信应用
drop table if exists `wxwork_wxw_app`;
CREATE TABLE if not exists `wxwork_wxw_app` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '名称',
  `corpid` varchar(18) NOT NULL DEFAULT '' COMMENT '企业ID',
  `agentid` varchar(7) NOT NULL DEFAULT '' COMMENT '应用ID',
  `corpsecret` varchar(100) NOT NULL DEFAULT '' COMMENT '应用密钥',
  `is_locked` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
  `is_enabled` tinyint(1) unsigned NOT NULL DEFAULT 1 COMMENT '启用,dict:is_enabled',
  `order_by` int(11) unsigned NOT NULL DEFAULT 1 COMMENT '排序',
  `rem` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  `org_id` varchar(22) NOT NULL DEFAULT '' COMMENT '组织',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`lbl`),
  INDEX (`corpid`, `agentid`),
  INDEX (`corpsecret`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='企业微信应用';

------------------------------------------------------------------------ 企业微信应用接口凭据
drop table if exists `wxwork_wxw_app_token`;
CREATE TABLE `wxwork_wxw_app_token` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `wxw_app_id` varchar(22) NOT NULL DEFAULT '' COMMENT '企业微信应用',
  `access_token` varchar(512) NOT NULL DEFAULT '' COMMENT '令牌',
  `token_time` datetime DEFAULT NULL COMMENT '令牌创建时间',
  `expires_in` int unsigned NOT NULL DEFAULT 0 COMMENT '令牌超时时间',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`wxw_app_id`),
  INDEX (`access_token`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='企业微信应用接口凭据';

------------------------------------------------------------------------ 企业微信用户
drop table if exists `wxwork_wxw_usr`;
CREATE TABLE `wxwork_wxw_usr` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `wxw_app_id` varchar(22) NOT NULL DEFAULT '' COMMENT '企业微信应用',
  `lbl` varchar(44) NOT NULL DEFAULT '' COMMENT '姓名',
  `userid` varchar(64) NOT NULL DEFAULT '' COMMENT '用户ID',
  `mobile` varchar(11) NOT NULL DEFAULT '' COMMENT '手机号',
  `gender` varchar(1) NOT NULL DEFAULT '' COMMENT '性别',
  `email` varchar(64) NOT NULL DEFAULT '' COMMENT '邮箱',
  `biz_email` varchar(64) NOT NULL DEFAULT '' COMMENT '企业邮箱',
  `direct_leader` varchar(64) NOT NULL DEFAULT '' COMMENT '直属上级',
  `position` varchar(44) NOT NULL DEFAULT '' COMMENT '职位',
  `avatar` varchar(512) NOT NULL DEFAULT '' COMMENT '头像',
  `thumb_avatar` varchar(512) NOT NULL DEFAULT '' COMMENT '头像缩略图',
  `qr_code` varchar(512) NOT NULL DEFAULT '' COMMENT '个人二维码',
  `rem` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`wxw_app_id`,`userid`),
  INDEX (`wxw_app_id`,`lbl`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='企业微信用户';
