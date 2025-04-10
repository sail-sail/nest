------------------------------------------------------------------------ 菜单语言
drop table if exists `base_menu_lang`;
CREATE TABLE if not exists `base_menu_lang` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lang_id` varchar(22) NOT NULL DEFAULT '' COMMENT '语言',
  `menu_id` varchar(22) NOT NULL DEFAULT '' COMMENT '菜单',
  `parent_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '父菜单',
  `lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '名称',
  `rem` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  `is_deleted` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  INDEX (`lang_id`, `menu_id`, `is_deleted`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='菜单语言';

------------------------------------------------------------------------ 系统字典语言
drop table if exists `base_dict_lang`;
CREATE TABLE if not exists `base_dict_lang` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lang_id` varchar(22) NOT NULL DEFAULT '' COMMENT '语言',
  `dict_id` varchar(22) NOT NULL DEFAULT '' COMMENT '系统字典',
  `lbl` varchar(100) NOT NULL DEFAULT '' COMMENT '名称',
  `rem` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  `is_deleted` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  INDEX (`lang_id`, `dict_id`, `is_deleted`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='系统字典语言';

------------------------------------------------------------------------ 系统字典明细语言
drop table if exists `base_dict_detail_lang`;
CREATE TABLE if not exists `base_dict_detail_lang` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lang_id` varchar(22) NOT NULL DEFAULT '' COMMENT '语言',
  `dict_detail_id` varchar(22) NOT NULL DEFAULT '' COMMENT '系统字典明细',
  `lbl` varchar(100) NOT NULL DEFAULT '' COMMENT '名称',
  `rem` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  `is_deleted` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  INDEX (`lang_id`, `dict_detail_id`, `is_deleted`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='系统字典明细语言';

------------------------------------------------------------------------ 按钮权限语言
drop table if exists `base_permit_lang`;
CREATE TABLE if not exists `base_permit_lang` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lang_id` varchar(22) NOT NULL DEFAULT '' COMMENT '语言',
  `permit_id` varchar(22) NOT NULL DEFAULT '' COMMENT '按钮权限',
  `lbl` varchar(100) NOT NULL DEFAULT '' COMMENT '名称',
  `rem` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  INDEX (`lang_id`, `permit_id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='按钮权限语言';

------------------------------------------------------------------------ 字段权限语言
drop table if exists `base_field_permit_lang`;
CREATE TABLE if not exists `base_field_permit_lang` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `lang_id` varchar(22) NOT NULL DEFAULT '' COMMENT '语言',
  `field_permit_id` varchar(22) NOT NULL DEFAULT '' COMMENT '字段权限',
  `lbl` varchar(100) NOT NULL DEFAULT '' COMMENT '名称',
  `rem` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  INDEX (`lang_id`, `field_permit_id`),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='字段权限语言';
