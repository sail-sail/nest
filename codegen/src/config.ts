export default {
  ignoreCodegen: [
    "tenant_id",
    "create_usr_id",
    "create_time",
    "update_usr_id",
    "update_time",
    "is_deleted",
    "delete_usr_id",
    "delete_time",
  ],
};

export interface TableCloumn {
  
  /**
   * 是否忽略生成代码
   */
  ignoreCodegen?: boolean;
  
  /**
   * 是否在pc前端隐藏此字段
   */
  onlyCodegenDeno?: boolean;
  
  /**
   * 前端不允许修改
   */
  noEdit?: boolean;
  
  /**
   * 前端不允许新增
   */
  noAdd?: boolean;
  
  /**
   * 前端不允许在表格中显示
   */
  noList?: boolean;
  
  /**
   * 前端不允许导出这个字段
   * 默认为false
   */
  noExport?: boolean;
  
  /**
   * List页面表格是否 showOverflowTooltip
   * 默认为true
   */
  showOverflowTooltip?: boolean;
  
  /**
   * 是否虚拟字段, 虚拟字段不会在dao中生成增加, 修改操作
   * @type {boolean}
   */
  isVirtual?: boolean;
  
  /**
   * 表限定符
   */
  TABLE_CATALOG?: string,
  
  /**
   * 表所有者
   */
  TABLE_SCHEMA?: string,
  
  /**
   * 表名
   */
  TABLE_NAME?: string,
  
  /**
   * 字段名
   * 如果字段名为lbl, 并且没有设置column, 则认为是这一行的名称, require = true; search = true;
   */
  COLUMN_NAME: string,
  
  /**
   * 列的顺序号
   */
  ORDINAL_POSITION?: number,
  
  /**
   * 默认值
   *   CURRENT_DATE: 当前日期
   *   CURRENT_DATETIME: 当前日期时间
   *   CURRENT_USR_ID: 当前用户ID
   *   CURRENT_USERNAME: 当前用户名
   *   CURRENT_ORG_ID: 当前组织ID
   *   CURRENT_TENANT_ID: 当前租户ID
   *   其余的请查看dayjs文档: https://dayjs.fenxianglu.cn/category/manipulate.html#%E6%97%B6%E9%97%B4%E7%9A%84%E5%BC%80%E5%A7%8B
   */
  COLUMN_DEFAULT?: string | "CURRENT_DATE" | "CURRENT_DATETIME" | "CURRENT_USR_ID" | "CURRENT_ORG_ID" | "CURRENT_TENANT_ID"
    | "start_of_year" | "end_of_year" | "start_of_month" | "end_of_month" | "start_of_week" | "end_of_week" | "start_of_day" | "end_of_day"
    | "start_of_hour" | "end_of_hour" | "start_of_minute" | "end_of_minute" | "start_of_second" | "end_of_second",
  
  /**
   * 列的为空性。如果列允许 NULL，那么该列返回 YES。否则，返回 NO
   */
  IS_NULLABLE?: "NO"|"YES",
  
  /**
   * 系统提供的数据类型
   * 例如: varchar
   */
  DATA_TYPE?: string,
  
  /**
   * 以字符为单位的最大长度，适于二进制数据、字符数据，或者文本和图像数据。否则，返回 NULL
   */
  CHARACTER_MAXIMUM_LENGTH?: number,
  
  /**
   * 以字节为单位的最大长度，适于二进制数据、字符数据，或者文本和图像数据。否则，返回 NULL
   */
  CHARACTER_OCTET_LENGTH?: number,
  
  /**
   * 数字精度
   * 适用于各种数字类型比如int，float之类的
   */
  NUMERIC_PRECISION?: string,
  
  /**
   * 小数位数
   */
  NUMERIC_SCALE?: string,
  
  /**
   * datetime 及 SQL-92 interval 数据类型的子类型代码。对于其它数据类型，返回 NULL
   */
  DATETIME_PRECISION?: string,
  
  /**
   * 字段字符集名称。比如utf8
   * 
   */
  CHARACTER_SET_NAME?: string,
  
