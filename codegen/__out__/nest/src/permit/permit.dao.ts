import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ResultSetHeader } from "mysql2/promise";
import { useContext } from "../common/interceptors/context.interceptor";
import { PageModel } from "../common/page.model";
import { isEmpty, sqlLike } from "../common/util/StringUitl";
import { UniqueException } from "../common/exceptions/unique.execption";
import { many2manyUpdate, setModelIds } from "../common/util/DaoUtil";
import { PermitModel, PermitSearch } from "./permit.model";
import { MenuDao } from "../menu/menu.dao";

@Injectable()
export class PermitDao {
  
  constructor(
    private readonly eventEmitter2: EventEmitter2,
    private readonly menuDao: MenuDao,
  ) { }
  
  getWhereQuery(
    args: any[],
    search?: PermitSearch,
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
    if (search?.menu_id && search?.menu_id.length > 0) {
      whereQuery += ` and menu.id in (?)`;
      args.push(search.menu_id);
    }
    if (search?.menu__lbl && search.menu__lbl?.length > 0) {
      whereQuery += ` and menu__lbl in (?)`;
      args.push(search.menu__lbl);
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
    return whereQuery;
  }
  
  getFromQuery() {
    let fromQuery = `
      permit t
      left join menu
        on menu.id = t.menu_id
    `;
    return fromQuery;
  }
  
  /**
   * 根据条件查找总数据数
   * @param {PermitSearch} [search]
   * @return {Promise<number>}
   * @memberof PermitDao
   */
  async findCount(
    search?: PermitSearch,
  ): Promise<number> {
    const t = this;
    
    const table = "permit";
    const method = "findCount";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    const context = useContext();
    const args = [ ];
    let sql = `
      select
        count(1) total
      from
        ${ t.getFromQuery() }
      where
        ${ t.getWhereQuery(args, search) }
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
   * @param {PermitSearch} search 搜索条件
   * @memberof PermitDao
   */
  async findAll(
    search?: PermitSearch,
    pageModel?: PageModel,
  ) {
    const t = this;
    
    const table = "permit";
    const method = "findAll";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return <typeof result>beforeEvent.data;
    
    const context = useContext();
    const args = [ ];
    let sql = `
      select t.*
          ,menu.lbl _menu_id
      from
        ${ t.getFromQuery() }
      where
        ${ t.getWhereQuery(args, search) }
      group by t.id
    `;
    if (search?.orderBy) {
      sql += ` order by ${ context.escapeId(search.orderBy) } ${ context.escapeDec(search.orderDec) }`;
    }
    if (pageModel?.pgSize) {
      sql += ` limit ${ Number(pageModel?.pgOffset) || 0 },${ Number(pageModel.pgSize) }`;
    }
    
    const cacheKey1 = `dao.sql.${ table }`;
    const cacheKey2 = JSON.stringify({ sql, args });
    
    let result = await context.query<PermitModel>(sql, args, { cacheKey1, cacheKey2 });
    for (let i = 0; i < result.length; i++) {
      const model = result[i];
    }
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { search, result });
    if (afterEvent?.isReturn) return <typeof result>afterEvent.data;
    
    return result;
  }
  
  /**
   * 获得表的唯一字段名列表
   * @return {{ uniqueKeys: string[]; uniqueComments: { [key: string]: string }; }}
   * @memberof PermitDao
   */
  getUniqueKeys(
  ): {
    uniqueKeys: string[];
    uniqueComments: { [key: string]: string };
    } {
    const uniqueKeys = [
      "menu_id",
      "lbl",
    ];
    const uniqueComments = {
      menu_id: "菜单",
      lbl: "名称",
    };
    return { uniqueKeys, uniqueComments };
  }
  
  /**
   * 通过唯一约束获得一行数据
   * @param {PermitSearch} search0
   * @memberof PermitDao
   */
  async findByUnique(
    search0: PermitSearch | PermitModel,
  ) {
    const t = this;
    const { uniqueKeys } = t.getUniqueKeys();
    if (!uniqueKeys || uniqueKeys.length === 0) return;
    const search: PermitSearch = { };
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
   * @param {PermitModel} oldModel
   * @param {PermitModel} model
   * @return {boolean}
   * @memberof PermitDao
   */
  equalsByUnique(
    oldModel: PermitModel,
    model: PermitModel,
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
   * @param {PermitModel} model
   * @param {PermitModel} oldModel
   * @param {("ignore" | "throw" | "update")} uniqueType
   * @return {Promise<ResultSetHeader>}
   * @memberof PermitDao
   */
  async checkByUnique(
    model: PermitModel,
    oldModel: PermitModel,
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
   * @param {PermitSearch} search?
   * @return {Promise<PermitModel>} 
   * @memberof PermitDao
   */
  async findOne(
    search?: PermitSearch,
  ): Promise<PermitModel> {
    const t = this;
    const pageModel: PageModel = {
      pgOffset: 0,
      pgSize: 1,
    };
    const [ model ] = await t.findAll(search, pageModel);
    return model;
  }
  
  /**
   * 根据id查找数据
   * @param {string} id
   * @return {Promise<PermitModel>}
   * @memberof PermitDao
   */
  async findById(
    id: string,
  ): Promise<PermitModel> {
    const t = this;
    if (!id) return;
    const model = await t.findOne({ id });
    return model;
  }
  
  /**
   * 根据搜索条件判断数据是否存在
   * @param {PermitSearch} search?
   * @return {Promise<boolean>} 
   * @memberof PermitDao
   */
  async exist(
    search?: PermitSearch,
  ): Promise<boolean> {
    const t = this;
    const model = await t.findOne(search);
    const exist = !!model;
    return exist;
  }
  
  /**
   * 根据id判断数据是否存在
   * @param {string} id
   * @memberof PermitDao
   */
  async existById(
    id: string,
  ): Promise<boolean> {
    const t = this;
    const table = "permit";
    const method = "existById";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { id });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!id) {
      return false;
    }
    
    const context = useContext();
    let sql = `
      select 1 e from permit where id = ? limit 1
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
   * @param {PermitModel} model
   * @param {({
   *   uniqueType?: "ignore" | "throw" | "update",
   * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
   *   ignore: 忽略冲突
   *   throw: 抛出异常
   *   update: 更新冲突数据
   * @return {Promise<ResultSetHeader>} 
   * @memberof PermitDao
   */
  async create(
    model: PermitModel,
    options?: {
      uniqueType?: "ignore" | "throw" | "update",
    },
  ): Promise<ResultSetHeader> {
    const t = this;
    if (!model) {
      return;
    }
    const table = "permit";
    const method = "create";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { model });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    const context = useContext();
    
    // 菜单
    if (!isEmpty(model._menu_id) && model.menu_id === undefined) {
      model._menu_id = String(model._menu_id).trim();
      const menuModel = await t.menuDao.findOne({ lbl: model._menu_id });
      if (menuModel) {
        model.menu_id = menuModel.id;
      }
    }
    
    const oldModel = await t.findByUnique(model);
    const resultSetHeader = await t.checkByUnique(model, oldModel, options?.uniqueType);
    if (resultSetHeader) {
      return resultSetHeader;
    }
    
    const args = [ ];
    let sql = `
      insert into permit(
        id
        ,create_time
    `;
    if (context.tenant_id) {
      sql += `,tenant_id`;
    }
    if (context.getUsr_id() !== undefined) {
      sql += `,create_usr_id`;
    }
    if (model.menu_id !== undefined) {
      sql += `,menu_id`;
    }
    if (model.lbl !== undefined) {
      sql += `,lbl`;
    }
    if (model.rem !== undefined) {
      sql += `,rem`;
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
    if (model.menu_id !== undefined) {
      sql += `,?`;
      args.push(model.menu_id);
    }
    if (model.lbl !== undefined) {
      sql += `,?`;
      args.push(model.lbl);
    }
    if (model.rem !== undefined) {
      sql += `,?`;
      args.push(model.rem);
    }
    sql += `)`;
    
    let result = await context.execute(sql, args);
    
    await t.delCache();
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { model, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 删除缓存
   * @memberof PermitDao
   */
  async delCache() {
    const table = "permit";
    const method = "delCache";
    const context = useContext();
    const cacheKey1 = `dao.sql.${ table }`;
    await context.delCache(cacheKey1);
    const foreignTables: string[] = [
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
   * @param {PermitModel} model
   * @param {({
   *   uniqueType?: "ignore" | "throw" | "update",
   * })} options? 唯一约束冲突时的处理选项, 默认为 throw,
   *   ignore: 忽略冲突
   *   throw: 抛出异常
   *   create: 级联插入新数据
   * @return {Promise<ResultSetHeader>}
   * @memberof PermitDao
   */
  async updateById(
    id: string,
    model: PermitModel,
    options?: {
      uniqueType?: "ignore" | "throw" | "create",
    },
  ): Promise<ResultSetHeader> {
    const t = this;
    
    const table = "permit";
    const method = "updateById";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { id, model });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!id || !model) {
      return;
    }
    const context = useContext();
    
    // 菜单
    if (!isEmpty(model._menu_id) && model.menu_id === undefined) {
      model._menu_id = String(model._menu_id).trim();
      const menuModel = await t.menuDao.findOne({ lbl: model._menu_id });
      if (menuModel) {
        model.menu_id = menuModel.id;
      }
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
      update permit set update_time = ?
    `;
    args.push(context.getReqDate());
    if (context.getUsr_id() !== undefined) {
      sql += `,update_usr_id = ?`;
      args.push(context.getUsr_id());
    }
    if (model.menu_id !== undefined) {
      if (model.menu_id != oldModel?.menu_id) {
        sql += `,menu_id = ?`;
        args.push(model.menu_id);
      }
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
    sql += ` where id = ? limit 1`;
    args.push(id);
    
    let result = await context.execute(sql, args);
    
    await t.delCache();
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { id, model, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 根据 ids 删除数据
   * @param {string[]} ids
   * @return {Promise<number>}
   * @memberof PermitDao
   */
  async deleteByIds(
    ids: string[],
  ): Promise<number> {
    const t = this;
    
    const table = "permit";
    const method = "deleteByIds";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { ids });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!ids || !ids.length) {
      return 0;
    }
    
    const context = useContext();
    
    let num = 0;
    let sql = `
      update permit set is_deleted = 1,delete_time = ? where id = ? limit 1
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
   * @memberof PermitDao
   */
  async revertByIds(
    ids: string[],
  ): Promise<number> {
    const t = this;
    
    const table = "permit";
    const method = "create";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { ids });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!ids || !ids.length) {
      return 0;
    }
    
    const context = useContext();
    
    let num = 0;
    let sql = `
      update permit set is_deleted = 0 where id = ? limit 1
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
