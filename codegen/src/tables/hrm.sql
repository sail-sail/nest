------------------------------------------------------------------------ 工资条
drop table if exists `hrm_payslip`;
CREATE TABLE if not exists `hrm_payslip` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `pay_month` date NOT NULL COMMENT '发放月份',
  `lbl` varchar(22) NOT NULL DEFAULT '' COMMENT '姓名',
  `job_num` varchar(22) NOT NULL DEFAULT '' COMMENT '工号',
  `company` varchar(22) NOT NULL DEFAULT '' COMMENT '公司',
  `gross_pay` varchar(66) NOT NULL DEFAULT '' COMMENT '应发工资(元)',
  `social_security` varchar(66) NOT NULL DEFAULT '' COMMENT '代缴社保(元)',
  `individual_tax` varchar(66) NOT NULL DEFAULT '' COMMENT '代缴个税(元)',
  `self_pay` varchar(66) NOT NULL DEFAULT '' COMMENT '个人自付(元)',
  `net_pay` varchar(66) NOT NULL DEFAULT '' COMMENT '实发工资(元)',
  `is_send` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '已发送,dict:yes_no',
  `is_confirm` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '已确认,dict:yes_no',
  `is_locked` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
  `rem` varchar(88) NOT NULL DEFAULT '' COMMENT '备注',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  INDEX (`pay_month`, `usr_id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='工资条';