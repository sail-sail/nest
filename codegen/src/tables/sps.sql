drop table if exists `sps_parking`;
CREATE TABLE if not exists `sps_parking` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '名称',
  `city` varchar(255) NOT NULL DEFAULT '' COMMENT '城市',
  `addr` varchar(255) NOT NULL DEFAULT '' COMMENT '地址',
  `tags` varchar(255) NOT NULL DEFAULT '' COMMENT '标签',
  `images` varchar(255) NOT NULL DEFAULT '' COMMENT '图片',
  `order_by` int(11) unsigned NOT NULL DEFAULT 1 COMMENT '排序',
  `is_enabled` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '启用,dict:is_enabled',
  `rem` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `is_locked` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dictbiz:is_locked',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='停车场';

drop table if exists `sps_camera`;
CREATE TABLE if not exists `sps_camera` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '名称',
  `parking_id` varchar(22) NOT NULL DEFAULT '' COMMENT '停车场',
  `ip` int(11) NOT NULL DEFAULT 0 COMMENT '设备IP',
  `sn` varchar(255) NOT NULL DEFAULT '' COMMENT '设备SN',
  `online_status` varchar(10) NOT NULL DEFAULT '' COMMENT '在线状态,dictbiz:online_status',
  `order_by` int(11) unsigned NOT NULL DEFAULT 1 COMMENT '排序',
  `is_enabled` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '启用,dict:is_enabled',
  `rem` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `is_locked` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='相机';

drop table if exists `sps_parking_space`;
CREATE TABLE if not exists `sps_parking_space` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '名称',
  `parking_id` varchar(22) NOT NULL DEFAULT '' COMMENT '停车场',
  `camera_id` varchar(22) NOT NULL DEFAULT '' COMMENT '相机',
  `space_position` varchar(10) NOT NULL DEFAULT '' COMMENT '车位位置,dictbiz:space_position',
  `space_car_no` varchar(45) NOT NULL DEFAULT '' COMMENT '车辆车牌',
  `order_by` int(11) unsigned NOT NULL DEFAULT 1 COMMENT '排序',
  `is_enabled` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '启用,dict:is_enabled',
  `rem` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `is_locked` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='停车位';

drop table if exists `sps_parking_lock`;
CREATE TABLE if not exists `sps_parking_lock` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '名称',
  `parking_space_id` varchar(22) NOT NULL DEFAULT '' COMMENT '停车位',
  `lock_status` varchar(10) NOT NULL DEFAULT '' COMMENT '车位地锁状态,dictbiz:lock_status',
  `order_by` int(11) unsigned NOT NULL DEFAULT 1 COMMENT '排序',
  `is_enabled` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '启用,dict:is_enabled',
  `rem` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `is_locked` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='车位地锁';

drop table if exists `sps_lock_record`;
CREATE TABLE if not exists `sps_lock_record` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '名称',
  `parking_lock_id` varchar(22) NOT NULL DEFAULT '' COMMENT '车位地锁',
  `lock_car_no` varchar(45) NOT NULL DEFAULT '' COMMENT '车辆车牌',
  `lock_time` datetime DEFAULT NULL COMMENT '锁定时间',
  `unlock_time` datetime DEFAULT NULL COMMENT '解锁时间',
  `rem` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `is_locked` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='车位地锁记录';


------------------------------------------------------------------------------------------------ 微信账户
drop table if exists `base_wx_usr`;
CREATE TABLE `base_wx_usr` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lbl` varchar(100) NOT NULL DEFAULT '' COMMENT '昵称',
  `name` varchar(200) NOT NULL DEFAULT '' COMMENT '姓名',
  `mobile` varchar(30) NOT NULL DEFAULT '' COMMENT '手机',
  `openid` varchar(100) NOT NULL DEFAULT '' COMMENT '小程序编码',
  `gz_openid` varchar(100) NOT NULL DEFAULT '' COMMENT '公众号编码',
  `unionid` varchar(100) NOT NULL DEFAULT '' COMMENT '微信唯一码',
  `gender` int(11) NOT NULL DEFAULT '0' COMMENT '性别,dict:gender',
  `city` varchar(100) NOT NULL DEFAULT '' COMMENT '城市',
  `province` varchar(100) NOT NULL DEFAULT '' COMMENT '省份',
  `country` varchar(100) NOT NULL DEFAULT '' COMMENT '国家',
  `avatar_url` varchar(500) NOT NULL DEFAULT '' COMMENT '头像',
  `session_key` varchar(500) NOT NULL DEFAULT '' COMMENT '会话密钥',
  `rem` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `is_admin` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '是否管理员,dictbiz:is_admin',
  `is_locked` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
  `dept_id` varchar(22) NOT NULL DEFAULT '' COMMENT '归属部门',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`dept_id`, `tenant_id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='微信账户';

------------------------------------------------------------------------------------------------ 微信配置
drop table if exists `base_wx_app`;
CREATE TABLE `base_wx_app` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lbl` varchar(22) NOT NULL DEFAULT '' COMMENT '名称',
  `appid` varchar(22) NOT NULL DEFAULT '' COMMENT 'appid',
  `appsecret` varchar(32) NOT NULL DEFAULT '' COMMENT 'appsecret',
  `access_token` varchar(512) NOT NULL DEFAULT '' COMMENT '令牌',
  `token_time` datetime DEFAULT NULL COMMENT '令牌创建时间',
  `expires_in` int unsigned NOT NULL DEFAULT 0 COMMENT '令牌超时时间',
  `rem` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '删除',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='微信配置';

drop table if exists `sps_usr_cars`;
CREATE TABLE if not exists `sps_usr_cars` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '车牌号',
  `wx_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '所属用户',
  `is_default` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '默认,dict:is_default',
  `order_by` int(11) unsigned NOT NULL DEFAULT 1 COMMENT '排序',
  `is_enabled` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '启用,dict:is_enabled',
  `rem` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `is_locked` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='用户车辆';


drop table if exists `sps_order`;
CREATE TABLE if not exists `sps_order` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '名称',
  `parking_lock_id` varchar(22) NOT NULL DEFAULT '' COMMENT '车位地锁',
  `lock_car_no` varchar(45) NOT NULL DEFAULT '' COMMENT '车辆车牌',
  `lock_time` datetime DEFAULT NULL COMMENT '锁定时间',
  `unlock_time` datetime DEFAULT NULL COMMENT '解锁时间',
  `order_amount` int(11) NOT NULL DEFAULT 0 COMMENT '订单金额,单位分',
  `pay_amount` int(11) NOT NULL DEFAULT 0 COMMENT '实付金额,单位分',
  `pay_wx_usr_id` varchar(22) NOT NULL DEFAULT 0 COMMENT '支付微信用户',
  `order_by` int(11) unsigned NOT NULL DEFAULT 1 COMMENT '排序',
  `is_enabled` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '启用,dict:is_enabled',
  `rem` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `is_locked` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='订单';

drop table if exists `sps_parking_list`;
CREATE TABLE if not exists `sps_parking_list` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '名称',
  `parking_id` varchar(22) NOT NULL DEFAULT '' COMMENT '停车场',
  `list_type` varchar(10) NOT NULL DEFAULT '' COMMENT '黑白名单类型,dictbiz:list_type',
  `order_by` int(11) unsigned NOT NULL DEFAULT 1 COMMENT '排序',
  `is_enabled` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '启用,dict:is_enabled',
  `rem` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `is_locked` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='停车场黑白名单';

