# 配置系统字典
系统字典的配置和使用

## 如何增加系统字典
  
  1. 创建表结构时 (表结构在 `codegen/tables/[模块]/[模块].sql` 文件中)
      ```sql
      `is_locked` tinyint(1) unsigned NOT NULL DEFAULT 0 COMMENT '锁定,dict:is_locked',
      ```
      - 其中 `,dict:is_locked` 中的 `dict:` 代表这个字段需要启用`系统字典`
      - 如果是 `dictbiz:` 则代表的是 `业务字典`
      - `dict:` 后面的 `is_locked` 则代表的是 `系统字典` 的编码
  
  2. 在文件 `codegen/tables/[模块]/base_dict.[模块].sql.csv` 中, 如果是业务字典则: `base_dictbiz.[模块].sql.csv`
    , 没有这个csv文件则手动创建, 具体参考 `codegen/tables/base_dict.sql.csv` 文件
      - 其中: `id` 可以在命令行中执行 `npm run uuid` 来生成, 生成的同时会拷贝到剪切板, 生成多个 `npm run uuid -- 3`
      - `code` 为 `系统字典` 的编码, 与表结构中的 `dict:` 后面的编码一致
      - `lbl` 为 `系统字典` 的名称
  
  3. 在文件 `codegen/tables/[模块]/base_dict_detail.[模块].sql.csv` 中配置 系统字典明细
    , 具体参考文件 `codegen/tables/base/base_dict_dict.sql.csv`, 注意跟 `base_dict.sql.csv` 的`id`外键关联关系
  
  4. 在控制台中执行命令导入系统字典, 相当于手动在页面中增加记录 (只会插入尚未存在的记录)
      ```bash
      npm run importCsv -- [模块名]/*
      ```
      如果已经全局安装了 `npm i -g @antfu/ni` 模块, 则
      ```bash
      nr importCsv [模块名]/*
      ```
  
  5. 注意, 业务字典和系统字典里面有一个特殊的字段 `is_sys`, 代表当前记录是否是 `系统记录`
     
     ```sql
      `is_sys` tinyint unsigned NOT NULL DEFAULT 0 COMMENT '系统记录,dict:is_sys',
      ```
     
     - 如果是 `is_sys` 为 `1` 代表是 `系统记录`, 此时在生成代码时会自动同时生成枚举类型的数据类型给前端和后端的 `service` 层使用, 同时不允许用户修改和删除, 此举可有效防止用户误操作
  
## 系统内置的系统字典
 - `is_deleted` 记录是否已经被逻辑删除
 - `is_locked` 记录是否已经被锁定, 已经被锁定的记录不允许用户改动(修改和删除), 解锁之后才可以改动
 - `is_enabled` 记录是否启用, 由业务逻辑判断禁用的用户如何处理, 比如: 禁用的菜单不会出现在相关配置的额下拉框中
 - `is_default` 当前记录是否默认, 默认记录只会有一条, 由业务逻辑判断如何使用默认记录
 - `dict_type` 系统字典的数据类型
   - 字符串 string
   - 数值 number
   - 日期 date
   - 日期时间 datetime
   - 时间 time
   - 布尔 boolean
 - `yes_no` 是否
 