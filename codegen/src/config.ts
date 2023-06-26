export default {
  ignoreCodegen: [
    "dept_id",
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
   * @type {boolean}
   * @memberof TableCloumn
   */
  ignoreCodegen?: boolean;
  
  /**
   * 是否在pc前端隐藏此字段
   * @type {boolean}
   * @memberof TableCloumn
   */
  onlyCodegenDeno?: boolean;
  
  /**
   * 前端不允许修改
   * @type {boolean}
   * @memberof TableCloumn
   */
  noEdit?: boolean;
  
  /**
  * 前端不允许新增
  * @type {boolean}
  * @memberof TableCloumn
  */
  noAdd?: boolean;
  
  /**
  * 前端不允许在表格中显示
  * @type {boolean}
  * @memberof TableCloumn
  */
  noList?: boolean;
  
  /**
   * List页面表格是否 showOverflowTooltip
   * 默认为true
   */
  showOverflowTooltip?: boolean;
  
  /**
   * 是否虚拟字段, 虚拟自动不会在dao中生成增加, 修改操作
   * @type {boolean}
   * @memberof TableCloumn
   */
  isVirtual?: boolean;
  
  /**
   * 表限定符
   * @type {string}
   * @memberof TableCloumn
   */
  TABLE_CATALOG?: string,
  
  /**
   * 表所有者
   * @type {string}
   * @memberof TableCloumn
   */
  TABLE_SCHEMA?: string,
  
  /**
   * 表名
   * @type {string}
   * @memberof TableCloumn
   */
  TABLE_NAME?: string,
  
  /**
   * 字段名
   * 如果字段名为lbl, 并且没有设置column, 则认为是这一行的名称, require = true; search = true;
   * @type {string}
   * @memberof TableCloumn
   */
  COLUMN_NAME: string,
  
  /**
   * 列的顺序号
   * @type {number}
   * @memberof TableCloumn
   */
  ORDINAL_POSITION?: number,
  
  /**
   * 默认值
   * @type {string}
   * @memberof TableCloumn
   */
  COLUMN_DEFAULT?: string,
  
  /**
   * 列的为空性。如果列允许 NULL，那么该列返回 YES。否则，返回 NO
   * @type {("NO"|"YEW")}
   * @memberof TableCloumn
   */
  IS_NULLABLE?: "NO"|"YEW",
  
  /**
   * 系统提供的数据类型
   * 例如: varchar
   * @type {string}
   * @memberof TableCloumn
   */
  DATA_TYPE?: string,
  
  /**
   * 以字符为单位的最大长度，适于二进制数据、字符数据，或者文本和图像数据。否则，返回 NULL
   * @type {number}
   * @memberof TableCloumn
   */
  CHARACTER_MAXIMUM_LENGTH?: number,
  
  /**
   * 以字节为单位的最大长度，适于二进制数据、字符数据，或者文本和图像数据。否则，返回 NULL
   * @type {number}
   * @memberof TableCloumn
   */
  CHARACTER_OCTET_LENGTH?: number,
  
  /**
   * 数字精度
   * 适用于各种数字类型比如int，float之类的
   * @type {string}
   * @memberof TableCloumn
   */
  NUMERIC_PRECISION?: string,
  
  /**
   * 小数位数
   * @type {string}
   * @memberof TableCloumn
   */
  NUMERIC_SCALE?: string,
  
  /**
   * datetime 及 SQL-92 interval 数据类型的子类型代码。对于其它数据类型，返回 NULL
   * @type {string}
   * @memberof TableCloumn
   */
  DATETIME_PRECISION?: string,
  
  /**
   * 字段字符集名称。比如utf8
   * @type {string}
   * @memberof TableCloumn
   */
  CHARACTER_SET_NAME?: string,
  
  /**
   * 字符集排序规则
   * 比如utf8_general_ci，是不区分大小写一种排序规则。utf8_general_cs，是区分大小写的排序规则
   * 例如: utf8_bin
   * @type {string}
   * @memberof TableCloumn
   */
  COLLATION_NAME?: string,
  
  /**
   * 字段类型
   * 例如: varchar(64)
   * @type {string}
   * @memberof TableCloumn
   */
  COLUMN_TYPE?: string,
  
  /**
   * 索引类型
   * 可包含的值有PRI，代表主键，UNI，代表唯一键，MUL，可重复
   * @type {string}
   * @memberof TableCloumn
   */
  COLUMN_KEY?: string,
  
  /**
   * 其他信息
   * 比如主键的 auto_increment
   * @type {string}
   * @memberof TableCloumn
   */
  EXTRA?: string,
  
  /**
   * 权限
   * 多个权限用逗号隔开，比如 select,insert,update,references
   * @type {string}
   * @memberof TableCloumn
   */
  PRIVILEGES?: string,
  
  /**
   * 字段注释
   * @type {string}
   * @memberof TableCloumn
   */
  COLUMN_COMMENT?: string,
  
  /**
   * 组合字段的公式
   * @type {string}
   * @memberof TableCloumn
   */
  GENERATION_EXPRESSION?: string,
  SRS_ID?: string,
  
  /**
   * 对_id或者_ids结尾的字段不启用外键关联
   */
  notForeignKeyById?: boolean;
  
  /**
   * 外键关联表
   * 默认字段名为: [表名]_id
   * 如果列名以 _ids 结尾, 并且没有设置 many2many, 则默认为外键关联字段
   * @type {({ table: string, column: string, multiple: boolean, lbl: string, type?: "json"|"many2many", defaultSort?: { prop: string, order: "ascending" | "descending" } })}
   * @memberof TableCloumn
   */
  foreignKey?: {
    
    /**
     * 外键关联表名
     * @type {string}
     */
    mod?: string,
    
    /**
     * 外键关联表名
     * @type {string}
     */
    mod_slash_table?: string,
    
    /**
     * 外键关联表名
     * @type {string}
     */
    table?: string,
    
    /**
     * 外键关联表字段
     * @type {string}
     */
    column?: string,
    
    /**
     * 下拉框是否多选
     * @type {boolean}
     */
    multiple?: boolean,
    
    /**
     * 下拉框显示字段, 默认为: lbl
     * @type {string | string[]}
     */
    lbl?: string | string[],
    
    /**
     * 外键关联的类型, json还是 多对多关联
     * @type {("json"|"many2many")}
     */
    type?: "json"|"many2many",
    
    /**
     * Detail中选择数据的方式
     *   select: 下拉框 (默认)
     *   selectInput: 弹框选择
     *   tree: 树形选择
     */
    selectType?: "select"|"selectInput"|"tree",
    
    /**
     * 外键关联的默认排序
     * @type {{ prop: string, order: "ascending" | "descending" }}
     */
    defaultSort?: {
      prop: string,
      order: string,
      // order: "ascending"|"descending",
    },
    
    /**
     * 列表页面上的显示方式
     * @type {string} tag: 标签, dialog: 弹窗, link: 链接, 默认为: tag
     */
    showType?: string;
    
    /**
     * 是否显示这个表所在的外键选项卡列表
     * @type {boolean}
     */
    isLinkForeignTabs?: boolean;
    
  },
  
  foreignTabs?: {
    mod: string;
    mod_slash_table?: string;
    table: string;
    label: string;
    column: string;
  }[],
  
  /**
   * 外键关联是否多对多
   * @type {{
   *     table: string,
   *     column1: string,
   *     column2: string,
   *   }}
   * @memberof TableCloumn
   */
  many2many?: {
    
    /**
     * table模块名
     */
    mod: string,
    
    /**
     * 多对多右边的表名
     * @type {string}
     */
    table: string,
    
    /**
     * 多对多左边的字段名
     * @type {string}
     */
    column1: string,
    
    /**
     * 多对多右边的字段名
     * @type {string}
     */
    column2: string,
  },
  
  /**
   * 是否必填
   * @type {boolean}
   * @memberof TableCloumn
   */
  require?: boolean,
  
  /**
   * 是否启用表格搜素
   * @type {boolean}
   * @memberof TableCloumn
   */
  search?: boolean,
  
  /**
   * 是否图片
   * 如果字段名是img或者_img结尾, 并且isImg == null，则认isImg默认为true,并且此时width默认为80
   * @type {boolean}
   * @memberof TableCloumn
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
   * @type {boolean}
   * @memberof TableCloumn
   */
  isAtt?: boolean,
  
  /**
   * 附件或者图片的最大个数, 默认为1
   * @type {number}
   * @memberof TableCloumn
   */
  attMaxSize?: number,
  
  /**
   * 附件或者图片的最大大小(字节), 默认为50M
   * @type {number}
   * @memberof TableCloumn
   */
  maxFileSize?: number,
  
  /**
   * 表格中一对多时标签最大个数, 默认为3
   * @type {number}
   * @memberof TableCloumn
   */
   linkListMaxSize?: number,
  
  /**
   * 附件或者图片的accept, 图片默认为image/*, 附件默认为*
   * @type {string}
   * @memberof TableCloumn
   */
  attAccept?: string,
  
  /**
   * 宽度
   * @type {number}
   * @memberof TableCloumn
   */
  width?: number,
  
  /**
   * 表格列 headerAlign
   * @type {string}
   * @memberof TableCloumn
   */
   headerAlign?: string,
  
  /**
   * 表格列 align
   * @type {string}
   * @memberof TableCloumn
   */
  align?: string,
  
  /**
   * 最小宽度
   * @type {number}
   * @memberof TableCloumn
   */
  minWidth?: number,
  
  /**
   * el-input-number 的 max 属性
   * @type {number}
   * @memberof TableCloumn
   */
  max?: number,
  
  /**
   * el-input-number 的 min 属性
   * @type {number}
   * @memberof TableCloumn
   */
  min?: number,
  
  /**
   * 是否是密码字段
   * @type {boolean}
   * @memberof TableCloumn
   */
  isPassword?: boolean,
  
  /**
   * 点击表格表头是否可排序
   * @type {boolean}
   * @memberof TableCloumn
   */
  sortable?: boolean,
  
  /**
   * 是否显示合计
   * @type {boolean}
   * @memberof TableCloumn
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
  
}

export interface TablesConfigItem {
  opts?: {
    
    /**
     * 是否缓存
     * @type {boolean}
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
     */
    list_tree?: boolean;
    
    /**
     * 是否忽略代码生成
     * @type {boolean}
     */
    ignoreCodegen?: boolean;
    
    /**
     * 是否只创建后端, 默认为false
     * @type {boolean}
     * @memberof TableCloumn
     */
    onlyCodegenDeno?: boolean;
    
    /**
     * 表名
     * @type {string}
     */
    table?: string;
    
    /**
     * 首字母大写的表名
     * @type {string}
     */
    tableUp?: string;
    
    /**
     * 表的中文名
     * @type {string}
     */
    table_comment?: string;
    
    /**
     * 是否有租户ID
     * @type {boolean}
     */
    hasTenant_id?: boolean;
    
    /**
     * 默认排序字段
     * @type {{ prop: string, order: "ascending"|"descending" }}
     */
    defaultSort?: { prop: string, order: "ascending"|"descending" };
    
    /**
     * 不允许删除
     * @type {boolean}
     */
    noDelete?: boolean;
    
    /**
     * 不允许还原
     * @type {boolean}
     */
    noRevert?: boolean;
    
    /**
     * 不允许修改
     * @type {boolean}
     */
    noEdit?: boolean;
    
    /**
     * 不允许新增
     * @type {boolean}
     */
    noAdd?: boolean;
    
    /**
     * 不允许导入
     * @type {boolean}
     */
    noImport?: boolean;
    
    /**
     * 不允许导出
     * @type {boolean}
     */
    noExport?: boolean;
    
    /**
     * 只允许当前创建用户 create_usr_id 查看数据
     * @type {boolean}
     */
    filterDataByCreateUsr?: boolean;
    
    /**
     * 唯一约束
     * @type {string[]}
     */
    unique?: string[];
    
  },
  columns?: TableCloumn[];
}

export interface TablesConfig {
  [key: string]: TablesConfigItem;
}

export function defineConfig(config: TablesConfig) {
  return config;
}
