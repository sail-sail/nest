------------------------------------------------------------------------ SEO优化
drop table if exists `nuxt_seo`;
CREATE TABLE if not exists `nuxt_seo` (
  `id` varchar(22) NOT NULL COMMENT 'ID',
  `title` varchar(45) NOT NULL DEFAULT '' COMMENT '标题',
  `description` varchar(120) NOT NULL DEFAULT '' COMMENT '描述',
  `keywords` varchar(120) NOT NULL DEFAULT '' COMMENT '关键词',
  `og_image` varchar(22) NOT NULL DEFAULT '' COMMENT '分享图片',
  `og_title` varchar(45) NOT NULL DEFAULT '' COMMENT '分享标题',
  `og_description` varchar(120) NOT NULL DEFAULT '' COMMENT '分享描述',
  `is_locked` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
  `is_default` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '默认,dict:is_default',
  `order_by` int unsigned NOT NULL DEFAULT 1 COMMENT '排序',
  `rem` varchar(100) NOT NULL DEFAULT '' COMMENT '备注',
  `tenant_id` varchar(22) NOT NULL DEFAULT '' COMMENT '租户',
  `create_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '更新人',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `is_deleted` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '删除,dict:is_deleted',
  `delete_usr_id` varchar(22) NOT NULL DEFAULT '' COMMENT '删除人',
  `delete_usr_id_lbl` varchar(45) NOT NULL DEFAULT '' COMMENT '删除人',
  `delete_time` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='SEO优化';
