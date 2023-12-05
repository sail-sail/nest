------------------------------------------------------------------ 会员卡
drop table if exists `esw_card`;
CREATE TABLE if not exists `esw_card` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `seq_lbl` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '卡号-序列号',
  `lbl` varchar(22) NOT NULL DEFAULT '' COMMENT '卡号',
  `usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '绑定用户',
  `grade` varchar(10) NOT NULL DEFAULT 'normal' COMMENT '会员等级,dictbiz:card_grade',
  `name` varchar(10) NOT NULL DEFAULT '' COMMENT '姓名',
  `mobile` varchar(22) NOT NULL DEFAULT '' COMMENT '电话',
  `balance` decimal(13,2) NOT NULL DEFAULT 0 COMMENT '充值余额',
  `give_balance` decimal(13,2) NOT NULL DEFAULT 0 COMMENT '赠送余额',
  `integral` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '积分',
  `growth_amt` decimal(13,2) NOT NULL DEFAULT 0 COMMENT '累计消费',
  `is_default` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '默认,dict:is_default',
  `is_locked` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
  `is_enabled` tinyint(1) unsigned NOT NULL DEFAULT 1 COMMENT '启用,dict:is_enabled',
  `rem` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  `org_id` varchar(22) NOT NULL DEFAULT '' COMMENT '组织',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX(`seq_lbl`, `org_id`, `tenant_id`),
  INDEX(`lbl`, `org_id`, `tenant_id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='会员卡';
 
------------------------------------------------------------------ 会员卡充值记录
drop table if exists `esw_card_recharge`;
CREATE TABLE if not exists `esw_card_recharge` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `transaction_id` varchar(32) NOT NULL DEFAULT '' COMMENT '微信支付订单号',
  `card_id` varchar(22) NOT NULL DEFAULT '' COMMENT '会员卡',
  `usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '用户',
  `amt` decimal(13,2) NOT NULL DEFAULT 0 COMMENT '充值金额',
  `give_amt` decimal(13,2) NOT NULL DEFAULT 0 COMMENT '赠送金额',
  `balance` decimal(13,2) NOT NULL DEFAULT 0 COMMENT '充值后充值余额',
  `give_balance` decimal(13,2) NOT NULL DEFAULT 0 COMMENT '充值后赠送余额',
  `integral` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '充值后积分',
  `rem` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  `org_id` varchar(22) NOT NULL DEFAULT '' COMMENT '组织',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`transaction_id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='会员卡充值记录';

------------------------------------------------------------------ 充值赠送规则
drop table if exists `esw_recharge_rule`;
CREATE TABLE if not exists `esw_recharge_rule` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lbl` varchar(22) NOT NULL DEFAULT '' COMMENT '名称',
  `amt` decimal(13,2) NOT NULL DEFAULT 0 COMMENT '充值金额',
  `give_amt` decimal(13,2) NOT NULL DEFAULT 0 COMMENT '赠送金额',
  `is_locked` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
  `is_enabled` tinyint(1) unsigned NOT NULL DEFAULT 1 COMMENT '启用,dict:is_enabled',
  `order_by` int(11) unsigned NOT NULL DEFAULT 1 COMMENT '排序',
  `rem` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  `org_id` varchar(22) NOT NULL DEFAULT '' COMMENT '所属门店',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`lbl`, `org_id`, `tenant_id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='充值赠送规则';

------------------------------------------------------------------ 会员卡消费记录
drop table if exists `esw_card_consume`;
CREATE TABLE if not exists `esw_card_consume` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `transaction_id` varchar(32) NOT NULL DEFAULT '' COMMENT '微信支付订单号',
  `card_id` varchar(22) NOT NULL DEFAULT '' COMMENT '卡号',
  `usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '用户',
  `amt` decimal(13,2) NOT NULL DEFAULT 0 COMMENT '消费金额',
  `give_amt` decimal(13,2) NOT NULL DEFAULT 0 COMMENT '消费赠送金额',
  `balance` decimal(13,2) NOT NULL DEFAULT 0 COMMENT '消费后余额',
  `give_balance` decimal(13,2) NOT NULL DEFAULT 0 COMMENT '消费后赠送余额',
  `integral` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '消费后积分',
  `rem` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  `org_id` varchar(22) NOT NULL DEFAULT '' COMMENT '组织',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`transaction_id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='会员卡消费记录';

