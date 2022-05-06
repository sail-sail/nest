import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ResultSetHeader } from "mysql2/promise";
import { useContext } from "../common/interceptors/context.interceptor";
import { Page, Sort } from "../common/page.model";
import { isEmpty, sqlLike } from "../common/util/StringUitl";
import { UniqueException } from "../common/exceptions/unique.execption";
import { many2manyUpdate, setModelIds } from "../common/util/DaoUtil";
import { RoleModel, RoleSearch } from "./role.model";

@Injectable()
export class RoleDao {
  
  constructor(
    private readonly eventEmitter2: EventEmitter2,
  ) { }
  
  getWhereQuery(
    args: any[],
    search?: RoleSearch,
  ) {
    const context = useContext();
    let whereQuery = "";
    whereQuery += ` t.is_deleted = ?`;
    args.push(search?.is_deleted == null ? 0 : search.is_deleted);
    if (context.tenant_id) {
      whereQuery += ` and t.tenant_id = ?`;
      args.push(context.tenant_id);
    }
    if (!isEmpty(search?.id)) {
      whereQuery += ` and t.id = ?`;
      args.push(search.id);
    }
    if (search?.ids && search?.ids.length > 0) {
      whereQuery += ` and t.id in (?)`;
      args.push(search.ids);
    }
    if (search?.lbl !== undefined) {
      whereQuery += ` and t.lbl = ?`;
      args.push(search.lbl);
    }
    if (!isEmpty(search?.lblLike)) {
      whereQuery += ` and t.lbl like ?`;
      args.push(sqlLike(search.lblLike) + "%");
    }
    if (search?.rem !== undefined) {
      whereQuery += ` and t.rem = ?`;
      args.push(search.rem);
    }
    if (!isEmpty(search?.remLike)) {
      whereQuery += ` and t.rem like ?`;
      args.push(sqlLike(search.remLike) + "%");
    }
    if (search?.is_enabled && search?.is_enabled?.length > 0) {
      whereQuery += ` and t.is_enabled in (?)`;
      args.push(search.is_enabled);
    }
    if (search?.menu_ids && search?.menu_ids.length > 0) {
      whereQuery += ` and menu.id in (?)`;
      args.push(search.menu_ids);
    }
    if (search?._menu_ids && search._menu_ids?.length > 0) {
      whereQuery += ` and _menu_ids in (?)`;
      args.push(search._menu_ids);
    }
    return whereQuery;
  }
  
  getFromQuery() {
    let fromQuery = `
      role t
      left join role_menu
        on role_menu.role_id = t.id
        and role_menu.is_deleted = 0
      left join menu
        on role_menu.menu_id = menu.id
        and menu.is_deleted = 0
      left join (
        select
          json_arrayagg(menu.id) menu_ids,
          json_arrayagg(menu.lbl) _menu_ids,
          role.id role_id
        from role_menu
        inner join menu
          on menu.id = role_menu.menu_id
          and menu.is_deleted = 0
        inner join role
          on role.id = role_menu.role_id
          and role.is_deleted = 0
        where
          role_menu.is_deleted = 0
        group by role_id
      ) _menu
        on _menu.role_id = t.id
    `;
    return fromQuery;
  }
  