  /**
   * 字符集排序规则
   * 比如utf8_general_ci，是不区分大小写一种排序规则。utf8_general_cs，是区分大小写的排序规则
   * 例如: utf8_bin
   */
  COLLATION_NAME?: string,
  
  /**
   * 字段类型
   * 例如: varchar(64)
   */
  COLUMN_TYPE?: string,
  
  /**
   * 索引类型
   * 可包含的值有PRI，代表主键，UNI，代表唯一键，MUL，可重复
   * 
   */
  COLUMN_KEY?: string,
  
  /**
   * 其他信息
   * 比如主键的 auto_increment
   * 
   */
  EXTRA?: string,
  
  /**
   * 权限
   * 多个权限用逗号隔开，比如 select,insert,update,references
   * 
   */
  PRIVILEGES?: string,
  
  /**
   * 字段注释
   * 
   */
  COLUMN_COMMENT?: string,
  
  /**
   * 组合字段的公式
   * 
   */
  GENERATION_EXPRESSION?: string,
  SRS_ID?: string,
  
  /**
   * 对_id或者_ids结尾的字段不启用外键关联
   */
  notForeignKeyById?: boolean;
  
  /**
   * 是否不显示导入导出中的下拉框
   * 若不设置, create_usr_id 跟 update_usr_id 默认为 true
   *   true: 不显示, false: 显示, 默认为false
   */
  notImportExportList?: boolean;
  
  /**
   * 外键关联表
   * 默认字段名为: [表名]_id
   * 如果列名以 _ids 结尾, 并且没有设置 many2many, 则默认为外键关联字段
   */
  foreignKey?: {
    
    /**
     * 外键关联表名
     */
    mod?: string,
    
    /**
     * 外键关联表名
     */
    mod_slash_table?: string,
    
    /**
     * 外键关联表名
     */
    table?: string,
    
    /**
     * 外键关联表字段
     */
    column?: string,
    
    /**
     * 下拉框是否多选
     */
    multiple?: boolean,
    
    /**
     * 下拉框显示字段, 默认为: lbl
     */
    lbl?: string,
    
    /** 多对多需要级联查询的字段, 默认包含 lbl 字段 */
    cascade_fields?: string[],
    
    /**
     * 外键关联的类型, many2many: 多对多关联
     */
    type?: "many2many",
    
    /**
     * 外键关联的类型, many2many: 多对多关联时, 是否不允许级联删除, 默认为: false
     */
    many2many_no_cascade_delete?: boolean;
    
    /**
     * Detail.vue 修改页面中选择数据的方式
     *   select: 下拉框 (默认)
     *   selectInput: 弹框选择
     *   tree: 树形选择
     */
    selectType?: "select" | "selectInput" | "tree";
    
    /**
     * 当 selectType 为 select 或者 不设置时, 下拉框是否有增加按钮, 默认为: false
     */
    hasSelectAdd?: boolean;
    
    /**
     * 外键关联的默认排序
     */
    defaultSort?: {
      prop: string,
      order: string,
      // order: "ascending"|"descending",
    },
    
    /**
     * 列表页面上的显示方式 tag: 标签, dialog: 弹窗, link: 链接, 默认为: tag
     */
    showType?: "tag" | "dialog" | "link";
    
    /**
     * 是否显示这个表所在的外键选项卡列表
     */
    isLinkForeignTabs?: boolean;
    
    /** 不允许通过中文变成id, 也意味着不允许导入, 因为导入只能设置中文 */
    notSetIdByLbl?: boolean;
    
    /**
     * 是否在表格中用文本框的形式搜索, 而不是下拉框, 默认为 false
     */
    isSearchByLbl?: boolean;
    
  },
  
  /** foreignTabs 弹出框的大小, 默认为 medium */
  foreignTabsDialogType?: "auto" | "medium" | "large" | "default",
  
  foreignTabs?: {
    /**
     * 外键关联的按钮类型, 默认为: link
     *  link: 单元格上的链接
     *  button: 表格操作栏的按钮
     *  more: 表格操作栏的 更多操作 里面
     */
    linkType?: "link" | "button" | "more",
    mod: string;
    mod_slash_table?: string;
    table: string;
    label: string;
    column: string;
  }[],
  
