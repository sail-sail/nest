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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='菜单语言';

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='系统字典语言';

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='系统字典明细语言';