  /**
   * 根据条件查找总数据数
   * @param {RoleSearch} search?
   * @return {Promise<number>}
   * @memberof RoleDao
   */
  async findCount(
    search?: RoleSearch,
  ): Promise<number> {
    const t = this;
    
    const table = "role";
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
    `;
    
    const cacheKey1 = `dao.sql.${ table }`;
    const cacheKey2 = JSON.stringify({ sql, args });
    
    interface Result {
      total: number,
    }
    const model = await context.queryOne<Result>(sql, args, { cacheKey1, cacheKey2 });
    let result = model?.total || 0;
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { search, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 根据搜索条件和分页查找数据
   * @param {RoleSearch} search? 搜索条件
   * @param {Sort|Sort[]} sort? 排序
   * @memberof RoleDao
   */
  async findAll(
    search?: RoleSearch,
    page?: Page,
    sort?: Sort|Sort[],
  ) {
    const t = this;
    
    const table = "role";
    const method = "findAll";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return <typeof result>beforeEvent.data;
    
    const context = useContext();
    const args = [ ];
    let sql = `
      select t.*
          ,max(menu_ids) menu_ids
          ,max(_menu_ids) _menu_ids
      from
        ${ t.getFromQuery() }
      where
        ${ t.getWhereQuery(args, search) }
      group by t.id
    `;
    
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
    }
    
    // 分页
    if (page?.pgSize) {
      sql += ` limit ${ Number(page?.pgOffset) || 0 },${ Number(page.pgSize) }`;
    }
    
    // 缓存
    const cacheKey1 = `dao.sql.${ table }`;
    const cacheKey2 = JSON.stringify({ sql, args });
    
    let result = await context.query<RoleModel>(sql, args, { cacheKey1, cacheKey2 });
    for (let i = 0; i < result.length; i++) {
      const model = result[i];
      // 启用
      let _is_enabled = "";
      if (model.is_enabled === 1) {
        _is_enabled = "是";
      } else if (model.is_enabled === 0) {
        _is_enabled = "否";
      } else {
        _is_enabled = String(model.is_enabled);
      }
      model._is_enabled = _is_enabled;
    }
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { search, result });
    if (afterEvent?.isReturn) return <typeof result>afterEvent.data;
    
    return result;
  }
  
  /**
   * 获得表的唯一字段名列表
   * @return {{ uniqueKeys: string[]; uniqueComments: { [key: string]: string }; }}
   * @memberof RoleDao
   */
  getUniqueKeys(
  ): {
    uniqueKeys: string[];
    uniqueComments: { [key: string]: string };
    } {
    const uniqueKeys = [
      "lbl",
    ];
    const uniqueComments = {
      lbl: "名称",
    };
    return { uniqueKeys, uniqueComments };
  }
  
  /**
   * 通过唯一约束获得一行数据
   * @param {RoleSearch} search0
   * @memberof RoleDao
   */
  async findByUnique(
    search0: RoleSearch | RoleModel,
  ) {
    const t = this;
    const { uniqueKeys } = t.getUniqueKeys();
    if (!uniqueKeys || uniqueKeys.length === 0) return;
    const search: RoleSearch = { };
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
   * @param {RoleModel} oldModel
   * @param {RoleModel} model
   * @return {boolean}
   * @memberof RoleDao
   */
  equalsByUnique(
    oldModel: RoleModel,
    model: RoleModel,
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
   * @param {RoleModel} model
   * @param {RoleModel} oldModel
   * @param {("ignore" | "throw" | "update")} uniqueType
   * @return {Promise<ResultSetHeader>}
   * @memberof RoleDao
   */
  async checkByUnique(
    model: RoleModel,
    oldModel: RoleModel,
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
  }
  
  /**
   * 根据条件查找第一条数据
   * @param {RoleSearch} search?
   * @return {Promise<RoleModel>} 
   * @memberof RoleDao
   */
  async findOne(
    search?: RoleSearch,
  ): Promise<RoleModel> {
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
   * @return {Promise<RoleModel>}
   * @memberof RoleDao
   */
  async findById(
    id: string,
  ): Promise<RoleModel> {
    const t = this;
    if (!id) return;
    const model = await t.findOne({ id });
    return model;
  }
  
  /**
   * 根据搜索条件判断数据是否存在
   * @param {RoleSearch} search?
   * @return {Promise<boolean>} 
   * @memberof RoleDao
   */
  async exist(
    search?: RoleSearch,
  ): Promise<boolean> {
    const t = this;
    const model = await t.findOne(search);
    const exist = !!model;
    return exist;
  }
  
  /**
   * 根据id判断数据是否存在
   * @param {string} id
   * @memberof RoleDao
   */
  async existById(
    id: string,
  ): Promise<boolean> {
    const t = this;
    const table = "role";
    const method = "existById";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { id });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!id) {
      return false;
    }
    
    const context = useContext();
    let sql = `
      select 1 e from role where id = ? limit 1
    `;
    let args = [ id ];
    
    const cacheKey1 = `dao.sql.${ table }`;
    const cacheKey2 = JSON.stringify({ sql, args });
    
    interface Result {
      e: number,
    }
    let model = await context.queryOne<Result>(sql, args, { cacheKey1, cacheKey2 });
    let result = model?.e === 1;
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { id, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 创建数据
   * @param {RoleModel} model
   * @param {({
   *   uniqueType?: "ignore" | "throw" | "update",
   * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
   *   ignore: 忽略冲突
   *   throw: 抛出异常
   *   update: 更新冲突数据
   * @return {Promise<ResultSetHeader>} 
   * @memberof RoleDao
   */
  async create(
    model: RoleModel,
    options?: {
      uniqueType?: "ignore" | "throw" | "update",
    },
  ): Promise<ResultSetHeader> {
    const t = this;
    if (!model) {
      return;
    }
    const table = "role";
    const method = "create";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { model });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    const context = useContext();
    
    // 启用
    if (!isEmpty(model._is_enabled) && model.is_enabled === undefined) {
      model._is_enabled = String(model._is_enabled).trim();
      if (model._is_enabled === "是") {
        model.is_enabled = 1;
      } else if (model._is_enabled === "否") {
        model.is_enabled = 0;
      }
    }
    
    // 菜单
    if (!model.menu_ids && model._menu_ids) {
      if (typeof model._menu_ids === "string" || model._menu_ids instanceof String) {
        model._menu_ids = model._menu_ids.split(",");
      }
      model._menu_ids = model._menu_ids.map((item) => item.trim());
      let sql = `
        select
          t.id
        from
          menu t
        where
          t.lbl in (?)
      `;
      const args = [
        model._menu_ids,
      ];
      interface Result {
        id: string;
      }
      const models = await context.query<Result>(sql, args);
      model.menu_ids = models.map((item) => item.id);
    }
    
    const oldModel = await t.findByUnique(model);
    const resultSetHeader = await t.checkByUnique(model, oldModel, options?.uniqueType);
    if (resultSetHeader) {
      return resultSetHeader;
    }
    
    const args = [ ];
    let sql = `
      insert into role(
        id
        ,create_time
    `;
    if (context.tenant_id) {
      sql += `,tenant_id`;
    }
    if (context.getUsr_id() !== undefined) {
      sql += `,create_usr_id`;
    }
    if (model.lbl !== undefined) {
      sql += `,lbl`;
    }
    if (model.rem !== undefined) {
      sql += `,rem`;
    }
    if (model.is_enabled !== undefined) {
      sql += `,is_enabled`;
    }
    sql += `) values(?,?`;
    args.push(model.id);
    args.push(context.getReqDate());
    if (context.tenant_id) {
      sql += ",?";
      args.push(context.tenant_id);
    }
    if (context.getUsr_id() !== undefined) {
      sql += `,?`;
      args.push(context.getUsr_id());
    }
    if (model.lbl !== undefined) {
      sql += `,?`;
      args.push(model.lbl);
    }
    if (model.rem !== undefined) {
      sql += `,?`;
      args.push(model.rem);
    }
    if (model.is_enabled !== undefined) {
      sql += `,?`;
      args.push(model.is_enabled);
    }
    sql += `)`;
    
    let result = await context.execute(sql, args);
    // 菜单
    await many2manyUpdate(model, "menu_ids", { table: "role_menu", column1: "role_id", column2: "menu_id" });
    
    await t.delCache();
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { model, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 删除缓存
   * @memberof RoleDao
   */
  async delCache() {
    const table = "role";
    const method = "delCache";
    const context = useContext();
    const cacheKey1 = `dao.sql.${ table }`;
    await context.delCache(cacheKey1);
    const foreignTables: string[] = [
      "role_menu",
      "menu",
    ];
    for (let k = 0; k < foreignTables.length; k++) {
      const foreignTable = foreignTables[k];
      if (foreignTable === table) continue;
      const cacheKey1 = `dao.sql.${ foreignTable }`;
      await context.delCache(cacheKey1);
    }
  }
  
  /**
   * 根据id修改一行数据
   * @param {string} id
   * @param {RoleModel} model
   * @param {({
   *   uniqueType?: "ignore" | "throw" | "update",
   * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
   *   ignore: 忽略冲突
   *   throw: 抛出异常
   *   create: 级联插入新数据
   * @return {Promise<ResultSetHeader>}
   * @memberof RoleDao
   */
  async updateById(
    id: string,
    model: RoleModel,
    options?: {
      uniqueType?: "ignore" | "throw" | "create",
    },
  ): Promise<ResultSetHeader> {
    const t = this;
    
    const table = "role";
    const method = "updateById";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { id, model });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!id || !model) {
      return;
    }
    const context = useContext();
    
    // 启用
    if (!isEmpty(model._is_enabled) && model.is_enabled === undefined) {
      model._is_enabled = String(model._is_enabled).trim();
      if (model._is_enabled === "是") {
        model.is_enabled = 1;
      } else if (model._is_enabled === "否") {
        model.is_enabled = 0;
      }
    }
  
    // 菜单
    if (!model.menu_ids && model._menu_ids) {
      if (typeof model._menu_ids === "string" || model._menu_ids instanceof String) {
        model._menu_ids = model._menu_ids.split(",");
      }
      model._menu_ids = model._menu_ids.map((item) => item.trim());
      let sql = `
        select
          t.id
        from
          menu t
        where
          t.lbl in (?)
      `;
      const args = [
        model._menu_ids,
      ];
      interface Result {
        id: string;
      }
      const models = await context.query<Result>(sql, args);
      model.menu_ids = models.map((item) => item.id);
    }
    
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
      update role set update_time = ?
    `;
    args.push(context.getReqDate());
    if (context.getUsr_id() !== undefined) {
      sql += `,update_usr_id = ?`;
      args.push(context.getUsr_id());
    }
    if (model.lbl !== undefined) {
      if (model.lbl != oldModel?.lbl) {
        sql += `,lbl = ?`;
        args.push(model.lbl);
      }
    }
    if (model.rem !== undefined) {
      if (model.rem != oldModel?.rem) {
        sql += `,rem = ?`;
        args.push(model.rem);
      }
    }
    if (model.is_enabled !== undefined) {
      if (model.is_enabled != oldModel?.is_enabled) {
        sql += `,is_enabled = ?`;
        args.push(model.is_enabled);
      }
    }
    sql += ` where id = ? limit 1`;
    args.push(id);
    
    let result = await context.execute(sql, args);
    // 菜单
    await many2manyUpdate({ ...model, id }, "menu_ids", { table: "role_menu", column1: "role_id", column2: "menu_id" });
    
    await t.delCache();
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { id, model, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 根据 ids 删除数据
   * @param {string[]} ids
   * @return {Promise<number>}
   * @memberof RoleDao
   */
  async deleteByIds(
    ids: string[],
  ): Promise<number> {
    const t = this;
    
    const table = "role";
    const method = "deleteByIds";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { ids });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!ids || !ids.length) {
      return 0;
    }
    
    const context = useContext();
    
    let num = 0;
    let sql = `
      update role set is_deleted = 1,delete_time = ? where id = ? limit 1
    `;
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const args = [ context.getReqDate(), id ];
      const result = await context.execute(sql, args);
      num += result.affectedRows;
    }
    await t.delCache();
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { ids, num });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return num;
  }
  
  
  /**
   * 根据 ids 还原数据
   * @param {string[]} ids
   * @return {Promise<number>}
   * @memberof RoleDao
   */
  async revertByIds(
    ids: string[],
  ): Promise<number> {
    const t = this;
    
    const table = "role";
    const method = "create";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { ids });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!ids || !ids.length) {
      return 0;
    }
    
    const context = useContext();
    
    let num = 0;
    let sql = `
      update role set is_deleted = 0 where id = ? limit 1
    `;
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const args = [ id ];
      const result = await context.execute(sql, args);
      num += result.affectedRows;
    }
    await t.delCache();
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { ids, num });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return num;
  }
  
}