  /**
   * 外键关联是否多对多
   */
  many2many?: {
    
    /**
     * table模块名
     */
    mod?: string,
    
    /**
     * 多对多中间表的表名
     */
    table?: string,
    
    /**
     * 多对多左边的字段名
     */
    column1?: string,
    
    /**
     * 多对多右边的字段名
     */
    column2?: string,
  },
  
  /**
   * 多对多关联时, 如果中间表需要编辑, 则设置为true, 默认为false
   */
  inlineMany2manyTab?: boolean;
  
  /**
   * 是否必填
   */
  require?: boolean,
  
  /**
   * 是否启用表格搜素
   * 如果 true 则 canSearch 默认为 true
   */
  search?: boolean,
  
  /**
   * 是否可以搜索
   * 默认为 false, 如果 search == true, 则默认为 true
   * 如果是外键关联字段, 则默认为 true
   */
  canSearch?: boolean,
  
  /**
   * 是否图片
   * 如果字段名是img或者_img结尾, 并且isImg == null，则认isImg默认为true,并且此时width默认为80
   */
  isImg?: boolean,
  
  /**
   * 是否文本域
   */
  isTextarea?: boolean,
  
  /**
   * 是否保留换行 un-whitespace-pre
   * 默认为 false
   */
  whitespacePre?: boolean,
  
  /**
   * 是否为开关
   */
  isSwitch?: boolean,
  
  /**
   * 是否为附件
   * 如果字段名是 att 或者 _att 结尾, 并且 isAtt == null，则认 isAtt 默认为true,并且此时width默认为80
   */
  isAtt?: boolean,
  
  /**
   * 附件或者图片的最大个数, 默认为1
   */
  attMaxSize?: number,
  
  /**
   * 附件或者图片的最大大小(字节), 默认为50M
   */
  maxFileSize?: number,
  
  /**
   * 表格中一对多时标签最大个数, 默认为3
   */
   linkListMaxSize?: number,
  
  /**
   * 附件或者图片的accept, 图片默认为image/*, 附件默认为*
   * 
   */
  attAccept?: string,
  
  /**
   * 宽度
   */
  width?: number,
  
  /** 前缀 */
  prefix?: string,
  
  /**
   * 表格列 headerAlign
   * 
   */
  headerAlign?: string,
  
  /**
   * 表格列 align
   * 
   */
  align?: string,
  
  /**
   * 最小宽度
   */
  minWidth?: number,
  
  /**
   * el-input-number 的 max 属性
   */
  max?: number,
  
  /**
   * el-input-number 的 min 属性
   */
  min?: number,
  
  /**
   * 是否是密码字段
   */
  isPassword?: boolean,
  
  /**
   * 点击表格表头是否可排序
   */
  sortable?: boolean,
  
  /**
   * 是否运行在api中排序
   * 如果 sortable 为 true, 则默认为 true, 否则默认为 false
   */
  canSortInApi?: boolean,
  
  /**
   * 是否显示合计
   */
  showSummary?: boolean,
  
  /**
   * 系统字典
   */
  dict?: string,
  
  /**
   * 业务字典
   */
  dictbiz?: string,
  
  /**
   * 是否为固定列
   */
  fixed?: boolean | "left" | "right",
  
  /**
   * 指定这个字段对应的lbl冗余字段
   */
  redundLbl?: {[key: string]: string},
  
  /**
   * 校验
   */
  validators?: Validator[],
  
  /**
   * 数据库字段是否加密, 默认为false
   */
  isEncrypt?: boolean,
  
  /**
   * 日期控件时是否只取月份, 默认为false
   */
  isMonth?: boolean,
  
  /**
   * 不允许修改, 不允许增加, 不在导入模板中显示, 默认为false
   */
  readonly?: boolean,
  
  /**
   * readonly 时的占位符
   */
  readonlyPlaceholder?: string,
  
  /**
   * 搜索时是否允许多选, 默认为true
   */
  searchMultiple?: boolean,
  