------------------------------------------------------------------ 产品类别
drop table if exists `esw_pt_type`;
CREATE TABLE if not exists `esw_pt_type` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lbl` varchar(200) NOT NULL DEFAULT '' COMMENT '名称',
  `is_home` tinyint(1) unsigned NOT NULL DEFAULT 1 COMMENT '首页显示,dict:yes_no',
  `is_recommend` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '推荐,dict:yes_no',
  `is_locked` tinyint(1) unsigned NOT NULL DEFAULT 1 COMMENT '锁定,dict:is_locked',
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
  INDEX (`lbl`, `org_id`, `tenant_id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='产品类别';

------------------------------------------------------------------ 产品
drop table if exists `esw_pt`;
CREATE TABLE if not exists `esw_pt` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `img` varchar(100) NOT NULL DEFAULT '' COMMENT '图片',
  `lbl` varchar(200) NOT NULL DEFAULT '' COMMENT '名称',
  `price` decimal(13,2) NOT NULL DEFAULT 0 COMMENT '价格',
  `original_price` decimal(13,2) NOT NULL DEFAULT 0 COMMENT '原价',
  `is_new` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '新品,dict:yes_no',
  `introduct` varchar(100) NOT NULL DEFAULT '' COMMENT '简介',
  `detail` varchar(200) NOT NULL DEFAULT '' COMMENT '详情',
  `detail_top_img` varchar(200) NOT NULL DEFAULT '' COMMENT '详情顶部图片',
  `detail_img` varchar(200) NOT NULL DEFAULT '' COMMENT '详情图片',
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
  INDEX (`lbl`, `org_id`, `tenant_id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='产品';

------------------------------------------------------------------ 产品产品类别
drop table if exists `esw_pt_pt_type`;
CREATE TABLE if not exists `esw_pt_pt_type` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `pt_id` varchar(22) NOT NULL DEFAULT '' COMMENT '产品',
  `pt_type_id` varchar(22) NOT NULL DEFAULT '' COMMENT '产品类别',
  `order_by` int(11) unsigned NOT NULL DEFAULT 1 COMMENT '排序',
  `org_id` varchar(22) NOT NULL DEFAULT '' COMMENT '组织',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`pt_id`, `pt_type_id`, `org_id`, `tenant_id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='产品产品类别';

------------------------------------------------------------------ 订单
drop table if exists `esw_order`;
CREATE TABLE if not exists `esw_order` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `seq_lbl` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '订单号-序列号',
  `lbl` varchar(22) NOT NULL DEFAULT '' COMMENT '订单号',
  `status` varchar(22) NOT NULL DEFAULT 'to_be_paid' COMMENT '订单状态,dictbiz:order_status',
  `usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '用户',
  `card_id` varchar(22) NOT NULL DEFAULT '' COMMENT '会员卡',
  `price` decimal(13,2) unsigned NOT NULL DEFAULT 0 COMMENT '订单金额',
  `type` varchar(22) NOT NULL DEFAULT 'pay' COMMENT '订单类别,dictbiz:order_type',
  `amt` decimal(13,2) unsigned NOT NULL DEFAULT 0 COMMENT '消费充值金额',
  `give_amt` decimal(13,2) unsigned NOT NULL DEFAULT 0 COMMENT '消费赠送金额',
  `balance` decimal(13,2) unsigned NOT NULL DEFAULT 0 COMMENT '消费后充值余额',
  `give_balance` decimal(13,2) unsigned NOT NULL DEFAULT 0 COMMENT '消费后赠送余额',
  `integral` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '获得积分',
  `is_locked` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
  `is_enabled` tinyint(1) unsigned NOT NULL DEFAULT 1 COMMENT '启用,dict:is_enabled',
  `rem` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  `org_id` varchar(22) NOT NULL DEFAULT '' COMMENT '组织',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`lbl`, `org_id`, `tenant_id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='订单';
