------------------------------------------------------------------------ 短信应用
drop table if exists `submail_sms_app`;
CREATE TABLE if not exists `submail_sms_app` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lbl` varchar(22) NOT NULL DEFAULT '' COMMENT '名称',
  `appid` varchar(45) NOT NULL DEFAULT '' COMMENT 'appid',
  `appkey` varchar(45) NOT NULL DEFAULT '' COMMENT 'appkey',
  `is_locked` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
  `is_enabled` tinyint unsigned NOT NULL DEFAULT 1 COMMENT '启用,dict:is_enabled',
  `is_paused` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '暂停发送,dict:yes_no',
  `order_by` int unsigned NOT NULL DEFAULT 1 COMMENT '排序',
  `rem` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
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
  INDEX (`lbl`, `tenant_id`, `is_deleted`),
  INDEX (`appid`, `tenant_id`, `is_deleted`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='短信应用';

------------------------------------------------------------------------ 短信发送记录
drop table if exists `submail_sms_send_record`;
CREATE TABLE if not exists `submail_sms_send_record` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `sms_app_id` varchar(22) NOT NULL DEFAULT '' COMMENT '短信应用',
  `sms_app_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '短信应用',
  `to` varchar(20) NOT NULL DEFAULT '' COMMENT '接收人',
  `content` varchar(1000) NOT NULL DEFAULT '' COMMENT '内容',
  `status` varchar(10) NOT NULL DEFAULT 'success' COMMENT '状态,dict:submail_sms_send_record_status',
  `status_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '状态',
  `send_time` datetime DEFAULT NULL COMMENT '发送时间',
  `tag` varchar(45) NOT NULL DEFAULT '' COMMENT '标签',
  `msg` varchar(1000) NOT NULL DEFAULT '' COMMENT '消息',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '操作人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `is_deleted` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '删除人',
  `delete_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '删除人',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='短信发送记录';