  /** 搜索条件是否默认收起, 默认为false */
  isSearchExpand?: boolean,
  
  /**
   * 此字段对应的冗余字段
   */
  modelLabel?: string;
  
  /**
   * 此字段是否要做字段权限控制, 默认为false
   */
  fieldPermit?: boolean;
  
  /**
   * 自动生成编码
   */
  autoCode?: {
    /** 前缀 */
    prefix?: string;
    /** 序号字段, 一般为: [字段名]_seq, 例如: code_seq */
    seq: string;
    /** 序号最小长度, 长度不足时补足0 */
    seqPadStart0: number;
    /** 后缀 */
    suffix?: string;
  };
  
}

/**
 * https://async-graphql.github.io/async-graphql/zh-CN/input_value_validators.html
 * 
 * maximum=N 指定数字不能大于N
 * minimum=N 指定数字不能小于N
 * multiple_of=N 指定数字必须是N的倍数
 * max_items=N 指定列表的长度不能大于N
 * min_items=N 指定列表的长度不能小于N
 * max_length=N 字符串的长度不能大于N
 * min_length=N 字符串的长度不能小于N
 * chars_max_length=N 字符串中 unicode 字符的的数量不能小于N
 * chars_min_length=N 字符串中 unicode 字符的的数量不能大于N
 * email 有效的 email
 * url 有效的 url
 * ip 有效的 ip 地址
 * regex=RE 匹配正则表达式
 */
export type Validator = {
  
  /**
   * maximum=N 指定数字不能大于N
   */
  maximum?: number;
  
  /**
   * minimum=N 指定数字不能小于N
   */
  minimum?: number;
  
  /**
   * multiple_of=N 指定数字必须是N的倍数
   */
  multiple_of?: number;
  
  /**
   * max_items=N 指定列表的长度不能大于N
   */
  max_items?: number;
  
  /**
   * min_items=N 指定列表的长度不能小于N
   */
  min_items?: number;
  
  /**
   * chars_max_length=N 字符串中 unicode 字符的的数量不能小于N
   */
  chars_max_length?: number;
  
  /**
   * chars_min_length=N 字符串中 unicode 字符的的数量不能大于N
   */
  chars_min_length?: number;
  
  /**
   * email 有效的 email
   */
  email?: boolean;
  
  /**
   * url 有效的 url
   */
  url?: boolean;
  
  /**
   * ip 有效的 ip 地址
   */
  ip?: boolean;
  
  /**
   * regex=RE 匹配正则表达式
   */
  regex?: string;
  
};

