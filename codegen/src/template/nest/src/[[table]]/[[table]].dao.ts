<#
const hasOrderBy = columns.some((column) => column.COLUMN_NAME === 'order_by');
const hasPassword = columns.some((column) => column.isPassword);
#><#
const hasSummary = columns.some((column) => column.showSummary);
#>import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ResultSetHeader } from "mysql2/promise";
import { useContext } from "../common/interceptors/context.interceptor";
import { Page, Sort } from "../common/page.model";
import { isEmpty, sqlLike } from "../common/util/StringUitl";
import { UniqueException } from "../common/exceptions/unique.execption";
import { many2manyUpdate, setModelIds } from "../common/util/DaoUtil";
import { <#=tableUp#>Model, <#=tableUp#>Search } from "./<#=table#>.model";<#
if (hasSummary) {
#>
import { <#=tableUp#>Summary } from "./<#=table#>.model";<#
}
#><#
if (hasPassword) {
#>
import { AuthDao } from "../common/auth/auth.dao";<#
}
#><#
const hasImportDaos = [ ];
for (let i = 0; i < columns.length; i++) {
  const column = columns[i];
  if (column.ignoreCodegen) continue;
  const column_name = column.COLUMN_NAME;
  if (column_name === "id") continue;
  let data_type = column.DATA_TYPE;
  let column_type = column.COLUMN_TYPE;
  let column_comment = column.COLUMN_COMMENT || "";
  let selectList = [ ];
  let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
  if (selectStr) {
    selectList = eval(`(${ selectStr })`);
  }
  if (column_comment.indexOf("[") !== -1) {
    column_comment = column_comment.substring(0, column_comment.indexOf("["));
  }
  const foreignKey = column.foreignKey;
  const foreignTable = foreignKey && foreignKey.table;
  const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
  const many2many = column.many2many;
  const isPassword = column.isPassword;
#><#
  if (foreignKey && foreignKey.type !== "many2many" && !foreignKey.multiple) {
    if (foreignTable === table) {
      continue;
    }
    if (hasImportDaos.includes(foreignTable)) continue;
    hasImportDaos.push(foreignTable);
#>
import { <#=foreignTableUp#>Dao } from "../<#=foreignTable#>/<#=foreignTable#>.dao";<#
  }
#><#
}
#>

@Injectable()
export class <#=tableUp#>Dao {
  
  constructor(<#
      if (hasPassword) {
    #>
    private readonly authDao: AuthDao,<#
      }
    #>
    private readonly eventEmitter2: EventEmitter2,<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      let data_type = column.DATA_TYPE;
      let column_type = column.COLUMN_TYPE;
      let column_comment = column.COLUMN_COMMENT || "";
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const many2many = column.many2many;
      const isPassword = column.isPassword;
    #><#
      if (foreignKey && foreignKey.type !== "many2many" && !foreignKey.multiple) {
        if (foreignTable === table) {
          continue;
        }
        if (!hasImportDaos.includes(foreignTable)) continue;
    #>
    private readonly <#=foreignTable#>Dao: <#=foreignTableUp#>Dao,<#
      }
    #><#
    }
    #>
  ) { }
  
  getWhereQuery(
    args: any[],
    search?: <#=tableUp#>Search,
  ) {
    const context = useContext();
    let whereQuery = "";
    whereQuery += ` t.is_deleted = ?`;
    args.push(search?.is_deleted == null ? 0 : search.is_deleted);<#
    if (hasTenant_id) {
    #>
    if (context.tenant_id) {
      whereQuery += ` and t.tenant_id = ?`;
      args.push(context.tenant_id);
    }<#
    }
    #><#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.isVirtual) continue;
      const column_name = column.COLUMN_NAME;
      let data_type = column.DATA_TYPE;
      let column_type = column.DATA_TYPE;
      let column_comment = column.COLUMN_COMMENT || "";
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    #><#
      if (foreignKey) {
    #>
    if (search?.<#=column_name#> && search?.<#=column_name#>.length > 0) {
      whereQuery += ` and <#=foreignKey.table#>.id in (?)`;
      args.push(search.<#=column_name#>);
    }<#
      if (foreignKey.lbl) {
    #>
    if (search?._<#=column_name#> && search._<#=column_name#>?.length > 0) {
      whereQuery += ` and _<#=column_name#> in (?)`;
      args.push(search._<#=column_name#>);
    }<#
      }
    #><#
      } else if (selectList && selectList.length > 0) {
    #>
    if (search?.<#=column_name#> && search?.<#=column_name#>?.length > 0) {
      whereQuery += ` and t.<#=column_name#> in (?)`;
      args.push(search.<#=column_name#>);
    }<#
      } else if (column_name === "id") {
    #>
    if (!isEmpty(search?.<#=column_name#>)) {
      whereQuery += ` and t.<#=column_name#> = ?`;
      args.push(search.<#=column_name#>);
    }
    if (search?.ids && search?.ids.length > 0) {
      whereQuery += ` and t.id in (?)`;
      args.push(search.ids);
    }<#
    } else if (data_type === "int" && column_name.startsWith("is_")) {
    #>
    if (!isEmpty(search?.<#=column_name#>)) {
      whereQuery += ` and t.<#=column_name#> = ?`;
      args.push(search.<#=column_name#>);
    }<#
      } else if (data_type === "int" || data_type === "decimal" || data_type === "double" || data_type === "datetime" || data_type === "date") {
    #>
    if (search?.<#=column_name#> && search?.<#=column_name#>?.length > 0) {
      if (search.<#=column_name#>[0] != null) {
        whereQuery += ` and t.<#=column_name#> >= ?`;
        args.push(search.<#=column_name#>[0]);
      }
      if (search.<#=column_name#>[1] != null) {
        whereQuery += ` and t.<#=column_name#> <= ?`;
        args.push(search.<#=column_name#>[1]);
      }
    }<#
    } else if (data_type === "tinyint") {
    #>
    if (!isEmpty(search?.<#=column_name#>)) {
      whereQuery += ` and t.<#=column_name#> = ?`;
      args.push(search.<#=column_name#>);
    }<#
      } else {
    #>
    if (search?.<#=column_name#> !== undefined) {
      whereQuery += ` and t.<#=column_name#> = ?`;
      args.push(search.<#=column_name#>);
    }
    if (!isEmpty(search?.<#=column_name#>Like)) {
      whereQuery += ` and t.<#=column_name#> like ?`;
      args.push(sqlLike(search.<#=column_name#>Like) + "%");
    }<#
      }
    #><#
    }
    #>
    return whereQuery;
  }
  
  getFromQuery() {
    let fromQuery = `
      <#=table#> t<#
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.ignoreCodegen) continue;
        const column_name = column.COLUMN_NAME;
        const foreignKey = column.foreignKey;
        let data_type = column.DATA_TYPE;
        if (!foreignKey) continue;
        const foreignTable = foreignKey.table;
        const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
        const many2many = column.many2many;
      #><#
        if (foreignKey && foreignKey.type === "many2many") {
      #>
      left join <#=many2many.table#>
        on <#=many2many.table#>.<#=many2many.column1#> = t.id
        and <#=many2many.table#>.is_deleted = 0
      left join <#=foreignTable#>
        on <#=many2many.table#>.<#=many2many.column2#> = <#=foreignTable#>.<#=foreignKey.column#>
        and <#=foreignTable#>.is_deleted = 0
      left join (
        select
          json_arrayagg(<#=foreignTable#>.id) <#=column_name#>,<#
            if (foreignKey.lbl) {
          #>
          json_arrayagg(<#=foreignTable#>.<#=foreignKey.lbl#>) _<#=column_name#>,<#
            }
          #>
          <#=table#>.id <#=many2many.column1#>
        from <#=many2many.table#>
        inner join <#=foreignKey.table#>
          on <#=foreignKey.table#>.<#=foreignKey.column#> = <#=many2many.table#>.<#=many2many.column2#>
          and <#=foreignKey.table#>.is_deleted = 0
        inner join <#=table#>
          on <#=table#>.id = <#=many2many.table#>.<#=many2many.column1#>
          and <#=table#>.is_deleted = 0
        where
          <#=many2many.table#>.is_deleted = 0
        group by <#=many2many.column1#>
      ) _<#=foreignTable#>
        on _<#=foreignTable#>.<#=many2many.column1#> = t.id<#
        } else if (foreignKey && !foreignKey.multiple) {
      #>
      left join <#=foreignTable#>
        on <#=foreignTable#>.<#=foreignKey.column#> = t.<#=column_name#><#
        }
      #><#
      }
      #>
    `;
    return fromQuery;
  }
  
  /**
   * 根据条件查找总数据数
   * @param {<#=tableUp#>Search} search?
   * @return {Promise<number>}
   * @memberof <#=tableUp#>Dao
   */
  async findCount(
    search?: <#=tableUp#>Search,
  ): Promise<number> {
    const t = this;
    
    const table = "<#=table#>";
    const method = "findCount";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    const context = useContext();
    const args = [ ];
    let sql = `
      select
        count(1) total
      from
        (
          select
            1
          from
            ${ t.getFromQuery() }
          where
            ${ t.getWhereQuery(args, search) }
          group by t.id
        ) t
    `;<#
    if (cache) {
    #>
    
    const cacheKey1 = `dao.sql.${ table }`;
    const cacheKey2 = JSON.stringify({ sql, args });<#
    }
    #>
    
    interface Result {
      total: number,
    }
    const model = await context.queryOne<Result>(sql, args<#
    if (cache) {
    #>, { cacheKey1, cacheKey2 }<#
    }
    #>);
    let result = model?.total || 0;
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { search, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 根据搜索条件和分页查找数据
   * @param {<#=tableUp#>Search} search? 搜索条件
   * @param {Sort|Sort[]} sort? 排序
   * @memberof <#=tableUp#>Dao
   */
  async findAll(
    search?: <#=tableUp#>Search,
    page?: Page,
    sort?: Sort|Sort[],
  ) {
    const t = this;
    
    const table = "<#=table#>";
    const method = "findAll";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return <typeof result>beforeEvent.data;
    
    const context = useContext();
    const args = [ ];
    let sql = `
      select t.*<#
        for (let i = 0; i < columns.length; i++) {
          const column = columns[i];
          if (column.ignoreCodegen) continue;
          const column_name = column.COLUMN_NAME;
          const foreignKey = column.foreignKey;
          let data_type = column.DATA_TYPE;
          if (!foreignKey) continue;
          const foreignTable = foreignKey.table;
          const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
          const many2many = column.many2many;
        #><#
          if (foreignKey && foreignKey.type === "many2many") {
        #>
          ,max(<#=column_name#>) <#=column_name#>
          ,max(_<#=column_name#>) _<#=column_name#><#
        } else if (foreignKey && !foreignKey.multiple && foreignKey.lbl) {
        #>
          ,<#=foreignTable#>.<#=foreignKey.lbl#> _<#=column_name#><#
          }
        #><#
        }
        #>
      from
        ${ t.getFromQuery() }
      where
        ${ t.getWhereQuery(args, search) }
      group by t.id
    `;<#
    if (defaultSort) {
    #>
    
    // 排序
    if (!sort) {
      sort = [
        {
          prop: "<#=defaultSort.prop#>",
          order: "<#=defaultSort.order#>",
        },
      ];
    } else if (!Array.isArray(sort)) {
      sort = [ sort ];
    }
    sort = sort.filter((item) => item.prop);
    for (let i = 0; i < sort.length; i++) {
      const item = sort[i];
      if (i === 0) {
        sql += ` order by`;
      } else {
        sql += `,`;
      }
      sql += ` ${ context.escapeId(item.prop) } ${ context.escapeDec(item.order) }`;
    }<#
    } else {
    #>
    
    // 排序
    if (!sort) {
      sort = [ ];
    } else if (!Array.isArray(sort)) {
      sort = [ sort ];
    }
    sort = sort.filter((item) => item?.prop);
    for (let i = 0; i < sort.length; i++) {
      const item = sort[i];
      if (i === 0) {
        sql += ` order by`;
      } else {
        sql += `,`;
      }
      sql += ` ${ context.escapeId(item.prop) } ${ context.escapeDec(item.order) }`;
    }<#
    }
    #>
    
    // 分页
    if (page?.pgSize) {
      sql += ` limit ${ Number(page?.pgOffset) || 0 },${ Number(page.pgSize) }`;
    }<#
    if (cache) {
    #>
    
    // 缓存
    const cacheKey1 = `dao.sql.${ table }`;
    const cacheKey2 = JSON.stringify({ sql, args });<#
    }
    #>
    
    let result = await context.query<<#=tableUp#>Model>(sql, args<#
    if (cache) {
    #>, { cacheKey1, cacheKey2 }<#
    }
    #>);<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      let data_type = column.DATA_TYPE;
      let column_type = column.COLUMN_TYPE;
      let column_comment = column.COLUMN_COMMENT || "";
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const many2many = column.many2many;
    #><#
      if (foreignKey && foreignKey.type === "json") {
    #>
    await setModelIds(result, [ { table: "<#=foreignTable#>", fld: "<#=column_name#>"<#
      if (foreignKey.lbl) {
    #>, lbl: "<#=foreignKey.lbl#>"<#
      }
    #> } ]);<#
      } else if (foreignKey && foreignKey.type === "many2many") {
    #><#
      } else if (!foreignKey) {
    #><#
      } else {
    #><#
      }
    #><#
    }
    #>
    for (let i = 0; i < result.length; i++) {
      const model = result[i];<#
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.ignoreCodegen) continue;
        const column_name = column.COLUMN_NAME;
        if (column_name === "id") continue;
        let data_type = column.DATA_TYPE;
        let column_type = column.COLUMN_TYPE;
        let column_comment = column.COLUMN_COMMENT || "";
        let selectList = [ ];
        let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
        if (selectStr) {
          selectList = eval(`(${ selectStr })`);
        }
        if (column_comment.indexOf("[") !== -1) {
          column_comment = column_comment.substring(0, column_comment.indexOf("["));
        }
        const foreignKey = column.foreignKey;
        const foreignTable = foreignKey && foreignKey.table;
        const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
        const many2many = column.many2many;
        const isPassword = column.isPassword;
      #><#
        if (foreignKey && foreignKey.type === "json") {
      #><#
        } else if (isPassword) {
      #>
      // <#=column_comment#>
      model.<#=column_name#> = "";<#
        } else if (selectList.length > 0) {
      #>
      // <#=column_comment#>
      let _<#=column_name#> = "";
      <#
      for (let i = 0; i < selectList.length; i++) {
        const item = selectList[i];
        let value = item.value;
        let label = item.label;
        if (typeof(value) === "string") {
          value = `"${ value }"`;
        } else if (typeof(value) === "number") {
          value = value.toString();
        }
      #><#=i>0?" else ":""#>if (model.<#=column_name#> === <#=value#>) {
        _<#=column_name#> = "<#=label#>";
      }<#
      }
      #> else {
        _<#=column_name#> = String(model.<#=column_name#>);
      }
      model._<#=column_name#> = _<#=column_name#>;<#
        } else {
      #><#
        }
      #><#
      }
      #>
    }
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { search, result });
    if (afterEvent?.isReturn) return <typeof result>afterEvent.data;
    
    return result;
  }
  
  /**
   * 获得表的唯一字段名列表
   * @return {{ uniqueKeys: string[]; uniqueComments: { [key: string]: string }; }}
   * @memberof <#=tableUp#>Dao
   */
  getUniqueKeys(
  ): {
    uniqueKeys: string[];
    uniqueComments: { [key: string]: string };
    } {
    const uniqueKeys = [<#
    for (let i = 0; i < (opts.unique || []).length; i++) {
      const uniqueKey = opts.unique[i];
    #>
      "<#=uniqueKey#>",<#
    }
    #>
    ];
    const uniqueComments = {<#
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i];
        if (column.ignoreCodegen) continue;
        const column_name = column.COLUMN_NAME;
        if (column_name === "id") continue;
        const unique = opts.unique || [ ];
        if (!unique.includes(column_name)) continue;
        let column_comment = column.COLUMN_COMMENT || "";
        if (column_comment.includes("[")) {
          column_comment = column_comment.substring(0, column_comment.indexOf("["));
        }
        if (column_comment.includes("[")) {
          column_comment = column_comment.substring(0, column_comment.indexOf("["));
        }
    #>
      <#=column_name#>: "<#=column_comment#>",<#
      }
    #>
    };
    return { uniqueKeys, uniqueComments };
  }
  
  /**
   * 通过唯一约束获得一行数据
   * @param {<#=tableUp#>Search} search0
   * @memberof <#=tableUp#>Dao
   */
  async findByUnique(
    search0: <#=tableUp#>Search | <#=tableUp#>Model,
  ) {
    const t = this;
    const { uniqueKeys } = t.getUniqueKeys();
    if (!uniqueKeys || uniqueKeys.length === 0) return;
    const search: <#=tableUp#>Search = { };
    for (let i = 0; i < uniqueKeys.length; i++) {
      const key = uniqueKeys[i];
      const val = search0[key];
      if (isEmpty(val)) {
        return;
      }
      search[key] = val;
    }
    const model = await t.findOne(search);
    return model;
  }
  
  /**
   * 根据唯一约束对比对象是否相等
   * @param {<#=tableUp#>Model} oldModel
   * @param {<#=tableUp#>Model} model
   * @return {boolean}
   * @memberof <#=tableUp#>Dao
   */
  equalsByUnique(
    oldModel: <#=tableUp#>Model,
    model: <#=tableUp#>Model,
  ): boolean {
    const t = this;
    if (!oldModel || !model) return false;
    const { uniqueKeys } = t.getUniqueKeys();
    if (!uniqueKeys || uniqueKeys.length === 0) return false;
    let isEquals = true;
    for (let i = 0; i < uniqueKeys.length; i++) {
      const key = uniqueKeys[i];
      const oldVal = oldModel[key];
      const val = model[key];
      if (oldVal != val) {
        isEquals = false;
        break;
      }
    }
    return isEquals;
  }
  
  /**
   * 通过唯一约束检查数据是否已经存在
   * @param {<#=tableUp#>Model} model
   * @param {<#=tableUp#>Model} oldModel
   * @param {("ignore" | "throw" | "update")} uniqueType
   * @return {Promise<ResultSetHeader>}
   * @memberof <#=tableUp#>Dao
   */
  async checkByUnique(
    model: <#=tableUp#>Model,
    oldModel: <#=tableUp#>Model,
    uniqueType: "ignore" | "throw" | "update",
  ): Promise<ResultSetHeader> {
    const t = this;
    uniqueType = uniqueType || "throw";
    const isEquals = t.equalsByUnique(oldModel, model);
    if (isEquals) {
      if (uniqueType === "throw") {
        const { uniqueKeys, uniqueComments } = t.getUniqueKeys();
        const lbl = uniqueKeys.map((key) => `${ uniqueComments[key] }: ${ model[`_${ key }`] ?? model[key] }`).join("; ");
        throw new UniqueException(`${ lbl } 已存在!`);
      }
      if (uniqueType === "update") {
        const resultSetHeader = await t.updateById(oldModel.id, { ...model, id: undefined });
        return resultSetHeader;
      }
      if (uniqueType === "ignore") {
        return <ResultSetHeader> { affectedRows: 0 };
      }
    }
    return;
  }<#
  if (hasSummary) {
  #>
  
  /**
   * 根据搜索条件查找合计
   * @param {<#=tableUp#>Search} search? 搜索条件
   * @return {Promise<<#=tableUp#>Summary>}
   * @memberof <#=tableUp#>Dao
   */
  async findSummary(
    search?: <#=tableUp#>Search,
  ): Promise<<#=tableUp#>Summary> {
    const t = this;
    
    const table = "<#=table#>";
    const method = "findSummary";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    const context = useContext();
    const args = [ ];
    let sql = `
      select<#
        for (let i = 0; i < columns.length; i++) {
          const column = columns[i];
          if (column.ignoreCodegen) continue;
          const column_name = column.COLUMN_NAME;
          if (column_name === "id") continue;
        #><#
          if (column.showSummary) {
        #>
        sum(t.<#=column_name#>) <#=column_name#><#
          }
        #><#
        }
        #>
      from
        ${ t.getFromQuery() }
      where
        ${ t.getWhereQuery(args, search) }
    `;
    
    const cacheKey1 = `dao.sql.${ table }`;
    const cacheKey2 = JSON.stringify({ sql, args });
    
    const model = await context.queryOne<<#=tableUp#>Summary>(sql, args, { cacheKey1, cacheKey2 });
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { search });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return model;
  }<#
  }
  #>
  
  /**
   * 根据条件查找第一条数据
   * @param {<#=tableUp#>Search} search?
   * @return {Promise<<#=tableUp#>Model>} 
   * @memberof <#=tableUp#>Dao
   */
  async findOne(
    search?: <#=tableUp#>Search,
  ): Promise<<#=tableUp#>Model> {
    const t = this;
    const page: Page = {
      pgOffset: 0,
      pgSize: 1,
    };
    const [ model ] = await t.findAll(search, page);
    return model;
  }
  
  /**
   * 根据id查找数据
   * @param {string} id
   * @return {Promise<<#=tableUp#>Model>}
   * @memberof <#=tableUp#>Dao
   */
  async findById(
    id: string,
  ): Promise<<#=tableUp#>Model> {
    const t = this;
    if (!id) return;
    const model = await t.findOne({ id });
    return model;
  }
  
  /**
   * 根据搜索条件判断数据是否存在
   * @param {<#=tableUp#>Search} search?
   * @return {Promise<boolean>} 
   * @memberof <#=tableUp#>Dao
   */
  async exist(
    search?: <#=tableUp#>Search,
  ): Promise<boolean> {
    const t = this;
    const model = await t.findOne(search);
    const exist = !!model;
    return exist;
  }
  
  /**
   * 根据id判断数据是否存在
   * @param {string} id
   * @memberof <#=tableUp#>Dao
   */
  async existById(
    id: string,
  ): Promise<boolean> {
    const t = this;
    const table = "<#=table#>";
    const method = "existById";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { id });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!id) {
      return false;
    }
    
    const context = useContext();
    let sql = `
      select 1 e from <#=table#> where id = ? limit 1
    `;
    let args = [ id ];<#
    if (cache) {
    #>
    
    const cacheKey1 = `dao.sql.${ table }`;
    const cacheKey2 = JSON.stringify({ sql, args });<#
    }
    #>
    
    interface Result {
      e: number,
    }
    let model = await context.queryOne<Result>(sql, args<#
    if (cache) {
    #>, { cacheKey1, cacheKey2 }<#
    }
    #>);
    let result = model?.e === 1;
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { id, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 创建数据
   * @param {<#=tableUp#>Model} model
   * @param {({
   *   uniqueType?: "ignore" | "throw" | "update",
   * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
   *   ignore: 忽略冲突
   *   throw: 抛出异常
   *   update: 更新冲突数据
   * @return {Promise<ResultSetHeader>} 
   * @memberof <#=tableUp#>Dao
   */
  async create(
    model: <#=tableUp#>Model,
    options?: {
      uniqueType?: "ignore" | "throw" | "update",
    },
  ): Promise<ResultSetHeader> {
    const t = this;
    if (!model) {
      return;
    }
    const table = "<#=table#>";
    const method = "create";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { model });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    const context = useContext();<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if ([ "id", "create_usr_id", "create_time", "update_usr_id", "update_time" ].includes(column_name)) continue;
      let data_type = column.DATA_TYPE;
      let column_type = column.COLUMN_TYPE;
      let column_comment = column.COLUMN_COMMENT || "";
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const many2many = column.many2many;
      const isPassword = column.isPassword;
    #><#
      if (selectList.length > 0) {
    #>
    
    // <#=column_comment#>
    if (!isEmpty(model._<#=column_name#>) && model.<#=column_name#> === undefined) {
      model._<#=column_name#> = String(model._<#=column_name#>).trim();<#
        for (let i = 0; i < selectList.length; i++) {
          const item = selectList[i];
          let value = item.value;
          let label = item.label;
          if (typeof(value) === "string") {
            value = `"${ value }"`;
          } else if (typeof(value) === "number") {
            value = value.toString();
          }
      #><#=i>0?" else ":"\n      "#>if (model._<#=column_name#> === "<#=label#>") {
        model.<#=column_name#> = <#=value#>;
      }<#
        }
      #>
    }<#
      } else if (foreignKey && foreignKey.type !== "many2many" && !foreignKey.multiple && foreignKey.lbl) {
        let daoStr = "";
        if (foreignTable !== table) {
          daoStr = `.${ foreignTable }Dao`;
        }
    #>
    
    // <#=column_comment#>
    if (!isEmpty(model._<#=column_name#>) && model.<#=column_name#> === undefined) {
      model._<#=column_name#> = String(model._<#=column_name#>).trim();
      const <#=foreignTable#>Model = await t<#=daoStr#>.findOne({ <#=foreignKey.lbl#>: model._<#=column_name#> });
      if (<#=foreignTable#>Model) {
        model.<#=column_name#> = <#=foreignTable#>Model.id;
      }
    }<#
      } else if (foreignKey && (foreignKey.type === "many2many" || foreignKey.multiple) && foreignKey.lbl) {
    #>
    
    // <#=column_comment#>
    if (!model.<#=column_name#> && model._<#=column_name#>) {
      if (typeof model._<#=column_name#> === "string" || model._<#=column_name#> instanceof String) {
        model._<#=column_name#> = model._<#=column_name#>.split(",");
      }
      model._<#=column_name#> = model._<#=column_name#>.map((item) => item.trim());
      let sql = `
        select
          t.id
        from
          <#=foreignTable#> t
        where
          t.<#=foreignKey.lbl#> in (?)
      `;
      const args = [
        model._<#=column_name#>,
      ];
      interface Result {
        id: string;
      }
      const models = await context.query<Result>(sql, args);
      model.<#=column_name#> = models.map((item) => item.id);
    }<#
      }
    #><#
    }
    #>
    
    const oldModel = await t.findByUnique(model);
    const resultSetHeader = await t.checkByUnique(model, oldModel, options?.uniqueType);
    if (resultSetHeader) {
      return resultSetHeader;
    }
    
    const args = [ ];
    let sql = `
      insert into <#=table#>(
        id
        ,create_time
    `;<#
    if (hasTenant_id) {
    #>
    if (context.tenant_id) {
      sql += `,tenant_id`;
    }<#
    }
    #>
    if (context.getUsr_id() !== undefined) {
      sql += `,create_usr_id`;
    }<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.isVirtual) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      if (column_name === "create_usr_id") continue;
      if (column_name === "create_time") continue;
      let data_type = column.DATA_TYPE;
      let column_type = column.COLUMN_TYPE;
      let column_comment = column.COLUMN_COMMENT || "";
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const many2many = column.many2many;
    #><#
      if (column.isPassword) {
    #>
    if (!isEmpty(model.<#=column_name#>)) {
      sql += `,<#=column_name#>`;
    }<#
      } else if (foreignKey && foreignKey.type === "json") {
    #>
    if (model.<#=column_name#> !== undefined) {
      sql += `,<#=column_name#>`;
    }<#
      } else if (foreignKey && foreignKey.type === "many2many") {
    #><#
      } else if (!foreignKey) {
    #>
    if (model.<#=column_name#> !== undefined) {
      sql += `,<#=column_name#>`;
    }<#
      } else {
    #>
    if (model.<#=column_name#> !== undefined) {
      sql += `,<#=column_name#>`;
    }<#
      }
    #><#
    }
    #>
    sql += `) values(?,?`;
    args.push(model.id);
    args.push(context.getReqDate());<#
    if (hasTenant_id) {
    #>
    if (context.tenant_id) {
      sql += ",?";
      args.push(context.tenant_id);
    }<#
    }
    #>
    if (context.getUsr_id() !== undefined) {
      sql += `,?`;
      args.push(context.getUsr_id());
    }<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.isVirtual) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      if (column_name === "create_usr_id") continue;
      if (column_name === "create_time") continue;
      let data_type = column.DATA_TYPE;
      let column_type = column.COLUMN_TYPE;
      let column_comment = column.COLUMN_COMMENT || "";
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    #><#
      if (column.isPassword) {
    #>
    if (!isEmpty(model.<#=column_name#>)) {
      sql += `,?`;
      args.push(t.authDao.getPassword(model.<#=column_name#>));
    }<#
      } else if (foreignKey && foreignKey.type === "json") {
    #>
    if (model.<#=column_name#> !== undefined) {
      sql += `,?`;
      args.push(model.<#=column_name#>);
    }<#
      } else if (foreignKey && foreignKey.type === "many2many") {
    #><#
      } else if (!foreignKey) {
    #>
    if (model.<#=column_name#> !== undefined) {
      sql += `,?`;
      args.push(model.<#=column_name#>);
    }<#
      } else {
    #>
    if (model.<#=column_name#> !== undefined) {
      sql += `,?`;
      args.push(model.<#=column_name#>);
    }<#
      }
    #><#
    }
    #>
    sql += `)`;
    
    let result = await context.execute(sql, args);<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.isVirtual) continue;
      const column_name = column.COLUMN_NAME;
      if (column_name === "id") continue;
      let data_type = column.DATA_TYPE;
      let column_type = column.COLUMN_TYPE;
      let column_comment = column.COLUMN_COMMENT || "";
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const many2many = column.many2many;
    #><#
      if (foreignKey && foreignKey.type === "json") {
    #><#
      } else if (foreignKey && foreignKey.type === "many2many") {
    #>
    // <#=column_comment#>
    await many2manyUpdate(model, "<#=column_name#>", { table: "<#=many2many.table#>", column1: "<#=many2many.column1#>", column2: "<#=many2many.column2#>" });<#
      } else if (!foreignKey) {
    #><#
      } else {
    #><#
      }
    #><#
    }
    #><#
    if (cache) {
    #>
    
    await t.delCache();<#
    }
    #>
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { model, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }<#
  if (cache) {
  #>
  
  /**
   * 删除缓存
   * @memberof <#=tableUp#>Dao
   */
  async delCache() {
    const table = "<#=table#>";
    const method = "delCache";
    const context = useContext();
    const cacheKey1 = `dao.sql.${ table }`;
    await context.delCache(cacheKey1);
    const foreignTables: string[] = [<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.isVirtual) continue;
      const column_name = column.COLUMN_NAME;
      const foreignKey = column.foreignKey;
      let data_type = column.DATA_TYPE;
      if (!foreignKey) continue;
      const foreignTable = foreignKey.table;
      const foreignTableUp = foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const many2many = column.many2many;
    #><#
      if (foreignKey && foreignKey.type === "many2many") {
    #>
      "<#=many2many.table#>",
      "<#=foreignTable#>",<#
      } else if (foreignKey && !foreignKey.multiple) {
    #>
      "<#=foreignTable#>",<#
      }
    #><#
    }
    #>
    ];
    for (let k = 0; k < foreignTables.length; k++) {
      const foreignTable = foreignTables[k];
      if (foreignTable === table) continue;
      const cacheKey1 = `dao.sql.${ foreignTable }`;
      await context.delCache(cacheKey1);
    }
  }<#
  }
  #>
  
  /**
   * 根据id修改一行数据
   * @param {string} id
   * @param {<#=tableUp#>Model} model
   * @param {({
   *   uniqueType?: "ignore" | "throw" | "update",
   * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
   *   ignore: 忽略冲突
   *   throw: 抛出异常
   *   create: 级联插入新数据
   * @return {Promise<ResultSetHeader>}
   * @memberof <#=tableUp#>Dao
   */
  async updateById(
    id: string,
    model: <#=tableUp#>Model,
    options?: {
      uniqueType?: "ignore" | "throw" | "create",
    },
  ): Promise<ResultSetHeader> {
    const t = this;
    
    const table = "<#=table#>";
    const method = "updateById";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { id, model });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!id || !model) {
      return;
    }
    const context = useContext();<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      const column_name = column.COLUMN_NAME;
      if ([ "id", "create_usr_id", "create_time", "update_usr_id", "update_time" ].includes(column_name)) continue;
      let data_type = column.DATA_TYPE;
      let column_type = column.COLUMN_TYPE;
      let column_comment = column.COLUMN_COMMENT || "";
      let selectList = [ ];
      let selectStr = column_comment.substring(column_comment.indexOf("["), column_comment.lastIndexOf("]")+1).trim();
      if (selectStr) {
        selectList = eval(`(${ selectStr })`);
      }
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const many2many = column.many2many;
      const isPassword = column.isPassword;
    #><#
      if (selectList.length > 0) {
    #>
    
    // <#=column_comment#>
    if (!isEmpty(model._<#=column_name#>) && model.<#=column_name#> === undefined) {
      model._<#=column_name#> = String(model._<#=column_name#>).trim();<#
        for (let i = 0; i < selectList.length; i++) {
          const item = selectList[i];
          let value = item.value;
          let label = item.label;
          if (typeof(value) === "string") {
            value = `"${ value }"`;
          } else if (typeof(value) === "number") {
            value = value.toString();
          }
      #><#=i>0?" else ":"\n      "#>if (model._<#=column_name#> === "<#=label#>") {
        model.<#=column_name#> = <#=value#>;
      }<#
        }
      #>
    }<#
      } else if (foreignKey && foreignKey.type !== "many2many" && !foreignKey.multiple && foreignKey.lbl) {
        let daoStr = "";
        if (foreignTable !== table) {
          daoStr = `.${ foreignTable }Dao`;
        }
    #>
    
    // <#=column_comment#>
    if (!isEmpty(model._<#=column_name#>) && model.<#=column_name#> === undefined) {
      model._<#=column_name#> = String(model._<#=column_name#>).trim();
      const <#=foreignTable#>Model = await t<#=daoStr#>.findOne({ <#=foreignKey.lbl#>: model._<#=column_name#> });
      if (<#=foreignTable#>Model) {
        model.<#=column_name#> = <#=foreignTable#>Model.id;
      }
    }<#
      } else if (foreignKey && (foreignKey.type === "many2many" || foreignKey.multiple) && foreignKey.lbl) {
    #>
  
    // <#=column_comment#>
    if (!model.<#=column_name#> && model._<#=column_name#>) {
      if (typeof model._<#=column_name#> === "string" || model._<#=column_name#> instanceof String) {
        model._<#=column_name#> = model._<#=column_name#>.split(",");
      }
      model._<#=column_name#> = model._<#=column_name#>.map((item) => item.trim());
      let sql = `
        select
          t.id
        from
          <#=foreignTable#> t
        where
          t.<#=foreignKey.lbl#> in (?)
      `;
      const args = [
        model._<#=column_name#>,
      ];
      interface Result {
        id: string;
      }
      const models = await context.query<Result>(sql, args);
      model.<#=column_name#> = models.map((item) => item.id);
    }<#
      }
    #><#
    }
    #>
    
    const oldModel = await t.findByUnique(model);
    if (oldModel) {
      if (oldModel.id !== id && options?.uniqueType !== "create") {
        const resultSetHeader = await t.checkByUnique(model, oldModel, options?.uniqueType);
        if (resultSetHeader) {
          return resultSetHeader;
        }
      }
    } else {
      if (options?.uniqueType === "create") {
        const resultSetHeader = await t.create({ ...model, id });
        return resultSetHeader;
      }
    }
    
    const args = [ ];
    let sql = `
      update <#=table#> set update_time = ?
    `;
    args.push(context.getReqDate());
    if (context.getUsr_id() !== undefined) {
      sql += `,update_usr_id = ?`;
      args.push(context.getUsr_id());
    }<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.isVirtual) continue;
      const column_name = column.COLUMN_NAME;
      if ([ "id", "create_usr_id", "create_time", "update_usr_id", "update_time" ].includes(column_name)) continue;
      let data_type = column.DATA_TYPE;
      let column_type = column.COLUMN_TYPE;
      let column_comment = column.COLUMN_COMMENT || "";
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
    #><#
      if (column.isPassword) {
    #>
    if (!isEmpty(model.<#=column_name#>)) {
      sql += `,<#=column_name#> = ?`;
      args.push(t.authDao.getPassword(model.<#=column_name#>));
    }<#
      } else if (foreignKey && foreignKey.type === "json") {
    #>
    if (model.<#=column_name#> !== undefined) {
      if (isEmpty(model.<#=column_name#>)) {
        model.<#=column_name#> = null;
      }
      if (model.<#=column_name#> != oldModel?.<#=column_name#>) {
        sql += `,<#=column_name#> = ?`;
        args.push(model.<#=column_name#>);
      }
    }<#
      } else if (foreignKey && foreignKey.type === "many2many") {
    #><#
      } else if (!foreignKey) {
    #>
    if (model.<#=column_name#> !== undefined) {
      if (model.<#=column_name#> != oldModel?.<#=column_name#>) {
        sql += `,<#=column_name#> = ?`;
        args.push(model.<#=column_name#>);
      }
    }<#
      } else {
    #>
    if (model.<#=column_name#> !== undefined) {
      if (model.<#=column_name#> != oldModel?.<#=column_name#>) {
        sql += `,<#=column_name#> = ?`;
        args.push(model.<#=column_name#>);
      }
    }<#
      }
    #><#
    }
    #>
    sql += ` where id = ? limit 1`;
    args.push(id);
    
    let result = await context.execute(sql, args);<#
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.ignoreCodegen) continue;
      if (column.isVirtual) continue;
      const column_name = column.COLUMN_NAME;
      if ([ "id", "create_usr_id", "create_time", "update_usr_id", "update_time" ].includes(column_name)) continue;
      let data_type = column.DATA_TYPE;
      let column_type = column.COLUMN_TYPE;
      let column_comment = column.COLUMN_COMMENT || "";
      if (column_comment.indexOf("[") !== -1) {
        column_comment = column_comment.substring(0, column_comment.indexOf("["));
      }
      const foreignKey = column.foreignKey;
      const foreignTable = foreignKey && foreignKey.table;
      const foreignTableUp = foreignTable && foreignTable.substring(0, 1).toUpperCase()+foreignTable.substring(1);
      const many2many = column.many2many;
    #><#
      if (foreignKey && foreignKey.type === "json") {
    #><#
      } else if (foreignKey && foreignKey.type === "many2many") {
    #>
    // <#=column_comment#>
    await many2manyUpdate({ ...model, id }, "<#=column_name#>", { table: "<#=many2many.table#>", column1: "<#=many2many.column1#>", column2: "<#=many2many.column2#>" });<#
      } else if (!foreignKey) {
    #><#
      } else {
    #><#
      }
    #><#
    }
    #><#
    if (cache) {
    #>
    
    await t.delCache();<#
    }
    #>
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { id, model, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 根据 ids 删除数据
   * @param {string[]} ids
   * @return {Promise<number>}
   * @memberof <#=tableUp#>Dao
   */
  async deleteByIds(
    ids: string[],
  ): Promise<number> {
    const t = this;
    
    const table = "<#=table#>";
    const method = "deleteByIds";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { ids });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!ids || !ids.length) {
      return 0;
    }
    
    const context = useContext();
    
    let num = 0;
    let sql = `
      update <#=table#> set is_deleted = 1,delete_time = ? where id = ? limit 1
    `;
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const args = [ context.getReqDate(), id ];
      const result = await context.execute(sql, args);
      num += result.affectedRows;
    }<#
    if (cache) {
    #>
    await t.delCache();<#
    }
    #>
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { ids, num });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return num;
  }
  
  
  /**
   * 根据 ids 还原数据
   * @param {string[]} ids
   * @return {Promise<number>}
   * @memberof <#=tableUp#>Dao
   */
  async revertByIds(
    ids: string[],
  ): Promise<number> {
    const t = this;
    
    const table = "<#=table#>";
    const method = "create";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { ids });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!ids || !ids.length) {
      return 0;
    }
    
    const context = useContext();
    
    let num = 0;
    let sql = `
      update <#=table#> set is_deleted = 0 where id = ? limit 1
    `;
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const args = [ id ];
      const result = await context.execute(sql, args);
      num += result.affectedRows;
    }<#
    if (cache) {
    #>
    await t.delCache();<#
    }
    #>
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { ids, num });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return num;
  }<#
  if (hasOrderBy) {
  #>
    
  /**
   * 查找 order_by 字段的最大值
   * @return {Promise<number>}
   * @memberof <#=tableUp#>Dao
   */
  async findLastOrderBy(): Promise<number> {
    const t = this;
    
    const table = "<#=table#>";
    const method = "findLastOrderBy";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    const context = useContext();
    let sql = `
      select
        t.order_by order_by
      from <#=table#> t
    `;
    const whereQuery = [ ];
    let args = [ ];<#
    if (hasTenant_id) {
    #>
    whereQuery.push("t.tenant_id = ?");
    args.push(context.tenant_id);<#
    }
    #>
    if (whereQuery.length > 0) {
      sql += " where " + whereQuery.join(" and ");
    }
    sql += `
      order by
        t.order_by desc
      limit 1
    `;
    
    interface Result {
      order_by: number;
    }
    let model = await context.queryOne<Result>(sql, args);
    let result = model?.order_by || 1;
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }<#
  }
  #>
  
}
