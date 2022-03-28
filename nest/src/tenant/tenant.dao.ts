import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ResultSetHeader } from "mysql2/promise";
import { useContext } from "../common/interceptors/context.interceptor";
import { PageModel } from "../common/page.model";
import { isEmpty, sqlLike } from "../common/util/StringUitl";
import { many2manyUpdate, setModelIds } from "../common/util/DaoUtil";
import { TenantModel, TenantSearch } from "./tenant.model";

@Injectable()
export class TenantDao {
  
  constructor(
    private readonly eventEmitter2: EventEmitter2,
  ) { }
  
  private getWhereQuery(
    args: any[],
    search?: TenantSearch,
  ) {
    const context = useContext();
    let whereQuery = "";
    whereQuery += ` t.is_deleted = ?`;
    args.push(search?.is_deleted == null ? 0 : search.is_deleted);
    if (!isEmpty(search?.id)) {
      whereQuery += ` and t.id = ?`;
      args.push(search.id);
    }
    if (search?.lbl !== undefined) {
      whereQuery += ` and t.lbl = ?`;
      args.push(search.lbl);
    }
    if (!isEmpty(search?.lblLike)) {
      whereQuery += ` and t.lbl like ?`;
      args.push(sqlLike(search.lblLike) + "%");
    }
    if (search?.host !== undefined) {
      whereQuery += ` and t.host = ?`;
      args.push(search.host);
    }
    if (!isEmpty(search?.hostLike)) {
      whereQuery += ` and t.host like ?`;
      args.push(sqlLike(search.hostLike) + "%");
    }
    if (!isEmpty(search?.expiration)) {
      whereQuery += ` and t.expiration = ?`;
      args.push(search.expiration);
    }
    if (!isEmpty(search?.expirationGt)) {
      whereQuery += ` and t.expiration > ?`;
      args.push(search.expirationGt);
    }
    if (!isEmpty(search?.expirationLt)) {
      whereQuery += ` and t.expiration < ?`;
      args.push(search.expirationLt);
    }
    if (!isEmpty(search?.expirationGtEq)) {
      whereQuery += ` and t.expiration >= ?`;
      args.push(search.expirationGtEq);
    }
    if (!isEmpty(search?.expirationLtEq)) {
      whereQuery += ` and t.expiration <= ?`;
      args.push(search.expirationLtEq);
    }
    if (!isEmpty(search?.max_usr_num)) {
      whereQuery += ` and t.max_usr_num = ?`;
      args.push(search.max_usr_num);
    }
    if (!isEmpty(search?.max_usr_numGt)) {
      whereQuery += ` and t.max_usr_num > ?`;
      args.push(search.max_usr_numGt);
    }
    if (!isEmpty(search?.max_usr_numLt)) {
      whereQuery += ` and t.max_usr_num < ?`;
      args.push(search.max_usr_numLt);
    }
    if (!isEmpty(search?.max_usr_numGtEq)) {
      whereQuery += ` and t.max_usr_num >= ?`;
      args.push(search.max_usr_numGtEq);
    }
    if (!isEmpty(search?.max_usr_numLtEq)) {
      whereQuery += ` and t.max_usr_num <= ?`;
      args.push(search.max_usr_numLtEq);
    }
    if (search?.is_enabled && search?.is_enabled?.length > 0) {
      whereQuery += ` and t.is_enabled in (?)`;
      args.push(search.is_enabled);
    }
    if (search?.menu_ids && search?.menu_ids.length > 0) {
      whereQuery += ` and t.menu_ids in (?)`;
      args.push(search.menu_ids);
    }
    if (search?.menu__lbl && search.menu__lbl?.length > 0) {
      whereQuery += ` and menu__lbl in (?)`;
      args.push(search.menu__lbl);
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
   * @param {TenantSearch} [search]
   * @return {Promise<number>}
   * @memberof TenantDao
   */
  async findCount(
    search?: TenantSearch,
  ): Promise<number> {
    const t = this;
    
    const table = "tenant";
    const method = "findCount";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    const context = useContext();
    const args = [ ];
    let sql = `
      select
        count(1) total
      from tenant t
        left join tenant_menu
          on tenant_menu.tenant_id = t.id and tenant_menu.is_deleted = 0
        left join menu
          on tenant_menu.menu_id = menu.id and menu.is_deleted = 0
        left join (
          select
            json_arrayagg(menu.id) menu_ids,
            json_arrayagg(menu.lbl) _menu_ids,
            tenant.id tenant_id
          from tenant_menu
          inner join menu
            on menu.id = tenant_menu.menu_id
            and menu.is_deleted = 0
          inner join tenant
            on tenant.id = tenant_menu.tenant_id
            and tenant.is_deleted = 0
          where
            tenant_menu.is_deleted = 0
          group by tenant_id
        ) _menu
          on _menu.tenant_id = t.id
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
   * @param {TenantSearch} search 搜索条件
   * @memberof TenantDao
   */
  async findAll(
    search?: TenantSearch,
    pageModel?: PageModel,
  ) {
    const t = this;
    
    const table = "tenant";
    const method = "findAll";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { search });
    if (beforeEvent?.isReturn) return <typeof result>beforeEvent.data;
    
    const context = useContext();
    const args = [ ];
    let sql = `
      select t.*
          ,max(menu_ids) menu_ids
          ,max(_menu_ids) _menu_ids
      from tenant t
        left join tenant_menu
          on tenant_menu.tenant_id = t.id
          and tenant_menu.is_deleted = 0
        left join menu
          on tenant_menu.menu_id = menu.id
          and menu.is_deleted = 0
        left join (
          select
            json_arrayagg(menu.id) menu_ids,
            json_arrayagg(menu.lbl) _menu_ids,
            tenant.id tenant_id
          from tenant_menu
          inner join menu
            on menu.id = tenant_menu.menu_id
            and menu.is_deleted = 0
          inner join tenant
            on tenant.id = tenant_menu.tenant_id
            and tenant.is_deleted = 0
          where
            tenant_menu.is_deleted = 0
          group by tenant_id
        ) _menu
          on _menu.tenant_id = t.id
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
    
    let result = await context.query<TenantModel>(sql, args, { cacheKey1, cacheKey2 });
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
   * 根据条件查找第一条数据
   * @param {TenantSearch} [search]
   * @return {Promise<TenantModel>} 
   * @memberof TenantDao
   */
  async findOne(
    search?: TenantSearch,
  ): Promise<TenantModel> {
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
   * @return {Promise<TenantModel>}
   * @memberof TenantDao
   */
  async findById(
    id: string,
  ): Promise<TenantModel> {
    const t = this;
    if (!id) return;
    const model = await t.findOne({ id });
    return model;
  }
  
  /**
   * 根据搜索条件判断数据是否存在
   * @param {TenantSearch} [search]
   * @return {Promise<boolean>} 
   * @memberof TenantDao
   */
  async exist(
    search?: TenantSearch,
  ): Promise<boolean> {
    const t = this;
    const model = await t.findOne(search);
    const exist = !!model;
    return exist;
  }
  
  /**
   * 根据id判断数据是否存在
   * @param {string} id
   * @memberof TenantDao
   */
  async existById(
    id: string,
  ): Promise<boolean> {
    const t = this;
    const table = "tenant";
    const method = "existById";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { id });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!id) {
      return false;
    }
    
    const context = useContext();
    let sql = `
      select 1 e from tenant where id = ? limit 1
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
   * @param {TenantModel} model
   * @return {Promise<ResultSetHeader>} 
   * @memberof TenantDao
   */
  async create(
    model: TenantModel,
  ): Promise<ResultSetHeader> {
    const t = this;
    if (!model) {
      return;
    }
    const table = "tenant";
    const method = "create";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { model });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    const context = useContext();
    const args = [ ];
    let sql = `
      insert into tenant(
        id
        ,create_time
    `;
    if (context.getUsr_id() !== undefined) {
      sql += `,create_usr_id`;
    }
    if (model.lbl !== undefined) {
      sql += `,lbl`;
    }
    if (model.host !== undefined) {
      sql += `,host`;
    }
    if (model.expiration !== undefined) {
      sql += `,expiration`;
    }
    if (model.max_usr_num !== undefined) {
      sql += `,max_usr_num`;
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
    if (model.lbl !== undefined) {
      sql += `,?`;
      args.push(model.lbl);
    }
    if (model.host !== undefined) {
      sql += `,?`;
      args.push(model.host);
    }
    if (model.expiration !== undefined) {
      sql += `,?`;
      args.push(model.expiration);
    }
    if (model.max_usr_num !== undefined) {
      sql += `,?`;
      args.push(model.max_usr_num);
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
    // 菜单
    await many2manyUpdate(model, "menu_ids", { table: "tenant_menu", column1: "tenant_id", column2: "menu_id" });
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { model, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 删除缓存
   * @memberof MenuDao
   */
  async delCache() {
    const table = "tenant";
    const method = "delCache";
    const context = useContext();
    const cacheKey1 = `dao.sql.${ table }`;
    await context.delCache(cacheKey1);
    const foreignTables: string[] = [
      "tenant_menu",
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
   * @param {TenantModel} model
   * @return {Promise<ResultSetHeader>}
   * @memberof TenantDao
   */
  async updateById(
    id: string,
    model: TenantModel,
  ): Promise<ResultSetHeader> {
    const t = this;
    
    const table = "tenant";
    const method = "updateById";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { id, model });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!id || !model) {
      return;
    }
    const context = useContext();
    const args = [ ];
    let sql = `
      update tenant set update_time = ?
    `;
    args.push(context.getReqDate());
    if (context.getUsr_id() !== undefined) {
      sql += `,update_usr_id = ?`;
      args.push(context.getUsr_id());
    }
    if (model.lbl !== undefined) {
      sql += `,lbl = ?`;
      args.push(model.lbl);
    }
    if (model.host !== undefined) {
      sql += `,host = ?`;
      args.push(model.host);
    }
    if (model.expiration !== undefined) {
      sql += `,expiration = ?`;
      args.push(model.expiration);
    }
    if (model.max_usr_num !== undefined) {
      sql += `,max_usr_num = ?`;
      args.push(model.max_usr_num);
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
    // 菜单
    await many2manyUpdate(model, "menu_ids", { table: "tenant_menu", column1: "tenant_id", column2: "menu_id" });
    
    const [ afterEvent ] = await t.eventEmitter2.emitAsync(`dao.after.sql.${ method }.${ table }`, { id, model, result });
    if (afterEvent?.isReturn) return afterEvent.data;
    
    return result;
  }
  
  /**
   * 根据id删除数据
   * @param {string} id
   * @return {Promise<number>}
   * @memberof TenantDao
   */
  async deleteByIds(
    ids: string[],
  ): Promise<number> {
    const t = this;
    
    const table = "tenant";
    const method = "deleteByIds";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { ids });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!ids || !ids.length) {
      return 0;
    }
    
    const context = useContext();
    
    let num = 0;
    let sql = `
      update tenant set is_deleted = 1,delete_time = ? where id = ? limit 1
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
   * @memberof TenantDao
   */
  async revertByIds(
    ids: string[],
  ): Promise<number> {
    const t = this;
    
    const table = "tenant";
    const method = "create";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { ids });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    if (!ids || !ids.length) {
      return 0;
    }
    
    const context = useContext();
    
    let num = 0;
    let sql = `
      update tenant set is_deleted = 0 where id = ? limit 1
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
   * @memberof TenantDao
   */
  async findLastOrderBy(): Promise<number> {
    const t = this;
    
    const table = "tenant";
    const method = "findLastOrderBy";
    
    const [ beforeEvent ] = await t.eventEmitter2.emitAsync(`dao.before.sql.${ method }.${ table }`, { });
    if (beforeEvent?.isReturn) return beforeEvent.data;
    
    const context = useContext();
    let sql = `
      select
        t.order_by order_by
      from tenant t
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