export interface TablesConfigItem {
  opts?: {
    
    /**
     * 用于显示的字段
     */
    lbl_field?: string;
    
    /**
     * 是否缓存
     */
    cache?: boolean;
    
    /**
     * 是否启用日志记录
     */
    log?: boolean;
    
    /**
     * 列表页中的表格是否分页, 默认为true
     */
    list_page?: boolean;
    
    /**
     * 列表页中的表格是否为树, 默认为false
     * 如果为true, 则list_page自动设置为false
     * 如果是字符串, 则为树的外键字段名
     * 例如: base_permit 中的 menu_id 字段
     */
    list_tree?: boolean | string;
    
    /**
     * 是否忽略代码生成
     */
    ignoreCodegen?: boolean;
    
    /**
     * 是否只创建后端, 默认为false
     */
    onlyCodegenDeno?: boolean;
    
    /**
     * 模块_表名
     */
    table_name?: string;
    
    /**
     * 表名
     */
    table?: string;
    
    /**
     * 模块
     */
    mod?: string;
    
    /**
     * 首字母大写的表名
     */
    tableUp?: string;
    
    /**
     * 表的中文名
     */
    table_comment?: string;
    
    /**
     * 是否有租户ID
     */
    hasTenant_id?: boolean;
    
    /** 是否有组织ID */
    hasOrgId?: boolean;
    
    /** 是否有 org_id_lbl 字段 */
    hasOrgIdLbl?: boolean;
    
    /** 是否有 create_usr_id 字段 */
    hasCreateUsrId?: boolean;
    
    /** 是否有 create_usr_id_lbl 字段 */
    hasCreateUsrIdLbl?: boolean;
    
    /** 是否有 create_time 字段 */
    hasCreateTime?: boolean;
    
    /** 是否有 update_usr_id 字段 */
    hasUpdateUsrId?: boolean;
    
    /** 是否有 update_usr_id_lbl 字段 */
    hasUpdateUsrIdLbl?: boolean;
    
    /** 是否有 update_time 字段 */
    hasUpdateTime?: boolean;
    
    /** 是否有 is_deleted 字段 */
    hasIsDeleted?: boolean;
    
    /** 是否有 delete_usr_id 字段 */
    hasDeleteUsrId?: boolean;
    
    /** 是否有 delete_usr_id_lbl 字段 */
    hasDeleteUsrIdLbl?: boolean;
    
    /** 是否有 delete_time 字段 */
    hasDeleteTime?: boolean;
    
    /** 是否有 version 字段 */
    hasVersion?: boolean;
    
    /**
     * 默认排序字段
     */
    defaultSort?: { prop: string, order: "ascending"|"descending" };
    
    /**
     * 不允许删除
     */
    noDelete?: boolean;
    
    /**
     * 不允许还原
     */
    noRevert?: boolean;
    
    /** 不允许彻底删除 */
    noForceDelete?: boolean;
    
    /**
     * 不允许修改
     */
    noEdit?: boolean;
    
    /**
     * 不允许新增
     */
    noAdd?: boolean;
    
    /**
     * 不允许导入
     */
    noImport?: boolean;
    
    /**
     * 不允许导出
     */
    noExport?: boolean;
    
    /**
     * 只允许当前创建用户 create_usr_id 查看数据
     */
    filterDataByCreateUsr?: boolean;
    
    /**
     * 唯一约束
     */
    uniques?: string[][];
    
    /**
     * 不可改和不可删除的系统字段, 配合 is_sys 字段使用
     */
    sys_fields?: string[];
    
    /**
     * 此表是否记录历史记录, 通常对应的历史记录表名为: [表名]_history
     */
    history_table?: string;
    
    /**
     * 是否需要做数据权限校验, 默认为否
     */
    dataPermit?: boolean;
    
    /**
     * 增加和修改时的内联外键关联可编辑表格, 聚合关联表
     */
    inlineForeignTabs?: {
      mod: string;
      mod_slash_table?: string;
      table: string;
      label: string;
      column: string;
      /** 字段名称, 默认值为 <#=table#> */
      column_name?: string;
      /** 一对一还是一对多, 默认为 one2many 一对多*/
      foreign_type?: "one2one" | "one2many";
    }[],
    
    /**
     * Detail页面中的自定义弹窗类型, 默认为: auto
     */
    detailCustomDialogType?: "auto" | "medium" | "large" | "default";
    
    /** 是否生成 SelectInput 跟 SelectList 界面 */
    hasSelectInput?: boolean;
    
    /** 表格的selectable, 行是否可以选择 */
    tableSelectable?: string;
    
    /** 是否添加实时数据推送功能, hasVersion为true时默认为true, 否则默认为false */
    isRealData?: boolean;
    
    /** Detail.vue 中表单的列数, 默认为: 当控件个数小于等于 4 为 1, 大于 4 为 2 */
    detailFormCols?: number;
    
    /** Detail.vue 中表单文本框的宽度, 默认为: 380px */
    detailFormWidth?: string;
    
    /** List.vue 中表单中表单文本框的宽度, 默认为: 280px */
    searchFormWidth?: string;
    
    /** 国际化多语言对应的表, [模块]_[表名]_lang 代表相关表的相同字段需要做国际化翻译, 例如: base_menu_lang */
    langTable?: {
      opts: {
        mod: string;
        table: string;
        table_name: string;
      };
      records: TableCloumn[];
    };
    
  },
  columns?: TableCloumn[];
  records?: any[];
}

export interface TablesConfig {
  [key: string]: TablesConfigItem;
}

export function defineConfig(config: TablesConfig) {
  return config;
}
