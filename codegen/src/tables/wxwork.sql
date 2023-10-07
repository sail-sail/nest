------------------------------------------------------------------------ 企微应用
drop table if exists `wxwork_wxw_app`;
CREATE TABLE if not exists `wxwork_wxw_app` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '名称',
  `corpid` varchar(18) NOT NULL DEFAULT '' COMMENT '企业ID',
  `agentid` varchar(7) NOT NULL DEFAULT '' COMMENT '应用ID',
  `corpsecret` varchar(120) NOT NULL DEFAULT '' COMMENT '应用密钥',
  `contactsecret` varchar(120) NOT NULL DEFAULT '' COMMENT '通讯录密钥',
  `is_locked` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
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
  INDEX (`lbl`),
  INDEX (`corpid`, `agentid`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='企微应用';

------------------------------------------------------------------------ 企微应用接口凭据
drop table if exists `wxwork_wxw_app_token`;
CREATE TABLE `wxwork_wxw_app_token` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `wxw_app_id` varchar(22) NOT NULL DEFAULT '' COMMENT '企微应用',
  `type` varchar(10) NOT NULL DEFAULT 'corp' COMMENT '类型corp和contact',
  `access_token` varchar(600) NOT NULL DEFAULT '' COMMENT '令牌',
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='企微应用接口凭据';

------------------------------------------------------------------------ 企微用户
drop table if exists `wxwork_wxw_usr`;
CREATE TABLE `wxwork_wxw_usr` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
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
  INDEX (`userid`),
  INDEX (`lbl`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='企微用户';

------------------------------------------------------------------------ 企微消息
drop table if exists `wxwork_wxw_msg`;
CREATE TABLE `wxwork_wxw_msg` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `wxw_app_id` varchar(22) NOT NULL DEFAULT '' COMMENT '企微应用',
  `errcode` varchar(5) NOT NULL DEFAULT '' COMMENT '发送状态,dict:wxw_msg_errcode',
  `touser` varchar(256) NOT NULL DEFAULT '' COMMENT '成员ID',
  `title` varchar(64) NOT NULL DEFAULT '' COMMENT '标题',
  `description` varchar(256) NOT NULL DEFAULT '' COMMENT '描述',
  `url` varchar(1024) NOT NULL DEFAULT '' COMMENT '链接',
  `btntxt` varchar(4) NOT NULL DEFAULT '' COMMENT '按钮文字',
  `errmsg` varchar(256) NOT NULL DEFAULT '' COMMENT '错误信息',
  `msgid` varchar(255) NOT NULL DEFAULT '' COMMENT '消息ID',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='企微消息';
