------------------------------------------------------------------------ 小程序设置
drop table if exists `wx_wx_app`;
CREATE TABLE `wx_wx_app` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `code` varchar(15) NOT NULL DEFAULT '' COMMENT '原始ID',
  `lbl` varchar(22) NOT NULL DEFAULT '' COMMENT '名称',
  `appid` varchar(22) NOT NULL DEFAULT '' COMMENT '开发者ID',
  `appsecret` varchar(200) NOT NULL DEFAULT '' COMMENT '开发者密码',
  `is_locked` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
  `is_enabled` tinyint(1) unsigned NOT NULL DEFAULT 1 COMMENT '启用,dict:is_enabled',
  `order_by` int(11) unsigned NOT NULL DEFAULT 1 COMMENT '排序',
  `rem` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`code`, `tenant_id`, `is_deleted`),
  INDEX (`lbl`, `tenant_id`, `is_deleted`),
  INDEX (`appid`, `tenant_id`, `is_deleted`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='小程序设置';

------------------------------------------------------------------------ 小程序接口凭据
drop table if exists `wx_wx_app_token`;
CREATE TABLE `wx_wx_app_token` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `wx_app_id` varchar(22) NOT NULL DEFAULT '' COMMENT '小程序设置',
  `access_token` varchar(600) NOT NULL DEFAULT '' COMMENT '令牌',
  `token_time` datetime DEFAULT NULL COMMENT '令牌创建时间',
  `expires_in` int unsigned NOT NULL DEFAULT 0 COMMENT '令牌超时时间',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`wx_app_id`, `is_deleted`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='小程序接口凭据';

------------------------------------------------------------------ 小程序用户
drop table if exists `wx_wx_usr`;
CREATE TABLE if not exists `wx_wx_usr` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lbl` varchar(100) NOT NULL DEFAULT '' COMMENT '名称',
  `usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '用户',
  `nick_name` varchar(100) NOT NULL DEFAULT '' COMMENT '昵称',
  `avatar_url` varchar(500) NOT NULL DEFAULT '' COMMENT '头像',
  `mobile` varchar(30) NOT NULL DEFAULT '' COMMENT '手机',
  `openid` varchar(100) NOT NULL DEFAULT '' COMMENT '小程序用户唯一标识',
  `unionid` varchar(100) NOT NULL DEFAULT '' COMMENT '小程序用户统一标识',
  `gender` int(11) NOT NULL DEFAULT 0 COMMENT '性别,dict:wx_usr_gender',
  `city` varchar(100) NOT NULL DEFAULT '' COMMENT '城市',
  `province` varchar(100) NOT NULL DEFAULT '' COMMENT '省份',
  `country` varchar(100) NOT NULL DEFAULT '' COMMENT '国家',
  `language` varchar(100) NOT NULL DEFAULT '' COMMENT '语言',
  `rem` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  `org_id` varchar(22) NOT NULL DEFAULT '' COMMENT '组织',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`openid`, `org_id`, `tenant_id`, `is_deleted`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='小程序用户';

------------------------------------------------------------------------ 公众号设置
drop table if exists `wx_wxo_app`;
CREATE TABLE `wx_wxo_app` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `code` varchar(15) NOT NULL DEFAULT '' COMMENT '原始ID',
  `lbl` varchar(22) NOT NULL DEFAULT '' COMMENT '名称',
  `appid` varchar(22) NOT NULL DEFAULT '' COMMENT '开发者ID',
  `appsecret` varchar(200) NOT NULL DEFAULT '' COMMENT '开发者密码',
  `token` varchar(200) NOT NULL DEFAULT '' COMMENT '令牌',
  `encoding_aes_key` varchar(200) NOT NULL DEFAULT '' COMMENT '消息加解密密钥',
  `encoding_type` varchar(20) NOT NULL DEFAULT '' COMMENT '消息加解密方式,dict:wxo_app_encoding_type',
  `domain_id` varchar(22) NOT NULL DEFAULT '' COMMENT '网页授权域名',
  `is_locked` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
  `is_enabled` tinyint(1) unsigned NOT NULL DEFAULT 1 COMMENT '启用,dict:is_enabled',
  `order_by` int(11) unsigned NOT NULL DEFAULT 1 COMMENT '排序',
  `rem` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`code`, `tenant_id`, `is_deleted`),
  INDEX (`lbl`, `tenant_id`, `is_deleted`),
  INDEX (`appid`, `tenant_id`, `is_deleted`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='公众号设置';

------------------------------------------------------------------ 公众号用户
drop table if exists `wx_wxo_usr`;
CREATE TABLE if not exists `wx_wxo_usr` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lbl` varchar(100) NOT NULL DEFAULT '' COMMENT '名称',
  `usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '用户',
  `openid` varchar(100) NOT NULL DEFAULT '' COMMENT '公众号用户唯一标识',
  `unionid` varchar(100) NOT NULL DEFAULT '' COMMENT '公众号用户统一标识',
  `rem` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  `org_id` varchar(22) NOT NULL DEFAULT '' COMMENT '组织',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`usr_id`, `org_id`, `tenant_id`, `is_deleted`),
  INDEX (`openid`, `org_id`, `tenant_id`, `is_deleted`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='公众号用户';

------------------------------------------------------------------------ 公众号接口凭据
drop table if exists `wx_wxo_app_token`;
CREATE TABLE `wx_wxo_app_token` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `wxo_app_id` varchar(22) NOT NULL DEFAULT '' COMMENT '小程序设置',
  `access_token` varchar(600) NOT NULL DEFAULT '' COMMENT '令牌',
  `token_time` datetime DEFAULT NULL COMMENT '令牌创建时间',
  `expires_in` int unsigned NOT NULL DEFAULT 0 COMMENT '令牌超时时间',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`wxo_app_id`, `is_deleted`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='小程序接口凭据';

------------------------------------------------------------------------ 微信支付设置
drop table if exists `wx_wx_pay`;
CREATE TABLE `wx_wx_pay` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lbl` varchar(22) NOT NULL DEFAULT '' COMMENT '名称',
  `appid` varchar(22) NOT NULL DEFAULT '' COMMENT '开发者ID',
  `mchid` varchar(32) NOT NULL DEFAULT '' COMMENT '商户号',
  `public_key` varchar(22) NOT NULL DEFAULT '' COMMENT '公钥',
  `private_key` varchar(22) NOT NULL DEFAULT '' COMMENT '私钥',
  `v3_key` varchar(32) NOT NULL DEFAULT '' COMMENT 'APIv3密钥',
  `payer_client_ip` varchar(45) NOT NULL DEFAULT '' COMMENT '支付终端IP',
  `notify_url` varchar(256) NOT NULL DEFAULT '' COMMENT '通知地址',
  `is_locked` tinyint(1) unsigned NOT NULL DEFAULT 1 COMMENT '锁定,dict:is_locked',
  `is_enabled` tinyint(1) unsigned NOT NULL DEFAULT 1 COMMENT '启用,dict:is_enabled',
  `order_by` int(11) unsigned NOT NULL DEFAULT 1 COMMENT '排序',
  `rem` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`appid`, `tenant_id`),
  INDEX (`notify_url`, `tenant_id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='微信支付设置';

------------------------------------------------------------------------ 微信JSAPI下单
drop table if exists `wx_pay_transactions_jsapi`;
CREATE TABLE if not exists `wx_pay_transactions_jsapi` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `appid` varchar(32) NOT NULL DEFAULT '' COMMENT '开发者ID',
  `mchid` varchar(32) NOT NULL DEFAULT '' COMMENT '商户号',
  `description` varchar(127) NOT NULL DEFAULT '' COMMENT '商品描述',
  `out_trade_no` varchar(32) NOT NULL DEFAULT '' COMMENT '商户订单号',
  `transaction_id` varchar(32) NOT NULL DEFAULT '' COMMENT '微信支付订单号',
  `trade_state` varchar(32) NOT NULL DEFAULT 'NOTPAY' COMMENT '交易状态,dict:wx_pay_notice_trade_state',
  `trade_state_desc` varchar(256) NOT NULL DEFAULT '未支付' COMMENT '交易状态描述',
  `success_time` datetime DEFAULT NULL COMMENT '支付完成时间',
  `time_expire` varchar(64) NOT NULL DEFAULT '' COMMENT '交易限制时间',
  `attach` varchar(128) NOT NULL DEFAULT '' COMMENT '附加数据',
  `attach2` varchar(256) NOT NULL DEFAULT '' COMMENT '附加数据2',
  `notify_url` varchar(256) NOT NULL DEFAULT '' COMMENT '通知地址',
  `support_fapiao` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '是否支持发票,dict:is_enabled',
  `total_fee` int(11) NOT NULL DEFAULT 0 COMMENT '订单金额(分)',
  `currency` varchar(16) NOT NULL DEFAULT '' COMMENT '货币类型,dict:wx_pay_notice_currency',
  `openid` varchar(128) NOT NULL DEFAULT '' COMMENT '用户标识',
  `prepay_id` varchar(64) NOT NULL DEFAULT '' COMMENT '预支付交易会话标识',
  `org_id` varchar(22) NOT NULL DEFAULT '' COMMENT '组织',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '删除人',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`prepay_id`),
  INDEX (`org_id`, `tenant_id`, `is_deleted`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='微信JSAPI下单';

------------------------------------------------------------------------ 微信支付通知
drop table if exists `wx_wx_pay_notice`;
CREATE TABLE if not exists `wx_wx_pay_notice` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `appid` varchar(32) NOT NULL DEFAULT '' COMMENT '开发者ID',
  `mchid` varchar(32) NOT NULL DEFAULT '' COMMENT '商户号',
  `openid` varchar(128) NOT NULL DEFAULT '' COMMENT '用户标识',
  `out_trade_no` varchar(32) NOT NULL DEFAULT '' COMMENT '商户订单号',
  `transaction_id` varchar(32) NOT NULL DEFAULT '' COMMENT '微信支付订单号',
  `trade_type` varchar(16) NOT NULL DEFAULT '' COMMENT '交易类型,dict:wx_unified_order_trade_type',
  `trade_state` varchar(32) NOT NULL DEFAULT 'NOTPAY' COMMENT '交易状态,dict:wx_pay_notice_trade_state',
  `trade_state_desc` varchar(256) NOT NULL DEFAULT '未支付' COMMENT '交易状态描述',
  `bank_type` varchar(32) NOT NULL DEFAULT '' COMMENT '付款银行',
  `attach` varchar(128) NOT NULL DEFAULT '' COMMENT '附加数据',
  `success_time` datetime DEFAULT NULL COMMENT '支付完成时间',
  `total` int unsigned NOT NULL DEFAULT 0 COMMENT '总金额',
  `payer_total` int unsigned NOT NULL DEFAULT 0 COMMENT '用户支付金额',
  `currency` varchar(16) NOT NULL DEFAULT 'CNY' COMMENT '货币类型,dict:wx_pay_notice_currency',
  `payer_currency` varchar(16) NOT NULL DEFAULT 'CNY' COMMENT '用户支付币种,dict:wx_pay_notice_currency',
  `device_id` varchar(32) NOT NULL DEFAULT '' COMMENT '商户端设备号',
  `rem` varchar(50) NOT NULL DEFAULT '' COMMENT '备注',
  `raw` text COMMENT '原始数据',
  `org_id` varchar(22) NOT NULL DEFAULT '' COMMENT '组织',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`transaction_id`),
  INDEX (`org_id`, `tenant_id`, `is_deleted`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='微信支付通知';