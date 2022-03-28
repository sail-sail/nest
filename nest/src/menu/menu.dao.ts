import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ResultSetHeader } from "mysql2/promise";
import { useContext } from "../common/interceptors/context.interceptor";
import { PageModel } from "../common/page.model";
import { isEmpty, sqlLike } from "../common/util/StringUitl";
import { many2manyUpdate, setModelIds } from "../common/util/DaoUtil";
import { MenuModel, MenuSearch } from "./menu.model";

@Injectable()
export class MenuDao {
  
  constructor(
    private readonly eventEmitter2: EventEmitter2,
  ) { }
  
  private getWhereQuery(
    args: any[],
    search?: MenuSearch,
  ) {
    const context = useContext();
    let whereQuery = "";
    whereQuery += ` t.is_deleted = ?`;
    args.push(search?.is_deleted == null ? 0 : search.is_deleted);
    if (!isEmpty(search?.id)) {
      whereQuery += ` and t.id = ?`;
      args.push(search.id);
    }
    if (search?.type && search?.type?.length > 0) {
      whereQuery += ` and t.type in (?)`;
      args.push(search.type);
    }
    if (search?.menu_id && search?.menu_id.length > 0) {
      whereQuery += ` and t.menu_id in (?)`;
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
    if (search?.route_path !== undefined) {
      whereQuery += ` and t.route_path = ?`;
      args.push(search.route_path);
    }
    if (!isEmpty(search?.route_pathLike)) {
      whereQuery += ` and t.route_path like ?`;
      args.push(sqlLike(search.route_pathLike) + "%");
    }
    if (search?.route_query !== undefined) {
      whereQuery += ` and t.route_query = ?`;
      args.push(search.route_query);
    }
    if (!isEmpty(search?.route_queryLike)) {
      whereQuery += ` and t.route_query like ?`;
      args.push(sqlLike(search.route_queryLike) + "%");
    }
    if (search?.is_enabled && search?.is_enabled?.length > 0) {
      whereQuery += ` and t.is_enabled in (?)`;
      args.push(search.is_enabled);
    }
    if (!isEmpty(search?.order_by)) {
      whereQuery += ` and t.order_by = ?`;
      args.push(search.order_by);
    }
    if (!isEmpty(search?.order_byGt)) {
      whereQuery += ` and t.order_by > ?`;
      args.push(search.order_byGt);
    }
    if (!isEmpty(search?.order_byLt)) {
      whereQuery += ` and t.order_by < ?`;
      args.push(search.order_byLt);
    }
    if (!isEmpty(search?.order_byGtEq)) {
      whereQuery += ` and t.order_by >= ?`;
      args.push(search.order_byGtEq);
    }
    if (!isEmpty(search?.order_byLtEq)) {
      whereQuery += ` and t.order_by <= ?`;
      args.push(search.order_byLtEq);
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
  
  /**
   * 根据条件查找总数据数
   * @param {MenuSearch} [search]
   * @return {Promise<number>}
   * @memberof MenuDao
   */
  async findCount(
    search?: MenuSearch,
  ): Promise<number> {
    const t = this;
    
    const table = "menu";
    const method = "findCount";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    const context = useContext();
    const args = [ ];
    let sql = `
      select
        count(1) total
      from menu t
        left join menu
          on menu.id = t.menu_id
      where
        ${ t.getWhereQuery(args, search) }
    `;
    
    const cacheKey1 = `dao.sql.${ table }`;
    const cacheKey2 = JSON.stringify({ sql, args });
    
    const model = await context.queryOne<{
      total: number,
    }>(sql, args, { cacheKey1, cacheKey2 });
    let result = model?.total || 0;
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { search, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 根据搜索条件和分页查找数据
   * @param {MenuSearch} search 搜索条件
   * @memberof MenuDao
   */
  async findAll(
    search?: MenuSearch,
    pageModel?: PageModel,
  ) {
    const t = this;
    
    const table = "menu";
    const method = "findAll";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return <typeof result>beforeEvent.data;
    
    const context = useContext();
    const args = [ ];
    let sql = `
      select t.*
          ,menu.lbl _menu_id
      from menu t
        left join menu
          on menu.id = t.menu_id
      where
        ${ t.getWhereQuery(args, search) }
      group by t.id
    `;
    if (!search) {
      search = { };
    }
    if (!search.orderBy) {
      search.orderBy = "order_by";
      search.orderDec = "ascending";
    }
    if (search.orderBy) {
      sql += ` order by ${ context.escapeId(search.orderBy) } ${ context.escapeDec(search.orderDec) }`;
    }
    if (pageModel?.pgSize) {
      sql += ` limit ${ Number(pageModel?.pgOffset) || 0 },${ Number(pageModel.pgSize) }`;
    }
    
    const cacheKey1 = `dao.sql.${ table }`;
    const cacheKey2 = JSON.stringify({ sql, args });
    
    let result = await context.query<MenuModel>(sql, args, { cacheKey1, cacheKey2 });
    for (let i = 0; i < result.length; i++) {
      const model = result[i];
      // 类型
      let _type = "";
      if (model.type === "pc") {
        _type = "电脑端";
      } else if (model.type === "mobile") {
        _type = "手机端";
      } else {
        _type = String(model.type);
      }
      model._type = _type;
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
   * 根据条件查找第一条数据
   * @param {MenuSearch} [search]
   * @return {Promise<MenuModel>} 
   * @memberof MenuDao
   */
  async findOne(
    search?: MenuSearch,
  ): Promise<MenuModel> {
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
   * @return {Promise<MenuModel>}
   * @memberof MenuDao
   */
  async findById(
    id: string,
  ): Promise<MenuModel> {
    const t = this;
    if (!id) return;
    const model = await t.findOne({ id });
    return model;
  }
  
  /**
   * 根据搜索条件判断数据是否存在
   * @param {MenuSearch} [search]
   * @return {Promise<boolean>} 
   * @memberof MenuDao
   */
  async exist(
    search?: MenuSearch,
  ): Promise<boolean> {
    const t = this;
    const model = await t.findOne(search);
    const exist = !!model;
    return exist;
  }
  
  /**
   * 根据id判断数据是否存在
   * @param {string} id
   * @memberof MenuDao
   */
  async existById(
    id: string,
  ): Promise<boolean> {
    const t = this;
    const table = "menu";
    const method = "existById";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { id });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!id) {
      return false;
    }
    
    const context = useContext();
    let sql = `
      select 1 e from menu where id = ? limit 1
    `;
    let args = [ id ];
    
    const cacheKey1 = `dao.sql.${ table }`;
    const cacheKey2 = JSON.stringify({ sql, args });
    
    let model = await context.queryOne<{
      e: number,
    }>(sql, args, { cacheKey1, cacheKey2 });
    let result = model?.e === 1;
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { id, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 创建数据
   * @param {MenuModel} model
   * @return {Promise<ResultSetHeader>} 
   * @memberof MenuDao
   */
  async create(
    model: MenuModel,
  ): Promise<ResultSetHeader> {
    const t = this;
    if (!model) {
      return;
    }
    const table = "menu";
    const method = "create";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { model });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    const context = useContext();
    const args = [ ];
    let sql = `
      insert into menu(
        id
        ,create_time
    `;
    if (context.getUsr_id() !== undefined) {
      sql += `,create_usr_id`;
    }
    if (model.type !== undefined) {
      sql += `,type`;
    }
    if (model.menu_id !== undefined) {
      sql += `,menu_id`;
    }
    if (model.lbl !== undefined) {
      sql += `,lbl`;
    }
    if (model.route_path !== undefined) {
      sql += `,route_path`;
    }
    if (model.route_query !== undefined) {
      sql += `,route_query`;
    }
    if (model.is_enabled !== undefined) {
      sql += `,is_enabled`;
    }
    if (model.order_by !== undefined) {
      sql += `,order_by`;
    }
    if (model.rem !== undefined) {
      sql += `,rem`;
    }
    sql += `) values(?,?`;
    args.push(model.id);
    args.push(context.getReqDate());
    if (context.getUsr_id() !== undefined) {
      sql += `,?`;
      args.push(context.getUsr_id());
    }
    if (model.type !== undefined) {
      sql += `,?`;
      args.push(model.type);
    }
    if (model.menu_id !== undefined) {
      sql += `,?`;
      args.push(model.menu_id);
    }
    if (model.lbl !== undefined) {
      sql += `,?`;
      args.push(model.lbl);
    }
    if (model.route_path !== undefined) {
      sql += `,?`;
      args.push(model.route_path);
    }
    if (model.route_query !== undefined) {
      sql += `,?`;
      args.push(model.route_query);
    }
    if (model.is_enabled !== undefined) {
      sql += `,?`;
      args.push(model.is_enabled);
    }
    if (model.order_by !== undefined) {
      sql += `,?`;
      args.push(model.order_by);
    }
    if (model.rem !== undefined) {
      sql += `,?`;
      args.push(model.rem);
    }
    sql += `)`;
    
    await t.delCache();
    
    let result = await context.execute(sql, args);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { model, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 删除缓存
   * @memberof MenuDao
   */
  async delCache() {
    const table = "menu";
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
   * 根据id修改数据
   * @param {string} id
   * @param {MenuModel} model
   * @return {Promise<ResultSetHeader>}
   * @memberof MenuDao
   */
  async updateById(
    id: string,
    model: MenuModel,
  ): Promise<ResultSetHeader> {
    const t = this;
    
    const table = "menu";
    const method = "updateById";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { id, model });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!id || !model) {
      return;
    }
    const context = useContext();
    const args = [ ];
    let sql = `
      update menu set update_time = ?
    `;
    args.push(context.getReqDate());
    if (context.getUsr_id() !== undefined) {
      sql += `,update_usr_id = ?`;
      args.push(context.getUsr_id());
    }
    if (model.type !== undefined) {
      sql += `,type = ?`;
      args.push(model.type);
    }
    if (model.menu_id !== undefined) {
      sql += `,menu_id = ?`;
      args.push(model.menu_id);
    }
    if (model.lbl !== undefined) {
      sql += `,lbl = ?`;
      args.push(model.lbl);
    }
    if (model.route_path !== undefined) {
      sql += `,route_path = ?`;
      args.push(model.route_path);
    }
    if (model.route_query !== undefined) {
      sql += `,route_query = ?`;
      args.push(model.route_query);
    }
    if (model.is_enabled !== undefined) {
      sql += `,is_enabled = ?`;
      args.push(model.is_enabled);
    }
    if (model.order_by !== undefined) {
      sql += `,order_by = ?`;
      args.push(model.order_by);
    }
    if (model.rem !== undefined) {
      sql += `,rem = ?`;
      args.push(model.rem);
    }
    sql += ` where id = ? limit 1`;
    args.push(id);
    
    await t.delCache();
    
    let result = await context.execute(sql, args);
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { id, model, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 根据id删除数据
   * @param {string} id
   * @return {Promise<number>}
   * @memberof MenuDao
   */
  async deleteByIds(
    ids: string[],
  ): Promise<number> {
    const t = this;
    
    const table = "menu";
    const method = "deleteByIds";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { ids });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!ids || !ids.length) {
      return 0;
    }
    
    const context = useContext();
    
    let num = 0;
    let sql = `
      update menu set is_deleted = 1,delete_time = ? where id = ? limit 1
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
   * 根据id列表还原数据
   * @param {string[]} ids
   * @return {Promise<number>}
   * @memberof MenuDao
   */
  async revertByIds(
    ids: string[],
  ): Promise<number> {
    const t = this;
    
    const table = "menu";
    const method = "create";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { ids });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!ids || !ids.length) {
      return 0;
    }
    
    const context = useContext();
    
    let num = 0;
    let sql = `
      update menu set is_deleted = 0 where id = ? limit 1
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
    
  /**
   * 查找order_by字段的最大值
   * @param {Context} context
   * @return {*}  {Promise<number>}
   * @memberof MenuDao
   */
  async findLastOrderBy(): Promise<number> {
    const t = this;
    
    const table = "menu";
    const method = "findLastOrderBy";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    const context = useContext();
    let sql = `
      select
        t.order_by order_by
      from menu t
    `;
    const whereQuery = [ ];
    let args = [ ];
    if (whereQuery.length > 0) {
      sql += " where " + whereQuery.join(" and ");
    }
    sql += `
      order by
        t.order_by desc
      limit 1
    `;
    
    let model = await context.queryOne<{
      order_by: number,
    }>(sql, args);
    let result = model?.order_by || 1;
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
}
